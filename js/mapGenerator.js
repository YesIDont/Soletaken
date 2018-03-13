// links of images used for tiles
let grass = new Image(),
    dirt = new Image(),
    mud = new Image(),
    water = new Image();

grass.src = "img/map/grass_77x100px_block1.png",
dirt.src = "img/map/grass_77x100px_block2.png",
mud.src = "img/map/grass_77x100px_block3.png",
water.src = "img/map/grass_77x100px_block4.png";

function generateMap(
    // input
    xTilesNumber, 
    yTilesNumber, 
    tileWidth, 
    tileHeight,
    /*  
        Starting position is used to calculate map offset in relation to canvas.
        Can be intergers in range of map width and height, and if typed outside thiese ranges -
        default position will be set, which is top left corner of the map in the top left corner of the canvas.
        Also accepts: top, bottom, left, right, center for both variables.

        For now it can take only center, center.
    */
    mapStartPosition_x,  
    mapStartPosition_y,
    clipByTiles
    ) {

  let that = this;
  // Map basic properties
  this.xTilesNumber = xTilesNumber; // how many tiles horizontaly
  this.yTilesNumber = yTilesNumber; // how many tiles verticaly
  this.tileWidth = tileWidth;
  this.tileHeight = tileHeight;
  this.tileWidthHalf = Math.floor(tileWidth * 0.5);
  this.tileHeightHalf = Math.floor(tileHeight * 0.5);
  this.mapWidth = xTilesNumber * this.tileWidth + this.tileWidthHalf;
  // tile height must be devided into halfas tiles are placed verticaly evry half of their height to reduce otherwise gap betwen even and uneven rows
  this.mapHeight = yTilesNumber * Math.floor(this.tileHeight * 0.5) + that.tileHeightHalf;
  this.mapWidthHalf = Math.floor(this.mapWidth * 0.5);
  this.mapHeightHalf = Math.floor(this.mapHeight * 0.5);
  this.zMax = 0;
  this.zMin = 0;
  this.startPosition_x = mapStartPosition_x;
  this.startPosition_y = mapStartPosition_y;
  this.clipByTiles = clipByTiles || 0; // it tels animating function how many tiles must be clipped out of movment area
  // this.xStartOffset = Math.floor((this.mapWidth * 0.5)) - canvasWidthHalf; // on start centers map horizontaly
  // this.yStartOffset = Math.floor((this.mapHeight * 0.5)) - canvasHeightHalf; // on start centers map verticaly
   
  /*
      Below offset of coordinates and numbers of tiles in each direction
      is used to narrow loop across array of all tiles when drawing them on screen.
      Without it all tiles would be drawn wheter their are visible or not.
      tilesOutsideCanvas's elements are used as offset when drawing tiles.

      Offset value must be corrected by players movment, to maintain it's accuracy.
      First two sets measures offset of left top and bottom right corner in pixels.
      Third set gives top, right, bottom and left offset in number of tiles outside canvas.
  */

  // offset determines camera position, default position is left top
  this.offsetTopLeft = {
    x: 0,
    y: 0
  };
  this.offsetBottomRight = {
    x: that.mapWidth - canvasWidth,
    y: that.mapHeight - canvasHeight
  };
  this.tilesOutsideCanvas = {
    top:    Math.floor(this.offsetTopLeft.y / this.tileHeight),
    right:  Math.floor(this.offsetBottomRight.x / this.tileWidth),
    bottom: Math.floor(this.offsetBottomRight.y / this.tileHeight),
    left:   Math.floor(this.offsetTopLeft.x / this.tileWidth)
  };

  // Tiles on 0 level generaotr - layer 0
  
  // fill the above array with data on each tile
  this.createLayer();
  this.calculateTilesBase();
  
  this.strokeAllTilesBase = function(context, color) {
    for(r = that.tilesOutsideCanvas.top - 3; r < that.tiles.length - that.tilesOutsideCanvas.bottom + 3; r++) {
      if(r >= 0 && r < that.tiles.length) {
        for(c = that.tilesOutsideCanvas.left - 3; c < that.tiles[r].length - that.tilesOutsideCanvas.right + 3; c++) {
          if(c >= 0 && c < that.tiles[r].length) {
              that.tiles[r][c].base.stroke(context, color);
            }
          }
        }
      }
  };
  this.fillOneTileBase = function(context, color, r, c) {
    that.tiles[r][c].base.fill(context, color);
  };
  

  this.randomTile = function(){
    let c = Math.floor( (Math.random() * that.yTilesNumber) );
    let r = Math.floor( (Math.random() * that.xTilesNumber) );    
    return that.tiles[c][r]
  };  
  this.randomizeTerrain();
  // this.fallFromLeft();
  // this.fallFromTop();
  // this.makeHoles();
  this.makeBumps();
  this.makeHighBump();
  // this.makeWall();

  // test falling
  // this.moveOneTile(41, 21, 40);
  // this.moveOneTile(39, 18, 10);
  // this.moveOneTile(37, 20, 20);
  // this.moveOneTile(37, 17, -10);
  // this.moveOneTile(35, 19, -20);

  this.findMaxAndMinZ();
};


