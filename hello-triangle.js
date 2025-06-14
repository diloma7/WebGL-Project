function showError(errorText) {
    const erroBoxDiv= document.getElementById('error-box');
    const errorTextElement = document.createElement('p');
    errorTextElement.innerText = errorText;
    erroBoxDiv.appendChild(errorTextElement);
}
showError('This is what an error looks like!');
function helloTriangle() {
    /**@type {HTMLCanvasElement | null}**/
    const canvas = document.getElementById('demo-canvas');
    if (!canvas) {
    showError('Cannot get demo-canvas reference. Check for typos or loading script too early in HTMl');
    return;
    }

    const gl = canvas.getContext('webgl2');
    if (!gl) {
        const isWebGl1Supported = !!canvas.getContext('webgl');
        if (isWebGl1Supported) {
            showError('This browser support WebGl 1 but not WebGL2 - Make sure WebGl 2 isn\'t disabled in your browser.');
        } else {
            showError('This browser does not support WebGl. This demo will not work');
        }
        return;
    }
}

try {
    helloTriangle()
} catch (e) {
    showError(`Uncaught JavasScript exception: ${e}`)
}