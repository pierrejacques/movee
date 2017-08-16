const canvas = document.getElementsByClassName('canvas-movee');
const $canvas = [].slice.call(canvas);
window.onload = () => {
  $canvas.forEach(item => moveeCanvas(item));
};

let timer;
const moveeCanvas = c => {
  const cImg = new Image();
  cImg.setAttribute('src', c.getAttribute('src'));
  cImg.onload = () => {
    //object constructing
    c.img = cImg;
    c.width = window.innerWidth - 10;
    c.height = c.width * c.img.height / c.img.width;
    const calib = c.height * 0.6;
    c.r = c.classList.contains('right');
    c.cvsRedraw = () => { //redraw the Img
      const ctx = c.getContext('2d');
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.drawImage(c.img, 0, 0, c.width, c.height);
    }
    c.cvsGradient = () => { //transparent gradient
      const range = 0.3;
      const ctx = c.getContext('2d');
      let grd;
      ctx.globalCompositeOperation = 'destination-in';
      if (c.r) {
        grd = ctx.createLinearGradient(c.width * range, 0, c.width, 0);
        grd.addColorStop(0, 'transparent');
        grd.addColorStop(1 - range, 'white');
        ctx.fillStyle = grd;
        ctx.fillRect(c.width * range, 0, c.width, c.height);
      } else {
        grd = ctx.createLinearGradient(0, 0, c.width * (1 - range), 0);
        grd.addColorStop(range, 'white');
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, c.width * (1 - range), c.height);
      }
    }
    c.cvsClip = function(t, deg = 17) { //clip cvs while scrolling
      const h = 60; //heightByPercentage
      const v = 1.6; //velocity
      const k = Math.sin(deg / 180 * 3.14159);
      const y0 = v * t / c.height * 100;
      const y1 = y0 - h;
      let side = 0;
      let x0 = v * t / k / c.width * 100;
      let x1 = y1 * c.height / k / c.width;
      if (!c.r) {
        side = 100;
        x0 = 100 - x0;
        x1 = 100 - x1;
      }
      const str = `polygon(${side}% ${y0}%, ${x0}% 0%, ${x1}% 0%, ${side}% ${y1}%)`;
      c.style['clip-path'] = str;
      c.style['-webkit-clip-path'] = str;
    }

    //initialize
    const init = () => {
      c.cvsRedraw();
      c.cvsGradient();
      c.cvsClip(document.body.scrollTop - c.offsetTop + calib, 17);
    }

    //addListener
    window.addEventListener('scroll', function() {
      const t = document.body.scrollTop - c.offsetTop + calib;
      if (t > 0 && t < c.height + calib) {
        c.cvsClip(t);
      }
    });
    window.addEventListener('resize', function() {
      c.width = window.innerWidth - 10;
      c.height = c.width * c.img.height / c.img.width;
      init();
    });

    // run
    init();
  };
}
