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

            const imageContainer = document.getElementById('imageContainer');
            const randomImage = document.getElementById('randomImage');
            const audioPlayer = document.getElementById('audioPlayer');
            let audioFiles = [];
            let currentAudioIndex = -1;
            let audioEnabled = false;
            let hasInteracted = false; // Флаг для проверки первого взаимодействия

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

            function loadAudioFiles(callback) {
                fetch('baseaudio.json')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => callback(data))
                    .catch(error => {
                        console.error('Error loading audio files:', error);
                        alert('Error loading baseaudio.json: ' + error.message);
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

            function playRandomAudio() {
                if (audioFiles.length === 0) return;

                currentAudioIndex = Math.floor(Math.random() * audioFiles.length);
                const randomAudioPath = `baseaudio/${audioFiles[currentAudioIndex]}`;
                console.log(`Playing random audio: ${randomAudioPath}`);
                audioPlayer.src = randomAudioPath;

                let playPromise = audioPlayer.play();

                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('Audio is playing');
                    }).catch(error => {
                        console.error('Error playing audio:', error);
                        alert('Error playing audio: ' + error.message);
                    });
                }
            }

            function stopAudio() {
                console.log('Stopping audio');
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }

            function handleSliderMovement(slider, isVertical) {
                const currentValue = parseInt(slider.value);
                clearTimeout(stopTimer);

                if (!isVertical) {
                    imageContainer.style.display = 'none';

                    stopTimer = setTimeout(() => {
                        if (currentValue === previousValue) { // Ползунок остановился
                            displayRandomImage();
                        }
                    }, 500); // Проверка через 500 мс

                    previousValue = currentValue;
                } else if (audioEnabled) {
                    if (currentValue !== previousValue) {
                        console.log('Slider moving, changing audio');
                        stopAudio();
                        playRandomAudio();
                    }
                    previousValue = currentValue;
                }
            }

            let previousValue = 0;
            let stopTimer;

            const horizontalSlider = document.getElementById('horizontalRangeSlider');
            horizontalSlider.addEventListener('input', function() {
                if (!hasInteracted) {
                    playRandomAudio();
                    hasInteracted = true;
                }
                handleSliderMovement(this, false);
            });

            const verticalSlider = document.getElementById('verticalRangeSlider');
            verticalSlider.addEventListener('input', function() {
                if (!hasInteracted) {
                    playRandomAudio();
                    hasInteracted = true;
                }
                handleSliderMovement(this, true);
            });

            verticalSlider.addEventListener('mousedown', function(event) {
                if (event.button === 0) {  // Левая кнопка мыши
                    console.log('Vertical slider clicked');
                    audioEnabled = true;
                    if (!hasInteracted) {
                        playRandomAudio();
                        hasInteracted = true;
                    }
                }
            });

            verticalSlider.addEventListener('mouseup', function(event) {
                if (event.button === 0) {  // Левая кнопка мыши
                    console.log('Vertical slider released');
                    handleSliderMovement(this, true);
                }
            });

            verticalSlider.addEventListener('mousemove', function(event) {
                if (audioEnabled) {
                    console.log('Vertical slider moved');
                    handleSliderMovement(this, true);
                }
            });

            // Загружаем случайное изображение при загрузке страницы
            displayRandomImage();

            // Загружаем список аудиофайлов при загрузке страницы
            loadAudioFiles(function(files) {
                audioFiles = files;
                console.log('Loaded audio files:', audioFiles);
            });
        };
    </script>
</body>
</html>


