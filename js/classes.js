class Tile{
	constructor({x, y}) {
		this.x = x;
		this.y = y;
		this.width = WIDTH;
		this.height = HEIGHT;
		this.sides = {
			top: this.y,
			bottom: this.y + this.height,
			left: this.x,
			right: this.x + this.width
		};
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
		CONTEXT.fillStyle='red';
		CONTEXT.fillRect(this.sides.left, this.sides.bottom, this.sides.right - this.sides.left, this.sides.top - this.sides.bottom);				
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

	move(x, y) {
		for(const OBJ of [this, ...this.collisions, ...this.events]) {
			OBJ.x += x;
			OBJ.y += y;
			OBJ.setSides();
		}
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

	checkCollisions() {
		for(const OBJ of [...thisRoom.collisions]) {
			if(
				this.sides.bottom + this.velocity.y > OBJ.sides.top &&
				this.sides.top + this.velocity.y < OBJ.sides.bottom &&
				this.sides.left < OBJ.sides.right &&
				this.sides.right > OBJ.sides.left
			)
				return true;
			else return false;
		}
	}

	move() {
		this.velocity.x = 0;
		if (KEY_PRESSED.a) 
			this.velocity.x = -BASE_SPEED;
		if (KEY_PRESSED.d) 
			this.velocity.x = BASE_SPEED;

		moveRoom(-this.velocity.x, 0);

		for(const TILE of thisRoom.collisions) {
			if (!(
				this.sides.left <= TILE.sides.right &&
				this.sides.right >= TILE.sides.left &&
				this.sides.bottom >= TILE.sides.top &&
				this.sides.top <= TILE.sides.bottom
			)) continue;
			
			if (this.velocity.x < 0) {
				moveRoom(-(TILE.sides.right + 0.01 - this.x), 0);
				break;
			}
			if (this.velocity.x > 0) {
				moveRoom(-(TILE.sides.left - this.width - 0.01 - this.x), 0);
				break;
			}
		}

		this.velocity.y += this.velocity.gravity;
		moveRoom(0, -this.velocity.y);

		for(const TILE of thisRoom.collisions) {
			if (!(
				this.sides.left <= TILE.sides.right &&
				this.sides.right >= TILE.sides.left &&
				this.sides.bottom >= TILE.sides.top &&
				this.sides.top <= TILE.sides.bottom
			)) continue;

			if (this.velocity.y < 0) {
				this.velocity.y = 0;
				moveRoom(0, -(TILE.sides.bottom + 0.01 - this.y));
				break;
			}
			if (this.velocity.y > 0) {
				this.velocity.y = 0;
				moveRoom(0, -(TILE.sides.top - this.height - 0.01 - this.y));
				break;
			}			
		}
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

	move(x, y) {
		this.x += x;
		this.y += y;
		this.setSides();
	}
}
