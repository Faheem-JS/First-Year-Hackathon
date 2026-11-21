# Project: KCL KART ROYALE (Browser Web Game)
Build a retro 16-bit 2D top-down arcade kart racer in **Phaser 3 + Vanilla JavaScript + Vite** that runs natively in desktop web browsers on a continuous fictional racing circuit connecting King's College London campuses and central London landmarks.

## Browser & Web Configuration
1. **Full-Viewport Browser Page (`index.html`):**
   - Set `<title>KCL Kart Royale</title>` and style `html, body` with `margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #0d1117; display: flex; align-items: center; justify-content: center;`.
2. **Responsive Browser Canvas (`src/main.js`):**
   - Configure Phaser with `type: Phaser.AUTO`, base dimensions `1024 x 768`, `pixelArt: true`, and `scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }` so the canvas scales crisply to any browser window size without distortion.
   - Configure `physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } }`.
3. **Browser Input & Audio Compliance:**
   - Capture `W, A, S, D, UP, DOWN, LEFT, RIGHT, SPACE` via Phaser's keyboard manager so pressing `Space` or arrow keys never scrolls the browser window.
   - Unlock Web Audio (`AudioContext.resume()`) on the player's first browser click or keypress to satisfy browser autoplay rules.
4. **Portable Static Web Build (`vite.config.js`):**
   - Configure `base: './'` in `vite.config.js` so `npm run build` generates a self-contained static web app in `dist/` that can be hosted on GitHub Pages, Vercel, Netlify, or previewed locally with `npm run preview`.

## Core Technical Constraints
1. **Assets:** Landmark buildings are the **only** external images: the 7 pixel-art PNGs in `public/assets/buildings/` (`1_bush_house_strand.png`, `2_guys_tower.png`, `3_franklin_wilkins_waterloo.png`, `4_parliament_st_thomas.png`, `5_kings_college_hospital.png`, `6_maughan_library.png`, `7_somerset_house.png`; 6 and 7 are transparent, de-noised conversions of the supplied JPEGs, which the game does not load), loaded in `preload()` via relative paths (`assets/buildings/...`, so `base: './'` works) and rendered crisp with `pixelArt: true`. Do NOT reference any other external `.png`, `.jpg`, `.json`, or `.mp3/.wav` files. Generate everything else procedurally — karts, trees, grass, road tiles, kerbs, river textures and particles with Phaser `Graphics` + `generateTexture()` / `RenderTexture` — and synthesize all sound effects (countdown beeps, engine hum, nitro whoosh, lap chime, finish fanfare) with the browser **Web Audio API**.
2. **Modular File Structure:** Organize `src/` cleanly so each feature can be modified without rewriting unrelated code:
   - `src/main.js` — Phaser `Game` initialization, browser scale manager, and scene registration.
   - `src/data/trackData.js` — Single source of truth for every track (`TRACKS`: `london`, `guys`, `waterloo`): world dimensions, closed-loop centerline waypoints, road width, bridge bounds, river geometry, building placements, start grid, and ordered checkpoint zones.
   - `src/data/buildingAssets.js` — The 5 building PNGs: file names, image sizes, display scale (`0.4` = 2 screen px per art pixel) and each sprite's solid 2.5D base-footprint fractions.
   - `src/data/TrackGeometry.js` — Turns a track config into the runtime track (smoothed centerline, surface detection, river edges, checkpoint gates, building art/base rectangles).
   - `src/utils/assets.js` — `preloadBuildingTextures(scene)`: queues the building PNGs in `preload()`.
   - `src/utils/PixelArtGenerator.js` — Procedural 16-bit texture generator for karts, trees, grass, water, the start-line checker and particles (no buildings).
   - `src/utils/SoundFX.js` — Lightweight Web Audio API synthesizer for arcade SFX (gracefully handling locked browser audio contexts).
   - `src/map/TrackBuilder.js` — Renders terrain, grass, River Thames, bridges, road ribbon with red/white apex kerbs, start/finish checkered line, and the PNG building sprites as an Arcade `staticGroup` (`this.buildings`) with base-only hitboxes, Y-depth sorting and readable pixel signs.
   - `src/entities/Kart.js` — Player kart class with arcade vector kinematics, surface detection (tarmac vs. grass), and nitro boost state.
   - `src/entities/AIKart.js` — AI kart subclass following `trackData.js` waypoints with lap/checkpoint tracking.
   - `src/scenes/MenuScene.js` — Retro start menu (`KCL KART ROYALE`, `PLAY`, `INSTRUCTIONS`, best time via `localStorage`).
   - `src/scenes/RaceScene.js` — Main gameplay loop, smooth camera follow (`camera.startFollow`), 3-2-1-GO countdown, checkpoint validation, and fixed-to-camera HUD.
   - `src/scenes/FinishScene.js` — Final standings, total race time, best lap time, and `PLAY AGAIN` / `MAIN MENU` actions.

