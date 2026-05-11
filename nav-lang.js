// nav-lang.js - Shared navigation and language switcher logic for all pages

// Language data for nav
const navLangData = {
    de: {
      home: 'Startseite',
      about: 'Über mich',
      offers: 'Angebote',
      daf: 'Deutsch als Fremd- und Zweitsprache (DaF/DaZ)',
      med: 'Medizinisches Deutsch & Fachsprachprüfung (FSP)',
      company: 'Berufssprachkurse für Unternehmen',
      comm: 'Kommunikationstraining',
      inter: 'Interkulturelle Bildung, Resilienz & Prävention',
      indiv: 'Individuelle Konzepte',
      contact: 'Kontakt',
      events: 'Events',
      homeHref: 'index.html',
      aboutHref: 'ueber_mich.html',
      dafHref: 'angebote.html#daf',
      medHref: 'angebote.html#medizin',
      companyHref: 'angebote.html#unternehmen',
      commHref: 'angebote.html#kommunikation',
      interHref: 'angebote.html#interkultur',
      indivHref: 'angebote.html#individuell',
      contactHref: 'index.html#kontakt',
      eventsHref: 'event.html',
    },
    en: {
      home: 'Home',
      about: 'About Me',
      offers: 'Offers',
      daf: 'German as a Foreign and Second Language (DaF/DaZ)',
      med: 'Medical German & Specialist Language Exam (FSP)',
      company: 'Business Language Courses for Companies',
      comm: 'Communication Training',
      inter: 'Intercultural Education, Resilience & Prevention',
      indiv: 'Individual Concepts',
      contact: 'Contact',
      events: 'Events',
      homeHref: 'index_en.html',
      aboutHref: 'ueber_mich_en.html',
      dafHref: 'angebote_en.html#daf',
      medHref: 'angebote_en.html#medizin',
      companyHref: 'angebote_en.html#unternehmen',
      commHref: 'angebote_en.html#kommunikation',
      interHref: 'angebote_en.html#interkultur',
      indivHref: 'angebote_en.html#individuell',
      contactHref: 'index_en.html#kontakt',
      eventsHref: 'event_en.html',
    }
  };

function setNavLang(lang) {
    const d = navLangData[lang] || navLangData['de'];
    if (!document.getElementById('nav-home')) return;
    document.getElementById('nav-home').textContent = d.home;
    document.getElementById('nav-home').href = d.homeHref;
    document.getElementById('nav-about').textContent = d.about;
    document.getElementById('nav-about').href = d.aboutHref;
    document.getElementById('nav-offers').textContent = d.offers;
    document.getElementById('nav-daf').textContent = d.daf;
    document.getElementById('nav-daf').href = d.dafHref;
    document.getElementById('nav-med').textContent = d.med;
    document.getElementById('nav-med').href = d.medHref;
    document.getElementById('nav-company').textContent = d.company;
    document.getElementById('nav-company').href = d.companyHref;
    document.getElementById('nav-comm').textContent = d.comm;
    document.getElementById('nav-comm').href = d.commHref;
    document.getElementById('nav-inter').textContent = d.inter;
    document.getElementById('nav-inter').href = d.interHref;
    document.getElementById('nav-indiv').textContent = d.indiv;
    document.getElementById('nav-indiv').href = d.indivHref;
    document.getElementById('nav-contact').textContent = d.contact;
    document.getElementById('nav-contact').href = d.contactHref;
    document.getElementById('nav-events').textContent = d.events;
    document.getElementById('nav-events').href = d.eventsHref;
  }

function setupNavLang() {
    const langSwitcher = document.getElementById('langSwitcher');
    if (!langSwitcher) return;
    let lang = localStorage.getItem('siteLang') || 'de';
    langSwitcher.value = lang;
    setNavLang(lang);
    langSwitcher.addEventListener('change', function() {
      lang = langSwitcher.value;
      localStorage.setItem('siteLang', lang);
      setNavLang(lang);
      // Redirect if a mapping exists
      const pageMap = {
        'index.html': 'index_en.html',
        'index_en.html': 'index.html',
        'ueber_mich.html': 'ueber_mich_en.html',
        'ueber_mich_en.html': 'ueber_mich.html',
        'angebote.html': 'angebote_en.html',
        'angebote_en.html': 'angebote.html',
        'event.html': 'event_en.html',
        'event_en.html': 'event.html',
        'firmen.html': 'firmen_en.html',
        'firmen_en.html': 'firmen.html',
        'Konversation.html': 'Konversation_en.html',
        'Konversation_en.html': 'Konversation.html',
        'Integrationskurse.html': 'Integrationskurse_en.html',
        'Integrationskurse_en.html': 'Integrationskurse.html',
        'Berufssprachkurse.html': 'Berufssprachkurse_en.html',
        'Berufssprachkurse_en.html': 'Berufssprachkurse.html',
        'fsp-medizinisches-deutsch.html': 'fsp-medizinisches-deutsch_en.html',
        'fsp-medizinisches-deutsch_en.html': 'fsp-medizinisches-deutsch.html',
      };
      let current = window.location.pathname.split('/').pop();
      if (lang === 'en' && !current.endsWith('_en.html') && pageMap[current]) {
        window.location.href = pageMap[current];
      } else if (lang === 'de' && current.endsWith('_en.html') && pageMap[current]) {
        window.location.href = pageMap[current];
      }
    });
  }

// Expose setupNavLang globally so it can be called after nav.html is loaded
window.setupNavLang = setupNavLang;
