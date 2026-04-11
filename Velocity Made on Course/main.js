var speed, heading, bearing, vmc;
var nauticalSpeedFormat, nauticalDistanceFormat

function evaluate(input, output) {

    speed = input.Speed;
    heading = input.Heading * (180 / Math.PI);
    bearing = input.Bearing * (180 / Math.PI);

    vmc = speed * Math.cos(heading - bearing);


  if (vmc > 0) {
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

