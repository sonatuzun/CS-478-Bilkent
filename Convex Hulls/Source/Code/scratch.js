"use strict";
var canvas;
var gl;
var program;

var projectionMatrix; 
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;
var projectionMatrixLoc;

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
let torsoVertices = [
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
torsoVertices = torsoComplete(torsoVertices, 3, 2);
var wing = [
    vec4( 0.06, 0.7,  0.0, 1.0 ),
    vec4( -0.30, 0.73,  0.0, 1.0 ),
    vec4( -0.48, 0.48,  0.0, 1.0 ),
    vec4( -0.57, 0.2,  0.0, 1.0 ),
    vec4( -0.56, -0.11,  0.0, 1.0 ),
    vec4( -0.35, -0.55,  0.0, 1.0 ),
    vec4( 0.06, -0.89,  0.0, 1.0 ),
]

let pointyPrism = [
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(-0.2, 0.0, -0.2, 1.0),
    vec4(0.2, 0.0, -0.2, 1.0),
    vec4(0.2, 0.0, 0.2, 1.0),
    vec4(-0.2, 0.0, 0.2, 1.0),
    vec4(-0.2, 0.0, -0.2, 1.0),
]

let ground = [
    vec4(-1.0, 0.0, -1.0, 1.0),
    vec4(1.0, 0.0, -1.0, 1.0),
    vec4(1.0, 0.0, 1.0, 1.0),
    vec4(-1.0, 0.0, 1.0, 1.0),
]

let eye = [
    vec4(-1.0, 0.0, -1.0, 1.0),
    vec4(1.0, 0.0, -1.0, 1.0),
    vec4(1.0, 0.0, 1.0, 1.0),
    vec4(-1.0, 0.0, 1.0, 1.0),
]

let shoulder = [
    // Bottom
    vec4(0.0, 0.5, 0.0, 1.0),
    vec4(-0.5, 0.0, 0.0, 1.0),
    vec4(-Math.sqrt(0.5) / 2, 0.0, Math.sqrt(0.5) / 2, 1.0),
    vec4(0.0, 0.0, 0.5, 1.0),
    vec4(Math.sqrt(0.5) / 2, 0.0, Math.sqrt(0.5) / 2, 1.0),
    vec4(0.5, 0.0, 0.0, 1.0),
    vec4(Math.sqrt(0.5) / 2, 0.0, -Math.sqrt(0.5) / 2, 1.0),
    vec4(0.0, 0.0, -0.5, 1.0),
    vec4(-Math.sqrt(0.5) / 2, 0.0, -Math.sqrt(0.5) / 2, 1.0),
    vec4(-0.5, 0.0, 0.0, 1.0),
]

var torsoId  = 0;
var translateXId = 20;
var translateYId = 21;
var translateZId = 22;
var torsoXId = 23;
var torsoYId = 24;
var torsoZId = 25;
var headId  = 1;
var head1Id = 26;
var head2Id = 27;
var leftUpperArmId = 2;
var leftUpperArm2Id = 28;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightUpperArm2Id = 29;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftUpperLeg2Id = 30;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightUpperLeg2Id = 31;
var rightLowerLegId = 9;
var leftMiddleArmId = 10;
var rightMiddleArmId = 11;
var leftUpperMiddleArmId = 12;
var leftUpperMiddleArm2Id = 32;
var leftMiddleMiddleArmId = 13;
var leftLowerMiddleArmId = 14;
var rightUpperMiddleArmId = 15;
var rightUpperMiddleArm2Id = 33;
var rightMiddleMiddleArmId = 16;
var rightLowerMiddleArmId = 17;
var leftWingId = 18;
var rightWingId = 19;

var torsoHeight = 6.0;
var torsoWidth = 1.7;
var upperArmHeight = 2.0;
var lowerArmHeight = 3.5;
var upperArmWidth  = 0.5;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.5;
var lowerLegWidth  = 0.5;
var lowerLegHeight = 2.0;
var upperLegHeight = 3.0;
var middleArmHeight = 3.0;
var middleArmWidth = 0.5;
var headHeight = 2.0;
var headWidth = 1.0;
var upperMiddleArmHeight = 2.0;
var upperMiddleArmWidth = 0.5;
var middleMiddleArmHeight = 2.5;
var middleMiddleArmWidth = 0.5;
var lowerMiddleArmHeight = 3;
var lowerMiddleArmWidth = 1.0;

var numNodes = 20;
var numAngles = 11;
var angle = 0;

var sliders;

var theta = [ 0, 0,
    90, // Left Upper Arm 
    25, // Left Lower Arm
    90, // Right Upper Arm
    25, // Right Lower Arm 
    180, // Left Upper Leg
    0, 
    180, // Right Upper Leg
    0, 
    70, // Left Middle Arm
    70, // Right Middle Arm
    100, 40, -90,
    100, 40, -90, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 40, -40, 0, 0,
];

var anim = []

var numVertices = 24;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];
var pageInfo;

