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

    let imagesCache = null;

    function loadImages(callback) {
        if (imagesCache) {
            callback(imagesCache);
            return;
        }
        fetch('images.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                imagesCache = data;
                callback(data);
            })
            .catch(error => {
                console.error('Error loading images:', error);
                alert('Error loading images.json: ' + error.message);
            });
    }

    function getRandomImage(images) {
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
    }

    let previousValue = 0;
    let previousTime = Date.now();
    let timeout = null;

    function handleSliderMovement(slider) {
        const currentValue = parseInt(slider.value);
        const currentTime = Date.now();
        const deltaValue = Math.abs(currentValue - previousValue);
        const deltaTime = currentTime - previousTime;

        const speed = deltaValue / deltaTime;

        if (speed === 0) { // Если скорость равна 0, то считаем что ползунок остановился
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                loadImages(function(images) {
                    const randomImagePath = `goticheskaya/${getRandomImage(images)}`;
                    randomImage.src = randomImagePath;
                    imageContainer.style.display = 'block';
                });
            }, 200); // 200 мс задержка для лучшего определения остановки
        } else {
            clearTimeout(timeout);
            imageContainer.style.display = 'none';
        }

        previousValue = currentValue;
        previousTime = currentTime;
    }

    const horizontalSlider = document.getElementById('horizontalRangeSlider');
    horizontalSlider.addEventListener('input', function() {
        handleSliderMovement(this);
    });

    const verticalSlider = document.getElementById('verticalRangeSlider');
    verticalSlider.addEventListener('input', function() {
        handleSliderMovement(this);
    });

    // Загружаем случайное изображение при загрузке страницы
    loadImages(function(images) {
        const randomImagePath = `goticheskaya/${getRandomImage(images)}`;
        randomImage.src = randomImagePath;
        imageContainer.style.display = 'block';
    });
};

