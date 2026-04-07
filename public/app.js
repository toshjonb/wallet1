// app.js - Trading Sniper Signal Antigravity Edition (Premium Version)
let chart = null;
let candleSeries = null;
let currentMarket = 2;
let currentSymbol = "Volatility 75";
let currentTimeframe = 2;
let isConfluence = false;
let language = "uz";
let balance = 12458.75;
let positions = [];

const symbolsByMarket = {
    0: ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD"],
    1: ["BTCUSDT", "ETHUSDT", "SOLUSDT"],
    2: ["Volatility 75", "Boom 500", "Crash 1000", "Step Index"],
    3: ["AAPL", "TSLA", "NVDA"]
};

function createChart() {
    const container = document.getElementById('chart');
    if (!container) return;

    chart = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: container.clientHeight,
        layout: { 
            background: { color: '#0a0f1c' }, 
            textColor: '#94a3b8' 
        },
        grid: { 
            vertLines: { color: '#1e2937' }, 
            horzLines: { color: '#1e2937' } 
        },
        timeScale: { timeVisible: true },
        crosshair: { mode: LightweightCharts.CrosshairMode.Normal }
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

function generateMockCandles(count = 180) {
    const data = [];
    let time = Math.floor(Date.now() / 1000) - count * 900;
    let price = currentMarket === 2 ? 1250 : currentMarket === 1 ? 65234 : 1.087;

    for (let i = 0; i < count; i++) {
        const open = price;
        const change = (Math.random() - 0.48) * (currentMarket === 2 ? 15 : currentMarket === 1 ? 120 : 0.008);
        const close = open + change;
        data.push({
            time: time,
            open: +open.toFixed(5),
            high: +(Math.max(open, close) + Math.random() * 12).toFixed(5),
            low: +(Math.min(open, close) - Math.random() * 12).toFixed(5),
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

    // Katta neon signallar qo'shish
    addNeonSignalsToChart(data);
}

function addNeonSignalsToChart(data) {
    const markers = [];
    const signalPoints = [38, 75, 112, 148, 165];

    signalPoints.forEach((idx, i) => {
        if (idx >= data.length) return;
        const isBuy = i % 2 === 0;
        const isRazgon = i === 0 || i === 3;

        markers.push({
            time: data[idx].time,
            position: isBuy ? 'belowBar' : 'aboveBar',
            color: isRazgon ? '#ff00ff' : (isBuy ? '#22c55e' : '#ef4444'),
            shape: isBuy ? 'arrowUp' : 'arrowDown',
            text: isRazgon ? "⚡ RAZGON BUY" : (isBuy ? "ICT BUY" : "ICT SELL"),
            size: isRazgon ? 5 : 4
        });
    });

    candleSeries.setMarkers(markers);
}

function switchMarket(index) {
    currentMarket = index;
    document.querySelectorAll('#market-tabs button').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.market) === index);
    });
    currentSymbol = symbolsByMarket[index][0];
    document.getElementById('current-symbol').textContent = currentSymbol;
    renderChart();
    addRandomSignal();
}

