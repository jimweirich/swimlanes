# Swim Lanes

The other day we were talking about git workflows and noted that the
notation used in [the NVIE article](http://nvie.com/git-model "Git
Model") was pretty cool, but none of our git tools drew the commit
graph in that manner.

Wouldn't it be nice to have something like that.

# Whyday 2010

So, for my whyday project I decided to play around with the idea of
drawing swimlane diagrams for git repos.  There are two pieces to the
puzzle:

* Figuring out which commits go into which swimlanes, and
* Rendering the swimlane diagram

For Whyday I concentrated on the second part of the project,
generating the diagram.  I decided to use the HTML5 canvas object for
drawing, and a javascript library to structure the data.  Swimlanes is
the result of my Whyday efforts.

(see [Whyday](http://whyday.org "Whyday") for more details on Whyday)

# Example:

![sample swimlane](http://github.com/jimweirich/swimlanes/raw/master/samples/swimlanes.jpg)

# Code

The above graph was generated from the following data:

<pre>function drawGrid() {
  var sl = new SwimLanes();

  sl.drawOn("canvas", 1000, 800);

  sl.addBranch("Prod", 0);
  sl.addCommit('a127846d', 0, 'Initial commit (Jim Weirich)');
  sl.addBranch("Development", 1);
  sl.addCommit('b17c3898', 1, 'Development Branch (Jim Weirich)');
  sl.addBranch("Feature 1", 2);
  sl.addCommit('c1f8c863', 2, 'Feature branch (Jim Weirich)');
  sl.addCommit('c2641c99', 2, 'Another feature branch (Jim Weirich)');
  sl.addBranch("Feature 2", 3);
  sl.addCommit('d146ab65', 3, 'Starting another feature (Jim Weirich)');
  sl.addCommit('b220bb37', 1, 'Merge to dev (Jim Weirich)', 'm');
  sl.addCommit('a27bf806', 0, 'Merge to production (Jim Weirich)', 'm');
  sl.addBranch("Feature 3", 4);
  sl.addCommit('f12f1158', 4, 'huh (Jim Weirich)');
  sl.addCommit('d265be23', 3, 'fixed bugs (Jim Weirich)');
  sl.addCommit('f2e605dd', 4, 'bleh (Jim Weirich)');
  sl.addCommit('b3f70bb', 1, 'Merge feature branch 2 (Jim Weirich)', 'm');
  sl.addCommit('f346ab65', 4, 'meh (Jim Weirich)');
  sl.addCommit('f497f0a5', 4, 'oops (Jim Weirich)');
  sl.addCommit('b4f0bb37', 1, 'Merge feature branch 3 (Jim Weirich)', 'm');
  sl.addCommit('a3c2b1b7', 0, 'Merge to production (Jim Weirich)', 'm');

  sl.connect('a127846d', 'a27bf806');
  sl.connect('a27bf806', 'a3c2b1b7');
  sl.connect('a3c2b1b7', 'a444807b');

  sl.connect('b17c3898', 'b4f0bb37');

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
  sl.connect('d265be23', 'b3f70bb');

  sl.render();
}
</pre>

# TODO

* Write some Ruby code to actually get a real git repository in that format.
