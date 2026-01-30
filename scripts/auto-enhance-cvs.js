/**
 * Auto-Enhance CVs Script
 * 
 * Automatically enhances CVs by finding and expanding achievements, skills, and summaries
 * Uses regex to find patterns and add detailed content
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/exampleCVs.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔧 Starting automatic CV enhancement...\n');

// Track changes
let changesMade = 0;

// Function to add more achievements to existing achievement arrays
function enhanceAchievementArray(match, profession) {
  const achievements = match[1];
  const currentAchievements = achievements.match(/'([^']+)'/g) || [];
  
  // If already has 6+ achievements, skip
  if (currentAchievements.length >= 6) {
    return match[0];
  }
  
  // Sector-specific additional achievements
  const additionalAchievements = {
    'management-assistant': [
      'Coördinatie van 15+ projecten en evenementen per jaar met focus op efficiëntie en kwaliteit',
      'Implementatie van process verbeteringen resulterend in 25% efficiëntie verhoging',
      'Voorbereiding van 50+ rapporten en presentaties per jaar voor executive team',
      'Klant- en stakeholder communicatie met 95%+ tevredenheid'
    ],
    'engineer': [
      'Ontwerp en ontwikkeling van infrastructurele projecten met waarde van €10M+',
      'Leiding aan team van 5 engineers met focus op kwaliteit en veiligheid',
      'Implementatie van nieuwe technologieën resulterend in 30% kostenbesparing',
      'Projectmanagement van 8+ projecten binnen budget en deadline',
      'Kwaliteitsborging en veiligheidscompliance voor 100% van projecten'
    ],
    'account-manager': [
      'Beheer van portfolio van 25+ enterprise accounts met totale waarde van €2M+',
      'Account groei van gemiddeld 35% per jaar door proactieve relatiebeheer',
      'Ontwikkeling van accountstrategieën resulterend in 40% verhoogde customer lifetime value',
      'Samenwerking met cross-functionele teams voor account success',
      'Klanttevredenheid van 95%+ door persoonlijke service en snelle respons'
    ],
    'chef': [
      'Leiding aan keuken team van 8+ koks met focus op kwaliteit en efficiëntie',
      'Ontwikkeling van seizoensmenu\'s met focus op lokale ingrediënten en duurzaamheid',
      'Kostenbeheer resulterend in 20% verbetering in food cost percentage',
      'Training en ontwikkeling van junior koks in culinaire technieken',
      'Gastentevredenheid van 4.5+ sterren door consistente kwaliteit en innovatie'
    ],
    'lawyer': [
      'Behandeling van 50+ juridische zaken per jaar met 85%+ succespercentage',
      'Advies en ondersteuning bij M&A transacties met totale waarde van €100M+',
      'Voorbereiding van 100+ contracten en juridische documenten',
      'Representatie bij 20+ rechtszittingen en procedures',
      'Klanttevredenheid van 95%+ door proactieve advisering en snelle respons'
    ],
    'data-scientist': [
      'Ontwikkeling van machine learning modellen voor 10+ business cases',
      'Data analyse van datasets met 1M+ records resulterend in actionable insights',
      'Implementatie van predictive analytics resulterend in 25% verbetering in forecasting',
      'Samenwerking met business stakeholders voor data-driven besluitvorming',
      'Presentatie van analyses en aanbevelingen aan C-level executives'
    ],
    'doctor': [
      'Behandeling van gemiddeld 30+ patiënten per dag met focus op kwaliteit van zorg',
      'Samenwerking met multidisciplinair team voor complexe medische cases',
      'Implementatie van evidence-based behandelprotocollen',
      'Begeleiding van 5+ co-assistenten en artsen in opleiding',
      'Patiënttevredenheid van 95%+ door persoonlijke aandacht en effectieve communicatie'
    ],
    'pharmacist': [
      'Dagelijkse medicatiebeoordeling voor 100+ patiënten met focus op veiligheid',
      'Farmaceutische zorg en medicatiebeoordeling resulterend in 30% reductie van medicatiefouten',
      'Samenwerking met huisartsen en specialisten voor optimale medicatie',
      'Begeleiding van patiënten over medicatiegebruik en bijwerkingen',
      'Kwaliteitsborging en compliance met farmaceutische regelgeving'
    ],
    'it-support': [
      'Ondersteuning van 200+ gebruikers met gemiddeld 95%+ oplossingspercentage',
      'Resolutie van 50+ IT tickets per week met focus op snelle response tijden',
      'Implementatie van nieuwe systemen en software voor 50+ gebruikers',
      'Training en begeleiding van gebruikers in IT systemen en processen',
      'Proactieve monitoring en onderhoud van IT infrastructuur'
    ],
    'professor': [
      'Onderwijs aan 200+ studenten per jaar met focus op interactief leren',
      'Publicatie van 15+ peer-reviewed artikelen in toonaangevende journals',
      'Begeleiding van 10+ promovendi en onderzoekers',
      'Acquisitie van €500K+ aan onderzoekssubsidies',
      'Presentaties op 20+ internationale conferenties'
    ],
    'school-counselor': [
      'Begeleiding van 100+ leerlingen per jaar bij studiekeuze en persoonlijke ontwikkeling',
      'Organisatie van 20+ loopbaanoriëntatie activiteiten per jaar',
      'Samenwerking met ouders, docenten en externe partijen voor leerlingbegeleiding',
      'Ontwikkeling van begeleidingsprogramma\'s voor verschillende leerlinggroepen',
      'Leerlingtevredenheid van 90%+ door persoonlijke aandacht en effectieve begeleiding'
    ],
    'financial-analyst': [
      'Financiële analyses en forecasting voor bedrijven met omzet van €50M+',
      'Ontwikkeling van financiële modellen voor strategische besluitvorming',
      'Risicoanalyse en due diligence onderzoeken voor investeerders',
      'Presentatie van analyses en aanbevelingen aan management en stakeholders',
      'Samenwerking met accounting en finance teams voor accurate rapportage'
    ],
    'photographer': [
      'Fotografie voor 50+ evenementen en commerciële projecten per jaar',
      'Portfolio met 200+ gepubliceerde foto\'s in magazines en online media',
      'Samenwerking met 30+ klanten voor branding en marketing fotografie',
      'Post-productie en beeldbewerking met focus op kwaliteit en creativiteit',
      'Klanttevredenheid van 95%+ door creatieve visie en professionele service'
    ],
    'copywriter': [
      'Schrijven van 100+ marketing teksten per jaar voor diverse kanalen',
      'Content strategie ontwikkeling resulterend in 40% verhoogde engagement',
      'Samenwerking met marketing teams voor geïntegreerde campagnes',
      'SEO-geoptimaliseerde content resulterend in top 10 rankings',
      'Klanttevredenheid van 95%+ door creatieve en effectieve copy'
    ],
    'mechanical-engineer': [
      'Ontwerp en ontwikkeling van mechanische systemen voor 10+ projecten',
      'CAD/CAM engineering en prototyping voor productontwikkeling',
      'Projectmanagement van engineering projecten met waarde van €5M+',
      'Kwaliteitsborging en testing van mechanische componenten',
      'Samenwerking met productie teams voor implementatie'
    ],
    'civil-engineer': [
      'Ontwerp en ontwikkeling van infrastructurele projecten met waarde van €20M+',
      'Projectmanagement van bouwprojecten binnen budget en deadline',
      'Kwaliteitsborging en veiligheidscompliance voor alle projecten',
      'Samenwerking met aannemers en architecten voor projectuitvoering',
      'Technische documentatie en rapportage voor stakeholders'
    ],
    'account-manager-2': [
      'Beheer van portfolio van 30+ B2B accounts met totale waarde van €1.5M+',
      'Account groei van gemiddeld 30% per jaar door strategische relatiebeheer',
      'Ontwikkeling van accountplannen resulterend in 35% verhoogde omzet',
      'Samenwerking met sales en marketing teams voor account success',
      'Klanttevredenheid van 90%+ door persoonlijke service'
    ],
    'store-manager': [
      'Leiding aan team van 12+ medewerkers met focus op service en verkoop',
      'Beheer van winkel met omzet van €2M+ per jaar',
      'Implementatie van verkoopstrategieën resulterend in 15% omzetgroei',
      'Training en ontwikkeling van teamleden in verkoop en service',
      'Klanttevredenheid van 4.5+ sterren door uitstekende service'
    ],
    'office-manager': [
      'Leiding aan administratief team van 8+ medewerkers',
      'Beheer van kantoorfaciliteiten voor 50+ medewerkers',
      'Implementatie van process verbeteringen resulterend in 30% efficiëntie verhoging',
      'Budgetbeheer van €200K+ per jaar met focus op kostenoptimalisatie',
      'Coördinatie van HR en administratieve processen'
    ],
    'executive-assistant': [
      'Ondersteuning van 3+ C-level executives met focus op efficiëntie',
      'Coördinatie van 20+ executive meetings en evenementen per maand',
      'Voorbereiding van 30+ presentaties en rapporten per maand',
      'Beheer van complexe agenda\'s en reisarrangementen',
      'Discretie en vertrouwelijkheid bij gevoelige informatie'
    ],
    'hotel-manager': [
      'Leiding aan team van 25+ medewerkers met focus op gastenservice',
      'Beheer van hotel met 80+ kamers en gemiddeld 70% bezettingsgraad',
      'Implementatie van service verbeteringen resulterend in 4.5+ sterren rating',
      'Budgetbeheer van €1M+ per jaar met focus op winstoptimalisatie',
      'Organisatie van 50+ evenementen en speciale gelegenheden per jaar'
    ],
    'restaurant-manager': [
      'Leiding aan team van 15+ medewerkers met focus op gastenservice',
      'Beheer van restaurant met 60+ covers en gemiddeld 200 covers per dag',
      'Implementatie van service verbeteringen resulterend in 4.5+ sterren rating',
      'Budgetbeheer van €500K+ per jaar met focus op winstoptimalisatie',
      'Training en ontwikkeling van service team in gastenservice'
    ],
    'paralegal': [
      'Ondersteuning bij 100+ juridische zaken per jaar',
      'Voorbereiding van 200+ juridische documenten en contracten',
      'Juridisch onderzoek en documentatie voor advocaten',
      'Samenwerking met cliënten en externe partijen',
      'Kwaliteitsborging en compliance met juridische procedures'
    ],
    'legal-assistant': [
      'Ondersteuning bij 80+ juridische zaken per jaar',
      'Voorbereiding van 150+ juridische documenten en administratie',
      'Juridisch onderzoek en documentatie voor juridisch team',
      'Klantcommunicatie en afsprakencoördinatie',
      'Kwaliteitsborging en compliance met juridische procedures'
    ]
  };
  
  const additions = additionalAchievements[profession] || [];
  if (additions.length === 0) return match[0];
  
  // Add 2-3 more achievements
  const toAdd = Math.min(3, 7 - currentAchievements.length);
  const newAchievements = additions.slice(0, toAdd);
  
  // Build new achievements array
  const allAchievements = [...currentAchievements, ...newAchievements.map(a => `'${a}'`)];
  const newArray = `[\n${allAchievements.map(a => `            ${a}`).join(',\n')}\n          ]`;
  
  changesMade++;
  return match[0].replace(achievements, newArray);
}

// Find and enhance achievement arrays for each profession
const professions = [
  'management-assistant', 'engineer', 'account-manager', 'chef', 'lawyer',
  'data-scientist', 'doctor', 'pharmacist', 'it-support', 'professor',
  'school-counselor', 'financial-analyst', 'photographer', 'copywriter',
  'mechanical-engineer', 'civil-engineer', 'account-manager-2', 'store-manager',
  'office-manager', 'executive-assistant', 'hotel-manager', 'restaurant-manager',
  'paralegal', 'legal-assistant'
];

professions.forEach(profession => {
  // Find achievement arrays for this profession
  const regex = new RegExp(`('${profession}':[\\s\\S]*?achievements:\\s*\\[)([\\s\\S]*?)(\\])`, 'g');
  
  content = content.replace(regex, (match, prefix, achievements, suffix) => {
    return enhanceAchievementArray([match, achievements], profession);
  });
});

console.log(`✅ Enhanced ${changesMade} CV achievement sections\n`);

// Save the enhanced content
if (changesMade > 0) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`💾 Saved enhanced CVs to ${filePath}`);
  console.log(`\n📊 Summary: Enhanced ${changesMade} CV sections`);
} else {
  console.log('⚠️  No changes made. CVs may already be enhanced or patterns not found.');
}

console.log('\n✨ Enhancement complete!');
