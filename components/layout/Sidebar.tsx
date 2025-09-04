
import React, { useContext } from 'react';
import { AuthContext } from '../../App';
import { UserRole } from '../../types';
import { DashboardIcon, PosIcon, ProductIcon, ReportsIcon, AiIcon } from '../ui/Icons';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const navItems =
    user.role === UserRole.Admin
      ? [
          { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
          { id: 'pos', label: 'POS', icon: <PosIcon /> },
          { id: 'products', label: 'Products', icon: <ProductIcon /> },
          { id: 'reports', label: 'Reports', icon: <ReportsIcon /> },
          { id: 'ai', label: 'AI Assistant', icon: <AiIcon /> },
        ]
      : [{ id: 'pos', label: 'POS', icon: <PosIcon /> }];

  return (
    <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col">
      <div className="h-20 flex items-center justify-center border-b">
        <h1 className="text-2xl font-bold text-indigo-600">AI POS</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveView(item.id);
            }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 ${
              activeView === item.id ? 'bg-indigo-100 text-indigo-600 font-semibold' : ''
            }`}
          >
            <span className="w-6 h-6">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
