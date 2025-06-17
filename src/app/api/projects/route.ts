import { NextResponse } from 'next/server';
import { supabase } from '../../../../supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const districtId = searchParams.get('district');

  if (!districtId) {
    return NextResponse.json({ error: 'District ID is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('projects')
    .select('id, name')
    .eq('district_id', districtId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}