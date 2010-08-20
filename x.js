
function swim(canvasId) {
  var sl = new SwimLanes(canvasId);

  sl.addBranch(0, "Prod");
  sl.addCommit(0, 'a127846d', '125 days ago', 'Initial commit (Jim Weirich)');
  sl.addBranch(1, "Development");
  sl.addCommit(1, 'b17c3898', '3 days ago', 'Development Branch (Jim Weirich)');
  sl.addBranch(2, "Feature 1");
  sl.addCommit(2, 'c1f8c863', '2 days ago', 'Feature branch (Jim Weirich)');
  sl.addCommit(2, 'c2641c99', '2 days ago', 'Another feature branch (Jim Weirich)');
  sl.addBranch(3, "Feature 2");
  sl.addCommit(3, 'd146ab65', '2 days ago', 'Starting another feature (Jim Weirich)');
  sl.addCommit(1, 'b220bb37', '2 days ago', 'Merge to dev (Jim Weirich)');
  sl.addCommit(0, 'a27bf806', '1 day ago',  'Merge to production (Jim Weirich)');
  sl.addBranch(4, "Feature 3");
  sl.addCommit(4, 'f12f1158', '1 day ago', 'huh (Jim Weirich)');
  sl.addCommit(3, 'd265be23', '7 hours ago', 'fixed bugs (Jim Weirich)');
  sl.addCommit(4, 'f2e605dd', '6 hours ago', 'bleh (Jim Weirich)');
  sl.addCommit(1, 'b3f70bbc', '3 hours ago', 'Merge feature branch 2 (Jim Weirich)');
  sl.addCommit(4, 'f346ab65', '1 hour ago', 'meh (Jim Weirich)');
  sl.addCommit(4, 'f497f0a5', '10 minutes ago', 'oops (Jim Weirich)');
  sl.addCommit(1, 'b4f0bb37', '5 minutes ago', 'Merge feature branch 3 (Jim Weirich)');
  sl.addCommit(0, 'a3c2b1b7', '40 seconds ago', 'Merge to production (Jim Weirich)');

  sl.connect('a127846d', 'a27bf806');
  sl.connect('a27bf806', 'a3c2b1b7');
  sl.connect('a3c2b1b7', 'a444807b');

  sl.connect('b17c3898', 'b220bb37');
  sl.connect('b220bb37', 'b3f70bbc');
  sl.connect('b3f70bbc', 'b4f0bb37');

  sl.connect('c1f8c863', 'c2641c99');

  sl.connect('d146ab65', 'd265be23');

  sl.connect('f12f1158', 'f2e605dd');
  sl.connect('f2e605dd', 'f346ab65');
  sl.connect('f346ab65', 'f497f0a5');

  sl.connect('a127846d', 'b17c3898');
  sl.connect('a127846d', 'c1f8c863');
  sl.connect('a127846d', 'd146ab65');
  sl.connect('a27bf806', 'f12f1158');
  sl.connect('c2641c99', 'b220bb37');
  sl.connect('b220bb37', 'a27bf806');
  sl.connect('b4f0bb37', 'a3c2b1b7');
  sl.connect('f497f0a5', 'b4f0bb37');
  sl.connect('d265be23', 'b3f70bbc');

  return sl;
}

