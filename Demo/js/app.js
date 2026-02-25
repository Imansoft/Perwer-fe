/**
 * Perwer Dashboard Main App
 */

let allSites = [];
let currentSite = null;
let currentScreen = 'fleet';

// Initialize app
async function initApp() {
  try {
    // Load mock data
    const response = await fetch('./data/sites.json');
    const data = await response.json();
    allSites = data.sites;
    
    // Generate alerts for all sites
    allSites.forEach(site => {
      site.alerts = generateAlerts(site);
    });
    
    // Initialize navigation tabs
    updateNavigationTabs();
    
    // Render initial screen
    renderFleetOverview();
    updateLastUpdated();
  } catch (error) {
    console.error('Failed to load data:', error);
  }
}

// ===== SCREEN NAVIGATION =====
function switchScreen(screenName) {
  currentScreen = screenName;
  
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show selected screen
  const screenEl = document.getElementById(`screen-${screenName}`);
  if (screenEl) {
    screenEl.classList.add('active');
  }
  
  // Update navigation tabs
  updateNavigationTabs();
  
  // Render appropriate screen
  if (screenName === 'fleet') {
    renderFleetOverview();
  } else if (screenName === 'insights' && currentSite) {
    renderInsights();
  }
}

function updateNavigationTabs() {
  const nav = document.querySelector('nav');
  let tabsHTML = '';
  
  // Fleet Overview tab - always show
  tabsHTML += `<button class="${currentScreen === 'fleet' ? 'active' : ''}" onclick="switchScreen('fleet')">Fleet Overview</button>`;
  
  // Site Detail tab - show when on detail or insights
  if (currentScreen === 'detail' || currentScreen === 'insights') {
    tabsHTML += `<button class="${currentScreen === 'detail' ? 'active' : ''}" onclick="currentSite ? switchScreen('detail') : alert('Select a site first')">Site Detail</button>`;
  }
  
  // Insights tab - show only when on insights
  if (currentScreen === 'insights') {
    tabsHTML += `<button class="${currentScreen === 'insights' ? 'active' : ''}" onclick="currentSite ? switchScreen('insights') : alert('Select a site first')">Insights</button>`;
  }
  
  nav.innerHTML = tabsHTML;
}

// ===== SCREEN 1: FLEET OVERVIEW =====
function renderFleetOverview() {
  const container = document.getElementById('fleet-overview-content');
  
  // Render KPI bar
  const kpis = getKPICounts(allSites);
  let kpiHTML = '<div class="kpi-bar">';
  
  kpiHTML += `
    <div class="kpi-card">
      <div class="kpi-value">${kpis.total}</div>
      <div class="kpi-label">Total Sites</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value">${kpis.healthy}</div>
      <div class="kpi-label">Healthy Sites</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value">${kpis.atRisk}</div>
      <div class="kpi-label">At-Risk Sites</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value">${kpis.critical}</div>
      <div class="kpi-label">Critical Sites</div>
    </div>
  `;
  
  kpiHTML += '</div>';
  
  // Render controls
  kpiHTML += `
    <div class="controls">
      <input 
        type="text" 
        class="search-box" 
        placeholder="Search by site name or location..."
        onkeyup="filterFleetOverview()"
      >
      <div class="filter-buttons">
        <button class="filter-btn active" onclick="filterByStatus('all')">All Sites</button>
        <button class="filter-btn" onclick="filterByStatus('healthy')">Healthy</button>
        <button class="filter-btn" onclick="filterByStatus('at risk')">At Risk</button>
        <button class="filter-btn" onclick="filterByStatus('critical')">Critical</button>
      </div>
    </div>
  `;
  
  // Render site cards
  kpiHTML += '<div class="sites-grid" id="sites-grid">';
  allSites.forEach(site => {
    kpiHTML += renderSiteCard(site);
  });
  kpiHTML += '</div>';
  
  container.innerHTML = kpiHTML;
}

