import React, { useState } from 'react';
import { userService } from '../../services/databaseService';
import { UserRole } from '../../types';
import { PosIcon } from '../ui/Icons';
import Spinner from '../ui/Spinner';

interface LoginSupabaseProps {
  onLogin: (user: { id: string; name: string; email: string; role: UserRole }) => void;
}

const LoginSupabase: React.FC<LoginSupabaseProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sign in with Supabase
      const { user } = await userService.signIn(email, password);
      
      if (user) {
        // Get user profile from our users table
        const userProfile = await userService.getUserProfile(user.id);
        
        onLogin({
          id: user.id,
          name: userProfile.name,
          email: userProfile.email,
          role: userProfile.role as UserRole
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Demo login for testing (remove in production)
    onLogin({
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@example.com',
      role: UserRole.Admin
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-black/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10">
        <div className="text-center flex flex-col items-center">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-400 rounded-full mb-4 shadow-lg shadow-cyan-500/30">
                <PosIcon className="w-10 h-10 text-white" />
            </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Welcome to Khan's Restaurant</h1>
          <p className="mt-2 text-gray-400">
            Sign in to your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md -space-y-px">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 bg-white/5 border border-white/20 placeholder-gray-400 text-white rounded-t-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 bg-white/5 border border-white/20 placeholder-gray-400 text-white rounded-b-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Spinner />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </button>
            
            {/* Demo login button for testing */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2 px-4 text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Demo Login (Testing)
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm text-gray-500">
          <p>Don't have an account? Contact your administrator.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSupabase;
