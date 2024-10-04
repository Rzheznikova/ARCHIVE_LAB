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
    let isAudioEnabled = false; // Отвечает за состояние кнопки Play/Pause
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

    // Обработчик кнопки Play/Pause
    function toggleButton() {
        const button = document.querySelector('.audio-button');
        button.classList.toggle('pause');
        isAudioEnabled = !isAudioEnabled;

        if (isAudioEnabled) {
            // Если включили воспроизведение, запускаем музыку
            playRandomAudio(audioFilesBase);
        } else {
            // Останавливаем воспроизведение, если кнопка в состоянии Pause
            stopAudio();
        }
    }

    // Назначаем обработчик события клика для кнопки
    document.querySelector('.audio-button').addEventListener('click', toggleButton);

    // Обработчик слайдера, который будет менять музыку, если аудио включено
    const horizontalSlider2 = document.getElementById('horizontalRangeSlider2');
    horizontalSlider2.addEventListener('input', function() {
        if (isAudioEnabled) {
            // Переключаем музыку только если кнопка Play активирована
            stopAudio(); // Останавливаем текущее аудио перед воспроизведением следующего
            playRandomAudio(audioFilesFilter);
        }
    });

    // Обработчики других слайдеров
    const horizontalSlider = document.getElementById('horizontalRangeSlider');
    horizontalSlider.addEventListener('input', function() {
        handleSliderMovement(this, false);
    });

    const verticalSlider = document.getElementById('verticalRangeSlider');
    verticalSlider.addEventListener('input', function() {
        handleSliderMovement(this, false); // Вертикальный слайдер теперь управляет только изображениями
    });

    // Остальные обработчики и логика взаимодействия...

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

    // Добавляем функцию для позиционирования всех подписей
    function positionCaptions() {
        // Логика для позиционирования подписей...
    }

    // Обновляем позицию при загрузке страницы и изменении размера окна
    positionCaptions();
    window.onresize = positionCaptions;
};
