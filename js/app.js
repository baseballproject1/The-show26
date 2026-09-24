```javascript
/* =========================================================
   THE SHOW STYLE - ORIGINAL RTTS BROWSER GAME
   js/app.js
   ========================================================= */

"use strict";

/* =========================================================
   GLOBAL STATE
   ========================================================= */

let gameState = null;

let currentLanguage =
    localStorage.getItem(SAVE_SETTINGS.languageKey) || "ko";

let activeCareerPage = "dashboardPage";

let currentGame = null;

let animationFrame = null;

let joystickStates = {
    batting: { x: 0, y: 0 },
    running: { x: 0, y: 0 },
    fielding: { x: 0, y: 0 }
};


/* =========================================================
   DOM HELPERS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}

function $all(selector) {
    return [...document.querySelectorAll(selector)];
}

function show(element) {
    if (!element) return;
    element.classList.remove("hidden");
}

function hide(element) {
    if (!element) return;
    element.classList.add("hidden");
}

function setText(id, value) {
    const element = $(id);
    if (element) {
        element.textContent = value;
    }
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function formatMoney(value) {
    return "$" + Number(value || 0).toLocaleString("en-US");
}


/* =========================================================
   LANGUAGE
   ========================================================= */

function t(key) {
    const item = TEXT[key];

    if (!item) {
        return key;
    }

    return (
        item[currentLanguage] ||
        item.ko ||
        item.en ||
        key
    );
}

function localizedName(data) {
    return localized(data, currentLanguage);
}

function setLanguage(language) {

    if (!LANGUAGES[language]) {
        language = "ko";
    }

    currentLanguage = language;

    localStorage.setItem(
        SAVE_SETTINGS.languageKey,
        language
    );

    updateAllText();
    updateTopBar();

    if (gameState) {
        renderCareer();
    }
}

function createLanguageSelector() {

    const topbar = $("topBar");

    if (!topbar) {
        return;
    }

    if ($("languageSelector")) {
        return;
    }

    const wrapper =
        document.createElement("div");

    wrapper.id = "languageSelector";

    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "5px";
    wrapper.style.marginLeft = "8px";

    const select =
        document.createElement("select");

    select.id = "languageSelect";

    select.style.minHeight = "30px";
    select.style.padding = "4px 7px";
    select.style.background = "#151c26";
    select.style.color = "#fff";
    select.style.border = "1px solid #344152";
    select.style.borderRadius = "7px";
    select.style.fontSize = "11px";

    Object.entries(LANGUAGES).forEach(
        ([id, language]) => {

            const option =
                document.createElement("option");

            option.value = id;

            option.textContent =
                language.flag +
                " " +
                language.name;

            if (id === currentLanguage) {
                option.selected = true;
            }

            select.appendChild(option);
        }
    );

    select.addEventListener(
        "change",
        event => {
            setLanguage(event.target.value);
        }
    );

    wrapper.appendChild(select);

    topbar.appendChild(wrapper);
}

function updateAllText() {

    if ($("gameLogo")) {
        $("gameLogo").textContent =
            t("gameTitle");
    }

    if ($("newCareerButton")) {
        $("newCareerButton").textContent =
            t("newCareer");
    }

    if ($("continueButton")) {
        $("continueButton").textContent =
            t("continueCareer");
    }

    if ($("createPlayerButton")) {
        $("createPlayerButton").textContent =
            t("playerCreation");
    }

    if ($("equipmentDrawButton")) {
        $("equipmentDrawButton").textContent =
            t("equipment");
    }

    if ($("trainingButton")) {
        $("trainingButton").textContent =
            t("training");
    }

    if ($("salaryNegotiationButton")) {
        $("salaryNegotiationButton").textContent =
            t("salary");
    }

    if ($("swingButton")) {
        $("swingButton").textContent =
            t("swing");
    }

    if ($("runActionButton")) {
        $("runActionButton").textContent =
            t("run");
    }

    if ($("throwButton")) {
        $("throwButton").textContent =
            t("throw");
    }

    if ($("pitchButton")) {
        $("pitchButton").textContent =
            t("pitch");
    }

    if ($("absButton")) {
        $("absButton").textContent =
            t("review");
    }
}


/* =========================================================
   SCREEN MANAGEMENT
   ========================================================= */

function showScreen(id) {

    $all(".screen").forEach(
        screen => hide(screen)
    );

    const target = $(id);

    if (target) {
        show(target);
    }
}

function showHome() {
    showScreen("homeScreen");
}

function showCreateScreen() {
    showScreen("createScreen");
}

function showCareerScreen() {

    if (!gameState) {
        showHome();
        return;
    }

    showScreen("careerScreen");

    renderCareer();
}

function showGameScreen() {

    showScreen("gameScreen");

    startBaseGame();
}


/* =========================================================
   NEW PLAYER
   ========================================================= */

function createNewCareer() {

    const name =
        $("playerNameInput")?.value.trim() ||
        "Rookie";

    const number =
        clamp(
            Number(
                $("playerNumberInput")?.value || 1
            ),
            0,
            99
        );

    const position =
        $("playerPositionInput")?.value ||
        "SS";

    const batHand =
        $("batHandInput")?.value ||
        "R";

    const throwHand =
        $("throwHandInput")?.value ||
        "R";

    gameState =
        createNewPlayerObject(
            name,
            number,
            position,
            batHand,
            throwHand
        );

    const statInputs =
        $all(
            "#statAllocator input[data-stat]"
        );

    let spent = 0;

    statInputs.forEach(
        input => {

            const stat =
                input.dataset.stat;

            const value =
                clamp(
                    Number(input.value || 0),
                    STAT_MIN,
                    STAT_MAX
                );

            gameState.player.stats[stat] =
                value;

            spent += value;
        }
    );

    gameState.player.tokens =
        Math.max(
            0,
            STARTING_TOKENS - spent
        );

    gameState.settings.language =
        currentLanguage;

    updateAllDisplays();

    showCareerScreen();

    saveToSlot(1, true);
}


/* =========================================================
   STAT ALLOCATION
   ========================================================= */

function setupStatAllocator() {

    const allocator =
        $("statAllocator");

    if (!allocator) {
        return;
    }

    allocator.innerHTML = "";

    STAT_KEYS.forEach(
        stat => {

            const row =
                document.createElement("div");

            row.className = "stat-row";

            const label =
                document.createElement("span");

            label.textContent =
                localizedName(
                    STAT_NAMES[stat]
                );

            const range =
                document.createElement("input");

            range.type = "range";
            range.min = "0";
            range.max = "100";
            range.value = "0";

            range.dataset.stat =
                stat;

            const value =
                document.createElement("span");

            value.className =
                "stat-value";

            value.textContent = "0";

            range.addEventListener(
                "input",
                () => {

                    updateStatAllocation(
                        range,
                        value
                    );
                }
            );

            row.appendChild(label);
            row.appendChild(range);
            row.appendChild(value);

            allocator.appendChild(row);
        }
    );

    updateRemainingTokens();
}

function updateStatAllocation(
    changedInput,
    valueElement
) {

    let total = 0;

    const inputs =
        $all(
            "#statAllocator input[data-stat]"
        );

    inputs.forEach(
        input => {
            total += Number(input.value);
        }
    );

    if (total > STARTING_TOKENS) {

        const excess =
            total - STARTING_TOKENS;

        changedInput.value =
            Math.max(
                0,
                Number(changedInput.value) -
                    excess
            );
    }

    valueElement.textContent =
        changedInput.value;

    updateRemainingTokens();
}

function updateRemainingTokens() {

    const inputs =
        $all(
            "#statAllocator input[data-stat]"
        );

    let total = 0;

    inputs.forEach(
        input => {
            total += Number(input.value || 0);
        }
    );

    const remaining =
        STARTING_TOKENS - total;

    setText(
        "remainingTokenDisplay",
        remaining
    );
}


/* =========================================================
   CAREER RENDERING
   ========================================================= */

function renderCareer() {

    if (!gameState) {
        return;
    }

    const player =
        gameState.player;

    const career =
        gameState.career;

    const team =
        getTeamById(
            career.currentTeam
        );

    const stage =
        getCareerStageById(
            career.stage
        );

    setText(
        "careerStageText",
        localizedName(stage)
    );

    setText(
        "careerPlayerName",
        player.name
    );

    setText(
        "careerTeamText",
        team
            ? team.name
            : "-"
    );

    const overall =
        calculateOverall(
            player.stats,
            gameState.equipment
        );

    setText(
        "overallValue",
        overall
    );

    updatePlayerStats();

    updateCareerInformation();

    updateNextGameInformation();

    renderEquipment();

    renderSeason();

    renderSaveSlots();

    updateTopBar();

    switchCareerPage(
        activeCareerPage
    );
}


/* =========================================================
   PLAYER STATS
   ========================================================= */

function updatePlayerStats() {

    const container =
        $("playerStats");

    if (!container || !gameState) {
        return;
    }

    container.innerHTML = "";

    STAT_KEYS.forEach(
        stat => {

            const card =
                document.createElement("div");

            card.className =
                "stat-card";

            const label =
                document.createElement("span");

            label.className =
                "label";

            label.textContent =
                localizedName(
                    STAT_NAMES[stat]
                );

            const value =
                document.createElement("span");

            value.className =
                "value";

            value.textContent =
                calculateTotalStat(
                    gameState.player.stats,
                    gameState.equipment,
                    stat
                );

            card.appendChild(label);
            card.appendChild(value);

            container.appendChild(card);
        }
    );
}


/* =========================================================
   CAREER INFORMATION
   ========================================================= */

function updateCareerInformation() {

    const container =
        $("careerInformation");

    if (!container || !gameState) {
        return;
    }

    const career =
        gameState.career;

    const team =
        getTeamById(
            career.currentTeam
        );

    const rows = [
        [
            "팀",
            team
                ? team.name
                : "-"
        ],
        [
            "시즌",
            career.seasonNumber
        ],
        [
            "경기",
            career.gameNumber
        ],
        [
            "연봉",
            formatMoney(
                career.currentSalary
            )
        ],
        [
            "통산 수입",
            formatMoney(
                career.careerEarnings
            )
        ]
    ];

    container.innerHTML = "";

    rows.forEach(
        row => {

            const element =
                document.createElement("div");

            element.className =
                "info-row";

            element.innerHTML = `
                <span class="label">${row[0]}</span>
                <span class="value">${row[1]}</span>
            `;

            container.appendChild(element);
        }
    );
}


/* =========================================================
   NEXT GAME
   ========================================================= */

function updateNextGameInformation() {

    const container =
        $("nextGameInformation");

    if (!container || !gameState) {
        return;
    }

    const career =
        gameState.career;

    const stage =
        getCareerStageById(
            career.stage
        );

    const games =
        stage.league === "MLB"
            ? SEASON_SETTINGS.mlbGames
            : SEASON_SETTINGS.minorGames;

    container.innerHTML = `
        <div class="info-row">
            <span class="label">리그</span>
            <span class="value">
                ${localizedName(stage)}
            </span>
        </div>

        <div class="info-row">
            <span class="label">다음 경기</span>
            <span class="value">
                ${Math.min(
                    career.gameNumber,
                    games
                )} / ${games}
            </span>
        </div>

        <div class="info-row">
            <span class="label">ABS</span>
            <span class="value">
                ${GAME_SETTINGS.absReviewsPerGame} / ${GAME_SETTINGS.absReviewsPerGame}
            </span>
        </div>
    `;
}


/* =========================================================
   TOP BAR
   ========================================================= */

function updateTopBar() {

    if (!gameState) {
        return;
    }

    const player =
        gameState.player;

    const career =
        gameState.career;

    const team =
        getTeamById(
            career.currentTeam
        );

    const stage =
        getCareerStageById(
            career.stage
        );

    setText(
        "topTeam",
        team
            ? team.short
            : "-"
    );

    setText(
        "topLevel",
        localizedName(stage)
    );

    setText(
        "topSalary",
        formatMoney(
            career.currentSalary
        )
    );
}


/* =========================================================
   CAREER NAVIGATION
   ========================================================= */

function setupCareerNavigation() {

    $all(".careerTab").forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    const page =
                        tab.dataset.page;

                    switchCareerPage(
                        page
                    );
                }
            );
        }
    );
}

function switchCareerPage(page) {

    activeCareerPage =
        page;

    $all(".careerTab").forEach(
        tab => {

            tab.classList.toggle(
                "active",
                tab.dataset.page === page
            );
        }
    );

    $all(".careerScreen .page, #careerScreen .page").forEach(
        element => {
            hide(element);
        }
    );

    const target =
        $(page);

    if (target) {
        show(target);
    }
}


/* =========================================================
   EQUIPMENT
   ========================================================= */

function drawEquipment() {

    if (!gameState) {
        return;
    }

    const salary =
        gameState.career.currentSalary;

    if (salary < EQUIPMENT_DRAW_COST) {

        setText(
            "equipmentResult",
            "연봉 잔액이 부족합니다."
        );

        return;
    }

    gameState.career.currentSalary -=
        EQUIPMENT_DRAW_COST;

    const item =
        createRandomEquipment(
            gameState.player.level
        );

    gameState.equipment.inventory.push(
        item
    );

    renderEquipment();

    updateTopBar();

    setText(
        "equipmentResult",
        `${item.name} [${localizedName(
            getEquipmentRarityById(
                item.rarity
            )
        )}] +${item.bonus}`
    );
}

function renderEquipment() {

    const list =
        $("equipmentList");

    if (!list || !gameState) {
        return;
    }

    list.innerHTML = "";

    const equipped =
        gameState.equipment.equipped;

    EQUIPMENT_TYPES.forEach(
        type => {

            const current =
                equipped[type.id];

            const card =
                document.createElement("div");

            card.className =
                "equipment-card" +
                (current
                    ? " equipped"
                    : "");

            let html = `
                <h3>${localizedName(type)}</h3>
            `;

            if (current) {

                const rarity =
                    getEquipmentRarityById(
                        current.rarity
                    );

                html += `
                    <div class="equipment-type">
                        장착 중
                    </div>

                    <div class="equipment-rarity ${rarity.colorClass}">
                        ${localizedName(rarity)}
                    </div>

                    <div class="equipment-bonus">
                        +${current.bonus}
                    </div>

                    <div class="small">
                        ${current.name}
                    </div>
                `;
            } else {

                html += `
                    <div class="equipment-type">
                        미장착
                    </div>
                `;
            }

            const matchingItems =
                gameState.equipment.inventory
                    .filter(
                        item =>
                            item.type === type.id
                    );

            if (matchingItems.length) {

                const button =
                    document.createElement(
                        "button"
                    );

                button.className =
                    "small-button";

                button.style.marginTop =
                    "10px";

                button.textContent =
                    `보유 ${matchingItems.length}개`;

                button.addEventListener(
                    "click",
                    () => {
                        openEquipmentPicker(
                            type.id
                        );
                    }
                );

                card.innerHTML = html;

                card.appendChild(button);

            } else {

                card.innerHTML = html;
            }

            list.appendChild(card);
        }
    );

    setText(
        "equipmentSalary",
        formatMoney(
            gameState.career.currentSalary
        )
    );
}

function openEquipmentPicker(typeId) {

    const items =
        gameState.equipment.inventory
            .filter(
                item =>
                    item.type === typeId
            );

    if (!items.length) {
        return;
    }

    const item =
        items[items.length - 1];

    equipItem(item.id);
}

function equipItem(itemId) {

    const index =
        gameState.equipment.inventory
            .findIndex(
                item =>
                    item.id === itemId
            );

    if (index < 0) {
        return;
    }

    const item =
        gameState.equipment.inventory[index];

    const old =
        gameState.equipment
            .equipped[item.type];

    if (old) {

        gameState.equipment.inventory
            .push(old);
    }

    gameState.equipment
        .equipped[item.type] =
        item;

    gameState.equipment.inventory
        .splice(index, 1);

    renderEquipment();

    updatePlayerStats();

    updateTopBar();

    renderCareer();
}


/* =========================================================
   TRAINING
   ========================================================= */

function trainPlayer() {

    if (!gameState) {
        return;
    }

    const success =
        Math.random() <=
        TRAINING_SUCCESS_RATE;

    if (!success) {

        setText(
            "trainingResult",
            "훈련 실패! 다음 훈련에서 다시 도전하세요."
        );

        return;
    }

    gameState.player.tokens +=
        TRAINING_TOKEN_REWARD;

    setText(
        "trainingResult",
        "+1 토큰 획득! 선수 능력치에 직접 배분할 수 있습니다."
    );

    updateTopBar();

    renderCareer();
}


/* =========================================================
   MANUAL TOKEN ALLOCATION AFTER TRAINING
   ========================================================= */

function allocateTrainingToken(statKey) {

    if (!gameState) {
        return false;
    }

    if (
        !STAT_KEYS.includes(statKey)
    ) {
        return false;
    }

    if (
        gameState.player.tokens <= 0
    ) {
        return false;
    }

    if (
        gameState.player.stats[statKey] >=
        DEVELOPMENT_SETTINGS.statSoftCap
    ) {
        return false;
    }

    gameState.player.stats[statKey]++;

    gameState.player.tokens--;

    renderCareer();

    return true;
}


/* =========================================================
   SEASON
   ========================================================= */

function renderSeason() {

    const container =
        $("seasonStatistics");

    if (!container || !gameState) {
        return;
    }

    const stats =
        gameState.career.seasonStats;

    const values = [
        ["경기", stats.games],
        ["타수", stats.atBats],
        ["안타", stats.hits],
        ["홈런", stats.homeRuns],
        ["타점", stats.rbi],
        ["타율", stats.battingAverage.toFixed(3)],
        ["출루율", stats.onBasePercentage.toFixed(3)],
        ["장타율", stats.sluggingPercentage.toFixed(3)]
    ];

    container.innerHTML = "";

    values.forEach(
        ([label, value]) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "season-stat";

            card.innerHTML = `
                <span class="label">${label}</span>
                <span class="value">${value}</span>
            `;

            container.appendChild(card);
        }
    );
}


/* =========================================================
   START SALARY NEGOTIATION
   ========================================================= */

function startSalaryNegotiation() {

    if (!gameState) {
        return;
    }

    const stage =
        gameState.career.stage;

    const currentTeam =
        gameState.career.currentTeam;

    const offers =
        generateContractOffers(
            currentTeam,
            stage
        );

    renderContractOffers(
        offers
    );
}

function renderContractOffers(offers) {

    const container =
        $("contractOffers");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    offers.forEach(
        offer => {

            const team =
                getTeamById(
                    offer.teamId
                );

            const box =
                document.createElement(
                    "div"
                );

            box.className =
                "contract-offer";

            const info =
                document.createElement(
                    "div"
                );

            info.innerHTML = `
                <div class="contract-team">
                    ${team ? team.name : offer.teamId}
                </div>

                <div class="contract-money">
                    ${formatMoney(offer.salary)}
                </div>

                <div class="small">
                    ${offer.years}년 계약
                </div>
            `;

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "primary-button";

            button.style.width =
                "auto";

            button.textContent =
                "계약";

            button.addEventListener(
                "click",
                () => {

                    acceptContract(
                        offer
                    );
                }
            );

            box.appendChild(info);
            box.appendChild(button);

            container.appendChild(box);
        }
    );
}

function acceptContract(offer) {

    if (!gameState) {
        return;
    }

    const oldTeam =
        gameState.career.currentTeam;

    if (
        oldTeam &&
        oldTeam !== offer.teamId
    ) {
        gameState.career.previousTeams
            .push(oldTeam);
    }

    gameState.career.currentTeam =
        offer.teamId;

    gameState.career.currentSalary =
        offer.salary;

    gameState.career.careerEarnings +=
        offer.salary;

    gameState.career.seasonNumber++;

    gameState.career.gameNumber = 1;

    gameState.career.seasonStats =
        createDefaultSeasonStats();

    updateCareerStage();

    renderCareer();

    setText(
        "saveMessage",
        "계약이 완료되었습니다."
    );
}


/* =========================================================
   CAREER PROMOTION
   ========================================================= */

function updateCareerStage() {

    if (!gameState) {
        return;
    }

    const overall =
        calculateOverall(
            gameState.player.stats,
            gameState.equipment
        );

    const currentIndex =
        CAREER_STAGES.findIndex(
            stage =>
                stage.id ===
                gameState.career.stage
        );

    let bestStage =
        gameState.career.stage;

    CAREER_STAGES.forEach(
        stage => {

            if (
                stage.requiredOverall <=
                overall
            ) {

                const stageIndex =
                    CAREER_STAGES.findIndex(
                        s =>
                            s.id ===
                            stage.id
                    );

                if (
                    stageIndex >
                    currentIndex
                ) {
                    bestStage =
                        stage.id;
                }
            }
        }
    );

    gameState.career.stage =
        bestStage;

    gameState.player.level =
        getCareerStageById(
            bestStage
        ).level;
}


/* =========================================================
   SAVE SYSTEM
   ========================================================= */

function saveToSlot(
    slot,
    silent = false
) {

    if (!gameState) {
        return false;
    }

    if (
        slot < 1 ||
        slot > SAVE_SETTINGS.slots
    ) {
        return false;
    }

    const saveData =
        JSON.parse(
            JSON.stringify(
                gameState
            )
        );

    saveData.settings.language =
        currentLanguage;

    saveData.savedAt =
        Date.now();

    localStorage.setItem(
        SAVE_SETTINGS.storagePrefix +
            slot,
        JSON.stringify(
            saveData
        )
    );

    renderSaveSlots();

    if (!silent) {

        setText(
            "saveMessage",
            `슬롯 ${slot}에 저장했습니다.`
        );
    }

    return true;
}

function loadFromSlot(slot) {

    if (
        slot < 1 ||
        slot > SAVE_SETTINGS.slots
    ) {
        return false;
    }

    const raw =
        localStorage.getItem(
            SAVE_SETTINGS.storagePrefix +
                slot
        );

    if (!raw) {

        setText(
            "saveMessage",
            `슬롯 ${slot}에 저장 데이터가 없습니다.`
        );

        return false;
    }

    try {

        gameState =
            JSON.parse(raw);

        currentLanguage =
            gameState.settings?.language ||
            currentLanguage;

        localStorage.setItem(
            SAVE_SETTINGS.languageKey,
            currentLanguage
        );

        repairLoadedState();

        showCareerScreen();

        setText(
            "saveMessage",
            `슬롯 ${slot}을 불러왔습니다.`
        );

        return true;

    } catch (error) {

        console.error(
            "Save load error:",
            error
        );

        setText(
            "saveMessage",
            "저장 데이터를 불러오지 못했습니다."
        );

        return false;
    }
}

function repairLoadedState() {

    if (!gameState.player) {
        gameState.player = {
            name: "Rookie",
            number: 1,
            position: "SS",
            batHand: "R",
            throwHand: "R",
            level: 1,
            experience: 0,
            tokens: 0,
            stats: createDefaultStats()
        };
    }

    if (!gameState.player.stats) {
        gameState.player.stats =
            createDefaultStats();
    }

    STAT_KEYS.forEach(
        stat => {

            if (
                typeof gameState.player.stats[stat] !==
                "number"
            ) {
                gameState.player.stats[stat] = 0;
            }
        }
    );

    if (!gameState.career) {
        gameState.career =
            createDefaultCareerData();
    }

    if (!gameState.career.seasonStats) {
        gameState.career.seasonStats =
            createDefaultSeasonStats();
    }

    if (!gameState.career.careerStats) {
        gameState.career.careerStats =
            createDefaultSeasonStats();
    }

    if (!gameState.equipment) {
        gameState.equipment =
            createDefaultEquipment();
    }

    if (!gameState.equipment.equipped) {
        gameState.equipment.equipped = {
            glove: null,
            shoes: null,
            bat: null,
            batting_gloves: null,
            protective_gear: null
        };
    }

    if (!Array.isArray(
        gameState.equipment.inventory
    )) {
        gameState.equipment.inventory = [];
    }

    if (!gameState.game) {
        gameState.game =
            createDefaultGameData();
    }

    updateCareerStage();
}

function deleteSaveSlot(slot) {

    localStorage.removeItem(
        SAVE_SETTINGS.storagePrefix +
            slot
    );

    renderSaveSlots();

    setText(
        "saveMessage",
        `슬롯 ${slot}을 삭제했습니다.`
    );
}

function renderSaveSlots() {

    const container =
        $("savePage");

    if (!container) {
        return;
    }

    const existing =
        container.querySelector(
            ".dynamic-save-slots"
        );

    if (existing) {
        existing.remove();
    }

    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.className =
        "dynamic-save-slots";

    wrapper.style.display =
        "grid";

    wrapper.style.gridTemplateColumns =
        "repeat(3, minmax(0, 1fr))";

    wrapper.style.gap = "12px";

    wrapper.style.marginTop = "18px";

    for (
        let slot = 1;
        slot <= SAVE_SETTINGS.slots;
        slot++
    ) {

        const raw =
            localStorage.getItem(
                SAVE_SETTINGS.storagePrefix +
                    slot
            );

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "save-slot";

        let info =
            t("noSave");

        if (raw) {

            try {

                const data =
                    JSON.parse(raw);

                const savedPlayer =
                    data.player?.name ||
                    "Player";

                info =
                    `${savedPlayer}<br>` +
                    `${data.career?.seasonNumber || 1}시즌`;

            } catch {
                info =
                    "저장 데이터 오류";
            }
        }

        card.innerHTML = `
            <div class="save-slot-title">
                슬롯 ${slot}
            </div>

            <div class="save-slot-info">
                ${info}
            </div>
        `;

        const buttons =
            document.createElement(
                "div"
            );

        buttons.className =
            "button-row";

        const saveButton =
            document.createElement(
                "button"
            );

        saveButton.className =
            "small-button";

        saveButton.textContent =
            "저장";

        saveButton.addEventListener(
            "click",
            () => saveToSlot(slot)
        );

        const loadButton =
            document.createElement(
                "button"
            );

        loadButton.className =
            "small-button";

        loadButton.textContent =
            "불러오기";

        loadButton.addEventListener(
            "click",
            () => loadFromSlot(slot)
        );

        const deleteButton =
            document.createElement(
                "button"
            );

        deleteButton.className =
            "danger-button";

        deleteButton.textContent =
            "삭제";

        deleteButton.addEventListener(
            "click",
            () => deleteSaveSlot(slot)
        );

        buttons.appendChild(saveButton);
        buttons.appendChild(loadButton);

        card.appendChild(buttons);
        card.appendChild(deleteButton);

        wrapper.appendChild(card);
    }

    container.appendChild(wrapper);
}


/* =========================================================
   GAME START
   ========================================================= */

function startBaseGame() {

    if (!gameState) {
        return;
    }

    stopAnimation();

    currentGame = {
        type: "batting",

        pitch: null,

        pitchStartTime: 0,

        pitchDuration: 1100,

        ballPosition: {
            x: 0.5,
            y: 0.5
        },

        battingCursor: {
            x: 0.5,
            y: 0.5
        },

        fieldingPlayer: {
            x: 0.5,
            y: 0.65
        },

        fieldingBall: {
            x: 0.5,
            y: 0.35
        },

        throwAim: {
            x: 0.5,
            y: 0.5
        },

        runner: {
            x: 0.5,
            y: 0.86,
            base: "home"
        },

        runningTarget: null,

        lastFrame: performance.now(),

        active: true
    };

    resetGameCounts();

    showGameMode(
        "battingMode"
    );

    updateGameUI();

    startPitch();
}

function resetGameCounts() {

    gameState.game =
        createDefaultGameData();

    gameState.game.absReviewsRemaining =
        GAME_SETTINGS.absReviewsPerGame;
}


/* =========================================================
   GAME MODE
   ========================================================= */

function showGameMode(modeId) {

    $all(".mode").forEach(
        mode => hide(mode)
    );

    const mode =
        $(modeId);

    if (mode) {
        show(mode);
    }

    if (currentGame) {

        currentGame.type =
            modeId.replace(
                "Mode",
                ""
            );
    }
}


/* =========================================================
   GAME UI
   ========================================================= */

function updateGameUI() {

    if (!gameState) {
        return;
    }

    const game =
        gameState.game;

    const score =
        `${game.runsAway} - ${game.runsHome}`;

    setText(
        "gameSituation",
        `INNING ${game.inning} ${
            game.half === "top"
                ? "▲"
                : "▼"
        } | OUT ${game.outs} | ${game.balls}-${game.strikes} | ${score}`
    );

    setText(
        "absDisplay",
        `ABS ${game.absReviewsRemaining}/${GAME_SETTINGS.absReviewsPerGame}`
    );
}


/* =========================================================
   PITCH
   ========================================================= */

function startPitch() {

    if (
        !currentGame ||
        !currentGame.active
    ) {
        return;
    }

    currentGame.pitch = {
        type:
            getPitchTypeById(
                gameState.game.currentPitchType
            ),

        target: {
            x: randomFloat(
                0.32,
                0.68
            ),

            y: randomFloat(
                0.30,
                0.70
            )
        }
    };

    currentGame.ballPosition = {
        x: 0.5,
        y: 0.5
    };

    currentGame.pitchStartTime =
        performance.now();

    currentGame.pitchDuration =
        clamp(
            1200 -
                (
                    currentGame.pitch.type.speed *
                    3
                ),
            650,
            1100
        );

    runGameLoop();
}


/* =========================================================
   GAME LOOP
   ========================================================= */

function runGameLoop() {

    stopAnimation();

    const loop = now => {

        if (
            !currentGame ||
            !currentGame.active
        ) {
            return;
        }

        const delta =
            now -
            currentGame.lastFrame;

        currentGame.lastFrame =
            now;

        updateGameMode(
            delta,
            now
        );

        drawCurrentMode();

        animationFrame =
            requestAnimationFrame(loop);
    };

    currentGame.lastFrame =
        performance.now();

    animationFrame =
        requestAnimationFrame(loop);
}

function stopAnimation() {

    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;
    }
}


/* =========================================================
   UPDATE GAME MODE
   ========================================================= */

function updateGameMode(
    delta,
    now
) {

    if (!currentGame) {
        return;
    }

    if (
        currentGame.type ===
        "batting"
    ) {

        updateBatting(
            delta,
            now
        );
    }

    if (
        currentGame.type ===
        "running"
    ) {

        updateRunning(
            delta
        );
    }

    if (
        currentGame.type ===
        "fielding"
    ) {

        updateFielding(
            delta
        );
    }

    if (
        currentGame.type ===
        "pitching"
    ) {

        updatePitching(
            delta
        );
    }
}


/* =========================================================
   CANVAS HELPERS
   ========================================================= */

function getCanvasContext(id) {

    const canvas =
        $(id);

    if (!canvas) {
        return null;
    }

    const ctx =
        canvas.getContext("2d");

    if (!ctx) {
        return null;
    }

    const rect =
        canvas.getBoundingClientRect();

    const dpr =
        Math.max(
            1,
            window.devicePixelRatio || 1
        );

    const width =
        Math.floor(
            rect.width * dpr
        );

    const height =
        Math.floor(
            rect.height * dpr
        );

    if (
        canvas.width !== width ||
        canvas.height !== height
    ) {

        canvas.width =
            width;

        canvas.height =
            height;
    }

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    return {
        ctx,
        width: rect.width,
        height: rect.height
    };
}


/* =========================================================
   DRAW CURRENT MODE
   ========================================================= */

function drawCurrentMode() {

    if (!currentGame) {
        return;
    }

    if (
        currentGame.type ===
        "batting"
    ) {
        drawBatting();
    }

    if (
        currentGame.type ===
        "running"
    ) {
        drawRunning();
    }

    if (
        currentGame.type ===
        "fielding"
    ) {
        drawFielding();
    }

    if (
        currentGame.type ===
        "pitching"
    ) {
        drawPitching();
    }
}


/* =========================================================
   BATTING UPDATE
   ========================================================= */

function updateBatting(
    delta,
    now
) {

    if (!currentGame.pitch) {
        return;
    }

    const elapsed =
        now -
        currentGame.pitchStartTime;

    const progress =
        clamp(
            elapsed /
                currentGame.pitchDuration,
            0,
            1
        );

    const startX = 0.5;
    const startY = 0.50;

    const target =
        currentGame.pitch.target;

    currentGame.ballPosition.x =
        startX +
        (
            target.x -
            startX
        ) *
        progress;

    currentGame.ballPosition.y =
        startY +
        (
            target.y -
            startY
        ) *
        progress;

    if (progress >= 1) {

        handlePitchTaken();
    }
}


/* =========================================================
   DRAW BATTING
   ========================================================= */

function drawBatting() {

    const result =
        getCanvasContext(
            "battingCanvas"
        );

    if (!result || !currentGame) {
        return;
    }

    const {
        ctx,
        width,
        height
    } = result;

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    drawStadiumBackground(
        ctx,
        width,
        height
    );

    const zoneW =
        Math.min(
            330,
            width * 0.48
        );

    const zoneH =
        Math.min(
            430,
            height * 0.60
        );

    const zoneX =
        width / 2 -
        zoneW / 2;

    const zoneY =
        height / 2 -
        zoneH / 2;

    ctx.strokeStyle =
        "rgba(255,255,255,.65)";

    ctx.lineWidth = 2;

    ctx.strokeRect(
        zoneX,
        zoneY,
        zoneW,
        zoneH
    );

    ctx.strokeStyle =
        "rgba(255,255,255,.25)";

    ctx.strokeRect(
        zoneX + zoneW * 0.2,
        zoneY + zoneH * 0.2,
        zoneW * 0.6,
        zoneH * 0.6
    );

    const ballX =
        currentGame.ballPosition.x *
        width;

    const ballY =
        currentGame.ballPosition.y *
        height;

    ctx.beginPath();

    ctx.arc(
        ballX,
        ballY,
        8,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "white";
    ctx.fill();

    const cursorX =
        currentGame.battingCursor.x *
        width;

    const cursorY =
        currentGame.battingCursor.y *
        height;

    ctx.strokeStyle =
        "#4da3ff";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.arc(
        cursorX,
        cursorY,
        25,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        cursorX - 32,
        cursorY
    );

    ctx.lineTo(
        cursorX + 32,
        cursorY
    );

    ctx.moveTo(
        cursorX,
        cursorY - 32
    );

    ctx.lineTo(
        cursorX,
        cursorY + 32
    );

    ctx.stroke();
}


/* =========================================================
   STADIUM BACKGROUND
   ========================================================= */

function drawStadiumBackground(
    ctx,
    width,
    height
) {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            height
        );

    gradient.addColorStop(
        0,
        "#13243a"
    );

    gradient.addColorStop(
        0.45,
        "#315e37"
    );

    gradient.addColorStop(
        1,
        "#15351d"
    );

    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );

    ctx.fillStyle =
        "rgba(255,255,255,.08)";

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        ctx.fillRect(
            i *
                width /
                12,
            height * 0.12,
            width / 24,
            height * 0.08
        );
    }
}


/* =========================================================
   SWING
   ========================================================= */

function swingBat() {

    if (
        !currentGame ||
        currentGame.type !==
            "batting" ||
        !currentGame.pitch
    ) {
        return;
    }

    const ball =
        currentGame.ballPosition;

    const cursor =
        currentGame.battingCursor;

    const distance =
        Math.hypot(
            ball.x - cursor.x,
            ball.y - cursor.y
        );

    const elapsed =
        performance.now() -
        currentGame.pitchStartTime;

    const timingError =
        Math.abs(
            elapsed -
                currentGame.pitchDuration *
                    0.88
        ) /
        currentGame.pitchDuration;

    const contactStat =
        calculateTotalStat(
            gameState.player.stats,
            gameState.equipment,
            "contact"
        );

    const powerStat =
        calculateTotalStat(
            gameState.player.stats,
            gameState.equipment,
            "power"
        );

    const clutchStat =
        calculateTotalStat(
            gameState.player.stats,
            gameState.equipment,
            "clutch"
        );

    let quality =
        1 -
        distance * 2.1 -
        timingError * 2;

    quality +=
        contactStat /
        100 *
        0.25;

    quality +=
        clutchStat /
        100 *
        0.08;

    quality =
        clamp(
            quality,
            0,
            1
        );

    resolveSwing(
        quality,
        powerStat
    );
}


/* =========================================================
   RESOLVE SWING
   ========================================================= */

function resolveSwing(
    quality,
    powerStat
) {

    stopAnimation();

    currentGame.pitch =
        null;

    const roll =
        Math.random();

    const batting =
        gameState.career.seasonStats;

    batting.plateAppearances++;
    batting.atBats++;

    if (quality < 0.18) {

        batting.strikeouts++;

        gameState.game.strikes++;

        showGameMessage(
            "스윙 미스! 스트라이크"
        );

        if (
            gameState.game.strikes >=
            GAME_SETTINGS.strikesPerAtBat
        ) {

            finishAtBat(
                "strikeout"
            );

        } else {

            setTimeout(
                startPitch,
                550
            );
        }

        return;
    }

    if (
        roll <
        0.05 +
        quality * 0.10
    ) {

        recordHit(
            "home_run",
            powerStat
        );

        return;
    }

    if (
        roll <
        0.15 +
        quality * 0.16
    ) {

        recordHit(
            "double",
            powerStat
        );

        return;
    }

    if (
        roll <
        0.25 +
        quality * 0.20
    ) {

        recordHit(
            "single",
            powerStat
        );

        return;
    }

    if (
        roll <
        0.31 +
        quality * 0.16
    ) {

        recordHit(
            "triple",
            powerStat
        );

        return;
    }

    if (
        Math.random() <
        BATTING_SETTINGS.foulChance
    ) {

        gameState.game.strikes =
            Math.min(
                2,
                gameState.game.strikes + 1
            );

        batting.plateAppearances--;

        batting.atBats--;

        showGameMessage(
            "파울"
        );

        if (
            gameState.game.strikes >= 3
        ) {

            finishAtBat(
                "strikeout"
            );

        } else {

            setTimeout(
                startPitch,
                450
            );
        }

        return;
    }

    finishAtBat(
        Math.random() < 0.5
            ? "groundout"
            : "flyout"
    );
}


/* =========================================================
   RECORD HIT
   ========================================================= */

function recordHit(
    type,
    powerStat
) {

    const stats =
        gameState.career.seasonStats;

    stats.hits++;

    let bases = 1;

    if (type === "double") {
        bases = 2;
        stats.doubles++;
    }

    if (type === "triple") {
        bases = 3;
        stats.triples++;
    }

    if (type === "home_run") {
        bases = 4;
        stats.homeRuns++;
    }

    if (type === "home_run") {

        const runners =
            countRunners();

        const runs =
            runners + 1;

        stats.runs += runs;

        stats.rbi += runs;

        gameState.game.runsAway +=
            runs;

        clearBases();

        showGameMessage(
            `홈런! ${runs}점`
        );

    } else {

        advanceBasesForHit(
            bases
        );

        showGameMessage(
            type === "single"
                ? "안타!"
                : type === "double"
                    ? "2루타!"
                    : "3루타!"
        );
    }

    updateBattingAverage();

    endPlayAfterHit();
}


/* =========================================================
   BASE RUNNING AFTER HIT
   ========================================================= */

function endPlayAfterHit() {

    setTimeout(
        () => {

            if (
                gameState.game.outs >= 3
            ) {

                endHalfInning();

                return;
            }

            showGameMode(
                "runningMode"
            );

            currentGame.type =
                "running";

            currentGame.runner = {
                x: 0.5,
                y: 0.86,
                base: "home"
            };

            currentGame.runningTarget =
                null;

            runGameLoop();

        },
        500
    );
}


/* =========================================================
   BASE RUNNING UPDATE
   ========================================================= */

function updateRunning(delta) {

    if (!currentGame) {
        return;
    }

    const joystick =
        joystickStates.running;

    const speed =
        BASERUNNING_SETTINGS.normalSpeed;

    currentGame.runner.x +=
        joystick.x *
        speed *
        delta /
        16;

    currentGame.runner.y +=
        joystick.y *
        speed *
        delta /
        16;

    currentGame.runner.x =
        clamp(
            currentGame.runner.x,
            0.08,
            0.92
        );

    currentGame.runner.y =
        clamp(
            currentGame.runner.y,
            0.10,
            0.90
        );
}


/* =========================================================
   DRAW RUNNING
   ========================================================= */

function drawRunning() {

    const result =
        getCanvasContext(
            "runningCanvas"
        );

    if (!result || !currentGame) {
        return;
    }

    const {
        ctx,
        width,
        height
    } = result;

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    drawStadiumBackground(
        ctx,
        width,
        height
    );

    const centerX =
        width / 2;

    const centerY =
        height * 0.53;

    const size =
        Math.min(
            width,
            height
        ) * 0.24;

    ctx.save();

    ctx.translate(
        centerX,
        centerY
    );

    ctx.rotate(
        Math.PI / 4
    );

    ctx.strokeStyle =
        "rgba(255,255,255,.7)";

    ctx.lineWidth = 3;

    ctx.strokeRect(
        -size,
        -size,
        size * 2,
        size * 2
    );

    ctx.restore();

    const runnerX =
        currentGame.runner.x *
        width;

    const runnerY =
        currentGame.runner.y *
        height;

    ctx.beginPath();

    ctx.arc(
        runnerX,
        runnerY,
        12,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#4da3ff";

    ctx.fill();

    ctx.strokeStyle =
        "white";

    ctx.lineWidth = 2;

    ctx.stroke();

    ctx.fillStyle =
        "rgba(255,255,255,.8)";

    ctx.font =
        "bold 13px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        "RUNNER",
        runnerX,
        runnerY - 20
    );
}


/* =========================================================
   RUN ACTION
   ========================================================= */

function runAction() {

    if (
        !currentGame ||
        currentGame.type !==
            "running"
    ) {
        return;
    }

    const x =
        currentGame.runner.x;

    const y =
        currentGame.runner.y;

    const bases = [
        {
            name: "first",
            x: BASES.first.x,
            y: BASES.first.y
        },
        {
            name: "second",
            x: BASES.second.x,
            y: BASES.second.y
        },
        {
            name: "third",
            x: BASES.third.x,
            y: BASES.third.y
        },
        {
            name: "home",
            x: BASES.home.x,
            y: BASES.home.y
        }
    ];

    let closest =
        bases[0];

    let closestDistance =
        Infinity;

    bases.forEach(
        base => {

            const distance =
                Math.hypot(
                    x - base.x,
                    y - base.y
                );

            if (
                distance <
                closestDistance
            ) {

                closestDistance =
                    distance;

                closest =
                    base;
            }
        }
    );

    if (
        closestDistance <
        0.10
    ) {

        currentGame.runner.base =
            closest.name;

        if (
            closest.name ===
            "home"
        ) {

            gameState.game.runsAway++;

            gameState.career.seasonStats.runs++;

            showGameMessage(
                "홈으로 득점!"
            );

            endRunningPlay();

            return;
        }

        showGameMessage(
            `${closest.name}루 진루`
        );
    }
}

function endRunningPlay() {

    stopAnimation();

    showGameMode(
        "battingMode"
    );

    currentGame.type =
        "batting";

    currentGame.pitch = null;

    startPitch();

    updateGameUI();
}


/* =========================================================
   FIELDING
   ========================================================= */

function startFielding() {

    showGameMode(
        "fieldingMode"
    );

    currentGame.type =
        "fielding";

    currentGame.fieldingPlayer = {
        x: 0.50,
        y: 0.65
    };

    currentGame.fieldingBall = {
        x: randomFloat(0.20, 0.80),
        y: randomFloat(0.20, 0.55)
    };

    currentGame.throwAim = {
        x: 0.50,
        y: 0.50
    };

    runGameLoop();
}

function updateFielding(delta) {

    const joystick =
        joystickStates.fielding;

    const speed =
        FIELDING_SETTINGS.playerSpeed;

    currentGame.fieldingPlayer.x +=
        joystick.x *
        speed *
        delta /
        16;

    currentGame.fieldingPlayer.y +=
        joystick.y *
        speed *
        delta /
        16;

    currentGame.fieldingPlayer.x =
        clamp(
            currentGame.fieldingPlayer.x,
            0.03,
            0.97
        );

    currentGame.fieldingPlayer.y =
        clamp(
            currentGame.fieldingPlayer.y,
            0.05,
            0.92
        );
}

function drawFielding() {

    const result =
        getCanvasContext(
            "fieldingCanvas"
        );

    if (!result || !currentGame) {
        return;
    }

    const {
        ctx,
        width,
        height
    } = result;

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    drawStadiumBackground(
        ctx,
        width,
        height
    );

    const playerX =
        currentGame.fieldingPlayer.x *
        width;

    const playerY =
        currentGame.fieldingPlayer.y *
        height;

    const ballX =
        currentGame.fieldingBall.x *
        width;

    const ballY =
        currentGame.fieldingBall.y *
        height;

    ctx.beginPath();

    ctx.arc(
        ballX,
        ballY,
        8,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "white";

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        playerX,
        playerY,
        14,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#4da3ff";

    ctx.fill();

    ctx.strokeStyle =
        "white";

    ctx.lineWidth = 2;

    ctx.stroke();

    const distance =
        Math.hypot(
            playerX - ballX,
            playerY - ballY
        );

    if (
        distance <
        FIELDING_SETTINGS.pickupDistance
    ) {

        ctx.strokeStyle =
            "#39d98a";

        ctx.beginPath();

        ctx.arc(
            playerX,
            playerY,
            25,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }
}


/* =========================================================
   THROW
   ========================================================= */

function throwBall() {

    if (
        !currentGame ||
        currentGame.type !==
            "fielding"
    ) {
        return;
    }

    const player =
        currentGame.fieldingPlayer;

    const ball =
        currentGame.fieldingBall;

    const distance =
        Math.hypot(
            player.x - ball.x,
            player.y - ball.y
        );

    if (
        distance >
        FIELDING_SETTINGS.pickupDistance /
            100
    ) {

        showGameMessage(
            "공까지 이동하세요!"
        );

        return;
    }

    const defense =
        calculateTotalStat(
            gameState.player.stats,
            gameState.equipment,
            "defense"
        );

    const accuracy =
        FIELDING_SETTINGS.throwAccuracyBase +
        defense / 100 * 0.25;

    const success =
        Math.random() <
        accuracy;

    if (success) {

        showGameMessage(
            "정확한 송구!"
        );

        gameState.career.seasonStats.fieldingPlays++;
        gameState.career.seasonStats.fieldingSuccesses++;

    } else {

        showGameMessage(
            "송구 실책!"
        );

        gameState.career.seasonStats.errors++;
    }

    setTimeout(
        () => {

            showGameMode(
                "battingMode"
            );

            currentGame.type =
                "batting";

            startPitch();

        },
        650
    );
}


/* =========================================================
   PITCHING
   ========================================================= */

function updatePitching() {
    // 투구 모드는 조작 입력 중심으로 처리한다.
}

function drawPitching() {

    const result =
        getCanvasContext(
            "pitchingCanvas"
        );

    if (!result) {
        return;
    }

    const {
        ctx,
        width,
        height
    } = result;

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    drawStadiumBackground(
        ctx,
        width,
        height
    );

    const x =
        gameState.game.currentPitchLocation.x *
        width;

    const y =
        gameState.game.currentPitchLocation.y *
        height;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        22,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle =
        "#ffd166";

    ctx.lineWidth = 3;

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
        x - 30,
        y
    );

    ctx.lineTo(
        x + 30,
        y
    );

    ctx.moveTo(
        x,
        y - 30
    );

    ctx.lineTo(
        x,
        y + 30
    );

    ctx.stroke();
}

function throwPitch() {

    if (
        !currentGame ||
        currentGame.type !==
            "pitching"
    ) {
        return;
    }

    const pitch =
        getPitchTypeById(
            gameState.game.currentPitchType
        );

    const control =
        pitch.control;

    const accuracy =
        Math.random() <
        control;

    if (accuracy) {

        showGameMessage(
            `${localizedName(pitch)} 스트라이크 존 진입`
        );

        gameState.game.strikes++;

    } else {

        showGameMessage(
            `${localizedName(pitch)} 볼`
        );

        gameState.game.balls++;
    }

    if (
        gameState.game.strikes >= 3
    ) {

        gameState.game.strikes = 0;
        gameState.game.balls = 0;

        gameState.game.outs++;

        if (
            gameState.game.outs >= 3
        ) {

            endHalfInning();

        }

    } else if (
        gameState.game.balls >= 4
    ) {

        gameState.game.balls = 0;
        gameState.game.strikes = 0;

        recordWalk();
    }

    updateGameUI();
}


/* =========================================================
   PITCH TYPE
   ========================================================= */

function selectPitchType(id) {

    const pitch =
        getPitchTypeById(id);

    gameState.game.currentPitchType =
        pitch.id;

    $all(
        ".pitch-type-buttons button"
    ).forEach(
        button => {

            button.classList.toggle(
                "active",
                button.dataset.pitch === id
            );
        }
    );
}


/* =========================================================
   PITCH LOCATION
   ========================================================= */

function setPitchLocation(
    x,
    y
) {

    gameState.game.currentPitchLocation = {
        x: clamp(x, 0.15, 0.85),
        y: clamp(y, 0.15, 0.85)
    };
}


/* =========================================================
   PITCH TAKEN
   ========================================================= */

function handlePitchTaken() {

    if (
        !currentGame ||
        currentGame.type !==
            "batting"
    ) {
        return;
    }

    const target =
        currentGame.pitch.target;

    const zone =
        target.x >=
            0.32 &&
        target.x <=
            0.68 &&
        target.y >=
            0.30 &&
        target.y <=
            0.70;

    if (zone) {

        gameState.game.strikes++;

        showGameMessage(
            "스트라이크"
        );

        if (
            gameState.game.strikes >= 3
        ) {

            finishAtBat(
                "strikeout"
            );

        } else {

            setTimeout(
                startPitch,
                500
            );
        }

    } else {

        gameState.game.balls++;

        showGameMessage(
            "볼"
        );

        if (
            gameState.game.balls >= 4
        ) {

            recordWalk();

        } else {

            setTimeout(
                startPitch,
                500
            );
        }
    }

    updateGameUI();
}


/* =========================================================
   WALK
   ========================================================= */

function recordWalk() {

    const stats =
        gameState.career.seasonStats;

    stats.plateAppearances++;
    stats.walks++;

    gameState.game.balls = 0;
    gameState.game.strikes = 0;

    advanceRunnerOnWalk();

    showGameMessage(
        "볼넷"
    );

    setTimeout(
        () => {

            showGameMode(
                "battingMode"
            );

            currentGame.type =
                "batting";

            startPitch();

        },
        500
    );

    updateBattingAverage();
}


/* =========================================================
   HIT BY PITCH
   ========================================================= */

function recordHBP() {

    const stats =
        gameState.career.seasonStats;

    stats.plateAppearances++;

    advanceRunnerOnWalk();

    showGameMessage(
        "몸에 맞는 공"
    );

    setTimeout(
        startPitch,
        500
    );
}


/* =========================================================
   FINISH AT BAT
   ========================================================= */

function finishAtBat(result) {

    const stats =
        gameState.career.seasonStats;

    if (
        result ===
        "strikeout"
    ) {

        stats.strikeouts++;

        gameState.game.outs++;

        showGameMessage(
            "삼진 아웃"
        );
    }

    if (
        result ===
        "groundout"
    ) {

        gameState.game.outs++;

        showGameMessage(
            "땅볼 아웃"
        );
    }

    if (
        result ===
        "flyout"
    ) {

        gameState.game.outs++;

        showGameMessage(
            "뜬공 아웃"
        );
    }

    if (
        result ===
        "lineout"
    ) {

        gameState.game.outs++;

        showGameMessage(
            "라인드라이브 아웃"
        );
    }

    gameState.game.balls = 0;
    gameState.game.strikes = 0;

    updateBattingAverage();

    if (
        gameState.game.outs >= 3
    ) {

        setTimeout(
            endHalfInning,
            600
        );

        return;
    }

    setTimeout(
        startPitch,
        600
    );

    updateGameUI();
}


/* =========================================================
   BASE HELPERS
   ========================================================= */

function countRunners() {

    const bases =
        gameState.game.bases;

    return (
        (bases.first ? 1 : 0) +
        (bases.second ? 1 : 0) +
        (bases.third ? 1 : 0)
    );
}

function clearBases() {

    gameState.game.bases = {
        first: false,
        second: false,
        third: false
    };
}

function advanceBasesForHit(basesHit) {

    const old = {
        ...gameState.game.bases
    };

    clearBases();

    let runs = 0;

    if (old.third) {
        runs++;
    }

    if (old.second) {
        if (basesHit >= 2) {
            runs++;
        } else {
            gameState.game.bases.third = true;
        }
    }

    if (old.first) {

        if (basesHit >= 2) {
            runs++;
        } else {
            gameState.game.bases.second = true;
        }
    }

    if (basesHit === 1) {
        gameState.game.bases.first = true;
    }

    if (basesHit === 2) {
        gameState.game.bases.second = true;
    }

    if (basesHit === 3) {
        gameState.game.bases.third = true;
    }

    if (runs > 0) {

        gameState.game.runsAway +=
            runs;

        gameState.career.seasonStats.runs +=
            runs;

        gameState.career.seasonStats.rbi +=
            runs;
    }
}

function advanceRunnerOnWalk() {

    const bases =
        gameState.game.bases;

    if (
        bases.first &&
        bases.second &&
        bases.third
    ) {

        gameState.game.runsAway++;

        gameState.career.seasonStats.runs++;

        gameState.career.seasonStats.rbi++;

        return;
    }

    if (
        bases.first &&
        bases.second
    ) {

        if (bases.third) {

            gameState.game.runsAway++;

            gameState.career.seasonStats.runs++;

            gameState.career.seasonStats.rbi++;
        }

        bases.third =
            bases.second;

        bases.second =
            true;

        return;
    }

    if (bases.first) {

        bases.second = true;
        bases.first = true;

        return;
    }

    bases.first = true;
}


/* =========================================================
   INNING
   ========================================================= */

function endHalfInning() {

    stopAnimation();

    gameState.game.outs = 0;

    gameState.game.balls = 0;

    gameState.game.strikes = 0;

    clearBases();

    if (
        gameState.game.half ===
        "top"
    ) {

        gameState.game.half =
            "bottom";

        showGameMode(
            "fieldingMode"
        );

        startFielding();

    } else {

        gameState.game.half =
            "top";

        gameState.game.inning++;

        if (
            gameState.game.inning >
            GAME_SETTINGS.innings
        ) {

            if (
                gameState.game.runsAway !==
                gameState.game.runsHome
            ) {

                finishGame();

            } else if (
                GAME_SETTINGS.extraInnings &&
                gameState.game.inning <=
                GAME_SETTINGS.maxExtraInnings
            ) {

                showGameMessage(
                    "연장전 시작"
                );

                showGameMode(
                    "battingMode"
                );

                currentGame.type =
                    "batting";

                startPitch();

            } else {

                finishGame();
            }

        } else {

            showGameMode(
                "battingMode"
            );

            currentGame.type =
                "batting";

            startPitch();
        }
    }

    updateGameUI();
}


/* =========================================================
   GAME FINISH
   ========================================================= */

function finishGame() {

    stopAnimation();

    const game =
        gameState.game;

    const stats =
        gameState.career.seasonStats;

    stats.games++;

    if (
        game.runsAway >
        game.runsHome
    ) {
        stats.wins++;
    } else if (
        game.runsAway <
        game.runsHome
    ) {
        stats.losses++;
    }

    gameState.career.gameNumber++;

    updateBattingAverage();

    gameState.game =
        createDefaultGameData();

    showGameMessage(
        `경기 종료 ${game.runsAway}-${game.runsHome}`
    );

    saveToSlot(1, true);

    setTimeout(
        () => {

            showCareerScreen();

        },
        1200
    );
}


/* =========================================================
   BATTING AVERAGE
   ========================================================= */

function updateBattingAverage() {

    const stats =
        gameState.career.seasonStats;

    if (stats.atBats > 0) {

        stats.battingAverage =
            stats.hits /
            stats.atBats;
    } else {

        stats.battingAverage = 0;
    }

    const plate =
        stats.plateAppearances;

    if (plate > 0) {

        stats.onBasePercentage =
            (
                stats.hits +
                stats.walks
            ) /
            plate;
    } else {

        stats.onBasePercentage = 0;
    }

    const totalBases =
        stats.hits +
        stats.doubles +
        stats.triples * 2 +
        stats.homeRuns * 3;

    if (stats.atBats > 0) {

        stats.sluggingPercentage =
            totalBases /
            stats.atBats;
    } else {

        stats.sluggingPercentage = 0;
    }
}


/* =========================================================
   ABS REVIEW
   ========================================================= */

function requestABSReview() {

    if (!gameState) {
        return;
    }

    if (
        gameState.game.absReviewsRemaining <=
        0
    ) {

        showGameMessage(
            "ABS 판독 기회가 없습니다."
        );

        return;
    }

    const originalCall =
        gameState.game.lastCall ||
        "판정";

    const overturned =
        Math.random() <
        ABS_SETTINGS.overturnChance;

    if (overturned) {

        /*
            판정 번복:
            판독 횟수 유지
        */

        showGameMessage(
            `ABS: 판정 번복! ${originalCall} → 반대 판정`
        );

    } else {

        /*
            판정 유지:
            판독 횟수 -1
        */

        gameState.game.absReviewsRemaining--;

        showGameMessage(
            `ABS: 원심 유지. 남은 판독 ${gameState.game.absReviewsRemaining}`
        );
    }

    updateGameUI();
}


/* =========================================================
   GAME MESSAGE
   ========================================================= */

function showGameMessage(message) {

    setText(
        "gameMessage",
        message
    );

    const element =
        $("gameMessage");

    if (!element) {
        return;
    }

    element.style.opacity =
        "1";

    clearTimeout(
        element._messageTimer
    );

    element._messageTimer =
        setTimeout(
            () => {
                element.style.opacity =
                    "0.8";
            },
            1400
        );
}


/* =========================================================
   JOYSTICK SYSTEM
   ========================================================= */

function setupJoystick(
    element,
    type
) {

    if (!element) {
        return;
    }

    let active = false;

    function updateFromPointer(
        clientX,
        clientY
    ) {

        const rect =
            element.getBoundingClientRect();

        const centerX =
            rect.left +
            rect.width / 2;

        const centerY =
            rect.top +
            rect.height / 2;

        const radius =
            rect.width / 2;

        let dx =
            clientX -
            centerX;

        let dy =
            clientY -
            centerY;

        const distance =
            Math.hypot(
                dx,
                dy
            );

        if (
            distance >
            radius
        ) {

            dx =
                dx /
                distance *
                radius;

            dy =
                dy /
                distance *
                radius;
        }

        joystickStates[type].x =
            clamp(
                dx / radius,
                -1,
                1
            );

        joystickStates[type].y =
            clamp(
                dy / radius,
                -1,
                1
            );

        if (
            type ===
            "batting"
        ) {

            currentGame.battingCursor.x =
                clamp(
                    0.5 +
                    joystickStates[type].x *
                        0.32,
                    0.05,
                    0.95
                );

            currentGame.battingCursor.y =
                clamp(
                    0.5 +
                    joystickStates[type].y *
                        0.32,
                    0.05,
                    0.95
                );
        }
    }

    function reset() {

        active = false;

        joystickStates[type].x = 0;
        joystickStates[type].y = 0;
    }

    element.addEventListener(
        "pointerdown",
        event => {

            active = true;

            element.setPointerCapture?.(
                event.pointerId
            );

            updateFromPointer(
                event.clientX,
                event.clientY
            );
        }
    );

    element.addEventListener(
        "pointermove",
        event => {

            if (!active) {
                return;
            }

            updateFromPointer(
                event.clientX,
                event.clientY
            );
        }
    );

    element.addEventListener(
        "pointerup",
        reset
    );

    element.addEventListener(
        "pointercancel",
        reset
    );

    element.addEventListener(
        "pointerleave",
        event => {

            if (active) {
                updateFromPointer(
                    event.clientX,
                    event.clientY
                );
            }
        }
    );
}


/* =========================================================
   EVENT SETUP
   ========================================================= */

function setupEvents() {

    /* Home */

    $("newCareerButton")
        ?.addEventListener(
            "click",
            showCreateScreen
        );

    $("continueButton")
        ?.addEventListener(
            "click",
            () => {

                if (
                    loadFromSlot(1)
                ) {
                    return;
                }

                showHome();
            }
        );


    /* Player creation */

    $("createPlayerButton")
        ?.addEventListener(
            "click",
            createNewCareer
        );


    /* Career */

    $("startGameButton")
        ?.addEventListener(
            "click",
            showGameScreen
        );

    $("equipmentDrawButton")
        ?.addEventListener(
            "click",
            drawEquipment
        );

    $("trainingButton")
        ?.addEventListener(
            "click",
            trainPlayer
        );

    $("salaryNegotiationButton")
        ?.addEventListener(
            "click",
            startSalaryNegotiation
        );


    /* Save */

    $all(
        "[data-save-slot]"
    ).forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const slot =
                        Number(
                            button.dataset.saveSlot
                        );

                    saveToSlot(slot);
                }
            );
        }
    );


    /* Game */

    $("returnCareerButton")
        ?.addEventListener(
            "click",
            () => {

                stopAnimation();

                if (currentGame) {
                    currentGame.active =
                        false;
                }

                showCareerScreen();
            }
        );

    $("swingButton")
        ?.addEventListener(
            "click",
            swingBat
        );

    $("absButton")
        ?.addEventListener(
            "click",
            requestABSReview
        );

    $("runActionButton")
        ?.addEventListener(
            "click",
            runAction
        );

    $("throwButton")
        ?.addEventListener(
            "click",
            throwBall
        );

    $("pitchButton")
        ?.addEventListener(
            "click",
            throwPitch
        );


    /* Pitch buttons */

    $all(
        ".pitch-type-buttons button"
    ).forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    selectPitchType(
                        button.dataset.pitch
                    );
                }
            );
        }
    );


    /* Joysticks */

    setupJoystick(
        $("battingJoystick"),
        "batting"
    );

    setupJoystick(
        $("runningJoystick"),
        "running"
    );

    setupJoystick(
        $("fieldingJoystick"),
        "fielding"
    );


    /* Pitch canvas direct aiming */

    const pitchingCanvas =
        $("pitchingCanvas");

    if (pitchingCanvas) {

        pitchingCanvas.addEventListener(
            "pointerdown",
            event => {

                const rect =
                    pitchingCanvas.getBoundingClientRect();

                setPitchLocation(
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width,

                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height
                );
            }
        );

        pitchingCanvas.addEventListener(
            "pointermove",
            event => {

                if (
                    event.buttons !== 1
                ) {
                    return;
                }

                const rect =
                    pitchingCanvas.getBoundingClientRect();

                setPitchLocation(
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width,

                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height
                );
            }
        );
    }


    /* Keyboard */

    document.addEventListener(
        "keydown",
        handleKeyboard
    );


    /* Resize */

    window.addEventListener(
        "resize",
        () => {

            if (currentGame) {
                drawCurrentMode();
            }
        }
    );
}


/* =========================================================
   KEYBOARD CONTROL
   ========================================================= */

function handleKeyboard(event) {

    const key =
        event.key.toLowerCase();

    if (
        !currentGame ||
        !currentGame.active
    ) {
        return;
    }

    /*
        Batting:
        WASD = cursor
        Space = swing
        R = ABS
    */

    if (
        currentGame.type ===
        "batting"
    ) {

        if (
            key === "w" ||
            key === "arrowup"
        ) {

            currentGame.battingCursor.y =
                clamp(
                    currentGame.battingCursor.y -
                        0.04,
                    0,
                    1
                );
        }

        if (
            key === "s" ||
            key === "arrowdown"
        ) {

            currentGame.battingCursor.y =
                clamp(
                    currentGame.battingCursor.y +
                        0.04,
                    0,
                    1
                );
        }

        if (
            key === "a" ||
            key === "arrowleft"
        ) {

            currentGame.battingCursor.x =
                clamp(
                    currentGame.battingCursor.x -
                        0.04,
                    0,
                    1
                );
        }

        if (
            key === "d" ||
            key === "arrowright"
        ) {

            currentGame.battingCursor.x =
                clamp(
                    currentGame.battingCursor.x +
                        0.04,
                    0,
                    1
                );
        }

        if (
            key === " "
        ) {

            event.preventDefault();

            swingBat();
        }

        if (
            key === "r"
        ) {

            requestABSReview();
        }
    }


    /*
        Running:
        WASD = runner
        Space = action
    */

    if (
        currentGame.type ===
        "running"
    ) {

        if (
            key === "w"
        ) {
            joystickStates.running.y = -1;
        }

        if (
            key === "s"
        ) {
            joystickStates.running.y = 1;
        }

        if (
            key === "a"
        ) {
            joystickStates.running.x = -1;
        }

        if (
            key === "d"
        ) {
            joystickStates.running.x = 1;
        }

        if (
            key === " "
        ) {

            event.preventDefault();

            runAction();
        }
    }


    /*
        Fielding:
        WASD = player
        Space = throw
    */

    if (
        currentGame.type ===
        "fielding"
    ) {

        if (
            key === "w"
        ) {
            joystickStates.fielding.y = -1;
        }

        if (
            key === "s"
        ) {
            joystickStates.fielding.y = 1;
        }

        if (
            key === "a"
        ) {
            joystickStates.fielding.x = -1;
        }

        if (
            key === "d"
        ) {
            joystickStates.fielding.x = 1;
        }

        if (
            key === " "
        ) {

            event.preventDefault();

            throwBall();
        }
    }


    /*
        Pitching:
        1~6 pitch type
        Space = pitch
    */

    if (
        currentGame.type ===
        "pitching"
    ) {

        const pitchMap = {
            "1": "four_seam",
            "2": "two_seam",
            "3": "slider",
            "4": "curve",
            "5": "changeup",
            "6": "cutter"
        };

        if (
            pitchMap[key]
        ) {

            selectPitchType(
                pitchMap[key]
            );
        }

        if (
            key === " "
        ) {

            event.preventDefault();

            throwPitch();
        }
    }
}


/* =========================================================
   KEY RELEASE
   ========================================================= */

document.addEventListener(
    "keyup",
    event => {

        const key =
            event.key.toLowerCase();

        if (
            key === "w" ||
            key === "s"
        ) {

            joystickStates.running.y = 0;
            joystickStates.fielding.y = 0;
        }

        if (
            key === "a" ||
            key === "d"
        ) {

            joystickStates.running.x = 0;
            joystickStates.fielding.x = 0;
        }
    }
);


/* =========================================================
   UPDATE ALL DISPLAYS
   ========================================================= */

function updateAllDisplays() {

    updateAllText();

    updateTopBar();

    updateRemainingTokens();

    updatePlayerStats();

    updateCareerInformation();

    updateNextGameInformation();

    renderEquipment();

    renderSeason();

    renderSaveSlots();
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeGame() {

    createLanguageSelector();

    setupStatAllocator();

    setupCareerNavigation();

    setupEvents();

    updateAllText();

    showHome();

    renderSaveSlots();

    /*
        If save exists, enable continue button.
    */

    const hasSave =
        !!localStorage.getItem(
            SAVE_SETTINGS.storagePrefix +
                "1"
        );

    if ($("continueButton")) {

        $("continueButton").disabled =
            !hasSave;
    }
}


/* =========================================================
   DOM READY
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeGame
    );

} else {

    initializeGame();
}


/* =========================================================
   EXTRA PUBLIC FUNCTIONS
   ========================================================= */

/*
    훈련 후 토큰을 원하는 능력치에 넣을 수 있도록
    전역 함수로도 제공한다.

    예:
    allocateTrainingToken("power");
*/

window.RTTSGame = {

    getState: () =>
        gameState,

    save: slot =>
        saveToSlot(slot),

    load: slot =>
        loadFromSlot(slot),

    deleteSave: slot =>
        deleteSaveSlot(slot),

    setLanguage: language =>
        setLanguage(language),

    train: () =>
        trainPlayer(),

    allocateToken: stat =>
        allocateTrainingToken(stat),

    drawEquipment: () =>
        drawEquipment(),

    equip: id =>
        equipItem(id),

    swing: () =>
        swingBat(),

    run: () =>
        runAction(),

    throw: () =>
        throwBall(),

    pitch: () =>
        throwPitch(),

    abs: () =>
        requestABSReview()
};


/* =========================================================
   END
   ========================================================= */
```
