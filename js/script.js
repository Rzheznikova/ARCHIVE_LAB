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

    // Настройка цвета очистки на черный (поменяно на белый для консистентности)
    gl.clearColor(1.0, 1.0, 1.0, 1.0);  // Очищаем белым цветом
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Подключаем слайдеры
    const horizontalSlider = document.getElementById('horizontalRangeSlider');
    const verticalSlider = document.getElementById('verticalRangeSlider');

    // Обработка движения горизонтального слайдера
    horizontalSlider.addEventListener('input', function() {
        console.log('Horizontal slider value:', this.value);
        // Здесь можно добавить дополнительную логику, например, влияющую на WebGL
    });

    // Обработка движения вертикального слайдера
    verticalSlider.addEventListener('input', function() {
        console.log('Vertical slider value:', this.value);
        // Здесь можно добавить дополнительную логику, например, влияющую на WebGL
    });
};
