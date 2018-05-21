modules.exports = class Justeer {
  constructor(cs, n, s) {
    this.container_size = cs;
    this.number_of_elements = n;
    this.element_size = s;
  }

  placement_given_spacing_between_elements(spacing) {
    let total_size = this.number_of_elements * this.element_size + (this.number_of_elements - 1) * spacing;
    let outer_padding = (this.container_size - total_size) / 2;
    return i => outer_padding + i * (this.element_size + spacing);
  }

  placement_given_spacing_around_elements(spacing) {
    let total_size = this.number_of_elements * this.element_size + 2 * spacing;
    let padding_between = (this.container_size - total_size) / (this.number_of_elements - 1);
    return i => spacing + i * (this.element_size + padding_between);
  }
};
