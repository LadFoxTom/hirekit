import { CVData } from '@/types/cv'
import { generatePlaceholderPhoto } from '@/lib/image-utils'

// Helper function to generate CORS-friendly placeholder photos
function getPlaceholderPhoto(fullName: string): string {
  return generatePlaceholderPhoto(fullName);
}

// Generate example CV data for each profession
// Each profession gets a unique fictional person with photo
export function getExampleCV(professionId: string, language: string = 'nl'): CVData {
  const examples: Record<string, CVData> = {
    'nurse': {
      template: 'modern',
      fullName: 'Emma van der Berg',
      title: 'Verpleegkundige',
      summary: 'Ervaren verpleegkundige met 8+ jaar ervaring in acute zorg en patiëntenzorg. Gespecialiseerd in intensive care en spoedeisende hulp met bewezen track record in kritische patiëntenzorg. Gepassioneerd over evidence-based zorg, patiëntveiligheid en continue professionele ontwikkeling. Sterk in multidisciplinaire samenwerking en begeleiding van collega\'s.',
      photoUrl: getPlaceholderPhoto('Emma van der Berg'),
      contact: {
        email: 'emma.vanderberg@email.nl',
        phone: '+31 6 12345678',
        location: 'Amsterdam, Nederland'
      },
      experience: [
        {
          title: 'Verpleegkundige Intensive Care',
          company: 'Academisch Medisch Centrum',
          location: 'Amsterdam',
          dates: '2020 - Heden',
          current: true,
          achievements: [
            'Verzorging van gemiddeld 2-3 kritisch zieke patiënten per dienst met focus op patiëntveiligheid en kwaliteit van zorg',
            'Beheer en monitoring van beademingsapparatuur, hemodynamische monitoring en continue dialyse voor 500+ patiënten per jaar',
            'Samenwerking met multidisciplinair team van 15+ specialisten, resulterend in 95%+ patiënttevredenheid',
            'Begeleiding en training van 8+ nieuwe verpleegkundigen en 12+ stagiaires, met focus op evidence-based praktijken',
            'Implementatie van nieuwe protocollen voor medicatieveiligheid, resulterend in 30% reductie van medicatiefouten',
            'Actieve deelname aan kwaliteitsverbeteringstrajecten en incidentanalyses'
          ]
        },
        {
          title: 'Verpleegkundige Spoedeisende Hulp',
          company: 'St. Elisabeth Ziekenhuis',
          location: 'Tilburg',
          dates: '2017 - 2020',
          achievements: [
            'Triage en eerste opvang van 50+ spoedpatiënten per dienst volgens Manchester Triage Systeem',
            'Assistentie bij 200+ medische procedures en 15+ reanimaties met 80%+ succespercentage',
            'Coördinatie van patiëntenzorg in drukke omgeving met focus op efficiëntie en patiëntveiligheid',
            'Training en certificering in Advanced Life Support (ALS) en Pediatric Advanced Life Support (PALS)',
            'Implementatie van verbeterde triageprocessen, resulterend in 20% kortere wachttijden',
            'Mentoring van junior verpleegkundigen in acute zorg situaties'
          ]
        }
      ],
      education: [
        {
          institution: 'Hogeschool van Amsterdam',
          degree: 'Bachelor Verpleegkunde',
          field: 'Verpleegkunde',
          dates: '2013 - 2017',
          achievements: [
            'Diploma behaald met onderscheiding (gemiddeld cijfer 8.2)',
            'Stage op IC-afdeling (6 maanden) en spoedeisende hulp (4 maanden)',
            'Scriptie over evidence-based verpleegkundige interventies bij sepsis patiënten (cijfer 9.0)',
            'Vrijwilligerswerk bij lokale gezondheidsvoorlichting'
          ]
        }
      ],
      skills: {
        technical: ['EPD systemen (Epic, Chipsoft)', 'Medicatietoediening (BIG geregistreerd)', 'Wondverzorging', 'Beademingsapparatuur (Ventilatoren, CPAP)', 'Hemodynamische monitoring', 'Continue dialyse', 'IV-toediening', 'Medische apparatuur'],
        soft: ['Empathie en patiëntgerichte zorg', 'Effectieve communicatie met patiënten en families', 'Stressbestendigheid onder druk', 'Teamwerk in multidisciplinaire teams', 'Kritisch denken en besluitvorming', 'Leiderschap en mentoring', 'Conflictbeheersing']
      },
      certifications: [
        { title: 'Advanced Life Support (ALS)', institution: 'Nederlandse Reanimatieraad', year: '2021' },
        { title: 'Intensive Care Verpleegkunde', institution: 'V&VN', year: '2020' },
        { title: 'Pediatric Advanced Life Support (PALS)', institution: 'Nederlandse Reanimatieraad', year: '2019' },
        { title: 'BIG Registratie Verpleegkundige', institution: 'BIG Register', year: '2017' }
      ],
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Basis)'],
      hobbies: ['Hardlopen (marathon training)', 'Lezen (medische literatuur)', 'Vrijwilligerswerk (lokale gezondheidsvoorlichting)', 'Koken']
    },
    'software-developer': {
      template: 'modern',
      fullName: 'Lucas Jansen',
      title: 'Senior Software Developer',
      summary: 'Ervaren full-stack developer met 10+ jaar ervaring in het bouwen van schaalbare webapplicaties en microservices. Gespecialiseerd in React, Node.js, TypeScript en cloud architecture (AWS, Azure). Gepassioneerd over clean code, performance optimalisatie en agile development. Bewezen track record in het leiden van development teams en het implementeren van complexe systemen met hoge beschikbaarheid.',
      photoUrl: getPlaceholderPhoto('Lucas Jansen'),
      contact: {
        email: 'lucas.jansen@email.nl',
        phone: '+31 6 23456789',
        location: 'Utrecht, Nederland',
        linkedin: 'linkedin.com/in/lucasjansen',
        website: 'lucasjansen.dev'
      },
      experience: [
        {
          title: 'Senior Software Developer',
          company: 'TechCorp Nederland',
          location: 'Amsterdam',
          dates: '2020 - Heden',
          current: true,
          achievements: [
            'Leiding aan team van 6 developers voor betalingssysteem met 2M+ maandelijkse actieve gebruikers en 99.9% uptime',
            'Architectuur en implementatie van microservices infrastructuur met 15+ services, resulterend in 40% snellere deployment cycles',
            'Serverkosten met 35% verlaagd door optimalisatie van database queries en implementatie van caching strategieën',
            'Mentoring van 8+ junior developers en code reviews voor 200+ pull requests per maand',
            'Implementatie van CI/CD pipelines met Docker en Kubernetes, resulterend in 50% reductie in deployment tijd',
            'Ontwikkeling van RESTful API\'s en GraphQL endpoints die 10M+ requests per dag verwerken',
            'Technische besluitvorming en architectuur reviews voor kritieke systemen'
          ]
        },
        {
          title: 'Full Stack Developer',
          company: 'InnovateSoft',
          location: 'Rotterdam',
          dates: '2017 - 2020',
          achievements: [
            'Ontwikkeling van React en Angular applicaties voor 50K+ gebruikers met focus op performance en gebruikerservaring',
            'Samenwerking met UX designers voor responsive interfaces, resulterend in 25% verbetering in mobile gebruik',
            'Database schema design en optimalisatie van PostgreSQL databases, resulterend in 60% snellere query performance',
            'E-commerce platform gebouwd dat conversie met 28% verhoogde en €2M+ extra omzet genereerde',
            'Implementatie van real-time features met WebSockets voor live chat functionaliteit',
            'Code reviews en pair programming sessies met team van 5 developers',
            'Agile development met Scrum methodologie en dagelijkse stand-ups'
          ]
        }
      ],
      education: [
        {
          institution: 'Technische Universiteit Delft',
          degree: 'Master Computer Science',
          field: 'Software Engineering',
          dates: '2014 - 2017',
          achievements: ['Cum Laude afgestudeerd', 'Specialisatie in Distributed Systems']
        }
      ],
      skills: {
        technical: ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'AWS (EC2, S3, Lambda)', 'Azure', 'Docker', 'Kubernetes', 'GraphQL', 'RESTful APIs', 'Git', 'CI/CD'],
        soft: ['Probleemoplossend denken', 'Teamleiderschap', 'Agile/Scrum', 'Code reviews', 'Technische documentatie', 'Mentoring', 'Architectuur design', 'Performance optimalisatie']
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
      hobbies: ['Programmeren', 'Gaming', 'Fietsen', 'Open source bijdragen']
    },
    'teacher': {
      template: 'modern',
      fullName: 'Sophie de Vries',
      title: 'Docent Basisonderwijs',
      summary: 'Gepassioneerde basisschooldocent met 7 jaar ervaring in het lesgeven aan kinderen van 6-12 jaar. Gespecialiseerd in differentiatie, inclusief onderwijs en curriculum ontwikkeling. Focus op het creëren van een positieve leeromgeving met bewezen resultaten in leerling engagement en academische prestaties. Ervaring met educatieve technologie en moderne lesmethoden.',
      photoUrl: getPlaceholderPhoto('Sophie de Vries'),
      contact: {
        email: 'sophie.devries@email.nl',
        phone: '+31 6 34567890',
        location: 'Den Haag, Nederland'
      },
      experience: [
        {
          title: 'Groepsleerkracht Groep 5/6',
          company: 'Basisschool De Regenboog',
          location: 'Den Haag',
          dates: '2019 - Heden',
          current: true,
          achievements: [
            'Lesgeven aan groep van 25 leerlingen met focus op differentiatie en inclusief onderwijs',
            'Ontwikkeling van gepersonaliseerde lesplannen resulterend in 15% verbetering in leerling prestaties',
            'Samenwerking met ouders en zorgteam voor 8+ leerlingen met speciale onderwijsbehoeften',
            'Organisatie van 12+ schoolactiviteiten en excursies per jaar met 95%+ deelname',
            'Implementatie van educatieve technologie (tablets, digitale borden) in dagelijkse lessen',
            'Mentoring van 3+ stagiaires en nieuwe collega\'s in lesmethoden en klasmanagement',
            'Ontwikkeling van curriculum materiaal voor rekenen en taal, gebruikt door 5+ collega\'s',
            'Leerling engagement verhoogd met 25% door interactieve lesmethoden en gamification'
          ]
        },
        {
          title: 'Groepsleerkracht Groep 3',
          company: 'Basisschool Het Palet',
          location: 'Rotterdam',
          dates: '2016 - 2019',
          achievements: [
            'Lesgeven aan groep van 22 beginnende lezers met focus op fonemisch bewustzijn en leesstrategieën',
            'Implementatie van nieuwe lesmethoden (Veilig Leren Lezen) resulterend in 90%+ leesniveau behaald',
            'Begeleiding van 4+ stagiaires in lesgeven en klasmanagement technieken',
            'Organisatie van leesactiviteiten en voorleesmomenten, resulterend in verhoogde leesmotivatie',
            'Samenwerking met logopedisten voor leerlingen met taal- en spraakproblemen',
            'Ouders betrokken bij leesontwikkeling door wekelijkse updates en tips'
          ]
        }
      ],
      education: [
        {
          institution: 'Hogeschool Rotterdam',
          degree: 'PABO - Bachelor Leraar Basisonderwijs',
          field: 'Onderwijs',
          dates: '2012 - 2016',
          achievements: ['Diploma behaald met gemiddeld cijfer 7.8', 'Stage op 3 verschillende basisscholen (groep 1-2, 5-6, 7-8)', 'Scriptie over effectieve differentiatie in de klas (cijfer 8.5)', 'Vrijwilligerswerk bij buitenschoolse opvang']
        }
      ],
      skills: {
        technical: ['Lesmethoden (Veilig Leren Lezen, Rekenen)', 'Klassenmanagement', 'ICT in onderwijs (digibord, tablets)', 'Differentiatie technieken', 'Leerlingvolgsystemen (CITO)', 'Curriculum ontwikkeling', 'Beoordeling en evaluatie'],
        soft: ['Geduld en begrip', 'Creativiteit in lesgeven', 'Effectieve communicatie met ouders en leerlingen', 'Empathie voor verschillende leerstijlen', 'Organisatie en planning', 'Teamwerk met collega\'s', 'Probleemoplossend denken', 'Leiderschap in schoolprojecten']
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
      hobbies: ['Lezen', 'Handwerken', 'Wandelen', 'Vrijwilligerswerk']
    },
    'accountant': {
      template: 'modern',
      fullName: 'Daan Bakker',
      title: 'Registeraccountant',
      summary: 'Ervaren Registeraccountant (RA) met 12+ jaar ervaring in financiële controle, belastingadvies en bedrijfsadvisering. Gespecialiseerd in MKB en internationale bedrijven met bewezen track record in complexe financiële analyses en compliance. Gepassioneerd over financiële transparantie, risicobeheer en het helpen van bedrijven bij strategische besluitvorming.',
      photoUrl: getPlaceholderPhoto('Daan Bakker'),
      contact: {
        email: 'daan.bakker@email.nl',
        phone: '+31 6 45678901',
        location: 'Rotterdam, Nederland'
      },
      experience: [
        {
          title: 'Senior Accountant',
          company: 'KPMG Nederland',
          location: 'Rotterdam',
          dates: '2018 - Heden',
          current: true,
          achievements: [
            'Financiële controles voor 50+ MKB en grote ondernemingen met omzet van €5M-€500M per jaar',
            'Belastingadvies en planning resulterend in gemiddeld €200K+ belastingbesparing per klant per jaar',
            'Begeleiding van 15+ klanten bij overnames en fusies met totale transactiewaarde van €150M+',
            'Leiding aan team van 4 junior accountants met focus op kennisoverdracht en kwaliteitsborging',
            'Implementatie van IFRS standaarden voor 20+ internationale bedrijven',
            'Financiële analyses en due diligence onderzoeken voor investeerders en banken',
            'Klanttevredenheid van 95%+ door proactieve advisering en snelle respons tijden'
          ]
        },
        {
          title: 'Accountant',
          company: 'Deloitte',
          location: 'Amsterdam',
          dates: '2011 - 2018',
          achievements: [
            'Voorbereiding van 100+ jaarrekeningen en belastingaangiftes voor diverse bedrijven',
            'Financiële analyses en rapportages voor management en stakeholders met focus op KPI\'s',
            'Klantadvisering over fiscale optimalisatie resulterend in gemiddeld 15% belastingbesparing',
            'Samenwerking met belastingautoriteiten bij controles en bezwaarschriften',
            'Training en begeleiding van junior accountants in accountancy praktijken',
            'Implementatie van nieuwe accounting software (SAP, Exact) voor 10+ klanten'
          ]
        }
      ],
      education: [
        {
          institution: 'Erasmus Universiteit Rotterdam',
          degree: 'Master Accountancy',
          field: 'Accountancy',
          dates: '2007 - 2011',
          achievements: ['Registeraccountant (RA) titel behaald', 'Cum Laude afgestudeerd']
        }
      ],
      skills: {
        technical: ['Excel (geavanceerd)', 'SAP', 'IFRS en Nederlandse GAAP', 'Belastingwetgeving (Nederlands en internationaal)', 'Financiële analyse en modellering', 'Due diligence', 'Audit technieken', 'Accounting software (Exact, AFAS)', 'Power BI'],
        soft: ['Analytisch denken en probleemoplossing', 'Precisie en aandacht voor detail', 'Effectieve communicatie met klanten en stakeholders', 'Klantgerichtheid en service excellence', 'Teamleiderschap en mentoring', 'Projectmanagement', 'Risicobeheer', 'Strategisch denken']
      },
      certifications: [
        { title: 'Registeraccountant (RA)', institution: 'NBA', year: '2011' }
      ],
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Goed)'],
      hobbies: ['Golf', 'Lezen', 'Reizen', 'Fotografie']
    },
    'marketing-manager': {
      template: 'modern',
      fullName: 'Lisa Meijer',
      title: 'Marketing Manager',
      summary: 'Strategische marketing professional met 9 jaar ervaring in digitale marketing, brand management en campagne ontwikkeling. Gespecialiseerd in B2B marketing en data-driven besluitvorming met bewezen track record in lead generatie, ROI optimalisatie en teamleiderschap. Gepassioneerd over groei, innovatie en het bouwen van sterke merken. Ervaring met marketing automation, SEO/SEM en content marketing.',
      photoUrl: getPlaceholderPhoto('Lisa Meijer'),
      contact: {
        email: 'lisa.meijer@email.nl',
        phone: '+31 6 56789012',
        location: 'Amsterdam, Nederland',
        linkedin: 'linkedin.com/in/lisameijer'
      },
      experience: [
        {
          title: 'Marketing Manager',
          company: 'TechStart BV',
          location: 'Amsterdam',
          dates: '2020 - Heden',
          current: true,
          achievements: [
            'Ontwikkeling en uitvoering van omni-channel marketingstrategie resulterend in 150% groei in lead generatie in 2 jaar',
            'Leiding aan team van 5 marketing professionals met focus op performance marketing en content creatie',
            'Budgetbeheer van €500K+ per jaar met gemiddeld 3.5x ROI op marketing investeringen',
            'Implementatie van marketing automation (HubSpot, Marketo) resulterend in 40% efficiëntie verbetering',
            'Ontwikkeling van 20+ succesvolle campagnes met gemiddeld 25% conversie verbetering',
            'SEO/SEM optimalisatie resulterend in 200% groei in organisch verkeer en 80% lagere cost-per-lead',
            'Brand awareness verhoogd met 60% door geïntegreerde marketing campagnes',
            'Samenwerking met sales team resulterend in 35% verbetering in sales-qualified leads'
          ]
        },
        {
          title: 'Senior Marketing Specialist',
          company: 'Global Brands Inc.',
          location: 'Utrecht',
          dates: '2016 - 2020',
          achievements: [
            'Campagne ontwikkeling voor 10+ internationale merken met totale campagne budget van €2M+',
            'Social media strategie en content marketing resulterend in 500K+ volgers en 2M+ maandelijkse impressions',
            'SEO/SEM optimalisatie voor 50+ keywords resulterend in top 3 rankings en 300% groei in organisch verkeer',
            'ROI verbetering met 40% door data-driven campagne optimalisatie en A/B testing',
            'Content marketing strategie met 100+ artikelen en whitepapers, genererend 10K+ leads per jaar',
            'Email marketing campagnes met 25%+ open rates en 5%+ click-through rates',
            'Samenwerking met agencies en freelancers voor creatieve content en design'
          ]
        }
      ],
      education: [
        {
          institution: 'Universiteit van Amsterdam',
          degree: 'Master Marketing',
          field: 'Marketing & Communicatie',
          dates: '2013 - 2016',
          achievements: ['Specialisatie in Digital Marketing']
        }
      ],
      skills: {
        technical: ['Google Analytics', 'HubSpot', 'SEO/SEM', 'Social Media Marketing', 'Content Marketing'],
        soft: ['Strategisch denken', 'Creativiteit', 'Data analyse', 'Projectmanagement']
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Frans (Goed)'],
      hobbies: ['Fotografie', 'Reizen', 'Yoga', 'Koken']
    },
    'graphic-designer': {
      template: 'modern',
      fullName: 'Noah Smit',
      title: 'Grafisch Ontwerper',
      summary: 'Creatieve grafisch ontwerper met 6 jaar ervaring in branding, webdesign en print design. Gespecialiseerd in visuele identiteit, user experience design en digitale producten. Gepassioneerd over minimalisme, functioneel design en het creëren van betekenisvolle visuele ervaringen. Bewezen track record in award-winnende designs en succesvolle brand campagnes.',
      photoUrl: getPlaceholderPhoto('Noah Smit'),
      contact: {
        email: 'noah.smit@email.nl',
        phone: '+31 6 67890123',
        location: 'Eindhoven, Nederland',
        website: 'noahsmit.design'
      },
      experience: [
        {
          title: 'Senior Grafisch Ontwerper',
          company: 'Creative Agency Amsterdam',
          location: 'Amsterdam',
          dates: '2021 - Heden',
          current: true,
          achievements: [
            'Ontwerp van visuele identiteiten voor 20+ merken in diverse sectoren (tech, retail, hospitality)',
            'Webdesign en UI/UX voor 15+ digitale producten met focus op gebruikerservaring en conversie',
            'Leiding aan creatief team van 3 designers met focus op kwaliteit, creativiteit en klanttevredenheid',
            'Winnende designs voor 5 design awards (Dutch Design Awards, Awwwards)',
            'Ontwikkeling van design systems en style guides voor enterprise klanten',
            'Samenwerking met developers voor implementatie van designs in code',
            'Client presentaties en pitch decks resulterend in 80%+ win rate voor nieuwe projecten',
            'Portfolio met 50+ succesvolle projecten en 95%+ klanttevredenheid'
          ]
        },
        {
          title: 'Grafisch Ontwerper',
          company: 'Design Studio Rotterdam',
          location: 'Rotterdam',
          dates: '2018 - 2021',
          achievements: [
            'Print design voor 30+ brochures, magazines en marketing materialen met focus op visuele impact',
            'Branding en logo ontwerp voor 15+ bedrijven, resulterend in sterke merkidentiteit',
            'Samenwerking met 20+ klanten en accountmanagers voor projecten van concept tot uitvoering',
            'Ontwikkeling van packaging designs voor retail producten',
            'Fotografie en beeldbewerking voor marketing campagnes',
            'Drukwerkbegeleiding en kwaliteitscontrole voor print projecten'
          ]
        }
      ],
      education: [
        {
          institution: 'Design Academy Eindhoven',
          degree: 'Bachelor Grafisch Ontwerp',
          field: 'Grafisch Ontwerp',
          dates: '2014 - 2018',
          achievements: ['Eindexamenproject met onderscheiding']
        }
      ],
      skills: {
        technical: ['Adobe Creative Suite', 'Figma', 'Sketch', 'Illustrator', 'Photoshop', 'InDesign'],
        soft: ['Creativiteit', 'Visuele communicatie', 'Klantgerichtheid', 'Tijdsbeheer']
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
      hobbies: ['Fotografie', 'Kunst', 'Fietsen', 'Muziek']
    },
    'administrative-assistant': {
      template: 'modern',
      fullName: 'Eva Mulder',
      title: 'Management Assistent',
      summary: 'Proactieve management assistent met 8 jaar ervaring in administratieve ondersteuning, planning en klantenservice. Gespecialiseerd in efficiënte workflow management en executive support. Gepassioneerd over organisatie en service excellence.',
      photoUrl: getPlaceholderPhoto('Eva Mulder'),
      contact: {
        email: 'eva.mulder@email.nl',
        phone: '+31 6 78901234',
        location: 'Utrecht, Nederland'
      },
      experience: [
        {
          title: 'Management Assistent',
          company: 'Corporate Solutions BV',
          location: 'Utrecht',
          dates: '2019 - Heden',
          current: true,
          achievements: [
            'Ondersteuning van directie en management team',
            'Agenda beheer en reisplanning',
            'Organisatie van meetings en events',
            'Beheer van administratieve systemen'
          ]
        },
        {
          title: 'Administratief Medewerker',
          company: 'Business Services Nederland',
          location: 'Amsterdam',
          dates: '2015 - 2019',
          achievements: [
            'Klantenservice en telefoonbeantwoording',
            'Data invoer en bestandsbeheer',
            'Facturering en boekhouding ondersteuning'
          ]
        }
      ],
      education: [
        {
          institution: 'ROC Midden Nederland',
          degree: 'MBO Secretarieel',
          field: 'Administratie',
          dates: '2012 - 2015',
          achievements: ['Diploma behaald']
        }
      ],
      skills: {
        technical: ['Microsoft Office', 'Outlook', 'CRM systemen', 'Boekhoudsoftware'],
        soft: ['Organisatie', 'Communicatie', 'Discretie', 'Multitasking', 'Proactiviteit']
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Basis)'],
      hobbies: ['Lezen', 'Wandelen', 'Koken', 'Vrijwilligerswerk']
    },
    'engineer': {
      template: 'modern',
      fullName: 'Thomas de Wit',
      title: 'Ingenieur',
      summary: 'Ervaren ingenieur met 11 jaar ervaring in projectmanagement, technisch ontwerp en kwaliteitscontrole. Gespecialiseerd in infrastructurele projecten en duurzame oplossingen. Gepassioneerd over innovatie en technische excellentie. met bewezen track record in projectmanagement en technische excellentie.',
      photoUrl: getPlaceholderPhoto('Thomas de Wit'),
      contact: {
        email: 'thomas.dewit@email.nl',
        phone: '+31 6 89012345',
        location: 'Delft, Nederland'
      },
      experience: [
        {
          title: 'Senior Project Ingenieur',
          company: 'Royal HaskoningDHV',
          location: 'Rotterdam',
          dates: '2018 - Heden',
          current: true,
          achievements: [[
            'Leiding aan infrastructurele projecten van €10M+',
            'Technisch ontwerp en engineering',
            'Coördinatie met aannemers en stakeholders',
            'Kwaliteitscontrole en veiligheidsmanagement',
            'Ontwerp en ontwikkeling van infrastructurele projecten met waarde van €10M+',
            'Leiding aan team van 5 engineers met focus op kwaliteit en veiligheid',
            'Implementatie van nieuwe technologieën resulterend in 30% kostenbesparing'
          ]]
        },
        {
          title: 'Ingenieur',
          company: 'Arcadis Nederland',
          location: 'Amsterdam',
          dates: '2012 - 2018',
          achievements: [
            'Ontwerp van bruggen en viaducten',
            'Berekeningen en technische tekeningen',
            'Projectondersteuning en rapportage'
          ]
        }
      ],
      education: [
        {
          institution: 'Technische Universiteit Delft',
          degree: 'Master Civiele Techniek',
          field: 'Civiele Techniek',
          dates: '2007 - 2012',
          achievements: ['Ingenieurstitel behaald', 'Specialisatie in Constructies']
        }
      ],
      skills: {
        technical: ['AutoCAD', 'Revit', 'Projectmanagement', 'Berekeningen', 'Risicoanalyse',
        'CAD software (AutoCAD, SolidWorks)',
        'Project management tools',
        'Engineering standards (ISO, NEN)',
        'Technical analysis',
        'Quality control',
        'Risk assessment'
      ],
        soft: ['Probleemoplossend denken', 'Leiderschap', 'Communicatie', 'Teamwerk',
        'Probleemoplossing',
        'Teamleiderschap',
        'Projectmanagement',
        'Communicatie',
        'Analytisch denken',
        'Kwaliteitsbewustzijn'
      ]
      },
      certifications: [
        { title: 'Project Management Professional (PMP)', institution: 'PMI', year: '2019' }
      ],
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
      hobbies: ['Fietsen', 'Fotografie', 'Lezen', 'Reizen']
    },
    'sales-representative': {
      template: 'modern',
      fullName: 'Max van Leeuwen',
      title: 'Account Manager',
      summary: 'Resultaatgerichte sales professional met 7 jaar ervaring in B2B verkoop en account management. Gespecialiseerd in lange termijn klantrelaties en complexe sales cycles. Gepassioneerd over het helpen van klanten bij het bereiken van hun doelen.',
      photoUrl: getPlaceholderPhoto('Max van Leeuwen'),
      contact: {
        email: 'max.vanleeuwen@email.nl',
        phone: '+31 6 90123456',
        location: 'Amsterdam, Nederland',
        linkedin: 'linkedin.com/in/maxvanleeuwen'
      },
      experience: [
        {
          title: 'Senior Account Manager',
          company: 'Enterprise Solutions BV',
          location: 'Amsterdam',
          dates: '2020 - Heden',
          current: true,
          achievements: [
            'Beheer van portefeuille van 50+ enterprise klanten',
            'Jaarlijkse omzet van €2M+',
            'Uitbreiding van klantrelaties en cross-selling',
            'Leiding aan sales team van 3 accountmanagers'
          ]
        },
        {
          title: 'Account Manager',
          company: 'Business Sales Nederland',
          location: 'Utrecht',
          dates: '2017 - 2020',
          achievements: [
            'Nieuwe klanten acquisitie',
            'Presentaties en productdemonstraties',
            'Contractonderhandelingen',
            '150% van sales target behaald in 2019'
          ]
        }
      ],
      education: [
        {
          institution: 'Hogeschool van Amsterdam',
          degree: 'Bachelor Commerciële Economie',
          field: 'Sales & Marketing',
          dates: '2013 - 2017',
          achievements: ['Diploma behaald']
        }
      ],
      skills: {
        technical: ['CRM systemen', 'Sales forecasting', 'Presentatievaardigheden', 'Contractonderhandeling'],
        soft: ['Relatiebeheer', 'Communicatie', 'Overtuigingskracht', 'Resultaatgerichtheid']
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Goed)'],
      hobbies: ['Netwerken', 'Golf', 'Reizen', 'Lezen']
    },
    'chef': {
      template: 'modern',
      fullName: 'Anna van Dijk',
      title: 'Hoofdchef',
      summary: 'Creatieve chef met 10 jaar ervaring in fine dining en restaurant management. Gespecialiseerd in moderne Europese keuken en seizoensgebonden ingrediënten. Gepassioneerd over culinaire innovatie en teamontwikkeling. met bewezen track record in culinaire innovatie en teamleiderschap.',
      photoUrl: getPlaceholderPhoto('Anna van Dijk'),
      contact: {
        email: 'anna.vandijk@email.nl',
        phone: '+31 6 01234567',
        location: 'Amsterdam, Nederland'
      },
      experience: [
        {
          title: 'Hoofdchef',
          company: 'Restaurant De Gouden Leeuw',
          location: 'Amsterdam',
          dates: '2019 - Heden',
          current: true,
          achievements: [[
            'Leiding aan keukenbrigade van 8 koks',
            'Ontwikkeling van seizoensmenu\',
            ',
            ',
            ',
            ',
            'Leiding aan keuken team van 8+ koks met focus op kwaliteit en efficiëntie',
            'Ontwikkeling van seizoensmenu's met focus op lokale ingrediënten en duurzaamheid',
            'Kostenbeheer resulterend in 20% verbetering in food cost percentage'
          ]]
        },
        {
          title: 'Sous Chef',
          company: 'Restaurant Le Jardin',
          location: 'Rotterdam',
          dates: '2015 - 2019',
          achievements: [
            'Assistentie bij menu ontwikkeling',
            'Training van junior koks',
            'Kwaliteitscontrole en food safety'
          ]
        }
      ],
      education: [
        {
          institution: 'ROC Amsterdam',
          degree: 'MBO Kok',
          field: 'Horeca',
          dates: '2010 - 2014',
          achievements: ['Diploma behaald', 'Stage bij sterrenrestaurant']
        }
      ],
      skills: {
        technical: ['Menu ontwikkeling', 'Food safety', 'Kostenbeheer', 'Kitchen management',
        'Culinaire technieken',
        'Menu ontwikkeling',
        'Food safety (HACCP)',
        'Inventory management',
        'Cost control',
        'Kitchen management systems'
      ],
        soft: ['Creativiteit', 'Leiderschap', 'Stressbestendigheid', 'Teamwerk',
        'Creativiteit',
        'Teamleiderschap',
        'Stressbestendigheid',
        'Kwaliteitsbewustzijn',
        'Gastgerichtheid',
        'Innovatie'
      ]
      },
      certifications: [
        { title: 'HACCP Certificaat', institution: 'HACCP Nederland', year: '2015' }
      ],
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Frans (Goed)'],
      hobbies: ['Koken', 'Wijnproeven', 'Reizen', 'Fotografie']
    },
    'lawyer': {
      template: 'modern',
      fullName: 'Julia Hendriks',
      title: 'Advocaat',
      summary: 'Ervaren advocaat met 9 jaar ervaring in corporate law en contractenrecht. Gespecialiseerd in M&A transacties en commerciële geschillen. Gepassioneerd over juridische excellentie en klantgerichtheid. met bewezen track record in complexe juridische zaken en cliëntadvies.',
      photoUrl: getPlaceholderPhoto('Julia Hendriks'),
      contact: {
        email: 'julia.hendriks@email.nl',
        phone: '+31 6 12345098',
        location: 'Den Haag, Nederland'
      },
      experience: [
        {
          title: 'Senior Advocaat',
          company: 'Legal Partners Advocaten',
          location: 'Den Haag',
          dates: '2018 - Heden',
          current: true,
          achievements: [[
            'Begeleiding van M&A transacties tot €50M',
            'Contractonderhandelingen en due diligence',
            'Geschilbeslechting en arbitrage',
            'Leiding aan team van 3 junior advocaten',
            'Behandeling van 50+ juridische zaken per jaar met 85%+ succespercentage',
            'Advies en ondersteuning bij M&A transacties met totale waarde van €100M+',
            'Voorbereiding van 100+ contracten en juridische documenten'
          ]]
        },
        {
          title: 'Advocaat',
          company: 'Corporate Law Firm Amsterdam',
          location: 'Amsterdam',
          dates: '2014 - 2018',
          achievements: [
            'Juridisch advies aan bedrijven',
            'Contracten opstellen en beoordelen',
            'Rechtspraak en procedures'
          ]
        }
      ],
      education: [
        {
          institution: 'Universiteit Leiden',
          degree: 'Master Rechtsgeleerdheid',
          field: 'Privaatrecht',
          dates: '2009 - 2014',
          achievements: ['Masterdiploma behaald', 'Stage bij advocatenkantoor']
        }
      ],
      skills: {
        technical: ['Contractrecht', 'Ondernemingsrecht', 'M&A', 'Geschilbeslechting',
        'Juridisch onderzoek',
        'Contractenrecht',
        'Procedurerecht',
        'Legal software (LexisNexis)',
        'Documentbeheer',
        'Case management'
      ],
        soft: ['Analytisch denken', 'Communicatie', 'Onderhandelen', 'Precisie',
        'Analytisch denken',
        'Precisie',
        'Effectieve communicatie',
        'Onderhandeling',
        'Klantgerichtheid',
        'Strategisch denken'
      ]
      },
      certifications: [
        { title: 'Advocatenregister', institution: 'Nederlandse Orde van Advocaten', year: '2014' }
      ],
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Frans (Goed)'],
      hobbies: ['Lezen', 'Tennis', 'Reizen', 'Muziek']
    },
    'data-scientist': {
      template: 'modern',
      fullName: 'Ruben Visser',
      title: 'Data Scientist',
      summary: 'Data scientist met 6 jaar ervaring in machine learning, predictive analytics en data engineering. Gespecialiseerd in Python, SQL en cloud platforms. Gepassioneerd over het omzetten van data in actionable insights. met bewezen track record in data-analyse en machine learning implementaties.',
      photoUrl: getPlaceholderPhoto('Ruben Visser'),
      contact: {
        email: 'ruben.visser@email.nl',
        phone: '+31 6 23450987',
        location: 'Amsterdam, Nederland',
        linkedin: 'linkedin.com/in/rubenvisser'
      },
      experience: [
        {
          title: 'Senior Data Scientist',
          company: 'Data Analytics BV',
          location: 'Amsterdam',
          dates: '2020 - Heden',
          current: true,
          achievements: [[
            'Ontwikkeling van ML modellen voor voorspellingen',
            'Data pipeline engineering en ETL processen',
            'Presentatie van insights aan stakeholders',
            'Leiding aan team van 4 data scientists',
            'Ontwikkeling van machine learning modellen voor 10+ business cases',
            'Data analyse van datasets met 1M+ records resulterend in actionable insights',
            'Implementatie van predictive analytics resulterend in 25% verbetering in forecasting'
          ]]
        },
        {
          title: 'Data Scientist',
          company: 'Tech Innovations',
          location: 'Utrecht',
          dates: '2017 - 2020',
          achievements: [
            'Analyse van grote datasets',
            'Machine learning model ontwikkeling',
            'Data visualisatie en rapportage'
          ]
        }
      ],
      education: [
        {
          institution: 'Universiteit van Amsterdam',
          degree: 'Master Data Science',
          field: 'Data Science',
          dates: '2014 - 2017',
          achievements: ['Cum Laude afgestudeerd', 'Scriptie over deep learning']
        }
      ],
      skills: {
        technical: ['Python', 'SQL', 'Machine Learning', 'TensorFlow', 'AWS', 'Tableau'],
        soft: ['Analytisch denken', 'Probleemoplossend', 'Communicatie', 'Teamwerk']
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
      hobbies: ['Programmeren', 'Gaming', 'Fietsen', 'Lezen']
    },
    'doctor': {
      template: 'modern',
      fullName: 'Dr. Bas van den Berg',
      title: 'Huisarts',
      summary: 'Ervaren huisarts met 12 jaar ervaring in eerstelijns gezondheidszorg. Gespecialiseerd in preventieve zorg en chronische ziektebeheer. Gepassioneerd over patiëntgerichte zorg en continue medische educatie. met bewezen track record in patiëntenzorg en medische excellentie.',
      photoUrl: getPlaceholderPhoto('Dr. Bas van den Berg'),
      contact: {
        email: 'bas.vandenberg@email.nl',
        phone: '+31 6 34509876',
        location: 'Utrecht, Nederland'
      },
      experience: [
        {
          title: 'Huisarts',
          company: 'Huisartsenpraktijk De Bilt',
          location: 'Utrecht',
          dates: '2015 - Heden',
          current: true,
          achievements: [[
            'Zorg voor 2000+ patiënten',
            'Preventieve zorg en gezondheidsvoorlichting',
            'Chronische ziektebeheer (diabetes, hypertensie)',
            'Samenwerking met specialisten en ziekenhuizen',
            'Behandeling van gemiddeld 30+ patiënten per dag met focus op kwaliteit van zorg',
            'Samenwerking met multidisciplinair team voor complexe medische cases',
            'Implementatie van evidence-based behandelprotocollen'
          ]]
        },
        {
          title: 'Arts-assistent',
          company: 'UMC Utrecht',
          location: 'Utrecht',
          dates: '2011 - 2015',
          achievements: [
            'Rotaties op verschillende afdelingen',
            'Onderzoek en wetenschappelijke publicaties',
            'Training in verschillende specialismen'
          ]
        }
      ],
      education: [
        {
          institution: 'Universiteit Utrecht',
          degree: 'Master Geneeskunde',
          field: 'Geneeskunde',
          dates: '2004 - 2011',
          achievements: ['Basisarts diploma', 'Specialisatie Huisartsgeneeskunde']
        }
      ],
      skills: {
        technical: ['Diagnostiek', 'Behandelplanning', 'Medische procedures', 'EPD systemen',
        'Medische diagnostiek',
        'Behandelprotocollen',
        'EPD systemen',
        'Medische apparatuur',
        'Kwaliteitsborging',
        'Evidence-based medicine'
      ],
        soft: ['Empathie', 'Communicatie', 'Stressbestendigheid', 'Besluitvorming',
        'Empathie',
        'Communicatie',
        'Stressbestendigheid',
        'Teamwerk',
        'Kritisch denken',
        'Patiëntgerichtheid'
      ]
      },
      certifications: [
        { title: 'BIG Registratie', institution: 'BIG Register', year: '2011' }
      ],
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Basis)'],
      hobbies: ['Hardlopen', 'Lezen', 'Reizen', 'Fotografie']
    },
    'pharmacist': {
      template: 'modern',
      fullName: 'Marieke van der Laan',
      title: 'Apotheker',
      summary: 'Ervaren apotheker met 8 jaar ervaring in community pharmacy en medicatiebeheer. Gespecialiseerd in farmaceutische zorg en medicatiebeoordeling. Gepassioneerd over patiëntveiligheid en medicatieoptimalisatie. met bewezen track record in farmaceutische zorg en medicatiebeheer.',
      photoUrl: getPlaceholderPhoto('Marieke van der Laan'),
      contact: {
        email: 'marieke.vanderlaan@email.nl',
        phone: '+31 6 45098765',
        location: 'Rotterdam, Nederland'
      },
      experience: [
        {
          title: 'Apotheker',
          company: 'Apotheek Centrum Rotterdam',
          location: 'Rotterdam',
          dates: '2018 - Heden',
          current: true,
          achievements: [[
            'Medicatiebeoordeling en -advies',
            'Farmaceutische patiëntenzorg',
            'Samenwerking met huisartsen en specialisten',
            'Leiding aan team van 5 medewerkers',
            'Dagelijkse medicatiebeoordeling voor 100+ patiënten met focus op veiligheid',
            'Farmaceutische zorg en medicatiebeoordeling resulterend in 30% reductie van medicatiefouten',
            'Samenwerking met huisartsen en specialisten voor optimale medicatie'
          ]]
        },
        {
          title: 'Apotheker in opleiding',
          company: 'Ziekenhuisapotheek Erasmus MC',
          location: 'Rotterdam',
          dates: '2015 - 2018',
          achievements: [
            'Medicatiebereiding en -controle',
            'Klinische farmacie',
            'Onderzoek en ontwikkeling'
          ]
        }
      ],
      education: [
        {
          institution: 'Universiteit Utrecht',
          degree: 'Master Farmacie',
          field: 'Farmacie',
          dates: '2010 - 2015',
          achievements: ['Apothekersdiploma behaald']
        }
      ],
      skills: {
        technical: ['Medicatiebeoordeling', 'Farmaceutische bereiding', 'Drug interactions', 'Farmaceutische zorg',
        'Farmaceutische kennis',
        'Medicatiebeoordeling',
        'Farmaceutische software',
        'Kwaliteitsborging',
        'Regulatory compliance',
        'Drug interactions'
      ],
        soft: ['Precisie', 'Communicatie', 'Empathie', 'Teamwerk',
        'Empathie',
        'Communicatie',
        'Precisie',
        'Patiëntgerichtheid',
        'Teamwerk',
        'Kritisch denken'
      ]
      },
      certifications: [
        { title: 'BIG Registratie', institution: 'BIG Register', year: '2015' }
      ],
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
      hobbies: ['Lezen', 'Yoga', 'Koken', 'Reizen']
    },
    'it-support': {
      template: 'modern',
      fullName: 'Kevin de Boer',
      title: 'IT Support Specialist',
      summary: 'Technische IT support specialist met 5 jaar ervaring in helpdesk support, systeembeheer en troubleshooting. Gespecialiseerd in Windows en Linux systemen. Gepassioneerd over probleemoplossing en klanttevredenheid. met bewezen track record in IT troubleshooting en gebruikersondersteuning.',
      photoUrl: getPlaceholderPhoto('Kevin de Boer'),
      contact: {
        email: 'kevin.deboer@email.nl',
        phone: '+31 6 50987654',
        location: 'Eindhoven, Nederland'
      },
      experience: [
        {
          title: 'Senior IT Support Specialist',
          company: 'IT Services Nederland',
          location: 'Eindhoven',
          dates: '2020 - Heden',
          current: true,
          achievements: [[
            'Eerste en tweede lijns support voor 500+ gebruikers',
            'Systeembeheer en onderhoud',
            'Implementatie van nieuwe IT systemen',
            'Training van gebruikers en junior medewerkers',
            'Ondersteuning van 200+ gebruikers met gemiddeld 95%+ oplossingspercentage',
            'Resolutie van 50+ IT tickets per week met focus op snelle response tijden',
            'Implementatie van nieuwe systemen en software voor 50+ gebruikers'
          ]]
        },
        {
          title: 'IT Support Medewerker',
          company: 'TechSupport BV',
          location: 'Amsterdam',
          dates: '2018 - 2020',
          achievements: [
            'Helpdesk support via telefoon en email',
            'Troubleshooting hardware en software problemen',
            'Ticket management en escalatie'
          ]
        }
      ],
      education: [
        {
          institution: 'ROC Eindhoven',
          degree: 'MBO ICT Beheer',
          field: 'ICT',
          dates: '2015 - 2018',
          achievements: ['Diploma behaald']
        }
      ],
      skills: {
        technical: ['Windows Server', 'Linux', 'Active Directory', 'Networking', 'Troubleshooting',
        'Windows/Linux systemen',
        'Networking',
        'Helpdesk software',
        'Remote support tools',
        'Hardware troubleshooting',
        'Software installation'
      ],
        soft: ['Klantgerichtheid', 'Probleemoplossend', 'Communicatie', 'Geduld',
        'Probleemoplossing',
        'Geduld',
        'Communicatie',
        'Klantgerichtheid',
        'Teamwerk',
        'Proactief werken'
      ]
      },
      certifications: [
        { title: 'CompTIA A+', institution: 'CompTIA', year: '2019' },
        { title: 'Microsoft Certified Professional', institution: 'Microsoft', year: '2020' }
      ],
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
      hobbies: ['Gaming', 'Programmeren', 'Fietsen', 'Muziek']
    },
    'professor': {
      template: 'modern',
      fullName: 'Prof. Dr. Sarah van der Meer',
      title: 'Hoogleraar',
      summary: 'Gerenommeerde hoogleraar met 15+ jaar ervaring in onderzoek en onderwijs. Gespecialiseerd in sociale psychologie en gedragswetenschappen. Gepassioneerd over wetenschappelijk onderzoek en kennisoverdracht. met bewezen track record in onderzoek en onderwijs.',
      photoUrl: getPlaceholderPhoto('Prof. Dr. Sarah van der Meer'),
      contact: {
        email: 'sarah.vandermeer@email.nl',
        phone: '+31 6 09876543',
        location: 'Amsterdam, Nederland'
      },
      experience: [
        {
          title: 'Hoogleraar Sociale Psychologie',
          company: 'Universiteit van Amsterdam',
          location: 'Amsterdam',
          dates: '2016 - Heden',
          current: true,
          achievements: [[
            'Onderwijs aan bachelor en master studenten',
            'Leiding aan onderzoeksgroep van 8 onderzoekers',
            '30+ wetenschappelijke publicaties',
            'Begeleiding van 15+ promovendi',
            'Onderwijs aan 200+ studenten per jaar met focus op interactief leren',
            'Publicatie van 15+ peer-reviewed artikelen in toonaangevende journals',
            'Begeleiding van 10+ promovendi en onderzoekers'
          ]]
        },
        {
          title: 'Universitair Docent',
          company: 'Universiteit Leiden',
          location: 'Leiden',
          dates: '2010 - 2016',
          achievements: [
            'Onderwijs en onderzoek',
            'Begeleiding van studenten',
            'Wetenschappelijke publicaties'
          ]
        }
      ],
      education: [
        {
          institution: 'Universiteit van Amsterdam',
          degree: 'PhD Psychologie',
          field: 'Sociale Psychologie',
          dates: '2005 - 2010',
          achievements: ['Promotie cum laude']
        }
      ],
      skills: {
        technical: ['Onderzoeksmethoden', 'Statistiek', 'Data analyse', 'Wetenschappelijk schrijven'],
        soft: ['Onderwijs', 'Mentoring', 'Presentatie', 'Kritisch denken']
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Goed)'],
      hobbies: ['Lezen', 'Schrijven', 'Wandelen', 'Muziek']
    },
    'school-counselor': {
      template: 'modern',
      fullName: 'Iris van der Wal',
      title: 'Schooldecaan',
      summary: 'Ervaren schooldecaan met 7 jaar ervaring in studie- en loopbaanbegeleiding. Gespecialiseerd in het ondersteunen van leerlingen bij studiekeuze en persoonlijke ontwikkeling. Gepassioneerd over het helpen van jongeren bij het bereiken van hun potentieel. met bewezen track record in leerlingbegeleiding en loopbaanoriëntatie.',
      photoUrl: getPlaceholderPhoto('Iris van der Wal'),
      contact: {
        email: 'iris.vanderwal@email.nl',
        phone: '+31 6 98765432',
        location: 'Groningen, Nederland'
      },
      experience: [
        {
          title: 'Schooldecaan',
          company: 'Stedelijk Gymnasium Groningen',
          location: 'Groningen',
          dates: '2019 - Heden',
          current: true,
          achievements: [[
            'Begeleiding van 300+ leerlingen per jaar',
            'Studie- en loopbaanadvies',
            'Organisatie van voorlichtingsactiviteiten',
            'Samenwerking met ouders en docenten',
            'Begeleiding van 100+ leerlingen per jaar bij studiekeuze en persoonlijke ontwikkeling',
            'Organisatie van 20+ loopbaanoriëntatie activiteiten per jaar',
            'Samenwerking met ouders, docenten en externe partijen voor leerlingbegeleiding'
          ]]
        },
        {
          title: 'Decaan',
          company: 'VMBO School De Horizon',
          location: 'Leeuwarden',
          dates: '2016 - 2019',
          achievements: [
            'Loopbaanoriëntatie en -begeleiding',
            'Individuele gesprekken met leerlingen',
            'Organisatie van stages en bedrijfsbezoeken'
          ]
        }
      ],
      education: [
        {
          institution: 'Rijksuniversiteit Groningen',
          degree: 'Master Onderwijskunde',
          field: 'Onderwijs',
          dates: '2012 - 2016',
          achievements: ['Diploma behaald']
        }
      ],
      skills: {
        technical: ['Loopbaanbegeleiding', 'Studieadvies', 'Coaching', 'Assessment',
        'Counseling technieken',
        'Assessment tools',
        'Career guidance',
        'Educational systems',
        'Student information systems',
        'Crisis intervention'
      ],
        soft: ['Empathie', 'Communicatie', 'Geduld', 'Luistervaardigheid',
        'Empathie',
        'Actief luisteren',
        'Communicatie',
        'Geduld',
        'Probleemoplossing',
        'Vertrouwelijkheid'
      ]
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
      hobbies: ['Lezen', 'Yoga', 'Wandelen', 'Vrijwilligerswerk']
    },
    'financial-analyst': {
      template: 'modern',
      fullName: 'Dennis van der Veen',
      title: 'Financieel Analist',
      summary: 'Analytische financieel analist met 6 jaar ervaring in financiële analyse, forecasting en risicobeheer. Gespecialiseerd in corporate finance en investment analysis. Gepassioneerd over data-driven besluitvorming. met bewezen track record in financiële analyse en strategische advisering.',
      photoUrl: getPlaceholderPhoto('Dennis van der Veen'),
      contact: {
        email: 'dennis.vanderveen@email.nl',
        phone: '+31 6 87654321',
        location: 'Amsterdam, Nederland'
      },
      experience: [
        {
          title: 'Senior Financieel Analist',
          company: 'Investment Bank Amsterdam',
          location: 'Amsterdam',
          dates: '2020 - Heden',
          current: true,
          achievements: [[
            'Financiële modellen en forecasting',
            'Due diligence voor M&A transacties',
            'Risicoanalyse en -beheer',
            'Presentaties aan management en investeerders',
            'Financiële analyses en forecasting voor bedrijven met omzet van €50M+',
            'Ontwikkeling van financiële modellen voor strategische besluitvorming',
            'Risicoanalyse en due diligence onderzoeken voor investeerders'
          ]]
        },
        {
          title: 'Financieel Analist',
          company: 'Corporate Finance BV',
          location: 'Rotterdam',
          dates: '2017 - 2020',
          achievements: [
            'Financiële rapportages en analyses',
            'Budgettering en planning',
            'KPI monitoring en rapportage'
          ]
        }
      ],
      education: [
        {
          institution: 'Erasmus Universiteit Rotterdam',
          degree: 'Master Finance & Investment',
          field: 'Finance',
          dates: '2014 - 2017',
          achievements: ['Cum Laude afgestudeerd']
        }
      ],
      skills: {
        technical: ['Excel', 'Financial modeling', 'SQL', 'Bloomberg', 'Risk analysis',
        'Excel (geavanceerd)',
        'Financial modeling',
        'Data analysis tools',
        'Accounting software',
        'Risk analysis',
        'Forecasting'
      ],
        soft: ['Analytisch denken', 'Aandacht voor detail', 'Communicatie', 'Teamwerk',
        'Analytisch denken',
        'Precisie',
        'Communicatie',
        'Kritisch denken',
        'Probleemoplossing',
        'Attention to detail'
      ]
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Goed)'],
      hobbies: ['Golf', 'Lezen', 'Reizen', 'Fotografie']
    },
    'photographer': {
      template: 'modern',
      fullName: 'Fleur van der Berg',
      title: 'Fotograaf',
      summary: 'Creatieve professionele fotograaf met 8 jaar ervaring in portret-, bruilofts- en commerciële fotografie. Gespecialiseerd in natuurlijk licht en storytelling. Gepassioneerd over het vastleggen van authentieke momenten. met bewezen track record in creatieve fotografie en visuele communicatie.',
      photoUrl: getPlaceholderPhoto('Fleur van der Berg'),
      contact: {
        email: 'fleur.vanderberg@email.nl',
        phone: '+31 6 76543210',
        location: 'Amsterdam, Nederland',
        website: 'fleurfotografie.nl'
      },
      experience: [
        {
          title: 'Zelfstandig Fotograaf',
          company: 'Fleur Fotografie',
          location: 'Amsterdam',
          dates: '2018 - Heden',
          current: true,
          achievements: [[
            'Portret- en bruiloftsfotografie',
            'Commerciële opdrachten voor merken',
            '100+ tevreden klanten',
            'Publicaties in verschillende magazines',
            'Fotografie voor 50+ evenementen en commerciële projecten per jaar',
            'Portfolio met 200+ gepubliceerde foto's in magazines en online media',
            'Samenwerking met 30+ klanten voor branding en marketing fotografie'
          ]]
        },
        {
          title: 'Fotograaf',
          company: 'Creative Studio Amsterdam',
          location: 'Amsterdam',
          dates: '2015 - 2018',
          achievements: [
            'Product- en fashion fotografie',
            'Samenwerking met modellen en stylisten',
            'Post-productie en beeldbewerking'
          ]
        }
      ],
      education: [
        {
          institution: 'Fotovakschool Amsterdam',
          degree: 'MBO Fotografie',
          field: 'Fotografie',
          dates: '2012 - 2015',
          achievements: ['Diploma behaald']
        }
      ],
      skills: {
        technical: ['Adobe Lightroom', 'Photoshop', 'Camera techniek', 'Compositie', 'Lighting',
        'Photography equipment',
        'Adobe Lightroom',
        'Adobe Photoshop',
        'Color grading',
        'Studio lighting',
        'Post-production'
      ],
        soft: ['Creativiteit', 'Communicatie', 'Klantgerichtheid', 'Flexibiliteit',
        'Creativiteit',
        'Visuele communicatie',
        'Klantgerichtheid',
        'Flexibiliteit',
        'Netwerken',
        'Artistieke visie'
      ]
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
      hobbies: ['Fotografie', 'Reizen', 'Kunst', 'Muziek']
    },
    'copywriter': {
      template: 'modern',
      fullName: 'Roos van der Laan',
      title: 'Copywriter',
      summary: 'Creatieve copywriter met 5 jaar ervaring in content marketing, advertising en brand storytelling. Gespecialiseerd in digitale content en social media. Gepassioneerd over het creëren van overtuigende verhalen die resulteren. met bewezen track record in content marketing en copywriting.',
      photoUrl: getPlaceholderPhoto('Roos van der Laan'),
      contact: {
        email: 'roos.vanderlaan@email.nl',
        phone: '+31 6 65432109',
        location: 'Utrecht, Nederland'
      },
      experience: [
        {
          title: 'Senior Copywriter',
          company: 'Marketing Agency Utrecht',
          location: 'Utrecht',
          dates: '2021 - Heden',
          current: true,
          achievements: [[
            'Content strategie en creatie voor 20+ merken',
            'Campagne ontwikkeling en copywriting',
            'Social media content en storytelling',
            'Leiding aan team van 3 copywriters',
            'Schrijven van 100+ marketing teksten per jaar voor diverse kanalen',
            'Content strategie ontwikkeling resulterend in 40% verhoogde engagement',
            'Samenwerking met marketing teams voor geïntegreerde campagnes'
          ]]
        },
        {
          title: 'Copywriter',
          company: 'Digital Content BV',
          location: 'Amsterdam',
          dates: '2018 - 2021',
          achievements: [
            'Blog posts en artikelen',
            'Website copy en landing pages',
            'Email marketing campagnes'
          ]
        }
      ],
      education: [
        {
          institution: 'Universiteit Utrecht',
          degree: 'Bachelor Communicatiewetenschap',
          field: 'Communicatie',
          dates: '2014 - 2018',
          achievements: ['Diploma behaald']
        }
      ],
      skills: {
        technical: ['Copywriting', 'Content strategie', 'SEO', 'Social media', 'Email marketing',
        'Content management systems',
        'SEO tools',
        'Analytics tools',
        'Design software basics',
        'Marketing automation',
        'Social media platforms'
      ],
        soft: ['Creativiteit', 'Schrijven', 'Storytelling', 'Teamwerk',
        'Creativiteit',
        'Schrijfvaardigheid',
        'Research skills',
        'Klantgerichtheid',
        'Teamwerk',
        'Deadline management'
      ]
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
      hobbies: ['Schrijven', 'Lezen', 'Reizen', 'Kunst']
    },
    'mechanical-engineer': {
      template: 'modern',
      fullName: 'Joris van der Meulen',
      title: 'Werktuigbouwkundig Ingenieur',
      summary: 'Ervaren werktuigbouwkundig ingenieur met 9 jaar ervaring in productontwikkeling en machine design. Gespecialiseerd in CAD/CAM en prototyping. Gepassioneerd over innovatie en technische oplossingen. met bewezen track record in mechanisch ontwerp en productontwikkeling.',
      photoUrl: getPlaceholderPhoto('Joris van der Meulen'),
      contact: {
        email: 'joris.vandermeulen@email.nl',
        phone: '+31 6 54321098',
        location: 'Eindhoven, Nederland'
      },
      experience: [
        {
          title: 'Senior Product Engineer',
          company: 'ASML',
          location: 'Veldhoven',
          dates: '2018 - Heden',
          current: true,
          achievements: [[
            'Ontwerp en ontwikkeling van precisie componenten',
            'CAD/CAM engineering en prototyping',
            'Kwaliteitscontrole en testing',
            'Leiding aan engineering team',
            'Ontwerp en ontwikkeling van mechanische systemen voor 10+ projecten',
            'CAD/CAM engineering en prototyping voor productontwikkeling',
            'Projectmanagement van engineering projecten met waarde van €5M+'
          ]]
        },
        {
          title: 'Mechanical Engineer',
          company: 'Philips Engineering',
          location: 'Eindhoven',
          dates: '2014 - 2018',
          achievements: [
            'Product design en ontwikkeling',
            'Materiaalkeuze en optimalisatie',
            'Samenwerking met productie en R&D'
          ]
        }
      ],
      education: [
        {
          institution: 'Technische Universiteit Eindhoven',
          degree: 'Master Werktuigbouwkunde',
          field: 'Mechanical Engineering',
          dates: '2009 - 2014',
          achievements: ['Ingenieurstitel behaald']
        }
      ],
      skills: {
        technical: ['SolidWorks', 'AutoCAD', 'FEM Analysis', 'Prototyping', '3D Printing',
        'CAD/CAM software',
        'Finite Element Analysis',
        'Manufacturing processes',
        'Quality control',
        'Project management',
        'Technical documentation'
      ],
        soft: ['Probleemoplossend', 'Precisie', 'Teamwerk', 'Innovatie',
        'Probleemoplossing',
        'Teamwerk',
        'Projectmanagement',
        'Communicatie',
        'Analytisch denken',
        'Innovatie'
      ]
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
      hobbies: ['3D Printing', 'Fietsen', 'Technologie', 'Lezen']
    },
    'civil-engineer': {
      template: 'modern',
      fullName: 'Marijn van der Steen',
      title: 'Civiel Ingenieur',
      summary: 'Ervaren civiel ingenieur met 10 jaar ervaring in infrastructurele projecten en bouwmanagement. Gespecialiseerd in bruggen en wegenbouw. Gepassioneerd over duurzame infrastructuur en veiligheid. met bewezen track record in infrastructurele projecten en bouwmanagement.',
      photoUrl: getPlaceholderPhoto('Marijn van der Steen'),
      contact: {
        email: 'marijn.vandersteen@email.nl',
        phone: '+31 6 43210987',
        location: 'Rotterdam, Nederland'
      },
      experience: [
        {
          title: 'Project Manager Civiele Techniek',
          company: 'BAM Infra',
          location: 'Rotterdam',
          dates: '2019 - Heden',
          current: true,
          achievements: [[
            'Leiding aan infrastructurele projecten van €15M+',
            'Planning en uitvoering van wegen- en waterbouwprojecten',
            'Coördinatie met aannemers en stakeholders',
            'Kwaliteits- en veiligheidsmanagement',
            'Ontwerp en ontwikkeling van infrastructurele projecten met waarde van €20M+',
            'Projectmanagement van bouwprojecten binnen budget en deadline',
            'Kwaliteitsborging en veiligheidscompliance voor alle projecten'
          ]]
        },
        {
          title: 'Civiel Ingenieur',
          company: 'Royal HaskoningDHV',
          location: 'Rotterdam',
          dates: '2013 - 2019',
          achievements: [
            'Ontwerp van bruggen en viaducten',
            'Berekeningen en technische tekeningen',
            'Projectondersteuning'
          ]
        }
      ],
      education: [
        {
          institution: 'Technische Universiteit Delft',
          degree: 'Master Civiele Techniek',
          field: 'Civiele Techniek',
          dates: '2008 - 2013',
          achievements: ['Ingenieurstitel behaald']
        }
      ],
      skills: {
        technical: ['AutoCAD', 'Revit', 'Projectmanagement', 'Berekeningen', 'Risicoanalyse',
        'CAD software',
        'Structural analysis',
        'Project management',
        'Construction methods',
        'Quality control',
        'Safety compliance'
      ],
        soft: ['Leiderschap', 'Communicatie', 'Probleemoplossend', 'Teamwerk',
        'Probleemoplossing',
        'Teamleiderschap',
        'Projectmanagement',
        'Communicatie',
        'Analytisch denken',
        'Kwaliteitsbewustzijn'
      ]
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
      hobbies: ['Fietsen', 'Fotografie', 'Lezen', 'Reizen']
    },
    'account-manager': {
      template: 'modern',
      fullName: 'Sanne van der Pol',
      title: 'Account Manager',
      summary: 'Resultaatgerichte account manager met 6 jaar ervaring in B2B account management en klantrelaties. Gespecialiseerd in enterprise accounts en complexe sales. Gepassioneerd over het helpen van klanten bij succes. met bewezen track record in account groei en klantrelatiebeheer.',
      photoUrl: getPlaceholderPhoto('Sanne van der Pol'),
      contact: {
        email: 'sanne.vanderpol@email.nl',
        phone: '+31 6 32109876',
        location: 'Amsterdam, Nederland',
        linkedin: 'linkedin.com/in/sannevanderpol'
      },
      experience: [
        {
          title: 'Senior Account Manager',
          company: 'Enterprise Solutions',
          location: 'Amsterdam',
          dates: '2020 - Heden',
          current: true,
          achievements: [[
            'Beheer van portefeuille van 40+ enterprise klanten',
            'Jaarlijkse omzet van €1.8M+',
            'Uitbreiding van klantrelaties en upselling',
            'Leiding aan account team',
            'Beheer van portfolio van 25+ enterprise accounts met totale waarde van €2M+',
            'Account groei van gemiddeld 35% per jaar door proactieve relatiebeheer',
            'Ontwikkeling van accountstrategieën resulterend in 40% verhoogde customer lifetime value'
          ]]
        },
        {
          title: 'Account Manager',
          company: 'Business Sales Nederland',
          location: 'Utrecht',
          dates: '2017 - 2020',
          achievements: [
            'Nieuwe klanten acquisitie',
            'Presentaties en productdemonstraties',
            'Contractonderhandelingen',
            '140% van sales target behaald'
          ]
        }
      ],
      education: [
        {
          institution: 'Hogeschool van Amsterdam',
          degree: 'Bachelor Commerciële Economie',
          field: 'Sales & Marketing',
          dates: '2013 - 2017',
          achievements: ['Diploma behaald']
        }
      ],
      skills: {
        technical: ['CRM systemen', 'Sales forecasting', 'Presentatievaardigheden', 'Contractonderhandeling',
        'CRM systems (Salesforce, HubSpot)',
        'Sales analytics',
        'Contract management',
        'Presentation tools',
        'Market research',
        'Competitive analysis'
      ],
        soft: ['Relatiebeheer', 'Communicatie', 'Overtuigingskracht', 'Resultaatgerichtheid',
        'Relatiebeheer',
        'Onderhandeling',
        'Strategisch denken',
        'Klantgerichtheid',
        'Communicatie',
        'Resultaatgerichtheid'
      ]
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Goed)'],
      hobbies: ['Netwerken', 'Golf', 'Reizen', 'Lezen']
    },
    'retail-manager': {
      template: 'modern',
      fullName: 'Tim van der Zee',
      title: 'Winkelmanager',
      summary: 'Ervaren winkelmanager met 8 jaar ervaring in retail management en klantenservice. Gespecialiseerd in teamleiderschap en omzetoptimalisatie. Gepassioneerd over klanttevredenheid en operationele excellentie.',
      photoUrl: getPlaceholderPhoto('Tim van der Zee'),
      contact: {
        email: 'tim.vanderzee@email.nl',
        phone: '+31 6 21098765',
        location: 'Rotterdam, Nederland'
      },
      experience: [
        {
          title: 'Winkelmanager',
          company: 'H&M Nederland',
          location: 'Rotterdam',
          dates: '2019 - Heden',
          current: true,
          achievements: [
            'Leiding aan team van 15 medewerkers',
            'Omzetoptimalisatie en voorraadbeheer',
            'Klantenservice en tevredenheid',
            'Implementatie van nieuwe processen'
          ]
        },
        {
          title: 'Assistent Winkelmanager',
          company: 'Zara Nederland',
          location: 'Amsterdam',
          dates: '2015 - 2019',
          achievements: [
            'Ondersteuning bij dagelijkse operaties',
            'Training van nieuwe medewerkers',
            'Voorraadbeheer en bestellingen'
          ]
        }
      ],
      education: [
        {
          institution: 'ROC Rotterdam',
          degree: 'MBO Retail Management',
          field: 'Retail',
          dates: '2012 - 2015',
          achievements: ['Diploma behaald']
        }
      ],
      skills: {
        technical: ['Retail systemen', 'Voorraadbeheer', 'Omzetanalyse', 'Planning'],
        soft: ['Leiderschap', 'Klantgerichtheid', 'Teamwerk', 'Organisatie']
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Basis)'],
      hobbies: ['Fitness', 'Reizen', 'Muziek', 'Lezen']
    },
    'office-manager': {
      template: 'modern',
      fullName: 'Lotte van der Heijden',
      title: 'Kantoor Manager',
      summary: 'Proactieve kantoor manager met 7 jaar ervaring in office management, HR en administratie. Gespecialiseerd in efficiënte workflow en teamcoördinatie. Gepassioneerd over het creëren van een positieve werkomgeving. met bewezen track record in kantoorbeheer en teamcoördinatie.',
      photoUrl: getPlaceholderPhoto('Lotte van der Heijden'),
      contact: {
        email: 'lotte.vanderheijden@email.nl',
        phone: '+31 6 10987654',
        location: 'Utrecht, Nederland'
      },
      experience: [
        {
          title: 'Kantoor Manager',
          company: 'Business Services BV',
          location: 'Utrecht',
          dates: '2020 - Heden',
          current: true,
          achievements: [[
            'Leiding aan administratief team van 8 medewerkers',
            'HR ondersteuning en recruitment',
            'Facility management en inkoop',
            'Budgetbeheer en rapportage',
            'Leiding aan administratief team van 8+ medewerkers',
            'Beheer van kantoorfaciliteiten voor 50+ medewerkers',
            'Implementatie van process verbeteringen resulterend in 30% efficiëntie verhoging'
          ]]
        },
        {
          title: 'Office Coordinator',
          company: 'Corporate Solutions',
          location: 'Amsterdam',
          dates: '2016 - 2020',
          achievements: [
            'Administratieve ondersteuning',
            'Agenda beheer en planning',
            'Event organisatie'
          ]
        }
      ],
      education: [
        {
          institution: 'Hogeschool Utrecht',
          degree: 'Bachelor Business Administration',
          field: 'Bedrijfskunde',
          dates: '2012 - 2016',
          achievements: ['Diploma behaald']
        }
      ],
      skills: {
        technical: ['Microsoft Office', 'HR systemen', 'Boekhoudsoftware', 'Projectmanagement',
        'Office software',
        'HR systems',
        'Financial software',
        'Facility management',
        'Project management tools',
        'Document management'
      ],
        soft: ['Organisatie', 'Communicatie', 'Leiderschap', 'Multitasking',
        'Organisatie',
        'Teamleiderschap',
        'Communicatie',
        'Probleemoplossing',
        'Multitasking',
        'Efficiëntie'
      ]
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Basis)'],
      hobbies: ['Yoga', 'Lezen', 'Koken', 'Wandelen']
    },
    'executive-assistant': {
      template: 'modern',
      fullName: 'Niels van der Vliet',
      title: 'Executive Assistant',
      summary: 'Ervaren executive assistant met 9 jaar ervaring in executive support en administratieve coördinatie. Gespecialiseerd in C-level ondersteuning en complexe planning. Gepassioneerd over efficiency en discretie. met bewezen track record in executive ondersteuning en organisatie.',
      photoUrl: getPlaceholderPhoto('Niels van der Vliet'),
      contact: {
        email: 'niels.vandervliet@email.nl',
        phone: '+31 6 09876543',
        location: 'Amsterdam, Nederland'
      },
      experience: [
        {
          title: 'Executive Assistant',
          company: 'Fortune 500 Company',
          location: 'Amsterdam',
          dates: '2018 - Heden',
          current: true,
          achievements: [[
            'Ondersteuning van CEO en directie',
            'Complexe agenda beheer en reisplanning',
            'Organisatie van board meetings en events',
            'Vertrouwelijke documentbeheer',
            'Ondersteuning van 3+ C-level executives met focus op efficiëntie',
            'Coördinatie van 20+ executive meetings en evenementen per maand',
            'Voorbereiding van 30+ presentaties en rapporten per maand'
          ]]
        },
        {
          title: 'Management Assistant',
          company: 'Corporate Amsterdam',
          location: 'Amsterdam',
          dates: '2014 - 2018',
          achievements: [
            'Ondersteuning van management team',
            'Administratieve coördinatie',
            'Klantrelaties en communicatie'
          ]
        }
      ],
      education: [
        {
          institution: 'Hogeschool van Amsterdam',
          degree: 'Bachelor Secretarieel',
          field: 'Administratie',
          dates: '2010 - 2014',
          achievements: ['Diploma behaald']
        }
      ],
      skills: {
        technical: ['Microsoft Office', 'Outlook', 'CRM', 'Projectmanagement tools',
        'Microsoft Office Suite',
        'Calendar management',
        'Travel booking systems',
        'Document management',
        'Presentation tools',
        'Communication tools'
      ],
        soft: ['Discretie', 'Organisatie', 'Communicatie', 'Proactiviteit', 'Stressbestendigheid',
        'Discretie',
        'Organisatie',
        'Proactief werken',
        'Communicatie',
        'Multitasking',
        'Attention to detail'
      ]
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Frans (Goed)', 'Duits (Basis)'],
      hobbies: ['Lezen', 'Golf', 'Reizen', 'Fotografie']
    },
    'hotel-manager': {
      template: 'modern',
      fullName: 'Femke van der Berg',
      title: 'Hotel Manager',
      summary: 'Ervaren hotel manager met 10 jaar ervaring in hospitality management en gastenservice. Gespecialiseerd in luxury hotels en operationele excellentie. Gepassioneerd over het creëren van onvergetelijke gastenervaringen. met bewezen track record in hospitality management en gastenservice.',
      photoUrl: getPlaceholderPhoto('Femke van der Berg'),
      contact: {
        email: 'femke.vanderberg@email.nl',
        phone: '+31 6 98765432',
        location: 'Amsterdam, Nederland'
      },
      experience: [
        {
          title: 'Hotel Manager',
          company: 'Grand Hotel Amsterdam',
          location: 'Amsterdam',
          dates: '2019 - Heden',
          current: true,
          achievements: [[
            'Leiding aan team van 50+ medewerkers',
            'Omzetoptimalisatie en budgetbeheer',
            'Gastenservice en tevredenheid',
            'Operational excellence en kwaliteitsmanagement',
            'Leiding aan team van 25+ medewerkers met focus op gastenservice',
            'Beheer van hotel met 80+ kamers en gemiddeld 70% bezettingsgraad',
            'Implementatie van service verbeteringen resulterend in 4.5+ sterren rating'
          ]]
        },
        {
          title: 'Front Office Manager',
          company: 'Boutique Hotel Rotterdam',
          location: 'Rotterdam',
          dates: '2015 - 2019',
          achievements: [
            'Leiding aan front office team',
            'Reservatiebeheer en revenue management',
            'Gastenservice en probleemoplossing'
          ]
        }
      ],
      education: [
        {
          institution: 'Hotelschool Den Haag',
          degree: 'Bachelor Hotel Management',
          field: 'Hospitality',
          dates: '2011 - 2015',
          achievements: ['Diploma behaald']
        }
      ],
      skills: {
        technical: ['Hotel management systemen', 'Revenue management', 'Event planning', 'Food & Beverage',
        'Property management systems',
        'Revenue management',
        'Event planning software',
        'Financial management',
        'Customer service systems',
        'Inventory management'
      ],
        soft: ['Leiderschap', 'Gastgerichtheid', 'Teamwerk', 'Probleemoplossend',
        'Gastenservice',
        'Teamleiderschap',
        'Stressbestendigheid',
        'Communicatie',
        'Probleemoplossing',
        'Commercieel inzicht'
      ]
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Frans (Goed)', 'Duits (Goed)'],
      hobbies: ['Reizen', 'Koken', 'Lezen', 'Fotografie']
    },
    'restaurant-manager': {
      template: 'modern',
      fullName: 'Jeroen van der Molen',
      title: 'Restaurant Manager',
      summary: 'Ervaren restaurant manager met 8 jaar ervaring in restaurant management en gastenservice. Gespecialiseerd in fine dining en teamleiderschap. Gepassioneerd over culinaire excellentie en gasttevredenheid. met bewezen track record in restaurant management en operationele excellentie.',
      photoUrl: getPlaceholderPhoto('Jeroen van der Molen'),
      contact: {
        email: 'jeroen.vandermolen@email.nl',
        phone: '+31 6 87654321',
        location: 'Amsterdam, Nederland'
      },
      experience: [
        {
          title: 'Restaurant Manager',
          company: 'Restaurant De Gouden Leeuw',
          location: 'Amsterdam',
          dates: '2020 - Heden',
          current: true,
          achievements: [[
            'Leiding aan team van 20+ medewerkers',
            'Dagelijkse operaties en service management',
            'Gastenservice en tevredenheid',
            'Samenwerking met keuken en sommelier',
            'Leiding aan team van 15+ medewerkers met focus op gastenservice',
            'Beheer van restaurant met 60+ covers en gemiddeld 200 covers per dag',
            'Implementatie van service verbeteringen resulterend in 4.5+ sterren rating'
          ]]
        },
        {
          title: 'Floor Manager',
          company: 'Restaurant Le Jardin',
          location: 'Rotterdam',
          dates: '2016 - 2020',
          achievements: [
            'Service coördinatie en teamleiding',
            'Gastenservice en reserveringen',
            'Training van nieuwe medewerkers'
          ]
        }
      ],
      education: [
        {
          institution: 'ROC Amsterdam',
          degree: 'MBO Horeca Management',
          field: 'Horeca',
          dates: '2012 - 2016',
          achievements: ['Diploma behaald']
        }
      ],
      skills: {
        technical: ['Restaurant systemen', 'Reserveringsbeheer', 'Wijnkennis', 'Food & Beverage',
        'POS systems',
        'Reservation systems',
        'Inventory management',
        'Financial management',
        'Staff scheduling',
        'Food safety systems'
      ],
        soft: ['Leiderschap', 'Gastgerichtheid', 'Teamwerk', 'Stressbestendigheid',
        'Gastenservice',
        'Teamleiderschap',
        'Stressbestendigheid',
        'Communicatie',
        'Probleemoplossing',
        'Kwaliteitsbewustzijn'
      ]
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Frans (Goed)'],
      hobbies: ['Wijnproeven', 'Koken', 'Reizen', 'Fotografie']
    },
    'paralegal': {
      template: 'modern',
      fullName: 'Maud van der Linden',
      title: 'Paralegal',
      summary: 'Ervaren paralegal met 6 jaar ervaring in juridische ondersteuning en documentbeheer. Gespecialiseerd in corporate law en contractenrecht. Gepassioneerd over precisie en juridische excellentie. met bewezen track record in juridische ondersteuning en documentbeheer.',
      photoUrl: getPlaceholderPhoto('Maud van der Linden'),
      contact: {
        email: 'maud.vanderlinden@email.nl',
        phone: '+31 6 76543210',
        location: 'Den Haag, Nederland'
      },
      experience: [
        {
          title: 'Senior Paralegal',
          company: 'Legal Partners Advocaten',
          location: 'Den Haag',
          dates: '2020 - Heden',
          current: true,
          achievements: [[
            'Juridische ondersteuning aan advocaten',
            'Documentbeheer en -onderzoek',
            'Contracten opstellen en beoordelen',
            'Begeleiding van M&A transacties',
            'Ondersteuning bij 100+ juridische zaken per jaar',
            'Voorbereiding van 200+ juridische documenten en contracten',
            'Juridisch onderzoek en documentatie voor advocaten'
          ]]
        },
        {
          title: 'Paralegal',
          company: 'Corporate Law Firm',
          location: 'Amsterdam',
          dates: '2017 - 2020',
          achievements: [
            'Juridisch onderzoek en documentatie',
            'Administratieve ondersteuning',
            'Klantcommunicatie'
          ]
        }
      ],
      education: [
        {
          institution: 'Hogeschool Leiden',
          degree: 'Bachelor Rechtsgeleerdheid',
          field: 'Recht',
          dates: '2013 - 2017',
          achievements: ['Diploma behaald']
        }
      ],
      skills: {
        technical: ['Juridisch onderzoek', 'Documentbeheer', 'Contractrecht', 'Legal software',
        'Legal research',
        'Document management',
        'Case management software',
        'Legal databases',
        'Court filing systems',
        'Legal writing'
      ],
        soft: ['Precisie', 'Analytisch denken', 'Communicatie', 'Organisatie',
        'Analytisch denken',
        'Precisie',
        'Organisatie',
        'Communicatie',
        'Teamwerk',
        'Attention to detail'
      ]
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Frans (Basis)'],
      hobbies: ['Lezen', 'Yoga', 'Wandelen', 'Muziek']
    },
    'legal-assistant': {
      template: 'modern',
      fullName: 'Rick van der Hoek',
      title: 'Juridisch Medewerker',
      summary: 'Proactieve juridisch medewerker met 5 jaar ervaring in juridische administratie en ondersteuning. Gespecialiseerd in documentbeheer en klantcommunicatie. Gepassioneerd over efficiëntie en service. met bewezen track record in juridische administratie en ondersteuning.',
      photoUrl: getPlaceholderPhoto('Rick van der Hoek'),
      contact: {
        email: 'rick.vanderhoek@email.nl',
        phone: '+31 6 65432109',
        location: 'Amsterdam, Nederland'
      },
      experience: [
        {
          title: 'Juridisch Medewerker',
          company: 'Legal Services Amsterdam',
          location: 'Amsterdam',
          dates: '2020 - Heden',
          current: true,
          achievements: [[
            'Juridische administratie en documentbeheer',
            'Klantcommunicatie en -ondersteuning',
            'Planning en agenda beheer',
            'Ondersteuning bij procedures',
            'Ondersteuning bij 80+ juridische zaken per jaar',
            'Voorbereiding van 150+ juridische documenten en administratie',
            'Juridisch onderzoek en documentatie voor juridisch team'
          ]]
        },
        {
          title: 'Administratief Medewerker',
          company: 'Law Office Den Haag',
          location: 'Den Haag',
          dates: '2018 - 2020',
          achievements: [
            'Administratieve ondersteuning',
            'Documentverwerking',
            'Telefoonbeantwoording'
          ]
        }
      ],
      education: [
        {
          institution: 'ROC Amsterdam',
          degree: 'MBO Juridisch Administratief',
          field: 'Recht',
          dates: '2015 - 2018',
          achievements: ['Diploma behaald']
        }
      ],
      skills: {
        technical: ['Microsoft Office', 'Legal software', 'Documentbeheer', 'Administratie'],
        soft: ['Organisatie', 'Communicatie', 'Precisie', 'Klantgerichtheid']
      },
      languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
      hobbies: ['Fitness', 'Lezen', 'Gaming', 'Muziek']
    }
  }

  return examples[professionId] || examples['nurse']
}
