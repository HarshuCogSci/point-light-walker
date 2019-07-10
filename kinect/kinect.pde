import SimpleOpenNI.*;

SimpleOpenNI  context;
int trackedUser;

PVector HEAD = new PVector();
PVector neck = new PVector();
PVector TORSO = new PVector();

PVector LEFT_ELBOW = new PVector();
PVector LEFT_FINGERTIP = new PVector();
PVector LEFT_FOOT = new PVector();
PVector LEFT_HAND = new PVector();
PVector LEFT_HIP = new PVector();
PVector LEFT_KNEE = new PVector();
PVector LEFT_SHOULDER = new PVector();

PVector RIGHT_ELBOW = new PVector();
PVector RIGHT_FINGERTIP = new PVector();
PVector RIGHT_FOOT = new PVector();
PVector RIGHT_HAND = new PVector();
PVector RIGHT_HIP = new PVector();
PVector RIGHT_KNEE = new PVector();
PVector RIGHT_SHOULDER = new PVector();

String[] list = {
  "HEAD", "neck", "TORSO",
  "LEFT_ELBOW", "LEFT_FINGERTIP", "LEFT_FOOT", "LEFT_HAND", "LEFT_HIP", "LEFT_KNEE", "LEFT_SHOULDER",
  "RIGHT_ELBOW", "RIGHT_FINGERTIP", "RIGHT_FOOT", "RIGHT_HAND", "RIGHT_HIP", "RIGHT_KNEE", "RIGHT_SHOULDER",
};

// PVector[] vectors = new PVector[list.length];

Table table;
int counter = 0;

color[] userClr = new color[]{ color(255,0,0), color(0,255,0), color(0,0,255), color(255,255,0), color(255,0,255), color(0,255,255) };

int day = day();
int month = month();
int year = year();
int hour = hour();
int minute = minute();
int second = second();
String filename = "../data/log_" + day + "_" + month + "_" + hour + "_" + minute + ".csv";

/*************************************************************************/

void setup()
{
  size(640, 480);

  context = new SimpleOpenNI(this);
  if (context.isInit() == false)
  {
    println("Can't init SimpleOpenNI, maybe the camera is not connected!");
    exit();
    return;
  }

  // context.setMirror(true);
  context.enableDepth();

  // enable ir generation
  // context.enableRGB();
  // context.enableHand();
  context.enableUser();

  background(0,0,0);
  fill(0,0,0);
  stroke(255,0,0);
  strokeWeight(6);
  smooth();

  table = new Table();

  table.addColumn("counter");
  for(int i = 0; i < list.length; i++){
    table.addColumn("SKEL_"+list[i]+"_x");
    table.addColumn("SKEL_"+list[i]+"_y");
    table.addColumn("SKEL_"+list[i]+"_z");
  }

  // for(int i = 0; i < vectors.length; i++){
  //   vectors[i] = new PVector();
  // }
}

/*************************************************************************/

void draw()
{
  context.update();
  counter++;

  // image(context.depthImage(), 0, 0);
  // image(context.rgbImage(), context.depthWidth(), 0);
  image(context.userImage(),0,0);

  int[] userList = context.getUsers();
   for(int i = 0; i < userList.length; i++){
     if(context.isTrackingSkeleton(userList[i])){
      //  trackedUser = userList[i];
      //  context.startTrackingSkeleton(trackedUser);
      //  context.getJointPositionSkeleton(trackedUser, SimpleOpenNI.SKEL_HEAD, HEAD);

      drawSkeleton(userList[i]);
      drawPoints(userList[i]);
     }
   }

  println(frameRate);
}

/*************************************************************************/

