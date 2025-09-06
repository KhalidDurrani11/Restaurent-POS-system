import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'from-teal-500 to-cyan-400' }) => {
  const shadowColor = color.split(' ')[0].replace('from-', 'shadow-');
  
  return (
    <div className={`bg-black/30 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-lg flex items-center justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:${shadowColor}/40`}>
      <div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div className={`text-4xl text-white p-4 rounded-full bg-gradient-to-br ${color} shadow-lg ${shadowColor}/50`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;