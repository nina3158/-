/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { formatGrade } from './data';

/**
 * Generates custom, educational, and high-fidelity interactive HTML content
 * for any of the 240 math knowledge points.
 */
export function generateKnowledgeHTML(
  name: string,
  category: string,
  subCategory: string,
  grade: string,
  customGameUrl?: string
): string {
  // Select color schemes based on Category
  let themeColor = 'emerald';
  let primaryHex = '#10b981'; // emerald-500
  let primaryDark = '#047857'; // emerald-700
  let bgGradient = 'from-emerald-50 to-teal-50';
  let bannerBg = 'from-emerald-400 to-teal-500';

  if (category === '几何') {
    themeColor = 'blue';
    primaryHex = '#3b82f6';
    primaryDark = '#1d4ed8';
    bgGradient = 'from-blue-50 to-indigo-50';
    bannerBg = 'from-blue-400 to-indigo-500';
  } else if (category === '统计与概率') {
    themeColor = 'amber';
    primaryHex = '#f59e0b';
    primaryDark = '#b45309';
    bgGradient = 'from-amber-50 to-orange-50';
    bannerBg = 'from-amber-400 to-orange-500';
  } else if (category === '解决问题') {
    themeColor = 'purple';
    primaryHex = '#a855f7';
    primaryDark = '#6b21a8';
    bgGradient = 'from-purple-50 to-fuchsia-50';
    bannerBg = 'from-purple-400 to-fuchsia-500';
  }

  const gradeText = formatGrade(grade);

  // Generate specific interactive widgets depending on the SubCategory and Name of the knowledge point!
  let interactiveSectionHTML = '';

  if (subCategory === '数的认识') {
    // Number cognition widget - visual counters
    interactiveSectionHTML = `
      <div class="bg-white p-6 rounded-2xl border-4 border-dashed border-${themeColor}-200 shadow-sm">
        <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>🎯 数数沙盒 (Interactive Counter Sandbox)</span>
        </h3>
        <p class="text-sm text-gray-600 mb-4">拖动滑块或点击加减，观察下方苹果或星星数量的变化，感受数字和数量的奇妙关联吧！</p>
        <div class="flex items-center gap-4 justify-center bg-${themeColor}-50 p-4 rounded-xl mb-4">
          <button id="btn-dec" class="w-10 h-10 bg-white border-2 border-${themeColor}-400 active:translate-y-0.5 text-${themeColor}-500 hover:bg-${themeColor}-100 transition rounded-full font-bold text-lg select-none">-</button>
          <span id="counter-val" class="font-bold text-3xl text-gray-800 tracking-tight w-16 text-center">5</span>
          <button id="btn-inc" class="w-10 h-10 bg-white border-2 border-${themeColor}-400 active:translate-y-0.5 text-${themeColor}-500 hover:bg-${themeColor}-100 transition rounded-full font-bold text-lg select-none">+</button>
        </div>
        
        <input type="range" id="counter-slider" min="0" max="20" value="5" class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-${themeColor}-500 mb-6">
        
        <div class="border-t border-gray-100 pt-4">
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">实物模型：</div>
          <div id="entities-container" class="flex flex-wrap gap-3 items-center justify-center min-h-[80px] p-2 bg-slate-50 rounded-xl">
            <!-- Emojis populated by JS -->
          </div>
        </div>
      </div>
      <script>
        (function() {
          const valEl = document.getElementById('counter-val');
          const slider = document.getElementById('counter-slider');
          const btnDec = document.getElementById('btn-dec');
          const btnInc = document.getElementById('btn-inc');
          const container = document.getElementById('entities-container');
          
          const emojis = ['🍎', '🍓', '🎈', '⭐️', '🍬', '🐼', '🌻', '🚗'];
          const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];
          
          function update(val) {
            val = Math.max(0, Math.min(20, val));
            valEl.textContent = val;
            slider.value = val;
            
            // Re-render emojis
            container.innerHTML = '';
            if (val === 0) {
              container.innerHTML = '<span class="text-gray-400 text-sm">现在是数字 0 哦，一个果果也没有呢~</span>';
            } else {
              for (let i = 0; i < val; i++) {
                const item = document.createElement('div');
                item.className = 'text-3xl transform hover:scale-125 transition cursor-pointer active:rotate-12 m-1 animate-bounce';
                item.style.animationDelay = (i * 0.05) + 's';
                item.style.animationDuration = '2s';
                item.innerHTML = selectedEmoji;
                container.appendChild(item);
              }
            }
          }
          
          slider.oninput = (e) => {
            update(parseInt(e.target.value) || 0);
            playTone(400 + (parseInt(e.target.value) * 30), 0.05);
          };
          btnDec.onclick = () => {
            const v = parseInt(slider.value) - 1;
            update(v);
            playTone(350, 0.08);
          };
          btnInc.onclick = () => {
            const v = parseInt(slider.value) + 1;
            update(v);
            playTone(450, 0.08);
          };
          
          update(5);
        })();
      </script>
    `;
  } else if (subCategory === '加减法' || name.includes('加') || name.includes('减')) {
    // Addition Subtraction widget
    interactiveSectionHTML = `
      <div class="bg-white p-6 rounded-2xl border-4 border-dashed border-${themeColor}-200 shadow-sm">
        <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>🧮 能量小斑马计算器 (Visual Equation Calculator)</span>
        </h3>
        <p class="text-sm text-gray-600 mb-4">通过增减左盘和右盘的七彩石子，直观感受加减运算的合成与分解关系！</p>
        
        <div class="grid grid-cols-5 gap-2 items-center justify-center p-3 bg-gray-50 rounded-xl mb-4 text-center">
          <div>
            <div class="text-xs text-gray-400 mb-1">左加数 (A)</div>
            <input type="number" id="math-a" min="1" max="10" value="4" class="w-full p-2 border-2 border-gray-200 rounded-lg text-center font-bold">
          </div>
          <div class="text-2xl font-bold text-gray-600" id="op-sym">+</div>
          <div>
            <div class="text-xs text-gray-400 mb-1">右加数 (B)</div>
            <input type="number" id="math-b" min="1" max="10" value="3" class="w-full p-2 border-2 border-gray-200 rounded-lg text-center font-bold">
          </div>
          <div class="text-2xl font-bold text-gray-600">=</div>
          <div>
            <div class="text-xs text-gray-400 mb-1">结果 (C)</div>
            <div id="math-result" class="p-2 text-xl font-extrabold text-${themeColor}-600">7</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
          <div class="p-2 bg-rose-50 rounded-lg">
            <div class="text-xs font-semibold text-rose-500 mb-2 flex justify-between">
              <span>🔴 左托盘的石子：</span>
              <span id="label-count-a">4</span>
            </div>
            <div id="tray-a" class="flex flex-wrap gap-2 justify-center min-h-[60px]"></div>
          </div>
          <div class="p-2 bg-indigo-50 rounded-lg">
            <div class="text-xs font-semibold text-indigo-500 mb-2 flex justify-between">
              <span>🔵 右托盘的石子：</span>
              <span id="label-count-b">3</span>
            </div>
            <div id="tray-b" class="flex flex-wrap gap-2 justify-center min-h-[60px]"></div>
          </div>
        </div>
      </div>
      <script>
        (function() {
          const inputA = document.getElementById('math-a');
          const inputB = document.getElementById('math-b');
          const resEl = document.getElementById('math-result');
          const trayA = document.getElementById('tray-a');
          const trayB = document.getElementById('tray-b');
          const lblA = document.getElementById('label-count-a');
          const lblB = document.getElementById('label-count-b');
          
          function solve() {
            let a = parseInt(inputA.value) || 0;
            let b = parseInt(inputB.value) || 0;
            a = Math.max(0, Math.min(20, a));
            b = Math.max(0, Math.min(20, b));
            inputA.value = a;
            inputB.value = b;
            
            lblA.textContent = a;
            lblB.textContent = b;
            resEl.textContent = a + b;
            
            trayA.innerHTML = '';
            for(let i=0; i<a; i++) {
              const dot = document.createElement('div');
              dot.className = 'w-6 h-6 rounded-full bg-rose-400 shadow-sm animate-pulse flex items-center justify-center text-[10px] text-white font-bold';
              dot.textContent = i+1;
              trayA.appendChild(dot);
            }
            
            trayB.innerHTML = '';
            for(let i=0; i<b; i++) {
              const dot = document.createElement('div');
              dot.className = 'w-6 h-6 rounded-full bg-indigo-400 shadow-sm animate-pulse flex items-center justify-center text-[10px] text-white font-bold';
              dot.textContent = i+1;
              trayB.appendChild(dot);
            }
          }
          
          inputA.oninput = () => { solve(); playTone(380, 0.05); };
          inputB.oninput = () => { solve(); playTone(420, 0.05); };
          
          solve();
        })();
      </script>
    `;
  } else if (subCategory === '乘法' || subCategory === '除法' || name.includes('乘') || name.includes('除')) {
    // Multiplication / Division widget
    const isDivision = subCategory === '除法' || name.includes('除');
    interactiveSectionHTML = `
      <div class="bg-white p-6 rounded-2xl border-4 border-dashed border-${themeColor}-200 shadow-sm">
        <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>🍪 ${isDivision ? '分饼干大作战 (Cookie Sharing Division)' : '方阵点阵图 (Row x Col Multiplier Grid)'}</span>
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          ${isDivision 
            ? '共有若干块小饼干，我们要平均分配到不同的小盘子里。拖动分饼干滑块，看看每个人能分得几块，还剩几块吧！' 
            : '通过网格矩阵直观探索乘法的物理含义：行 × 列。调整参数，看能量方块如何排列组合！'}
        </p>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1" id="label-num1">${isDivision ? '🍪 总饼干数：' : '↔️ 网格行数 (Rows)：'}</label>
            <input type="range" id="param-1" min="1" max="12" value="4" class="w-full accent-${themeColor}-500">
            <span id="param-1-val" class="text-sm font-bold text-gray-700">4</span>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1" id="label-num2">${isDivision ? '👶 人数/盘子：' : '↕️ 网格列数 (Cols)：'}</label>
            <input type="range" id="param-2" min="1" max="8" value="3" class="w-full accent-${themeColor}-500">
            <span id="param-2-val" class="text-sm font-bold text-gray-700">3</span>
          </div>
        </div>
        
        <div class="p-3 bg-gray-50 border border-gray-100 rounded-xl mb-4 text-center">
          <div id="math-expression" class="font-extrabold text-2xl text-${themeColor}-600 tracking-wide">4 × 3 = 12</div>
        </div>

        <div class="border-t border-gray-100 pt-4 flex justify-center">
          <div id="grid-canvas-container" class="p-2 bg-slate-50 rounded-xl overflow-auto max-w-full flex justify-center items-center">
            <!-- Render grids or shared bags dynamically by JS -->
          </div>
        </div>
      </div>
      <script>
        (function() {
          const isDiv = ${isDivision};
          const p1 = document.getElementById('param-1');
          const p2 = document.getElementById('param-2');
          const p1Val = document.getElementById('param-1-val');
          const p2Val = document.getElementById('param-2-val');
          const expr = document.getElementById('math-expression');
          const canvas = document.getElementById('grid-canvas-container');
          
          if (isDiv) {
            // Adjust bounds for division
            p1.min = 1; p1.max = 30; p1.value = 14;
            p2.min = 1; p2.max = 8; p2.value = 4;
          } else {
            p1.min = 1; p1.max = 10; p1.value = 5;
            p2.min = 1; p2.max = 10; p2.value = 4;
          }
          
          function redraw() {
            const v1 = parseInt(p1.value);
            const v2 = parseInt(p2.value);
            p1Val.textContent = v1;
            p2Val.textContent = v2;
            
            if (isDiv) {
              const quotient = Math.floor(v1 / v2);
              const remainder = v1 % v2;
              expr.innerHTML = \`\${v1} ÷ \${v2} = \${quotient} \${remainder > 0 ? ('... (余 ' + remainder + ')') : ''}\`;
              
              // Share visual design
              canvas.innerHTML = '';
              const flexDir = document.createElement('div');
              flexDir.className = 'flex flex-col gap-3 w-full';
              
              // Draw plate/bag shares
              const plateGroup = document.createElement('div');
              plateGroup.className = 'grid grid-cols-4 gap-2';
              if (v2 <= 4) plateGroup.className = 'grid grid-cols-2 gap-2 text-xs';
              
              for (let i = 0; i < v2; i++) {
                const plate = document.createElement('div');
                plate.className = 'bg-white p-2 rounded-lg border-2 border-amber-200 text-center shadow-xs min-h-[50px]';
                plate.innerHTML = \`<div class="font-bold text-gray-400 mb-1">第 \${i+1} 盘</div><div class="flex flex-wrap gap-1 justify-center">\`;
                for (let q = 0; q < quotient; q++) {
                  plate.querySelector('div:last-child').innerHTML += '🍪';
                }
                plate.innerHTML += '</div>';
                plateGroup.appendChild(plate);
              }
              flexDir.appendChild(plateGroup);
              
              if (remainder > 0) {
                const remPlate = document.createElement('div');
                remPlate.className = 'bg-rose-50 p-2 rounded-lg border-2 border-rose-200 text-center';
                remPlate.innerHTML = \`<span class="font-bold text-rose-600 text-xs">剩下没分完的：</span> \`;
                for (let r = 0; r < remainder; r++) {
                  remPlate.innerHTML += '🍪 ';
                }
                flexDir.appendChild(remPlate);
              }
              canvas.appendChild(flexDir);
              
            } else {
              expr.textContent = \`\${v1} × \${v2} = \${v1 * v2}\`;
              // Draw dot grid rows x cols
              canvas.innerHTML = '';
              const table = document.createElement('div');
              table.className = 'flex flex-col gap-2 p-1';
              
              for (let r = 0; r < v1; r++) {
                const row = document.createElement('div');
                row.className = 'flex gap-2';
                for (let c = 0; c < v2; c++) {
                  const dot = document.createElement('div');
                  dot.className = 'w-5 h-5 rounded-md bg-emerald-500 shadow-xs ring-2 ring-emerald-300 transition-all transform hover:scale-125';
                  row.appendChild(dot);
                }
                table.appendChild(row);
              }
              canvas.appendChild(table);
            }
          }
          
          p1.oninput = () => { redraw(); playTone(300 + parseInt(p1.value) * 10, 0.05); };
          p2.oninput = () => { redraw(); playTone(300 + parseInt(p2.value) * 20, 0.05); };
          
          redraw();
        })();
      </script>
    `;
  } else if (subCategory === '小数' || subCategory === '分数' || name.includes('分数') || name.includes('小数') || name.includes('百分数')) {
    // Decimal/Fraction visual pizza slicer widget
    interactiveSectionHTML = `
      <div class="bg-white p-6 rounded-2xl border-4 border-dashed border-${themeColor}-200 shadow-sm">
        <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>🍕 切披萨饼模型 (Fraction / Decimal Pie Slicer)</span>
        </h3>
        <p class="text-sm text-gray-600 mb-4">滑动调节被切割的网格配额，直观探索分数、小数和百分数之间的映射转换关系！</p>
        
        <div class="space-y-4 mb-4">
          <div>
            <div class="flex justify-between text-xs font-semibold text-gray-500 mb-1">
              <span>🔢 涂色遮罩份数：</span>
              <span id="frac-shaded" class="font-bold text-${themeColor}-600 text-sm">3</span>
            </div>
            <input type="range" id="shaded-slider" min="0" max="100" value="30" class="w-full accent-${themeColor}-500">
          </div>
        </div>
        
        <div class="grid grid-cols-3 gap-2 text-center py-2 bg-gray-50 rounded-xl mb-4">
          <div class="border-r border-gray-100">
            <div class="text-[10px] text-gray-400">分数表示</div>
            <div id="text-fraction" class="font-extrabold text-xl text-gray-700">30/100</div>
          </div>
          <div class="border-r border-gray-100">
            <div class="text-[10px] text-gray-400">小数表示</div>
            <div id="text-decimal" class="font-extrabold text-xl text-gray-700">0.30</div>
          </div>
          <div>
            <div class="text-[10px] text-gray-400">百分比表示</div>
            <div id="text-percent" class="font-extrabold text-xl text-${themeColor}-600">30%</div>
          </div>
        </div>

        <div class="flex justify-center pt-2">
          <div class="relative w-32 h-32 rounded-full border-4 border-gray-100 bg-gray-100 flex items-center justify-center overflow-hidden" id="visual-circle">
            <div id="shaded-overlay" class="absolute bottom-0 left-0 right-0 bg-${themeColor}-400 opacity-60 transition-all duration-300 pointer-events-none" style="height: 30%;"></div>
            <span class="z-10 font-bold text-gray-800" id="circle-caption">30%</span>
          </div>
        </div>
      </div>
      <script>
        (function() {
          const slider = document.getElementById('shaded-slider');
          const lblShaded = document.getElementById('frac-shaded');
          const txtFrac = document.getElementById('text-fraction');
          const txtDec = document.getElementById('text-decimal');
          const txtPct = document.getElementById('text-percent');
          const overlay = document.getElementById('shaded-overlay');
          const cCap = document.getElementById('circle-caption');
          
          function update() {
            const val = parseInt(slider.value);
            lblShaded.textContent = val + ' 份 (共 100 份)';
            
            // Common fraction reduction
            let num = val;
            let den = 100;
            const gcd = (a, b) => b ? gcd(b, a % b) : a;
            const d = gcd(val, 100);
            
            txtFrac.innerHTML = val === 0 ? '0' : \`<span class="border-b border-gray-600 block w-max mx-auto">\${val/d}</span><span>\${100/d}</span>\`;
            txtDec.textContent = (val / 100).toFixed(2);
            txtPct.textContent = val + '%';
            overlay.style.height = val + '%';
            cCap.textContent = val + '%';
          }
          
          slider.oninput = () => { update(); playTone(300 + parseInt(slider.value) * 4, 0.05); };
          update();
        })();
      </script>
    `;
  } else if (category === '几何') {
    // 3D/2D geometry board canvas visualizer
    interactiveSectionHTML = `
      <div class="bg-white p-6 rounded-2xl border-4 border-dashed border-${themeColor}-200 shadow-sm">
        <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>📐 几何白板与特性计算 (Interactive Geometry Sandbox)</span>
        </h3>
        <p class="text-sm text-gray-600 mb-4">通过滑动条拉伸图形尺寸，动态观察周长、面积或特殊属性的变化，掌握几何公式！</p>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1">📏 底边 / 半径 / 长 (Width/Radius)</label>
            <input type="range" id="geo-r" min="10" max="90" value="50" class="w-full accent-blue-500">
            <span id="geo-r-val" class="text-xs text-gray-500">50 像素</span>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1">📏 高 / 宽度 (Height/Width)</label>
            <input type="range" id="geo-h" min="10" max="90" value="40" class="w-full accent-blue-500">
            <span id="geo-h-val" class="text-xs text-gray-500">40 像素</span>
          </div>
        </div>

        <div class="bg-slate-50 p-2 rounded-xl flex items-center justify-center min-h-[120px] border border-gray-100 mb-4">
          <canvas id="geo-canvas" width="200" height="120" class="bg-white border border-gray-200 rounded-lg shadow-inner"></canvas>
        </div>
        
        <div class="p-3 bg-blue-50 text-blue-800 rounded-xl text-center text-sm">
          <strong>计算结果：</strong> <span id="geo-calc-text">正在分析图形...</span>
        </div>
      </div>
      <script>
        (function() {
          const cvs = document.getElementById('geo-canvas');
          const ctx = cvs.getContext('2d');
          const inputW = document.getElementById('geo-r');
          const inputH = document.getElementById('geo-h');
          const valW = document.getElementById('geo-r-val');
          const valH = document.getElementById('geo-h-val');
          const calcText = document.getElementById('geo-calc-text');
          
          const title = "${name}";
          
          function draw() {
            const w = parseInt(inputW.value);
            const h = parseInt(inputH.value);
            valW.textContent = w + ' px';
            valH.textContent = h + ' px';
            
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#3b82f6';
            ctx.fillStyle = '#eff6ff';
            
            const cx = cvs.width / 2;
            const cy = cvs.height / 2;
            
            if (title.includes('圆') || title === '认识直径' || title === '认识半径') {
              // Draw Circle
              const radius = Math.min(w, h) / 2 + 10;
              ctx.beginPath();
              ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
              ctx.fill();
              ctx.stroke();
              
              // Draw radius line
              ctx.beginPath();
              ctx.moveTo(cx, cy);
              ctx.lineTo(cx + radius, cy);
              ctx.strokeStyle = '#ef4444';
              ctx.stroke();
              
              const circumference = (2 * Math.PI * radius).toFixed(1);
              const area = (Math.PI * radius * radius).toFixed(0);
              calcText.innerHTML = \`🔵 <b>圆形</b> - 半径: \${radius.toFixed(0)} px, 周长约为 \${circumference} px, 面积约为 \${area} px²\`;
              
            } else if (title.includes('三角形')) {
              // Draw Triangle
              ctx.beginPath();
              ctx.moveTo(cx, cy - h/2);
              ctx.lineTo(cx - w/2, cy + h/2);
              ctx.lineTo(cx + w/2, cy + h/2);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
              
              const area = (0.5 * w * h).toFixed(0);
              calcText.innerHTML = \`🔺 <b>三角形</b> - 底长: \${w} px, 高度: \${h} px, 面积: \${area} px²\`;
              
            } else {
              // Draw Rectangle/Square
              ctx.beginPath();
              ctx.rect(cx - w/2, cy - h/2, w, h);
              ctx.fill();
              ctx.stroke();
              
              const perimeter = (2 * (w + h));
              const area = (w * h);
              calcText.innerHTML = \`▢ <b>长方形/正方形</b> - 长: \${w} px, 宽: \${h} px, 周长: \${perimeter} px, 面积: \${area} px²\`;
            }
          }
          
          inputW.oninput = () => { draw(); playTone(350 + parseInt(inputW.value) * 2, 0.04); };
          inputH.oninput = () => { draw(); playTone(350 + parseInt(inputH.value) * 2, 0.04); };
          
          draw();
        })();
      </script>
    `;
  } else if (category === '统计与概率') {
    // Dynamic chart rolling dice statistics
    interactiveSectionHTML = `
      <div class="bg-white p-6 rounded-2xl border-4 border-dashed border-${themeColor}-200 shadow-sm">
        <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>🎲 掷骰子与频率统计模拟 (Probability Dice Roller)</span>
        </h3>
        <p class="text-sm text-gray-600 mb-4">点击按钮自动进行10-100次抛骰子试验，实时生成图形化频数直方图。亲自验证概率统计学的真理吧！</p>
        
        <div class="flex gap-2 justify-center mb-4">
          <button id="roll-once" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs transition select-none active:translate-y-0.5">🎲 投一次</button>
          <button id="roll-auto" class="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-xs transition select-none active:translate-y-0.5">⚡ 投 50 次</button>
          <button id="roll-clear" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition select-none">🧹 清零</button>
        </div>

        <div class="p-3 bg-gray-50 border border-gray-100 rounded-xl mb-4 text-center">
          <div class="text-xs text-gray-400">目前投掷：<span id="dice-total-count" class="font-bold text-amber-600 text-sm">0</span> 次</div>
          <div id="dice-result-show" class="text-3xl font-extrabold text-amber-500 tracking-wider h-10 mt-1 flex justify-center items-center">?</div>
        </div>

        <div class="space-y-2 border-t border-gray-100 pt-3">
          <div class="text-xs font-semibold text-gray-400 mb-2">频数统计直方图 (Real-time Bars)：</div>
          <div class="space-y-1.5" id="dice-bars-container">
            <!-- Bars will be drawn dynamically -->
          </div>
        </div>
      </div>
      <script>
        (function() {
          const btn1 = document.getElementById('roll-once');
          const btn50 = document.getElementById('roll-auto');
          const btnClear = document.getElementById('roll-clear');
          const display = document.getElementById('dice-result-show');
          const lblTotal = document.getElementById('dice-total-count');
          const container = document.getElementById('dice-bars-container');
          
          let stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
          let total = 0;
          
          function initBars() {
            container.innerHTML = '';
            for (let side = 1; side <= 6; side++) {
              const row = document.createElement('div');
              row.className = 'flex items-center text-xs';
              row.innerHTML = \`
                <span class="w-8 font-bold text-gray-600 text-right mr-3">\${side} 点:</span>
                <div class="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden mr-3 shadow-inner">
                  <div id="bar-\${side}" class="h-full bg-amber-400 rounded-full transition-all duration-300" style="width: 0%"></div>
                </div>
                <span id="count-\${side}" class="w-12 font-bold text-gray-500">0 次</span>
              \`;
              container.appendChild(row);
            }
          }
          
          function updateStats() {
            lblTotal.textContent = total;
            for (let side = 1; side <= 6; side++) {
              const count = stats[side];
              const percent = total > 0 ? (count / total * 100).toFixed(1) : 0;
              document.getElementById('bar-' + side).style.width = Math.min(100, percent * 2) + '%'; 
              document.getElementById('count-' + side).textContent = count + ' 次 (' + percent + '%)';
            }
          }
          
          function roll() {
            const side = Math.floor(Math.random() * 6) + 1;
            stats[side]++;
            total++;
            display.textContent = '🎲 ' + side;
            updateStats();
            playTone(300 + side * 50, 0.05);
          }
          
          btn1.onclick = () => { roll(); };
          btn50.onclick = () => {
            let i = 0;
            const timer = setInterval(() => {
              roll();
              i++;
              if (i >= 50) clearInterval(timer);
            }, 30);
          };
          btnClear.onclick = () => {
            stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
            total = 0;
            display.textContent = '?';
            updateStats();
            playTone(200, 0.1);
          };
          
          initBars();
          updateStats();
        })();
      </script>
    `;
  } else {
    // Problem Solving "Mystery Case Storyboard"
    interactiveSectionHTML = `
      <div class="bg-white p-6 rounded-2xl border-4 border-dashed border-${themeColor}-200 shadow-sm">
        <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>🧠 数学逻辑大通关 (Problem Solving Interactive Solver)</span>
        </h3>
        <p class="text-sm text-gray-600 mb-4">点击下面的选项或滑块探索经典问题，一步步揭示并验证背后的数学关系和解析思路！</p>
        
        <div class="bg-purple-50 p-4 rounded-xl mb-4 border border-purple-100">
          <div class="text-xs font-semibold text-purple-500 uppercase tracking-wider mb-1">🔍 问题情景 (Scenario)：</div>
          <div class="text-sm text-gray-700 leading-relaxed font-medium">
            “鸡兔同笼，上有三十五头，下有九十四足，问鸡兔各几何？”  
            这是一个经典的思维问题，让我们通过滑动“兔子”的数量，来亲自揭密脚印的变化，寻找正确规律吧！
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-xs font-semibold text-gray-500 mb-1">
              <span>假设兔子的只数 (Rabbits)：</span>
              <span id="rabbit-count" class="font-bold text-purple-600 text-sm">10 只</span>
            </div>
            <input type="range" id="rabbit-slider" min="0" max="35" value="10" class="w-full accent-purple-500">
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-2 text-center rounded-lg">
              <div class="text-[10px] text-gray-400">🐓 鸡的只数 (35 - 兔)</div>
              <div id="chicken-count" class="font-bold text-xl text-gray-700">25</div>
            </div>
            <div class="bg-gray-50 p-2 text-center rounded-lg">
              <div class="text-[10px] text-gray-400">🐾 计算总脚数 (4×兔 + 2×鸡)</div>
              <div id="foot-total" class="font-bold text-xl text-gray-700">90 / 94</div>
            </div>
          </div>
          
          <div id="solver-verdict" class="p-3 text-center font-bold rounded-xl">
            寻找平衡中...
          </div>
        </div>
      </div>
      <script>
        (function() {
          const slider = document.getElementById('rabbit-slider');
          const rabEl = document.getElementById('rabbit-count');
          const chickEl = document.getElementById('chicken-count');
          const footEl = document.getElementById('foot-total');
          const verdict = document.getElementById('solver-verdict');
          
          function solve() {
            const rabbits = parseInt(slider.value);
            const chickens = 35 - rabbits;
            const feet = (rabbits * 4) + (chickens * 2);
            
            rabEl.textContent = rabbits + ' 只';
            chickEl.textContent = chickens + ' 只';
            footEl.textContent = feet + ' 只脚';
            
            if (feet === 94) {
              verdict.className = 'p-3 text-center font-bold rounded-xl bg-emerald-100 text-emerald-800 border-2 border-emerald-300 animate-bounce';
              verdict.innerHTML = '🎉 太不可思议了！正解！鸡 23 只，兔 12 只，总脚数正好是 94 只！';
            } else if (feet < 94) {
              verdict.className = 'p-3 text-center font-bold rounded-xl bg-amber-50 text-amber-700 border border-amber-200';
              verdict.innerHTML = '🐾 脚印数：' + feet + ' (目标 94) - 太少了！试着增加一些胖乎乎的兔子(4只脚)吧！';
            } else {
              verdict.className = 'p-3 text-center font-bold rounded-xl bg-rose-50 text-rose-700 border border-rose-200';
              verdict.innerHTML = '🐾 脚印数：' + feet + ' (目标 94) - 太多啦！试着减少几只兔子，换成小鸡(2只脚)吧！';
            }
          }
          
          slider.oninput = () => { solve(); playTone(300 + parseInt(slider.value) * 10, 0.05); };
          solve();
        })();
      </script>
    `;
  }

  // If a custom game URL is available for this page, wrap the entire interactiveSectionHTML with tabs!
  if (customGameUrl) {
    interactiveSectionHTML = `
      <div class="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col mb-4">
        <!-- Tab Selectors -->
        <div class="flex border-b border-gray-150 bg-slate-50/70 p-1.5 gap-1.5 text-xs">
          <button id="tab-sandbox-btn" onclick="switchPracticeTab('sandbox')" class="flex-1 py-2.5 text-center rounded-2xl bg-white text-${themeColor}-700 font-bold shadow-xs border border-slate-200/50 transition-all cursor-pointer focus:outline-none flex items-center justify-center gap-1.5 select-none hover:text-${themeColor}-800">
            🎯 趣味数数沙盒 (System Sandbox)
          </button>
          <button id="tab-custom-btn" onclick="switchPracticeTab('custom')" class="flex-1 py-2.5 text-center rounded-2xl text-slate-500 hover:text-slate-800 font-semibold transition-all cursor-pointer focus:outline-none flex items-center justify-center gap-1.5 select-none hover:bg-slate-100">
            🧺 拖拽配对互动游戏 (Custom Game)
          </button>
        </div>
        
        <!-- Interactive SandBox Content Container -->
        <div id="tab-sandbox-content" class="p-0 transition-opacity duration-150">
          ${interactiveSectionHTML}
        </div>
        
        <!-- Custom Game Iframe Container -->
        <div id="tab-custom-content" class="hidden w-full h-[620px] relative bg-slate-50">
          <iframe id="custom-game-iframe" src="${customGameUrl}" class="w-full h-full border-0 rounded-b-3xl" allow="autoplay; geolocation; microphone; camera"></iframe>
        </div>
      </div>
      
      <script>
        function switchPracticeTab(mode) {
          const sBtn = document.getElementById('tab-sandbox-btn');
          const cBtn = document.getElementById('tab-custom-btn');
          const sCont = document.getElementById('tab-sandbox-content');
          const cCont = document.getElementById('tab-custom-content');
          
          if (mode === 'sandbox') {
            sBtn.className = "flex-1 py-2.5 text-center rounded-2xl bg-white text-${themeColor}-700 font-bold shadow-xs border border-slate-200/50 transition-all cursor-pointer focus:outline-none flex items-center justify-center gap-1.5 select-none";
            cBtn.className = "flex-1 py-2.5 text-center rounded-2xl text-slate-500 hover:text-slate-800 font-semibold transition-all cursor-pointer focus:outline-none flex items-center justify-center gap-1.5 select-none hover:bg-slate-100";
            
            sCont.classList.remove('hidden');
            cCont.classList.add('hidden');
          } else {
            cBtn.className = "flex-1 py-2.5 text-center rounded-2xl bg-white text-${themeColor}-700 font-bold shadow-xs border border-slate-200/50 transition-all cursor-pointer focus:outline-none flex items-center justify-center gap-1.5 select-none";
            sBtn.className = "flex-1 py-2.5 text-center rounded-2xl text-slate-500 hover:text-slate-800 font-semibold transition-all cursor-pointer focus:outline-none flex items-center justify-center gap-1.5 select-none hover:bg-slate-100";
            
            cCont.classList.remove('hidden');
            sCont.classList.add('hidden');
          }
        }
      </script>
    `;
  }

  // Generate 3 elegant, contextual questions tailored for the actual knowledge point!
  let q1Text = `在学完《${name}》之后，下面哪个选项是最基本的定义或代表性结论？`;
  let q1A = `与《${name}》密切相关的科学规律或常数。`;
  let q1B = `它是我们在课本中经常学到的基础算法。`;
  let q1C = `它是本章节核心的概念代表。`;
  let q1D = `以上全部选项都正确。`;
  let q1Ans = 'C';
  let q1Explain = `解析：本题考察对《${name}》的核心概念理解。它是这部分知识的基础。`;

  let q2Text = `假设我们有一组与《${name}》相关的应用模型。在具体计算中，如果遇到类似问题，应该遵循以下哪项原则？`;
  let q2A = '粗心大意，直接估算一个不相干的值。';
  let q2B = '按步骤认真审题，提取出数量关系，再进行列式计算。';
  let q2C = '完全放弃，等老师公布最终结果。';
  let q2D = '随便挑选两个数字相加减。';
  let q2Ans = 'B';
  let q2Explain = `巩固解析：这是数学学习的核心方法！无论是代数计算、几何画图还是实践问题，认真阅读和建立精确数量关系都是解答《${name}》不可或缺的黄金法则。`;

  let q3Text = `如果想在生活中应用我们学到的《${name}》知识，以下哪种情景最符合预设？`;
  let q3A = '在超市买水果时，用计算、比例或人民币换算来算账和找零。';
  let q3B = '用来确定物体的空间形状、包装箱容量或者操场面积。';
  let q3C = '通过收集数据和制作条形、折线图分析规律和可能性。';
  let q3D = '以上都是该知识点在生活中的巧妙运用，体现了“生活中处处有数学”。';
  let q3Ans = 'D';
  let q3Explain = `应用解析：数学是源自生活，服务生活的。学习《${name}》能强化我们在购物、几何构造和统计推断上的全面数学思考！`;

  // Provide some customized, interesting question overrides if we have specific string keywords!
  if (name.includes('10以内')) {
    q1Text = '小红手里有 3 个红苹果和 5 个绿苹果，她一共有多少个苹果？';
    q1A = '6 个';
    q1B = '7 个';
    q1C = '8 个';
    q1D = '9 个';
    q1Ans = 'C';
    q1Explain = '解析：把 3 和 5 合并起来，用加法计算：3 + 5 = 8 个苹果。';
  } else if (name.includes('0的认识')) {
    q1Text = '树上有 3 只小鸟在唱歌，过了一会儿，它们全都飞走了，此时树上还有几只鸟？';
    q1A = '3 只';
    q1B = '1 只';
    q1C = '0 只';
    q1D = '2 只';
    q1Ans = 'C';
    q1Explain = '解析：全部飞走了，就是“一个也没有”，用数字 0 来表示。';
  } else if (name.includes('厘米') || name.includes('米') || name.includes('毫米')) {
    q1Text = '我们的数学课本厚度，最适合用以下哪个长度单位来测量？';
    q1A = '米 (m)';
    q1B = '千米 (km)';
    q1C = '毫米 (mm)';
    q1D = '平方厘米 (cm²)';
    q1Ans = 'C';
    q1Explain = '解析：课本厚度很薄，常用毫米作单位，大约在 6-8 毫米左右哦。厘米可以测长度。';
  } else if (name.includes('分数') || name.includes('真分数')) {
    q1Text = '在分数中，分母代表什么，分子代表什么？';
    q1A = '分子代表被分成的总份数，分母代表占了其中的几份。';
    q1B = '分母代表被平均分成的总份数，分子代表占了其中的几份。';
    q1C = '随便怎么叫都可以，它们是一样的。';
    q1D = '分子是整数，分母是小数。';
    q1Ans = 'B';
    q1Explain = '解析：分数线下面的数叫做分母，表示平均分的份数；分数线外面的数叫分子，表示占其中的几份。';
  } else if (name.includes('方程') || name.includes('字母表示数')) {
    q1Text = '如果 x + 5 = 12，那么这个方程的解 x 是多少呢？';
    q1A = 'x = 5';
    q1B = 'x = 7';
    q1C = 'x = 17';
    q1D = 'x = 12';
    q1Ans = 'B';
    q1Explain = '解析：根据等式的性质，方程两边同时减去 5，得到 x = 12 - 5 = 7。';
  }

  // HTML content using embedded Tailwind and clean interactive vanilla JS scripts (no React boilerplate in iframes for complete isolation)
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>提前学 - ${name}</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;750;800&display=swap');
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
  </style>
</head>
<body class="bg-gradient-to-br ${bgGradient} min-h-screen text-slate-800 pb-16">

  <!-- Header Banner Section -->
  <div class="relative bg-gradient-to-r ${bannerBg} text-white px-6 py-8 rounded-b-[2rem] shadow-md overflow-hidden">
    <!-- Bubble decors -->
    <div class="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
    <div class="absolute -right-5 bottom-0 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
    
    <div class="relative max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2 border border-white/10">
          <span>📚 ${category}</span>
          <span>•</span>
          <span>${gradeText}</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-black tracking-tight drop-shadow-sm flex items-center gap-2">
          <span>💡</span> <span>${name}</span>
        </h1>
        <p class="text-white/80 text-xs mt-1.5 font-medium">知识精炼大王 • 互动课堂 • 自主提前学</p>
      </div>
      <div class="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 flex flex-col items-center">
        <span class="text-[10px] text-white/70 uppercase font-semibold">预习状态</span>
        <span class="text-md font-bold text-white flex items-center gap-1.5">
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping"></span>
          正在学习中
        </span>
      </div>
    </div>
  </div>

  <!-- Interactive Learning Content Grid -->
  <main class="max-w-4xl mx-auto px-4 mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
    
    <!-- Left Column: Core Lesson Explain + Interactive Simulator Sandbox -->
    <div class="md:col-span-7 space-y-6">
      
      <!-- Card: 知识微课 / Explanations -->
      <section class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition">
        <div class="absolute top-0 left-0 w-1.5 h-full bg-${themeColor}-500"></div>
        <h2 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span class="text-2xl">🌱</span> <span>知识点轻课堂 (Concept Lesson)</span>
        </h2>
        
        <div class="prose text-sm text-slate-600 space-y-3 leading-relaxed">
          <p class="font-medium text-slate-700">
            欢迎来到<b>《${name}》</b>的精彩数学微课堂！让我们用简单、好记的话来理解本知识点的核心奥妙吧。
          </p>
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 ${themeColor === 'emerald' ? 'border-l-4 border-l-emerald-400' : themeColor === 'blue' ? 'border-l-4 border-l-blue-400' : themeColor === 'amber' ? 'border-l-4 border-l-amber-400' : 'border-l-4 border-l-purple-400'}">
            <h4 class="font-bold text-${themeColor}-700 text-xs mb-1">🔑 黄金小口诀/重点：</h4>
            <p class="text-xs text-slate-600">
              ${subCategory === '数的认识' ? '看数点数两对齐，从左到右数清楚！数字就是物体的总数，一个也不要丢。' : ''}
              ${subCategory === '加减法' ? '加法就是合拢在一起，变多啦！减法就是飞走、拿走或少去，变少啦！' : ''}
              ${subCategory === '乘法' ? '几个几相加就是乘法，横着看有几行，坚着看有几列，行乘列就是积。' : ''}
              ${subCategory === '除法' ? '平均分，找除法！要把好吃的、好玩的公平分给每个人，算算每人得几份。' : ''}
              ${subCategory === '小数' ? '小数点，点中间！小家伙左边是完整的整数，右边是零碎的小毛毛。' : ''}
              ${subCategory === '分数' ? '切个大蛋糕，平均分一分，下面切了几片，上面吃了几片！' : ''}
              ${subCategory === '方程' ? '字母好比神秘盲盒 x，等号就像天平秤，两边必须要一样重。' : ''}
              ${subCategory === '比和比例' ? '比例就是倍数相同，你看我大二倍，我也要陪你大二倍才好看！' : ''}
              ${category === '几何' ? '尺子划线要精准，面积需要长乘宽！仔细辨明形状特性。' : ''}
              ${category === '统计与概率' ? '记录每个小数据，画个柱子比高低！摸球试试可能性。' : ''}
              ${!['数的认识', '加减法', '乘法', '除法', '小数', '分数', '方程', '比和比例'].includes(subCategory) && category !== '几何' && category !== '统计与概率' ? '认真读懂故事，建立精确的数量关系。找准数量或算式是通关的金钥匙！' : ''}
            </p>
          </div>
          
          <ul class="list-disc pl-4 space-y-1.5 text-xs text-slate-500">
            <li><strong>概念溯源：</strong>该内容在人教版和北师大版小学教材<b>${gradeText}</b>中是极关键的基础。</li>
            <li><strong>学习提示：</strong>通过右边的互动演示沙盒，体验量化变化过程，比单纯背公式更深刻！</li>
          </ul>
        </div>
      </section>

      <!-- Card: Dynamic Visual Sandbox Simulator (Rendered conditionally above) -->
      <section class="space-y-3">
        ${interactiveSectionHTML}
      </section>

    </div>

    <!-- Right Column: Visual Solved Example + Dynamic Interactive Quizzes -->
    <div class="md:col-span-5 space-y-6">
      
      <!-- Card: 例题精讲 / Worked-out Example -->
      <section class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative group hover:shadow-md transition">
        <div class="absolute top-0 left-0 w-1.5 h-full bg-orange-400"></div>
        <h2 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span class="text-2xl">📝</span> <span>金牌例题精讲 (Solved Example)</span>
        </h2>
        <div class="p-3.5 bg-orange-50/50 rounded-2xl border border-orange-100 text-xs space-y-2">
          <div class="font-bold text-orange-850">❓ 【经典问题实例】</div>
          <p class="text-slate-600 italic">
            我们来解决一顿生活数学难题：在理解了《${name}》之后，如果题目中要求我们去解决某个具体数值，我们怎么算？
          </p>
          <div class="border-t border-orange-200/50 my-2 pt-2 text-${themeColor}-700 font-bold">💡 【金牌答题妙招】</div>
          <p class="text-slate-650 leading-relaxed font-light">
            我们首先应该把复杂的文字精简为数字公式。第一步：列出关系；第二步：精确运算；第三步：带回检验！只要掌握这些关键模型，所有同类型题目全部能迎刃而解！
          </p>
        </div>
      </section>

      <!-- Card: 预习效果大检测 / Interactive Quizzes -->
      <section class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-1.5 h-full bg-pink-500"></div>
        <h2 class="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
          <span class="text-2xl">⚔️</span> <span>预习通关大检测 (Quiz Section)</span>
        </h2>
        <p class="text-xs text-slate-400 mb-4">一共有 3 道精选预习题，答对通关即表示熟练度 100% 哟！</p>
        
        <!-- Quiz Stepper -->
        <div class="flex items-center gap-1.5 justify-center mb-6">
          <span id="step-1" class="w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">1</span>
          <span class="h-1 flex-1 bg-pink-100 transition-colors" id="line-1"></span>
          <span id="step-2" class="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs">2</span>
          <span class="h-1 flex-1 bg-slate-100 transition-colors" id="line-2"></span>
          <span id="step-3" class="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs">3</span>
        </div>

        <!-- Question Body -->
        <div id="quiz-body" class="space-y-4">
          <!-- Dynamically inserted by JS -->
        </div>

        <!-- Quiz Action Feedback Overlay -->
        <div id="quiz-feedback" class="mt-4 p-4 rounded-2xl border hidden">
          <!-- Text feedback by JS -->
        </div>
      </section>

    </div>

  </main>
  
  <!-- Chime sound generator via Web Audio API -->
  <script>
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    function playTone(freq, duration) {
      if (!audioCtx) return;
      try {
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch(e) {
        console.log("Audio play error", e);
      }
    }
    
    function playTriumphantChime() {
      // Elegant success chord
      const notes = [261.63, 329.63, 392.00, 523.25]; // C major chord
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          playTone(freq, 0.4);
        }, idx * 100);
      });
    }

    // Dynamic Quiz State Management
    (function() {
      const qData = [
        {
          text: \`${q1Text.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
          options: {
            A: \`${q1A.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
            B: \`${q1B.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
            C: \`${q1C.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
            D: \`${q1D.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
          },
          ans: "${q1Ans}",
          explain: \`${q1Explain.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
        },
        {
          text: \`${q2Text.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
          options: {
            A: \`${q2A.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
            B: \`${q2B.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
            C: \`${q2C.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
            D: \`${q2D.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
          },
          ans: "${q2Ans}",
          explain: \`${q2Explain.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
        },
        {
          text: \`${q3Text.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
          options: {
            A: \`${q3A.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
            B: \`${q3B.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
            C: \`${q3C.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`,
            D: \`${q3D.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
          },
          ans: "${q3Ans}",
          explain: \`${q3Explain.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
        }
      ];
      
      let curStep = 0; // 0, 1, 2
      const body = document.getElementById('quiz-body');
      const feed = document.getElementById('quiz-feedback');
      
      function renderQuiz() {
        // Clear previous state
        feed.classList.add('hidden');
        
        // Update tabs
        for (let i = 0; i <= 2; i++) {
          const tab = document.getElementById('step-' + (i+1));
          if (i === curStep) {
            tab.className = 'w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-md transform scale-110 duration-200';
          } else if (i < curStep) {
            tab.className = 'w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs';
            tab.innerHTML = '✓';
            if (i === 0) document.getElementById('line-1').className = 'h-1 flex-1 bg-emerald-500';
            if (i === 1) document.getElementById('line-2').className = 'h-1 flex-1 bg-emerald-500';
          } else {
            tab.className = 'w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs';
            tab.innerHTML = i+1;
            if (i === 1) document.getElementById('line-1').className = 'h-1 flex-1 bg-slate-100';
            if (i === 2) document.getElementById('line-2').className = 'h-1 flex-1 bg-slate-100';
          }
        }
        
        if (curStep >= 3) {
          // Finished all questions! Show celebration
          body.innerHTML = \`
            <div class="text-center py-6 space-y-4">
              <div class="text-6xl animate-bounce">🏆</div>
              <h3 class="text-lg font-bold text-slate-800">恭喜！全部预习大通关！</h3>
              <p class="text-xs text-slate-500 max-w-xs mx-auto">你真是太聪明啦！已经成功征服了《\${"${name}"}》预习试题。快给左侧状态栏打个小勾，挑战下一个星级知识点吧！</p>
              <button onclick="window.parent.postMessage({type: 'PREVIEW_COMPLETE', name: '${name.replace(/'/g, "\\'")}'}, '*')" class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-2xl shadow-sm transition transform hover:scale-105 active:scale-95">
                🎉 回传“我学完了”
              </button>
            </div>
          \`;
          playTriumphantChime();
          return;
        }

        const q = qData[curStep];
        let optionsHTML = '';
        Object.entries(q.options).forEach(([k, v]) => {
          optionsHTML += \`
            <button id="opt-\${k}" onclick="checkAnswer('\${k}')" class="w-full text-left p-3.5 bg-slate-50 hover:bg-${themeColor}-50/50 border border-slate-250 hover:border-${themeColor}-300 hover:text-${themeColor}-700 font-medium rounded-2xl text-xs transition duration-150 transform hover:-translate-y-0.5 active:translate-y-0 text-slate-705 flex gap-2.5">
              <span class="w-5 h-5 rounded-full bg-white border border-slate-300 flex items-center justify-center text-[10px] font-bold text-gray-400 group-hover:text-${themeColor}-500 group-hover:border-${themeColor}-400 shrink-0">\${k}</span>
              <span>\${v}</span>
            </button>
          \`;
        });
        
        body.innerHTML = \`
          <div class="bg-gray-50/50 p-4 border border-gray-100 rounded-2xl mb-4">
            <span class="text-[10px] font-bold tracking-widest text-${themeColor}-500 block mb-1">第 \${curStep+1} 题 Q\${curStep+1}:</span>
            <p class="text-xs font-bold text-slate-801 leading-relaxed">\${q.text}</p>
          </div>
          <div class="space-y-3">
            \${optionsHTML}
          </div>
        \`;
      }
      
      window.checkAnswer = function(opt) {
        const q = qData[curStep];
        const isCorrect = opt === q.ans;
        
        // Visual highlights
        const selectedBtn = document.getElementById('opt-' + opt);
        
        feed.classList.remove('hidden');
        if (isCorrect) {
          playTone(523.25, 0.15); // High triumph note
          selectedBtn.className = 'w-full text-left p-3.5 bg-emerald-55 border-2 border-emerald-400 text-emerald-800 font-bold rounded-2xl text-xs flex gap-2.5';
          feed.className = 'mt-4 p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-emerald-800 text-xs space-y-2';
          feed.innerHTML = \`
            <div class="font-extrabold flex items-center gap-1.5">🎉 太棒了！答对啦！</div>
            <p class="font-light">\${q.explain}</p>
            <button onclick="nextStep()" class="mt-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-xs float-right transition">下一题 ➜</button>
            <div class="clear-both"></div>
          \`;
        } else {
          playTone(220, 0.2); // Low buzz
          selectedBtn.className = 'w-full text-left p-3.5 bg-rose-55 border-2 border-rose-400 text-rose-800 font-bold rounded-2xl text-xs flex gap-2.5';
          feed.className = 'mt-4 p-4 rounded-2xl border bg-rose-50 border-rose-200 text-rose-800 text-xs space-y-1.5';
          feed.innerHTML = \`
            <div class="font-extrabold flex items-center gap-1.5">💪 加油！再思考一下下：</div>
            <p class="font-light">别气馁，数学大王！想一想：\${q.explain}</p>
          \`;
        }
      };
      
      window.nextStep = function() {
        curStep++;
        renderQuiz();
        playTone(440, 0.08);
      };
      
      renderQuiz();
    })();
  </script>
</body>
</html>
  `;
}
