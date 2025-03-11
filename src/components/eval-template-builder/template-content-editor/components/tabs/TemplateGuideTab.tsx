import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { TabProps } from '../../types';

// Section-specific guidance
const sectionGuidance = {
  professional: {
    title: "Tips for Professional Knowledge",
    tips: [
      "Demonstrate technical expertise in your rating's core competencies",
      "Highlight certifications, qualifications, and specialized training",
      "Showcase knowledge application that improved mission readiness",
      "Emphasize mastery of systems, equipment, and procedures",
      "Include examples of knowledge sharing and technical mentorship"
    ]
  },
  quality: {
    title: "Tips for Quality of Work",
    tips: [
      "Emphasize work that required minimal supervision",
      "Highlight consistent delivery of error-free products",
      "Demonstrate efficient resource utilization and management",
      "Showcase attention to detail and thoroughness in execution",
      "Include examples of work that exceeded quality standards"
    ]
  },
  climate: {
    title: "Tips for Command Climate/EO",
    tips: [
      "Highlight contributions to an inclusive work environment",
      "Demonstrate support for diversity initiatives and programs",
      "Showcase actions that improved unit cohesion and morale",
      "Include examples of conflict resolution and team building",
      "Emphasize promotion of dignity and respect in the workplace"
    ]
  },
  military: {
    title: "Tips for Military Bearing/Character",
    tips: [
      "Highlight exemplary uniform appearance and personal standards",
      "Showcase adherence to military customs and courtesies",
      "Demonstrate integrity and ethical decision-making",
      "Include examples of physical fitness achievements",
      "Emphasize professional conduct in high-pressure situations"
    ]
  },
  accomplishment: {
    title: "Tips for Job Accomplishment/Initiative",
    tips: [
      "Highlight self-directed achievements beyond assigned duties",
      "Showcase innovative solutions to operational challenges",
      "Demonstrate proactive identification of improvement opportunities",
      "Include examples of personal and professional development",
      "Emphasize measurable impacts of your initiatives"
    ]
  },
  teamwork: {
    title: "Tips for Teamwork",
    tips: [
      "Highlight contributions to collaborative projects and efforts",
      "Showcase support provided to team members and other departments",
      "Demonstrate ability to work effectively in diverse groups",
      "Include examples of conflict resolution and consensus building",
      "Emphasize willingness to share knowledge and assist others"
    ]
  },
  leadership: {
    title: "Tips for Leadership",
    tips: [
      "Highlight effective direction and guidance provided to others",
      "Showcase development and mentorship of subordinates",
      "Demonstrate decision-making abilities in challenging situations",
      "Include examples of inspiring others to achieve goals",
      "Emphasize accountability and responsibility for team outcomes"
    ]
  }
};

// Default guidance if no section is selected
const defaultGuidance = {
  title: "General Writing Tips",
  tips: [
    "Focus on specific achievements with measurable results",
    "Use action verbs and quantify impact where possible",
    "Highlight leadership and technical skills relevant to your rating",
    "Include metrics: numbers, percentages, dollar values",
    "Demonstrate growth and improvement in your role"
  ]
};

