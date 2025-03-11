# Vercel Deployment Guide for Navy Study Application

This guide provides step-by-step instructions for deploying the Navy Study application to Vercel.

## Prerequisites

- A GitHub account with access to the repository
- A Vercel account (can be created at [vercel.com](https://vercel.com))
- Supabase project set up with necessary tables
- Stripe account (if using payment features)
- Anthropic API key (for AI features)

## Deployment Steps

### 1. Connect Your Repository to Vercel

1. Log in to your Vercel account
2. Click "Add New" > "Project"
3. Select the GitHub repository (`navystudy`)
4. Click "Import"

### 2. Configure Project Settings

1. **Framework Preset**: Ensure "Next.js" is selected
2. **Build and Output Settings**: These should be automatically detected from your `vercel.json` file
3. **Root Directory**: Leave as `.` (project root)

### 3. Set Up Environment Variables

Add the following environment variables in the Vercel project settings:

```
# Application Settings
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app

# Database Settings
DATABASE_URL=postgresql://postgres:postgres@your-production-db-host:5432/rankstudydb

# Authentication
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=your-secure-nextauth-secret

# Supabase Settings
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Stripe Settings
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# AI Service Settings
ANTHROPIC_API_KEY=your-anthropic-api-key
ANTHROPIC_MODEL=claude-3-opus-20240229

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your-ga-id

# API Keys
DATA_REFRESH_API_KEY=your-data-refresh-api-key
```

### 4. Deploy Your Application

1. Click "Deploy"
2. Wait for the build and deployment to complete
3. Once deployed, Vercel will provide a URL to access your application

### 5. Set Up Custom Domain (Optional)

1. In your project dashboard, go to "Settings" > "Domains"
2. Add your custom domain and follow the instructions to configure DNS settings

### 6. Configure Stripe Webhook (If Using Payments)

1. In your Stripe Dashboard, go to "Developers" > "Webhooks"
2. Add a new endpoint with your Vercel URL + `/api/stripe/webhooks`
3. Select the events you need (typically `checkout.session.completed`, `customer.subscription.updated`, etc.)
4. Copy the webhook signing secret and add it to your Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### 7. Set Up Cron Jobs

The `vercel.json` file already includes configuration for cron jobs:
- Daily streak checking at midnight: `/api/cron/check-streaks`
- Data refresh at 2 AM: `/api/education/refresh?key=$DATA_REFRESH_API_KEY`

Ensure your `DATA_REFRESH_API_KEY` environment variable is set correctly.

### 8. Verify Deployment

1. Visit your deployed application URL
2. Test key functionality to ensure everything works as expected
3. Check logs in the Vercel dashboard for any errors

## Troubleshooting

### Build Failures

- Check the build logs in Vercel for specific errors
- Ensure all dependencies are correctly specified in `package.json`
- Verify that all environment variables are correctly set

### API Errors

- Check that all environment variables are correctly set
- Verify database connection strings and API keys
- Check Vercel logs for specific error messages

### Database Connection Issues

- Ensure your database is accessible from Vercel's servers
- Check that the connection string is correct
- Verify that database credentials are valid

## Maintenance

### Updating Your Application

1. Push changes to your GitHub repository
2. Vercel will automatically deploy the changes

### Monitoring

- Use Vercel Analytics to monitor performance
- Set up alerts for errors and performance issues
- Regularly check logs for any recurring issues

## Security Considerations

- Never commit sensitive environment variables to your repository
- Use Vercel's environment variable encryption for sensitive values
- Regularly rotate API keys and secrets
- Enable 2FA for your Vercel and GitHub accounts