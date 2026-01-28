import React, { useState, useEffect } from 'react';
import { TeamReward, Milestone } from '../types';
import { 
  Shield, Unlock, Lock, TrendingUp, CheckCircle, AlertCircle, 
  Wallet, Activity, ExternalLink, Database, RefreshCw, 
  Briefcase, AlertTriangle, TrendingDown, Flame, Gift
} from 'lucide-react';

// Simulated Data for 8 Teams (A-H)
// Total Target: 8M USD (1M per team)
// Total Reward Pool: 1M USD (125k per team)
const initialTeams: TeamReward[] = [
  { 
    id: '1', 
    lineName: 'Alpha 战队 (A线)', 
    leaderName: 'Alex.eth', 
    advisorName: 'Dr. Blockchain',
    advisorRole: '战略架构顾问',
    totalPool: 125000, 
    unlockedAmount: 15000, 
    currentKpi: 320000, 
    milestones: [
        { level: 1, targetVolume: 200000, rewardAmount: 5000, status: 'claimed' },
        { level: 2, targetVolume: 500000, rewardAmount: 10000, status: 'locked' },
        { level: 3, targetVolume: 1000000, rewardAmount: 20000, status: 'locked' },
    ],
    status: 'active' 
  },
  { 
    id: '2', 
    lineName: 'Bravo 战队 (B线)', 
    leaderName: 'Sarah.sol', 
    advisorName: 'Professor Crypto',
    advisorRole: '社区增长顾问',
    totalPool: 125000, 
    unlockedAmount: 35000, 
    currentKpi: 850000, 
    milestones: [
        { level: 1, targetVolume: 200000, rewardAmount: 5000, status: 'claimed' },
        { level: 2, targetVolume: 500000, rewardAmount: 10000, status: 'claimed' },
        { level: 3, targetVolume: 1000000, rewardAmount: 20000, status: 'locked' },
    ],
    status: 'active' 
  },
  { 
    id: '3', 
    lineName: 'Charlie 战队 (C线)', 
    leaderName: 'Mike.bnb', 
    advisorName: 'Coach Carter',
    advisorRole: '市场地推顾问',
    totalPool: 125000, 
    unlockedAmount: 0, 
    currentKpi: 50000, 
    milestones: [
        { level: 1, targetVolume: 200000, rewardAmount: 5000, status: 'locked' },
        { level: 2, targetVolume: 500000, rewardAmount: 10000, status: 'locked' },
        { level: 3, targetVolume: 1000000, rewardAmount: 20000, status: 'locked' },
    ],
    status: 'risk' 
  },
  { 
    id: '4', 
    lineName: 'Delta 战队 (D线)', 
    leaderName: 'Emma.base', 
    advisorName: 'Mentor Lisa',
    advisorRole: 'KOL 资源顾问',
    totalPool: 125000, 
    unlockedAmount: 0, 
    currentKpi: 150000, 
    milestones: [
        { level: 1, targetVolume: 200000, rewardAmount: 5000, status: 'locked' },
        { level: 2, targetVolume: 500000, rewardAmount: 10000, status: 'locked' },
        { level: 3, targetVolume: 1000000, rewardAmount: 20000, status: 'locked' },
    ],
    status: 'slashed', 
    penaltyAmount: 5000
  },
  { 
    id: '5', 
    lineName: 'Echo 战队 (E线)', 
    leaderName: 'Eric.avax', 
    advisorName: 'VC Partner John',
    advisorRole: '资本运作顾问',
    totalPool: 125000, 
    unlockedAmount: 5000, 
    currentKpi: 210000, 
    milestones: [
        { level: 1, targetVolume: 200000, rewardAmount: 5000, status: 'claimed' },
        { level: 2, targetVolume: 500000, rewardAmount: 10000, status: 'locked' },
        { level: 3, targetVolume: 1000000, rewardAmount: 20000, status: 'locked' },
    ],
    status: 'active' 
  },
  { 
    id: '6', 
    lineName: 'Foxtrot 战队 (F线)', 
    leaderName: 'Frank.ftm', 
    advisorName: 'Marketing Guru',
    advisorRole: '品牌营销顾问',
    totalPool: 125000, 
    unlockedAmount: 0, 
    currentKpi: 90000, 
    milestones: [
        { level: 1, targetVolume: 200000, rewardAmount: 5000, status: 'locked' },
        { level: 2, targetVolume: 500000, rewardAmount: 10000, status: 'locked' },
        { level: 3, targetVolume: 1000000, rewardAmount: 20000, status: 'locked' },
    ],
    status: 'active' 
  },
  { 
    id: '7', 
    lineName: 'Golf 战队 (G线)', 
    leaderName: 'Grace.opt', 
    advisorName: 'Tech Lead Tom',
    advisorRole: '技术支持顾问',
    totalPool: 125000, 
    unlockedAmount: 0, 
    currentKpi: 195000, 
    milestones: [
        { level: 1, targetVolume: 200000, rewardAmount: 5000, status: 'locked' },
        { level: 2, targetVolume: 500000, rewardAmount: 10000, status: 'locked' },
        { level: 3, targetVolume: 1000000, rewardAmount: 20000, status: 'locked' },
    ],
    status: 'risk' 
  },
  { 
    id: '8', 
    lineName: 'Hotel 战队 (H线)', 
    leaderName: 'Henry.arb', 
    advisorName: 'Dao Master',
    advisorRole: '生态治理顾问',
    totalPool: 125000, 
    unlockedAmount: 15000, 
    currentKpi: 600000, 
    milestones: [
        { level: 1, targetVolume: 200000, rewardAmount: 5000, status: 'claimed' },
        { level: 2, targetVolume: 500000, rewardAmount: 10000, status: 'claimed' },
        { level: 3, targetVolume: 1000000, rewardAmount: 20000, status: 'locked' },
    ],
    status: 'active' 
  },
];

