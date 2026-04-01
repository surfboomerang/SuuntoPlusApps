var notesIndex = 1;
var noteText;
var noteTextId;
var textSizes = 3;
var currentTextSize;
var numberOfNotes = 10;

var removeEmptyNotes = function () {
  var j = 1;
  for (var i = 1; i < 11; i++) {
    noteText = localStorage.getItem("note" + i);
    if (noteText) {
      localStorage.setItem("note" + j, noteText);
      j++;
    }
  }
  numberOfNotes = j - 1;
  if (j == 1) {
    notesIndex = 0;
  }
}

var replaceNewLineCharacter = function(){
  noteText = (noteText.split("|")).join("\n");
}

function evaluate(input, output) {

  navigate('#uiViewSet1', currentTextSize);
  setText("#noteFooter", notesIndex + " / " + numberOfNotes);

  if (noteText != null) {
    setText(noteTextId, noteText);
  } else {
    if (numberOfNotes == 0) {
      setText(noteTextId, "No notes");
    } else {
      setText(noteTextId, "Empty note");
    }
  }

}

function onLoad(input, output) {
  currentTextSize = parseInt(localStorage.getItem("textSize"));

  removeEmptyNotes();
  noteTextId = "#noteText-" + currentTextSize;
  noteText = localStorage.getItem("note" + notesIndex);
  replaceNewLineCharacter();
}

function onEvent(_input, output, eventId) {
  switch (eventId) {

    // Up
    case 1:
      if (notesIndex > 1) {
        notesIndex--;
      } else { notesIndex = numberOfNotes }
      break;

    // Up-hold
    case 2:
      if (currentTextSize < textSizes - 1) {
        currentTextSize++;
      } else {
        currentTextSize = 0;
      }
      break;

    // Down
    case 3:
      if (notesIndex < numberOfNotes) {
        notesIndex++;
      } else {
        if (numberOfNotes > 0) {
          notesIndex = 1;
        }
      }
      break;

    // Down-hold
    case 4:
      if (currentTextSize > 0) {
        currentTextSize--;
      } else {
        currentTextSize = textSizes - 1;
      }
      break;
  }

  noteTextId = "#noteText-" + currentTextSize;
  noteText = localStorage.getItem("note" + notesIndex);
  replaceNewLineCharacter();
}

function getUserInterface() {
  return {
    template: "t"
  };
}

