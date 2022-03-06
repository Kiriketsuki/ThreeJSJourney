uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

attribute float aScale;
void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(uTime * modelPosition.x * 1.5) * cos(modelPosition.x) * aScale * 0.13;
    modelPosition.x += sin(uTime * modelPosition.z) * cos(modelPosition.y * cos(sin(uTime * modelPosition.x))) * aScale * 0.1;
    modelPosition.z += cos(uTime * modelPosition.z) * sin(modelPosition.x * cos(uTime)) * 0.05;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    gl_PointSize = uSize * aScale * uPixelRatio;
    gl_PointSize *= (1.0 / -viewPosition.z);
}