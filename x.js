if (typeof Object.create != 'function') {
  Object.create = function(o) {
    var F = function () {};
    F.prototype = o;
    return new F();
  };
}

var Commit = function (lane, line, description, type) {
  var result = {
    type: type || 'c',
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
    commits: [],
    connections: [],

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
      if (commit.type == 'c') {
        this.context.fillStyle = "#888";
      } else {
        this.context.fillStyle = "#00f";
      }
      this.context.fill();
    },

    drawConnection: function(commit1, commit2) {
      console.log("*** Drawing connection from " + commit1.description + " to " + commit2.description);
      this.context.beginPath();
      this.context.moveTo(this.x(commit1.lane), this.y(commit1.line));
      this.context.lineTo(this.x(commit2.lane), this.y(commit2.line));
      this.context.strokeStyle = "#000";
      this.context.lineWidth = 3;
      this.context.stroke();
    },

    render: function() {
      this.drawConnections();
      this.drawCommits();
    },

    drawConnections: function() {
      for (var i=0; i < this.connections.length; i++) {
        var c1 = this.connections[i][0];
        var c2 = this.connections[i][1];
        this.drawConnection(c1, c2);
      }
    },

    drawCommits: function() {
      for (var i=0; i<this.commits.length; i++) {
        console.log("Drawing commit " + this.commits[i].description);
        this.drawCommit(this.commits[i]);
      }
    },

    addCommit: function(commit) {
      this.commits.push(commit);
    },

    connect: function(commit1, commit2) {
      this.connections.push([commit1, commit2]);
    }

  }
  return result;
}

// -------------------------------------------------------------------
function drawGrid() {
  var gg = new GitGrid();
  gg.drawOn("canvas");
  gg.layout(3);
  var a = new Commit(0, 0, 'a');
  var b = new Commit(1, 1, 'b');
  var c = new Commit(2, 3, 'c', 'm');
  gg.addCommit(a);
  gg.addCommit(b);
  gg.addCommit(c);
  gg.connect(a, c);
  gg.connect(b, c);
  gg.render();
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
