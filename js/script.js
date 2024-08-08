<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Audio and Image Slider</title>
    <style>
        #glCanvas {
            display: block;
        }
        #imageContainer {
            display: none;
        }
    </style>
    <!-- Убедитесь, что путь к favicon правильный или удалите следующую строку, если favicon не требуется -->
    <!-- <link rel="icon" href="path/to/your/favicon.ico"> -->
</head>
<body>
    <canvas id="glCanvas"></canvas>
    <div id="imageContainer">
        <img id="randomImage" alt="Random Image">
    </div>
    <input type="range" id="horizontalRangeSlider" min="0" max="100" value="0">
    <input type="range" id="verticalRangeSlider" min="0" max="100" value="0" orient="vertical">
    <audio id="audioPlayer"></audio>

    <script>
        window.onload = function() {
            const canvas = document.getElementById('glCanvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const gl = canvas.getContext('webgl');

            if (!gl) {
                console.error("Unable to initialize WebGL. Your browser or machine may not support it.");
                return;
            }

            gl.clearColor(1.0, 1.0, 1.0, 1.0);  // Очищаем белым цветом
            gl.clear(gl.COLOR_BUFFER_BIT);

            const imageContainer = document






