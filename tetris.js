const cvs = document.getElementById("tetris"); //
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 40;
const VACANT = "WHITE"; // color of an empty square

// draw a square
function drawSquare(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);
    ctx.strokeStyle = "White";
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
}

// create the board

let board = [];
for( r = 0; r <ROW; r++){
    board[r] = [];
    for(c = 0; c < COL; c++){
        board[r][c] = VACANT;
    }
}

// draw the board
function drawBoard(){
    for( r = 0; r <ROW; r++){
        for(c = 0; c < COL; c++){
            drawSquare(c,r,board[r][c]);
        }
    }
}

drawBoard();

// the pieces and their colors

const PIECES = [
    [Z,"Red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
];
// generate random pieces

function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length) // 0 -> 6
    return new Piece( PIECES[r][0],PIECES[r][1]);
}

let p = randomPiece();

// The Object Piece

function Piece(tetromino,color){
    this.tetromino = tetromino;
    this.color = color;
    
    this.tetrominoN = 0; // we start from the first pattern, start sa pinaka unang pattern ng pieces natin o yong array ng tetrominoes
    this.activeTetromino = this.tetromino[this.tetrominoN];
    
    // we need to control the pieces //position ng current tetromino sa labas ng board
    this.x = 3;
    this.y = -2;
}

// fill function

Piece.prototype.fill = function(color){ //dito na fifill yong mga 1 sa tetriminoes pattern natin
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // we draw only occupied squares
            if( this.activeTetromino[r][c]){
                drawSquare(this.x + c,this.y + r, color); //gamit yong draw function magkakakulay yon current piece na nagenerate gamit yong random piece generator natin
                                                         // base don kung saan may mga 1 at ififill kung ano kulay kapartner ex.Z,red
            }
        }
    }
}

// draw a piece to the board

Piece.prototype.draw = function(){//ito naman yong nag ddraw ng tetromino
    this.fill(this.color);
}

// undraw a piece


Piece.prototype.unDraw = function(){ //Fill ng vacant o yong nagbubura ng existing tetromino
    this.fill(VACANT);
}

// move Down the piece

Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){//ito yong funcction na naglolock sa tetronimo pag may tinamaan na sya pababa, future coordinate yong 0,1
        this.unDraw(); //buburahin yong na draw na tetronimo
        this.y++;       //mag iincrement ng position ng y para bumababa
        this.draw();    // iddraw nya yong current titronimo
    }else{
        // we lock the piece and generate a new one
        this.lock();
        p = randomPiece();
    }
    
}

// move Right the piece
Piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){//ito yong funcction na nagpprevent sa tetromino pag may tinamaan na sya sa right, future coordinate yong 1,0
        this.unDraw();//buburahin yong na draw na tetronimo
        this.x++; //mag iincrement ng position ng x para pumunta sa kanan
        this.draw();  // iddraw nya yong current titronimo
    }
}

// move Left the piece
Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){//ito yong funcction na nagpprevent sa tetromino pag may tinamaan na sya sa left, future coordinate yong -1,0
        this.unDraw(); //buburahin yong na draw na tetronimo
        this.x--;   //mag iincrement ng position ng x para pumunta sa kaliwa
        this.draw();  // iddraw nya yong current titronimo
    }
}

// rotate the piece
Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;
    
    if(this.collision(0,0,nextPattern)){
        if(this.x > COL/2){
            // it's the right wall
            kick = -1; // we need to move the piece to the left
        }else{
            // it's the left wall
            kick = 1; // we need to move the piece to the right
        }
    }
    
    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; // (0+1)%4 => 1
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

let score = 0;

Piece.prototype.lock = function(){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // we skip the vacant squares
            if( !this.activeTetromino[r][c]){
                continue;
            }
            // pieces to lock on top = game over
            if(this.y + r < 0){
                gameOver = true;
                // stop request animation frame
             if (confirm('You lost. Press ok to restart.')) {
                      window.location = '/index.html'
                    }
                break;
            }
            // we lock the piece
            board[this.y+r][this.x+c] = this.color;
        }
    }
    // remove full rows
    for(r = 0; r < ROW; r++){
        let isRowFull = true;
        for( c = 0; c < COL; c++){
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if(isRowFull){
            // if the row is full
            // we move down all the rows above it
            for( y = r; y > 1; y--){
                for( c = 0; c < COL; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            // the top row board[0][..] has no row above it
            for( c = 0; c < COL; c++){
                board[0][c] = VACANT;
            }
            // increment the score
            score += 10;
        }
    }
    // update the board
    drawBoard();
    
    // update the score
    scoreElement.innerHTML = score;
}

// collision fucntion

Piece.prototype.collision = function(x,y,piece){
    for( r = 0; r < piece.length; r++){
        for(c = 0; c < piece.length; c++){
            // if the square is empty, we skip it
            if(!piece[r][c]){
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            
            // conditions
            if(newX < 0 || newX >= COL || newY >= ROW){
                return true;
            }
            // skip newY < 0; board[-1] will crush our game
            if(newY < 0){
                continue;
            }
            // check if there is a locked piece alrady in place
            if( board[newY][newX] != VACANT){
                return true;
            }
        }
    }
    return false;
}

// CONTROL the piece

document.addEventListener("keydown",CONTROL);

function CONTROL(event){
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    }else if(event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();
    }else if(event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == 40){
        p.moveDown();
    }
}

// drop the piece every 1sec

let dropStart = Date.now();
let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 1000){
        p.moveDown();
        dropStart = Date.now();
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}

drop();