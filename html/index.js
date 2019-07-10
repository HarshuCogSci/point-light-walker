$(document).ready(() => {
  readData();
})

Array.prototype.arrayOfIndex = function(index){
  return this.map(row => { return row[index] })
}

/***********************************************************************/
// Variables

var files = {
  G1: {
    T1: ['G1P1_Task1', 'G1P2_Task1', 'G1P4_Task1', 'G1P5_Task1'],
    T2: ['G1P1_Task2', 'G1P2_Task2', 'G1P4_Task2', 'G1P5_Task2']
  },
  G2: {
    T1: ['G2P1_Task1', 'G2P2_Task1', 'G2P3_Task1', 'G2P4_Task1'],
    T2: ['G2P1_Task2', 'G2P2_Task2', 'G2P3_Task2', 'G2P4_Task2']
  },
}

// var fileNames = [
//   'G1P1_Task1',
//   'G1P1_Task2',
//   'G1P2_Task1',
//   'G1P2_Task2',
//   'G1P4_Task1',
//   'G1P4_Task2',
//   'G1P5_Task1',
//   'G1P5_Task2',
//   'G2P1_Task1',
//   'G2P1_Task2',
//   'G2P2_Task1',
//   'G2P2_Task2',
//   'G2P3_Task1',
//   'G2P3_Task2',
//   'G2P4_Task1',
//   'G2P4_Task2',
// ]

var fileName = '../data/csv/' +files['G1']['T1'][0]+ '.csv';
var fileName = '../data/csv/' +files['G1']['T1'][0]+ '.csv';
var columns = [];

var points = [
  { index: 0,    x: 0,     y: 1,     name: 'neck'                },
  { index: 1,    x: 2,     y: 3,     name: 'left_shoulder'       },
  { index: 2,    x: 4,     y: 5,     name: 'right_shoulder'      },
  { index: 3,    x: 6,     y: 7,     name: 'left_elbow'          },
  { index: 4,    x: 8,     y: 9,     name: 'right_elbow'         },
  { index: 5,    x: 10,    y: 11,    name: 'left_hand'           },
  { index: 6,    x: 12,    y: 13,    name: 'right_hand'          },
  { index: 7,    x: 14,    y: 15,    name: 'left_hip'            },
  { index: 8,    x: 16,    y: 17,    name: 'right_hip'           },
  { index: 9,    x: 18,    y: 19,    name: 'left_knee'           },
  { index: 10,   x: 20,    y: 21,    name: 'right_knee'          },
  { index: 11,   x: 22,    y: 23,    name: 'left_foot'           },
  { index: 12,   x: 24,    y: 25,    name: 'right_foot'          },
  { index: 13,   x: 26,    y: 27,    name: 'waist'               },
];

var columns = [];
for(let i = 0; i < points.length; i++){ columns.push(points[i].name+'_x'); columns.push(points[i].name+'_y'); }

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
    data_array = data.map(row => { return columns.map(label => { return parseFloat(row[label]) }) })

    var temp_array = columns.map((label,i) => { return data_array.arrayOfIndex(i) });
    data_array = temp_array;
    smoothen_data();

    // var top = d3.max(data_array[head.y]); // kinect
    var top = d3.max( data_array[points[0].y] ); // tracker
    var right = d3.max( data_array[points[6].x] );
    var bottom = d3.min([ d3.min( data_array[points[11].y] ), d3.min(data_array[points[12].y]) ]);
    var left = d3.min(data_array[points[5].x]);

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

    points.forEach(point => {
      point.circle = svg.append('circle').styles({ "stroke": "white", "stroke-width": 1, "fill": "white" }).attrs({ r: 5 });
    })

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

  // neck.circle.attrs({ cx: offSet+pixel_data_array[neck.x][timer], cy: offSet+pixel_data_array[neck.y][timer] });
  // left_shoulder.circle.attrs({ cx: offSet+pixel_data_array[left_shoulder.x][timer], cy: offSet+pixel_data_array[left_shoulder.y][timer] });
  // right_shoulder.circle.attrs({ cx: offSet+pixel_data_array[right_shoulder.x][timer], cy: offSet+pixel_data_array[right_shoulder.y][timer] });
  // left_elbow.circle.attrs({ cx: offSet+pixel_data_array[left_elbow.x][timer], cy: offSet+pixel_data_array[left_elbow.y][timer] });
  // right_elbow.circle.attrs({ cx: offSet+pixel_data_array[right_elbow.x][timer], cy: offSet+pixel_data_array[right_elbow.y][timer] });
  // left_hand.circle.attrs({ cx: offSet+pixel_data_array[left_hand.x][timer], cy: offSet+pixel_data_array[left_hand.y][timer] });
  // right_hand.circle.attrs({ cx: offSet+pixel_data_array[right_hand.x][timer], cy: offSet+pixel_data_array[right_hand.y][timer] });
  // left_hip.circle.attrs({ cx: offSet+pixel_data_array[left_hip.x][timer], cy: offSet+pixel_data_array[left_hip.y][timer] });
  // right_hip.circle.attrs({ cx: offSet+pixel_data_array[right_hip.x][timer], cy: offSet+pixel_data_array[right_hip.y][timer] });
  // // left_knee.circle.attrs({ cx: offSet+pixel_data_array[left_knee.x][timer], cy: offSet+pixel_data_array[left_hip.y][timer] });
  // right_knee.circle.attrs({ cx: offSet+pixel_data_array[right_knee.x][timer], cy: offSet+pixel_data_array[right_knee.y][timer] });
  // left_foot.circle.attrs({ cx: offSet+pixel_data_array[left_foot.x][timer], cy: offSet+pixel_data_array[left_foot.y][timer] });
  // right_foot.circle.attrs({ cx: offSet+pixel_data_array[right_foot.x][timer], cy: offSet+pixel_data_array[right_foot.y][timer] });

  points.forEach(point => {
    point.circle.attrs({ cx: offSet+pixel_data_array[point.x][timer], cy: offSet+pixel_data_array[point.y][timer] });
  })
}