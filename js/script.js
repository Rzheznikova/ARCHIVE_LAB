window.onload = function() {
    const canvas = document.getElementById('glCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    gl.clearColor(1.0, 1.0, 1.0, 1.0);  // РћС‡РёС‰Р°РµРј Р±РµР»С‹Рј С†РІРµС‚РѕРј
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

    let previousValue = 0;
    let previousTime = Date.now();

    function handleSliderMovement(slider) {
        const currentValue = parseInt(slider.value);
        const currentTime = Date.now();
        const deltaValue = Math.abs(currentValue - previousValue);
        const deltaTime = currentTime - previousTime;

        const speed = deltaValue / deltaTime;

        if (speed === 0) { // Р•СЃР»Рё СЃРєРѕСЂРѕСЃС‚СЊ СЂР°РІРЅР° 0, С‚Рѕ СЃС‡РёС‚Р°РµРј С‡С‚Рѕ РїРѕР»Р·СѓРЅРѕРє РѕСЃС‚Р°РЅРѕРІРёР»СЃСЏ
            loadImages(function(images) {
                const randomImagePath = `goticheskaya/${getRandomImage(images)}`;
                randomImage.src = randomImagePath;
                imageContainer.style.display = 'block';
            });
        } else {
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

    // Р—Р°РіСЂСѓР¶Р°РµРј СЃР»СѓС‡Р°Р№РЅРѕРµ РёР·РѕР±СЂР°Р¶РµРЅРёРµ РїСЂРё Р·Р°РіСЂСѓР·РєРµ СЃС‚СЂР°РЅРёС†С‹
    loadImages(function(images) {
        const randomImagePath = `goticheskaya/${getRandomImage(images)}`;
        randomImage.src = randomImagePath;
        imageContainer.style.display = 'block';
    });
};



