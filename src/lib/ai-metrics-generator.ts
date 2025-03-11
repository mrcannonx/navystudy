import { makeAIRequest } from './ai-client';
import { ContentType } from './types';

/**
 * Generates metrics using AI based on the evaluation section, rating, and role
 */
export async function generateMetricsWithAI(
  section: string,
  rating: string,
  role: string
): Promise<string[]> {
  try {
    console.log(`Generating metrics with AI for section: ${section}, rating: ${rating}, role: ${role}`);
    
    // Make the actual API call instead of using fallback metrics
    const response = await makeAIRequest(
      JSON.stringify({
        section,
        rating,
        role,
        task: 'generate_metrics'
      }),
      'summary' as ContentType, // Use 'summary' type as it's compatible with the API
      undefined,
      undefined
    );
    
    if (!response.success || !response.data) {
      console.error('AI request failed or returned no data:', response);
      throw new Error('Failed to generate metrics');
    }
    
    // Parse the metrics from the response
    const metricsText = response.data.summary || '';
    const metrics = metricsText
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.trim());
    
    console.log(`Generated ${metrics.length} metrics from AI`);
    
    // Return the AI-generated metrics
    return metrics;
  } catch (error) {
    console.error('Error in generateMetricsWithAI:', error);
    
    // Fallback to sample metrics if AI request fails
    return getFallbackMetrics(section, rating, role);
  }
}

/**
 * Provides fallback metrics based on section, rating, and role
 * Used when the AI service is unavailable
 */
function getFallbackMetrics(
  section: string,
  rating: string,
  role: string
): string[] {
  // Professional Knowledge section
  if (section === 'professional') {
    if (rating.includes('Exceeds')) {
      return [
        "Recognized as SME by ## departments",
        "Achieved ##% higher than standard on technical assessments",
        "Resolved ## complex technical issues others couldn't solve",
        "Maintained ## critical certifications with distinction"
      ];
    } else if (rating.includes('Meets')) {
      return [
        "##% system uptime maintained",
        "## technical certifications current",
        "Resolved ## technical issues within SLA",
        "Completed ## technical training courses"
      ];
    } else {
      return [
        "## basic certifications maintained",
        "Completed ## required training modules",
        "Resolved ## routine technical issues",
        "Achieved ##% completion of technical requirements"
      ];
    }
  }
  
  // Quality of Work section
  if (section === 'quality') {
    if (rating.includes('Exceeds')) {
      return [
        "Achieved ##% accuracy rate, exceeding department average by ##%",
        "Completed ## complex tasks with zero errors",
        "Reduced processing time by ##% through innovative solutions",
        "Received ## commendations for exceptional work quality"
      ];
    } else if (rating.includes('Meets')) {
      return [
        "Maintained ##% accuracy rate on all assignments",
        "Completed ## tasks on time and within standards",
        "Achieved ##% quality assurance pass rate",
        "Processed ## items with standard error rate below ##%"
      ];
    } else {
      return [
        "Completed ## basic tasks with supervision",
        "Achieved ##% accuracy on routine assignments",
        "Met minimum standards on ## assignments",
        "Completed ## required quality training modules"
      ];
    }
  }
  
  // Command/Organizational Climate section
  if (section === 'climate') {
    if (rating.includes('Exceeds')) {
      return [
        "Led ## diversity initiatives with measurable positive outcomes",
        "Organized ## team-building events with ##% participation",
        "Mentored ## diverse team members, with ## advancing to higher positions",
        "Received ## recognitions for promoting inclusive environment"
      ];
    } else if (rating.includes('Meets')) {
      return [
        "Participated in ## command climate initiatives",
        "Supported ## diversity and inclusion programs",
        "Maintained positive relationships with ## team members",
        "Completed ## hours of EO/diversity training"
      ];
    } else {
      return [
        "Attended ## required climate training sessions",
        "Participated in ## command-directed climate activities",
        "Completed ## EO/diversity awareness modules",
        "Maintained basic professional relationships with team members"
      ];
    }
  }
  
  // Military Bearing section
  if (section === 'military') {
    if (rating.includes('Exceeds')) {
      return [
        "Scored 'Outstanding' on ## consecutive PFAs",
        "Selected for ## special ceremonial duties due to exemplary bearing",
        "Received ## uniform excellence recognitions",
        "Led ## command PT sessions with average improvement of ##%"
      ];
    } else if (rating.includes('Meets')) {
      return [
        "Maintained 'Good' or better on ## PFA cycles",
        "Passed ## uniform inspections with zero discrepancies",
        "Completed ## GMT modules with 100% score",
        "Maintained appropriate military bearing in ## official functions"
      ];
    } else {
      return [
        "Completed ## remedial PT sessions",
        "Passed minimum standards on ## uniform inspections",
        "Completed required GMT with passing scores",
        "Maintained basic military appearance standards"
      ];
    }
  }
  
  // Personal Job Accomplishment section
  if (section === 'accomplishment') {
    if (rating.includes('Exceeds')) {
      return [
        "Implemented ## process improvements saving ## hours monthly",
        "Completed ## high-visibility projects ahead of deadline",
        "Volunteered ## hours for command initiatives beyond regular duties",
        "Achieved ##% improvement in departmental metrics through personal initiatives"
      ];
    } else if (rating.includes('Meets')) {
      return [
        "Completed ## assigned projects on schedule",
        "Volunteered ## hours for command functions",
        "Implemented ## minor process improvements",
        "Achieved ##% of personal qualification goals"
      ];
    } else {
      return [
        "Completed ## basic assigned tasks",
        "Participated in ## command-directed activities",
        "Met minimum requirements for ## job functions",
        "Completed ## required qualification elements"
      ];
    }
  }
  
  // Teamwork section
  if (section === 'teamwork') {
    if (rating.includes('Exceeds')) {
      return [
        "Led ## cross-functional teams to successful project completion",
        "Collaborated with ## departments to solve complex problems",
        "Initiated ## team-building activities improving cohesion by ##%",
        "Recognized ## times for exceptional team contributions"
      ];
    } else if (rating.includes('Meets')) {
      return [
        "Participated effectively in ## team projects",
        "Collaborated with ## colleagues on routine assignments",
        "Supported ## cross-departmental initiatives",
        "Maintained positive working relationships with ## team members"
      ];
    } else {
      return [
        "Participated in ## team activities when directed",
        "Completed ## assigned team tasks with supervision",
        "Attended ## team meetings and training sessions",
        "Maintained basic working relationships with immediate team"
      ];
    }
  }
  
  // Leadership section
  if (section === 'leadership') {
    if (rating.includes('Exceeds')) {
      return [
        "Led team of ## personnel achieving ##% improvement in key metrics",
        "Mentored ## junior members with ## achieving accelerated advancement",
        "Directed ## high-visibility projects with exceptional outcomes",
        "Developed ## future leaders through targeted development plans"
      ];
    } else if (rating.includes('Meets')) {
      return [
        "Supervised ## personnel in daily operations",
        "Led ## routine projects to successful completion",
        "Mentored ## junior personnel in technical skills",
        "Maintained ##% qualification rate among team members"
      ];
    } else {
      return [
        "Supervised ## personnel with senior guidance",
        "Led ## basic team evolutions under supervision",
        "Completed ## leadership training modules",
        "Developing basic leadership skills through ## structured opportunities"
      ];
    }
  }
  
  // Default fallback for any other section
  return [
    `## ${section} tasks completed`,
    `##% ${section} requirements met`,
    `## ${section} improvements implemented`,
    `## hours dedicated to ${section} development`
  ];
}