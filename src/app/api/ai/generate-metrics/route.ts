import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { section, rating, role, task } = await request.json();
    
    // Validate required parameters
    if (!section || !rating || !role) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required parameters. Section, rating, and role are all required.' 
        },
        { status: 400 }
      );
    }
    
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get rating information from the database
    let ratingInfo = null;
    let parentRatingInfo = null;
    
    // Get the specific rating information
    const { data, error } = await supabase
      .from('navy_ratings')
      .select('name, description, keywords, common_achievements, parent_rating, service_rating, is_variation')
      .eq('abbreviation', rating)
      .single();
    
    if (!error && data) {
      ratingInfo = data;
      
      // If this is a variation, get the parent rating information
      if (data.is_variation && data.parent_rating) {
        const { data: parentData, error: parentError } = await supabase
          .from('navy_ratings')
          .select('name, description, keywords, common_achievements')
          .eq('abbreviation', data.parent_rating)
          .single();
        
        if (!parentError && parentData) {
          parentRatingInfo = parentData;
        }
      }
    }
    
    // Build a system prompt that includes rating and role information
    let systemPrompt = "You are an expert in Navy evaluation writing. Your task is to generate specific, measurable metrics for Navy evaluation bullet points. Each metric should be quantifiable, relevant to the rating and role, and appropriate for the evaluation section.";
    
    if (ratingInfo) {
      if (ratingInfo.is_variation && parentRatingInfo) {
        // For variations, use both the parent and variation information
        systemPrompt += `\n\nYou are generating metrics for a ${ratingInfo.name} (${rating}), which is a ${ratingInfo.service_rating} specialization of the ${parentRatingInfo.name} rating.`;
        systemPrompt += `\n\nHere's information about this rating:\n${parentRatingInfo.description}`;
        
        // Combine keywords and achievements from both parent and variation
        const combinedKeywords = Array.from(new Set([...(parentRatingInfo.keywords || []), ...(ratingInfo.keywords || [])]));
        const combinedAchievements = Array.from(new Set([...(parentRatingInfo.common_achievements || []), ...(ratingInfo.common_achievements || [])]));
        
        systemPrompt += `\n\nCommon keywords for this rating: ${combinedKeywords.join(', ')}`;
        systemPrompt += `\n\nTypical achievements for this rating include: ${combinedAchievements.join(', ')}`;
        systemPrompt += `\n\nAs a ${ratingInfo.service_rating} specialist, focus on achievements related to this specific service area.`;
      } else {
        // For non-variations, just use the rating information
        systemPrompt += `\n\nYou are generating metrics for a ${ratingInfo.name} (${rating}). Here's information about this rating:\n${ratingInfo.description}\n\nCommon keywords for this rating: ${(ratingInfo.keywords || []).join(', ')}\n\nTypical achievements for this rating include: ${(ratingInfo.common_achievements || []).join(', ')}`;
      }
    } else {
      systemPrompt += `\n\nYou are generating metrics for a sailor with the rating ${rating}. No additional information about this rating is available.`;
    }
    
    systemPrompt += `\n\nThe sailor's role/billet is: ${role}. Tailor the metrics to be relevant to this specific role.`;
    systemPrompt += `\n\nThese metrics are for the "${section}" section of the evaluation. Focus on generating metrics relevant to this area.`;
    
    // Add specific instructions based on the section
    switch (section) {
      case 'professional':
        systemPrompt += `\n\nFor the Professional Knowledge section, focus on metrics related to technical expertise, certifications, training, and job-specific knowledge.`;
        break;
      case 'quality':
        systemPrompt += `\n\nFor the Quality of Work section, focus on metrics related to accuracy, attention to detail, efficiency, and work output.`;
        break;
      case 'leadership':
        systemPrompt += `\n\nFor the Leadership section, focus on metrics related to personnel management, mentoring, guidance, and leadership initiatives.`;
        break;
      case 'military':
        systemPrompt += `\n\nFor the Military Bearing section, focus on metrics related to physical fitness, uniform standards, military appearance, and adherence to regulations.`;
        break;
      case 'teamwork':
        systemPrompt += `\n\nFor the Teamwork section, focus on metrics related to collaboration, supporting others, and contributing to team success.`;
        break;
      case 'accomplishment':
        systemPrompt += `\n\nFor the Job Accomplishment section, focus on metrics related to specific achievements, projects completed, and contributions to the mission.`;
        break;
      case 'climate':
        systemPrompt += `\n\nFor the Command/Organizational Climate section, focus on metrics related to diversity, inclusion, and creating a positive work environment.`;
        break;
      // Add other sections as needed
    }
    
    // Add formatting instructions
    systemPrompt += `\n\nGenerate 4-6 specific metrics. Each metric should:
    1. Include placeholder symbols (##) where numbers would go
    2. Be specific to the ${rating} rating and ${role} role
    3. Be relevant to the ${section} section
    4. Be measurable and quantifiable
    5. Use appropriate Navy terminology
    6. Be formatted as a single line (no bullet points or numbering)`;
    
    // Use Claude to generate metrics
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Generate metrics for a ${rating} (${role}) in the ${section} section of a Navy evaluation. These should be specific, measurable achievements that would be appropriate for this rating and role.`
        }
      ],
    });
    
    // Extract the metrics from the response
    const metricsText = response.content[0].type === 'text'
      ? response.content[0].text
      : 'Unable to generate metrics';
    
    // Split the text into individual metrics
    const metrics = metricsText
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.trim().replace(/^[-*•]\s*/, '')); // Remove any bullet point characters
    
    return NextResponse.json({
      success: true,
      data: {
        summary: metrics.join('\n')
      }
    });
  } catch (error) {
    console.error('Error generating metrics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}