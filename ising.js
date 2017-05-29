var canvas = document.getElementById('theCanvas');
var context = canvas.getContext('2d');
var image = context.createImageData(canvas.width, canvas.height);
var tempSlider = document.getElementById('tempSlider');

for( var i=0; i<image.data.length; i+=4){

  image.data[i+3]=255;
}
context.putImageData(image,0,0);

var size = canvas.width;
var stepsPerFrame = 100000;
var startTime = 0;
var squareWidth = canvas.width/size;
var accept = 0;
var running = false;
//Graphing part
var ilsoc =500;
var myp = new MakeDraw();
myp.id = "canv";
myp.gridcolor= 'rgba(200,232,53,1)';
myp.plotcolor= 'rgba(0,0,0,0.05)';
myp.fSize=15;
myp.enumerateP=0;
myp.enumerateH=0;
myp.enumerateV=1;

var data=prepData(ilsoc);





var s = new Array(size);
for(var i=0;i<size;i++){
  s[i] = new Array(size);
  for( var j=0; j< size; j++){
    if(Math.random()<0.5){
      s[i][j]=-1;
    }
    else{
      s[i][j]=1;
    }
    colorSquare(i,j);
  }
}
//context.putImageData(image,0,0);
simulate();

function simulate(){
  if(running){
  var T = Number(tempSlider.value);
  for( var step=0; step<stepsPerFrame; step++){
    var i = Math.floor(Math.random()*size);
    var j = Math.floor(Math.random()*size);
    var ediff = deltaU(i,j);
    if ((ediff <= 0) || (Math.random() < Math.exp(-ediff/T))){
      s[i][j]*=-1;
      colorSquare(i,j);
      accept += 1;
    }
  }
  context.putImageData(image,0,0);
  recalc();
  var etotal=0;
  for( var i=0 ; i<size; i++){
    for( var j=0; j<size; j++){
      etotal= etotal+total(i,j);
    }
  }
  energyReadout.value = Number(etotal/(size*size)).toFixed(2);

}
  window.setTimeout(simulate,1);

}

function colorSquare(i,j) {
  var r,g,b;
  if(s[i][j] == 1){
    r = 173; g = 255; b = 47;
  }
  else{
    r = 0; g = 0; b = 128;
  }
  for(py=j*squareWidth; py<(j+1)*squareWidth; py++) {
    for( px= i*squareWidth; px<(i+1)*squareWidth; px++){
      var index = (px +py*image.width)*4;
      image.data[index+0] = r;
      image.data[index+1] = g;
      image.data[index+2] = b;
    }
  }
}

function deltaU(i,j){
  var leftS, rightS, topS, bottomS;
  if (i == 0) leftS = s[size-1][j]; else leftS = s[i-1][j];
  if (i == size-1) rightS = s[0][j]; else rightS = s[i+1][j];
  if (j == 0) topS = s[i][size-1]; else topS = s[i][j-1];
  if (j == size-1) bottomS = s[i][0]; else bottomS = s[i][j+1];
  return 2.0 * s[i][j] * (leftS + rightS + topS + bottomS);
}

function total(i,j){
  return -deltaU(i,j)/8;
}


function showTemp(){
  tempReadout.value = Number(tempSlider.value).toFixed(2);
}

function startStop() {
  running = !running;
  if(running){
  startButton.value = " Pause ";
}
else {
  startButton.value = " Resume ";
}
}

function prepData(amount){
  var arr = new Array(amount);
  for(var i=0; i<amount;i++){
    arr[i]=0;
  }
  return arr;
}
function recalc() {
  var etotal=0;
  for(var i=1;i<ilsoc;i++){
    data[i-1]=data[i];
  }
  for( var i=0 ; i<size; i++){
    for( var j=0; j<size; j++){
      etotal= etotal+total(i,j);
    }
  }
  data[ilsoc-1]=etotal/(size*size);
  myp.data=data;
  myp.plot();

}
