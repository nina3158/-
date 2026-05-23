/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  CheckSquare, 
  Square,
  Sparkles,
  Download,
  Menu,
  X,
  ArrowLeft,
  GraduationCap
} from 'lucide-react';
import { KnowledgePoint, CATEGORY_MAP, CATEGORY_THEMES, formatGrade } from '../data';

interface LearningDetailProps {
  points: KnowledgePoint[];
  checkedPoints: Record<string, boolean>;
  onCheckPoint: (id: string, isChecked: boolean) => void;
  onNavigateHome: () => void;
  initialCategoryFilter?: string | null;
}

export default function LearningDetail({
  points,
  checkedPoints,
  onCheckPoint,
  onNavigateHome,
  initialCategoryFilter
}: LearningDetailProps) {
  
  // Sidebar State & Search
  const [searchText, setSearchText] = useState('');
  const [activePoint, setActivePoint] = useState<KnowledgePoint | null>(null);
  
  // Mobile drawer state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Expanded categories & subcategories trackers
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {
      '数与代数': true,
      '几何': true,
      '统计与概率': true,
      '解决问题': true,
    };
    if (initialCategoryFilter) {
      // Collapse others, open only the requested one
      Object.keys(initial).forEach(k => {
        initial[k] = k === initialCategoryFilter;
      });
    }
    return initial;
  });

  const [expandedSubCategories, setExpandedSubCategories] = useState<Record<string, boolean>>({});

  // Auto select first match on load or filter change
  useEffect(() => {
    if (points.length > 0) {
      if (initialCategoryFilter) {
        const matches = points.filter(p => p.category === initialCategoryFilter);
        if (matches.length > 0) {
          setActivePoint(matches[0]);
          // Expand matching subcategory automatically
          setExpandedSubCategories(prev => ({
            ...prev,
            [matches[0].subCategory]: true
          }));
          return;
        }
      }
      setActivePoint(points[0]);
      setExpandedSubCategories(prev => ({
        ...prev,
        [points[0].subCategory]: true
      }));
    }
  }, [initialCategoryFilter, points]);

  // Hook up browser iframe message listeners (e.g. complete quiz checks item automatically)
  useEffect(() => {
    const handleCompleteMsg = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PREVIEW_COMPLETE') {
        const pointName = event.data.name;
        const matchingPoint = points.find(p => p.name === pointName);
        if (matchingPoint && !checkedPoints[matchingPoint.id]) {
          onCheckPoint(matchingPoint.id, true);
        }
      }
    };
    
    window.addEventListener('message', handleCompleteMsg);
    return () => window.removeEventListener('message', handleCompleteMsg);
  }, [points, checkedPoints, onCheckPoint]);

  // Expand categories / subcategories if search matches
  useEffect(() => {
    if (searchText.trim().length > 0) {
      const activeCats: Record<string, boolean> = {};
      const activeSubs: Record<string, boolean> = {};
      
      points.forEach(p => {
        if (p.name.includes(searchText) || p.subCategory.includes(searchText)) {
          activeCats[p.category] = true;
          activeSubs[p.subCategory] = true;
        }
      });
      
      setExpandedCategories(prev => ({ ...prev, ...activeCats }));
      setExpandedSubCategories(prev => ({ ...prev, ...activeSubs }));
    }
  }, [searchText, points]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleSubCategory = (subCat: string) => {
    setExpandedSubCategories(prev => ({ ...prev, [subCat]: !prev[subCat] }));
  };

  // Structured query tree data
  const menuTree = useMemo(() => {
    // Group categories
    const categoriesList = ['数与代数', '几何', '统计与概率', '解决问题'];
    
    return categoriesList.map(cat => {
      const allPointsInCat = points.filter(p => p.category === cat);
      
      // Filter list based on search text
      const filteredPointsInCat = allPointsInCat.filter(p => {
        if (!searchText) return true;
        return p.name.includes(searchText) || p.subCategory.includes(searchText);
      });

      // Group subcategories in this category
      const subCategoriesMap: Record<string, KnowledgePoint[]> = {};
      filteredPointsInCat.forEach(p => {
        if (!subCategoriesMap[p.subCategory]) {
          subCategoriesMap[p.subCategory] = [];
        }
        subCategoriesMap[p.subCategory].push(p);
      });

      const subCategories = Object.entries(subCategoriesMap).map(([subTitle, items]) => {
        return {
          title: subTitle,
          items: items.sort((a, b) => {
            // Sort roughly by grade rank
            return a.grade.localeCompare(b.grade);
          })
        };
      });

      return {
        rawCategory: cat,
        uiName: CATEGORY_MAP[cat] || cat,
        subCategories,
        totalItemsInCat: filteredPointsInCat.length
      };
    });
  }, [points, searchText]);

  // Export schedules CSV format handler
  const handleExportCSV = () => {
    const unchecked = points.filter(p => !checkedPoints[p.id]);
    
    // Add UTF-8 BOM so Excel opens it with Chinese text safely
    const csvContent = "\uFEFF" + [
      // CSV column headers
      ["大分类模块", "知识点方向", "核心知识点名称", "对应大纲年级", "掌握状态", "预习打卡计划", "教师建议建议"].join(","),
      // rows mapping
      ...unchecked.map(p => [
        CATEGORY_MAP[p.category] || p.category,
        p.subCategory,
        p.name,
        formatGrade(p.grade),
        "未攻克 (待学习)",
        "本周待安排预习",
        `建议课前花10分钟阅读该板块例题精讲并完成斑马互动小游戏！`
      ].map(field => `"${field.replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `小学数学提前预习课程规划表_${unchecked.length}个未学点.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sidebar Render Structure
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-white select-none">
      
      {/* Sidebar header controller */}
      <div className="p-4 border-b border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-xs text-[#4CAF50] hover:text-green-600 font-bold transition focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            返回主仪表盘
          </button>
          
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-1 bg-[#E3F2FD] text-[#1976D2] px-2.5 py-1.5 rounded-full font-bold text-[10px] hover:bg-[#BBDEFB] transition-colors cursor-pointer select-none shadow-xs"
            title="导出课程规划表"
          >
            <Download className="w-3 h-3" />
            <span>导出课程表</span>
          </button>
        </div>

        {/* Dynamic Search box */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="搜索知识点方向 (如: 分数)"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-[#F1F3F2] border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] pr-4 transition font-medium text-slate-705 placeholder-slate-400"
          />
          {searchText && (
            <button 
              onClick={() => setSearchText('')}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Primary list folder catalog */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {menuTree.map(cat => {
          const isCatExpanded = !!expandedCategories[cat.rawCategory];
          const hasChildren = cat.subCategories.length > 0;
          const theme = CATEGORY_THEMES[cat.rawCategory] || CATEGORY_THEMES['数与代数'];
          
          return (
            <div key={cat.rawCategory} className="border border-slate-50 rounded-2xl p-1 bg-slate-50/50 space-y-1">
              {/* Category folding banner */}
              <button
                onClick={() => toggleCategory(cat.rawCategory)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition ${isCatExpanded ? 'bg-white font-black text-slate-800' : 'hover:bg-white text-slate-600 font-bold'} text-xs text-left cursor-pointer`}
              >
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${theme.primary}`}></span>
                  <span>{cat.uiName}</span>
                  <span className="text-[9px] font-bold text-gray-400 font-mono">({cat.totalItemsInCat})</span>
                </div>
                {isCatExpanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
              </button>

              {/* Subcategories (2nd level) */}
              {isCatExpanded && (
                <div className="pl-2.5 pr-1 py-1 space-y-2 border-l border-slate-100 ml-3.5">
                  {hasChildren ? (
                    cat.subCategories.map(sub => {
                      const isSubExpanded = !!expandedSubCategories[sub.title];
                      
                      return (
                        <div key={sub.title} className="space-y-1">
                          {/* Subcategory toggler button */}
                          <button
                            onClick={() => toggleSubCategory(sub.title)}
                            className={`w-full flex items-center justify-between p-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition text-left cursor-pointer`}
                          >
                            <span className="truncate pr-1">📂 {sub.title}</span>
                            {isSubExpanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
                          </button>

                          {/* Knowledge points (3rd level list items) */}
                          {isSubExpanded && (
                            <div className="pl-3.5 space-y-1 mt-0.5 border-l border-slate-200">
                              {sub.items.map(item => {
                                const isActive = activePoint?.id === item.id;
                                const isChecked = !!checkedPoints[item.id];
                                
                                return (
                                  <div
                                    key={item.id}
                                    className={`w-full group flex items-center justify-between gap-1.5 p-1.5 rounded-lg text-xs transition duration-100 ${isActive ? 'bg-green-50 text-[#4CAF50] font-bold' : 'hover:bg-slate-100 text-slate-550'}`}
                                  >
                                    {/* Left segment: Checkbox and title */}
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onCheckPoint(item.id, !isChecked);
                                        }}
                                        className="text-gray-400 hover:text-[#4CAF50] shrink-0 focus:outline-none"
                                        title={isChecked ? '标记为未学' : '打卡学习完成'}
                                      >
                                        {isChecked ? (
                                          <CheckSquare className="w-4 h-4 text-[#4CAF50] fill-green-50" />
                                        ) : (
                                          <Square className="w-4 h-4" />
                                        )}
                                      </button>
                                      
                                      <span 
                                        onClick={() => {
                                          setActivePoint(item);
                                          setMobileSidebarOpen(false);
                                        }}
                                        className="truncate cursor-pointer flex-1 py-0.5 text-left text-[11px]"
                                        title={item.name}
                                      >
                                        {item.name}
                                      </span>
                                    </div>

                                    {/* Right segment: Grade label */}
                                    {item.grade && (
                                      <span className="shrink-0 text-[8px] scale-90 px-1.5 py-0.5 bg-slate-200/60 font-semibold rounded-md text-slate-500">
                                        {formatGrade(item.grade)}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-[10px] text-gray-400 py-1 pl-1">未搜索到匹配考点</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* User Progress snapshot at bottom of sidebar */}
      <div className="p-3 bg-slate-50 border-t border-slate-100">
        <div className="text-[10px] text-gray-450 uppercase font-semibold flex justify-between mb-1.5">
          <span>🎯 已提前学会知识点占比</span>
          <span className="font-bold text-[#4CAF50]">
            {points.filter(p => checkedPoints[p.id]).length} / {points.length}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#4CAF50] rounded-full transition-all duration-300"
            style={{ width: `${(points.filter(p => checkedPoints[p.id]).length / points.length) * 100}%` }}
          ></div>
        </div>
      </div>

    </div>
  );

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col md:flex-row rounded-[32px] bg-white border border-[#E0E7E4] overflow-hidden shadow-sm relative">
      
      {/* 💻 Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:block w-72 shrink-0 border-r border-[#E0E7E4] flex flex-col">
        {renderSidebarContent()}
      </aside>

      {/* 📱 Mobile drawer toggler trigger bar */}
      <div className="md:hidden flex items-center justify-between p-3 bg-slate-50 border-b border-[#E0E7E4] select-none">
        <button 
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>大厅</span>
        </button>
        
        <div className="flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span className="text-xs font-black text-slate-805 truncate max-w-[120px]">
            {activePoint ? activePoint.name : '数学课程目录'}
          </span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1 px-2.5 bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 focus:outline-none"
        >
          {mobileSidebarOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          <span>选书目录</span>
        </button>
      </div>

      {/* 📱 Mobile Sidebar Slide Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end"
          >
            {/* Click outside to minimize */}
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)}></div>
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 bg-white h-full shadow-2xl relative"
            >
              {renderSidebarContent()}
              
              {/* Close floating tag */}
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-3 right-3 p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🖥️ IFrame Learning Content Panel (right pane) */}
      <main className="flex-1 flex flex-col bg-slate-50 relative">
        <AnimatePresence mode="wait">
          {activePoint ? (
            <motion.div 
              key={activePoint.id}
              initial={{ opacity: 0, scale: 0.995 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.995 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              
              {/* Quick info toolbar on desktop/large screens */}
              <div className="hidden md:flex items-center justify-between p-3.5 bg-white border-b border-[#E0E7E4] select-none">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${CATEGORY_THEMES[activePoint.category]?.primary || 'bg-[#4CAF50]'}`}></span>
                  <span className="text-xs text-gray-400">大纲知识点：</span>
                  <h1 className="text-sm font-bold text-slate-800">
                    {activePoint.name}
                  </h1>
                  <span className="text-[10px] bg-slate-100 font-bold text-slate-500 px-2.5 py-0.5 rounded-full">
                    {formatGrade(activePoint.grade)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-400 font-medium">预习打卡：</span>
                  <button
                    onClick={() => onCheckPoint(activePoint.id, !checkedPoints[activePoint.id])}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer border transition duration-150 ${checkedPoints[activePoint.id] ? 'bg-emerald-50 text-[#4CAF50] border-[#4CAF50]/30' : 'bg-slate-50 hover:bg-slate-100 border-[#E0E7E4] text-[#2D3436]'}`}
                  >
                    {checkedPoints[activePoint.id] ? (
                      <>
                        <CheckSquare className="w-3.5 h-3.5 text-[#4CAF50]" />
                        已学会打卡
                      </>
                    ) : (
                      <>
                        <Square className="w-3.5 h-3.5 text-gray-400" />
                        标记已学会
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Dynamic educational sandbox iframe rendering right context HTML */}
              <div className="flex-1 min-h-[500px] w-full relative bg-slate-100">
                <iframe
                  id="knowledge-point-iframe"
                  src={`./knowledge/${encodeURIComponent(activePoint.name)}.html`}
                  className="absolute inset-0 w-full h-full border-0 rounded-2xl md:p-3"
                  title={activePoint.name}
                  allow="autoplay; geolocation; microphone; camera"
                />
              </div>

            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <div class="text-6xl animate-bounce">🗺️</div>
              <p class="text-xs mt-3 font-semibold">请在左侧点击一个具体的知识点方向，开启快乐提前学冒险吧！</p>
            </div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}
