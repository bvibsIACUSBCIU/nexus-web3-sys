import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Line, ReferenceLine, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, AlertTriangle, Activity,
  DollarSign, Droplets, Zap, Eye, ArrowRight, Anchor,
  ArrowUpRight, ArrowDownRight, Scale, HeartPulse,
  Target, Calendar, Flag
} from 'lucide-react';
import { WhaleTransaction } from '../types';

// Mock Data: Correlation between Marketing (Social Vol) and Price
const correlationData = [
  { name: '10:00', price: 1.2, socialVol: 500, event: '' },
  { name: '11:00', price: 1.22, socialVol: 800, event: '发布利好推文' },
  { name: '12:00', price: 1.35, socialVol: 2400, event: '' },
  { name: '13:00', price: 1.32, socialVol: 1800, event: '' },
  { name: '14:00', price: 1.28, socialVol: 1200, event: '' },
  { name: '15:00', price: 1.45, socialVol: 3500, event: 'KOL 喊单' },
  { name: '16:00', price: 1.55, socialVol: 4200, event: '' },
  { name: '17:00', price: 1.52, socialVol: 3100, event: '' },
];

const mockWhales: WhaleTransaction[] = [
  { id: '1', type: 'transfer_in', amount: 500000, valueUsd: 750000, walletLabel: '巨鲸 0x8a...2b', timestamp: '2分钟前', hash: '0x123', riskLevel: 'high' },
  { id: '2', type: 'buy', amount: 120000, valueUsd: 180000, walletLabel: '聪明钱 Smart Money', timestamp: '15分钟前', hash: '0x456', riskLevel: 'low' },
  { id: '3', type: 'sell', amount: 50000, valueUsd: 75000, walletLabel: '纸手 Paper Hand', timestamp: '42分钟前', hash: '0x789', riskLevel: 'medium' },
  { id: '4', type: 'transfer_out', amount: 1000000, valueUsd: 1500000, walletLabel: '部署者 Deployer', timestamp: '1小时前', hash: '0xabc', riskLevel: 'low' },
];

// Financial Data
const financialData = {
  totalDeposit: 1250000,
  totalWithdraw: 320000,
  rewardsPaid: 150000, // Used for Payout Ratio
  healthScore: 92
};

// Goals Data
const initialGoals = [
  { id: 1, type: '周目标 (Weekly)', target: 50000, current: 32400, unit: 'U', icon: Calendar, status: 'normal' },
  { id: 2, type: '月度目标 (Monthly)', target: 250000, current: 180000, unit: 'U', icon: Target, status: 'good' },
  { id: 3, type: '季度目标 (Quarterly)', target: 1000000, current: 450000, unit: 'U', icon: Flag, status: 'lagging' },
];