function renderSiteCard(site) {
  const healthScore = calculateHealthScore(site);
  const status = getStatus(healthScore);
  const statusClass = getStatusClass(healthScore);
  const statusDot = getStatusDot(healthScore);
  const hasAlerts = site.alerts && site.alerts.length > 0;
  
  return `
    <div class="site-card" onclick="openSiteDetail('${site.id}')">
      <div class="site-header">
        <div>
          <div class="site-name">${site.name}</div>
          <div class="site-location">${site.location}</div>
        </div>
        <div class="status-badge ${statusClass}">
          <span class="status-dot" style="background-color: ${statusDot}"></span>
          ${status}
        </div>
      </div>
      <div class="site-type">${site.type}</div>
      
      <div class="health-bar-container">
        <div class="health-label">
          <span>Health Score</span>
          <span>${healthScore}%</span>
        </div>
        <div class="health-bar">
          <div class="health-bar-fill health-fill-${statusClass.replace('status-', '')}" style="width: ${healthScore}%"></div>
        </div>
      </div>
      
      <div class="alert-indicator ${hasAlerts ? 'has-alerts' : ''}">
        ${hasAlerts ? `⚠️ ${site.alerts.length} Alert${site.alerts.length > 1 ? 's' : ''}` : '✓ No alerts'}
      </div>
    </div>
  `;
}

function filterByStatus(status) {
  // Get the text content of the clicked button
  const statusText = event.target.textContent.toLowerCase();
  const normalizedStatus = statusText === 'all sites' ? 'all' : statusText;
  
  // Update button states
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Clear search box when filtering
  const searchBox = document.querySelector('.search-box');
  if (searchBox) {
    searchBox.value = '';
  }
  
  // Update grid
  filterFleetOverview();
}

function filterFleetOverview() {
  const searchQuery = document.querySelector('.search-box').value;
  const activeFilter = document.querySelector('.filter-btn.active');
  let statusFilter = 'all';
  
  if (activeFilter) {
    const filterText = activeFilter.textContent.toLowerCase();
    statusFilter = filterText === 'all sites' ? 'all' : filterText;
  }
  
  // Apply filters
  let filtered = searchQuery ? searchSites(allSites, searchQuery) : allSites;
  filtered = filterSitesByStatus(filtered, statusFilter);
  
  // Update grid
  const grid = document.getElementById('sites-grid');
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state">No sites match your criteria</div>';
  } else {
    grid.innerHTML = filtered.map(site => renderSiteCard(site)).join('');
  }
}

// ===== SCREEN 2: SITE DETAIL =====
function openSiteDetail(siteId) {
  currentSite = allSites.find(s => s.id === siteId);
  if (currentSite) {
    renderSiteDetail();
    switchScreen('detail');
  }
}

function renderSiteDetail() {
  const container = document.getElementById('site-detail-content');
  const healthScore = calculateHealthScore(currentSite);
  const status = getStatus(healthScore);
  const statusClass = getStatusClass(healthScore);
  const statusDot = getStatusDot(healthScore);
  
  let html = `
    <div class="site-detail-header">
      <div class="site-detail-info">
        <h1>${currentSite.name}</h1>
        <p>${currentSite.location} • ${currentSite.type}</p>
      </div>
      <button class="back-btn" onclick="switchScreen('fleet')">← Back to Fleet</button>
    </div>
    
    <div class="detail-health-display" style="margin-bottom: 2rem;">
      <div class="detail-health-score" style="color: ${statusDot};">${healthScore}%</div>
      <div>
        <div style="font-size: 1.1rem; color: ${statusDot};">${status}</div>
        <div style="color: var(--text-secondary); font-size: 0.9rem;">Health Score</div>
      </div>
    </div>
  `;
  
  // Asset cards
  html += '<div class="asset-cards">';
  
  // Solar card
  html += `
    <div class="asset-card">
      <div class="asset-title">☀️ Solar System</div>
      <div class="asset-item">
        <span class="asset-label">Panels</span>
        <span class="asset-value">${currentSite.solarPanels}</span>
      </div>
      <div class="asset-item">
        <span class="asset-label">Output</span>
        <span class="asset-value">${currentSite.solarOutput} kW</span>
      </div>
      <div class="asset-item">
        <span class="asset-label">Status</span>
        <span class="asset-status ${currentSite.solarOn ? 'status-on' : 'status-off'}">
          ${currentSite.solarOn ? 'ON' : 'OFF'}
        </span>
      </div>
    </div>
  `;
  
  // Battery card
  const daysToFailure = calculateDaysToFailure(currentSite.batteryHealth);
  html += `
    <div class="asset-card">
      <div class="asset-title">🔋 Battery</div>
      <div class="asset-item">
        <span class="asset-label">Count</span>
        <span class="asset-value">${currentSite.batteryCount}</span>
      </div>
      <div class="asset-item">
        <span class="asset-label">Charge Level</span>
        <span class="asset-value">${currentSite.batteryCharge}%</span>
      </div>
      <div class="asset-item">
        <span class="asset-label">Health</span>
        <span class="asset-value">${currentSite.batteryHealth}%</span>
      </div>
      ${daysToFailure ? `
        <div class="asset-item">
          <span class="asset-label">Est. Failure</span>
          <span class="asset-value" style="color: var(--warning);">${daysToFailure} days</span>
        </div>
      ` : ''}
    </div>
  `;
  
  // Generator card
  html += `
    <div class="asset-card">
      <div class="asset-title">⚙️ Generator</div>
      <div class="asset-item">
        <span class="asset-label">Status</span>
        <span class="asset-status ${currentSite.generatorOn ? 'status-on' : 'status-off'}">
          ${currentSite.generatorOn ? 'ON' : 'OFF'}
        </span>
      </div>
      <div class="asset-item">
        <span class="asset-label">Diesel Level</span>
        <span class="asset-value">${currentSite.dieselLevel}%</span>
      </div>
      <div class="asset-item">
        <span class="asset-label">Runtime Today</span>
        <span class="asset-value">${currentSite.runtimeToday} hrs</span>
      </div>
    </div>
  `;
  
  html += '</div>';
  
  // Alerts panel
  html += renderAlertsPanel();
  
  container.innerHTML = html;
}

