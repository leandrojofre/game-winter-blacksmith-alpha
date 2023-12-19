const $GAME_DISPLAY = document.getElementById("game-display");
const CONTEXT = $GAME_DISPLAY.getContext('2d');
const SCREEN_WIDTH = 64 * 16;
const SCREEN_HEIGHT = 64 * 10;
const BASE_SPEED = 4;
const WIDTH = 32;
const HEIGHT = 32;
const KEY_PRESSED = {
	w: false,
	a: false,
	s: false,
	d: false,
	space: false
}
const ROOMS = {};
const NPCS = {};

$GAME_DISPLAY.width = SCREEN_WIDTH;
$GAME_DISPLAY.height = SCREEN_HEIGHT;

let player;
let animationID;
let thisRoom;
let thisRoomNpcs;