/* ============================================================
   DIG SITE 404

   PHASE 0 + PHASE 1 + PHASE 2 + PHASE 3
   RESULTS + LEARNING

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

    const reconstructionScreen =
        document.getElementById("screen-reconstruction");

    const resultsScreen =
        document.getElementById("screen-results");

    const learningScreen =
        document.getElementById("screen-learning");


    /* ---------------- Mission ---------------- */

    const teamNameInput =
        document.getElementById("team-name");

    const startButton =
        document.getElementById("start-game");


    /* ---------------- Discovery ---------------- */

    const continueDiscovery =
        document.getElementById("continue-discovery");

    const discoveryTitle =
        document.getElementById("discovery-title");

    const discoveryDescription =
        document.getElementById("discovery-description");

    const discoveryDetails =
        document.getElementById("discovery-details");


    /* ---------------- Expedition ---------------- */

    const evidenceGrid =
        document.getElementById("evidence-grid");

    const eventPanel =
        document.getElementById("event-panel");


    /* ---------------- Header ---------------- */

    const headerTeam =
        document.getElementById("header-team");

    const headerRound =
        document.getElementById("header-round");

    const headerPoints =
        document.getElementById("header-points");


    /* ---------------- Event ---------------- */

    const eventTitle =
        document.getElementById("event-title");

    const eventDescription =
        document.getElementById("event-description");

    const eventOptions =
        document.getElementById("event-options");


    /* ---------------- Reconstruction ---------------- */

    const siteOptions =
        document.getElementById("site-options");

    const finalEvidence =
        document.getElementById("final-evidence");

    const submitReconstruction =
        document.getElementById("submit-reconstruction");

    const reconstructionError =
        document.getElementById("reconstruction-error");


    /* ---------------- Results ---------------- */

    const resultsTeam =
        document.getElementById("results-team");

    const resultSite =
        document.getElementById("result-site");

    const scoreEvidence =
        document.getElementById("score-evidence");

    const scoreResources =
        document.getElementById("score-resources");

    const scoreAdaptability =
        document.getElementById("score-adaptability");

    const scoreTotal =
        document.getElementById("score-total");

    const viewLearning =
        document.getElementById("view-learning");


    /* ---------------- Learning ---------------- */

    const conceptMap =
        document.getElementById("concept-map");

    const learningTitle =
        document.getElementById("learning-title");


    /* ============================================================
       GAME CONSTANTS
       ============================================================ */

    const STARTING_POINTS = 15;

    const TOTAL_ROUNDS = 3;

    /*
     * Round 1 consists of exactly three investigation decisions.
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

        eventChoice: null,


        /* ---------------- Phase 3 ---------------- */

        phase3Started: false,

        finalReconstruction: null,

        finalEvidence: [],

        phase3Complete: false,

        gameComplete: false,


        /* ---------------- Scores ---------------- */

        scores: {

            evidence: 0,

            resources: 0,

            adaptability: 0,

            total: 0

        },


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
            eventScreen,
            reconstructionScreen,
            resultsScreen,
            learningScreen

        ];


        screens.forEach(element => {

            if (!element) {
                return;
            }

            element.classList.remove("active");

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

        gameState.eventChoice =
            null;


        gameState.phase3Started =
            false;

        gameState.finalReconstruction =
            null;

        gameState.finalEvidence =
            [];

        gameState.phase3Complete =
            false;

        gameState.gameComplete =
            false;


        gameState.scores = {

            evidence: 0,

            resources: 0,

            adaptability: 0,

            total: 0

        };


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


        /*
         * Underground Chamber
         *
         * Always becomes available when Round 2 starts.
         */

        if (
            chamber &&
            !gameState.investigationsCompleted.includes(
                "underground_chamber"
            )
        ) {

            available.push(chamber);

        }


        /*
         * Storage Vessels
         *
         * Requires Underground Chamber.
         */

        if (

            storage &&

            gameState.investigationsCompleted
                .includes("underground_chamber") &&

            !gameState.investigationsCompleted
                .includes("storage_vessels")

        ) {

            available.push(storage);

        }


        return available;

    }


    /* ============================================================
       PHASE 3 EVIDENCE
       ============================================================ */

    function getPhase3Evidence() {

        const available = [];


        const ceremonial =
            getEvidenceById(
                "ceremonial_fragment"
            );


        /*
         * Ceremonial Fragment is available ONLY when
         * the team selected "Investigate the Contradiction".
         */

        if (

            ceremonial &&

            gameState.ceremonialEvidenceUnlocked &&

            !gameState.investigationsCompleted.includes(
                "ceremonial_fragment"
            )

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


        if (gameState.currentRound === 3) {

            return getPhase3Evidence();

        }


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


        if (gameState.currentRound === 3) {

            renderPhase3Board();

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

                        ${evidence.description || ""}

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
            getPhase1Evidence()
                .filter(
                    evidence =>
                        !gameState.investigationsCompleted
                            .includes(evidence.id)
                );


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
            countPhase1Investigations();


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

                        ${completed} /
                        ${ROUND_1_INVESTIGATION_LIMIT}

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


        /*
         * Phase 3 evidence is only valid on the
         * contradiction route.
         */

        if (
            gameState.currentRound === 3 &&
            evidenceId === "ceremonial_fragment" &&
            !gameState.ceremonialEvidenceUnlocked
        ) {

            return;

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

        if (!evidence) {

            return;

        }


        if (discoveryTitle) {

            discoveryTitle.textContent =
                evidence.discoveryTitle ||
                evidence.title;

        }


        if (discoveryDescription) {

            discoveryDescription.textContent =
                evidence.discoveryDescription ||
                evidence.description ||
                "";

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


        if (continueDiscovery) {

            continueDiscovery.textContent =
                "RECORD DISCOVERY";

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
         * --------------------------------------------------------
         * PHASE 1 → PHASE 2
         *
         * Round 1 ends after three initial
         * investigation decisions.
         * --------------------------------------------------------
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
         * --------------------------------------------------------
         * PHASE 2
         *
         * Underground Chamber triggers the
         * interpretation event.
         * --------------------------------------------------------
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
         * --------------------------------------------------------
         * PHASE 3
         *
         * Ceremonial Fragment discovery leads
         * directly to final reconstruction.
         * --------------------------------------------------------
         */

        if (

            gameState.currentRound === 3 &&

            discoveredId ===
            "ceremonial_fragment"

        ) {

            openReconstruction();

            return;

        }


        /*
         * Fallback:
         * remain on the current investigation board.
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
         * Record the team's Phase 2 decision.
         */

        gameState.eventChoice =
            option.id;


        /*
         * Existing Phase 2 logic:
         *
         * Some choices unlock additional evidence.
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

        gameState.eventChoice = optionId;
        /*
         * Clear active event.
         */

        gameState.currentEvent =
            null;


        /*
         * ========================================================
         * PHASE 2 → PHASE 3
         *
         * ALL THREE OPTIONS now converge into Phase 3.
         *
         * Only the contradiction route gets the extra
         * ceremonial investigation.
         * ========================================================
         */

        startPhase3();

    }


    /* ============================================================
       PHASE 3 — START
       ============================================================ */

    function startPhase3() {

        gameState.currentRound =
            3;

        gameState.phase =
            3;

        gameState.phase3Started =
            true;


        updateHeader();


        /*
         * ONLY the "Investigate Contradiction" route
         * receives the additional investigation.
         */

        if (

            gameState.eventChoice ===
            "investigate-ceremonial" &&

            gameState.ceremonialEvidenceUnlocked &&

            !gameState.investigationsCompleted
                .includes(
                    "ceremonial_fragment"
                )

        ) {

            renderPhase3Board();

            showScreen(
                expeditionScreen
            );

            return;

        }


        /*
         * The other two choices go directly
         * to Final Reconstruction.
         */

        openReconstruction();

    }


    /* ============================================================
       PHASE 3 — BOARD
       ============================================================ */

    function renderPhase3Board() {

        const investigations =
            getPhase3Evidence();


        renderInvestigationCards(
            investigations
        );


        renderPhase3Status();

    }


    /* ============================================================
       PHASE 3 — STATUS
       ============================================================ */

    function renderPhase3Status() {

        if (!eventPanel) {

            return;

        }


        eventPanel.style.display =
            "block";


        const ceremonial =
            getEvidenceById(
                "ceremonial_fragment"
            );


        const cost =
            ceremonial
                ? Number(ceremonial.cost)
                : 0;


        const canAfford =
            gameState.investigationPoints >=
            cost;


        eventPanel.innerHTML = `

            <div class="event-panel-inner">

                <span class="event-label">

                    PHASE 3 — FINAL INVESTIGATION

                </span>


                <h3>

                    One final piece of evidence may change
                    your reconstruction.

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

                    This evidence became available because
                    your team chose to investigate the contradiction.

                </p>


                <p>

                    Decide whether this final evidence changes
                    your understanding of Site 404.

                </p>


                ${!canAfford
                ? `

                            <p>

                                You do not have enough IP
                                to investigate this evidence.

                                Your team must now proceed
                                to the final reconstruction.

                            </p>

                            <button

                                id="proceed-to-reconstruction"

                                class="primary-button"

                            >

                                Proceed to Reconstruction

                            </button>

                        `
                : ""
            }

            </div>

        `;


        const proceedButton =
            document.getElementById(
                "proceed-to-reconstruction"
            );


        if (proceedButton) {

            proceedButton.addEventListener(

                "click",

                openReconstruction

            );

        }

    }


    /* ============================================================
       PHASE 3 — FINAL RECONSTRUCTION
       ============================================================ */

    function openReconstruction() {

        gameState.currentRound =
            3;

        gameState.phase =
            3;

        gameState.phase3Started =
            true;


        updateHeader();


        renderReconstructionOptions();

        renderFinalEvidence();


        if (reconstructionError) {

            reconstructionError.textContent =
                "";

            reconstructionError.classList.remove(
                "visible"
            );

        }


        if (submitReconstruction) {

            submitReconstruction.disabled =
                false;

            submitReconstruction.textContent =
                "Submit Reconstruction";

        }


        showScreen(
            reconstructionScreen
        );

    }


    /* ============================================================
       RECONSTRUCTION OPTIONS
       ============================================================ */

    function renderReconstructionOptions() {

        if (!siteOptions) {

            return;

        }


        siteOptions.innerHTML = "";


        if (
            typeof RECONSTRUCTION_OPTIONS ===
            "undefined" ||
            !Array.isArray(
                RECONSTRUCTION_OPTIONS
            )
        ) {

            console.error(
                "RECONSTRUCTION_OPTIONS not found."
            );

            return;

        }


        RECONSTRUCTION_OPTIONS.forEach(
            option => {

                const wrapper =
                    document.createElement(
                        "label"
                    );


                wrapper.className =
                    "site-option";


                wrapper.innerHTML = `

                    <input

                        type="radio"

                        name="site-reconstruction"

                        value="${option.id}"

                    >


                    <span class="site-option-content">

                        <strong>

                            ${option.title}

                        </strong>


                        <span>

                            ${option.description || ""}

                        </span>

                    </span>

                `;


                siteOptions.appendChild(
                    wrapper
                );

            }
        );

    }


    /* ============================================================
       FINAL EVIDENCE SELECTION
       ============================================================ */

    function renderFinalEvidence() {

        if (!finalEvidence) {

            return;

        }


        finalEvidence.innerHTML = "";


        /*
         * Only evidence actually discovered by the team
         * can be selected.
         */

        gameState.discoveries.forEach(
            evidenceId => {

                const evidence =
                    getEvidenceById(
                        evidenceId
                    );


                if (!evidence) {

                    return;

                }


                const wrapper =
                    document.createElement(
                        "label"
                    );


                wrapper.className =
                    "final-evidence-option";


                wrapper.innerHTML = `

                    <input

                        type="checkbox"

                        name="final-evidence"

                        value="${evidenceId}"

                    >


                    <span>

                        ${evidence.title}

                    </span>

                `;


                finalEvidence.appendChild(
                    wrapper
                );

            }
        );

    }


    /* ============================================================
       SUBMIT FINAL RECONSTRUCTION
       ============================================================ */

    function submitFinalReconstruction() {

        if (
            gameState.phase3Complete
        ) {

            return;

        }


        /*
         * Selected site interpretation.
         */

        const selectedSite =
            document.querySelector(
                'input[name="site-reconstruction"]:checked'
            );


        /*
         * Selected evidence.
         */

        const selectedEvidence =
            Array.from(

                document.querySelectorAll(
                    'input[name="final-evidence"]:checked'
                )

            ).map(

                input =>
                    input.value

            );


        /*
         * Validate site.
         */

        if (!selectedSite) {

            showReconstructionError(
                "Choose your final reconstruction first."
            );

            return;

        }


        /*
         * Exactly three pieces of evidence.
         */

        if (
            selectedEvidence.length !== 3
        ) {

            showReconstructionError(
                "Select exactly 3 strongest pieces of evidence."
            );

            return;

        }


        /*
         * Save final decision.
         */

        gameState.finalReconstruction =
            selectedSite.value;


        gameState.finalEvidence =
            selectedEvidence;


        gameState.phase3Complete =
            true;


        calculateScores();


        showResults();

    }


    /* ============================================================
       RECONSTRUCTION ERROR
       ============================================================ */

    function showReconstructionError(
        message
    ) {

        if (!reconstructionError) {

            return;

        }


        reconstructionError.textContent =
            message;


        reconstructionError.classList.add(
            "visible"
        );

    }


    /* ============================================================
       SCORING
       ============================================================ */

    function calculateScores() {

        /*
         * --------------------------------------------------------
         * EVIDENCE SCORE
         *
         * Each selected piece that supports the chosen
         * reconstruction contributes 10 points.
         *
         * Maximum = 30
         * --------------------------------------------------------
         */

        let evidenceScore =
            0;


        let reconstruction =
            null;


        if (
            typeof RECONSTRUCTION_OPTIONS !==
            "undefined" &&
            Array.isArray(
                RECONSTRUCTION_OPTIONS
            )
        ) {

            reconstruction =
                RECONSTRUCTION_OPTIONS.find(

                    option =>
                        option.id ===
                        gameState.finalReconstruction

                );

        }


        if (reconstruction) {

            const supportingEvidence =
                reconstruction.supportingEvidence ||
                [];


            gameState.finalEvidence.forEach(
                evidenceId => {

                    if (
                        supportingEvidence.includes(
                            evidenceId
                        )
                    ) {

                        evidenceScore +=
                            10;

                    }

                }
            );

        }


        evidenceScore =
            Math.min(
                evidenceScore,
                30
            );


        /*
         * --------------------------------------------------------
         * RESOURCE SCORE
         *
         * More remaining IP means stronger resource management.
         *
         * Maximum = 30
         * --------------------------------------------------------
         */

        const remaining =
            gameState.investigationPoints;


        let resourceScore =
            0;


        if (remaining >= 7) {

            resourceScore =
                30;

        }

        else if (remaining >= 4) {

            resourceScore =
                25;

        }

        else if (remaining >= 2) {

            resourceScore =
                20;

        }

        else {

            resourceScore =
                15;

        }


        /*
         * --------------------------------------------------------
         * ADAPTABILITY SCORE
         *
         * Investigate Contradiction demonstrates adaptation
         * to new evidence.
         *
         * The other two routes still receive a baseline score
         * because the team had to make and commit to a decision.
         * --------------------------------------------------------
         */

        let adaptabilityScore =
            20;


        if (
            gameState.eventChoice ===
            "investigate-contradiction"
        ) {

            adaptabilityScore =
                30;

        }


        /*
         * --------------------------------------------------------
         * TOTAL
         * --------------------------------------------------------
         */

        const total =
            evidenceScore +
            resourceScore +
            adaptabilityScore;


        gameState.scores = {

            evidence:
                evidenceScore,

            resources:
                resourceScore,

            adaptability:
                adaptabilityScore,

            total:
                total

        };

    }


    /* ============================================================
       RESULTS
       ============================================================ */

    function showResults() {

        gameState.gameComplete =
            true;


        if (resultsTeam) {

            resultsTeam.textContent =
                gameState.teamName;

        }


        let reconstruction =
            null;


        if (
            typeof RECONSTRUCTION_OPTIONS !==
            "undefined" &&
            Array.isArray(
                RECONSTRUCTION_OPTIONS
            )
        ) {

            reconstruction =
                RECONSTRUCTION_OPTIONS.find(

                    option =>
                        option.id ===
                        gameState.finalReconstruction

                );

        }


        if (resultSite) {

            resultSite.textContent =
                reconstruction
                    ? reconstruction.title
                    : "—";

        }


        if (scoreEvidence) {

            scoreEvidence.textContent =
                gameState.scores.evidence;

        }


        if (scoreResources) {

            scoreResources.textContent =
                gameState.scores.resources;

        }


        if (scoreAdaptability) {

            scoreAdaptability.textContent =
                gameState.scores.adaptability;

        }


        if (scoreTotal) {

            scoreTotal.textContent =
                gameState.scores.total;

        }


        showScreen(
            resultsScreen
        );

    }


    /* ============================================================
       LEARNING
       ============================================================ */

    function showLearning() {

        if (learningTitle) {

            learningTitle.textContent =
                "What You Just Experienced";

        }


        renderConceptMap();


        showScreen(
            learningScreen
        );

    }


    /* ============================================================
       CONCEPT MAP
       ============================================================ */

    function renderConceptMap() {

        if (!conceptMap) {

            return;

        }


        conceptMap.innerHTML = `

            <div class="concept-item">

                <strong>

                    Investigation Backlog

                </strong>

                <span>

                    Product Backlog

                </span>

            </div>


            <div class="concept-item">

                <strong>

                    Investigation Points

                </strong>

                <span>

                    Sprint Capacity

                </span>

            </div>


            <div class="concept-item">

                <strong>

                    Investigation Rounds

                </strong>

                <span>

                    Sprints

                </span>

            </div>


            <div class="concept-item">

                <strong>

                    Choosing Investigations

                </strong>

                <span>

                    Sprint Planning

                </span>

            </div>


            <div class="concept-item">

                <strong>

                    New Evidence

                </strong>

                <span>

                    Changing Requirements

                </span>

            </div>


            <div class="concept-item">

                <strong>

                    Changing Strategy

                </strong>

                <span>

                    Adaptation

                </span>

            </div>


            <div class="concept-item">

                <strong>

                    Team Discussion

                </strong>

                <span>

                    Collaboration

                </span>

            </div>


            <div class="concept-item">

                <strong>

                    Reviewing Evidence

                </strong>

                <span>

                    Inspection

                </span>

            </div>


            <div class="concept-item">

                <strong>

                    Final Reconstruction

                </strong>

                <span>

                    Sprint Review

                </span>

            </div>


            <div class="concept-item">

                <strong>

                    What Would You Change?

                </strong>

                <span>

                    Retrospective

                </span>

            </div>

        `;

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


    if (submitReconstruction) {

        submitReconstruction.addEventListener(

            "click",

            submitFinalReconstruction

        );

    }


    if (viewLearning) {

        viewLearning.addEventListener(

            "click",

            showLearning

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