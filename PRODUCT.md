# GEARI — geari.app

**Every shift. Scored.**

An app for manual-transmission drivers. The phone pairs with the vehicle computer (OBD-II / CAN). When the car is put in gear, GEARI records the shift, scores how it was done, and rolls that into an independent safe-driving rating.

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

Consumer Bluetooth OBD-II on ISO 15765-4 / J1979. Gear is inferred; clutch pedal position is usually *not* on passenger OBD. Phone IMU covers lane-change and brake jerk when the vehicle bus does not.

## What this folder is

`index.html` is a landing page + live trip HUD + commute planner + profile mock + i18n. Open it in a browser. It is a product concept, not a certified telematics device.
