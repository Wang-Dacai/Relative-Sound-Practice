// 音频文件路径字典
const soundFiles = {
    'C': 'data/sound/c4.mp3',
    'D': 'data/sound/d4.mp3',
    'E': 'data/sound/e4.mp3',
    'F': 'data/sound/f4.mp3',
    'G': 'data/sound/g4.mp3',
    'A': 'data/sound/a4.mp3',
    'B': 'data/sound/b4.mp3'
};

// 音符列表
let notes = Object.keys(soundFiles);
// 随机音符变量
let randomNote = '';
// 游戏进行标志
let gameInProgress = false;
// 当前音频对象
let currentAudio = null;
// 退出标志
let quitFlag = false;

// 事件监听器：开始游戏按钮
document.getElementById('start').addEventListener('click', startGame);
// 事件监听器：提交按钮
document.getElementById('submit').addEventListener('click', submitGuess);
// 事件监听器：退出按钮
document.getElementById('quit').addEventListener('click', quitGame);
// 事件监听器：输入框回车提交
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        submitGuess();
    }
});

/**
 * 播放指定音符的音频文件并添加下划线
 * @param {string} note - 要播放的音符
 * @param {number} duration - 播放持续时间，默认1秒
 */
function playSound(note, duration = 1000) {
    return new Promise(resolve => {
        if (currentAudio) {
            currentAudio.pause();
        }
        currentAudio = new Audio(soundFiles[note]);
        currentAudio.play();
        // 为当前音符添加下划线
        document.getElementById(note).classList.add('underline');
        setTimeout(() => {
            if (quitFlag) {
                resolve();
                return;
            }
            // 播放完成后移除下划线
            document.getElementById(note).classList.remove('underline');
            resolve();
        }, duration);
    });
}

/**
 * 依次播放音阶
 */
async function playScale() {
    for (let note of notes) {
        if (quitFlag) break;
        await playSound(note);
    }
}

/**
 * 开始游戏函数
 */
async function startGame() {
    if (gameInProgress) return;
    gameInProgress = true;
    quitFlag = false; // 重置退出标志
    document.getElementById('start').disabled = true; // 禁用开始游戏按钮
    toggleControls(false); // 禁用控制按钮
    document.getElementById('message').innerText = '正在播放音阶...';
    await playScale();
    if (quitFlag) return;
    await playSound('C');
    if (quitFlag) return;
    randomNote = notes[Math.floor(Math.random() * notes.length)];
    // 播放随机音符，不加下划线
    let audio = new Audio(soundFiles[randomNote]);
    currentAudio = audio;
    audio.play();
    document.getElementById('message').innerText = '请输入你听到的音符:';
    toggleControls(true); // 启用控制按钮
}

/**
 * 提交用户输入并进行判断
 */
function submitGuess() {
    if (!gameInProgress) return;
    gameInProgress = false;
    toggleControls(false); // 禁用控制按钮
    let userInput = document.getElementById('user-input').value.trim().toUpperCase();
    if (userInput === randomNote) {
        document.getElementById('message').innerText = '正确！';
    } else {
        document.getElementById('message').innerText = `错误，正确答案是 ${randomNote}`;
    }
    // 1秒后自动进入下一轮并清空输入框、聚焦
    setTimeout(() => {
        if (quitFlag) return;
        document.getElementById('user-input').value = '';
        document.getElementById('user-input').focus();
        startGame();
    }, 1000);
}

/**
 * 退出游戏函数
 */
function quitGame() {
    quitFlag = true; // 设置退出标志
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    gameInProgress = false;
    document.getElementById('start').disabled = false; // 启用开始游戏按钮
    toggleControls(true); // 启用控制按钮
    document.getElementById('message').innerText = '游戏已退出';
    // 移除所有音符的下划线
    notes.forEach(note => document.getElementById(note).classList.remove('underline'));
}

/**
 * 启用或禁用控制按钮
 * @param {boolean} enable - 是否启用
 */
function toggleControls(enable) {
    document.getElementById('submit').disabled = !enable;
    document.getElementById('user-input').disabled = !enable;
    if (enable) {
        document.getElementById('user-input').focus();
    }
}
