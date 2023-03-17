let gridColors;
let TESTGRID, TESTPATH;

class Astar {
    constructor(size) {
        this.size = size;
        this.canvas = createGraphics(size * 25, size * 25);
        this.canvas.noStroke();
    }

    findPath(aSnake, goal, ALLOWSIDES) {
        this.origin = aSnake[aSnake.length - 1];
        this.finish = vec(goal.x, goal.y);
        this.nodes = this.createGrid(aSnake, ALLOWSIDES);
        this.nodesWalkability = new Array;
        let opened = [this.origin];

        this.nodes[this.origin.x][this.origin.y].open(false, 0);
        console.log(ALLOWSIDES);
        while (true) {
            if (opened.length < 1 && !ALLOWSIDES) {
                return this.findPath(aSnake, goal, true);
            }
            let bestIndex = -1;
            let bestDistance = Infinity;
            for (let i = 0; i < opened.length; i++) {
                if (bestDistance > this.nodes[opened[i].x][opened[i].y].Gcost + this.nodes[opened[i].x][opened[i].y].Hcost) {
                    bestDistance = this.nodes[opened[i].x][opened[i].y].Gcost + this.nodes[opened[i].x][opened[i].y].Hcost;
                    bestIndex = i;
                }
            }
            this.nodes[opened[bestIndex].x][opened[bestIndex].y].stage = 2;

            if (opened[bestIndex].x == this.finish.x && opened[bestIndex].y == this.finish.y) {
                TESTGRID = this.nodes;

                return this.getPath(this.nodes, opened[bestIndex]);
            }

            this.nodesWalkability=this.createWalkabilityGrid(this.getPath(this.nodes, opened[bestIndex]), aSnake, ALLOWSIDES);

            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (abs(i) != abs(j)) {
                        let newPos = vec(opened[bestIndex].x + i, opened[bestIndex].y + j);
                        if (newPos.x > -1 && newPos.y > -1 && newPos.x < this.size && newPos.y < this.size && this.nodesWalkability[newPos.x][newPos.y]) {
                            if (this.nodes[newPos.x][newPos.y].stage == 0 || 
                                (false && this.nodes[newPos.x][newPos.y].stage == 1 && this.nodes[newPos.x][newPos.y].Gcost > this.nodes[newPos.x - i][newPos.y - j].Gcost + 1)) {
                                this.nodes[newPos.x][newPos.y].open(vec(-i, -j), this.nodes[newPos.x - i][newPos.y - j].Gcost + 1);
                                opened.push(newPos);
                            }
                        }
                    }
                }
            }

            opened.splice(bestIndex, 1);
        }
    }

    getPath(grid, node) {
        let path = new Array;
        let lastNode = node;
        while (true) {
            path.push(vec(lastNode.x, lastNode.y));
            let parent = grid[lastNode.x][lastNode.y].parent;
            if (!parent) { break; }
            lastNode = vec(lastNode.x + parent.x, lastNode.y + parent.y);
        }
        return path;
    }

    createWalkabilityGrid(path, aSnake, ALLOWSIDES) {
        let grid = new Array;
        for (let i = 0; i < this.size; i++) {
            grid.push(new Array);
            for (let j = 0; j < this.size; j++) {
                //grid[i].push(true);
                grid[i].push((!(i == 0 || j == 0 || i == this.size - 1 || j == this.size - 1) || ALLOWSIDES));
            }
        }

        for (let i = path.length-1; i < aSnake.length; i++) {
            grid[aSnake[i].x][aSnake[i].y] = false;
        }
        for (let i = 0; i < min(aSnake.length, path.length); i++) {
            grid[path[i].x][path[i].y] = false;
        }
        return grid;
    }

    createGrid(aSnake, ALLOWSIDES) {
        let grid = new Array;
        for (let i = 0; i < this.size; i++) {
            grid.push(new Array);
            for (let j = 0; j < this.size; j++) {
                grid[i].push(this.Node(i, j, !(i == 0 || j == 0 || i == this.size - 1 || j == this.size - 1) || ALLOWSIDES));
            }
        }

        for (let i = 0; i < aSnake.length; i++) {
            grid[aSnake[i].x][aSnake[i].y].walkable = false;
        }
        return grid;
    }

    show(grid) {
        this.canvas.noStroke();
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.nodesWalkability[i][j]) {
                    this.canvas.fill(gridColors[grid[i][j].stage]);
                } else {
                    this.canvas.fill(255, 0, 0);
                }
                this.canvas.rect(i * 25, j * 25, 25, 25);
                this.canvas.fill(255, 255, 255);
                this.canvas.text(String([grid[i][j].Gcost + grid[i][j].Hcost]), 25 * (i + .4), 25 * (j + .5));
            }
        }

        this.canvas.fill(250, 180, 30);
        this.canvas.rect(this.finish.x * 25, this.finish.y * 25, 25, 25);
        background(0);

        if (TESTPATH) {
            this.canvas.stroke(255);
            this.canvas.strokeWeight(2);
            this.canvas.noFill();
            this.canvas.beginShape();
            for (let i = 0; i < TESTPATH.length; i++) {
                this.canvas.vertex((TESTPATH[i].x + .5) * 25, (TESTPATH[i].y + .5) * 25);
            }
            this.canvas.endShape();
        }

        // tint(255, 126);
        image(this.canvas, 0, 0);
    }

    Node(x, y) {
        return {
            pos: vec(x, y),
            parent: false,
            stage: 0,
            Hcost: abs(x - this.finish.x) + abs(y - this.finish.y),
            Gcost: Infinity,

            open: function (parent, Gcost) {
                this.stage = 1;
                this.parent = parent;
                this.Gcost = Gcost;
            }
        };
    }
}