## Map & Landmarks (`src/data/trackData.js` & `TrackBuilder.js`)
- **Buildings are PNG sprites** (`public/assets/buildings/`), placed per track in `trackData.js` (`buildings: [{ key, label, x, y, labelSide }]`). Each is a real Arcade static physics sprite whose body covers only the **bottom ~40–45% base foundation** of the oblique art (`refreshBody()` → `body.setSize()` → `body.setOffset()`, in that order), so karts collide with the base but can drive *behind* tall roofs. Buildings use depth = base y and karts use depth = `kart.y` each frame (Y-sorting). Every base footprint must stay clear of the road + kerbs (verified by geometry checks) so AI karts never snag. Each track only shows buildings that genuinely belong to its area: the London/Strand circuit has Bush House/Strand (north, by the start/finish straight), Parliament/St Thomas' (riverside by Westminster Bridge), and Somerset House and the Maughan Library side by side along the bottom (south) of the map; the Guy's Campus circuit has Guy's Tower; the Waterloo Campus circuit has the Franklin-Wilkins Building. King's College Hospital (Denmark Hill) is not on any current track but its PNG stays available in `buildingAssets.js`.
- **World Size:** `2400 x 1800` px with world-bound collision enabled.
- **Track Layout:** One wide (`170px` width), continuous closed-loop tarmac circuit with clear inner/outer boundaries, red-and-white corner kerbs, surrounding green park grass, and pixel trees.
- **Original landmark brief (historical — superseded for buildings by the 5 PNG sprites above; the River Thames and the Waterloo/Westminster bridges are still procedural):**
  1. **Strand Campus / King's Building** (North section — Start/Finish checkered line + symmetrical historic Portland stone façade with arched entrance).
  2. **Bush House** (North-West section — Large classical stone building with central pillared portico).
  3. **Waterloo Bridge & River Thames** (Horizontal river channel bisecting the map; wide stone/concrete bridge carrying the track south).
  4. **Waterloo Campus / Franklin-Wilkins Building** (South-West section — Large modern rectangular glass-and-brick campus building).
  5. **St Thomas' Hospital** (South section along the Thames — Multi-wing hospital complex with a red cross emblem).
  6. **Westminster Bridge & Big Ben** (West river crossing back north + iconic clock tower silhouette overlooking the bridge).
  7. **Guy's Campus / Guy's Tower** (South-East loop — Tall brutalist concrete tower).
  8. **The Shard** (Adjacent to Guy's — Tall tapered glass skyscraper silhouette).

## Gameplay & Physics Specifications
- **Player Kart (`Kart.js`):** Red arcade kart with dark tyres, visible front nose cone, and driver helmet.
- **Controls & Kinematics:**
  - `W` / `ArrowUp`: Accelerate (`ACCEL = 420`, `MAX_SPEED = 460`).
  - `S` / `ArrowDown`: Brake / Reverse (`BRAKE = 520`, `MAX_REVERSE = -160`).
  - `A` / `ArrowLeft` and `D` / `ArrowRight`: Steer (`TURN_RATE = 2.8 rad/s`). **Critical rule:** Scale angular velocity by forward/reverse speed (`turnFactor = Phaser.Math.Clamp(Math.abs(speed) / 90, 0, 1)`) so the kart cannot rotate in place while stationary.
  - Apply natural tarmac rolling drag (`FRICTION = 0.985` per frame) and lateral velocity damping so turns feel crisp and arcade-like without sliding sideways endlessly.
- **Collisions & Off-Road:**
  - Driving off the tarmac onto grass caps max speed to `45%` (`~205 px/s`) and applies heavier drag, kicking up green pixel dust particles.
  - Buildings (base footprint only), the river and the outer perimeter barriers have solid Arcade static physics bodies so karts bounce/slide cleanly along walls without clipping inside buildings.
- **Race Rules & Checkpoints:**
  - `3 - 2 - 1 - GO!` countdown freezes player and AI movement until `GO!`.
  - **4 Ordered Checkpoints:** `CP0` (near Bush House), `CP1` (Waterloo / Franklin-Wilkins), `CP2` (St Thomas' Hospital), `CP3` (Guy's Tower / The Shard). Crossing the Start/Finish line increments the lap counter ONLY when all 4 checkpoints have been triggered in strict sequential order (`0 -> 1 -> 2 -> 3 -> Finish`).
  - **3 Laps total.** Live HUD displays: `LAP 1/3`, `POS 1/3`, elapsed `TIME (MM:SS.ms)`, `SPEED (KM/H)`, and `NITRO` bar.
- **Nitro Boost:**
  - Pressing `Space` activates a `3.0s` boost (`1.45x` max speed + blue exhaust flame trail), followed by a `5.0s` cooldown. Cannot be triggered while on cooldown or during countdown.
- **AI Opponents (`AIKart.js`):**
  - Spawn 2 AI karts (Royal Blue and Emerald Green) staggered behind the player on the Strand starting grid.
  - Follow an array of ~18 centerline waypoints around the loop using smooth steering interpolation, running at `86%` and `93%` of player base speed with slight cornering deceleration. Track their checkpoints and laps to compute live race standings (`1st / 2nd / 3rd`).

## Execution Workflow (Mandatory Phase Gates)
Execute this build in **5 sequential phases**. Complete ONLY one phase per prompt, verify there are zero syntax/runtime errors, list the files created/modified, and tell me how to test it in the browser before proceeding:
- **Phase 1:** Browser setup (`index.html`, `vite.config.js`, `main.js`) and map modules (`trackData.js`, `PixelArtGenerator.js`, `TrackBuilder.js`) rendering the full KCL circuit, Thames, bridges, and all 8 labelled landmarks in the browser.
- **Phase 2:** Player `Kart.js` on the Strand grid, keyboard movement with browser key capture, speed-scaled turning, grass slowdown, building collisions, and camera follow.
- **Phase 3:** `3-2-1-GO` countdown, 4 ordered checkpoints, 3-lap counter, live timer, HUD, `FinishScene.js`, and browser restart loop.
- **Phase 4:** 2 waypoint-following `AIKart.js` racers, live position ranking (`1st/3`), and `Space` Nitro boost with blue flame trail and HUD cooldown meter.
- **Phase 5:** `MenuScene.js` (title, Play, Instructions, `localStorage` best time), `SoundFX.js` browser Web Audio effects, and visual/UI polish.

Start now with **Phase 1 only**.
