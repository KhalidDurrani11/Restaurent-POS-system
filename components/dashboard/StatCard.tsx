import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'from-teal-500 to-cyan-400' }) => (
  <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl p-6 sm:p-7 flex items-center gap-5 transition-all duration-300 hover:border-white/20 shadow-xl">
    <div className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
      <span className="w-8 h-8 sm:w-9 sm:h-9">{icon}</span>
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">{title}</p>
      <p className="text-2xl sm:text-3xl font-bold text-white mt-1 truncate">{value}</p>
    </div>
  </div>
);

export default StatCard;
