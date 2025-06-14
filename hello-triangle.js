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
        showError('This browser does not support WebGl2. This demo will not work');
        return;
    }
}

try {
    helloTriangle()
} catch (e) {
    showError(`Uncaught JavasScript exception: ${e}`)
}