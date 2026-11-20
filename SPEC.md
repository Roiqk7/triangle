# Hlavák: Sanitation Squad — Game Specification (v0.3)

A 3-player, single-keyboard, top-down co-op survival game set in the hall of **Praha hlavní nádraží**.
The three players are janitors joined by streams of sanitizer, which form a triangle. Whoever walks
into a stream gets washed away. The janitors themselves are the weak points: one touch on any of
them ends the shift.

The first version was an abstract proof of concept (neon triangle, lasers, coloured dots). The rules
from it are unchanged; this version gives them a place, a cast and a drawn style.

Every number here is a **starting value for tuning** and lives in one config file.

## Theme and vocabulary

The rules are written without the theme, so the game could be re-dressed again. The code under
`world/`, `enemies/` and `systems/` uses the neutral words; only `render/` knows the theme.

| In the rules and code | In the game                                                    |
| --------------------- | -------------------------------------------------------------- |
| Arena                 | The station hall                                               |
| Player                | Janitor: hi-vis vest, mop, sanitizer tank, numbered cap        |
| Laser                 | Stream of sanitizer between two janitors                       |
| Chaser                | Homeless man: coat, beanie, plastic bag. Walks straight at you |
| Dasher                | Drug addict: hoodie, shakes on the spot, then sprints          |
| Brute                 | Riot cop: shield and baton. Slow, needs a long soak            |
| Obstacle (pillar)     | Station furniture: recycling bin, palm planter, coffee kiosk   |
| Kill                  | "Washed away": the person vanishes in a burst of foam          |
| Run / game over       | Shift / shift over                                             |

Tone: cartoon, not grim. Nobody is hurt on screen; people get soaked and disappear in bubbles.

All art is drawn in code on the canvas (no image files), in one style: flat colours, thick dark
outlines, soft drop shadows, seen from straight above.

---

## 1. Core loop

1. Title screen shows the controls for all three players. `Enter` or `Space` starts.
2. For the first 3 seconds nothing spawns, so players can find their keys.
3. Enemies walk in from outside the arena in waves, with a break between waves (§6).
4. An enemy touching a laser takes damage. **An enemy touching any player ends the run.**
5. Game over screen shows time survived and kills. `Enter` restarts.

No win condition: it is endless, and the result is how long the team lasted.

---

## 2. Arena

- Rectangle of **1600 × 900 logical units**. The canvas is scaled to fit the window and keeps its
  aspect ratio.
- Players are kept inside the arena. Enemies spawn 40 units outside it and walk in.

### 2.1 Pillars (obstacles)

- Each run places up to **7 round pillars** at random, radius 28 to 64. Restarting gives a new layout.
- **A pillar cuts any laser that passes through it.** The cut laser does no damage until the two
  players have a clear line again. It is drawn as moving amber dashes, so it reads differently from a
  laser that is merely stretched too far (still grey dashes).
- Pillars are solid. Players and enemies that walk into one slide around it.
- Placement rules, so that no layout is unfair or broken:
     - nothing within 240 units of the arena centre, so the start triangle is always intact;
     - at least 70 units between a pillar and the arena edge;
     - at least 90 units between two pillars, so the largest enemy (and any player) fits through.
- If the random tries run out, a run simply has fewer pillars.

### 2.2 The hall

The floor is painted once into an off-screen picture and copied each frame. From bottom to top:

- **Stone tiles** in two alternating shades, each slightly lighter or darker than its neighbours.
- **Compass mosaic** in the centre, red, cream and gold. The crew starts each shift standing on it;
  no furniture is ever placed on it.
- **Yellow tactile strips** (the guide lines for blind travellers) from each wall to the mosaic.
- **Grime:** faint stains and dots of old chewing gum, the same every time.
- **Four entrances**, one per wall, which is where people walk in from: stairs to platforms 1–7 with
  blue signs (top), glass doors to Vrchlického sady, "Sherwood" (bottom), Metro C (left), taxi rank
  and Wilsonova street (right).
- **Daylight** from the roof in slanted bands, and darker corners.

Furniture (§2.1) is drawn by size: small obstacles are three-colour recycling bins, medium ones are
palm planters whose leaves sway, large ones are coffee kiosks seen as red-and-white striped awnings.
It is drawn above the characters, so people walk under the awnings and leaves.

All of this is drawing only; none of it affects the rules.

---

## 3. Players

