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