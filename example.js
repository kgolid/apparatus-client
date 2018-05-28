import ApparatusBuilder from './index.js';
import Justeer from './node_modules/justeer/index.module.js';
import * as dat from './node_modules/dat.gui/build/dat.gui.module.js';
import presets from './presets.js';

window.onload = function() {
  var canvas = document.getElementById('main_canvas');
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
    f3.add(options, 'color_mode', ['single', 'main', 'group', 'random']).onChange(run);
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

    return new ApparatusBuilder(
      options.radius_x,
      options.radius_y,
      options.compactness,
      options.block_size,
      options.chance_vertical,
      colors,
      options.color_mode,
      options.group_size,
      options.h_symmetric,
      options.v_symmetric,
      options.roundness,
      options.solidness
    );
  }

  function display(ctx, apparatus, options) {
    let apparat_size_x = apparatus.xdim * options.cell_size;
    let apparat_size_y = apparatus.ydim * options.cell_size;

    let padding = options.padding - 100;
    let nx = options.columns;
    let ny = options.rows;

    let justify_x = new Justeer(canvas.width, nx, apparat_size_x);
    let justify_y = new Justeer(canvas.height, ny, apparat_size_y);
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
        ctx.lineWidth = '6';
        display_apparatus(ctx, grid, options.cell_size, options.display_stroke);
        ctx.lineCap = 'butt';
        ctx.lineWidth = '3';
        display_apparatus(ctx, grid, options.cell_size, options.display_stroke);
        ctx.restore();
      }
    }
  }

  function display_apparatus(ctx, grid, size, display_stroke) {
    for (var i = 0; i < grid.length; i++) {
      for (var j = 0; j < grid[i].length; j++) {
        if (grid[i][j].in && grid[i][j].col != null) {
          ctx.beginPath();
          ctx.rect(j * size - 1, i * size - 1, size + 2, size + 2);
          ctx.fillStyle = grid[i][j].col;
          ctx.fill();
        }
      }
    }
    if (display_stroke) {
      for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
          if (grid[i][j].h) {
            ctx.beginPath();
            ctx.moveTo(j * size, i * size);
            ctx.lineTo((j + 1) * size, i * size);
            ctx.stroke();
          }
          if (grid[i][j].v) {
            ctx.beginPath();
            ctx.moveTo(j * size, i * size);
            ctx.lineTo(j * size, (i + 1) * size);
            ctx.stroke();
          }
        }
      }
    }
  }
};
