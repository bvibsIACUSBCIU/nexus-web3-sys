import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TelegramManager from './components/TelegramManager';
import TwitterAnalytics from './components/TwitterAnalytics';
import IncentiveManager from './components/IncentiveManager';
import { Tab } from './types';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD:
        return <Dashboard />;
      case Tab.TELEGRAM:
        return <TelegramManager />;
      case Tab.TWITTER:
        return <TwitterAnalytics />;
      case Tab.INCENTIVES:
        return <IncentiveManager />;
      case Tab.SETTINGS:
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
                <Settings size={64} className="mb-4 text-slate-700" />
                <h2 className="text-2xl font-bold text-slate-300">系统配置</h2>
                <p>此处配置全局 API 密钥和 Bot 机器人 Token。</p>
            </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen relative">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    {activeTab === Tab.DASHBOARD && '项目指挥中心 (Dashboard)'}
                    {activeTab === Tab.TELEGRAM && '社群指挥中心 (Telegram)'}
                    {activeTab === Tab.TWITTER && '社交情报分析 (Twitter)'}
                    {activeTab === Tab.INCENTIVES && '市场领导人激励池 (Incentives)'}
                    {activeTab === Tab.SETTINGS && '系统设置'}
                </h1>
                <p className="text-slate-500 mt-1">
                    {activeTab === Tab.DASHBOARD && '欢迎回来，管理员。'}
                    {activeTab === Tab.TELEGRAM && '管理群组、机器人及 AI 总结。'}
                    {activeTab === Tab.TWITTER && '追踪 X.com 数据指标与互动情况。'}
                    {activeTab === Tab.INCENTIVES && '多签金库与去中心化业绩追踪。'}
                </p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-medium text-slate-300">系统运行中</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold border-2 border-slate-800">
                    A
                </div>
            </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default App;