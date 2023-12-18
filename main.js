function animateGame() {
	animationID = window.requestAnimationFrame(animateGame);
	CONTEXT.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	
	CONTEXT.fillStyle = "cornflowerblue";
	CONTEXT.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	ROOMS.test.draw();
	
	player.draw();
	NPCS.placeholder.draw();
	player.walk();
}

function moveObjects(x, y) {
	thisRoom.setPos(x, y);

	for (const NPC_KEY of Object.keys(thisRoomNpcs))
		thisRoomNpcs[NPC_KEY].setPos(x, y);
}

async function changeRoom(roomName, destinationTileName) {
	thisRoom = ROOMS[roomName];
	thisRoomNpcs = {};

	for (const NPC_KEY of Object.keys(NPCS))
		if (NPCS[NPC_KEY].room === roomName) thisRoomNpcs[NPC_KEY] = NPCS[NPC_KEY];

	let destinationTile = thisRoom.events.find(tile => tile.name === destinationTileName);
	let newPos = {
		x: destinationTile.x,
		y: destinationTile.y,
		width: destinationTile.width,
		height: destinationTile.height
	};
	let offSetX = player.x - newPos.x - (newPos.width / 2 - player.width / 2);
	let offSetY = player.y - newPos.y - (newPos.height / 2 - player.height / 2);

	moveObjects(offSetX, offSetY);
	startGame();
}

async function constructRoom(room) {
	await fetch(`./tiled/${room.name}.json`)
	.then(response => response.json())
	.then(roomData => {
		const SYMBOL_COLLISION = roomData.tilesets.find(tileset => tileset.source === "tiles-tsx\/bounds.tsx").firstgid;
		const SYMBOL_EVENT = SYMBOL_COLLISION + 1;
		const SYMBOL_FOREGROUND = SYMBOL_COLLISION + 2;
		const SYMBOL_SPAWN = SYMBOL_COLLISION + 3;

		const BOUNDS_ARRAY = roomData.layers.find(layer => layer.name === "bounds").data;
		const EVENTS_ARRAY_DATA = roomData.layers.find(layer => layer.name === "events").layers;

		const MAPPED_DATA = [];
		for (let i = 0; i < BOUNDS_ARRAY.length; i += room.width / WIDTH)
			MAPPED_DATA.push(BOUNDS_ARRAY.slice(i, i + room.width / WIDTH));

		MAPPED_DATA.forEach((row, i) => {
			row.forEach((col, j) => {
				if (col === SYMBOL_COLLISION)
					room.collisions.push(new CollisionTile({x: i * WIDTH, y: j * HEIGHT}));
			});
		});

		EVENTS_ARRAY_DATA.forEach(event => {
			event.objects[0].name = event.name;
			room.events.push(new EventTile(event.objects[0]));
		});
	});
}

async function createObjects() {
	await fetch("./json/rooms.json")
	.then(response => response.json())
	.then(async json => {
		for (const ROOM_KEY of Object.keys(json)) {
			json[ROOM_KEY].imgSrc = `./img/rooms/${ROOM_KEY}/room.png`;
			ROOMS[ROOM_KEY] = new Room(json[ROOM_KEY]);

			await constructRoom(ROOMS[ROOM_KEY]);
		}
	});

	await fetch("./json/characters.json")
	.then(response => response.json())
	.then(json => {
		for (const CHARACTER_KEY of Object.keys(json)) {
			console.log(CHARACTER_KEY);
			json[CHARACTER_KEY].imgSrc = `./img/characters/${CHARACTER_KEY}/sprite.png`;

			if (CHARACTER_KEY === "player") {
				player = new Player(json[CHARACTER_KEY]);
			} else NPCS[CHARACTER_KEY] = new Npc(json[CHARACTER_KEY]);
		}
	});

	changeRoom("test", "spawn-player");
}

function startGame() {
	window.addEventListener("keydown", keyDown);
	window.addEventListener("keyup", keyUp);	
	animateGame();
}

function stopGame() {
	window.cancelAnimationFrame(animationID);
	window.removeEventListener("keydown", keyDown);
	window.removeEventListener("keyup", keyUp);
}

window.addEventListener("load", createObjects);
