"use client"

import React from "react"
import { Calculator, Info, Scale, Star, Award, Clock, BookOpen, AlertTriangle, ChevronDown, ChevronUp, Medal, Briefcase, GraduationCap } from "lucide-react"

// Import the Accordion component type
interface AccordionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

// This is a helper component to extend the FMS info section
export function FMSInfoSectionPart2({ Accordion }: { Accordion: React.FC<AccordionProps> }) {
  return (
    <>
      {/* Exam Standard Score Accordion */}
      <Accordion title="Exam Standard Score" icon={BookOpen}>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            The value for the Exam Standard Score must be no less than 20.00, no more than 80.00, and no more than two decimal places.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Advancement examination raw scores are converted to standardized scores (SS) to account for variations in difficulty between different exams. This allows for fair comparison of your test performance with others taking the same exam. The SS range is from 20 to 80 depending on your performance.
            </p>
            
            <div className="mt-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your Standard Score is a statistical calculation based on the raw score that has been scaled. The following percentiles give you an idea of how your score compares to others:
              </p>
              
              <ul className="mt-2 space-y-1 text-sm">
                <li>• In general, an SS of 80 indicates a candidate scored higher than 99% of the candidates taking the exact same exam.</li>
                <li>• An SS of 70 indicates a candidate scored higher than 95% of the candidates taking the exam.</li>
                <li>• 60 indicates 84%, 50 indicates 50%, 40 indicates 16%, 30 indicates 5%, and 20 indicates 1%.</li>
              </ul>
            </div>
          </div>
        </div>
      </Accordion>
      
      {/* Award Points Accordion */}
      <Accordion title="Award Points" icon={Medal}>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            The value for Award Points must be a whole number no less than 0. The range for Award Points depends on the selected Prospective Paygrade. If the Paygrade is E5, then the Award Points must be no more than 10. If the Paygrade is E6, then the Award Points must be no more than 12. This element does not apply to the E7 Paygrade.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mt-2">
            <h4 className="font-medium text-gray-700 dark:text-gray-200">Awards Considered in the E5/6 Final Multiple Score</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Points are awarded for personal decorations at the time of the advancement exam. Awards earned during a multiservice tour are presumed to be an existing part of the official file of the respective service. The maximum number of award points is 12 for E6 and 10 points for E5.
            </p>
            
            <div className="mt-3">
              <h5 className="font-medium text-gray-700 dark:text-gray-200">Current list of awards and their values:</h5>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• 10 Points = Medal of Honor</li>
                <li>• 9 Points = Navy Cross</li>
                <li>• 8 Points = Distinguished Service Medal or Cross, Silver Star, Legion of Merit, Distinguished Flying Cross</li>
                <li>• 7 Points = Navy and Marine Corps, Bronze Star Medal, Purple Heart, Defense Meritorious Service Medal, Meritorious Service Medal</li>
                <li>• 3 Points = Letter of Commendation (Flag/SES/General Officer) (max 2)</li>
              </ul>
            </div>
          </div>
        </div>
      </Accordion>
      
      {/* Pass Not Advanced Accordion */}
      <Accordion title="Pass Not Advanced" icon={Clock}>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            The value for Pass Not Advanced must be no less than 0.0, no more than 3.0, and no more than one decimal place. The digit in the decimal place must be either 0 or 5. This element does not apply to the E7 Paygrade.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              PNA (Passed Not Advanced) Points are added to your FMS (Final Multiple Score). If you pass the test, demonstrate rating knowledge, but are not advanced to the next-higher paygrade, PNA points come from having a high Standard Score (SS) or a high Performance Mark Average (PMA) or Reporting Senior's Cumulative Average (RSCA) PMA. You can receive up to 3 points for a maximum of 3 consecutive advancement cycles in the same paygrade and rating. Only the PNA points from the most recent three consecutive advancement cycles in the same paygrade are used.
            </p>
            
            <div className="mt-3">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                For each exam cycle, you can earn points when your Standard Score (SS) or PMA/RSCA PMA places you in the top 25% of ranked performance among your peers. Your PMA/RSCA must fall within the top 50% of ranked performance and your Standard Score must fall within the top 50% of ranked performance. PNA points are based on all exam standard scores where you SS must fall in the top 25% in your paygrade/rating to earn points when not advanced.
              </p>
            </div>
          </div>
        </div>
      </Accordion>
      
      {/* Service in Paygrade Accordion */}
      <Accordion title="Service in Paygrade" icon={Briefcase}>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Both the number of years and the number of additional months must be whole numbers. For E5/E6, the number of years range from 0 to 30 inclusive and the number of months range from 0 to 11 inclusive. This element does not apply to the E7 Paygrade.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Service in Paygrade (SIPG) points are awarded to Sailors based on the time they have been in their current paygrade. The maximum number of SIPG points is calculated using years and months. Your Terminal Eligibility Date (TED) is used to determine your SIPG. For Active Component, SIPG is calculated using years and months. For Inactive Reserves, SIPG is Drill Service in Paygrade (DSIPG). Maximum E5 SIPG points is 7, and maximum E6 SIPG points is 8.
            </p>
            
            <div className="mt-3">
              <h5 className="font-medium text-gray-700 dark:text-gray-200">TED for each Cycle are:</h5>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• E5/E6 FEBRUARY Exams = 1 July of same year</li>
                <li>• E5/E6 AUGUST Exams = 1 January of next year</li>
              </ul>
            </div>
          </div>
        </div>
      </Accordion>
      
      {/* Education Accordion */}
      <Accordion title="Education" icon={GraduationCap}>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            The choices for Education are None, Associate's and Bachelor's or Higher. If Associate's is selected, 2 points will be awarded. If Bachelor's or Higher is selected, 4 points will be awarded. This element does not apply to the E7 Paygrade.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Sailors competing for advancement to paygrades E5 and E6 will be awarded points for successfully completing an associate's degree, baccalaureate degree or higher. Education points are awarded for the highest degree held, not for all degrees. If you have both an associate's and a bachelor's degree, you will receive 4 points, not 6 points.
            </p>
          </div>
        </div>
      </Accordion>
      
      {/* Navy Advancement Cycles Accordion */}
      <Accordion title="Navy Advancement Cycles" icon={Clock}>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Navy advancement processes are broken up into designated time periods called cycles. During an advancement cycle, Sailors take advancement exams to compete for advancement to the next-higher paygrade. Each cycle begins with exam ordering based on eligibility requirements, such as a Sailor's Time in Rate (TIR) and Time in Service (TIS).
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              For E5/E6, during a cycle, exams are administered, graded, and Individual Final Multiple Scores are calculated. A cycle is completed when advancement authorizations are published and all pay movements are executed.
            </p>
          </div>
        </div>
      </Accordion>
    </>
  )
}