export const verifiedAt = "2026-05-10";

export const sources = [
  {
    label: "WHO DON599",
    title: "Hantavirus cluster linked to cruise ship travel, Multi-country",
    date: "2026-05-04",
    url: "https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599",
    scope: "Initial outbreak notice"
  },
  {
    label: "WHO briefing",
    title: "Director-General media briefing remarks",
    date: "2026-05-07",
    url: "https://www.who.int/news-room/speeches/item/who-director-general-s-opening-remarks-at-the-media-briefing---7-may-2026",
    scope: "Latest WHO case count"
  },
  {
    label: "CDC cases",
    title: "Reported Cases of Hantavirus Disease",
    date: "2026-04-23",
    url: "https://www.cdc.gov/hantavirus/data-research/cases/index.html",
    scope: "United States surveillance summary"
  },
  {
    label: "CDC reporting",
    title: "Hantavirus Case Definition and Reporting",
    date: "2025-06-30",
    url: "https://www.cdc.gov/hantavirus/php/surveillance/index.html",
    scope: "Notifiable condition and NNDSS reporting"
  },
  {
    label: "WHO fact sheet",
    title: "Hantavirus",
    date: "2026-05-06",
    url: "https://www.who.int/news-room/fact-sheets/detail/hantavirus",
    scope: "Disease background and prevention"
  }
];

export const newsHeadlines = [
  {
    source: "AP",
    date: "2026-05-09",
    tag: "TENERIFE",
    headline: "WHO chief heads to Tenerife to reassure residents ahead of virus-hit ship arrival",
    summary:
      "AP reported WHO and Spanish officials were coordinating the MV Hondius arrival in Tenerife while saying public risk remained low.",
    url: "https://apnews.com/article/53d606306e31bf220d92614d9de519dd"
  },
  {
    source: "Sky News",
    date: "2026-05-09",
    tag: "COUNT UPDATE",
    headline: "Three dead as virus breaks out on Atlantic cruise ship",
    summary:
      "Sky reported the WHO-linked confirmed count had risen to six, with Spain also assessing hospital and contact signals.",
    url: "https://news.sky.com/story/three-dead-as-virus-breaks-out-on-atlantic-cruise-ship-13503266"
  },
  {
    source: "AP",
    date: "2026-05-07",
    tag: "CONTACT TRACE",
    headline: "Health officials track dozens who left hantavirus-stricken ship after first fatality",
    summary:
      "AP reported the operator put the St. Helena disembarkation at 30 people, while the Dutch Foreign Ministry put it at about 40.",
    url: "https://apnews.com/article/hantavirus-cruise-ship-st-helena-9c70878b2ff59d187f1e34c12627cea7"
  },
  {
    source: "AP",
    date: "2026-05-07",
    tag: "TIMELINE",
    headline: "A timeline of the cruise ship hantavirus outbreak and when passengers fell sick",
    summary:
      "AP reconstructed the sequence from the April 1 departure through the May 6 evacuations and May 7 tracing operations.",
    url: "https://apnews.com/article/hantavirus-cruise-ship-timeline-events-b9eb3985b547758b1e42dbab6ceb3887"
  },
  {
    source: "CNN",
    date: "2026-05-07",
    tag: "GLOBAL MONITOR",
    headline: "From US to Singapore, cruise passengers are being monitored for hantavirus",
    summary:
      "CNN reported 146 people from 23 countries remained aboard under strict precautionary measures as countries monitored travelers.",
    url: "https://kesq.com/news/national-world/cnn-world/2026/05/07/hantavirus-cases-now-suspected-in-5-countries-as-authorities-scramble-to-contain-outbreak/"
  },
  {
    source: "Reuters",
    date: "2026-05-07",
    tag: "WIRE",
    headline: "Countries track passengers of virus-hit cruise ship",
    summary:
      "Reuters reported countries were tracing passengers who disembarked before detection and people who had close contact with them.",
    url: "https://www.thestar.com.my/news/world/2026/05/07/countries-scramble-to-track-passengers-of-virus-hit-cruise-ship"
  },
  {
    source: "The Guardian",
    date: "2026-05-07",
    tag: "EXPLAINER",
    headline: "Where did the cruise ship hantavirus come from and what happens next?",
    summary:
      "The Guardian summarized the known patients, the Canary Islands destination, and why Andes virus is being watched closely.",
    url: "https://www.theguardian.com/world/2026/may/07/where-cruise-ship-hantavirus-from-what-next-canary-islands"
  },
  {
    source: "CBS News",
    date: "2026-05-04",
    tag: "OUTBREAK",
    headline: "Apparent hantavirus outbreak kills 3 on cruise ship, sickens at least 3 more",
    summary:
      "CBS News reported three deaths and additional illnesses aboard the MV Hondius as health officials investigated the suspected outbreak.",
    url: "https://www.cbsnews.com/news/hantavirus-cruise-ship-outbreak-kills-3-sickens-3/"
  }
];

