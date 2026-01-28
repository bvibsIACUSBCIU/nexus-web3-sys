import React from 'react';
import { Twitter, Repeat, Heart, MessageCircle, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockTwitterData = [
  { date: '10/01', impressions: 45000, engagement: 2400 },
  { date: '10/02', impressions: 52000, engagement: 3100 },
  { date: '10/03', impressions: 48000, engagement: 2800 },
  { date: '10/04', impressions: 61000, engagement: 4500 },
  { date: '10/05', impressions: 55000, engagement: 3900 },
  { date: '10/06', impressions: 72000, engagement: 5100 },
  { date: '10/07', impressions: 85000, engagement: 6200 },
];

const TweetCard = ({ content, stats, type }: any) => (
  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mb-3">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-slate-600"></div>
        <div>
          <p className="text-sm font-bold text-white">Project Official <span className="text-blue-400">✓</span></p>
          <p className="text-xs text-slate-400">@ProjectNexus • 2小时前</p>
        </div>
      </div>
      <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${type === 'Announcement' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-700 text-slate-300'}`}>
        {type === 'Announcement' ? '公告' : type === 'Reply' ? '回复' : 'Meme/梗图'}
      </span>
    </div>
    <p className="text-sm text-slate-200 mb-3">{content}</p>
    <div className="flex justify-between text-slate-400 text-xs px-2">
      <span className="flex items-center gap-1 hover:text-blue-400 cursor-pointer"><MessageCircle size={14} /> {stats.replies}</span>
      <span className="flex items-center gap-1 hover:text-green-400 cursor-pointer"><Repeat size={14} /> {stats.retweets}</span>
      <span className="flex items-center gap-1 hover:text-red-400 cursor-pointer"><Heart size={14} /> {stats.likes}</span>
      <span className="flex items-center gap-1 hover:text-indigo-400 cursor-pointer"><BarChart2 size={14} /> {stats.views}</span>
    </div>
  </div>
);

const TwitterAnalytics: React.FC = () => {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-4rem)]">
      {/* Left Column: Stats & Chart */}
      <div className="lg:col-span-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Twitter size={20} /></div>
              <span className="text-slate-400 text-sm font-medium">粉丝数 (Followers)</span>
            </div>
            <p className="text-2xl font-bold text-white">45.2K</p>
            <p className="text-xs text-green-400 mt-1">+1.2K 今日新增</p>
          </div>
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg"><BarChart2 size={20} /></div>
              <span className="text-slate-400 text-sm font-medium">7日曝光量 (Impressions)</span>
            </div>
            <p className="text-2xl font-bold text-white">418K</p>
            <p className="text-xs text-green-400 mt-1">+18% 环比增长</p>
          </div>
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/20 text-red-400 rounded-lg"><Heart size={20} /></div>
              <span className="text-slate-400 text-sm font-medium">互动率 (Engagement)</span>
            </div>
            <p className="text-2xl font-bold text-white">4.8%</p>
            <p className="text-xs text-slate-500 mt-1">行业平均: 2.1%</p>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-96">
          <h3 className="text-lg font-semibold text-white mb-6">曝光量趋势 (Impression Trends)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockTwitterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Line type="monotone" dataKey="impressions" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} name="曝光量" />
              <Line type="monotone" dataKey="engagement" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, fill: '#ec4899' }} name="互动量" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right Column: Recent Tweets & Scheduled */}
      <div className="lg:col-span-4 bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden h-[500px] lg:h-auto">
        <div className="p-4 border-b border-slate-700">
          <h3 className="font-semibold text-white">最新动态</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <TweetCard
            type="Announcement"
            content="🚀 明天会有重磅合作伙伴公布！记得打开小铃铛 🔔 #Web3 #Crypto"
            stats={{ replies: 124, retweets: 450, likes: 1200, views: '15K' }}
          />
          <TweetCard
            type="Reply"
            content="是的，质押入口将在 TGE 之后立即开放。"
            stats={{ replies: 12, retweets: 5, likes: 45, views: '1.2K' }}
          />
          <TweetCard
            type="Meme"
            content="当绿柱直接拉起来的时候... 🕯️📈 (懂得都懂)"
            stats={{ replies: 89, retweets: 210, likes: 890, views: '8.5K' }}
          />
        </div>
        <div className="p-4 border-t border-slate-700 bg-slate-900/50">
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors flex justify-center items-center gap-2">
            <Twitter size={18} /> 撰写新推文
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterAnalytics;