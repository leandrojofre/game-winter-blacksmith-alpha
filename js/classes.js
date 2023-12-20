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
	constructor({x, y}) {
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
	constructor({name="", x=0, y=0, width=0, height=0, imgSrc, sx=0, sy=0, animationActive = false, frameStart=0, frameEnd=1, frameRate}) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.img = new Image();
		this.img.src = imgSrc;
		this.frameCrop = {
			active: animationActive,
			x: sx,
			y: sy,
			width: width,
			height: height,
			counter: 0,
			rate: frameRate,
			start: frameStart,
			end: frameEnd
		}
	}

	updateFrame() {
		if (animationID % this.frameCrop.rate !== 0) return;

		if (this.frameCrop.counter < this.frameCrop.end)
			this.frameCrop.counter++;
		else
			this.frameCrop.counter = this.frameCrop.start;

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

		if (this.frameCrop.active) this.updateFrame();
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
	constructor({name, x, y, width, height, imgSrc, room, animationActive, frameStart, frameEnd, frameRate}) {
		super({
			name,
			x,
			y,
			width,
			height,
			imgSrc,
			animationActive,
			frameStart,
			frameEnd,
			frameRate
		});
		this.room = room;
	}

	changeSprite(imgName) {
		let newImg = new Image();
		newImg.src = `img/characters/${this.name}/${imgName}.png`;

		if (newImg.src === this.img.src) return;
		newImg.onload = () => this.img = newImg;
	}
}

class Player extends Character{
	constructor({name, width, height, imgSrc, room, animationActive, frameStart, frameEnd, frameRate}) {
		super({
			name,
			x: SCREEN_WIDTH / 2 - width / 2,
			y: SCREEN_HEIGHT * (3/5) - height / 2,
			width,
			height,
			imgSrc,
			room,
			animationActive,
			frameStart,
			frameEnd,
			frameRate
		});
		this.isOnGround = false;
		this.velocity = {
			y: 0,
			x: 0,
			gravity: 1
		};
		this.hitbox = {
			x: this.x + WIDTH * 2,
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
		if (KEY_PRESSED[" "] && this.isOnGround) {
			this.isOnGround = false;
			this.velocity.y = -BASE_SPEED * 4;
		} else if (KEY_PRESSED["a"]) {
			this.changeSprite("moving-left");
			this.velocity.x = -BASE_SPEED;
		} else if (KEY_PRESSED["d"]) {
			this.changeSprite("moving-right");
			this.velocity.x = BASE_SPEED;
		}

		this.checkHorizontalCollisions();
		this.checkVerticalCollisions();	
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
