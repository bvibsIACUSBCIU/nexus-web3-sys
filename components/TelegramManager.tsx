import React, { useState, useEffect, useRef } from 'react';
import { GroupStats, ChatMessage, BotPersona } from '../types';
import { Search, Bot, ShieldAlert, Sparkles, FileText, Send, User } from 'lucide-react';
import { generateChatSummary, generateHypeMessage } from '../services/geminiService';

const mockGroups: GroupStats[] = [
  { id: '1', name: '官方治理群 (Governance)', memberCount: 15420, onlineCount: 1200, activityScore: 88, sentimentScore: 92, status: 'active' },
  { id: '2', name: '交易 & 币价讨论群', memberCount: 8500, onlineCount: 3400, activityScore: 95, sentimentScore: 60, status: 'active' },
  { id: '3', name: '水群 / 闲聊 (Lounge)', memberCount: 3000, onlineCount: 200, activityScore: 40, sentimentScore: 80, status: 'active' },
];

const mockChatHistory: ChatMessage[] = [
  { id: '1', sender: 'CryptoKing', content: '什么时候快照啊？空投还有吗？', timestamp: '10:42 AM', isBot: false },
  { id: '2', sender: 'Mod_Alice', content: '我们这周五的 Townhall 会议会宣布细节！', timestamp: '10:43 AM', isBot: false },
  { id: '3', sender: 'FUD_Destroyer', content: '现在的价格不买就是傻，等起飞吧', timestamp: '10:45 AM', isBot: false },
  { id: '4', sender: 'HypeBot_01', content: '家人们，看下路线图，赋能要来了！🚀', timestamp: '10:46 AM', isBot: true },
  { id: '5', sender: 'Newbie23', content: '合约审计过了吗？安全不？', timestamp: '10:48 AM', isBot: false },
  { id: '6', sender: 'Dev_Mike', content: '是的，Certik 审计报告已经置顶了。', timestamp: '10:49 AM', isBot: false },
];

const mockPersonas: BotPersona[] = [
  { id: '1', name: '冲土狗的 Max', role: '气氛组/喊单', tone: '激动, 使用币圈黑话, 极度看涨', isActive: true },
  { id: '2', name: '客服 Sarah', role: '帮助/引导', tone: '专业, 冷静, 信息量大', isActive: true },
];

const TelegramManager: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<GroupStats>(mockGroups[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatHistory);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isGeneratingHype, setIsGeneratingHype] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<BotPersona>(mockPersonas[0]);
  const [hypeContext, setHypeContext] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    const result = await generateChatSummary(messages, selectedGroup.name);
    setSummary(result);
    setIsSummarizing(false);
  };

  const handleInjectHype = async () => {
    if (!hypeContext) return;
    setIsGeneratingHype(true);
    const text = await generateHypeMessage(selectedPersona, hypeContext);

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: selectedPersona.name,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isBot: true,
    };

    setMessages([...messages, newMessage]);
    setHypeContext('');
    setIsGeneratingHype(false);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-4rem)]">

      {/* Group List */}
      <div className="lg:col-span-3 bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden h-[300px] lg:h-auto order-2 lg:order-1">
        <div className="p-4 border-b border-slate-700">
          <h3 className="font-semibold text-white mb-3">管理群组</h3>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="搜索群组..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockGroups.map(group => (
            <div
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={`p-4 border-b border-slate-700/50 cursor-pointer hover:bg-slate-700/50 transition-colors ${selectedGroup.id === group.id ? 'bg-indigo-900/20 border-l-4 border-l-indigo-500' : ''}`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-slate-200">{group.name}</h4>
                <span className={`w-2 h-2 rounded-full ${group.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-400">
                <span>{group.memberCount.toLocaleString()} 成员</span>
                <span className="text-green-400">{group.onlineCount} 在线</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat View */}
      <div className="lg:col-span-6 flex flex-col gap-4 order-1 lg:order-2 h-[600px] lg:h-auto">

        {/* Chat Stats Header */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {selectedGroup.name}
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs">已认证</span>
            </h2>
            <p className="text-xs text-slate-400">活跃度评分: <span className="text-green-400">{selectedGroup.activityScore}/100</span></p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => alert("群组已锁定！全员禁言中。")}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-lg text-sm transition-colors border border-red-500/20"
            >
              <ShieldAlert size={16} />
              全员禁言
            </button>
            <button
              onClick={handleGenerateSummary}
              disabled={isSummarizing}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              <FileText size={16} />
              {isSummarizing ? '分析中...' : '生成日报'}
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isBot ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${msg.isBot ? 'bg-indigo-900/40 border border-indigo-700/50' : 'bg-slate-700/50'}`}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={`text-xs font-bold ${msg.isBot ? 'text-indigo-400' : 'text-slate-300'}`}>
                      {msg.sender} {msg.isBot && '(Bot)'}
                    </span>
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm text-slate-200">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Overlay */}
          {summary && (
            <div className="absolute inset-x-4 bottom-4 bg-slate-900/95 backdrop-blur-md rounded-lg p-4 border border-indigo-500/50 shadow-2xl animate-fade-in z-20">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-indigo-400 font-semibold flex items-center gap-2">
                  <Sparkles size={16} /> AI 智能总结报告
                </h4>
                <button onClick={() => setSummary(null)} className="text-slate-500 hover:text-white">&times;</button>
              </div>
              <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">
                {summary}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bot Controls (AI Hype) */}
      <div className="lg:col-span-3 bg-slate-800 rounded-xl border border-slate-700 flex flex-col order-3">
        <div className="p-4 border-b border-slate-700 bg-indigo-900/10">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Bot size={18} className="text-indigo-400" />
            AI 炒群引擎
          </h3>
          <p className="text-xs text-slate-400 mt-1">自动化活跃气氛工具</p>
        </div>

        <div className="p-4 flex-1 flex flex-col gap-6">
          {/* Persona Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">当前角色 (Active Persona)</label>
            <div className="space-y-2">
              {mockPersonas.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPersona(p)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedPersona.id === p.id
                    ? 'bg-indigo-600/20 border-indigo-500'
                    : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <User size={16} className={selectedPersona.id === p.id ? 'text-indigo-400' : 'text-slate-500'} />
                    <span className="font-medium text-sm text-white">{p.name}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-400 pl-6">{p.role} • {p.tone}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hype Generator */}
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">语境 / 话题 (Context)</label>
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 h-24 resize-none mb-3"
              placeholder="例如：提醒大家参加 AMA，或者针对刚才的暴跌发表看法..."
              value={hypeContext}
              onChange={(e) => setHypeContext(e.target.value)}
            />
            <button
              onClick={handleInjectHype}
              disabled={isGeneratingHype || !hypeContext}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2 rounded-lg text-sm transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingHype ? (
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              ) : (
                <Send size={16} />
              )}
              生成并发送
            </button>
            <p className="text-[10px] text-slate-500 mt-2 text-center">
              AI 将使用选定角色的口吻立即生成并发送消息。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramManager;