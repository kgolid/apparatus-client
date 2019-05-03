import ApparatusBuilder from 'apparatus-generator';
import Justeer from 'justeer';
import * as dat from 'dat.gui';
import * as tome from 'chromotome';

import roughLine from './graphite.js';
import presets from './presets_rough.js';

window.onload = function() {
  var canvas = document.createElement('canvas');
  canvas.width = '3200';
  canvas.height = '1800';
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  var pad = 10;

  var container = document.getElementById('sketch');
  container.appendChild(canvas);

  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#1c2021';

    let options = {
      cell_size: 30,
      cell_pad: 10,
      radius_x: 14,
      radius_y: 14,
      h_symmetric: false,
      v_symmetric: false,
      simple: false,
      roundness: 0.1,
      solidness: 0.5,
      compactness: 0.9,
      block_size: 0.82,
      chance_vertical: 0.5,
      rows: 3,
      columns: 5,
      padding: 40,
      display_stroke: true,
      display_fill: true,
      palette: tome.getRandom().name,
      color_mode: 'group',
      group_size: 0.85
    };

    let gui = new dat.GUI({ load: presets });
    gui.remember(options);
    let f1 = gui.addFolder('Layout');
    f1.add(options, 'rows', 1, 12, 1).onFinishChange(run);
    f1.add(options, 'columns', 1, 12, 1).onFinishChange(run);
    f1.add(options, 'padding', 0, 300, 15).onFinishChange(run);

    let f2 = gui.addFolder('Apparatus Shape');
    f2.add(options, 'cell_size', 2, 45, 1).onFinishChange(run);
    f2.add(options, 'cell_pad', -20, 25, 1).onFinishChange(run);
    f2.add(options, 'radius_x', 5, 30, 1).onFinishChange(run);
    f2.add(options, 'radius_y', 5, 30, 1).onFinishChange(run);
    f2.add(options, 'simple').onFinishChange(run);
    f2.add(options, 'roundness', 0, 1, 0.1).onFinishChange(run);
    f2.add(options, 'solidness', 0.1, 1, 0.05).onFinishChange(run);
    f2.add(options, 'compactness', 0.5, 1, 0.02).onFinishChange(run);
    f2.add(options, 'block_size', 0.5, 1, 0.02).onFinishChange(run);
    f2.add(options, 'chance_vertical', 0, 1, 0.1).onFinishChange(run);
    f2.add(options, 'h_symmetric').onFinishChange(run);
    f2.add(options, 'v_symmetric').onFinishChange(run);

    let f3 = gui.addFolder('Apparatus Looks');
    f3.add(options, 'display_stroke').onFinishChange(run);
    f3.add(options, 'display_fill').onFinishChange(run);
    f3.add(options, 'palette', tome.getNames()).onFinishChange(run);
    f3.add(options, 'color_mode', [
      'single',
      'main',
      'group',
      'random'
    ]).onChange(run);
    f3.add(options, 'group_size', 0.5, 1, 0.02).onFinishChange(run);

    let apparatus = setup_apparatus(options);
    display(ctx, apparatus, options);

    function run() {
      apparatus = setup_apparatus(options);
      display(ctx, apparatus, options);
    }
  }

  function setup_apparatus(options) {
    let colors = tome.get(options.palette).colors;
    /*
    let colors = [
      '#02857e',
      '#f4a82d',
      '#e7cdb5',
      '#ee8d8d',
      '#ea5d60',
      '#bc2727',
      '#ad4b26',
      '#645f86',
      '#0b4a85'
    ];
    */

    let opts = {
      initiate_chance: options.compactness,
      extension_chance: options.block_size,
      vertical_chance: options.chance_vertical,
      horizontal_symmetry: options.h_symmetric,
      vertical_symmetry: options.v_symmetric,
      simple: options.simple,
      roundness: options.roundness,
      solidness: options.solidness,
      colors: colors,
      color_mode: options.color_mode,
      group_size: options.group_size
    };

    return new ApparatusBuilder(options.radius_x, options.radius_y, opts);
  }

  function display(ctx, apparatus, options) {
    let padding = 2 * options.padding - 150;
    let nx = options.columns;
    let ny = options.rows;

    let justify_x = new Justeer(
      canvas.width,
      nx,
      apparatus.xdim * (options.cell_size + options.cell_pad)
    );
    let justify_y = new Justeer(
      canvas.height,
      ny,
      apparatus.ydim * (options.cell_size + options.cell_pad)
    );
    let place_x = justify_x.placement_given_spacing_between_elements(padding);
    let place_y = justify_y.placement_given_spacing_between_elements(
      (Math.sqrt(3) * padding) / 2
    );

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = tome.get(options.palette).background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < ny; i++) {
      for (let j = 0; j < nx - (i % 2); j++) {
        ctx.save();
        ctx.translate(place_x(j), place_y(i));
        const offset =
          (apparatus.xdim * (options.cell_size + options.cell_pad) + padding) /
          2;
        ctx.translate(i % 2 == 0 ? 0 : offset, 0);
        let grid = apparatus.generate();
        ctx.lineCap = 'square';
        ctx.lineWidth = '2';
        display_apparatus2(ctx, grid, options);
        ctx.restore();
      }
    }
  }

  function display_apparatus2(ctx, rects, options) {
    const { cell_size, cell_pad, display_stroke, display_fill } = options;
    let stroke_color = tome.get(options.palette).stroke;
    stroke_color = stroke_color ? stroke_color : '#0e0e0e';

    const roughRects = rects.map(rect => {
      const points = getRectPoints(
        rect.x1 * (cell_size + cell_pad),
        rect.y1 * (cell_size + cell_pad),
        rect.w * (cell_size + cell_pad) - cell_pad,
        rect.h * (cell_size + cell_pad) - cell_pad
      );
      return { ...rect, points };
    });

    if (display_fill) {
      ctx.globalCompositeOperation = 'normal';
      roughRects.forEach(rect => {
        drawPoints(ctx, rect.points, '#fff', null);
      });
      ctx.globalCompositeOperation = 'multiply';
      roughRects.forEach(rect => {
        drawPoints(ctx, rect.points, rect.col, null);
      });
    }

    if (display_stroke) {
      roughRects.forEach(rect => {
        const points = getRectPoints(
          rect.x1 * (cell_size + cell_pad) + 4,
          rect.y1 * (cell_size + cell_pad) + 4,
          rect.w * (cell_size + cell_pad) - cell_pad - 8,
          rect.h * (cell_size + cell_pad) - cell_pad - 8
        );
        const hatchPoints = getHatchPoints(
          rect.x1 * (cell_size + cell_pad),
          rect.y1 * (cell_size + cell_pad),
          rect.w * (cell_size + cell_pad) - cell_pad,
          rect.h * (cell_size + cell_pad) - cell_pad
        );
        drawPoints(ctx, points, null, stroke_color);
        //hatchRect(ctx, hatchPoints, rect.col);
      });
    }
  }

  function getRectPoints(px, py, sx, sy) {
    const north = roughLine([px, py], [px + sx, py]);
    const east = roughLine([px + sx, py], [px + sx, py + sy]);
    const south = roughLine([px + sx, py + sy], [px, py + sy]);
    const west = roughLine([px, py + sy], [px, py]);

    return [...north, ...east, ...south, ...west];
  }

  function getHatchPoints(px, py, sx, sy) {
    const north = roughLine([px, py], [px + sx, py], 5);
    const south = roughLine([px, py + sy], [px + sx, py + sy], 5);

    return { north, south };
  }

  function hatchRect(ctx, points, strokeCol) {
    const north = points.north;
    const south = points.south;
    const number_of_hatches = Math.min(north.length, south.length);
    const hatches = [];

    for (let i = 0; i < number_of_hatches; i++) {
      hatches.push(roughLine(north[i].a, south[i].a));
    }

    hatches.forEach(hatch => drawPoints(ctx, hatch, null, strokeCol));
  }

  function drawPoints(ctx, points, col, strokeCol) {
    ctx.beginPath();
    ctx.moveTo(points[0].a[0], points[0].a[1]);
    for (let i = 1; i < points.length; i++) {
      let p1 = points[i - 1];
      let p2 = points[i];
      ctx.bezierCurveTo(
        p1.cp2 ? p1.cp2[0] : p1.a[0],
        p1.cp2 ? p1.cp2[1] : p1.a[1],
        p2.cp1 ? p2.cp1[0] : p2.a[0],
        p2.cp1 ? p2.cp1[1] : p2.a[1],
        p2.a[0],
        p2.a[1]
      );
    }
    if (col != null) {
      ctx.fillStyle = col;
      ctx.fill();
    }
    if (strokeCol != null) {
      ctx.strokeStyle = strokeCol;
      ctx.stroke();
    }
  }
};
