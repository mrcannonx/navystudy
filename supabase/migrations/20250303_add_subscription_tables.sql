-- Create subscription plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly INTEGER NOT NULL,
  price_yearly INTEGER NOT NULL,
  features JSONB,
  stripe_monthly_price_id TEXT,
  stripe_yearly_price_id TEXT,
  trial_days INTEGER DEFAULT 3,
  active BOOLEAN DEFAULT true
);

-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  plan_id UUID REFERENCES public.subscription_plans(id) NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  payment_method TEXT
);

-- Set up row level security
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read subscription plans
CREATE POLICY "Anyone can read subscription plans"
  ON public.subscription_plans FOR SELECT
  USING (true);

-- Create policy to allow service role to modify subscription plans
CREATE POLICY "Service role can modify subscription plans"
  ON public.subscription_plans FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policy to allow users to read their own subscriptions
CREATE POLICY "Users can read their own subscriptions"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow service role to modify user subscriptions
CREATE POLICY "Service role can modify user subscriptions"
  ON public.user_subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);
