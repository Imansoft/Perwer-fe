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

## Summary Table

| Direction            | Flow                        | Method | Actor     | Description                              |
|----------------------|----------------------------|--------|-----------|------------------------------------------|
| Hardware → Backend   | /api/data                  | POST   | Device    | Sends raw JSON data to backend           |
| Backend → Supabase   | Internal Python integration| –      | Backend   | Parses and stores data in Supabase       |
| Frontend ← Supabase  | Supabase JS Client         | GET    | Dashboard | Fetches latest readings for live display |

---

**Note:**
Build analytics API separately for AI/insight features.