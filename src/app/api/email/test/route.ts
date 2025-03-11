import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const RESEND_TEST_EMAIL = 'golinx.marketing@gmail.com' // The email verified with Resend

// GET endpoint for easier testing
export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const testEmailContent = {
      subject: "Test Email from NAVY Study",
      body: `
        <h2>Test Email</h2>
        <p>Hello,</p>
        <p>This is a test email from your NAVY Study Study Planner. If you're receiving this email, it means your email notification system is working correctly!</p>
        <p>Your authenticated email (${user.email}) will receive actual notifications when the system is fully configured.</p>
        <ul>
          <li>Email notifications are properly configured</li>
          <li>Your authentication is working</li>
          <li>The email template is rendering correctly</li>
        </ul>
        <p>You can now use the reminder system with confidence that notifications will be delivered to your inbox.</p>
      `
    }

    // In test mode, we must send to the verified Resend test email
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [RESEND_TEST_EMAIL], // Always send to the verified test email
      subject: testEmailContent.subject,
      html: getEmailTemplate(testEmailContent),
    })

    if (error) {
      console.error("Error sending test email:", error)
      return new NextResponse(JSON.stringify({
        error: error.message,
        details: error,
        context: "Failed to send test email"
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return NextResponse.json({
      message: "Test email sent successfully",
      emailId: data?.id,
      recipient: RESEND_TEST_EMAIL,
      note: "Test emails can only be sent to the verified Resend email address. Your actual notifications will be sent to your authenticated email."
    })
  } catch (error) {
    console.error("Error in test email API:", error)
    return new NextResponse(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
      context: "Internal server error in test email API"
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Existing POST endpoint
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const testEmailContent = {
      subject: "Test Email from NAVY Study",
      body: `
        <h2>Test Email</h2>
        <p>Hello ${user.email},</p>
        <p>This is a test email from your NAVY Study Study Planner. If you're receiving this email, it means your email notification system is working correctly!</p>
        <ul>
          <li>Email notifications are properly configured</li>
          <li>Your authentication is working</li>
          <li>The email template is rendering correctly</li>
        </ul>
        <p>You can now use the reminder system with confidence that notifications will be delivered to your inbox.</p>
      `
    }

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [user.email],
      subject: testEmailContent.subject,
      html: getEmailTemplate(testEmailContent),
    })

    if (error) {
      console.error("Error sending test email:", error)
      return new NextResponse(JSON.stringify({
        error: error.message,
        details: error,
        context: "Failed to send test email"
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return NextResponse.json({
      message: "Test email sent successfully",
      emailId: data?.id,
      recipient: user.email
    })
  } catch (error) {
    console.error("Error in test email API:", error)
    return new NextResponse(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
      context: "Internal server error in test email API"
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

function getEmailTemplate({ subject, body }: { subject: string; body: string }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.5;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px 8px 0 0;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #0066cc;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            font-size: 14px;
            color: #666666;
            background: #f8f9fa;
            border-radius: 0 0 8px 8px;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #0066cc;
            color: white !important;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
            font-weight: 500;
          }
          .button:hover {
            background-color: #0052a3;
          }
          .divider {
            height: 1px;
            background: #e9ecef;
            margin: 20px 0;
          }
          a {
            color: #0066cc;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          ul {
            padding-left: 20px;
          }
          li {
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">NAVY Study</div>
          </div>
          <div class="content">
            ${body}
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">
                View Study Planner
              </a>
            </div>
          </div>
          <div class="footer">
            <p>This is a test email from NAVY Study Study Planner.</p>
            <div class="divider"></div>
            <p>If you don't want to receive these emails, you can 
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">disable email notifications</a> 
              in your reminder settings.</p>
            <p>© ${new Date().getFullYear()} NAVY Study. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
