Gameplay:

3-lap races with a 3-2-1-GO countdown and 4 checkpoints that must be passed in order, so no shortcuts.
Arcade handling: you can’t turn while standing still, the pavement slows you to 45% speed, buildings and barriers are solid, and a nitro boost with a cooldown.
Two AI rivals that follow the racing line, brake for corners and overtake.
Live HUD with lap, position, timer, speed and nitro, plus a camera that zooms out as you speed up.
Best times saved per track.
Five KCL power-ups: smash the red ? crates on the track to get one.

Maughan Rush: an all-nighter speed boost that ignores the pavement slowdown.
Holborn Express: turn into an armoured double-decker bus and spin out anyone you hit.
KEATS Lag: every racer ahead of you gets “KEATS LOADING…” and drops to half speed.
Strand Web-Sling: shoot a web at the racer ahead and get pulled forward around the corners.
Reggie’s Roar: the KCL lion mascot roars out a shockwave that spins out nearby rivals.
Online multiplayer:

Up to 4 players; create a room and share a 4-letter code for friends to join.
Everyone sees the same countdown, and every kart moves smoothly in real time.
The server checks laps, positions and power-ups, so results are fair and hard to cheat.
A winner screen at the end, with a “Race Again” button for a quick rematch.
How it’s built:

Game: Phaser 3 and plain JavaScript, built with Vite. The server uses Node.js, Express and Socket.IO.
Art: apart from the landmark buildings and four power-up icons, everything is drawn in code (karts, roads, river, city blocks, particles), so there are no sprite sheets.
Sound: every sound effect is generated live by the browser (Web Audio API): engine hum, countdown beeps, bus horn, lion roar.
Shared rules: the game and the server use the same code for laps and power-ups, so single-player and online behave identically.
How to run it:

npm install

npm run build

npm start

Then open http://localhost:3001. For multiplayer on the same Wi-Fi, other players open http://:3001.
