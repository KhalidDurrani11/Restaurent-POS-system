import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'from-indigo-500 to-purple-600' }) => {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-6 rounded-2xl shadow-lg flex items-center justify-between transform transition-transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20">
      <div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div className={`text-4xl text-white p-4 rounded-full bg-gradient-to-br ${color}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;