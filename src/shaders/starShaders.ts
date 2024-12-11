export const starVertexShader = `
  attribute float size;
  attribute float texture;
  varying float vTexture;
  attribute float proximity;
  varying float vProximity;

  void main() {
    vProximity = proximity;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // Reduce el tamaño multiplicando por un factor menor
    gl_PointSize = size * (100.0 / -mvPosition.z); // Cambiado de 300.0 a 150.0
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const starFragmentShader = `
  varying float vTexture;
  varying float vProximity;

  void main() {
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);

    if (r > 1.0) {
      discard;
    }

    vec3 color;
    float randomValue = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);

    if (randomValue < 0.14) {
      color = vec3(0.0, 0.0, 1.0); // Azul
    } else if (randomValue < 0.28) {
      color = vec3(0.5, 0.5, 1.0); // Azul claro
    } else if (randomValue < 0.42) {
      color = vec3(1.0, 1.0, 1.0); // Blanco
    } else if (randomValue < 0.56) {
      color = vec3(1.0, 1.0, 0.8); // Amarillo claro
    } else if (randomValue < 0.70) {
      color = vec3(1.0, 1.0, 0.0); // Amarillo
    } else if (randomValue < 0.84) {
      color = vec3(1.0, 0.5, 0.0); // Naranja
    } else {
      color = vec3(1.0, 0.0, 0.0); // Rojo
    }

    // Ajusta el brillo basado en la proximidad
    float brightness = 1.0 - vProximity;
    float alpha = (1.0 - r) * brightness;

    gl_FragColor = vec4(color * brightness, alpha);
  }
`;