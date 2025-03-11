import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// GET handler to fetch saved calculations
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const calculatorType = searchParams.get('calculatorType') || 'fms'
  
  console.log(`DEBUG API: GET request for calculator_type=${calculatorType}`)
  
  const supabase = createRouteHandlerClient({ cookies })
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    console.log('DEBUG API: No session found, returning 401')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  console.log(`DEBUG API: User authenticated, user_id=${session.user.id}`)
  
  // Get user's saved calculations for the specified calculator type
  console.log(`DEBUG API: Querying calculator_data for user_id=${session.user.id} and calculator_type=${calculatorType}`)
  const { data, error } = await supabase
    .from('calculator_data')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('calculator_type', calculatorType)
    .order('updated_at', { ascending: false })
  
  if (error) {
    console.log('DEBUG API: Database error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  console.log(`DEBUG API: Found ${data?.length || 0} calculations`)
  if (data && data.length > 0) {
    console.log('DEBUG API: First calculation data:', {
      id: data[0].id,
      name: data[0].name,
      calculator_type: data[0].calculator_type,
      created_at: data[0].created_at,
      updated_at: data[0].updated_at,
      data_summary: data[0].data ? `Has ${data[0].data.evaluations?.length || 0} evaluations` : 'No data'
    })
  }
  
  return NextResponse.json({ calculations: data })
}

// POST handler to save a calculation
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { name, data, calculatorType = 'fms' } = await request.json()
    
    if (!name || !data) {
      return NextResponse.json({ error: 'Name and data are required' }, { status: 400 })
    }
    
    // Insert the calculation
    const { data: savedData, error } = await supabase
      .from('calculator_data')
      .insert({
        user_id: session.user.id,
        calculator_type: calculatorType,
        name,
        data,
        version: '1.0'
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ calculation: savedData })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
}

// PUT handler to update a calculation
export async function PUT(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { id, name, data, is_favorite } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Calculation ID is required' }, { status: 400 })
    }
    
    // Prepare update data
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (data !== undefined) updateData.data = data
    if (is_favorite !== undefined) updateData.is_favorite = is_favorite
    
    // Always update the updated_at timestamp
    updateData.updated_at = new Date().toISOString()
    
    // Update the calculation
    const { data: updatedData, error } = await supabase
      .from('calculator_data')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', session.user.id) // Ensure user can only update their own data
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ calculation: updatedData })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }
}

// DELETE handler to delete a calculation
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'Calculation ID is required' }, { status: 400 })
  }
  
  const supabase = createRouteHandlerClient({ cookies })
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Delete the calculation
  const { error } = await supabase
    .from('calculator_data')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id) // Ensure user can only delete their own data
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ success: true })
}