import axios from 'axios'

export interface EmailContent {
  subject: string
  body: string
}

export class EmailService {
  private static instance: EmailService

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  public async sendStudyReminder(to: string, content: EmailContent) {
    try {
      await axios.post('/api/email', content)
      return true
    } catch (error) {
      console.error('Error sending email:', error)
      return false
    }
  }
}

export const emailService = EmailService.getInstance() 