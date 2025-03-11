"use client"

import { useState } from "react"
import { Calculator, Info, Scale, Star, Award, Clock, BookOpen, AlertTriangle, ChevronDown, ChevronUp, Medal, Briefcase, GraduationCap } from "lucide-react"
import { Container } from "@/components/ui/container"
import React from "react"
import { FMSInfoSectionPart2 } from "./fms-info-section-part2"

// Accordion component for collapsible sections
interface AccordionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className={`accordion-item border border-gray-200 dark:border-gray-700 rounded-lg mb-4 ${isOpen ? 'open' : ''}`}>
      <div 
        className="accordion-header flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        </div>
        <div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          )}
        </div>
      </div>
      <div className={`accordion-content ${isOpen ? 'p-4 border-t border-gray-200 dark:border-gray-700' : ''}`}>
        {isOpen && children}
      </div>
    </div>
  )
}

export function FMSInfoSection() {
  return (
    <div className="w-full bg-white dark:bg-gray-900 py-16" id="info-guide">
      <Container>
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center gap-3 mb-8 slide-in">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm">
              <Info className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">FMS Information Guide</h2>
          </div>
          
          
          {/* Main content with accordions */}
          <div className="space-y-6">
            {/* Understanding FMS Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 fms-card fade-in">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                    <Info className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Understanding FMS</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300">
                  The Final Multiple Score (FMS) is a "Whole Person Concept" approach that considers a number of 
                  elements to ensure the most qualified Sailors are advanced. This application is designed to provide 
                  you with information on each of the FMS elements. You will have the opportunity to enter data to 
                  help understand "what-if" scenarios for upcoming FMS calculations and advancement opportunities.
                </p>
              </div>
            </div>
            
            {/* E5/E6 and E7 FMS Elements Accordions removed as requested */}
            
            {/* Advancement Opportunity Accordion */}
            <Accordion title="Advancement Opportunity" icon={Award}>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  For E5/6, advancement opportunity is based on quotas vacancies at the next-higher paygrade in your rating or billet based advancement. Some rates have limited quotas; therefore, the Navy advances the most qualified Sailors using the FMS Whole Person Concept. Some rates will advance via a Sailor Scoring Criteria under billet based advancement.
                </p>
              </div>
            </Accordion>
            
            {/* PMA/RSCA PMA Accordion */}
            <Accordion title="Performance Mark Average" icon={Star}>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  The value for the Performance Mark Average must be no less than 2.00, no more than 4.00 and no more than two decimal places.
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mt-2">
                  <h4 className="font-medium text-gray-700 dark:text-gray-200">RSCA PMA Calculation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Instead of Performance Mark Average (PMA), Reporting Senior's Cumulative Average (RSCA) PMA is used for advancement to E6 and E7. RSCA PMA is intended to reward high performing Sailors who deploy.
                  </p>
                  
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      RSCA is calculated using the Promotion Recommendation block (Block 45) from evaluations, your PMA, and your RSCA from evaluations. The last 36 months will be used to determine RSCA PMA.
                    </p>
                    
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border mt-2">
                      <h5 className="font-medium text-gray-700 dark:text-gray-200">Promotion Recommendation Point Values:</h5>
                      <ul className="mt-1 space-y-1 text-sm">
                        <li>• Early Promote = 4.00</li>
                        <li>• Must Promote = 3.80</li>
                        <li>• Promotable = 3.60</li>
                        <li>• Progressing = 3.40</li>
                        <li>• Significant Problems = 2.00</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Accordion>
            
            {/* Add the additional accordions from part 2 */}
            <FMSInfoSectionPart2 Accordion={Accordion} />
          </div>
        </div>
      </Container>
    </div>
  )
}
