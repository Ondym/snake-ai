// Created by Ondym
let nodes;
let start;
let finish;
let opened;
let ns;
let count;
let path;
let done;
let findPath;
let showPath = true;
let holding = false;

function setup() {
    count = createVector(50, 30)
    opened = new Array;
    findPath = false;

    start = createVector(0, 0);
    finish = createVector(count.x - 1, count.y - 1);
    ns = 20;
    path = new Array;
    createGrid();
    
    createCanvas(ns * count.x, ns * count.y)
    background(10);
    stroke(255);
    textAlign(CENTER, CENTER);
    textSize(ns * .3);
    strokeWeight(ns * .2);

    document.getElementById("idString").addEventListener("change", function(e) {
        load(e.target.value);
    });

    load("\\19-19/10-8/11-18");
    document.getElementById("idString").value = code();
}

function draw() {
    if (showPath) {
        stroke(255);
        strokeWeight(2)
        for (let x = 0; x < nodes.length; x++) {
            for (let y = 0; y < nodes[x].length; y++) {
                let printText = false;
                if (nodes[x][y].state == 1) {
                    printText = true;
                    fill(100, 255, 10);
                } else if (nodes[x][y].state == 2) {
                    fill(255, 10, 10);
                } else if (nodes[x][y].state == 3) {
                    fill(53, 168, 240);
                } else if (!nodes[x][y].walkable) {
                    fill(255, 255, 255);
                } else {
                    fill(10);
                }
                
                rect(x * ns, y * ns, ns, ns);
                
                if (nodes[x][y].state > 0) {
                    noStroke();
                    fill(255, 255, 255);
                    text(" " + nodes[x][y].Fcost, x * ns, y * ns, ns, ns);
                    stroke(255);
                }
            }
        }
        
        fill(53, 168, 240)
        rect(start.x * ns, start.y * ns, ns, ns);
        rect(finish.x * ns, finish.y * ns, ns, ns);
    } else {
        fill(10, 10, 10);
        noStroke();
        rect(0, 0, width, height);
        fill(255, 255, 255);
        for (let x = 0; x < nodes.length; x++) {
            for (let y = 0; y < nodes[x].length; y++) {
                if (!nodes[x][y].walkable) {
                    rect((x + .1) * ns, (y + .1) * ns, ns * .8, ns * .8)
                }
            }
        }            
            
        noFill();
        stroke(187, 255, 51);
        beginShape();
        for (let i = 0; i < path.length; i++) {
            vertex((path[i].x + .5) * ns, (path[i].y + .5) * ns);
        }
        endShape();
        
        noStroke();
        fill(180, 130, 10);
        ellipse((start.x + 0.5) * ns, (start.y + 0.5) * ns, ns * .6, ns * .6);
        fill(184, 22, 73);
        ellipse((finish.x + 0.5) * ns, (finish.y + 0.5) * ns, ns * .6, ns * .6);
    }
    
    if (done || !findPath) {return;}
    if (opened.length < 1) {
        path = new Array;
        done = true;
        document.getElementById("state").style.color = "#f00";
        document.getElementById("state").innerText = "no possible path";
        return;
    }
    
    let actual = findBest();
    nodes[opened[actual].x][opened[actual].y].close();

    if (!showPath) {
        genPath(opened[actual].x, opened[actual].y);
    }
    
    if (opened[actual].x == finish.x && opened[actual].y == finish.y) {
        done = true;
        
        genPath(opened[actual].x, opened[actual].y);

        for (let i = 0; i < path.length; i++) {
            nodes[path[i].x][path[i].y].state = 3;
        }
        document.getElementById("state").style.color = "#bf3";
        document.getElementById("state").innerText = "optimal path found";
    }
    
    opened.splice(actual, 1);
}

function createGrid() {
    nodes = new Array;
    
    for (let x = 0; x < count.x; x++) {
        nodes.push(new Array);
        for (let y = 0; y < count.y; y++) {
            nodes[x].push(new Node(x, y))
        }
    }
    
    resetSearch();
}

function findBest() {
    let bestIndex;
    let bestCost = Infinity;
    
    for (let i = 0; i < opened.length; i++) {
        if (nodes[opened[i].x][opened[i].y].Fcost < bestCost || 
            (nodes[opened[i].x][opened[i].y].Fcost == bestCost && 
                nodes[opened[i].x][opened[bestIndex].y].Hcost < nodes[opened[i].x][opened[bestIndex].y].Hcost)) {
            bestIndex = i;
            bestCost = nodes[opened[i].x][opened[i].y].Fcost;
        }  
    }

    return bestIndex;
}

