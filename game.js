// ============================================================
//  🦁 狮跃·高桩  -  完整游戏逻辑（连招模式）
//  Miss 直接继续下一个动作，得 0 分
// ============================================================
// ============================================================
//  加载管理
// ============================================================

// 需要加载的资源列表
const ASSETS_TO_LOAD = [
    'images/lion_idle.png',
    'images/combo1_1.png',
    'images/combo1_2.png',
    'images/combo1_3.png',
    'images/combo2_1.png',
    'images/combo2_2.png',
    'images/combo2_3.png',
    'images/combo2_4.png',
    'images/combo3_1.png',
    'images/combo3_2.png',
    'images/combo3_3.png',
    'images/combo4_1.png',
    'images/combo4_2.png',
    'images/combo4_3.png',
    'images/combo5_1.png',
    'images/combo5_2.png',
    'images/combo5_3.png',
    'images/combo5_4.png',
    'images/combo6_1.png',
    'images/combo6_2.png',
    'images/combo6_3.png',
    'images/combo6_4.png',
    'images/combo7_1.png',
    'images/combo7_2.png',
    'images/combo7_3.png',
    'images/combo7_4.png',
    'images/combo7_5.png',
    'images/combo8_1.png',
    'images/combo8_2.png',
    'images/combo8_3.png',
    'images/combo8_4.png',
    'images/combo8_5.png',
    'images/2.png',
    'images/lingnan-pattern.png',
];

let loadedCount = 0;
let totalAssets = ASSETS_TO_LOAD.length;

function loadAllAssets() {
    const loadingBar = document.getElementById('loadingBar');
    const loadingText = document.getElementById('loadingText');
    const loadingScreen = document.getElementById('loadingScreen');

    if (!loadingBar) return;

    ASSETS_TO_LOAD.forEach(function(src) {
        const img = new Image();
        img.onload = function() {
            loadedCount++;
            updateProgress(loadingBar, loadingText, loadingScreen);
        };
        img.onerror = function() {
            loadedCount++;
            updateProgress(loadingBar, loadingText, loadingScreen);
        };
        img.src = src;
    });
}

function updateProgress(loadingBar, loadingText, loadingScreen) {
    const pct = Math.min(100, Math.round((loadedCount / totalAssets) * 100));
    loadingBar.style.width = pct + '%';
    loadingText.textContent = '加载中... ' + pct + '%';

    if (loadedCount >= totalAssets) {
        // ✅ 新增：先显示游戏容器
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.classList.add('loaded');
        
        // 延迟 500ms 后隐藏加载页（等待淡入动画完成）
        setTimeout(function() {
            loadingScreen.classList.add('hidden');
        }, 500);
    }
}

// 页面加载完后开始加载资源
document.addEventListener('DOMContentLoaded', function() {
    loadAllAssets();
});
// ===== 配置 =====
const CONFIG = {
    perfectTime: 300,
    greatTime: 550,
    goodTime: 800,
    maxHealth: 5,
    cultureInterval: 10000,
    chargeDuration: 800,
    chargeTimeout: 1200,
    minSwipeDist: 20,
    // 🔥 蓄力判定：PERFECT 在 75% 位置
    perfectTarget: 75,        // PERFECT 目标位置（竖线）
    perfectRange: 5,          // ±5% 内算 PERFECT（70-80%）
    greatRange: 15,           // ±15% 内算 GREAT（60-90%）
    goodRange: 25,            // ±25% 内算 GOOD（50-100%）
};

// ===== 文化知识库 =====
const CULTURE_DATA = [
    '佛山醒狮起源于明代，已有500多年历史',
    '"采青"寓意"生财"，是春节最受欢迎的表演',
    '醒狮分为刘备狮(黄)、关羽狮(红)、张飞狮(黑)',
    '醒狮鼓点有"三星""七星"等不同节奏型',
    '佛山"狮王争霸"是醒狮界的最高荣誉赛事',
    '高桩表演桩高最高可达3米，难度极高',
    '"金鸡独立"是高桩醒狮最高难度动作之一',
    '佛山醒狮2006年入选国家级非物质文化遗产',
    '醒狮"采青"中的"青"原指生菜，寓意生机',
    '醒狮动作融合了南派武术的步法',
];

// ===== 动作数据（8种） =====
const ACTION_DATA = {
    up_single: {
        name: '左跃起势',
        frames: ['蓄力', '腾空', '落桩'],
        culture: '寓意勇往直前，气势如虹',
        dir: 'up',
        type: 'single',
        difficulty: 1,
        gesture: '向上滑动',
        step: '在圆环内向上滑动'
    },
    down_single: {
        name: '右跃采青',
        frames: ['俯身', '探取', '得青'],
        culture: '寓意招财纳福，吉祥如意',
        dir: 'down',
        type: 'single',
        difficulty: 1,
        gesture: '向下滑动',
        step: '在圆环内向下滑动'
    },
    left_single: {
        name: '左顾回望',
        frames: ['回眸', '转身', '守桩'],
        culture: '寓意眼观六路，机敏警觉',
        dir: 'left',
        type: 'single',
        difficulty: 1,
        gesture: '向左滑动',
        step: '在圆环内向左滑动'
    },
    right_single: {
        name: '右盼守势',
        frames: ['侧身', '回旋', '稳桩'],
        culture: '寓意耳听八方，沉着冷静',
        dir: 'right',
        type: 'single',
        difficulty: 1,
        gesture: '向右滑动',
        step: '在圆环内向右滑动'
    },
    charge_hold: {
        name: '蓄力爆发',
        frames: ['蓄力', '爆发', '腾空'],
        culture: '寓意厚积薄发，一鸣惊人',
        dir: 'center',
        type: 'charge_hold',
        difficulty: 2,
        gesture: '按住蓄力，看准时机松手',
        step: '按住圆环中央蓄力，在完美时机松手'
    },
    stop: {
        name: '金鸡独立',
        frames: ['悬空', '平衡', '亮相'],
        culture: '寓意气定神闲，处变不惊',
        dir: 'center',
        type: 'stop',
        difficulty: 3,
        gesture: '点击中心',
        step: '点击圆环中心'
    },
    spin: {
        name: '回旋探青',
        frames: ['蓄力', '旋转', '探青'],
        culture: '寓意扭转乾坤，化险为夷',
        dir: 'center',
        type: 'spin',
        difficulty: 4,
        gesture: '画V',
        step: '在圆环内画V'
    },
    double: {
        name: '双狮戏珠',
        frames: ['双狮', '齐跃', '戏珠'],
        culture: '寓意好事成双，团结协作',
        dir: 'center',
        type: 'double',
        difficulty: 4,
        gesture: '双指触摸',
        step: '两根手指同时触摸圆环'
    },
};

// ===== 连招数据（8套，固定顺序） =====
const COMBO_DATA = [
    {
        id: 0,
        name: '起势入门',
        culture: '「起势」是醒狮表演的开场动作，寓意"好的开始是成功的一半"。佛山醒狮讲究"起势定输赢"，起势做得稳，整场表演才有底气。',
        actions: ['up_single', 'down_single', 'stop'],
        frames: ['初醒', '起势', '独立'],
        emojis: ['🦁', '🦁', '🦁']
    },
    {
        id: 1,
        name: '四方巡桩',
        culture: '「巡桩」是高桩表演中的经典套路，狮子在桩上巡视四方，寓意"眼观六路，耳听八方"，展现狮子的机敏与警觉。',
        actions: ['up_single', 'down_single', 'left_single', 'right_single'],
        frames: ['左望', '右盼', '巡桩'],
        emojis: ['🦁', '🦁', '🦁']
    },
    {
        id: 2,
        name: '蓄力爆发',
        culture: '「蓄力爆发」对应醒狮中的"顿足"动作，狮子猛然发力，气势磅礴。醒狮讲究"蓄劲如张弓，发劲如放箭"，蓄得越深，爆发越强。',
        actions: ['charge_hold', 'up_single', 'down_single'],
        frames: ['蓄力', '爆发', '跃桩'],
        emojis: ['🦁', '🦁', '🦁']
    },
    {
        id: 3,
        name: '定桩回旋',
        culture: '「金鸡独立」是高桩醒狮最高难度动作之一，狮子单脚悬停桩上，寓意"定力如山"。佛山醒狮有"桩上定乾坤"之说，立得稳，方能行得远。',
        actions: ['stop', 'spin', 'stop'],
        frames: ['定桩', '回旋', '归位'],
        emojis: ['🦁', '🦁', '🦁']
    },
    {
        id: 4,
        name: '双狮巡桩',
        culture: '「双狮」表演考验两头狮子的默契与配合，寓意"同心协力，团结协作"。春节醒狮中常有双狮采青，代表"好事成双""双喜临门"。',
        actions: ['double', 'up_single', 'down_single', 'double'],
        frames: ['双狮', '并行', '同心'],
        emojis: ['🦁', '🦁', '🦁']
    },
    {
        id: 5,
        name: '连环三桩',
        culture: '「连环踏桩」是醒狮高桩表演的精华，狮子在桩间连续跳跃，寓意"步步高升，节节胜利"。三桩代表"三星高照"，福禄寿齐聚。',
        actions: ['up_single', 'charge_hold', 'down_single', 'spin'],
        frames: ['一桩', '二桩', '三桩'],
        emojis: ['🦁', '🦁', '🦁']
    },
    {
        id: 6,
        name: '群桩之王',
        culture: '这是综合难度最高的连招，集齐了全部五种手势。寓意"王者风范，统御四方"。佛山"狮王争霸"的最高荣誉，正是颁给这样的全能狮队。',
        actions: ['up_single', 'double', 'charge_hold', 'spin', 'stop'],
        frames: ['王者', '震桩', '定桩'],
        emojis: ['🦁', '🦁', '🦁']
    },
    {
        id: 7,
        name: '采青归巢',
        culture: '「采青」是醒狮表演的最高潮，狮子跃起"采"下悬挂的生菜（"青"），寓意"生财""生机"。佛山醒狮有"采青归巢，福满人间"之说。',
        actions: ['charge_hold', 'double', 'spin', 'stop', 'charge_hold'],
        frames: ['采青', '得青', '归巢'],
        emojis: ['🦁', '🦁', '🦁']
    }
];

// ===== 教学顺序（8步） =====
const TUTORIAL_ORDER = [
    'up_single', 'down_single', 'left_single', 'right_single',
    'charge_hold', 'stop', 'spin', 'double'
];

// ===== 游戏状态 =====
const state = {
    mode: 'tutorial',
    score: 0,
    combo: 0,
    maxCombo: 0,
    health: CONFIG.maxHealth,
    totalNotes: 0,
    hitNotes: 0,
    perfectCount: 0,
    greatCount: 0,
    goodCount: 0,
    missCount: 0,
    totalReaction: 0,
    reactionCount: 0,
    isPlaying: false,
    isComicShowing: false,
    currentNote: null,
    isWaitingForInput: false,
    isProcessing: false,
    noteTimeout: null,
    spawnTimer: null,
    cultureTimer: null,
    healthRegenTimer: null,
    survivalTime: 0,
    timerInterval: null,
    learnedActions: new Set(),
    difficultyLevel: 1,
    lastDifficultyToast: 1,
    tutorialIndex: 0,
    tutorialCompleted: new Set(),
    tutorialDone: false,
    isWaitingRetry: false,
    isCharging: false,
    chargeStartTime: 0,
    chargeProgress: 0,
    chargeReady: false,
    chargeFired: false,
    chargeAnimFrame: null,
    chargeTimeoutTimer: null,
    noteAppearTime: 0,
    currentActionType: null,
    // 连招模式状态
    comboMode: false,
    currentComboIndex: 0,
    currentActionIndex: 0,
    comboScore: 0,
    comboTotal: 0,
    comboPerfect: 0,
    comboGreat: 0,
    comboGood: 0,
    comboMiss: 0,
    comboResults: [],
    comboStarted: false,
    waitingForNext: false,
    forceSkip: false,
};

