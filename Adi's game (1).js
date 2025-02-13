/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started
@title: PEW PEW GALAXY!!!!
@author: Adi Saif
@tags: []
@addedOn: 2024-12-06
*/
// A to move left D to move Right, and I to shoot

const player = "p";
const alien = "a";
const background = "b";
const bullet = "i";

setLegend(
  [player, bitmap`
................
................
................
................
.......55.......
......5DD5......
.....5DDDD5.....
....55D55D55....
...5D5D55D5D5...
..5DD5DDDD5DD5..
.55555DDDD55555.
.....D5555D.....
................
................
................
................`],
  [alien, bitmap`
................
................
................
................
................
......DDDDD.....
.....D55555D....
....DD5D5D5DD...
...D555555555D..
....D55DDD55D...
.....D55555D....
......DDDDD.....
................
................
................
................`],
  [background, bitmap`
0000000000000000
0000000000000000
00000H0000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
000000000000H000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
00H0000000000000
0000000000000000
0000000000000000
0000000000000000`],
  [bullet, bitmap`
................
................
................
................
................
................
................
................
................
................
................
....3......3....
....3......3....
....3......3....
....3......3....
................`]
);

setBackground(background);
setSolids([player]);

let level = 0;
const levels = [
  // Level 1
  map`
.............
.............
a.a.a.a.a.a.a
.a.a.a.a.a.a.
.............
.............
.............
.............
.............
......p......`,

  // Level 2
  map`
.............
..a.....a....
.aaa...aaa...
.............
.....a.....a.
....aaa...aaa
.............
.............
.............
......p......`,

  // Level 3
  map`
.............
.........a...
a...a...a.a..
.a.a.a.a...a.
..a...a.....a
.............
.............
.............
.............
......p......`,
  // Level 4
  map`
..aaaaaaaaa..
.............
..aaaaaaaaa..
.............
.............
.............
.............
.............
.............
......p......`,
  // Level 5
  map`
.a..a..a..a..
.a..a..a..a..
.a..a..a..a..
.............
.............
.............
.............
.............
.............
......p......`,
  // Level 6
  map`
.............
a...a..a...a.
.a.a....a.a..
..a......a...
.............
.............
.............
.............
.............
......p......`,
  // Level 7
  map`
...aaaaaaa...
..a.a...a.a..
.a...aaa...a.
a...........a
.............
.............
.............
.............
.............
......p......`,
  // Level 8
  map`
.............
......a......
.....a.a.....
....a...a....
...a.....a...
.............
.............
.............
.............
......p......`,
  // Level 9
  map`
.....a.....a.
..a.aaa.a.aaa
.aaa...aaa...
.............
.............
.............
.............
.............
.............
......p......`,
  // FINAL LEVEl <_>
  map`
..a.......a..
.aaa.....aaa.
..a.......a..
.............
..a.......a..
...aaaaaaa...
.............
.............
.............
......p......`,

];

setMap(levels[level]);

setPushables({
  [player]: []
});

// Alien movement variables
let alienDirection = 1;
let shouldMoveDown = false;
let horizontalInterval;
let verticalInterval;

// Modified alien movement
function startAlienMovement() {
  const baseSpeed = 2000;
  const speedMultiplier = 1 + (level * 0.4); // 40% slower per level

  horizontalInterval = setInterval(() => {
    const aliens = getAll(alien);
    if (!shouldMoveDown && aliens.length > 0) {
      aliens.forEach(a => a.x += alienDirection);

      if (aliens.some(a => a.x >= 10 || a.x <= 0)) {
        alienDirection *= -1;
        shouldMoveDown = true;
      }
    }
  }, baseSpeed * speedMultiplier);

  verticalInterval = setInterval(() => {
    if (shouldMoveDown) {
      const aliens = getAll(alien);
      aliens.forEach(a => a.y += 1);
      shouldMoveDown = false;

      if (aliens.some(a => a.y === getFirst(player).y)) {
        endGame("GAME OVER");
      }
    }
  }, 5000 * speedMultiplier);
}

// Player controls
onInput("a", () => {
  const playerPos = getFirst(player);
  if (playerPos.x > 0) playerPos.x -= 1;
});

onInput("d", () => {
  const playerPos = getFirst(player);
  if (playerPos.x < 12) playerPos.x += 1;
});

onInput("s", () => {
  const playerPos = getFirst(player);
  if (playerPos.y < 10) playerPos.y += 1;
});

// Shooting system
onInput("i", () => {
  const playerPos = getFirst(player);
  addSprite(playerPos.x, playerPos.y - 1, bullet);
});

setInterval(() => {
  getAll(bullet).forEach((proj) => {
    proj.y -= 1;

    const hitAlien = getTile(proj.x, proj.y).find(s => s.type === alien);
    if (hitAlien) {
      hitAlien.remove();
      proj.remove();
      checkWin();
    }

    if (proj.y < 0) proj.remove();
  });
}, 125);

// Game logic
function checkWin() {
  if (getAll(alien).length === 0) {
    level++;
    if (level < levels.length) {
      setMap(levels[level]);
      startAlienMovement();
    } else {
      endGame("ALIENS DEFEATED!!!");
    }
  }
}

function endGame(message) {
  clearInterval(horizontalInterval);
  clearInterval(verticalInterval);
  getAll(alien).forEach(alien => alien.remove());
  
  onInput("a", () => {});
  onInput("d", () => {});
  onInput("i", () => {});
  
  addText(message, { y: 6, color: color`D` });
}

// Start the game
startAlienMovement();