function keyPressed() {
    if (keyCode == 82 && opened.length < 2) {
        for (let i = 0; i < count.x * count.y / 10; i++) {
            nodes[floor(random(count.x))][floor(random(count.y))].walkable = false;
        }
        nodes[finish.x][finish.y].walkable = true;
        document.getElementById("idString").value = code();
    }
    
    if (keyCode == 32) {
        if (findPath) {
            findPath = false;
        } else {
            findPath = true;
        }
    }
    
    if (keyCode == 80) {
        if (showPath) {
            strokeWeight(ns * .2)
            showPath = false;
        } else {
            strokeWeight(1);
            showPath = true;
        }
        noStroke();
        fill(10, 10, 10);
        rect(0, 0, width, height);
    }
}

function mouseDragged() {
    if (!findPath && holding == false) {
        
    let drawX = floor(mouseX / ns);
    let drawY = floor(mouseY / ns);

    if (drawX > -1 && drawY > -1 && drawX < count.x && drawY < count.y) {
        nodes[drawX][drawY].walkable = false;
    }

    nodes[start.x][start.y].walkable = true;
    nodes[finish.x][finish.y].walkable = true;
    }

    if (holding == 1) {
        start.x = floor(mouseX / ns);
        start.y = floor(mouseY / ns);
    }
    if (holding == 2) {
        finish.x = floor(mouseX / ns);
        finish.y = floor(mouseY / ns);
    }

    document.getElementById("idString").value = code();
}

function mousePressed() {
    if (!done && !findPath) {
        if (floor(mouseX / ns) == start.x && floor(mouseY / ns) == start.y) {
            holding = 1;
        } else if (floor(mouseX / ns) == finish.x && floor(mouseY / ns) == finish.y) {
            holding = 2;
        }
    }
}

function mouseReleased() {
    if (holding == 1) {
        holding = false;
        resetSearch();
        nodes[start.x][start.y].walkable = true;
    } else if (holding == 2) {
        holding = false;
        resetSearch();
        nodes[finish.x][finish.y].walkable = true;
    }
}

function resetSearch() {
    opened = new Array;
    for (let x = 0; x < nodes.length; x++) {
        for (let y = 0; y < nodes[x].length; y++) {
            nodes[x][y].resetCosts();
            nodes[x][y].state = 0;
        }
    }        

    nodes[start.x][start.y].open(0, -1);
}

function genPath(_x, _y) {
    path = new Array;

    let pathNodeX = _x;
    let pathNodeY = _y;
    
    while (true) {
        path.push(createVector(pathNodeX, pathNodeY));

        // console.log(pathNodeX, pathNodeY);

        if (pathNodeX == start.x && pathNodeY == start.y) {
            break;
        }

        let nodeX = pathNodeX;
        pathNodeX = nodes[pathNodeX][pathNodeY].parent.x;
        pathNodeY = nodes[nodeX][pathNodeY].parent.y;
    }
}

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.state = 0;
        this.walkable = true;

        // this.resetCosts();
    }
    
    resetCosts() {
        this.Hcost = abs(finish.x - this.x) * 10 + abs(finish.y - this.y) * 10;
        
        this.Gcost = null;
        this.Fcost = null;
    }   

    open(_Gcost, _parent) {
        this.Gcost = _Gcost;
        this.Fcost = this.Gcost + this.Hcost;
        this.parent = _parent;

        this.state = 1;
        opened.push(createVector(this.x, this.y));
    }

    close() {
        this.state = 2;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let newX = this.x + i;
                let newY = this.y + j;
                if (newX > -1 &&
                    newY > -1 &&
                    newX + i <= count.x &&
                    newY + j <= count.y && abs(j) != abs(i)) {
                        if (nodes[newX][newY].walkable) {
                            let newGcost = this.Gcost + 10;
                            if (nodes[newX][newY].state == 0 || (nodes[newX][newY].state == 1 && nodes[newX][newY].Gcost > newGcost)) {
                                nodes[newX][newY].open(newGcost, createVector(this.x, this.y));
                            }
                        }
                }
            }
        }
    }
}

