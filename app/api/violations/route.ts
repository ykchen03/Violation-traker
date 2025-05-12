import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('violations')
      .select('*')
      .order('count', { ascending: false });
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ violations: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plate } = body;
    
    if (!plate) {
      return NextResponse.json({ error: 'Plate is required' }, { status: 400 });
    }
    
    const normalizedPlate = plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    // Check if plate exists
    const { data, error } = await supabase
      .from('violations')
      .select('*')
      .eq('plate', normalizedPlate)
      .maybeSingle();
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (data) {
      // Plate exists, increment count
      const { error: updateError } = await supabase
        .from('violations')
        .update({ 
          count: data.count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('plate', normalizedPlate);
        
      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
      
      return NextResponse.json({ 
        message: `Plate '${normalizedPlate}' count incremented!`,
        plate: normalizedPlate,
        count: data.count + 1
      });
    } else {
      // Plate doesn't exist, insert new
      const { error: insertError } = await supabase
        .from('violations')
        .insert({ 
          plate: normalizedPlate, 
          count: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
      
      return NextResponse.json({
        message: `'${normalizedPlate}' added successfully!`,
        plate: normalizedPlate,
        count: 1
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}