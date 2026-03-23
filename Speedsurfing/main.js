var maxTimeCategory = 0;
var timeCategoryMaxValues = {
  "t2": 0,
  "t10": 0,
  "t1800": 0,
  "t3600": 0
}

var lastDistance = 0;
var maxDistanceCategory = 0;
var alphaCategoryMaxValue = 0;
var distanceCategoryMaxValues = {
  "d100": 0,
  "d250": 0,
  "d500": 0,
  "d1852": 0
}

var serie = [{ speed: 0, distance: 0 }];

var avgSpeed = function (inputArray) {

  // Calculate the average speed of a sliced array
  var total = 0;
  for (var i = 0; i < inputArray.length; i++) {
    total += inputArray[i].speed;
  }
  var avg = total / inputArray.length;
  return avg;

}

var calculateTimeValues = function () {

  //Calculate all time based categories
  Object.keys(timeCategoryMaxValues).forEach(function (key) {
    var seconds = -1 * parseInt(key.replace('t', ''));

    var section = serie.slice(seconds);
    if (avgSpeed(section) > timeCategoryMaxValues[key]) {
      timeCategoryMaxValues[key] = avgSpeed(section); // Update each time category if avg speed is higher than previous max
    }
  })

  cleanSeries();

}

var calculateDistanceValues = function () {

  //Calculate all distance base categories
  Object.keys(distanceCategoryMaxValues).forEach(function (key) {
    var categoryDistance = parseInt(key.replace('d', ''));

    var arrayElements = 0;
    var segmentDistance = 0;

    for (var i = serie.length - 1; i >= 0; i--) {
      segmentDistance += serie[i].distance;
      arrayElements++;

      if (segmentDistance > categoryDistance) {
        var section = serie.slice(-1 * arrayElements);

        if (avgSpeed(section) > distanceCategoryMaxValues[key]) {
          distanceCategoryMaxValues[key] = avgSpeed(section); // Update each distance category if avg speed is higher than previous max
        }

        //calculate the alpha speed for the 500m category.
        if (categoryDistance == 500){
          calculateAlpha(section);
        }

        if (segmentDistance > maxDistanceCategory) {
          cleanSeries(arrayElements);
        }
        break;
      }
    }
  })

}

var calculateAlpha = function (section) {

      //calculate bearing difference
      var firstBearing = calculateBearing(section[0].location.latitude, section[0].location.longitude, section[1].location.latitude, section[1].location.longitude);
      var lastBearing = calculateBearing(section[section.length - 2].location.latitude, section[section.length - 2].location.longitude, section[section.length - 1].location.latitude, section[section.length - 1].location.longitude);

      var bearingDifference = Math.min(Math.abs(firstBearing - lastBearing), 360 - Math.abs(firstBearing - lastBearing))

      if (bearingDifference > 120) {
        //calculate the distance between the start and end position
        var startEndDiff = calculateCoordinatesDistance(section[0].location.latitude, section[0].location.longitude, section[section.length - 1].location.latitude, section[section.length - 1].location.longitude)

        //check all the conditions. 
        if (avgSpeed(section) > alphaCategoryMaxValue && startEndDiff < 50) {
          alphaCategoryMaxValue = avgSpeed(section); // Update each distance category if avg speed is higher than previous max
        }
      }

}

var cleanSeries = function () {
  //Drop the oldest elements if the max time category en longest distance category has been reached.
  if (serie.length > maxTimeCategory && serie.length > maxDistanceCategory) {
    serie.shift();
  }
}

var toRadians = function (deg) {
  return deg * Math.PI / 180;
}

var toDegrees = function (rad) {
  return rad * 180 / Math.PI;
}

var calculateBearing = function (lat1, lon1, lat2, lon2) {

  // Formula for initial bearing
  var x = Math.sin(toRadians(lon2 - lon1)) * Math.cos(toRadians(lat2));
  var y = Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
    Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(toRadians(lon2 - lon1));

  var bearing = Math.atan2(x, y);      // Bearing in radians
  bearing = toDegrees(bearing);              // Convert to degrees
  return (bearing + 360) % 360;        // Normalize to 0–360
}

var calculateCoordinatesDistance = function (lat1, lon1, lat2, lon2) {
  var R = 6371000; // Earth radius in meters
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function evaluate(input, output) {

  // TODO: add If Not Paused
  // TODO: add save categories on exit

  serie.push({
    speed: input.Speed,
    distance: input.Distance - lastDistance,
    location: input.Location
  });

  lastDistance = input.Distance

  calculateTimeValues();
  calculateDistanceValues();

  output.t2 = timeCategoryMaxValues['t2'];
  output.t10 = timeCategoryMaxValues['t10'];
  output.t1800 = timeCategoryMaxValues['t1800'];
  output.t3600 = timeCategoryMaxValues['t3600'];

  output.d100 = distanceCategoryMaxValues['d100'];
  output.d250 = distanceCategoryMaxValues['d250'];
  output.d500 = distanceCategoryMaxValues['d500'];
  output.d1852 = distanceCategoryMaxValues['d1852'];

  output.alpha = alphaCategoryMaxValue;
}

function onLoad(input, output) {
  //find the longest time category
  Object.keys(timeCategoryMaxValues).forEach(function (key) {
    var time = parseInt(key.replace('t', ''));

    if (time > maxTimeCategory) {
      maxTimeCategory = time
    }
  })

  //find the largest distance category
  Object.keys(distanceCategoryMaxValues).forEach(function (key) {
    var distance = parseInt(key.replace('d', ''));

    if (distance > maxDistanceCategory) {
      maxDistanceCategory = distance
    }
  })
}

function onEvent(_input, output, eventId) {
}

function getUserInterface() {
  return {
    template: 't'
  };
}