| Property       | Value                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| Radius         | 14                                                                                                          |
| Speed          | 260 units/s                                                                                                 |
| Health         | one touch                                                                                                   |
| Start position | Equilateral triangle centred in the arena, side 300                                                         |
| Look           | Janitors with a blue, yellow or pink cap and tank, numbered 1 to 3, each standing on a ring of their colour |

### 3.1 Movement

- Four direction keys per player.
- Movement is eased: a player reaches full speed in about a tenth of a second and glides to a stop
  over about a body length, and turns to face the way it moves instead of snapping. This is what
  makes it feel smooth; it is short enough not to feel sluggish.
- Two perpendicular keys move diagonally, at the same speed as straight movement.
- Opposite keys cancel each other.
- Players can overlap each other and cross lasers freely. Lasers never hurt players.

### 3.2 Keyboard layout

Keys are matched by physical position (`KeyboardEvent.code`), so the layout is the same on QWERTY,
QWERTZ and AZERTY keyboards. Players sit left, middle, right:

```
   Q [W] E  R  T  Y  U [I] O  P
    [A][S][D] F  G  H [J][K][L]
      Z  X  C  V  B  N  M  ,  .  /          [↑]
                                         [←][↓][→]
       P1 (left)        P2 (middle)       P3 (right)
```

| Player | Up        | Left        | Down        | Right        |
| ------ | --------- | ----------- | ----------- | ------------ |
| P1     | `KeyW`    | `KeyA`      | `KeyS`      | `KeyD`       |
| P2     | `KeyI`    | `KeyJ`      | `KeyK`      | `KeyL`       |
| P3     | `ArrowUp` | `ArrowLeft` | `ArrowDown` | `ArrowRight` |

Other keys: `Enter` / `Space` start and restart, `KeyP` pauses, `Backquote` toggles the debug overlay.

### 3.3 Death

Any player touched by an enemy ends the run for the whole team. Nobody sits out and watches, and the
triangle is always a triangle.

---

## 4. Lasers (sanitizer streams)

A working stream is drawn as a thick mint jet with foam bubbles running along it. A stream cut by
furniture is moving amber dashes; one stretched too far is a line of drips.

- Three lasers, one between each pair of players, centre to centre.
- **Max length 520 units, with warning and grace.** A laser does not switch off the moment it is
  too long:
     - From 70% of the max length it shows strain: the stream thins and shifts from mint to orange,
       more the closer it gets. This is the continuous warning.
     - Beyond the max length it turns red and blinks, faster and faster, and still works. It snaps
       after 1 second of this. Time spent overstretched is remembered and drains at twice the
       speed once the players are back in range, so hovering at the limit does not reset it.
     - Beyond 1.4 times the max length it snaps at once.
     - A snapped laser (a line of drips) works again as soon as the two players are back in range.

     Without a limit, players stand in three corners and cover the whole map.

- A pillar between two players cuts their laser (§2.1).
- An enemy is hit when its distance to the laser line is `≤ enemy radius + 3`.
- A laser deals **120 damage per second** while touching. Chasers and Dashers (1 HP) die instantly;
  the Brute takes about 1.25 s.
- Consequence to know about: an enemy coming at a player from outside the triangle reaches the player
  before any laser. Players must turn the triangle so an edge faces each threat. That is the game.

---

## 5. Enemies

All enemies head for the **nearest player** and end the run on contact.

|             | Chaser       | Dasher                                                       | Brute                                                    |
| ----------- | ------------ | ------------------------------------------------------------ | -------------------------------------------------------- |
| In the game | Homeless man | Drug addict; shakes and shows a dashed line before sprinting | Riot cop with a bar showing how much of him is still dry |
| Radius      | 12           | 12                                                           | 26                                                       |
| HP          | 1            | 1                                                            | 150                                                      |
| Speed       | 90           | 120, dash 750                                                | 50                                                       |

- **Chaser:** walks straight at the nearest player.
- **Dasher:** walks until within 300 units of its target, stops for 0.7 s and shows a line where it will
  go (direction is fixed at that moment), then dashes along it for 0.45 s. Repeats.
- **Brute:** moves like a Chaser but slow and tough. Walking across one laser does not kill it, so
  players have to follow it with a laser or catch it with two.

Code-wise there are only two behaviours: _seek_ (Chaser, Brute) and _dash_ (Dasher). The Brute is just
different numbers.

---

## 6. Waves

Enemies arrive in waves with a quiet break between them, so there is time to breathe and to
regroup. A wave ends when everyone in it has walked in and is gone; then comes a 6-second break
(4 seconds before the very first wave) with a board announcing the next one.