export const activeEvent = {
  name: "LIVE VIRUS TRACKER",
  status: "ACTIVE MONITORING",
  risk: "WHO PUBLIC RISK: LOW",
  location: "Multi-country response, South Atlantic travel cluster",
  updated: "2026-05-09",
  confirmedUpdatedAt: "2026-05-09T12:34:32Z",
  confirmedDelta: 1,
  confirmed: 6,
  suspected: 2,
  deaths: 3,
  affected: "Cruise passengers and contacts",
  note:
    "WHO says additional cases may be reported because Andes virus incubation can extend up to six weeks."
};

export const trackerMarkers = {
  confirmed: [
    {
      id: "confirmed-uk",
      flag: "🇬🇧",
      label: "British passenger",
      x: "54%",
      y: "34%",
      drift: ["18px", "-22px", "-14px", "18px"],
      delay: "0s"
    },
    {
      id: "confirmed-nl",
      flag: "🇳🇱",
      label: "Dutch case",
      x: "42%",
      y: "56%",
      drift: ["-16px", "20px", "20px", "-12px"],
      delay: "-1.1s"
    },
    {
      id: "confirmed-ch",
      flag: "🇨🇭",
      label: "Swiss passenger",
      x: "69%",
      y: "50%",
      drift: ["14px", "18px", "-18px", "-20px"],
      delay: "-2.2s"
    },
    {
      id: "confirmed-unknown-a",
      label: "Confirmed case",
      x: "61%",
      y: "66%",
      drift: ["22px", "-16px", "-12px", "22px"],
      delay: "-3.1s"
    },
    {
      id: "confirmed-unknown-b",
      label: "Confirmed case",
      x: "49%",
      y: "72%",
      drift: ["-18px", "-18px", "14px", "16px"],
      delay: "-4s"
    },
    {
      id: "confirmed-de",
      flag: "🇩🇪",
      label: "German-linked confirmed case",
      x: "74%",
      y: "32%",
      drift: ["16px", "20px", "-16px", "-14px"],
      delay: "-2.7s"
    }
  ],
  suspected: [
    {
      id: "suspected-es",
      flag: "🇪🇸",
      label: "Spain hospital/contact assessment",
      x: "34%",
      y: "45%",
      drift: ["-20px", "-12px", "18px", "18px"],
      delay: "-0.5s"
    },
    {
      id: "suspected-unknown",
      label: "Suspected case",
      x: "39%",
      y: "76%",
      drift: ["18px", "-18px", "-22px", "12px"],
      delay: "-2.8s"
    }
  ],
  deaths: [
    { id: "death-nl-man", flag: "🇳🇱", label: "Dutch passenger", x: "17%", y: "74%" },
    { id: "death-nl-woman", flag: "🇳🇱", label: "Dutch passenger", x: "24%", y: "76%" },
    { id: "death-de", flag: "🇩🇪", label: "German passenger", x: "82%", y: "75%" }
  ]
};

