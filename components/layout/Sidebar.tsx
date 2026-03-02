import React, { useContext } from 'react';
import { AuthContext } from '../../App';
import { UserRole } from '../../types';
import { DashboardIcon, PosIcon, ProductIcon, ReportsIcon, AiIcon, CloseIcon } from '../ui/Icons';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen = false, onClose }) => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const navItems =
    user.role === UserRole.Admin
      ? [
          { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
          { id: 'pos', label: 'POS', icon: <PosIcon /> },
          { id: 'products', label: 'Inventory', icon: <ProductIcon /> },
          { id: 'reports', label: 'Reports', icon: <ReportsIcon /> },
          { id: 'ai', label: 'AI Assistant', icon: <AiIcon /> },
        ]
      : [{ id: 'pos', label: 'POS', icon: <PosIcon /> }];

  return (
    <>
      {/* Mobile overlay */}
      <button
        type="button"
        onClick={onClose}
        className={`md:hidden fixed inset-0 z-40 bg-black/60 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Close menu overlay"
      />

      <aside
        className={[
          'bg-black/30 backdrop-blur-lg border-r border-white/10 flex-shrink-0 flex flex-col z-50',
          // Desktop
          'md:static md:w-64 md:translate-x-0',
          // Mobile drawer
          'fixed top-0 left-0 h-full w-72 max-w-[85vw] transition-transform',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="h-20 flex items-center justify-between px-5 border-b border-white/10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 text-transparent bg-clip-text">Khan Medical</h1>
          <button
            type="button"
            onClick={onClose}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200"
            aria-label="Close menu"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
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
              className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-all text-gray-300 hover:bg-white/5 hover:text-white transform hover:translate-x-1 ${
                activeView === item.id ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold shadow-lg shadow-cyan-500/30' : ''
              }`}
            >
              <span className="w-6 h-6">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;