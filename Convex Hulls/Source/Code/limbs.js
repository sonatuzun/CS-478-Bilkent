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
    
    switch(Id) {

        case translateXId:
        case translateYId:
        case translateZId:
        case torsoXId:
        case torsoYId:
        case torsoZId:
        case torsoId:
        
        m = translate(theta[translateXId], theta[translateYId], theta[translateZId]);
        m = mult(m, rotate(theta[torsoXId], 1, 0, 0 ));
        m = mult(m, rotate(theta[torsoYId], 0, 1, 0));
        m = mult(m, rotate(theta[torsoZId], 0, 0, 1));
        figure[torsoId] = createNode( m, torso, null, headId );
        break;

        case headId: 
        case head1Id: 
        case head2Id:
        

        m = translate(0.0, torsoHeight+0.7*headHeight, 0.0);
        m = mult(m, rotate(theta[head1Id], 1, 0, 0))
        m = mult(m, rotate(theta[head2Id], 0, 1, 0));
        m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
        figure[headId] = createNode( m, head, leftUpperArmId, null);
        break;
		
    }

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

function head() {
   
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth * 3, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    // Draw Eye
    instanceMatrix = mult(modelViewMatrix, translate(-0.5, 0.6 * headHeight, 0.7 ));
    instanceMatrix = mult(instanceMatrix, rotate(-45, 0, 0, 1) );
    instanceMatrix = mult(instanceMatrix, rotate(90, 1, 0, 0) );
    instanceMatrix = mult(instanceMatrix, scale4(0.40, 10, 0.25) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 115, 4);

    instanceMatrix = mult(modelViewMatrix, translate(0.5, 0.6 * headHeight, 0.7 ));
    instanceMatrix = mult(instanceMatrix, rotate(45, 0, 0, 1) );
    instanceMatrix = mult(instanceMatrix, rotate(90, 1, 0, 0) );
    instanceMatrix = mult(instanceMatrix, scale4(0.40, 10, 0.25) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.drawArrays(gl.TRIANGLE_FAN, 115, 4);
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftMiddleArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * middleArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(middleArmWidth, middleArmHeight, middleArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
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

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * middleArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4( middleArmWidth, middleArmHeight, middleArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
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
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperMiddleArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperMiddleArmWidth, upperMiddleArmHeight, upperMiddleArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftMiddleMiddleArm() {
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * middleMiddleArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(middleMiddleArmWidth, middleMiddleArmHeight, middleMiddleArmWidth) );
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
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperMiddleArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperMiddleArmWidth, upperMiddleArmHeight, upperMiddleArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightMiddleMiddleArm() {
    
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * middleMiddleArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(middleMiddleArmWidth, middleMiddleArmHeight, middleMiddleArmWidth) );
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
    instanceMatrix = mult(modelViewMatrix, rotate(30,0,0,1) );
	instanceMatrix = mult(instanceMatrix, scale4(4 * lowerMiddleArmWidth, lowerMiddleArmHeight * 1.2, lowerMiddleArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    
    gl.drawArrays(gl.TRIANGLE_FAN, 104, 7);
}

function rightWing() {
    
    //instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.0 * lowerMiddleArmHeight, 0.0) );
    instanceMatrix = mult(modelViewMatrix, rotate(-30,0,0,1) );
	instanceMatrix = mult(instanceMatrix, scale4(-4 * lowerMiddleArmWidth, lowerMiddleArmHeight * 1.2, lowerMiddleArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    
    gl.drawArrays(gl.TRIANGLE_FAN, 104, 7);
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}