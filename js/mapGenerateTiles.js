generateMap.prototype.calculateTile_x = function(r, c){
  var that = this;
  if(r === 0 || r % 2 === 0) {
    var tileX = c * that.tileWidth;
    return tileX;
  } else {
    var tileX = c * that.tileWidth + that.tileWidthHalf;
    return tileX;
  }
};
generateMap.prototype.calculateTile_y = function(r, c){
  var that = this;
  if(r === 0 || r % 2 === 0) {
    var tileY = r * that.tileHeightHalf
    // + Math.floor(Math.random() * 6) + 1
    ;
    return tileY;
  } else {
    var tileY = r * that.tileHeightHalf
    // + Math.floor(Math.random() * 6) + 1
    ;
    return tileY;
  }
};

generateMap.prototype.createLayer = function() {
  var that = this;
  that.tiles = [];
  for (r = 0; r < that.yTilesNumber; r++) {
    that.tiles[r] = [r];
    for(c = 0; c < that.xTilesNumber; c++) {
      that.tiles[r][c] = {
        // Absolute values describe coordinates for each tile in realtion to map.
        // Next values are coordinates used when moving map relative to canvas.
        xAbsolute: that.calculateTile_x(r, c),
        yAbsolute: that.calculateTile_y(r, c),
        x: that.calculateTile_x(r, c),
        y: that.calculateTile_y(r, c),
        z: 0,
        layer: 0, // 0 layer is drawn below player's sprite, 1 layer is drawn above player's sprite
        canWalkOnIt: true,
        playerStandsOnIt: false,
        // randomly chooses one of four tile types and if Island map type is enabled - makes edge of map water
        type: Math.floor((Math.random() * 3) + 1)
      };
    };
  };
};