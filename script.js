var EMPTY = 0, SNAKE = 1, FRUIT = 2;
var LEFT = 0, UP  = 1, RIGHT = 2, DOWN = 3;
var KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40;
var canvas, ctx, keyState, frames, score, player, game;

function init(){
	canvas = document.createElement("canvas");
	canvas.width  = 26 * 20;
	canvas.height = 26 * 20;
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);
	canvas.style.backgroundColor="green";
	ctx.font = "12px Arial";
	frames = 0;
	keyState = {};
	document.addEventListener("keydown", function(e){keyState[e.keyCode] = true;});
	document.addEventListener("keyup",function(e){delete keyState[e.keyCode]});
	start();
	

}

function setFood()
{
	var arrEmptyPlaces = [];
	for (var i  = 0 ; i < table.width; i++)
	{
		for (var j = 0; j < table.height; j++)
		{
			if (table.get(i, j) === EMPTY)
				arrEmptyPlaces.push( {x:i, y:j});
		}
	}

	var where = arrEmptyPlaces[Math.round(Math.random() * (arrEmptyPlaces.length- 2))];
	table.set(FRUIT, where.x, where.y);
}

table = 
{
	width: null,
	height: null,
	_table: null,
	init: function(d, columns, rows)
	{
		this.width = columns;
		this.height = rows;

		this._table = [];
		for (var i = 0; i < columns; i++)
		{
			this._table.push([]);
			for (var j = 0; j < rows; j++)
			{
				this._table[i].push(d);
			}
		}
	},

	set: function(val, x, y)
	{
		this._table[x][y] = val;
	},

	get: function(x, y)
	{
		return this._table[x][y];
	}
}

function snake(d, x, y)
{
	this.direction  = d;
	this.arrBody  = [];
	this.last = null;
	this.insert = function(x, y)
	{
		this.arrBody.unshift( {x:x, y:y});
		this.last = this.arrBody[0];
	}
	this.insert(x,y);
}

snake.prototype.remove = function()
{
	return this.arrBody.pop();
}


function start()
{	game = setTimeout(function(){	window.requestAnimationFrame(loop, canvas)}, 1000/((score+1) *10))
	score = 0;
	table.init(EMPTY, 26, 26);
	var sp = { x: Math.floor(13), y: 25};
	player = new snake(UP, sp.x, sp.y);
	table.set(SNAKE, sp.x, sp.y);

	setFood();
}

function update()
{
	frames++;
	if (keyState[KEY_LEFT] && player.direction !== RIGHT) {
		player.direction = LEFT;
	}
	if (keyState[KEY_UP] && player.direction !== DOWN) {
		player.direction = UP;
	}
	if (keyState[KEY_RIGHT] && player.direction !== LEFT) {
		player.direction = RIGHT;
	}
	if (keyState[KEY_DOWN] && player.direction !== UP) {
		player.direction = DOWN;
	}

	if (frames%5 ===0)
	{
		var nx = player.last.x;
		var ny = player.last.y;

		switch (player.direction)
		{
			case LEFT:
				nx--;
				break;
			case UP:
				ny--;
				break;
			case DOWN:
				ny++;
				break;
			case RIGHT:
				nx++;
				break;

		}
		if ( 0 > nx || nx > table.width-1 ||
			0 > ny || ny > table.height-1||
			table.get(nx, ny) === SNAKE)
		{
			
			alert("Game over! Your score was "+score);
			window.location.href= "home.html";
			return ;
		}

		if (table.get(nx, ny) === FRUIT)
		{
			//found the food
			score++;
			setTimeout(setFood, 500);
		}
		else 
		{
			var tail = player.remove();
			table.set(EMPTY, tail.x, tail.y);
		}
		table.set(SNAKE, nx, ny);
		player.insert(nx, ny);
	}

}


function draw()
{
	var titleWidth  = canvas.width / table.width;
	var titleHeight = canvas.height / table.height;

	//let's draw the table :>

	for (var i = 0; i < table.width; i++)
	{
		for (var j = 0; j < table.height; j++ )
		{
			switch (table.get(i,j))
			{
				case SNAKE:
					ctx.fillStyle = "black";
					break;
				case FRUIT:
					ctx.fillStyle = "red";
					break;
				default:
					ctx.fillStyle = "green";
			}
			ctx.fillRect(i*titleWidth, j*titleHeight, titleWidth, titleHeight);
		}
	}
	ctx.fillStyle = "white";
	ctx.fillText("Score: "+ score, 10, canvas.height-10);
}	

function loop()
{
	
game = setTimeout(function(){requestAnimationFrame(loop, canvas); update(); draw();}, 1000/((score+1)*10));
}

