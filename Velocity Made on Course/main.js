var calculateCoordinatesDistance = function (lat1, lon1, lat2, lon2) {
  var R = 6371000; // Earth radius in meters
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

var distance = 0;
var previousDistance = 0;
var vmc = 0;

function evaluate(input, output) {
  distance = calculateCoordinatesDistance(input.Location.lat, input.Location.lon, input.Target.lat, input.Target.lon);

  vmc = previousDistance - distance;
  
  if (vmc >= 0){
    setStyle("#vmc", "color", "green");
  }
  if (vmc < 0){
    setStyle("#vmc", "color", "red");
  }
  if (vmc == 0){
    setStyle("#vmc", "color", "white");
  }

  output.Speed = input.Speed;
  output.VMC = vmc;
  previousDistance = distance;
}

function onLoad(input, output) {
}

function onEvent(_input, output, eventId) {

}

function getUserInterface() {
  return {
    template: "t"
  };
}

