
var canvas;
var gl;
var program;

var projectionMatrix; 
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

let lemul = 3;
let legrow = 1.5;
torsoVertices = [
    // Bottom
    vec4(0.0, -0.5, 0.0, 1.0),
    vec4(-0.5, 0.0, 0.0, 1.0),
    vec4(-Math.sqrt(0.5) / 2, 0.0, Math.sqrt(0.5) / 2, 1.0),
    vec4(0.0, 0.0, 0.5, 1.0),
    vec4(Math.sqrt(0.5) / 2, 0.0, Math.sqrt(0.5) / 2, 1.0),
    vec4(0.5, 0.0, 0.0, 1.0),
    vec4(Math.sqrt(0.5) / 2, 0.0, -Math.sqrt(0.5) / 2, 1.0),
    vec4(0.0, 0.0, -0.5, 1.0),
    vec4(-Math.sqrt(0.5) / 2, 0.0, -Math.sqrt(0.5) / 2, 1.0),
    vec4(-0.5, 0.0, 0.0, 1.0),
    // Lower
    vec4(-0.5, 0.0, 0.0, 1.0),
    vec4(-Math.sqrt(0.5) / 2, 0.0, Math.sqrt(0.5) / 2, 1.0),
    vec4(-Math.sqrt(0.5) * lemul / 2, legrow, Math.sqrt(0.5) * lemul / 2, 1.0),
    vec4(-0.5 * lemul, legrow, 0.0 * lemul, 1.0),

    vec4(-Math.sqrt(0.5) / 2, 0.0, Math.sqrt(0.5) / 2, 1.0),
    vec4(0.0, 0.0, 0.5, 1.0),
    vec4(0.0 * lemul, legrow, 0.5 * lemul, 1.0),
    vec4(-Math.sqrt(0.5) * lemul / 2, legrow, Math.sqrt(0.5) * lemul / 2, 1.0),

    vec4(0.0, 0.0, 0.5, 1.0),
    vec4(Math.sqrt(0.5) / 2, 0.0, Math.sqrt(0.5) / 2, 1.0),
    vec4(Math.sqrt(0.5) * lemul/ 2, legrow, Math.sqrt(0.5) * lemul/ 2, 1.0),
    vec4(0.0 * lemul, legrow, 0.5 * lemul, 1.0),

    vec4(Math.sqrt(0.5) / 2, 0.0, Math.sqrt(0.5) / 2, 1.0),
    vec4(0.5, 0.0, 0.0, 1.0),
    vec4(0.5 * lemul, legrow, 0.0 * lemul, 1.0),
    vec4(Math.sqrt(0.5) * lemul/ 2, legrow, Math.sqrt(0.5) * lemul/ 2, 1.0),

    vec4(0.5, 0.0, 0.0, 1.0),
    vec4(Math.sqrt(0.5) / 2, 0.0, -Math.sqrt(0.5) / 2, 1.0),
    vec4(Math.sqrt(0.5) * lemul / 2, legrow, -Math.sqrt(0.5) * lemul / 2, 1.0),
    vec4(0.5 * lemul, legrow, 0.0 * lemul, 1.0),

    vec4(Math.sqrt(0.5) / 2, 0.0, -Math.sqrt(0.5) / 2, 1.0),
    vec4(0.0, 0.0, -0.5, 1.0),
    vec4(0.0 * lemul, legrow, -0.5 * lemul, 1.0),
    vec4(Math.sqrt(0.5) * lemul/ 2, legrow, -Math.sqrt(0.5) * lemul / 2, 1.0),

    vec4(0.0, 0.0, -0.5, 1.0),
    vec4(-Math.sqrt(0.5) / 2, 0.0, -Math.sqrt(0.5) / 2, 1.0),
    vec4(-Math.sqrt(0.5) * lemul/ 2, legrow, -Math.sqrt(0.5) * lemul/ 2, 1.0),
    vec4(0.0 * lemul, legrow, -0.5 * lemul, 1.0),

    vec4(-Math.sqrt(0.5) / 2, 0.0, -Math.sqrt(0.5) / 2, 1.0),
    vec4(-0.5, 0.0, 0.0, 1.0),
    vec4(-0.5 * lemul, legrow, 0.0 * lemul, 1.0),
    vec4(-Math.sqrt(0.5) * lemul / 2, legrow, -Math.sqrt(0.5) * lemul/ 2, 1.0),

]
torsoVertices = ultimatron(torsoVertices, 3, 2);
var wing = [
    vec4( 0.06, 0.7,  0.0, 1.0 ),
    vec4( -0.30, 0.73,  0.0, 1.0 ),
    vec4( -0.48, 0.48,  0.0, 1.0 ),
    vec4( -0.57, 0.2,  0.0, 1.0 ),
    vec4( -0.56, -0.11,  0.0, 1.0 ),
    vec4( -0.35, -0.55,  0.0, 1.0 ),
    vec4( 0.06, -0.89,  0.0, 1.0 ),
]

