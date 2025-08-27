// Mock payload state
const payload = {
  generator_status: "OFF",
  generator_uptime_h: 12.4,
  grid_status: "ON",
  grid_uptime_h: 24.5,
  pv_current_a: 35.2,
  pv_voltage_v: 24.8,
  pv_power_w: 890,
  battery_current_a: 45.2,
  battery_voltage_v: 25.6,
  load_current_a: 12.4,
  load_voltage_v: 230,
  load_power_w: 2.4,
  temperature_c: 28,
  SOH: 95,
  SOC: 72
};

// Update UI with payload
function updateDashboard(data) {
  // Generator
  document.getElementById('generator-status').textContent = data.generator_status;
  document.getElementById('generator-uptime').textContent = data.generator_uptime_h;
  document.getElementById('generator-status-indicator').style.background = data.generator_status === 'ON' ? '#22c55e' : '#ef4444';
  // Grid
  document.getElementById('grid-status').textContent = data.grid_status;
  document.getElementById('grid-uptime').textContent = data.grid_uptime_h;
  document.getElementById('grid-status-indicator').style.background = data.grid_status === 'ON' ? '#22c55e' : '#ef4444';
  // Solar PV
  document.getElementById('pv-current').textContent = data.pv_current_a;
  document.getElementById('pv-voltage').textContent = data.pv_voltage_v;
  document.getElementById('pv-power').textContent = data.pv_power_w;
  // Battery
  document.getElementById('battery-current').textContent = data.battery_current_a;
  document.getElementById('battery-voltage').textContent = data.battery_voltage_v;
  document.getElementById('battery-soc').textContent = data.SOC;
  document.getElementById('battery-soh').textContent = data.SOH;
  // Load
  document.getElementById('load-current').textContent = data.load_current_a;
  document.getElementById('load-voltage').textContent = data.load_voltage_v;
  document.getElementById('load-power').textContent = data.load_power_w;
  // Environment
  document.getElementById('env-temp').textContent = data.temperature_c;
}

// Initial render
updateDashboard(payload);

// Expose updateDashboard globally for data.js
window.updateDashboard = updateDashboard;