export const worldMapSignals = [
  {
    country: "Netherlands",
    code: "NL",
    status: "confirmed",
    x: "45.3%",
    y: "16.3%",
    labelX: "16px",
    labelY: "-25px",
    tooltipX: "18px",
    tooltipY: "20px",
    count: "2 fatal",
    detail: "Dutch fatal cases remain part of the confirmed MV Hondius cluster.",
    source: "WHO / AP"
  },
  {
    country: "United Kingdom",
    code: "UK",
    status: "confirmed",
    x: "42.8%",
    y: "14.6%",
    labelX: "-11px",
    labelY: "-30px",
    tooltipX: "-58px",
    tooltipY: "22px",
    count: "linked",
    detail: "UK IHR reporting and British passenger links remain in the confirmed case trail.",
    source: "WHO / Sky"
  },
  {
    country: "Switzerland",
    code: "CH",
    status: "confirmed",
    x: "46.2%",
    y: "20.4%",
    labelX: "17px",
    labelY: "13px",
    tooltipX: "20px",
    tooltipY: "28px",
    count: "1",
    detail: "A Swiss case was reported after disembarkation and international tracing.",
    source: "AP / CNN"
  },
  {
    country: "Germany",
    code: "DE",
    status: "confirmed",
    x: "46.9%",
    y: "17%",
    labelX: "21px",
    labelY: "-7px",
    tooltipX: "22px",
    tooltipY: "18px",
    count: "linked",
    detail: "German-linked fatal/confirmed signal included in the updated six-case cluster.",
    source: "Sky"
  },
  {
    country: "South Africa",
    code: "ZA",
    status: "confirmed",
    x: "51.1%",
    y: "80.8%",
    tooltipX: "20px",
    tooltipY: "-142px",
    count: "lab trail",
    detail: "South African testing identified hantavirus in the cruise-linked cluster.",
    source: "AP"
  },
  {
    country: "Spain",
    code: "ES",
    status: "suspected",
    x: "42.4%",
    y: "25.5%",
    labelX: "-42px",
    labelY: "9px",
    tooltipX: "-226px",
    tooltipY: "26px",
    count: "2 watch",
    detail: "Spain has hospital/contact assessment signals after the ship moved toward the Canary Islands.",
    source: "Sky"
  },
  {
    country: "France",
    code: "FR",
    status: "contact",
    x: "44.4%",
    y: "21%",
    labelX: "-44px",
    labelY: "1px",
    tooltipX: "-242px",
    tooltipY: "20px",
    count: "contacts",
    detail: "Passengers and contacts have been traced through French channels.",
    source: "Reuters / AP"
  },
  {
    country: "United States",
    code: "US",
    status: "contact",
    x: "12.8%",
    y: "26%",
    count: "returned",
    detail: "US passengers or contacts were reported under public-health monitoring.",
    source: "CNN"
  },
  {
    country: "Canada",
    code: "CA",
    status: "contact",
    x: "10.3%",
    y: "13.1%",
    count: "returned",
    detail: "Returned passengers were reported under local health follow-up.",
    source: "CNN"
  },
  {
    country: "Singapore",
    code: "SG",
    status: "contact",
    x: "76.2%",
    y: "56.7%",
    tooltipX: "-246px",
    tooltipY: "18px",
    count: "flight",
    detail: "Singapore monitored travelers linked to the ship and connecting flights.",
    source: "CNN"
  },
  {
    country: "Chile",
    code: "CL",
    status: "contact",
    x: "21.2%",
    y: "86.1%",
    tooltipX: "18px",
    tooltipY: "-146px",
    count: "isolated",
    detail: "Returned travelers were reported under isolation or monitoring.",
    source: "Reuters"
  },
  {
    country: "Ireland",
    code: "IE",
    status: "contact",
    x: "41.1%",
    y: "15.2%",
    labelX: "-42px",
    labelY: "-14px",
    tooltipX: "-226px",
    tooltipY: "18px",
    count: "returned",
    detail: "Passengers from the affected voyage were reported in follow-up lists.",
    source: "CNN"
  },
  {
    country: "New Zealand",
    code: "NZ",
    status: "contact",
    x: "98.4%",
    y: "90.3%",
    labelX: "-38px",
    tooltipX: "-258px",
    tooltipY: "-150px",
    count: "trace",
    detail: "Passengers from the affected voyage appeared in international tracing reports.",
    source: "CNN"
  }
];

