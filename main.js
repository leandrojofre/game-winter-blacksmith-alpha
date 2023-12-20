function animateGame() {
	animationID = window.requestAnimationFrame(animateGame);
	CONTEXT.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	
	CONTEXT.fillStyle = "cornflowerblue";
	CONTEXT.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	thisRoom.draw();
	thisRoom.collisions.forEach(tile => tile.draw());	
	thisRoomNpcs.toArray().forEach(npc => npc.draw());
	player.draw();

	player.move();
}

function moveRoom(x, y) {
	for(const OBJ of [...thisRoomNpcs.toArray(), thisRoom])
		OBJ.move(x, y);
}

async function changeRoom(roomName, destinationTileName) {
	thisRoom = ROOMS[roomName];

	for (const NPC_KEY of Object.keys(NPCS))
		if (NPCS[NPC_KEY].room === roomName) thisRoomNpcs.addNPC(NPC_KEY);

	let destinationTile = thisRoom.events.find(tile => tile.name === destinationTileName);
	let newPos = {
		x: destinationTile.x,
		y: destinationTile.y,
		width: destinationTile.width,
		height: destinationTile.height
	};
	let offSetX = player.hitbox.x - newPos.x - (newPos.width / 2 - player.hitbox.width / 2);
	let offSetY = player.hitbox.y - newPos.y - (newPos.height / 2 - player.hitbox.height / 2);

	moveRoom(offSetX, offSetY)
	startGame();
}

async function constructRoom(room) {
	await fetch(`./tiled/${room.name}.json`)
	.then(response => response.json())
	.then(roomData => {
		const SYMBOL_COLLISION = roomData.tilesets.find(tileset => tileset.source === "tiles-tsx\/bounds.tsx").firstgid;
		const SYMBOL_FOREGROUND = SYMBOL_COLLISION + 2;

		const BOUNDS_ARRAY = roomData.layers.find(layer => layer.name === "bounds").data;
		const EVENTS_ARRAY_DATA = roomData.layers.find(layer => layer.name === "events").layers;

		const MAPPED_DATA = [];
		for (let i = 0; i < BOUNDS_ARRAY.length; i += room.width / WIDTH)
			MAPPED_DATA.push(BOUNDS_ARRAY.slice(i, i + room.width / WIDTH));

		MAPPED_DATA.forEach((row, i) => {
			row.forEach((col, j) => {
				if (col === SYMBOL_COLLISION)
					room.collisions.push(new CollisionTile({x: j * WIDTH, y: i * HEIGHT}));
			});
		});

		EVENTS_ARRAY_DATA.forEach(event => {
			event.objects[0].name = event.name;
			event.objects[0].y -= event.objects[0].height;
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
			json[CHARACTER_KEY].imgSrc = `./img/characters/${CHARACTER_KEY}/${json[CHARACTER_KEY].spriteName}.png`;
			json[CHARACTER_KEY].name = CHARACTER_KEY;

			if (CHARACTER_KEY === "player") 
				player = new Player(json[CHARACTER_KEY]);
			else NPCS[CHARACTER_KEY] = new Npc(json[CHARACTER_KEY]);
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
