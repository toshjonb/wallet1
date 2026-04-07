<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trading Sniper Signal – Antigravity Edition</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        
        body { font-family: 'Inter', system-ui, sans-serif; }
        .title-font { font-family: 'Space Grotesk', sans-serif; }

        .glass {
            background: rgba(15, 23, 42, 0.75);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(148, 163, 184, 0.15);
        }

        .razgon-glow {
            box-shadow: 0 0 25px #ff00ff, 0 0 40px rgba(255, 0, 255, 0.4);
            animation: razgonPulse 2s infinite alternate;
        }

        @keyframes razgonPulse {
            from { box-shadow: 0 0 20px #ff00ff; }
            to { box-shadow: 0 0 35px #ff00ff, 0 0 55px rgba(255, 0, 255, 0.6); }
        }

        .neon-cyan { text-shadow: 0 0 15px #00f5ff; }
        .chart-container { position: relative; }
    </style>
</head>
<body class="bg-zinc-950 text-slate-200 min-h-screen overflow-hidden">

<div class="flex h-screen">

    <!-- Sidebar -->
    <div class="w-72 bg-zinc-900 border-r border-slate-800 flex flex-col">
        <div class="p-6 border-b border-slate-800">
            <h1 class="title-font text-3xl font-bold tracking-tighter neon-cyan">SNIPER</h1>
            <p class="text-xs text-slate-500 mt-1">ANTIGRAVITY EDITION</p>
        </div>

        <!-- Market Tabs -->
        <div class="p-4">
            <div id="market-tabs" class="grid grid-cols-4 gap-2">
                <button onclick="switchMarket(0)" data-market="0" class="market-tab py-3 text-sm font-medium rounded-2xl transition-all active">Forex</button>
                <button onclick="switchMarket(1)" data-market="1" class="market-tab py-3 text-sm font-medium rounded-2xl transition-all">Crypto</button>
                <button onclick="switchMarket(2)" data-market="2" class="market-tab py-3 text-sm font-medium rounded-2xl transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white">Synthetic</button>
                <button onclick="switchMarket(3)" data-market="3" class="market-tab py-3 text-sm font-medium rounded-2xl transition-all">Aksiyalar</button>
            </div>
        </div>

        <!-- Symbols -->
        <div class="px-4">
            <div class="text-xs text-slate-400 mb-2 px-2">SYMBOLS</div>
            <div id="symbols-list" class="flex flex-wrap gap-2"></div>
        </div>

        <!-- Strategies -->
        <div class="mt-6 px-4">
            <div class="flex justify-between items-center mb-3 px-2">
                <div class="text-xs text-slate-400">STRATEGIES</div>
                <button onclick="toggleConfluence()" id="confluence-btn"
                        class="text-xs px-4 py-1 rounded-full bg-emerald-900/50 hover:bg-emerald-900 transition-all">
                    <span id="confluence-label">Confluence OFF</span>
                </button>
            </div>
            <div id="strategy-list" class="space-y-2"></div>
        </div>

        <!-- Language -->
        <div class="mt-auto p-4 border-t border-slate-800">
            <button onclick="toggleLanguage()" 
                    class="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-sm">
                <i class="fas fa-globe"></i>
                <span id="current-lang">UZ</span>
            </button>
        </div>
    </div>

    <!-- Main Chart Area -->
    <div class="flex-1 flex flex-col">
        <!-- Top Bar -->
        <div class="h-14 border-b border-slate-800 bg-zinc-900/80 backdrop-blur-md flex items-center px-6 justify-between">
            <div class="flex items-center gap-6">
                <div class="flex items-center gap-3">
                    <span id="current-symbol" class="font-mono text-2xl font-semibold text-white"></span>
                    <span id="current-price" class="font-mono text-3xl font-bold text-emerald-400">1248.65</span>
                </div>
                <div id="timeframes" class="flex gap-1 text-sm">
                    <div onclick="changeTimeframe(0)" class="timeframe-btn px-4 py-1.5 rounded-xl cursor-pointer hover:bg-slate-800">M1</div>
                    <div onclick="changeTimeframe(1)" class="timeframe-btn px-4 py-1.5 rounded-xl cursor-pointer hover:bg-slate-800">M5</div>
                    <div onclick="changeTimeframe(2)" class="timeframe-btn px-4 py-1.5 rounded-xl cursor-pointer bg-slate-700">M15</div>
                    <div onclick="changeTimeframe(3)" class="timeframe-btn px-4 py-1.5 rounded-xl cursor-pointer hover:bg-slate-800">H1</div>
                    <div onclick="changeTimeframe(4)" class="timeframe-btn px-4 py-1.5 rounded-xl cursor-pointer hover:bg-slate-800">H4</div>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <button onclick="scanMarket()" 
                        class="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-2 rounded-2xl font-semibold text-sm transition-all">
                    <i class="fas fa-bolt"></i>
                    <span>SCAN MARKET</span>
                </button>
                <button onclick="toggleFullScreen()" class="p-3 hover:bg-slate-800 rounded-2xl">
                    <i class="fas fa-expand"></i>
                </button>
            </div>
        </div>

        <!-- Chart -->
        <div class="flex-1 chart-container p-4" id="chart-container">
            <div id="chart" class="w-full h-full rounded-3xl overflow-hidden border border-slate-700"></div>
        </div>

        <!-- Bottom Signal Log -->
        <div class="h-56 border-t border-slate-800 bg-zinc-900/95 p-4">
            <div class="flex justify-between items-center mb-3">
                <div class="font-semibold flex items-center gap-2">
                    <i class="fas fa-list"></i> SIGNAL LOG
                </div>
                <button onclick="clearLog()" class="text-xs text-slate-400 hover:text-red-400">Tozalash</button>
            </div>
            <div id="signal-log" class="grid grid-cols-3 gap-3 overflow-auto h-full text-sm"></div>
        </div>
    </div>

    <!-- Right Panel: Demo Account -->
    <div class="w-80 bg-zinc-900 border-l border-slate-800 flex flex-col">
        <div class="p-6 border-b border-slate-800">
            <div class="text-xs text-slate-400 mb-1">DEMO ACCOUNT</div>
            <div class="flex justify-between items-end">
                <div>
                    <div class="text-3xl font-bold font-mono" id="balance">$12,458.75</div>
                    <div class="text-emerald-400 text-sm flex items-center gap-1">
                        <span id="equity">$12,487.30</span>
                        <span class="text-xs text-slate-500">(+0.23%)</span>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-xs text-slate-400">Open P/L</div>
                    <div id="total-pl" class="text-2xl font-bold text-emerald-400">+$28.55</div>
                </div>
            </div>
        </div>

        <!-- Risk Management -->
        <div class="p-6 border-b border-slate-800">
            <div class="flex justify-between text-xs mb-3">
                <span class="text-slate-400">Risk % per trade</span>
                <span id="risk-value" class="font-mono font-semibold">1.5</span>
            </div>
            <input type="range" min="0.1" max="5" step="0.1" value="1.5" 
                   oninput="updateRisk(this.value)" 
                   class="w-full accent-cyan-500">
            
            <div class="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                    <div class="text-slate-400 text-xs">Lot Size</div>
                    <div id="lot-size" class="font-mono text-2xl font-bold">0.18</div>
                </div>
                <div>
                    <div class="text-slate-400 text-xs">Est. Risk</div>
                    <div id="est-risk" class="font-mono text-2xl font-bold text-amber-400">$186.88</div>
                </div>
            </div>
        </div>

        <!-- Open Positions -->
        <div class="flex-1 flex flex-col min-h-0">
            <div class="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-zinc-950">
                <div class="font-semibold">Open Positions</div>
                <div id="positions-count" class="text-xs bg-slate-800 px-3 py-1 rounded-full">0</div>
            </div>
            <div id="positions-list" class="flex-1 overflow-auto p-4 space-y-3"></div>
        </div>

        <!-- Quick Actions -->
        <div class="p-4 border-t border-slate-800">
            <button onclick="closeAllPositions()" 
                    class="w-full py-4 bg-red-600/80 hover:bg-red-700 rounded-3xl font-bold text-sm transition-all">
                BARCHA POZITSIYALARNI YOPISH
            </button>
        </div>
    </div>
</div>

<script>
// ==================== 5-BOSQICH: TO‘LIQ DEMO HISOB + EQUITY + RISK ====================

let chart = null;
let candleSeries = null;
let currentMarket = 2;
let currentSymbol = "Volatility 75";
let currentTimeframe = 2;
let isConfluence = false;
let language = "uz";

let balance = 12458.75;
let equity = 12487.30;
let positions = [];
let totalSignals = 0;

const symbolsByMarket = {
    0: ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD"],
    1: ["BTCUSDT", "ETHUSDT", "SOLUSDT"],
    2: ["Volatility 75", "Boom 500", "Crash 1000", "Step Index"],
    3: ["AAPL", "TSLA", "NVDA"]
};

const strategyRules = {
    "RAZGON": { markets: [2], color: "#ff00ff", emoji: "⚡" },
    "ICT": { markets: [0,1], color: "#fcd34d", emoji: "📍" },
    "EMA": { markets: [0,1,3], color: "#60a5fa", emoji: "📈" },
    "SMC": { markets: [0,1], color: "#c084fc", emoji: "🔺" },
    "BOLLINGER": { markets: [2], color: "#f472b6", emoji: "📉" }
};

function createChart() {
    const container = document.getElementById('chart');
    if (chart) chart.remove();
    
    chart = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: container.clientHeight,
        layout: { background: { color: '#0a0f1c' }, textColor: '#94a3b8' },
        grid: { vertLines: { color: '#1e2937' }, horzLines: { color: '#1e2937' } },
        crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
        timeScale: { timeVisible: true, borderColor: '#334155' }
    });

    candleSeries = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderUpColor: '#22c55e',
        borderDownColor: '#ef4444',
        wickUpColor: '#86efac',
        wickDownColor: '#f87171'
    });
}

