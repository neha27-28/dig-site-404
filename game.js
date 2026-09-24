/* ============================================================
   DIG SITE 404
   PHASE 0 + PHASE 1 + PHASE 2
   THE BURIED CROSSROADS
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";


    /* ============================================================
       DOM ELEMENTS
       ============================================================ */

    const missionScreen =
        document.getElementById("screen-mission");

    const expeditionScreen =
        document.getElementById("screen-expedition");

    const discoveryScreen =
        document.getElementById("screen-discovery");

    const eventScreen =
        document.getElementById("screen-event");

    const teamNameInput =
        document.getElementById("team-name");

    const startButton =
        document.getElementById("start-game");

    const continueDiscovery =
        document.getElementById("continue-discovery");

    const evidenceGrid =
        document.getElementById("evidence-grid");

    const eventPanel =
        document.getElementById("event-panel");

    const headerTeam =
        document.getElementById("header-team");

    const headerRound =
        document.getElementById("header-round");

    const headerPoints =
        document.getElementById("header-points");

    const discoveryTitle =
        document.getElementById("discovery-title");

    const discoveryDescription =
        document.getElementById("discovery-description");

    const discoveryDetails =
        document.getElementById("discovery-details");

    const eventTitle =
        document.getElementById("event-title");

    const eventDescription =
        document.getElementById("event-description");

    const eventOptions =
        document.getElementById("event-options");


    /* ============================================================
       GAME CONSTANTS
       ============================================================ */

    const STARTING_POINTS = 15;

    const TOTAL_ROUNDS = 3;

    /*
     * Round 1 consists of three investigation decisions.
     *
     * This is deliberately three rather than "investigate
     * everything", because the team must still have enough
     * Investigation Points to investigate the Round 2 chamber.
     */

    const ROUND_1_INVESTIGATION_LIMIT = 3;


    /* ============================================================
       GAME STATE
       ============================================================ */

    const gameState = {

        /* ---------------- Phase 0 ---------------- */

        teamName: "",

        investigationPoints:
            STARTING_POINTS,

        totalRounds:
            TOTAL_ROUNDS,

        currentRound: 0,

        phase: 0,


        /* ---------------- Investigation ---------------- */

        investigationsCompleted: [],

        discoveries: [],

        currentDiscovery: null,


        /* ---------------- Phase 2 ---------------- */

        phase2Started: false,

        phase2EventTriggered: false,

        ceremonialEvidenceUnlocked: false,

        currentEvent: null,


        /* ---------------- UI feedback ---------------- */

        lastInvestigationCost: 0,

        lastPointsRemaining:
            STARTING_POINTS

    };


    /* ============================================================
       SCREEN CONTROL
       ============================================================ */

    function showScreen(screen) {

        const screens = [
            missionScreen,
            expeditionScreen,
            discoveryScreen,
            eventScreen
        ];

        screens.forEach(element => {

            if (element) {
                element.classList.remove("active");
            }

        });


        if (screen) {
            screen.classList.add("active");
        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    /* ============================================================
       HEADER
       ============================================================ */

    function updateHeader() {

        if (headerTeam) {

            headerTeam.textContent =
                gameState.teamName || "—";

        }


        if (headerRound) {

            headerRound.textContent =
                `${String(gameState.currentRound).padStart(2, "0")} / ${String(gameState.totalRounds).padStart(2, "0")}`;

        }


        if (headerPoints) {

            headerPoints.textContent =
                String(gameState.investigationPoints);

        }

    }


    /* ============================================================
       PHASE 0 — START EXPEDITION
       ============================================================ */

    function startExpedition() {

        const enteredName =
            teamNameInput
                ? teamNameInput.value.trim()
                : "";


        if (!enteredName) {

            if (teamNameInput) {
                teamNameInput.focus();
            }

            alert(
                "Please enter your expedition team name."
            );

            return;
        }


        gameState.teamName =
            enteredName;

        gameState.investigationPoints =
            STARTING_POINTS;

        gameState.totalRounds =
            TOTAL_ROUNDS;

        gameState.currentRound =
            1;

        gameState.phase =
            1;

        gameState.investigationsCompleted =
            [];

        gameState.discoveries =
            [];

        gameState.currentDiscovery =
            null;

        gameState.phase2Started =
            false;

        gameState.phase2EventTriggered =
            false;

        gameState.ceremonialEvidenceUnlocked =
            false;

        gameState.currentEvent =
            null;

        gameState.lastInvestigationCost =
            0;

        gameState.lastPointsRemaining =
            STARTING_POINTS;


        updateHeader();

        renderCurrentBoard();

        showScreen(expeditionScreen);
    }


    /* ============================================================
       EVIDENCE LOOKUP
       ============================================================ */

    function getEvidenceById(id) {

        if (
            typeof EVIDENCE_DATA === "undefined" ||
            !Array.isArray(EVIDENCE_DATA)
        ) {
            return null;
        }


        return EVIDENCE_DATA.find(
            evidence =>
                evidence.id === id
        );
    }


    /* ============================================================
       PHASE 1 EVIDENCE
       ============================================================ */

    function getPhase1Evidence() {

        const phase1Ids = [
            "pottery",
            "coin",
            "inscription",
            "central_structure",
            "trade_seal"
        ];


        if (
            typeof EVIDENCE_DATA === "undefined" ||
            !Array.isArray(EVIDENCE_DATA)
        ) {
            return [];
        }


        return EVIDENCE_DATA.filter(
            evidence =>
                phase1Ids.includes(evidence.id)
        );
    }


    /* ============================================================
       PHASE 2 EVIDENCE
       ============================================================ */

    function getPhase2Evidence() {

        const available = [];


        const chamber =
            getEvidenceById(
                "underground_chamber"
            );


        const storage =
            getEvidenceById(
                "storage_vessels"
            );


        const ceremonial =
            getEvidenceById(
                "ceremonial_fragment"
            );


        /*
         * Underground Chamber
         *
         * Always becomes available when Round 2 starts.
         */

        if (chamber) {

            available.push(chamber);

        }


        /*
         * Storage Vessels
         *
         * Requires Underground Chamber
         * to have been investigated.
         */

        if (
            storage &&
            gameState.investigationsCompleted
                .includes("underground_chamber")
        ) {

            available.push(storage);

        }


        /*
         * Ceremonial Inscription
         *
         * Only becomes available when the team
         * chooses "Investigate the Contradiction".
         */

        if (
            ceremonial &&
            gameState.ceremonialEvidenceUnlocked
        ) {

            available.push(ceremonial);

        }


        return available;
    }


    /* ============================================================
       CURRENT AVAILABLE INVESTIGATIONS
       ============================================================ */

    function getAvailableInvestigations() {

        if (gameState.currentRound === 1) {

            return getPhase1Evidence();

        }


        if (gameState.currentRound === 2) {

            return getPhase2Evidence();

        }


        /*
         * Round 3 will be implemented later.
         */

        return [];
    }


    /* ============================================================
       RENDER CURRENT BOARD
       ============================================================ */

    function renderCurrentBoard() {

        if (gameState.currentRound === 1) {

            renderPhase1Board();

            return;
        }


        if (gameState.currentRound === 2) {

            renderPhase2Board();

            return;
        }

    }


    /* ============================================================
       RENDER INVESTIGATION CARDS
       ============================================================ */

    function renderInvestigationCards(
        investigations
    ) {

        if (!evidenceGrid) {
            return;
        }


        evidenceGrid.innerHTML = "";


        investigations.forEach(
            evidence => {

                const alreadyInvestigated =
                    gameState.investigationsCompleted
                        .includes(evidence.id);


                const affordable =
                    gameState.investigationPoints >=
                    Number(evidence.cost);


                const card =
                    document.createElement("article");


                card.className =
                    "evidence-card";


                if (alreadyInvestigated) {

                    card.classList.add(
                        "completed"
                    );

                }


                if (
                    !affordable &&
                    !alreadyInvestigated
                ) {

                    card.classList.add(
                        "disabled"
                    );

                }


                let buttonText =
                    "Investigate";


                if (alreadyInvestigated) {

                    buttonText =
                        "Investigated";

                }
                else if (!affordable) {

                    buttonText =
                        "Insufficient IP";

                }


                card.innerHTML = `

                    <div class="evidence-card-top">

                        <span class="evidence-number">
                            ${evidence.number || ""}
                        </span>

                        <span class="evidence-cost">
                            ${evidence.cost} IP
                        </span>

                    </div>


                    <h3>
                        ${evidence.title}
                    </h3>


                    <p>
                        ${evidence.description}
                    </p>


                    <button
                        class="primary-button investigate-button"
                        data-evidence-id="${evidence.id}"
                        ${alreadyInvestigated ||
                        !affordable
                        ? "disabled"
                        : ""
                    }
                    >
                        ${buttonText}
                    </button>

                `;


                evidenceGrid.appendChild(
                    card
                );

            }
        );


        evidenceGrid
            .querySelectorAll(
                ".investigate-button"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        investigateEvidence(
                            button.dataset.evidenceId
                        );

                    }
                );

            });

    }


    /* ============================================================
       PHASE 1 — BOARD
       ============================================================ */

    function renderPhase1Board() {

        const investigations =
            getPhase1Evidence();


        renderInvestigationCards(
            investigations
        );


        renderPhase1Status();

    }


    /* ============================================================
       PHASE 1 — STATUS
       ============================================================ */

    function renderPhase1Status() {

        if (!eventPanel) {
            return;
        }


        eventPanel.style.display =
            "block";


        const completed =
            gameState.investigationsCompleted
                .filter(id =>
                    getPhase1Evidence()
                        .some(
                            evidence =>
                                evidence.id === id
                        )
                ).length;


        eventPanel.innerHTML = `

            <div class="event-panel-inner">

                <span class="event-label">
                    PHASE 1 — INITIAL INVESTIGATION
                </span>


                <h3>
                    Build your first understanding of Site 404.
                </h3>


                <p>
                    Your team has
                    <strong>
                        ${gameState.investigationPoints}
                        Investigation Points
                    </strong>
                    remaining.
                </p>


                <p>
                    Initial investigations completed:
                    <strong>
                        ${completed} / ${ROUND_1_INVESTIGATION_LIMIT}
                    </strong>
                </p>


                <p>
                    Discuss the available evidence
                    and decide what is worth investigating.
                </p>


                <p>
                    Each investigation costs IP.
                    Choose carefully.
                </p>

            </div>

        `;
    }


    /* ============================================================
       PHASE 2 — BOARD
       ============================================================ */

    function renderPhase2Board() {

        const investigations =
            getPhase2Evidence();


        renderInvestigationCards(
            investigations
        );


        renderPhase2Status();

    }


    /* ============================================================
       PHASE 2 — STATUS
       ============================================================ */

    function renderPhase2Status() {

        if (!eventPanel) {
            return;
        }


        eventPanel.style.display =
            "block";


        const chamberFound =
            gameState.investigationsCompleted
                .includes(
                    "underground_chamber"
                );


        eventPanel.innerHTML = `

            <div class="event-panel-inner">

                <span class="event-label">
                    PHASE 2 — NEW EVIDENCE
                </span>


                <h3>
                    The site has changed your investigation.
                </h3>


                <p>
                    A hidden chamber has been detected
                    beneath the central structure.
                </p>


                <p>
                    Your team has
                    <strong>
                        ${gameState.investigationPoints}
                        Investigation Points
                    </strong>
                    remaining.
                </p>


                ${chamberFound
                ? `
                            <p>
                                The chamber has been opened.
                                New evidence can now be examined.
                            </p>
                          `
                : `
                            <p>
                                The chamber requires
                                <strong>5 IP</strong>
                                to investigate.
                            </p>
                          `
            }

            </div>

        `;
    }


    /* ============================================================
       INVESTIGATE EVIDENCE
       ============================================================ */

    function investigateEvidence(
        evidenceId
    ) {

        const evidence =
            getEvidenceById(
                evidenceId
            );


        if (!evidence) {

            console.error(
                "Evidence not found:",
                evidenceId
            );

            return;
        }


        /*
         * Prevent duplicate investigation.
         */

        if (
            gameState.investigationsCompleted
                .includes(evidenceId)
        ) {

            return;
        }


        /*
         * Phase 2 evidence requirements.
         */

        if (
            gameState.currentRound === 2 &&
            Array.isArray(evidence.requires)
        ) {

            const requirementsMet =
                evidence.requires.every(
                    requirement =>
                        gameState
                            .investigationsCompleted
                            .includes(
                                requirement
                            )
                );


            if (!requirementsMet) {

                alert(
                    "This evidence cannot be investigated yet."
                );

                return;
            }

        }


        const cost =
            Number(evidence.cost);


        /*
         * Check Investigation Points.
         */

        if (
            gameState.investigationPoints <
            cost
        ) {

            alert(
                "You do not have enough Investigation Points for this investigation."
            );

            return;
        }


        /* --------------------------------------------------------
           SPEND IP
           -------------------------------------------------------- */

        gameState.investigationPoints -=
            cost;


        gameState.lastInvestigationCost =
            cost;


        gameState.lastPointsRemaining =
            gameState.investigationPoints;


        /* --------------------------------------------------------
           RECORD INVESTIGATION
           -------------------------------------------------------- */

        gameState.investigationsCompleted.push(
            evidenceId
        );


        gameState.discoveries.push(
            evidenceId
        );


        gameState.currentDiscovery =
            evidenceId;


        updateHeader();


        /*
         * Show the discovery first.
         */

        showDiscovery(
            evidence
        );

    }


    /* ============================================================
       DISCOVERY SCREEN
       ============================================================ */

    function showDiscovery(
        evidence
    ) {

        if (discoveryTitle) {

            discoveryTitle.textContent =
                evidence.discoveryTitle ||
                evidence.title;

        }


        if (discoveryDescription) {

            discoveryDescription.textContent =
                evidence.discoveryDescription ||
                evidence.description;

        }


        if (discoveryDetails) {

            discoveryDetails.innerHTML = "";


            /*
             * Evidence details.
             */

            if (
                Array.isArray(
                    evidence.details
                )
            ) {

                evidence.details.forEach(
                    detail => {

                        const listItem =
                            document.createElement(
                                "li"
                            );

                        listItem.textContent =
                            detail;

                        discoveryDetails.appendChild(
                            listItem
                        );

                    }
                );

            }


            /*
             * Investigation Point feedback.
             */

            const pointsBox =
                document.createElement(
                    "div"
                );


            pointsBox.className =
                "discovery-points";


            pointsBox.style.marginTop =
                "28px";


            pointsBox.style.padding =
                "16px 20px";


            pointsBox.style.border =
                "1px solid #C8B99D";


            pointsBox.style.background =
                "#F3EBDD";


            pointsBox.innerHTML = `

                <strong>
                    Investigation Cost:
                </strong>

                ${gameState.lastInvestigationCost} IP

                <br>

                <strong>
                    Investigation Points Remaining:
                </strong>

                ${gameState.investigationPoints} IP

            `;


            discoveryDetails.appendChild(
                pointsBox
            );

        }


        showScreen(
            discoveryScreen
        );

    }


    /* ============================================================
       CONTINUE FROM DISCOVERY
       ============================================================ */

    function continueFromDiscovery() {

        const discoveredId =
            gameState.currentDiscovery;


        gameState.currentDiscovery =
            null;


        /*
         * PHASE 1 → PHASE 2
         *
         * Round 1 ends after three initial
         * investigation decisions.
         */

        if (
            gameState.currentRound === 1 &&
            countPhase1Investigations() >=
            ROUND_1_INVESTIGATION_LIMIT
        ) {

            startPhase2();

            return;
        }


        /*
         * If the Underground Chamber was just
         * investigated, it triggers the Phase 2
         * interpretation event.
         */

        if (
            gameState.currentRound === 2 &&
            discoveredId ===
            "underground_chamber" &&
            !gameState.phase2EventTriggered
        ) {

            gameState.phase2EventTriggered =
                true;


            updateHeader();


            showInterpretationEvent();

            return;
        }


        /*
         * Otherwise remain on the current
         * investigation board.
         */

        updateHeader();

        renderCurrentBoard();

        showScreen(
            expeditionScreen
        );

    }


    /* ============================================================
       COUNT PHASE 1 INVESTIGATIONS
       ============================================================ */

    function countPhase1Investigations() {

        const phase1Ids =
            getPhase1Evidence()
                .map(
                    evidence =>
                        evidence.id
                );


        return gameState
            .investigationsCompleted
            .filter(
                id =>
                    phase1Ids.includes(id)
            )
            .length;

    }


    /* ============================================================
       START PHASE 2
       ============================================================ */

    function startPhase2() {

        gameState.currentRound =
            2;

        gameState.phase =
            2;

        gameState.phase2Started =
            true;


        updateHeader();


        /*
         * Give the team a clear transition
         * into the new round.
         */

        showRoundTransition();

    }


    /* ============================================================
       ROUND 2 TRANSITION
       ============================================================ */

    function showRoundTransition() {

        if (discoveryTitle) {

            discoveryTitle.textContent =
                "A New Discovery Has Emerged";

        }


        if (discoveryDescription) {

            discoveryDescription.textContent =
                "Your first investigation cycle is complete. New evidence has changed what can be investigated at Site 404.";

        }


        if (discoveryDetails) {

            discoveryDetails.innerHTML = `

                <li>
                    Round 1 complete
                </li>

                <li>
                    Investigation Points remaining:
                    <strong>
                        ${gameState.investigationPoints}
                    </strong>
                </li>

                <li>
                    A hidden chamber has been detected
                    beneath the central structure.
                </li>

                <li>
                    New investigation available:
                    <strong>
                        Underground Chamber — 5 IP
                    </strong>
                </li>

            `;

        }


        if (continueDiscovery) {

            continueDiscovery.textContent =
                "ENTER ROUND 2";

        }


        showScreen(
            discoveryScreen
        );

    }


    /* ============================================================
       PHASE 2 — INTERPRETATION EVENT
       ============================================================ */

    function showInterpretationEvent() {

        const event =
            getEventById(
                "chamber-discovery"
            );


        if (!event) {

            console.error(
                "Phase 2 event not found."
            );

            renderCurrentBoard();

            showScreen(
                expeditionScreen
            );

            return;
        }


        gameState.currentEvent =
            event;


        if (eventTitle) {

            eventTitle.textContent =
                event.title;

        }


        if (eventDescription) {

            eventDescription.textContent =
                event.description;

        }


        if (eventOptions) {

            eventOptions.innerHTML = "";


            event.options.forEach(
                option => {

                    const optionCard =
                        document.createElement(
                            "article"
                        );


                    optionCard.className =
                        "event-option";


                    optionCard.innerHTML = `

                        <h3>
                            ${option.title}
                        </h3>

                        <p>
                            ${option.description}
                        </p>

                        <button
                            class="primary-button event-choice-button"
                            data-event-option="${option.id}"
                        >
                            Choose
                        </button>

                    `;


                    eventOptions.appendChild(
                        optionCard
                    );

                }
            );


            eventOptions
                .querySelectorAll(
                    ".event-choice-button"
                )
                .forEach(
                    button => {

                        button.addEventListener(
                            "click",
                            () => {

                                chooseEventOption(
                                    button.dataset
                                        .eventOption
                                );

                            }
                        );

                    }
                );

        }


        showScreen(
            eventScreen
        );

    }


    /* ============================================================
       EVENT LOOKUP
       ============================================================ */

    function getEventById(id) {

        if (
            typeof EVENT_DATA === "undefined" ||
            !Array.isArray(EVENT_DATA)
        ) {
            return null;
        }


        return EVENT_DATA.find(
            event =>
                event.id === id
        );

    }


    /* ============================================================
       EVENT CHOICE
       ============================================================ */

    function chooseEventOption(
        optionId
    ) {

        const event =
            gameState.currentEvent;


        if (!event) {
            return;
        }


        const option =
            event.options.find(
                item =>
                    item.id === optionId
            );


        if (!option) {
            return;
        }


        /*
         * Add any evidence unlocked
         * by the selected decision.
         */

        if (
            Array.isArray(
                option.addEvidence
            )
        ) {

            option.addEvidence.forEach(
                evidenceId => {

                    if (
                        evidenceId ===
                        "ceremonial_fragment"
                    ) {

                        gameState
                            .ceremonialEvidenceUnlocked =
                            true;

                    }

                }
            );

        }


        /*
         * Clear active event.
         */

        gameState.currentEvent =
            null;


        /*
         * Return to the Phase 2 board.
         */

        updateHeader();

        renderPhase2Board();

        showScreen(
            expeditionScreen
        );

    }


    /* ============================================================
       BUTTON LISTENERS
       ============================================================ */

    if (startButton) {

        startButton.addEventListener(
            "click",
            startExpedition
        );

    }


    if (teamNameInput) {

        teamNameInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    startExpedition();

                }

            }
        );

    }


    if (continueDiscovery) {

        continueDiscovery.addEventListener(
            "click",
            continueFromDiscovery
        );

    }


    /* ============================================================
       INITIAL STATE
       ============================================================ */

    if (continueDiscovery) {

        continueDiscovery.textContent =
            "RECORD DISCOVERY";

    }


    showScreen(
        missionScreen
    );

});