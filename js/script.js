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

    const horizontalSlider = document.getElementById('horizontalRangeSlider');
    horizontalSlider.addEventListener('input', function() {
        handleSliderMovement(this);
    });

    const audio = new Audio();

    function loadAudios(callback) {
        fetch('baseaudio.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => callback(data))
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
            const randomAudioPath = `audiobase/${getRandomAudio(audios)}`;
            audio.src = randomAudioPath;
            audio.play();
        });
    }

    let verticalPreviousValue = null;
    let verticalStopTimer;

    function handleVerticalSliderMovement(slider) {
        const currentValue = parseInt(slider.value);

        if (verticalPreviousValue !== null && verticalPreviousValue !== currentValue) {
            clearTimeout(verticalStopTimer);

            verticalStopTimer = setTimeout(() => {
                if (currentValue === 0) {
                    playRandomAudio();
                }
            }, 500); // Проверка через 500 мс
        }

        verticalPreviousValue = currentValue;
    }

    const verticalSlider = document.getElementById('verticalRangeSlider');
    verticalSlider.addEventListener('input', function() {
        handleVerticalSliderMovement(this);
    });

    // Загружаем случайное изображение при загрузке страницы
    displayRandomImage();
};

