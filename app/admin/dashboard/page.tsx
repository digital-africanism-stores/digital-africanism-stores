// File: app/admin/dashboard/page.tsx
import { supabase } from '@/lib/supabase';

// This forces Next.js to fetch fresh data every time the page loads
export const revalidate = 0; 

export default async function AdminDashboard() {
  // Fetch everything (Live + Drafts)
  const { data: adminStores, error } = await supabase
    .from('stores')
    .select('*');

  if (error) {
    return <div className="p-8 text-red-500">Error loading dashboard: {error.message}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {adminStores?.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        <div className="grid gap-4">
          {adminStores?.map((store) => (
            <div key={store.id} className="border p-4 rounded-lg shadow-sm">
              <p className="font-semibold">Store Name: {store.name || store.unique_link}</p>
              <p className="text-sm mt-2">
                Status:{' '}
                <span className={`font-bold ${store.status === 'live' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {store.status === 'live' ? '🟢 Live' : '🟡 Draft'}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}