import { NextApiRequest, NextApiResponse } from 'next'
import { checkAndResetStreaks } from '@/components/flashcards/modules/jobs/streak-checker'
import { checkAndResetQuizStreaks } from '@/components/quiz/modules/jobs/streak-checker'

// Only allow this endpoint in development
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' })
  }

  try {
    // Check both flashcard and quiz streaks
    await Promise.all([
      checkAndResetStreaks(),
      checkAndResetQuizStreaks()
    ])
    
    res.status(200).json({ message: 'Streak checks completed successfully' })
  } catch (error) {
    console.error('Error in dev streak check:', error)
    res.status(500).json({ error: 'Failed to check streaks' })
  }
} 