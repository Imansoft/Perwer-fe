// ai.js
let prevState = {};
const batteryCapacityWh = 2000; // Configurable battery capacity

export function generatePredictions(payload) {
  const predictions = [];
  // Battery Predictions
  if (payload.SOC === 100) {
    predictions.push('🔋 Battery fully charged');
  } else {
    // Estimate runtime left
    if (payload.load_power_w > 0) {
      const runtimeH = ((payload.SOC / 100) * batteryCapacityWh) / payload.load_power_w;
      if (!isNaN(runtimeH) && isFinite(runtimeH)) {
        predictions.push(`🔋 Battery runtime left: ~${runtimeH.toFixed(1)}h`);
      }
    }
    // Estimate time to full charge
    if (payload.pv_power_w > payload.load_power_w && payload.SOC < 100) {
      const netChargeW = payload.pv_power_w - payload.load_power_w;
      if (netChargeW > 0) {
        const energyNeededWh = batteryCapacityWh * (1 - payload.SOC / 100);
        const timeToFullH = energyNeededWh / netChargeW;
        if (!isNaN(timeToFullH) && isFinite(timeToFullH)) {
          predictions.push(`🔋 Est. time to full charge: ~${timeToFullH.toFixed(1)}h`);
        }
      }
    }
  }

  // Solar PV Predictions
  if (payload.pv_power_w > 0) {
    predictions.push(`🌞 PV forecast next hour: ${payload.pv_power_w} Wh`);
    if (payload.pv_power_w > 1000) {
      predictions.push('🌞 Solar generation near peak');
    }
  }

  // Grid & Generator Reliability
  if (payload.grid_status === 'ON') {
    // Parse uptime hours
    let uptimeH = 0;
    if (typeof payload.grid_uptime_h === 'string') {
      const parts = payload.grid_uptime_h.split(':');
      if (parts.length === 3) {
        uptimeH = parseInt(parts[0], 10) + parseInt(parts[1], 10) / 60 + parseInt(parts[2], 10) / 3600;
      }
    }
    if (uptimeH > 12) {
      predictions.push('⚡ Grid stability: High');
    }
    // Frequent switching detection
    if (prevState.grid_status && prevState.grid_status !== payload.grid_status) {
      predictions.push('⚡ Grid unstable: frequent switching detected');
    }
  } else {
    if (payload.SOC < 30) {
      predictions.push('📌 Action: Generator likely required soon');
    }
  }

  // Load Predictions
  if (payload.load_power_w > 2000) {
    predictions.push('⚡ High load: risk of overload');
  }
  if (prevState.load_power_w !== undefined && payload.load_power_w > prevState.load_power_w) {
    predictions.push('⚡ Load demand rising');
  }

  // System Health Insights
  if (payload.SOH < 70) {
    predictions.push('🔋 Battery health degraded, replacement recommended');
  }
  if (payload.temperature_c > 45) {
    predictions.push('🌡️ High temperature warning');
  }
  if (prevState.temperature_c > 45 && payload.temperature_c <= 45) {
    predictions.push('🌡️ System temperature safe again');
  }

  // Update prevState
  prevState = { ...payload };

  // Return max 5 latest insights
  return predictions.slice(0, 5);
}
