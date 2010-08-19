# Swim Lanes

The other day we were talking about git workflows and noted that the
notation used in http://nvie.com/git-model was pretty cool, but none
of our git ttols drew the commit graph in that manner.

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

(see http://whyday.org for more details on Whyday)
