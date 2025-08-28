// Inactivity timer logic
let lastUpdateTime = Date.now();
let inactivityTimer = null;

function resetInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        // Reset dashboard
        if (window.updateDashboard) {
            window.updateDashboard({
                generator_status: "OFF",
                generator_uptime_h: '---',
                grid_status: "OFF",
                grid_uptime_h: '---',
                pv_current_a: '---',
                pv_voltage_v: '---',
                pv_power_w: '---',
                battery_current_a: '---',
                battery_voltage_v: '---',
                load_current_a: '---',
                load_voltage_v: '---',
                load_power_w: '---',
                temperature_c: '---',
                SOH: '---',
                SOC: '---'
            });
        }
        // Clear logs
        const logsWindow = document.getElementById('logs-window');
        if (logsWindow) logsWindow.textContent = '';
        // Clear AI predictions
        const aiList = document.getElementById('ai-predictions-list');
        if (aiList) aiList.innerHTML = '';
    }, 5 * 60 * 1000); // 5 minutes
}

import { processPayload } from './logs.js';
import { generatePredictions } from './ai.js';

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
        // List of all dashboard fields
        const dashboardFields = [
            'generator_status', 'generator_uptime_h',
            'grid_status', 'grid_uptime_h',
            'pv_current_a', 'pv_voltage_v', 'pv_power_w',
            'battery_current_a', 'battery_voltage_v',
            'load_current_a', 'load_voltage_v', 'load_power_w',
            'temperature_c', 'SOH', 'SOC'
        ];
        // Fill missing fields with '---'
        const safeData = {};
        dashboardFields.forEach(field => {
            safeData[field] = (current[field] !== undefined && current[field] !== null && current[field] !== '') ? current[field] : '---';
        });
        window.updateDashboard(safeData);
    }

    // Update Logs Window
    const logsArray = processPayload(current);
    const logsWindow = document.getElementById('logs-window');
    if (logsWindow) {
        logsWindow.textContent = logsArray.join('\n');
    }

    // Update AI Predictions Panel
    const predictions = generatePredictions(current);
    const aiList = document.getElementById('ai-predictions-list');
    if (aiList) {
        aiList.innerHTML = '';
        predictions.forEach(pred => {
            const li = document.createElement('li');
            li.className = 'bg-perwer-light rounded-lg px-3 py-2 text-gray-800 flex items-center';
            li.textContent = pred;
            aiList.appendChild(li);
        });
    }
    lastUpdateTime = Date.now();
    resetInactivityTimer();
}

// Initial fetch
fetchAndUpdateDashboard();
resetInactivityTimer();

// Listen for realtime changes in the 'current' table
supabaseClient
    .channel('current-table-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'current' }, payload => {
        fetchAndUpdateDashboard();
    })
    .subscribe();

// Fallback polling every 5 seconds to ensure UI stays updated
setInterval(fetchAndUpdateDashboard, 1000);