import React, { useContext } from 'react';
import { AuthContext } from '../../App';
import { UserIcon, LogoutIcon } from '../ui/Icons';

const Header: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="text-2xl font-semibold text-gray-100">
        Welcome, {user?.name || 'Guest'}
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full">
            <UserIcon className="w-6 h-6 text-cyan-400" />
            <span className="text-gray-300 font-medium">{user?.role}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-rose-300 bg-rose-500/10 rounded-lg hover:bg-rose-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-rose-500"
        >
          <LogoutIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;