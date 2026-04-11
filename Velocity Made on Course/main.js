var speed, heading, bearing, vmc;
var nauticalSpeedFormat, nauticalDistanceFormat

var toDegrees = function (rad) {
  return rad * 180 / Math.PI;
}

var toRadians = function (deg) {
  return deg * Math.PI / 180;
}

function evaluate(input, output) {

  if (input.Distance) { //check if POI is selected
    speed = input.Speed;
    heading = input.Heading;
    bearing = input.Bearing

    vmc = speed * Math.cos(heading - bearing);

    if (vmc >= 0) {
      setStyle("#title", "background-color", "#00FF00");
      setStyle("#title", "color", "#000000");
    } else {
      if (vmc < 0) {
        setStyle("#title", "background-color", "#FF0000");
        setStyle("#title", "color", "#FFFFFF");
      } else {
        setStyle("#title", "background-color", null)
        setStyle("#title", "color", null);
      }
    }

    output.VMC = vmc;
    bearing = (toDegrees(bearing) + 360) % 360 //normalize angle
    output.Bearing = toRadians(bearing);
  }
}

function onLoad(input, output) {
  nauticalSpeedFormat = localStorage.getObject('units').nauticalSpeed;
  nauticalDistanceFormat = localStorage.getObject('units').nauticalDistance;
}

function onEvent(_input, output, eventId) {
}

function getUserInterface() {
  var speedFormat;
  if (nauticalSpeedFormat) {
    speedFormat = "NauticalSpeed_Fourdigits";
  } else {
    speedFormat = "Speed_Fourdigits";
  }

  var distanceFormat;
  if (nauticalDistanceFormat) {
    distanceFormat = "NauticalDistance_Fourdigits";
  } else {
    distanceFormat = "Distance_Threedigits";
  }

  return {
    template: "t",
    speed: { format: speedFormat },
    distance: { format: distanceFormat }
  };
}