// ============================================================
//  滑动反馈变量
// ============================================================
var lastSwipeDir = null;
var swipeFeedbackTimer = null;
// ===== DOM引用 =====
const $ = (id) => document.getElementById(id);
const startScreen = $('startScreen');
const gameScreen = $('gameScreen');
const tutorialBtn = $('tutorialBtn');
const endlessBtn = $('endlessBtn');
const retryBtn = $('retryBtn');
const homeBtn = $('homeBtn');
const lionWrapper = $('lionWrapper');
const ringBg = $('ringBg');
const notesContainer = $('notesContainer');
const scoreDisplay = $('scoreDisplay');
const comboDisplay = $('comboDisplay');
const healthDisplay = $('healthDisplay');
const phaseDisplay = $('phaseDisplay');
const timerDisplay = $('timerDisplay');
const progressFill = $('progressFill');
const cultureText = $('cultureText');
const judgeText = $('judgeText');
const reactionDisplay = $('reactionDisplay');
const resultOverlay = $('resultOverlay');
const resultTitle = $('resultTitle');
const finalScore = $('finalScore');
const finalCombo = $('finalCombo');
const finalAccuracy = $('finalAccuracy');
const finalReaction = $('finalReaction');
const finalTime = $('finalTime');
const finalActions = $('finalActions');
const resultActions = $('resultActions');
const comicOverlay = $('comicOverlay');
const comicCulture = $('comicCulture');
const comicFrames = document.querySelectorAll('.comic-frame');
const difficultyToast = $('difficultyToast');
const tutorialCard = $('tutorialCard');
const tutoProgress = $('tutoProgress');
const tutoName = $('tutoName');
const tutoGesture = $('tutoGesture');
const tutoStep = $('tutoStep');
const tutoStatus = $('tutoStatus');
const tutoRetry = $('tutoRetry');
const chargeRing = $('chargeRing');
const chargeBarContainer = $('chargeBarContainer');
const chargeBarFill = $('chargeBarFill');
const chargeLabel = $('chargeLabel');
const chargeRipple = $('chargeRipple');
const tapPulse = $('tapPulse');
const spinOrbit = $('spinOrbit');
const doubleRings = $('doubleRings');
const comicNextBtn = $('comicNextBtn');
const comicScoreDisplay = $('comicScoreDisplay');

const dirHints = {
    up: $('dirUp'),
    down: $('dirDown'),
    left: $('dirLeft'),
    right: $('dirRight'),
};

// ============================================================
//  工具函数
// ============================================================
function getActionKey(dir, type) {
    if (type === 'stop') return 'stop';
    if (type === 'spin') return 'spin';
    if (type === 'double') return 'double';
    if (type === 'charge_hold') return 'charge_hold';
    return dir + '_single';
}

function getNoteDisplay(dir, type) {
    if (type === 'charge_hold') return { text: '蓄力', sub: '按住', dirClass: 'center' };
    if (type === 'stop') return { text: '急停', sub: '点击', dirClass: 'center' };
    if (type === 'spin') return { text: '旋转', sub: '画V', dirClass: 'center' };
    if (type === 'double') return { text: '双狮', sub: '双指', dirClass: 'center' };
    if (type === 'single') {
        const dirMap = { up: '上', down: '下', left: '左', right: '右' };
        return { text: dirMap[dir] + '跃', sub: '滑动', dirClass: dir };
    }
    return { text: '?', sub: '', dirClass: 'center' };
}

function getDirClass(dir) { return dir === 'center' ? 'center' : dir; }

function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(Math.floor(seconds % 60)).padStart(2, '0');
    return m + ':' + s;
}

function getDirectionFromPoint(cx, cy, clientX, clientY) {
    const dx = clientX - cx;
    const dy = clientY - cy;
    if (Math.abs(dx) > Math.abs(dy)) {
        return dx > 0 ? 'right' : 'left';
    } else {
        return dy > 0 ? 'down' : 'up';
    }
}

// ============================================================
//  音效
// ============================================================
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playTone(freq, duration, vol) {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.value = vol || 0.08;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    } catch (e) {}
}

function playDrum() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 120;
        osc.type = 'sine';
        gain.gain.value = 0.04;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.06);
    } catch (e) {}
}

function playSuccess() {
    playTone(880, 0.1, 0.06);
    setTimeout(() => playTone(1100, 0.08, 0.05), 80);
}

function playFail() {
    playTone(280, 0.15, 0.06);
}

function playChargeTick(progress) {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 150 + progress * 300;
        osc.type = 'sine';
        gain.gain.value = 0.015;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
}

function playChargeReady() {
    playTone(660, 0.12, 0.07);
    setTimeout(() => playTone(880, 0.1, 0.06), 100);
}

// ============================================================
//  粒子 + 涟漪
// ============================================================
function spawnParticles(color, count, x, y) {
    const container = document.getElementById('gameContainer');
    const rect = container.getBoundingClientRect();
    
    let cx = x;
    let cy = y;
    
     if (cx === undefined || cy === undefined) {
        // 🔥 从圆环中心爆发
        const ring = document.getElementById('ringArea');
        const ringRect = ring.getBoundingClientRect();
        cx = ringRect.left - rect.left + ringRect.width / 2;
        cy = ringRect.top - rect.top + ringRect.height / 2;
    }

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = 3 + Math.random() * 6;
        const angle = Math.random() * 2 * Math.PI;
        const dist = 40 + Math.random() * 100;
        
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        
        p.style.cssText = `
            left: ${cx}px;
            top: ${cy}px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, ${color}, ${color}66);
            box-shadow: 0 0 ${size * 2}px ${color};
            --tx: ${tx}px;
            --ty: ${ty}px;
        `;
        container.appendChild(p);
        setTimeout(() => p.remove(), 800);
    }
}

function createRipple(clientX, clientY) {
    const container = document.getElementById('gameContainer');
    const rect = container.getBoundingClientRect();
    const ripple = document.createElement('div');
    ripple.className = 'touch-ripple';
    ripple.style.left = ((clientX - rect.left) / rect.width * 100) + '%';
    ripple.style.top = ((clientY - rect.top) / rect.height * 100) + '%';
    container.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// ============================================================
//  动效控制函数
// ============================================================
function hideAllEffects() {
    for (const key in dirHints) {
        if (dirHints[key]) dirHints[key].classList.remove('active');
    }
    chargeRipple.classList.remove('show');
    tapPulse.classList.remove('show');
    spinOrbit.classList.remove('show');
    doubleRings.classList.remove('show');
    clearVEffect();
}

function showEffectForAction(action) {
    hideAllEffects();
    if (!action) return;

    const type = action.type;
    const dir = action.dir;

    if (type === 'single' && dir && dir !== 'center') {
        if (dirHints[dir]) {
            dirHints[dir].classList.add('active');
        }
        return;
    }

    switch (type) {
        case 'charge_hold':
            chargeRipple.classList.add('show');
            break;
        case 'stop':
            tapPulse.classList.add('show');
            break;
        case 'spin':
    // 🔥 显示画V粒子动效（替代之前的画圈）
    showVEffect();
    break;
        case 'double':
            doubleRings.classList.add('show');
            break;
        default:
            break;
    }
}
// ============================================================
//  画V提示 - 单点沿V形路径移动
// ============================================================

var vEffectTimer = null;
var vEffectDot = null;
var vEffectAnimId = null;

function showVEffect() {
    // 清除之前的特效
    clearVEffect();
    
    const container = document.getElementById('gameContainer');
    const rect = container.getBoundingClientRect();
    
    // 🔥 获取圆环的位置
    const ring = document.getElementById('ringArea');
    const ringRect = ring.getBoundingClientRect();
    
    // 圆环中心（相对于 container）
    const centerX = ringRect.left - rect.left + ringRect.width / 2;
    const centerY = ringRect.top - rect.top + ringRect.height / 2;
    
    // 圆环半径（取宽高较小值的一半）
    const ringRadius = Math.min(ringRect.width, ringRect.height) / 2;
    
    // V 形的范围限制在圆环内（半径的 65%）
    const vSize = ringRadius * 0.65;
    
    // 创建光点
    const dot = document.createElement('div');
    dot.className = 'v-dot';
    dot.style.cssText = `
        position: absolute;
        left: ${centerX - vSize}px;
        top: ${centerY - vSize * 0.6}px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #FFD700;
        pointer-events: none;
        z-index: 4;
        box-shadow: 0 0 20px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.2);
        opacity: 0;
        transition: none;
    `;
    container.appendChild(dot);
    vEffectDot = dot;
    
    // 显示 "画 V" 文字
    showVEffectText();
    
    // 开始沿V形路径移动
    let startTime = Date.now();
    const duration = 1200;
    
    function animateDot() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        
        let x, y;
        if (progress < 0.5) {
            // 🔥 V 的左半段：从左上到最低点（中心偏下）
            const p = progress / 0.5;
            x = centerX - vSize * (1 - p * 0.7);
            y = centerY - vSize * 0.6 + p * vSize * 0.9;
        } else {
            // 🔥 V 的右半段：从最低点到右上
            const p = (progress - 0.5) / 0.5;
            x = centerX + vSize * p * 0.7;
            y = centerY - vSize * 0.6 + (1 - p * 0.4) * vSize * 0.9;
        }
        
        const glowSize = 20 + Math.sin(progress * Math.PI) * 10;
        dot.style.cssText = `
            position: absolute;
            left: ${x - 5}px;
            top: ${y - 5}px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #FFD700;
            pointer-events: none;
            z-index: 4;
            box-shadow: 0 0 ${glowSize}px rgba(255, 215, 0, 0.6), 0 0 ${glowSize * 2}px rgba(255, 215, 0, 0.15);
            opacity: 0.9;
        `;
        
        if (progress < 1) {
            vEffectAnimId = requestAnimationFrame(animateDot);
        } else {
            vEffectTimer = setTimeout(function() {
                clearVEffect();
                showVEffect();
            }, 500);
        }
    }
    
    setTimeout(function() {
        if (dot) {
            dot.style.opacity = '1';
            animateDot();
        }
    }, 300);
}

