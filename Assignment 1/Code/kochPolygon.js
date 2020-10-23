"use strict"

// Routine WebGL Variables
var canvas;
var gl;

var fillPolygon = false;
// Determines whether the polygon will be shown with the curve.
var renderPolygon = true;
// Temporary Variable To Save Mouse Position Vector.
var finished = false;

var mousePoint;
// Stores the vertices of the polygon.
var polygonVertices = [];
// Stores the vertices of the koch curve.
var curveVertices = [];
// Number of iterations of the Koch curve rule.
var iterationCount = 2;
// Background Color As RGB
var backgroundColorRGB;
// Color
var polygonColorRGB;
var curveColorRGB;

var fColorPointer;
var zoomLocation;
var zoomMultiplier = 1;
var bufferId;
var aspectRatio;

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    
    var a = document.getElementById("Button1")
    a.addEventListener("click", function() {

        curveVertices = [];

        if (finished) {
            if (iterationCount > 0) {
                for(let lineIndex = 0; lineIndex < polygonVertices.length - 1; lineIndex++) {
                    koch(polygonVertices[lineIndex], polygonVertices[lineIndex + 1], iterationCount);
                }
            }
            else {
                curveVertices = polygonVertices;
            }
        } else {
            alert("You Should Complete The Polygon");
        }

    
        render();
    });


    let drawing = false;
    finished = false;

    canvas.addEventListener("mousedown", function(event){
        

        if (finished) {
            polygonVertices = [];
            curveVertices = [];
            finished = false;
        }

        if (drawing) {
            drawing = false;
            polygonVertices.pop();

            if( length(subtract(mousePoint, polygonVertices[0])) < 0.05) {
                polygonVertices.push(vec2(polygonVertices[0][0], polygonVertices[0][1]));
                drawing = false;
                finished = true;

                render();
                return;
            }
        }

        mousePoint = vec2(2*event.clientX/canvas.width-1, 
           2*(canvas.height-event.clientY)/canvas.height-1);
        
        polygonVertices.push(mousePoint);
        polygonVertices.push(mousePoint);

        drawing = true;
        
    } );

    canvas.addEventListener("mousemove", function(event){

        if(drawing) {
            mousePoint = vec2(2*event.clientX/canvas.width-1, 
            2*(canvas.height-event.clientY)/canvas.height-1);

            polygonVertices.pop();
            polygonVertices.push(mousePoint);
            
            render();
        }
    } );

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    //gl.viewport( 0, 0, canvas.width, canvas.height );
    aspectRatio = canvas.clientWidth / canvas.clientHeight;


    //get selected colors in hex
    let backgroundColorHex = document.getElementById("backgroundColor").value;
    //convert hex colors into rgb
    backgroundColorRGB = hexToRgb(backgroundColorHex);

    let polygonColorHex = document.getElementById("polygonColor").value;
    polygonColorRGB = hexToRgb(polygonColorHex);

    let curveColorHex = document.getElementById("curveColor").value;
    curveColorRGB = hexToRgb(curveColorHex);

    //clear buffer with new color
    gl.clearColor(backgroundColorRGB.r / 255.0, backgroundColorRGB.g / 255.0, backgroundColorRGB.b / 255.0, 1.0);

    gl.clear( gl.COLOR_BUFFER_BIT );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    fColorPointer = gl.getUniformLocation(program, "fColor");
    zoomLocation = gl.getUniformLocation(program, "zoomC");

    gl.useProgram( program );

  
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    var vPos = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPos, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPos );

    // UTILITIES

    // Saving The Koch Curve
    document.getElementById("saveShapeButton").addEventListener("click", () => {
        download(JSON.stringify({
            backgroundColor: backgroundColorRGB,
            polygonColor: polygonColorRGB,
            curveColor: curveColorRGB,
            iteration: iterationCount,
            vertices: polygonVertices
        }),
        "koch.txt", "text/plain");
    })

    // Loading A koch Curve
    const inputElement = document.getElementById("fileInput");
    inputElement.addEventListener("change", handleFiles, false);
    function handleFiles() {

        var r = new FileReader();
        r.onload = (function(file) {
            return function(e) {
                var contents = e.target.result;
                
                console.log(JSON.parse(contents));
                let loadedContent = JSON.parse(contents);
                polygonVertices = loadedContent.vertices;
                backgroundColorRGB = loadedContent.backgroundColor;
                polygonColorRGB = loadedContent.polygonColor;
                curveColorRGB = loadedContent.curveColor;
                iterationCount = loadedContent.iteration;

                finished = equal(polygonVertices[0], polygonVertices[polygonVertices.length - 1]);
                gl.clearColor(backgroundColorRGB.r / 255.0, backgroundColorRGB.g / 255.0, backgroundColorRGB.b / 255.0, 1.0);

                document.getElementById("Button1").click();
            };
        })(this.files[0]);
        r.readAsText(this.files[0]);
    }

    // Iteration Number
    let slider = document.getElementById("sliderNumber");
    let numForm = document.getElementById("formNumber");
    slider.addEventListener("change", (event) => {
        let newValue = parseInt(event.target.value);

        numForm.value = event.target.value;
        iterationCount = newValue;
    })
    numForm.addEventListener("change", (event) => {
        let newValue = parseInt(event.target.value);
        
        if (event.target.value > parseInt(numForm.max)) {
            slider.value = numForm.max;
            numForm.value = numForm.max;
            iterationCount = parseInt(numForm.max);
        }
        else if (event.target.value < parseInt(numForm.min)){
            slider.value = numForm.min;
            numForm.value = numForm.min;
            iterationCount = parseInt(numForm.min);
        }
        else {
            slider.value = event.target.value;
            iterationCount = newValue;
        }
    })

    // Reset Polygon

    document.getElementById("resetPolygon").addEventListener("click", () => {
        polygonVertices = [];
        gl.clear( gl.COLOR_BUFFER_BIT);
    });

    // ZOOMING

    //StackOverFlow
    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }
        
        switch (event.key) {
            case "-":
                zoomMultiplier *= (10/9);
                render();
                break;
            case "+":
                zoomMultiplier *= 0.9;
                render();
                break;
            default:
            return; // Quit when this doesn't handle the key event.
        }
        
        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }, true);
    // the last option dispatches the event to the listener first,
    // then dispatches event to window

    // Fill CheckBox
    document.getElementById("fillPolygon").addEventListener("click", (event) => {
        fillPolygon = event.target.checked;
        render();
    });

    // Show Polygon CheckBox
    document.getElementById("showPolygon").addEventListener("click", (event) => {
        renderPolygon = event.target.checked;
        render();
    });

    // Change Background Color
    document.getElementById("backgroundColor").addEventListener("change", (event) => {
        var backgroundColorHex = event.target.value;
        backgroundColorRGB = hexToRgb(backgroundColorHex);
        // Set Background (Clear) Color
        gl.clearColor(backgroundColorRGB.r / 255.0, backgroundColorRGB.g / 255.0, backgroundColorRGB.b / 255.0, 1.0);
        render();
    });

    // Change Polygon Color
    document.getElementById("polygonColor").addEventListener("change", (event) => {
        var polygonColorHex = event.target.value;
        polygonColorRGB = hexToRgb(polygonColorHex);
        render();
    });

    // Change Background Color
    document.getElementById("curveColor").addEventListener("change", (event) => {
        var curveColorHex = event.target.value;
        curveColorRGB = hexToRgb(curveColorHex);
        render();
    });

}

