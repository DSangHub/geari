# GEARI — geari.app

**Every shift. Scored.**

An app for manual-transmission drivers. The phone pairs with the vehicle computer (OBD-II / CAN and regional equivalents). When the car is put in gear, GEARI records the shift, scores how it was done, and rolls that into an independent safe-driving rating.

## Who it is for

- Stick-shift commuters who want a record of clean driving
- Rideshare / taxi drivers who want a rating that is not owned by Uber, Lyft, or a local platform
- Markets where manuals are still common: South America and the Far East first, then everywhere else

## Core loop

1. Optional: set destination and a *desired safe arrival time* (work address is a first-class saved place).
2. Pair the adapter. Start the trip.
3. App infers gear from speed ÷ RPM and logs every upshift, downshift, skip-shift, and reverse.
4. Points for smooth shifts, signaled lane changes, and progressive braking. Penalties for clutch dumps and panic stops.
5. Trip closes against the safe-arrival window. Profile score updates (0–1000 Geari Score).

## Scoring (v1 rules)

| Event | Signals | Points |
|---|---|---|
| Smooth upshift | RPM in band, low longitudinal jerk | +8 to +15 |
| Rev-matched downshift | Throttle blip, RPM lands on ratio | +12 to +20 |
| Signaled lane change | GPS heading + phone IMU, no abrupt yaw | +4 to +8 |
| Progressive braking | Deceleration curve, no spike | +5 to +12 |
| Hard brake / clutch dump | Jerk above threshold | −10 to −25 |
| Arrive inside safe window | Planned arrival vs. actual | +10 |

Geari Score is a rolling 0–1000 built from the last N weighted trips, not a single ride.

## Rideshare profiles

Drivers create a public GEARI ID. Passengers or dispatch can open a card / QR *before* the trip:

- Geari Score
- Shift smoothness, lane, brake breakdown
- On-time-safe rate for planned arrivals
- Badges (e.g. Smooth Shift Gold, Rev-match 80%+)

This ledger is independent of platform star ratings.

## Backend (minimum)

- **Accounts** — profile, language, saved work destination + standing arrival, public/private score
- **Trip ingest** — shift events, coarse IMU/GPS, route vs. safe window, adapter id
- **Scoring engine** — deterministic rules + auditable point ledger
- **Public rating** — shareable card; viewing a score does not store passenger PII

## Languages (first wave)

English, Spanish, Hindi, Urdu (RTL), Punjabi, Tagalog, Thai.

Toggle lives in the header of the product site.

## Hardware assumption

Consumer Bluetooth OBD-II on ISO 15765-4 / J1979 (or KWP2000 / K-line where that is what the car speaks). Gear is inferred from vehicle speed ÷ engine RPM; clutch pedal position is usually *not* on passenger OBD. Phone IMU covers lane-change and brake jerk when the vehicle bus does not.

Allow-list for v1: Vgate iCar Pro BLE, Veepeak BLE+, OBDLink MX+ / CX. Avoid unlabeled ELM “v2.1” clones for daily scoring.

### Port and pins

Same 16-pin SAE J1962 / ISO 15031-3 socket in first-wave markets.

- Pin 6 CAN-H, pin 14 CAN-L (ISO 15765-4) on most 2008+ / OBDBr-2 / China 6 / BS-VI cars
- Pin 7 K-line on older Asia / Europe
- Pin 16 battery

Legislated Mode 01 PIDs only: RPM, vehicle speed, throttle, calculated load, MAP or MAF. Do not use fuel trim on flex-fuel cars.

### Regional names for the same idea

| Market | Local system | Typical ECU year | Notes for GEARI |
|---|---|---|---|
| Brazil | OBDBr-1 / 2 / 2+ | 2007 petrol · 2010 solid · diesel ~2015 | Flex-fuel. Use RPM and speed, not fuel trim. |
| Argentina | EOBD-style | 2008 domestic · 2009 imports | Same 16-pin. Safety homologation ≠ OBD profile. |
| Chile | EOBD / Euro 6c path | 2013 diesel · 2014 petrol | Later cars are the reliable ECU set. |
| Mexico | OBD-II / EOBD mix | ~2007 | US and EU platforms both common. |
| Peru / Colombia | Import-led | Varies | Port present on many imports. Smoke-test before scoring. |
| Japan | JOBD | 2003 basic · 2008 domestic | JDM may need a better adapter than export twins. |
| South Korea | KOBD | 2005–06 · full ~2010 | Gasoline coverage is strong. |
| China | GB 18352 China 5 / 6 | 2010 petrol · 2020 China 6 | Standard scan-tool PIDs on China 6. |
| India | BS-VI OBD I / II | 2017 tools · 2020 / 2023 / 2025 stages | Hindi / Urdu / Punjabi markets. CAN on new cars. |
| Thailand | TIS + EOBD | Euro 4 with EOBD from 2012 | Euro 3 wave can have a plug and no live PIDs. |
| Philippines | Euro 4 EOBD | ~2016–18 | Consumer BLE dongles widely sold. |

A 16-pin hole is not a promise. Newest 2020s platforms may use CAN-FD or DoIP — v1 stays on classic CAN / K-line and phone fallback. EVs are out of scope.

### Connection flow in the app

1. Find the port (driver-reach 16-pin).
2. Plug a BLE adapter (iPhone needs BLE or MFi; Android accepts BLE or Classic).
3. Handshake: auto-detect CAN / KWP2000 / K-line. Ten-second smoke test for RPM + speed.
4. Fallback: GPS + IMU still scores lane and brake. Public rating shows a sensor badge, not a fake ECU score.

## What this folder is

`index.html` is a landing page + live trip HUD + commute planner + profile mock + i18n. Open it in a browser. It is a product concept, not a certified telematics device.
