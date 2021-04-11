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
        
        
        case leftUpperArmId:
        case leftUpperArm2Id:
        
        m = translate(-2 * (torsoWidth+upperArmWidth), 0.9*torsoHeight, 0.0);
        m = mult(m, rotate(theta[leftUpperArmId], 1, 0, 0));
        m = mult(m, rotate(theta[leftUpperArm2Id], 0, 0, 1));
        figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftMiddleArmId );
        break;

        case rightUpperArmId:
        case rightUpperArm2Id:
        
        m = translate(2 * torsoWidth+upperArmWidth, 0.9*torsoHeight, 0.0);
        m = mult(m, rotate(theta[rightUpperArmId], 1, 0, 0));
        m = mult(m, rotate(theta[rightUpperArm2Id], 0, 0, 1));
        figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightMiddleArmId);
        break;
        
        case leftUpperLegId:
        case leftUpperLeg2Id:
        
        m = translate(-(torsoWidth+upperLegWidth) + 0.4, 0.3*upperLegHeight, 0.0);
        m = mult(m, rotate(theta[leftUpperLegId], 1, 0, 0));
        m = mult(m, rotate(theta[leftUpperLeg2Id], 0, 0, 1) );
        figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
        break;

        case rightUpperLegId:
        case rightUpperLeg2Id:
        
        m = translate(torsoWidth+upperLegWidth - 0.4, 0.3*upperLegHeight, 0.0);
        m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
        m = mult(m, rotate(theta[rightUpperLeg2Id], 0, 0, 1) );
        figure[rightUpperLegId] = createNode( m, rightUpperLeg, leftUpperMiddleArmId, rightLowerLegId );
        break;

        case leftUpperMiddleArmId:
        case leftUpperMiddleArm2Id:
        
        m = translate(-1.5 * (torsoWidth+upperArmWidth), 0.6 * torsoHeight, 0.0);
        m = mult(m, rotate(theta[leftUpperMiddleArmId], 1, 0, 0));
        m = mult(m, rotate(theta[leftUpperMiddleArm2Id], 0, 0, 1));
        figure[leftUpperMiddleArmId] = createNode( m, leftUpperMiddleArm, rightUpperMiddleArmId, leftMiddleMiddleArmId );
        break;

        case leftMiddleMiddleArmId:
        
        m = translate(0.0, upperMiddleArmHeight, 0.0);
        m = mult(m, rotate(theta[leftMiddleMiddleArmId], 1, 0, 0));
        figure[leftMiddleMiddleArmId] = createNode( m, leftMiddleMiddleArm, null, leftLowerMiddleArmId );
        break;

        case leftLowerMiddleArmId:
        
        m = translate(0.0, middleMiddleArmHeight, 0.0);
        m = mult(m, rotate(theta[leftLowerMiddleArmId], 1, 0, 0));
        figure[leftLowerMiddleArmId] = createNode( m, leftLowerMiddleArm, null, null );
        break;

        case rightUpperMiddleArmId:
        case rightUpperMiddleArm2Id:
        
        m = translate(1.5 * (torsoWidth+upperArmWidth), 0.6 * torsoHeight, 0.0);
        m = mult(m, rotate(theta[rightUpperMiddleArmId], 1, 0, 0));
        m = mult(m, rotate(theta[rightUpperMiddleArm2Id], 0, 0, 1));
        figure[rightUpperMiddleArmId] = createNode( m, rightUpperMiddleArm, leftWingId, rightMiddleMiddleArmId );
        break;

        case rightMiddleMiddleArmId:
        
        m = translate(0.0, upperMiddleArmHeight, 0.0);
        m = mult(m, rotate(theta[rightMiddleMiddleArmId], 1, 0, 0));
        figure[rightMiddleMiddleArmId] = createNode( m, rightMiddleMiddleArm, null, rightLowerMiddleArmId );
        break;

        case rightLowerMiddleArmId:
        
        m = translate(0.0, middleMiddleArmHeight, 0.0);
        m = mult(m, rotate(theta[rightLowerMiddleArmId], 1, 0, 0));
        figure[rightLowerMiddleArmId] = createNode( m, rightLowerMiddleArm, null, null );
        break;

        case leftWingId:

        m = translate(-2.3 * (torsoWidth), 0.6 * torsoHeight, 0.0);
        m = mult(m, rotate(theta[leftWingId], 0, 1, 0));
        figure[leftWingId] = createNode( m, leftWing, rightWingId, null );
        break;

        case rightWingId:
        
        m = translate(2.3 * (torsoWidth), 0.6 * torsoHeight, 0.0);
        m = mult(m, rotate(theta[rightWingId], 0, 1, 0));
        figure[rightWingId] = createNode( m, rightWing, null, null );
        break;

        case leftMiddleArmId:
        
        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[leftMiddleArmId], 1, 0, 0));
        figure[leftMiddleArmId] = createNode( m, leftMiddleArm, null, leftLowerArmId );
        break;
        
        case leftLowerArmId:

        m = translate(0.0, middleArmHeight, 0.0);
        m = mult(m, rotate(theta[leftLowerArmId], 1, 0, 0));
        figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
        break;

        case rightMiddleArmId:

        m = translate(0.0, upperArmHeight, 0.0);
        m = mult(m, rotate(theta[rightMiddleArmId], 1, 0, 0));
        figure[rightMiddleArmId] = createNode( m, rightMiddleArm, null, rightLowerArmId );
        break;
        
        case rightLowerArmId:

        m = translate(0.0, middleArmHeight, 0.0);
        m = mult(m, rotate(theta[rightLowerArmId], 1, 0, 0));
        figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
        break;
        
        case leftLowerLegId:

        m = translate(0.0, upperLegHeight, 0.0);
        m = mult(m, rotate(-45, 0, 0, 1) );
        m = mult(m, rotate(theta[leftLowerLegId], 1, 0, 0));
        figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
        break;
        
        case rightLowerLegId:

        m = translate(0.0, upperLegHeight, 0.0);
        m = mult(m, rotate(45, 0, 0, 1) );
        m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
        figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
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