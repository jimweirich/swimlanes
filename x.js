if (typeof Object.create != 'function') {
  Object.create = function(o) {
    var F = function () {};
    F.prototype = o;
    return new F();
  };
}

var Commit = function (hash, lane, line, description, type) {
  var result = {
    hash: hash,
    type: type || 'c',
    lane: lane,
    line: line,
    description: description,
  };
  return result;
}

// -------------------------------------------------------------------

var GitGrid = function () {
  var result = {
    commits: {},
    connections: [],
    branches: [],

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

    renderCommit: function(commit) {
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

      this.context.fillStyle = "#000";
      this.context.font = 'normal 12px sans-serif';
      this.context.textBaseline = 'middle';
      this.context.fillText(commit.hash + " -- " + commit.description, this.x(this.lanes), y);

      this.context.beginPath();
      this.context.moveTo(x + this.scale(0.4), y);
      this.context.lineTo(this.x(this.lanes) - this.scale(0.2), y);
      this.context.lineWidth = 1;
      this.context.strokeStyle = "#ccc";
      this.context.stroke();
    },

    renderConnection: function(commit1, commit2) {
      console.log(commit1);
      console.log("*** Drawing connection from " + commit1.description + " to " + commit2.description);
      var x1 = this.x(commit1.lane);
      var y1 = this.y(commit1.line);
      var x2 = this.x(commit2.lane);
      var y2 = this.y(commit2.line);

      this.context.beginPath();
      this.context.moveTo(x1, y1);
      if (commit1.lane === commit2.lane) {
        this.context.strokeStyle = "#000";
        this.context.lineTo(x2, y2);
      } else {
        this.context.strokeStyle = "#00f";
        var w = Math.abs(commit1.lane - commit2.lane);
        var mx = (x1 + x2) / 2.0;
        var my = (y1 + y2) / 2.0 - this.scale(0.5);
        this.context.quadraticCurveTo(mx, my, x2, y2);
      }
      this.context.lineWidth = 3;
      this.context.stroke();
    },

    render: function() {
      this.renderConnections();
      this.renderCommits();
    },

    renderConnections: function() {
      console.log("connections=" + this.connections);
      for (var i in this.connections) {
        var pair = this.connections[i];
        var c1 = pair[0];
        var c2 = pair[1];
        console.log("pair=" + pair);
        console.log("c1=" + c1);
        this.renderConnection(this.commits[c1], this.commits[c2]);
      }
    },

    renderCommits: function() {
      for (var i in this.commits) {
        var commit= this.commits[i];
        console.log("Drawing commit " + commit.description);
        this.renderCommit(commit);
      }
    },

    renderBranches: function() {
      for (var i=0; i < this.branches.length; i++) {
      }
    },

    addCommit: function(commit) {
      console.log("Adding commit '" + commit.hash + "' (" + commit.description + ")");
      this.commits[commit.hash] = commit;
      console.log(this.commits);
    },

    connect: function(commit1, commit2) {
      this.connections.push([commit1, commit2]);
    },

    addBranch: function() {
    },

  }
  return result;
}

// -------------------------------------------------------------------
function drawGrid() {
  var gg = new GitGrid();
  gg.drawOn("canvas");
  gg.layout(6);

  gg.addBranch(0, 0, "Prod");
  gg.addCommit(new Commit('a1', 0, 0, 'Initial commit (Jim Weirich)'));
  gg.addCommit(new Commit('b1', 1, 1, 'New Feature Branch (Jim Weirich)'));
  gg.addCommit(new Commit('c1', 2, 2, 'another feature branch (Jim Weirich)'));
  gg.addCommit(new Commit('c2', 2, 3, 'another feature branch (Jim Weirich)'));
  gg.addCommit(new Commit('x' , 5, 4, 'huh'));
  gg.addCommit(new Commit('b2', 1, 5, 'Converted GitGrid to a class like object (Jim Weirich)'));
  gg.addCommit(new Commit('a2', 0, 6, 'Merge to production (Jim Weirich)', 'm'));

  gg.connect('a1', 'b1');
  gg.connect('a1', 'c1');
  gg.connect('b1', 'b2');
  gg.connect('c1', 'c2');
  gg.connect('c2', 'a2');
  gg.connect('a1', 'x');

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
