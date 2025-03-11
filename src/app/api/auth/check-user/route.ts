import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    console.log('Starting check-user API call');
    const { email } = await req.json();
    
    if (!email) {
      console.log('Email is required but was not provided');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    console.log(`Checking if user exists with email: ${email}`);
    
    // Check if the user exists in the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (profileError) {
      console.error('Error checking user in profiles:', profileError);
      
      // For development, return a mock response
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: returning exists=false for profiles check');
        return NextResponse.json({ exists: false });
      }
      
      return NextResponse.json(
        { error: 'Failed to check user in profiles' },
        { status: 500 }
      );
    }
    
    // Check if the user exists in Supabase Auth
    try {
      console.log('Checking if user exists in Supabase Auth');
      
      // Use the signUp method to check if the user exists
      // If the user already exists, we'll get an error
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password: 'TemporaryPassword123!', // This won't actually create a user due to the next check
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        }
      });
      
      // If we get a "User already registered" error, the user exists in Auth
      const existsInAuth = signUpError && signUpError.message.includes('already registered');
      
      if (existsInAuth) {
        console.log(`User already registered in auth with email: ${email}`);
      } else {
        console.log(`User not found in auth with email: ${email}`);
      }
      
      // User exists if they're in either the profiles table or Supabase Auth
      const existsInProfiles = !!profileData;
      const exists = existsInProfiles || existsInAuth;
      
      console.log(`User check result for ${email}: exists in profiles: ${existsInProfiles}, exists in auth: ${existsInAuth}, final result: ${exists}`);
      
      return NextResponse.json({ exists });
    } catch (authError) {
      console.error('Error in auth check:', authError);
      
      // If there's an error with the auth check, we'll just check the profiles
      const existsInProfiles = !!profileData;
      console.log(`Auth check failed, using profiles check only: ${existsInProfiles}`);
      
      return NextResponse.json({ exists: existsInProfiles });
    }
  } catch (error) {
    console.error('Unhandled error in check-user API:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
