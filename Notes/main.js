var textSize = 0;
var notes = [];
var numberOfNotes = 0;
var notesIndex = 1;
var textSizes;
var currentTextSize;
var noteTextId

function evaluate(input, output) {
  noteTextId = "#noteText-" + currentTextSize;

    if (numberOfNotes > 0) {
      setText("#noteFooter", notesIndex + " / " + numberOfNotes);
      setText(noteTextId, notes['note' + notesIndex]);
    } else {
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

  textSizes = localStorage.getObject("textSize").sizes;
  currentTextSize = localStorage.getObject("textSize").size;
  noteTextId = "#noteText-" + currentTextSize;
}

function onEvent(_input, output, eventId) {
  switch (eventId) {

    // Top button pressed
    case 1:
      if (notesIndex > 1) {
        notesIndex--;
      }
      break;

    // Top button long pressed
    case 4:
      if (currentTextSize > 0) {
        currentTextSize--;
      }
      break;

    // Bottom button pressed
    case 3:
      if (notesIndex < numberOfNotes) {
        notesIndex++;
      }
      break;

    // Bottom button long pressed
    case 2:
      if (currentTextSize < Object.keys(textSizes).length - 1) {
        currentTextSize++;
      }
      break;
  }
}

function getUserInterface() {
  return { template: "t" };
}

