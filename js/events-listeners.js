function keyDown(event) {
	let key = event.key.toLowerCase();
	KEY_PRESSED[key] = true;
}

function keyUp(event) {
	let key = event.key.toLowerCase();
	KEY_PRESSED[key] = false;
}
