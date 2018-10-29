// Custom message constructor
function customMessage(ctx, message, x, y, xOffset, yOffset, fontSize, resetCanvasTransform) {
	if(resetCanvasTransform) {ctx.setTransform(1, 0, 0, 1, 0, 0);}

  ctx.font = fontSize + "px Bold Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText(message, x + xOffset, y + yOffset);
};

function drawCanvasCenter(color, ctx) {
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(canvasWidthHalf, 0);
  ctx.lineTo(canvasWidthHalf, canvasHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, canvasHeightHalf);
  ctx.lineTo(canvasWidth, canvasHeightHalf);
  ctx.stroke();

  ctx.restore();
};

function playerBase(ctx, color) {
  player.collisionModel.base.poly.fill(ctx, color);
};



// function fillSelectedTile( ctx, mapObject ) {
//   var m = mapObject;
  
//   var rP = Math.floor( ( mouse.y + Math.abs( m.offsetTopLeft.y) ) / m.tileHeightHalf );
//   var cP = Math.floor( ( mouse.x + Math.abs( m.offsetTopLeft.x) ) / m.tileWidth );

//   var col;

//   for( r = rP - 2; r < rP + 2; r++ ) {
//     if( r >= 0 && r < m.tiles.length ) {

//       for( c = cP - 1; c < cP + 1; c++ ) {
//         if( c >= 0 && c < m.tiles[r].length ) {

//           var re = new SAT.Response();
//           re.clear();          

//           col = mousePoly.collidesWith(m.tiles[r][c].base, re);

//           if( col ) {
//             map.tiles[r][c].base.fill( ctx, "rgba(0, 110, 255, 0.3)" );
//             map.tiles[r][c].base.stroke( ctx, "rgb(0, 0, 255)" );

//             ctx.setTransform(1, 0, 0, 1, 0, 0);
//             customMessage( ctx, "r: " + r, mouse.x, mouse.y, 40, -10, 20 );
//             customMessage( ctx, "c: " + c, mouse.x, mouse.y, 40, 10, 20 );
            
//             ctx1.translate(m.offsetTopLeft.x, m.offsetTopLeft.y);

//             if( !mouse.isDown ) { m.selectedTile = m.tiles[r][c]; };

//             ctx.setTransform(1, 0, 0, 1, 0, 0);
//             customMessage( ctx, "z: " + m.selectedTile.z, mouse.x, mouse.y, 40, 30, 20 );
//             ctx1.translate(m.offsetTopLeft.x, m.offsetTopLeft.y);
//           }
//         }  
//       }
//     }
//   }
// }

function devTools( ctx ) {  
  if( document.querySelector(".checkTileGrid").checked ) { map.strokeAllTilesBase( ctx, "rgba(0, 0, 255, 0.2)" ) }; 
  if( document.querySelector(".checkCollisionArea").checked ) { player.collisionModel.drawArea(map, player, ctx ) };
  if( document.querySelector(".checkPlayerPosition").checked ) { player.pinPoint( ctx, map, "#0000ff") ; };
  if( document.querySelector(".checkCanvasCenter").checked ) { drawCanvasCenter( "#ff0000", ctx ); };
  if( document.querySelector(".checkPlayerBase").checked ) { playerBase( ctx, "rgba(255, 0, 0, 0.4)" ); };
  if( document.querySelector(".checkPlayerPoint").checked ) { player.collisionModel.base.point.fill( ctx, "rgb(255, 0, 0)" ); };
  updateDevToolsInfo();
};