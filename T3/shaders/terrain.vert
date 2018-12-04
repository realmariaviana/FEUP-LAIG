attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform sampler2D uSampler2;

uniform float heightscale;

varying vec2 vTextureCoord;

void main() {
	vTextureCoord = aTextureCoord;
	vec4 color = texture2D(uSampler2, vTextureCoord);
	float yScale = (color.r + color.g + color.b)/3.0;
	vec3 offsetVec = aVertexNormal * yScale * heightscale;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offsetVec, 1.0);
}