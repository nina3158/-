/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Binary, 
  Compass, 
  BarChart3, 
  BrainCircuit,
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';
import { KnowledgePoint, CATEGORY_MAP, CATEGORY_THEMES, formatGrade } from '../data';

interface DashboardProps {
  points: KnowledgePoint[];
  checkedPoints: Record<string, boolean>;
  onNavigateDetail: (filterCategory?: string) => void;
}

export default function Dashboard({ points, checkedPoints, onNavigateDetail }: DashboardProps) {
  // Calculate general statistics
  const totalCount = points.length;
  const learnedCount = points.filter(p => checkedPoints[p.id]).length;
  const overallPercentage = totalCount > 0 ? Math.round((learnedCount / totalCount) * 100) : 0;

  // Calculate statistics per category
  const categories = ['数与代数', '几何', '统计与概率', '解决问题'];
  
  const categoryStats = categories.map(cat => {
    const catPoints = points.filter(p => p.category === cat);
    const catLearned = catPoints.filter(p => checkedPoints[p.id]).length;
    const catTotal = catPoints.length;
    const percentage = catTotal > 0 ? Math.round((catLearned / catTotal) * 100) : 0;
    
    return {
      rawCategory: cat,
      uiName: CATEGORY_MAP[cat] || cat,
      learned: catLearned,
      total: catTotal,
      percentage
    };
  });

  // Calculate mathematical rank
  let rankName = '数学小书童 🥉';
  let rankDesc = '开启你的数学冒险之旅吧！';
  let rankColor = 'text-emerald-500';

  if (overallPercentage >= 85) {
    rankName = '数学至尊星王 👑';
    rankDesc = '满分预习！你已经是无可阻挡的数学大宗师啦！';
    rankColor = 'text-purple-650';
  } else if (overallPercentage >= 50) {
    rankName = '金牌数学之星 🥇';
    rankDesc = '太了不起了！多半知识已被你提前攻克！';
    rankColor = 'text-amber-500';
  } else if (overallPercentage >= 15) {
    rankName = '数学小探索家 🥈';
    rankDesc = '渐入佳境！继续探索好玩的数学秘密吧！';
    rankColor = 'text-blue-500';
  }

  // Get Lucide icons for categories
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '数与代数':
        return <Binary className="w-8 h-8 text-emerald-500 shrink-0" />;
      case '几何':
        return <Compass className="w-8 h-8 text-blue-500 shrink-0" />;
      case '统计与概率':
        return <BarChart3 className="w-8 h-8 text-amber-500 shrink-0" />;
      default:
        return <BrainCircuit className="w-8 h-8 text-purple-500 shrink-0" />;
    }
  };

  // SVG Progress Ring calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPercentage / 100) * circumference;

  return (
    <div className="space-y-8 select-none">
      
      {/* 🚀 Top circular progress tracker + Welcome bento box */}
      <section className="grid grid-cols-12 gap-6">
        
        {/* Card 1: All progress status bento wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12 lg:col-span-4 bg-white rounded-[32px] p-6 shadow-sm border border-[#E0E7E4] flex flex-col items-center justify-center relative overflow-hidden min-h-[290px]"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -z-0 opacity-50"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Animated visual ring tracker */}
            <div className="relative w-28 h-28 flex items-center justify-center mb-4">
              {/* Background ring */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="45"
                  className="stroke-[#F0F4F2] fill-none"
                  strokeWidth="8"
                />
                {/* Active animated ring */}
                <motion.circle
                  cx="56"
                  cy="56"
                  r="45"
                  className="stroke-[#4CAF50] fill-none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                  animate={{ strokeDashoffset: (2 * Math.PI * 45) - (overallPercentage / 100) * (2 * Math.PI * 45) }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                />
              </svg>
              <div className="absolute text-center flex flex-col items-center justify-center">
                <span className="block text-2xl font-black text-[#1A202C] tracking-tighter leading-none">
                  {overallPercentage}%
                </span>
                <span className="text-[9px] text-[#4CAF50] font-bold uppercase tracking-wider mt-0.5">
                  全书总进度
                </span>
              </div>
            </div>
            
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest uppercase">全书微课完成</p>
            <p className="text-lg font-bold text-[#1A202C] mt-0.5">
              {learnedCount} / {totalCount} 知识点已学会
            </p>
            
            <div className="mt-3 flex items-center gap-1.5 bg-emerald-50 px-3.5 py-1 rounded-full text-xs text-green-700 font-bold border border-emerald-100/60 shadow-xs">
              <Award className="w-3.5 h-3.5 text-[#4CAF50]/80" />
              <span>等级: {rankName}</span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Immersive green learning trip banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-12 lg:col-span-8 bg-[#4CAF50] rounded-[32px] p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between text-white relative overflow-hidden group"
        >
          <div className="relative z-10 text-left space-y-1.5 max-w-[480px]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black tracking-widest uppercase text-yellow-100 border border-white/10 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
              <span>立即开启你的数学冒险</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 leading-tight">
              开启今天的自学学习之旅
            </h2>
            <p className="text-green-50 text-xs font-medium md:text-sm leading-relaxed">
              从“认识钟表”、“加减法”到“图形表面积”；课前自选微课核心考点，高效率预习，轻松成为班里数学大明星！
            </p>
            <div className="pt-3">
              <button 
                onClick={() => onNavigateDetail()}
                className="bg-white text-[#4CAF50] hover:bg-green-50 px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                立即进入微课详情目录 ➜
              </button>
            </div>
          </div>
          
          <div className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-inner shrink-0 hover:rotate-12 transition duration-350 mt-6 sm:mt-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 sm:w-16 sm:h-16 text-white stroke-[2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </motion.div>

      </section>

      {/* 📊 Bottom classification bento grid display */}
      <div className="space-y-4 pt-2">
        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 pl-1 select-none">
          <span>📂</span> <span>学科核心知识二级分类模块</span>
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryStats.map((stat, i) => {
            // Determine custom colors matching the bento design exactly
            let hoverBorder = 'hover:border-[#4CAF50]';
            let iconBg = 'bg-green-100 text-[#4CAF50]';
            let categoryLabel = 'NUMBERS & ALGEBRA';
            let barBg = 'bg-[#4CAF50]';
            let displayUiName = stat.uiName;
            
            if (stat.rawCategory === '数与代数') {
              hoverBorder = 'hover:border-[#4CAF50]';
              iconBg = 'bg-green-100 text-[#4CAF50]';
              categoryLabel = 'NUMBERS & ALGEBRA';
              barBg = 'bg-[#4CAF50]';
            } else if (stat.rawCategory === '几何') {
              hoverBorder = 'hover:border-[#2196F3]';
              iconBg = 'bg-blue-100 text-[#2196F3]';
              categoryLabel = 'SHAPES & GEOMETRY';
              barBg = 'bg-[#2196F3]';
              displayUiName = '图形与几何';
            } else if (stat.rawCategory === '统计与概率') {
              hoverBorder = 'hover:border-[#FF9800]';
              iconBg = 'bg-orange-100 text-[#FF9800]';
              categoryLabel = 'STATS & PROBABILITY';
              barBg = 'bg-[#FF9800]';
              displayUiName = '统计与概率';
            } else if (stat.rawCategory === '解决问题') {
              hoverBorder = 'hover:border-[#9C27B0]';
              iconBg = 'bg-purple-100 text-[#9C27B0]';
              categoryLabel = 'PROJECTS & PRACTICE';
              barBg = 'bg-[#9C27B0]';
              displayUiName = '综合与实践';
            }
            
            return (
              <motion.div
                key={stat.rawCategory}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => onNavigateDetail(stat.rawCategory)}
                className={`bg-white rounded-[32px] p-6 shadow-sm border border-[#E0E7E4] flex flex-col justify-between ${hoverBorder} hover:shadow-md transition-all group cursor-pointer lg:min-h-[250px]`}
              >
                <div>
                  <div className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    {getCategoryIcon(stat.rawCategory)}
                  </div>
                  <h3 className="text-lg font-bold text-[#1A202C] mb-1 group-hover:text-slate-900">
                    {displayUiName}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-extrabold tracking-widest mb-4 uppercase">
                    {categoryLabel}
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-semibold text-gray-500">已学 {stat.learned}/{stat.total}</span>
                    <span className="font-black text-slate-800">{stat.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#F0F4F2] rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${barBg} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