pointyPrism = [
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(-0.2, 0.0, -0.2, 1.0),
    vec4(0.2, 0.0, -0.2, 1.0),
    vec4(0.2, 0.0, 0.2, 1.0),
    vec4(-0.2, 0.0, 0.2, 1.0),
    vec4(-0.2, 0.0, -0.2, 1.0),
]

var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;
var leftMiddleArmId = 11;
var rightMiddleArmId = 12;
var leftUpperMiddleArmId = 13;
var leftMiddleMiddleArmId = 14;
var leftLowerMiddleArmId = 15;
var rightUpperMiddleArmId = 16;
var rightMiddleMiddleArmId = 17;
var rightLowerMiddleArmId = 18;
var leftWingId = 19;
var rightWingId = 20;

var torsoHeight = 5.0;
var torsoWidth = 1.0;
var upperArmHeight = 3.0;
var lowerArmHeight = 2.0;
var upperArmWidth  = 0.5;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.5;
var lowerLegWidth  = 0.5;
var lowerLegHeight = 2.0;
var upperLegHeight = 3.0;
var headHeight = 1.5;
var headWidth = 1.0;
var middleMiddleArmHeight = 1.5;
var middleMiddleArmWidth = 1.0;
var lowerMiddleArmHeight = 5;
var lowerMiddleArmWidth = 1.0;

var numNodes = 21;
var numAngles = 11;
var angle = 0;

var theta = [0, 0, 90, 90, 90, 90, 180, 40, 220, 40, 40];

var numVertices = 24;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];

//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child){
    var node = {
        transform: transform,
        render: render,
        sibling: sibling,
        child: child,
    }
    return node;
}


