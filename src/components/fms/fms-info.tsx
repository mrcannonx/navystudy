import { Calculator, Info, Scale, Star, Award, Clock, BookOpen, AlertTriangle, ChevronDown, ChevronUp, Medal, Briefcase, GraduationCap } from "lucide-react"

export function FMSInfo() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 mt-12">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">FMS Quick Reference Guide</h2>
      
      {/* Navy FMS Calculation Formula Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 fms-card fade-in">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Navy FMS Calculation Formula (NAVADMIN 312/18)</h2>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">E4/E5 FMS Formula</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3">Factor</th>
                  <th className="text-left py-2 px-3">Computation</th>
                  <th className="text-left py-2 px-3">Max Points</th>
                  <th className="text-left py-2 px-3">Max Percent</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 px-3">PMA</td>
                  <td className="py-2 px-3">(PMA*80) - 256</td>
                  <td className="py-2 px-3">64</td>
                  <td className="py-2 px-3">38%</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 px-3">Standard Score</td>
                  <td className="py-2 px-3">Exam standard score</td>
                  <td className="py-2 px-3">80</td>
                  <td className="py-2 px-3">47%</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 px-3">Awards</td>
                  <td className="py-2 px-3">Per BUPERSINST 1430.16G</td>
                  <td className="py-2 px-3">10</td>
                  <td className="py-2 px-3">6%</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 px-3">PNA</td>
                  <td className="py-2 px-3">Points for top 25% (last 3 cycles)</td>
                  <td className="py-2 px-3">9</td>
                  <td className="py-2 px-3">6%</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 px-3">SIPG</td>
                  <td className="py-2 px-3">SIPG/5</td>
                  <td className="py-2 px-3">2</td>
                  <td className="py-2 px-3">1%</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Education</td>
                  <td className="py-2 px-3">2 pts (AA/AS), 4 pts (BA/BS+)</td>
                  <td className="py-2 px-3">4</td>
                  <td className="py-2 px-3">2%</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-300 dark:border-gray-600 font-semibold">
                  <td className="py-2 px-3">TOTAL</td>
                  <td className="py-2 px-3"></td>
                  <td className="py-2 px-3">169</td>
                  <td className="py-2 px-3">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Important Notes</h3>
          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 text-sm space-y-2">
            <li>PMA formula requires a minimum PMA of 3.2 to start earning positive points</li>
            <li>For E6, RSCA PMA is used with formula (RSCA PMA*30) - 60, max 114 points</li>
            <li>For E7, RSCA PMA is used with formula (RSCA PMA*30) - 54, max 120 points</li>
            <li>Individual Augmentee (IA) points are no longer awarded as of NAVADMIN 312/18</li>
            <li>PNA points only accumulate for the 3 previous advancement cycles</li>
            <li>Service in Paygrade (SIPG) is calculated by dividing total years by 5</li>
          </ul>
        </div>
      </section>

      {/* E5/6 FMS Elements Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 fms-card fade-in">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">E5/6 FMS Elements</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-600 dark:text-blue-300 mb-2">Performance Mark Average</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">How well you perform at your job and as a Sailor</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border-l-4 border-green-500">
            <h3 className="font-semibold text-green-600 dark:text-green-300 mb-2">Exam Standard Score</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Serves as an objective metric that measures rating knowledge</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border-l-4 border-amber-500">
            <h3 className="font-semibold text-amber-600 dark:text-amber-300 mb-2">Awards</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Points for your accomplishments in your job and as a Sailor</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border-l-4 border-purple-500">
            <h3 className="font-semibold text-purple-600 dark:text-purple-300 mb-2">Individual Augmentee Points</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Points for service in a Congressionally Designated Combat Zone</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border-l-4 border-indigo-500">
            <h3 className="font-semibold text-indigo-600 dark:text-indigo-300 mb-2">Pass Not Advanced Points</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Credit for high scores in previous cycles with low quotas</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border-l-4 border-rose-500">
            <h3 className="font-semibold text-rose-600 dark:text-rose-300 mb-2">Service in Paygrade</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Time in your current paygrade, reflecting job experience</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border-l-4 border-teal-500">
            <h3 className="font-semibold text-teal-600 dark:text-teal-300 mb-2">Education Points</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Points for self-improvement through education and degrees</p>
          </div>
        </div>
      </section>

      {/* E7 FMS Elements Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 fms-card fade-in">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">E7 FMS Elements</h2>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">For those who are E7 Chief Petty Officer board eligible, FMS elements are:</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-600 dark:text-blue-300 mb-2">Performance Mark Average</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">How well you perform at your job and as a Sailor</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border-l-4 border-green-500">
            <h3 className="font-semibold text-green-600 dark:text-green-300 mb-2">Exam Standard Score</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Serves as an objective metric that measures rating knowledge</p>
          </div>
        </div>
      </section>
    </div>
  )
}
