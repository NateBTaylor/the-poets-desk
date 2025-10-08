const postCanvas = document.getElementById("postCanvas");
const bgColor = document.getElementById("bgColor");
const textColor = document.getElementById("textColor");
const fontSelect = document.getElementById("fontSelect");
const increaseFont = document.getElementById("increaseFont");
const decreaseFont = document.getElementById("decreaseFont");
const margin = document.getElementById("margin");
const marginValue = document.getElementById("marginValue");
const downloadBtn = document.getElementById("downloadBtn");
const postSize = document.getElementById("postSize");
const lineHeightInput = document.getElementById("lineHeight");
const lineHeightValue = document.getElementById("lineHeightValue");

// Background
bgColor.addEventListener("input", () => {
  postCanvas.style.backgroundColor = bgColor.value;
});

// Text color
textColor.addEventListener("input", () => {
  document.execCommand("foreColor", false, textColor.value);
});

// Font
fontSelect.addEventListener("change", () => {
  document.execCommand("fontName", false, fontSelect.value);
});

// Font size
let currentFontSize = 4;
increaseFont.addEventListener("click", () => {
  if (currentFontSize < 7) currentFontSize++;
  document.execCommand("fontSize", false, currentFontSize);
});
decreaseFont.addEventListener("click", () => {
  if (currentFontSize > 1) currentFontSize--;
  document.execCommand("fontSize", false, currentFontSize);
});

lineHeightInput.addEventListener("input", () => {
    const value = lineHeightInput.value;
    postCanvas.style.lineHeight = value; // unitless line-height
    lineHeightValue.textContent = Math.round(value * 10) / 10;;
  });

const alignButtons = document.querySelectorAll(".align-btn");

function applyAlignment(align) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    let container = range.commonAncestorContainer;

    // Make sure we're working with element nodes
    while (container && container.nodeType !== 1) {
      container = container.parentNode;
    }

    if (!container) return;

    // Find all paragraphs or divs within the selection and align them
    const blocks = getSelectedBlocks(range);
    blocks.forEach(block => {
      block.style.textAlign = align;
    });

    postCanvas.focus();
  }

  function getSelectedBlocks(range) {
    const blocks = [];
    const walker = document.createTreeWalker(
      range.commonAncestorContainer,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(node) {
          if (range.intersectsNode(node) && /^(DIV|P)$/.test(node.nodeName)) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
      }
    );

    let node;
    while ((node = walker.nextNode())) {
      blocks.push(node);
    }

    // If no explicit block found (like just text), wrap it in a div
    if (blocks.length === 0 && range.startContainer === range.endContainer) {
      const div = document.createElement('div');
      range.surroundContents(div);
      blocks.push(div);
    }

    return blocks;
  }


  const pad = margin.value;
  marginValue.textContent = pad + "px";

  // Calculate inner content size so the overall editor box stays the same
  postCanvas.style.padding = pad + "px";
  postCanvas.style.boxSizing = "border-box"; // ensure padding doesn't grow the element

// Margin
margin.addEventListener("input", () => {
    const pad = margin.value;
    marginValue.textContent = pad + "px";
  
    // Calculate inner content size so the overall editor box stays the same
    postCanvas.style.padding = pad + "px";
    postCanvas.style.boxSizing = "border-box"; // ensure padding doesn't grow the element
  });

// Download as PNG
downloadBtn.addEventListener("click", () => {
  html2canvas(postCanvas).then(canvas => {
    const link = document.createElement("a");
    link.download = "poem.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});


// Prevent pasted formatting
postCanvas.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
  });

  // Make sure alignment works even after paste
  postCanvas.addEventListener('mouseup', () => {
    postCanvas.focus();
  });


const maxWidth = 500;

function setEditorSize(widthRatio, heightRatio) {
    const ratio = heightRatio / widthRatio;
    const width = Math.min(maxWidth, window.screen.width)
    const height = width * ratio;
    postCanvas.style.width = width + "px";
    postCanvas.style.height = height + "px";
  }
  
  // Handle post size changes
  postSize.addEventListener("change", () => {
    switch (postSize.value) {
      case "square":
        setEditorSize(1,1);
        break;
      case "portrait":
        setEditorSize(4,5); // e.g., Instagram portrait ratio 4:5
        break;
      case "story":
        setEditorSize(9,16); // story ratio
        break;
      case "wide":
        setEditorSize(16,9);
        break;
    }
  });
  
  // Initialize default size
  setEditorSize(1,1);