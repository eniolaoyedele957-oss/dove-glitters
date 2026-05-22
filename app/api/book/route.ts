import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, service, date, time, notes } = body

    // Save to Supabase
    const { error } = await getSupabase().from('bookings').insert([{
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      service,
      date,
      time,
      message: notes || '',
      status: 'pending'
    }])

    if (error) console.error('Supabase error:', error)

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Route error:', err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}