// Generators - are deployed before the game start to calculate map shape
//----------------------------------------

// this makes sure natural ground is never even
generateMap.prototype.randomizeTerrain = function() {
  let that = this;
  for(r = 0; r < that.tiles.length; r++) {
    for(c = 0; c < that.tiles[r].length; c++) {
      let rndLevel = Math.floor( (Math.random() * 2) );
      let rndSign = Math.random() < 0.5 ? -1 : 1;
      that.tiles[r][c].z = rndSign > 0 ? rndLevel : -rndLevel;
    }
  }
};
generateMap.prototype.fallFromLeft = function() {
  let that = this;
  let z = 0;
  for(r = 0; r < that.tiles.length; r++) {
    for(c = 0; c < that.tiles[r].length; c++) {
      that.tiles[r][c].z += z;
      z += 4;
    }
    z = 0;
  }
};
generateMap.prototype.fallFromTop = function() {
  let that = this;
  let z = 0;
  for(r = 0; r < that.tiles.length; r++) {
    for(c = ( that.tiles[r].length / 2 ) + 5; c < that.tiles[r].length; c++) {
      that.tiles[r][c].z += z;
    }
    z += 3;
  }
};
generateMap.prototype.makeHoles = function(){
  let that = this;
  if(typeof this.randomTile !== undefined) {
    for(i = 0; i < 4096; i++) {
      let rnd = that.randomTile();
      rnd.z += 20;
    }
  }
};
generateMap.prototype.makeBumps = function() {
  let that = this;
  if(typeof this.randomTile !== undefined) {
      for(i = 0; i < 8192; i++) {
        let rnd = that.randomTile();
        rnd.z -= 20;
      }      
  }   
};


generateMap.prototype.moveOneTile = function(r, c, value) {
  let that = this;
  that.tiles[r][c].z += value;
};


generateMap.prototype.makeHighBump = function() {
  let that = this;
  if(typeof this.randomTile !== undefined) {
      for(i = 0; i < 4096; i++) {
        let rnd = that.randomTile();
        rnd.z -= 67;
      };
    }
};
generateMap.prototype.makeWall = function() {
  let that = this;
    let r = Math.floor((Math.random() * that.yTilesNumber));
    let c = Math.floor((Math.random() * that.xTilesNumber));
    // wlal lenght
    let l = Math.floor((Math.random() * 30));

    // Direction: 0 face bottom, 1 left bottom, 2 left, 3 left top, 4 top, 5 right top, 6 right, 7 right bottom
    let d = Math.floor((Math.random() * 8));

    switch(d){
      case 0:
        for(i = 0; i < l; i++) {
          if( r !== undefined && c !== undefined ) {
            that.tiles[r - 1][c + i].z -= 64;
            r -= 1;
          }
          
        };
        break;
      case 1:
        // code
        break;
      case 2:
        // code
        break;
      case 3:
        // code
        break;
      case 4:
        // code
        break;
      case 5:
        // code
        break;  
      case 6:
        // code
        break;
      case 7:
        // code         
    }

    
  };

// writeTilesBase creates for each tile vector base which will be used
// to calculate collision with player and other character
generateMap.prototype.calculateTilesBase = function(){
  let that = this;
  for (r = 0; r < that.yTilesNumber; r++) {
    for(c = 0; c < that.xTilesNumber; c++) {
      that.tiles[r][c].base = new P(new V(that.tiles[r][c].x, that.tiles[r][c].y), [
          new V(that.tileWidthHalf + 1, 1),
          new V(that.tileWidth + 1, that.tileHeightHalf + 1),
          new V(that.tileWidthHalf + 1, that.tileHeight + 1),
          new V(1, that.tileHeightHalf + 1)
      ]);
    };
  };
};

