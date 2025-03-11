"use client"

import { useState } from "react"
import { ClientButton } from "@/components/ui/client-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AwardPointsDashboard } from "./award-points-dashboard"
import { Medal, Info, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

const PAYGRADE_OPTIONS = ["E4", "E5", "E6"]

// Group awards by point value for better organization
const AWARD_CATEGORIES = [
  {
    points: 10,
    title: "10-Point Awards",
    description: "Highest level decorations",
    awards: [
      { id: "moh", name: "Medal of Honor", points: 10 },
    ]
  },
  {
    points: 5,
    title: "5-Point Awards",
    description: "Very high level decorations",
    awards: [
      { id: "nc", name: "Navy Cross", points: 5 },
    ]
  },
  {
    points: 4,
    title: "4-Point Awards",
    description: "High level decorations",
    awards: [
      { id: "dsc", name: "Distinguished Service Medal or Cross", points: 4 },
      { id: "ssm", name: "Silver Star Medal", points: 4 },
      { id: "lom", name: "Legion of Merit", points: 4 },
      { id: "dfc", name: "Distinguished Flying Cross", points: 4 },
    ]
  },
  {
    points: 3,
    title: "3-Point Awards",
    description: "Mid-level decorations",
    awards: [
      { id: "nmcm", name: "Navy and Marine Corps Medal", points: 3 },
      { id: "bsm", name: "Bronze Star Medal", points: 3 },
      { id: "ph", name: "Purple Heart", points: 3 },
      { id: "dmsm", name: "Defense Meritorious Service Medal", points: 3 },
      { id: "msm", name: "Meritorious Service Medal", points: 3 },
      { id: "am", name: "Air Medal (Strike/Flight)", points: 3 },
      { id: "jscm", name: "Joint Service Commendation Medal", points: 3 },
      { id: "nmccm", name: "Navy and Marine Corps Commendation Medal", points: 3 },
    ]
  },
  {
    points: 2,
    title: "2-Point Awards",
    description: "Lower-level decorations and combat service",
    awards: [
      { id: "eloc", name: "Executive Letter of Commendation", points: 2 },
      { id: "jsam", name: "Joint Service Achievement Medal", points: 2 },
      { id: "nmcam", name: "Navy and Marine Corps Achievement Medal", points: 2 },
      { id: "car", name: "Combat Action Ribbon", points: 2 },
      { id: "glsm", name: "Gold Life Saving Medal", points: 2 },
      { id: "cz", name: "Service in Designated Combat Zone (>90 days)", points: 2 },
    ]
  },
  {
    points: 1,
    title: "1-Point Awards",
    description: "Letters of commendation",
    awards: [
      { id: "loc", name: "Letter of Commendation (Flag/Senior Executive Service)", points: 1 },
    ]
  }
]

// Flatten awards for calculations
const AWARDS = AWARD_CATEGORIES.flatMap(category => category.awards)

export function AwardPointsCalculator() {
  const [paygrade, setPaygrade] = useState("E4")
  const [selectedAwards, setSelectedAwards] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("calculator")

  const maxPoints = paygrade === "E6" ? 12 : 10

  const calculatePoints = () => {
    return selectedAwards.reduce((total, awardId) => {
      const award = AWARDS.find(a => a.id === awardId)
      return total + (award?.points || 0)
    }, 0)
  }

  const totalPoints = calculatePoints()
  const isOverLimit = totalPoints > maxPoints
  const pointsRemaining = Math.max(0, maxPoints - totalPoints)

  const toggleAward = (awardId: string) => {
    setSelectedAwards(prev =>
      prev.includes(awardId)
        ? prev.filter(id => id !== awardId)
        : [...prev, awardId]
    )
  }

  const clearSelections = () => {
    setSelectedAwards([])
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 fade-in">
      <Tabs defaultValue="calculator" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Medal className="h-4 w-4" />
            <span>Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="instructions" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>Instructions</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator" className="space-y-8 pt-4">
          <AwardPointsDashboard
            totalPoints={totalPoints}
            paygrade={paygrade}
            selectedAwardsCount={selectedAwards.length}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Paygrade Selection */}
            <Card className="md:col-span-1 award-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Paygrade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select your paygrade</label>
                    <select
                      value={paygrade}
                      onChange={(e) => setPaygrade(e.target.value)}
                      className="w-full p-2 border rounded-md bg-background enhanced-input"
                    >
                      {PAYGRADE_OPTIONS.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      Maximum points: <span className="font-semibold">{maxPoints}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Points remaining: <span className={`font-semibold ${isOverLimit ? 'text-red-500' : 'text-green-500'}`}>
                        {isOverLimit ? 'Over limit' : pointsRemaining.toFixed(1)}
                      </span>
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSelections}
                    className="w-full mt-2"
                  >
                    Clear Selections
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Awards Selection */}
            <Card className="md:col-span-3 award-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Select Your Awards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {AWARD_CATEGORIES.map((category) => (
                    <div key={category.points} className="award-category p-4 rounded-md bg-gray-50 dark:bg-gray-800">
                      <h3 className="text-md font-medium mb-1 flex items-center">
                        <span className="mr-2">{category.title}</span>
                        <span className="text-sm text-muted-foreground">({category.description})</span>
                      </h3>
                      <div className="mt-3 space-y-2">
                        {category.awards.map((award) => (
                          <div key={award.id} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                            <input
                              type="checkbox"
                              id={award.id}
                              checked={selectedAwards.includes(award.id)}
                              onChange={() => toggleAward(award.id)}
                              className="mr-3 award-checkbox"
                            />
                            <label htmlFor={award.id} className="flex-1 cursor-pointer">
                              {award.name}
                              <span className="ml-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                                ({award.points} {award.points === 1 ? 'point' : 'points'})
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {isOverLimit && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md alert-box">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Points Exceeded</h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    You have selected awards totaling {totalPoints.toFixed(1)} points, which exceeds the maximum of {maxPoints} points for {paygrade}.
                    Only {maxPoints} points will be counted toward your Final Multiple Score.
                  </p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="instructions" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>How to Use the Award Points Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Step 1: Select Your Paygrade</h3>
                <p className="text-muted-foreground">Choose your current paygrade (E4, E5, or E6) to determine your maximum award points.</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Step 2: Select Your Awards</h3>
                <p className="text-muted-foreground">Check all personal decorations and awards you have received. The calculator will automatically total your points.</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Step 3: Review Your Total</h3>
                <p className="text-muted-foreground">The dashboard will show your total points and whether you are within the maximum limit for your paygrade.</p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border-l-4 border-blue-500">
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Important Notes</h3>
                <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>E4 and E5 candidates can earn a maximum of 10 award points</li>
                  <li>E6 candidates can earn a maximum of 12 award points</li>
                  <li>Service in a designated combat zone for more than 90 days earns 2 additional points</li>
                  <li>Ensure all awards are properly documented in your service record</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
