var textSize = 0;
var notes = [];
var numberOfNotes = 0;
var notesIndex = 1;



function evaluate(input, output) {
  if (numberOfNotes > 0) {
    setText("#noteFooter", notesIndex + " / " + numberOfNotes);
    setText("#noteText", notes['note' + notesIndex]);
  }else{
    setText("#noteText", "No notes");
  }
}

function onLoad(input, output) {
  var userNotes = localStorage.getObject("notes");

  var index = 1;
  for (var key in userNotes) {
    if (userNotes[key] !== null) {
      notes["note" + index] = userNotes[key]
      index++;
    }
  }

  numberOfNotes = Object.keys(notes).length;

  textSize = (localStorage.getObject("textSize")).size;
}

function onEvent(_input, output, eventId) {
  switch (eventId) {

    // Top button pressed
    case 1:
      if (notesIndex > 1) {
        notesIndex--;
      }
      break;

    // Bottom button pressed
    case 2:
      if (notesIndex < numberOfNotes) {
        notesIndex++;
      }
      break;
  }
}

function getUserInterface() {
  switch (textSize){
    case 0:
      return {template: "t-l"};

    case 1:
      return {template: "t-m"};

    case 2: 
    return {template: "t-s"};

    case 3:
      return {template: "t-xs"};
        }
    
}

