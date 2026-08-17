import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Digital Africanism</h1>
      <p className="text-gray-600 mb-8">The easiest way to sell online in Ethiopia.</p>
      
      <Link 
        href="/dashboard-form" 
        className="bg-[#24A1DE] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-blue-600 transition"
      >
        Open Merchant Dashboard
      </Link>
    </div>
  );
}