function renderAlertsPanel() {
  let html = `
    <div class="alerts-panel">
      <h3 class="alerts-title">⚠️ Alerts</h3>
  `;
  
  if (!currentSite.alerts || currentSite.alerts.length === 0) {
    html += `<div class="no-alerts"><div class="no-alerts-success">✓ No active alerts</div></div>`;
  } else {
    html += '<div class="alerts-list">';
    currentSite.alerts.forEach(alert => {
      html += `
        <div class="alert-item alert-${alert.severity}">
          <div class="alert-header">
            <strong class="alert-message">${alert.message}</strong>
            <span class="alert-severity severity-${alert.severity}">${alert.severity}</span>
          </div>
          <div class="alert-time">${alert.timestamp}</div>
        </div>
      `;
    });
    html += '</div>';
  }
  
  html += '</div>';
  return html;
}

// ===== SCREEN 3: INSIGHTS =====
function renderInsights() {
  const container = document.getElementById('insights-content');
  const { insights, recommendations } = generateInsights(currentSite);
  const events = generateEventLog(currentSite);
  
  let html = `
    <div style="margin-bottom: 2rem;">
      <button class="back-btn" onclick="switchScreen('detail')">← Back to Site Detail</button>
    </div>
  `;
  
  html += '<div class="insights-grid">';
  
  // Executive Summary
  html += `
    <div class="insights-section">
      <h3 class="section-title">📊 Executive Summary</h3>
      <div>
  `;
  insights.forEach(insight => {
    html += `<p class="summary-text">• ${insight}</p>`;
  });
  html += '</div></div>';
  
  // AI Recommendations
  html += `
    <div class="insights-section">
      <h3 class="section-title">💡 AI Recommendations</h3>
  `;
  
  if (recommendations.length === 0) {
    html += `<div class="no-recommendations"><div class="no-recommendations-success">✓ System operating optimally</div></div>`;
  } else {
    html += '<div class="recommendations-list">';
    recommendations.forEach(rec => {
      html += `
        <div class="recommendation-item">
          <div class="rec-header">
            <span class="rec-title">${rec.title}</span>
            <span class="rec-priority priority-${rec.priority}">${rec.priority} Priority</span>
          </div>
          <p class="rec-description">${rec.description}</p>
        </div>
      `;
    });
    html += '</div>';
  }
  
  html += '</div>';
  
  // Event Log
  html += `
    <div class="insights-section">
      <h3 class="section-title">📅 Event Timeline</h3>
      <div class="event-log">
  `;
  events.forEach(event => {
    html += `
      <div class="event-item">
        <div class="event-time">${event.time}</div>
        <div class="event-description">${event.description}</div>
      </div>
    `;
  });
  html += '</div></div>';
  
  html += '</div>';
  
  container.innerHTML = html;
}

// ===== UTILITY =====
function updateLastUpdated() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  document.querySelector('.last-updated').textContent = `Last updated: ${timeStr}`;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', initApp);
