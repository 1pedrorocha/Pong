const canvasEl = document.querySelector("canvas"),
  canvasCtx = canvasEl.getContext("2d"),
  gapX = 50;

const field = {
  w: window.innerWidth,
  h: window.innerHeight,
  draw: function () {
    canvasCtx.fillStyle = "#286047";
    canvasCtx.fillRect(0, 0, this.w, this.h);
  },
};

const line = {
  w: 15,
  h: field.h,
  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h);
  },
};

const mouse = {
  x: 0,
  y: 0,
};

const leftPaddle = {
  x: gapX,
  y: 100,
  w: line.w,
  h: 200,

  minY: 0 + this.h / 2,
  maxY: field.height - this.h / 2,
  _move: function () {
    this.y = mouse.y - this.h / 2;
  },
  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(this.x, this.y, this.w, this.h);

    this._move();
  },
};

const rightPaddle = {
  x: field.w - line.w - gapX,
  y: 100,
  w: line.w,
  h: 200,

  speed: 16,
  _move: function () {
    if (this.y + this.h / 2 < ball.y + ball.r) {
      this.y += this.speed;
    } else {
      this.y -= this.speed;
    }
  },

  speedUp: function () {
    if (ball.speed < 8) {
      this.speed = this.speed;
    } else {
      this.speed += 20;
    }
  },

  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(this.x, this.y, this.w, this.h);
    this._move();
  },
};

const score = {
  human: 0,
  computer: 0,

  increaseHuman: function () {
    this.human++;
  },

  increaseComputer: function () {
    this.computer++;
  },

  draw: function () {
    canvasCtx.font = "bold 72px Arial";
    canvasCtx.textAlign = "center";
    canvasCtx.textBaseline = "top";
    canvasCtx.fillStyle = "#01341D";
    canvasCtx.fillText(this.human, field.w / 4, 50);
    canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 50);
  },
};

const ball = {
  x: 370,
  y: 120,
  r: 20,
  speed: 5,
  directionX: 3,
  directionY: 2,

  _calcPosition: function () {
    if (this.x + this.r > field.w - rightPaddle.w - gapX) {
      if (
        this.y + this.r > rightPaddle.y &&
        this.y - this.r < rightPaddle.y + rightPaddle.h
      ) {
        this._reverseX();
        this._speedUp();
      } else {
        score.increaseHuman();
        this._pointUp();
        this._reverseX();
        this.speed = this.speed / 2;
      }
    }

    if (this.x - this.r < 0 + leftPaddle.w + gapX) {
      if (
        this.y + this.r > leftPaddle.y &&
        this.y - this.r < leftPaddle.y + leftPaddle.h
      ) {
        this._reverseX();
        this._speedUp();
      } else {
        score.increaseComputer();
        this._pointUp();
        this._reverseX();
        this.speed = this.speed / 2;
      }
    }

    if (
      (this.y > field.h - this.r && this.directionY > 0) ||
      (this.y < 0 + this.r && this.directionY < 0)
    ) {
      this._reverseY();
    }
  },
  _reverseX: function () {
    this.directionX *= -1;
  },
  _reverseY: function () {
    this.directionY *= -1;
  },

  _speedUp: function () {
    this.speed++;
  },

  _pointUp: function () {
    this.x = field.w / 2;
    this.y = field.h / 2;
  },

  _move: function () {
    this.x += this.directionX * this.speed;
    this.y += this.directionY * this.speed;
  },
  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.beginPath();
    canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    canvasCtx.fill();

    this._move();
    this._calcPosition();
    // this._speedUp();
  },
};

function setup() {
  canvasEl.width = canvasCtx.width = field.w;
  canvasEl.height = canvasCtx.height = field.h;
}

function draw() {
  field.draw();
  line.draw();

  leftPaddle.draw();
  rightPaddle.draw();

  score.draw();

  ball.draw();
}

window.animateFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, 1000 / 60);
    }
  );
})();

function main() {
  animateFrame(main);
  draw();
}

setup();
main();

canvasEl.addEventListener("mousemove", function (e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
});
