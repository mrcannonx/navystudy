import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, HelpCircle, Info, FileText, Save, Star, PlusCircle, Calendar, Database, Zap, Edit3, List } from 'lucide-react';

// Define section key type
type SectionKey = 'professional' | 'military' | 'teamwork' | 'leadership' | 'initiative';

// Define template section type
interface TemplateSection {
  title: string;
  placeholder: string;
  characterLimit: number;
  completed: boolean;
}

// Define brag sheet entry type
interface BragSheetEntry {
  id: number;
  date: string;
  category: SectionKey;
  title: string;
  description: string;
  metrics: string[];
  added: boolean;
}

const EvaluationTemplateBuilder = () => {
  const [rank, setRank] = useState('E5');
  const [rating, setRating] = useState('IT');
  const [role, setRole] = useState('System Administrator');
  const [evalType, setEvalType] = useState('Regular');
  const [activeSection, setActiveSection] = useState<SectionKey>('professional');
  const [showMetrics, setShowMetrics] = useState(true);
  const [showAIEnhancer, setShowAIEnhancer] = useState(false);
  const [showBragSheet, setShowBragSheet] = useState(false);

  // Sample brag sheet entries
  const [bragSheetEntries, setBragSheetEntries] = useState<BragSheetEntry[]>([
    {
      id: 1,
      date: "2025-01-15",
      category: "professional",
      title: "Server Migration",
      description: "Led migration of 3 legacy servers to new hardware, completed 2 days ahead of schedule with zero downtime.",
      metrics: ["3 servers", "0% downtime", "48 hours saved"],
      added: false
    },
    {
      id: 2,
      date: "2025-02-10",
      category: "teamwork",
      title: "Cross-training Session",
      description: "Conducted training for 5 junior sailors on cybersecurity best practices, resulting in 25% reduction in security incidents.",
      metrics: ["5 personnel trained", "25% incident reduction", "8 hours training"],
      added: false
    },
    {
      id: 3,
      date: "2025-02-22",
      category: "initiative",
      title: "Documentation Improvement",
      description: "Created new troubleshooting guide for network issues, reducing average resolution time from 45 to 18 minutes.",
      metrics: ["60% time reduction", "27 min saved per incident", "15-page guide"],
      added: false
    }
  ]);

  // Sample custom metrics by category
  const customMetrics: Record<SectionKey, string[]> = {
    professional: [
      "##% system uptime",
      "## systems administered",
      "## security vulnerabilities resolved",
      "## certifications maintained",
      "##% reduction in technical errors"
    ],
    military: [
      "## uniform inspections passed with zero discrepancies", 
      "## GMT sessions completed with 100% score",
      "## command PT sessions led",
      "## awards/recognition received"
    ],
    teamwork: [
      "## sailors mentored/trained",
      "## cross-departmental projects supported",
      "##% improvement in team performance metrics",
      "## collaborative initiatives led"
    ],
    leadership: [
      "## sailors supervised",
      "##% qualification completion rate for team",
      "## personnel advancement-eligible",
      "## successful inspections passed"
    ],
    initiative: [
      "## process improvements implemented",
      "##% efficiency increase achieved",
      "## volunteer hours contributed",
      "## new procedures developed"
    ]
  };

  // Sample AI enhancement suggestions
  const aiSuggestions = [
    {
      original: "Maintained network servers.",
      improved: "Maintained 7 critical network servers with 99.8% uptime, ensuring uninterrupted communications during 3 major fleet exercises.",
      type: "Added metrics and mission impact"
    },
    {
      original: "Helped junior sailors.",
      improved: "Mentored 4 junior ITs through PQS completion, resulting in 100% qualification rate 30 days ahead of schedule.",
      type: "Added specificity and quantifiable results"
    },
    {
      original: "Participated in security training.",
      improved: "Spearheaded implementation of new security protocols, training 15 personnel and reducing security incidents by 37%.",
      type: "Strengthened action verb and added outcomes"
    }
  ];

  // Sample template sections and placeholder text based on IT2 (E-5) System Administrator
  const templateSections = {
    professional: {
      title: "Professional Knowledge",
      placeholder: "- Maintained CompTIA Security+ certification, supporting 15 shipwide systems\n- Administered 3 critical network systems with 99.7% uptime\n- Implemented 4 new security protocols, reducing potential vulnerabilities by 37%",
      characterLimit: 256,
      completed: false
    },
    military: {
      title: "Military Bearing",
      placeholder: "- Earned top marks in 4 consecutive uniform inspections\n- Completed required GMT with 100% on all assessments\n- Maintained excellent physical readiness, scoring Outstanding on 2 consecutive PFAs",
      characterLimit: 256,
      completed: false
    },
    teamwork: {
      title: "Teamwork",
      placeholder: "- Resolved 127 help desk tickets, exceeding department average by 43%\n- Conducted cross-training for 7 junior personnel on network security practices\n- Served as CMEO Assistant, supporting command-wide initiatives",
      characterLimit: 256,
      completed: false
    },
    leadership: {
      title: "Leadership",
      placeholder: "- Led 3-person team in successful deployment of new message handling system\n- Mentored 2 junior ITs to qualification completion ahead of schedule\n- Volunteered as command PT leader for 6 months, improving division PRT scores by 15%",
      characterLimit: 256,
      completed: false
    },
    initiative: {
      title: "Initiative",
      placeholder: "- Identified and patched critical security vulnerability before deployment\n- Developed SharePoint solution for tracking division qualifications\n- Volunteered 15 hours for command community relations event",
      characterLimit: 256,
      completed: false
    },
  };

  const [sections, setSections] = useState(templateSections);

  // No need to redefine types here as they're already defined at the top of the file
  
  const updateSectionText = (sectionKey: SectionKey, newText: string) => {
    setSections({
      ...sections,
      [sectionKey]: {
        ...sections[sectionKey],
        placeholder: newText,
        completed: newText.trim().length > 0
      }
    });
  };
  
  const addBragSheetEntry = (entry: BragSheetEntry) => {
    // Update brag sheet entry to show it's been added
    const updatedBragSheet = bragSheetEntries.map(item =>
      item.id === entry.id ? { ...item, added: true } : item
    );
    setBragSheetEntries(updatedBragSheet);
    
    // Add entry to the current section text
    const currentText = sections[entry.category].placeholder;
    const updatedText = currentText + '\n- ' + entry.description;
    updateSectionText(entry.category, updatedText);
  };

  const progressPercentage = () => {
    const completedSections = Object.values(sections).filter(section => section.completed).length;
    return Math.round((completedSections / Object.keys(sections).length) * 100);
  };

  // Sample rank and rating options
  const rankOptions = ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'O1', 'O2', 'O3', 'O4', 'O5'];
  const ratingOptions = ['IT', 'MA', 'BM', 'HM', 'CS', 'ET', 'GM', 'LS', 'YN', 'OS'];

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Navy Evaluation Template Builder</h1>
      
      {/* Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Rank/Rate</label>
          <select 
            className="border rounded w-full p-2"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
          >
            {rankOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <select 
            className="border rounded w-full p-2"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            {ratingOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role/Billet</label>
          <select 
            className="border rounded w-full p-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="System Administrator">System Administrator</option>
            <option value="LPO">Leading Petty Officer</option>
            <option value="Work Center Supervisor">Work Center Supervisor</option>
            <option value="Instructor">Instructor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Eval Type</label>
          <select 
            className="border rounded w-full p-2"
            value={evalType}
            onChange={(e) => setEvalType(e.target.value)}
          >
            <option value="Regular">Regular</option>
            <option value="Special">Special</option>
            <option value="Concurrent">Concurrent</option>
          </select>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Completion Progress</span>
          <span className="text-sm font-medium">{progressPercentage()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercentage()}%` }}></div>
        </div>
      </div>

      {/* Feature Toggle Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          className={`flex items-center rounded-full px-4 py-1.5 text-sm font-medium ${showMetrics ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
          onClick={() => setShowMetrics(!showMetrics)}
        >
          <Database size={16} className="mr-1.5" />
          Metrics Library
        </button>
        <button 
          className={`flex items-center rounded-full px-4 py-1.5 text-sm font-medium ${showAIEnhancer ? 'bg-purple-100 text-purple-800' : 'bg-gray-100'}`}
          onClick={() => setShowAIEnhancer(!showAIEnhancer)}
        >
          <Zap size={16} className="mr-1.5" />
          AI Enhancement
        </button>
        <button 
          className={`flex items-center rounded-full px-4 py-1.5 text-sm font-medium ${showBragSheet ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
          onClick={() => setShowBragSheet(!showBragSheet)}
        >
          <Star size={16} className="mr-1.5" />
          Brag Sheet
        </button>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sections Navigation */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evaluation Sections</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                {Object.entries(sections).map(([key, section]) => (
                  <button
                    key={key}
                    className={`flex items-center p-3 text-left border-b ${activeSection === key ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                    onClick={() => setActiveSection(key as SectionKey)}
                  >
                    {section.completed ? (
                      <Check size={18} className="mr-2 text-green-500" />
                    ) : (
                      <Info size={18} className="mr-2 text-gray-400" />
                    )}
                    <span>{section.title}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              <button className="flex items-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                <Save size={18} className="mr-2" />
                Save Template
              </button>
            </CardFooter>
          </Card>

          {/* AI Enhancement Panel */}
          {showAIEnhancer && (
            <Card className="mt-6 border-purple-200">
              <CardHeader className="bg-purple-50 border-b border-purple-100">
                <CardTitle className="text-sm font-medium flex items-center text-purple-800">
                  <Zap size={16} className="mr-2" />
                  AI Enhancement
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-3 text-sm">
                  <p className="text-gray-600">Select any bullet below to enhance your evaluation with AI suggestions:</p>
                  
                  {aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="border rounded p-2 cursor-pointer hover:bg-purple-50">
                      <div className="text-gray-500 mb-1 line-through">{suggestion.original}</div>
                      <div className="font-medium">{suggestion.improved}</div>
                      <div className="mt-1 text-xs text-purple-600 flex items-center">
                        <Edit3 size={12} className="mr-1" />
                        {suggestion.type}
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full mt-2 text-center py-1.5 text-purple-700 bg-purple-50 rounded border border-purple-100 hover:bg-purple-100">
                    Analyze Current Section
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-6">
          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="guidance">Guidance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit">
              <Card>
                <CardHeader>
                  <CardTitle>{sections[activeSection].title}</CardTitle>
                  <CardDescription>
                    Character Limit: {sections[activeSection].placeholder.length}/{sections[activeSection].characterLimit}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    className="w-full h-64 p-3 border rounded"
                    value={sections[activeSection].placeholder}
                    onChange={(e) => updateSectionText(activeSection, e.target.value)}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <HelpCircle size={16} className="mr-1" />
                    Use bullet points with metrics and quantifiable achievements
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-purple-100 text-purple-700 py-1 px-3 rounded flex items-center">
                      <Zap size={14} className="mr-1" />
                      Enhance with AI
                    </button>
                    <button className="bg-blue-100 text-blue-700 py-1 px-3 rounded">
                      Add Metrics
                    </button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Preview</CardTitle>
                  <CardDescription>
                    {rank} {rating} - {role} - {evalType} Evaluation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded p-4 bg-white">
                    {Object.entries(sections).map(([key, section]) => (
                      <div key={key} className="mb-4">
                        <h3 className="font-bold border-b border-gray-300 pb-1 mb-2">{section.title}</h3>
                        <p className="whitespace-pre-line">{section.placeholder}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <button className="flex items-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                    <FileText size={18} className="mr-2" />
                    Export as PDF
                  </button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="guidance">
              <Card>
                <CardHeader>
                  <CardTitle>Writing Guidance: {sections[activeSection].title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">What to Include:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {activeSection === 'professional' && (
                          <>
                            <li>Technical certifications maintained or obtained</li>
                            <li>Systems administered or maintained</li>
                            <li>Technical knowledge demonstrated</li>
                            <li>Training completed or conducted</li>
                          </>
                        )}
                        {activeSection === 'military' && (
                          <>
                            <li>Uniform inspections performance</li>
                            <li>Military bearing displayed</li>
                            <li>Physical readiness achievements</li>
                            <li>Military training completed</li>
                          </>
                        )}
                        {activeSection === 'teamwork' && (
                          <>
                            <li>Collaboration with other departments/divisions</li>
                            <li>Support provided to mission objectives</li>
                            <li>Contribution to team success</li>
                          </>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Strong Action Verbs:</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-100 px-2 py-1 rounded text-sm">Implemented</span>
                        <span className="bg-blue-100 px-2 py-1 rounded text-sm">Maintained</span>
                        <span className="bg-blue-100 px-2 py-1 rounded text-sm">Orchestrated</span>
                        <span className="bg-blue-100 px-2 py-1 rounded text-sm">Spearheaded</span>
                        <span className="bg-blue-100 px-2 py-1 rounded text-sm">Executed</span>
                        <span className="bg-blue-100 px-2 py-1 rounded text-sm">Managed</span>
                        <span className="bg-blue-100 px-2 py-1 rounded text-sm">Led</span>
                        <span className="bg-blue-100 px-2 py-1 rounded text-sm">Achieved</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Relevant Metrics:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Number of systems maintained</li>
                        <li>Percentage of uptime or availability</li>
                        <li>Number of personnel trained</li>
                        <li>Time saved or efficiency improved</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - Custom Metrics & Brag Sheet */}
        <div className="lg:col-span-3">
          {/* Metrics Library Panel */}
          {showMetrics && (
            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50 border-b border-blue-100">
                <CardTitle className="text-sm font-medium flex items-center text-blue-800">
                  <Database size={16} className="mr-2" />
                  Custom Metrics Library
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="mb-2">
                  <label className="text-xs text-gray-500 block mb-1">Search Metrics</label>
                  <input 
                    type="text" 
                    className="w-full border rounded p-1.5 text-sm" 
                    placeholder="Search by keyword..."
                  />
                </div>
                
                <div className="text-sm">
                  <h3 className="font-medium text-blue-800 mb-1 mt-3">{sections[activeSection].title} Metrics</h3>
                  <div className="space-y-1">
                    {customMetrics[activeSection].map((metric: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <button className="text-left px-2 py-1 hover:bg-blue-50 rounded w-full flex items-center text-gray-700">
                          <PlusCircle size={14} className="text-blue-600 mr-2 flex-shrink-0" />
                          {metric}
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t">
                    <button className="text-blue-700 text-xs flex items-center hover:underline">
                      <PlusCircle size={12} className="mr-1" />
                      Add Custom Metric
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Brag Sheet Panel */}
          {showBragSheet && (
            <Card className="mt-6 border-green-200">
              <CardHeader className="bg-green-50 border-b border-green-100 pb-3">
                <CardTitle className="text-sm font-medium flex items-center text-green-800">
                  <Star size={16} className="mr-2" />
                  Brag Sheet
                </CardTitle>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Calendar size={12} className="mr-1.5" />
                  Year-round accomplishment log
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-sm divide-y">
                  {bragSheetEntries.map(entry => (
                    <div key={entry.id} className="p-3 hover:bg-gray-50">
                      <div className="flex justify-between mb-1">
                        <div className="font-medium">{entry.title}</div>
                        <div className="text-xs text-gray-500">{entry.date}</div>
                      </div>
                      <p className="text-gray-600 text-xs mb-2">{entry.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {entry.metrics.map((metric, i) => (
                          <span key={i} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-100">
                            {metric}
                          </span>
                        ))}
                      </div>
                      
                      <button 
                        className={`text-xs py-1 px-2 rounded w-full flex items-center justify-center mt-1
                          ${entry.added 
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        disabled={entry.added}
                        onClick={() => addBragSheetEntry(entry)}
                      >
                        {entry.added ? "Added to Evaluation" : "Add to Evaluation"}
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 py-2 px-3">
                <button className="text-green-700 text-xs hover:underline flex items-center w-full">
                  <PlusCircle size={12} className="mr-1" />
                  Log New Accomplishment
                </button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationTemplateBuilder;
