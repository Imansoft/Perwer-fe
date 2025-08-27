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

    // Call updateDashboard in dynamic.js
    if (window.updateDashboard) {
        window.updateDashboard({
            generator_status: current.generator_status,
            generator_uptime_h: current.generator_uptime_h,
            grid_status: current.grid_status,
            grid_uptime_h: current.grid_uptime_h,
            pv_current_a: current.pv_current_a,
            pv_voltage_v: current.pv_voltage_v,
            pv_power_w: current.pv_power_w,
            battery_current_a: current.battery_current_a,
            battery_voltage_v: current.battery_voltage_v,
            load_current_a: current.load_current_a,
            load_voltage_v: current.load_voltage_v,
            load_power_w: current.load_power_w,
            temperature_c: current.temperature_c,
            SOH: current.SOH, // <-- FIXED
            SOC: current.SOC  // <-- FIXED
        });
    }
}


// Initial fetch
fetchAndUpdateDashboard();

// Listen for realtime changes in the 'current' table
supabaseClient
    .channel('current-table-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'current' }, payload => {
        // Fetch latest data and update dashboard
        fetchAndUpdateDashboard();
    })
    .subscribe();