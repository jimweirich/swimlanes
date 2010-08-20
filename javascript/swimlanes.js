var SwimLanes = function (canvasId) {

  var Commit = function (hash, lane, line, when, description) {
    var result = {
      hash: hash,
      lane: lane,
      line: line,
      when: when,
      dim: false,
      description: description,
      parents: [],

      isMerge: function () { return this.parents.length > 1; },
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

  var result = {

    // Public API ----------------------------------------------------

    addBranch: function(lane, branchName) {
      this.branches.push(new Branch(branchName, lane, this.line));
      this.line += 1;
    },

    addCommit: function(lane, hash, when, description) {
      var c = new Commit(hash, lane, this.line, when, description);
      this.line += 1;
      this.commits[hash] = c;
    },

    connect: function(parent_hash, child_hash) {
      this.connections.push([parent_hash, child_hash]);
      var parent = this.commits[parent_hash];
      var child = this.commits[child_hash];
      if (parent && child) {
        child.parents.push(parent);
      }
    },

    render: function() {
      this.calculateSize();
      this.renderElements();
    },

    getCursorPosition: function (e) {
      var x;
      var y;
      if (e.pageX || e.pageY) {
	x = e.pageX;
	y = e.pageY;
      }
      else {
	x = e.clientX + document.body.scrollLeft +
        document.documentElement.scrollLeft;
	y = e.clientY + document.body.scrollTop +
        document.documentElement.scrollTop;
      }

      x -= this.canvas.offsetLeft;
      y -= this.canvas.offsetTop;

      var cell = {
//        x: Math.floor(y/kPieceWidth),
//        y: Math.floor(x/kPieceHeight),
        x: x, y: y,
      };

      return cell;
    },

    whatLane: function(x) {
      x = x - 30;               // Lame, this comes from the padding
      var lane = Math.floor(x / this.laneWidth);
      if (lane >= this.lanes) {
        lane = -1;
      }
      return lane;
    },

    click: function(e) {
      var cell = this.getCursorPosition(e);
      var x = cell.x;
      var y = cell.y;

      var hitLane = this.whatLane(x);
      var hitLine = this.whatLine(y);
      var hitCommit = this.locateCommit(hitLane, hitLine);
      console.log("CLICKED, x=" + x + " (" + hitLane + "), y=" + y + " (" + hitLine + ")");
      console.log(hitCommit);
      if (hitCommit) {
        this.allDim();
        this.highlightParents(hitCommit, hitCommit.isMerge());
        this.highlighted = true;
      } else if (hitLane || hitLane == 0) {
        this.highlightLane(hitLane);
        this.highlighted = true;
      } else {
        this.noDim();
        this.highlighted = false;
      }
      this.renderElements();
    },

    // Private -------------------------------------------------------

    line: 0,
    commits: {},
    connections: [],
    branches: [],
    lanes: 0,
    pts: 14,
    highlighted: false,

    hashFont: 'normal 14px monospace',
    whenFont: 'normal 12px sans-serif',
    descFont: 'normal 12px sans-serif',
    branchFont: function () { return 'bold ' + this.pts + 'px sans-serif'; },

    outlineColor: "#000",
    backgroundColor: "#eee",
    textColor: "#000",
    commitColor: "#888",
    mergeColor: "#00f",
    dimColor: "#ccc",

    calculateSize: function () {
      this.canvas = document.getElementById(canvasId);
      this.context = this.canvas.getContext("2d");
      this.laneWidth = 40;
      this.lineHeight = this.laneWidth * 0.6;
      this.updateLanes();
      this.calculateWidth();
      this.calculateHeight();
      this.canvas.width = this.width;
      this.canvas.height = this.height;

      this.canvas.addEventListener("click", function(e) { result.click(e); } );
    },

    calculateWidth: function () {
      var longestDesc = 0;
      var longestHash = 0;
      var longestWhen = 0;
      for (i in this.commits) {
        var c = this.commits[i];

        this.context.font = this.hashFont;
        textWidth = this.context.measureText(c.hash).width;
        if (textWidth > longestHash) {
          longestHash = textWidth;
        }

        this.context.font = this.descFont;
        var textWidth = this.context.measureText(c.description).width;
        if (textWidth > longestDesc) {
          longestDesc = textWidth;
        }

        this.context.font = this.whenFont;
        textWidth = this.context.measureText(c.when).width;
        if (textWidth > longestWhen) {
          longestWhen = textWidth;
        }
      }
      this.whenX = this.hashX() + longestHash + 10;
      this.descX = this.whenX + longestWhen + 10;
      this.width = this.descX + longestDesc + 20;
    },

    calculateHeight: function() {
      this.height = this.line * this.lineHeight + 20;
    },

    updateLanes: function () {
      this.lanes = 0;
      for (i in this.branches) {
        if (this.branches[i].lane > this.lanes) {
          this.lanes = this.branches[i].lane;
        }
      }
      this.lanes += 1;
    },

    outline: function () {
      var w = this.canvas.width;
      var h = this.canvas.height;
      this.canvas.width = w;

      this.context.beginPath();
      this.context.moveTo(0.5, 0.5);
      this.context.lineTo(0.5, h-0.5);
      this.context.lineTo(w-0.5, h-0.5);
      this.context.lineTo(w-0.5, 0.5);
      this.context.lineTo(0.5, 0.5);
      this.context.strokeStyle = this.outlineColor;
      this.context.stroke();

      this.context.fillStyle = this.backgroundColor;
      this.context.fillRect(1, 1, w-2, h-2);
    },

    scale: function (n) {
      return n * this.laneWidth;
    },

    x: function (lane) {
      return lane * this.laneWidth + this.laneWidth / 2.0;
    },

    y: function (line) {
      var h = this.lineHeight;
      return line * h + h / 2.0;
    },

    hashX: function () {
      return this.x(this.lanes);
    },

    noDim: function () {
      for (i in this.commits) {
        this.commits[i].dim = false;
      }
    },

    allDim: function () {
      for (i in this.commits) {
        this.commits[i].dim = true;
      }
    },

    highlightParents: function(commit, showMerge) {
      if (! commit.dim) { return; }
      if (! commit.isMerge() || showMerge) {
        commit.dim = false;
      }
      for (i in commit.parents) {
        this.highlightParents(commit.parents[i], showMerge);
      }
    },

    highlightLane: function(lane) {
      for (i in this.commits) {
        if (this.commits[i].lane === lane) {
          this.commits[i].dim = false;
        } else {
          this.commits[i].dim = true;
        }
      }
    },

    renderCommit: function(commit) {
      var x = this.x(commit.lane);
      var y = this.y(commit.line);
      if (commit.isMerge() && commit.dim) {
        this.context.fillStyle = this.dimMergeColor;
        this.context.strokeStyle = this.dimMergeColor;
      } else if (commit.dim) {
        this.context.fillStyle = this.dimCommitColor;
        this.context.strokeStyle = this.dimColor;
      } else if (commit.isMerge()) {
        this.context.fillStyle = this.mergeColor;
        this.context.strokeStyle = this.lineColor;
      } else {
        this.context.fillStyle = this.commitColor;
        this.context.strokeStyle = this.lineColor;
      }
      this.context.textBaseline = 'middle';
      this.context.textAlign = "left";
      this.context.font = this.hashFont;
      this.context.fillText(commit.hash, this.hashX(), y);
      this.context.font = this.whenFont;
      this.context.fillText(commit.when, this.whenX, y);
      this.context.font = this.descFont;
      this.context.fillText(commit.description, this.descX, y);

      this.context.beginPath();
      this.context.moveTo(x + this.scale(0.4), y);
      this.context.lineTo(this.x(this.lanes) - this.scale(0.2), y);
      this.context.lineWidth = 1;
      this.context.strokeStyle = this.dimColor;
      this.context.stroke();
    },

    renderConnection: function(parent, child) {
      if (! parent || ! child) {
        return;
      }
      var x1 = this.x(commit1.lane);
      var y1 = this.y(commit1.line);
      var x2 = this.x(commit2.lane);
      var y2 = this.y(commit2.line);

      this.context.beginPath();
      this.context.moveTo(x1, y1);
      if (parent.lane === child.lane) {
        if (parent.dim || child.dim) {
          this.context.strokeStyle = this.dimColor;
        } else {
          this.context.strokeStyle = this.lineColor;
        }
        this.context.lineTo(x2, y2);
      } else {
        this.context.strokeStyle = this.mergeColor;
        this.context.quadraticCurveTo((x1+3*x2)/4.0, y1, x2, y2);
      }
      this.context.lineWidth = 3;
      this.context.stroke();
    },

    renderBranch: function(branch) {
      this.context.font = this.branchFont();
      var w = this.context.measureText(branch.name).width + 4;
      var x = this.x(branch.lane);
      var y = this.y(branch.line);
      this.context.fillStyle = this.backgroundColor;
      this.context.fillRect(x-w/2.0, y-9, w, this.pts+4);
      this.context.fillStyle = this.textColor;
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
        this.renderCommit(commit, this.highLight >= 0 && commit.lane !== this.highLight);
      }
    },

    renderBranches: function() {
      for (var i=0; i < this.branches.length; i++) {
        var branch = this.branches[i];
        this.renderBranch(branch);
      }
    },

    renderElements: function () {
      this.outline();
      this.renderConnections();
      this.renderCommits();
      this.renderBranches();
    },
  }
  return result;
}
