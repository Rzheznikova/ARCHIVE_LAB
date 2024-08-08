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
                console.error('Error loading audio files:', error);
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
        audioPlayer.src = randomAudioPath;

        playPromise = audioPlayer.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Audio is playing');
            }).catch(error => {
                console.error('Error playing audio:', error);
                // Handle the error here if necessary
            });
        }
    }

    function stopAudio() {
        if (audioPlayer.src) {
            console.log('Stopping audio');
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        }
    }

    let previousValue = 0;
    let stopTimer;

    const horizontalSlider = document.getElementById('horizontalRangeSlider');
    horizontalSlider.addEventListener('input', function() {
        if (!hasInteracted) {
            playRandomAudio(audioFilesBase);
            hasInteracted = true;
        }
        handleSliderMovement(this, false);
    });

    const verticalSlider = document.getElementById('verticalRangeSlider');
    verticalSlider.addEventListener('input', function() {
        if (!hasInteracted) {
            playRandomAudio(audioFilesBase);
            hasInteracted = true;
        }
    });

    verticalSlider.addEventListener('mousedown', function(event) {
        if (event.button === 0) {  // Левая кнопка мыши
            console.log('Vertical slider clicked');
            audioEnabled = true;
            stopAudio();
            playRandomAudio(audioFilesFilter);
        }
    });

    verticalSlider.addEventListener('mouseup', function(event) {
        if (event.button === 0) {  // Левая кнопка мыши
            console.log('Vertical slider released');
            stopAudio();
            playRandomAudio(audioFilesBase);
        }
    });

    verticalSlider.addEventListener('mousemove', function(event) {
        if (audioEnabled) {
            console.log('Vertical slider moved');
        }
    });

    // Загружаем случайное изображение при загрузке страницы
    displayRandomImage();

    // Загружаем список аудиофайлов из baseaudio при загрузке страницы
    loadAudioFiles('baseaudio.json', function(files) {
        audioFilesBase = files.map(file => `baseaudio/${file}`);
        console.log('Loaded base audio files:', audioFilesBase);
    });

    // Загружаем список аудиофайлов из filter при загрузке страницы
    loadAudioFiles('filter.json', function(files) {
        audioFilesFilter = files.map(file => `filter/${file}`);
        console.log('Loaded filter audio files:', audioFilesFilter);
    });
};
