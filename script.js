document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer-display');
    const statusDisplay = document.getElementById('status-display');
    const studyTimeDisplay = document.getElementById('study-time-display');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const audioUpload = document.getElementById('audio-upload');
    const backgroundMusic = document.getElementById('background-music');
    const workDurationInput = document.getElementById('work-duration');
    const breakDurationInput = document.getElementById('break-duration');

    let timerInterval;
    let isWorking = true;
    let timeInSeconds = 25 * 60;
    let isPaused = true;
    let totalStudyTimeInSeconds = 0; // 累計勉強時間の追跡

    function updateDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    function updateStatus() {
        if (isWorking) {
            statusDisplay.textContent = '📚 勉強中';
            statusDisplay.style.color = '#d9534f';
        } else {
            statusDisplay.textContent = '☕️ 休憩中';
            statusDisplay.style.color = '#5cb85c';
        }
    }

    // 累計勉強時間を更新して表示する関数
    function updateStudyTimeDisplay() {
        const hours = Math.floor(totalStudyTimeInSeconds / 3600);
        const minutes = Math.floor((totalStudyTimeInSeconds % 3600) / 60);
        studyTimeDisplay.textContent = `累計勉強時間: ${String(hours).padStart(2, '0')}時間${String(minutes).padStart(2, '0')}分`;
    }

    function startTimer() {
        if (!isPaused) return;

        isPaused = false;
        backgroundMusic.loop = true;

        timerInterval = setInterval(() => {
            timeInSeconds--;
            
            // 勉強中（isWorkingがtrue）の場合のみ、累計勉強時間を加算
            if (isWorking) {
                totalStudyTimeInSeconds++;
                updateStudyTimeDisplay(); // 累計時間を更新
            }
            
            updateDisplay(timeInSeconds);

            if (timeInSeconds <= 0) {
                isWorking = !isWorking;
                timeInSeconds = (isWorking ? workDurationInput.value : breakDurationInput.value) * 60;
                updateStatus();

                if (isWorking) {
                    if (backgroundMusic.src) {
                        backgroundMusic.play().catch(e => console.log("再生エラー:", e));
                    }
                } else {
                    backgroundMusic.pause();
                    backgroundMusic.currentTime = 0;
                }
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        isPaused = true;
        if (backgroundMusic.src) {
            backgroundMusic.pause();
        }
    }

    function resetTimer() {
        pauseTimer();
        isWorking = true;
        timeInSeconds = workDurationInput.value * 60;
        updateDisplay(timeInSeconds);
        updateStatus();
        if (backgroundMusic.src) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        }
        // リセットボタンが押されたとき、累計勉強時間もリセット
        totalStudyTimeInSeconds = 0;
        updateStudyTimeDisplay();
    }

    startBtn.addEventListener('click', () => {
        startTimer();
        if (backgroundMusic.src && isWorking) {
            backgroundMusic.play().catch(e => console.log("再生エラー:", e));
        }
    });

    pauseBtn.addEventListener('click', () => {
        pauseTimer();
    });

    resetBtn.addEventListener('click', () => {
        resetTimer();
    });

    audioUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            backgroundMusic.src = fileURL;
        }
    });
    
    workDurationInput.addEventListener('change', () => {
        if (isPaused && isWorking) {
            timeInSeconds = workDurationInput.value * 60;
            updateDisplay(timeInSeconds);
        }
    });

    breakDurationInput.addEventListener('change', () => {
        if (isPaused && !isWorking) {
            timeInSeconds = breakDurationInput.value * 60;
            updateDisplay(timeInSeconds);
        }
    });

    updateDisplay(timeInSeconds);
    updateStatus();
    updateStudyTimeDisplay(); // 初期表示
});