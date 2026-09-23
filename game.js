/* ============================================================
   DIG SITE 404
   PHASE 0 + PHASE 1
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


    /* ============================================================
       GAME STATE
       ============================================================ */

    const gameState = {

        teamName: "",

        investigationPoints: 15,

        totalRounds: 3,

        currentRound: 0,

        phase: 0,

        investigationsCompleted: [],

        discoveries: [],

        currentDiscovery: null,

        lastInvestigationCost: 0,

        lastPointsRemaining: 15

    };


    /* ============================================================
       SCREEN CONTROL
       ============================================================ */

    function showScreen(screen) {

        const screens = [
            missionScreen,
            expeditionScreen,
            discoveryScreen
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
       HEADER UPDATE
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
            15;

        gameState.totalRounds =
            3;

        /*
         * Phase 0 is now complete.
         *
         * Phase 1 begins.
         */

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

        gameState.lastInvestigationCost =
            0;

        gameState.lastPointsRemaining =
            15;


        updateHeader();

        renderPhase1Board();

        showScreen(expeditionScreen);
    }


    /* ============================================================
       PHASE 1 — INITIAL INVESTIGATIONS
       ============================================================ */

    function getPhase1Investigations() {

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
       PHASE 1 — RENDER BOARD
       ============================================================ */

    function renderPhase1Board() {

        if (!evidenceGrid) {
            return;
        }


        evidenceGrid.innerHTML = "";


        const investigations =
            getPhase1Investigations();


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
                    card.classList.add("completed");
                }


                if (
                    !affordable &&
                    !alreadyInvestigated
                ) {
                    card.classList.add("disabled");
                }


                let buttonText =
                    "Investigate";


                if (alreadyInvestigated) {

                    buttonText =
                        "Investigated";

                } else if (!affordable) {

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
                        ${alreadyInvestigated || !affordable
                        ? "disabled"
                        : ""}
                    >
                        ${buttonText}
                    </button>

                `;


                evidenceGrid.appendChild(card);

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


        renderPhase1Status();
    }


    /* ============================================================
       PHASE 1 — STATUS PANEL
       ============================================================ */

    function renderPhase1Status() {

        if (!eventPanel) {
            return;
        }


        eventPanel.style.display =
            "block";


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
       FIND EVIDENCE
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
       INVESTIGATE
       ============================================================ */

    function investigateEvidence(evidenceId) {

        const evidence =
            getEvidenceById(evidenceId);


        if (!evidence) {

            console.error(
                "Evidence not found:",
                evidenceId
            );

            return;
        }


        /*
         * Prevent investigating the same
         * evidence twice.
         */

        if (
            gameState.investigationsCompleted
                .includes(evidenceId)
        ) {
            return;
        }


        const cost =
            Number(evidence.cost);


        /*
         * Check available IP.
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
           DEDUCT INVESTIGATION POINTS
           -------------------------------------------------------- */

        gameState.investigationPoints -=
            cost;


        /*
         * Store exactly how much this
         * investigation cost.
         */

        gameState.lastInvestigationCost =
            cost;


        gameState.lastPointsRemaining =
            gameState.investigationPoints;


        /* --------------------------------------------------------
           MARK INVESTIGATION AS COMPLETE
           -------------------------------------------------------- */

        gameState.investigationsCompleted.push(
            evidenceId
        );


        /*
         * Store the discovered evidence.
         */

        gameState.discoveries.push(
            evidenceId
        );


        gameState.currentDiscovery =
            evidenceId;


        /*
         * Update the expedition header
         * before moving away from it.
         */

        updateHeader();


        /*
         * Show the result.
         */

        showDiscovery(evidence);
    }


    /* ============================================================
       DISCOVERY SCREEN
       ============================================================ */

    function showDiscovery(evidence) {

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
             * Evidence details
             */

            if (
                Array.isArray(
                    evidence.details
                )
            ) {

                evidence.details.forEach(
                    detail => {

                        const listItem =
                            document.createElement("li");

                        listItem.textContent =
                            detail;

                        discoveryDetails.appendChild(
                            listItem
                        );

                    }
                );

            }


            /*
             * ------------------------------------------------
             * INVESTIGATION POINT FEEDBACK
             * ------------------------------------------------
             *
             * This was missing before.
             */

            const pointsBox =
                document.createElement("div");

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


        showScreen(discoveryScreen);
    }


    /* ============================================================
       CONTINUE AFTER DISCOVERY
       ============================================================ */

    function continueFromDiscovery() {

        /*
         * Clear the current discovery.
         */

        gameState.currentDiscovery =
            null;


        /*
         * Refresh everything.
         */

        updateHeader();

        renderPhase1Board();


        /*
         * Return to Phase 1 board.
         */

        showScreen(expeditionScreen);
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

    showScreen(missionScreen);

});