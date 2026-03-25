var notesIndex = 1;
var noteText;
var noteTextId;
var textSizes = 4;
var currentTextSize;
var numberOfNotes = 10;

function evaluate(input, output) {
  
  setText("#noteFooter", notesIndex + " / " + numberOfNotes);

    if (noteText != null) {
      setText(noteTextId, noteText);
    } else {
      setText(noteTextId, "Empty note");
    }

}

function onLoad(input, output) {
  currentTextSize = localStorage.getObject("textSize").size;
  noteTextId = "#noteText-" + currentTextSize;
  noteText = localStorage.getObject("note"+notesIndex);
}

function onEvent(_input, output, eventId) {
  switch (eventId) {

    // Up
    case 1:
      if (notesIndex > 1) {
        notesIndex--;
      }else{notesIndex = numberOfNotes}
      break;

    // Up-hold
    case 2:
      if (currentTextSize < textSizes) {
        currentTextSize++;
      }else{
        currentTextSize = 0;
      }
      break;

    // Down
    case 3:
      if (notesIndex < numberOfNotes) {
        notesIndex++;
      }else{
        notesIndex = 1;
      }
      break;

    // Down-hold
    case 4:
      if (currentTextSize > 0) {
        currentTextSize--;
      }else{
        currentTextSize = textSizes;
      }
      break;
  }

  noteTextId = "#noteText-" + currentTextSize;
  noteText = localStorage.getObject("note"+notesIndex);
}

function getUserInterface() {
  return { 
    template: "t", 
    textSize: { size: currentTextSize }
   };
}

