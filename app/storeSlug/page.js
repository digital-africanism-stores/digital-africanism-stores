// app/[storeSlug]/page.js
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic'; // Explicitly forces dynamic rendering for live data

export default async function StorefrontPage({ params }) {
  const { storeSlug } = await params;

  // 1. Find the Store
  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', storeSlug)
    .single();

  if (!store) notFound();

  // 2. Get Products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#24A1DE] p-6 text-white">
        <h1 className="text-2xl font-bold">{store.store_name}</h1>
        <p className="opacity-90 text-sm">@{store.telegram_username}</p>
      </div>

      {/* Product Grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {products?.map((item) => (
          <div key={item.id} className="border rounded-lg p-3 hover:shadow-md transition">
            <div className="h-32 bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-400">
              {/* Added proper alt tag for best practices */}
              {item.image_url ? (
                <img src={item.image_url} alt={item.title} className="h-full w-full object-cover rounded"/>
              ) : (
                'No Image'
              )}
            </div>
            <h3 className="font-semibold text-sm truncate">{item.title}</h3>
            <div className="flex justify-between items-center mt-2">
              <span className="text-green-600 font-bold">{item.price} ETB</span>
              {/* Fixed the Telegram URL string interpolation and slashes */}
              <a 
                href={`https://t.me/${store.telegram_username}?text=I want to buy ${item.title}`}
                className="bg-black text-white text-xs px-2 py-1 rounded"
              >
                Buy
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}