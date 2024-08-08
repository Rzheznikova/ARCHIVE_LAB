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

    function playNextAudio() {
        if (audioFiles.length === 0) return;

        currentAudioIndex = (currentAudioIndex + 1) % audioFiles.length;
        audioPlayer.src = `baseaudio/${audioFiles[currentAudioIndex]}`;
        audioPlayer.play();
    }

    function handleSliderMovement(slider) {
        const currentValue = parseInt(slider.value);
        clearTimeout(stopTimer);
        imageContainer.style.display = 'none';

        stopTimer = setTimeout(() => {
            if (currentValue === previousValue) { // Ползунок остановился
                displayRandomImage();
            }
        }, 500); // Проверка через 500 мс

        previousValue = currentValue;
    }

    let previousValue = 0;
    let stopTimer;

    const horizontalSlider = document.getElementById('horizontalRangeSlider');
    horizontalSlider.addEventListener('input', function() {
        handleSliderMovement(this);
    });

    const verticalSlider = document.getElementById('verticalRangeSlider');
    verticalSlider.addEventListener('input', function() {
        handleSliderMovement(this);
    });

    randomImage.addEventListener('contextmenu', function(event) {
        event.preventDefault(); // Предотвращаем стандартное контекстное меню
        if (audioPlayer.paused) {
            playNextAudio();
        } else {
            audioPlayer.pause();
            playNextAudio();
        }
    });

    // Загружаем случайное изображение при загрузке страницы
    displayRandomImage();

    // Загружаем список аудиофайлов при загрузке страницы
    loadAudioFiles(function(files) {
        audioFiles = files;
    });
};