//-------------------------------------------

function traverse(Id) {
   
   if(Id == null) return; 
   stack.push(modelViewMatrix);

   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child); 
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling); 
}

// Runs On Page Creation
window.onload = function init() {
    pageInfo = {
        canvas: document.getElementById( "gl-canvas" ),
        keyframe: document.getElementById("keyframes"),
    }

    // Get WebGL canvas
    canvas = pageInfo.canvas;
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    let aspectRatio = canvas.clientWidth / canvas.clientHeight;

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.68, 0.85, 0.7, 1.0 );
    gl.enable( gl.DEPTH_TEST ); 
    
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");
    
    gl.useProgram( program);

    instanceMatrix = mat4();
    
    // Perspective Matrix
    projectionMatrix = perspective( 90, aspectRatio, 0.1, 200 );

    // ModelViewMatrix
    modelViewMatrix = translate(0, 0,-20);

    // Get ModelViewMatrix locations
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix")

    // Load Matrices to the vertex shader
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
    
    // Create A cube and use it multiple times
    cube();

    // PointArray 24, +Torso 98, +pointyPrism 104, +wing 111, +ground 115
    pointsArray = pointsArray.concat(torsoVertices, pointyPrism, wing, ground, eye, shoulder);
        
    // Vertex Buffer
    vBuffer = gl.createBuffer();
        
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Color Yoktu Kodda Gecici Olarak 50 tane yesil color koydum buffera. Poligonlarla birlikte color eklenmesi lazim.
    let colors = Array(24).fill(vec4(0.0,.0,0.0,1.0));
    let torsoColors = Array(98-24).fill(vec4(0.0,0.0,0.0,1.0));
    let pointyColors = Array(104-98).fill(vec4(0.4,0.4,0.4,1.0));
    let wingColors = Array(111-104).fill(vec4(0.7,0.1,0.1,1.0));
    let groundColors = Array(115-111).fill(vec4(0.0,1.0,0.4,1.0));
    let eyeColors = Array(119-115).fill(vec4(0.4,0.6,0.9,1.0));
    let shoulderColors = Array(129-119).fill(vec4(0.4,0.4,0.4,1.0));
    colors = colors.concat(torsoColors, pointyColors, wingColors, groundColors, eyeColors, shoulderColors);

    let cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    
    // Sliders

    sliders = [
        document.getElementById("translateSliderX"), // 0
        document.getElementById("translateSliderY"), // 1
        document.getElementById("translateSliderZ"), // 2
        document.getElementById("torsoSliderX"), // 3
        document.getElementById("torsoSliderY"), // 4
        document.getElementById("torsoSliderZ"), // 5
    ]

    let sliderToElem = [
        translateXId, // 0
        translateYId, // 1
        translateZId, // 2
        torsoXId, // 3
        torsoYId, // 4
        torsoZId, // 5
    ];

    function setSlider(sliderNum) {
        
        sliders[sliderNum].oninput = (event) => {
            theta[sliderToElem[sliderNum]] = parseFloat( event.target.value );
            initNodes(sliderToElem[sliderNum]);
        };
    }

    for( let sliderCnt = 0; sliderCnt < sliderToElem.length; sliderCnt++) {
        setSlider(sliderCnt);
    }

    document.getElementById("fov").oninput = (event) => {
        projectionMatrix = perspective( event.target.value, aspectRatio, 0.1, 200 );
        gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
    };

	document.getElementById("add_keyframe").onclick = () => {
        anim.push([...theta]);        
        createKeyframeDiv(anim.length - 1);
    };
	
	// Saving Animation
    document.getElementById("saveAnimButton").addEventListener("click", () => {
		download(JSON.stringify({
            animation: anim
        }),
        "anim.txt", "text/plain");
    })

    // Loading Animation
    const inputElement = document.getElementById("fileInput");
    inputElement.addEventListener("change", handleFiles, false);
    function handleFiles() {

        var r = new FileReader();
        r.onload = (function(file) {
            return function(e) {
                var contents = e.target.result;
                
                let loadedContent = JSON.parse(contents);
                // Load Animation.
                anim = loadedContent.animation;
				animToHTML()
            };
        })(this.files[0]);
        r.readAsText(this.files[0]);
    }

    function animToHTML() {
        // Clear and Recreate
        pageInfo.keyframe.innerHTML = "";
        for( let animCnt = 0; animCnt < anim.length; animCnt++) {
            createKeyframeDiv(animCnt);
        }
    }

    let animButtonText = ["Replay Animation", "Stop Animation"];

	document.getElementById("play_anim").onclick = () => {
		if (anim.length > 0) {
            playing = !playing
            if(playing) {
                document.getElementById("play_anim").value = animButtonText[1];
            }
            else {
                document.getElementById("play_anim").value = animButtonText[0];
            }
        }
    };

    for(i=0; i<numNodes; i++) initNodes(i);
    
    startAnimating(60);
}

