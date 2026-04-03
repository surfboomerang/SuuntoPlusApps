var speed, heading, targetBearing, vmc;
var nauticalSpeedFormat, nauticalDistanceFormat

var radians_to_degrees =function(radians){
  var pi = Math.PI;
  return radians * (180/pi);
}

function evaluate(input, output) {

  speed = input.Speed;
  heading = radians_to_degrees(input.Heading);
  targetBearing = radians_to_degrees(input.TargetBearing);

  vmc = speed * Math.cos(heading - targetBearing);

  output.VMC = vmc;
}

function onLoad(input, output) {
  nauticalSpeedFormat = localStorage.getObject('units').nauticalSpeed;
  nauticalDistanceFormat = localStorage.getObject('units').nauticalDistance;
}

function onEvent(_input, output, eventId) {
}

function getUserInterface() {
  var speedFormat;
  if (nauticalSpeedFormat){
    speedFormat = "NauticalSpeed_Fourdigits";
  }else{
    speedFormat = "Speed_Fourdigits";
  }

  var distanceFormat;
  if (nauticalDistanceFormat){
    distanceFormat = "NauticalDistance_Fivedigits";
  }else{
    distanceFormat = "Distance_Accurate";
  }


  return {
    template: "t",
    speed:{format: speedFormat},
    distance:{format: distanceFormat}
  };
}

// Todo Save VMC in logs