// Simulated Live On-chain Transactions
interface LiveTx {
  id: string;
  line: string;
  amount: number;
  user: string;
  hash: string;
  timestamp: string;
}

const IncentiveManager: React.FC = () => {
  const [teams, setTeams] = useState<TeamReward[]>(initialTeams);
  const [isAuditing, setIsAuditing] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<{id: string, text: string} | null>(null);
  const [liveTxs, setLiveTxs] = useState<LiveTx[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Simulation: Live Transaction Feed
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTeamIndex = Math.floor(Math.random() * teams.length);
      const randomTeam = teams[randomTeamIndex];
      // Don't add volume to slashed teams easily in simulation to show contrast
      if (randomTeam.status === 'slashed') return;

      const randomAmount = Math.floor(Math.random() * 8000) + 500;
      const newTx: LiveTx = {
        id: Date.now().toString(),
        line: randomTeam.lineName,
        amount: randomAmount,
        user: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`,
        hash: `0x${Math.random().toString(16).substr(2, 10)}...`,
        timestamp: new Date().toLocaleTimeString()
      };

      setLiveTxs(prev => [newTx, ...prev].slice(0, 5)); // Keep last 5
      
      // Update team stats and check for milestone unlock
      setTeams(prevTeams => prevTeams.map(t => {
        if (t.id === randomTeam.id) {
            const newKpi = t.currentKpi + randomAmount;
            // Check milestones
            const updatedMilestones = t.milestones.map(m => {
                if (m.status === 'locked' && newKpi >= m.targetVolume) {
                    return { ...m, status: 'unlocked' as const };
                }
                return m;
            });
            return { ...t, currentKpi: newKpi, milestones: updatedMilestones };
        }
        return t;
      }));

    }, 2500); 

    return () => clearInterval(interval);
  }, [teams]);

  // Simulate AI Latency
  const performAiAudit = async (team: TeamReward) => {
    setIsAuditing(team.id);
    setAuditResult(null);
    setTimeout(async () => {
      const penaltyCheck = team.currentKpi < 100000 ? 
        `\n⚠️ **警告**: 进度严重滞后 (<100k)，建议触发智能合约惩罚机制 (Slashing)。` : 
        `\n✅ **合规**: 进度正常，顾问活跃度高。`;

      const mockAnalysis = `
        **AI 链上审计报告 - ${team.lineName}**
        
        1. **归属合约验证**: 通过 (Contract: 0x8f...2a)
        2. **顾问评估**: ${team.advisorName}
           - 角色: ${team.advisorRole}
           - 资源导入: 极佳 (High Impact)
        3. **阶梯奖励状态**: 
           - 当前解锁: Level ${team.milestones.filter(m => m.status !== 'locked').length}
        ${penaltyCheck}
      `;
      setAuditResult({ id: team.id, text: mockAnalysis });
      setIsAuditing(null);
    }, 2000);
  };

  const handleClaimMilestone = (teamId: string, level: number) => {
    setTeams(teams.map(t => {
      if (t.id === teamId) {
        const updatedMilestones = t.milestones.map(m => 
            m.level === level ? { ...m, status: 'claimed' as const } : m
        );
        const reward = t.milestones.find(m => m.level === level)?.rewardAmount || 0;
        return { 
          ...t, 
          milestones: updatedMilestones,
          unlockedAmount: t.unlockedAmount + reward
        };
      }
      return t;
    }));
    alert(`Level ${level} 里程碑奖励已发放！\n资金已通过智能合约打入顾问钱包。`);
  };

  const handleSlash = (id: string) => {
    if (!confirm("⚠️ 高危操作：您确定要触发【惩罚机制】吗？\n\n这将调用智能合约销毁该团队部分未解锁代币，且不可逆转！")) return;
    setTeams(teams.map(t => {
        if (t.id === id) {
          return { 
            ...t, 
            status: 'slashed', 
            penaltyAmount: (t.penaltyAmount || 0) + 5000,
            totalPool: t.totalPool - 5000
          };
        }
        return t;
      }));
  };

  const manualSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1500);
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'risk': return 'bg-orange-500/20 text-orange-400 border-orange-500/30 animate-pulse';
          case 'slashed': return 'bg-red-500/20 text-red-400 border-red-500/30';
          default: return 'bg-green-500/20 text-green-400 border-green-500/30';
      }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* 1. Header (Same as before) */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400">
            <Database size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              数据源: The Graph (去中心化索引)
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </h4>
            <p className="text-xs text-slate-500">直接从链上索引交易事件，非中心化数据库统计。</p>
          </div>
        </div>
        <button 
          onClick={manualSync}
          className={`flex items-center gap-2 text-xs bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded transition-all ${isSyncing ? 'animate-pulse text-indigo-400' : 'text-slate-300'}`}
        >
          <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
          {isSyncing ? '正在同步区块...' : '同步链上数据'}
        </button>
      </div>

      <div className="flex items-center justify-between mt-8">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="text-indigo-500" /> 市场领导人 & 战略顾问绩效 (Milestones)
        </h3>
        <div className="flex gap-4 text-xs">
           <span className="bg-slate-800 px-3 py-1 rounded border border-slate-700 text-slate-300">
             总目标业绩: <span className="text-white font-bold">$8,000,000</span>
           </span>
           <span className="bg-slate-800 px-3 py-1 rounded border border-slate-700 text-slate-300">
             总奖励池: <span className="text-green-400 font-bold">$1,000,000</span>
           </span>
        </div>
      </div>

      {/* 2. Team Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => {
          return (
            <div key={team.id} className={`bg-slate-800 rounded-xl border overflow-hidden transition-all ${
                team.status === 'risk' ? 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)]' :
                team.status === 'slashed' ? 'border-red-500/50 opacity-90' :
                'border-slate-700 hover:border-indigo-500/50'
            }`}>
              {/* Card Header */}
              <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/30">
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      {team.lineName}
                      {team.status === 'slashed' && <span className="text-xs bg-red-500 text-white px-1 rounded">已被惩罚</span>}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <UserIcon className="w-3 h-3" /> 队长: {team.leaderName}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${getStatusColor(team.status)}`}>
                  {team.status === 'risk' ? <AlertTriangle size={12} /> : 
                   team.status === 'slashed' ? <TrendingDown size={12} /> :
                   <CheckCircle size={12} />}
                  {team.status === 'risk' ? '惩罚预警' : team.status === 'slashed' ? '已受惩罚' : '活跃增长中'}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-5">
                
                {/* Advisor Info */}
                <div className="bg-indigo-900/20 rounded-lg p-3 border border-indigo-500/20 flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-full text-indigo-400">
                        <Briefcase size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-indigo-300 font-bold uppercase">战略顾问</p>
                        <p className="text-sm font-bold text-white">{team.advisorName}</p>
                        <p className="text-[10px] text-slate-400">{team.advisorRole}</p>
                    </div>
                </div>

                {/* Tiered Milestones Visualization */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-sm text-slate-400 font-medium">当前业绩: <span className="text-white font-mono">${team.currentKpi.toLocaleString()}</span></span>
                     <span className="text-xs text-slate-500">奖金池: ${team.totalPool.toLocaleString()}</span>
                  </div>
                  
                  {/* Milestones Steps */}
                  <div className="space-y-3 relative">
                      <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-700 z-0"></div>
                      {team.milestones.map((m, idx) => {
                          const isUnlocked = m.status === 'unlocked' || m.status === 'claimed';
                          const isClaimed = m.status === 'claimed';
                          return (
                              <div key={idx} className="relative z-10 flex items-center justify-between bg-slate-700/30 p-2 rounded border border-slate-700/50">
                                  <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                                          isClaimed ? 'bg-green-500 border-green-400 text-white' :
                                          m.status === 'unlocked' ? 'bg-indigo-600 border-indigo-400 text-white animate-pulse' :
                                          'bg-slate-800 border-slate-600 text-slate-500'
                                      }`}>
                                          {m.level}
                                      </div>
                                      <div>
                                          <p className={`text-xs font-bold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                                              目标: ${m.targetVolume.toLocaleString()}
                                          </p>
                                          <p className="text-[10px] text-indigo-400">奖励: ${m.rewardAmount.toLocaleString()}</p>
                                      </div>
                                  </div>
                                  
                                  {m.status === 'unlocked' && (
                                      <button 
                                        onClick={() => handleClaimMilestone(team.id, m.level)}
                                        className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded shadow-lg animate-bounce"
                                      >
                                          领取奖励
                                      </button>
                                  )}
                                  {m.status === 'claimed' && <span className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle size={10} /> 已发放</span>}
                                  {m.status === 'locked' && <span className="text-[10px] text-slate-600 flex items-center gap-1"><Lock size={10} /> 待解锁</span>}
                              </div>
                          )
                      })}
                  </div>
                </div>

                {/* AI Audit Result */}
                {auditResult && auditResult.id === team.id && (
                  <div className="bg-indigo-900/20 border border-indigo-500/30 p-3 rounded text-xs text-indigo-200 whitespace-pre-line animate-fade-in">
                    {auditResult.text}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => performAiAudit(team)}
                    disabled={isAuditing === team.id}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 rounded-lg text-xs font-medium transition-colors flex justify-center items-center gap-1"
                  >
                    {isAuditing === team.id ? '审计中...' : 'AI 顾问评估'}
                  </button>
                  
                  {team.status === 'risk' || team.status === 'slashed' ? (
                      <button 
                        onClick={() => handleSlash(team.id)}
                        disabled={team.status === 'slashed'}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors flex justify-center items-center gap-1 ${
                            team.status === 'slashed' 
                            ? 'bg-red-900/20 text-red-500 cursor-not-allowed border border-red-900/50' 
                            : 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                        }`}
                      >
                        <Flame size={12} />
                        {team.status === 'slashed' ? `已扣除 $${team.penaltyAmount}` : '触发惩罚 (Slash)'}
                      </button>
                  ) : (
                      <div className="flex-1"></div> // Spacer
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper Icon Component
const UserIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export default IncentiveManager;