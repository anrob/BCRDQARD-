'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import BusinessCard from './components/BusinessCard';
import SignIn from './components/SignIn';

export default function Home() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <SignIn />;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-800">Digital Business Card</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user.email}</span>
              <button
                onClick={signOut}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-4">
        <BusinessCard />
      </div>
    </main>
  );
}