function showVEffectText() {
    var text = document.getElementById('vEffectText');
    if (!text) {
        text = document.createElement('div');
        text.id = 'vEffectText';
        text.style.cssText = `
            position: absolute;
            top: 42%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: rgba(255, 215, 0, 0.2);
            font-size: 16px;
            letter-spacing: 4px;
            z-index: 4;
            pointer-events: none;
            font-family: 'STKaiti', 'KaiTi', serif;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        text.textContent = '✎ 画 V';
        document.getElementById('gameContainer').appendChild(text);
    }
    text.style.opacity = '1';
    setTimeout(function() {
        if (text) text.style.opacity = '0';
    }, 1800);
}

function clearVEffect() {
    if (vEffectTimer) {
        clearTimeout(vEffectTimer);
        vEffectTimer = null;
    }
    if (vEffectAnimId) {
        cancelAnimationFrame(vEffectAnimId);
        vEffectAnimId = null;
    }
    if (vEffectDot && vEffectDot.parentNode) {
        vEffectDot.remove();
        vEffectDot = null;
    }
    var text = document.getElementById('vEffectText');
    if (text) text.remove();
}

// ============================================================
//  连招模式核心函数
// ============================================================

function getCurrentCombo() {
    if (state.currentComboIndex >= COMBO_DATA.length) return null;
    return COMBO_DATA[state.currentComboIndex];
}

function getCurrentAction() {
    const combo = getCurrentCombo();
    if (!combo) return null;
    if (state.currentActionIndex >= combo.actions.length) return null;
    const actionKey = combo.actions[state.currentActionIndex];
    return ACTION_DATA[actionKey];
}

// ============================================================
//  漫画弹窗 - 大图版
// ============================================================

// ============================================================
//  漫画弹窗 - 方案A（33张连招专属图片）
// ============================================================

let sliderCurrentIndex = 0;
let sliderTotalItems = 0;

// 手势符号映射
var GESTURE_MAP = {
    'up': '⬆',
    'down': '⬇',
    'left': '⬅',
    'right': '➡'
};
var TYPE_MAP = {
    'stop': '⏹',
    'spin': '◇',
    'double': '⬡',
    'charge_hold': '●'
};
var ACTION_TEXT_MAP = {
    'single': { up: '向上滑动', down: '向下滑动', left: '向左滑动', right: '向右滑动' },
    'charge_hold': '按住蓄力',
    'stop': '点击中心',
    'spin': '画V',
    'double': '双指触摸'
};

// ===== 显示弹窗 =====
function showComboComplete() {
    var combo = getCurrentCombo();
    if (!combo) return;

    state.isComicShowing = true;
    state.waitingForNext = true;

    var actionKeys = combo.actions;
    var totalActions = actionKeys.length;
    sliderTotalItems = totalActions;

    // 🔥 当前连招索引（0~7）
    var comboIndex = state.currentComboIndex;

    // 更新标题 + 评分
    document.getElementById('comicTitle').textContent =  combo.name + ' 完成！';
    document.getElementById('comicScoreValue').textContent = state.comboScore;
    document.getElementById('comicCulture').textContent = combo.culture;
    
    
    // 生成所有图片卡片
    var container = document.getElementById('sliderItems');
    container.innerHTML = '';

    actionKeys.forEach(function(key, index) {
        var action = ACTION_DATA[key];
        if (!action) return;

        var item = document.createElement('div');
        item.className = 'slider-item';
        if (index === 0) item.classList.add('active');
        if (index < state.currentActionIndex) item.classList.add('completed');

        // 🔥 方案A：combo索引从1开始，步骤从1开始
        // 格式：combo1_1.png, combo1_2.png, combo2_1.png ...
        var imgSrc = 'images/combo' + (comboIndex + 1) + '_' + (index + 1) + '.png';
        
        // 备用图片（如果专属图片不存在，回退到通用图）
        var fallbackSrc = 'images/comic-' + ((index % 3) + 1) + '.png';

        item.innerHTML = `
    <div class="comic-img-wrapper">
        <div class="comic-loading">加载中...</div>
        <img src="${imgSrc}" 
             alt="${action.name}" 
             class="comic-img"
             style="display:none;"
             onload="this.style.display='block'; this.previousElementSibling.style.display='none';"
             onerror="this.src='${fallbackSrc}'; this.style.display='block'; this.previousElementSibling.style.display='none';" />
    </div>
`;

        container.appendChild(item);
    });

    // 重置索引
    sliderCurrentIndex = 0;
    updateSlider();
    updateActionInfo(0);

    // 更新按钮
    if (state.currentComboIndex >= COMBO_DATA.length - 1) {
        document.querySelector('#comicOverlay .comic-next-btn').textContent = '狮王加冕！';
    } else {
        document.querySelector('#comicOverlay .comic-next-btn').textContent = '继续挑战 →';
    }

    comicOverlay.className = 'show';
    updateSliderButtons();
}

// ===== 更新动作解释 =====
function updateActionInfo(index) {
    var combo = getCurrentCombo();
    if (!combo) return;

    var actionKeys = combo.actions;
    if (index >= actionKeys.length) return;

    var key = actionKeys[index];
    var action = ACTION_DATA[key];
    if (!action) return;

    // 手势符号
    var gestureSymbol = action.dir === 'center' ? 
        (TYPE_MAP[action.type] || '⏹') : 
        (GESTURE_MAP[action.dir] || '•');

    // 动作文字
    var actionText = '';
    if (action.type === 'single') {
        actionText = ACTION_TEXT_MAP.single[action.dir] || '滑动';
    } else {
        actionText = ACTION_TEXT_MAP[action.type] || '操作';
    }

    document.getElementById('actionGesture').textContent = gestureSymbol + ' ' + actionText;
    document.getElementById('actionName').textContent = action.name;
    document.getElementById('actionDesc').textContent = action.culture || '';

    // 高亮当前卡片
    var items = document.querySelectorAll('.slider-item');
    items.forEach(function(item, i) {
        item.classList.toggle('active', i === index);
    });
}

// ===== 滑动控制 =====
function updateSlider() {
    var track = document.getElementById('sliderItems');
    var offset = -sliderCurrentIndex * 100;
    track.style.transform = 'translateX(' + offset + '%)';

    updateDots();
    updateSliderButtons();
    updateActionInfo(sliderCurrentIndex);
}

function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= sliderTotalItems) index = sliderTotalItems - 1;
    if (index === sliderCurrentIndex) return;
    sliderCurrentIndex = index;
    updateSlider();
}

function prevSlide() {
    if (sliderCurrentIndex > 0) goToSlide(sliderCurrentIndex - 1);
}

function nextSlide() {
    if (sliderCurrentIndex < sliderTotalItems - 1) goToSlide(sliderCurrentIndex + 1);
}

// ===== 指示器圆点 =====
function updateDots() {
    var dotsContainer = document.getElementById('sliderDots');
    dotsContainer.innerHTML = '';
    
    for (var i = 0; i < sliderTotalItems; i++) {
        var dot = document.createElement('span');
        dot.className = 'dot';
        if (i === sliderCurrentIndex) dot.classList.add('active');
        if (i < state.currentActionIndex) dot.classList.add('completed');
        dotsContainer.appendChild(dot);
    }
}

function updateSliderButtons() {
    var prevBtn = document.getElementById('sliderPrev');
    var nextBtn = document.getElementById('sliderNext');
    
    prevBtn.classList.toggle('disabled', sliderCurrentIndex <= 0);
    nextBtn.classList.toggle('disabled', sliderCurrentIndex >= sliderTotalItems - 1);
}

// 滚动按钮控制
function updateScrollButtons() {
    var track = document.getElementById('comicScrollTrack');
    var leftBtn = document.getElementById('scrollLeftBtn');
    var rightBtn = document.getElementById('scrollRightBtn');
    
    if (!track || !leftBtn || !rightBtn) return;
    
    var scrollLeft = track.scrollLeft;
    var maxScroll = track.scrollWidth - track.clientWidth;
    
    leftBtn.classList.toggle('disabled', scrollLeft <= 1);
    rightBtn.classList.toggle('disabled', scrollLeft >= maxScroll - 1);
}

// 滚动事件绑定
document.addEventListener('DOMContentLoaded', function() {
    var track = document.getElementById('comicScrollTrack');
    var leftBtn = document.getElementById('scrollLeftBtn');
    var rightBtn = document.getElementById('scrollRightBtn');
    
    if (track) {
        track.addEventListener('scroll', updateScrollButtons);
    }
    if (leftBtn) {
        leftBtn.addEventListener('click', function() {
            if (track) track.scrollBy({ left: -200, behavior: 'smooth' });
        });
    }
    if (rightBtn) {
        rightBtn.addEventListener('click', function() {
            if (track) track.scrollBy({ left: 200, behavior: 'smooth' });
        });
    }
});

function nextCombo() {
    comicOverlay.className = '';
    state.isComicShowing = false;
    state.waitingForNext = false;

    state.currentComboIndex++;

    if (state.currentComboIndex >= COMBO_DATA.length) {
        // 🔥 进度条走满
        progressFill.style.width = '100%';
        setTimeout(function() {
            endGame();
        }, 300);
        return;
    }
    state.currentActionIndex = 0;
    state.comboScore = 0;
    state.comboTotal = 0;
    state.comboPerfect = 0;
    state.comboGreat = 0;
    state.comboGood = 0;
    state.comboMiss = 0;

    updateUI();

    setTimeout(function() {
        if (state.isPlaying && state.mode === 'endless') {
            showComboAction();
        }
    }, 400);
}

function showComboAction() {
    if (state.isComicShowing || state.waitingForNext) return;

    var combo = getCurrentCombo();
    if (!combo) {
        endGame();
        return;
    }

    if (state.currentActionIndex >= combo.actions.length) {
        showComboComplete();
        return;
    }

    var action = getCurrentAction();
    if (!action) {
        state.currentActionIndex++;
        showComboAction();
        return;
    }

    var comboName = combo.name;
    var actionNum = state.currentActionIndex + 1;
    var totalActions = combo.actions.length;

    phaseDisplay.textContent = '连招：' + comboName;
    tutoProgress.textContent = actionNum + ' / ' + totalActions;
    tutoName.textContent = action.name;
    tutoGesture.textContent = action.gesture;
    tutoStep.textContent = action.step || '操作';
    tutoStatus.className = 'tuto-card-status waiting';
    tutoStatus.textContent = '等待操作...';
    tutoRetry.className = 'tuto-card-retry';
    tutorialCard.classList.add('show');

    if (state.currentNote && state.currentNote.el) {
        state.currentNote.el.remove();
    }
    state.currentNote = null;
    state.isWaitingForInput = false;

    clearChargeUI();
    hideAllEffects();

    setTimeout(function() {
        if (state.isPlaying && state.mode === 'endless' && state.comboMode) {
            showNote(action);
        }
    }, 200);
}

// ============================================================
//  音符显示与判定
// ============================================================
function showNote(action) {
    if (!state.isPlaying || state.isComicShowing || state.health <= 0) return;
    if (state.mode === 'tutorial' && state.tutorialDone) return;
    if (!action) return;

    var actionKey = getActionKey(action.dir, action.type);
    var comboIndex = state.currentComboIndex;
    var stepIndex = state.currentActionIndex;
    
    // ============================================================
    //  🔥 方案B：教学模式根据动作类型映射图片
    // ============================================================
    var lionImg = document.getElementById('lionImg');
    var actionImgSrc;

    if (state.mode === 'tutorial') {
        // 教学模式：根据动作类型匹配已有图片
        var imgMap = {
            'up_single': 'combo1_1.png',      // 左跃起势
            'down_single': 'combo1_2.png',    // 右跃采青
            'left_single': 'combo2_3.png',    // 左顾回望
            'right_single': 'combo2_4.png',   // 右盼守势
            'charge_hold': 'combo3_1.png',    // 蓄力爆发
            'stop': 'combo4_1.png',           // 金鸡独立
            'spin': 'combo8_3.png',           // 回旋探青
            'double': 'combo5_4.png',         // 双狮戏珠
        };
        actionImgSrc = 'images/' + (imgMap[actionKey] || 'lion_idle.png');
    } else {
        // 连招模式：使用 comboX_X.png
        actionImgSrc = 'images/combo' + (comboIndex + 1) + '_' + (stepIndex + 1) + '.png';
    }

    // 先添加入场特效class
    lionImg.className = 'lion-img action-enter';

    // 加载并切换图片
    var img = new Image();
    img.onload = function() {
        lionImg.src = actionImgSrc;
        // 添加方向特效class
        var actionDir = action.dir || 'center';
        var dirClass = 'action-' + (action.type === 'charge_hold' ? 'charge' : actionDir);
        lionImg.className = 'lion-img action-enter ' + dirClass;
        // 移除入场动画class（让后续操作可以重新触发）
        setTimeout(function() {
            lionImg.classList.remove('action-enter');
        }, 400);
    };
    img.onerror = function() {
    // 图片不存在，保持待机（只执行一次，防止无限循环）
    lionImg.onerror = null;  // 🔥 清除 onerror 防止循环
    lionImg.src = 'images/lion_idle.png';
    lionImg.className = 'lion-img';
};
    img.src = actionImgSrc;

    // 蓄力状态特殊处理
    if (action.type === 'charge_hold') {
        lionImg.className = 'lion-img action-charge';
    }

    // ===== 显示音符 =====
    var display = getNoteDisplay(action.dir, action.type);
    var dirClass = getDirClass(action.dir);

    notesContainer.innerHTML = '';

    var el = document.createElement('div');
    el.className = 'note-in-ring dir-' + dirClass;
    el.innerHTML = '<span class="note-text">' + display.text + '</span><span class="note-sub">' + display.sub + '</span>';
    notesContainer.appendChild(el);

    requestAnimationFrame(function() {
        el.classList.add('show');
        el.classList.add('pulsing');
    });
     

    state.currentNote = {
        el: el,
        actionKey: getActionKey(action.dir, action.type),
        action: action,
        appearTime: performance.now(),
        judged: false,
        dirClass: dirClass,
    };

    state.isWaitingForInput = true;
    state.isWaitingRetry = false;
    state.noteAppearTime = performance.now();

    state.isCharging = false;
    state.chargeReady = false;
    state.chargeFired = false;
    state.chargeProgress = 0;
    clearChargeUI();

    showEffectForAction(action);

    var timeoutTime;
    if (action.type === 'spin' || action.type === 'charge_hold') {
        timeoutTime = 3000;
    } else {
        timeoutTime = CONFIG.goodTime + 300;
    }

    if (state.noteTimeout) clearTimeout(state.noteTimeout);
    state.noteTimeout = setTimeout(function() {
        if (state.currentNote && !state.currentNote.judged && state.isWaitingForInput) {
            if (state.mode === 'tutorial') {
                showTutorialFail();
            } else if (state.mode === 'endless' && state.comboMode) {
                comboMissRetry();
            } else {
                missNote();
            }
        }
    }, timeoutTime);

    playDrum();

    if (action.type === 'charge_hold') {
        chargeLabel.textContent = '按住蓄力';
        chargeLabel.classList.add('show');
    }
    
}

// ============================================================
//  连招判定（Miss 直接继续下一个动作，得 0 分）
// ============================================================
function judgeComboAction(direction, gestureType) {
    if (!state.isPlaying || state.isProcessing) return;
    if (!state.currentNote || state.currentNote.judged) return;
    if (state.isWaitingRetry) return;
    if (state.waitingForNext) return;

    var note = state.currentNote;
    var action = note.action;

    if (action.type === 'charge_hold') return;

    var matched = false;

    if (action.type === 'single' && gestureType === 'single') {
        if (action.dir === direction) matched = true;
    } else if (action.dir === 'center') {
        if (action.type === 'stop' && gestureType === 'tap') matched = true;
        else if (action.type === 'spin' && gestureType === 'spin') matched = true;
        else if (action.type === 'double' && gestureType === 'double') matched = true;
    }

    if (!matched) {
        comboMissRetry();
        return;
    }

    // 标记音符已判定
    state.currentNote.judged = true;
    hideAllEffects();
    state.isWaitingForInput = false;
    state.isProcessing = true;
    clearChargeUI();

    if (state.noteTimeout) clearTimeout(state.noteTimeout);

    state.learnedActions.add(note.actionKey);

    // ============================================================
    //  🎯 反应速度判分 + 判定（放宽版）
    // ============================================================
    var now = performance.now();
    var reactionTime = now - state.noteAppearTime;

    // 得分率：900ms 归零，线性连续
    var maxTime = 900;
    var scoreRate = Math.max(0, 1 - (reactionTime / maxTime));

    var combo = getCurrentCombo();
    var totalActions = combo ? combo.actions.length : 1;
    var baseScore = 100 / totalActions;
    var finalPoints = Math.round(baseScore * scoreRate);

    // 判定标签（宽松区间）
    var quality = reactionTime < 350 ? 'perfect' :
                  reactionTime < 600 ? 'great' :
                  reactionTime < 900 ? 'good' : 'miss';

    // 累加得分（只有 not miss 才累加）
    state.comboScore += finalPoints;
    state.comboTotal += 100;

    // 全局分数
    state.score += finalPoints;
    state.combo++;
    if (state.combo > state.maxCombo) state.maxCombo = state.combo;
    state.hitNotes++;
    state.totalReaction += reactionTime;
    state.reactionCount++;

    removeNote();
    updateUI();

    // 显示判定 + 得分
    var labels = {
        perfect: 'PERFECT',
        great: 'GREAT',
        good: 'GOOD',
        miss: '❌ MISS'
    };
    var colors = {
        perfect: 'perfect',
        great: 'great',
        good: 'good',
        miss: 'miss'
    };

    if (quality !== 'miss') {
        judgeText.textContent = labels[quality] + '  ⚡' + Math.round(reactionTime) + 'ms  +' + finalPoints + '分';
        judgeText.className = 'show ' + colors[quality];
        setTimeout(function() {
            judgeText.className = '';
        }, 700);

        // 粒子特效
        var particleColor = quality === 'perfect' ? '#FFD700' : quality === 'great' ? '#00FF88' : '#3498DB';
        spawnParticles(particleColor, 12);
        playTone(quality === 'perfect' ? 880 : quality === 'great' ? 660 : 520, 0.08, 0.05);
        // 🔥 spin（画V）判定成功后，清理画V特效
if (action.type === 'spin') {
    clearVEffect();
}
        
    } else {
        finalPoints = 0;
        judgeText.textContent = '❌ MISS ';
        judgeText.className = 'show miss';
        setTimeout(function() {
            judgeText.className = '';
        }, 700);
        spawnParticles('#FF4444', 8);
        playFail();
    }

    state.isProcessing = false;
    

    // 进入下一个动作
    state.currentActionIndex++;
    var combo2 = getCurrentCombo();
    if (combo2 && state.currentActionIndex >= combo2.actions.length) {
        setTimeout(function() {
            if (state.isPlaying && state.mode === 'endless') {
                showComboComplete();
            }
        }, 300);
    } else {
        setTimeout(function() {
            if (state.isPlaying && state.mode === 'endless' && !state.isComicShowing) {
                showComboAction();
            }
        }, 400);
    }
}

// ============================================================
//  Miss 处理：直接继续下一个动作，得 0 分（不重试）
// ============================================================
function comboMissRetry() {
    if (!state.currentNote || state.currentNote.judged) return;

    if (state.noteTimeout) {
        clearTimeout(state.noteTimeout);
        state.noteTimeout = null;
    }
    if (state.chargeAnimFrame) {
        cancelAnimationFrame(state.chargeAnimFrame);
        state.chargeAnimFrame = null;
    }

    state.currentNote.judged = true;
    state.isWaitingForInput = false;
    state.isWaitingRetry = false;
    state.isCharging = false;
    state.isProcessing = false;

    clearChargeUI();
    hideAllEffects();

    state.missCount++;
    state.totalNotes++;

    // ============================================================
    //  🎯 Miss 得 0 分，总分上限 +100
    // ============================================================
    state.comboScore += 0;
    state.comboTotal += 100;

    // 显示 Miss 反馈
    var statusEl = document.getElementById('tutoStatus');
    if (statusEl) {
        statusEl.className = 'tuto-card-status fail';
        statusEl.textContent = '✕ MISS';
        setTimeout(function() {
            if (statusEl) {
                statusEl.className = 'tuto-card-status waiting';
                statusEl.textContent = '等待操作...';
            }
        }, 500);
    }

    lionWrapper.className = 'lion-miss';
   
    setTimeout(function() { lionWrapper.className = 'lion-idle'; }, 300);

    ringBg.className = 'active-miss';
    setTimeout(function() { ringBg.className = ''; }, 300);

    playFail();

    if (state.currentNote && state.currentNote.el) {
        state.currentNote.el.classList.remove('pulsing');
        state.currentNote.el.classList.add('fading');
        setTimeout(function() {
            if (state.currentNote && state.currentNote.el) {
                state.currentNote.el.remove();
            }
        }, 150);
    }
    state.currentNote = null;

    // 直接进入下一个动作
    state.currentActionIndex++;
    var combo = getCurrentCombo();
    if (combo && state.currentActionIndex >= combo.actions.length) {
        setTimeout(function() {
            if (state.isPlaying && state.mode === 'endless') {
                showComboComplete();
            }
        }, 400);
    } else {
        setTimeout(function() {
            if (state.isPlaying && state.mode === 'endless' && !state.isComicShowing) {
                showComboAction();
            }
        }, 400);
    }
}

// ============================================================
//  蓄力系统
// ============================================================
function startCharge() {
    if (state.isCharging || state.isProcessing || !state.isWaitingForInput) return;
    if (!state.currentNote || state.currentNote.judged) return;
    if (state.currentNote.action.type !== 'charge_hold') return;

    state.isCharging = true;
    state.chargeStartTime = performance.now();
    state.chargeProgress = 0;
    state.chargeReady = false;
    state.chargeFired = false;

    chargeRing.classList.add('show');
    chargeRing.style.width = '0%';
    chargeBarContainer.classList.add('show');
    chargeBarFill.style.width = '0%';
    chargeLabel.textContent = '蓄力中...';
    chargeLabel.classList.add('show');
    chargeLabel.classList.remove('charged');
    ringBg.className = 'charging';
    lionWrapper.className = 'lion-squat';
    // 🔥 切换为蓄力动作图
var lionImg = document.getElementById('lionImg');
var comboIndex = state.currentComboIndex;
var stepIndex = state.currentActionIndex;
var testImg = new Image();
testImg.onload = function() {
    lionImg.src = 'images/combo' + (comboIndex + 1) + '_' + (stepIndex + 1) + '.png';
    lionImg.className = 'lion-img action-charge';
};
testImg.onerror = function() {
    // 如果蓄力图不存在，用待机图
    lionImg.src = 'images/lion_idle.png';
    lionImg.className = 'lion-img';
};
testImg.src = 'images/combo' + (comboIndex + 1) + '_' + (stepIndex + 1) + '.png';

    hideAllEffects();
    chargeRipple.classList.add('show');

    if (state.chargeAnimFrame) cancelAnimationFrame(state.chargeAnimFrame);
    updateChargeProgress();
}

function updateChargeProgress() {
    if (!state.isCharging) return;

    var elapsed = performance.now() - state.chargeStartTime;
    state.chargeProgress = Math.min(100, (elapsed / CONFIG.chargeDuration) * 100);

    var pct = state.chargeProgress;
    chargeRing.style.width = (pct * 0.8) + '%';
    chargeBarFill.style.width = pct + '%';

    // ===== 蓄力达到80%时提示 =====
    if (pct >= 80 && pct < 85 && !state.chargeReady) {
        state.chargeReady = true;
        chargeBarFill.style.background = 'linear-gradient(90deg, #FFD700, #FF6B35)';
        chargeLabel.textContent = '松手！';
        playChargeReady();
        spawnParticles('#FFD700', 6);
    }

    if (pct >= 100) {
        state.isCharging = false;
        state.chargeFired = true;
        clearChargeUI();
        if (state.mode === 'tutorial') {
            showTutorialFail();
        } else if (state.mode === 'endless' && state.comboMode) {
            comboMissRetry();
        } else {
            if (state.currentNote && !state.currentNote.judged) {
                missNote();
            }
        }
        return;
    }

    state.chargeAnimFrame = requestAnimationFrame(updateChargeProgress);
}

function releaseCharge() {
    if (!state.isCharging || state.chargeFired) return;
    if (!state.currentNote || state.currentNote.judged) return;

    state.isCharging = false;
    state.chargeFired = true;

    var progress = state.chargeProgress;
    clearChargeUI();

    // ============================================================
    //  🔥 新判定：PERFECT 在 75% 位置，根据距离判分
    // ============================================================
    var target = CONFIG.perfectTarget;  // 75
    var distance = Math.abs(progress - target);  // 距离目标竖线的百分比差

    var quality = 'miss';
    var finalPoints = 0;

    // 判定品质
    if (distance <= CONFIG.perfectRange) {
        quality = 'perfect';
    } else if (distance <= CONFIG.greatRange) {
        quality = 'great';
    } else if (distance <= CONFIG.goodRange) {
        quality = 'good';
    } else {
        quality = 'miss';
    }

    // 计算得分：距离越近分越高（0-100%）
    var maxDist = CONFIG.goodRange;  // 25
    var scoreRate = Math.max(0, 1 - (distance / maxDist));
    // 保底10%，防止得分太低
    scoreRate = Math.max(0.1, scoreRate);

    var combo = getCurrentCombo();
    var totalActions = combo ? combo.actions.length : 1;
    var baseScore = 100 / totalActions;
    finalPoints = Math.round(baseScore * scoreRate);

    // 保证至少1分
    if (finalPoints < 1 && quality !== 'miss') finalPoints = 1;

    if (quality === 'miss') {
        finalPoints = 0;
        if (state.mode === 'tutorial') {
            showTutorialFail();
        } else if (state.mode === 'endless' && state.comboMode) {
            comboMissRetry();
        } else {
            missNote();
        }
        return;
    }

    judgeChargeNote(quality, finalPoints);
}

function judgeChargeNote(quality) {
    if (!state.currentNote || state.currentNote.judged) return;

    state.currentNote.judged = true;
    hideAllEffects();
    state.isWaitingForInput = false;
    state.isProcessing = true;

    if (state.noteTimeout) clearTimeout(state.noteTimeout);

    state.learnedActions.add(state.currentNote.actionKey);

    if (state.mode === 'tutorial') {
        handleTutorialSuccess();
        removeNote();
        updateUI();
        state.isProcessing = false;
        return;
    }

    if (state.mode === 'endless' && state.comboMode) {
        // ============================================================
        //  🔥 PERFECT 在 75% 位置（一条竖线），根据距离判分
        // ============================================================
        var progress = state.chargeProgress;
        var perfectTarget = 75;  // PERFECT 竖线位置
        var distance = Math.abs(progress - perfectTarget);  // 距离竖线的百分比差

        // ===== 判定品质 =====
        var quality2 = 'miss';
if (distance <= 3) {        // ±3% → PERFECT（原来是 ±5%）
    quality2 = 'perfect';
} else if (distance <= 10) { // ±10% → GREAT（原来是 ±15%）
    quality2 = 'great';
} else if (distance <= 20) { // ±20% → GOOD（原来是 ±25%）
    quality2 = 'good';
} else {
    quality2 = 'miss';
}

        // ===== 计算得分（距离越近分越高） =====
        var combo = getCurrentCombo();
        var totalActions = combo ? combo.actions.length : 1;
        var baseScore = 100 / totalActions;

        var scoreRate = Math.max(0, 1 - (distance / 20));  // 25% 外得分为0
        scoreRate = Math.max(0.1, scoreRate);  // 保底10%
        var finalPoints = Math.round(baseScore * scoreRate);
        if (finalPoints < 1 && quality2 !== 'miss') finalPoints = 1;

        // ===== 累加得分 =====
        if (quality2 !== 'miss') {
            state.comboScore += finalPoints;
            state.score += finalPoints;
            state.combo++;
            if (state.combo > state.maxCombo) state.maxCombo = state.combo;
            state.hitNotes++;
        } else {
            finalPoints = 0;
        }
        state.comboTotal += 100;

        var reactionTime = performance.now() - state.noteAppearTime;
        state.totalReaction += reactionTime;
        state.reactionCount++;

        removeNote();
        updateUI();

        // ===== 显示判定 + 得分 =====
        var labels = {
            perfect: '✦ PERFECT ✦',
            great: '★ GREAT ★',
            good: '● GOOD ●',
            miss: '✕ MISS'
        };
        var colors = {
            perfect: 'perfect',
            great: 'great',
            good: 'good',
            miss: 'miss'
        };

        if (quality2 !== 'miss') {
            judgeText.textContent = labels[quality2]  + Math.round(progress) + '%  ' + distance.toFixed(1) + '%  +' + finalPoints + '分';
            judgeText.className = 'show ' + colors[quality2];
            setTimeout(function() {
                judgeText.className = '';
            }, 700);

            var particleColor = quality2 === 'perfect' ? '#FFD700' : quality2 === 'great' ? '#00FF88' : '#3498DB';
            spawnParticles(particleColor, 12);
            playTone(quality2 === 'perfect' ? 880 : quality2 === 'great' ? 660 : 520, 0.08, 0.05);
        } else {
            judgeText.textContent = '✕ MISS ';
            judgeText.className = 'show miss';
            setTimeout(function() {
                judgeText.className = '';
            }, 700);
            spawnParticles('#FF4444', 8);
            playFail();
        }

        state.isProcessing = false;
      
        state.currentActionIndex++;
        var combo2 = getCurrentCombo();
        if (combo2 && state.currentActionIndex >= combo2.actions.length) {
            setTimeout(function() {
                if (state.isPlaying && state.mode === 'endless') {
                    showComboComplete();
                }
            }, 300);
        } else {
            setTimeout(function() {
                if (state.isPlaying && state.mode === 'endless' && !state.isComicShowing) {
                    showComboAction();
                }
            }, 400);
        }
        return;
    }

    // 普通模式（教学/无尽旧版）保持原样
    var points = quality === 'perfect' ? 100 : quality === 'great' ? 70 : 40;
    var comboBonus = 1 + state.combo * 0.02;
    state.score += Math.round(points * comboBonus);
    state.combo++;
    state.hitNotes++;
    if (state.combo > state.maxCombo) state.maxCombo = state.combo;
    if (quality === 'perfect') state.perfectCount++;
    else if (quality === 'great') state.greatCount++;
    else state.goodCount++;

    var reactionTime = performance.now() - state.noteAppearTime;
    state.totalReaction += reactionTime;
    state.reactionCount++;

    removeNote();
    updateUI();

    showJudgeFeedback(quality, reactionTime);
    showRingFeedback(quality);
    animateLion('center', 'charge_hold', quality);

    if (quality === 'perfect' || quality === 'great') {
        showComic(state.currentNote ? state.currentNote.actionKey : 'charge_hold', quality);
    }

    if (quality === 'perfect') {
        spawnParticles('#00FF88', 18);
        playSuccess();
    } else if (quality === 'great') {
        spawnParticles('#FFD700', 10);
        playTone(660, 0.08, 0.05);
    } else {
        spawnParticles('#3498DB', 5);
        playTone(520, 0.06, 0.04);
    }

    state.isProcessing = false;

    if (state.mode === 'endless' && !state.comboMode) {
        scheduleNextNote();
    }
}

function cancelCharge() {
    if (!state.isCharging || state.chargeFired) return;
    state.isCharging = false;
    clearChargeUI();

    if (state.mode === 'tutorial') {
        showTutorialFail();
    } else if (state.mode === 'endless' && state.comboMode) {
        comboMissRetry();
    } else {
        if (state.currentNote && !state.currentNote.judged) {
            missNote();
        }
    }
}

function clearChargeUI() {
    if (state.chargeAnimFrame) cancelAnimationFrame(state.chargeAnimFrame);
    if (state.chargeTimeoutTimer) clearTimeout(state.chargeTimeoutTimer);

    chargeRing.classList.remove('show', 'charged');
    chargeRing.style.width = '0%';
    chargeBarContainer.classList.remove('show');
    chargeBarFill.style.width = '0%';
    chargeLabel.classList.remove('show', 'charged');
    chargeBarFill.style.background = 'linear-gradient(90deg, #3498DB, #F1C40F, #E74C3C)';
    ringBg.className = '';

    state.chargeAnimFrame = null;
    state.chargeTimeoutTimer = null;
}

// ============================================================
//  教学模式
// ============================================================
function startTutorial() {
    state.mode = 'tutorial';
    state.tutorialIndex = 0;
    state.tutorialCompleted = new Set();
    state.tutorialDone = false;
    state.learnedActions = new Set();
    state.health = CONFIG.maxHealth;
    state.score = 0;
    state.combo = 0;
    state.maxCombo = 0;
    state.totalNotes = 0;
    state.hitNotes = 0;
    state.perfectCount = 0;
    state.greatCount = 0;
    state.goodCount = 0;
    state.missCount = 0;
    state.totalReaction = 0;
    state.reactionCount = 0;
    state.survivalTime = 0;
    state.isWaitingRetry = false;
    state.isCharging = false;
    state.comboMode = false;
    clearChargeUI();

    startScreen.style.display = 'none';
    gameScreen.style.display = 'flex';
    resultOverlay.style.display = 'none';

    phaseDisplay.textContent = '教学模式';
    timerDisplay.textContent = '00:00';
    progressFill.style.width = '0%';

    tutorialCard.classList.add('show');

    showTutorialStep();
    startCultureBar();
    state.isPlaying = true;
}

function showTutorialStep() {
     isChecking = false;
    isCheckCompleted = false;
    checkPath = [];
    if (state.tutorialIndex >= TUTORIAL_ORDER.length) {
        finishTutorial();
        return;
    }

    var actionKey = TUTORIAL_ORDER[state.tutorialIndex];
    var action = ACTION_DATA[actionKey];
    if (!action) {
        state.tutorialIndex++;
        showTutorialStep();
        return;
    }

    tutoProgress.textContent = (state.tutorialIndex + 1) + ' / ' + TUTORIAL_ORDER.length;
    tutoName.textContent = action.name;
    tutoGesture.textContent = action.gesture;
    tutoStep.textContent = action.step || '操作';
    tutoStatus.className = 'tuto-card-status waiting';
    tutoStatus.textContent = '等待操作...';
    tutoRetry.className = 'tuto-card-retry';
    state.isWaitingRetry = false;

    notesContainer.innerHTML = '';
    state.currentNote = null;
    state.isWaitingForInput = false;
    state.isCharging = false;
    clearChargeUI();
    hideAllEffects();

    if (state.noteTimeout) clearTimeout(state.noteTimeout);

    setTimeout(function() {
        if (state.isPlaying && state.mode === 'tutorial' && !state.tutorialDone) {
            showNote(ACTION_DATA[actionKey]);
        }
    }, 400);

    var pct = (state.tutorialIndex / TUTORIAL_ORDER.length) * 100;
    progressFill.style.width = pct + '%';
}

function showTutorialFail() {
    isChecking = false;
    isCheckCompleted = false;
    checkPath = [];
    if (!state.currentNote || state.currentNote.judged) return;
    if (state.isWaitingRetry) return;

    state.currentNote.judged = true;
    state.isWaitingForInput = false;
    state.isWaitingRetry = true;
    state.isCharging = false;
    clearChargeUI();
    hideAllEffects();

    if (state.noteTimeout) clearTimeout(state.noteTimeout);

    tutoStatus.className = 'tuto-card-status fail';
    tutoStatus.textContent = '再试一次';
    tutoRetry.className = 'tuto-card-retry show';

    lionWrapper.className = 'lion-miss';
    setTimeout(function() { lionWrapper.className = 'lion-idle'; }, 300);

    ringBg.className = 'active-miss';
    setTimeout(function() { ringBg.className = ''; }, 300);

    playFail();

    if (state.currentNote && state.currentNote.el) {
        state.currentNote.el.classList.remove('pulsing');
        state.currentNote.el.classList.add('fading');
        setTimeout(function() {
            if (state.currentNote && state.currentNote.el) {
                state.currentNote.el.remove();
            }
        }, 150);
    }
    state.currentNote = null;

    state.isProcessing = false;
}

function retryTutorialStep() {
    if (state.tutorialDone || state.tutorialIndex >= TUTORIAL_ORDER.length) return;
    if (!state.isWaitingRetry) return;

    state.isWaitingRetry = false;
    tutoRetry.className = 'tuto-card-retry';
    tutoStatus.className = 'tuto-card-status waiting';
    tutoStatus.textContent = '等待操作...';
    ringBg.className = '';
    lionWrapper.className = 'lion-idle';
    state.isCharging = false;
    clearChargeUI();
    hideAllEffects();

    notesContainer.innerHTML = '';
    state.currentNote = null;
    state.isWaitingForInput = false;
    if (state.noteTimeout) clearTimeout(state.noteTimeout);

    var actionKey = TUTORIAL_ORDER[state.tutorialIndex];
    var action = ACTION_DATA[actionKey];
    if (!action) {
        state.tutorialIndex++;
        showTutorialStep();
        return;
    }

    setTimeout(function() {
        if (state.isPlaying && state.mode === 'tutorial' && !state.tutorialDone) {
            showNote(action);
        }
    }, 300);
}

function handleTutorialSuccess() {
    if (state.tutorialDone) return;

    var actionKey = TUTORIAL_ORDER[state.tutorialIndex];
    state.tutorialCompleted.add(actionKey);
    state.learnedActions.add(actionKey);

    tutoStatus.className = 'tuto-card-status success';
    tutoStatus.textContent = '完美！';
    tutoRetry.className = 'tuto-card-retry';
    state.isWaitingRetry = false;

    spawnParticles('#00FF88', 12);
    playSuccess();

    state.tutorialIndex++;

    if (state.tutorialIndex >= TUTORIAL_ORDER.length) {
        state.tutorialDone = true;
        setTimeout(function() { finishTutorial(); }, 600);
    } else {
        setTimeout(function() {
            if (state.isPlaying && state.mode === 'tutorial') {
                showTutorialStep();
            }
        }, 500);
    }
}

function finishTutorial() {
    state.tutorialDone = true;
    tutorialCard.classList.remove('show');
    notesContainer.innerHTML = '';
    clearChargeUI();
    hideAllEffects();

    if (state.currentNote) {
        if (state.currentNote.el) state.currentNote.el.remove();
        state.currentNote = null;
    }
    if (state.noteTimeout) clearTimeout(state.noteTimeout);

    judgeText.textContent = '✦ 出师 ✦';
    judgeText.className = 'show perfect';
    setTimeout(function() {
        judgeText.className = '';
    }, 1500);

    spawnParticles('#FFD700', 30);

    setTimeout(function() {
        startEndlessMode(true);
    }, 1000);
}

// ============================================================
//  连招模式
// ============================================================
function startEndlessMode(fromTutorial) {
    state.mode = 'endless';
    state.comboMode = true;
    state.isPlaying = true;
    state.tutorialDone = false;
    state.currentComboIndex = 0;
    state.currentActionIndex = 0;
    state.comboScore = 0;
    state.comboTotal = 0;
    state.comboPerfect = 0;
    state.comboGreat = 0;
    state.comboGood = 0;
    state.comboMiss = 0;
    state.waitingForNext = false;

    tutorialCard.classList.remove('show');
    clearChargeUI();
    state.isCharging = false;
    hideAllEffects();

    if (!fromTutorial) {
        state.score = 0;
        state.combo = 0;
        state.maxCombo = 0;
        state.health = CONFIG.maxHealth;
        state.totalNotes = 0;
        state.hitNotes = 0;
        state.perfectCount = 0;
        state.greatCount = 0;
        state.goodCount = 0;
        state.missCount = 0;
        state.totalReaction = 0;
        state.reactionCount = 0;
        state.survivalTime = 0;
        state.learnedActions = new Set();

        startScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        resultOverlay.style.display = 'none';
        notesContainer.innerHTML = '';
        if (state.currentNote) {
            if (state.currentNote.el) state.currentNote.el.remove();
            state.currentNote = null;
        }
        if (state.noteTimeout) clearTimeout(state.noteTimeout);
        if (state.spawnTimer) clearTimeout(state.spawnTimer);
    }

    phaseDisplay.textContent = '连招挑战';
    timerDisplay.textContent = '00:00';
    progressFill.style.width = '0%';
    ringBg.className = '';
    lionWrapper.className = 'lion-idle';

    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timerInterval = setInterval(function() {
        state.survivalTime++;
        timerDisplay.textContent = formatTime(state.survivalTime);
        updateUI();
    }, 1000);

    startCultureBar();

    setTimeout(function() {
        if (state.isPlaying) {
            tutorialCard.classList.add('show');
            showComboAction();
        }
    }, 500);
}

function scheduleNextNote() {
    // 连招模式不用这个
}

function missNote() {
    if (!state.currentNote || state.currentNote.judged) return;

    if (state.mode === 'tutorial') {
        showTutorialFail();
        return;
    }

    state.currentNote.judged = true;
    hideAllEffects();
    state.isWaitingForInput = false;
    state.isCharging = false;
    clearChargeUI();

    if (state.noteTimeout) clearTimeout(state.noteTimeout);

    state.combo = 0;
  
    state.missCount++;
    state.totalNotes++;

    removeNote();
    updateUI();

    showJudgeFeedback('miss', 0);
    showRingFeedback('miss');
    animateLion('miss', null, 'miss');
    playFail();
    spawnParticles('#FF4444', 6);

    

    state.isProcessing = false;
}

function removeNote() {
    if (state.currentNote && state.currentNote.el) {
        state.currentNote.el.classList.remove('pulsing');
        state.currentNote.el.classList.add('fading');
        setTimeout(function() {
            if (state.currentNote && state.currentNote.el) {
                state.currentNote.el.remove();
            }
        }, 150);
    }
    state.currentNote = null;
    state.totalNotes++;
}

// ============================================================
//  视觉反馈
// ============================================================
function showJudgeFeedback(quality, reactionTime) {
    var labels = {
        perfect: '✦ PERFECT ✦',
        great: '★ GREAT ★',
        good: '● GOOD ●',
        miss: '✕ MISS'
    };
    var colors = {
        perfect: 'perfect',
        great: 'great',
        good: 'good',
        miss: 'miss'
    };

    judgeText.textContent = labels[quality] || '';
    judgeText.className = 'show ' + colors[quality];
    setTimeout(function() {
        judgeText.className = '';
    }, 600);

    if (quality !== 'miss' && reactionTime > 0) {
        reactionDisplay.textContent = '⚡ ' + Math.round(reactionTime) + 'ms';
        reactionDisplay.className = 'show';
        setTimeout(function() {
            reactionDisplay.className = '';
        }, 800);
    }
}

function showRingFeedback(quality) {
    ringBg.className = '';
    if (quality === 'perfect') ringBg.className = 'active-perfect';
    else if (quality === 'great') ringBg.className = 'active-great';
    else if (quality === 'good') ringBg.className = 'active-good';
    else if (quality === 'miss') ringBg.className = 'active-miss';
    setTimeout(function() {
        if (state.mode !== 'tutorial') ringBg.className = '';
    }, 300);
}

// ============================================================
//  视觉反馈 - 方案A增强版
// ============================================================
// ============================================================
//  视觉反馈 - 方案A增强版（带调试日志）
// ============================================================
function animateLion(dir, type, quality) {
    console.log('🦁 animateLion:', { dir, type, quality });
    
    // 清除所有class
    lionWrapper.className = '';
    lionWrapper.classList.remove('lion-perfect', 'lion-great', 'lion-good');

    // ===== MISS 处理 =====
    if (quality === 'miss') {
        lionWrapper.className = 'lion-miss';
        console.log('❌ Miss 动画触发');
        setTimeout(function() { 
            lionWrapper.className = 'lion-idle'; 
        }, 400);
        return;
    }

    // ===== 根据判定添加额外特效class =====
    if (quality === 'perfect') {
        lionWrapper.classList.add('lion-perfect');
        spawnParticles('#FFD700', 25);
        setTimeout(function() {
            lionWrapper.classList.remove('lion-perfect');
        }, 500);
    } else if (quality === 'great') {
        lionWrapper.classList.add('lion-great');
        spawnParticles('#00FF88', 15);
        setTimeout(function() {
            lionWrapper.classList.remove('lion-great');
        }, 400);
    } else if (quality === 'good') {
        lionWrapper.classList.add('lion-good');
        spawnParticles('#3498DB', 10);
        setTimeout(function() {
            lionWrapper.classList.remove('lion-good');
        }, 300);
    }

    // ===== 中心类型 =====
    if (type === 'stop' || type === 'charge_hold') {
        lionWrapper.className = 'lion-stop';
        console.log('⏹ Stop/Charge 动画触发');
        if (quality === 'perfect' || quality === 'great') {
            spawnParticles('#FFD700', 20);
        }
        setTimeout(function() { 
            lionWrapper.className = 'lion-idle'; 
        }, 400);
        return;
    }
    
    if (type === 'spin') {
        lionWrapper.className = 'lion-spin';
        console.log('🌀 Spin 动画触发');
        setTimeout(function() { 
            lionWrapper.className = 'lion-idle'; 
        }, 500);
        return;
    }
    
    if (type === 'double') {
        lionWrapper.className = 'lion-double';
        console.log('✌️ Double 动画触发');
        setTimeout(function() { 
            lionWrapper.className = 'lion-idle'; 
        }, 400);
        return;
    }

    // ===== 方向跳跃 =====
    var jumpMap = {
        up: 'lion-jump-up',
        down: 'lion-jump-down',
        left: 'lion-jump-left',
        right: 'lion-jump-right',
    };
    
    if (jumpMap[dir]) {
        lionWrapper.className = jumpMap[dir];
        console.log('⬆⬇⬅➡ 方向动画触发:', jumpMap[dir]);
        
        if (quality === 'perfect' || quality === 'great') {
            var color = quality === 'perfect' ? '#FFD700' : '#00FF88';
            spawnParticles(color, 12);
        }
        
        setTimeout(function() { 
            lionWrapper.className = 'lion-idle'; 
        }, 350);
    } else {
        // 如果 dir 无效，恢复 idle
        console.warn('⚠️ 未知方向:', dir);
        lionWrapper.className = 'lion-idle';
    }
}

function showComic(actionKey, quality) {
    if (state.comboMode) return;

    if (state.isComicShowing) return;
    state.isComicShowing = true;

    var action = ACTION_DATA[actionKey];
    if (!action) {
        state.isComicShowing = false;
        return;
    }

    comicFrames.forEach(function(frame, i) {
        var title = frame.querySelector('.frame-title');
        var desc = frame.querySelector('.frame-desc');
        if (title) title.textContent = (i + 1) + ' ' + (action.frames[i] || '');
        if (desc) {
            var descs = ['起势', '腾空', '落桩'];
            desc.textContent = descs[i] || '';
        }
        if (i === 0) frame.classList.add('highlight');
        else frame.classList.remove('highlight');
    });

    comicCulture.textContent = action.name + ' · ' + action.culture;
    comicOverlay.className = 'show';

    setTimeout(function() {
        comicOverlay.className = '';
        state.isComicShowing = false;
    }, 1000);
}

function startCultureBar() {
    if (state.cultureTimer) clearInterval(state.cultureTimer);
    var idx = 0;
    cultureText.textContent = CULTURE_DATA[0];
    state.cultureTimer = setInterval(function() {
        idx = (idx + 1) % CULTURE_DATA.length;
        cultureText.textContent = CULTURE_DATA[idx];
    }, CONFIG.cultureInterval);
}

function updateUI() {
    scoreDisplay.textContent = '分数 ' + state.score;
    comboDisplay.textContent = '连击 ' + state.combo;

    if (state.mode === 'tutorial') {
        var pct = (state.tutorialCompleted.size / TUTORIAL_ORDER.length) * 100;
        progressFill.style.width = pct + '%';
    } else if (state.comboMode) {
        // 🔥 防止溢出：当前索引不能超过总套数
        var maxIndex = COMBO_DATA.length;
        var current = Math.min(state.currentComboIndex, maxIndex);
        var comboPct = (current / maxIndex) * 100;
        progressFill.style.width = Math.min(100, comboPct) + '%';
    } else {
        var maxTime = 300;
        var pct2 = Math.min(100, (state.survivalTime / maxTime) * 100);
        progressFill.style.width = pct2 + '%';
    }
}

// ============================================================
//  手势识别
// ============================================================
var touchStartX = 0, touchStartY = 0;
var touchStartTime = 0;
var isTouching = false;
var tapCount = 0;
var tapTimer = null;
var isDoubleTap = false;
var spinDetected = false;
var spinStartAngle = 0;
var spinTotalAngle = 0;
var touchStartInRing = false;
// 画对勾检测
var checkPath = [];
var isChecking = false;
var isCheckCompleted = false; 
var checkStartX = 0;
var checkStartY = 0;
var ringCenterX = 0, ringCenterY = 0;
var swipeStartX = 0, swipeStartY = 0;
var isChargingTouch = false;

function getRingCenter() {
    var rect = document.getElementById('ringArea').getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function isInRing(clientX, clientY) {
    var rect = document.getElementById('ringArea').getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var radius = Math.min(rect.width, rect.height) / 2;
    var dx = clientX - cx;
    var dy = clientY - cy;
    return Math.sqrt(dx * dx + dy * dy) < radius * 0.85;
}

document.addEventListener('touchstart', function(e) {
    if (state.isWaitingRetry) {
        if (state.comboMode && state.mode === 'endless') {
            retryTutorialStep();
        } else if (state.mode === 'tutorial') {
            retryTutorialStep();
        }
        return;
    }
    if (!state.isPlaying || state.isComicShowing || state.isProcessing) return;

    var touch = e.touches[0];
    var inRing = isInRing(touch.clientX, touch.clientY);

    if (!inRing) return;

    var center = getRingCenter();
    ringCenterX = center.x;
    ringCenterY = center.y;

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    swipeStartX = touch.clientX;
    swipeStartY = touch.clientY;
    touchStartTime = Date.now();
    isTouching = true;
    touchStartInRing = true;
    spinDetected = false;
    spinTotalAngle = 0;
    spinStartAngle = Math.atan2(touch.clientY - center.y, touch.clientX - center.x);
    isChargingTouch = false;

    if (e.touches.length === 2) {
        e.preventDefault();
        if (state.currentNote && !state.currentNote.judged && state.isWaitingForInput) {
            if (state.comboMode && state.mode === 'endless') {
                judgeComboAction('center', 'double');
            } else {
                judgeNote('center', 'double');
            }
        }
        return;
    }

    

    if (state.currentNote && !state.currentNote.judged && state.isWaitingForInput) {
        var action = state.currentNote.action;
        if (action.type === 'charge_hold' && !state.isCharging) {
            isChargingTouch = true;
            startCharge();
        }
     if (action.type === 'spin' && !state.isCharging) {
        isChecking = true;
        checkPath = [];
        checkStartX = touch.clientX;
        checkStartY = touch.clientY;
        checkPath.push({ x: touch.clientX, y: touch.clientY });
        
      
    }
    }
}, { passive: false });
// ============================================================
//  touchend 事件 - 手指抬起（添加在 touchstart 后面）
// ============================================================
document.addEventListener('touchend', function(e) {
    // 🔥 手指抬起时重置狮子姿态
    if (isChecking) {
        isChecking = false;
        checkPath = [];
        
    }
    resetLionSwipe();

    if (!isTouching || !state.isPlaying) return;
    isTouching = false;

    if (isDoubleTap) {
        isDoubleTap = false;
        return;
    }

    var touch = e.changedTouches[0];
    var dx = touch.clientX - touchStartX;
    var dy = touch.clientY - touchStartY;
    var dt = Date.now() - touchStartTime;
    var dist = Math.sqrt(dx * dx + dy * dy);

    if (state.isCharging && !state.chargeFired) {
        releaseCharge();
        isChargingTouch = false;
        return;
    }

    if (spinDetected && dist > 5) {
        handleGesture('spin');
        spinDetected = false;
        return;
    }

    if (dist < 20 && touchStartInRing) {
        handleTap();
        return;
    }

    if (dist > CONFIG.minSwipeDist && !state.isCharging && touchStartInRing) {
        var dir = getDirectionFromPoint(touchStartX, touchStartY, touch.clientX, touch.clientY);
        handleGesture(dir, 'single');
    }

    touchStartX = 0;
    touchStartY = 0;
    touchStartInRing = false;
    isChargingTouch = false;
}, { passive: false });



document.addEventListener('touchmove', function(e) {
    if (!isTouching || !state.isPlaying) return;
    e.preventDefault();

    const touch = e.touches[0];
      if (isChecking && state.currentNote && state.currentNote.action.type === 'spin') {
        var last = checkPath[checkPath.length - 1];
        var dist = Math.sqrt(
            Math.pow(touch.clientX - last.x, 2) + 
            Math.pow(touch.clientY - last.y, 2)
        );
        
        // 每移动 10px 记录一个点
        if (dist > 10) {
            checkPath.push({ x: touch.clientX, y: touch.clientY });
            
            // 检测对勾
            if (detectCheckMark(checkPath)) {
    isChecking = false;
    
    // 🔥 画V成功时生成金色粒子（和其他操作一致）
    spawnParticles('#FFD700', 15);
    
    // 触发旋转判定
    if (state.comboMode && state.mode === 'endless') {
        judgeComboAction('center', 'spin');
    } else {
        judgeNote('center', 'spin');
    }
    return;
}
        }
    }
     if (touchStartInRing) {
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 15) {
            let dir;
            if (Math.abs(dx) > Math.abs(dy)) {
                dir = dx > 0 ? 'right' : 'left';
            } else {
                dir = dy > 0 ? 'down' : 'up';
            }
            if (dir !== lastSwipeDir) {
                lastSwipeDir = dir;
                applySwipeFeedback(dir);
            }
        }
    }



    // ===== 旋转检测 =====
    if (e.touches.length === 1 && touchStartInRing) {
        var center = getRingCenter();
        var angle = Math.atan2(touch.clientY - center.y, touch.clientX - center.x);
        var delta = angle - spinStartAngle;
        if (delta > Math.PI) delta -= 2 * Math.PI;
        if (delta < -Math.PI) delta += 2 * Math.PI;
        spinTotalAngle += delta;
        spinStartAngle = angle;
        if (Math.abs(spinTotalAngle) > Math.PI * 0.2) {
            spinDetected = true;
        }
    }
}, { passive: false });

// 鼠标支持
var mouseDown = false;
var mouseStartX = 0, mouseStartY = 0;
var mouseStartTime = 0;
var mouseSwipeStartX = 0, mouseSwipeStartY = 0;
var mouseInRing = false;
var isMouseCharging = false;

document.addEventListener('mousedown', function(e) {
    if (!state.isPlaying || state.isComicShowing || state.isProcessing) return;

    if (state.mode === 'tutorial' && state.isWaitingRetry) {
        retryTutorialStep();
        return;
    }

    if (e.button !== 0) return;
    if (!isInRing(e.clientX, e.clientY)) return;

    var center = getRingCenter();
    ringCenterX = center.x;
    ringCenterY = center.y;

    mouseDown = true;
    mouseInRing = true;
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
    mouseSwipeStartX = e.clientX;
    mouseSwipeStartY = e.clientY;
    mouseStartTime = Date.now();
    isMouseCharging = false;

 

    if (state.currentNote && !state.currentNote.judged && state.isWaitingForInput) {
        var action = state.currentNote.action;
        if (action.type === 'charge_hold' && !state.isCharging) {
            isMouseCharging = true;
            startCharge();
        }
    }
});

document.addEventListener('mousemove', function(e) {
    if (!mouseDown || !state.isPlaying) return;
    
    // 🔥 鼠标滑动实时反馈
    if (mouseInRing) {
        var dx = e.clientX - mouseStartX;
        var dy = e.clientY - mouseStartY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 15) {
            var dir;
            if (Math.abs(dx) > Math.abs(dy)) {
                dir = dx > 0 ? 'right' : 'left';
            } else {
                dir = dy > 0 ? 'down' : 'up';
            }
            
            if (dir !== lastSwipeDir) {
                lastSwipeDir = dir;
                applySwipeFeedback(dir);
            }
        }
    }
});

document.addEventListener('mouseup', function(e) {
    resetLionSwipe();


    if (!mouseDown || !state.isPlaying) return;
    mouseDown = false;

    if (state.isCharging && !state.chargeFired) {
        releaseCharge();
        isMouseCharging = false;
        mouseInRing = false;
        return;
    }

    var dx = e.clientX - mouseStartX;
    var dy = e.clientY - mouseStartY;
    var dt = Date.now() - mouseStartTime;
    var dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 20 && mouseInRing) {
        handleTap();
    } else if (dist > CONFIG.minSwipeDist && !state.isCharging && mouseInRing) {
        var dir = getDirectionFromPoint(mouseStartX, mouseStartY, e.clientX, e.clientY);
        handleGesture(dir, 'single');
    }

    mouseInRing = false;
    isMouseCharging = false;
});

// ============================================================
//  手势处理
// ============================================================
function handleGesture(direction, gestureType) {
    if (!state.isPlaying || state.isComicShowing || state.isProcessing) return;

    if (state.comboMode && state.mode === 'endless' && state.isWaitingRetry) {
        retryTutorialStep();
        return;
    }

    if (state.mode === 'tutorial' && state.isWaitingRetry) {
        retryTutorialStep();
        return;
    }

    if (state.isCharging) return;
    if (state.mode === 'tutorial' && state.tutorialDone) return;

    if (!state.currentNote || state.currentNote.judged) return;
    if (!state.isWaitingForInput) return;

    if (state.currentNote.action.type === 'charge_hold') return;

    if (state.comboMode && state.mode === 'endless') {
        judgeComboAction(direction, gestureType || 'single');
        return;
    }

    judgeNote(direction, gestureType || 'single');
}

// ============================================================
//  判定逻辑（教学模式和无尽旧版使用）
// ============================================================
function judgeNote(direction, gestureType) {
     isChecking = false;
    isCheckCompleted = false;
    checkPath = [];
    if (!state.isPlaying || state.isProcessing) return;
    if (!state.currentNote || state.currentNote.judged) return;
    if (state.isWaitingRetry) return;

    var note = state.currentNote;
    var action = note.action;

    if (action.type === 'charge_hold') return;

    var matched = false;

    if (action.type === 'single' && gestureType === 'single') {
        if (action.dir === direction) matched = true;
    } else if (action.dir === 'center') {
        if (action.type === 'stop' && gestureType === 'tap') matched = true;
        else if (action.type === 'spin' && gestureType === 'spin') matched = true;
        else if (action.type === 'double' && gestureType === 'double') matched = true;
    }

    if (!matched) {
        if (state.mode === 'tutorial') {
            showTutorialFail();
            return;
        }
        missNote();
        return;
    }

    var now = performance.now();
    var reactionTime = now - state.noteAppearTime;

    var quality;
    if (reactionTime <= CONFIG.perfectTime) quality = 'perfect';
    else if (reactionTime <= CONFIG.greatTime) quality = 'great';
    else if (reactionTime <= CONFIG.goodTime) quality = 'good';
    else quality = 'miss';

    if (quality === 'miss') {
        if (state.mode === 'tutorial') {
            showTutorialFail();
            return;
        }
        missNote();
        return;
    }

    state.currentNote.judged = true;
    hideAllEffects();
    state.isWaitingForInput = false;
    state.isProcessing = true;
    clearChargeUI();

    if (state.noteTimeout) clearTimeout(state.noteTimeout);

    state.learnedActions.add(note.actionKey);

    if (state.mode === 'tutorial') {
        handleTutorialSuccess();
        removeNote();
        updateUI();
        state.isProcessing = false;
        return;
    }

    var points = quality === 'perfect' ? 100 : quality === 'great' ? 70 : 40;
    var comboBonus = 1 + state.combo * 0.02;
    state.score += Math.round(points * comboBonus);
    state.combo++;
    state.hitNotes++;
    if (state.combo > state.maxCombo) state.maxCombo = state.combo;
    if (quality === 'perfect') state.perfectCount++;
    else if (quality === 'great') state.greatCount++;
    else state.goodCount++;

    state.totalReaction += reactionTime;
    state.reactionCount++;

    removeNote();
    updateUI();

    showJudgeFeedback(quality, reactionTime);
    showRingFeedback(quality);
    animateLion(action.dir, action.type, quality);

    if (quality === 'perfect' || quality === 'great') {
        showComic(note.actionKey, quality);
    }
    // 🔥 spin（画V）判定成功后，清理画V特效
if (action.type === 'spin') {
    clearVEffect();
}

    if (quality === 'perfect') {
        spawnParticles('#00FF88', 18);
        playSuccess();
    } else if (quality === 'great') {
        spawnParticles('#FFD700', 10);
        playTone(660, 0.08, 0.05);
    } else {
        spawnParticles('#3498DB', 5);
        playTone(520, 0.06, 0.04);
    }

    state.isProcessing = false;

    if (state.mode === 'endless' && !state.comboMode) {
        scheduleNextNote();
    }
}

function handleTap() {
    if (!state.isPlaying || state.isComicShowing || state.isProcessing) return;

    if (state.comboMode && state.mode === 'endless' && state.isWaitingRetry) {
        retryTutorialStep();
        return;
    }

    if (state.mode === 'tutorial' && state.isWaitingRetry) {
        retryTutorialStep();
        return;
    }

    if (state.isCharging) return;

    if (!state.currentNote || state.currentNote.judged) return;
    if (!state.isWaitingForInput) return;

    var action = state.currentNote.action;
    if (action.type === 'charge_hold') return;

    if (action.dir === 'center') {
        if (action.type === 'stop') {
            var feedback = document.getElementById('pressFeedback');
            if (feedback) {
                feedback.classList.remove('active');
                void feedback.offsetWidth;
                feedback.classList.add('active');
            }
            if (state.comboMode && state.mode === 'endless') {
                judgeComboAction('center', 'tap');
            } else {
                judgeNote('center', 'tap');
            }
            return;
        }
    }

    if (state.mode === 'tutorial') {
        showTutorialFail();
    }
}

// ============================================================
//  键盘支持
// ============================================================
document.addEventListener('keydown', function(e) {
    if (!state.isPlaying || state.isComicShowing || state.isProcessing) return;

    if (state.mode === 'tutorial' && state.isWaitingRetry) {
        retryTutorialStep();
        return;
    }

    // R → 旋转（画圈）
    if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        console.log('R 键按下, 当前动作:', state.currentNote ? state.currentNote.action.type : 'null');

        if (state.isWaitingRetry) {
            state.isWaitingRetry = false;
            var retryEl = document.getElementById('tutoRetry');
            var statusEl = document.getElementById('tutoStatus');
            if (retryEl) retryEl.className = 'tuto-card-retry';
            if (statusEl) {
                statusEl.className = 'tuto-card-status waiting';
                statusEl.textContent = '等待操作...';
            }
        }

        if (state.currentNote && !state.currentNote.judged && state.isWaitingForInput) {
            if (state.currentNote.action.type === 'spin') {
                console.log('✅ 触发 spin 判定');
                if (state.comboMode && state.mode === 'endless') {
                    judgeComboAction('center', 'spin');
                } else {
                    judgeNote('center', 'spin');
                }
            }
        }
        return;
    }

    // T → 双指触摸
    if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        if (state.isWaitingRetry) {
            state.isWaitingRetry = false;
            var retryEl2 = document.getElementById('tutoRetry');
            var statusEl2 = document.getElementById('tutoStatus');
            if (retryEl2) retryEl2.className = 'tuto-card-retry';
            if (statusEl2) {
                statusEl2.className = 'tuto-card-status waiting';
                statusEl2.textContent = '等待操作...';
            }
        }
        if (state.currentNote && !state.currentNote.judged && state.isWaitingForInput) {
            if (state.currentNote.action.type === 'double') {
                console.log('✅ 触发 double 判定');
                if (state.comboMode && state.mode === 'endless') {
                    judgeComboAction('center', 'double');
                } else {
                    judgeNote('center', 'double');
                }
            }
        }
        return;
    }

    // 空格键
    if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        console.log('⌨️ 空格键按下, 当前模式:', state.mode, 'isWaitingRetry:', state.isWaitingRetry);

        if (state.isWaitingRetry) {
            if (state.comboMode && state.mode === 'endless') {
                retryTutorialStep();
            } else if (state.mode === 'tutorial') {
                retryTutorialStep();
            }
            return;
        }

        handleTap();
        return;
    }

    // 方向键
    var map = {
        'ArrowUp': { dir: 'up', type: 'single' },
        'ArrowDown': { dir: 'down', type: 'single' },
        'ArrowLeft': { dir: 'left', type: 'single' },
        'ArrowRight': { dir: 'right', type: 'single' },
        'w': { dir: 'up', type: 'single' },
        's': { dir: 'down', type: 'single' },
        'a': { dir: 'left', type: 'single' },
        'd': { dir: 'right', type: 'single' },
    };

    if (map[e.key]) {
        e.preventDefault();
        console.log('⌨️ 方向键按下:', map[e.key].dir);

        if (state.currentNote && !state.currentNote.judged && state.isWaitingForInput) {
            var action2 = state.currentNote.action;
            if (action2.type === 'charge_hold') {
                if (!state.isCharging) {
                    startCharge();
                    setTimeout(function() {
                        if (state.isCharging && !state.chargeFired) {
                            state.chargeProgress = 80;
                            releaseCharge();
                        }
                    }, 700);
                }
                return;
            }
        }

        var dir = map[e.key].dir;
        handleGesture(dir, 'single');
    }
});

// ============================================================
//  游戏结束（结算页面）
// ============================================================
function endGame() {
    // ===== 强制清理所有遮挡层 =====
    comicOverlay.className = '';
    state.isComicShowing = false;
    state.waitingForNext = false;

    state.isPlaying = false;
    if (state.spawnTimer) clearTimeout(state.spawnTimer);
    if (state.timerInterval) clearInterval(state.timerInterval);
    if (state.cultureTimer) clearInterval(state.cultureTimer);
    if (state.noteTimeout) clearTimeout(state.noteTimeout);
    if (state.healthRegenTimer) clearTimeout(state.healthRegenTimer);
    if (state.chargeAnimFrame) cancelAnimationFrame(state.chargeAnimFrame);
    if (state.chargeTimeoutTimer) clearTimeout(state.chargeTimeoutTimer);

    notesContainer.innerHTML = '';
    clearChargeUI();
    hideAllEffects();

    if (state.currentNote && state.currentNote.el) {
        state.currentNote.el.remove();
        state.currentNote = null;
    }
    tutorialCard.classList.remove('show');

    var accuracy = state.totalNotes > 0 ?
        Math.round((state.hitNotes / state.totalNotes) * 100) :
        0;
    var avgReaction = state.reactionCount > 0 ?
        Math.round(state.totalReaction / state.reactionCount) :
        0;

    var allCompleted = state.currentComboIndex >= COMBO_DATA.length;
    var totalScore = state.score;

    // ===== 称号设置 =====
    var icon = '';
    var title = '';
    var subtitle = '';

    if (state.mode === 'tutorial') {
        icon = '◆';
        title = '初悟狮魂';
        subtitle = '已得狮艺，可战高桩';
    } else if (allCompleted) {
        if (totalScore >= 720) {
            icon = '★';
            title = '无双狮王';
            subtitle = '狮道无极，已臻化境';
            spawnParticles('#FFD700', 50);
            setTimeout(function() { spawnParticles('#FFD700', 50); }, 200);
            setTimeout(function() { spawnParticles('#FF6B35', 50); }, 400);
        } else if (totalScore >= 600) {
            icon = '★';
            title = '金鬃狮王';
            subtitle = '金鬃猎猎，威仪四方';
            spawnParticles('#FFD700', 40);
            setTimeout(function() { spawnParticles('#FFD700', 40); }, 200);
        } else if (totalScore >= 450) {
            icon = '◆';
            title = '银鬃狮手';
            subtitle = '乘风踏桩，行云流水';
            spawnParticles('#C0C0C0', 30);
        } else if (totalScore >= 300) {
            icon = '◆';
            title = '铜鬃狮手';
            subtitle = '初窥门径，初露锋芒';
            spawnParticles('#CD7F32', 20);
        } else {
            icon = '◇';
            title = '初学狮艺';
            subtitle = '勤能补拙，功不唐捐';
        }
    } else if (state.health <= 0) {
        icon = '◇';
        title = '狮心不灭';
        subtitle = '承狮之志，行而不辍';
    } else {
        icon = '★';
        title = '战狮犹酣';
        subtitle ='桩上风云，再战更高';
    }

    document.getElementById('resultIcon').textContent = icon;
    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultSubtitle').textContent = subtitle;

    // 数据
    finalScore.textContent = state.score;
   
    finalAccuracy.textContent = accuracy + '%';
    finalReaction.textContent = avgReaction + 'ms';
    

    // 醒狮谱 - 动作清单
    resultActions.innerHTML = '';
    for (var i = 0; i < COMBO_DATA.length; i++) {
        var combo = COMBO_DATA[i];
        var completed = i < state.currentComboIndex || (i === state.currentComboIndex && state.waitingForNext);
        var item = document.createElement('div');
        item.className = 'action-item' + (completed ? ' completed' : ' locked');
        var check = document.createElement('span');
        check.className = 'check';
        check.textContent = completed ? '◆' : '◇';
        var name = document.createElement('span');
        name.textContent = combo.name;
        item.appendChild(check);
        item.appendChild(name);
        resultActions.appendChild(item);
    }

    // 进度条走满
    progressFill.style.width = '100%';

    resultOverlay.style.display = 'flex';
}

// ============================================================
//  事件绑定
// ============================================================
tutorialBtn.addEventListener('click', startTutorial);
tutorialBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    startTutorial();
});

endlessBtn.addEventListener('click', function() { startEndlessMode(false); });
endlessBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    startEndlessMode(false);
});

retryBtn.addEventListener('click', function() {
    if (state.mode === 'tutorial') {
        startTutorial();
    } else {
        startEndlessMode(false);
    }
});
retryBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    if (state.mode === 'tutorial') {
        startTutorial();
    } else {
        startEndlessMode(false);
    }
});

homeBtn.addEventListener('click', function() {
    resultOverlay.style.display = 'none';
    gameScreen.style.display = 'none';
    startScreen.style.display = 'flex';
    if (state.timerInterval) clearInterval(state.timerInterval);
    if (state.cultureTimer) clearInterval(state.cultureTimer);
    if (state.spawnTimer) clearTimeout(state.spawnTimer);
    if (state.noteTimeout) clearTimeout(state.noteTimeout);
    if (state.chargeAnimFrame) cancelAnimationFrame(state.chargeAnimFrame);
    if (state.chargeTimeoutTimer) clearTimeout(state.chargeTimeoutTimer);
    state.isPlaying = false;
    tutorialCard.classList.remove('show');
    clearChargeUI();
    hideAllEffects();
    comicOverlay.className = '';
});

comicNextBtn.addEventListener('click', nextCombo);
comicNextBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    nextCombo();
});
// ============================================================
//  漫画弹窗 - 滑动控制事件绑定
// ============================================================
(function initComicSlider() {
    // 确保 DOM 已加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindComicEvents);
    } else {
        bindComicEvents();
    }
})();

function bindComicEvents() {
    var prevBtn = document.getElementById('sliderPrev');
    var nextBtn = document.getElementById('sliderNext');
    var track = document.getElementById('comicSliderTrack');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // 键盘支持
    document.addEventListener('keydown', function(e) {
        if (!document.getElementById('comicOverlay').classList.contains('show')) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            var btn = document.getElementById('comicNextBtn');
            if (btn) btn.click();
        }
    });

    // 触摸滑动支持
    if (track) {
        var startX = 0;
        var startY = 0;
        var isSwiping = false;
        
        track.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping = true;
        }, { passive: true });
        
        track.addEventListener('touchend', function(e) {
            if (!isSwiping) return;
            isSwiping = false;
            var endX = e.changedTouches[0].clientX;
            var endY = e.changedTouches[0].clientY;
            var diffX = startX - endX;
            var diffY = Math.abs(startY - endY);
            
            // 水平滑动距离 > 40px 且大于垂直滑动
            if (Math.abs(diffX) > 40 && Math.abs(diffX) > diffY) {
                if (diffX > 0) nextSlide();
                else prevSlide();
            }
        }, { passive: true });
    }
}

document.addEventListener('gesturestart', function(e) { e.preventDefault(); });
document.addEventListener('gesturechange', function(e) { e.preventDefault(); });

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}, { passive: false, capture: true });

document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}, { passive: false, capture: true });

document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}, { passive: false, capture: true });

// ============================================================
//  漫画弹窗 - 滑动控制事件绑定
// ============================================================
(function initComicSlider() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindComicEvents);
    } else {
        bindComicEvents();
    }
})();

function bindComicEvents() {
    var prevBtn = document.getElementById('sliderPrev');
    var nextBtn = document.getElementById('sliderNext');
    var track = document.getElementById('comicSliderTrack');
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    document.addEventListener('keydown', function(e) {
        if (!document.getElementById('comicOverlay').classList.contains('show')) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            var btn = document.getElementById('comicNextBtn');
            if (btn) btn.click();
        }
    });

    if (track) {
        var startX = 0, startY = 0, isSwiping = false;
        track.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping = true;
        }, { passive: true });
        track.addEventListener('touchend', function(e) {
            if (!isSwiping) return;
            isSwiping = false;
            var endX = e.changedTouches[0].clientX;
            var endY = e.changedTouches[0].clientY;
            var diffX = startX - endX;
            var diffY = Math.abs(startY - endY);
            if (Math.abs(diffX) > 40 && Math.abs(diffX) > diffY) {
                if (diffX > 0) nextSlide();
                else prevSlide();
            }
        }, { passive: true });
    }
}
// ============================================================
//  滑动反馈函数
// ============================================================

// ============================================================
//  滑动跟随函数
// ============================================================

function applySwipeFeedback(dir) {
    if (swipeFeedbackTimer) {
        clearTimeout(swipeFeedbackTimer);
        swipeFeedbackTimer = null;
    }
    
    lionWrapper.classList.remove(
        'lion-swipe-up', 'lion-swipe-down',
        'lion-swipe-left', 'lion-swipe-right',
        'lion-swipe-reset'
    );
    
    const map = {
        'up': 'lion-swipe-up',
        'down': 'lion-swipe-down',
        'left': 'lion-swipe-left',
        'right': 'lion-swipe-right'
    };
    
    if (map[dir]) {
        lionWrapper.classList.add(map[dir]);
        playSwipeSound(dir);
    }
}

function resetLionSwipe() {
    if (swipeFeedbackTimer) {
        clearTimeout(swipeFeedbackTimer);
        swipeFeedbackTimer = null;
    }
    
    lionWrapper.classList.remove(
        'lion-swipe-up', 'lion-swipe-down',
        'lion-swipe-left', 'lion-swipe-right'
    );
    lionWrapper.classList.add('lion-swipe-reset');
    
    swipeFeedbackTimer = setTimeout(function() {
        lionWrapper.classList.remove('lion-swipe-reset');
        lionWrapper.className = 'lion-idle';
        lastSwipeDir = null;
        swipeFeedbackTimer = null;
    }, 350);
}

function playSwipeSound(dir) {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const freqMap = { up: 600, down: 400, left: 500, right: 500 };
        osc.frequency.value = freqMap[dir] || 500;
        osc.type = 'sine';
        gain.gain.value = 0.025;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.06);
    } catch (e) {}
}
// ============================================================
//  画对勾检测 - 宽松版
// ============================================================

function detectCheckMark(path) {
    // 至少需要 4 个点
    if (path.length < 4) return false;
    
    var len = path.length;
    var p1 = path[0];                           // 起点
    var p2 = path[Math.floor(len * 0.35)];      // 转折点
    var p3 = path[len - 1];                     // 终点
    
    var v1x = p2.x - p1.x;
    var v1y = p2.y - p1.y;
    var v2x = p3.x - p2.x;
    var v2y = p3.y - p2.y;
    
    var len1 = Math.sqrt(v1x * v1x + v1y * v1y);
    var len2 = Math.sqrt(v2x * v2x + v2y * v2y);
    
    // 移动距离不能太小（20px以上）
   if (len1 < 15 || len2 < 15) return false;
    
    // 🔥 只要两段方向相反就算对勾
    if ((v1y > 0 && v2y < 0) || (v1y < 0 && v2y > 0)) {
        return true;
    }
    
    return false;
}

// ============================================================
//  画V提示粒子（圆环内自动播放V形轨迹）
// ============================================================




console.log('鼎承狮跃 已加载！');
console.log('连招模式已开启！');
console.log('完成全部8套连招即可获得"狮王加冕"！');
console.log('⌨键盘快捷键：R=旋转  T=双指  空格=点击');