import React from 'react';
import { Tab } from '../types';
import { LayoutDashboard, Send, Twitter, Settings, Activity, Trophy } from 'lucide-react';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: Tab.DASHBOARD, label: '总览 / 仪表盘', icon: <LayoutDashboard size={20} /> },
    { id: Tab.TELEGRAM, label: 'Telegram 运营', icon: <Send size={20} /> },
    { id: Tab.TWITTER, label: '推特 / X 数据', icon: <Twitter size={20} /> },
    { id: Tab.INCENTIVES, label: '市场激励管理', icon: <Trophy size={20} /> },
    { id: Tab.SETTINGS, label: '系统配置', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-10">
      <div className="p-6 flex items-center gap-2 text-indigo-400">
        <Activity size={28} />
        <h1 className="text-xl font-bold tracking-wider text-white">NEXUS</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400">
          <p className="font-semibold text-slate-300">系统状态 (System Status)</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Bot 机器人在线
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            AI 引擎就绪
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;