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

    // Настройка цвета очистки на черный (возможно, вы захотите изменить его)
    gl.clearColor(1.0, 1.0, 1.0, 1.0);  // Очищаем белым цветом для консистентности с фоном
    gl.clear(gl.COLOR_BUFFER_BIT);
};
