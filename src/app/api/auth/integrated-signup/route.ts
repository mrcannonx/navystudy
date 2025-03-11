import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    // Log the start of the request for debugging
    console.log('Starting integrated signup process');
    
    const { email, password, priceId } = await req.json();
    
    // Log the received data (excluding password for security)
    console.log('Received signup data:', { email, priceId, passwordProvided: !!password });
    
    // Validate required fields
    if (!email || !password || !priceId) {
      console.log('Missing required fields:', { 
        emailMissing: !email, 
        passwordMissing: !password, 
        priceIdMissing: !priceId 
      });
      
      return NextResponse.json(
        { error: 'Email, password, and priceId are required' },
        { status: 400 }
      );
    }
    
    // Verify environment variables are set
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error('Missing NEXT_PUBLIC_APP_URL environment variable');
      return NextResponse.json(
        { error: 'Server configuration error: Missing redirect URL' },
        { status: 500 }
      );
    }
    
    console.log('Creating user account with Supabase Auth');
    
    // Create the user account
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      }
    });
    
    if (signUpError) {
      console.error('Supabase Auth signup error:', signUpError);
      
      // Check if the error is because the user already exists
      if (signUpError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'User already registered' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: signUpError.message },
        { status: 400 }
      );
    }
    
    if (!authData.user) {
      console.error('No user data returned from Supabase Auth');
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }
    
    console.log('User created successfully:', { userId: authData.user.id });
    
    // Create a profile record for the user
    console.log('Creating profile record for user:', authData.user.id);
    
    try {
      // First check if a profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authData.user.id)
        .single();
        
      if (checkError && !checkError.message.includes('no rows')) {
        console.error('Error checking for existing profile:', checkError);
      }
      
      if (!existingProfile) {
        // Create the profile with all required fields
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            full_name: authData.user.user_metadata?.full_name || null,
            preferences: {},
            is_admin: false
          })
          .select();
          
        if (profileError) {
          console.error('Error creating profile record:', profileError);
          // Log more details about the error
          console.error('Profile creation error details:', {
            code: profileError.code,
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint
          });
        } else if (newProfile) {
          console.log('Profile record created successfully:', newProfile[0].id);
        } else {
          console.warn('No profile data returned after insert');
        }
      } else {
        console.log('Profile already exists for user:', authData.user.id);
      }
    } catch (profileCreationError) {
      console.error('Unexpected error during profile creation:', profileCreationError);
    }
    
    try {
      console.log('Creating Stripe checkout session with priceId:', priceId);
      
      // Create a checkout session with trial
      const checkoutSession = await createCheckoutSession(
        authData.user.id,
        priceId,
        `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        `${process.env.NEXT_PUBLIC_APP_URL}/auth?canceled=true`
      );
      
      console.log('Checkout session created successfully:', { 
        sessionId: checkoutSession.id,
        hasUrl: !!checkoutSession.url 
      });
      
      // Return the checkout URL
      return NextResponse.json({
        userId: authData.user.id,
        checkoutUrl: checkoutSession.url
      });
    } catch (stripeError) {
      console.error('Stripe checkout session creation error:', stripeError);
      
      // Provide more specific error message based on the Stripe error
      let errorMessage = 'Failed to create checkout session';
      
      if (stripeError instanceof Error) {
        // Check for common Stripe errors
        if (stripeError.message.includes('No such price')) {
          errorMessage = 'Invalid price ID. The subscription plan may not exist.';
        } else if (stripeError.message.includes('api key')) {
          errorMessage = 'Stripe API key configuration error.';
        } else {
          errorMessage = stripeError.message;
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    // Log the full error for debugging
    console.error('Unhandled error in integrated signup:', error);
    
    // Provide a more helpful error message if possible
    let errorMessage = 'Failed to process signup';
    if (error instanceof Error) {
      errorMessage = `${errorMessage}: ${error.message}`;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
