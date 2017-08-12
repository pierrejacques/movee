//--------     version 3.0 issued 3/27   ------------

var canvas = document.getElementsByClassName("canvas-movee");

window.onload = function(){
    if (canvas.length > 0){
    for (var i=0; i<canvas.length;i++){
        moveeCanvas(canvas[i]);
        console.log(canvas[i].style.clipPath);
    }
}
};

function moveeCanvas(c){
    var cImg = document.createElement('img');
    cImg.setAttribute("src",c.getAttribute("src"));
    cImg.onload = function(){
        //object constructing
        c['img'] = cImg;
        c.width = window.innerWidth-10;
        c.height = c.width*c.img.height/c.img.width;
        var calib = c.height*0.6;
        c['r'] = /\bright\b/i.test(c.className) || false;  //the direction of the movee
        c['cvsRedraw'] = function(){           //redraw the Img
            var ctx = this.getContext('2d');
            ctx.globalCompositeOperation = "source-over";
            ctx.clearRect(0,0,this.width,this.height);
            ctx.drawImage(this.img,0,0,this.width,this.height);
        }
        c['cvsGradient'] = function(){      //transparent gradient
        const range = 0.3;
        var ctx = this.getContext('2d');
        ctx.globalCompositeOperation="destination-in";
        if (this.r){
            var grd=ctx.createLinearGradient(this.width*range,0,this.width,0);
            grd.addColorStop(0,"transparent");
            grd.addColorStop(1-range,"white");
            ctx.fillStyle=grd;
            ctx.fillRect(this.width*range,0,this.width,this.height);
        }
        else{
            var grd=ctx.createLinearGradient(0,0,this.width*(1-range),0);
            grd.addColorStop(range,"white");
            grd.addColorStop(1,"transparent");
            ctx.fillStyle=grd;
            ctx.fillRect(0,0,this.width*(1-range),this.height);
        }
        }
        c['cvsClip'] =  function(t,deg){      //clip cvs while scrolling
            var h = 60;  //heightByPercentage
            var v = 1.6;  //velocity
            var k = Math.sin(deg/180*3.14159);
            var y0 = v*t / this.height * 100;
            var y1 = y0 - h;
            var side=100;
            var x0 = 100 - v*t / k / this.width * 100;
            var x1 = 100 -y1*this.height/k/this.width;
            if (this.r) {side = 0;x0 = 100 - x0;x1 = 100 - x1;}
            str = 'polygon('+side+'% '+y0+'%,'+x0+'% '+0+'%,'+x1+'% '+0+'%,'+side+'% '+y1+'%)'; 
            this.style.clipPath = str;
            this.style.WebkitClipPath = str;
            this.style.MozClipPath = str;
            this.style.MsClipPath = str;
            this.style.OClipPath = str;
        }    
        //addListener
        window.addEventListener('scroll',function(){
            var t = document.body.scrollTop-c.offsetTop+calib;
            if (t>0 && t<c.height+calib){
                c.cvsClip(t,17);
            }
        });
        window.addEventListener('resize',function(){
            c.width = window.innerWidth-10;
            c.height = c.width*c.img.height/c.img.width; 
            c.cvsRedraw();
            c.cvsGradient();
            c.cvsClip(document.body.scrollTop-c.offsetTop+calib,17);
        });
        //initializing
        c.cvsRedraw();
        c.cvsGradient();
        c.cvsClip(document.body.scrollTop-c.offsetTop+calib,17);
    }
}
