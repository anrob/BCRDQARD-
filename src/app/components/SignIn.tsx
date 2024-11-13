'use client';

import { useAuth } from '@/lib/hooks/useAuth';

export default function SignIn() {
  const { signInWithGoogle, user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome to Digital Business Card</h2>
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-5 h-5"
          />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
} 