function updateSymbols() {
    const container = document.getElementById('symbols-list');
    container.innerHTML = '';
    symbolsByMarket[currentMarket].forEach(sym => {
        const btn = document.createElement('button');
        btn.className = `px-5 py-2.5 text-sm font-mono rounded-2xl transition-all ${sym === currentSymbol ? 'bg-cyan-500 text-black font-semibold' : 'bg-slate-800 hover:bg-slate-700'}`;
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
        <div onclick="toggleStrategy(this)" class="razgon-glow flex items-center justify-between bg-slate-800/70 hover:bg-slate-700 px-5 py-4 rounded-2xl cursor-pointer">
            <div class="flex items-center gap-3"><span class="text-magenta-400 text-xl">⚡</span><span class="font-medium">Razgon Strategy</span></div>
            <span class="text-emerald-400 text-xs font-semibold">ON</span>
        </div>
        <div onclick="toggleStrategy(this)" class="flex items-center justify-between bg-slate-800/70 hover:bg-slate-700 px-5 py-4 rounded-2xl cursor-pointer">
            <div class="flex items-center gap-3"><span class="text-amber-400 text-xl">📍</span><span class="font-medium">ICT Order Blocks</span></div>
            <span class="text-emerald-400 text-xs font-semibold">ON</span>
        </div>
        <div onclick="toggleStrategy(this)" class="flex items-center justify-between bg-slate-800/70 hover:bg-slate-700 px-5 py-4 rounded-2xl cursor-pointer">
            <div class="flex items-center gap-3"><span class="text-blue-400 text-xl">📈</span><span class="font-medium">EMA 9/21 Cross</span></div>
            <span class="text-emerald-400 text-xs font-semibold">ON</span>
        </div>
    `;
}

function toggleStrategy(el) {
    el.classList.toggle('!bg-emerald-900/40');
}

function addRandomSignal() {
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    const names = ["RAZGON", "ICT FVG", "EMA Cross", "SMC OB", "Bollinger Squeeze"];
    const name = names[Math.floor(Math.random() * names.length)];

    const signal = {
        emoji: type === 'buy' ? '⬆️' : '⬇️',
        name: `${name} ${type.toUpperCase()}`,
        symbol: currentSymbol,
        confluence: Math.floor(Math.random() * 20) + 82
    };
    addToLog(signal);
}

function addToLog(signal) {
    const container = document.getElementById('signal-log');
    const div = document.createElement('div');
    div.className = `p-4 rounded-2xl flex gap-3 ${signal.emoji === '⬆️' ? 'bg-emerald-900/30 border-l-4 border-emerald-400' : 'bg-red-900/30 border-l-4 border-red-400'}`;
    div.innerHTML = `
        <div class="text-3xl">${signal.emoji}</div>
        <div class="flex-1">
            <div class="font-semibold text-base">${signal.name}</div>
            <div class="text-xs text-slate-400">${signal.symbol} • 15m</div>
            <div class="text-cyan-400 text-sm mt-1">${signal.confluence}% confluence</div>
        </div>
    `;
    container.prepend(div);
    if (container.children.length > 8) container.removeChild(container.lastChild);
}

function updateRisk(val) {
    document.getElementById('risk-value').textContent = parseFloat(val).toFixed(1);
}

function scanMarket() {
    const btn = document.querySelector('button[onclick="scanMarket()"]');
    const original = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Skanerlanmoqda...`;
    
    setTimeout(() => {
        renderChart();
        addRandomSignal();
        addRandomSignal();
        btn.innerHTML = original;
    }, 1100);
}

function analyzeScreenshot(e) {
    document.getElementById('analysis-placeholder').classList.add('hidden');
    const content = document.getElementById('analysis-content');
    content.classList.remove('hidden');
    content.innerHTML = `
        <div class="p-6 glass rounded-3xl text-center">
            <div class="text-2xl font-bold text-emerald-400">High Confluence Signal</div>
            <div class="text-6xl font-mono text-cyan-400 my-6">96%</div>
            <div class="text-slate-300 mb-4">RAZGON + ICT Order Block</div>
            <button onclick="alert('✅ Demo trade ochildi!'); addRandomSignal()" 
                class="w-full py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-3xl font-bold text-lg">
                Signal bo‘yicha trade ochish
            </button>
        </div>
    `;
}

function clearLog() {
    document.getElementById('signal-log').innerHTML = '';
}

function changeTimeframe(tf) {
    currentTimeframe = tf;
    document.querySelectorAll('#timeframes > div').forEach((el, i) => el.classList.toggle('active', i === tf));
    renderChart();
}

function toggleLanguage() {
    language = language === 'uz' ? 'en' : 'uz';
    document.getElementById('current-lang').textContent = language.toUpperCase();
}

function toggleFullScreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
}

function initializeApp() {
    createChart();
    renderChart();
    updateSymbols();
    renderStrategies();

    document.getElementById('current-symbol').textContent = currentSymbol;
    updateRisk(0.5);

    // Birinchi signallar
    setTimeout(addRandomSignal, 600);
    setTimeout(addRandomSignal, 1300);
    setTimeout(addRandomSignal, 2200);

    // Real-time narx animatsiyasi
    setInterval(() => {
        const priceEl = document.getElementById('current-price');
        let price = parseFloat(priceEl.textContent.replace(',', ''));
        const volatility = currentMarket === 2 ? 6 : currentMarket === 1 ? 45 : 0.0018;
        price += (Math.random() - 0.48) * volatility;
        priceEl.textContent = price.toFixed(currentMarket === 2 ? 3 : 5);
    }, 1800);

    console.log('%c✅ Trading Sniper Signal – Antigravity Edition Premium yuklandi!', 'color:#00f5ff; font-size:16px; font-weight:bold');
}

window.onload = initializeApp;
