
import React, { useContext } from 'react';
import { AuthContext } from '../../App';
import { UserIcon, LogoutIcon } from '../ui/Icons';

const Header: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div className="text-2xl font-semibold text-gray-800">
        Welcome, {user?.name || 'Guest'}
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
            <UserIcon className="w-6 h-6 text-gray-500" />
            <span className="text-gray-700 font-medium">{user?.role}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <LogoutIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
