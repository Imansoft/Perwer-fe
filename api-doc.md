# PERWER Dashboard API Documentation

---

## Project Overview
- Single-page dashboard built with HTML, TailwindCSS, and JavaScript.
- Displays logs, AI predictions, and live sensor data in a modern, responsive layout.
- Easy to connect to live data by updating the `payload` object in `dynamic.js`.

## Data Payload Structure
```json
{
  "generator_status": "OFF",
  "generator_uptime_h": 12.4,
  "grid_status": "ON",
  "grid_uptime_h": 24.5,
  "pv_current_a": 35.2,
  "pv_voltage_v": 24.8,
  "pv_power_w": 890,
  "battery_current_a": 45.2,
  "battery_voltage_v": 25.6,
  "load_current_a": 12.4,
  "load_voltage_v": 230,
  "load_power_w": 2.4,
  "temperature_c": 28,
  "SOH": 95,
  "SOC": 72
}
```

## Dashboard Layout & Features
- Header bar with project title and subtitle.
- Logs Window (styled like a terminal) and AI Predictions panel side by side.
- Responsive grid of data cards for Generator, Grid, Solar PV, Battery, Load, and Environment.
- Consistent card design: icon, title, values, and status indicators.
- Mobile-friendly: cards stack vertically on small screens.

## Code Organization
- `index.html`: Main dashboard layout and structure.
- `dynamic.js`: Contains the `payload` mock data and `updateDashboard` function for UI updates.
- To connect live data, replace the `payload` object with your API or database source and call `updateDashboard` as needed.

## Example: Updating Dashboard with Live Data
```js
// In dynamic.js
fetch('/api/latest-data')
  .then(res => res.json())
  .then(data => updateDashboard(data));
```

## Instructions
- Edit `dynamic.js` to connect to your backend or Supabase.
- Ensure all card IDs in `index.html` match the keys in your data source.
- Customize logs and AI predictions as needed for your use case.

## References
- See `index.html` and `dynamic.js` in the update folder for full code.