function generateMockCandles(count = 200) {
    const data = [];
    let time = Math.floor(Date.now() / 1000) - count * 900;
    let price = currentMarket === 2 ? 1248.65 : currentMarket === 1 ? 65234 : 1.0874;

    for (let i = 0; i < count; i++) {
        const open = price;
        const volatility = currentMarket === 2 ? 18 : currentMarket === 1 ? 180 : 0.008;
        const change = (Math.random() - 0.47) * volatility;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * (volatility * 1.2);
        const low = Math.min(open, close) - Math.random() * (volatility * 1.2);

        data.push({
            time: time,
            open: +open.toFixed(5),
            high: +high.toFixed(5),
            low: +low.toFixed(5),
            close: +close.toFixed(5)
        });
        price = close;
        time += 900;
    }
    return data;
}

function renderChart() {
    if (!candleSeries) return;
    const data = generateMockCandles();
    candleSeries.setData(data);
    chart.timeScale().fitContent();
    addConfluenceSignalsToChart(data);
    updateLivePrice();
}

function addConfluenceSignalsToChart(data) {
    const markers = [];
    const points = [42, 78, 115, 148, 172];

    points.forEach((idx, i) => {
        if (idx >= data.length) return;
        const isBuy = i % 2 === 0;
        const isRazgon = i === 0 || i === 3;
        const confluenceScore = isRazgon ? 96 : 82 + Math.floor(Math.random() * 12);

        if (isConfluence && confluenceScore < 88) return;

        markers.push({
            time: data[idx].time,
            position: isBuy ? 'belowBar' : 'aboveBar',
            color: isRazgon ? '#ff00ff' : (isBuy ? '#22c55e' : '#ef4444'),
            shape: isBuy ? 'arrowUp' : 'arrowDown',
            text: isRazgon ? "⚡ RAZGON" : (isBuy ? "ICT BUY" : "ICT SELL"),
            size: isRazgon ? 8 : 5
        });
    });

    candleSeries.setMarkers(markers);
}

