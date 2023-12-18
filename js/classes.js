class Tile{
	constructor({x, y}) {
		this.x = x;
		this.y = y;
		this.width = WIDTH;
		this.height = HEIGHT;
	}

	setPos(x, y) {
		this.x += x;
		this.y += y;
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
	constructor({x, y, width=0, height=0, imgSrc, sx=0, sy=0}) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.img = new Image();
		this.img.src = imgSrc;
		this.sx = sx;
		this.sy = sy;
		this.sides = {
			top: this.y,
			bottom: this.y + this.height,
			left: this.x,
			right: this.x + this.width
		};
	}

	setPos(x, y) {
		this.x += x;
		this.y += y;

		this.collisions?.forEach(tile => tile.setPos(x, y));
		this.events?.forEach(tile => tile.setPos(x, y));

		this.setSides();
	}

	setSides() {
		this.sides = {
			top: this.y,
			bottom: this.y + this.height,
			left: this.x,
			right: this.x + this.width
		};
	}

	draw() {
		CONTEXT.imageSmoothingEnabled = false;
		
		CONTEXT.drawImage(
			this.img,
			this.sx,
			this.sy,
			this.width,
			this.height,
			this.x,
			this.y,
			this.width,
			this.height
		);
	}
}

class Room extends Sprite{
	constructor({name, x, y, imgSrc}) {
		super({
			x,
			y,
			imgSrc
		});
		this.name = name;
		this.img.onload = () => {
			this.width = this.img.width;
			this.height = this.img.height;
		}
		this.collisions = [];
		this.events = [];
	}
}

class Character extends Sprite{
	constructor({x, y, width, height, imgSrc, room}) {
		super({
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
	constructor({y, width, height, imgSrc, room}) {
		super({
			x: SCREEN_WIDTH / 2 - width / 2,
			y,
			width,
			height,
			imgSrc,
			room
		});
		this.velocity = {
			y: 0,
			x: 0,
			gravity: 1
		};
	}

	walk() {
		this.velocity.x = 0;
		if (KEY_PRESSED.a) this.velocity.x = -BASE_SPEED;
		else if (KEY_PRESSED.d) this.velocity.x = BASE_SPEED;

		thisRoom.setPos(-this.velocity.x, -this.velocity.y);

		if (this.sides.bottom + this.velocity.y < SCREEN_HEIGHT) 
			this.velocity.y += this.velocity.gravity;
		else this.velocity.y = 0;
	}
}

class Npc extends Character{
	constructor({x, y, width, height, imgSrc, room}) {
		super({
			x,
			y,
			width,
			height,
			imgSrc,
			room
		});
	}

	move() {

	}
}
