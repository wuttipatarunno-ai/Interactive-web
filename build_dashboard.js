const fs = require('fs');
const path = require('path');

const compactData = JSON.parse(fs.readFileSync('C:\\Users\\Administrator\\.gemini\\antigravity\\scratch\\amazon_dashboard\\data\\compact_data.json', 'utf8'));

// Build HTML content with the compact data embedded
function generateHtml() {
  return `<!DOCTYPE html>
<html lang="th" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Amazon Product Discount & Category Comparison Dashboard</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    :root {
      --background: #0f172a;
      --card: #1e293b;
      --card-hover: #334155;
      --foreground: #f8fafc;
      --muted-foreground: #94a3b8;
      --border: #334155;
      --primary: #38bdf8;
      --primary-foreground: #0f172a;
      --secondary: #6366f1;
      --accent: #f43f5e;
      --success: #10b981;
      --warning: #f59e0b;
    }
    .light {
      --background: #f8fafc;
      --card: #ffffff;
      --card-hover: #f1f5f9;
      --foreground: #0f172a;
      --muted-foreground: #64748b;
      --border: #e2e8f0;
      --primary: #0284c7;
      --primary-foreground: #ffffff;
      --secondary: #4f46e5;
      --accent: #e11d48;
      --success: #059669;
      --warning: #d97706;
    }
    body {
      background-color: var(--background);
      color: var(--foreground);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Sarabun', sans-serif;
    }
    /* Custom scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--muted-foreground); }
    
    .chart-tooltip {
      position: fixed;
      pointer-events: none;
      transition: opacity 0.15s ease, transform 0.1s ease;
      z-index: 100;
    }
    .badge-pill {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
  </style>
</head>
<body class="min-h-full flex flex-col p-3 md:p-6 transition-colors duration-200">

  <!-- Header Section -->
  <header class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
    <div>
      <div class="flex items-center gap-3">
        <span class="p-2 rounded-xl bg-sky-500/10 text-[var(--primary)] border border-sky-500/20">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </span>
        <div>
          <h1 class="text-xl md:text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Product Discount & Category Comparison Dashboard
          </h1>
          <p class="text-xs md:text-sm text-[var(--muted-foreground)]">
            แดชบอร์ดวิเคราะห์และเปรียบเทียบสัดส่วนส่วนลดสินค้า (Discount Percentage) ตามหมวดหมู่จาก <span class="font-mono text-sky-400">amazon.csv</span> (1,465 รายการ)
          </p>
        </div>
      </div>
    </div>
    
    <div class="flex items-center gap-2 flex-wrap">
      <button id="themeToggleBtn" class="px-3 py-2 text-xs font-medium rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)] text-[var(--foreground)] flex items-center gap-2 transition">
        <svg id="themeIcon" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span id="themeLabel">Light Mode</span>
      </button>

      <button id="exportCsvBtn" class="px-3 py-2 text-xs font-medium rounded-lg border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)] text-[var(--foreground)] flex items-center gap-2 transition">
        <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export Stats
      </button>

      <button id="resetAllFiltersBtn" class="px-3 py-2 text-xs font-medium rounded-lg bg-sky-500 hover:bg-sky-600 text-white flex items-center gap-2 shadow-sm transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        รีเซ็ตค่า
      </button>
    </div>
  </header>

  <!-- KPI Summary Cards -->
  <section class="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
    <div class="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
      <div class="flex items-center justify-between text-xs text-[var(--muted-foreground)] mb-1">
        <span>จำนวนสินค้าที่เลือก</span>
        <span class="text-sky-400 font-semibold" id="kpiProductsPct">100%</span>
      </div>
      <div class="text-2xl font-bold text-[var(--foreground)]" id="kpiProductCount">1,465</div>
      <div class="text-xs text-[var(--muted-foreground)] mt-1 flex items-center gap-1">
        <span>จากทั้งหมด 1,465 รายการ</span>
      </div>
    </div>

    <div class="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
      <div class="flex items-center justify-between text-xs text-[var(--muted-foreground)] mb-1">
        <span>ค่าเฉลี่ยส่วนลด (Mean)</span>
        <span class="text-emerald-400 font-medium">Avg %</span>
      </div>
      <div class="text-2xl font-bold text-emerald-400" id="kpiAvgDiscount">47.8%</div>
      <div class="text-xs text-[var(--muted-foreground)] mt-1" id="kpiAvgDiscountSub">
        ค่ามัธยฐาน: <span id="kpiMedianDiscount" class="text-[var(--foreground)] font-semibold">50.0%</span>
      </div>
    </div>

    <div class="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
      <div class="flex items-center justify-between text-xs text-[var(--muted-foreground)] mb-1">
        <span>ส่วนลดสูงสุด / ต่ำสุด</span>
        <span class="text-purple-400 font-medium">Range</span>
      </div>
      <div class="text-2xl font-bold text-purple-400" id="kpiMaxDiscount">94% / 0%</div>
      <div class="text-xs text-[var(--muted-foreground)] mt-1" id="kpiDiscountSpread">
        ช่วงห่างส่วนลด: 94%
      </div>
    </div>

    <div class="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
      <div class="flex items-center justify-between text-xs text-[var(--muted-foreground)] mb-1">
        <span>หมวดที่ลดเยอะที่สุด</span>
        <span class="text-amber-400 font-medium">Top Cut</span>
      </div>
      <div class="text-lg font-bold text-amber-400 truncate" id="kpiTopDiscountCategory">Computers</div>
      <div class="text-xs text-[var(--muted-foreground)] mt-1" id="kpiTopCategoryAvg">
        เฉลี่ยลด 54.0%
      </div>
    </div>

    <div class="bg-[var(--card)] p-4 rounded-xl border border-[var(--border)] shadow-sm col-span-2 lg:col-span-1">
      <div class="flex items-center justify-between text-xs text-[var(--muted-foreground)] mb-1">
        <span>คะแนนรีวิวเฉลี่ย</span>
        <span class="text-yellow-400">★ Rating</span>
      </div>
      <div class="text-2xl font-bold text-yellow-400 flex items-center gap-1">
        <span id="kpiAvgRating">4.10</span>
        <span class="text-sm font-normal text-[var(--muted-foreground)]">/ 5.0</span>
      </div>
      <div class="text-xs text-[var(--muted-foreground)] mt-1" id="kpiRatingDetail">
        ความสัมพันธ์ส่วนลด-คะแนนรีวิว
      </div>
    </div>
  </section>

  <!-- Category Comparison Controller Panel (MAIN FEATURE) -->
  <section class="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4 md:p-6 mb-6 shadow-sm">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-[var(--border)]">
      <div>
        <h2 class="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
          ฟังก์ชั่นเปรียบเทียบหมวดหมู่ (Category Comparison Mode)
        </h2>
        <p class="text-xs text-[var(--muted-foreground)]">
          เลือกหมวดหมู่ที่ต้องการนำมาเปรียบเทียบอัตราส่วนลด (Discount %) แบบเคียงข้างกัน (Side-by-Side)
        </p>
      </div>

      <!-- Level & Presets -->
      <div class="flex items-center gap-2 flex-wrap">
        <div class="inline-flex rounded-lg border border-[var(--border)] p-0.5 bg-[var(--background)]">
          <button id="levelMainBtn" class="px-3 py-1.5 text-xs font-semibold rounded-md bg-sky-500 text-white transition">
            Main Category (9)
          </button>
          <button id="levelSubBtn" class="px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition">
            Sub Category (29)
          </button>
        </div>

        <div class="h-4 w-px bg-[var(--border)] hidden md:block"></div>

        <div class="flex items-center gap-1.5">
          <button id="presetTop3Btn" class="px-2.5 py-1 text-xs rounded-md bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition">
            ⭐ Top 3 หมวดหลัก
          </button>
          <button id="presetHighDiscountBtn" class="px-2.5 py-1 text-xs rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition">
            ⚡ ลดเฉลี่ย > 50%
          </button>
          <button id="selectAllCatsBtn" class="px-2.5 py-1 text-xs rounded-md bg-slate-500/10 hover:bg-slate-500/20 text-[var(--foreground)] border border-[var(--border)] transition">
            เลือกทั้งหมด
          </button>
          <button id="clearAllCatsBtn" class="px-2.5 py-1 text-xs rounded-md bg-slate-500/10 hover:bg-slate-500/20 text-[var(--muted-foreground)] border border-[var(--border)] transition">
            ล้าง
          </button>
        </div>
      </div>
    </div>

    <!-- Category Pill Selector -->
    <div id="categoryPillContainer" class="flex flex-wrap gap-2 mb-4 max-h-36 overflow-y-auto p-1">
      <!-- Injected dynamically -->
    </div>

    <!-- Active Selection Summary Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)]">
      <div>
        กำลังเปรียบเทียบ: <span id="selectedCategoriesCount" class="font-bold text-sky-400">9</span> หมวดหมู่
        (<span id="selectedProductsCount" class="font-semibold text-[var(--foreground)]">1,465</span> สินค้า)
      </div>
      <div class="flex items-center gap-3">
        <label class="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" id="filterMinVolumeCheckbox" checked class="rounded border-[var(--border)] text-sky-500 focus:ring-0">
          <span>แสดงเฉพาะหมวดหมู่ที่มีสินค้า ≥ 5 ชิ้น (กรองข้อมูลกลุ่มเล็ก)</span>
        </label>
      </div>
    </div>
  </section>

  <!-- Interactive Charts Section -->
  <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
    <!-- Main Comparison Chart (8 cols) -->
    <div class="lg:col-span-8 bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4 md:p-6 shadow-sm flex flex-col">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 class="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
            <svg class="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span id="chartTitle">เปรียบเทียบอัตราส่วนลดเฉลี่ยและมัธยฐานตามหมวดหมู่</span>
          </h3>
          <p class="text-xs text-[var(--muted-foreground)]">
            แท่งสีฟ้า = ค่าเฉลี่ย (Mean) | เส้นประสีส้ม = ค่ามัธยฐาน (Median) | แถบเส้น = ช่วง Min - Max
          </p>
        </div>

        <!-- Chart Mode Switcher -->
        <div class="inline-flex rounded-lg border border-[var(--border)] p-0.5 bg-[var(--background)]">
          <button id="chartViewBarBtn" class="px-2.5 py-1 text-xs font-semibold rounded bg-sky-500 text-white transition">
            Mean & Median
          </button>
          <button id="chartViewDistributionBtn" class="px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition">
            ช่วง % ส่วนลด
          </button>
          <button id="chartViewBoxPlotBtn" class="px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition">
            Box Plot
          </button>
        </div>
      </div>

      <!-- Chart Canvas / SVG Container -->
      <div id="chartContainer" class="relative flex-1 min-h-[340px] w-full flex items-center justify-center">
        <!-- SVG rendered here -->
      </div>

      <!-- Chart Legend & Controls -->
      <div id="chartLegend" class="mt-4 pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs">
        <!-- Injected dynamically -->
      </div>
    </div>

    <!-- Secondary Insights & Breakdown (4 cols) -->
    <div class="lg:col-span-4 flex flex-col gap-6">
      <!-- Discount Bracket Distribution Card -->
      <div class="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4 md:p-6 shadow-sm flex-1 flex flex-col">
        <h3 class="text-base font-bold text-[var(--foreground)] mb-1 flex items-center gap-2">
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          สัดส่วนการกระจายตัวของส่วนลด
        </h3>
        <p class="text-xs text-[var(--muted-foreground)] mb-4">
          การกระจายตัวของเปอร์เซ็นต์ส่วนลดในหมวดหมู่ที่กำลังเลือก
        </p>

        <div id="bracketBreakdownContainer" class="flex-1 flex flex-col justify-around gap-2.5">
          <!-- Injected dynamically -->
        </div>

        <div class="mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--muted-foreground)]">
          💡 <span id="bracketInsightText">ส่วนลดส่วนใหญ่อยู่ในระดับ 40% - 70%</span>
        </div>
      </div>

      <!-- Category Comparison Rank Mini-Table -->
      <div class="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4 md:p-6 shadow-sm flex-1 flex flex-col">
        <h3 class="text-base font-bold text-[var(--foreground)] mb-1 flex items-center gap-2">
          <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          อันดับส่วนลดเฉลี่ยสูงสุด
        </h3>
        <p class="text-xs text-[var(--muted-foreground)] mb-3">
          เรียงตามเปอร์เซ็นต์ส่วนลดเฉลี่ย
        </p>

        <div id="topRankContainer" class="flex-1 overflow-y-auto max-h-52 divide-y divide-[var(--border)] pr-1">
          <!-- Injected dynamically -->
        </div>
      </div>
    </div>
  </section>

  <!-- Deep Dive Comparison Matrix Table -->
  <section class="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4 md:p-6 mb-6 shadow-sm">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
      <div>
        <h3 class="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
          <svg class="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          ตารางเปรียบเทียบสถิติหมวดหมู่โดยละเอียด (Head-to-Head Comparison Table)
        </h3>
        <p class="text-xs text-[var(--muted-foreground)]">
          คลิกที่หัวตารางเพื่อจัดเรียงข้อมูลตามค่าเฉลี่ย, มัธยฐาน, หรือจำนวนสินค้า
        </p>
      </div>

      <div class="text-xs text-[var(--muted-foreground)] flex items-center gap-2">
        <span class="inline-block w-2.5 h-2.5 rounded bg-emerald-500"></span> ลดสูง (>50%)
        <span class="inline-block w-2.5 h-2.5 rounded bg-sky-500"></span> ปานกลาง (30-50%)
        <span class="inline-block w-2.5 h-2.5 rounded bg-slate-500"></span> ต่ำ (<30%)
      </div>
    </div>

    <div class="overflow-x-auto rounded-xl border border-[var(--border)]">
      <table class="w-full text-left text-xs md:text-sm">
        <thead class="bg-[var(--background)] text-[var(--muted-foreground)] uppercase text-xs">
          <tr>
            <th class="p-3 font-semibold cursor-pointer hover:text-[var(--foreground)]" data-sort="name">หมวดหมู่ ↕</th>
            <th class="p-3 font-semibold text-center cursor-pointer hover:text-[var(--foreground)]" data-sort="count">จำนวนสินค้า ↕</th>
            <th class="p-3 font-semibold text-center cursor-pointer hover:text-[var(--foreground)] text-emerald-400" data-sort="avg">ส่วนลดเฉลี่ย (Mean) ↕</th>
            <th class="p-3 font-semibold text-center cursor-pointer hover:text-[var(--foreground)] text-sky-400" data-sort="median">มัธยฐาน (Median) ↕</th>
            <th class="p-3 font-semibold text-center" data-sort="range">ช่วง Min - Max</th>
            <th class="p-3 font-semibold text-right cursor-pointer hover:text-[var(--foreground)]" data-sort="origPrice">ราคาปกติเฉลี่ย ↕</th>
            <th class="p-3 font-semibold text-right cursor-pointer hover:text-[var(--foreground)]" data-sort="salePrice">ราคาขายเฉลี่ย ↕</th>
            <th class="p-3 font-semibold text-center cursor-pointer hover:text-[var(--foreground)]" data-sort="rating">คะแนนรีวิว ↕</th>
          </tr>
        </thead>
        <tbody id="comparisonTableBody" class="divide-y divide-[var(--border)]">
          <!-- Injected dynamically -->
        </tbody>
      </table>
    </div>
  </section>

  <!-- Product Explorer & Filterable List -->
  <section class="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4 md:p-6 shadow-sm">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-[var(--border)]">
      <div>
        <h3 class="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
          <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          สำรวจรายการสินค้าตามเงื่อนไข (Product Explorer)
        </h3>
        <p class="text-xs text-[var(--muted-foreground)]">
          ค้นหาและกรองสินค้าตามระดับส่วนลด คะแนนรีวิว และหมวดหมู่ที่เลือกไว้
        </p>
      </div>

      <!-- Quick filters -->
      <div class="flex items-center gap-3 flex-wrap">
        <div class="relative">
          <input type="text" id="productSearchInput" placeholder="ค้นหาชื่อสินค้า..." class="w-48 md:w-64 pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-sky-500">
          <svg class="w-4 h-4 text-[var(--muted-foreground)] absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select id="minDiscountFilter" class="px-2.5 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none">
          <option value="0">ส่วนลดทุกระดับ</option>
          <option value="30">ส่วนลด 30% ขึ้นไป</option>
          <option value="50">ส่วนลด 50% ขึ้นไป</option>
          <option value="70">ส่วนลด 70% ขึ้นไป (ลดล้างสต็อก)</option>
        </select>

        <select id="sortProductsSelect" class="px-2.5 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none">
          <option value="discountDesc">ส่วนลด: มากสุด → น้อยสุด</option>
          <option value="discountAsc">ส่วนลด: น้อยสุด → มากสุด</option>
          <option value="ratingDesc">คะแนนรีวิว: สูงสุด</option>
          <option value="priceAsc">ราคา: ต่ำสุด → สูงสุด</option>
          <option value="priceDesc">ราคา: สูงสุด → ต่ำสุด</option>
        </select>
      </div>
    </div>

    <!-- Product Table Grid -->
    <div class="overflow-x-auto rounded-xl border border-[var(--border)] mb-4">
      <table class="w-full text-left text-xs md:text-sm">
        <thead class="bg-[var(--background)] text-[var(--muted-foreground)] uppercase text-xs">
          <tr>
            <th class="p-3">สินค้า</th>
            <th class="p-3">หมวดหมู่</th>
            <th class="p-3 text-center">ส่วนลด (Discount %)</th>
            <th class="p-3 text-right">ราคาขาย</th>
            <th class="p-3 text-right">ราคาปกติ</th>
            <th class="p-3 text-center">คะแนน</th>
          </tr>
        </thead>
        <tbody id="productTableBody" class="divide-y divide-[var(--border)]">
          <!-- Injected dynamically -->
        </tbody>
      </table>
    </div>

    <!-- Pagination & Stats -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--muted-foreground)]">
      <div id="productPaginationInfo">
        แสดง 1 - 10 จาก 1,465 รายการ
      </div>
      <div class="flex items-center gap-2">
        <button id="prevPageBtn" class="px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)] text-[var(--foreground)] disabled:opacity-40 transition">
          ◀ ก่อนหน้า
        </button>
        <span id="currentPageLabel" class="font-semibold text-[var(--foreground)] px-2">1 / 147</span>
        <button id="nextPageBtn" class="px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)] text-[var(--foreground)] disabled:opacity-40 transition">
          ถัดไป ▶
        </button>
      </div>
    </div>
  </section>

  <!-- Interactive Floating Tooltip -->
  <div id="chartTooltip" class="chart-tooltip hidden bg-slate-900 text-white text-xs rounded-xl p-3 shadow-2xl border border-slate-700 max-w-xs">
    <!-- Dynamic tooltip content -->
  </div>

  <!-- Raw Compact Data Embedded -->
  <script>
    const RAW_DATA = ${JSON.stringify(compactData)};
  </script>

  <!-- Dashboard Logic -->
  <script>
    // State management
    const state = {
      level: 'main', // 'main' or 'sub'
      selectedCategories: new Set(),
      filterMinVolume: true,
      chartMode: 'bar', // 'bar', 'distribution', 'boxplot'
      sortColumn: 'avg',
      sortAsc: false,
      productSearch: '',
      minDiscount: 0,
      productSort: 'discountDesc',
      page: 1,
      pageSize: 10,
      isLight: false
    };

    // Category Colors Palette
    const PALETTE = [
      '#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24', 
      '#a78bfa', '#2dd4bf', '#fb923c', '#f87171', '#4ade80',
      '#60a5fa', '#e879f9', '#c084fc', '#facc15', '#22c55e'
    ];

    function getColor(index) {
      return PALETTE[index % PALETTE.length];
    }

    // Initialize categories selection
    function initSelectedCategories() {
      state.selectedCategories.clear();
      const list = state.level === 'main' ? RAW_DATA.mainCats : RAW_DATA.subCats;
      list.forEach(c => state.selectedCategories.add(c));
    }

    // Unpack products helper
    function getParsedProducts() {
      return RAW_DATA.products.map(p => ({
        id: p[0],
        name: p[1],
        mainCategory: RAW_DATA.mainCats[p[2]] || 'Other',
        subCategory: RAW_DATA.subCats[p[3]] || 'Other',
        discountedPrice: p[4],
        actualPrice: p[5],
        discountPercent: p[6],
        rating: p[7],
        ratingCount: p[8]
      }));
    }

    const ALL_PARSED_PRODUCTS = getParsedProducts();

    // Compute stats for current selection
    function calculateCategoryStats() {
      const isMain = state.level === 'main';
      const groups = {};

      ALL_PARSED_PRODUCTS.forEach(p => {
        const catKey = isMain ? p.mainCategory : p.subCategory;
        if (!state.selectedCategories.has(catKey)) return;

        if (!groups[catKey]) {
          groups[catKey] = [];
        }
        groups[catKey].push(p);
      });

      const stats = [];
      for (const [catName, items] of Object.entries(groups)) {
        if (state.filterMinVolume && items.length < 5) continue;

        const count = items.length;
        const discounts = items.map(i => i.discountPercent).sort((a, b) => a - b);
        const sum = discounts.reduce((a, b) => a + b, 0);
        const avg = Number((sum / count).toFixed(1));
        const min = discounts[0];
        const max = discounts[count - 1];
        const median = count % 2 === 0
          ? Number(((discounts[count / 2 - 1] + discounts[count / 2]) / 2).toFixed(1))
          : discounts[Math.floor(count / 2)];

        const q1 = discounts[Math.floor(count * 0.25)];
        const q3 = discounts[Math.floor(count * 0.75)];

        // Distribution brackets
        const b1 = discounts.filter(d => d <= 20).length;
        const b2 = discounts.filter(d => d > 20 && d <= 40).length;
        const b3 = discounts.filter(d => d > 40 && d <= 60).length;
        const b4 = discounts.filter(d => d > 60 && d <= 80).length;
        const b5 = discounts.filter(d => d > 80).length;

        const origPriceSum = items.reduce((a, b) => a + b.actualPrice, 0);
        const salePriceSum = items.reduce((a, b) => a + b.discountedPrice, 0);
        const ratingSum = items.reduce((a, b) => a + b.rating, 0);

        stats.push({
          name: catName,
          count,
          avg,
          median,
          min,
          max,
          q1,
          q3,
          b1, b2, b3, b4, b5,
          origPriceAvg: Math.round(origPriceSum / count),
          salePriceAvg: Math.round(salePriceSum / count),
          ratingAvg: Number((ratingSum / count).toFixed(2)),
          items
        });
      }

      // Sort stats
      stats.sort((a, b) => {
        let valA = a[state.sortColumn];
        let valB = b[state.sortColumn];
        if (state.sortColumn === 'name') {
          return state.sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return state.sortAsc ? valA - valB : valB - valA;
      });

      return stats;
    }

    // Render category selection pills
    function renderCategoryPills() {
      const container = document.getElementById('categoryPillContainer');
      container.innerHTML = '';
      const list = state.level === 'main' ? RAW_DATA.mainCats : RAW_DATA.subCats;

      list.forEach((cat, index) => {
        const isSelected = state.selectedCategories.has(cat);
        const color = getColor(index);
        
        // Count products in this category
        const count = ALL_PARSED_PRODUCTS.filter(p => (state.level === 'main' ? p.mainCategory : p.subCategory) === cat).length;

        const btn = document.createElement('button');
        btn.className = 'badge-pill text-xs px-3 py-1.5 rounded-full border flex items-center gap-1.5 font-medium transition cursor-pointer select-none';
        
        if (isSelected) {
          btn.style.backgroundColor = color + '22';
          btn.style.borderColor = color;
          btn.style.color = state.isLight ? '#0f172a' : '#f8fafc';
          btn.innerHTML = \`
            <span class="w-2 h-2 rounded-full" style="background-color: \${color};"></span>
            <span>\${cat}</span>
            <span class="text-[11px] opacity-75">(\${count})</span>
          \`;
        } else {
          btn.className += ' border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] opacity-60 hover:opacity-100';
          btn.innerHTML = \`
            <span class="w-2 h-2 rounded-full bg-slate-500"></span>
            <span>\${cat}</span>
            <span class="text-[11px] opacity-60">(\${count})</span>
          \`;
        }

        btn.onclick = () => {
          if (state.selectedCategories.has(cat)) {
            if (state.selectedCategories.size > 1) {
              state.selectedCategories.delete(cat);
            }
          } else {
            state.selectedCategories.add(cat);
          }
          state.page = 1;
          updateDashboard();
        };

        container.appendChild(btn);
      });

      document.getElementById('selectedCategoriesCount').innerText = state.selectedCategories.size;
    }

    // Update KPI Cards
    function updateKPIs(categoryStats) {
      let totalCount = 0;
      let totalDiscountSum = 0;
      let allDiscounts = [];
      let totalRatingSum = 0;

      categoryStats.forEach(cs => {
        totalCount += cs.count;
        cs.items.forEach(p => {
          totalDiscountSum += p.discountPercent;
          allDiscounts.push(p.discountPercent);
          totalRatingSum += p.rating;
        });
      });

      allDiscounts.sort((a, b) => a - b);

      const overallAvg = totalCount > 0 ? (totalDiscountSum / totalCount).toFixed(1) : 0;
      const median = totalCount > 0 ? allDiscounts[Math.floor(totalCount / 2)] : 0;
      const min = totalCount > 0 ? allDiscounts[0] : 0;
      const max = totalCount > 0 ? allDiscounts[totalCount - 1] : 0;
      const avgRating = totalCount > 0 ? (totalRatingSum / totalCount).toFixed(2) : 0;

      document.getElementById('kpiProductCount').innerText = totalCount.toLocaleString();
      document.getElementById('kpiProductsPct').innerText = ((totalCount / ALL_PARSED_PRODUCTS.length) * 100).toFixed(0) + '%';
      document.getElementById('selectedProductsCount').innerText = totalCount.toLocaleString();

      document.getElementById('kpiAvgDiscount').innerText = overallAvg + '%';
      document.getElementById('kpiMedianDiscount').innerText = median + '%';
      document.getElementById('kpiMaxDiscount').innerText = max + '% / ' + min + '%';
      document.getElementById('kpiDiscountSpread').innerText = 'ช่วงห่างส่วนลด: ' + (max - min) + '%';

      if (categoryStats.length > 0) {
        const sortedByAvg = [...categoryStats].sort((a, b) => b.avg - a.avg);
        const topCat = sortedByAvg[0];
        document.getElementById('kpiTopDiscountCategory').innerText = topCat.name.split('>').pop().trim();
        document.getElementById('kpiTopCategoryAvg').innerText = 'เฉลี่ยลด ' + topCat.avg + '% (มัธยฐาน ' + topCat.median + '%)';
      } else {
        document.getElementById('kpiTopDiscountCategory').innerText = '-';
        document.getElementById('kpiTopCategoryAvg').innerText = '-';
      }

      document.getElementById('kpiAvgRating').innerText = avgRating;
    }

    // Render Side-by-Side Comparison SVG Chart
    function renderMainChart(categoryStats) {
      const container = document.getElementById('chartContainer');
      const legend = document.getElementById('chartLegend');
      
      if (!categoryStats || categoryStats.length === 0) {
        container.innerHTML = '<div class="text-[var(--muted-foreground)] text-sm">กรุณาเลือกหมวดหมู่อย่างน้อย 1 หมวดหมู่</div>';
        legend.innerHTML = '';
        return;
      }

      if (state.chartMode === 'bar') {
        renderBarComparison(categoryStats, container, legend);
      } else if (state.chartMode === 'distribution') {
        renderDistributionStacked(categoryStats, container, legend);
      } else if (state.chartMode === 'boxplot') {
        renderBoxPlot(categoryStats, container, legend);
      }
    }

    // Render Bar Chart (Mean & Median with Whisker)
    function renderBarComparison(stats, container, legend) {
      const svgWidth = 800;
      const svgHeight = 340;
      const margin = { top: 30, right: 20, bottom: 85, left: 50 };
      const width = svgWidth - margin.left - margin.right;
      const height = svgHeight - margin.top - margin.bottom;

      const numBars = stats.length;
      const barWidth = Math.min(50, Math.max(16, (width / numBars) * 0.65));
      const groupWidth = width / numBars;

      let svg = \`<svg viewBox="0 0 \${svgWidth} \${svgHeight}" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">\`;

      // Background grid lines (0%, 20%, 40%, 60%, 80%, 100%)
      const yTicks = [0, 20, 40, 60, 80, 100];
      yTicks.forEach(tick => {
        const y = margin.top + height - (tick / 100) * height;
        svg += \`
          <line x1="\${margin.left}" y1="\${y}" x2="\${margin.left + width}" y2="\${y}" stroke="var(--border)" stroke-dasharray="3,3" opacity="0.6" />
          <text x="\${margin.left - 8}" y="\${y + 4}" fill="var(--muted-foreground)" font-size="11" text-anchor="end">\${tick}%</text>
        \`;
      });

      // Axis lines
      svg += \`<line x1="\${margin.left}" y1="\${margin.top + height}" x2="\${margin.left + width}" y2="\${margin.top + height}" stroke="var(--border)" stroke-width="1.5" />\`;

      // Render category bars
      stats.forEach((cat, i) => {
        const x = margin.left + i * groupWidth + (groupWidth - barWidth) / 2;
        const color = getColor(i);
        const barHeight = (cat.avg / 100) * height;
        const barY = margin.top + height - barHeight;

        const medianY = margin.top + height - (cat.median / 100) * height;
        const minY = margin.top + height - (cat.min / 100) * height;
        const maxY = margin.top + height - (cat.max / 100) * height;
        const centerX = x + barWidth / 2;

        // Min-Max whisker line
        svg += \`
          <line x1="\${centerX}" y1="\${maxY}" x2="\${centerX}" y2="\${minY}" stroke="var(--muted-foreground)" stroke-width="1.5" opacity="0.4" />
          <line x1="\${centerX - 4}" y1="\${maxY}" x2="\${centerX + 4}" y2="\${maxY}" stroke="var(--muted-foreground)" stroke-width="1.5" opacity="0.5" />
          <line x1="\${centerX - 4}" y1="\${minY}" x2="\${centerX + 4}" y2="\${minY}" stroke="var(--muted-foreground)" stroke-width="1.5" opacity="0.5" />
        \`;

        // Bar rectangle (Mean)
        svg += \`
          <rect 
            x="\${x}" 
            y="\${barY}" 
            width="\${barWidth}" 
            height="\${barHeight}" 
            rx="6" 
            fill="\${color}" 
            fill-opacity="0.85"
            class="transition-all duration-300 hover:fill-opacity-100 cursor-pointer"
            data-cat="\${encodeURIComponent(JSON.stringify(cat))}"
            onmousemove="showTooltip(event, '\${encodeURIComponent(JSON.stringify(cat))}')"
            onmouseleave="hideTooltip()"
          />
        \`;

        // Value text above bar
        svg += \`
          <text x="\${centerX}" y="\${barY - 7}" fill="var(--foreground)" font-size="11" font-weight="bold" text-anchor="middle">\${cat.avg}%</text>
        \`;

        // Median marker (distinct diamond or line)
        svg += \`
          <line x1="\${x - 2}" y1="\${medianY}" x2="\${x + barWidth + 2}" y2="\${medianY}" stroke="#f97316" stroke-width="3" stroke-linecap="round" />
        \`;

        // X-axis label (Category Name rotated if crowded)
        const displayName = cat.name.split('>').pop().trim();
        const shortName = displayName.length > 14 ? displayName.substring(0, 12) + '...' : displayName;
        
        svg += \`
          <text 
            x="\${centerX}" 
            y="\${margin.top + height + 18}" 
            fill="var(--muted-foreground)" 
            font-size="11" 
            text-anchor="end" 
            transform="rotate(-35, \${centerX}, \${margin.top + height + 18})"
            class="cursor-pointer hover:fill-[var(--foreground)]"
            title="\${cat.name}"
          >\${shortName}</text>
        \`;
      });

      svg += '</svg>';
      container.innerHTML = svg;

      legend.innerHTML = \`
        <div class="flex items-center gap-4 flex-wrap">
          <div class="flex items-center gap-1.5">
            <span class="w-3.5 h-3.5 rounded bg-sky-400 opacity-85"></span>
            <span>ความสูงแท่ง: ค่าเฉลี่ยส่วนลด (Mean %)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-4 h-1 rounded bg-orange-500"></span>
            <span>เส้นส้ม: ค่ามัธยฐาน (Median %)</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-3 border-l-2 border-slate-400"></span>
            <span>เส้นเสา: ช่วงส่วนลดต่ำสุด - สูงสุด (Min - Max)</span>
          </div>
        </div>
        <div class="text-[var(--muted-foreground)]">
          * วางเมาส์เหนือแท่งกราฟเพื่อดูสถิติเชิงลึก
        </div>
      \`;
    }

    // Render Distribution Stacked Bar
    function renderDistributionStacked(stats, container, legend) {
      const svgWidth = 800;
      const svgHeight = 340;
      const margin = { top: 30, right: 20, bottom: 85, left: 50 };
      const width = svgWidth - margin.left - margin.right;
      const height = svgHeight - margin.top - margin.bottom;

      const numBars = stats.length;
      const barWidth = Math.min(50, Math.max(16, (width / numBars) * 0.65));
      const groupWidth = width / numBars;

      let svg = \`<svg viewBox="0 0 \${svgWidth} \${svgHeight}" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">\`;

      const yTicks = [0, 25, 50, 75, 100];
      yTicks.forEach(tick => {
        const y = margin.top + height - (tick / 100) * height;
        svg += \`
          <line x1="\${margin.left}" y1="\${y}" x2="\${margin.left + width}" y2="\${y}" stroke="var(--border)" stroke-dasharray="3,3" opacity="0.6" />
          <text x="\${margin.left - 8}" y="\${y + 4}" fill="var(--muted-foreground)" font-size="11" text-anchor="end">\${tick}%</text>
        \`;
      });

      const colors = ['#64748b', '#38bdf8', '#34d399', '#f59e0b', '#ec4899']; // 0-20, 20-40, 40-60, 60-80, 80-100

      stats.forEach((cat, i) => {
        const x = margin.left + i * groupWidth + (groupWidth - barWidth) / 2;
        const total = cat.count;
        let currentY = margin.top + height;

        const brackets = [cat.b1, cat.b2, cat.b3, cat.b4, cat.b5];

        brackets.forEach((bCount, bIdx) => {
          const segPct = bCount / total;
          const segHeight = segPct * height;
          currentY -= segHeight;

          svg += \`
            <rect 
              x="\${x}" 
              y="\${currentY}" 
              width="\${barWidth}" 
              height="\${segHeight}" 
              fill="\${colors[bIdx]}" 
              fill-opacity="0.9"
              class="hover:opacity-100 cursor-pointer"
              onmousemove="showBracketTooltip(event, '\${cat.name}', '\${bIdx}', \${bCount}, \${total})"
              onmouseleave="hideTooltip()"
            />
          \`;
        });

        // X-axis label
        const centerX = x + barWidth / 2;
        const displayName = cat.name.split('>').pop().trim();
        const shortName = displayName.length > 14 ? displayName.substring(0, 12) + '...' : displayName;
        
        svg += \`
          <text 
            x="\${centerX}" 
            y="\${margin.top + height + 18}" 
            fill="var(--muted-foreground)" 
            font-size="11" 
            text-anchor="end" 
            transform="rotate(-35, \${centerX}, \${margin.top + height + 18})"
          >\${shortName}</text>
        \`;
      });

      svg += '</svg>';
      container.innerHTML = svg;

      legend.innerHTML = \`
        <div class="flex items-center gap-3 flex-wrap">
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded" style="background:#64748b;"></span>0-20%</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded" style="background:#38bdf8;"></span>21-40%</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded" style="background:#34d399;"></span>41-60%</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded" style="background:#f59e0b;"></span>61-80%</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded" style="background:#ec4899;"></span>81-100%</span>
        </div>
      \`;
    }

    // Render Box Plot Chart
    function renderBoxPlot(stats, container, legend) {
      const svgWidth = 800;
      const svgHeight = 340;
      const margin = { top: 30, right: 20, bottom: 85, left: 50 };
      const width = svgWidth - margin.left - margin.right;
      const height = svgHeight - margin.top - margin.bottom;

      const numBars = stats.length;
      const boxWidth = Math.min(44, Math.max(16, (width / numBars) * 0.55));
      const groupWidth = width / numBars;

      let svg = \`<svg viewBox="0 0 \${svgWidth} \${svgHeight}" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">\`;

      const yTicks = [0, 20, 40, 60, 80, 100];
      yTicks.forEach(tick => {
        const y = margin.top + height - (tick / 100) * height;
        svg += \`
          <line x1="\${margin.left}" y1="\${y}" x2="\${margin.left + width}" y2="\${y}" stroke="var(--border)" stroke-dasharray="3,3" opacity="0.6" />
          <text x="\${margin.left - 8}" y="\${y + 4}" fill="var(--muted-foreground)" font-size="11" text-anchor="end">\${tick}%</text>
        \`;
      });

      stats.forEach((cat, i) => {
        const x = margin.left + i * groupWidth + (groupWidth - boxWidth) / 2;
        const centerX = x + boxWidth / 2;
        const color = getColor(i);

        const yMin = margin.top + height - (cat.min / 100) * height;
        const yMax = margin.top + height - (cat.max / 100) * height;
        const yQ1 = margin.top + height - (cat.q1 / 100) * height;
        const yQ3 = margin.top + height - (cat.q3 / 100) * height;
        const yMed = margin.top + height - (cat.median / 100) * height;

        // Whiskers
        svg += \`
          <line x1="\${centerX}" y1="\${yMin}" x2="\${centerX}" y2="\${yQ1}" stroke="var(--foreground)" stroke-width="1.5" />
          <line x1="\${centerX}" y1="\${yQ3}" x2="\${centerX}" y2="\${yMax}" stroke="var(--foreground)" stroke-width="1.5" />
          <line x1="\${centerX - 5}" y1="\${yMin}" x2="\${centerX + 5}" y2="\${yMin}" stroke="var(--foreground)" stroke-width="1.5" />
          <line x1="\${centerX - 5}" y1="\${yMax}" x2="\${centerX + 5}" y2="\${yMax}" stroke="var(--foreground)" stroke-width="1.5" />
        \`;

        // Box
        const bHeight = Math.max(2, yQ1 - yQ3);
        svg += \`
          <rect 
            x="\${x}" 
            y="\${yQ3}" 
            width="\${boxWidth}" 
            height="\${bHeight}" 
            rx="4" 
            fill="\${color}" 
            fill-opacity="0.7" 
            stroke="\${color}" 
            stroke-width="1.5"
            class="hover:fill-opacity-95 cursor-pointer"
            onmousemove="showTooltip(event, '\${encodeURIComponent(JSON.stringify(cat))}')"
            onmouseleave="hideTooltip()"
          />
          <line x1="\${x}" y1="\${yMed}" x2="\${x + boxWidth}" y2="\${yMed}" stroke="#ffffff" stroke-width="2.5" />
        \`;

        // X-axis label
        const displayName = cat.name.split('>').pop().trim();
        const shortName = displayName.length > 14 ? displayName.substring(0, 12) + '...' : displayName;
        
        svg += \`
          <text 
            x="\${centerX}" 
            y="\${margin.top + height + 18}" 
            fill="var(--muted-foreground)" 
            font-size="11" 
            text-anchor="end" 
            transform="rotate(-35, \${centerX}, \${margin.top + height + 18})"
          >\${shortName}</text>
        \`;
      });

      svg += '</svg>';
      container.innerHTML = svg;

      legend.innerHTML = \`
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-sky-500"></span>กล่อง = Q1 (25%) ถึง Q3 (75%)</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-1 bg-white"></span>เส้นกลาง = มัธยฐาน Median</span>
          <span class="flex items-center gap-1.5"><span class="w-2.5 h-3 border-l-2 border-slate-300"></span>เสา = Min / Max</span>
        </div>
      \`;
    }

    // Update Right Panel: Bracket distribution summary
    function updateBracketBreakdown(categoryStats) {
      const container = document.getElementById('bracketBreakdownContainer');
      container.innerHTML = '';

      let b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0;
      let total = 0;

      categoryStats.forEach(cs => {
        b1 += cs.b1; b2 += cs.b2; b3 += cs.b3; b4 += cs.b4; b5 += cs.b5;
        total += cs.count;
      });

      if (total === 0) {
        container.innerHTML = '<div class="text-xs text-[var(--muted-foreground)]">ไม่มีข้อมูล</div>';
        return;
      }

      const brackets = [
        { label: '0% - 20% (ลดน้อย/ราคาป้าย)', count: b1, color: 'bg-slate-400' },
        { label: '21% - 40% (ส่วนลดปานกลาง)', count: b2, color: 'bg-sky-400' },
        { label: '41% - 60% (ส่วนลดมาตรฐาน)', count: b3, color: 'bg-emerald-400' },
        { label: '61% - 80% (ลดจัดหนัก/ดีลเด็ด)', count: b4, color: 'bg-amber-400' },
        { label: '81% - 100% (ลดล้างสต็อก)', count: b5, color: 'bg-pink-500' }
      ];

      brackets.forEach(b => {
        const pct = ((b.count / total) * 100).toFixed(1);
        const row = document.createElement('div');
        row.className = 'flex flex-col gap-1 text-xs';
        row.innerHTML = \`
          <div class="flex justify-between items-center text-[var(--muted-foreground)]">
            <span>\${b.label}</span>
            <span class="font-semibold text-[var(--foreground)]">\${b.count.toLocaleString()} ชิ้น (\${pct}%)</span>
          </div>
          <div class="w-full bg-[var(--background)] h-2 rounded-full overflow-hidden border border-[var(--border)]">
            <div class="\${b.color} h-full rounded-full transition-all duration-500" style="width: \${pct}%"></div>
          </div>
        \`;
        container.appendChild(row);
      });

      // Insight text
      const topBracket = [...brackets].sort((a, b) => b.count - a.count)[0];
      document.getElementById('bracketInsightText').innerText = 
        \`กลุ่มสินค้าส่วนใหญ่ตกอยู่ในช่วง "\${topBracket.label}" คิดเป็น \${((topBracket.count / total) * 100).toFixed(1)}%\`;
    }

    // Update Right Panel: Top Discount Ranking Mini-List
    function updateTopRankList(categoryStats) {
      const container = document.getElementById('topRankContainer');
      container.innerHTML = '';

      const sorted = [...categoryStats].sort((a, b) => b.avg - a.avg);

      sorted.forEach((cat, idx) => {
        const item = document.createElement('div');
        item.className = 'py-2 flex items-center justify-between text-xs hover:bg-[var(--card-hover)] px-2 rounded transition';
        const color = getColor(idx);
        item.innerHTML = \`
          <div class="flex items-center gap-2 truncate">
            <span class="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] bg-sky-500/10 text-sky-400">
              \${idx + 1}
            </span>
            <div class="truncate">
              <div class="font-semibold text-[var(--foreground)] truncate">\${cat.name}</div>
              <div class="text-[10px] text-[var(--muted-foreground)]">\${cat.count} รายการ • มัธยฐาน \${cat.median}%</div>
            </div>
          </div>
          <div class="text-right">
            <div class="font-bold text-emerald-400">\${cat.avg}%</div>
            <div class="text-[10px] text-[var(--muted-foreground)]">เฉลี่ย</div>
          </div>
        \`;
        container.appendChild(item);
      });
    }

    // Render Deep Dive Comparison Table
    function renderComparisonTable(categoryStats) {
      const tbody = document.getElementById('comparisonTableBody');
      tbody.innerHTML = '';

      if (categoryStats.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="p-4 text-center text-xs text-[var(--muted-foreground)]">ไม่มีข้อมูลหมวดหมู่ที่เลือก</td></tr>';
        return;
      }

      categoryStats.forEach((cat, idx) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-[var(--card-hover)] transition';
        
        const badgeColor = cat.avg >= 50 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                           cat.avg >= 30 ? 'bg-sky-500/15 text-sky-400 border-sky-500/30' :
                                           'bg-slate-500/15 text-slate-400 border-slate-500/30';

        tr.innerHTML = \`
          <td class="p-3 font-semibold text-[var(--foreground)]">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full" style="background-color: \${getColor(idx)};"></span>
              <span>\${cat.name}</span>
            </div>
          </td>
          <td class="p-3 text-center text-[var(--foreground)]">\${cat.count.toLocaleString()}</td>
          <td class="p-3 text-center">
            <span class="px-2 py-0.5 rounded-md border text-xs font-bold \${badgeColor}">
              \${cat.avg}%
            </span>
          </td>
          <td class="p-3 text-center font-semibold text-sky-400">\${cat.median}%</td>
          <td class="p-3 text-center text-[var(--muted-foreground)]">\${cat.min}% - \${cat.max}%</td>
          <td class="p-3 text-right text-[var(--muted-foreground)]">₹\${cat.origPriceAvg.toLocaleString()}</td>
          <td class="p-3 text-right font-medium text-[var(--foreground)]">₹\${cat.salePriceAvg.toLocaleString()}</td>
          <td class="p-3 text-center">
            <span class="text-amber-400 font-semibold">★ \${cat.ratingAvg}</span>
          </td>
        \`;
        tbody.appendChild(tr);
      });
    }

    // Render Products Explorer
    function renderProductExplorer() {
      const tbody = document.getElementById('productTableBody');
      tbody.innerHTML = '';

      // Filter products based on selected categories and explorer controls
      const isMain = state.level === 'main';
      let filtered = ALL_PARSED_PRODUCTS.filter(p => {
        const catKey = isMain ? p.mainCategory : p.subCategory;
        if (!state.selectedCategories.has(catKey)) return false;

        if (p.discountPercent < state.minDiscount) return false;

        if (state.productSearch.trim()) {
          const q = state.productSearch.toLowerCase();
          const matches = p.name.toLowerCase().includes(q) || catKey.toLowerCase().includes(q);
          if (!matches) return false;
        }

        return true;
      });

      // Sort
      filtered.sort((a, b) => {
        if (state.productSort === 'discountDesc') return b.discountPercent - a.discountPercent;
        if (state.productSort === 'discountAsc') return a.discountPercent - b.discountPercent;
        if (state.productSort === 'ratingDesc') return b.rating - a.rating;
        if (state.productSort === 'priceAsc') return a.discountedPrice - b.discountedPrice;
        if (state.productSort === 'priceDesc') return b.discountedPrice - a.discountedPrice;
        return 0;
      });

      const totalFiltered = filtered.length;
      const totalPages = Math.max(1, Math.ceil(totalFiltered / state.pageSize));
      if (state.page > totalPages) state.page = totalPages;

      const startIdx = (state.page - 1) * state.pageSize;
      const paginated = filtered.slice(startIdx, startIdx + state.pageSize);

      if (paginated.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-6 text-center text-xs text-[var(--muted-foreground)]">ไม่พบสินค้าตามเงื่อนไขที่ระบุ</td></tr>';
      } else {
        paginated.forEach(p => {
          const tr = document.createElement('tr');
          tr.className = 'hover:bg-[var(--card-hover)] transition';

          const pctBadge = p.discountPercent >= 70 ? 'bg-pink-500/15 text-pink-400 border-pink-500/30' :
                          p.discountPercent >= 50 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                          p.discountPercent >= 30 ? 'bg-sky-500/15 text-sky-400 border-sky-500/30' :
                                                    'bg-slate-500/15 text-slate-400 border-slate-500/30';

          tr.innerHTML = \`
            <td class="p-3 max-w-xs">
              <div class="font-medium text-[var(--foreground)] truncate" title="\${p.name}">
                \${p.name}
              </div>
              <div class="text-[10px] text-[var(--muted-foreground)] font-mono">ID: \${p.id}</div>
            </td>
            <td class="p-3 text-[var(--muted-foreground)]">
              <span class="inline-block px-2 py-0.5 rounded text-[11px] bg-[var(--background)] border border-[var(--border)]">
                \${p.subCategory}
              </span>
            </td>
            <td class="p-3 text-center">
              <span class="px-2 py-0.5 rounded-md border text-xs font-bold \${pctBadge}">
                \${p.discountPercent}% OFF
              </span>
            </td>
            <td class="p-3 text-right font-bold text-emerald-400">₹\${p.discountedPrice.toLocaleString()}</td>
            <td class="p-3 text-right line-through text-[var(--muted-foreground)]">₹\${p.actualPrice.toLocaleString()}</td>
            <td class="p-3 text-center">
              <span class="text-amber-400 font-semibold">★ \${p.rating}</span>
              <span class="text-[10px] text-[var(--muted-foreground)]">(\${p.ratingCount.toLocaleString()})</span>
            </td>
          \`;
          tbody.appendChild(tr);
        });
      }

      document.getElementById('productPaginationInfo').innerText = 
        \`แสดง \${totalFiltered > 0 ? startIdx + 1 : 0} - \${Math.min(startIdx + state.pageSize, totalFiltered)} จากทั้งหมด \${totalFiltered.toLocaleString()} รายการ\`;
      document.getElementById('currentPageLabel').innerText = \`\${state.page} / \${totalPages}\`;
      document.getElementById('prevPageBtn').disabled = state.page <= 1;
      document.getElementById('nextPageBtn').disabled = state.page >= totalPages;
    }

    // Tooltip Handlers
    window.showTooltip = function(event, encodedData) {
      const data = JSON.parse(decodeURIComponent(encodedData));
      const tt = document.getElementById('chartTooltip');
      
      tt.innerHTML = \`
        <div class="font-bold text-sm text-sky-400 mb-1 border-b border-slate-700 pb-1">\${data.name}</div>
        <div class="space-y-1 text-slate-300">
          <div class="flex justify-between gap-4"><span>จำนวนสินค้า:</span><b class="text-white">\${data.count} ชิ้น</b></div>
          <div class="flex justify-between gap-4"><span>ส่วนลดเฉลี่ย (Mean):</span><b class="text-emerald-400">\${data.avg}%</b></div>
          <div class="flex justify-between gap-4"><span>มัธยฐาน (Median):</span><b class="text-orange-400">\${data.median}%</b></div>
          <div class="flex justify-between gap-4"><span>ช่วงส่วนลด (Min - Max):</span><b class="text-purple-300">\${data.min}% - \${data.max}%</b></div>
          <div class="flex justify-between gap-4"><span>ราคาปกติเฉลี่ย:</span><span class="text-white">₹\${data.origPriceAvg.toLocaleString()}</span></div>
          <div class="flex justify-between gap-4"><span>ราคาขายเฉลี่ย:</span><span class="text-white">₹\${data.salePriceAvg.toLocaleString()}</span></div>
          <div class="flex justify-between gap-4"><span>คะแนนรีวิวเฉลี่ย:</span><span class="text-yellow-400">★ \${data.ratingAvg}</span></div>
        </div>
      \`;

      tt.classList.remove('hidden');
      const x = Math.min(window.innerWidth - 250, event.clientX + 15);
      const y = Math.min(window.innerHeight - 200, event.clientY + 15);
      tt.style.left = x + 'px';
      tt.style.top = y + 'px';
    };

    window.showBracketTooltip = function(event, catName, bIdx, count, total) {
      const tt = document.getElementById('chartTooltip');
      const labels = ['0%-20%', '21%-40%', '41%-60%', '61%-80%', '81%-100%'];
      const pct = ((count / total) * 100).toFixed(1);

      tt.innerHTML = \`
        <div class="font-bold text-sm text-sky-400 mb-1">\${catName}</div>
        <div class="text-slate-300">
          <div>ช่วงส่วนลด: <b class="text-white">\${labels[bIdx]}</b></div>
          <div>จำนวน: <b class="text-emerald-400">\${count}</b> จาก \${total} ชิ้น (\${pct}%)</div>
        </div>
      \`;

      tt.classList.remove('hidden');
      const x = Math.min(window.innerWidth - 220, event.clientX + 15);
      const y = Math.min(window.innerHeight - 150, event.clientY + 15);
      tt.style.left = x + 'px';
      tt.style.top = y + 'px';
    };

    window.hideTooltip = function() {
      const tt = document.getElementById('chartTooltip');
      tt.classList.add('hidden');
    };

    // Master update function
    function updateDashboard() {
      renderCategoryPills();
      const stats = calculateCategoryStats();
      updateKPIs(stats);
      renderMainChart(stats);
      updateBracketBreakdown(stats);
      updateTopRankList(stats);
      renderComparisonTable(stats);
      renderProductExplorer();
    }

    // Attach Event Listeners
    function attachListeners() {
      // Level switcher
      document.getElementById('levelMainBtn').onclick = () => {
        state.level = 'main';
        document.getElementById('levelMainBtn').className = 'px-3 py-1.5 text-xs font-semibold rounded-md bg-sky-500 text-white transition';
        document.getElementById('levelSubBtn').className = 'px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition';
        initSelectedCategories();
        updateDashboard();
      };

      document.getElementById('levelSubBtn').onclick = () => {
        state.level = 'sub';
        document.getElementById('levelSubBtn').className = 'px-3 py-1.5 text-xs font-semibold rounded-md bg-sky-500 text-white transition';
        document.getElementById('levelMainBtn').className = 'px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition';
        initSelectedCategories();
        updateDashboard();
      };

      // Presets
      document.getElementById('presetTop3Btn').onclick = () => {
        state.selectedCategories.clear();
        if (state.level === 'main') {
          ['Computers&Accessories', 'Electronics', 'Home&Kitchen'].forEach(c => state.selectedCategories.add(c));
        } else {
          RAW_DATA.subCats.slice(0, 5).forEach(c => state.selectedCategories.add(c));
        }
        updateDashboard();
      };

      document.getElementById('presetHighDiscountBtn').onclick = () => {
        const stats = calculateCategoryStats();
        state.selectedCategories.clear();
        stats.filter(s => s.avg >= 50).forEach(s => state.selectedCategories.add(s.name));
        updateDashboard();
      };

      document.getElementById('selectAllCatsBtn').onclick = () => {
        initSelectedCategories();
        updateDashboard();
      };

      document.getElementById('clearAllCatsBtn').onclick = () => {
        state.selectedCategories.clear();
        const list = state.level === 'main' ? RAW_DATA.mainCats : RAW_DATA.subCats;
        if (list.length > 0) state.selectedCategories.add(list[0]);
        updateDashboard();
      };

      // Min volume checkbox
      document.getElementById('filterMinVolumeCheckbox').onchange = (e) => {
        state.filterMinVolume = e.target.checked;
        updateDashboard();
      };

      // Chart view modes
      const bBar = document.getElementById('chartViewBarBtn');
      const bDist = document.getElementById('chartViewDistributionBtn');
      const bBox = document.getElementById('chartViewBoxPlotBtn');

      function setChartBtnStyles(activeBtn) {
        [bBar, bDist, bBox].forEach(b => {
          b.className = (b === activeBtn)
            ? 'px-2.5 py-1 text-xs font-semibold rounded bg-sky-500 text-white transition'
            : 'px-2.5 py-1 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition';
        });
      }

      bBar.onclick = () => {
        state.chartMode = 'bar';
        setChartBtnStyles(bBar);
        document.getElementById('chartTitle').innerText = 'เปรียบเทียบอัตราส่วนลดเฉลี่ยและมัธยฐานตามหมวดหมู่';
        renderMainChart(calculateCategoryStats());
      };

      bDist.onclick = () => {
        state.chartMode = 'distribution';
        setChartBtnStyles(bDist);
        document.getElementById('chartTitle').innerText = 'สัดส่วนเปอร์เซ็นต์ส่วนลดแบ่งตามช่วง (Bracket Distribution %)';
        renderMainChart(calculateCategoryStats());
      };

      bBox.onclick = () => {
        state.chartMode = 'boxplot';
        setChartBtnStyles(bBox);
        document.getElementById('chartTitle').innerText = 'แผนภาพกล่องแจกแจงส่วนลด (Box Plot: Min, Q1, Median, Q3, Max)';
        renderMainChart(calculateCategoryStats());
      };

      // Sorting table
      document.querySelectorAll('[data-sort]').forEach(th => {
        th.onclick = () => {
          const col = th.getAttribute('data-sort');
          if (state.sortColumn === col) {
            state.sortAsc = !state.sortAsc;
          } else {
            state.sortColumn = col;
            state.sortAsc = false;
          }
          renderComparisonTable(calculateCategoryStats());
        };
      });

      // Product explorer filters
      document.getElementById('productSearchInput').oninput = (e) => {
        state.productSearch = e.target.value;
        state.page = 1;
        renderProductExplorer();
      };

      document.getElementById('minDiscountFilter').onchange = (e) => {
        state.minDiscount = parseFloat(e.target.value) || 0;
        state.page = 1;
        renderProductExplorer();
      };

      document.getElementById('sortProductsSelect').onchange = (e) => {
        state.productSort = e.target.value;
        state.page = 1;
        renderProductExplorer();
      };

      document.getElementById('prevPageBtn').onclick = () => {
        if (state.page > 1) {
          state.page--;
          renderProductExplorer();
        }
      };

      document.getElementById('nextPageBtn').onclick = () => {
        state.page++;
        renderProductExplorer();
      };

      // Reset button
      document.getElementById('resetAllFiltersBtn').onclick = () => {
        state.level = 'main';
        state.chartMode = 'bar';
        state.filterMinVolume = true;
        state.productSearch = '';
        state.minDiscount = 0;
        state.productSort = 'discountDesc';
        state.page = 1;
        document.getElementById('productSearchInput').value = '';
        document.getElementById('minDiscountFilter').value = '0';
        document.getElementById('sortProductsSelect').value = 'discountDesc';
        document.getElementById('filterMinVolumeCheckbox').checked = true;
        setChartBtnStyles(bBar);
        document.getElementById('levelMainBtn').click();
      };

      // Theme toggle
      document.getElementById('themeToggleBtn').onclick = () => {
        state.isLight = !state.isLight;
        document.documentElement.classList.toggle('light', state.isLight);
        document.getElementById('themeLabel').innerText = state.isLight ? 'Dark Mode' : 'Light Mode';
        renderCategoryPills();
        renderMainChart(calculateCategoryStats());
      };

      // Export CSV
      document.getElementById('exportCsvBtn').onclick = () => {
        const stats = calculateCategoryStats();
        let csv = 'Category,Product_Count,Avg_Discount_Percent,Median_Discount_Percent,Min_Discount,Max_Discount,Avg_Original_Price,Avg_Sale_Price,Avg_Rating\\n';
        stats.forEach(s => {
          csv += \`"\${s.name}",\${s.count},\${s.avg},\${s.median},\${s.min},\${s.max},\${s.origPriceAvg},\${s.salePriceAvg},\${s.ratingAvg}\\n\`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'category_discount_comparison.csv';
        a.click();
        URL.revokeObjectURL(url);
      };
    }

    // Startup
    initSelectedCategories();
    attachListeners();
    updateDashboard();
  </script>
</body>
</html>
`;
}

const html = generateHtml();
const projectHtmlPath = 'C:\\Users\\Administrator\\.gemini\\antigravity\\scratch\\amazon_dashboard\\index.html';
const artifactHtmlPath = 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\63bc404a-1233-4086-9c37-0cc3da938c60\\amazon_discount_dashboard.html';

fs.writeFileSync(projectHtmlPath, html, 'utf8');
console.log('Written to project:', projectHtmlPath, 'size:', (fs.statSync(projectHtmlPath).size / 1024).toFixed(1), 'KB');

fs.writeFileSync(artifactHtmlPath, html, 'utf8');
console.log('Written to artifact:', artifactHtmlPath, 'size:', (fs.statSync(artifactHtmlPath).size / 1024).toFixed(1), 'KB');
