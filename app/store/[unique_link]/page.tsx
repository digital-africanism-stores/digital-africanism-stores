// File: app/store/[unique_link]/page.tsx

import { supabase } from '@/lib/supabase';

export default async function PublicStorePage({
  params,
}: {
  params: Promise<{ unique_link: string }>;
}) {
  // Await the params since it's a Promise in Next.js
  const resolvedParams = await params;
  const uniqueLink = resolvedParams.unique_link;

  // Fetch the store strictly filtering for 'live' status
  const { data: publicStore, error } = await supabase
    .from('stores')
    .select('*')
    .eq('unique_link', uniqueLink)
    .eq('status', 'live')
    .single();

  // Stop visitors from seeing the page if it is a draft or missing
  if (error || !publicStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">404 - Store Not Found</h1>
        <p>This store is either not live yet or does not exist.</p>
      </div>
    );
  }

  // Display the store if it is live
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome to {publicStore.name || 'our Store'}</h1>
      {/* Add your public product mapping UI here */}
    </div>
  );
}