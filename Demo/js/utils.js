/**
 * Utility functions for Perwer Dashboard
 */

/**
 * Calculate health score based on battery, solar, and generator performance
 * healthScore = (batteryHealth * 0.4) + (solarScore * 0.3) + (generatorScore * 0.3)
 */
function calculateHealthScore(site) {
  const batteryHealth = site.batteryHealth || 0;
  
  // Solar score: 100 if ON, else 40
  const solarScore = site.solarOn ? 100 : 40;
  
  // Generator score: penalizes running while battery is high
  let generatorScore = 100;
  if (site.generatorOn && site.batteryCharge > 85) {
    generatorScore = 50; // Penalty for inefficient generator use
  } else if (!site.generatorOn) {
    generatorScore = 100;
  }
  
  const healthScore = 
    (batteryHealth * 0.4) + 
    (solarScore * 0.3) + 
    (generatorScore * 0.3);
  
  return Math.round(healthScore);
}

/**
 * Get status based on health score
 */
function getStatus(healthScore) {
  if (healthScore >= 80) return 'Healthy';
  if (healthScore >= 60) return 'At Risk';
  return 'Critical';
}

/**
 * Get status badge styling
 */
function getStatusClass(healthScore) {
  if (healthScore >= 80) return 'status-healthy';
  if (healthScore >= 60) return 'status-at-risk';
  return 'status-critical';
}

/**
 * Get status dot color
 */
function getStatusDot(healthScore) {
  if (healthScore >= 80) return '#4ade80'; // green
  if (healthScore >= 60) return '#facc15'; // yellow
  return '#ef4444'; // red
}

/**
 * Calculate days to failure for battery
 */
function calculateDaysToFailure(batteryHealth) {
  if (batteryHealth < 70) {
    return Math.floor(Math.random() * (240 - 120) + 120); // 120-240 days
  }
  return null;
}

/**
 * Generate alerts for a site
 */
function generateAlerts(site) {
  const alerts = [];
  
  // Battery health low
  if (site.batteryHealth < 65) {
    const daysToFailure = calculateDaysToFailure(site.batteryHealth);
    alerts.push({
      severity: 'critical',
      message: `Battery health degrading (${site.batteryHealth}%). Estimated failure in ${daysToFailure} days.`,
      timestamp: getRandomTime(),
      type: 'battery'
    });
  }
  
  // Diesel level low
  if (site.dieselLevel < 30) {
    alerts.push({
      severity: 'warning',
      message: `Diesel level critically low (${site.dieselLevel}%). Refill required within 48 hours.`,
      timestamp: getRandomTime(),
      type: 'diesel'
    });
  }
  
  // Generator waste - running while battery charged
  if (site.generatorOn && site.batteryCharge > 85) {
    alerts.push({
      severity: 'warning',
      message: 'Generator running unnecessarily while battery is fully charged (${site.batteryCharge}%).',
      timestamp: getRandomTime(),
      type: 'generator'
    });
  }
  
  // Solar off during day
  if (!site.solarOn && Math.random() > 0.5) { // Simulate occasional solar issues
    alerts.push({
      severity: 'info',
      message: 'Solar system offline. Check panel connections.',
      timestamp: getRandomTime(),
      type: 'solar'
    });
  }
  
  return alerts;
}

/**
 * Get random timestamp for demo
 */
function getRandomTime() {
  const now = new Date();
  const minutes = Math.floor(Math.random() * 120); // Last 2 hours
  const time = new Date(now - minutes * 60000);
  return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Generate insights and recommendations for a site
 */
function generateInsights(site) {
  const insights = [];
  const recommendations = [];
  
  // Battery weak
  if (site.batteryHealth < 70) {
    insights.push('Battery performance is degrading.');
    const daysToFailure = calculateDaysToFailure(site.batteryHealth);
    recommendations.push({
      title: 'Battery Maintenance Required',
      description: `Battery health is at ${site.batteryHealth}%. Schedule replacement or refurbishment within ${daysToFailure} days to prevent critical failure.`,
      priority: 'high',
      condition: 'batteryHealth < 70'
    });
  }
  
  // Generator waste
  if (site.generatorOn && site.batteryCharge > 85) {
    insights.push('Generator runtime is higher than optimal. Consider reducing diesel consumption.');
    recommendations.push({
      title: 'Optimize Generator Usage',
      description: 'Generator is running while battery charge is critically high (${site.batteryCharge}%). Disable generator to reduce diesel costs and carbon footprint.',
      priority: 'high',
      condition: 'generatorOn && batteryCharge > 85'
    });
  }
  
  // Low diesel
  if (site.dieselLevel < 30) {
    insights.push('Diesel reserves running low.');
    recommendations.push({
      title: 'Refill Diesel',
      description: `Diesel level is at ${site.dieselLevel}%. Schedule refill within 48 hours to maintain backup power availability.`,
      priority: 'medium',
      condition: 'dieselLevel < 30'
    });
  }
  
  // Solar could be better
  if (!site.solarOn && Math.random() > 0.7) {
    insights.push('Solar system is not actively generating power.');
    recommendations.push({
      title: 'Check Solar System',
      description: 'Solar panels are offline. Verify wiring, panel cleanliness, and inverter status to resume renewable energy generation.',
      priority: 'medium',
      condition: 'solarOn === false'
    });
  }
  
  // All good
  if (recommendations.length === 0) {
    insights.push('System operating optimally. No immediate action required.');
  }
  
  return { insights, recommendations };
}

/**
 * Generate event log entries
 */
function generateEventLog(site) {
  const events = [];
  const now = new Date();
  
  // Synthetic events based on site state
  if (site.generatorOn) {
    events.push({
      time: new Date(now - 15 * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      description: 'Generator started automatically'
    });
  }
  
  if (site.batteryCharge < 50) {
    events.push({
      time: new Date(now - 45 * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      description: 'Battery charge dipped below 50%'
    });
  }
  
  if (site.solarOn) {
    events.push({
      time: new Date(now - 120 * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      description: 'Solar generation resumed'
    });
  }
  
  events.push({
    time: new Date(now - 240 * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    description: 'System health check completed - all systems nominal'
  });
  
  return events;
}

/**
 * Filter sites by status
 */
function filterSitesByStatus(sites, status) {
  if (status === 'all') return sites;
  
  return sites.filter(site => {
    const healthScore = calculateHealthScore(site);
    const siteStatus = getStatus(healthScore);
    return siteStatus.toLowerCase() === status.toLowerCase();
  });
}

/**
 * Search sites by name or location
 */
function searchSites(sites, query) {
  const lowerQuery = query.toLowerCase();
  return sites.filter(site => 
    site.name.toLowerCase().includes(lowerQuery) ||
    site.location.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get KPI counts
 */
function getKPICounts(sites) {
  const kpis = {
    total: sites.length,
    healthy: 0,
    atRisk: 0,
    critical: 0
  };
  
  sites.forEach(site => {
    const healthScore = calculateHealthScore(site);
    const status = getStatus(healthScore);
    
    if (status === 'Healthy') kpis.healthy++;
    else if (status === 'At Risk') kpis.atRisk++;
    else if (status === 'Critical') kpis.critical++;
  });
  
  return kpis;
}
