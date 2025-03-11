import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { TabProps } from '../../types';
import { Calendar as CalendarIcon, Info as InfoIcon, BarChart as BarChartIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export const TemplateSchedulingTab: React.FC<TabProps> = () => {
  const [open, setOpen] = useState(false);

  return (
    <Card className="border-0 shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-t-lg border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold tracking-tight flex items-center text-gray-900 dark:text-white">
            <CalendarIcon className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
            NAVY EVAL & FITREP SCHEDULE
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p>This schedule shows the standard Navy evaluation and FITREP timeline by rank and month.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-t border-gray-200 dark:border-gray-800"></div>
        
        {/* Calendar Section */}
        <div className="p-6">
          <div className="mb-6">
            <div className="overflow-hidden border border-gray-200 rounded-lg shadow-md">
              {/* Table Header */}
              <div className="grid grid-cols-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                <div className="p-4 text-center border-r border-gray-300 dark:border-gray-700 text-lg">MONTH</div>
                <div className="p-4 text-center border-r border-gray-300 dark:border-gray-700 text-lg">OFFICER</div>
                <div className="p-4 text-center text-lg">ENLISTED</div>
              </div>
              
              {/* Table Rows */}
              {months.map((month, index) => (
                <div 
                  key={month.name} 
                  className={`grid grid-cols-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200 transition-colors duration-200 hover:bg-blue-50`}
                >
                  <div className="p-4 text-center font-medium border-r border-gray-200">{month.name}</div>
                  <div className="p-4 text-center border-r border-gray-200">{month.officer || ''}</div>
                  <div className="p-4 text-center">{month.enlisted || ''}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer Note */}
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-4 text-center rounded-lg text-sm italic shadow-md transition-all duration-300 hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700">
            Counseling is due six months before the end of the regular reporting period. FitReps are due on the last day of the month. Enlisted Evals are due on the 15th of the month.
          </div>
          
          {/* Timeline Button */}
          <div className="mt-8 flex justify-center">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex items-center gap-2 text-lg"
                >
                  <BarChartIcon className="h-5 w-5" />
                  View Evaluation Timeline
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl w-full">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center mb-4">
                    Navy Evaluation Timeline
                  </DialogTitle>
                  <DialogDescription className="text-center text-base">
                    Visual representation of counseling and evaluation periods by rank
                  </DialogDescription>
                </DialogHeader>
                
                {/* Timeline Modal Content */}
                <div className="grid grid-cols-1 gap-6 mt-4">
                  {/* Counseling Timeline */}
                  <div className="bg-blue-100 rounded-lg overflow-hidden shadow-md">
                    <div className="bg-blue-600 text-white p-3 font-bold text-center text-xl">
                      COUNSELING
                    </div>
                    <div className="grid grid-cols-[150px_1fr] gap-0">
                      {/* Left column for rank labels */}
                      <div className="bg-blue-200 p-2">
                        <div className="h-10 flex items-center justify-center font-bold text-blue-800">
                          RANK
                        </div>
                        {Object.keys(counselingTimeline).map((rank) => (
                          <div key={`rank-${rank}`} className="h-10 flex items-center justify-center font-bold text-blue-800">
                            {rank.toUpperCase()}
                          </div>
                        ))}
                      </div>
                      
                      {/* Right column for timeline */}
                      <div>
                        {/* Month headers */}
                        <div className="grid grid-cols-12 gap-0 text-sm">
                          {monthAbbreviations.map((month, i) => (
                            <div key={`counsel-month-${i}`} className="h-10 border-r border-blue-200 flex items-center justify-center bg-blue-50 font-medium">
                              {month}
                            </div>
                          ))}
                        </div>
                        
                        {/* Timeline rows */}
                        {Object.entries(counselingTimeline).map(([rank, months]) => (
                          <div key={`counsel-row-${rank}`} className="grid grid-cols-12 gap-0 border-t border-blue-200">
                            {months.map((active, i) => (
                              <div
                                key={`counsel-cell-${rank}-${i}`}
                                className={`h-10 border-r border-blue-200 ${active ? 'bg-blue-500' : 'bg-transparent'} transition-all duration-300 ${active ? 'hover:bg-blue-600' : ''}`}
                              ></div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Evals Timeline */}
                  <div className="bg-red-100 rounded-lg overflow-hidden shadow-md">
                    <div className="bg-red-600 text-white p-3 font-bold text-center text-xl">
                      EVALS
                    </div>
                    <div className="grid grid-cols-[150px_1fr] gap-0">
                      {/* Left column for rank labels */}
                      <div className="bg-red-200 p-2">
                        <div className="h-10 flex items-center justify-center font-bold text-red-800">
                          RANK
                        </div>
                        {Object.keys(evalsTimeline).map((rank) => (
                          <div key={`eval-rank-${rank}`} className="h-10 flex items-center justify-center font-bold text-red-800">
                            {rank.toUpperCase()}
                          </div>
                        ))}
                      </div>
                      
                      {/* Right column for timeline */}
                      <div>
                        {/* Month headers */}
                        <div className="grid grid-cols-12 gap-0 text-sm">
                          {monthAbbreviations.map((month, i) => (
                            <div key={`eval-month-${i}`} className="h-10 border-r border-red-200 flex items-center justify-center bg-red-50 font-medium">
                              {month}
                            </div>
                          ))}
                        </div>
                        
                        {/* Timeline rows */}
                        {Object.entries(evalsTimeline).map(([rank, months]) => (
                          <div key={`eval-row-${rank}`} className="grid grid-cols-12 gap-0 border-t border-red-200">
                            {months.map((active, i) => (
                              <div
                                key={`eval-cell-${rank}-${i}`}
                                className={`h-10 border-r border-red-200 ${active ? 'bg-red-500' : 'bg-transparent'} transition-all duration-300 ${active ? 'hover:bg-red-600' : ''}`}
                              ></div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="mt-6">
                  <Button
                    onClick={() => setOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Data for the calendar
const months = [
  { name: 'JANUARY', officer: 'O3', enlisted: '' },
  { name: 'FEBRUARY', officer: 'O2', enlisted: '' },
  { name: 'MARCH', officer: 'W3, W4, W5', enlisted: 'E5' },
  { name: 'APRIL', officer: 'O5', enlisted: 'E9' },
  { name: 'MAY', officer: 'O1', enlisted: '' },
  { name: 'JUNE', officer: '', enlisted: 'E4' },
  { name: 'JULY', officer: 'O6', enlisted: 'E1, E2, E3' },
  { name: 'AUGUST', officer: '', enlisted: '' },
  { name: 'SEPTEMBER', officer: 'W1, W2', enlisted: 'E7, E8' },
  { name: 'OCTOBER', officer: 'O4', enlisted: '' },
  { name: 'NOVEMBER', officer: '', enlisted: 'E6' },
  { name: 'DECEMBER', officer: '', enlisted: '' }
];

const monthAbbreviations = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// Timeline data (simplified for visualization)
const counselingTimeline = {
  e123: [true, false, false, false, false, false, true, false, false, false, false, false],
  e78: [false, false, false, false, false, false, false, false, true, false, false, false],
  e6: [false, false, false, false, true, false, false, false, false, false, false, false],
  e5: [false, false, false, false, false, false, false, false, true, false, false, false],
  e9: [false, false, false, false, false, false, false, false, false, true, false, false],
  e4: [false, false, false, false, false, false, false, false, false, false, false, true]
};

const evalsTimeline = {
  e123: [false, false, false, false, false, false, true, false, false, false, false, false],
  e78: [false, false, false, false, false, false, false, false, true, false, false, false],
  e6: [false, false, false, false, false, false, false, false, false, false, true, false],
  e5: [false, false, true, false, false, false, false, false, false, false, false, false],
  e9: [false, false, false, true, false, false, false, false, false, false, false, false],
  e4: [false, false, false, false, false, true, false, false, false, false, false, false]
};