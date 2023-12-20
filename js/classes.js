class Tile{
	constructor({x, y}) {
		this.x = x;
		this.y = y;
		this.width = WIDTH;
		this.height = HEIGHT;
	}

	draw() {
		CONTEXT.fillStyle='red';
		CONTEXT.fillRect(
			this.x,
			this.y,
			this.width,
			this.height
		);				
	}
}

class CollisionTile extends Tile {
	constructor({x,
		y}) {
		super({x, y});
	}
}

class EventTile extends Tile {
	constructor({x, y, width, height, name}) {
		super({x, y});
		this.width = width;
		this.height = height;
		this.name = name;
	}
}

class Sprite {
	constructor({name="", x=0, y=0, width=0, height=0, imgSrc, sx=0, sy=0, frameStart=0, frameEnd=1}) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.img = new Image();
		this.img.src = imgSrc;
		this.frameCrop = {
			x: sx,
			y: sy,
			width: this.width,
			height: this.height,
			counter: 0,
			rate: 4,
			start: frameStart,
			end: frameEnd
		}
	}

	updateFrame() {
		this.frameCrop.counter++;

		if (this.frameCrop.counter < this.frameCrop.end && animationID % this.frameCrop.rate === 0)
			this.frameCrop.counter++;
		else this.frameCrop.counter = this.frameCrop.start;

		this.frameCrop.x = this.frameCrop.counter * this.frameCrop.width
	}

	draw() {
		CONTEXT.imageSmoothingEnabled = false;
		CONTEXT.drawImage(
			this.img,
			this.frameCrop.x,
			this.frameCrop.y,
			this.frameCrop.width,
			this.frameCrop.height,
			this.x,
			this.y,
			this.width,
			this.height
		);

		this.updateFrame();
	}
}

class Room extends Sprite{
	constructor({name, x, y, imgSrc}) {
		super({
			name,
			x,
			y,
			imgSrc
		});
		this.img.onload = () => {
			this.width = this.img.width;
			this.height = this.img.height;
			this.frameCrop.width = this.img.width;
			this.frameCrop.height = this.img.height;
		}
		this.collisions = [];
		this.events = [];
	}

	move(x, y) {
		for(const OBJ of [this, ...this.collisions, ...this.events]) {
			OBJ.x += x;
			OBJ.y += y;
		}
	}
}

class Character extends Sprite{
	constructor({name, x, y, width, height, imgSrc, room}) {
		super({
			name,
			x,
			y,
			width,
			height,
			imgSrc
		});
		this.room = room;
	}
}

class Player extends Character{
	constructor({name, width, height, imgSrc, room}) {
		super({
			name,
			x: SCREEN_WIDTH / 2 - width / 2,
			y: SCREEN_HEIGHT * (3/5) - height / 2,
			width,
			height,
			imgSrc,
			room
		});
		this.isOnGround = false;
		this.velocity = {
			y: 0,
			x: 0,
			gravity: 1
		};
		this.hitbox = {
			x: this.x + WIDTH * 3,
			y: this.y + HEIGHT * 1.5,
			width: WIDTH * 2,
			height: HEIGHT * 2.5
		};
	}

	checkCollisions(obj) {
		return (
			this.hitbox.x <= obj.x + obj.width &&
			this.hitbox.x + this.hitbox.width >= obj.x &&
			this.hitbox.y + this.hitbox.height >= obj.y &&
			this.hitbox.y <= obj.y + obj.height
		);
	}

	checkHorizontalCollisions() {
		moveRoom(-this.velocity.x, 0);
		for(const TILE of thisRoom.collisions) {
			if (!this.checkCollisions(TILE)) continue;
			
			if (this.velocity.x < 0) {
				moveRoom(-(TILE.x + TILE.width + 0.01 - this.hitbox.x), 0);
				break;
			}
			if (this.velocity.x > 0) {
				moveRoom(-(TILE.x - this.hitbox.width - 0.01 - this.hitbox.x), 0);
				break;
			}
		}
	}

	checkVerticalCollisions() {
		this.velocity.y += this.velocity.gravity;
		moveRoom(0, -this.velocity.y);
		for(const TILE of thisRoom.collisions) {
			if (!this.checkCollisions(TILE)) continue;

			if (this.velocity.y < 0) {
				this.velocity.y = 0;
				moveRoom(0, -(TILE.y + TILE.height + 0.01 - this.hitbox.y));
				break;
			}
			if (this.velocity.y > 0) {
				this.velocity.y = 0;
				this.isOnGround = true;
				moveRoom(0, -(TILE.y - this.hitbox.height - 0.01 - this.hitbox.y));
				break;
			}
		}
	}

	move() {
		this.velocity.x = 0;
		if (KEY_PRESSED["a"])
			this.velocity.x = -BASE_SPEED;
		if (KEY_PRESSED["d"])
			this.velocity.x = BASE_SPEED;

		this.checkHorizontalCollisions();

		if (KEY_PRESSED[" "] && this.isOnGround) {
			this.isOnGround = false;
			this.velocity.y = -BASE_SPEED * 5;
		}

		this.checkVerticalCollisions();

		CONTEXT.fillStyle = "rgba(255, 0, 0, 0.2)"
		CONTEXT.fillRect(
			this.hitbox.x,
			this.hitbox.y,
			this.hitbox.width,
			this.hitbox.height
		);		
	}
}

class Npc extends Character{
	constructor({name, width, height, imgSrc, room}) {
		super({
			name,
			x: ROOMS[room].events.find(event => event.name === `spawn-${name}`).x,
			y: ROOMS[room].events.find(event => event.name === `spawn-${name}`).y,
			width,
			height,
			imgSrc,
			room
		});
	}

	move(x, y) {
		this.x += x;
		this.y += y;
	}
}
