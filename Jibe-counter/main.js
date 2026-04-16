var segment = [];
var windDirection;
var turnAngle = 120, tackAngle = 45, jibeAngle = 45, planeSpeed = 5;
var tacks = 0, jibes = 0, planingJibes = 0;
var waitCounter = 0;

var currentTemplate = 'p1';

var changeView = function (template) {
  currentTemplate = template;
  unload('_cm'); // Unload & reload the screen to run getUserInterface
};

var toDegrees = function (rad) {
  return parseInt(rad * 180 / Math.PI);
}

var toRadians = function (deg) {
  return deg * Math.PI / 180;
}

var setWaitCounter = function () {
  waitCounter = 10;
}

var minSpeed = function (inputArray) {
  var minSpeed = 999;
  for (var i = 0; i < inputArray.length; i++) {
    if (inputArray[i].spd < minSpeed) { minSpeed = inputArray[i].spd }
  }
  return minSpeed;
}

var analyzeTurn = function (inputArray) {

  for (var i = 0; i < inputArray.length; i++) {
    var AoA = inputArray[i].AoA

    // if heading is within the tack range
    if (AoA < 0 + tackAngle) {
      tacks++;
      setWaitCounter();
      break;
    }

    //if heading is within the jibe range
    if (AoA > 180 - jibeAngle) {
      if (minSpeed(segment) > planeSpeed) {
        planingJibes++;
      } else {
        jibes++
      }
      setWaitCounter();
      break;
    }
  }
}

function evaluate(input, output) {

  if (windDirection) {

    segment.push({
      spd: input.Speed,
      hdg: input.Heading,
      AoA: Math.abs(((toDegrees(input.Heading)-windDirection+540)%360)-180) 
    });

    if (segment.length > 9) {
      segment.shift();
    }

    if (waitCounter == 0) {
      // if the angle difference between the first and the last element of the segment is more than the turn angle, assume a turn has performed
      if ((Math.abs(toDegrees(segment[0].hdg) - toDegrees(segment[segment.length - 1].hdg))) > turnAngle) {
        analyzeTurn(segment);
      }
    } else {
      waitCounter--;
    }

    output.WindDirection = toRadians(windDirection);
    output.Tacks = tacks;
    output.Jibes = jibes;
    output.PlaningJibes = planingJibes;
    output.AoA = toRadians(segment[segment.length - 1].AoA);

  }
}

function onLoad(input, output) {
}

function onEvent(input, output, eventId) {
  switch (eventId) {

    // Up
    case 1:
      windDirection = toDegrees(input.compassHeading);
      changeView('t');
      break;

  }
}

function getUserInterface() {
  return {
    template: currentTemplate
  };
}


function getSummaryOutputs(input, output) {
}
