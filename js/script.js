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

    function getRandomImage(images) {
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
    }

    function displayRandomImage() {
        loadImages(function(images) {
            const randomImagePath = `goticheskaya/${getRandomImage(images)}`;
            randomImage.src = randomImagePath;
            imageContainer.style.display = 'block';
        });
    }

    function loadAudios(callback) {
        console.log('Attempting to load baseaudio.json');
        fetch('baseaudio.json')
            .then(response => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Audio data loaded:', data);
                callback(data);
            })
            .catch(error => {
                console.error('Error loading audios:', error);
                alert('Error loading baseaudio.json: ' + error.message);
            });
    }

    function getRandomAudio(audios) {
        const randomIndex = Math.floor(Math.random() * audios.length);
        return audios[randomIndex];
    }

    function playRandomAudio() {
        loadAudios(function(audios) {
            const randomAudioPath = `baseaudio/${getRandomAudio(audios)}`;
            console.log('Playing audio:', randomAudioPath);
            const audio = new Audio(randomAudioPath);
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
                alert('Error playing audio: ' + error.message);
            });
        });
    }

    let previousValue = 0;
    let stopTimer;

    function handleSliderMovement(slider) {
        const currentValue = parseInt(slider.value);

        clearTimeout(stopTimer);

        stopTimer = setTimeout(() => {
            displayRandomImage();
        }, 500); // Проверка через 500 мс

        previousValue = currentValue;
    }

    function handleAudioSliderMovement(slider) {
        const currentValue = parseInt(slider.value);

        clearTimeout(stopTimer);

        stopTimer = setTimeout(() => {
            playRandomAudio();
        }, 500); // Проверка через 500 мс

        previousValue = currentValue;
    }

    const horizontalSlider = document.getElementById('horizontalRangeSlider');
    horizontalSlider.addEventListener('input', function() {
        handleSliderMovement(this);
    });

    const verticalSlider = document.getElementById('verticalRangeSlider');
    verticalSlider.addEventListener('input', function() {
        handleAudioSliderMovement(this);
    });

    // Загружаем случайное изображение при загрузке страницы
    displayRandomImage();
};

