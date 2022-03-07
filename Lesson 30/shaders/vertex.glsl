uniform float uSize;
uniform float uPixelRatio;
uniform float uTime;
uniform float uSpeed;
attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColour;
void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Animation
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceCentre = length(modelPosition.xz);
    float angleOffset = (1.0/ distanceCentre) * uTime * uSpeed;
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceCentre;
    modelPosition.z = sin(angle) * distanceCentre;

    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uSize * aScale * uPixelRatio;
    gl_PointSize *= (1.0 / -viewPosition.z);


    vColour = color;
}