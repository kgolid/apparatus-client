import {
  dist,
  angle_of_direction,
  point_at_distance_and_angle,
  point_at_distance_towards_direction
} from './utils';

const init_accuracy = Math.PI / 25;
const max = 200;
let step_length;

export default function roughLine(a, b, length = 40) {
  step_length = length;
  let start = { a: a, cp1: null, cp2: null };
  const points = [start];

  while (dist(points[points.length - 1].a, b) != 0 && points.length < max) {
    const pnt = getNextPoint(points, step_length, b);
    points.push(pnt);
  }

  return points;
}

function getNextPoint(points, step_dist, goal) {
  let current = points[points.length - 1].a;
  let remaining_distance = dist(current, goal);

  let start = points[0].a;
  let total_distance = dist(start, goal);

  let remaining_ratio = remaining_distance / total_distance;
  let step = step_dist * (Math.random() * 0.5 + 1);
  if (remaining_distance <= step * 1.5)
    return { a: goal, cp1: null, cp2: null };

  let accuracy = remaining_ratio * init_accuracy;

  let ideal_direction = angle_of_direction(current, goal);
  let direction_offset = Math.random() * accuracy - accuracy / 2;
  let direction = ideal_direction + direction_offset;

  let next_a = point_at_distance_and_angle(current, step, direction);
  let next_cp1 = point_at_distance_towards_direction(next_a, -step / 3, goal);
  let next_cp2 = point_at_distance_towards_direction(
    next_a,
    Math.min(step, dist(next_a, goal)) / 3,
    goal
  );

  return { a: next_a, cp1: next_cp1, cp2: next_cp2 };
}