void drawPoints(int userId){
  // for(int i = 0; i < list.length; i++){
  //   String temp = "SKEL_"+list[i];
  //   context.getJointPositionSkeleton(userId, SimpleOpenNI.temp, vectors[i]);
  // }

  context.getJointPositionSkeleton(userId, SimpleOpenNI.SKEL_HEAD, HEAD);
  context.getJointPositionSkeleton(userId, SimpleOpenNI.SKEL_neck, neck);
  context.getJointPositionSkeleton(userId, SimpleOpenNI.SKEL_TORSO, TORSO);

  context.getJointPositionSkeleton(userId, SimpleOpenNI.SKEL_LEFT_ELBOW, LEFT_ELBOW);
  context.getJointPositionSkeleton(userId, SimpleOpenNI.SKEL_LEFT_FINGERTIP, LEFT_FINGERTIP);
  context.getJointPositionSkeleton(userId, SimpleOpenNI.SKEL_LEFT_FOOT, LEFT_FOOT);
  context.getJointPositionSkeleton(userId, SimpleOpenNI.SKEL_LEFT_HAND, LEFT_HAND);
  context.getJointPositionSkeleton(userId, SimpleOpenNI.SKEL_LEFT_HIP, LEFT_HIP);
  context.getJointPositionSkeleton(userId, SimpleOpenNI.SKEL_LEFT_KNEE, LEFT_KNEE);
  context.getJointPositionSkeleton(userId, SimpleOpenNI.SKEL_LEFT_SHOULDER, LEFT_SHOULDER);

  context.getJointPositionSkeleton(userId, SimpleOpenNI.SKEL_RIGHT_ELBOW, RIGHT_ELBOW);
  context.getJointPositionSkeleton(userId, SimpleOpenNI.SKEL_RIGHT_FINGERTIP, RIGHT_FINGERTIP);
  context.getJointPositionSkeleton(userId, SimpleOpenNI.SKEL_RIGHT_FOOT, RIGHT_FOOT);
  context.getJointPositionSkeleton(userId, SimpleOpenNI.SKEL_RIGHT_HAND, RIGHT_HAND);
  context.getJointPositionSkeleton(userId, SimpleOpenNI.SKEL_RIGHT_HIP, RIGHT_HIP);
  context.getJointPositionSkeleton(userId, SimpleOpenNI.SKEL_RIGHT_KNEE, RIGHT_KNEE);
  context.getJointPositionSkeleton(userId, SimpleOpenNI.SKEL_RIGHT_SHOULDER, RIGHT_SHOULDER);

  TableRow newRow = table.addRow();
  newRow.setInt("counter", counter);

  newRow.setFloat("SKEL_HEAD_x", HEAD.x);
  newRow.setFloat("SKEL_HEAD_y", HEAD.y);
  newRow.setFloat("SKEL_HEAD_z", HEAD.z);

  newRow.setFloat("SKEL_neck_x", neck.x);
  newRow.setFloat("SKEL_neck_y", neck.y);
  newRow.setFloat("SKEL_neck_z", neck.z);

  newRow.setFloat("SKEL_TORSO_x", TORSO.x);
  newRow.setFloat("SKEL_TORSO_y", TORSO.y);
  newRow.setFloat("SKEL_TORSO_z", TORSO.z);

  newRow.setFloat("SKEL_LEFT_ELBOW_x", LEFT_ELBOW.x);
  newRow.setFloat("SKEL_LEFT_ELBOW_y", LEFT_ELBOW.y);
  newRow.setFloat("SKEL_LEFT_ELBOW_z", LEFT_ELBOW.z);

  newRow.setFloat("SKEL_LEFT_FINGERTIP_x", LEFT_FINGERTIP.x);
  newRow.setFloat("SKEL_LEFT_FINGERTIP_y", LEFT_FINGERTIP.y);
  newRow.setFloat("SKEL_LEFT_FINGERTIP_z", LEFT_FINGERTIP.z);

  newRow.setFloat("SKEL_LEFT_FOOT_x", LEFT_FOOT.x);
  newRow.setFloat("SKEL_LEFT_FOOT_y", LEFT_FOOT.y);
  newRow.setFloat("SKEL_LEFT_FOOT_z", LEFT_FOOT.z);

  newRow.setFloat("SKEL_LEFT_HAND_x", LEFT_HAND.x);
  newRow.setFloat("SKEL_LEFT_HAND_y", LEFT_HAND.y);
  newRow.setFloat("SKEL_LEFT_HAND_z", LEFT_HAND.z);

  newRow.setFloat("SKEL_LEFT_HIP_x", LEFT_HIP.x);
  newRow.setFloat("SKEL_LEFT_HIP_y", LEFT_HIP.y);
  newRow.setFloat("SKEL_LEFT_HIP_z", LEFT_HIP.z);

  newRow.setFloat("SKEL_LEFT_KNEE_x", LEFT_KNEE.x);
  newRow.setFloat("SKEL_LEFT_KNEE_y", LEFT_KNEE.y);
  newRow.setFloat("SKEL_LEFT_KNEE_z", LEFT_KNEE.z);

  newRow.setFloat("SKEL_LEFT_SHOULDER_x", LEFT_SHOULDER.x);
  newRow.setFloat("SKEL_LEFT_SHOULDER_y", LEFT_SHOULDER.y);
  newRow.setFloat("SKEL_LEFT_SHOULDER_z", LEFT_SHOULDER.z);

  newRow.setFloat("SKEL_RIGHT_ELBOW_x", RIGHT_ELBOW.x);
  newRow.setFloat("SKEL_RIGHT_ELBOW_y", RIGHT_ELBOW.y);
  newRow.setFloat("SKEL_RIGHT_ELBOW_z", RIGHT_ELBOW.z);

  newRow.setFloat("SKEL_RIGHT_FINGERTIP_x", RIGHT_FINGERTIP.x);
  newRow.setFloat("SKEL_RIGHT_FINGERTIP_y", RIGHT_FINGERTIP.y);
  newRow.setFloat("SKEL_RIGHT_FINGERTIP_z", RIGHT_FINGERTIP.z);

  newRow.setFloat("SKEL_RIGHT_FOOT_x", RIGHT_FOOT.x);
  newRow.setFloat("SKEL_RIGHT_FOOT_y", RIGHT_FOOT.y);
  newRow.setFloat("SKEL_RIGHT_FOOT_z", RIGHT_FOOT.z);

  newRow.setFloat("SKEL_RIGHT_HAND_x", RIGHT_HAND.x);
  newRow.setFloat("SKEL_RIGHT_HAND_y", RIGHT_HAND.y);
  newRow.setFloat("SKEL_RIGHT_HAND_z", RIGHT_HAND.z);

  newRow.setFloat("SKEL_RIGHT_HIP_x", RIGHT_HIP.x);
  newRow.setFloat("SKEL_RIGHT_HIP_y", RIGHT_HIP.y);
  newRow.setFloat("SKEL_RIGHT_HIP_z", RIGHT_HIP.z);

  newRow.setFloat("SKEL_RIGHT_KNEE_x", RIGHT_KNEE.x);
  newRow.setFloat("SKEL_RIGHT_KNEE_y", RIGHT_KNEE.y);
  newRow.setFloat("SKEL_RIGHT_KNEE_z", RIGHT_KNEE.z);

  newRow.setFloat("SKEL_RIGHT_SHOULDER_x", RIGHT_SHOULDER.x);
  newRow.setFloat("SKEL_RIGHT_SHOULDER_y", RIGHT_SHOULDER.y);
  newRow.setFloat("SKEL_RIGHT_SHOULDER_z", RIGHT_SHOULDER.z);

//  fill(userClr[ (userId - 1) % userClr.length ] );
//  fill(0,0,0);
//  stroke(0,0,0);
//  strokeWeight(6);
//
//  ellipse(HEAD.x, HEAD.y, 20, 20);
//  if(HEAD.x > 0){ println("x: ", HEAD.x, " y: ", HEAD.y, " z: ", HEAD.z); }
}

