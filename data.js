/* ============================================================
   DIG SITE 404 — THE BURIED CROSSROADS
   data.js
   ============================================================ */


/* ============================================================
   EVIDENCE / INVESTIGATION DATA
   ============================================================ */

const EVIDENCE_DATA = [

    {
        id: "pottery",
        number: "01",
        title: "Pottery Fragment",
        cost: 2,

        description:
            "A decorated ceramic fragment is found near the western edge of the site.",

        discoveryTitle:
            "Pottery Fragment Recovered",

        discoveryDescription:
            "The fragment's clay composition and wear suggest it was produced locally and used repeatedly.",

        details: [
            "Local clay composition",
            "Repeated domestic use",
            "Evidence of permanent habitation"
        ],

        shortResult:
            "Locally produced pottery suggests permanent habitation."
    },


    {
        id: "coin",
        number: "02",
        title: "Unknown Coin",
        cost: 2,

        description:
            "A worn metal coin is recovered from a shallow excavation layer.",

        discoveryTitle:
            "A Foreign Coin",

        discoveryDescription:
            "The markings do not match the local region. The coin appears to have travelled from a distant trading region.",

        details: [
            "Foreign origin",
            "Long-distance movement",
            "Possible evidence of trade or exchange"
        ],

        shortResult:
            "A foreign coin suggests long-distance exchange."
    },


    {
        id: "inscription",
        number: "03",
        title: "Broken Inscription",
        cost: 3,

        description:
            "A damaged stone inscription contains references to organised gatherings.",

        discoveryTitle:
            "The Broken Inscription",

        discoveryDescription:
            "Although incomplete, the inscription appears to mention people gathering at a central location.",

        details: [
            "References organised gatherings",
            "Central location may have had communal importance",
            "Exact purpose remains uncertain"
        ],

        shortResult:
            "The inscription points toward organised gatherings."
    },


    {
        id: "central_structure",
        number: "04",
        title: "Central Structure",
        cost: 3,

        description:
            "The remains of a large structure sit at the geometric centre of the settlement.",

        discoveryTitle:
            "The Central Structure",

        discoveryDescription:
            "The structure appears deliberately aligned with several surrounding buildings.",

        details: [
            "Large central construction",
            "Deliberate architectural alignment",
            "Possible administrative, commercial or ceremonial role"
        ],

        shortResult:
            "A deliberately aligned central structure suggests an important shared function."
    },


    {
        id: "trade_seal",
        number: "05",
        title: "Trade Seal",
        cost: 2,

        description:
            "A small stamped seal is found beside fragments of storage material.",

        discoveryTitle:
            "An Organised Trade Seal",

        discoveryDescription:
            "The seal appears to have been used to identify or authenticate goods.",

        details: [
            "Evidence of organised exchange",
            "Goods may have been tracked or identified",
            "Strengthens the trade hypothesis"
        ],

        shortResult:
            "A trade seal indicates organised exchange."
    },


    {
        id: "underground_chamber",
        number: "06",
        title: "Underground Chamber",
        cost: 5,

        unlockRound: 2,

        description:
            "A hidden chamber has been detected beneath the central structure.",

        discoveryTitle:
            "The Underground Chamber",

        discoveryDescription:
            "Excavation reveals storage vessels and imported goods beneath the central structure.",

        details: [
            "Large storage vessels",
            "Imported goods",
            "Possible controlled storage",
            "Strong evidence of commercial activity"
        ],

        shortResult:
            "Imported goods and storage vessels strengthen the trade hypothesis."
    },


    {
        id: "ceremonial_fragment",
        number: "07",
        title: "Ceremonial Inscription",
        cost: 3,

        unlockRound: 2,

        description:
            "A second inscription fragment is discovered near the central structure.",

        discoveryTitle:
            "A Contradictory Inscription",

        discoveryDescription:
            "The fragment contains references to offerings, ceremonies and gatherings at the site.",

        details: [
            "References ceremonial offerings",
            "Suggests repeated communal activity",
            "Creates tension with a purely commercial interpretation"
        ],

        shortResult:
            "Ceremonial references suggest the site had a ritual function as well."
    },


    {
        id: "storage_vessels",
        number: "08",
        title: "Storage Vessels",
        cost: 2,

        unlockRound: 2,

        requires: [
            "underground_chamber"
        ],

        description:
            "Large storage vessels are documented inside the underground chamber.",

        discoveryTitle:
            "Large Storage Vessels",

        discoveryDescription:
            "The vessels appear designed to hold significant quantities of material.",

        details: [
            "Large storage capacity",
            "Possible goods management",
            "Supports organised distribution"
        ],

        shortResult:
            "Large storage vessels support the idea of organised goods management."
    }

];


/* ============================================================
   EVENTS
   ============================================================ */