The first five waves are written by hand, and **each adds exactly one new thing**:

| Wave | Who walks in                             | Entrances | New                        |
| ---- | ---------------------------------------- | --------- | -------------------------- |
| 1    | 4 Chasers                                | 1         | The basics: sweep a stream |
| 2    | 7 Chasers                                | 1         | Power-ups (§6.1)           |
| 3    | 6 Chasers, 2 Dashers                     | 2         | Dashers                    |
| 4    | 8 Chasers, 3 Dashers                     | 2         | Trains (§6.2)              |
| 5    | 8 Chasers, 3 Dashers, 1 Brute            | 3         | Brutes                     |
| 6+   | 10 / 3 / 1, then +2 / +1 / +0.5 per wave | 4         | Nothing new, more of it    |

- Within a wave enemies walk in one at a time (every 1.8 s in wave 1, down to 0.4 s late on), in
  random order, 40 units outside the arena.
- A wave uses only some of the four walls, chosen at random. One wall at first, so the crew can
  face one way; all four from wave 6.
- Before each wave the board says its number and, for the first five, one line on what is new.

### 6.1 Power-ups

A power-up lies on the floor as a round token. A player walking over it picks it up **for the whole
crew**. One is placed at the start of every wave from wave 2 on, and anyone washed away has a 6%
chance of leaving one behind. At most 3 lie on the floor; each disappears after 14 s (blinking for
the last 4).

| Power-up        | Effect                                                               | Lasts      |
| --------------- | -------------------------------------------------------------------- | ---------- |
| Coffee          | The crew walks 1.4 times as fast                                     | 10 s       |
| Long hose       | Lasers reach 1.5 times as far before they strain                     | 12 s       |
| Pressure washer | Lasers are 4 times as wide and soak 3 times as fast                  | 10 s       |
| Wet floor       | Everyone but the crew walks at half speed                            | 8 s        |
| Bubble shield   | The crew survives one touch; whoever touches is washed away. Up to 2 | until used |
| Foam bomb       | Washes away everyone within 260 units of the janitor who took it     | at once    |

Picking up an effect that is already running restarts its clock; it does not stack. Running
effects are shown under the HUD board with a bar for the time left; shields as a soap bubble around
every janitor.

### 6.2 Trains

Two tracks run through the hall from top to bottom, at x = 480 and x = 1120, each with a yellow
line on either side marking exactly how wide a train is. No furniture is ever placed on a track.

From wave 4 on, each wave has one train (two from wave 10) at a random moment:

1. **Warning, 2.5 s:** one track flashes red, with arrows running the way the train will come, and
   a red "Pozor, vlak!" sign appears. Nothing is dangerous yet.
2. **The train** crosses at 1500 units/s: three cars, 760 units long, in a random direction.

Anyone under it is hit. Enemies are removed and count as washed away, Brutes included, so luring a
crowd onto a flashing track is a good move. A player under it ends the run; shields do not help.

---

## 7. Screens and HUD

Every screen is a station departure board: black panel, amber letters, a blue strip with the station
name across the top.

- **Title:** the name, each janitor with their keys, and the three kinds of visitor with one line
  on what each does. All the characters walk on the spot.