export const TemplateGuideTab: React.FC<TabProps> = ({
  activeSection,
  sections
}) => {
  // Get the appropriate guidance based on active section
  const guidance = activeSection && sectionGuidance[activeSection] 
    ? sectionGuidance[activeSection] 
    : defaultGuidance;
  
  // Get section title for display
  const sectionTitle = activeSection && sections[activeSection]
    ? sections[activeSection].title
    : 'Current Section';

  return (
    <Card className="bg-white dark:bg-slate-950 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Writing Guide</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-3">{guidance.title}</h3>
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md border border-slate-200 dark:border-slate-800">
          <ul className="list-disc pl-5 space-y-3">
            {guidance.tips.map((tip, index) => (
              <li key={index} className="text-slate-700 dark:text-slate-300">{tip}</li>
            ))}
          </ul>
        </div>
        
        {activeSection === 'professional' && (
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2">Professional Knowledge Rating Scale</h4>
            <div className="flex flex-col space-y-4 mt-3">
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-md border border-red-200 dark:border-red-900">
                <h5 className="font-medium text-red-800 dark:text-red-400 mb-2">1.0 Below Standards</h5>
                <ul className="list-disc pl-5 text-sm text-red-700 dark:text-red-300 space-y-2">
                  <li>Limited knowledge of rating specialty or job</li>
                  <li>Struggles to apply knowledge to routine problems</li>
                  <li>Does not meet advancement/PQS requirements</li>
                </ul>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-900">
                <h5 className="font-medium text-amber-800 dark:text-amber-400 mb-2">3.0 Meets Standards</h5>
                <ul className="list-disc pl-5 text-sm text-amber-700 dark:text-amber-300 space-y-2">
                  <li>Solid working knowledge of rating specialty and job</li>
                  <li>Effectively applies knowledge to accomplish tasks</li>
                  <li>Meets advancement/PQS requirements on schedule</li>
                </ul>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-md border border-green-200 dark:border-green-900">
                <h5 className="font-medium text-green-800 dark:text-green-400 mb-2">5.0 Exceeds Standards</h5>
                <ul className="list-disc pl-5 text-sm text-green-700 dark:text-green-300 space-y-2">
                  <li>Recognized subject matter expert in technical field</li>
                  <li>Applies knowledge to solve complex technical problems</li>
                  <li>Completes advancement/PQS requirements early with distinction</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'quality' && (
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2">Quality of Work Rating Scale</h4>
            <div className="flex flex-col space-y-4 mt-3">
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-md border border-red-200 dark:border-red-900">
                <h5 className="font-medium text-red-800 dark:text-red-400 mb-2">1.0 Below Standards</h5>
                <ul className="list-disc pl-5 text-sm text-red-700 dark:text-red-300 space-y-2">
                  <li>Requires extensive supervision</li>
                  <li>Work frequently needs correction</li>
                  <li>Inefficient use of resources</li>
                </ul>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-900">
                <h5 className="font-medium text-amber-800 dark:text-amber-400 mb-2">3.0 Meets Standards</h5>
                <ul className="list-disc pl-5 text-sm text-amber-700 dark:text-amber-300 space-y-2">
                  <li>Requires minimal supervision</li>
                  <li>Produces reliable work products</li>
                  <li>Manages resources appropriately</li>
                </ul>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-md border border-green-200 dark:border-green-900">
                <h5 className="font-medium text-green-800 dark:text-green-400 mb-2">5.0 Exceeds Standards</h5>
                <ul className="list-disc pl-5 text-sm text-green-700 dark:text-green-300 space-y-2">
                  <li>Works independently with excellence</li>
                  <li>Consistently delivers superior results</li>
                  <li>Optimizes resource utilization</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'climate' && (
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2">Command Climate/EO Rating Scale</h4>
            <div className="flex flex-col space-y-4 mt-3">
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-md border border-red-200 dark:border-red-900">
                <h5 className="font-medium text-red-800 dark:text-red-400 mb-2">1.0 Below Standards</h5>
                <ul className="list-disc pl-5 text-sm text-red-700 dark:text-red-300 space-y-2">
                  <li>Actions counter to Navy's retention/reenlistment goals</li>
                  <li>Uninvolved with mentoring or professional development of subordinates</li>
                  <li>Actions counter to good order and discipline and negatively affect Command/Organizational climate</li>
                  <li>Demonstrates exclusionary behavior</li>
                  <li>Fails to value differences from cultural diversity</li>
                </ul>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-900">
                <h5 className="font-medium text-amber-800 dark:text-amber-400 mb-2">3.0 Meets Standards</h5>
                <ul className="list-disc pl-5 text-sm text-amber-700 dark:text-amber-300 space-y-2">
                  <li>Positive leadership supports Navy's increased retention goals</li>
                  <li>Active in decreasing attrition</li>
                  <li>Actions adequately encourage/support subordinates' personal/professional growth</li>
                  <li>Demonstrates appreciation for contributions of Navy personnel</li>
                  <li>Positive influence on Command climate</li>
                  <li>Values differences as strengths</li>
                  <li>Fosters atmosphere of acceptance/inclusion per EO/EEO policy</li>
                </ul>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-md border border-green-200 dark:border-green-900">
                <h5 className="font-medium text-green-800 dark:text-green-400 mb-2">5.0 Exceeds Standards</h5>
                <ul className="list-disc pl-5 text-sm text-green-700 dark:text-green-300 space-y-2">
                  <li>Measurably contributes to Navy's increased retention and reduced attrition objectives</li>
                  <li>Proactive leader/exemplary mentor</li>
                  <li>Involved in subordinates' personal development leading to professional growth/sustained commitment</li>
                  <li>Initiates support programs for military, civilian, and families to achieve exceptional Command and Organizational climate</li>
                  <li>Develops unit cohesion by valuing differences as strengths</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'military' && (
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2">Military Bearing/Character Rating Scale</h4>
            <div className="flex flex-col space-y-4 mt-3">
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-md border border-red-200 dark:border-red-900">
                <h5 className="font-medium text-red-800 dark:text-red-400 mb-2">1.0 Below Standards</h5>
                <ul className="list-disc pl-5 text-sm text-red-700 dark:text-red-300 space-y-2">
                  <li>Consistently unsatisfactory appearance</li>
                  <li>Poor self-control; conduct resulting in disciplinary action</li>
                  <li>Unable to meet one or more physical readiness standards</li>
                  <li>Fails to live up to one or more Navy Core Values: HONOR, COURAGE, COMMITMENT</li>
                </ul>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-900">
                <h5 className="font-medium text-amber-800 dark:text-amber-400 mb-2">3.0 Meets Standards</h5>
                <ul className="list-disc pl-5 text-sm text-amber-700 dark:text-amber-300 space-y-2">
                  <li>Excellent personal appearance</li>
                  <li>Excellent conduct, conscientiously complies with regulations</li>
                  <li>Complies with physical readiness program</li>
                  <li>Always lives up to Navy Core Values: HONOR, COURAGE, COMMITMENT</li>
                </ul>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-md border border-green-200 dark:border-green-900">
                <h5 className="font-medium text-green-800 dark:text-green-400 mb-2">5.0 Exceeds Standards</h5>
                <ul className="list-disc pl-5 text-sm text-green-700 dark:text-green-300 space-y-2">
                  <li>Exemplary personal appearance</li>
                  <li>Model of conduct, on and off duty</li>
                  <li>A leader in physical readiness</li>
                  <li>Exemplifies Navy Core Values: HONOR, COURAGE, COMMITMENT</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'accomplishment' && (
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2">Job Accomplishment/Initiative Rating Scale</h4>
            <div className="flex flex-col space-y-4 mt-3">
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-md border border-red-200 dark:border-red-900">
                <h5 className="font-medium text-red-800 dark:text-red-400 mb-2">1.0 Below Standards</h5>
                <ul className="list-disc pl-5 text-sm text-red-700 dark:text-red-300 space-y-2">
                  <li>Needs prodding to attain qualification or finish job</li>
                  <li>Prioritizes poorly</li>
                  <li>Avoids responsibility</li>
                </ul>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-900">
                <h5 className="font-medium text-amber-800 dark:text-amber-400 mb-2">3.0 Meets Standards</h5>
                <ul className="list-disc pl-5 text-sm text-amber-700 dark:text-amber-300 space-y-2">
                  <li>Productive and motivated</li>
                  <li>Completes tasks and qualifications fully and on time</li>
                  <li>Plans/prioritizes effectively</li>
                  <li>Reliable, dependable, willingly accepts responsibility</li>
                </ul>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-md border border-green-200 dark:border-green-900">
                <h5 className="font-medium text-green-800 dark:text-green-400 mb-2">5.0 Exceeds Standards</h5>
                <ul className="list-disc pl-5 text-sm text-green-700 dark:text-green-300 space-y-2">
                  <li>Energetic self-starter</li>
                  <li>Completes tasks or qualifications early, better than expected</li>
                  <li>Plans/prioritizes wisely and with exceptional foresight</li>
                  <li>Seeks extra responsibility and takes on the hardest jobs</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'teamwork' && (
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2">Teamwork Rating Scale</h4>
            <div className="flex flex-col space-y-4 mt-3">
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-md border border-red-200 dark:border-red-900">
                <h5 className="font-medium text-red-800 dark:text-red-400 mb-2">1.0 Below Standards</h5>
                <ul className="list-disc pl-5 text-sm text-red-700 dark:text-red-300 space-y-2">
                  <li>Creates conflict, unwilling to work with others, puts self above team</li>
                  <li>Fails to understand team goals or teamwork techniques</li>
                  <li>Does not take direction well</li>
                </ul>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-900">
                <h5 className="font-medium text-amber-800 dark:text-amber-400 mb-2">3.0 Meets Standards</h5>
                <ul className="list-disc pl-5 text-sm text-amber-700 dark:text-amber-300 space-y-2">
                  <li>Reinforces others' efforts, meets commitments to team</li>
                  <li>Understands goals, employs good teamwork techniques</li>
                  <li>Accepts and offers team direction</li>
                </ul>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-md border border-green-200 dark:border-green-900">
                <h5 className="font-medium text-green-800 dark:text-green-400 mb-2">5.0 Exceeds Standards</h5>
                <ul className="list-disc pl-5 text-sm text-green-700 dark:text-green-300 space-y-2">
                  <li>Team builder, inspires cooperation and progress</li>
                  <li>Focuses goals and techniques for teams</li>
                  <li>The best at accepting and offering team direction</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'leadership' && (
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2">Leadership Rating Scale</h4>
            <div className="flex flex-col space-y-4 mt-3">
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-md border border-red-200 dark:border-red-900">
                <h5 className="font-medium text-red-800 dark:text-red-400 mb-2">1.0 Below Standards</h5>
                <ul className="list-disc pl-5 text-sm text-red-700 dark:text-red-300 space-y-2">
                  <li>Neglects growth/development or welfare of subordinates</li>
                  <li>Fails to organize, creates problems for subordinates</li>
                  <li>Does not set or achieve goals relevant to command mission and vision</li>
                  <li>Lacks ability to cope with or tolerate stress</li>
                  <li>Inadequate communicator</li>
                  <li>Tolerates hazards or unsafe practices</li>
                </ul>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-md border border-amber-200 dark:border-amber-900">
                <h5 className="font-medium text-amber-800 dark:text-amber-400 mb-2">3.0 Meets Standards</h5>
                <ul className="list-disc pl-5 text-sm text-amber-700 dark:text-amber-300 space-y-2">
                  <li>Effectively stimulates growth/development in subordinates</li>
                  <li>Organizes successfully, implementing process improvements and efficiencies</li>
                  <li>Sets/achieves useful, realistic goals that support command mission</li>
                  <li>Performs well in stressful situations</li>
                  <li>Clear, timely communicator</li>
                  <li>Ensures safety of personnel and equipment</li>
                </ul>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-md border border-green-200 dark:border-green-900">
                <h5 className="font-medium text-green-800 dark:text-green-400 mb-2">5.0 Exceeds Standards</h5>
                <ul className="list-disc pl-5 text-sm text-green-700 dark:text-green-300 space-y-2">
                  <li>Inspiring motivator and trainer, subordinates reach highest level of growth and development</li>
                  <li>Superb organizer, great foresight, develops process improvements and efficiencies</li>
                  <li>Leadership achievements dramatically further command mission and vision</li>
                  <li>Perseveres through the toughest challenges and inspires others</li>
                  <li>Exceptional communicator</li>
                  <li>Makes subordinates safety-conscious, maintains top safety record</li>
                  <li>Constantly improves the personal and professional lives of others</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};