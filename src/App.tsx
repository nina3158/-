/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  HelpCircle, 
  Home, 
  CalendarRange, 
  BookOpen, 
  Clock, 
  Smile, 
  Dribbble,
  Star,
  Award
} from 'lucide-react';
import { parseKnowledgePoints, KnowledgePoint } from './data';
import Dashboard from './components/Dashboard';
import LearningDetail from './components/LearningDetail';

const LOCAL_STORAGE_KEY = 'math_prep_checked_points_v1';

export default function App() {
  // Load math knowledge points (240 total)
  const [points] = useState<KnowledgePoint[]>(() => parseKnowledgePoints());

  // Check state loading from local storage
  const [checkedPoints, setCheckedPoints] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.warn("Could not read checked points from localStorage", e);
      return {};
    }
  });

  // Active view switcher state
  const [curView, setCurView] = useState<'dashboard' | 'learning_detail'>('dashboard');
  
  // Category deep-linking filter state
  const [focusCategory, setFocusCategory] = useState<string | null>(null);

  // Gamified completion celebration modals
  const [celebratePoint, setCelebratePoint] = useState<string | null>(null);

  // Time ticker state
  const [currentTime, setCurrentTime] = useState<string>('');

  // Synchronize clocks on boot
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      // Format to Chinese Date Time format beautifully
      setCurrentTime(
        d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  // Save checked states to localStorage whenever they update
  const handleCheckPoint = (id: string, isChecked: boolean) => {
    setCheckedPoints(prev => {
      const updated = { ...prev, [id]: isChecked };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Local storage sync error", e);
      }
      // Play a little soft bleep sound
      playSoftClick();
      return updated;
    });
  };

  // Sound triggers via Web Audio API inside root to augment UX feedbacks
  const playSoftClick = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (_) {}
  };

  const playSuccessCelebration = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C major chord arpeggio
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.3);
        }, idx * 80);
      });
    } catch (_) {}
  };

  // Deep-link navigation handle
  const handleNavigateDetail = (filterCategory?: string) => {
    if (filterCategory) {
      setFocusCategory(filterCategory);
    } else {
      setFocusCategory(null);
    }
    setCurView('learning_detail');
    playSoftClick();
  };

  const handleNavigateHome = () => {
    setCurView('dashboard');
    playSoftClick();
  };

  // Capture quiz completed signals from iframe internally to trigger congratulations
  useEffect(() => {
    const handleQuizFinish = (e: MessageEvent) => {
      if (e.data && e.data.type === 'PREVIEW_COMPLETE') {
        const pName = e.data.name;
        // Search matching entry
        const matched = points.find(p => p.name === pName);
        if (matched) {
          // Trigger custom interactive dialog popup
          setCelebratePoint(pName);
          playSuccessCelebration();
          // Check it off!
          setCheckedPoints(prev => {
            const updated = { ...prev, [matched.id]: true };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            return updated;
          });
        }
      }
    };
    window.addEventListener('message', handleQuizFinish);
    return () => window.removeEventListener('message', handleQuizFinish);
  }, [points]);

  return (
    <div className="min-h-screen bg-[#F7FAF9] text-[#2D3436] font-sans p-3 sm:p-6 md:p-8 antialiased selection:bg-green-100">
      
      {/* 🌟 Main Bento navigation header container */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center bg-white border border-[#E0E7E4] rounded-[24px] px-8 py-4 shadow-sm gap-4 select-none">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#4CAF50] rounded-xl flex items-center justify-center shadow-lg shadow-green-100 text-white shrink-0 rotate-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="text-white w-5 h-5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#1A202C] flex items-center gap-2 flex-wrap">
              <span>小学生数学</span>
              <span className="text-[#4CAF50] font-black">提前学</span>
              <span className="text-[10px] bg-[#E3F2FD] text-[#1976D2] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-widest scale-95 origin-left">
                BENTO STYLE
              </span>
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              清新趣味预习系统 • 课前10分钟知识点提前学会，做班级数学快乐小主人 🎒
            </p>
          </div>
        </div>

        {/* Beautiful Live Clock and Info Indicator */}
        <div className="flex items-center gap-4 shrink-0 flex-wrap justify-end">
          <div className="text-right hidden lg:block mr-2">
            <span className="block text-xs font-bold text-gray-500 font-mono tracking-tight flex items-center gap-1.5 justify-end">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>当前刻度:</span>
              <span className="text-[#4CAF50] font-extrabold">{currentTime || '08:00'}</span>
            </span>
            <span className="text-[10px] text-gray-400 font-medium block">
              快乐自学打卡进行中...
            </span>
          </div>

          {/* Quick tab controls */}
          <div className="flex bg-[#F1F3F2] p-1.5 rounded-2xl border-none">
            <button
              onClick={handleNavigateHome}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${curView === 'dashboard' ? 'bg-white shadow-xs text-[#4CAF50]' : 'text-gray-500 hover:text-gray-800'}`}
            >
              <Home className="w-3.5 h-3.5" />
              主页仪表盘
            </button>
            <button
              onClick={() => handleNavigateDetail()}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${curView === 'learning_detail' ? 'bg-[#4CAF50] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              进入大目录
            </button>
          </div>

          {/* User Avatar with gradient background */}
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-md bg-gradient-to-tr from-green-400 to-blue-400 shrink-0"></div>
        </div>
      </header>

      {/* 📺 Body view viewport with smooth slide transition */}
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {curView === 'dashboard' ? (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
            >
              <Dashboard 
                points={points} 
                checkedPoints={checkedPoints} 
                onNavigateDetail={handleNavigateDetail} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="learning-view"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              <LearningDetail
                points={points}
                checkedPoints={checkedPoints}
                onCheckPoint={handleCheckPoint}
                onNavigateHome={handleNavigateHome}
                initialCategoryFilter={focusCategory}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🚀 Overarching gamified congrats popup modal when user completes interactive quiz */}
      <AnimatePresence>
        {celebratePoint && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 20, stiffness: 250 }}
              className="bg-white max-w-sm w-full p-6 text-center rounded-[2.5rem] shadow-2xl relative overflow-hidden border-4 border-dashed border-yellow-300"
            >
              {/* Confetti element decorations */}
              <div className="absolute -top-12 -left-12 w-28 h-28 bg-emerald-150 rounded-full blur-xl opacity-30"></div>
              <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-yellow-150 rounded-full blur-xl opacity-30"></div>
              
              <div className="relative">
                {/* Visual medal symbol */}
                <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-white text-4xl mx-auto shadow-md shadow-yellow-200 animate-bounce mb-3">
                  🥇
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-750 font-bold text-xs uppercase mb-2">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  数学小达人成就达成！
                </div>

                <h3 className="text-lg font-black text-slate-850 mt-1">
                  《{celebratePoint}》预习完美通关！
                </h3>
                
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  你太优秀啦！你不仅阅读了本章的核心微课堂例题，还成功攻破了三道精心准备的斑马互动练习题，该知识点已自动标记为 <b>“已教会 ✅”</b>！
                </p>

                {/* Advice statement */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[10px] text-emerald-700 font-bold mt-4">
                  💡 快点击“继续攻克其它分类”，保持学习动力，冲击更高的数学荣誉称号吧！
                </div>

                <div className="mt-5">
                  <button 
                    onClick={() => {
                      setCelebratePoint(null);
                      playSoftClick();
                    }}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs rounded-2xl shadow-md shadow-emerald-150 hover:opacity-95 active:scale-95 transition cursor-pointer"
                  >
                    太棒了，继续挑战！
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand Footer Styled like Bento Grid specifications */}
      <footer className="max-w-7xl mx-auto mt-12 mb-8 bg-[#EEF2F1] border border-[#E0E7E4] rounded-[24px] px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-bold uppercase tracking-wider select-none gap-2">
        <div>240 知识点已就绪 · 本地数据存储已成功激活</div>
        <div className="flex items-center gap-4">
          <span>版本 V2.0</span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse"></div>
            在预习同步状态中
          </span>
        </div>
      </footer>

    </div>
  );
}
