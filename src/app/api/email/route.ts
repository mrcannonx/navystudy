import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { subject, body } = await request.json()

    if (!subject || !body) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [user.email],
      subject,
      html: getEmailTemplate({ subject, body }),
    })

    if (error) {
      console.error("Error sending email:", error)
      return new NextResponse(error.message, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in email API:", error)
    return new NextResponse("Internal Error", { status: 500 })
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
            <p>This email was sent from NAVY Study Study Planner.</p>
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
