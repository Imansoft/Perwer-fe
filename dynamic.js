// Solar Metrics
function updateSolarPower(value) {
    document.getElementById('solar-power').innerText = value + 'W';
    document.getElementById('header-solar').innerText = value + 'W';
}
function updateSolarRadiation(value) {
    document.querySelector('#overview .detail-item:nth-child(1) .detail-value').innerText = value + ' W/m²';
}
function updatePVVoltage(value) {
    document.querySelector('#overview .detail-item:nth-child(2) .detail-value').innerText = value + 'V';
}
function updatePVCurrent(value) {
    document.querySelector('#overview .detail-item:nth-child(3) .detail-value').innerText = value + 'A';
}
function updatePVTemperature(value) {
    document.querySelector('#overview .detail-item:nth-child(4) .detail-value').innerText = value + '°C';
}

// Battery Metrics
function updateBatterySoc(soc) {
    document.getElementById('battery-soc').innerText = soc + '%';
    document.getElementById('header-soc').innerText = soc + '%';
    document.getElementById('battery-progress').style.width = soc + '%';
}
function updateBatterySoH(soh) {
    document.querySelector('#overview .metric-card:nth-child(2) .detail-item:nth-child(1) .detail-value').innerText = soh + '%';
}
function updateBatteryDoD(dod) {
    document.querySelector('#overview .metric-card:nth-child(2) .detail-item:nth-child(2) .detail-value').innerText = dod + '%';
}
function updateBatteryVoltage(voltage) {
    document.querySelector('#overview .metric-card:nth-child(2) .detail-item:nth-child(3) .detail-value').innerText = voltage + 'V';
}
function updateBatteryTemperature(temp) {
    document.querySelector('#overview .metric-card:nth-child(2) .detail-item:nth-child(4) .detail-value').innerText = temp + '°C';
}
function updateBatteryCycles(cycles) {
    document.querySelector('#battery .detail-item:nth-child(1) .detail-value').innerText = cycles;
}
function updateBatteryCurrent(current) {
    document.querySelector('#battery .detail-item:nth-child(4) .detail-value').innerText = current + 'A';
}
function updateBatteryChargeMode(mode) {
    document.querySelector('#battery .metric-card:nth-child(2) .metric-value').innerText = mode;
}
function updateBatteryTimeToFull(hours) {
    document.querySelector('#battery .metric-card:nth-child(2) .detail-item:nth-child(1) .detail-value').innerText = hours + 'h';
}
function updateBatteryChargeRate(rate) {
    document.querySelector('#battery .metric-card:nth-child(2) .detail-item:nth-child(2) .detail-value').innerText = rate + 'W';
}
function updateBatteryTargetVoltage(voltage) {
    document.querySelector('#battery .metric-card:nth-child(2) .detail-item:nth-child(3) .detail-value').innerText = voltage + 'V';
}
function updateBatteryChargeModeSetting(setting) {
    document.querySelector('#battery .metric-card:nth-child(2) .detail-item:nth-child(4) .detail-value').innerText = setting;
}

// Load/Generator Metrics
function updateLoadCurrentLoad(value) {
    document.querySelector('#overview .metric-card:nth-child(3) .metric-value').innerText = value + 'kW';
}
function updateLoadCurrentA(value) {
    document.querySelector('#overview .metric-card:nth-child(3) .detail-item:nth-child(1) .detail-value').innerText = value + 'A';
}
function updateGridVoltage(value) {
    document.querySelector('#overview .metric-card:nth-child(3) .detail-item:nth-child(2) .detail-value').innerText = value + 'V';
}
function updateGeneratorRuntime(value) {
    document.querySelector('#overview .metric-card:nth-child(3) .detail-item:nth-child(3) .detail-value').innerText = value + 'h';
}
function updateGeneratorStatus(status) {
    document.querySelector('#overview .metric-card:nth-child(3) .detail-item:nth-child(4) .detail-value').innerText = status;
}

// Environment Metrics
function updateAmbientTemp(temp) {
    document.querySelector('#overview .metric-card:nth-child(4) .metric-value').innerText = temp + '°C';
}
function updateHumidity(humidity) {
    document.querySelector('#overview .metric-card:nth-child(4) .detail-item:nth-child(1) .detail-value').innerText = humidity + '%';
}
function updateTamperStatus(status) {
    document.querySelector('#overview .metric-card:nth-child(4) .detail-item:nth-child(2) .detail-value').innerText = status;
}
function updateSmokeStatus(status) {
    document.querySelector('#overview .metric-card:nth-child(4) .detail-item:nth-child(3) .detail-value').innerText = status;
}
function updateFireAlertStatus(status) {
    document.querySelector('#overview .metric-card:nth-child(4) .detail-item:nth-child(4) .detail-value').innerText = status;
}

// Make all update functions globally available
window.updateSolarPower = updateSolarPower;
window.updateSolarRadiation = updateSolarRadiation;
window.updatePVVoltage = updatePVVoltage;
window.updatePVCurrent = updatePVCurrent;
window.updatePVTemperature = updatePVTemperature;

window.updateBatterySoc = updateBatterySoc;
window.updateBatterySoH = updateBatterySoH;
window.updateBatteryDoD = updateBatteryDoD;
window.updateBatteryVoltage = updateBatteryVoltage;
window.updateBatteryTemperature = updateBatteryTemperature;
window.updateBatteryCycles = updateBatteryCycles;
window.updateBatteryCurrent = updateBatteryCurrent;
window.updateBatteryChargeMode = updateBatteryChargeMode;
window.updateBatteryTimeToFull = updateBatteryTimeToFull;
window.updateBatteryChargeRate = updateBatteryChargeRate;
window.updateBatteryTargetVoltage = updateBatteryTargetVoltage;
window.updateBatteryChargeModeSetting = updateBatteryChargeModeSetting;

window.updateLoadCurrentLoad = updateLoadCurrentLoad;
window.updateLoadCurrentA = updateLoadCurrentA;
window.updateGridVoltage = updateGridVoltage;
window.updateGeneratorRuntime = updateGeneratorRuntime;
window.updateGeneratorStatus = updateGeneratorStatus;

window.updateAmbientTemp = updateAmbientTemp;
window.updateHumidity = updateHumidity;
window.updateTamperStatus = updateTamperStatus;
window.updateSmokeStatus = updateSmokeStatus;
window.updateFireAlertStatus = updateFireAlertStatus;