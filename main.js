import ApparatusBuilder from 'apparatus-generator';
import Justeer from 'justeer';
import * as dat from 'dat.gui';

import presets from './presets.js';

window.onload = function() {
  var canvas = document.getElementById('sketch');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#1c2021';

    let options = {
      cell_size: 10,
      radius_x: 14,
      radius_y: 14,
      h_symmetric: true,
      v_symmetric: false,
      simple: false,
      roundness: 0.1,
      solidness: 0.5,
      compactness: 0.9,
      block_size: 0.82,
      chance_vertical: 0.5,
      rows: 5,
      columns: 5,
      padding: 40,
      display_stroke: true,
      color1: '#6c843e',
      color2: '#dc383a',
      color3: '#687d99',
      color4: '#705f84',
      color5: '#fc9a1a',
      color6: '#aa3a33',
      color7: '#9c4257',
      color_mode: 'group',
      group_size: 0.85,
      background_color: '#eeeee5'
    };

    let apparatus = setup_apparatus(options);
    display(ctx, apparatus, options);

    let gui = new dat.GUI({ load: presets });
    gui.remember(options);
    let f1 = gui.addFolder('Layout');
    f1.add(options, 'rows', 1, 12, 1).onFinishChange(run);
    f1.add(options, 'columns', 1, 12, 1).onFinishChange(run);
    f1.add(options, 'padding', 0, 300, 15).onFinishChange(run);

    let f2 = gui.addFolder('Apparatus Shape');
    f2.add(options, 'cell_size', 2, 15, 1).onFinishChange(run);
    f2.add(options, 'radius_x', 5, 100, 1).onFinishChange(run);
    f2.add(options, 'radius_y', 5, 100, 1).onFinishChange(run);
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
    f3.addColor(options, 'background_color').onFinishChange(run);
    f3.addColor(options, 'color1').onFinishChange(run);
    f3.addColor(options, 'color2').onFinishChange(run);
    f3.addColor(options, 'color3').onFinishChange(run);
    f3.addColor(options, 'color4').onFinishChange(run);
    f3.addColor(options, 'color5').onFinishChange(run);
    f3.addColor(options, 'color6').onFinishChange(run);
    f3.addColor(options, 'color7').onFinishChange(run);
    f3.add(options, 'color_mode', [
      'single',
      'main',
      'group',
      'random'
    ]).onChange(run);
    f3.add(options, 'group_size', 0.5, 1, 0.02).onFinishChange(run);

    function run() {
      apparatus = setup_apparatus(options);
      display(ctx, apparatus, options);
    }
  }

  function setup_apparatus(options) {
    let colors = [
      options.color1,
      options.color2,
      options.color3,
      options.color4,
      options.color5,
      options.color6,
      options.color7
    ];

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
    let padding = 2 * options.padding - 50;
    let nx = options.columns;
    let ny = options.rows;

    let justify_x = new Justeer(
      canvas.width,
      nx,
      apparatus.xdim * options.cell_size
    );
    let justify_y = new Justeer(
      canvas.height,
      ny,
      apparatus.ydim * options.cell_size
    );
    let place_x = justify_x.placement_given_spacing_between_elements(padding);
    let place_y = justify_y.placement_given_spacing_between_elements(padding);

    ctx.fillStyle = options.background_color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < ny; i++) {
      for (let j = 0; j < nx; j++) {
        ctx.save();
        ctx.translate(place_x(j), place_y(i));
        let grid = apparatus.generate();
        ctx.lineCap = 'square';
        ctx.lineWidth = '3';
        display_apparatus2(
          ctx,
          grid,
          options.cell_size,
          options.display_stroke
        );
        ctx.restore();
      }
    }
  }

  function display_apparatus2(ctx, rects, size, display_stroke) {
    rects.forEach(rect => {
      ctx.beginPath();
      ctx.rect(
        rect.x1 * size - 1,
        rect.y1 * size - 1,
        rect.w * size + 1,
        rect.h * size + 1
      );
      ctx.fillStyle = rect.col;
      ctx.fill();
      if (display_stroke) ctx.stroke();
    });
  }
};
