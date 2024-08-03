window.onload = function() {
    const canvas = document.getElementById('glCanvas');
    // Устанавливаем размер canvas согласно размеру вьюпорта
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    // Настройка цвета очистки на белый
    gl.clearColor(1.0, 1.0, 1.0, 1.0);  // Очищаем белым цветом
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Подключаем слайдеры
    const horizontalSlider = document.getElementById('horizontalRangeSlider');
    const verticalSlider = document.getElementById('verticalRangeSlider');

    // Контейнер для изображения
    const imageContainer = document.getElementById('imageContainer');
    const randomImage = document.getElementById('randomImage');

    // Функция для загрузки JSON файла
    function loadImages(callback) {
        fetch('images.json')
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error('Error loading images:', error));
    }

    // Функция для выбора случайного изображения
    function getRandomImage(images) {
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
    }

    // Обработка остановки горизонтального слайдера
    horizontalSlider.addEventListener('change', function() {
        loadImages(function(images) {
            const randomImagePath = getRandomImage(images);
            randomImage.src = randomImagePath;
            imageContainer.style.display = 'block';
        });
    });

    // Обработка движения вертикального слайдера
    verticalSlider.addEventListener('input', function() {
        console.log('Vertical slider value:', this.value);
        // Дополнительная логика для WebGL (если необходимо)
    });
};
