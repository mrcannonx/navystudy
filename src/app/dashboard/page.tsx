"use client"

import { useState, useEffect } from "react"
import { Loader2, Trophy, BookOpen, Brain, FileText, LineChart, BarChart3 } from "lucide-react"
import { useAuth } from "@/contexts/auth"
import { useTheme } from "@/contexts/theme-context"
import { Container } from "@/components/ui/container"
import { PageWithFooter } from "@/components/layout/page-with-footer"
import { ProfileCard } from "@/components/dashboard/cards/profile-card"
import { RankCard } from "@/components/dashboard/cards/rank-card"
import { NextExamCard } from "@/components/dashboard/next-exam-card"
import { QuickActionCard } from "@/components/dashboard/cards/quick-action-card"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { DailyQuoteCard } from "@/components/dashboard/cards/daily-quote-card"
import { cn } from "@/lib/utils"
import { useToast } from "@/contexts/toast-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LoadingSpinner } from "@/components/loading-spinner"
import { supabase } from "@/lib/supabase"

interface ProfileUpdateData {
    full_name?: string
    avatar_url?: string
}

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const { usThemeEnabled } = useTheme()
  const [insigniaUrl, setInsigniaUrl] = useState<string | null>(null)
  const [chevronUrl, setChevronUrl] = useState<string | null>(null)
  const [targetRankChevronUrl, setTargetRankChevronUrl] = useState<string | null>(null)
  const { addToast } = useToast()

    useEffect(() => {
        const fetchChevronAndInsignia = async () => {
            if (!profile?.rate) return

            try {
                // Fetch chevron for current rank
                if (profile?.rank) {
                    // Get the navy rank data directly using the rank name
                    const { data: chevronData, error: chevronError } = await supabase
                        .from('navy_ranks')
                        .select('image_url')
                        .eq("rank_code", profile.rank)
                        .eq('active', true)
                        .single()

                    if (chevronError) throw chevronError
                    if (chevronData) setChevronUrl(chevronData.image_url)
                }

                // Fetch insignia for rate
                if (profile?.rate) {
                    const { data: insigniaData, error: insigniaError } = await supabase
                        .from('insignias')
                        .select('image_url')
                        .eq('rate', profile.rate)
                        .eq('active', true)
                        .single()

                    if (insigniaError) throw insigniaError
                    if (insigniaData) setInsigniaUrl(insigniaData.image_url)
                }
            } catch (error) {
                console.error('Error fetching chevron or insignia:', error)
            }
        }

        const fetchTargetRankChevron = async () => {
            if (!profile?.exam_info?.target_rank) return

            try {
                // Get the navy rank data directly using the target rank name
                const { data: chevronData, error: chevronError } = await supabase
                    .from('navy_ranks')
                    .select('image_url')
                    .eq("rank_code", profile.exam_info.target_rank)
                    .eq('active', true)
                    .single()

                if (chevronError) throw chevronError
                if (chevronData) setTargetRankChevronUrl(chevronData.image_url)
            } catch (error) {
                console.error('Error fetching target rank chevron:', error)
            }
        }

        fetchChevronAndInsignia()
        fetchTargetRankChevron()
    }, [profile])

    const onProfileUpdate = async (data: ProfileUpdateData) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update(data)
                .eq('id', user?.id)

            if (error) throw error

            addToast({
                title: "Success",
                description: "Profile updated successfully",
            })
        } catch (error) {
            console.error('Error updating profile:', error)
            addToast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            })
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold">Access Denied</h1>
                    <p className="text-gray-500">Please sign in to view your dashboard</p>
                    <Link href={{ pathname: "/auth" }} className="inline-block">
                        <Button>Sign In</Button>
                    </Link>
                </div>
            </div>
        )
    }

    // Convert rate string to number if it exists
    const rateAsNumber = profile?.rate ? parseInt(profile.rate) : undefined

    return (
      <PageWithFooter>
        <Container className={cn("py-6", usThemeEnabled && "us-theme")}>
          <div className="max-w-[1400px] mx-auto space-y-6">
                    {/* Profile, Rank, and Next Exam Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 [&>*]:h-full">
                        {/* Profile Card */}
                        <div className="md:col-span-1">
                            <ProfileCard
                                name={profile?.full_name || user.email?.split('@')[0] || 'User'}
                                userId={user.id}
                                isAdmin={profile?.is_admin || false}
                                rank={profile?.rank || undefined}
                                rate={profile?.rate || undefined}
                                rateTitle={profile?.rate_title || undefined}
                                avatarUrl={profile?.avatar_url || undefined}
                                insigniaUrl={insigniaUrl || undefined}
                                onProfileUpdate={onProfileUpdate}
                            />
                        </div>

                        {/* Rank Card */}
                        <div className="md:col-span-1">
                            <RankCard
                                rank={profile?.rank || undefined}
                                rate={rateAsNumber}
                                rateTitle={profile?.rate_title || undefined}
                                insigniaUrl={chevronUrl || undefined}
                            />
                        </div>

                        {/* Next Exam Card */}
                        <div className="md:col-span-1">
                            <NextExamCard
                                examInfo={profile?.exam_info}
                                targetRankChevronUrl={targetRankChevronUrl}
                            />
                        </div>
                    </div>

                    {/* Daily Quote Card */}
                    <div className="w-full">
                        <DailyQuoteCard />
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 [&>*]:h-full">
                        <QuickActionCard
                            title="Study Flashcards"
                            description="Review and memorize key concepts"
                            icon={<BookOpen className="h-6 w-6" />}
                            href={{ pathname: "/flashcards" }}
                            color="blue"
                        />
                        <QuickActionCard
                            title="Take a Quiz"
                            description="Test your knowledge"
                            icon={<Brain className="h-6 w-6" />}
                            href={{ pathname: "/quiz" }}
                            color="purple"
                        />
                        <QuickActionCard
                            title="Summarize Text"
                            description="Generate concise summaries"
                            icon={<FileText className="h-6 w-6" />}
                            href={{ pathname: "/summarizer" }}
                            color="green"
                        />
                        <QuickActionCard
                            title="Eval Builder"
                            description="Create impactful Navy evaluations"
                            icon={<BarChart3 className="h-6 w-6" />}
                            href={{ pathname: "/eval-template-builder" }}
                            color="orange"
                        />
                    </div>

                    {/* Analytics Overview */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            <h2 className="text-xl font-semibold">Analytics Overview</h2>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                            <DashboardStats />
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <RecentActivity userId={user.id} />
                    </div>
                </div>
            </Container>
        </PageWithFooter>
    )
}