export const usSummary = [
  { label: "US lab-confirmed cases", value: "890", detail: "1993 through end of 2023" },
  { label: "HPS cases", value: "859", detail: "CDC surveillance subset" },
  { label: "Non-pulmonary infections", value: "31", detail: "Reported since 2015 definition expansion" },
  { label: "Fatal outcomes", value: "35%", detail: "CDC reported proportion" },
  { label: "West of Mississippi", value: "94%", detail: "Geographic concentration of US cases" },
  { label: "Median age", value: "38", detail: "Range 5 to 88 years" }
];

export const regionalFocus = [
  { region: "Four Corners", signal: 96, label: "Historic origin area", detail: "AZ, CO, NM, UT surveillance anchor" },
  { region: "Western US", signal: 94, label: "Primary US concentration", detail: "CDC: 94% west of Mississippi" },
  { region: "Rural settings", signal: 78, label: "Exposure setting", detail: "Rodent habitat and enclosed cleanup" },
  { region: "Eastern US", signal: 18, label: "Lower historical share", detail: "Cases occur, but less commonly" }
];

export const topTimeline = [
  {
    date: "APR 01",
    level: "normal",
    title: "MV Hondius departs Ushuaia",
    detail:
      "MV Hondius departed Ushuaia, Argentina, with 175 passengers and crew aboard for its South Atlantic itinerary.",
    source: "Wikipedia timeline",
    url: "https://en.wikipedia.org/wiki/MV_Hondius_hantavirus_outbreak"
  },
  {
    date: "APR 06",
    level: "watch",
    title: "First symptoms begin",
    detail:
      "The first known patient, a 70-year-old Dutch man, began showing symptoms while aboard the vessel.",
    source: "Wikipedia timeline",
    url: "https://en.wikipedia.org/wiki/MV_Hondius_hantavirus_outbreak"
  },
  {
    date: "APR 11",
    level: "critical",
    title: "First death onboard",
    detail:
      "The first patient died onboard. The death was initially attributed to natural causes before the outbreak was identified.",
    source: "Wikipedia timeline",
    url: "https://en.wikipedia.org/wiki/MV_Hondius_hantavirus_outbreak"
  },
  {
    date: "APR 13-15",
    level: "normal",
    title: "Tristan da Cunha stop",
    detail:
      "The ship stopped at Tristan da Cunha after the first onboard death, before the outbreak had been recognized.",
    source: "Wikipedia timeline",
    url: "https://en.wikipedia.org/wiki/MV_Hondius_hantavirus_outbreak"
  },
  {
    date: "APR 24",
    level: "critical",
    title: "St. Helena disembarkation",
    detail:
      "At Saint Helena, the first victim's body and his wife left the ship. Wikipedia notes Oceanwide reported 30 passengers disembarked, while Dutch officials put the number at about 40.",
    source: "Wikipedia timeline",
    url: "https://en.wikipedia.org/wiki/MV_Hondius_hantavirus_outbreak"
  },
  {
    date: "APR 26",
    level: "critical",
    title: "Widow dies in Johannesburg",
    detail:
      "The wife of the first victim died in a Johannesburg hospital after leaving the ship and being removed from a KLM flight before takeoff because of her condition.",
    source: "Wikipedia timeline",
    url: "https://en.wikipedia.org/wiki/MV_Hondius_hantavirus_outbreak"
  },
  {
    date: "APR 27",
    level: "watch",
    title: "Ascension Island departure",
    detail:
      "After Saint Helena, Hondius continued to Ascension Island, where an ill British passenger was removed and flown to South Africa for hospital care.",
    source: "Wikipedia timeline",
    url: "https://en.wikipedia.org/wiki/MV_Hondius_hantavirus_outbreak"
  },
  {
    date: "MAY 02",
    level: "critical",
    title: "Third death onboard",
    detail:
      "A German woman died onboard the ship. Her body remained aboard as the outbreak investigation continued.",
    source: "Wikipedia timeline",
    url: "https://en.wikipedia.org/wiki/MV_Hondius_hantavirus_outbreak"
  },
  {
    date: "MAY 03",
    level: "watch",
    title: "Praia, Cape Verde",
    detail:
      "The ship arrived at Praia. Cape Verdean authorities sent supplies and officials, expanded port safety protocols, and coordinated an isolation area and response team.",
    source: "Wikipedia timeline",
    url: "https://en.wikipedia.org/wiki/MV_Hondius_hantavirus_outbreak"
  },
  {
    date: "MAY 04",
    level: "high",
    title: "Andes virus confirmed",
    detail:
      "The first positive test for Andes virus was received after sequencing identified the virus in at least one infected person.",
    source: "Wikipedia timeline",
    url: "https://en.wikipedia.org/wiki/MV_Hondius_hantavirus_outbreak"
  },
  {
    date: "MAY 06",
    level: "high",
    title: "Evacuations and Tenerife plan",
    detail:
      "Hondius left Cape Verde for the Canary Islands. Three symptomatic people were evacuated by air ambulance, medical experts boarded, and Spain approved an offshore Tenerife evacuation plan.",
    source: "Wikipedia timeline",
    url: "https://en.wikipedia.org/wiki/MV_Hondius_hantavirus_outbreak"
  },
  {
    date: "MAY 07",
    level: "watch",
    title: "Flight and country tracing expands",
    detail:
      "Dutch authorities analyzed flight exposure risk, the UK traced people who left at Saint Helena, Canadians were isolating, and Singapore began testing two residents linked to the voyage.",
    source: "Wikipedia timeline",
    url: "https://en.wikipedia.org/wiki/MV_Hondius_hantavirus_outbreak"
  },
  {
    date: "MAY 08",
    level: "high",
    title: "22-country evacuation readied",
    detail:
      "With 147 people and one body still aboard, Hondius was en route to Tenerife. Wikipedia lists three deaths, six confirmed cases, two probable cases, and evacuation planning with 22 countries.",
    source: "Wikipedia timeline",
    url: "https://en.wikipedia.org/wiki/MV_Hondius_hantavirus_outbreak"
  },
  {
    date: "MAY 08",
    level: "high",
    title: "CDC issues US health advisory",
    detail:
      "CDC issued a HAN advisory for clinicians and public health officials, citing the MV Hondius outbreak, six confirmed cases, two suspected cases, three deaths, and US repatriation planning.",
    source: "CDC HAN00528",
    url: "https://www.cdc.gov/han/php/notices/han00528.html"
  },
  {
    date: "MAY 09",
    level: "high",
    title: "UKHSA revises the case picture",
    detail:
      "UKHSA said WHO's latest May 8 update listed eight cases in total, with six confirmed and two suspected. One earlier suspected case was discounted after testing.",
    source: "UKHSA update",
    url: "https://www.gov.uk/government/news/ukhsa-update-on-the-hantavirus-cruise-ship-outbreak"
  },
  {
    date: "MAY 09",
    level: "watch",
    title: "Tenerife evacuation briefing",
    detail:
      "AP reported WHO and Spanish officials were in Tenerife for the planned Hondius operation, with passengers expected to leave by small boat and evacuate by national flights.",
    source: "AP",
    url: "https://apnews.com/article/53d606306e31bf220d92614d9de519dd"
  },
  {
    date: "MAY 10",
    level: "watch",
    title: "Granadilla operation moves ahead",
    detail:
      "Spanish and European reporting said the controlled Granadilla/Tenerife reception plan was moving ahead despite Canary Islands objections, with the vessel expected to remain isolated from residents during evacuations.",
    source: "El Pais",
    url: "https://elpais.com/sociedad/2026-05-10/el-gobierno-impone-a-canarias-la-acogida-del-crucero-mv-hondius-ante-la-negativa-de-clavijo-de-autorizar-el-fondeo.html"
  }
];