function updateLivePrice() {
    const priceEl = document.getElementById('current-price');
    let basePrice = currentMarket === 2 ? 1248.65 : currentMarket === 1 ? 65234 : 1.0874;
    
    setInterval(() => {
        const change = (Math.random() - 0.48) * (currentMarket === 2 ? 12 : currentMarket === 1 ? 45 : 0.003);
        basePrice += change;
        priceEl.textContent = basePrice.toFixed(currentMarket === 2 ? 2 : currentMarket === 1 ? 0 : 5);
        
        // Equity ni ham ozgina o‘zgartirish
        equity += change * 0.8;
        document.getElementById('equity').textContent = '$' + equity.toFixed(2);
    }, 2300);
}

function switchMarket(index) {
    currentMarket = index;
    document.querySelectorAll('#market-tabs button').forEach(btn => {
        btn.classList.toggle('bg-gradient-to-r', parseInt(btn.dataset.market) === index);
        btn.classList.toggle('from-purple-600', parseInt(btn.dataset.market) === index);
        btn.classList.toggle('to-pink-600', parseInt(btn.dataset.market) === index);
        btn.classList.toggle('text-white', parseInt(btn.dataset.market) === index);
    });
    
    currentSymbol = symbolsByMarket[index][0];
    document.getElementById('current-symbol').textContent = currentSymbol;
    renderChart();
    updateSymbols();
}

function updateSymbols() {
    const container = document.getElementById('symbols-list');
    container.innerHTML = '';
    symbolsByMarket[currentMarket].forEach(sym => {
        const btn = document.createElement('button');
        btn.className = `px-5 py-2 text-sm font-mono rounded-2xl transition-all ${sym === currentSymbol ? 'bg-cyan-500 text-black font-semibold shadow-lg' : 'bg-slate-800 hover:bg-slate-700'}`;
        btn.textContent = sym;
        btn.onclick = () => {
            currentSymbol = sym;
            document.getElementById('current-symbol').textContent = sym;
            renderChart();
        };
        container.appendChild(btn);
    });
}

