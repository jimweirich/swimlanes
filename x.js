if (typeof Object.create != 'function') {
  Object.create = function(o) {
    var F = function () {};
    F.prototype = o;
    return new F();
  };
}

var Commit = function (lane, line, description) {
  var result = {
    lane: lane,
    line: line,
    description: description,

    draw: function (grid) {
      grid.drawCommit(this);
    }
  };
  return result;
}

// -------------------------------------------------------------------

var GitGrid = function () {
  var result = {
    drawOn: function(canvas_id) {
      this.canvas_id = canvas_id;
      this.canvas = document.getElementById(canvas_id);
      this.context = this.canvas.getContext("2d");
      this.lane_width = 40;
    },

    layout: function (lanes) {
      this.lanes = lanes;
    },

    scale: function (n) {
      return n * this.lane_width;
    },

    x: function (lane) {
      return lane * this.lane_width + this.lane_width / 2.0;
    },

    y: function (line) {
      return line * this.lane_width + this.lane_width / 2.0;
    },

    drawCommit: function(commit) {
      var x = this.x(commit.lane);
      var y = this.y(commit.line);
      this.context.beginPath();
      this.context.arc(x, y, this.scale(0.2), Math.PI*2, false);
      this.context.closePath();
      this.context.strokeStyle = "#000";
      this.context.lineWidth = 3;
      this.context.stroke();
      this.context.fillStyle = "#888";
      this.context.fill();
    },

    connect: function(lane1, line1, lane2, line2) {
      this.context.beginPath();
      this.context.moveTo(this.x(lane1), this.y(line1));
      this.context.lineTo(this.x(lane2), this.y(line2));
      this.context.strokeStyle = "#000";
      this.context.lineWidth = 3;
      this.context.stroke();
    },
  }
  return result;
}

// -------------------------------------------------------------------
function drawGrid() {
  var gg = new GitGrid();
  gg.drawOn("canvas");
  gg.connect(0,0,1,1);
  gg.drawCommit(new Commit(0,0, 'a'));
  gg.drawCommit(new Commit(1,1, 'a'));
  var c = new Commit(3, 5, 'A commit');
  c.draw(gg);
}
// -------------------------------------------------------------------


function draw_b() {
  var b_canvas = document.getElementById("canvas");
  var b_context = b_canvas.getContext("2d");
  b_context.fillRect(50, 25, 150, 50);
}

function draw_outline() {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  context.beginPath();
  context.moveTo(0.5,0.5);
  context.lineTo(0.5, canvas.height-0.5);
  context.lineTo(canvas.width-0.5, canvas.height-0.5);
  context.lineTo(canvas.width-0.5, 0.5);
  context.lineTo(0.5, 0.5);
  context.strokeStyle = "#000";
  context.stroke();
}

function draw_circle() {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  context.beginPath();
  context.arc(50,50, 25, Math.PI*2, false);
  context.closePath();
  context.strokeStyle = "#ff0f80";
  context.lineWidth = 10;
  context.stroke();
  context.fillStyle = "#888";
  context.fill();
}

function draw_curve() {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  context.beginPath();
  context.moveTo(50, 50);
  context.quadraticCurveTo(10, 200, 200, 200);
  context.strokeStyle = "#00ff00";
  context.lineWidth = 10;
  context.stroke();
}

function GitGraph() {
  {
    
  }
}
