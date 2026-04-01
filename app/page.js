"use client";
import { useState, useRef} from "react";
import colors from "../data/colors.json";
import { MiniFamilyBar } from "../components/MiniFamilyBar.js";

const familyColors = [
  "#EFF0F1", // 白
  "#F8DF72", // 黄
  "#F8B37F", // 橙
  "#DE694C", // 红
  "#C5A4CC", // 紫
  "#F1DEFC", // 粉
  "#D0DFE6", // 蓝
  "#C4DAD6", // 青
  "#ADD5A2", // 绿
  "#595861", // 黑
  "#D2AE94", // 褐
 
];

const FAMILY_ORDER = [

  "white",
  "yellow",
  "orange",
  "red",
  "purple",
  "pink",
  "blue",
  "cyan",
  "green",
  "black",
  "brown",
];

// 从 id 里提取数字（如 red-12 → 12）
function getIdNumber(id) {
  const match = String(id).match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

// 简单的函数：根据背景颜色决定文字用黑还是白
function readableColor(hex) {
  if (!hex) return "#000000";
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? "#000000" : "#ffffff";
}

export default function Home() { 
  
  function getHue(hex) {
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;

  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = ((g - b) / (max - min)) * 60;
  } else if (max === g) {
    h = (2 + (b - r) / (max - min)) * 60;
  } else {
    h = (4 + (r - g) / (max - min)) * 60;
  }

  if (h < 0) h += 360;
  return h;
}

// 按照色相值升序排序颜色（形成赤橙黄绿青蓝紫渐变）

  const sortedColors = [...colors].sort((a, b) => {
  const aFamilyIndex = FAMILY_ORDER.indexOf(a.family);
  const bFamilyIndex = FAMILY_ORDER.indexOf(b.family);

  // 先按 family 排序
  if (aFamilyIndex !== bFamilyIndex) {
    return aFamilyIndex - bFamilyIndex;
  }

  // 同一个 family：按 id 数字顺序
  return getIdNumber(a.id) - getIdNumber(b.id);
});

const lightColors = sortedColors.filter((c) => {
  const r = parseInt(c.hex.substr(1, 2), 16);
  const g = parseInt(c.hex.substr(3, 2), 16);
  const b = parseInt(c.hex.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 170; // 浅色阈值
});



  const [bgColor, setBgColor] = useState(() => { 
    const randomIndex = Math.floor(Math.random() * lightColors.length); 
    return lightColors[randomIndex].hex; 
  });
  const [selected, setSelected] = useState(null); 

  const scrollRef = useRef(null); // 绑定滚动区域
  const scrollBy = (distance) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: distance,
        behavior: "smooth",
      });
    }
  };

  const familyStarts = [0, 1632, 3264, 5032, 6800, 8432, 9928, 11696, 13328, 15368, 17000];

  return (
     <div
      className="min-h-screen flex flex-col items-center justify-start p-6 transition-colors duration-1000"
      style={{ backgroundColor: bgColor }}
    >

      {/* 信息栏 */}
      <div className="relative w-full max-w-5xl mb-6 text-center p-4 mt-15 transition-colors duration-1500"
      style={{
          minHeight: "200px", // 固定高度
          backgroundColor: "transparent",
          color:
            selected ? readableColor(selected.hex)
              : "#000000",
        }}
        > 
        
      <div
      className={`
       ${selected ? "fixed" : "absolute"} left-1/2 -translate-x-1/2
        transition-all duration-2200 ease-[cubic-bezier(0.22,1,0.36,1)]
         ${selected 
          ? "top-0 scale-45 opacity-70"   // 页面顶部
          : "top-1 scale-100" // 信息栏中间
      }
     `}
         style={{ color: readableColor(bgColor) }}
      >
        <p className="text-2xl font-bold leading-tight">
         传统中国色
         </p>
         <p className="text-lg italic">
         Chinese Traditional Colour
        </p>
        </div>

        {selected && (
          <div>
            <h2 className="text-2xl font-bold mb-2 space-y-1">{selected.name_cn}</h2>
            <p className="text-lg italic mb-2 ">{selected.name_en}</p>
            <p className="font-mono text-s tracking-tight">{selected.hex}</p>
            <p className="font-mono text-s tracking-tight">RGB: {selected.rgb || "N/A"}</p>
            <p className="font-mono text-s tracking-tight">CMYK: {selected.cmyk || "N/A"}</p>
          </div>
        ) }
      </div>

      <div className="relative w-full max-w-7xl mt-6 flex items-center">
        {/* 左按钮 */}
        <button
          onClick={() => scrollBy(-300)}
          className="absolute left-[-50px] bg-white/80 hover:bg-white text-gray-800 shadow-md hover:shadow-lg rounded-full w-10 h-10 flex items-center justify-center transition cursor-pointer"
        >
          ‹
        </button>

        {/*中部色带*/}
        <div 
          ref={scrollRef}
          id="color-scroll"
          className="flex overflow-x-auto  snap-x snap-mandatory gap-4 py-6 scroll-smooth no-scrollbar justify-start cursor-pointer"
          onWheel={(e) => {
          // 只在鼠标悬停主色带时生效：阻止页面纵向滚动
         e.preventDefault();

            const el = scrollRef.current;
            if (!el) return;
         const dy = e.deltaY;

        // 你要的方向：
        // 向下滚（dy>0） => 主色带向左 => scrollLeft 减少
        // 向上滚（dy<0） => 主色带向右 => scrollLeft 增加
        const delta = Math.abs(dy);
        const dir = dy < 0 ? -1 : 1;
        const SPEED = 8;
        el.scrollBy({ left: dir * delta* SPEED, behavior: "auto" });
        }}
        >
       
          {sortedColors.map((c, idx) => {
  const textColor = readableColor(c.hex);
  const isSelected = selected === idx;


  return (
    <div
      key={c.id}
      tabIndex={-1}
      className="relative flex-shrink-0 snap-center overflow-hidden group transform transition-transform duration-500 hover:scale-105"
      style={{ width: 120, height: 160}}
      onClick={() => {
         setSelected(c);
         setBgColor(c.hex);
      }}
      title={`${c.name_cn} — ${c.hex}`}
    >
      {/* 色块背景 */}
      <div style={{ backgroundColor: c.hex }} className="w-full h-full" />

      {/* 悬停/选中信息层 */}
      {!isSelected && (
      <div
        tabIndex={-1}
        className={`
          absolute inset-0 flex flex-col items-center justify-center 
          text-center transition-opacity duration-300 ease-in-out
          ${selected?.id === c.id ? "opacity-0" : "opacity-0 group-hover:opacity-100"}
        `}
        style={{ color: textColor }}
      >
        <div className="text-sm font-semibold">{c.name_en}</div>
        <div className="text-xs mt-1">{c.name_cn}</div>
        <div className="text-xs mt-2 font-mono">{c.hex}</div>
      </div>
       )}
    </div>
  );
})}
        </div>

      {/* 右按钮 */}
      <button
        onClick={() => scrollBy(300)}
        className="absolute right-[-50px] bg-white/80 hover:bg-white text-gray-800 shadow-md hover:shadow-lg rounded-full w-10 h-10 flex items-center justify-center transition cursor-pointer"
      >
        ›
       </button>
    </div>

    {/* ✅ 新mini色带放这里 */}
      <div className="w-full max-w-5xl mt-3 cursor-pointer">
        <MiniFamilyBar scrollRef={scrollRef} familyStarts={familyStarts} familyCount={11} familyColors={familyColors}/>
      </div>

    <div className="fixed bottom-3 right-3 text-xs scale-80 text-white">
       <p>Designed and developed by ©2026 Xinyu Wang </p>
       <p>Colour data cited from <i>色谱</i>, 科学出版社. 1957</p>
    </div> 
      </div>
  );
}