"use client"

import { Info, Medal, AlertTriangle, FileText, CheckCircle, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AwardPointsInfoSection() {
  return (
    <div id="info-guide" className="w-full bg-gray-50 dark:bg-gray-900 py-16">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Award Points Information Guide</h2>
          <div className="h-1 w-24 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Understanding how award points work is essential for maximizing your advancement opportunities
          </p>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Detailed Guide</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>FAQ</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 fade-in">
            {/* Understanding Award Points Section */}
            <Card className="border-0 shadow-md award-card">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <Info className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Understanding Award Points</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Award points are earned through personal decorations and service awards. The maximum points
                      vary based on your paygrade - E4/E5 candidates can earn up to 10 points, while E6 candidates
                      can earn up to 12 points.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Combat Zone Service Bonus Section */}
            <Card className="border-0 shadow-md award-card">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <Medal className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Combat Zone Service Bonus</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Candidates who have served greater than 90 consecutive days in Congressionally
                      Designated Combat Zones and Approved Contingency Operations Areas are authorized
                      a two point increase to maximum award points authorized.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Note Section */}
            <Card className="border-0 shadow-md award-card">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <AlertTriangle className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Important Note</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Always make sure your award points are correct on your exam worksheet AND your exam
                      answer sheet. Double-check your calculations and verify all awards are properly documented.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-6 fade-in">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Award Points Detailed Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Award Point Values</span>
                  </h3>
                  <div className="pl-7 space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">Award points are assigned based on the significance of the decoration:</p>
                    <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1">
                      <li><span className="font-medium">10 points</span>: Medal of Honor</li>
                      <li><span className="font-medium">5 points</span>: Navy Cross</li>
                      <li><span className="font-medium">4 points</span>: Distinguished Service Medal, Silver Star, Legion of Merit, Distinguished Flying Cross</li>
                      <li><span className="font-medium">3 points</span>: Bronze Star, Purple Heart, Meritorious Service Medal, etc.</li>
                      <li><span className="font-medium">2 points</span>: Achievement Medals, Combat Action Ribbon, etc.</li>
                      <li><span className="font-medium">1 point</span>: Letters of Commendation</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Maximum Points by Paygrade</span>
                  </h3>
                  <div className="pl-7">
                    <p className="text-gray-600 dark:text-gray-400">The maximum award points that can be counted toward your Final Multiple Score are:</p>
                    <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1 mt-2">
                      <li><span className="font-medium">E4 and E5</span>: Maximum of 10 points</li>
                      <li><span className="font-medium">E6</span>: Maximum of 12 points</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Documentation Requirements</span>
                  </h3>
                  <div className="pl-7">
                    <p className="text-gray-600 dark:text-gray-400">
                      All awards must be properly documented in your service record. Ensure that your NAVPERS 1070/604
                      (Enlisted Qualifications History) is up-to-date with all your awards before the advancement exam.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="faq" className="space-y-6 fade-in">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Can I count multiple awards of the same type?</h3>
                  <p className="text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-blue-500">
                    Yes, each award counts separately toward your total. For example, if you have received three Navy and Marine Corps
                    Achievement Medals, you would count 6 points (2 points each).
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">What if my total exceeds the maximum for my paygrade?</h3>
                  <p className="text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-blue-500">
                    Only the maximum allowed for your paygrade will be counted toward your Final Multiple Score. For example,
                    if you're an E5 with 15 award points, only 10 points will be counted.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Do award points from previous advancement cycles carry over?</h3>
                  <p className="text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-blue-500">
                    Yes, award points are cumulative throughout your career. All qualifying awards you've earned will count
                    toward your total, subject to the maximum for your paygrade.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">How do I verify my award points are correct?</h3>
                  <p className="text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-blue-500">
                    Review your Enlisted Advancement Worksheet (EAW) before the exam to ensure all your awards are listed correctly.
                    If there are discrepancies, contact your command's Educational Services Officer (ESO) immediately.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
