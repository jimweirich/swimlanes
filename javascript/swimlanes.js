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

var SwimLanes = function () {
  var result = {
    line: 0,
    commits: {},
    connections: [],
    branches: [],
    lanes: 0,

    updateLanes: function () {
      this.lanes = 0;
      for (i in this.branches) {
        if (this.branches[i].lane > this.lanes) {
          console.log("Branch " + i + ": " + this.branches[i].lane);
          this.lanes = this.branches[i].lane;
        }
      }
      this.lanes += 1;
      console.log("Lanes = " + this.lanes);
    },

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

    scale: function (n) {
      return n * this.lane_width;
    },

    x: function (lane) {
      return lane * this.lane_width + this.lane_width / 2.0;
    },

    y: function (line) {
      var h = this.lane_width * 0.6;
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

    render: function() {
      this.drawOn("canvas", 1000, 800);
      this.updateLanes();
//      this.context.fillStyle = "#eee";
//      this.context.fillRect(0, 0, this.canvas.width, this.canvas.heigth);
      this.renderConnections();
      this.renderCommits();
      this.renderBranches();
    },

  }
  return result;
}
