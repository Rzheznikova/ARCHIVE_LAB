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
    let audioFilesBase = [];
    let audioFilesFilter = [];
    let currentAudioIndex = -1;
    let audioEnabled = false;
    let hasInteracted = false; // Флаг для проверки первого взаимодействия
    let playPromise;

    function loadImages(filePath, callback) {
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => callback(data))
            .catch(error => {
                console.error('Error loading images:', error);
                alert('Error loading ' + filePath + ': ' + error.message);
            });
    }

    function loadAudioFiles(filePath, callback) {
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => callback(data))
            .catch(error => {
                console.error('Error loading audio files:', error);
                alert(`Error loading ${filePath}: ` + error.message);
            });
    }

    function getRandomElement(arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    function displayRandomImage(sliderValue) {
    let filePath, folderPath;

    if (sliderValue <= 20) {
        filePath = 'images.json';
        folderPath = 'goticheskaya';
    } else if (sliderValue > 20 && sliderValue <= 40) {
        filePath = 'masterskaya/masterskaya.json';
        folderPath = 'masterskaya';
    } else if (sliderValue > 40 && sliderValue <= 60) {
        filePath = 'beliizal/beliizal.json';
        folderPath = 'beliizal';
    } else if (sliderValue > 60 && sliderValue <= 80) {
        filePath = 'kurilka/kurilka.json';
        folderPath = 'kurilka';
    } else {
        filePath = 'drygoe.json';
        folderPath = 'drygoe';
    }

    loadImages(filePath, function(images) {
        const randomImagePath = `${folderPath}/${getRandomElement(images)}`;
        randomImage.src = randomImagePath;
        imageContainer.style.display = 'block';
    });
    }

    function playRandomAudio(audioFiles) {
        if (audioFiles.length === 0) return;

        currentAudioIndex = Math.floor(Math.random() * audioFiles.length);
        const randomAudioPath = `${audioFiles[currentAudioIndex]}`;
        console.log(`Playing random audio: ${randomAudioPath}`);
        audioPlayer.src = randomAudioPath;

        playPromise = audioPlayer.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Audio is playing');
            }).catch(error => {
                console.error('Error playing audio:', error);
                // Handle the error here if necessary
            });
        }
    }

    function stopAudio() {
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Stopping audio');
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }).catch(error => {
                console.error('Error stopping audio:', error);
            });
        }
    }

    function handleSliderMovement(slider, isVertical) {
        const currentValue = parseInt(slider.value);
        clearTimeout(stopTimer);

        if (!isVertical) {
            imageContainer.style.display = 'none';

            stopTimer = setTimeout(() => {
                if (currentValue === previousValue) { // Ползунок остановился
                    displayRandomImage(currentValue);
                }
            }, 500); // Проверка через 500 мс

            previousValue = currentValue;
        } else if (audioEnabled) {
            if (currentValue !== previousValue) {
                stopAudio();
                playRandomAudio(audioFilesFilter);
            }

            stopTimer = setTimeout(() => {
                if (currentValue === previousValue) { // Ползунок остановился
                    playRandomAudio(audioFilesBase);
                }
            }, 500);

            previousValue = currentValue;
        }
    }

    let previousValue = 0;
    let stopTimer;

    const horizontalSlider = document.getElementById('horizontalRangeSlider');
    horizontalSlider.addEventListener('input', function() {
        if (!hasInteracted) {
            playRandomAudio(audioFilesBase);
            hasInteracted = true;
        }
        handleSliderMovement(this, false);
    });

    const horizontalSlider2 = document.getElementById('horizontalRangeSlider2');
    horizontalSlider2.addEventListener('input', function() {
        if (!hasInteracted) {
            playRandomAudio(audioFilesBase);
            hasInteracted = true;
        }
        handleSliderMovement(this, true); // Теперь горизонтальный слайдер 2 работает как вертикальный
    });

    horizontalSlider2.addEventListener('mousedown', function(event) {
        if (event.button === 0) {  // Левая кнопка мыши
            console.log('Horizontal slider 2 clicked');
            audioEnabled = true;
            if (!hasInteracted) {
                playRandomAudio(audioFilesBase);
                hasInteracted = true;
            }
        }
    });

    horizontalSlider2.addEventListener('mouseup', function(event) {
        if (event.button === 0) {  // Левая кнопка мыши
            console.log('Horizontal slider 2 released');
            handleSliderMovement(this, true);
        }
    });

    horizontalSlider2.addEventListener('mousemove', function(event) {
        if (audioEnabled) {
            console.log('Horizontal slider 2 moved');
            handleSliderMovement(this, true);
        }
    });

    const verticalSlider = document.getElementById('verticalRangeSlider');
    verticalSlider.addEventListener('input', function() {
        handleSliderMovement(this, false); // Вертикальный слайдер теперь управляет только изображениями
    });

    verticalSlider.addEventListener('mousedown', function(event) {
        if (event.button === 0) {  // Левая кнопка мыши
            console.log('Vertical slider clicked');
        }
    });

    verticalSlider.addEventListener('mouseup', function(event) {
        if (event.button === 0) {  // Левая кнопка мыши
            console.log('Vertical slider released');
        }
    });

    verticalSlider.addEventListener('mousemove', function(event) {
        console.log('Vertical slider moved');
    });

    // Загружаем случайное изображение при загрузке страницы
    displayRandomImage(horizontalSlider.value);

    // Загружаем список аудиофайлов из baseaudio при загрузке страницы
    loadAudioFiles('baseaudio.json', function(files) {
        audioFilesBase = files.map(file => `baseaudio/${file}`);
        console.log('Loaded base audio files:', audioFilesBase);
    });

    // Загружаем список аудиофайлов из filter при загрузке страницы
    loadAudioFiles('filter.json', function(files) {
        audioFilesFilter = files.map(file => `filter/${file}`);
        console.log('Loaded filter audio files:', audioFilesFilter);
    });
 });

    // Добавляем функцию для позиционирования подписи
    function positionCaption() {
        const horizontalSlider = document.getElementById('horizontalRangeSlider');
        const caption = document.getElementById('caption');

    // Позиционируем по оси X: 10% от ширины слайдера (центр надписи должен быть на этой точке)
    const sliderRect = horizontalSlider.getBoundingClientRect();
    const sliderWidth = sliderRect.width;
    const captionWidth = caption.offsetWidth;
    const captionX = sliderRect.left + sliderWidth * 0.1 - captionWidth / 2; // Центр надписи на 10% от ширины слайдера
    caption.style.left = `${captionX}px`;

        // Позиционируем по оси Y: Между нижним слайдером и нижней частью экрана
        const sliderBottom = sliderRect.bottom;
        const windowHeight = window.innerHeight;
        const captionY = (windowHeight + sliderBottom) / 2; // середина между слайдером и низом экрана
        caption.style.bottom = `${windowHeight - captionY}px`;
    }

    // Обновляем позицию при загрузке страницы и изменении размера окна
    positionCaption();
    window.onresize = positionCaption;
};
