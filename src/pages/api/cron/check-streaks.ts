import { NextApiRequest, NextApiResponse } from 'next'
import { checkAndResetStreaks } from '@/components/flashcards/modules/jobs/streak-checker'
import { checkAndResetQuizStreaks } from '@/components/quiz/modules/jobs/streak-checker'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify the request is from the cron job service
  const authHeader = req.headers.authorization
  if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Check both flashcard and quiz streaks
    await Promise.all([
      checkAndResetStreaks(),
      checkAndResetQuizStreaks()
    ])
    
    res.status(200).json({ message: 'Streak checks completed successfully' })
  } catch (error) {
    console.error('Error in streak check cron job:', error)
    res.status(500).json({ error: 'Failed to check streaks' })
  }
} 