"use client"

import { useState, useEffect, useCallback } from "react"
import { InteractiveButton } from "@/components/ui/interactive-button"
import {
  InteractiveTabs,
  InteractiveTabsContent,
  InteractiveTabsList,
  InteractiveTabsTrigger,
} from "@/components/ui/interactive-tabs"
import { InteractiveTextarea } from "@/components/ui/interactive-textarea"
import { InteractiveInput } from "@/components/ui/interactive-input"
import { FileText, Wand2, BookOpen, Brain, Zap, Info, HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ContentFormProps {
  onSubmitAction: (data: {
    title: string
    description?: string
    content: string
    type: "quiz" | "flashcards"
  }) => void
}

export function EnhancedContentForm({ onSubmitAction }: ContentFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [type, setType] = useState<"quiz" | "flashcards">("quiz")
  const [contentLength, setContentLength] = useState(0)
  const [isValidContent, setIsValidContent] = useState(false)

  // Update content length and validation whenever content changes
  useEffect(() => {
    const trimmedContent = content.trim();
    setContentLength(trimmedContent.length);
    setIsValidContent(trimmedContent.length >= 50);
  }, [content]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isValidContent) return;
    onSubmitAction({ title, description, content, type })
  }, [onSubmitAction, title, description, content, type, isValidContent])

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }, [])

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  }, [])

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }, [])

  const handleTypeChange = useCallback((value: string) => {
    setType(value as "quiz" | "flashcards")
  }, [])

  // Example content templates
  const exampleQuizContent = "The water cycle, also known as the hydrologic cycle, describes the continuous movement of water on, above, and below the surface of the Earth. Water can change states among liquid, vapor, and ice at various places in the water cycle. The water cycle involves the following processes: evaporation, transpiration, condensation, precipitation, and runoff.\n\nEvaporation is the process by which water changes from a liquid to a gas or vapor. Water evaporates from the surfaces of oceans, lakes, and other bodies of water. Transpiration is the process by which moisture is carried through plants from roots to small pores on the underside of leaves, where it changes to vapor and is released to the atmosphere.";
  
  const exampleFlashcardContent = "Photosynthesis: The process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll.\n\nCellular Respiration: The process by which cells break down glucose and other molecules to release energy, producing carbon dioxide and water as byproducts.\n\nMitosis: A type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus.\n\nMeiosis: A type of cell division that results in four daughter cells each with half the number of chromosomes of the parent cell.";

  const insertExampleContent = useCallback(() => {
    setContent(type === "quiz" ? exampleQuizContent : exampleFlashcardContent);
  }, [type, exampleQuizContent, exampleFlashcardContent]);

  return (
    <Card className="border-2 border-blue-100 dark:border-blue-900 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-t-lg border-b border-blue-100 dark:border-blue-900">
        <CardTitle className="text-xl text-blue-800 dark:text-blue-300 flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          AI Content Generator
        </CardTitle>
        <CardDescription>
          Transform your study material into interactive learning content
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium flex items-center gap-1">
                Title
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-60">Give your study material a descriptive title</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <InteractiveInput
                id="title"
                placeholder="Enter a title for your study material"
                value={title}
                onChange={handleTitleChange}
                required
                className="border-blue-200 dark:border-blue-800 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium flex items-center gap-1">
                Description
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-60">Optional: Add a brief description of what this content covers</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <InteractiveInput
                id="description"
                placeholder="Enter a brief description"
                value={description}
                onChange={handleDescriptionChange}
                className="border-blue-200 dark:border-blue-800 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content Type</label>
              <InteractiveTabs 
                value={type} 
                onValueChange={handleTypeChange}
                className="border border-blue-200 dark:border-blue-800 rounded-lg p-1"
              >
                <InteractiveTabsList className="grid w-full grid-cols-2 mb-2">
                  <InteractiveTabsTrigger 
                    value="quiz"
                    className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900 data-[state=active]:text-blue-800 dark:data-[state=active]:text-blue-200"
                  >
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Quiz
                    </div>
                  </InteractiveTabsTrigger>
                  <InteractiveTabsTrigger 
                    value="flashcards"
                    className="data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900 data-[state=active]:text-blue-800 dark:data-[state=active]:text-blue-200"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Flashcards
                    </div>
                  </InteractiveTabsTrigger>
                </InteractiveTabsList>
                
                <div className="px-1 pb-1">
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md mb-4 text-sm">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        {type === "quiz" ? (
                          <p className="text-blue-800 dark:text-blue-300">
                            Our AI will generate multiple-choice questions with explanations to test your knowledge.
                          </p>
                        ) : (
                          <p className="text-blue-800 dark:text-blue-300">
                            Our AI will create flashcards with question-answer pairs for effective spaced repetition learning.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <InteractiveTabsContent value="quiz" className="mt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label htmlFor="quiz-content" className="text-sm font-medium">Study Material</label>
                        <button 
                          type="button" 
                          onClick={insertExampleContent}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Insert Example
                        </button>
                      </div>
                      <InteractiveTextarea
                        id="quiz-content"
                        placeholder="Paste your study material here. Our AI will generate quiz questions from it."
                        value={content}
                        onChange={handleContentChange}
                        className="min-h-[300px] border-blue-200 dark:border-blue-800 focus:ring-blue-500"
                        required
                      />
                      <div className="flex justify-between text-xs">
                        <span className={`${contentLength < 50 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                          {contentLength} characters {contentLength < 50 ? '(minimum 50)' : ''}
                        </span>
                        <span className="text-gray-500">
                          Recommended: 500+ characters for best results
                        </span>
                      </div>
                    </div>
                  </InteractiveTabsContent>
                  
                  <InteractiveTabsContent value="flashcards" className="mt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label htmlFor="flashcard-content" className="text-sm font-medium">Study Material</label>
                        <button 
                          type="button" 
                          onClick={insertExampleContent}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Insert Example
                        </button>
                      </div>
                      <InteractiveTextarea
                        id="flashcard-content"
                        placeholder="Paste your study material here. Our AI will generate flashcards from it."
                        value={content}
                        onChange={handleContentChange}
                        className="min-h-[300px] border-blue-200 dark:border-blue-800 focus:ring-blue-500"
                        required
                      />
                      <div className="flex justify-between text-xs">
                        <span className={`${contentLength < 50 ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                          {contentLength} characters {contentLength < 50 ? '(minimum 50)' : ''}
                        </span>
                        <span className="text-gray-500">
                          Recommended: 500+ characters for best results
                        </span>
                      </div>
                    </div>
                  </InteractiveTabsContent>
                </div>
              </InteractiveTabs>
            </div>
          </div>

          <InteractiveButton 
            type="submit" 
            className={`w-full ${!isValidContent ? 'opacity-70 cursor-not-allowed' : ''} bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700`}
            disabled={!isValidContent}
          >
            <div className="flex items-center justify-center gap-2">
              <Zap className="h-5 w-5" />
              Generate {type === "quiz" ? "Quiz" : "Flashcards"}
            </div>
          </InteractiveButton>
        </form>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 rounded-b-lg">
        <div className="flex items-center gap-1">
          <Info className="h-3.5 w-3.5" />
          <span>For best results, provide detailed and structured content with key concepts clearly explained.</span>
        </div>
      </CardFooter>
    </Card>
  )
}