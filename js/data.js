```javascript
/* =========================================================
   THE SHOW STYLE - ORIGINAL RTTS BROWSER GAME
   js/data.js
   ========================================================= */

/*
    이 파일은 게임의 "고정 데이터"를 담당한다.

    포함:
    - 언어
    - 30개 MLB 팀
    - 포지션
    - 선수 등급
    - 장비 종류 / 등급
    - 장비 보너스
    - 계약 범위
    - 리그 단계
    - 경기 기본 설정
*/

/* =========================================================
   LANGUAGE
   ========================================================= */

const LANGUAGES = {
    ko: {
        name: "한국어",
        flag: "🇰🇷"
    },

    en: {
        name: "English",
        flag: "🇺🇸"
    },

    ja: {
        name: "日本語",
        flag: "🇯🇵"
    }
};


/* =========================================================
   MLB 30 TEAMS
   ========================================================= */

const MLB_TEAMS = [
    {
        id: "ARI",
        name: "Arizona Diamondbacks",
        short: "ARI",
        league: "NL",
        division: "West"
    },
    {
        id: "ATL",
        name: "Atlanta Braves",
        short: "ATL",
        league: "NL",
        division: "East"
    },
    {
        id: "BAL",
        name: "Baltimore Orioles",
        short: "BAL",
        league: "AL",
        division: "East"
    },
    {
        id: "BOS",
        name: "Boston Red Sox",
        short: "BOS",
        league: "AL",
        division: "East"
    },
    {
        id: "CHC",
        name: "Chicago Cubs",
        short: "CHC",
        league: "NL",
        division: "Central"
    },
    {
        id: "CWS",
        name: "Chicago White Sox",
        short: "CWS",
        league: "AL",
        division: "Central"
    },
    {
        id: "CIN",
        name: "Cincinnati Reds",
        short: "CIN",
        league: "NL",
        division: "Central"
    },
    {
        id: "CLE",
        name: "Cleveland Guardians",
        short: "CLE",
        league: "AL",
        division: "Central"
    },
    {
        id: "COL",
        name: "Colorado Rockies",
        short: "COL",
        league: "NL",
        division: "West"
    },
    {
        id: "DET",
        name: "Detroit Tigers",
        short: "DET",
        league: "AL",
        division: "Central"
    },
    {
        id: "HOU",
        name: "Houston Astros",
        short: "HOU",
        league: "AL",
        division: "West"
    },
    {
        id: "KCR",
        name: "Kansas City Royals",
        short: "KC",
        league: "AL",
        division: "Central"
    },
    {
        id: "LAA",
        name: "Los Angeles Angels",
        short: "LAA",
        league: "AL",
        division: "West"
    },
    {
        id: "LAD",
        name: "Los Angeles Dodgers",
        short: "LAD",
        league: "NL",
        division: "West"
    },
    {
        id: "MIA",
        name: "Miami Marlins",
        short: "MIA",
        league: "NL",
        division: "East"
    },
    {
        id: "MIL",
        name: "Milwaukee Brewers",
        short: "MIL",
        league: "NL",
        division: "Central"
    },
    {
        id: "MIN",
        name: "Minnesota Twins",
        short: "MIN",
        league: "AL",
        division: "Central"
    },
    {
        id: "NYM",
        name: "New York Mets",
        short: "NYM",
        league: "NL",
        division: "East"
    },
    {
        id: "NYY",
        name: "New York Yankees",
        short: "NYY",
        league: "AL",
        division: "East"
    },
    {
        id: "ATH",
        name: "Oakland Athletics",
        short: "ATH",
        league: "AL",
        division: "West"
    },
    {
        id: "PHI",
        name: "Philadelphia Phillies",
        short: "PHI",
        league: "NL",
        division: "East"
    },
    {
        id: "PIT",
        name: "Pittsburgh Pirates",
        short: "PIT",
        league: "NL",
        division: "Central"
    },
    {
        id: "SDP",
        name: "San Diego Padres",
        short: "SD",
        league: "NL",
        division: "West"
    },
    {
        id: "SFG",
        name: "San Francisco Giants",
        short: "SF",
        league: "NL",
        division: "West"
    },
    {
        id: "SEA",
        name: "Seattle Mariners",
        short: "SEA",
        league: "AL",
        division: "West"
    },
    {
        id: "STL",
        name: "St. Louis Cardinals",
        short: "STL",
        league: "NL",
        division: "Central"
    },
    {
        id: "TBR",
        name: "Tampa Bay Rays",
        short: "TB",
        league: "AL",
        division: "East"
    },
    {
        id: "TEX",
        name: "Texas Rangers",
        short: "TEX",
        league: "AL",
        division: "West"
    },
    {
        id: "TOR",
        name: "Toronto Blue Jays",
        short: "TOR",
        league: "AL",
        division: "East"
    },
    {
        id: "WSN",
        name: "Washington Nationals",
        short: "WSH",
        league: "NL",
        division: "East"
    }
];


/* =========================================================
   POSITIONS
   ========================================================= */

const POSITIONS = [
    {
        id: "C",
        ko: "포수",
        en: "Catcher",
        ja: "捕手"
    },
    {
        id: "1B",
        ko: "1루수",
        en: "First Base",
        ja: "一塁手"
    },
    {
        id: "2B",
        ko: "2루수",
        en: "Second Base",
        ja: "二塁手"
    },
    {
        id: "3B",
        ko: "3루수",
        en: "Third Base",
        ja: "三塁手"
    },
    {
        id: "SS",
        ko: "유격수",
        en: "Shortstop",
        ja: "遊撃手"
    },
    {
        id: "LF",
        ko: "좌익수",
        en: "Left Field",
        ja: "左翼手"
    },
    {
        id: "CF",
        ko: "중견수",
        en: "Center Field",
        ja: "中堅手"
    },
    {
        id: "RF",
        ko: "우익수",
        en: "Right Field",
        ja: "右翼手"
    },
    {
        id: "DH",
        ko: "지명타자",
        en: "Designated Hitter",
        ja: "指名打者"
    }
];


/* =========================================================
   PLAYER STATS
   ========================================================= */

const STAT_KEYS = [
    "contact",
    "power",
    "clutch",
    "baserunning",
    "defense"
];

const STAT_NAMES = {
    contact: {
        ko: "컨택",
        en: "Contact",
        ja: "コンタクト"
    },

    power: {
        ko: "파워",
        en: "Power",
        ja: "パワー"
    },

    clutch: {
        ko: "클러치",
        en: "Clutch",
        ja: "クラッチ"
    },

    baserunning: {
        ko: "주루",
        en: "Baserunning",
        ja: "走塁"
    },

    defense: {
        ko: "수비",
        en: "Defense",
        ja: "守備"
    }
};


/* =========================================================
   PLAYER CREATION
   ========================================================= */

const STARTING_TOKENS = 250;

const STAT_MIN = 0;

const STAT_MAX = 100;


/* =========================================================
   MINOR LEAGUE / MLB CAREER STAGES
   ========================================================= */

const CAREER_STAGES = [
    {
        id: "rookie",
        ko: "루키",
        en: "Rookie",
        ja: "ルーキー",

        level: 1,
        league: "Minor",

        requiredOverall: 0
    },

    {
        id: "a",
        ko: "싱글 A",
        en: "Single-A",
        ja: "シングルA",

        level: 2,
        league: "Minor",

        requiredOverall: 25
    },

    {
        id: "aa",
        ko: "더블 A",
        en: "Double-A",
        ja: "ダブルA",

        level: 3,
        league: "Minor",

        requiredOverall: 40
    },

    {
        id: "aaa",
        ko: "트리플 A",
        en: "Triple-A",
        ja: "トリプルA",

        level: 4,
        league: "Minor",

        requiredOverall: 55
    },

    {
        id: "mlb",
        ko: "MLB",
        en: "MLB",
        ja: "MLB",

        level: 5,
        league: "MLB",

        requiredOverall: 65
    }
];


/* =========================================================
   EQUIPMENT
   ========================================================= */

const EQUIPMENT_TYPES = [
    {
        id: "glove",
        stat: "defense",

        ko: "글러브",
        en: "Glove",
        ja: "グローブ"
    },

    {
        id: "shoes",
        stat: "baserunning",

        ko: "야구화",
        en: "Cleats",
        ja: "スパイク"
    },

    {
        id: "bat",
        stat: "power",

        ko: "배트",
        en: "Bat",
        ja: "バット"
    },

    {
        id: "batting_gloves",
        stat: "contact",

        ko: "배팅장갑",
        en: "Batting Gloves",
        ja: "バッティンググローブ"
    },

    {
        id: "protective_gear",
        stat: "clutch",

        ko: "보호장비",
        en: "Protective Gear",
        ja: "防具"
    }
];


/* =========================================================
   EQUIPMENT RARITIES
   ========================================================= */

const EQUIPMENT_RARITIES = [
    {
        id: "normal",

        ko: "노말",
        en: "Normal",
        ja: "ノーマル",

        minBonus: 1,
        maxBonus: 3,

        weight: 50,

        colorClass: "rarity-normal"
    },

    {
        id: "rare",

        ko: "레어",
        en: "Rare",
        ja: "レア",

        minBonus: 4,
        maxBonus: 6,

        weight: 28,

        colorClass: "rarity-rare"
    },

    {
        id: "special",

        ko: "스페셜",
        en: "Special",
        ja: "スペシャル",

        minBonus: 7,
        maxBonus: 10,

        weight: 13,

        colorClass: "rarity-special"
    },

    {
        id: "gold",

        ko: "골드",
        en: "Gold",
        ja: "ゴールド",

        minBonus: 11,
        maxBonus: 15,

        weight: 7,

        colorClass: "rarity-gold"
    },

    {
        id: "diamond",

        ko: "다이아몬드",
        en: "Diamond",
        ja: "ダイヤモンド",

        minBonus: 16,
        maxBonus: 20,

        weight: 2,

        colorClass: "rarity-diamond"
    }
];


/* =========================================================
   EQUIPMENT DRAW
   ========================================================= */

const EQUIPMENT_DRAW_COST = 10000;


/* =========================================================
   EQUIPMENT NAMES
   ========================================================= */

const EQUIPMENT_NAMES = {

    glove: [
        "프로 글러브",
        "스피드 글러브",
        "엘리트 글러브",
        "필딩 마스터",
        "골드 필더",
        "다이아 필딩 글러브"
    ],

    shoes: [
        "프로 야구화",
        "스피드 클리츠",
        "엘리트 스파이크",
        "베이스러닝 스파이크",
        "골드 러너",
        "다이아 러닝 슈즈"
    ],

    bat: [
        "프로 배트",
        "파워 배트",
        "엘리트 배트",
        "홈런 배트",
        "골드 슬러거 배트",
        "다이아 파워 배트"
    ],

    batting_gloves: [
        "프로 배팅장갑",
        "정밀 배팅장갑",
        "엘리트 배팅장갑",
        "컨택 마스터",
        "골드 컨택 글러브",
        "다이아 컨택 글러브"
    ],

    protective_gear: [
        "프로 보호장비",
        "클러치 보호대",
        "엘리트 보호장비",
        "클러치 마스터",
        "골드 클러치 기어",
        "다이아 클러치 기어"
    ]
};


/* =========================================================
   EQUIPMENT LEVEL REQUIREMENTS
   ========================================================= */

const EQUIPMENT_LEVEL_REQUIREMENTS = {
    normal: 1,
    rare: 3,
    special: 5,
    gold: 8,
    diamond: 12
};


/* =========================================================
   TRAINING
   ========================================================= */

const TRAINING_TOKEN_REWARD = 1;

const TRAINING_SUCCESS_RATE = 0.82;

const TRAINING_COOLDOWN = 0;


/* =========================================================
   STARTING SALARY
   ========================================================= */

const STARTING_SALARY = 0;


/* =========================================================
   SALARY SYSTEM
   ========================================================= */

const SALARY_RANGES = {

    rookie: {
        min: 10000,
        max: 30000
    },

    a: {
        min: 25000,
        max: 60000
    },

    aa: {
        min: 50000,
        max: 100000
    },

    aaa: {
        min: 80000,
        max: 180000
    },

    mlb: {
        min: 180000,
        max: 1000000
    }
};


/* =========================================================
   CONTRACT TEAM OFFER MULTIPLIERS
   ========================================================= */

const CONTRACT_MULTIPLIERS = [
    0.85,
    1.0,
    1.15,
    1.3
];


/* =========================================================
   GAME SETTINGS
   ========================================================= */

const GAME_SETTINGS = {

    innings: 9,

    extraInnings: true,

    maxExtraInnings: 12,

    absReviewsPerGame: 2,

    ballsForWalk: 4,

    strikesForStrikeout: 3,

    outsPerInning: 3,

    strikesPerAtBat: 3,

    startingCountBalls: 0,

    startingCountStrikes: 0
};


/* =========================================================
   BATTING
   ========================================================= */

const BATTING_SETTINGS = {

    zoneWidth: 0.56,

    zoneHeight: 0.68,

    perfectTimingWindow: 0.045,

    goodTimingWindow: 0.10,

    okayTimingWindow: 0.17,

    maxMissDistance: 1,

    foulChance: 0.28,

    contactBase: 0.55,

    powerBaseDistance: 180,

    maxDistance: 470
};


/* =========================================================
   FIELDING
   ========================================================= */

const FIELDING_SETTINGS = {

    playerSpeed: 0.32,

    sprintSpeed: 0.55,

    pickupDistance: 25,

    throwPowerBase: 0.7,

    throwAccuracyBase: 0.75,

    throwErrorDistance: 65
};


/* =========================================================
   BASERUNNING
   ========================================================= */

const BASERUNNING_SETTINGS = {

    normalSpeed: 0.30,

    sprintSpeed: 0.50,

    stealSpeed: 0.55,

    stealSuccessBase: 0.65,

    tagUpWindow: 0.65,

    turnRadius: 38
};


/* =========================================================
   PITCHING
   ========================================================= */

const PITCH_TYPES = [

    {
        id: "four_seam",

        ko: "포심",
        en: "4-Seam",
        ja: "フォーシーム",

        speed: 95,
        break: 0.08,
        control: 0.90
    },

    {
        id: "two_seam",

        ko: "투심",
        en: "2-Seam",
        ja: "ツーシーム",

        speed: 92,
        break: 0.18,
        control: 0.84
    },

    {
        id: "slider",

        ko: "슬라이더",
        en: "Slider",
        ja: "スライダー",

        speed: 87,
        break: 0.52,
        control: 0.78
    },

    {
        id: "curve",

        ko: "커브",
        en: "Curveball",
        ja: "カーブ",

        speed: 79,
        break: 0.72,
        control: 0.68
    },

    {
        id: "changeup",

        ko: "체인지업",
        en: "Changeup",
        ja: "チェンジアップ",

        speed: 84,
        break: 0.44,
        control: 0.76
    },

    {
        id: "cutter",

        ko: "커터",
        en: "Cutter",
        ja: "カッター",

        speed: 89,
        break: 0.30,
        control: 0.82
    }
];


/* =========================================================
   ABS
   ========================================================= */

const ABS_SETTINGS = {

    reviewsPerGame: 2,

    overturnChance: 0.48,

    closeCallDistance: 0.09
};


/* =========================================================
   SEASON
   ========================================================= */

const SEASON_SETTINGS = {

    minorGames: 72,

    mlbGames: 162,

    postseasonTeams: 12,

    allStarGameNumber: 81
};


/* =========================================================
   PLAYER DEVELOPMENT
   ========================================================= */

const DEVELOPMENT_SETTINGS = {

    successfulTrainingTokens: 1,

    performanceTokenChance: 0.12,

    maxOverall: 99,

    statSoftCap: 99
};


/* =========================================================
   SAVE SYSTEM
   ========================================================= */

const SAVE_SETTINGS = {

    slots: 3,

    storagePrefix: "original_rtts_save_",

    languageKey: "original_rtts_language"
};


/* =========================================================
   DEFAULT PLAYER
   ========================================================= */

function createDefaultStats() {
    return {
        contact: 0,
        power: 0,
        clutch: 0,
        baserunning: 0,
        defense: 0
    };
}


/* =========================================================
   DEFAULT SEASON STATS
   ========================================================= */

function createDefaultSeasonStats() {
    return {
        games: 0,

        plateAppearances: 0,

        atBats: 0,

        hits: 0,

        doubles: 0,

        triples: 0,

        homeRuns: 0,

        runs: 0,

        rbi: 0,

        walks: 0,

        strikeouts: 0,

        stolenBases: 0,

        caughtStealing: 0,

        battingAverage: 0,

        onBasePercentage: 0,

        sluggingPercentage: 0,

        fieldingPlays: 0,

        fieldingSuccesses: 0,

        errors: 0,

        wins: 0,

        losses: 0
    };
}


/* =========================================================
   DEFAULT CAREER DATA
   ========================================================= */

function createDefaultCareerData() {

    return {

        stage: "rookie",

        careerLevel: 1,

        seasonNumber: 1,

        gameNumber: 1,

        currentTeam: null,

        previousTeams: [],

        currentSalary: STARTING_SALARY,

        careerEarnings: 0,

        allStarSelections: 0,

        postseasonAppearances: 0,

        worldSeriesAppearances: 0,

        worldSeriesWins: 0,

        seasonStats: createDefaultSeasonStats(),

        careerStats: createDefaultSeasonStats()
    };
}


/* =========================================================
   DEFAULT EQUIPMENT
   ========================================================= */

function createDefaultEquipment() {

    return {

        equipped: {
            glove: null,
            shoes: null,
            bat: null,
            batting_gloves: null,
            protective_gear: null
        },

        inventory: []
    };
}


/* =========================================================
   DEFAULT GAME DATA
   ========================================================= */

function createDefaultGameData() {

    return {

        inning: 1,

        half: "top",

        outs: 0,

        balls: 0,

        strikes: 0,

        runsHome: 0,

        runsAway: 0,

        bases: {
            first: false,
            second: false,
            third: false
        },

        absReviewsRemaining: GAME_SETTINGS.absReviewsPerGame,

        currentPitchType: "four_seam",

        currentPitchLocation: {
            x: 0.5,
            y: 0.5
        },

        playInProgress: false,

        currentMode: null,

        lastCall: null,

        lastPlay: null
    };
}


/* =========================================================
   COMPLETE NEW PLAYER OBJECT
   ========================================================= */

function createNewPlayerObject(name, number, position, batHand, throwHand) {

    const team =
        MLB_TEAMS[
            Math.floor(Math.random() * MLB_TEAMS.length)
        ];

    return {

        version: 1,

        player: {

            name:
                name ||
                "New Player",

            number:
                Number(number) ||
                0,

            position:
                position ||
                "SS",

            batHand:
                batHand ||
                "R",

            throwHand:
                throwHand ||
                "R",

            level: 1,

            experience: 0,

            tokens: STARTING_TOKENS,

            stats: createDefaultStats(),

            createdAt: Date.now()
        },

        career: {

            ...createDefaultCareerData(),

            currentTeam: team.id
        },

        equipment:
            createDefaultEquipment(),

        game:
            createDefaultGameData(),

        settings: {

            language: "ko"
        }
    };
}


/* =========================================================
   UTILITY DATA FUNCTIONS
   ========================================================= */

function getTeamById(id) {

    return MLB_TEAMS.find(
        team => team.id === id
    ) || null;
}


function getPositionById(id) {

    return POSITIONS.find(
        position => position.id === id
    ) || POSITIONS[0];
}


function getCareerStageById(id) {

    return CAREER_STAGES.find(
        stage => stage.id === id
    ) || CAREER_STAGES[0];
}


function getEquipmentTypeById(id) {

    return EQUIPMENT_TYPES.find(
        type => type.id === id
    ) || null;
}


function getEquipmentRarityById(id) {

    return EQUIPMENT_RARITIES.find(
        rarity => rarity.id === id
    ) || EQUIPMENT_RARITIES[0];
}


function getPitchTypeById(id) {

    return PITCH_TYPES.find(
        pitch => pitch.id === id
    ) || PITCH_TYPES[0];
}


/* =========================================================
   LOCALIZED DATA HELPER
   ========================================================= */

function localized(data, language = "ko") {

    if (!data) {
        return "";
    }

    return (
        data[language] ||
        data.ko ||
        data.en ||
        data.ja ||
        ""
    );
}


/* =========================================================
   STAT TOTAL
   ========================================================= */

function calculateBaseOverall(stats) {

    if (!stats) {
        return 0;
    }

    const values = STAT_KEYS.map(
        key => Number(stats[key]) || 0
    );

    if (values.length === 0) {
        return 0;
    }

    const total =
        values.reduce(
            (sum, value) => sum + value,
            0
        );

    return Math.round(
        total / values.length
    );
}


/* =========================================================
   EQUIPMENT BONUS TOTAL
   ========================================================= */

function calculateEquipmentBonus(
    equipment,
    statKey
) {

    if (!equipment) {
        return 0;
    }

    let bonus = 0;

    const equipped =
        equipment.equipped || {};

    Object.keys(equipped).forEach(
        typeId => {

            const item =
                equipped[typeId];

            if (!item) {
                return;
            }

            if (item.stat !== statKey) {
                return;
            }

            bonus +=
                Number(item.bonus) || 0;
        }
    );

    return bonus;
}


/* =========================================================
   TOTAL STAT INCLUDING EQUIPMENT
   ========================================================= */

function calculateTotalStat(
    stats,
    equipment,
    statKey
) {

    const base =
        Number(
            stats &&
            stats[statKey]
        ) || 0;

    const bonus =
        calculateEquipmentBonus(
            equipment,
            statKey
        );

    return Math.min(
        DEVELOPMENT_SETTINGS.maxOverall,
        base + bonus
    );
}


/* =========================================================
   TOTAL OVERALL
   ========================================================= */

function calculateOverall(
    stats,
    equipment
) {

    if (!stats) {
        return 0;
    }

    const values =
        STAT_KEYS.map(
            statKey =>
                calculateTotalStat(
                    stats,
                    equipment,
                    statKey
                )
        );

    if (!values.length) {
        return 0;
    }

    return Math.round(
        values.reduce(
            (sum, value) =>
                sum + value,
            0
        ) / values.length
    );
}


/* =========================================================
   RANDOM NUMBER
   ========================================================= */

function randomInt(min, max) {

    return Math.floor(
        Math.random() *
            (max - min + 1)
    ) + min;
}


function randomFloat(min, max) {

    return (
        Math.random() *
            (max - min)
    ) + min;
}


/* =========================================================
   RANDOM RARITY
   ========================================================= */

function getRandomEquipmentRarity(
    playerLevel = 1
) {

    const available =
        EQUIPMENT_RARITIES.filter(
            rarity =>
                playerLevel >=
                (
                    EQUIPMENT_LEVEL_REQUIREMENTS[
                        rarity.id
                    ] || 1
                )
        );

    const totalWeight =
        available.reduce(
            (sum, rarity) =>
                sum + rarity.weight,
            0
        );

    let roll =
        Math.random() *
        totalWeight;

    for (const rarity of available) {

        roll -= rarity.weight;

        if (roll <= 0) {
            return rarity;
        }
    }

    return available[0];
}


/* =========================================================
   RANDOM EQUIPMENT
   ========================================================= */

function createRandomEquipment(
    playerLevel = 1
) {

    const type =
        EQUIPMENT_TYPES[
            Math.floor(
                Math.random() *
                EQUIPMENT_TYPES.length
            )
        ];

    const rarity =
        getRandomEquipmentRarity(
            playerLevel
        );

    const bonus =
        randomInt(
            rarity.minBonus,
            rarity.maxBonus
        );

    const names =
        EQUIPMENT_NAMES[type.id] ||
        ["Equipment"];

    const name =
        names[
            Math.floor(
                Math.random() *
                names.length
            )
        ];

    return {

        id:
            "equipment_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .slice(2, 8),

        type:
            type.id,

        stat:
            type.stat,

        name,

        rarity:
            rarity.id,

        bonus,

        createdAt:
            Date.now()
    };
}


/* =========================================================
   CONTRACT OFFER
   ========================================================= */

function createContractOffer(
    stageId,
    teamId,
    multiplier = 1
) {

    const range =
        SALARY_RANGES[
            stageId
        ] ||
        SALARY_RANGES.rookie;

    const base =
        randomInt(
            range.min,
            range.max
        );

    const salary =
        Math.round(
            base * multiplier
        );

    return {

        id:
            "offer_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .slice(2, 8),

        teamId,

        salary,

        years:
            stageId === "mlb"
                ? randomInt(1, 4)
                : randomInt(1, 2),

        stage:
            stageId,

        createdAt:
            Date.now()
    };
}


/* =========================================================
   CONTRACT OFFER SET
   ========================================================= */

function generateContractOffers(
    currentTeamId,
    stageId
) {

    const currentTeam =
        getTeamById(
            currentTeamId
        );

    const offers = [];

    if (currentTeam) {

        offers.push(
            createContractOffer(
                stageId,
                currentTeam.id,
                1
            )
        );
    }

    const otherTeams =
        MLB_TEAMS.filter(
            team =>
                team.id !==
                currentTeamId
        );

    const shuffled =
        [...otherTeams].sort(
            () =>
                Math.random() - 0.5
        );

    for (
        let i = 0;
        i < 3;
        i++
    ) {

        const team =
            shuffled[i];

        if (!team) {
            break;
        }

        const multiplier =
            CONTRACT_MULTIPLIERS[
                randomInt(
                    0,
                    CONTRACT_MULTIPLIERS.length - 1
                )
            ];

        offers.push(
            createContractOffer(
                stageId,
                team.id,
                multiplier
            )
        );
    }

    return offers;
}


/* =========================================================
   TRANSLATIONS
   ========================================================= */

const TEXT = {

    gameTitle: {
        ko: "RTTS 커리어",
        en: "RTTS Career",
        ja: "RTTS キャリア"
    },

    newCareer: {
        ko: "새 커리어",
        en: "New Career",
        ja: "新しいキャリア"
    },

    continueCareer: {
        ko: "이어하기",
        en: "Continue",
        ja: "続ける"
    },

    playerCreation: {
        ko: "선수 생성",
        en: "Create Player",
        ja: "選手作成"
    },

    playerName: {
        ko: "선수 이름",
        en: "Player Name",
        ja: "選手名"
    },

    number: {
        ko: "등번호",
        en: "Number",
        ja: "背番号"
    },

    position: {
        ko: "포지션",
        en: "Position",
        ja: "ポジション"
    },

    batHand: {
        ko: "타격 손",
        en: "Batting Hand",
        ja: "打席"
    },

    throwHand: {
        ko: "투구 손",
        en: "Throwing Hand",
        ja: "投球"
    },

    startingTokens: {
        ko: "시작 토큰",
        en: "Starting Tokens",
        ja: "初期トークン"
    },

    remainingTokens: {
        ko: "남은 토큰",
        en: "Remaining Tokens",
        ja: "残りトークン"
    },

    contact: {
        ko: "컨택",
        en: "Contact",
        ja: "コンタクト"
    },

    power: {
        ko: "파워",
        en: "Power",
        ja: "パワー"
    },

    clutch: {
        ko: "클러치",
        en: "Clutch",
        ja: "クラッチ"
    },

    baserunning: {
        ko: "주루",
        en: "Baserunning",
        ja: "走塁"
    },

    defense: {
        ko: "수비",
        en: "Defense",
        ja: "守備"
    },

    overall: {
        ko: "종합",
        en: "Overall",
        ja: "総合"
    },

    salary: {
        ko: "연봉",
        en: "Salary",
        ja: "年俸"
    },

    equipment: {
        ko: "장비",
        en: "Equipment",
        ja: "装備"
    },

    training: {
        ko: "훈련",
        en: "Training",
        ja: "トレーニング"
    },

    season: {
        ko: "시즌",
        en: "Season",
        ja: "シーズン"
    },

    save: {
        ko: "저장",
        en: "Save",
        ja: "保存"
    },

    game: {
        ko: "경기",
        en: "Game",
        ja: "試合"
    },

    swing: {
        ko: "스윙",
        en: "Swing",
        ja: "スイング"
    },

    throw: {
        ko: "송구",
        en: "Throw",
        ja: "送球"
    },

    run: {
        ko: "주루",
        en: "Run",
        ja: "走塁"
    },

    pitch: {
        ko: "투구",
        en: "Pitch",
        ja: "投球"
    },

    review: {
        ko: "ABS 판독",
        en: "ABS Review",
        ja: "ABS リビュー"
    },

    home: {
        ko: "홈",
        en: "Home",
        ja: "ホーム"
    },

    dashboard: {
        ko: "대시보드",
        en: "Dashboard",
        ja: "ダッシュボード"
    },

    noSave: {
        ko: "저장 데이터 없음",
        en: "No save data",
        ja: "セーブデータなし"
    }
};


/* =========================================================
   BAT / THROW HAND DATA
   ========================================================= */

const BAT_HANDS = [
    {
        id: "R",
        ko: "우타",
        en: "Right",
        ja: "右打ち"
    },
    {
        id: "L",
        ko: "좌타",
        en: "Left",
        ja: "左打ち"
    },
    {
        id: "S",
        ko: "스위치",
        en: "Switch",
        ja: "両打ち"
    }
];

const THROW_HANDS = [
    {
        id: "R",
        ko: "우투",
        en: "Right",
        ja: "右投げ"
    },
    {
        id: "L",
        ko: "좌투",
        en: "Left",
        ja: "左投げ"
    }
];


/* =========================================================
   BASEBALL FIELD
   ========================================================= */

const BASES = {

    home: {
        x: 0.5,
        y: 0.86
    },

    first: {
        x: 0.70,
        y: 0.64
    },

    second: {
        x: 0.50,
        y: 0.43
    },

    third: {
        x: 0.30,
        y: 0.64
    }
};


/* =========================================================
   GAME RESULT TYPES
   ========================================================= */

const PLAY_RESULTS = [

    "strikeout",

    "walk",

    "single",

    "double",

    "triple",

    "home_run",

    "foul",

    "flyout",

    "groundout",

    "lineout",

    "error",

    "hit_by_pitch"
];


/* =========================================================
   VERSION
   ========================================================= */

const GAME_VERSION = "1.0.0";
```
