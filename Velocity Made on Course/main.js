var speed, heading, bearing, distance, vmc;
var nauticalSpeedFormat, nauticalDistanceFormat
var previousDistance

var calculateByDistance = function (distance) {
  // Low accuracy
  var difference = previousDistance - distance;
  previousDistance = distance
  return difference;
}

var calculateByBearing = function (speed, heading, bearing) {
  // Higher accuracy
  if (speed) {
    return speed * Math.cos(heading - bearing);
  } else {
    return null;
  }
}

function evaluate(input, output) {

  if (input.Bearing) {
    setText("#titleText", "Accuracy: HIGH");
    speed = input.Speed;
    heading = input.Heading * (180 / Math.PI);
    bearing = input.Bearing * (180 / Math.PI);

    vmc = calculateByBearing(speed, heading, bearing);
  } else {
    setText("#titleText", "Accuracy: LOW");
    distance = input.Distance;
    vmc = calculateByDistance(distance);
  }

  if (vmc > 0) {
    setStyle("#title", "background-color", "#00FF00");
  } else {
    if (vmc < 0) {
      setStyle("#title", "background-color", "#FF0000");
    } else {
      setStyle("#title", "background-color", "#FFFFFF")
    }
  }


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
  if (nauticalSpeedFormat) {
    speedFormat = "NauticalSpeed_Fourdigits";
  } else {
    speedFormat = "Speed_Fourdigits";
  }

  var distanceFormat;
  if (nauticalDistanceFormat) {
    distanceFormat = "NauticalDistance_Fivedigits";
  } else {
    distanceFormat = "Distance_Accurate";
  }


  return {
    template: "t",
    speed: { format: speedFormat },
    distance: { format: distanceFormat }
  };
}

