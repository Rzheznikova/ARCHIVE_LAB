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
    const audioElement = new Audio();

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

    function loadAudio(callback) {
        fetch('baseaudio.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => callback(data))
            .catch(error => {
                console.error('Error loading audio:', error);
                alert('Error loading baseaudio.json: ' + error.message);
            });
    }

    function getRandomItem(items) {
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    }

    let previousValue = 0;
    let previousTime = Date.now();

    function handleSliderMovement(slider, type) {
        const currentValue = parseInt(slider.value);
        const currentTime = Date.now();
        const deltaValue = Math.abs(currentValue - previousValue);
        const deltaTime = currentTime - previousTime;

        const speed = deltaValue / deltaTime;

        if (speed === 0) { // Если скорость равна 0, то считаем что ползунок остановился
            if (type === 'image') {
                loadImages(function(images) {
                    const randomImagePath = `goticheskaya/${getRandomItem(images)}`;
                    randomImage.src = randomImagePath;
                    imageContainer.style.display = 'block';
                });
            } else if (type === 'audio') {
                loadAudio(function(audios) {
                    const randomAudioPath = `baseaudio/${getRandomItem(audios)}`;
                    audioElement.src = randomAudioPath;
                    audioElement.play();
                });
            }
        } else {
            if (type === 'image') {
                imageContainer.style.display = 'none';
            } else if (type === 'audio') {
                audioElement.pause();
            }
        }

        previousValue = currentValue;
        previousTime = currentTime;
    }

    const horizontalSlider = document.getElementById('horizontalRangeSlider');
    horizontalSlider.addEventListener('input', function() {
        handleSliderMovement(this, 'image');
    });

    const verticalSlider = document.getElementById('verticalRangeSlider');
    verticalSlider.addEventListener('input', function() {
        handleSliderMovement(this, 'audio');
    });

    verticalSlider.addEventListener('mousedown', function() {
        loadAudio(function(audios) {
            const randomAudioPath = `baseaudio/${getRandomItem(audios)}`;
            audioElement.src = randomAudioPath;
            audioElement.play();
        });
    });

    // Загружаем случайное изображение при загрузке страницы
    loadImages(function(images) {
        const randomImagePath = `goticheskaya/${getRandomItem(images)}`;
        randomImage.src = randomImagePath;
        imageContainer.style.display = 'block';
    });
};
