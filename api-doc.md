# ⚡ PERWER Energy API Documentation

---

## Architecture Overview

- **Hardware** sends live energy & environment data to the Python backend.
- **Backend** parses and uploads that data to Supabase.
- **Frontend** connects directly to Supabase (via client library or REST) to fetch the latest readings for the dashboard.

---

## Base URL
```
https://perwer.onrender.com/api
```

---

## 1. POST `/data` – Send Real-Time Hardware Data to Backend

**Description:**
Endpoint used by energy hardware to send live sensor readings (solar, battery, load, environment) to the backend. The backend parses the incoming data and inserts it into the Supabase database.

**Auth:**
None (consider restricting by IP, MAC, or secret key in production)

**Request Body (JSON):**
```json
{
  "solar": {
    "power_output_watts": 847,
    "radiation_w_per_m2": 892,
    "pv_voltage": 24.8,
    "pv_current": 34.2,
    "pv_temperature_c": 45
  },
  "battery": {
    "soc_percent": 64,
    "dod_percent": 36,
    "voltage": 25.6,
    "temperature_c": 28,
    "current_a": 45.2,
    "cycles": 1247,
    "charge_mode": "BULK",
    "time_to_full_h": 2.3,
    "charge_rate_w": 847,
    "target_voltage": 29.2,
    "charge_mode_setting": "AUTO"
  },
  "load_generator": {
    "current_load_kw": 2.4,
    "load_current_a": 12.4,
    "grid_voltage_v": 230,
    "generator_runtime_h": 12.4,
    "generator_status": "OFF"
  },
  "environment": {
    "ambient_temperature_c": 24,
    "humidity_percent": 68,
    "tamper_status": "OK",
    "smoke_status": "CLEAR",
    "fire_alert_status": "SAFE"
  }
}
```

**Response (on success):**
```json
{
  "status": "success",
  "message": "Data received and stored in Supabase"
}
```

**Notes:**
- The backend should add a timestamp before inserting into Supabase.
- Data is structured and validated before storage.

---

## 2. Frontend Data Access – Supabase Integration (Client-Side)

**Description:**
The frontend does not call the backend directly. Instead, it connects to Supabase to fetch the latest data and display it on the dashboard.

**Supabase Usage (JavaScript Example):**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://YOUR_SUPABASE_URL', 'YOUR_PUBLIC_ANON_KEY');

async function fetchDashboardData() {
  const { data, error } = await supabase
    .from('energy_data')            // your table name
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(1);                      // get the latest record

  if (error) {
    console.error("Failed to fetch:", error);
    return;
  }

  const latest = data[0];

  // Example UI updates
  document.getElementById("solar-power").innerText = `${latest.solar.power_output_watts} W`;
  document.getElementById("battery-soc").innerText = `${latest.battery.soc_percent}%`;
}
```

**Supabase Setup Recommendations:**
- Store solar, battery, load_generator, environment, and timestamp as JSON or structured columns.
- Use Row-Level Security (RLS) for client-safe public access (read-only).
- Optionally implement a realtime listener via Supabase’s `on('INSERT')` feature for live updates.

---

## JSON Data Parameters Reference

### Solar
- **power_output_watts**: Current solar power output in watts. Example: 0–5000; e.g. 847
- **radiation_w_per_m2**: Solar irradiance in watts per square meter. Example: 0–1200; e.g. 892
- **pv_voltage**: Photovoltaic panel voltage in volts. Example: 0–60; e.g. 24.8
- **pv_current**: PV panel current in amperes. Example: 0–50; e.g. 34.2
- **pv_temperature_c**: PV panel temperature in Celsius. Example: -20–80; e.g. 45

### Battery
- **soc_percent**: State of Charge, battery percentage. Example: 0–100%; e.g. 64%
- **soh_percent**: State of Health, battery health percentage. Example: 0–100%; e.g. 87%
- **dod_percent**: Depth of Discharge, battery percentage. Example: 0–100%; e.g. 36%
- **voltage**: Battery voltage in volts. Example: 0–60; e.g. 25.6
- **temperature_c**: Battery temperature in Celsius. Example: -20–60; e.g. 28
- **current_a**: Battery current in amperes. Example: -100–100; e.g. 45.2
- **cycles**: Number of charge/discharge cycles. Example: 0–10000; e.g. 1247
- **charge_mode**: Current battery charging mode. Example: BULK, ABSORPTION, FLOAT; e.g. BULK
- **time_to_full_h**: Estimated time to full charge in hours. Example: 0–24; e.g. 2.3
- **charge_rate_w**: Current battery charge rate in watts. Example: 0–5000; e.g. 847
- **target_voltage**: Target voltage for charging in volts. Example: 0–60; e.g. 29.2
- **charge_mode_setting**: Charging mode setting. Example: AUTO, MANUAL; e.g. AUTO

### Load/Generator
- **current_load_kw**: Current load in kilowatts. Example: 0–20; e.g. 2.4
- **load_current_a**: Load current in amperes. Example: 0–100; e.g. 12.4
- **grid_voltage_v**: Grid voltage in volts. Example: 0–250; e.g. 230
- **generator_runtime_h**: Generator runtime in hours. Example: 0–1000; e.g. 12.4
- **generator_status**: Generator status. Example: ON, OFF, MAINTENANCE; e.g. OFF

### Environment
- **ambient_temperature_c**: Ambient temperature in Celsius. Example: -40–60; e.g. 24
- **humidity_percent**: Ambient humidity percentage. Example: 0–100%; e.g. 68%
- **tamper_status**: Tamper detection status. Example: OK, TAMPERED; e.g. OK
- **smoke_status**: Smoke detection status. Example: CLEAR, SMOKE; e.g. CLEAR
- **fire_alert_status**: Fire alert status. Example: SAFE, ALERT; e.g. SAFE

---

## Summary Table

| Direction            | Flow                        | Method | Actor     | Description                              |
|----------------------|----------------------------|--------|-----------|------------------------------------------|
| Hardware → Backend   | /api/data                  | POST   | Device    | Sends raw JSON data to backend           |
| Backend → Supabase   | Internal Python integration| –      | Backend   | Parses and stores data in Supabase       |
| Frontend ← Supabase  | Supabase JS Client         | GET    | Dashboard | Fetches latest readings for live display |

---

**Note:**
Build analytics API separately for AI/insight features.