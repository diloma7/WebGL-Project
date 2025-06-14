function showError(errorText) {
  const erroBoxDiv = document.getElementById("error-box");
  const errorTextElement = document.createElement("p");
  errorTextElement.innerText = errorText;
  erroBoxDiv.appendChild(errorTextElement);
}
function helloTriangle() {
  /**@type {HTMLCanvasElement | null}**/
  const canvas = document.getElementById("demo-canvas");
  if (!canvas) {
    showError(
      "Cannot get demo-canvas reference. Check for typos or loading script too early in HTMl"
    );
    return;
  }

  const gl = canvas.getContext("webgl2");
  if (!gl) {
    const isWebGl1Supported = !!canvas.getContext("webgl");
    if (isWebGl1Supported) {
      showError(
        "This browser support WebGl 1 but not WebGL2 - Make sure WebGl 2 isn't disabled in your browser."
      );
    } else {
      showError("This browser does not support WebGl. This demo will not work");
    }
    return;
  }

  gl.clearColor(0.08, 0.08, 0.08, 1.0); // Set clear color to black, fully opaque}

  const triangleVertices = new Float32Array([
    0.0,
    0.5, // Vertex 1 (X, Y)
    -0.5,
    -0.5, // Vertex 2 (X, Y)
    0.5,
    -0.5, // Vertex 3 (X, Y)
  ]);

  const triangleGeometryBuffer = gl.createBuffer();
  if (!triangleGeometryBuffer) {
    showError("Failed to create buffer for triangle geometry");
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeometryBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);

  const vertexShaderSource = `#version 300 es 
  precision mediump float; 
  in vec2 vertexPosition; // Vertex position attribute
    void main() {
      gl_Position = vec4(vertexPosition, 0.0, 1.0); // Set the position of the vertex
    }`;
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  if (!vertexShader) {
    showError("Failed to create vertex shader");
    return;
  }
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    showError(
      `Vertex shader compilation failed: ${gl.getShaderInfoLog(vertexShader)}`
    );
    return;
  }

  const fragmentShaderSource = `#version 300 es
  precision mediump float; 
  out vec4 outputColor; // Output color of the fragment
    void main() {
      outputColor = vec4(0.294, 0.0, 0.51, 1.0); // Set the fragment color to red
    }`;
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  if (!fragmentShader) {
    showError("Failed to create fragment shader");
    return;
  }
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    showError(
      `Fragment shader compilation failed: ${gl.getShaderInfoLog(
        fragmentShader
      )}`
    );
    return;
  }
  const shaderProgram = gl.createProgram();
  if (!shaderProgram) {
    showError("Failed to create shader program");
    return;
  }
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    showError(
      `Shader program linking failed: ${gl.getProgramInfoLog(shaderProgram)}`
    );
    return;
  }

  const vertexPositionAttributeLocation = gl.getAttribLocation(
    shaderProgram,
    "vertexPosition"
  );
  if (vertexPositionAttributeLocation < 0) {
    showError("Failed to get attribute location for vertexPosition");
    return;
  }
  //output merger - how to merge the shaded pixels fragment with the existing output image
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //Rasterizer - which pixels are part of a triangle
  gl.viewport(0, 0, canvas.width, canvas.height); // Set the viewport to match the canvas size

  //Set GPU program (vertex + fragment shader pair )
  gl.useProgram(shaderProgram);
  gl.enableVertexAttribArray(vertexPositionAttributeLocation); // Enable the vertex position attribute
  //Input assembler - how to read vertices from our GPU triangle buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeometryBuffer);
  gl.vertexAttribPointer(
    vertexPositionAttributeLocation,
    2, // Number of components per vertex (X, Y)
    gl.FLOAT, // Data type of each component
    false, // Normalize the data? (not needed for positions)
    0, // Stride (0 means tightly packed)
    0 // Offset in the buffer
  );

  //Draw call (also configure primitive assembly)
  gl.drawArrays(gl.TRIANGLES, 0, 3); // Draw the triangle using the vertex data
  gl.disableVertexAttribArray(vertexPositionAttributeLocation); // Disable the vertex position attribute
}

try {
  helloTriangle();
} catch (e) {
  showError(`Uncaught JavasScript exception: ${e}`);
}
