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

    const horizontalSlider = document.getElementById('horizontalRangeSlider');
    const verticalSlider = document.getElementById('verticalRangeSlider');
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
            .catch(error => console.error('Error loading images:', error));
    }

    function getRandomImage(images) {
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
    }

    horizontalSlider.addEventListener('change', function() {
        loadImages(function(images) {
            const randomImagePath = `goticheskaya/${getRandomImage(images)}`;
            randomImage.src = randomImagePath;
            imageContainer.style.display = 'block';
        });
    });

    verticalSlider.addEventListener('input', function() {
        console.log('Vertical slider value:', this.value);
    });
};
