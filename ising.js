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
}
  window.setTimeout(simulate,1);

}

function colorSquare(i,j) {
  var r,g,b;
  if(s[i][j] == 1){
    r = 215; g = 100; b = 155;
  }
  else{
    r = 185; g = 25; b = 72;
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

window.onload = function () {

  var dps = []; // dataPoints

  var chart = new CanvasJS.Chart("chartContainer",{
    title :{
      text: "energy vs time"
    },
    data: [{
      type: "line",
      dataPoints: dps
    }]
  });

  var xVal = 0;
  var yVal = 0;
  var updateInterval = 1;
  var dataLength = 10000; // number of dataPoints visible at any point

  var updateChart = function () {

    var etotal=0;

    for( var i=0 ; i<size; i++){
      for( var j=0; j<size; j++){
        etotal= etotal+total(i,j);
      }
    }
    yVal=etotal/(size*size);




      dps.push({
        x: xVal,
        y: yVal
      });
      xVal++;
      yVal=0;

    if (dps.length > dataLength)
    {
      dps.shift();
    }

    chart.render();

  };

  // generates first set of dataPoints
  updateChart(dataLength);

  // update chart after specified time.
  setInterval(function(){updateChart()}, updateInterval);
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
