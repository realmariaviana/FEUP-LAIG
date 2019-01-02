function getPositionById(id){
    let x = Math.floor(id/10);
    let z = id % 10;
    return [x,z];
}

function getPieceWithId(id,array){
    for(let i=0;i<array.length;i++){
        if(array[i].getId()==id)
        return array[i];
    }
    return null;
}

function dividePoint(point, divisor) {
    return [point[0]/divisor, point[1]/divisor, point[2] /divisor];
}

function addPoints(point1, point2) {
    return [point1[0] + point2[0], point1[1] + point2[1], point1[2] + point2[2]];
}

function distance(point1, point2) {
    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2) + Math.pow(point1[2] - point2[2], 2));
}