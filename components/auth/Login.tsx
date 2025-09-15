import React, { useState, useContext } from 'react';
import { AuthContext } from '../../App';
import { UserRole } from '../../types';
import { PosIcon } from '../ui/Icons';

const Login: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      login({ id: 'user1', name: 'Admin User', role: UserRole.Admin });
      setError('');
    } else if (username === 'cashier' && password === 'cashier') {
      login({ id: 'user2', name: 'Cashier User', role: UserRole.Cashier });
      setError('');
    } else {
      setError('Invalid username or password.');
    }
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
            Use: (admin/admin) or (cashier/cashier)
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md -space-y-px">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 bg-white/5 border border-white/20 placeholder-gray-400 text-white rounded-t-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm transition-all"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60 animate-pulse hover:animate-none"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;