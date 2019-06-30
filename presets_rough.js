export default {
  remembered: {
    Default: {
      '0': {
        rows: 5,
        columns: 8,
        padding: 30,
        cell_size: 22,
        cell_pad: -2,
        radius_x: 8,
        radius_y: 10,
        simple: false,
        roundness: 0.1,
        solidness: 0.5,
        compactness: 1,
        block_size: 0.8,
        chance_vertical: 0.4,
        h_symmetric: true,
        v_symmetric: false,
        display_stroke: false,
        display_fill: true,
        palette: 'knotberry2',
        color_mode: 'group',
        group_size: 0.7
      }
    },
    apartments: {
      '0': {
        rows: 10,
        columns: 7,
        padding: 90,
        cell_size: 20,
        cell_pad: -2,
        radius_x: 10,
        radius_y: 10,
        simple: true,
        roundness: 0.1,
        solidness: 0.5,
        compactness: 1,
        block_size: 0.86,
        chance_vertical: 0.4,
        h_symmetric: false,
        v_symmetric: false,
        display_stroke: false,
        display_fill: true,
        palette: 'ducci_j',
        color_mode: 'group',
        group_size: 0.7
      }
    }
  },
  closed: false,
  folders: {
    Layout: {
      preset: 'Default',
      closed: false,
      folders: {}
    },
    'Apparatus Shape': {
      preset: 'Default',
      closed: false,
      folders: {}
    },
    'Apparatus Looks': {
      preset: 'Default',
      closed: false,
      folders: {}
    },
    Controller: {
      preset: 'Default',
      closed: false,
      folders: {}
    }
  }
};
