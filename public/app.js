// app.js - 4-Bosqich: Confluence Mode + Yaxshilangan Signal Tizimi
let chart = null;
let candleSeries = null;
let currentMarket = 2;
let currentSymbol = "Volatility 75";
let currentTimeframe = 2;
let isConfluence = false;
let language = "uz";
let balance = 12458.75;
let positions = [];
let totalSignals = 0;

const symbolsByMarket = {
    0: ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD"],
    1: ["BTCUSDT", "ETHUSDT", "SOLUSDT"],
    2: ["Volatility 75", "Boom 500", "Crash 1000", "Step Index"],
    3: ["AAPL", "TSLA", "NVDA"]
};

// Strategiyalar va ularning kuchli bozorlari
const strategyRules = {
    "RAZGON": { markets: [2], color: "#ff00ff", emoji: "⚡" },
    "ICT": { markets: [0,1], color: "#fcd34d", emoji: "📍" },
    "EMA": { markets: [0,1,3], color: "#60a5fa", emoji: "📈" },
    "SMC": { markets: [0,1], color: "#c084fc", emoji: "🔺" },
    "BOLLINGER": { markets: [2], color: "#f472b6", emoji: "📉" }
};

function createChart() {
    const container = document.getElementById('chart');
    if (!container) return;

    chart = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: container.clientHeight,
        layout: { background: { color: '#0a0f1c' }, textColor: '#94a3b8' },
        grid: { vertLines: { color: '#1e2937' }, horzLines: { color: '#1e2937' } },
        crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
        timeScale: { timeVisible: true }
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
        const change = (Math.random() - 0.48) * (currentMarket === 2 ? 16 : currentMarket === 1 ? 130 : 0.009);
        const close = open + change;
        data.push({
            time: time,
            open: +open.toFixed(5),
            high: +(Math.max(open, close) + Math.random() * 14).toFixed(5),
            low: +(Math.min(open, close) - Math.random() * 14).toFixed(5),
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
}

function addConfluenceSignalsToChart(data) {
    const markers = [];
    const points = [35, 68, 105, 142, 167];

    points.forEach((idx, i) => {
        if (idx >= data.length) return;
        const isBuy = i % 2 === 0;
        const isRazgon = i === 0 || i === 3;
        const confluenceScore = isRazgon ? 95 : 78 + Math.floor(Math.random() * 15);

        // Confluence mode faol bo‘lsa faqat yuqori balli signallarni ko‘rsatish
        if (isConfluence && confluenceScore < 88) return;

        markers.push({
            time: data[idx].time,
            position: isBuy ? 'belowBar' : 'aboveBar',
            color: isRazgon ? '#ff00ff' : (isBuy ? '#22c55e' : '#ef4444'),
            shape: isBuy ? 'arrowUp' : 'arrowDown',
            text: isRazgon ? "⚡ RAZGON BUY" : (isBuy ? "ICT BUY" : "ICT SELL"),
            size: isRazgon ? 7 : 5
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
        <div onclick="toggleStrategy(this)" class="razgon-glow flex justify-between items-center bg-slate-800/70 hover:bg-slate-700 p-4 rounded-2xl cursor-pointer">
            <div class="flex items-center gap-3"><span class="text-2xl">⚡</span><span>Razgon Strategy</span></div>
            <span class="text-emerald-400 text-xs">ON</span>
        </div>
        <div onclick="toggleStrategy(this)" class="flex justify-between items-center bg-slate-800/70 hover:bg-slate-700 p-4 rounded-2xl cursor-pointer">
            <div class="flex items-center gap-3"><span class="text-2xl">📍</span><span>ICT Order Blocks</span></div>
            <span class="text-emerald-400 text-xs">ON</span>
        </div>
        <div onclick="toggleStrategy(this)" class="flex justify-between items-center bg-slate-800/70 hover:bg-slate-700 p-4 rounded-2xl cursor-pointer">
            <div class="flex items-center gap-3"><span class="text-2xl">📈</span><span>EMA Cross</span></div>
            <span class="text-emerald-400 text-xs">ON</span>
        </div>
    `;
}

function toggleStrategy(el) {
    el.classList.toggle('!bg-emerald-900/40');
}

function toggleConfluence() {
    isConfluence = !isConfluence;
    document.getElementById('confluence-label').innerHTML = isConfluence ? 
        '<span class="text-emerald-400 font-semibold">Confluence ON</span>' : 'Confluence';
    renderChart();
}

function addRandomSignal() {
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    const strategies = ["RAZGON", "ICT FVG", "EMA 9/21", "SMC OB", "Bollinger Squeeze"];
    const name = strategies[Math.floor(Math.random() * strategies.length)];

    const signal = {
        emoji: type === 'buy' ? '⬆️' : '⬇️',
        name: `${name} ${type.toUpperCase()}`,
        symbol: currentSymbol,
        confluence: isConfluence ? Math.floor(Math.random() * 12) + 89 : Math.floor(Math.random() * 25) + 75
    };

    // Confluence rejimida past balli signallarni filtrlash
    if (isConfluence && signal.confluence < 88) return;

    addToLog(signal);
    if (Math.random() > 0.5) takePosition(signal);
}

function addToLog(signal) {
    const container = document.getElementById('signal-log');
    const div = document.createElement('div');
    div.className = `p-4 rounded-2xl flex gap-3 ${signal.emoji === '⬆️' ? 'bg-emerald-900/30 border-l-4 border-emerald-400' : 'bg-red-900/30 border-l-4 border-red-400'}`;
    div.innerHTML = `
        <div class="text-3xl">${signal.emoji}</div>
        <div class="flex-1">
            <div class="font-semibold">${signal.name}</div>
            <div class="text-xs text-slate-400">${signal.symbol} • 15m</div>
            <div class="text-cyan-400 font-medium">${signal.confluence}% confluence</div>
        </div>
    `;
    container.prepend(div);
    if (container.children.length > 8) container.removeChild(container.lastChild);
}

function takePosition(signal) {
    const lot = parseFloat(document.getElementById('lot-size').textContent) || 0.15;
    positions.unshift({
        symbol: signal.symbol,
        type: signal.emoji === '⬆️' ? 'BUY' : 'SELL',
        lot: lot,
        pl: (Math.random() * 280 + 60).toFixed(2)
    });
    renderPositions();
}

function renderPositions() {
    const container = document.getElementById('positions-list');
    container.innerHTML = '';
    positions.forEach(pos => {
        const div = document.createElement('div');
        div.className = 'glass rounded-3xl p-4 text-sm';
        div.innerHTML = `
            <div class="flex justify-between">
                <span class="font-mono">${pos.symbol}</span>
                <span class="${pos.type === 'BUY' ? 'text-emerald-400' : 'text-red-400'}">${pos.type}</span>
            </div>
            <div class="flex justify-between text-xs mt-2 text-slate-400">
                <span>${pos.lot} lot</span>
                <span class="text-emerald-400">+$${pos.pl}</span>
            </div>
        `;
        container.appendChild(div);
    });
}

function updateRisk(val) {
    document.getElementById('risk-value').textContent = parseFloat(val).toFixed(1);
    const lot = (val / 100 * balance / 85).toFixed(2);
    document.getElementById('lot-size').textContent = lot;
}

function scanMarket() {
    const btn = document.querySelector('button[onclick="scanMarket()"]');
    const original = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Skanerlanmoqda...`;
    setTimeout(() => {
        renderChart();
        addRandomSignal();
        addRandomSignal();
        addRandomSignal();
        btn.innerHTML = original;
    }, 1000);
}

function analyzeScreenshot(e) {
    document.getElementById('analysis-placeholder').classList.add('hidden');
    const content = document.getElementById('analysis-content');
    content.classList.remove('hidden');
    content.innerHTML = `
        <div class="p-6 glass rounded-3xl text-center">
            <div class="text-emerald-400 text-2xl font-bold">High Confluence Signal</div>
            <div class="text-6xl font-mono text-cyan-400 my-6">97%</div>
            <div class="text-slate-300 mb-4">RAZGON + ICT + EMA</div>
            <button onclick="fakeTradeFromAnalysis()" class="mt-6 w-full py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-3xl font-bold">
                Trade ochish
            </button>
        </div>
    `;
}

function fakeTradeFromAnalysis() {
    alert("✅ Demo rejimda trade ochildi!");
    addRandomSignal();
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
    updateRisk(1.5);

    setTimeout(addRandomSignal, 600);
    setTimeout(addRandomSignal, 1400);
    setTimeout(addRandomSignal, 2200);

    // Live narx animatsiyasi
    setInterval(() => {
        const priceEl = document.getElementById('current-price');
        let price = parseFloat(priceEl.textContent);
        price += (Math.random() - 0.45) * (currentMarket === 2 ? 8.5 : 0.0022);
        priceEl.textContent = price.toFixed(currentMarket === 2 ? 3 : 5);
    }, 1700);

    console.log('%c4-Bosqich tugadi - Confluence Mode va yaxshilangan signallar qo‘shildi!', 'color:#00f5ff; font-size:15px');
}

window.onload = initializeApp;
