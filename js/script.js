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

    const imageContainer = document.getElementById('imageContainer');
    const randomImage = document.getElementById('randomImage');
    const audioPlayer = document.getElementById('audioPlayer');
    let audioFilesBase = [];
    let audioFilesFilter = [];
    let currentAudioIndex = -1;
    let audioEnabled = false;
    let hasInteracted = false; // Флаг для проверки первого взаимодействия
    let playPromise;

    function loadImages(callback) {
        fetch('images.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => callback(data))
            .catch(error => {
                console.error('Error loading images:', error);
                alert('Error loading images.json: ' + error.message);
            });
    }

    function loadAudioFiles(filePath, callback) {
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => callback(data))
            .catch(error => {
                console.error(`Error loading ${filePath}: ` + error.message);
                alert(`Error loading ${filePath}: ` + error.message);
            });
    }

    function getRandomElement(arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    function displayRandomImage() {
        loadImages(function(images) {
            const randomImagePath = `goticheskaya/${getRandomElement(images)}`;
            randomImage.src = randomImagePath;
            imageContainer.style.display = 'block';
        });
    }

    function playRandomAudio(audioFiles) {
        if (audioFiles.length === 0) return;

        currentAudioIndex = Math.floor(Math.random() * audioFiles.length);
        const randomAudioPath = `${audioFiles[currentAudioIndex]}`;
        console.log(`Playing random audio: ${randomAudioPath}`);
        audio
