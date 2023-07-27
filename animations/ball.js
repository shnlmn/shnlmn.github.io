class pbAnimation extends Pegboard {
  constructor() {
    super();
    this.speed = 0.3 * this.scale;
    this.speed_floor = 20 * this.scale;
    this.circle_distance = 4 * this.scale;
    this.ball_diameter = 4 * this.board_peg_size;
    this.orbit_x = 0;
    this.orbit_y = 0;
    this.location = createVector(0, 0);
    this.travel_vector = createVector(0, 0);
    this.to_node = 0;
    this.start_point = 0;
    this.active_D_count = 0;
    this.active_A_count = 0;
    this.peg_coords = this.get_peg_coords();
  }

  orbit() {
    this.orbit_x =
      Math.sin(frameCount * this.speed * 0.15) * this.circle_distance;
    this.orbit_y =
      Math.cos(frameCount * this.speed * 0.15) * this.circle_distance;
  }

  random_color() {
    colors = [
      "#90BE6D",
      "#43AA8B",
      "#4D908E",
      "#577590",
      "#277DA1",
      "#F94144",
      "#F3722C",
      "#F8961E",
      "#F9844A",
      "#0099FF",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  display() {
    clear();
    this.active_D_count = Object.values(this.peg_D_state).filter(

      (el) => el === true
    ).length;
    this.active_nodes = {};
    for (const [k, v] of Object.entries(this.peg_D_state)) {
      // create list of active nodes
      if (v === true) {
        this.active_nodes[k] = this.peg_coords[k];
      }
    }

    for (const [k, v] of Object.entries(this.active_nodes)) {
      // light up active peg
      fill("#f00");
      circle(this.peg_coords[k][0], this.peg_coords[k][1], this.board_peg_size);
    }

    // print(this.location)
    if (this.active_D_count == 1) {
      for (const [k, v] of Object.entries(this.peg_D_inputs)) {
        // console.log(this.peg_D_state[k]);
        if (this.peg_D_state[k]) {
          // print(this.peg_D_state[k]);
          let peg_coords = this.peg_coords[k];
          // print(peg_coords)
          this.location = createVector(peg_coords[0], peg_coords[1]);
          this.orbit();
          fill("#0f0");
          circle(
            this.location.x + this.orbit_x,
            this.location.y + this.orbit_y,
            this.ball_diameter
          );
        }
      }
    } else if (this.active_D_count > 1) {

      // pass the ball
      let to_coord;
      let active_keys = Object.keys(this.active_nodes);
      let movement_speed = this.speed * active_keys.length

      if (this.to_node < this.active_D_count - 1) {
        to_coord = this.active_nodes[active_keys[this.to_node + 1]];
      } else {
        to_coord = this.active_nodes[active_keys[0]];
      }
      // print(
      //   "TO COORD: ",
      //   to_coord,
      //   "THIS LOCATION",
      //   this.location.x,
      //   this.location.y
      // );
      // print(
      //   "travel vector ",
      //   createVector(
      //     to_coord[0] - this.location.x,
      //     to_coord[1] - this.location.y
      //   )
      //   ,
      //   "vector magnitude",

      //   createVector(
      //     to_coord[0] - this.location.x,
      //     to_coord[1] - this.location.y
      //   ).mag(),
      //   "SPEED", this.speed,
      //   createVector(
      //     to_coord[0] - this.location.x,
      //     to_coord[1] - this.location.y
      //   ).mag() < this.speed,

      // );
      let travel_vector = createVector(
        to_coord[0] - this.location.x,
        to_coord[1] - this.location.y
      );
      if (travel_vector.mag() < movement_speed) {
        if (this.to_node < Object.keys(this.active_nodes).length - 1) {
          this.to_node += 1;
        } else {
          this.to_node = 0;
        }
      }

      print(to_coord);
      // try {
      //   to_coord = this.peg_coords[this.active_nodes[this.to_node + 1]];
      // } catch (error) {
      //   to_coord = this.peg_coords[this.active_nodes[0]];
      // }
      travel_vector.normalize();
      travel_vector.setMag(movement_speed);
      this.location.add(travel_vector);
      // print(this.location);

      fill("#0f0");
      circle(this.location.x, this.location.y, this.ball_diameter);
    }
  }
  key_pressed(e) {
    if (e.get_native().getKeyCode() == 8) {
      this.text.pop();
    } else {
      this.text += e.get_key().upper();
    }
  }
}
