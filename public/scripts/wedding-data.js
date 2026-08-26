/* Single source of truth — all copy comes from assets/patrika.md. */
export const WEDDING = {
  couple: {
    groom: {
      name: "Krishnamurthy",
      formal: "Chiranjeevi S. Krishnamurthy",
      initialName: "S. Krishnamurthy",
      tamilName: "சிரஞ்சீவி S. கிருஷ்ணமூர்த்தி",
      lineage: "ஸ்ரீரங்கம்",
      lineageEn: "Srirangam",
      parentsLabel: "Son of",
      parents: "(Late) Sri. Srinivasan & Smt. Chandrakala",
      grandparents: "Grandson of (Late) Sri. Venkataramana Rao & Smt. Rukmani",
    },
    bride: {
      name: "Roshini",
      formal: "Sowbhagyavathi R. Roshini",
      initialName: "R. Roshini",
      tamilName: "செளபாக்யவதி R. ரோஷிணி",
      lineage: "அலவந்திபுரம்",
      lineageEn: "Alavandipuram",
      parentsLabel: "Daughter of",
      parents: "Sri. Ravishankar & Smt. Gayathri",
      grandparents: "Granddaughter of (Late) Sri. T.R. Gopalan & Smt. Vanajakshi",
    },
  },

  date: {
    iso: "2026-10-30",
    // Muhurtham begins 5:30 AM IST (UTC+5:30)
    muhurthamStartISO: "2026-10-30T05:30:00+05:30",
    display: "30 · 10 · 2026",
    long: "Friday, 30 October 2026",
    tamil: "30-10-2026, வெள்ளிக்கிழமை",
    tamilMonth: "ஐப்பசி மாதம் 13ஆம் தேதி",
  },

  panchangam: {
    samvatsara: "பராபவ நாம ஸம்வத்ஸரம்",
    lines: [
      "தக்ஷிணாயனம் · சரத்ருது",
      "ஆஸ்விஜ மாதம் · கிருஷ்ண பக்ஷம்",
      "பஞ்சமி திதி · மிருகசீர்ஷம் நக்ஷத்ரம்",
      "சிவயோகம் · கௌலவகரணம்",
    ],
  },

  blessing: {
    invocation: "ஸ்ரீ:",
    haribhakti: ["ஹரி சர்வோத்தம :", "வாயு ஜீவோத்தம :"],
    shloka: [
      "कल्याणाद्भुतगात्राय कामितार्थप्रदायिने।",
      "श्रीमद्वेङ्कटनाथाय श्रीनिवासाय ते नमः ॥",
    ],
    deity: "தான்தோன்றி ஸ்ரீ கல்யாண வெங்கடரமண ஸ்வாமி துணை",
    deityEn: "Under the grace of Sri Kalyana Venkataramana Swamy",
    guru:
      "ஸ்ரீ ஹரிவாயு குருக்களின் அனுக்ரஹத்தாலும், உத்தராதி மடாதீசரான ஜகத்குரு ஸ்ரீ 1008 ஸ்ரீ ஸத்யாத்ம தீர்த்தரின் அனுக்ரஹத்தாலும்",
    guruEn:
      "By the grace of Sri Harivayu Gurugal and Jagadguru Sri 1008 Sri Satyatma Tirtha of Uttaradi Matha",
    patrikaTitle: "விவாஹ சுபமுஹூர்த்தப் பத்திரிகை",
  },

  muhurtham: {
    label: "Muhurtham",
    time: "5:30 AM – 7:20 AM",
    lagnam: "Thula Lagnam",
    tamil: "காலை 5.30 மணிக்குமேல் 7.20 மணிக்குள் · துலா லக்னத்தில்",
  },

  events: [
    {
      day: "Thursday",
      date: "29 October 2026",
      dateShort: "29 · 10",
      items: [
        { name: "Reception", time: "6:00 PM onwards", icon: "garland" },
        { name: "Dinner", time: "7:00 PM onwards", icon: "leaf" },
      ],
    },
    {
      day: "Friday",
      date: "30 October 2026",
      dateShort: "30 · 10",
      items: [
        { name: "Muhurtham", time: "5:30 AM – 7:20 AM", note: "Thula Lagnam", icon: "kalasam" },
      ],
    },
  ],

  venue: {
    name: "Rajagopal Thirumana Mandapam",
    tamilName: "ராஜகோபால திருமண மாளிகை",
    lines: ["No. 5, Duraisamy Reddy Street", "Tambaram West", "Chennai – 600045"],
    mapsQuery:
      "Rajagopal Thirumana Mandapam, No. 5, Duraisamy Reddy Street, Tambaram West, Chennai 600045",
  },

  hosts: [
    { names: ["Smt. Kousalya Gopinathan", "Sri. Gopinathan"], place: "Tirupur", phone: "63815 58228" },
    { names: ["Smt. Gayathri Ravishankar", "Sri. Ravishankar"], place: "Chennai" },
  ],

  welcomers: {
    label: "தங்கள் நல்வரவை நாடும்",
    labelEn: "Awaiting your gracious presence",
    names: ["V. Narayanan", "N. Sowmya"],
    phone: "9962231392",
  },

  gallery: [
    { src: "photos/curtain-reveal.jpg",     w: 1080, h: 1350, alt: "Roshini peering from behind a crimson curtain as Krishnamurthy waits", span: "tall" },
    { src: "photos/arch-silhouette.jpg",    w: 1080, h: 608,  alt: "Silhouette of Krishnamurthy and Roshini holding their rings within an arch of light", span: "wide" },
    { src: "photos/ring-moment.jpg",        w: 1080, h: 1350, alt: "Krishnamurthy placing the ring on Roshini's hand", span: "tall" },
    { src: "photos/couple-standing.jpg",    w: 1080, h: 1350, alt: "Krishnamurthy and Roshini standing together, hands joined", span: "tall" },
    { src: "photos/rings-silhouette.jpg",   w: 1080, h: 608,  alt: "Their two hands raised, holding the engagement rings against the light", span: "wide" },
    { src: "photos/illustration-couple.jpg",w: 1086, h: 1448, alt: "Illustrated portrait of the couple in South Indian wedding attire", span: "tall" },
  ],

  patrika: { pdf: "patrika/patrika.pdf", preview: "photos/patrika-card.jpg" },

  meta: {
    title: "Krishnamurthy & Roshini · 30 October 2026",
    description:
      "Together with our families, we invite you to celebrate our wedding. Muhurtham 5:30 AM, Friday 30 October 2026, Rajagopal Thirumana Mandapam, Chennai.",
  },
};
