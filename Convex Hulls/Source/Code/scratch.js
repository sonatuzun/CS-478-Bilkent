"use strict";
var canvas;
var gl;
var program;

var projectionMatrix; 
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;
var projectionMatrixLoc;

var allPoints = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var convexHullPoints = [
	vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
]

// torsoVertices = torsoComplete(torsoVertices, 3, 2);
// torsoVertices = torsoComplete(torsoVertices, 3, 2);

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
var torsoHeight = 6.0;
var torsoWidth = 1.7;



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

var vBuffer;
var modelViewLoc;

var pointsArray = [];
var pageInfo;

//-------------------------------------------

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
    pointsArray = convexHullPoints;
        
    // Vertex Buffer
    vBuffer = gl.createBuffer();
        
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    let colors = Array(20).fill(vec4(1.0,0.0,0.0,1.0));


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

    for(let i=0; i<numNodes; i++) initNodes(i);
    
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

    
}

// function quad(a, b, c, d) {
     // pointsArray.push(vertices[a]); 
     // pointsArray.push(vertices[b]); 
     // pointsArray.push(vertices[c]);     
     // pointsArray.push(vertices[d]);    
// }

// Creates
// function cube()
// {
    // quad( 1, 0, 3, 2 );
    // quad( 2, 3, 7, 6 );
    // quad( 3, 0, 4, 7 );
    // quad( 6, 5, 1, 2 );
    // quad( 4, 5, 6, 7 );
    // quad( 5, 4, 0, 1 );
// }

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
	torso()
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight / 5, torsoWidth * 3/4) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );

    // gl.drawArrays(gl.TRIANGLE_FAN, 24, 10);
    for(let cnt = 0; cnt < pointsArray.length; cnt += 4) {
        gl.drawArrays(gl.TRIANGLE_FAN, cnt, 4);
    }
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 5.5, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( 10, 2, 10 * 3/4));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    // gl.drawArrays(gl.TRIANGLE_FAN, 119, 10);

}

//DOWNLOAD
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
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