function renderStrategies() {
    const container = document.getElementById('strategy-list');
    container.innerHTML = `
        <div onclick="toggleStrategy(this)" class="razgon-glow flex justify-between items-center bg-slate-800/70 hover:bg-slate-700 p-4 rounded-3xl cursor-pointer border border-purple-500/30">
            <div class="flex items-center gap-3"><span class="text-3xl">⚡</span><span class="font-semibold">Razgon Strategy</span></div>
            <span class="text-emerald-400 text-xs font-bold">ACTIVE</span>
        </div>
        <div onclick="toggleStrategy(this)" class="flex justify-between items-center bg-slate-800/70 hover:bg-slate-700 p-4 rounded-3xl cursor-pointer">
            <div class="flex items-center gap-3"><span class="text-3xl">📍</span><span>ICT Order Blocks</span></div>
            <span class="text-emerald-400 text-xs">ON</span>
        </div>
        <div onclick="toggleStrategy(this)" class="flex justify-between items-center bg-slate-800/70 hover:bg-slate-700 p-4 rounded-3xl cursor-pointer">
            <div class="flex items-center gap-3"><span class="text-3xl">📈</span><span>EMA Cross</span></div>
            <span class="text-emerald-400 text-xs">ON</span>
        </div>
    `;
}

function toggleStrategy(el) {
    el.classList.toggle('!bg-emerald-900/40');
    el.classList.toggle('border-emerald-400');
}

function toggleConfluence() {
    isConfluence = !isConfluence;
    const label = document.getElementById('confluence-label');
    label.textContent = isConfluence ? "Confluence ON" : "Confluence OFF";
    label.parentElement.classList.toggle('bg-emerald-600', isConfluence);
    renderChart();
}

function addRandomSignal() {
    const isBuy = Math.random() > 0.5;
    const strategies = ["RAZGON", "ICT FVG", "EMA 9/21", "SMC OB", "Bollinger Squeeze"];
    const name = strategies[Math.floor(Math.random() * strategies.length)];

    const signal = {
        emoji: isBuy ? '⬆️' : '⬇️',
        name: `${name} ${isBuy ? 'BUY' : 'SELL'}`,
        symbol: currentSymbol,
        confluence: isConfluence ? Math.floor(Math.random() * 8) + 92 : Math.floor(Math.random() * 22) + 76
    };

    if (isConfluence && signal.confluence < 88) return;

    addToLog(signal);
    if (Math.random() > 0.4) takePosition(signal);
}

function addToLog(signal) {
    const container = document.getElementById('signal-log');
    const div = document.createElement('div');
    div.className = `p-4 rounded-3xl flex gap-3 transition-all hover:scale-[1.02] ${signal.emoji === '⬆️' ? 'bg-emerald-900/30 border-l-4 border-emerald-400' : 'bg-red-900/30 border-l-4 border-red-400'}`;
    div.innerHTML = `
        <div class="text-4xl flex-shrink-0">${signal.emoji}</div>
        <div class="flex-1 min-w-0">
            <div class="font-semibold text-base">${signal.name}</div>
            <div class="text-xs text-slate-400">${signal.symbol} • M15</div>
            <div class="text-cyan-400 font-medium">${signal.confluence}% confluence</div>
        </div>
    `;
    container.prepend(div);
    if (container.children.length > 9) container.removeChild(container.lastChild);
}

function takePosition(signal) {
    const riskPercent = parseFloat(document.getElementById('risk-value').textContent);
    const lot = parseFloat(document.getElementById('lot-size').textContent);
    
    const entryPrice = parseFloat(document.getElementById('current-price').textContent);
    const pl = (Math.random() * 420 - 80).toFixed(2); // realistik P/L

    positions.unshift({
        id: Date.now(),
        symbol: signal.symbol,
        type: signal.emoji === '⬆️' ? 'BUY' : 'SELL',
        lot: lot,
        entry: entryPrice.toFixed(5),
        pl: parseFloat(pl),
        time: new Date().toLocaleTimeString('uz-UZ', {hour:'2-digit', minute:'2-digit'})
    });

    renderPositions();
    updateEquity();
}

