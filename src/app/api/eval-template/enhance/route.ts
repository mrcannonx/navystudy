import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { content, section, rating, role } = await request.json()
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get rating information from the database if available
    let ratingInfo = null
    let parentRatingInfo = null
    
    if (rating) {
      // Get the specific rating information
      const { data, error } = await supabase
        .from('navy_ratings')
        .select('name, description, keywords, common_achievements, parent_rating, service_rating, is_variation')
        .eq('abbreviation', rating)
        .single()
      
      if (!error && data) {
        ratingInfo = data
        
        // If this is a variation, get the parent rating information
        if (data.is_variation && data.parent_rating) {
          const { data: parentData, error: parentError } = await supabase
            .from('navy_ratings')
            .select('name, description, keywords, common_achievements')
            .eq('abbreviation', data.parent_rating)
            .single()
          
          if (!parentError && parentData) {
            parentRatingInfo = parentData
          }
        }
      }
    }
    
    // Build a system prompt that includes rating and role information
    let systemPrompt = "You are an expert in Navy evaluation writing. Your task is to enhance evaluation bullet points by adding specific metrics, strengthening action verbs, and including quantifiable achievements. Make the text more impactful while maintaining accuracy and military writing style."
    
    if (ratingInfo) {
      if (ratingInfo.is_variation && parentRatingInfo) {
        // For variations, use both the parent and variation information
        systemPrompt += `\n\nYou are enhancing content for a ${ratingInfo.name} (${rating}), which is a ${ratingInfo.service_rating} specialization of the ${parentRatingInfo.name} rating.`
        systemPrompt += `\n\nHere's information about this rating:\n${parentRatingInfo.description}`
        
        // Combine keywords and achievements from both parent and variation
        const combinedKeywords = Array.from(new Set([...parentRatingInfo.keywords, ...ratingInfo.keywords]))
        const combinedAchievements = Array.from(new Set([...parentRatingInfo.common_achievements, ...ratingInfo.common_achievements]))
        
        systemPrompt += `\n\nCommon keywords for this rating: ${combinedKeywords.join(', ')}`
        systemPrompt += `\n\nTypical achievements for this rating include: ${combinedAchievements.join(', ')}`
        systemPrompt += `\n\nAs a ${ratingInfo.service_rating} specialist, focus on achievements related to this specific service area.`
      } else {
        // For non-variations, just use the rating information
        systemPrompt += `\n\nYou are enhancing content for a ${ratingInfo.name} (${rating}). Here's information about this rating:\n${ratingInfo.description}\n\nCommon keywords for this rating: ${ratingInfo.keywords.join(', ')}\n\nTypical achievements for this rating include: ${ratingInfo.common_achievements.join(', ')}`
      }
    }
    
    if (role) {
      systemPrompt += `\n\nThe sailor's role/billet is: ${role}. Tailor the enhancement to be relevant to this specific role.`
    }
    
    if (section) {
      systemPrompt += `\n\nThis content is for the "${section}" section of the evaluation. Focus on enhancing aspects relevant to this area.`
    }
    
    // Use Claude Sonnet 3.7 to enhance the evaluation content
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229", // Using Claude Sonnet 3.7
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Enhance the following Navy evaluation bullet point with more specific metrics, stronger action verbs, and quantifiable achievements. Make it more impactful while maintaining accuracy and military writing style appropriate for a ${rating || ''} ${role ? `with the role of ${role}` : ''}:

${content}`
        }
      ],
    });

    // Extract the enhanced content from the response
    const enhancedContent = response.content[0].type === 'text'
      ? response.content[0].text
      : 'Unable to generate enhanced content';
    
    return NextResponse.json({
      success: true,
      enhancedContent
    })
  } catch (error) {
    console.error('Error enhancing evaluation content:', error)
    return NextResponse.json(
      { error: 'Failed to enhance content' },
      { status: 500 }
    )
  }
}