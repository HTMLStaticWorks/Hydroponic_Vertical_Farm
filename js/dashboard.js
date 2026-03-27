/* ============================================================
   HYDROPONIC FARM — Dashboard JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardTabs();
  initDashboardSidebar();
  initCharts();
  initLiveData();
});

/* ── Sidebar Toggle (mobile) ── */
function initDashboardSidebar() {
  const sidebar = document.querySelector('.dash-sidebar');
  const toggleBtn = document.getElementById('dash-sidebar-toggle');
  const overlay = document.getElementById('dash-overlay');

  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
  });
  if (overlay) overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });
}

/* ── Dashboard Tabs ── */
function initDashboardTabs() {
  document.querySelectorAll('.dash-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.dash-tabs-wrapper');
      if (!group) return;
      group.querySelectorAll('.dash-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      group.querySelectorAll('.dash-tab-panel').forEach(p => p.classList.toggle('active', p.id === target));
    });
  });
}

const globalChartInstances = {};

/* ── Charts (Chart.js) ── */
function getChartColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    grid: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
    text: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.55)',
    isDark
  };
}

function updateChartColors() {
  const colors = getChartColors();
  Object.values(globalChartInstances).forEach(chart => {
    if (chart.options.scales) {
      if (chart.options.scales.x) {
        chart.options.scales.x.grid.color = colors.grid;
        chart.options.scales.x.ticks.color = colors.text;
      }
      if (chart.options.scales.y) {
        chart.options.scales.y.grid.color = colors.grid;
        chart.options.scales.y.ticks.color = colors.text;
      }
    }
    if (chart.options.plugins && chart.options.plugins.legend) {
      chart.options.plugins.legend.labels.color = colors.text;
    }
    chart.update();
  });
}

document.addEventListener('themeChanged', updateChartColors);

function initCharts() {
  if (typeof Chart === 'undefined') return;
  const colors = getChartColors();

  // ── Yield Line Chart ──
  const ctxLine = document.getElementById('yield-chart');
  if (ctxLine) {
    globalChartInstances.yield = new Chart(ctxLine, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [
          {
            label: 'Yield (kg)',
            data: [820,940,1050,1180,1380,1520,1620,1700,1820,1940,2100,2280],
            borderColor: '#2d9c6a',
            backgroundColor: 'rgba(45,156,106,0.1)',
            borderWidth: 2.5,
            tension: 0.45,
            fill: true,
            pointBackgroundColor: '#2d9c6a',
            pointRadius: 4,
            pointHoverRadius: 7,
          },
          {
            label: 'Water Used (L)',
            data: [340,380,410,450,490,510,540,520,560,590,620,650],
            borderColor: '#52b788',
            backgroundColor: 'rgba(82,183,136,0.07)',
            borderWidth: 2,
            tension: 0.45,
            fill: true,
            pointBackgroundColor: '#52b788',
            pointRadius: 3,
            pointHoverRadius: 6,
            borderDash: [6,3],
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: colors.text, font: { family: 'Inter', size: 12 } } } },
        scales: {
          x: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { size: 11 } } },
          y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { size: 11 } } }
        }
      }
    });
  }

  // ── Crop Doughnut Chart ──
  const ctxDough = document.getElementById('crop-chart');
  if (ctxDough) {
    globalChartInstances.crop = new Chart(ctxDough, {
      type: 'doughnut',
      data: {
        labels: ['Lettuce','Basil','Spinach','Kale','Herbs'],
        datasets: [{
          data: [35, 22, 18, 15, 10],
          backgroundColor: ['#1e6f4c','#2d9c6a','#52b788','#74c69d','#95d5b2'],
          borderWidth: 0, hoverOffset: 8,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: colors.text, padding: 16, font: { family: 'Inter', size: 11 } }
          }
        }
      }
    });
  }

  // ── Sales Bar Chart ──
  const ctxBar = document.getElementById('sales-chart');
  if (ctxBar) {
    globalChartInstances.sales = new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: ['Q1','Q2','Q3','Q4'],
        datasets: [{
          label: 'Revenue ($K)',
          data: [48, 72, 95, 118],
          backgroundColor: ['rgba(30,111,76,0.8)','rgba(45,156,106,0.8)','rgba(82,183,136,0.8)','rgba(116,198,157,0.8)'],
          borderRadius: 8, borderSkipped: false,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: colors.text } },
          y: { grid: { color: colors.grid }, ticks: { color: colors.text } }
        }
      }
    });
  }
}

/* ── Live Sensor Simulation ── */
function initLiveData() {
  const sensorMap = {
    'sensor-temp':     { base: 22, range: 2, unit: '°C', bar: 'sensor-temp-bar',     max: 40 },
    'sensor-humidity': { base: 68, range: 5, unit: '%',  bar: 'sensor-humidity-bar', max: 100 },
    'sensor-ph':       { base: 6.2, range: 0.2, unit: '', bar: 'sensor-ph-bar',      max: 14, decimals: 1 },
    'sensor-ec':       { base: 1.8, range: 0.2, unit: ' mS/cm', bar: 'sensor-ec-bar', max: 4, decimals: 1 },
    'sensor-co2':      { base: 800, range: 50, unit: ' ppm', bar: 'sensor-co2-bar',  max: 2000 },
    'sensor-light':    { base: 420, range: 30, unit: ' μmol', bar: 'sensor-light-bar', max: 600 },
  };

  function update() {
    Object.entries(sensorMap).forEach(([id, cfg]) => {
      const el = document.getElementById(id);
      if (!el) return;
      const val = (cfg.base + (Math.random() - 0.5) * cfg.range * 2);
      const display = cfg.decimals ? val.toFixed(cfg.decimals) : Math.round(val);
      el.textContent = display + cfg.unit;

      const bar = document.getElementById(cfg.bar);
      if (bar) bar.style.width = Math.min(100, (val / cfg.max) * 100) + '%';
    });
  }

  update();
  setInterval(update, 3000);

  // Update clock
  const clock = document.getElementById('dash-clock');
  if (clock) {
    const tick = () => { clock.textContent = new Date().toLocaleTimeString(); };
    tick(); setInterval(tick, 1000);
  }
}