/*************************************************************************/

void drawSkeleton(int userId){
  // stroke(userClr[ (userId - 1) % userClr.length ] );
  fill(0,0,0);
  stroke(0,0,0);
  strokeWeight(6);

  context.drawLimb(userId, SimpleOpenNI.SKEL_HEAD, SimpleOpenNI.SKEL_neck);

  context.drawLimb(userId, SimpleOpenNI.SKEL_neck, SimpleOpenNI.SKEL_LEFT_SHOULDER);
  context.drawLimb(userId, SimpleOpenNI.SKEL_LEFT_SHOULDER, SimpleOpenNI.SKEL_LEFT_ELBOW);
  context.drawLimb(userId, SimpleOpenNI.SKEL_LEFT_ELBOW, SimpleOpenNI.SKEL_LEFT_HAND);

  context.drawLimb(userId, SimpleOpenNI.SKEL_neck, SimpleOpenNI.SKEL_RIGHT_SHOULDER);
  context.drawLimb(userId, SimpleOpenNI.SKEL_RIGHT_SHOULDER, SimpleOpenNI.SKEL_RIGHT_ELBOW);
  context.drawLimb(userId, SimpleOpenNI.SKEL_RIGHT_ELBOW, SimpleOpenNI.SKEL_RIGHT_HAND);

  context.drawLimb(userId, SimpleOpenNI.SKEL_LEFT_SHOULDER, SimpleOpenNI.SKEL_TORSO);
  context.drawLimb(userId, SimpleOpenNI.SKEL_RIGHT_SHOULDER, SimpleOpenNI.SKEL_TORSO);

  context.drawLimb(userId, SimpleOpenNI.SKEL_TORSO, SimpleOpenNI.SKEL_LEFT_HIP);
  context.drawLimb(userId, SimpleOpenNI.SKEL_LEFT_HIP, SimpleOpenNI.SKEL_LEFT_KNEE);
  context.drawLimb(userId, SimpleOpenNI.SKEL_LEFT_KNEE, SimpleOpenNI.SKEL_LEFT_FOOT);

  context.drawLimb(userId, SimpleOpenNI.SKEL_TORSO, SimpleOpenNI.SKEL_RIGHT_HIP);
  context.drawLimb(userId, SimpleOpenNI.SKEL_RIGHT_HIP, SimpleOpenNI.SKEL_RIGHT_KNEE);
  context.drawLimb(userId, SimpleOpenNI.SKEL_RIGHT_KNEE, SimpleOpenNI.SKEL_RIGHT_FOOT);
}

/*************************************************************************/

void onNewUser(SimpleOpenNI curContext, int userId){
  println("onNewUser - userId: " + userId);
  println("\tstart tracking skeleton");

  curContext.startTrackingSkeleton(userId);
}

void onLostUser(SimpleOpenNI curContext, int userId){
  println("onLostUser - userId: " + userId);
}

void onVisibleUser(SimpleOpenNI curContext, int userId){
//  println("onVisibleUser - userId: " + userId);
}

void keyPressed(){
  switch(key){
  case ' ':
    context.setMirror(!context.mirror()); break;
  case 's':
    println("------------------ Saving Table --------------------");
    saveTable(table, filename);
  }
}
