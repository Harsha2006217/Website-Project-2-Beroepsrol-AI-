/* ==========================================================================
   Bestand: script.js
   Project: Open-ICT Semester 1 - Project 2: Beroepsrollen (Onderdeel A & B)
   Beroepsrol: Artificial Intelligence (AI) Engineer - "Kat of Hond?" (Liner.ai)
   Auteur: Harsha Vardhan Kanaparthi (Team Onderdeel B: Harsha, Giovanni, Nick)
   Datum: September 2026

   Wat dit JavaScript-bestand regelt (zonder externe libraries):
   1. Mobiel navigatiemenu openen/sluiten (ook handig bij 200% browser-zoom).
   2. Licht / Donker thema wisselen met opslag in localStorage.
   3. Jargon-hulp modus + klikbare AI-termen: toegevoegd nadat medestudenten op
      post-its aangaven dat termen zoals LLM, EfficientNet en Data at Rest in
      onze presentatie soms nog technisch waren.
   4. Toegankelijke tabbladen voor Onderdeel A (Stap 1 t/m Stap 6 onderzoek).
   5. Interactieve Liner.ai Test- & Drempelwaarde-simulator voor Onderdeel B
      (met de echte percentages uit onze 6 teamtests + mijn Wildcard-experiment).
   6. Filter op onze User Stories (US 1 t/m US 9, Learning Story 1 & Wildcard)
      gekoppeld aan ons Jira-bord (AI-1 t/m AI-9).
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------------------------------------------------------
     1. Mobiele navigatie (hamburger-knop bij kleinere breedte of 200% zoom)
     ------------------------------------------------------------------------ */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Sluit het uitgeklapte menu automatisch zodra de bezoeker op een link klikt
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (mainNav.classList.contains("is-open")) {
          mainNav.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     2. Licht / Donker thema schakelaar
     ------------------------------------------------------------------------ */
  const themeToggle = document.getElementById("themeToggle");
  const htmlEl = document.documentElement;

  // Veilige wrapper rond localStorage zodat sandbox-iframes geen foutmelding geven
  function leesVoorkeur(sleutel) {
    try {
      return window.localStorage.getItem(sleutel);
    } catch {
      return null;
    }
  }

  function bewaarVoorkeur(sleutel, waarde) {
    try {
      window.localStorage.setItem(sleutel, waarde);
    } catch {
      // Geen probleem als opslag geblokkeerd is in preview-modus
    }
  }

  const opgeslagenThema = leesVoorkeur("project2_thema");
  if (opgeslagenThema === "dark") {
    htmlEl.setAttribute("data-theme", "dark");
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", "true");
      themeToggle.textContent = "Lichte modus";
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDonker = htmlEl.getAttribute("data-theme") === "dark";
      if (isDonker) {
        htmlEl.removeAttribute("data-theme");
        themeToggle.setAttribute("aria-pressed", "false");
        themeToggle.textContent = "Donkere modus";
        bewaarVoorkeur("project2_thema", "light");
      } else {
        htmlEl.setAttribute("data-theme", "dark");
        themeToggle.setAttribute("aria-pressed", "true");
        themeToggle.textContent = "Lichte modus";
        bewaarVoorkeur("project2_thema", "dark");
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Jargon-hulp modus & klikbare begrippenlijst
        Verwerkt direct de post-it feedback:
        - "Meer uitleg over AI termen als LLM"
        - "tip: uitleg over de beroepsrol is wat technisch"
     ------------------------------------------------------------------------ */
  const jargonToggle = document.getElementById("jargonToggle");
  const termUitlegBox = document.getElementById("termPopover");
  const termWoordenboek = {
    efficientnet:
      "EfficientNet: Een voorgetraind beeldherkenningsmodel (CNN) dat met relatief weinig rekenkracht en stroom toch patronen zoals oren, ogen en vacht herkent.",
    transferlearning:
      "Transfer Learning: Je traint een AI-model niet vanaf nul, maar bouwt voort op een model dat al miljoenen algemene foto's heeft gezien. Daardoor hadden wij aan 150+ foto's al genoeg voor een werkende basis.",
    loss:
      "Training Loss: Een foutscore tijdens het trainen. Hoe dichter bij 0, hoe minder fouten het model nog maakt op de trainingsfoto's (bij ons zakte die van 0,44 naar bijna 0,00).",
    llm:
      "LLM (Large Language Model): Een groot taalmodel (zoals ChatGPT of Claude) dat tekst voorspelt en samenvat. Anders dan ons kat-of-hond beeldmodel werkt een LLM op woorden/tokens in plaats van alleen pixels.",
    rag:
      "RAG (Retrieval-Augmented Generation): Een techniek waarbij een AI-chatbot eerst echte bedrijfsdocumenten opzoekt voordat hij antwoord geeft, zodat hij minder verzint.",
    overfitting:
      "Overfitting: Het model leert de trainingsfoto's bijna uit zijn hoofd (bijv. 100% score op validatie), maar raakt in de war bij nieuwe foto's uit een andere hoek of met een drukke achtergrond.",
    dataatrest:
      "Data at Rest: Gegevens die opgeslagen staan op een schijf of in een map (zoals onze trainingsdataset), in tegenstelling tot data die onderweg is over het internet.",
    cema:
      "CEMA (Cyber Electromagnetic Activities): Term uit ons interview met het Defensie Cyber Commando waarbij draadloze signalen (zoals radio/wifi) en cyberoperaties samenkomen."
  };

  if (jargonToggle) {
    jargonToggle.addEventListener("click", () => {
      const actief = document.body.classList.toggle("jargon-mode");
      jargonToggle.setAttribute("aria-pressed", String(actief));
      jargonToggle.textContent = actief
        ? "Jargon-uitleg: AAN"
        : "Jargon-uitleg: UIT";
    });
  }

  document.querySelectorAll(".term-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const sleutel = chip.getAttribute("data-term");
      if (termUitlegBox && sleutel && termWoordenboek[sleutel]) {
        termUitlegBox.hidden = false;
        termUitlegBox.textContent = termWoordenboek[sleutel];
      }
    });
  });

  /* ------------------------------------------------------------------------
     4. Print-knop om de pagina direct als fysieke infographic te printen
     ------------------------------------------------------------------------ */
  const printBtn = document.getElementById("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  /* ------------------------------------------------------------------------
     5. Tabbladen voor Onderdeel A (Stap 1 t/m Stap 6 beroepsrolonderzoek)
        Met volledige pijltoets-ondersteuning voor toegankelijkheid.
     ------------------------------------------------------------------------ */
  const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
  const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));

  function activeerTab(gekozenKnop, zetFocus = false) {
    const doelId = gekozenKnop.getAttribute("aria-controls");
    tabButtons.forEach((btn) => {
      const isGekozen = btn === gekozenKnop;
      btn.setAttribute("aria-selected", String(isGekozen));
      btn.setAttribute("tabindex", isGekozen ? "0" : "-1");
    });

    tabPanels.forEach((paneel) => {
      paneel.hidden = paneel.id !== doelId;
    });

    if (zetFocus) {
      gekozenKnop.focus();
    }
  }

  tabButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => activeerTab(btn, false));
    btn.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        const volgende = tabButtons[(index + 1) % tabButtons.length];
        activeerTab(volgende, true);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        const vorige =
          tabButtons[(index - 1 + tabButtons.length) % tabButtons.length];
        activeerTab(vorige, true);
      }
    });
  });

  /* ------------------------------------------------------------------------
     6. Interactieve Liner.ai Test- & Drempelwaarde-Simulator (Onderdeel B)
        Bevat de echte cijfers uit onze 6 teamtests + mijn Wildcard-experiment!
     ------------------------------------------------------------------------ */
  const testScenarios = {
    test1: {
      titel: "Test 1 (Basis): Duidelijke foto van een hond buiten",
      hond: 90,
      kat: 7,
      overig: 3,
      toelichting:
        "Bij gewone, scherpe foto's uit onze ongeziene testset (US 4) zat het eerste model rond de 90% zekerheid met maar enkele missers."
    },
    test2: {
      titel: "Test 2 (US 1 & US 4): Willekeurig voorwerp (koffiemok / fiets)",
      hond: 6,
      kat: 4,
      overig: 90,
      toelichting:
        "Dankzij onze derde categorie 'Overig' (50+ foto's van andere dieren en objecten) dwingen we het model niet om overal een kat of hond in te zien."
    },
    test3: {
      titel: "Test 3 (US 8 - Model verbeterd): Na toevoegen van extra variatie",
      hond: 98,
      kat: 1.5,
      overig: 0.5,
      toelichting:
        "Nadat ik en mijn teamgenoten extra gevarieerde en eerder lastige foto's toevoegden aan de dataset, steeg de zekerheid op standaardtests van ~90% naar ~98%."
    },
    test4: {
      titel: "Test 4 (US 5): Verstopte kat half onder een deken",
      hond: 0.02,
      kat: 99.96,
      overig: 0.02,
      toelichting:
        "Verrassend resultaat uit onze foutenanalyse: zolang een driehoekig oor en oog zichtbaar waren, herkende EfficientNet het verstopte dier met 99,96% zekerheid!"
    },
    test5a: {
      titel: "Test 5a (US 5): Hond én kat samen op één foto (poging 1)",
      hond: 75,
      kat: 25,
      overig: 0,
      toelichting:
        "Belangrijke beperking ontdekt: omdat beeldclassificatie één totaal van 100% verdeelt over de labels, kiest het model hier 'Hond' (75%) en mist het dat er óók een kat staat."
    },
    test5b: {
      titel: "Test 5b (US 5): Hond én kat even groot naast elkaar (poging 2)",
      hond: 50,
      kat: 50,
      overig: 0,
      toelichting:
        "Bij de tweede samen-foto raakte het model precies verdeeld: 50% hond en 50% kat. Zonder drempelwaarde zou software hier blind gokken!"
    },
    test6a: {
      titel: "Test 6a (US 5): AI-gegenereerde hybride hond-kat (twijfelgeval)",
      hond: 60,
      kat: 35,
      overig: 5,
      toelichting:
        "Op ons eerste AI-hybride plaatje gaf Liner.ai 60% hond en 35% kat. Mijn Wildcard-drempel van 75% vangt dit netjes op als 'Twijfelgeval: controleer handmatig'."
    },
    test6b: {
      titel: "Test 6b (US 5): Hybride puppy-kop met kattenstrepen op vacht",
      hond: 99,
      kat: 1,
      overig: 0,
      toelichting:
        "Toen de kop en hangoren duidelijk hondachtig waren (ondanks streepjesvacht), gaf het model 99% hond. Kop- en oorvorm wegen dus zwaarder dan vachtpatroon."
    },
    wildcardBias: {
      titel: "Wildcard Bias-test (US 6 & US 10): Kat buiten op felgroen grasveld",
      hond: 31,
      kat: 64,
      overig: 5,
      toelichting:
        "Voor mijn Wildcard-experiment testte ik achtergrond-bias: omdat hondenfoto's vaker buiten op gras staan, zakte een kat op gras naar 64% zekerheid."
    }
  };

  let huidigScenarioKey = "test6a";
  const scenarioKnoppen = document.querySelectorAll(".scenario-btn");
  const drempelSlider = document.getElementById("thresholdSlider");
  const drempelWaardeTekst = document.getElementById("thresholdValue");

  const simTitel = document.getElementById("simScenarioTitle");
  const barHond = document.getElementById("barDog");
  const barKat = document.getElementById("barCat");
  const barOverig = document.getElementById("barOther");
  const txtHond = document.getElementById("valDog");
  const txtKat = document.getElementById("valCat");
  const txtOverig = document.getElementById("valOther");
  const simBesluit = document.getElementById("simDecision");
  const simUitleg = document.getElementById("simExplanation");

  function werkSimulatorBij() {
    const data = testScenarios[huidigScenarioKey];
    if (!data || !drempelSlider) return;

    const drempel = Number(drempelSlider.value);
    if (drempelWaardeTekst) {
      drempelWaardeTekst.textContent = `${drempel}%`;
    }
    if (simTitel) {
      simTitel.textContent = data.titel;
    }

    if (barHond) barHond.style.width = `${data.hond}%`;
    if (barKat) barKat.style.width = `${data.kat}%`;
    if (barOverig) barOverig.style.width = `${data.overig}%`;

    if (txtHond) txtHond.textContent = `${data.hond}%`;
    if (txtKat) txtKat.textContent = `${data.kat}%`;
    if (txtOverig) txtOverig.textContent = `${data.overig}%`;

    // Bepaal het hoogste label en vergelijk die met de ingestelde drempelwaarde
    const opties = [
      { label: "Hond", score: data.hond },
      { label: "Kat", score: data.kat },
      { label: "Overig (geen kat/hond)", score: data.overig }
    ];
    opties.sort((a, b) => b.score - a.score);
    const hoogste = opties[0];

    if (simBesluit) {
      if (hoogste.score >= drempel) {
        simBesluit.className = "decision-banner confident";
        simBesluit.textContent = `Modelbesluit: ${hoogste.label} (${hoogste.score}% >= drempel ${drempel}%) — Automatisch geaccepteerd.`;
      } else {
        simBesluit.className = "decision-banner uncertain";
        simBesluit.textContent = `Wildcard Twijfel-filter actief: Hoogste score is ${hoogste.label} (${hoogste.score}%), maar dat ligt onder de drempel van ${drempel}%. Advies: niet blind vertrouwen, laat een mens meekijken!`;
      }
    }

    if (simUitleg) {
      simUitleg.textContent = data.toelichting;
    }
  }

  scenarioKnoppen.forEach((knop) => {
    knop.addEventListener("click", () => {
      const gekozen = knop.getAttribute("data-scenario");
      if (!gekozen) return;
      huidigScenarioKey = gekozen;
      scenarioKnoppen.forEach((b) => b.classList.remove("is-active"));
      knop.classList.add("is-active");
      werkSimulatorBij();
    });
  });

  if (drempelSlider) {
    drempelSlider.addEventListener("input", werkSimulatorBij);
    werkSimulatorBij();
  }

  /* ------------------------------------------------------------------------
     7. Filter op User Stories (Onderdeel B: gekoppeld aan Jira AI-1 t/m AI-9)
     ------------------------------------------------------------------------ */
  const filterKnoppen = document.querySelectorAll(".filter-btn");
  const usKaarten = document.querySelectorAll(".us-card");

  filterKnoppen.forEach((knop) => {
    knop.addEventListener("click", () => {
      const filterWaarde = knop.getAttribute("data-filter") || "all";
      filterKnoppen.forEach((b) => b.classList.remove("is-active"));
      knop.classList.add("is-active");

      usKaarten.forEach((kaart) => {
        const eigenaar = kaart.getAttribute("data-owner") || "";
        if (filterWaarde === "all" || eigenaar.includes(filterWaarde)) {
          kaart.hidden = false;
        } else {
          kaart.hidden = true;
        }
      });
    });
  });
});
