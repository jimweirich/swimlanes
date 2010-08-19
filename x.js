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

var Branch = function (name, lane, line) {
  var result = {
    name: name,
    lane: lane,
    line: line,
  };
  return result;
}

// -------------------------------------------------------------------

var GitGrid = function () {
  var result = {
    line: 0,
    commits: {},
    connections: [],
    branches: [],

    outline: function () {
      this.context.beginPath();
      this.context.moveTo(0.5,0.5);
      this.context.lineTo(0.5, canvas.height-0.5);
      this.context.lineTo(canvas.width-0.5, canvas.height-0.5);
      this.context.lineTo(canvas.width-0.5, 0.5);
      this.context.lineTo(0.5, 0.5);
      this.context.strokeStyle = "#000";
      this.context.stroke();
    },

    drawOn: function(canvas_id, width, heigth) {
      this.canvas_id = canvas_id;
      this.canvas = document.getElementById(canvas_id);
      this.context = this.canvas.getContext("2d");
      this.canvas.width = width;
      this.canvas.heigth = heigth;
      this.lane_width = 40;
      this.outline();
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
      var h = this.lane_width * 0.7;
      return line * h + h / 2.0;
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
      this.context.textAlign = "left";
      this.context.fillText(commit.hash + " -- " + commit.description, this.x(this.lanes), y);

      this.context.beginPath();
      this.context.moveTo(x + this.scale(0.4), y);
      this.context.lineTo(this.x(this.lanes) - this.scale(0.2), y);
      this.context.lineWidth = 1;
      this.context.strokeStyle = "#ccc";
      this.context.stroke();
    },

    renderConnection: function(commit1, commit2) {
      if (! commit1 || ! commit2) {
        return;
      }
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
        this.context.quadraticCurveTo((x1+3*x2)/4.0, y1, x2, y2);
      }
      this.context.lineWidth = 3;
      this.context.stroke();
    },

    renderBranch: function(branch) {
      console.log("Rendering branch " + branch.name + ", x=" + this.x(branch.lane) + ", y=" + this.y(branch.line));
      var pts = 14;
      var w = branch.name.length * pts * 0.6;
      var x = this.x(branch.lane);
      var y = this.y(branch.line);
      console.log('ns=' + branch.name.length + ', w=' + w);
      this.context.clearRect(x-w/2.0, y-9, w, pts+4);
      this.context.fillStyle = "#000";
      this.context.font = 'bold ' + pts + 'px sans-serif';
      this.context.textAlign = "center";
      this.context.textBaseline = 'middle';
      this.context.fillText(branch.name, this.x(branch.lane), this.y(branch.line));
    },

    render: function() {
//      this.context.fillStyle = "#eee";
//      this.context.fillRect(0, 0, this.canvas.width, this.canvas.heigth);
      this.renderConnections();
      this.renderCommits();
      this.renderBranches();
    },

    renderConnections: function() {
      for (var i in this.connections) {
        var pair = this.connections[i];
        var c1 = pair[0];
        var c2 = pair[1];
        this.renderConnection(this.commits[c1], this.commits[c2]);
      }
    },

    renderCommits: function() {
      for (var i in this.commits) {
        var commit = this.commits[i];
        this.renderCommit(commit);
      }
    },

    renderBranches: function() {
      for (var i=0; i < this.branches.length; i++) {
        var branch = this.branches[i];
        this.renderBranch(branch);
      }
    },

    addCommit: function(hash, lane, description, type) {
      var c = new Commit(hash, lane, this.line, description, type);
      this.line += 1;
      this.commits[hash] = c;
    },

    connect: function(commit1, commit2) {
      this.connections.push([commit1, commit2]);
    },

    addBranch: function(branchName, lane) {
      this.branches.push(new Branch(branchName, lane, this.line));
      this.line += 1;
    },

  }
  return result;
}

// -------------------------------------------------------------------
function drawGrid() {
  var gg = new GitGrid();
  gg.drawOn("canvas", 1000, 800);
  gg.layout(6);

  gg.addBranch("Prod", 0);
  gg.addCommit('a127846d', 0, 'Initial commit (Jim Weirich)');
  gg.addBranch("Development", 1);
  gg.addCommit('b17c3898', 1, 'New Feature Branch (Jim Weirich)');
  gg.addBranch("Feature 1", 2);
  gg.addCommit('c1f8c863', 2, 'another feature branch (Jim Weirich)');
  gg.addCommit('c2641c99', 2, 'another feature branch (Jim Weirich)');
  gg.addBranch("Feature 2", 3);
  gg.addCommit('d146ab65', 3, 'Starting another feature (Jim Weirich)');
  gg.addCommit('b220bb37', 1, "Merge to dev", 'm');
  gg.addCommit('a27bf806', 0, 'Merge to production (Jim Weirich)', 'm');
  gg.addBranch("Feature 3", 4);
  gg.addCommit('f12f1158', 4, 'huh');
  gg.addCommit('d265be23', 3, 'fixed bugs (Jim Weirich)');
  gg.addCommit('f2e605dd', 4, 'huh');
  gg.addCommit('f346ab65', 4, 'huh');
  gg.addCommit('f497f0a5', 4, 'huh');
  gg.addCommit('b2f0bb37', 1, 'Converted GitGrid to a class like object (Jim Weirich)');
  gg.addCommit('a3c2b1b7', 0, 'Merge to production (Jim Weirich)', 'm');
  gg.addCommit('a444807b', 0, 'Merge to production (Jim Weirich)', 'm');

  gg.connect('a127846d', 'a27bf806');
  gg.connect('a27bf806', 'a3c2b1b7');
  gg.connect('a3c2b1b7', 'a444807b');

  gg.connect('b17c3898', 'b2f0bb37');

  gg.connect('c1f8c863', 'c2641c99');

  gg.connect('d146ab65', 'd265be23');

  gg.connect('f12f1158', 'f2e605dd');
  gg.connect('f2e605dd', 'f346ab65');
  gg.connect('f346ab65', 'f497f0a5');

  gg.connect('a127846d', 'b17c3898');
  gg.connect('a127846d', 'c1f8c863');
  gg.connect('a127846d', 'd146ab65');
  gg.connect('a27bf806', 'f12f1158');
  gg.connect('c2641c99', 'b220bb37');
  gg.connect('b220bb37', 'a27bf806');
  gg.connect('b2f0bb37', 'a3c2b1b7');
  gg.connect('f497f0a5', 'b2f0bb37');
  gg.connect('d265be23', 'a444807b');

  gg.render();
}

// -------------------------------------------------------------------


function draw_b() {
  var b_canvas = document.getElementById("canvas");
  var b_context = b_canvas.getContext("2d");
  b_context.fillRect(50, 25, 150, 50);
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
