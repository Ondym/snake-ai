function code() {
    let board = "";
    let space = 0;

    for (let x = 0; x < nodes.length; x++) {
        for (let y = 0; y < nodes[x].length; y++) {
            if (nodes[x][y].walkable) {
                space++;
            } else {
                board += "/" + String(space);
                space = 0;
            }
        }
    }

    board += "\\" + count.x + "-" + count.y;
    board += "/" + start.x + "-" + start.y; 
    board += "/" + finish.x + "-" + finish.y; 

    return board;
}

function load(pattern) {
    pattern = pattern.split("\\");
    let special = pattern[1].split("/");
    done = false;
    findPath = false;

    let specialVector = special[0].split("-");
    count = createVector(parseInt(specialVector[0]), parseInt(specialVector[1]));
    specialVector = special[1].split("-");
    start = createVector(parseInt(specialVector[0]), parseInt(specialVector[1]));
    specialVector = special[2].split("-");
    finish = createVector(parseInt(specialVector[0]), parseInt(specialVector[1]));

    createGrid();
    resizeCanvas(ns * count.x, ns * count.y);

    pattern = pattern[0].split("/");
    let lastWall = -1;
    for (let i = 1; i < pattern.length; i++) {
        pattern[i] = parseInt(pattern[i]);
        lastWall += pattern[i] + 1;
        let wallPos = createVector(floor(lastWall / count.y), lastWall % count.y);
        nodes[wallPos.x][wallPos.y].walkable = false;
    }
}