var speed, heading, bearing, windDirection, vmc, vmg;
var nauticalSpeedFormat, nauticalDistanceFormat
var mode = 0 //0=vmc, 1=vmg


var toDegrees = function (rad) {
  return rad * 180 / Math.PI;
}

var toRadians = function (deg) {
  return deg * Math.PI / 180;
}

var thresholdColor = function (speed) {
  if (speed >= 0) {
    setStyle("#title", "background-color", "#00FF00");
    setStyle("#title", "color", "#000000");
  } else {
    if (speed < 0) {
      setStyle("#title", "background-color", "#FF0000");
      setStyle("#title", "color", "#FFFFFF");
    } else {
      setStyle("#title", "background-color", null)
      setStyle("#title", "color", null);
    }
  }
}

function evaluate(input, output) {
  navigate("#uiViewSetTitle", mode);
  navigate("#uiViewSetVMG", mode);

  speed = input.Speed;
  heading = input.Heading;

  if (mode == 0) {
   speed = input.Speed;
    heading = input.Heading;    
    bearing = input.Bearing

    vmc = speed * Math.cos(heading - bearing);

    output.VMC = vmc;
    bearing = (toDegrees(bearing) + 360) % 360; //normalize angle
    output.Bearing = toRadians(bearing);

    thresholdColor(vmc);
  }

  if (mode == 1) {
    vmg = speed * Math.cos(heading - windDirection);

    output.Bearing = windDirection;
    output.VMG = vmg;

    thresholdColor(vmg);
  }

}

function onLoad(input, output) {
  nauticalSpeedFormat = localStorage.getObject('units').nauticalSpeed;
  nauticalDistanceFormat = localStorage.getObject('units').nauticalDistance;
}

function onEvent(input, output, eventId) {
  switch (eventId) {

    // Up-hold
    case 1:
      windDirection = input.compassHeading;
      mode = 1;
      break;

    // Down
    case 2:
      if (mode == 1) {
        mode = 0;
      } else {
        mode = 1;
      }
      break;

  }
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
    template: 't',
    speed: { format: speedFormat },
    distance: { format: distanceFormat }
  };
}

