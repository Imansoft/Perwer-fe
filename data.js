// Supabase client for browser (CDN)
const SUPABASE_URL = 'https://azejxtkohlvcufcloovc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6ZWp4dGtvaGx2Y3VmY2xvb3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NjA2NTMsImV4cCI6MjA2OTEzNjY1M30.6Ex47MtN4ssNiOvd1XOSWZ1ttC-RJ2Pjb6KyMmvVzrU';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchAndUpdateDashboard() {
    const { data, error } = await supabaseClient
        .from('current')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1);

    if (error || !data || !data[0]) {
        console.error('Failed to fetch current data:', error);
        return;
    }

    const current = data[0].data;

    // Solar
    window.updateSolarPower(current.solar.power_output_watts);
    window.updateSolarRadiation(current.solar.radiation_w_per_m2);
    window.updatePVVoltage(current.solar.pv_voltage);
    window.updatePVCurrent(current.solar.pv_current);
    window.updatePVTemperature(current.solar.pv_temperature_c);

    // Battery
    window.updateBatterySoc(current.battery.soc_percent);
    window.updateBatterySoH(current.battery.soh_percent || 87); // fallback if not present
    window.updateBatteryDoD(current.battery.dod_percent);
    window.updateBatteryVoltage(current.battery.voltage);
    window.updateBatteryTemperature(current.battery.temperature_c);
    window.updateBatteryCycles(current.battery.cycles);
    window.updateBatteryCurrent(current.battery.current_a);
    window.updateBatteryChargeMode(current.battery.charge_mode);
    window.updateBatteryTimeToFull(current.battery.time_to_full_h);
    window.updateBatteryChargeRate(current.battery.charge_rate_w);
    window.updateBatteryTargetVoltage(current.battery.target_voltage);
    window.updateBatteryChargeModeSetting(current.battery.charge_mode_setting);

    // Load/Generator
    window.updateLoadCurrentLoad(current.load_generator.current_load_kw);
    window.updateLoadCurrentA(current.load_generator.load_current_a);
    window.updateGridVoltage(current.load_generator.grid_voltage_v);
    window.updateGeneratorRuntime(current.load_generator.generator_runtime_h);
    window.updateGeneratorStatus(current.load_generator.generator_status);

    // Environment
    window.updateAmbientTemp(current.environment.ambient_temperature_c);
    window.updateHumidity(current.environment.humidity_percent);
    window.updateTamperStatus(current.environment.tamper_status);
    window.updateSmokeStatus(current.environment.smoke_status);
    window.updateFireAlertStatus(current.environment.fire_alert_status);

    // In data.js, after fetching current data:
    window.updateBatterySection(current.battery);
    window.updateSolarSection(current.solar);
    window.updateLoadSection(current.load_generator);
    window.updateEnvironmentSection(current.environment);
}

// Call on page load and every 30 seconds
fetchAndUpdateDashboard();
setInterval(fetchAndUpdateDashboard, 30000);