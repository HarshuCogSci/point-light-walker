$(document).ready(() => {
  readData();
})

Array.prototype.arrayOfIndex = function(index){
  return this.map(row => { return row[index] })
}

/***********************************************************************/
// Variables

var files = ['log_14_4_0_54', 'log_14_4_0_56', 'log_14_4_0_58', 'log_14_4_1_1', 'ishaan']

var fileName = '../data/' +files[4]+ '.csv';
var columns = [];

// For kinect data
// var head = { x: 1, y: 2, z: 3 },
//     neck = { x: 4, y: 5, z: 6 },
//     left_shoulder = { x: 28, y: 29, z: 30 },
//     right_shoulder = { x: 49, y: 50, z: 51 },
//     left_elbow = { x: 10, y: 11, z: 12 },
//     right_elbow = { x: 31, y: 32, z: 33 },
//     left_hand = { x: 19, y: 20, z: 21 },
//     right_hand = { x: 40, y: 41, z: 42 },
//     torso = { x: 7, y: 8, z: 9 },
//     left_hip = { x: 22, y: 23, z: 24 },
//     right_hip = { x: 43, y: 44, z: 45 },
//     left_knee = { x: 25, y: 26, z: 27 },
//     right_knee = { x: 46, y: 47, z: 48 },
//     left_foot = { x: 16, y: 17, z: 18 },
//     right_foot = { x: 37, y: 38, z: 39 };

// Tracker
var neck = { x: 0, y: 1 },
    left_shoulder = { x: 2, y: 3 },
    right_shoulder = { x: 4, y: 5 },
    left_elbow = { x: 6, y: 7 },
    right_elbow = { x: 8, y: 9 },
    left_hand = { x: 10, y: 11 },
    right_hand = { x: 12, y: 13 },
    left_hip = { x: 14, y: 15 },
    right_hip = { x: 16, y: 17 },
    left_knee = { x: 18, y: 19 },
    right_knee = { x: 20, y: 21 },
    left_foot = { x: 22, y: 23 },
    right_foot = { x: 24, y: 25 };

var points = [
  { name: 'neck', x: 0, y: 1 },
  { name: 'left_shoulder', x: 2, y: 3 },
  { name: 'right_shoulder', x: 4, y: 5 },
  { name: 'left_elbow', x: 6, y: 7 },
  { name: 'right_elbow', x: 8, y: 9 },
  { name: 'left_hand', x: 10, y: 11 },
  { name: 'right_hand', x: 12, y: 13 },
  { name: 'left_hip', x: 14, y: 15 },
  { name: 'right_hip', x: 16, y: 17 },
  { name: 'left_knee', x: 18, y: 19 },
  { name: 'right_knee', x: 20, y: 21 },
  { name: 'left_foot', x: 22, y: 23 },
  { name: 'right_foot', x: 24, y: 25 },
  { name: 'waist', x: 26, y: 27 },
];

var data_array = [], pixel_data_array = [];
var display_width, display_height = 800;
var svg_width, svg_height;
var scalingFactor;
var timer = 0;
var offSet = 20;

/***********************************************************************/
// Read Data

function readData(){
  d3.csv(fileName, (data) => {
    columns = data.columns;
    data_array = data.map(row => { return columns.map(label => { return parseFloat(row[label]) }) })

    var temp_array = columns.map((label,i) => { return data_array.arrayOfIndex(i) });
    data_array = temp_array;
    smoothen_data();

    // var top = d3.max(data_array[head.y]); // kinect
    var top = d3.max(data_array[neck.y]); // tracker
    var right = d3.max(data_array[right_hand.x]);
    var bottom = d3.min([ d3.min(data_array[left_foot.y]), d3.min(data_array[right_foot.y]) ]);
    var left = d3.min(data_array[left_hand.x]);

    var data_width = right - left;
    var data_height = top - bottom;
    scalingFactor = display_height/data_height;
    display_width = data_width*scalingFactor;

    var xScale = d3.scaleLinear().domain([left, right]).range([0, display_width]);
    var yScale = d3.scaleLinear().domain([top, bottom]).range([0, display_height]);

    pixel_data_array = columns.map((label,i) => {
      if(label.includes("_x")){ return data_array[i].map(d => { return xScale(d) }) }
      if(label.includes("_y")){ return data_array[i].map(d => { return yScale(d) }) }
      return data_array[i]
    })

    svg_width = display_width + 2*offSet;
    svg_height = display_height + 2*offSet;

    svg = d3.select('#canvas').attrs({ width: svg_width, height: svg_height });

    // kinect
    // head.circle = svg.append('circle').styles({ "stroke": "white", "stroke-width": 1, "fill": "white" }).attrs({ r: 5 }); // kinect
    // torso.circle = svg.append('circle').styles({ "stroke": "white", "stroke-width": 1, "fill": "white" }).attrs({ r: 5 }); // kinect

    neck.circle = svg.append('circle').styles({ "stroke": "white", "stroke-width": 1, "fill": "white" }).attrs({ r: 5 });
    left_shoulder.circle = svg.append('circle').styles({ "stroke": "white", "stroke-width": 1, "fill": "white" }).attrs({ r: 5 });
    right_shoulder.circle = svg.append('circle').styles({ "stroke": "white", "stroke-width": 1, "fill": "white" }).attrs({ r: 5 });
    left_elbow.circle = svg.append('circle').styles({ "stroke": "white", "stroke-width": 1, "fill": "white" }).attrs({ r: 5 });
    right_elbow.circle = svg.append('circle').styles({ "stroke": "white", "stroke-width": 1, "fill": "white" }).attrs({ r: 5 });
    left_hand.circle = svg.append('circle').styles({ "stroke": "white", "stroke-width": 1, "fill": "white" }).attrs({ r: 5 });
    right_hand.circle = svg.append('circle').styles({ "stroke": "white", "stroke-width": 1, "fill": "white" }).attrs({ r: 5 });
    left_hip.circle = svg.append('circle').styles({ "stroke": "white", "stroke-width": 1, "fill": "white" }).attrs({ r: 5 });
    right_hip.circle = svg.append('circle').styles({ "stroke": "white", "stroke-width": 1, "fill": "white" }).attrs({ r: 5 });
    left_knee.circle = svg.append('circle').styles({ "stroke": "white", "stroke-width": 1, "fill": "white" }).attrs({ r: 5 });
    right_knee.circle = svg.append('circle').styles({ "stroke": "white", "stroke-width": 1, "fill": "white" }).attrs({ r: 5 });
    left_foot.circle = svg.append('circle').styles({ "stroke": "white", "stroke-width": 1, "fill": "white" }).attrs({ r: 5 });
    right_foot.circle = svg.append('circle').styles({ "stroke": "white", "stroke-width": 1, "fill": "white" }).attrs({ r: 5 });

    // repeat();

    createTimer();
  })
}

