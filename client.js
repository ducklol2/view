document.onpaste = event => {
  event.preventDefault();
  handle(event.clipboardData.items[0]);
};

const svg = document.querySelector('svg');
// Prevents Chrome opening item in new tab?
document.ondragover = event => event.preventDefault();

document.ondrop = event => {
  event.preventDefault();
  handle(event.dataTransfer.items[0]);
};
    
function handle(data) {
  if (data.kind != "file") return;

  const previousImageElSvg = document.querySelector('image');
  if (previousImageElSvg) previousImageElSvg.remove();
  display(data.getAsFile());
  document.querySelector('#info').style.display = 'none';
}

function display(file) {
  const imageEl = new Image();
  imageEl.src = URL.createObjectURL(file);
  imageEl.onload = event => {
    const imageElSvg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    imageElSvg.setAttribute('href', URL.createObjectURL(file));
    svg.setAttribute('viewBox', `0 0 ${event.target.width} ${event.target.height}`);
    svg.appendChild(imageElSvg);
  };
}


window.addEventListener('wheel', event => {
  event.preventDefault();
  const pointX = window.scrollX + event.x;
  const pointY = window.scrollY + event.y;
  const deltaFactor = event.deltaY / -1000;
  resize(1 + deltaFactor);
  window.scrollBy(pointX * deltaFactor, pointY * deltaFactor);
}, { passive:false });

let lastX = 0;
let lastY = 0;
svg.onmousedown = event => {
  lastX = event.x;
  lastY = event.y;
};

svg.onmousemove = event => {
  if (!event.buttons) return;
  window.scrollBy(lastX - event.x, lastY - event.y);
  lastX = event.x;
  lastY = event.y;
};

svg.setAttribute('width', window.visualViewport.width);
svg.setAttribute('height', window.visualViewport.height);
function resize(scale) {
    let svgWidth = parseInt(svg.getAttribute('width'));
    svg.setAttribute('width', `${(svgWidth * scale)}`);
    let svgHeight = parseInt(svg.getAttribute('height'));
    svg.setAttribute('height', `${(svgHeight * scale)}`);
}