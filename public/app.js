// app.js - Trading Sniper Signal Antigravity Edition
let chart = null;
let candleSeries = null;
let currentMarket = 2; // Synthetic boshlanishi uchun
let currentSymbol = "Volatility 75";
let currentTimeframe = 2; // 15m
let isConfluence = false;
let language = "uz";

let balance = 12458.75;
let positions = [];
let signalsLog = [];

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
            background: { color: '#0f172a' },
            textColor: '#94a3b8',
        },
        grid: {
            vertLines: { color: '#1e2937' },
            horzLines: { color: '#1e2937' },
        },
        crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
        timeScale: { timeVisible: true, secondsVisible: false },
    });

    candleSeries = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderUpColor: '#22c55e',
        borderDownColor: '#ef4444',
        wickUpColor: '#86efac',
        wickDownColor: '#f87171',
    });

    // Resize
    new ResizeObserver(() => {
        chart.resize(container.clientWidth, container.clientHeight);
    }).observe(container);
}

function generateMockCandles(count = 180) {
    const data = [];
    let time = Math.floor(Date.now() / 1000) - count * 900;
    let price = currentMarket === 2 ? 1250 : currentMarket === 1 ? 65234 : 1.08745;

    for (let i = 0; i < count; i++) {
        const volatility = currentMarket === 2 ? 8 : currentMarket === 1 ? 120 : 0.008;
        const open = price;
        const change = (Math.random() - 0.48) * volatility;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * volatility * 1.5;
        const low = Math.min(open, close) - Math.random() * volatility * 1.3;

        data.push({
            time: time,
            open: parseFloat(open.toFixed(5)),
            high: parseFloat(high.toFixed(5)),
            low: parseFloat(low.toFixed(5)),
            close: parseFloat(close.toFixed(5))
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

    // Mock signals on chart
    const markers = [];
    const points = [35, 68, 105, 142];
    points.forEach((idx, i) => {
        if (idx >= data.length) return;
        const isBuy = i % 2 === 0;
        markers.push({
            time: data[idx].time,
            position: isBuy ? 'belowBar' : 'aboveBar',
            color: isBuy ? '#22c55e' : '#ef4444',
            shape: isBuy ? 'arrowUp' : 'arrowDown',
            text: isBuy ? "⚡ RAZGON" : "ICT OB",
            size: 4
        });
    });
    candleSeries.setMarkers(markers);
}

function updateSymbols() {
    const container = document.getElementById('symbols-list');
    container.innerHTML = '';
    symbolsByMarket[currentMarket].forEach(sym => {
        const active = sym === currentSymbol ? 'bg-cyan-500 text-black' : 'bg-slate-800 hover:bg-slate-700';
        const btn = document.createElement('button');
        btn.className = `px-5 py-2.5 text-sm font-mono rounded-2xl transition-all ${active}`;
        btn.textContent = sym;
        btn.onclick = () => {
            currentSymbol = sym;
            document.getElementById('current-symbol').textContent = sym;
            renderChart();
        };
        container.appendChild(btn);
    });
}

function switchMarket(index) {
    currentMarket = index;
    document.querySelectorAll('#market-tabs button').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.market) === index);
    });

    currentSymbol = symbolsByMarket[index][0];
    document.getElementById('current-symbol').textContent = currentSymbol;
    updateSymbols();
    renderChart();
    addRandomSignal();
}

function renderStrategies() {
    const container = document.getElementById('strategy-list');
    container.innerHTML = `
        <div class="strategy-item" data-strat="razgon">⚡ Razgon Strategy</div>
        <div class="strategy-item" data-strat="ict">📍 ICT Order Blocks</div>
        <div class="strategy-item" data-strat="ema">📈 EMA 9/21 Cross</div>
        <div class="strategy-item" data-strat="smc">🔺 SMC Harmonics</div>
    `;
}

function addRandomSignal() {
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    const names = ["RAZGON", "ICT FVG", "EMA Cross", "SMC OB", "Bollinger Squeeze"];
    const name = names[Math.floor(Math.random() * names.length)];

    const signal = {
        emoji: type === 'buy' ? '⬆️' : '⬇️',
        name: `${name} ${type.toUpperCase()}`,
        symbol: currentSymbol,
        timeframe: "15m",
        type: type,
        confluence: Math.floor(Math.random() * 30) + 78
    };

    addToLog(signal);

    if (Math.random() > 0.55) {
        takePosition(signal);
    }
}

function addToLog(signal) {
    const container = document.getElementById('signal-log');
    const div = document.createElement('div');
    div.className = `p-3 rounded-2xl flex gap-3 ${signal.type === 'buy' ? 'bg-emerald-900/30' : 'bg-red-900/30'}`;
    div.innerHTML = `
        <div class="text-3xl">${signal.emoji}</div>
        <div class="flex-1 min-w-0">
            <div class="font-semibold text-sm">${signal.name}</div>
            <div class="text-xs text-slate-400">${signal.symbol} • ${signal.timeframe}</div>
            <div class="text-xs mt-1 text-cyan-400">${signal.confluence}% confluence</div>
        </div>
        <div class="text-xs text-slate-500 whitespace-nowrap">${new Date().toLocaleTimeString('uz-UZ', {hour:'2-digit', minute:'2-digit'})}</div>
    `;
    container.prepend(div);

    if (container.children.length > 7) container.removeChild(container.lastChild);
}

function takePosition(signal) {
    const lot = parseFloat(document.getElementById('lot-size').textContent) || 0.15;
    positions.unshift({
        symbol: signal.symbol,
        type: signal.type.toUpperCase(),
        lot: lot,
        pl: (Math.random() * 120 + 20).toFixed(2)
    });
    renderPositions();
}

function renderPositions() {
    const container = document.getElementById('positions-list');
    container.innerHTML = '';
    positions.forEach(pos => {
        const div = document.createElement('div');
        div.className = 'glass rounded-2xl p-4 text-sm';
        div.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="font-mono">${pos.symbol}</span>
                <span class="${pos.type === 'BUY' ? 'text-emerald-400' : 'text-red-400'} font-semibold">${pos.type}</span>
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
    document.getElementById('risk-value').textContent = val;
    const lot = (val / 100 * balance / 80).toFixed(2);
    document.getElementById('lot-size').textContent = lot;
}

function scanMarket() {
    const btn = document.querySelector('button[onclick="scanMarket()"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Skanerlanmoqda...`;

    setTimeout(() => {
        renderChart();
        addRandomSignal();
        addRandomSignal();
        btn.innerHTML = originalText;
    }, 900);
}

function analyzeScreenshot(e) {
    const content = document.getElementById('analysis-content');
    const placeholder = document.getElementById('analysis-placeholder');
    placeholder.classList.add('hidden');
    content.classList.remove('hidden');

    content.innerHTML = `
        <div class="p-6 glass rounded-3xl">
            <div class="flex items-center gap-4">
                <span class="text-5xl">📊</span>
                <div>
                    <div class="font-bold text-lg">High Confluence Signal</div>
                    <div class="text-emerald-400">RAZGON + ICT Order Block</div>
                </div>
            </div>
            <div class="mt-6 text-5xl font-mono text-cyan-400">96%</div>
            <button onclick="fakeTradeFromAnalysis()" 
                class="mt-6 w-full py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-3xl font-bold">
                Trade ochish
            </button>
        </div>
    `;
}

function fakeTradeFromAnalysis() {
    alert("✅ Demo trade ochildi!");
    addRandomSignal();
}

function clearLog
