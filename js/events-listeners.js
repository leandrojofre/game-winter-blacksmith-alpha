function keyDown(event) {
	let key = event.key.toLowerCase();

	player.frameCrop.active = true;
	KEY_PRESSED[key] = true;
}

function keyUp(event) {
	let key = event.key.toLowerCase();

	KEY_PRESSED[key] = false;

	for(const KEY of Object.keys(KEY_PRESSED))
		if (KEY_PRESSED[KEY]) return;

	player.frameCrop.active = false;
	player.frameCrop.x = 0;
}
