# Hlavák: Sanitation Squad

A 3-player co-op survival game on one keyboard, set in the hall of Praha hlavní nádraží. You are
three janitors joined by streams of sanitizer. Whoever walks into a stream gets washed away; one
touch on any janitor ends the shift.

People arrive in waves, and the first five waves each add one new thing: power-ups to pick
up, addicts who sprint, trains that cross the hall, riot cops who need a long soak.

The full design is in [SPEC.md](SPEC.md).

## Run it

```bash
npm install
npm run dev
```

Then open the address it prints (normally http://localhost:5173).

## Controls

| Player | Keys       |
| ------ | ---------- |
| 1      | `W A S D`  |
| 2      | `I J K L`  |
| 3      | arrow keys |

`Enter` starts and restarts, `P` pauses, `` ` `` shows debug info (including which keys the
keyboard currently registers).

## Other commands

```bash
npm test
npm run lint
npm run build
```

All numbers you might want to tune (speeds, laser length, spawn rate, enemy stats) are in
[src/config.ts](src/config.ts).
