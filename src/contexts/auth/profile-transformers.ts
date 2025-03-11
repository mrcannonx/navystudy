import type { Profile } from './types'

export function transformProfileResponse(profile: any): Profile {
  return {
    ...profile,
    chevron_url: profile.chevron?.image_url || null,
    exam_info: profile.preferences?.exam_info ? {
      ...profile.preferences.exam_info,
      target_rank_chevron_url: null // This will be populated separately when needed
    } : null
  }
}

export function transformProfileWithChevron(profile: any, chevronUrl: string | null = null): Profile {
  return {
    ...profile,
    chevron_url: chevronUrl || profile.chevron?.image_url || null,
    exam_info: profile.preferences?.exam_info ? {
      ...profile.preferences.exam_info,
      target_rank_chevron_url: chevronUrl
    } : null
  }
}

export function transformExamInfo(examInfo: any, targetRankChevronUrl: string | null = null) {
  if (!examInfo) return null
  return {
    ...examInfo,
    target_rank_chevron_url: targetRankChevronUrl
  }
}
