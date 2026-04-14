var segment = [];
var windDirection = 45;
var tackAngle = 45, jibeAngle = 45, planeSpeed = 5.55;
var tacks = 0, jibes = 0, planingJibes = 0;
var waitCounter = 0;
var turnAngle = 120, turnIndicator = false;

var toDegrees = function (rad) {
  return parseInt(rad * 180 / Math.PI);
}

var toRadians = function (deg) {
  return deg * Math.PI / 180;
}


var setWaitCounter = function () {
  waitCounter = 10;
}

var minSpeed = function(inputArray){
  var minSpeed = 999;
  for (var i = 0; i < inputArray.length; i++) {
    if (inputArray[i].spd < minSpeed) { minSpeed = inputArray[i].spd }
  }
  return minSpeed;
}

var analyzeTurn = function (inputArray) {

  for (var i = 0; i < inputArray.length; i++) {
    var AoA = inputArray[i].AoA

    // if AoA is within the tack range
    if (AoA < (windDirection + tackAngle + 360) % 360 && AoA > (windDirection - tackAngle + 360) % 360) {
      tacks++;
      break;
    }

    //if AoA is within the jibe range
    if (AoA < (windDirection + 180 + jibeAngle + 360) % 360 && AoA > (windDirection + 180 - jibeAngle + 360) % 360) {
      if (minSpeed(segment) > planeSpeed) {
        planingJibes++;
      }else{
        jibes++
      }
      break;
    }
  }
}

  function evaluate(input, output) {

    segment.push({
      spd: input.Speed,
      hdg: input.Heading,
      AoA: Math.abs(toDegrees(input.Heading) - windDirection)
    });

    if (segment.length > 9) {
      segment.shift();
    }

    if (waitCounter == 0) {
      // if the angle difference between the first and the last element of the segment is more than the turnagle, assume a turn has performed
      if ((Math.abs(toDegrees(segment[0].hdg) - toDegrees(segment[segment.length - 1].hdg))) > turnAngle) {
        turnIndicator = true;
        setWaitCounter();
      }
    } else {
      waitCounter--;
    }

    //if turn is performed find out if it is a tack or jibe
    if (turnIndicator) {
      analyzeTurn(segment);
      turnIndicator = false;
    }

      output.WindDirection = toRadians(windDirection);
      output.Tacks = tacks;
      output.Jibes = jibes;
      output.PlaningJibes = planingJibes;
      output.AoA = toRadians(segment[segment.length - 1].AoA);
  }

  function onLoad(input, output) {
  }

  function getUserInterface() {
    return {
      template: 't'
    };
  }


  function getSummaryOutputs(input, output) {
  }