function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    gl.uniform1f(zoomLocation, zoomMultiplier);

    // Loading Polygon Data To The Buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(polygonVertices), gl.STATIC_DRAW );

    // change fragment shader during render time
    gl.uniform4f(fColorPointer, polygonColorRGB.r / 255.0, polygonColorRGB.g / 255.0, polygonColorRGB.b / 255.0, 1.0);

    // Drawing The Polygon
    if(finished) {
        if(renderPolygon || curveVertices.length == 0) {
            if(fillPolygon) {
                gl.drawArrays( gl.TRIANGLE_FAN, 0, polygonVertices.length );
            } else {
                gl.drawArrays( gl.LINE_STRIP, 0, polygonVertices.length );
            }
        }
    } else {
        gl.drawArrays( gl.LINE_STRIP, 0, polygonVertices.length );
    }
    
    // Drawing The Curve
    if(curveVertices.length != 0) {

        // change fragment shader during render time
        gl.uniform4f(fColorPointer, curveColorRGB.r / 255.0, curveColorRGB.g / 255.0, curveColorRGB.b / 255.0, 1.0);
        gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(curveVertices), gl.STATIC_DRAW );
        gl.drawArrays( gl.LINE_STRIP, 0, curveVertices.length );
    }
}

function koch(point1, point9, iteration) {

    iteration--;

    // Calculate Point 2
    let point2 = mix(point1, point9, 0.25);

    // Calculate Point 3
    let temp = subtract(point1, point2);
    temp = vec2(temp[1] / aspectRatio, -temp[0] * aspectRatio);
    let point3 = add( temp, point2);

    // Calculate Point 5
    let point5 = mix(point1, point9, 0.50);
    
    // Calculate Point 4
    temp = subtract(point2, point5);
    temp = vec2(temp[1] / aspectRatio, -temp[0] * aspectRatio);
    let point4 = add( temp, point5);

    // Calculate Point 6
    temp = subtract(point2, point5);
    temp = vec2(-temp[1] / aspectRatio, temp[0] * aspectRatio);
    let point6 = add( temp, point5);

    // Calculate Point 8
    let point8 = mix(point1, point9, 0.75);

    // Calculate Point 7
    temp = subtract(point5, point8);
    temp = vec2(-temp[1] / aspectRatio, temp[0] * aspectRatio);
    let point7 = add( temp, point8);


    // Create Koch Curve with the resulting lines.
    if(iteration === 0) {
        curveVertices.push(point1);
        curveVertices.push(point2);
        curveVertices.push(point3);
        curveVertices.push(point4);
        curveVertices.push(point5);
        curveVertices.push(point6);
        curveVertices.push(point7);
        curveVertices.push(point8);
        curveVertices.push(point9);
    }

    // Create A koch Curve with each line
    else {
        koch(point1, point2, iteration);
        koch(point2, point3, iteration);
        koch(point3, point4, iteration);
        koch(point4, point5, iteration);
        koch(point5, point6, iteration);
        koch(point6, point7, iteration);
        koch(point7, point8, iteration);
        koch(point8, point9, iteration);
    }
}

/*
 * method that translates hex codes into RGB and returns them as an array. Taken from:
 * https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 */
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : alert('color value not correct');
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}