const EVENT_DATA = [

    {
        id: "chamber-discovery",

        triggerRound: 2,

        triggerAfter: "underground_chamber",

        title:
            "A New Interpretation Emerges",

        description:
            "The chamber contains imported goods. Your original interpretation of the site may no longer explain all the evidence. How will your expedition respond?",

        options: [

            {
                id: "follow-trade",

                title:
                    "Prioritise the Trade Hypothesis",

                description:
                    "Shift your investigation toward commercial activity and examine evidence related to exchange.",

                cost: 0,

                result:
                    "The team adapted its investigation strategy toward trade."
            },

            {
                id: "investigate-ceremonial",

                title:
                    "Investigate the Contradiction",

                description:
                    "Search for evidence that could explain why a site with trade activity also contains ceremonial references.",

                cost: 0,

                addEvidence: [
                    "ceremonial_fragment"
                ],

                result:
                    "The team investigated contradictory evidence instead of discarding it."
            },

            {
                id: "keep-original",

                title:
                    "Keep the Original Interpretation",

                description:
                    "Continue following the initial hypothesis without changing the investigation strategy.",

                cost: 0,

                result:
                    "The team kept its original direction despite new evidence."
            }

        ]
    }

];


/* ============================================================
   FINAL RECONSTRUCTION OPTIONS
   ============================================================ */

const RECONSTRUCTION_OPTIONS = [

    {
        id: "residential",

        title:
            "Residential Settlement",

        description:
            "A primarily residential community with ordinary domestic activity.",

        correct: false,

        supportingEvidence: [
            "pottery"
        ]
    },


    {
        id: "trading",

        title:
            "Trading Centre",

        description:
            "A major location for exchange, storage and movement of goods.",

        correct: false,

        supportingEvidence: [
            "coin",
            "trade_seal",
            "underground_chamber",
            "storage_vessels"
        ]
    },


    {
        id: "ceremonial",

        title:
            "Religious / Ceremonial Centre",

        description:
            "A site primarily organised around rituals, offerings and communal ceremonies.",

        correct: false,

        supportingEvidence: [
            "inscription",
            "ceremonial_fragment",
            "central_structure"
        ]
    },


    {
        id: "trade_ceremonial",

        title:
            "Trade + Ceremonial Complex",

        description:
            "A multifunctional centre combining organised exchange with important communal or ceremonial activity.",

        correct: true,

        supportingEvidence: [
            "coin",
            "trade_seal",
            "underground_chamber",
            "ceremonial_fragment",
            "central_structure"
        ]
    }

];


/* ============================================================
   AGILE CONCEPT MAPPING
   ============================================================ */

const AGILE_CONCEPTS = [

    {
        concept: "Investigation Backlog",
        gameElement: "Available archaeological investigations",
        agileMeaning: "Product Backlog"
    },

    {
        concept: "Investigation Points",
        gameElement: "Limited resources available to the expedition",
        agileMeaning: "Sprint Capacity"
    },

    {
        concept: "Choosing Investigations",
        gameElement: "Selecting which evidence to investigate",
        agileMeaning: "Sprint Planning"
    },

    {
        concept: "Investigation Rounds",
        gameElement: "Small cycles of investigation and review",
        agileMeaning: "Sprints"
    },

    {
        concept: "New Evidence",
        gameElement: "Unexpected discoveries and contradictions",
        agileMeaning: "Changing Requirements"
    },

    {
        concept: "Changing Strategy",
        gameElement: "Adapting the investigation based on new information",
        agileMeaning: "Responding to Change"
    },

    {
        concept: "Team Discussion",
        gameElement: "Archaeologists interpreting evidence together",
        agileMeaning: "Collaboration"
    },

    {
        concept: "Evidence Review",
        gameElement: "Checking what the team has discovered",
        agileMeaning: "Inspection"
    },

    {
        concept: "Final Reconstruction",
        gameElement: "Presenting the team's interpretation of Site 404",
        agileMeaning: "Sprint Review"
    },

    {
        concept: "What Would You Change?",
        gameElement: "Looking back at decisions and mistakes",
        agileMeaning: "Retrospective"
    }

];


/* ============================================================
   FINAL LEARNING MESSAGE
   ============================================================ */

const LEARNING_DATA = {

    title:
        "You Just Played Agile.",

    subtitle:
        "You were never given the terminology first. You experienced the mechanics first.",

    concepts: [

        {
            title: "Backlog",
            explanation:
                "You had a set of possible investigations and had to decide what mattered."
        },

        {
            title: "Sprint",
            explanation:
                "You worked in small investigation cycles instead of attempting everything at once."
        },

        {
            title: "Capacity",
            explanation:
                "Your Investigation Points forced you to prioritise."
        },

        {
            title: "Inspection",
            explanation:
                "You continuously examined the evidence you had collected."
        },

        {
            title: "Adaptation",
            explanation:
                "New evidence forced you to reconsider your approach."
        },

        {
            title: "Collaboration",
            explanation:
                "The reconstruction depended on the team's collective interpretation."
        },

        {
            title: "Sprint Review",
            explanation:
                "Your final reconstruction represented what your team had built from the available evidence."
        },

        {
            title: "Retrospective",
            explanation:
                "You could look back and ask what you would change in another cycle."
        }

    ],

    finalMessage:
        "Agile is not simply about working faster. It is about delivering in small increments, inspecting what you learn, collaborating continuously, and adapting when reality changes."

};