// Create Hierarchy
function initNodes(Id) {

    var m = mat4();
    
    switch(Id) {
        case torsoId:
        
        m = rotate(theta[torsoId], 0, 1, 0 );
        figure[torsoId] = createNode( m, torso, null, headId );
        break;

        case headId: 
        case head1Id: 
        case head2Id:
        

        m = translate(0.0, torsoHeight+0.5*headHeight, 0.0);
        m = mult(m, rotate(theta[head1Id], 1, 0, 0))
        m = mult(m, rotate(theta[head2Id], 0, 1, 0));
        m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
        figure[headId] = createNode( m, head, leftUpperArmId, null);
        break;
        
        
        case leftUpperArmId:
        
        m = translate(-2 * (torsoWidth+upperArmWidth), 0.9*torsoHeight, 0.0);
        m = mult(m, rotate(theta[leftUpperArmId], 1, -1, 0));
        figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftMiddleArmId );
        break;

        case rightUpperArmId:
        
        m = translate(2 * torsoWidth+upperArmWidth, 0.9*torsoHeight, 0.0);
        m = mult(m, rotate(theta[rightUpperArmId], 1, 1, 0));
        figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightMiddleArmId);
        break;
        
        case leftUpperLegId:
        
        m = translate(-(torsoWidth+upperLegWidth), 0.1*upperLegHeight, 0.0);
        m = mult(m , rotate(theta[leftUpperLegId], 1, 0, 0));
        figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
        break;

        case rightUpperLegId:
        
        m = translate(torsoWidth+upperLegWidth, 0.1*upperLegHeight, 0.0);
        m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
        figure[rightUpperLegId] = createNode( m, rightUpperLeg, leftUpperMiddleArmId, rightLowerLegId );
        break;

        case leftUpperMiddleArmId:
        
        m = translate(-1.5 * (torsoWidth+upperArmWidth), 0.6 * torsoHeight, 0.0);
        m = mult(m, rotate(120, 1, 0, 0));
        figure[leftUpperMiddleArmId] = createNode( m, leftUpperMiddleArm, rightUpperMiddleArmId, leftMiddleMiddleArmId );
        break;

        case leftMiddleMiddleArmId:
        
        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(-90, 1, 0, 0));
        figure[leftMiddleMiddleArmId] = createNode( m, leftMiddleMiddleArm, null, leftLowerMiddleArmId );
        break;

        case leftLowerMiddleArmId:
        
        m = translate(0.0, lowerArmHeight, 0.0);
        m = mult(m, rotate(90, 1, 0, 0));
        figure[leftLowerMiddleArmId] = createNode( m, leftLowerMiddleArm, null, null );
        break;

        case rightUpperMiddleArmId:
        
        m = translate(1.5 * (torsoWidth+upperArmWidth), 0.6 * torsoHeight, 0.0);
        m = mult(m, rotate(120, 1, 0, 0));
        figure[rightUpperMiddleArmId] = createNode( m, rightUpperMiddleArm, leftWingId, rightMiddleMiddleArmId );
        break;

        case rightMiddleMiddleArmId:
        
        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(-90, 1, 0, 0));
        figure[rightMiddleMiddleArmId] = createNode( m, rightMiddleMiddleArm, null, rightLowerMiddleArmId );
        break;

        case rightLowerMiddleArmId:
        
        m = translate(0.0, lowerArmHeight, 0.0);
        m = mult(m, rotate(90, 1, 0, 0));
        figure[rightLowerMiddleArmId] = createNode( m, rightLowerMiddleArm, null, null );
        break;

        case leftWingId:

        m = translate(-2 * (torsoWidth), 0.6 * torsoHeight, 0.0);
        m = mult(m, rotate(0, 1, 0, 0));
        figure[leftWingId] = createNode( m, leftWing, rightWingId, null );
        break;

        case rightWingId:
        
        m = translate(2 * (torsoWidth), 0.6 * torsoHeight, 0.0);
        m = mult(m, rotate(0, 1, 0, 0));
        figure[rightWingId] = createNode( m, rightWing, null, null );
        break;

        case leftMiddleArmId:
        
        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(50, 1, 0, 0));
        figure[leftMiddleArmId] = createNode( m, leftMiddleArm, null, leftLowerArmId );
        break;
        
        case leftLowerArmId:

        m = translate(0.0, lowerArmHeight, 0.0);
        m = mult(m, rotate(theta[leftLowerArmId], 1, 0, 0));
        figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
        break;

        case rightMiddleArmId:

        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(0, 1, 0, 0));
        figure[rightMiddleArmId] = createNode( m, rightMiddleArm, null, rightLowerArmId );
        break;
        
        case rightLowerArmId:

        m = translate(0.0, lowerArmHeight, 0.0);
        m = mult(m, rotate(theta[rightLowerArmId], 1, 0, 0));
        figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
        break;
        
        case leftLowerLegId:

        m = translate(0.0, upperLegHeight, 0.0);
        m = mult(m, rotate(theta[leftLowerLegId], 1, 0, 0));
        figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
        break;
        
        case rightLowerLegId:

        m = translate(0.0, upperLegHeight, 0.0);
        m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
        figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
        break;
    
    }

}

function traverse(Id) {
   
   if(Id == null) return; 
   stack.push(modelViewMatrix);

   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child); 
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling); 
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight / 5, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));

    gl.drawArrays(gl.TRIANGLE_FAN, 24, 10);
    for(let cnt = 34; cnt < 95;cnt += 4) {
        gl.drawArrays(gl.TRIANGLE_FAN, cnt, 4);
    }
}

