import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { routes } from '@/types/routes'
import EvalTemplateBuilderPage from '@/components/eval-template-builder/page-client'
import { Metadata } from "next"
import "./enhanced-styles.css"

export const metadata: Metadata = {
  title: "Navy Evaluation Builder | Create Professional Evaluations",
  description: "Create professional, impactful Navy evaluations with customizable formats, AI-powered enhancements, and brag sheet integration.",
}

export default async function EvaluationTemplateBuilderPage() {
  // Check if user is authenticated
  const session = await auth()
  if (!session?.user) {
    // Redirect to auth page if not authenticated
    redirect(`${routes.auth}?returnTo=${routes.evalTemplateBuilder}`)
  }

  return (
    <>
      <EvalTemplateBuilderPage userId={session.user.id} />
    </>
  )
}
