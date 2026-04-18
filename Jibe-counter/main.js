var segment = [];
var windDirection;
var tacks = 0, jibes = 0, planingJibes = 0, legDistance = 0, previousDistance = 0;
var popupTimer = 0;

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

var minSpeed = function (inputArray) {
  var minSpeed = 999;
  for (var i = 0; i < inputArray.length; i++) {
    if (inputArray[i].spd < minSpeed) { minSpeed = inputArray[i].spd }
  }
  return minSpeed;
}

var analyzeTurn = function (inputArray) {

  for (var i = 0; i < inputArray.length; i++) {
    var TWA = inputArray[i].twa

    // if heading is within the tack range
    if (TWA < 0 + 45) {
      tacks++;
      break;
    }

    //if heading is within the jibe range
    if (TWA > 180 - 45) {
      if (minSpeed(segment) > 5) {
        planingJibes++;
      } else {
        jibes++
      }
      break;
    }
  }
}

function evaluate(input, output) {

  if (windDirection) {
    if (popupTimer > 0) {
      popupTimer--;
    }

    if (popupTimer == 0 && currentTemplate != 't') {
      changeView('t');
    }


    segment.push({
      spd: input.Speed,
      hdg: input.Heading,
      twa: Math.abs(((toDegrees(input.Heading) - windDirection + 540) % 360) - 180)
    });

    if (segment.length > 9) {
      segment.shift();
    }

    legDistance += input.Distance - previousDistance;
    previousDistance = input.Distance;

    if (legDistance > 30) {
      // if the angle difference between the first and the last element of the segment is more than the turn angle, assume a turn has performed
      if ((Math.abs(toDegrees(segment[0].hdg) - toDegrees(segment[segment.length - 1].hdg))) > 120) {
        analyzeTurn(segment);
        legDistance = 0;
      }
    }

    output.WindDirection = toRadians(windDirection);
    output.Tacks = tacks;
    output.Jibes = jibes;
    output.PlaningJibes = planingJibes;
    output.TWA = toRadians(segment[segment.length - 1].twa);
    output.legDistance = legDistance;

  }
}

function onLoad(input, output) {
}

function onEvent(input, output, eventId) {
  switch (eventId) {

    // Up
    case 1:
      windDirection = toDegrees(input.compassHeading);
      changeView('p2');
      popupTimer = 3;
      break;

  }
}

function getUserInterface() {
  return {
    template: currentTemplate
  };
}

function getSummaryOutputs(input, output) {
  return [
    {
      id: 'tacks',
      name: 'Tacks',
      format: 'Count_Fourdigits',
      value: output.Tacks
    },
    {
      id: 'jibes',
      name: 'Jibes',
      format: 'Count_Fourdigits',
      value: output.Jibes
    },
    {
      id: 'planingJibes',
      name: 'Planing jibes',
      format: 'Count_Fourdigits',
      value: output.PlaningJibes
    }
  ];
}