function head() {
   
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftMiddleArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth * 2, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 98, 6);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightMiddleArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4( lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth * 2, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 98, 6);
}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {
    
    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperMiddleArm() {
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftMiddleMiddleArm() {
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerMiddleArm() {
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0 * lowerMiddleArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerMiddleArmWidth, lowerMiddleArmHeight, lowerMiddleArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 98, 6);
}

// Right Mid

function rightUpperMiddleArm() {
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightMiddleMiddleArm() {
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerMiddleArm() {
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0 * lowerMiddleArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerMiddleArmWidth, lowerMiddleArmHeight, lowerMiddleArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    
    gl.drawArrays(gl.TRIANGLE_FAN, 98, 6);
}

function leftWing() {
    
    //instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0 * lowerMiddleArmHeight, 0.0) );
    instanceMatrix = mult(modelViewMatrix, rotate(20,0,0,1) );
	instanceMatrix = mult(instanceMatrix, scale4(3 * lowerMiddleArmWidth, lowerMiddleArmHeight * 0.7, lowerMiddleArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    
    gl.drawArrays(gl.TRIANGLE_FAN, 104, 7);
}

function rightWing() {
    
    //instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0 * lowerMiddleArmHeight, 0.0) );
    instanceMatrix = mult(modelViewMatrix, rotate(-20,0,0,1) );
	instanceMatrix = mult(instanceMatrix, scale4(-3 * lowerMiddleArmWidth, lowerMiddleArmHeight * 0.7, lowerMiddleArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    
    gl.drawArrays(gl.TRIANGLE_FAN, 104, 7);
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]); 
     pointsArray.push(vertices[b]); 
     pointsArray.push(vertices[c]);     
     pointsArray.push(vertices[d]);    
}


// Creates
function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

// Runs On Page Creation
window.onload = function init() {

    // Get WebGL canvas
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    aspectRatio = canvas.clientWidth / canvas.clientHeight;

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable( gl.DEPTH_TEST ); 
    
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");
    
    gl.useProgram( program);

    instanceMatrix = mat4();
    
    // Perspective Matrix
    projectionMatrix = perspective( 90, aspectRatio, 0.1, 200 )

    // ModelViewMatrix
    modelViewMatrix = translate(0, 0,-20);
    //modelViewMatrix = mult( modelViewMatrix, rotate(0,0,0,1));

    // Get ModelViewMatrix locations
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix");

    // Load Matrices to the vertex shader
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );
    
    // Create A cube and use it multiple times
    cube();

    pointsArray = pointsArray.concat(torsoVertices);
    pointsArray = pointsArray.concat(pointyPrism);
    pointsArray = pointsArray.concat(wing);
        
    // Vertex Buffer
    vBuffer = gl.createBuffer();
        
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Color Yoktu Kodda Gecici Olarak 50 tane yesil color koydum buffera. Poligonlarla birlikte color eklenmesi lazim.
    colors = Array(100).fill(vec4(0.0,1.0,0.0,1.0));
    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    
    document.getElementById("slider0").onchange = function() {
        theta[torsoId] = event.srcElement.value;
        initNodes(torsoId);
    };
    document.getElementById("slider1").onchange = function() {
        theta[head1Id] = event.srcElement.value;
        initNodes(head1Id);
    };

    document.getElementById("slider2").onchange = function() {
         theta[leftUpperArmId] = event.srcElement.value;
         initNodes(leftUpperArmId);
    };
    document.getElementById("slider3").onchange = function() {
         theta[leftLowerArmId] =  event.srcElement.value;
         initNodes(leftLowerArmId);
    };
     
    document.getElementById("slider4").onchange = function() {
        theta[rightUpperArmId] = event.srcElement.value;
        initNodes(rightUpperArmId);
    };
    document.getElementById("slider5").onchange = function() {
         theta[rightLowerArmId] =  event.srcElement.value;
         initNodes(rightLowerArmId);
    };
    document.getElementById("slider6").onchange = function() {
        theta[leftUpperLegId] = event.srcElement.value;
        initNodes(leftUpperLegId);
    };
    document.getElementById("slider7").onchange = function() {
         theta[leftLowerLegId] = event.srcElement.value;
         initNodes(leftLowerLegId);
    };
    document.getElementById("slider8").onchange = function() {
         theta[rightUpperLegId] =  event.srcElement.value;
         initNodes(rightUpperLegId);
    };
    document.getElementById("slider9").onchange = function() {
        theta[rightLowerLegId] = event.srcElement.value;
        initNodes(rightLowerLegId);
    };
    document.getElementById("slider10").onchange = function() {
         theta[head2Id] = event.srcElement.value;
         initNodes(head2Id);
    };

    for(i=0; i<numNodes; i++) initNodes(i);
    
    startAnimating(60);
}

var fps, fpsInterval, startTime, now, then, elapsed;

// initialize the timer variables and start the animation

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

// Repeats
var render = function() {

    requestAnimFrame(render);

    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        // Put your drawing code here
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );


        theta[0] = theta[0] + 1.0;
        for(i=0; i < numNodes; i++) initNodes(i);

        traverse(torsoId);

    }   
}

function ultimatron( arrayx, heightI, widthI) {
    let spx = []
    for(let i = 10; i < arrayx.length; i += 4) {
        let anon = arrayx[i + 2];
        let anan = arrayx[i + 3];

        spx.push(anon);
        spx.push(anan);
        spx.push(vec4(anan[0] * widthI,anan[1] + heightI, anan[2] * widthI, anan[3]));
        spx.push(vec4(anon[0] * widthI,anon[1] + heightI, anon[2] * widthI, anon[3]))
    }
    return arrayx.concat(spx);
}