// File: app/admin/create-store/page.tsx
'use client';

import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function CreateStoreForm() {
  const [storeLink, setStoreLink] = useState('');

  const handleGoLive = async () => {
    if (!storeLink) return alert("Please enter a unique link.");

    const { error } = await supabase
      .from('stores')
      .update({ status: 'live' })
      .eq('unique_link', storeLink);
      
    if (error) {
      alert("Error going live: " + error.message);
    } else {
      alert("Store is now Live! The public can now see it.");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Manage Store - Preview Mode</h2>
      
      <input 
        type="text" 
        placeholder="Enter /unique-link" 
        value={storeLink}
        onChange={(e) => setStoreLink(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
      />

      <button 
        onClick={handleGoLive} 
        className="w-full bg-[#2094f3] text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
      >
        🚀 Go Live
      </button>
    </div>
  );
}