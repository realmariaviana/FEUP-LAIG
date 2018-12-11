#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform float texscale;
uniform float time;

void main() {
	vec2 offsetTime = vec2(1.0,0.0)*time*0.1;
	gl_FragColor = texture2D(uSampler, vTextureCoord*texscale+offsetTime);
}



