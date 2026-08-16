// app/api/create-product/route.js
import { supabaseAdmin } from '@/lib/supabase'; // Use Admin client to bypass RLS for inserts
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { telegramId, telegramUsername, storeName, slug, productTitle, productPrice } = body;

    // 1. Validation
    if (!telegramId || !slug || !productTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Find or Create Store
    let { data: store } = await supabaseAdmin
      .from('stores')
      .select('id')
      .eq('telegram_id', telegramId)
      .single();

    if (!store) {
      // Check if slug is taken by someone else
      const { data: taken } = await supabaseAdmin.from('stores').select('id').eq('slug', slug).single();
      if (taken) return NextResponse.json({ error: 'Shop URL already taken!' }, { status: 400 });

      // Create new store
      const { data: newStore, error } = await supabaseAdmin
        .from('stores')
        .insert([{ telegram_id: telegramId, telegram_username: telegramUsername, store_name: storeName, slug }])
        .select()
        .single();
      
      if (error) throw error;
      store = newStore;
    }

    // 3. Add Product
    const { error: prodError } = await supabaseAdmin
      .from('products')
      .insert([{ 
        store_id: store.id, 
        title: productTitle, 
        price: productPrice 
      }]);

    if (prodError) throw prodError;

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}