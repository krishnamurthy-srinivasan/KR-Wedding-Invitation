/* Bride's edition. Every string below comes from
   assets/Roshini weds Krishnamurthy proof 2.pdf.

   NOTE: the two families' Patrikas differ, deliberately. The bride's card
   gives the Muhurtham as 6:00-7:20 a.m. (nazhigai 3 1/4) and adds Viratham
   and Nichayathartham; the groom's card gives 5:30-7:20 a.m. Each side sees
   its own card, so each edition uses its own timings. */
export const WEDDING = {
  side: "bride",

  couple: {
    // On this card the bride is named first throughout.
    bride: {
      name: "Roshini",
      formal: "Sowbhagyavathi R. Roshini",
      initialName: "R. Roshini",
      tamilName: "செளபாக்யவதி R. ரோஷிணி",
      lineage: "அலவந்திபுரம்",
      lineageEn: "Alavandipuram",
      parentsLabel: "Daughter of",
      parents: "Smt. Gayathri Ravishankar & Sri. G. Ravishankar",
      grandparents:
        "Granddaughter of (Late) Sri. T.R. Gopalan & (Late) Smt. G. Vanajakshi, and of (Late) Sri. R. Venkatasubramanian & (Late) Smt. V. Jayalakshmi of Chidambaram",
    },
    groom: {
      name: "Krishnamurthy",
      formal: "Chiranjeevi S. Krishnamurthy",
      initialName: "S. Krishnamurthy",
      tamilName: "சிரஞ்சீவி S. கிருஷ்ணமூர்த்தி",
      lineage: "ஸ்ரீரங்கம்",
      lineageEn: "Srirangam",
      parentsLabel: "Son of",
      parents: "Sri. V. Srinivasan & Smt. S. Chandrakala",
      grandparents:
        "Grandson of (Late) Sri. Venkataramana Rao & (Late) Smt. Rukmani, and of (Late) Sri. Vengasami & (Late) Smt. V. Neela of Mayavaram",
    },
  },

  date: {
    iso: "2026-10-30",
    muhurthamStartISO: "2026-10-30T06:00:00+05:30",   // 6:00 a.m. on this card
    display: "30 · 10 · 2026",
    long: "Friday, 30 October 2026",
    tamil: "30-10-2026, வெள்ளிக்கிழமை",
    tamilMonth: "ஐப்பசி மாதம் 13ஆம் தேதி",
  },

  panchangam: {
    samvatsara: "ஸ்ரீ பராபவ வருடம்",
    lines: [
      "ஐப்பசி மாதம் 13-ம் தேதி",
      "கிருஷ்ணபக்ஷம் · பஞ்சமி திதி",
      "மிருகசீரிஷம் நக்ஷத்திரம் · சித்தயோகம்",
      "உதயாதி நாழிகை 3¼ நாழிகைக்குள்",
    ],
  },

  blessing: {
    invocation: "ஸ்ரீ மஹா கணபதி துணை",
    invocationEn: "With the grace of Sri Maha Ganapathi",
    chant: ["ஜய ஜய சங்கர", "ஹர ஹர சங்கர"],
    chantEn: ["Jaya Jaya Sankara", "Hara Hara Sankara"],
    ramajayam: "ஸ்ரீ ராமஜெயம்",
    ramajayamEn: "Sri Ramajayam",
    deities: [
      "ஸ்ரீ மதுரைவீரஸ்வாமி ஸஹாயம்",
      "தளிகையூர் ஸர்வசக்தி மாரியம்மன் துணை",
      "ஸ்வாமிமலை ஸ்ரீ ஸ்வாமிநாதஸ்வாமி ஸஹாயம்",
    ],
    guru:
      "ஸ்ரீ மஹா த்ரிபுரசுந்தரி ஸமேத ஸ்ரீ சந்திர மௌளீஸ்வர ஸ்வாமி க்ருபையுடன், ஸ்ரீ ஆதிசங்கர பகவத்பாதால் பரம்பராகத மூலம்நாய ஸர்வக்ஞபீடம் ஸ்ரீ காஞ்சி காமகோடி பீடாதிபதி ஜகத்குரு ஸ்ரீஸ்ரீஸ்ரீ சங்கராச்சார்ய ஸ்வாமிகளின் பரிபூர்ண அனுக்ரஹத்தாலும்",
    guruEn:
      "By the grace of Sri Chandramouleeswara Swamy with Sri Maha Tripurasundari, and the blessings of the Jagadguru Sri Sri Sri Sankaracharya Swamigal of the Kanchi Kamakoti Peetam",
    patrikaTitle: "விவாஹ சுபமுஹூர்த்தப் பத்திரிகை",
  },

  muhurtham: {
    label: "Muhurtham",
    time: "6:00 AM – 7:20 AM",
    lagnam: "Tula Lagnam",
    tamil: "காலை 06.00 க்குமேல் 07.20 மணிக்குள் · துலா லக்னத்தில்",
  },

  events: [
    {
      day: "Thursday",
      date: "29 October 2026",
      dateShort: "29 · 10",
      items: [
        { name: "Viratham", time: "7:30 AM", icon: "kalasam" },
        { name: "Nichayathartham", time: "10:30 AM", icon: "garland" },
        { name: "Reception", time: "6:30 PM", icon: "lamp" },
        { name: "Dinner", time: "7:00 PM onwards", icon: "leaf" },
      ],
    },
    {
      day: "Friday",
      date: "30 October 2026",
      dateShort: "30 · 10",
      items: [
        { name: "Muhurtham", time: "6:00 AM – 7:20 AM", note: "Tula Lagnam", icon: "kalasam" },
      ],
    },
  ],

  venue: {
    name: "Rajagopala Thirumana Maaligai",
    tamilName: "ராஜகோபால திருமண மாளிகை",
    lines: ["No. 5, Duraiswamy Reddy Street", "West Tambaram", "Chennai – 600045"],
    mapsQuery:
      "Rajagopal Thirumana Mandapam, No. 5, Duraisamy Reddy Street, Tambaram West, Chennai 600045",
  },

  hosts: [
    { names: ["Smt. Gayathri Ravishankar", "Sri. G. Ravishankar"], place: "Chennai" },
  ],

  compliments: {
    label: "With best compliments from",
    names: ["Smt. Krithika Sriram & Sri G. Sriram"],
    also: "Friends & Relatives",
  },

  familyAddress: [
    "No. 27, Beemeswaran Koil Street",
    "Flat G-2, Kumaraillam",
    "Tambaram West",
    "Chennai – 600045",
  ],

  gallery: [
    { src: "photos/curtain-reveal.jpg",     w: 1080, h: 1350, alt: "Roshini peering from behind a crimson curtain as Krishnamurthy waits" },
    { src: "photos/arch-silhouette.jpg",    w: 1080, h: 608,  alt: "Silhouette of Roshini and Krishnamurthy holding their rings within an arch of light" },
    { src: "photos/ring-moment.jpg",        w: 1080, h: 1350, alt: "Krishnamurthy placing the ring on Roshini's hand" },
    { src: "photos/couple-standing.jpg",    w: 1080, h: 1350, alt: "Roshini and Krishnamurthy standing together, hands joined" },
    { src: "photos/rings-silhouette.jpg",   w: 1080, h: 608,  alt: "Their two hands raised, holding the engagement rings against the light" },
    { src: "photos/illustration-couple.jpg",w: 1086, h: 1448, alt: "Illustrated portrait of the couple in South Indian wedding attire" },
  ],

  patrika: { pdf: "patrika/patrika-bride.pdf", preview: "photos/patrika-bride-card.jpg" },

  meta: {
    title: "Roshini & Krishnamurthy · 30 October 2026",
    description:
      "Smt. Gayathri Ravishankar & Sri. G. Ravishankar solicit your esteemed presence on the marriage of our daughter Roshini with Krishnamurthy. Muhurtham 6:00 AM, Friday 30 October 2026, Chennai.",
  },
};
