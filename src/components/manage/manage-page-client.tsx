"use client"

import { useState } from "react"
import { EnhancedContentForm } from "@/components/manage/enhanced-content-form"
import { EnhancedManageHero } from "@/components/manage/enhanced-manage-hero"
import { generateContent } from "@/lib/ai-service"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth"
import { useToast } from "@/contexts/toast-context"
import { useRouter } from "next/navigation"
import { EnhancedLoadingState } from "@/components/manage/enhanced-loading-state"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function ManagePageClient() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, message: "" });
  const { user, loading: authLoading } = useAuth()
  const { addToast } = useToast()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <div className="text-center space-y-4 p-8">
          <div className="inline-flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-75 blur-sm animate-pulse"></div>
              <div className="relative bg-white dark:bg-gray-900 rounded-full p-4">
                <div className="h-10 w-10 text-blue-600 dark:text-blue-400">
                  <LoadingSpinner />
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 animate-pulse">Verifying your account...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <div className="text-center space-y-6 max-w-md p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-blue-100 dark:border-blue-900">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V8a3 3 0 00-3-3H6a3 3 0 00-3 3v1m12-1v1m0 0v1m0-1h2m-2 0h-2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">Please sign in to create and manage your study materials</p>
          <Link href="/auth" className="inline-block">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Timeout promise for database operations
  const createTimeoutPromise = (ms: number) => {
    return new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Operation timed out after ${ms/1000} seconds`)), ms);
    });
  };

  // Validate quiz questions before saving
  const validateQuizQuestions = (questions: any[]) => {
    if (!Array.isArray(questions)) {
      return { valid: false, message: 'Questions must be an array' };
    }
    
    if (questions.length === 0) {
      return { valid: false, message: 'No questions were generated' };
    }
    
    const invalidQuestions = questions.filter(q =>
      !q.id ||
      typeof q.id !== 'string' ||
      !q.question ||
      typeof q.question !== 'string' ||
      !q.question.trim() ||
      !q.options ||
      !Array.isArray(q.options) ||
      q.options.length < 2 ||
      !q.correctAnswer ||
      typeof q.correctAnswer !== 'string' ||
      !q.correctAnswer.trim() ||
      !q.explanation ||
      typeof q.explanation !== 'string' ||
      !q.explanation.trim()
    );
    
    if (invalidQuestions.length > 0) {
      return {
        valid: false,
        message: `${invalidQuestions.length} invalid questions detected`,
        invalidQuestions
      };
    }
    
    return { valid: true };
  };

  const handleSubmit = async (data: {
    title: string
    description?: string
    content: string
    type: "quiz" | "flashcards"
  }) => {
    try {
      setLoading(true);
      setProgress({
        current: 0,
        total: 0,
        message: "Preparing content for processing..."
      });
      setError(null);

      if (!data.content?.trim()) {
        throw new Error('Please enter some content to process');
      }

      const chunks = Math.ceil(data.content.length / 1500);
      setProgress(prev => ({
        ...prev,
        total: chunks,
        message: `Preparing to process ${chunks} chunks of content...`
      }));

      const onProgressUpdate = (current: number, message?: string) => {
        setProgress(prev => ({
          ...prev,
          current,
          message: message || `Processing chunk ${current} of ${chunks}...`
        }));
      };

      const generatedContent = await generateContent(
        data.content,
        data.type,
        {
          maxChunkSize: 1500,
          deduplicationThreshold: 0.75,
          onProgress: onProgressUpdate
        }
      );

      if (!generatedContent) {
        throw new Error('No content was generated');
      }

      setProgress(prev => ({
        ...prev,
        message: "Saving generated content..."
      }));

      // Format the content based on type
      const contentToSave = data.type === "flashcards"
        ? {
            title: data.title,
            description: data.description || '',
            cards: generatedContent.cards || [],
            metadata: generatedContent.metadata || {
              cardTypes: { basic: 0, cloze: 0, reversed: 0 },
              difficulties: { easy: 0, medium: 0, hard: 0 },
              averageComplexity: 0
            },
            user_id: user?.id
          }
        : {
            title: data.title,
            description: data.description || '',
            questions: {
              questions: generatedContent.questions
            },
            user_id: user?.id
          };

      // Enhanced logging - Solution 1: Add Better Error Logging
      console.log('Attempting to save to database:', {
        tableName: data.type === "quiz" ? "quizzes" : "flashcards",
        contentSize: JSON.stringify(contentToSave).length,
        itemCount: data.type === "quiz"
          ? ((contentToSave as any).questions.questions?.length || 0)
          : (Array.isArray((contentToSave as any).cards) ? (contentToSave as any).cards.length : 0)
      });

      // Solution 4: Check for Data Validation Issues
      if (data.type === "quiz") {
        // Get the questions array from the nested structure
        const questionsArray = (contentToSave as any).questions.questions;
        const validation = validateQuizQuestions(questionsArray);
        if (!validation.valid) {
          console.error('Quiz validation failed:', validation);
          throw new Error(`Validation error: ${validation.message}`);
        }
      }

      // For large quizzes, add extra logging and handling
      const questionCount = data.type === "quiz" ?
        ((contentToSave as any).questions.questions?.length || 0) :
        (Array.isArray((contentToSave as any).cards) ? (contentToSave as any).cards.length : 0);
      if (data.type === "quiz" && questionCount > 10) {
        setProgress(prev => ({
          ...prev,
          message: "Preparing to save large quiz..."
        }));
        
        // Log the size of the payload
        const payloadSize = JSON.stringify(contentToSave).length;
        console.log(`Large quiz being saved: ${questionCount} questions, ${payloadSize} bytes`);
        
        // If the payload is extremely large, add a warning
        if (payloadSize > 500000) { // 500KB
          console.warn(`Very large quiz payload: ${Math.round(payloadSize/1024)}KB. This may cause performance issues.`);
          setProgress(prev => ({
            ...prev,
            message: "Saving large quiz (this may take longer)..."
          }));
        }
        
        // Save the quiz with timeout handling
        const savePromise = supabase
          .from('quizzes')
          .insert(contentToSave)
          .select()
          .single();
          
        const { error: dbError, data: savedData } = await Promise.race([
          savePromise,
          createTimeoutPromise(60000) // 60 second timeout for large quizzes
        ]) as any;
        
        if (dbError) {
          console.error('Database error saving large quiz:', {
            code: dbError.code,
            message: dbError.message,
            details: dbError.details,
            hint: dbError.hint,
            payloadSize
          });
          
          // If it's a payload size issue, provide a more helpful error
          if (dbError.message?.includes('payload') || payloadSize > 1000000) {
            throw new Error(`The quiz is too large to save (${Math.round(payloadSize/1024)}KB). Try creating a smaller quiz with less content.`);
          }
          
          throw new Error(`Failed to save quiz: ${dbError.message}`);
        }
        
        if (!savedData) {
          throw new Error('Failed to save quiz to database');
        }
        
        // Success case for large quiz saving
        addToast({
          title: "Success!",
          description: `Your quiz with ${questionCount} questions has been created successfully.`,
          variant: "default",
        });
        
        router.push(`/quiz`);
        return; // Exit early since we've handled the success case
        
        // Success case for batched quiz saving
        addToast({
          title: "Success!",
          description: `Your quiz has been created successfully.`,
          variant: "default",
        });
        
        router.push(`/quiz`);
        return; // Exit early since we've handled the success case
      } else {
        // Original save logic for smaller content with timeout
        const savePromise = supabase
          .from(data.type === "quiz" ? "quizzes" : "flashcards")
          .insert(contentToSave)
          .select()
          .single();
          
        const { error: dbError, data: savedData } = await Promise.race([
          savePromise,
          createTimeoutPromise(30000) // 30 second timeout
        ]) as any;

        if (dbError) {
          console.error('Database error details:', {
            code: dbError.code,
            message: dbError.message,
            details: dbError.details,
            hint: dbError.hint
          });
          throw new Error(`Database error: ${dbError.message}`);
        }

        if (!savedData) {
          throw new Error('Failed to save content to database');
        }
        
        // Success case for regular saving
        addToast({
          title: "Success!",
          description: `Your ${data.type} has been created successfully.`,
          variant: "default",
        });
        
        router.push(`/${data.type}`);
      }
      
      // We've already handled success cases with early returns above
    } catch (err) {
      console.error("Error creating content:", err);
      const errorMessage = err instanceof Error ? err.message : 
        (typeof err === 'object' && err !== null ? JSON.stringify(err) : "An error occurred");
      setError(errorMessage);
      addToast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <EnhancedManageHero />
      <div className="container max-w-4xl py-8">
        <div className="border-0">
          {loading ? (
            <div className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-800">
              <EnhancedLoadingState
                text={progress.message || `Generating your study material...`}
                progress={{ current: progress.current, total: progress.total }}
              />
            </div>
          ) : (
            <EnhancedContentForm onSubmitAction={handleSubmit} />
          )}
        </div>
      </div>
    </div>
  )
}