function renderPositions() {
    const container = document.getElementById('positions-list');
    container.innerHTML = '';

    if (positions.length === 0) {
        container.innerHTML = `<div class="text-center text-slate-500 py-10">Hozircha ochiq pozitsiya yo‘q</div>`;
        document.getElementById('positions-count').textContent = '0';
        return;
    }

    positions.forEach((pos, index) => {
        const isProfit = pos.pl > 0;
        const div = document.createElement('div');
        div.className = `glass rounded-3xl p-5 text-sm transition-all hover:ring-1 hover:ring-cyan-400`;
        div.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <span class="font-mono font-semibold">${pos.symbol}</span>
                    <span class="${pos.type === 'BUY' ? 'text-emerald-400' : 'text-red-400'} ml-3 font-bold">${pos.type}</span>
                </div>
                <button onclick="closePosition(${index})" class="text-xs text-red-400 hover:text-red-500">✕</button>
            </div>
            <div class="flex justify-between mt-4 text-xs">
                <div class="text-slate-400">${pos.lot} lot • ${pos.time}</div>
                <div class="${isProfit ? 'text-emerald-400' : 'text-red-400'} font-mono font-bold">
                    ${isProfit ? '+' : ''}$${pos.pl}
                </div>
            </div>
        `;
        container.appendChild(div);
    });

    document.getElementById('positions-count').textContent = positions.length;
}

function closePosition(index) {
    if (confirm("Bu pozitsiyani yopishni xohlaysizmi?")) {
        const closed = positions.splice(index, 1)[0];
        balance += closed.pl;
        document.getElementById('balance').textContent = '$' + balance.toFixed(2);
        renderPositions();
        updateEquity();
    }
}

function closeAllPositions() {
    if (positions.length === 0) return;
    if (confirm("Barcha pozitsiyalarni yopishni tasdiqlaysizmi?")) {
        let totalProfit = 0;
        positions.forEach(p => totalProfit += p.pl);
        balance += totalProfit;
        document.getElementById('balance').textContent = '$' + balance.toFixed(2);
        positions = [];
        renderPositions();
        updateEquity();
    }
}

function updateEquity() {
    let openPL = positions.reduce((sum, pos) => sum + pos.pl, 0);
    equity = balance + openPL;
    document.getElementById('equity').textContent = '$' + equity.toFixed(2);
    document.getElementById('total-pl').textContent = (openPL >= 0 ? '+' : '') + '$' + openPL.toFixed(2);
    document.getElementById('total-pl').className = openPL >= 0 ? 'text-2xl font-bold text-emerald-400' : 'text-2xl font-bold text-red-400';
}

function updateRisk(val) {
    document.getElementById('risk-value').textContent = parseFloat(val).toFixed(1);
    
    const riskAmount = balance * (parseFloat(val) / 100);
    const lot = (riskAmount / 85).toFixed(2); // taxminiy 1 lot uchun $85 risk
    
    document.getElementById('lot-size').textContent = lot;
    document.getElementById('est-risk').textContent = '$' + riskAmount.toFixed(2);
}

function scanMarket() {
    const btn = document.querySelector('button[onclick="scanMarket()"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> SKANERLANMOQDA...`;
    btn.disabled = true;

    setTimeout(() => {
        renderChart();
        addRandomSignal();
        addRandomSignal();
        addRandomSignal();
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1200);
}

function analyzeScreenshot() {
    // 6-bosqichda to‘liqroq qilinadi
    alert("🧠 Neural Vision Analyzer ishga tushdi!\n\nHozircha mock natija:\n\nRAZGON + ICT confluence 94% — BUY signal aniqlandi.");
}

function clearLog() {
    document.getElementById('signal-log').innerHTML = '';
}

function changeTimeframe(tf) {
    currentTimeframe = tf;
    document.querySelectorAll('.timeframe-btn').forEach((el, i) => {
        el.classList.toggle('bg-slate-700', i === tf);
    });
    renderChart();
}

function toggleLanguage() {
    language = language === 'uz' ? 'en' : 'uz';
    document.getElementById('current-lang').textContent = language.toUpperCase();
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function initializeApp() {
    createChart();
    renderChart();
    updateSymbols();
    renderStrategies();

    document.getElementById('current-symbol').textContent = currentSymbol;
    updateRisk(1.5);
    renderPositions();

    // Initial signals
    setTimeout(() => addRandomSignal(), 800);
    setTimeout(() => addRandomSignal(), 1600);
    setTimeout(() => addRandomSignal(), 2400);

    console.log('%c5-BOSQICH TUGADI — To‘liq Demo Hisob, Equity, Risk Management va Real hisob-kitob qo‘shildi!', 'color:#00ffaa; font-size:16px; font-weight:bold');
}

window.onload = initializeApp;
</script>
</body>
</html>