var fps, fpsInterval, startTime, now, then;
var elapsed = 0;
var animSpeed = 1.2
var playing = false

// initialize the timer variables and start the animation

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
	setInterval(function(){ requestAnimFrame(render); }, fpsInterval);
    render();
}

// Repeats
var render = function() {

    now = Date.now();
    elapsed += animSpeed * (now - then);

    // if enough time has elapsed, draw the next frame


	// Get ready for next frame by setting then=now, but also adjust for your
	// specified fpsInterval not being a multiple of RAF's interval (16.7ms)
	then = now - (elapsed % fpsInterval);

	// Put your drawing code here
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );


	let anim_index = 0;
	let anim_offset = 0;
	let progress = ( elapsed / 1000 ) % anim.length;

	for(i=0; i < numNodes; i++) initNodes(i);

    traverse(torsoId);
    
    drawGround();
}

//DOWNLOAD
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function torsoComplete( arrayx, heightI, widthI  ) {
    let resultPoinst = []
    for(let i = 10; i < arrayx.length; i += 4) {
        let upperPoint1 = arrayx[i + 2];
        let upperPoint2 = arrayx[i + 3];

        resultPoinst.push(upperPoint1);
        resultPoinst.push(upperPoint2);
        resultPoinst.push(vec4(upperPoint2[0] * widthI,upperPoint2[1] + heightI, upperPoint2[2] * widthI, upperPoint2[3]));
        resultPoinst.push(vec4(upperPoint1[0] * widthI,upperPoint1[1] + heightI, upperPoint1[2] * widthI, upperPoint1[3]))
    }
    return arrayx.concat(resultPoinst);
}

function animateSlider(thetaIndex, newValue) {
    let sliderIndex = thetaToSlider[thetaIndex];
    if (sliderIndex != null) {
        sliders[sliderIndex].children[0].value = newValue;
    }
}

var thetaToSlider = [
    null, // torsoId 0
]

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

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

// Create Hierarchy
function initNodes(Id) {
	var m = mat4();      
	m = translate(theta[translateXId], theta[translateYId], theta[translateZId]);
	m = mult(m, rotate(theta[torsoXId], 1, 0, 0 ));
	m = mult(m, rotate(theta[torsoYId], 0, 1, 0));
	m = mult(m, rotate(theta[torsoZId], 0, 0, 1));
	figure[torsoId] = createNode( m, torso, null, headId );
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight / 5, torsoWidth * 3/4));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));

    gl.drawArrays(gl.TRIANGLE_FAN, 24, 10);
    for(let cnt = 34; cnt < 95;cnt += 4) {
        gl.drawArrays(gl.TRIANGLE_FAN, cnt, 4);
    }
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 5.5, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( 10, 2, 10 * 3/4));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 119, 10);

}