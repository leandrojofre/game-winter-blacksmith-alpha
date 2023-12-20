function keyDown(event) {
	let key = event.key.toLowerCase();
	
	switch (key) {
		case " ":
			if (!KEY_PRESSED.space && player.velocity.y === 0) {
				KEY_PRESSED.space = true;
				player.velocity.y = -BASE_SPEED * 4;
			}
			break;
		case "a":
			KEY_PRESSED.a = true;
			break;
		case "s":
			KEY_PRESSED.s = true;
			break;
		case "d":
			KEY_PRESSED.d = true;
			break;
		default:
			break;
	}
}

function keyUp(event) {
	let key = event.key.toLowerCase();

	switch (key) {
		case " ":
			KEY_PRESSED.space = false;
			break;
		case "a":
			KEY_PRESSED.a = false;
			break;
		case "s":
			KEY_PRESSED.s = false;
			break;
		case "d":
			KEY_PRESSED.d = false;
			break;
		default:
			break;
	}
}
