import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Using your exact file path

export default function StoreSetupForm() {
  const router = useRouter();

  const handleGoLive = async (storeSlug, productDetails) => {
    try {
      // 1. Save the product via your existing API route
      const productRes = await fetch('/api/create-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productDetails),
      });

      if (!productRes.ok) throw new Error("Failed to save product");

      // 2. Mark the store as live in Supabase
      const { error: storeError } = await supabase
        .from('stores')
        .update({ is_setup_complete: true })
        .eq('slug', storeSlug); 

      if (storeError) throw storeError;

      // 3. Redirect to your public dynamic route
      router.push(`/${storeSlug}`); 

    } catch (error) {
      console.error("Setup failed:", error);
      // Handle your error UI here
    }
  };

  return (
    // Pass your actual state variables to the handler
    <button onClick={() => handleGoLive(storeSlug, productState)} className="bg-blue-500 text-white rounded p-2">
      🚀 Go Live
    </button>
  );
}