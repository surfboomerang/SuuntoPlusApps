var notesIndex = 1;
var noteText;
var noteTextId;
var textSizes;
var currentTextSize;
var numberOfNotes = 10;

function evaluate(input, output) {
  
  navigate('#uiViewSet1', currentTextSize);
  setText("#noteFooter", notesIndex + " / " + numberOfNotes);

    if (noteText != null) {
      setText(noteTextId, noteText);
    } else {
      setText(noteTextId, "Empty note");
    }

}

function onLoad(input, output) {
  currentTextSize = localStorage.getObject("textSize").size;
  textSizes = Object.keys(localStorage.getObject("textSize").sizes).length;

  noteTextId = "#noteText-" + currentTextSize;
  noteText = localStorage.getItem("note"+notesIndex);
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
      if (currentTextSize < textSizes - 1) {
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
        currentTextSize = textSizes - 1;
      }
      break;
  }

  noteTextId = "#noteText-" + currentTextSize;
  noteText = localStorage.getItem("note"+notesIndex);
}

function getUserInterface() {
  return { 
    template: "t"
   };
}

