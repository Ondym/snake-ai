let snake;
let directions = new Array;
let gridSize = 20;
let apple;
let pathFinder;
let ns;
let showAStar = false;

function setup() {
    createCanvas(500, 500);
    frameRate(50);
    strokeCap(SQUARE);

    gridColors = [
        color(255, 255, 255),
        color(255, 255, 0),
        color(0, 0, 255),
    ];

    ns = width / gridSize;
    directions = [vec(0, -1), vec(1, 0), vec(0, 1), vec(-1, 0)];
    pathFinder =  new Astar(gridSize);
    reset();
}

function draw() {
    background(0);
    if (TESTGRID && showAStar) {
        pathFinder.show(TESTGRID);
    }
    stroke(255);
    strokeWeight(2);
    fill(240, 20, 20);
    rect((apple.x + .05) * ns, (apple.y + .05) * ns, ns*.9, ns*.9);
    snake.show();
    snake.move();
}

class Snake{
    constructor(x,y) {
        this.pos = vec(x,y);
        this.direction = 0;
        this.length = 3;
        this.tail = [vec(x,y)];
        this.dead = false;
        this.path = [0,0];
    }

    move() {
        if (this.dead) {return;}
        
        // PATH FOLLOWING
        if (this.path.length < 1) {
            this.findPath();
        }
        this.turn(this.path[0]);
        this.path.shift();
        
        this.pos.add(directions[this.direction]);
        
        if (this.pos.x < 0 || this.pos.x > gridSize-1 || this.pos.y < 0 || this.pos.y > gridSize-1) {
            this.die();
            return;
        }
        
        this.tail.push(vec(this.pos.x, this.pos.y));
        if (this.tail.length > this.length) {
            this.tail.shift();
        }

        for (let i = 0; i < this.tail.length-1; i++) {
            if (this.pos.x == this.tail[i].x && this.pos.y == this.tail[i].y) {
                this.die();
                return;
            }
        }
        
        
        if (this.pos.x == apple.x && this.pos.y == apple.y) {
            placeApple();
            console.log(this.path.length);
            this.length++;
        }
        
    }

    turn(dir) {
        if (this.direction != (dir+2) % 4) {
            this.direction = dir;
        }
    }

    show() {
        stroke(150, 250, 20);
        noFill();
        strokeWeight(ns*.8);

        beginShape();
        if (this.dead) {stroke(250, 20, 20);}
        for (var i = 0; i < this.tail.length; i++) {
            vertex((this.tail[i].x+.5) * ns, (this.tail[i].y+.5) * ns);
        }
        endShape();
        noStroke();
        fill(150, 250, 20);
        rect((this.pos.x + .1) * ns, (this.pos.y + .1) * ns, ns*.8, ns*.8);
    }

    die() {
        this.dead = true;
        setTimeout(() => {
            reset();
        }, 2000);
        console.log("SCORE: " + (this.length - 3));
    }

    findPath() {
        let optPath = pathFinder.findPath(this.tail, apple, false);
        this.path = new Array;
        TESTPATH = optPath;

        // let last = vec(this.pos.x, this.pos.y);
        for (let i = optPath.length-1; i > 0; i--) {
            let dir = optPath[i-1].rSub(optPath[i]);
            if (dir.x == 0 && dir.y == -1) {
                this.path.push(0);
            } else if (dir.x == 1 && dir.y == 0) {
                this.path.push(1);
            } else if (dir.x == 0 && dir.y == 1) {
                this.path.push(2);
            } else if (dir.x == -1 && dir.y == 0) {
                this.path.push(3);
            }
        }

        // console.log(this.path);
    }
}

function vec(x,y) {
    return new Vector(x,y);
}

function placeApple() {
    apple = vec(floor(random(gridSize)), floor(random(gridSize)));
    let inTail = false;
    for (let i = 0; i < snake.tail.length; i++) {
        if (apple.x == snake.tail[i].x && apple.y == snake.tail[i].y) {
            inTail = true;
        }
    }
    if (inTail) {
        placeApple();
    }
}

class Vector{
    constructor(x,y) {
        this.x = x; 
        this.y = y;
    }

    add(_vec) {
        this.x += _vec.x;
        this.y += _vec.y;
    }
    rSub(_vec) {
        return vec(this.x - _vec.x, this.y - _vec.y);
    }
}   

function reset() {   
    snake = new Snake(floor(gridSize/2), floor(gridSize/2));
    placeApple();
    // snake.findPath();
}

function keyPressed() {
    if (keyCode == 32) {
        showAStar = !showAStar;
    }
    if (false) {
        if (keyCode == 68) {
            snake.turn(1);
        } else if (keyCode == 65) {
            snake.turn(3);
        } else if (keyCode == 83) {
            snake.turn(2);
        } else if (keyCode == 87) {
            snake.turn(0);
        }   
    }
}