- **Playing:** a small board in the corner with time on shift and how many were washed away.
- **Paused:** "Shift paused". The game also pauses itself when the window loses focus.
- **Shift over:** time on shift, number washed away, "Press Enter for a new shift".
- **Debug overlay** (`` ` ``): FPS, enemy count, the current wave and the keys currently held. The
  last one lets you check whether your keyboard registers all three players at once (see §9).

---

## 8. Technical design

### 8.1 Stack

- **TypeScript** (strict) + **HTML5 Canvas 2D**. No game engine: we draw circles, lines and text.
- **Vite** for the dev server and build, **Vitest** for tests, **ESLint + Prettier** with default rules.
- No runtime dependencies. Runs in any modern browser.
- Scripts: `npm run dev`, `npm run build`, `npm test`, `npm run lint`.

### 8.2 Structure

Three parts with one-way dependencies:

```
  input  ──▶  simulation  ──▶  render
(keyboard)   (game rules)     (canvas)
```

- **Simulation** is plain TypeScript: no DOM, no canvas. It receives the time step, the players'
  directions and a random-number function as arguments. This is what the unit tests cover.
- **Render** only reads the world and draws it.
- **Input** turns held keys into a direction per player.

The loop runs the simulation at a fixed 60 steps per second and draws once per browser frame, so the
game behaves the same on any monitor.

### 8.3 What happens each step

1. Count down the timed power-up effects
2. Move players (keys → eased velocity → position, out of pillars, kept inside the arena)
3. Update enemies (behaviour steers around pillars, then move)
4. Collect power-ups (a foam bomb soaks enemies here)
5. Update lasers (strain, snapping, cut by pillars; damage enemies)
6. Update the train (warning, then movement; hits enemies and players)
7. Check contact (enemy touches player → shield used, or game over)
8. Remove enemies with no health left (count them, leave a splash, maybe a power-up)
9. Run the waves (breaks, arrivals, announcing trains)
10. Forget finished splashes and power-ups nobody came for

Everything that can take an enemy out (4 to 6) runs before contact (7), and contact ignores enemies
already out of health: if an enemy is hit and touches a player in the same step, the crew lives.

When a player is caught the world stands still for 1.4 s, with a red ring on that player, before the
result screen comes up, so everyone sees what happened.

### 8.4 Files

One responsibility per file, target under ~150 lines each.

```
src/
  main.ts                   creates everything and starts the loop
  config/                   every tunable number: index.ts, plus enemies, waves, powerups, keys
  Game.ts                   phase (title / playing / paused / gameOver), start, restart
  GameLoop.ts               fixed 60 Hz step + draw per frame
  math/
    vec2.ts                 small vector helpers
    geometry.ts             point-to-segment distance, circle overlap, pushing circles apart
    angles.ts               direction of a vector, turning towards an angle
    random.ts               the random-number function type, and a repeatable seeded one
  input/
    Keyboard.ts             which keys are held; clears on window blur
    playerInput.ts          held keys + bindings → direction for each player
    gameKeys.ts             list of every key the game uses
  world/
    World.ts                players, pillars, enemies, lasers, time, kills
    Player.ts
    Enemy.ts
    Laser.ts
    Obstacle.ts             a pillar: position and radius
    generateObstacles.ts    random pillar layout that follows the placement rules
    Splash.ts               the burst left where an enemy was removed
    Powerup.ts              something on the floor to pick up
    Train.ts                a train event: warning, then the train
    Wave.ts                 where the run is in its sequence of waves
  enemies/
    EnemyBehavior.ts        interface: update(enemy, world, dt) sets the enemy's velocity
    SeekBehavior.ts         Chaser and Brute
    DashBehavior.ts         Dasher
    nearestPlayer.ts        target choice shared by both behaviours
    steerAround.ts          direction that brushes past a pillar in the way
    createEnemy.ts          type → enemy with the right stats and behaviour
  systems/
    step.ts                 runs the ten steps of §8.3 in order
    modifiers.ts            the numbers power-ups change (speed, reach, width, damage)
    movePlayers.ts
    updateEnemies.ts
    buildLasers.ts          one laser per pair: blocked, strain, overstretch, snapped
    updateLasers.ts         rebuilds the lasers and damages enemies
    updateTrain.ts          announces a train, drives it, hits what is under it
    checkContacts.ts
    removeWashedEnemies.ts  removes enemies with no health; kills, splashes, drops
    keepOutOfObstacles.ts   pushes a player or enemy out of any pillar it ran into
    tidyUp.ts               counts down effects; forgets old splashes and power-ups
    powerups/               collectPowerups, applyPowerup (one line per kind), placePowerups
    waves/                  planWave (what a wave contains), runWaves, spawnPoint
  render/
    Viewport.ts             scales the hall to the window
    WorldRenderer.ts        draws one frame, back to front; owns the floor picture
    palette.ts              colours shared across the drawing code
    shapes.ts               small filled shapes with the cartoon outline
    text.ts                 text drawing and time formatting
    drawStreams.ts          sanitizer streams: working, cut, overstretched
    drawSplashes.ts         foam bursts
    drawTrain.ts            track warning and the train
    colors.ts               blending two colours
    drawPlayers.ts          janitors and the ring under each
    drawEnemies.ts          picks who each enemy kind is; sprint warning; dry bar
    station/                the floor picture: tiles, mosaic, tactile strips, entrances,
                            signs, lighting (one file each)
    characters/             sprite.ts (pose, shadow, feet, hands) and one file each for
                            the janitor, homeless man, addict and cop
    props/                  drawObstacles.ts picks furniture by size; one file each for
                            the recycling bin, planter and kiosk
    powerups/               tokens on the floor and the pictogram for each kind
    screens/                board.ts (departure board), title, HUD, wave and train
                            announcements, pause / shift over, debug overlay
tests/                      unit tests for the game rules
```

### 8.5 Coding rules

- One job per file and per function. Functions under ~30 lines.
- No magic numbers: tunables live in `config.ts`.
- New enemy type = a config entry, plus a new `EnemyBehavior` only if it moves in a new way.
  No `if (type === …)` scattered through the code.
- Simulation code never imports from `render/` or `input/` and never uses `window`, `document` or
  `Math.random` directly (randomness is passed in, so tests are repeatable).
- TypeScript `strict`, no `any`.

### 8.6 Tests

152 unit tests cover the rules. By area:

- **Geometry and movement:** distances, pushing circles apart, easing in and out, turning the short
  way round, steering past a pillar without touching it.
- **Lasers:** damage, pillars cutting them, strain, the grace second, snapping, recovery.
- **Waves:** each scripted wave adds at most one new thing; waves keep growing; nobody walks in
  during a break; a wave does not end while some of it has still to arrive.
- **Power-ups:** what each one does, timing out, where they appear, limits.
- **Trains:** harmless while only a warning; catches players and removes enemies on the track;
  misses anyone beside it; no furniture and no start position on a track.
- **Flow:** same-step ties go to the crew; the pause before the result screen; restart.

Rendering and keyboard wiring are checked by playing.

---

## 9. Things the brief didn't mention, handled here

- **Keyboards that drop keys.** Many keyboards can't register 6+ keys at once in some combinations
  and silently lose presses. The debug overlay shows held keys so you can test yours. Gamepads are the
  real fix and the first thing to add later.
- **Standing in the corners.** Solved by the laser max length (§4).
- **Browser shortcuts.** Arrow keys and Space scroll the page, so the game blocks the default action
  for its own keys.
- **Stuck keys.** If the window loses focus while a key is held, the release is never seen. Held keys
  are cleared and the game pauses when focus is lost.
- **Keyboard layouts.** Keys are matched by position, not by letter.
- **Same-step ties.** Laser first, then contact: ties go to the players (§8.3).
- **Monitor speed and window size.** Fixed step rate; arena in logical units scaled to the window.
- **Fast enemies skipping a laser.** At 60 steps per second the fastest enemy moves 12.5 units per
  step and the hit zone around a laser is at least 30 wide, so a simple distance check is enough. If an
  enemy ever gets much faster, this needs revisiting.
- **Colour-blind players.** Players carry numbers; enemy types differ in size and markings.
- **Learning the keys.** The title screen shows them.

---

## 10. Left for later

Sound and music, gamepads, health above one touch, revive, a triangle that survives a death as a single
laser, score and high score, more enemy types (splitter, shooter, one that
disables a laser), safe spawn distance from players, fullscreen key, key rebinding and a numpad
preset, repeatable runs from a seed, online play, pillars of other shapes, enemies that plan a path
around pillars instead of sliding, other stations as maps, painted title art, a Czech language
option.

---

## 11. Milestones

| #   | Deliverable                            | Done when                                                                                        |
| --- | -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| M1  | Project setup and three moving players | `npm run dev` shows the arena; all 3 players move at once; tests and lint pass                   |
| M2  | Lasers and Chasers                     | Three lasers, switching off beyond max length; Chasers spawn at a growing rate and die on lasers |
| M3  | Game flow                              | Contact ends the run; title → play → pause → game over → restart; HUD and debug overlay          |
| M4  | Dasher and Brute, tuning               | Both appear on time and behave as §5; numbers adjusted after 3 people play it                    |

---

## 12. Decisions made

| Topic             | Decision                                                           |
| ----------------- | ------------------------------------------------------------------ |
| A player dies     | The run ends for everyone                                          |
| Diagonal movement | Allowed, same speed as straight                                    |
| Laser max length  | 520 units, with a strain warning and one second of grace           |
| Enemy arrival     | Waves with breaks; the first five each add one new thing           |
| Power-ups         | Six kinds, shared by the whole crew                                |
| Trains            | Two fixed tracks; warning first; hit everyone, shields do not help |
| Obstacles         | Random round pillars; block lasers and movement                    |
| Theme             | Praha hlavní nádraží; janitors, sanitizer, homeless, addicts, cops |
| Art               | Drawn in code, no image files; cartoon tone                        |
| Scoring           | Time survived and kill count, shared by the team                   |
| Platform          | Browser                                                            |
| Keyboard          | Laptop layout: WASD, IJKL, arrows                                  |
