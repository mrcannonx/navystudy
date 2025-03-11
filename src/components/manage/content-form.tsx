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

interface ContentFormProps {
  onSubmitAction: (data: {
    title: string
    description?: string
    content: string
    type: "quiz" | "flashcards"
  }) => void
}

export function ContentForm({ onSubmitAction }: ContentFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [type, setType] = useState<"quiz" | "flashcards">("quiz")

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmitAction({ title, description, content, type })
  }, [onSubmitAction, title, description, content, type])

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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Title</label>
          <InteractiveInput
            id="title"
            placeholder="Enter a title for your study material"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <InteractiveInput
            id="description"
            placeholder="Enter a brief description"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Content Type</label>
          <InteractiveTabs value={type} onValueChange={handleTypeChange}>
            <InteractiveTabsList className="grid w-full grid-cols-2">
              <InteractiveTabsTrigger value="quiz">Quiz</InteractiveTabsTrigger>
              <InteractiveTabsTrigger value="flashcards">Flashcards</InteractiveTabsTrigger>
            </InteractiveTabsList>
            <InteractiveTabsContent value="quiz" className="mt-4">
              <div className="space-y-2">
                <label htmlFor="quiz-content" className="text-sm font-medium">Study Material</label>
                <InteractiveTextarea
                  id="quiz-content"
                  placeholder="Paste your study material here. Our AI will generate quiz questions from it."
                  value={content}
                  onChange={handleContentChange}
                  className="min-h-[300px]"
                  required
                />
              </div>
            </InteractiveTabsContent>
            <InteractiveTabsContent value="flashcards" className="mt-4">
              <div className="space-y-2">
                <label htmlFor="flashcard-content" className="text-sm font-medium">Study Material</label>
                <InteractiveTextarea
                  id="flashcard-content"
                  placeholder="Paste your study material here. Our AI will generate flashcards from it."
                  value={content}
                  onChange={handleContentChange}
                  className="min-h-[300px]"
                  required
                />
              </div>
            </InteractiveTabsContent>
          </InteractiveTabs>
        </div>
      </div>

      <InteractiveButton type="submit" className="w-full">
        Generate {type === "quiz" ? "Quiz" : "Flashcards"}
      </InteractiveButton>
    </form>
  )
}
