export const jetVertexShader = `
  attribute float size;
  attribute float opacity;
  varying float vOpacity;
  void main() {
    vOpacity = opacity;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const jetFragmentShader = `  
  varying float vOpacity;

  void main() {
    // Cambiar el color a azul y usar la opacidad variable
    gl_FragColor = vec4(0.0, 0.0, 1.0);
  }
`;