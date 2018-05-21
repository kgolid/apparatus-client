# Installation and usage

Install using npm:

```
npm i --save justeer
```

In your code:

```
var Justeer = require('justeer');

var container_size = 500;
var number_of_elements = 3;
var size = 100;

var leif = new Justeer(container_size, number_of_elements, size);
```

The Justeer object can generate two placement functions.

One here it the spacing between elements is given:

```
var spacing_between = 25;
var placement = leif.placement_given_spacing_between_elements(spacing_between);

var pos1 = placement(0); // 75
var pos2 = placement(1); // 200
var pos3 = placement(2); // 325
```

... and one where the spacing from the container is given:

```
var container_spacing = 25;
var placement = leif.placement_given_spacing_around_elements(container_spacing);

var pos1 = placement(0); // 25
var pos2 = placement(1); // 200
var pos3 = placement(2); // 375
```
