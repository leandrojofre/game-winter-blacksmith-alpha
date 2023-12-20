function keyDown(event) {
	let key = event.key.toLowerCase();
	
	switch (key) {
		case " ":
			KEY_PRESSED.space = true;
			break;
		case "a":
			KEY_PRESSED.a = true;
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
		case "d":
			KEY_PRESSED.d = false;
			break;
		default:
			break;
	}
}
