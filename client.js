const h = document.querySelector('h1');
const svg = document.querySelector('svg');

svg.ondrop = event => {
  event.preventDefault();
  console.log(event);

  [...event.dataTransfer.items].forEach(item => {
    if (item.kind != "file") return;

    const previousImageElSvg = document.querySelector('image');
    if (previousImageElSvg) previousImageElSvg.remove();
    display(item.getAsFile());
    document.querySelector('#info').style.display = 'none';
  });
};

function display(file) {
  const imageEl = new Image();
  imageEl.src = URL.createObjectURL(file);
  imageEl.onload = event => {
    console.log('load:', event);
    const imageElSvg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    imageElSvg.setAttribute('href', URL.createObjectURL(file));
    // svg.setAttribute('width', event.target.width);
    // svg.setAttribute('height', event.target.height);
    svg.setAttribute('viewBox', `0 0 ${event.target.width} ${event.target.height}`);
    svg.appendChild(imageElSvg);
  };
}

svg.ondragover = event => {
  event.preventDefault();
  // console.log('dragover', event);
  // debugger;
};

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

// svg.onmouseup = event => {
//   console.log('up', event);
// };
// svg.onmouseleave = event => {
//   console.log('leave', event);
// };

svg.setAttribute('width', window.visualViewport.width);
svg.setAttribute('height', window.visualViewport.height);
function resize(scale) {
    let svgWidth = parseInt(svg.getAttribute('width'));
    svg.setAttribute('width', `${(svgWidth * scale)}`);
    let svgHeight = parseInt(svg.getAttribute('height'));
    svg.setAttribute('height', `${(svgHeight * scale)}`);
}