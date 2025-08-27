// Mock payload state
const payload = {
  generator_status: "",
  generator_uptime_h: "",
  grid_status: "",
  grid_uptime_h: '',
  pv_current_a: '',
  pv_voltage_v: '',
  pv_power_w: '',
  battery_current_a: '',
  battery_voltage_v: '',
  load_current_a: '',
  load_voltage_v: '',
  load_power_w: '',
  temperature_c: '',
  SOH: '',
  SOC: ''
};

// Update UI with payload
function updateDashboard(data) {
  // Generator
  document.getElementById('generator-status').textContent = data.generator_status;
  document.getElementById('generator-uptime').textContent = data.generator_status === 'ON' ? data.generator_uptime_h : '--- ';
  document.getElementById('generator-status-indicator').style.background = data.generator_status === 'ON' ? '#22c55e' : '#ef4444';
  // Grid
  document.getElementById('grid-status').textContent = data.grid_status;
  document.getElementById('grid-uptime').textContent = data.grid_status === 'ON' ? data.grid_uptime_h : '--- ';
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