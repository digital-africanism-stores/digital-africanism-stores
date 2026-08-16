// app/dashboard-form/page.js
'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [status, setStatus] = useState('idle'); // idle, loading, success
  const [formData, setFormData] = useState({
    storeName: '',
    slug: '',
    productTitle: '',
    productPrice: ''
  });

  // Telegram User Data
  const [tgUser, setTgUser] = useState(null);

  useEffect(() => {
    // Initialize Telegram Web App
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      const user = tg.initDataUnsafe?.user;
      
      if (user) {
        setTgUser(user);
        // Auto-fill slug if empty
        setFormData(prev => ({ ...prev, slug: user.username?.toLowerCase() || '' }));
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const payload = {
      ...formData,
      telegramId: tgUser?.id || 111111, // Fallback for testing in browser
      telegramUsername: tgUser?.username || 'testuser'
    };

    const res = await fetch('/api/create-product', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();

    if (data.success) {
      setStatus('success');
      // Fixed string interpolation and URL structure
      alert(`Product Added! View store at: https://digitalafricanism.com/${formData.slug}`);
    } else {
      alert('Error: ' + data.error);
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="p-8 text-center bg-green-50 h-screen flex flex-col justify-center">
        <h1 className="text-3xl mb-4">🎉 Success!</h1>
        <p className="mb-6">Your product is live.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="bg-green-600 text-white py-3 px-6 rounded-xl font-bold"
        >
          Add Another Product
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto font-sans">
      <h1 className="text-xl font-bold mb-1">Manage Store</h1>
      <p className="text-gray-500 text-sm mb-6">
        {tgUser ? `Logged in as ${tgUser.first_name}` : 'Preview Mode'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Store Info Section */}
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <h2 className="text-xs font-bold text-gray-400 uppercase mb-3">Store Details</h2>
          
          <input 
            className="w-full mb-3 p-3 border rounded-lg bg-gray-50"
            placeholder="Store Name (e.g. Teme Shop)"
            value={formData.storeName}
            onChange={e => setFormData({...formData, storeName: e.target.value})}
            required
          />
          <div className="flex items-center border rounded-lg bg-gray-50 px-3">
            <span className="text-gray-400 text-sm">/</span>
            <input 
              className="w-full p-3 bg-transparent outline-none"
              placeholder="unique-link"
              value={formData.slug}
              onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s/g, '-')})}
              required
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <h2 className="text-xs font-bold text-gray-400 uppercase mb-3">Add Product</h2>
          
          <input 
            className="w-full mb-3 p-3 border rounded-lg bg-gray-50"
            placeholder="Product Title"
            value={formData.productTitle}
            onChange={e => setFormData({...formData, productTitle: e.target.value})}
            required
          />
          <input 
            type="number"
            className="w-full p-3 border rounded-lg bg-gray-50"
            placeholder="Price (ETB)"
            value={formData.productPrice}
            onChange={e => setFormData({...formData, productPrice: e.target.value})}
            required
          />
        </div>

        <button 
          disabled={status === 'loading'}
          className="w-full bg-[#24A1DE] text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition"
        >
          {status === 'loading' ? 'Publishing...' : '🚀 Go Live'}
        </button>
      </form>
    </div>
  );
}