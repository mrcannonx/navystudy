// deno-lint-ignore-file no-explicit-any
/// <reference lib="deno.ns" />
/// <reference lib="dom" />
/// <reference types="https://esm.sh/@supabase/supabase-js@2.7.1" />

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

interface NotificationPayload {
  title: string
  body: string
  icon?: string
  data?: any
  tag?: string
}

interface ReminderSettings {
  id: string
  user_id: string
  enabled: boolean
  time: string
  days: string[]
  notification_types: string[]
  email_notifications: boolean
  session_reminders: boolean
  session_reminder_minutes: number
  smart_reminders: boolean
  reminder_frequency: string
  last_notification_sent?: string
}

console.log("Starting check-notifications function")

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get all active reminder settings
    const { data: settings, error: settingsError } = await supabase
      .from('reminder_settings')
      .select(`
        *,
        users:user_id (
          email
        )
      `)
      .eq('enabled', true)

    if (settingsError) throw settingsError

    const now = new Date()
    const currentDay = now.getDay().toString()
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })

    for (const setting of settings) {
      // Check if it's time to send notification
      if (
        setting.days.includes(currentDay) &&
        setting.time === currentTime &&
        (!setting.last_notification_sent ||
          new Date(setting.last_notification_sent).toDateString() !== now.toDateString())
      ) {
        // Get user's upcoming sessions
        const { data: sessions } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('user_id', setting.user_id)
          .gte('start_time', now.toISOString())
          .lte('start_time', new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString())
          .order('start_time')

        // Prepare notification payload
        const payload: NotificationPayload = {
          title: 'Daily Study Reminder',
          body: sessions?.length
            ? `You have ${sessions.length} study session${sessions.length > 1 ? 's' : ''} scheduled today.`
            : "Don't forget to schedule your study sessions for today!",
          icon: '/icons/notification-icon.png',
          tag: 'daily-reminder'
        }

        // Send browser notification
        if (setting.notification_types.includes('browser')) {
          // Get user's notification subscriptions
          const { data: subscriptions } = await supabase
            .from('notification_subscriptions')
            .select('subscription')
            .eq('user_id', setting.user_id)

          // Send notification to each subscription
          if (subscriptions?.length) {
            for (const sub of subscriptions) {
              await supabase.from('notifications').insert({
                user_id: setting.user_id,
                type: 'browser',
                payload,
                subscription: sub.subscription,
                status: 'pending'
              })
            }
          }
        }

        // Send email notification
        if (setting.email_notifications && setting.users?.email) {
          await supabase.functions.invoke('send-email', {
            body: {
              to: setting.users.email,
              subject: payload.title,
              text: payload.body
            }
          })
        }

        // Update last notification sent timestamp
        await supabase
          .from('reminder_settings')
          .update({ last_notification_sent: now.toISOString() })
          .eq('id', setting.id)
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('Error in check-notifications function:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: errorStack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
}) 