/***********************************************************************/
// Smoothen data

var smoothing_factor = 4;

function smoothen_data(){
  for(var label = 0; label < data_array.length; label++){ // start with 1 for kinect, 0 for tracker
    // var temp_array = [ data_array[label][0] ]; // kinect
    var temp_array = [];

    for(var i = smoothing_factor-1; i < data_array[label].length; i++){
      var temp_avg = 0;
      for(var j = i-smoothing_factor+1; j <= i; j++){ temp_avg += data_array[label][j]; }
      temp_avg /= smoothing_factor;
      temp_array.push(temp_avg);
    }

    data_array[label] = temp_array;
  }
}

/***********************************************************************/
// Repeat

// function repeat(){
//   createDisplay();
//   timer++;
//   if(timer < pixel_data_array[1].length){ window.requestAnimationFrame(repeat); }
// }

/***********************************************************************/
// Create Timer

var d3_timer;

function createTimer(){
  d3_timer = d3.interval((elapsed) => {
    createDisplay();
    timer++;
    if(timer >= pixel_data_array[1].length){
      timer = 0;
      // d3_timer.stop();
    }
  }, (1000/20))
}

/***********************************************************************/
// Create Display

function createDisplay(){
  // kinect
  // head.circle.attrs({ cx: offSet+pixel_data_array[head.x][timer], cy: offSet+pixel_data_array[head.y][timer] }); // kinect
  // torso.circle.attrs({ cx: offSet+pixel_data_array[torso.x][timer], cy: offSet+pixel_data_array[torso.y][timer] }); // kinect

  neck.circle.attrs({ cx: offSet+pixel_data_array[neck.x][timer], cy: offSet+pixel_data_array[neck.y][timer] });
  left_shoulder.circle.attrs({ cx: offSet+pixel_data_array[left_shoulder.x][timer], cy: offSet+pixel_data_array[left_shoulder.y][timer] });
  right_shoulder.circle.attrs({ cx: offSet+pixel_data_array[right_shoulder.x][timer], cy: offSet+pixel_data_array[right_shoulder.y][timer] });
  left_elbow.circle.attrs({ cx: offSet+pixel_data_array[left_elbow.x][timer], cy: offSet+pixel_data_array[left_elbow.y][timer] });
  right_elbow.circle.attrs({ cx: offSet+pixel_data_array[right_elbow.x][timer], cy: offSet+pixel_data_array[right_elbow.y][timer] });
  left_hand.circle.attrs({ cx: offSet+pixel_data_array[left_hand.x][timer], cy: offSet+pixel_data_array[left_hand.y][timer] });
  right_hand.circle.attrs({ cx: offSet+pixel_data_array[right_hand.x][timer], cy: offSet+pixel_data_array[right_hand.y][timer] });
  left_hip.circle.attrs({ cx: offSet+pixel_data_array[left_hip.x][timer], cy: offSet+pixel_data_array[left_hip.y][timer] });
  right_hip.circle.attrs({ cx: offSet+pixel_data_array[right_hip.x][timer], cy: offSet+pixel_data_array[right_hip.y][timer] });
  // left_knee.circle.attrs({ cx: offSet+pixel_data_array[left_knee.x][timer], cy: offSet+pixel_data_array[left_hip.y][timer] });
  right_knee.circle.attrs({ cx: offSet+pixel_data_array[right_knee.x][timer], cy: offSet+pixel_data_array[right_knee.y][timer] });
  left_foot.circle.attrs({ cx: offSet+pixel_data_array[left_foot.x][timer], cy: offSet+pixel_data_array[left_foot.y][timer] });
  right_foot.circle.attrs({ cx: offSet+pixel_data_array[right_foot.x][timer], cy: offSet+pixel_data_array[right_foot.y][timer] });
}