const TokenMetric = ({ label, value, subValue, icon: Icon, color }: any) => (
  <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex items-center justify-between hover:border-slate-600 transition-colors">
    <div>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <h3 className="text-xl font-bold text-white">{value}</h3>
        {subValue && <span className={`text-xs ${subValue.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{subValue}</span>}
      </div>
    </div>
    <div className={`p-2.5 rounded-lg bg-${color}-500/10 text-${color}-400`}>
      <Icon size={20} />
    </div>
  </div>
);

const FinancialCard = ({ title, amount, subtext, type }: { title: string, amount: string, subtext: string, type: 'in' | 'out' | 'neutral' | 'health' }) => {
  let colorClass = "text-white";
  let Icon = Activity;
  if (type === 'in') { colorClass = "text-green-400"; Icon = ArrowUpRight; }
  if (type === 'out') { colorClass = "text-red-400"; Icon = ArrowDownRight; }
  if (type === 'neutral') { colorClass = "text-blue-400"; Icon = Scale; }
  if (type === 'health') { colorClass = "text-emerald-400"; Icon = HeartPulse; }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <span className="text-slate-400 text-xs uppercase font-bold">{title}</span>
        <Icon size={18} className={colorClass} />
      </div>
      <div>
        <h3 className={`text-2xl font-bold ${colorClass}`}>{amount}</h3>
        <p className="text-xs text-slate-500 mt-1">{subtext}</p>
      </div>
      {type === 'health' && (
        <div className="w-full bg-slate-700 h-1.5 mt-3 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }}></div>
        </div>
      )}
    </div>
  );
};

const GoalCard = ({ title, current, target, unit, icon: Icon, status }: any) => {
  const progress = Math.min((current / target) * 100, 100);
  let statusColor = 'bg-indigo-500';
  if (status === 'good') statusColor = 'bg-green-500';
  if (status === 'lagging') statusColor = 'bg-orange-500';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between hover:border-indigo-500 transition-colors cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-700 text-slate-300 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-all">
            <Icon size={20} />
          </div>
          <span className="text-slate-200 font-bold text-sm">{title}</span>
        </div>
        <button className="text-xs text-indigo-400 hover:text-indigo-300">编辑目标</button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-2xl font-bold text-white">{current.toLocaleString()} <span className="text-xs text-slate-500">{unit}</span></span>
          <span className="text-xs text-slate-400">Target: {target.toLocaleString()}</span>
        </div>

        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
          <div className={`${statusColor} h-full rounded-full transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
        </div>

        <div className="flex justify-between text-xs">
          <span className={`${status === 'lagging' ? 'text-orange-400' : 'text-slate-400'} font-medium`}>
            {progress.toFixed(1)}% 完成
          </span>
          <span className="text-slate-500">剩余: {(target - current).toLocaleString()} {unit}</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const payoutRatio = ((financialData.rewardsPaid / financialData.totalDeposit) * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in pb-8">

      {/* 1. New Financial Health Monitor Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FinancialCard
          title="总入金 (Total Deposit)"
          amount={`$${(financialData.totalDeposit / 1000000).toFixed(2)}M`}
          subtext="较昨日 +$120k"
          type="in"
        />
        <FinancialCard
          title="总出金 (Total Withdraw)"
          amount={`$${(financialData.totalWithdraw / 1000).toFixed(0)}k`}
          subtext="净流量: +$930k"
          type="out"
        />
        <FinancialCard
          title="奖金拨比 (Payout Ratio)"
          amount={`${payoutRatio}%`}
          subtext="健康范围: <35%"
          type="neutral"
        />
        <FinancialCard
          title="项目健康指数 (Health Index)"
          amount={`${financialData.healthScore}/100`}
          subtext="状态: 极佳 (Excellent)"
          type="health"
        />
      </div>

      {/* 1.5 Goal Planning Section */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Target size={18} className="text-indigo-400" />
          业绩目标追踪 (Performance Goals)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialGoals.map(goal => (
            <GoalCard
              key={goal.id}
              title={goal.type}
              current={goal.current}
              target={goal.target}
              unit={goal.unit}
              icon={goal.icon}
              status={goal.status}
            />
          ))}
        </div>
      </div>

      {/* 2. Token Vital Signs Header (Existing but compacted) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <TokenMetric label="代币价格 (Price)" value="$1.52" subValue="+12.4%" icon={DollarSign} color="green" />
        <TokenMetric label="流动性池 (Liquidity)" value="$4.2M" subValue="安全 Safe" icon={Droplets} color="blue" />
        <TokenMetric label="24h 交易量 (Volume)" value="$1.8M" subValue="+5% 较昨日" icon={Activity} color="indigo" />
        <TokenMetric label="总市值 (Market Cap)" value="$15.2M" subValue="排名 #420" icon={Zap} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 3. The "Alpha" Chart: Correlation Engine */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-400" />
                币价 vs 热度 关联分析
              </h3>
              <p className="text-xs text-slate-400">KOL 的喊单真的拉动了币价吗？</p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1 text-green-400"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> 价格 (Price)</span>
              <span className="flex items-center gap-1 text-purple-400"><div className="w-3 h-3 bg-purple-500/50 rounded-sm"></div> 社交声量 (Social Vol)</span>
            </div>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={correlationData}>
                <defs>
                  <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis yAxisId="left" stroke="#10b981" orientation="left" domain={['auto', 'auto']} />
                <YAxis yAxisId="right" stroke="#8b5cf6" orientation="right" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />

                {/* Visualizing Events like Tweets */}
                {correlationData.map((entry, index) => (
                  entry.event ? <ReferenceLine key={index} x={entry.name} yAxisId="left" stroke="white" strokeDasharray="3 3" label={{ position: 'top', value: entry.event, fill: '#cbd5e1', fontSize: 10 }} /> : null
                ))}

                <Area yAxisId="right" type="monotone" dataKey="socialVol" fill="url(#colorSocial)" stroke="#8b5cf6" />
                <Line yAxisId="left" type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Whale Radar (Risk Management) */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden h-[400px] lg:h-auto">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/30">
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                <Anchor size={18} className="text-blue-400" />
                巨鲸雷达 (Whale Radar)
              </h3>
              <p className="text-[10px] text-slate-500">实时链上大额异动 (&gt;10万U)</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {mockWhales.map((tx) => (
              <div key={tx.id} className="p-3 bg-slate-700/30 rounded-lg border border-slate-700 hover:bg-slate-700/50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded uppercase ${tx.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                      tx.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-slate-600 text-slate-300'
                    }`}>
                    {tx.type === 'transfer_in' ? '⚠️ 充值砸盘风险' :
                      tx.type === 'buy' ? '买入' :
                        tx.type === 'sell' ? '卖出' :
                          tx.type === 'transfer_out' ? '提现/转出' : tx.type}
                  </span>
                  <span className="text-xs text-slate-500">{tx.timestamp}</span>
                </div>

                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 font-medium text-sm">{tx.walletLabel}</span>
                  <span className="text-white font-mono font-bold">${(tx.valueUsd / 1000).toFixed(1)}k</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <span>Tx: {tx.hash}</span>
                  <AlertTriangle size={10} className={tx.riskLevel === 'high' ? 'text-red-500' : 'hidden'} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-700 bg-slate-900/50">
            <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-300 transition-colors">
              查看所有链上活动
            </button>
          </div>
        </div>
      </div>

      {/* 5. Conversion Funnel & ROI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Eye size={18} className="text-teal-400" />
            转化漏斗 (24h)
          </h3>
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">推特曝光量 (Impressions)</span>
                <span className="text-slate-400">142,000</span>
              </div>
              <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[100%]"></div>
              </div>
            </div>
            {/* Arrow */}
            <div className="flex justify-center"><ArrowRight size={14} className="text-slate-600 rotate-90" /></div>
            {/* Step 2 */}
            <div className="relative">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Telegram 进群 (Joins)</span>
                <span className="text-slate-400">1,204 (0.8%)</span>
              </div>
              <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[45%]"></div>
              </div>
            </div>
            {/* Arrow */}
            <div className="flex justify-center"><ArrowRight size={14} className="text-slate-600 rotate-90" /></div>
            {/* Step 3 */}
            <div className="relative">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">新增持币地址 (New Holders)</span>
                <span className="text-slate-400">312 (25% 转化率)</span>
              </div>
              <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[15%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col justify-center">
          <h3 className="font-bold text-white mb-4">营销 ROI 评分</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="100, 100" // Half circle
                  className="animate-[spin_1s_ease-out_reverse]"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-white">4.2x</span>
                <span className="text-[10px] text-slate-400">回报率</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-slate-400">营销投入: <span className="text-white">$5,000</span> (KOLs)</p>
              <p className="text-slate-400">带来交易量: <span className="text-white">$21,000</span></p>
              <div className="h-px bg-slate-700 my-2"></div>
              <p className="text-green-400 text-xs">活动状态: <span className="font-bold">盈利 (PROFITABLE)</span></p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;