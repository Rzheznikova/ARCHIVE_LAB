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
    let hasInteracted = false; // Флаг для проверки первого взаимодействия
    let playPromise;
    let previousValue = 0;
    let stopTimer;

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
        } else if (horizontalSliderValue > 60 && horizontalSliderValue <= 80) {
        // Используем вертикальный слайдер для выбора папки и файла
        const verticalSliderValue = parseInt(document.getElementById('verticalRangeSlider').value);

        if (verticalSliderValue >= 0 && verticalSliderValue < 19) {
            folderPath = '5kurskurilka';
            filePath = '5kurskurilka/kurilkakurs5.json';
        } else if (verticalSliderValue >= 19 && verticalSliderValue < 36) {
            folderPath = '4kurskurilka';
            filePath = '4kurskurilka/kurilkakurs4.json';
        } else if (verticalSliderValue >= 36 && verticalSliderValue < 53) {
            folderPath = '3kurskurilka';
            filePath = '3kurskurilka/kurilkakurs3.json';
        } else if (verticalSliderValue >= 53 && verticalSliderValue < 70) {
            folderPath = '2kurskurilka';
            filePath = '2kurskurilka/kurilkakurs2.json';
        } else if (verticalSliderValue >= 70 && verticalSliderValue <= 100) {
            folderPath = '1kurskurilka';
            filePath = '1kurskurilka/kurilkakurs1.json';
        }
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

    // Функция для воспроизведения случайного аудио
    function playRandomAudio(audioFiles) {
        if (audioFiles.length === 0) return;

        if (!audioPlayer.paused) {
            stopAudio(); // Останавливаем текущий аудиофайл перед воспроизведением нового
        }

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

    // Функция для остановки аудио
    function stopAudio() {
        if (!audioPlayer.paused) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0; // Сбрасываем текущее воспроизведение на начало
            console.log('Stopping audio');
        }
    }

    // Функция для обработки нажатия кнопки Play/Pause
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

    // Обработчик для управления слайдером и воспроизведением аудио
    function handleSliderMovement(slider, isVertical) {
        const currentValue = parseInt(slider.value);
        clearTimeout(stopTimer);

        if (!isVertical) {
            // Управление изображениями (для горизонтального слайдера 1 и вертикального)
            imageContainer.style.display = 'none';

            stopTimer = setTimeout(() => {
                if (currentValue === previousValue) {
                    displayRandomImage(currentValue);
                }
            }, 500);

            previousValue = currentValue;
        } else if (isAudioEnabled) {
            // Управление музыкой (для горизонтального слайдера 2)
            if (currentValue !== previousValue) {
                // Слайдер двигается - проигрываем аудио из папки filter
                stopAudio(); // Останавливаем текущее воспроизведение
                playRandomAudio(audioFilesFilter);
            }

            stopTimer = setTimeout(() => {
                if (currentValue === previousValue) {
                    // Слайдер остановился - проигрываем аудио из папки baseaudio
                    stopAudio(); // Сначала останавливаем текущее воспроизведение
                    playRandomAudio(audioFilesBase);
                }
            }, 500);

            previousValue = currentValue;
        }
    }

    // Обработчик для горизонтального слайдера 1
    const horizontalSlider = document.getElementById('horizontalRangeSlider');
    horizontalSlider.addEventListener('input', function() {
        handleSliderMovement(this, false);
    });

    // Обработчик для горизонтального слайдера 1
    const horizontalSlider = document.getElementById('horizontalRangeSlider');
    horizontalSlider.addEventListener('input', function() {
    const horizontalSliderValue = parseInt(this.value);
    displayRandomImage(horizontalSliderValue); // Передача значения горизонтального слайдера в функцию
    });

    // Обработчик для вертикального слайдера
    const verticalSlider = document.getElementById('verticalRangeSlider');
    verticalSlider.addEventListener('input', function() {
    const verticalSliderValue = parseInt(this.value);
    console.log(`Vertical slider: ${verticalSliderValue}%`);

    // Повторный вызов displayRandomImage() для обновления при изменении вертикального слайдера
    const horizontalSliderValue = parseInt(horizontalSlider.value);
    if (horizontalSliderValue > 60 && horizontalSliderValue <= 80) {
        displayRandomImage(horizontalSliderValue);
        }
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

    // Функция для позиционирования подписей
    function positionCaptions() {
        const horizontalSlider = document.getElementById('horizontalRangeSlider');
        const captionGoticheskaya = document.getElementById('caption-goticheskaya');
        const captionMasterskaya = document.getElementById('caption-masterskaya');
        const captionBelyiZal = document.getElementById('caption-belyi-zal');
        const captionKurilka = document.getElementById('caption-kurilka');
        const captionIeshcheVsyakoeRaznoe = document.getElementById('caption-i-eshche-vsyakoe-raznoe');

        if (!captionGoticheskaya || !captionMasterskaya || !captionBelyiZal || !captionKurilka || !captionIeshcheVsyakoeRaznoe) {
            console.error("One or more caption elements not found.");
            return;
        }

        const sliderRect = horizontalSlider.getBoundingClientRect();
        const sliderWidth = sliderRect.width;

        const baseX = sliderRect.left + sliderWidth * 0.1;

        captionGoticheskaya.style.left = `${baseX}px`;
        captionMasterskaya.style.left = `${baseX + sliderWidth * 0.2}px`;
        captionBelyiZal.style.left = `${baseX + sliderWidth * 0.4}px`;
        captionKurilka.style.left = `${baseX + sliderWidth * 0.6}px`;
        captionIeshcheVsyakoeRaznoe.style.left = `${baseX + sliderWidth * 0.8}px`;

        const sliderBottom = sliderRect.bottom;
        const windowHeight = window.innerHeight;
        const captionY = (windowHeight + sliderBottom) / 2;

        captionGoticheskaya.style.top = `${captionY}px`;
        captionMasterskaya.style.top = `${captionY}px`;
        captionBelyiZal.style.top = `${captionY}px`;
        captionKurilka.style.top = `${captionY}px`;
        captionIeshcheVsyakoeRaznoe.style.top = `${captionY}px`;
    }
     function positionVerticalCaptions() {
    const verticalSlider = document.getElementById('verticalRangeSlider');
    const horizontalSlider = document.getElementById('horizontalRangeSlider');
    const captions = [
        document.getElementById('caption-course1'),
        document.getElementById('caption-course2'),
        document.getElementById('caption-course3'),
        document.getElementById('caption-course4'),
        document.getElementById('caption-course5')
    ];

    // Проверка наличия всех элементов
    if (!verticalSlider || !horizontalSlider || captions.includes(null)) {
        console.error("One or more required elements not found.");
        return;
    }

    // Получение координат вертикального и горизонтального слайдеров
    const verticalSliderRect = verticalSlider.getBoundingClientRect();
    const horizontalSliderRect = horizontalSlider.getBoundingClientRect();

    // Определение точки пересечения по оси Y - используем верхнюю часть горизонтального слайдера
    const intersectionY = horizontalSliderRect.top;
    console.log("Intersection Y:", intersectionY);

    const sliderHeight = verticalSliderRect.height;

    // Расчет позиций для подписей в соответствии с ТЗ
    captions.forEach((caption, index) => {
        // Позиции: 10%, 30%, 50%, 70%, 90%
        let percentageY = 0.1 + index * 0.2;  // Порядок: 10%, 30%, 50%, 70%, 90%

        // Рассчитываем координату Y для размещения подписи
        const captionY = intersectionY - (sliderHeight * percentageY);

        // Задаем позицию для подписи
        caption.style.top = `${captionY}px`;
        caption.style.left = `${verticalSliderRect.left - 100}px`; // Немного влево от слайдера для читаемости
        caption.style.display = 'block';
        caption.style.zIndex = '10'; // Поднимаем над другими элементами, чтобы было видно

        // Отладочный вывод для проверки
        console.log(`Caption ${index + 1} positioned at: Top = ${captionY}px, Left = ${verticalSliderRect.left - 100}px`);
    });
}
    // Вызов функций позиционирования
    positionCaptions();
    positionVerticalCaptions();

    window.onresize = function() {
        positionCaptions();
        positionVerticalCaptions();
    };
};




