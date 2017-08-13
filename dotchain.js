var Dot = function(x, y, vx, vy, canvas, ctx) {
  this.size = 1;

  this.x = x;
  this.y = y;
  this.vy = vx;
  this.vx = vy;

  this.canvas = canvas;
  this.ctx = ctx;

  this.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    
    if (this.x < 0) {
      this.x = this.canvas.width;
    } else if (this.x > this.canvas.width) {
      this.x = 0;
    }

    if (this.y < 0) {
      this.y = this.canvas.height;
    } else if (this.y > this.canvas.height) {
      this.y = 0;
    }
  }

  this.draw = function() {
    this.ctx.beginPath();
    this.ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.size, 0, Math.PI*2)
    this.ctx.stroke();
  }

  this.drawLineTo = function(next) {
    this.ctx.strokeStyle = getLineColor(this.dist(next));
    this.ctx.beginPath();
    this.ctx.moveTo(this.x + this.size / 2, this.y + this.size / 2);
    this.ctx.lineTo(next.x + next.size / 2, next.y + next.size / 2);
    this.ctx.stroke();
  }

  this.dist = function(next) {
    return Math.sqrt(Math.pow(this.x - next.x, 2) + Math.pow(this.y - next.y, 2))
  }
};

Dot.create = function(canvas, ctx) {
  var vxdir = Math.floor(Math.random() * 2) === 1 ? 1 : -1;
  var vydir = Math.floor(Math.random() * 2) === 1 ? 1 : -1;

  return new Dot(
    Math.random() * canvas.width,
    Math.random() * canvas.height,
    Math.random() * vxdir,
    Math.random() * vydir,
    canvas,
    ctx
  );
}

var getLineColor = function(dist) {
  var a = Math.log(100/dist);
  return LINECOLOR.replace('0.5', a);
}

var draw = function(ctx, dots) {
  ctx.fillStyle = BGCOLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var dotRendered = [];
  ctx.fillStyle = DOTCOLOR;
  for (var i = 0; i < dots.length; i++) {
    var dot = dots[i];

    dot.update();
    ctx.strokeStyle = DOTCOLOR;
    dot.draw();

    for (var j = 0; j < dotRendered.length; j++) {
      var neighbor = dotRendered[j];
      if (dot.dist(neighbor) < 100) {
        dot.drawLineTo(neighbor)
      }
    }
    dotRendered.push(dot);
  }
}

var init = function() {
  // global constants
  DOTCOLOR  = '#E63946',
  BGCOLOR   = '#1D3557',
  LINECOLOR = 'rgba(241, 250, 238, 0.5)';
  DOTAMOUNT = 50;

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  var dots = [];
  for (var i = 0; i < DOTAMOUNT; i++) {
    dots.push(Dot.create(canvas, ctx));
  }

  window.setInterval(function() {
    draw(ctx, dots)
  }, 1000/30);
};