export const eventTimeline = [
  {
    date: "2026-04-01",
    title: "Vessel departed Ushuaia",
    detail: "WHO reported a South Atlantic itinerary with stops including Antarctica, South Georgia, Saint Helena, and Ascension Island."
  },
  {
    date: "2026-04-06",
    title: "First known symptom onset",
    detail: "Adult passenger developed fever, headache, and gastrointestinal symptoms aboard the vessel."
  },
  {
    date: "2026-05-02",
    title: "WHO notified under IHR",
    detail: "United Kingdom IHR focal point notified WHO of a severe respiratory illness cluster."
  },
  {
    date: "2026-05-04",
    title: "WHO Disease Outbreak News",
    detail: "Seven cases were listed at that time, including two confirmed, five suspected, and three deaths."
  },
  {
    date: "2026-05-07",
    title: "WHO briefing update",
    detail: "WHO reported eight cases: five confirmed, three suspected, and three deaths."
  },
  {
    date: "2026-05-09",
    title: "Tenerife arrival protocols",
    detail:
      "AP reported WHO and Spanish officials were heading to Tenerife to coordinate MV Hondius arrival plans while saying public risk remained low."
  }
];

export const signalRows = [
  {
    id: "global-mv-hondius",
    scope: "GLOBAL",
    signal: "MV Hondius cluster",
    level: "critical",
    count: "6C / 2S / 3D",
    update: "2026-05-09",
    source: "Sky / WHO",
    action: "Monitor official updates and contact tracing notices"
  },
  {
    id: "us-historical",
    scope: "US",
    signal: "Hantavirus disease surveillance",
    level: "medium",
    count: "890 total",
    update: "2026-04-23",
    source: "CDC cases",
    action: "Use state-level public health channels for local detail"
  },
  {
    id: "clinical-hps",
    scope: "CLINICAL",
    signal: "HPS respiratory progression",
    level: "high",
    count: "1-8w onset",
    update: "2026-05-06",
    source: "WHO fact sheet",
    action: "Escalate suspected exposure with fever or breathing symptoms"
  },
  {
    id: "prevention-cleanup",
    scope: "PREVENTION",
    signal: "Rodent-contaminated cleaning",
    level: "watch",
    count: "Avoid dry sweep",
    update: "2026-05-06",
    source: "WHO fact sheet",
    action: "Ventilate, wet contaminated material, seal entry points"
  }
];

export const preventionCards = [
  {
    title: "Primary transmission",
    items: [
      "Exposure to urine, droppings, or saliva from infected rodents",
      "Less common transmission from bites or contaminated surfaces",
      "Andes virus is the known exception with limited person-to-person spread"
    ]
  },
  {
    title: "Clinical watch",
    items: [
      "Fever, headache, muscle aches, and gastrointestinal symptoms",
      "Rapid progression can include cough, shortness of breath, shock, or kidney complications",
      "Early supportive care and ICU access improve outcomes in severe disease"
    ]
  },
  {
    title: "Prevention protocol",
    items: [
      "Seal holes and reduce rodent food, water, and shelter",
      "Ventilate enclosed areas before cleanup",
      "Do not dry sweep or vacuum suspected contaminated rodent material"
    ]
  }
];