generateMap.prototype.updateTilesOutside = function() {
  let that = this;
  that.tilesOutsideCanvas.top = Math.floor(Math.abs(that.offsetTopLeft.y) / that.tileHeightHalf);
  that.tilesOutsideCanvas.right = Math.floor(that.offsetBottomRight.x / that.tileWidth);
  that.tilesOutsideCanvas.bottom = Math.floor(that.offsetBottomRight.y / that.tileHeightHalf);
  that.tilesOutsideCanvas.left = Math.floor(Math.abs(that.offsetTopLeft.x) / that.tileWidth);
};

// start position calculates offset for starting camera position and appends it to all tiles position
generateMap.prototype.startPositionSwitch = function(startPosition_x, startPosition_y, playerObject) {
  let that = this;
  let p = playerObject;

  // default: left, top
  if(startPosition_x === "left" &&
    startPosition_y === "top" ||
    startPosition_x === undefined ||
    startPosition_y === undefined) {
    // write it
  };

  //  center, center
  if(startPosition_x === "center" && startPosition_y === "center"){
    let tileInCenter = that.tiles[ Math.floor( that.yTilesNumber * 0.5 ) ][ Math.floor( that.xTilesNumber * 0.5 ) ];

    p.startPosition(that.mapWidthHalf, that.mapHeightHalf, tileInCenter.z - 50);

  };
  

  that.updateTilesOutside();

  // after calculating offsets this will apend thier values to all tiles
  ctx1.translate(that.offsetTopLeft.x, that.offsetTopLeft.y);
  // ctx2.translate(that.offsetTopLeft.x, that.offsetTopLeft.y);
  // ctx3.translate(that.offsetTopLeft.x, that.offsetTopLeft.y);
  
};

generateMap.prototype.findMaxAndMinZ = function () {
  let that = this;
  let max = 0;
  let min = 0;

  for (r = 0; r < that.yTilesNumber; r++) {
    for(c = 0; c < that.xTilesNumber; c++) {
      max = that.tiles[r][c].z < max ? that.tiles[r][c].z : max;
      min = that.tiles[r][c].z > min ? that.tiles[r][c].z : min;
    }
  }
  that.zMax = max;
  that.zMin = min;
};

generateMap.prototype.cameraUpdate = function ( mapObject, x, y, z ) {
  let m = mapObject;

  // this function allows camera (canvas) to follow x, y, z coordinates, for example - the player character 

  // update top left x offset
  if( -(x - canvasWidthHalf) < -(m.clipByTiles * m.tileWidth) &&
      -(x - canvasWidthHalf) > -(m.mapWidth - canvasWidth) + (m.clipByTiles * m.tileWidth)) {

    m.offsetTopLeft.x =  -(x - canvasWidthHalf);
  }

  // update top left y offset 
  if( -(y - canvasHeightHalf) < -(m.clipByTiles * m.tileWidth) - m.zMax &&
      -(y - canvasHeightHalf) > -(m.mapHeight - canvasHeight) + (m.clipByTiles * m.tileWidth) - m.zMin  ) {

      m.offsetTopLeft.y = -(y + z - canvasHeightHalf);
  }    

  // update bottom right x offset
  if( m.mapWidth - x - canvasWidthHalf > m.clipByTiles * m.tileWidth &&
      m.mapWidth - x - canvasWidthHalf < m.mapWidth - canvasWidth - (m.clipByTiles * m.tileWidth)) {

      m.offsetBottomRight.x = m.mapWidth - x - canvasWidthHalf;
  }  

  // update bottom right y offset
  if( m.mapHeight - y - canvasHeightHalf > m.clipByTiles * m.tileWidth + m.zMax  &&
      m.mapHeight - y - canvasHeightHalf < m.mapHeight - canvasHeight - (m.clipByTiles * m.tileWidth) + m.zMin ) {

      m.offsetBottomRight.y = m.mapHeight - y + z - canvasHeightHalf;
  }

  m.updateTilesOutside();
};