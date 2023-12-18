function keyDown(event) {
	let key = event.key.toLowerCase();

	switch (key) {
		case " ":
			if (player.velocity.y === 0 && !KEY_PRESSED.space) {
				player.velocity.y = -BASE_SPEED * 5;
				KEY_PRESSED.space = true;
			}
			break;
		case "s":
			console.log(key);
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
		case "s":
			console.log(key);
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

/*
	down
		case "d":
			KEY_PRESSED.d = true;
			player.velocity.x = BASE_SPEED;
			break;

	up
		case "d":
			KEY_PRESSED.d = false;
			if (!KEY_PRESSED.a)
				player.velocity.x = 0;
			else player.velocity.x = -BASE_SPEED;
			break;
*/
