// log.js
let logs = [];
let prevState = {};

export function processPayload(payload) {
  const now = new Date().toLocaleTimeString();

  // Grid Events
  if (prevState.grid_status && prevState.grid_status !== payload.grid_status) {
    logs.push(`[${now}] Grid turned ${payload.grid_status}`);
  }
  if (prevState.grid_uptime_h && payload.grid_uptime_h && prevState.grid_uptime_h !== payload.grid_uptime_h && payload.grid_uptime_h === "00:00:00") {
    logs.push(`[${now}] Grid uptime reset`);
  }

  // Generator Events
  if (prevState.generator_status && prevState.generator_status !== payload.generator_status) {
    logs.push(`[${now}] Generator ${payload.generator_status === "ON" ? "started" : "stopped"}`);
  }
  if (prevState.generator_uptime_h && payload.generator_uptime_h && prevState.generator_uptime_h !== payload.generator_uptime_h && payload.generator_uptime_h === "00:00:00") {
    logs.push(`[${now}] Generator uptime reset`);
  }

  // Battery Events
  if (payload.SOC === 100 && prevState.SOC !== 100) {
    logs.push(`[${now}] Battery fully charged`);
  }
  if (payload.SOC < 20 && (prevState.SOC === undefined || prevState.SOC >= 20)) {
    logs.push(`[${now}] Battery low: SOC ${payload.SOC}%`);
  }
  if (prevState.SOH && payload.SOH < prevState.SOH) {
    logs.push(`[${now}] Battery health degraded: SOH ${payload.SOH}%`);
  }
  if (prevState.SOC && payload.SOC < prevState.SOC - 10) {
    logs.push(`[${now}] Fast battery discharge: SOC dropped from ${prevState.SOC}% to ${payload.SOC}%`);
  }

  // Load Events
  if ((prevState.load_power_w === 0 || prevState.load_power_w === undefined) && payload.load_power_w > 0) {
    logs.push(`[${now}] Load started: ${payload.load_power_w} W`);
  }
  if (prevState.load_power_w > 0 && payload.load_power_w === 0) {
    logs.push(`[${now}] Load turned OFF`);
  }
  if (payload.load_power_w > 2000 && (prevState.load_power_w === undefined || prevState.load_power_w <= 2000)) {
    logs.push(`[${now}] High load: ${payload.load_power_w} W`);
  }

  // Solar PV Events
  if ((prevState.pv_power_w === 0 || prevState.pv_power_w === undefined) && payload.pv_power_w > 0) {
    logs.push(`[${now}] Solar generation started: ${payload.pv_power_w} W`);
  }
  if (prevState.pv_power_w > 0 && payload.pv_power_w === 0) {
    logs.push(`[${now}] Solar generation stopped`);
  }
  if (payload.pv_power_w > 1000 && (prevState.pv_power_w === undefined || prevState.pv_power_w <= 1000)) {
    logs.push(`[${now}] Solar peak: ${payload.pv_power_w} W`);
  }

  // Temperature Events
  if (payload.temperature_c > 45 && (prevState.temperature_c === undefined || prevState.temperature_c <= 45)) {
    logs.push(`[${now}] Warning: High temperature ${payload.temperature_c} °C`);
  }
  if (prevState.temperature_c > 45 && payload.temperature_c <= 45) {
    logs.push(`[${now}] Temperature normalized: ${payload.temperature_c} °C`);
  }

  // update previous state
  prevState = { ...payload };

  // keep only last 100 logs
  if (logs.length > 100) logs = logs.slice(-100);

  return logs;
}