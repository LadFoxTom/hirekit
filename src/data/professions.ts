/**
 * Profession/Sector configuration for SEO examples pages
 * Each profession has translations for all supported languages
 */

export type Language = 'en' | 'nl' | 'fr' | 'es' | 'de' | 'it' | 'pl' | 'ro' | 'hu' | 'el' | 'cs' | 'pt' | 'sv' | 'bg' | 'da' | 'fi' | 'sk' | 'no' | 'hr' | 'sr'

export interface ProfessionTranslation {
  name: string
  slug: string
  description: string
  tips: string[]
  skills: string[]
  whyGood: string[]
}

export interface Profession {
  id: string
  translations: Record<Language, ProfessionTranslation>
  category: 'healthcare' | 'technology' | 'education' | 'business' | 'creative' | 'engineering' | 'sales' | 'administration' | 'hospitality' | 'legal'
}

// URL path segments per language
export const URL_SEGMENTS: Record<Language, { examples: string; cv: string; letter: string }> = {
  en: { examples: 'examples', cv: 'cv', letter: 'letter' },
  nl: { examples: 'voorbeeld', cv: 'cv', letter: 'motivatiebrief' },
  fr: { examples: 'exemples', cv: 'cv', letter: 'lettre' },
  es: { examples: 'ejemplos', cv: 'cv', letter: 'carta' },
  de: { examples: 'beispiele', cv: 'lebenslauf', letter: 'anschreiben' },
  it: { examples: 'esempi', cv: 'cv', letter: 'lettera' },
  pl: { examples: 'przyklady', cv: 'cv', letter: 'list' },
  ro: { examples: 'exemple', cv: 'cv', letter: 'scrisoare' },
  hu: { examples: 'peldak', cv: 'cv', letter: 'level' },
  el: { examples: 'paradeigmata', cv: 'cv', letter: 'epistoli' },
  cs: { examples: 'priklady', cv: 'cv', letter: 'dopis' },
  pt: { examples: 'exemplos', cv: 'cv', letter: 'carta' },
  sv: { examples: 'exempel', cv: 'cv', letter: 'brev' },
  bg: { examples: 'primery', cv: 'cv', letter: 'pismo' },
  da: { examples: 'eksempler', cv: 'cv', letter: 'brev' },
  fi: { examples: 'esimerkit', cv: 'cv', letter: 'kirje' },
  sk: { examples: 'priklady', cv: 'cv', letter: 'list' },
  no: { examples: 'eksempler', cv: 'cv', letter: 'brev' },
  hr: { examples: 'primjeri', cv: 'cv', letter: 'pismo' },
  sr: { examples: 'primeri', cv: 'cv', letter: 'pismo' }
}

export const PROFESSIONS: Profession[] = [
  {
    id: 'nurse',
    category: 'healthcare',
    translations: {
      en: {
        name: 'Nurse',
        slug: 'nurse',
        description: 'Nursing is a profession focused on patient care, health promotion, and supporting individuals and families through health challenges. Nurses work in various settings including hospitals, clinics, community health centers, and home care.',
        tips: [
          'Highlight your clinical experience and patient care skills',
          'Emphasize certifications and continuing education',
          'Showcase your ability to work in team environments',
          'Include any specialized training or areas of expertise',
          'Demonstrate empathy and communication skills'
        ],
        skills: [
          'Patient assessment and care planning',
          'Medication administration',
          'Wound care and dressing changes',
          'Patient education and health promotion',
          'Electronic health records (EHR) systems',
          'Critical thinking and clinical judgment',
          'Interdisciplinary collaboration'
        ],
        whyGood: [
          'Clear structure that highlights clinical competencies',
          'Emphasizes patient-centered care approach',
          'Shows progression of responsibilities and skills',
          'Demonstrates commitment to professional development',
          'ATS-friendly format ensures visibility to recruiters'
        ]
      },
      nl: {
        name: 'Verpleegkundige',
        slug: 'verpleegkundige',
        description: 'Verpleegkunde is een beroep gericht op patiëntenzorg, gezondheidsbevordering en het ondersteunen van individuen en gezinnen bij gezondheidsuitdagingen. Verpleegkundigen werken in verschillende settings zoals ziekenhuizen, klinieken, gezondheidscentra en thuiszorg.',
        tips: [
          'Benadruk je klinische ervaring en patiëntenzorg vaardigheden',
          'Leg nadruk op certificeringen en bijscholing',
          'Toon je vermogen om in teamverband te werken',
          'Vermeld gespecialiseerde training of expertisegebieden',
          'Demonstreer empathie en communicatieve vaardigheden'
        ],
        skills: [
          'Patiëntbeoordeling en zorgplanning',
          'Medicatietoediening',
          'Wondverzorging en verbandwisselingen',
          'Patiëntenvoorlichting en gezondheidsbevordering',
          'Elektronische patiëntendossiers (EPD) systemen',
          'Kritisch denken en klinisch oordeel',
          'Interdisciplinaire samenwerking'
        ],
        whyGood: [
          'Duidelijke structuur die klinische competenties benadrukt',
          'Legt nadruk op patiëntgerichte zorgbenadering',
          'Toont progressie van verantwoordelijkheden en vaardigheden',
          'Demonstreert toewijding aan professionele ontwikkeling',
          'ATS-vriendelijk formaat zorgt voor zichtbaarheid bij recruiters'
        ]
      },
      fr: {
        name: 'Infirmier/Infirmière',
        slug: 'infirmier',
        description: 'Les soins infirmiers sont une profession axée sur les soins aux patients, la promotion de la santé et le soutien aux individus et aux familles face aux défis de santé. Les infirmiers travaillent dans divers contextes, notamment les hôpitaux, les cliniques, les centres de santé communautaires et les soins à domicile.',
        tips: [
          'Mettez en avant votre expérience clinique et vos compétences en soins aux patients',
          'Soulignez les certifications et la formation continue',
          'Montrez votre capacité à travailler en équipe',
          'Incluez toute formation spécialisée ou domaines d\'expertise',
          'Démontrez l\'empathie et les compétences en communication'
        ],
        skills: [
          'Évaluation des patients et planification des soins',
          'Administration de médicaments',
          'Soins des plaies et changements de pansements',
          'Éducation des patients et promotion de la santé',
          'Systèmes de dossiers de santé électroniques (DSE)',
          'Pensée critique et jugement clinique',
          'Collaboration interdisciplinaire'
        ],
        whyGood: [
          'Structure claire qui met en évidence les compétences cliniques',
          'Met l\'accent sur l\'approche de soins centrés sur le patient',
          'Montre la progression des responsabilités et des compétences',
          'Démontre l\'engagement envers le développement professionnel',
          'Format compatible ATS garantit la visibilité auprès des recruteurs'
        ]
      },
      es: {
        name: 'Enfermero/Enfermera',
        slug: 'enfermero',
        description: 'La enfermería es una profesión centrada en el cuidado del paciente, la promoción de la salud y el apoyo a individuos y familias ante desafíos de salud. Los enfermeros trabajan en diversos entornos, incluyendo hospitales, clínicas, centros de salud comunitarios y atención domiciliaria.',
        tips: [
          'Destaca tu experiencia clínica y habilidades de cuidado al paciente',
          'Enfatiza certificaciones y educación continua',
          'Muestra tu capacidad para trabajar en entornos de equipo',
          'Incluye cualquier formación especializada o áreas de experiencia',
          'Demuestra empatía y habilidades de comunicación'
        ],
        skills: [
          'Evaluación del paciente y planificación de cuidados',
          'Administración de medicamentos',
          'Cuidado de heridas y cambios de vendajes',
          'Educación del paciente y promoción de la salud',
          'Sistemas de registros de salud electrónicos (EHR)',
          'Pensamiento crítico y juicio clínico',
          'Colaboración interdisciplinaria'
        ],
        whyGood: [
          'Estructura clara que destaca las competencias clínicas',
          'Enfatiza el enfoque de atención centrada en el paciente',
          'Muestra la progresión de responsabilidades y habilidades',
          'Demuestra compromiso con el desarrollo profesional',
          'Formato compatible con ATS asegura visibilidad para reclutadores'
        ]
      },
      de: {
        name: 'Krankenschwester/Pfleger',
        slug: 'krankenschwester',
        description: 'Die Pflege ist ein Beruf, der sich auf Patientenversorgung, Gesundheitsförderung und die Unterstützung von Einzelpersonen und Familien bei gesundheitlichen Herausforderungen konzentriert. Pflegekräfte arbeiten in verschiedenen Einrichtungen, einschließlich Krankenhäusern, Kliniken, Gemeindegesundheitszentren und häuslicher Pflege.',
        tips: [
          'Heben Sie Ihre klinische Erfahrung und Patientenversorgungsfähigkeiten hervor',
          'Betonen Sie Zertifizierungen und Weiterbildung',
          'Zeigen Sie Ihre Fähigkeit, in Teamumgebungen zu arbeiten',
          'Fügen Sie spezialisierte Schulungen oder Fachgebiete hinzu',
          'Demonstrieren Sie Empathie und Kommunikationsfähigkeiten'
        ],
        skills: [
          'Patientenbewertung und Versorgungsplanung',
          'Medikamentenverabreichung',
          'Wundversorgung und Verbandswechsel',
          'Patientenaufklärung und Gesundheitsförderung',
          'Elektronische Gesundheitsakten (EHR) Systeme',
          'Kritisches Denken und klinische Urteilsfähigkeit',
          'Interdisziplinäre Zusammenarbeit'
        ],
        whyGood: [
          'Klare Struktur, die klinische Kompetenzen hervorhebt',
          'Betont patientenzentrierten Versorgungsansatz',
          'Zeigt Fortschritt von Verantwortlichkeiten und Fähigkeiten',
          'Demonstriert Engagement für berufliche Entwicklung',
          'ATS-freundliches Format gewährleistet Sichtbarkeit für Personalvermittler'
        ]
      },
      it: {
        name: 'Infermiere',
        slug: 'infermiere',
        description: 'L\'infermieristica è una professione focalizzata sulla cura del paziente, la promozione della salute e il sostegno a individui e famiglie attraverso le sfide sanitarie. Gli infermieri lavorano in vari contesti, inclusi ospedali, cliniche, centri sanitari comunitari e assistenza domiciliare.',
        tips: [
          'Evidenzia la tua esperienza clinica e le competenze di assistenza al paziente',
          'Enfatizza certificazioni e formazione continua',
          'Mostra la tua capacità di lavorare in ambienti di squadra',
          'Includi qualsiasi formazione specializzata o aree di competenza',
          'Dimostra empatia e competenze comunicative'
        ],
        skills: [
          'Valutazione del paziente e pianificazione dell\'assistenza',
          'Somministrazione di farmaci',
          'Cura delle ferite e cambio delle medicazioni',
          'Educazione del paziente e promozione della salute',
          'Sistemi di cartelle cliniche elettroniche (EHR)',
          'Pensiero critico e giudizio clinico',
          'Collaborazione interdisciplinare'
        ],
        whyGood: [
          'Struttura chiara che evidenzia le competenze cliniche',
          'Enfatizza l\'approccio di assistenza centrato sul paziente',
          'Mostra la progressione di responsabilità e competenze',
          'Dimostra impegno per lo sviluppo professionale',
          'Formato compatibile con ATS garantisce visibilità ai reclutatori'
        ]
      },
      pl: {
        name: 'Pielęgniarka/Pielęgniarz',
        slug: 'pielegniarka',
        description: 'Pielęgniarstwo to zawód skupiony na opiece nad pacjentem, promocji zdrowia i wspieraniu osób oraz rodzin w wyzwaniach zdrowotnych. Pielęgniarki pracują w różnych środowiskach, w tym w szpitalach, klinikach, ośrodkach zdrowia społecznego i opiece domowej.',
        tips: [
          'Podkreśl swoje doświadczenie kliniczne i umiejętności opieki nad pacjentem',
          'Podkreśl certyfikaty i kształcenie ustawiczne',
          'Pokaż swoją zdolność do pracy w środowiskach zespołowych',
          'Uwzględnij wszelkie specjalistyczne szkolenia lub obszary wiedzy',
          'Wykazuj empatię i umiejętności komunikacyjne'
        ],
        skills: [
          'Ocena pacjenta i planowanie opieki',
          'Podawanie leków',
          'Opieka nad ranami i zmiana opatrunków',
          'Edukacja pacjenta i promocja zdrowia',
          'Systemy elektronicznych kart zdrowia (EHR)',
          'Myślenie krytyczne i osąd kliniczny',
          'Współpraca interdyscyplinarna'
        ],
        whyGood: [
          'Jasna struktura podkreślająca kompetencje kliniczne',
          'Kładzie nacisk na podejście skoncentrowane na pacjencie',
          'Pokazuje postęp odpowiedzialności i umiejętności',
          'Wykazuje zaangażowanie w rozwój zawodowy',
          'Format przyjazny dla ATS zapewnia widoczność dla rekruterów'
        ]
      },
      ro: {
        name: 'Asistent Medical',
        slug: 'asistent-medical',
        description: 'Asistența medicală este o profesie axată pe îngrijirea pacienților, promovarea sănătății și sprijinirea persoanelor și familiilor în fața provocărilor de sănătate. Asistenții medicali lucrează în diverse medii, inclusiv spitale, clinici, centre de sănătate comunitară și îngrijire la domiciliu.',
        tips: [
          'Evidențiază experiența ta clinică și abilitățile de îngrijire a pacienților',
          'Subliniază certificările și educația continuă',
          'Arată capacitatea ta de a lucra în medii de echipă',
          'Include orice formare specializată sau domenii de expertiză',
          'Demonstrează empatie și abilități de comunicare'
        ],
        skills: [
          'Evaluarea pacienților și planificarea îngrijirii',
          'Administrarea medicamentelor',
          'Îngrijirea rănilor și schimbarea pansamentelor',
          'Educația pacienților și promovarea sănătății',
          'Sisteme de înregistrare electronică a sănătății (EHR)',
          'Gândire critică și judecată clinică',
          'Colaborare interdisciplinară'
        ],
        whyGood: [
          'Structură clară care evidențiază competențele clinice',
          'Subliniază abordarea centrată pe pacient',
          'Arată progresia responsabilităților și abilităților',
          'Demonstrează angajamentul față de dezvoltarea profesională',
          'Format compatibil cu ATS asigură vizibilitatea pentru recrutori'
        ]
      },
      hu: {
        name: 'Ápoló',
        slug: 'apolo',
        description: 'Az ápolás egy olyan szakma, amely a betegellátásra, az egészségpromócióra és az egyének és családok támogatására összpontosít az egészségi kihívásokkal szemben. Az ápolók különböző helyszíneken dolgoznak, beleértve a kórházakat, klinikákat, közösségi egészségügyi központokat és a házi ellátást.',
        tips: [
          'Hangsúlyozza a klinikai tapasztalatát és a betegellátási készségeit',
          'Kiemeli a tanúsítványokat és a folyamatos képzést',
          'Mutassa be csapatmunkában való képességét',
          'Tartalmazza a szakértői képzéseket vagy szakértelmi területeket',
          'Mutassa be az empátiát és a kommunikációs készségeket'
        ],
        skills: [
          'Betegértékelés és ellátási tervezés',
          'Gyógyszeradagolás',
          'Sebápolás és kötéscsere',
          'Betegoktatás és egészségpromóció',
          'Elektronikus egészségügyi nyilvántartások (EHR) rendszerek',
          'Kritikus gondolkodás és klinikai ítélet',
          'Interdiszciplináris együttműködés'
        ],
        whyGood: [
          'Világos struktúra, amely kiemeli a klinikai kompetenciákat',
          'Hangsúlyozza a betegközpontú ellátási megközelítést',
          'Mutatja a felelősségek és készségek fejlődését',
          'Bebizonyítja a szakmai fejlesztésre való elkötelezettséget',
          'ATS-barát formátum biztosítja a láthatóságot a toborzók számára'
        ]
      },
      el: {
        name: 'Νοσηλευτής/Νοσηλεύτρια',
        slug: 'nosileutis',
        description: 'Η νοσηλεία είναι ένα επάγγελμα που επικεντρώνεται στη φροντίδα ασθενών, την προώθηση της υγείας και την υποστήριξη ατόμων και οικογενειών μέσα από προκλήσεις υγείας. Οι νοσηλευτές εργάζονται σε διάφορες ρυθμίσεις, συμπεριλαμβανομένων νοσοκομείων, κλινικών, κέντρων κοινωνικής υγείας και οικιακής φροντίδας.',
        tips: [
          'Επισημάνετε την κλινική σας εμπειρία και τις δεξιότητες φροντίδας ασθενών',
          'Τονίστε τις πιστοποιήσεις και τη συνεχή εκπαίδευση',
          'Δείξτε την ικανότητά σας να εργάζεστε σε ομαδικά περιβάλλοντα',
          'Συμπεριλάβετε οποιαδήποτε εξειδικευμένη εκπαίδευση ή τομείς εμπειρίας',
          'Αποδείξτε την ενσυναίσθηση και τις δεξιότητες επικοινωνίας'
        ],
        skills: [
          'Αξιολόγηση ασθενών και σχεδιασμός φροντίδας',
          'Χορήγηση φαρμάκων',
          'Φροντίδα πληγών και αλλαγή επιδέσμων',
          'Εκπαίδευση ασθενών και προώθηση υγείας',
          'Συστήματα ηλεκτρονικών ιατρικών φακέλων (EHR)',
          'Κριτική σκέψη και κλινική κρίση',
          'Διαθεματική συνεργασία'
        ],
        whyGood: [
          'Σαφής δομή που επισημαίνει τις κλινικές ικανότητες',
          'Τονίζει την προσέγγιση φροντίδας με επίκεντρο τον ασθενή',
          'Δείχνει την πρόοδο των ευθυνών και των δεξιοτήτων',
          'Αποδεικνύει την αφοσίωση στην επαγγελματική ανάπτυξη',
          'Μορφή συμβατή με ATS εξασφαλίζει ορατότητα στους recruiters'
        ]
      },
      cs: {
        name: 'Zdravotní Sestra/Bratr',
        slug: 'zdravotni-sestra',
        description: 'Ošetřovatelství je profese zaměřená na péči o pacienty, podporu zdraví a podporu jednotlivců a rodin při zdravotních výzvách. Zdravotní sestry pracují v různých prostředích, včetně nemocnic, klinik, komunitních zdravotních center a domácí péče.',
        tips: [
          'Zdůrazněte svou klinickou zkušenost a dovednosti v péči o pacienty',
          'Zdůrazněte certifikace a další vzdělávání',
          'Ukažte svou schopnost pracovat v týmovém prostředí',
          'Zahrňte jakékoli specializované školení nebo oblasti odbornosti',
          'Prokažte empatii a komunikační dovednosti'
        ],
        skills: [
          'Hodnocení pacientů a plánování péče',
          'Podávání léků',
          'Péče o rány a výměna obvazů',
          'Vzdělávání pacientů a podpora zdraví',
          'Systémy elektronických zdravotních záznamů (EHR)',
          'Kritické myšlení a klinický úsudek',
          'Mezioborová spolupráce'
        ],
        whyGood: [
          'Jasná struktura, která zdůrazňuje klinické kompetence',
          'Zdůrazňuje přístup zaměřený na pacienta',
          'Ukazuje pokrok odpovědností a dovedností',
          'Prokazuje závazek k profesnímu rozvoji',
          'Formát kompatibilní s ATS zajišťuje viditelnost pro náboráře'
        ]
      },
      pt: {
        name: 'Enfermeiro/Enfermeira',
        slug: 'enfermeiro',
        description: 'A enfermagem é uma profissão focada no cuidado ao paciente, promoção da saúde e apoio a indivíduos e famílias diante de desafios de saúde. Os enfermeiros trabalham em diversos ambientes, incluindo hospitais, clínicas, centros de saúde comunitários e cuidados domiciliares.',
        tips: [
          'Destaque sua experiência clínica e habilidades de cuidado ao paciente',
          'Enfatize certificações e educação continuada',
          'Mostre sua capacidade de trabalhar em ambientes de equipe',
          'Inclua qualquer treinamento especializado ou áreas de expertise',
          'Demonstre empatia e habilidades de comunicação'
        ],
        skills: [
          'Avaliação do paciente e planejamento de cuidados',
          'Administração de medicamentos',
          'Cuidado de feridas e troca de curativos',
          'Educação do paciente e promoção da saúde',
          'Sistemas de prontuário eletrônico (EHR)',
          'Pensamento crítico e julgamento clínico',
          'Colaboração interdisciplinar'
        ],
        whyGood: [
          'Estrutura clara que destaca competências clínicas',
          'Enfatiza abordagem de cuidado centrada no paciente',
          'Mostra progressão de responsabilidades e habilidades',
          'Demonstra compromisso com desenvolvimento profissional',
          'Formato compatível com ATS garante visibilidade para recrutadores'
        ]
      },
      sv: {
        name: 'Sjuksköterska',
        slug: 'sjukvardskare',
        description: 'Omvårdnad är ett yrke som fokuserar på patientsvård, hälsofrämjande och stöd till individer och familjer genom hälsoförändringar. Sjuksköterskor arbetar i olika miljöer, inklusive sjukhus, kliniker, samhällshälsocentraler och hemsjukvård.',
        tips: [
          'Framhäv din kliniska erfarenhet och patientsvårdsfärdigheter',
          'Betona certifieringar och fortbildning',
          'Visa din förmåga att arbeta i teammiljöer',
          'Inkludera eventuell specialiserad utbildning eller expertområden',
          'Visa empati och kommunikationsfärdigheter'
        ],
        skills: [
          'Patientbedömning och vårdplanering',
          'Läkemedelsadministration',
          'Sårvård och förbandsbyten',
          'Patientutbildning och hälsofrämjande',
          'Elektroniska journaler (EHR) system',
          'Kritiskt tänkande och kliniskt omdöme',
          'Tvärvetenskapligt samarbete'
        ],
        whyGood: [
          'Tydlig struktur som framhäver kliniska kompetenser',
          'Betonar patientcentrerad vårdansats',
          'Visar progression av ansvar och färdigheter',
          'Visar engagemang för professionell utveckling',
          'ATS-vänligt format säkerställer synlighet för rekryterare'
        ]
      },
      bg: {
        name: 'Медицинска Сестра',
        slug: 'medicinska-sestra',
        description: 'Сестринството е професия, фокусирана върху грижите за пациенти, насърчаване на здравето и подкрепа на индивиди и семейства при здравни предизвикателства. Медицинските сестри работят в различни среди, включително болници, клиники, обществени здравни центрове и домашни грижи.',
        tips: [
          'Подчертайте клиничния си опит и уменията за грижа за пациенти',
          'Акцентирайте върху сертификати и непрекъснато обучение',
          'Покажете способността си да работите в екипни среди',
          'Включете всяка специализирана подготовка или области на експертиза',
          'Демонстрирайте емпатия и комуникативни умения'
        ],
        skills: [
          'Оценка на пациенти и планиране на грижи',
          'Администриране на лекарства',
          'Грижа за рани и смяна на превръзки',
          'Образование на пациенти и насърчаване на здравето',
          'Системи за електронни здравни записи (EHR)',
          'Критично мислене и клинична преценка',
          'Междисциплинарно сътрудничество'
        ],
        whyGood: [
          'Ясна структура, която подчертава клиничните компетенции',
          'Акцентира върху подхода, центриран върху пациента',
          'Показва прогресия на отговорности и умения',
          'Демонстрира ангажираност към професионално развитие',
          'Формат, съвместим с ATS, осигурява видимост за набиращите персонал'
        ]
      },
      da: {
        name: 'Sygeplejerske',
        slug: 'sygeplejerske',
        description: 'Sygepleje er et fag, der fokuserer på patientomsorg, sundhedsfremme og støtte til enkeltpersoner og familier gennem sundhedsudfordringer. Sygeplejersker arbejder i forskellige miljøer, herunder hospitaler, klinikker, samfundssundhedscentre og hjemmepleje.',
        tips: [
          'Fremhæv din kliniske erfaring og patientomsorgsfærdigheder',
          'Fremhæv certificeringer og videreuddannelse',
          'Vis din evne til at arbejde i teammiljøer',
          'Inkluder eventuel specialiseret træning eller ekspertområder',
          'Demonstrer empati og kommunikationsfærdigheder'
        ],
        skills: [
          'Patientvurdering og omsorgsplanlægning',
          'Medicinadministration',
          'Sårpleje og forbindinger',
          'Patientuddannelse og sundhedsfremme',
          'Elektroniske sundhedsjournaler (EHR) systemer',
          'Kritisk tænkning og klinisk dømmekraft',
          'Tværfagligt samarbejde'
        ],
        whyGood: [
          'Tydelig struktur, der fremhæver kliniske kompetencer',
          'Fremhæver patientcentreret omsorgstilgang',
          'Viser progression af ansvar og færdigheder',
          'Demonstrerer engagement i professionel udvikling',
          'ATS-venligt format sikrer synlighed for rekruttere'
        ]
      },
      fi: {
        name: 'Sairaanhoitaja',
        slug: 'sairaanhoitaja',
        description: 'Sairaanhoito on ammatti, joka keskittyy potilashoitoon, terveyden edistämiseen ja yksilöiden ja perheiden tukemiseen terveyshaasteiden kautta. Sairaanhoitajat työskentelevät eri ympäristöissä, mukaan lukien sairaalat, klinikat, yhteisöterveyskeskukset ja kotisairaanhoito.',
        tips: [
          'Korosta kliinistä kokemustasi ja potilashoidon taitoja',
          'Korosta sertifikaatteja ja täydennyskoulutusta',
          'Näytä kykyäsi työskennellä tiimiyhteisöissä',
          'Sisällytä erikoistuneita koulutuksia tai asiantuntemuksen alueita',
          'Näytä empatiaa ja viestintätaitoja'
        ],
        skills: [
          'Potilasarviointi ja hoidon suunnittelu',
          'Lääkkeiden antaminen',
          'Haavahoito ja siteiden vaihto',
          'Potilaskoulutus ja terveyden edistäminen',
          'Sähköiset terveysrekisterit (EHR) järjestelmät',
          'Kriittinen ajattelu ja kliininen arvostelukyky',
          'Tieteidenvälinen yhteistyö'
        ],
        whyGood: [
          'Selkeä rakenne, joka korostaa kliinisiä kompetensseja',
          'Korostaa potilaslähtöistä hoitoa',
          'Näyttää vastuiden ja taitojen kehityksen',
          'Näyttää sitoutumisen ammatilliseen kehitykseen',
          'ATS-yhteensopiva muoto varmistaa näkyvyyden rekrytoijille'
        ]
      },
      sk: {
        name: 'Zdravotná Sestra/Brat',
        slug: 'zdravotna-sestra',
        description: 'Ošetrovateľstvo je profesia zameraná na starostlivosť o pacientov, podporu zdravia a podporu jednotlivcov a rodín pri zdravotných výzvach. Zdravotné sestry pracujú v rôznych prostrediach, vrátane nemocníc, kliník, komunitných zdravotných centier a domácej starostlivosti.',
        tips: [
          'Zdôraznite svoju klinickú skúsenosť a zručnosti v starostlivosti o pacientov',
          'Zdôraznite certifikáty a ďalšie vzdelávanie',
          'Ukážte svoju schopnosť pracovať v tímovom prostredí',
          'Zahrňte akékoľvek špecializované školenie alebo oblasti odbornosti',
          'Preukážte empatiu a komunikačné zručnosti'
        ],
        skills: [
          'Hodnotenie pacientov a plánovanie starostlivosti',
          'Podávanie liekov',
          'Starostlivosť o rany a výmena obväzov',
          'Vzdelávanie pacientov a podpora zdravia',
          'Systémy elektronických zdravotných záznamov (EHR)',
          'Kritické myslenie a klinický úsudok',
          'Medziodborová spolupráca'
        ],
        whyGood: [
          'Jasná štruktúra, ktorá zdôrazňuje klinické kompetencie',
          'Zdôrazňuje prístup zameraný na pacienta',
          'Ukazuje pokrok zodpovedností a zručností',
          'Preukazuje záväzok k profesionálnemu rozvoju',
          'Formát kompatibilný s ATS zabezpečuje viditeľnosť pre náborárov'
        ]
      },
      no: {
        name: 'Sykepleier',
        slug: 'sykepleier',
        description: 'Sykepleie er et yrke som fokuserer på pasientomsorg, helsefremming og støtte til enkeltpersoner og familier gjennom helseutfordringer. Sykepleiere arbeider i ulike miljøer, inkludert sykehus, klinikker, samfunnshelsesentre og hjemmesykepleie.',
        tips: [
          'Fremhev din kliniske erfaring og pasientomsorgsferdigheter',
          'Fremhev sertifiseringer og videreutdanning',
          'Vis din evne til å arbeide i teammiljøer',
          'Inkluder eventuell spesialisert opplæring eller ekspertområder',
          'Demonstrer empati og kommunikasjonsferdigheter'
        ],
        skills: [
          'Pasientvurdering og omsorgsplanlegging',
          'Medisinadministrasjon',
          'Sårpleie og forbindinger',
          'Pasientutdanning og helsefremming',
          'Elektroniske helsejournaler (EHR) systemer',
          'Kritisk tenkning og klinisk dømmekraft',
          'Tverrfaglig samarbeid'
        ],
        whyGood: [
          'Tydelig struktur som fremhever kliniske kompetanser',
          'Fremhever pasientorientert omsorgstilnærming',
          'Viser progresjon av ansvar og ferdigheter',
          'Demonstrerer engasjement for profesjonell utvikling',
          'ATS-vennlig format sikrer synlighet for rekruttere'
        ]
      },
      hr: {
        name: 'Medicinska Sestra/Brat',
        slug: 'medicinska-sestra',
        description: 'Medicinska njega je profesija usmjerena na skrb o pacijentima, promicanje zdravlja i podršku pojedincima i obiteljima kroz zdravstvene izazove. Medicinske sestre rade u različitim okruženjima, uključujući bolnice, klinike, centra za zdravlje zajednice i kućnu njegu.',
        tips: [
          'Istaknite svoje kliničko iskustvo i vještine skrbi o pacijentima',
          'Naglasite certifikate i kontinuirano obrazovanje',
          'Pokažite svoju sposobnost rada u timskim okruženjima',
          'Uključite bilo koju specijaliziranu obuku ili područja stručnosti',
          'Pokažite empatiju i komunikacijske vještine'
        ],
        skills: [
          'Procjena pacijenata i planiranje skrbi',
          'Primjena lijekova',
          'Njega rana i zamjena zavoja',
          'Edukacija pacijenata i promicanje zdravlja',
          'Sustavi elektroničkih zdravstvenih zapisa (EHR)',
          'Kritičko razmišljanje i klinička prosudba',
          'Interdisciplinarna suradnja'
        ],
        whyGood: [
          'Jasna struktura koja ističe kliničke kompetencije',
          'Naglašava pristup usmjeren na pacijenta',
          'Prikazuje napredak odgovornosti i vještina',
          'Pokazuje predanost profesionalnom razvoju',
          'Format kompatibilan s ATS osigurava vidljivost za regrutere'
        ]
      },
      sr: {
        name: 'Медицинска Сестра',
        slug: 'medicinska-sestra',
        description: 'Медицинска нега је професија усмерена на бригу о пацијентима, промоцију здравља и подршку појединцима и породицама кроз здравствене изазове. Медицинске сестре раде у различитим окружењима, укључујући болнице, клинике, центре за здравље заједнице и кућну негу.',
        tips: [
          'Истакните своје клиничко искуство и вештине бриге о пацијентима',
          'Нагласите сертификате и континуирано образовање',
          'Покажите своју способност рада у тимским окружењима',
          'Укључите било коју специјализовану обуку или области стручности',
          'Покажите емпатију и комуникационе вештине'
        ],
        skills: [
          'Процена пацијената и планирање бриге',
          'Примена лекова',
          'Нега рана и замена завоја',
          'Едукација пацијената и промоција здравља',
          'Системи електронских здравствених записа (EHR)',
          'Критичко размишљање и клиничка просуда',
          'Интердисциплинарна сарадња'
        ],
        whyGood: [
          'Јасна структура која истиче клиничке компетенције',
          'Наглашава приступ усмерен на пацијента',
          'Приказује напредак одговорности и вештина',
          'Показује посвећеност професионалном развоју',
          'Формат компатибилан са ATS осигурава видљивост за регрутере'
        ]
      }
    }
  },
  // Add more professions here - I'll add a few key ones
  {
    id: 'software-developer',
    category: 'technology',
    translations: {
      en: {
        name: 'Software Developer',
        slug: 'software-developer',
        description: 'Software developers design, build, and maintain applications and systems. They work with programming languages, frameworks, and tools to create solutions that meet business and user needs.',
        tips: [
          'Highlight your technical skills and programming languages',
          'Showcase projects and their impact',
          'Emphasize problem-solving abilities',
          'Include relevant certifications and education',
          'Demonstrate collaboration and teamwork'
        ],
        skills: [
          'Programming languages (JavaScript, Python, Java, etc.)',
          'Software development methodologies (Agile, Scrum)',
          'Version control systems (Git)',
          'Database design and management',
          'API development and integration',
          'Testing and debugging',
          'Code review and collaboration'
        ],
        whyGood: [
          'Clear technical skills section',
          'Project portfolio demonstrates practical experience',
          'Shows continuous learning and adaptation',
          'ATS-friendly keywords for technical roles',
          'Highlights both technical and soft skills'
        ]
      },
      nl: {
        name: 'Software Ontwikkelaar',
        slug: 'software-ontwikkelaar',
        description: 'Software ontwikkelaars ontwerpen, bouwen en onderhouden applicaties en systemen. Ze werken met programmeertalen, frameworks en tools om oplossingen te creëren die voldoen aan bedrijfs- en gebruikersbehoeften.',
        tips: [
          'Benadruk je technische vaardigheden en programmeertalen',
          'Toon projecten en hun impact',
          'Leg nadruk op probleemoplossend vermogen',
          'Vermeld relevante certificeringen en opleiding',
          'Demonstreer samenwerking en teamwork'
        ],
        skills: [
          'Programmeertalen (JavaScript, Python, Java, etc.)',
          'Software ontwikkelingsmethodologieën (Agile, Scrum)',
          'Versiebeheersystemen (Git)',
          'Database ontwerp en beheer',
          'API ontwikkeling en integratie',
          'Testen en debuggen',
          'Code review en samenwerking'
        ],
        whyGood: [
          'Duidelijke technische vaardigheden sectie',
          'Projectportfolio toont praktische ervaring',
          'Toont continu leren en aanpassing',
          'ATS-vriendelijke zoekwoorden voor technische rollen',
          'Benadrukt zowel technische als zachte vaardigheden'
        ]
      },
      // Add other languages for software developer...
      fr: {
        name: 'Développeur Logiciel',
        slug: 'developpeur-logiciel',
        description: 'Les développeurs logiciels conçoivent, construisent et maintiennent des applications et systèmes. Ils travaillent avec des langages de programmation, frameworks et outils pour créer des solutions qui répondent aux besoins des entreprises et des utilisateurs.',
        tips: [
          'Mettez en avant vos compétences techniques et langages de programmation',
          'Présentez des projets et leur impact',
          'Soulignez vos capacités de résolution de problèmes',
          'Incluez les certifications et formations pertinentes',
          'Démontrez la collaboration et le travail d\'équipe'
        ],
        skills: [
          'Langages de programmation (JavaScript, Python, Java, etc.)',
          'Méthodologies de développement logiciel (Agile, Scrum)',
          'Systèmes de contrôle de version (Git)',
          'Conception et gestion de bases de données',
          'Développement et intégration d\'API',
          'Tests et débogage',
          'Revue de code et collaboration'
        ],
        whyGood: [
          'Section claire des compétences techniques',
          'Portfolio de projets démontre une expérience pratique',
          'Montre un apprentissage et une adaptation continus',
          'Mots-clés compatibles ATS pour les rôles techniques',
          'Met en évidence les compétences techniques et relationnelles'
        ]
      },
      es: {
        name: 'Desarrollador de Software',
        slug: 'desarrollador-software',
        description: 'Los desarrolladores de software diseñan, construyen y mantienen aplicaciones y sistemas. Trabajan con lenguajes de programación, frameworks y herramientas para crear soluciones que satisfagan las necesidades empresariales y de usuarios.',
        tips: [
          'Destaca tus habilidades técnicas y lenguajes de programación',
          'Muestra proyectos y su impacto',
          'Enfatiza habilidades de resolución de problemas',
          'Incluye certificaciones y educación relevantes',
          'Demuestra colaboración y trabajo en equipo'
        ],
        skills: [
          'Lenguajes de programación (JavaScript, Python, Java, etc.)',
          'Metodologías de desarrollo de software (Agile, Scrum)',
          'Sistemas de control de versiones (Git)',
          'Diseño y gestión de bases de datos',
          'Desarrollo e integración de API',
          'Pruebas y depuración',
          'Revisión de código y colaboración'
        ],
        whyGood: [
          'Sección clara de habilidades técnicas',
          'Portafolio de proyectos demuestra experiencia práctica',
          'Muestra aprendizaje y adaptación continuos',
          'Palabras clave compatibles con ATS para roles técnicos',
          'Destaca habilidades técnicas y blandas'
        ]
      },
      de: {
        name: 'Softwareentwickler',
        slug: 'softwareentwickler',
        description: 'Softwareentwickler entwerfen, bauen und warten Anwendungen und Systeme. Sie arbeiten mit Programmiersprachen, Frameworks und Tools, um Lösungen zu erstellen, die Geschäfts- und Benutzeranforderungen erfüllen.',
        tips: [
          'Heben Sie Ihre technischen Fähigkeiten und Programmiersprachen hervor',
          'Zeigen Sie Projekte und deren Auswirkungen',
          'Betonen Sie Problemlösungsfähigkeiten',
          'Fügen Sie relevante Zertifizierungen und Ausbildung hinzu',
          'Demonstrieren Sie Zusammenarbeit und Teamarbeit'
        ],
        skills: [
          'Programmiersprachen (JavaScript, Python, Java, etc.)',
          'Softwareentwicklungsmethodologien (Agile, Scrum)',
          'Versionskontrollsysteme (Git)',
          'Datenbankdesign und -verwaltung',
          'API-Entwicklung und Integration',
          'Tests und Debugging',
          'Code-Review und Zusammenarbeit'
        ],
        whyGood: [
          'Klare Sektion für technische Fähigkeiten',
          'Projektportfolio zeigt praktische Erfahrung',
          'Zeigt kontinuierliches Lernen und Anpassung',
          'ATS-freundliche Schlüsselwörter für technische Rollen',
          'Hebt sowohl technische als auch soziale Fähigkeiten hervor'
        ]
      },
      // For brevity, I'll add minimal translations for remaining languages
      it: {
        name: 'Sviluppatore Software',
        slug: 'sviluppatore-software',
        description: 'Gli sviluppatori software progettano, costruiscono e mantengono applicazioni e sistemi. Lavorano con linguaggi di programmazione, framework e strumenti per creare soluzioni che soddisfano le esigenze aziendali e degli utenti.',
        tips: [
          'Evidenzia le tue competenze tecniche e linguaggi di programmazione',
          'Mostra progetti e il loro impatto',
          'Enfatizza capacità di problem solving',
          'Includi certificazioni e formazione rilevanti',
          'Dimostra collaborazione e lavoro di squadra'
        ],
        skills: [
          'Linguaggi di programmazione (JavaScript, Python, Java, etc.)',
          'Metodologie di sviluppo software (Agile, Scrum)',
          'Sistemi di controllo versione (Git)',
          'Progettazione e gestione database',
          'Sviluppo e integrazione API',
          'Test e debug',
          'Code review e collaborazione'
        ],
        whyGood: [
          'Sezione chiara delle competenze tecniche',
          'Portfolio di progetti dimostra esperienza pratica',
          'Mostra apprendimento e adattamento continui',
          'Parole chiave compatibili con ATS per ruoli tecnici',
          'Evidenzia sia competenze tecniche che soft skills'
        ]
      },
      pl: {
        name: 'Programista',
        slug: 'programista',
        description: 'Programiści projektują, budują i utrzymują aplikacje i systemy. Pracują z językami programowania, frameworkami i narzędziami, aby tworzyć rozwiązania spełniające potrzeby biznesowe i użytkowników.',
        tips: [
          'Podkreśl swoje umiejętności techniczne i języki programowania',
          'Pokaż projekty i ich wpływ',
          'Podkreśl zdolności rozwiązywania problemów',
          'Uwzględnij odpowiednie certyfikaty i wykształcenie',
          'Wykazuj współpracę i pracę zespołową'
        ],
        skills: [
          'Języki programowania (JavaScript, Python, Java, etc.)',
          'Metodologie rozwoju oprogramowania (Agile, Scrum)',
          'Systemy kontroli wersji (Git)',
          'Projektowanie i zarządzanie bazami danych',
          'Rozwój i integracja API',
          'Testowanie i debugowanie',
          'Przegląd kodu i współpraca'
        ],
        whyGood: [
          'Jasna sekcja umiejętności technicznych',
          'Portfolio projektów pokazuje praktyczne doświadczenie',
          'Pokazuje ciągłe uczenie się i adaptację',
          'Przyjazne dla ATS słowa kluczowe dla ról technicznych',
          'Podkreśla zarówno umiejętności techniczne, jak i miękkie'
        ]
      },
      ro: {
        name: 'Dezvoltator Software',
        slug: 'dezvoltator-software',
        description: 'Dezvoltatorii de software proiectează, construiesc și mențin aplicații și sisteme. Ei lucrează cu limbaje de programare, framework-uri și instrumente pentru a crea soluții care îndeplinesc nevoile de afaceri și ale utilizatorilor.',
        tips: [
          'Evidențiază abilitățile tale tehnice și limbajele de programare',
          'Prezintă proiecte și impactul lor',
          'Subliniază abilitățile de rezolvare a problemelor',
          'Include certificări și educație relevante',
          'Demonstrează colaborare și lucru în echipă'
        ],
        skills: [
          'Limbaje de programare (JavaScript, Python, Java, etc.)',
          'Metodologii de dezvoltare software (Agile, Scrum)',
          'Sisteme de control al versiunilor (Git)',
          'Proiectare și gestionare baze de date',
          'Dezvoltare și integrare API',
          'Testare și depanare',
          'Revizuire cod și colaborare'
        ],
        whyGood: [
          'Secțiune clară a abilităților tehnice',
          'Portofoliul de proiecte demonstrează experiență practică',
          'Arată învățare continuă și adaptare',
          'Cuvinte cheie compatibile cu ATS pentru roluri tehnice',
          'Evidențiază atât abilități tehnice, cât și soft skills'
        ]
      },
      hu: {
        name: 'Szoftverfejlesztő',
        slug: 'szoftverfejleszto',
        description: 'A szoftverfejlesztők terveznek, építenek és karbantartanak alkalmazásokat és rendszereket. Programozási nyelvekkel, keretrendszerekkel és eszközökkel dolgoznak, hogy megoldásokat hozzanak létre, amelyek megfelelnek az üzleti és felhasználói igényeknek.',
        tips: [
          'Hangsúlyozza műszaki készségeit és programozási nyelveit',
          'Mutatja be projekteit és azok hatását',
          'Kiemeli a problémamegoldó képességeit',
          'Tartalmazza a releváns tanúsítványokat és képzést',
          'Mutassa be az együttműködést és csapatmunkát'
        ],
        skills: [
          'Programozási nyelvek (JavaScript, Python, Java, etc.)',
          'Szoftverfejlesztési módszertanok (Agile, Scrum)',
          'Verziókezelő rendszerek (Git)',
          'Adatbázis tervezés és kezelés',
          'API fejlesztés és integráció',
          'Tesztelés és hibakeresés',
          'Kód áttekintés és együttműködés'
        ],
        whyGood: [
          'Világos műszaki készségek szekció',
          'Projektportfólió mutatja a gyakorlati tapasztalatot',
          'Mutassa a folyamatos tanulást és alkalmazkodást',
          'ATS-barát kulcsszavak technikai szerepkörökhöz',
          'Kiemeli mind a műszaki, mind a soft skill készségeket'
        ]
      },
      el: {
        name: 'Προγραμματιστής',
        slug: 'programmatistis',
        description: 'Οι προγραμματιστές λογισμικού σχεδιάζουν, χτίζουν και συντηρούν εφαρμογές και συστήματα. Εργάζονται με γλώσσες προγραμματισμού, frameworks και εργαλεία για να δημιουργήσουν λύσεις που πληρούν τις επιχειρηματικές και χρήστες ανάγκες.',
        tips: [
          'Επισημάνετε τις τεχνικές σας δεξιότητες και γλώσσες προγραμματισμού',
          'Παρουσιάστε έργα και τον αντίκτυπό τους',
          'Τονίστε ικανότητες επίλυσης προβλημάτων',
          'Συμπεριλάβετε σχετικές πιστοποιήσεις και εκπαίδευση',
          'Αποδείξτε συνεργασία και ομαδική εργασία'
        ],
        skills: [
          'Γλώσσες προγραμματισμού (JavaScript, Python, Java, etc.)',
          'Μεθοδολογίες ανάπτυξης λογισμικού (Agile, Scrum)',
          'Συστήματα ελέγχου εκδόσεων (Git)',
          'Σχεδιασμός και διαχείριση βάσεων δεδομένων',
          'Ανάπτυξη και ενσωμάτωση API',
          'Δοκιμή και αποσφαλμάτωση',
          'Ανασκόπηση κώδικα και συνεργασία'
        ],
        whyGood: [
          'Σαφής ενότητα τεχνικών δεξιοτήτων',
          'Το portfolio έργων αποδεικνύει πρακτική εμπειρία',
          'Δείχνει συνεχή μάθηση και προσαρμογή',
          'Συμβατές με ATS λέξεις-κλειδιά για τεχνικούς ρόλους',
          'Επισημαίνει τόσο τεχνικές όσο και soft skills'
        ]
      },
      cs: {
        name: 'Vývojář Software',
        slug: 'vyvojář-software',
        description: 'Vývojáři softwaru navrhují, stavějí a udržují aplikace a systémy. Pracují s programovacími jazyky, frameworky a nástroji k vytváření řešení, která splňují obchodní a uživatelské potřeby.',
        tips: [
          'Zdůrazněte své technické dovednosti a programovací jazyky',
          'Ukažte projekty a jejich dopad',
          'Zdůrazněte schopnosti řešení problémů',
          'Zahrňte relevantní certifikace a vzdělání',
          'Prokažte spolupráci a týmovou práci'
        ],
        skills: [
          'Programovací jazyky (JavaScript, Python, Java, etc.)',
          'Metodologie vývoje softwaru (Agile, Scrum)',
          'Systémy pro správu verzí (Git)',
          'Návrh a správa databází',
          'Vývoj a integrace API',
          'Testování a ladění',
          'Kontrola kódu a spolupráce'
        ],
        whyGood: [
          'Jasná sekce technických dovedností',
          'Portfolio projektů prokazuje praktické zkušenosti',
          'Ukazuje kontinuální učení a adaptaci',
          'Klíčová slova kompatibilní s ATS pro technické role',
          'Zdůrazňuje jak technické, tak i soft skills'
        ]
      },
      pt: {
        name: 'Desenvolvedor de Software',
        slug: 'desenvolvedor-software',
        description: 'Desenvolvedores de software projetam, constroem e mantêm aplicações e sistemas. Eles trabalham com linguagens de programação, frameworks e ferramentas para criar soluções que atendem às necessidades de negócios e usuários.',
        tips: [
          'Destaque suas habilidades técnicas e linguagens de programação',
          'Mostre projetos e seu impacto',
          'Enfatize habilidades de resolução de problemas',
          'Inclua certificações e educação relevantes',
          'Demonstre colaboração e trabalho em equipe'
        ],
        skills: [
          'Linguagens de programação (JavaScript, Python, Java, etc.)',
          'Metodologias de desenvolvimento de software (Agile, Scrum)',
          'Sistemas de controle de versão (Git)',
          'Design e gerenciamento de banco de dados',
          'Desenvolvimento e integração de API',
          'Testes e depuração',
          'Revisão de código e colaboração'
        ],
        whyGood: [
          'Seção clara de habilidades técnicas',
          'Portfólio de projetos demonstra experiência prática',
          'Mostra aprendizado e adaptação contínuos',
          'Palavras-chave compatíveis com ATS para funções técnicas',
          'Destaca habilidades técnicas e interpessoais'
        ]
      },
      sv: {
        name: 'Mjukvaruutvecklare',
        slug: 'mjukvaruutvecklare',
        description: 'Mjukvaruutvecklare designar, bygger och underhåller applikationer och system. De arbetar med programmeringsspråk, ramverk och verktyg för att skapa lösningar som uppfyller affärs- och användarbehov.',
        tips: [
          'Framhäv dina tekniska färdigheter och programmeringsspråk',
          'Visa projekt och deras inverkan',
          'Betona problemlösningsförmågor',
          'Inkludera relevanta certifieringar och utbildning',
          'Visa samarbete och teamwork'
        ],
        skills: [
          'Programmeringsspråk (JavaScript, Python, Java, etc.)',
          'Mjukvaruutvecklingsmetodologier (Agile, Scrum)',
          'Versionskontrollsystem (Git)',
          'Databasadesign och -hantering',
          'API-utveckling och integration',
          'Testning och felsökning',
          'Kodgranskning och samarbete'
        ],
        whyGood: [
          'Tydelig sektion för tekniska färdigheter',
          'Projektportfolio visar praktisk erfarenhet',
          'Visar kontinuerligt lärande och anpassning',
          'ATS-vänliga nyckelord för tekniska roller',
          'Framhäver både tekniska och mjuka färdigheter'
        ]
      },
      bg: {
        name: 'Софтуерен Разработчик',
        slug: 'softueren-razrabotchik',
        description: 'Софтуерните разработчици проектират, изграждат и поддържат приложения и системи. Те работят с програмни езици, frameworks и инструменти, за да създадат решения, които отговарят на бизнес и потребителски нужди.',
        tips: [
          'Подчертайте техническите си умения и програмни езици',
          'Покажете проекти и тяхното въздействие',
          'Акцентирайте върху способности за решаване на проблеми',
          'Включете съответни сертификати и образование',
          'Демонстрирайте сътрудничество и работа в екип'
        ],
        skills: [
          'Програмни езици (JavaScript, Python, Java, etc.)',
          'Методологии за разработка на софтуер (Agile, Scrum)',
          'Системи за контрол на версии (Git)',
          'Дизайн и управление на бази данни',
          'Разработка и интеграция на API',
          'Тестване и отстраняване на грешки',
          'Преглед на код и сътрудничество'
        ],
        whyGood: [
          'Ясна секция за технически умения',
          'Портфолио от проекти показва практически опит',
          'Показва непрекъснато учене и адаптация',
          'Съвместими с ATS ключови думи за технически роли',
          'Подчертава както технически, така и софт умения'
        ]
      },
      da: {
        name: 'Softwareudvikler',
        slug: 'softwareudvikler',
        description: 'Softwareudviklere designer, bygger og vedligeholder applikationer og systemer. De arbejder med programmeringssprog, frameworks og værktøjer til at skabe løsninger, der opfylder forretnings- og brugerbehov.',
        tips: [
          'Fremhæv dine tekniske færdigheder og programmeringssprog',
          'Vis projekter og deres indvirkning',
          'Fremhæv problemløsningsevner',
          'Inkluder relevante certificeringer og uddannelse',
          'Demonstrer samarbejde og teamwork'
        ],
        skills: [
          'Programmeringssprog (JavaScript, Python, Java, etc.)',
          'Softwareudviklingsmetodologier (Agile, Scrum)',
          'Versionskontrolsystemer (Git)',
          'Databasedesign og -forvaltning',
          'API-udvikling og integration',
          'Testning og fejlfinding',
          'Kodegennemgang og samarbejde'
        ],
        whyGood: [
          'Tydelig sektion for tekniske færdigheder',
          'Projektportfolio viser praktisk erfaring',
          'Visar kontinuerligt læring og tilpasning',
          'ATS-venlige nøgleord til tekniske roller',
          'Fremhæver både tekniske og bløde færdigheder'
        ]
      },
      fi: {
        name: 'Ohjelmistokehittäjä',
        slug: 'ohjelmistokehittaja',
        description: 'Ohjelmistokehittäjät suunnittelevat, rakentavat ja ylläpitävät sovelluksia ja järjestelmiä. He työskentelevät ohjelmointikielten, kehysten ja työkalujen kanssa luodakseen ratkaisuja, jotka täyttävät liiketoiminta- ja käyttäjätarpeet.',
        tips: [
          'Korosta tekniset taitosi ja ohjelmointikielet',
          'Näytä projektit ja niiden vaikutus',
          'Korosta ongelmanratkaisukykyjä',
          'Sisällytä asiaankuuluvat sertifikaatit ja koulutus',
          'Näytä yhteistyötä ja tiimityötä'
        ],
        skills: [
          'Ohjelmointikielet (JavaScript, Python, Java, etc.)',
          'Ohjelmistokehitysmetodologiat (Agile, Scrum)',
          'Versiohallintajärjestelmät (Git)',
          'Tietokantasuunnittelu ja -hallinta',
          'API-kehitys ja integraatio',
          'Testaus ja virheenkorjaus',
          'Koodikatselmu ja yhteistyö'
        ],
        whyGood: [
          'Selkeä osio teknisistä taidoista',
          'Projektisalkku näyttää käytännön kokemusta',
          'Näyttää jatkuvaa oppimista ja sopeutumista',
          'ATS-yhteensopivat avainsanat teknisille rooleille',
          'Korostaa sekä tekniset että pehmeät taidot'
        ]
      },
      sk: {
        name: 'Vývojár Softvéru',
        slug: 'vyvojár-softvéru',
        description: 'Vývojári softvéru navrhujú, stavajú a udržiavajú aplikácie a systémy. Pracujú s programovacími jazykmi, frameworkmi a nástrojmi na vytváranie riešení, ktoré spĺňajú obchodné a používateľské potreby.',
        tips: [
          'Zdôraznite svoje technické zručnosti a programovacie jazyky',
          'Ukážte projekty a ich dopad',
          'Zdôraznite schopnosti riešenia problémov',
          'Zahrňte relevantné certifikáty a vzdelanie',
          'Preukážte spoluprácu a tímovú prácu'
        ],
        skills: [
          'Programovacie jazyky (JavaScript, Python, Java, etc.)',
          'Metodológie vývoja softvéru (Agile, Scrum)',
          'Systémy na správu verzií (Git)',
          'Návrh a správa databáz',
          'Vývoj a integrácia API',
          'Testovanie a ladenie',
          'Kontrola kódu a spolupráca'
        ],
        whyGood: [
          'Jasná sekcia technických zručností',
          'Portfólio projektov preukazuje praktické skúsenosti',
          'Ukazuje kontinuálne učenie a adaptáciu',
          'Kľúčové slová kompatibilné s ATS pre technické role',
          'Zdôrazňuje ako technické, tak aj soft skills'
        ]
      },
      no: {
        name: 'Programvareutvikler',
        slug: 'programvareutvikler',
        description: 'Programvareutviklere designer, bygger og vedlikeholder applikasjoner og systemer. De arbeider med programmeringsspråk, rammeverk og verktøy for å skape løsninger som oppfyller forretnings- og brukerbehov.',
        tips: [
          'Fremhev dine tekniske ferdigheter og programmeringsspråk',
          'Vis prosjekter og deres innvirkning',
          'Fremhev problemløsningsevner',
          'Inkluder relevante sertifiseringer og utdanning',
          'Demonstrer samarbeid og teamwork'
        ],
        skills: [
          'Programmeringsspråk (JavaScript, Python, Java, etc.)',
          'Programvareutviklingsmetodologier (Agile, Scrum)',
          'Versjonskontrollsystemer (Git)',
          'Databasedesign og -forvaltning',
          'API-utvikling og integrasjon',
          'Testning og feilsøking',
          'Kodegjennomgang og samarbeid'
        ],
        whyGood: [
          'Tydelig seksjon for tekniske ferdigheter',
          'Prosjektportefølje viser praktisk erfaring',
          'Visar kontinuerlig læring og tilpasning',
          'ATS-vennlige nøkkelord for tekniske roller',
          'Fremhever både tekniske og myke ferdigheter'
        ]
      },
      hr: {
        name: 'Razvojni Programer',
        slug: 'razvojni-programer',
        description: 'Razvojni programeri dizajniraju, grade i održavaju aplikacije i sustave. Rade s programskim jezicima, okvirima i alatima za stvaranje rješenja koja zadovoljavaju poslovne i korisničke potrebe.',
        tips: [
          'Istaknite svoje tehničke vještine i programske jezike',
          'Pokažite projekte i njihov utjecaj',
          'Naglasite sposobnosti rješavanja problema',
          'Uključite relevantne certifikate i obrazovanje',
          'Pokažite suradnju i timski rad'
        ],
        skills: [
          'Programski jezici (JavaScript, Python, Java, etc.)',
          'Metodologije razvoja softvera (Agile, Scrum)',
          'Sustavi za kontrolu verzija (Git)',
          'Dizajn i upravljanje bazama podataka',
          'Razvoj i integracija API',
          'Testiranje i otklanjanje grešaka',
          'Pregled koda i suradnja'
        ],
        whyGood: [
          'Jasna sekcija tehničkih vještina',
          'Portfelj projekata pokazuje praktično iskustvo',
          'Prikazuje kontinuirano učenje i prilagodbu',
          'Kompatibilne s ATS ključne riječi za tehničke uloge',
          'Naglašava i tehničke i meke vještine'
        ]
      },
      sr: {
        name: 'Развојни Програмер',
        slug: 'razvojni-programer',
        description: 'Развојни програмери дизајнирају, граде и одржавају апликације и системе. Раде са програмским језицима, оквирима и алатима за стварање решења која задовољавају пословне и корисничке потребе.',
        tips: [
          'Истакните своје техничке вештине и програмске језике',
          'Покажите пројекте и њихов утицај',
          'Нагласите способности решавања проблема',
          'Укључите релевантне сертификате и образовање',
          'Покажите сарадњу и тимски рад'
        ],
        skills: [
          'Програмски језици (JavaScript, Python, Java, etc.)',
          'Методологије развоја софтвера (Agile, Scrum)',
          'Системи за контролу верзија (Git)',
          'Дизајн и управљање базама података',
          'Развој и интеграција API',
          'Тестирање и отклањање грешака',
          'Преглед кода и сарадња'
        ],
        whyGood: [
          'Јасна секција техничких вештина',
          'Портфељ пројеката показује практично искуство',
          'Приказује континуирано учење и прилагођавање',
          'Компатибилне са ATS кључне речи за техничке улоге',
          'Наглашава и техничке и меке вештине'
        ]
      }
    }
  },
  {
    id: 'teacher',
    category: 'education',
    translations: {
      en: {
        name: 'Teacher',
        slug: 'teacher',
        description: 'Teachers educate and inspire students across various subjects and age groups. They develop lesson plans, assess student progress, and create engaging learning environments that foster academic and personal growth.',
        tips: [
          'Highlight your teaching certifications and qualifications',
          'Emphasize classroom management and student engagement strategies',
          'Showcase innovative teaching methods and curriculum development',
          'Include professional development and continuing education',
          'Demonstrate impact through student outcomes and achievements'
        ],
        skills: [
          'Curriculum development and lesson planning',
          'Classroom management and discipline',
          'Student assessment and evaluation',
          'Differentiated instruction techniques',
          'Educational technology integration',
          'Parent and community communication',
          'Special education and inclusive practices'
        ],
        whyGood: [
          'Clear structure highlighting educational qualifications',
          'Emphasizes teaching experience and student outcomes',
          'Shows commitment to professional development',
          'Demonstrates ability to adapt to diverse learning needs',
          'ATS-friendly format with relevant educational keywords'
        ]
      },
      nl: {
        name: 'Leraar',
        slug: 'leraar',
        description: 'Leraren onderwijzen en inspireren studenten in verschillende vakken en leeftijdsgroepen. Ze ontwikkelen lesplannen, beoordelen de voortgang van studenten en creëren boeiende leeromgevingen die academische en persoonlijke groei bevorderen.',
        tips: [
          'Benadruk je onderwijsbevoegdheden en kwalificaties',
          'Leg nadruk op klasmanagement en strategieën voor betrokkenheid van studenten',
          'Toon innovatieve lesmethoden en curriculumontwikkeling',
          'Vermeld professionele ontwikkeling en bijscholing',
          'Demonstreer impact door studentresultaten en prestaties'
        ],
        skills: [
          'Curriculumontwikkeling en lesplanning',
          'Klasmanagement en discipline',
          'Studentbeoordeling en evaluatie',
          'Gedifferentieerde instructietechnieken',
          'Integratie van onderwijstechnologie',
          'Communicatie met ouders en gemeenschap',
          'Speciaal onderwijs en inclusieve praktijken'
        ],
        whyGood: [
          'Duidelijke structuur die onderwijsbevoegdheden benadrukt',
          'Legt nadruk op onderwijservaring en studentresultaten',
          'Toont toewijding aan professionele ontwikkeling',
          'Demonstreert vermogen om zich aan te passen aan diverse leerbehoeften',
          'ATS-vriendelijk formaat met relevante onderwijszoekwoorden'
        ]
      },
      fr: {
        name: 'Enseignant',
        slug: 'enseignant',
        description: 'Les enseignants éduquent et inspirent les élèves dans diverses matières et groupes d\'âge. Ils développent des plans de cours, évaluent les progrès des élèves et créent des environnements d\'apprentissage engageants qui favorisent la croissance académique et personnelle.',
        tips: [
          'Mettez en avant vos certifications et qualifications d\'enseignement',
          'Soulignez les stratégies de gestion de classe et d\'engagement des élèves',
          'Présentez des méthodes d\'enseignement innovantes et le développement de programmes',
          'Incluez le développement professionnel et la formation continue',
          'Démontrez l\'impact grâce aux résultats et réalisations des élèves'
        ],
        skills: [
          'Développement de programmes et planification de cours',
          'Gestion de classe et discipline',
          'Évaluation et notation des élèves',
          'Techniques d\'instruction différenciée',
          'Intégration de la technologie éducative',
          'Communication avec les parents et la communauté',
          'Éducation spécialisée et pratiques inclusives'
        ],
        whyGood: [
          'Structure claire mettant en évidence les qualifications éducatives',
          'Met l\'accent sur l\'expérience d\'enseignement et les résultats des élèves',
          'Montre l\'engagement envers le développement professionnel',
          'Démontre la capacité à s\'adapter aux divers besoins d\'apprentissage',
          'Format compatible ATS avec mots-clés éducatifs pertinents'
        ]
      },
      es: {
        name: 'Profesor',
        slug: 'profesor',
        description: 'Los profesores educan e inspiran a estudiantes en diversas materias y grupos de edad. Desarrollan planes de lección, evalúan el progreso de los estudiantes y crean entornos de aprendizaje atractivos que fomentan el crecimiento académico y personal.',
        tips: [
          'Destaca tus certificaciones y calificaciones de enseñanza',
          'Enfatiza estrategias de gestión del aula y participación estudiantil',
          'Muestra métodos de enseñanza innovadores y desarrollo curricular',
          'Incluye desarrollo profesional y educación continua',
          'Demuestra impacto a través de resultados y logros estudiantiles'
        ],
        skills: [
          'Desarrollo curricular y planificación de lecciones',
          'Gestión del aula y disciplina',
          'Evaluación y calificación de estudiantes',
          'Técnicas de instrucción diferenciada',
          'Integración de tecnología educativa',
          'Comunicación con padres y comunidad',
          'Educación especial y prácticas inclusivas'
        ],
        whyGood: [
          'Estructura clara que destaca calificaciones educativas',
          'Enfatiza experiencia docente y resultados estudiantiles',
          'Muestra compromiso con el desarrollo profesional',
          'Demuestra capacidad para adaptarse a diversas necesidades de aprendizaje',
          'Formato compatible con ATS con palabras clave educativas relevantes'
        ]
      },
      de: {
        name: 'Lehrer',
        slug: 'lehrer',
        description: 'Lehrer erziehen und inspirieren Schüler in verschiedenen Fächern und Altersgruppen. Sie entwickeln Unterrichtspläne, bewerten den Fortschritt der Schüler und schaffen ansprechende Lernumgebungen, die akademisches und persönliches Wachstum fördern.',
        tips: [
          'Heben Sie Ihre Lehrzertifizierungen und Qualifikationen hervor',
          'Betonen Sie Strategien für Klassenmanagement und Schülerengagement',
          'Zeigen Sie innovative Lehrmethoden und Lehrplanentwicklung',
          'Fügen Sie berufliche Entwicklung und Weiterbildung hinzu',
          'Demonstrieren Sie Wirkung durch Schülerergebnisse und Leistungen'
        ],
        skills: [
          'Lehrplanentwicklung und Unterrichtsplanung',
          'Klassenmanagement und Disziplin',
          'Schülerbewertung und -evaluierung',
          'Differenzierte Unterrichtstechniken',
          'Integration von Bildungstechnologie',
          'Kommunikation mit Eltern und Gemeinschaft',
          'Sonderpädagogik und inklusive Praktiken'
        ],
        whyGood: [
          'Klare Struktur, die pädagogische Qualifikationen hervorhebt',
          'Betont Unterrichtserfahrung und Schülerergebnisse',
          'Zeigt Engagement für berufliche Entwicklung',
          'Demonstriert Fähigkeit, sich an vielfältige Lernbedürfnisse anzupassen',
          'ATS-freundliches Format mit relevanten Bildungsschlüsselwörtern'
        ]
      },
      it: { name: 'Insegnante', slug: 'insegnante', description: 'Gli insegnanti educano e ispirano gli studenti in varie materie e fasce d\'età. Sviluppano piani di lezione, valutano i progressi degli studenti e creano ambienti di apprendimento coinvolgenti che favoriscono la crescita accademica e personale.', tips: ['Evidenzia le tue certificazioni e qualifiche di insegnamento', 'Enfatizza strategie di gestione della classe e coinvolgimento degli studenti', 'Mostra metodi di insegnamento innovativi e sviluppo del curriculum', 'Includi sviluppo professionale e formazione continua', 'Dimostra l\'impatto attraverso risultati e risultati degli studenti'], skills: ['Sviluppo del curriculum e pianificazione delle lezioni', 'Gestione della classe e disciplina', 'Valutazione e valutazione degli studenti', 'Tecniche di istruzione differenziata', 'Integrazione della tecnologia educativa', 'Comunicazione con genitori e comunità', 'Educazione speciale e pratiche inclusive'], whyGood: ['Struttura chiara che evidenzia le qualifiche educative', 'Enfatizza l\'esperienza di insegnamento e i risultati degli studenti', 'Mostra impegno per lo sviluppo professionale', 'Dimostra la capacità di adattarsi a diverse esigenze di apprendimento', 'Formato compatibile con ATS con parole chiave educative rilevanti'] },
      pl: { name: 'Nauczyciel', slug: 'nauczyciel', description: 'Nauczyciele edukują i inspirują uczniów w różnych przedmiotach i grupach wiekowych. Opracowują plany lekcji, oceniają postępy uczniów i tworzą angażujące środowiska uczenia się, które wspierają rozwój akademicki i osobisty.', tips: ['Podkreśl swoje certyfikaty i kwalifikacje nauczycielskie', 'Podkreśl strategie zarządzania klasą i zaangażowania uczniów', 'Pokaż innowacyjne metody nauczania i rozwój programu nauczania', 'Uwzględnij rozwój zawodowy i kształcenie ustawiczne', 'Wykazuj wpływ poprzez wyniki i osiągnięcia uczniów'], skills: ['Rozwój programu nauczania i planowanie lekcji', 'Zarządzanie klasą i dyscyplina', 'Ocena i ewaluacja uczniów', 'Techniki zróżnicowanej instrukcji', 'Integracja technologii edukacyjnej', 'Komunikacja z rodzicami i społecznością', 'Edukacja specjalna i praktyki włączające'], whyGood: ['Jasna struktura podkreślająca kwalifikacje edukacyjne', 'Kładzie nacisk na doświadczenie w nauczaniu i wyniki uczniów', 'Pokazuje zaangażowanie w rozwój zawodowy', 'Wykazuje zdolność dostosowania się do różnych potrzeb uczenia się', 'Format przyjazny dla ATS z odpowiednimi słowami kluczowymi edukacyjnymi'] },
      ro: { name: 'Profesor', slug: 'profesor', description: 'Profesorii educă și inspiră elevii în diverse materii și grupuri de vârstă. Ei dezvoltă planuri de lecție, evaluează progresul elevilor și creează medii de învățare captivante care favorizează creșterea academică și personală.', tips: ['Evidențiază certificările și calificările tale de predare', 'Subliniază strategiile de management al clasei și implicarea elevilor', 'Prezintă metode inovatoare de predare și dezvoltarea curriculumului', 'Include dezvoltare profesională și educație continuă', 'Demonstrează impactul prin rezultatele și realizările elevilor'], skills: ['Dezvoltarea curriculumului și planificarea lecțiilor', 'Managementul clasei și disciplina', 'Evaluarea și evaluarea elevilor', 'Tehnici de instruire diferențiată', 'Integrarea tehnologiei educaționale', 'Comunicarea cu părinții și comunitatea', 'Educația specială și practicile incluzive'], whyGood: ['Structură clară care evidențiază calificările educaționale', 'Subliniază experiența de predare și rezultatele elevilor', 'Arată angajamentul față de dezvoltarea profesională', 'Demonstrează capacitatea de a se adapta la diverse nevoi de învățare', 'Format compatibil cu ATS cu cuvinte cheie educaționale relevante'] },
      hu: { name: 'Tanár', slug: 'tanar', description: '', tips: [], skills: [], whyGood: [] },
      el: { name: 'Δάσκαλος', slug: 'daskalos', description: '', tips: [], skills: [], whyGood: [] },
      cs: { name: 'Učitel', slug: 'ucitel', description: '', tips: [], skills: [], whyGood: [] },
      pt: { name: 'Professor', slug: 'professor', description: '', tips: [], skills: [], whyGood: [] },
      sv: { name: 'Lärare', slug: 'larare', description: '', tips: [], skills: [], whyGood: [] },
      bg: { name: 'Учител', slug: 'uchitel', description: '', tips: [], skills: [], whyGood: [] },
      da: { name: 'Lærer', slug: 'laerer', description: '', tips: [], skills: [], whyGood: [] },
      fi: { name: 'Opettaja', slug: 'opettaja', description: '', tips: [], skills: [], whyGood: [] },
      sk: { name: 'Učiteľ', slug: 'ucitel', description: '', tips: [], skills: [], whyGood: [] },
      no: { name: 'Lærer', slug: 'laerer', description: '', tips: [], skills: [], whyGood: [] },
      hr: { name: 'Učitelj', slug: 'ucitelj', description: '', tips: [], skills: [], whyGood: [] },
      sr: { name: 'Учитељ', slug: 'ucitelj', description: '', tips: [], skills: [], whyGood: [] }
    }
  },
  {
    id: 'accountant',
    category: 'business',
    translations: {
      en: {
        name: 'Accountant',
        slug: 'accountant',
        description: 'Accountants manage financial records, prepare tax returns, and ensure compliance with financial regulations. They analyze financial data to help businesses make informed decisions and maintain accurate financial reporting.',
        tips: [
          'Highlight your accounting certifications (CPA, ACCA, etc.)',
          'Emphasize experience with accounting software and systems',
          'Showcase knowledge of tax regulations and compliance',
          'Include experience with financial analysis and reporting',
          'Demonstrate attention to detail and accuracy'
        ],
        skills: [
          'Financial accounting and bookkeeping',
          'Tax preparation and planning',
          'Financial statement analysis',
          'Accounting software (QuickBooks, SAP, etc.)',
          'Audit and compliance procedures',
          'Budgeting and forecasting',
          'Regulatory compliance and reporting'
        ],
        whyGood: [
          'Clear structure highlighting accounting qualifications',
          'Emphasizes technical skills and certifications',
          'Shows experience with relevant accounting software',
          'Demonstrates knowledge of financial regulations',
          'ATS-friendly format with industry-specific keywords'
        ]
      },
      nl: {
        name: 'Accountant',
        slug: 'accountant',
        description: 'Accountants beheren financiële administraties, bereiden belastingaangiften voor en zorgen voor naleving van financiële regelgeving. Ze analyseren financiële gegevens om bedrijven te helpen weloverwogen beslissingen te nemen en nauwkeurige financiële rapportage te behouden.',
        tips: [
          'Benadruk je accountancycertificeringen (CPA, ACCA, etc.)',
          'Leg nadruk op ervaring met boekhoudsoftware en systemen',
          'Toon kennis van belastingregelgeving en naleving',
          'Vermeld ervaring met financiële analyse en rapportage',
          'Demonstreer aandacht voor detail en nauwkeurigheid'
        ],
        skills: [
          'Financiële boekhouding en administratie',
          'Belastingvoorbereiding en -planning',
          'Financiële overzichtsanalyse',
          'Boekhoudsoftware (QuickBooks, SAP, etc.)',
          'Audit- en nalevingsprocedures',
          'Begroting en prognose',
          'Regelgevingsnaleving en rapportage'
        ],
        whyGood: [
          'Duidelijke structuur die accountancykwalificaties benadrukt',
          'Legt nadruk op technische vaardigheden en certificeringen',
          'Toont ervaring met relevante boekhoudsoftware',
          'Demonstreert kennis van financiële regelgeving',
          'ATS-vriendelijk formaat met branchespecifieke zoekwoorden'
        ]
      },
      fr: {
        name: 'Comptable',
        slug: 'comptable',
        description: 'Les comptables gèrent les registres financiers, préparent les déclarations fiscales et assurent la conformité aux réglementations financières. Ils analysent les données financières pour aider les entreprises à prendre des décisions éclairées et maintenir une comptabilité financière précise.',
        tips: [
          'Mettez en avant vos certifications comptables (CPA, ACCA, etc.)',
          'Soulignez l\'expérience avec les logiciels et systèmes comptables',
          'Présentez la connaissance des réglementations fiscales et de la conformité',
          'Incluez l\'expérience en analyse et reporting financier',
          'Démontrez l\'attention aux détails et la précision'
        ],
        skills: [
          'Comptabilité financière et tenue de livres',
          'Préparation et planification fiscale',
          'Analyse des états financiers',
          'Logiciels comptables (QuickBooks, SAP, etc.)',
          'Procédures d\'audit et de conformité',
          'Budgétisation et prévisions',
          'Conformité réglementaire et reporting'
        ],
        whyGood: [
          'Structure claire mettant en évidence les qualifications comptables',
          'Met l\'accent sur les compétences techniques et les certifications',
          'Montre l\'expérience avec les logiciels comptables pertinents',
          'Démontre la connaissance des réglementations financières',
          'Format compatible ATS avec mots-clés spécifiques à l\'industrie'
        ]
      },
      es: {
        name: 'Contador',
        slug: 'contador',
        description: 'Los contadores gestionan registros financieros, preparan declaraciones de impuestos y aseguran el cumplimiento de las regulaciones financieras. Analizan datos financieros para ayudar a las empresas a tomar decisiones informadas y mantener informes financieros precisos.',
        tips: [
          'Destaca tus certificaciones contables (CPA, ACCA, etc.)',
          'Enfatiza experiencia con software y sistemas contables',
          'Muestra conocimiento de regulaciones fiscales y cumplimiento',
          'Incluye experiencia con análisis y reportes financieros',
          'Demuestra atención al detalle y precisión'
        ],
        skills: [
          'Contabilidad financiera y teneduría de libros',
          'Preparación y planificación fiscal',
          'Análisis de estados financieros',
          'Software contable (QuickBooks, SAP, etc.)',
          'Procedimientos de auditoría y cumplimiento',
          'Presupuestación y pronósticos',
          'Cumplimiento regulatorio y reportes'
        ],
        whyGood: [
          'Estructura clara que destaca calificaciones contables',
          'Enfatiza habilidades técnicas y certificaciones',
          'Muestra experiencia con software contable relevante',
          'Demuestra conocimiento de regulaciones financieras',
          'Formato compatible con ATS con palabras clave específicas de la industria'
        ]
      },
      de: {
        name: 'Buchhalter',
        slug: 'buchhalter',
        description: 'Buchhalter verwalten Finanzunterlagen, erstellen Steuererklärungen und stellen die Einhaltung der Finanzvorschriften sicher. Sie analysieren Finanzdaten, um Unternehmen bei fundierten Entscheidungen zu helfen und genaue Finanzberichterstattung aufrechtzuerhalten.',
        tips: [
          'Heben Sie Ihre Buchhaltungszertifizierungen hervor (CPA, ACCA, etc.)',
          'Betonen Sie Erfahrung mit Buchhaltungssoftware und -systemen',
          'Zeigen Sie Kenntnisse der Steuervorschriften und Compliance',
          'Fügen Sie Erfahrung mit Finanzanalyse und Berichterstattung hinzu',
          'Demonstrieren Sie Aufmerksamkeit für Details und Genauigkeit'
        ],
        skills: [
          'Finanzbuchhaltung und Buchführung',
          'Steuervorbereitung und -planung',
          'Analyse von Jahresabschlüssen',
          'Buchhaltungssoftware (QuickBooks, SAP, etc.)',
          'Audit- und Compliance-Verfahren',
          'Budgetierung und Prognose',
          'Regulatorische Compliance und Berichterstattung'
        ],
        whyGood: [
          'Klare Struktur, die Buchhaltungsqualifikationen hervorhebt',
          'Betont technische Fähigkeiten und Zertifizierungen',
          'Zeigt Erfahrung mit relevanter Buchhaltungssoftware',
          'Demonstriert Kenntnisse der Finanzvorschriften',
          'ATS-freundliches Format mit branchenspezifischen Schlüsselwörtern'
        ]
      },
      it: { name: 'Contabile', slug: 'contabile', description: '', tips: [], skills: [], whyGood: [] },
      pl: { name: 'Księgowy', slug: 'ksiegowy', description: '', tips: [], skills: [], whyGood: [] },
      ro: { name: 'Contabil', slug: 'contabil', description: '', tips: [], skills: [], whyGood: [] },
      hu: { name: 'Könyvelő', slug: 'konyvelo', description: '', tips: [], skills: [], whyGood: [] },
      el: { name: 'Λογιστής', slug: 'logistis', description: '', tips: [], skills: [], whyGood: [] },
      cs: { name: 'Účetní', slug: 'ucetni', description: '', tips: [], skills: [], whyGood: [] },
      pt: { name: 'Contador', slug: 'contador', description: '', tips: [], skills: [], whyGood: [] },
      sv: { name: 'Revisor', slug: 'revisor', description: '', tips: [], skills: [], whyGood: [] },
      bg: { name: 'Счетоводител', slug: 'schetovoditel', description: '', tips: [], skills: [], whyGood: [] },
      da: { name: 'Revisor', slug: 'revisor', description: '', tips: [], skills: [], whyGood: [] },
      fi: { name: 'Kirjanpitäjä', slug: 'kirjanpitaja', description: '', tips: [], skills: [], whyGood: [] },
      sk: { name: 'Účtovník', slug: 'uctovnik', description: '', tips: [], skills: [], whyGood: [] },
      no: { name: 'Regnskapsfører', slug: 'regnskapsforer', description: '', tips: [], skills: [], whyGood: [] },
      hr: { name: 'Računovođa', slug: 'racunovoda', description: '', tips: [], skills: [], whyGood: [] },
      sr: { name: 'Рачуновођа', slug: 'racunovoda', description: '', tips: [], skills: [], whyGood: [] }
    }
  },
  {
    id: 'marketing-manager',
    category: 'business',
    translations: {
      en: {
        name: 'Marketing Manager',
        slug: 'marketing-manager',
        description: 'Marketing managers develop and execute marketing strategies to promote products and services. They oversee campaigns, analyze market trends, manage budgets, and coordinate with various teams to achieve business objectives.',
        tips: [
          'Highlight your marketing campaigns and their results',
          'Emphasize experience with digital marketing tools and platforms',
          'Showcase data analysis and ROI measurement skills',
          'Include experience with brand management and positioning',
          'Demonstrate leadership and team management abilities'
        ],
        skills: [
          'Strategic marketing planning',
          'Digital marketing (SEO, SEM, social media)',
          'Campaign management and execution',
          'Market research and analysis',
          'Budget management and ROI optimization',
          'Brand development and positioning',
          'Team leadership and collaboration'
        ],
        whyGood: [
          'Clear structure highlighting marketing achievements',
          'Emphasizes measurable results and campaign performance',
          'Shows expertise in digital marketing channels',
          'Demonstrates strategic thinking and leadership',
          'ATS-friendly format with marketing-specific keywords'
        ]
      },
      nl: {
        name: 'Marketing Manager',
        slug: 'marketing-manager',
        description: 'Marketing managers ontwikkelen en voeren marketingstrategieën uit om producten en diensten te promoten. Ze beheren campagnes, analyseren markttrends, beheren budgetten en coördineren met verschillende teams om bedrijfsdoelstellingen te bereiken.',
        tips: [
          'Benadruk je marketingcampagnes en hun resultaten',
          'Leg nadruk op ervaring met digitale marketingtools en platforms',
          'Toon data-analyse en ROI-meetvaardigheden',
          'Vermeld ervaring met merkmanagement en positionering',
          'Demonstreer leiderschaps- en teammanagementvaardigheden'
        ],
        skills: [
          'Strategische marketingplanning',
          'Digitale marketing (SEO, SEM, social media)',
          'Campagnemanagement en -uitvoering',
          'Marktonderzoek en -analyse',
          'Budgetbeheer en ROI-optimalisatie',
          'Merkenontwikkeling en positionering',
          'Teamleiderschap en samenwerking'
        ],
        whyGood: [
          'Duidelijke structuur die marketingprestaties benadrukt',
          'Legt nadruk op meetbare resultaten en campagneprestaties',
          'Toont expertise in digitale marketingkanalen',
          'Demonstreert strategisch denken en leiderschap',
          'ATS-vriendelijk formaat met marketingspecifieke zoekwoorden'
        ]
      },
      fr: {
        name: 'Responsable Marketing',
        slug: 'responsable-marketing',
        description: 'Les responsables marketing développent et exécutent des stratégies marketing pour promouvoir des produits et services. Ils supervisent les campagnes, analysent les tendances du marché, gèrent les budgets et coordonnent avec diverses équipes pour atteindre les objectifs commerciaux.',
        tips: [
          'Mettez en avant vos campagnes marketing et leurs résultats',
          'Soulignez l\'expérience avec les outils et plateformes de marketing numérique',
          'Présentez les compétences en analyse de données et mesure du ROI',
          'Incluez l\'expérience en gestion de marque et positionnement',
          'Démontrez les capacités de leadership et de gestion d\'équipe'
        ],
        skills: [
          'Planification marketing stratégique',
          'Marketing numérique (SEO, SEM, réseaux sociaux)',
          'Gestion et exécution de campagnes',
          'Recherche et analyse de marché',
          'Gestion budgétaire et optimisation du ROI',
          'Développement et positionnement de marque',
          'Leadership d\'équipe et collaboration'
        ],
        whyGood: [
          'Structure claire mettant en évidence les réalisations marketing',
          'Met l\'accent sur les résultats mesurables et la performance des campagnes',
          'Montre l\'expertise dans les canaux de marketing numérique',
          'Démontre la pensée stratégique et le leadership',
          'Format compatible ATS avec mots-clés spécifiques au marketing'
        ]
      },
      es: {
        name: 'Gerente de Marketing',
        slug: 'gerente-marketing',
        description: 'Los gerentes de marketing desarrollan y ejecutan estrategias de marketing para promover productos y servicios. Supervisan campañas, analizan tendencias del mercado, gestionan presupuestos y coordinan con varios equipos para lograr objetivos comerciales.',
        tips: [
          'Destaca tus campañas de marketing y sus resultados',
          'Enfatiza experiencia con herramientas y plataformas de marketing digital',
          'Muestra habilidades de análisis de datos y medición de ROI',
          'Incluye experiencia con gestión de marca y posicionamiento',
          'Demuestra habilidades de liderazgo y gestión de equipos'
        ],
        skills: [
          'Planificación estratégica de marketing',
          'Marketing digital (SEO, SEM, redes sociales)',
          'Gestión y ejecución de campañas',
          'Investigación y análisis de mercado',
          'Gestión presupuestaria y optimización de ROI',
          'Desarrollo y posicionamiento de marca',
          'Liderazgo de equipo y colaboración'
        ],
        whyGood: [
          'Estructura clara que destaca logros de marketing',
          'Enfatiza resultados medibles y rendimiento de campañas',
          'Muestra experiencia en canales de marketing digital',
          'Demuestra pensamiento estratégico y liderazgo',
          'Formato compatible con ATS con palabras clave específicas de marketing'
        ]
      },
      de: {
        name: 'Marketing Manager',
        slug: 'marketing-manager',
        description: 'Marketingmanager entwickeln und setzen Marketingstrategien um, um Produkte und Dienstleistungen zu fördern. Sie überwachen Kampagnen, analysieren Markttrends, verwalten Budgets und koordinieren mit verschiedenen Teams, um Geschäftsziele zu erreichen.',
        tips: [
          'Heben Sie Ihre Marketingkampagnen und deren Ergebnisse hervor',
          'Betonen Sie Erfahrung mit digitalen Marketingtools und -plattformen',
          'Zeigen Sie Datenanalyse- und ROI-Messfähigkeiten',
          'Fügen Sie Erfahrung mit Markenmanagement und Positionierung hinzu',
          'Demonstrieren Sie Führungs- und Teammanagementfähigkeiten'
        ],
        skills: [
          'Strategische Marketingplanung',
          'Digitales Marketing (SEO, SEM, soziale Medien)',
          'Kampagnenmanagement und -durchführung',
          'Marktforschung und -analyse',
          'Budgetverwaltung und ROI-Optimierung',
          'Markenentwicklung und Positionierung',
          'Teamführung und Zusammenarbeit'
        ],
        whyGood: [
          'Klare Struktur, die Marketingleistungen hervorhebt',
          'Betont messbare Ergebnisse und Kampagnenleistung',
          'Zeigt Expertise in digitalen Marketingkanälen',
          'Demonstriert strategisches Denken und Führung',
          'ATS-freundliches Format mit marketingspezifischen Schlüsselwörtern'
        ]
      },
      it: { name: 'Responsabile Marketing', slug: 'responsabile-marketing', description: '', tips: [], skills: [], whyGood: [] },
      pl: { name: 'Menedżer Marketingu', slug: 'menedzer-marketingu', description: '', tips: [], skills: [], whyGood: [] },
      ro: { name: 'Manager Marketing', slug: 'manager-marketing', description: '', tips: [], skills: [], whyGood: [] },
      hu: { name: 'Marketing Menedzser', slug: 'marketing-menedzser', description: '', tips: [], skills: [], whyGood: [] },
      el: { name: 'Διευθυντής Μάρκετινγκ', slug: 'diefthintis-marketing', description: '', tips: [], skills: [], whyGood: [] },
      cs: { name: 'Marketingový Manažer', slug: 'marketingovy-manazer', description: '', tips: [], skills: [], whyGood: [] },
      pt: { name: 'Gerente de Marketing', slug: 'gerente-marketing', description: '', tips: [], skills: [], whyGood: [] },
      sv: { name: 'Marknadschef', slug: 'marknadschef', description: '', tips: [], skills: [], whyGood: [] },
      bg: { name: 'Маркетинг Мениджър', slug: 'marketing-menidzhar', description: '', tips: [], skills: [], whyGood: [] },
      da: { name: 'Marketingchef', slug: 'marketingchef', description: '', tips: [], skills: [], whyGood: [] },
      fi: { name: 'Markkinointipäällikkö', slug: 'markkinointipaallikko', description: '', tips: [], skills: [], whyGood: [] },
      sk: { name: 'Manažér Marketingu', slug: 'manazer-marketingu', description: '', tips: [], skills: [], whyGood: [] },
      no: { name: 'Markedsføringssjef', slug: 'markedsforingssjef', description: '', tips: [], skills: [], whyGood: [] },
      hr: { name: 'Marketing Menadžer', slug: 'marketing-menadzer', description: '', tips: [], skills: [], whyGood: [] },
      sr: { name: 'Маркетинг Менаџер', slug: 'marketing-menadzer', description: '', tips: [], skills: [], whyGood: [] }
    }
  },
  {
    id: 'graphic-designer',
    category: 'creative',
    translations: {
      en: {
        name: 'Graphic Designer',
        slug: 'graphic-designer',
        description: 'Graphic designers create visual concepts to communicate ideas that inspire, inform, and captivate consumers. They develop layouts, logos, and marketing materials using design software and artistic skills.',
        tips: [
          'Showcase your portfolio and design projects',
          'Highlight proficiency with design software (Adobe Creative Suite, etc.)',
          'Emphasize creativity and ability to meet client needs',
          'Include experience with different design styles and mediums',
          'Demonstrate understanding of branding and visual identity'
        ],
        skills: [
          'Adobe Creative Suite (Photoshop, Illustrator, InDesign)',
          'UI/UX design principles',
          'Typography and layout design',
          'Brand identity development',
          'Print and digital design',
          'Color theory and visual communication',
          'Client collaboration and project management'
        ],
        whyGood: [
          'Clear structure highlighting design portfolio',
          'Emphasizes technical skills with design software',
          'Shows creative problem-solving abilities',
          'Demonstrates versatility across design mediums',
          'ATS-friendly format with design-specific keywords'
        ]
      },
      nl: {
        name: 'Grafisch Ontwerper',
        slug: 'grafisch-ontwerper',
        description: 'Grafisch ontwerpers creëren visuele concepten om ideeën te communiceren die consumenten inspireren, informeren en boeien. Ze ontwikkelen layouts, logo\'s en marketingmaterialen met behulp van ontwerpsoftware en artistieke vaardigheden.',
        tips: [
          'Toon je portfolio en ontwerpprojecten',
          'Benadruk vaardigheid met ontwerpsoftware (Adobe Creative Suite, etc.)',
          'Leg nadruk op creativiteit en vermogen om aan klantbehoeften te voldoen',
          'Vermeld ervaring met verschillende ontwerpstijlen en media',
          'Demonstreer begrip van branding en visuele identiteit'
        ],
        skills: [
          'Adobe Creative Suite (Photoshop, Illustrator, InDesign)',
          'UI/UX ontwerpprincipes',
          'Typografie en layoutontwerp',
          'Merkenidentiteitsontwikkeling',
          'Print- en digitaal ontwerp',
          'Kleurtheorie en visuele communicatie',
          'Klantensamenwerking en projectmanagement'
        ],
        whyGood: [
          'Duidelijke structuur die ontwerpportfolio benadrukt',
          'Legt nadruk op technische vaardigheden met ontwerpsoftware',
          'Toont creatieve probleemoplossende vaardigheden',
          'Demonstreert veelzijdigheid in ontwerpmedia',
          'ATS-vriendelijk formaat met ontwerpspecifieke zoekwoorden'
        ]
      },
      fr: {
        name: 'Graphiste',
        slug: 'graphiste',
        description: 'Les graphistes créent des concepts visuels pour communiquer des idées qui inspirent, informent et captivent les consommateurs. Ils développent des mises en page, logos et matériaux marketing en utilisant des logiciels de design et des compétences artistiques.',
        tips: [
          'Présentez votre portfolio et projets de design',
          'Mettez en avant la maîtrise des logiciels de design (Adobe Creative Suite, etc.)',
          'Soulignez la créativité et la capacité à répondre aux besoins des clients',
          'Incluez l\'expérience avec différents styles et médiums de design',
          'Démontrez la compréhension du branding et de l\'identité visuelle'
        ],
        skills: [
          'Adobe Creative Suite (Photoshop, Illustrator, InDesign)',
          'Principes de design UI/UX',
          'Typographie et conception de mise en page',
          'Développement d\'identité de marque',
          'Design print et numérique',
          'Théorie des couleurs et communication visuelle',
          'Collaboration client et gestion de projet'
        ],
        whyGood: [
          'Structure claire mettant en évidence le portfolio de design',
          'Met l\'accent sur les compétences techniques avec les logiciels de design',
          'Montre les capacités de résolution créative de problèmes',
          'Démontre la polyvalence à travers les médiums de design',
          'Format compatible ATS avec mots-clés spécifiques au design'
        ]
      },
      es: {
        name: 'Diseñador Gráfico',
        slug: 'disenador-grafico',
        description: 'Los diseñadores gráficos crean conceptos visuales para comunicar ideas que inspiran, informan y cautivan a los consumidores. Desarrollan diseños, logotipos y materiales de marketing utilizando software de diseño y habilidades artísticas.',
        tips: [
          'Muestra tu portafolio y proyectos de diseño',
          'Destaca competencia con software de diseño (Adobe Creative Suite, etc.)',
          'Enfatiza creatividad y capacidad para satisfacer necesidades del cliente',
          'Incluye experiencia con diferentes estilos y medios de diseño',
          'Demuestra comprensión de branding e identidad visual'
        ],
        skills: [
          'Adobe Creative Suite (Photoshop, Illustrator, InDesign)',
          'Principios de diseño UI/UX',
          'Tipografía y diseño de layout',
          'Desarrollo de identidad de marca',
          'Diseño impreso y digital',
          'Teoría del color y comunicación visual',
          'Colaboración con clientes y gestión de proyectos'
        ],
        whyGood: [
          'Estructura clara que destaca portafolio de diseño',
          'Enfatiza habilidades técnicas con software de diseño',
          'Muestra habilidades creativas de resolución de problemas',
          'Demuestra versatilidad en medios de diseño',
          'Formato compatible con ATS con palabras clave específicas de diseño'
        ]
      },
      de: {
        name: 'Grafikdesigner',
        slug: 'grafikdesigner',
        description: 'Grafikdesigner erstellen visuelle Konzepte, um Ideen zu kommunizieren, die Verbraucher inspirieren, informieren und fesseln. Sie entwickeln Layouts, Logos und Marketingmaterialien mit Designsoftware und künstlerischen Fähigkeiten.',
        tips: [
          'Zeigen Sie Ihr Portfolio und Designprojekte',
          'Heben Sie die Beherrschung von Designsoftware hervor (Adobe Creative Suite, etc.)',
          'Betonen Sie Kreativität und Fähigkeit, Kundenbedürfnisse zu erfüllen',
          'Fügen Sie Erfahrung mit verschiedenen Designstilen und -medien hinzu',
          'Demonstrieren Sie Verständnis für Branding und visuelle Identität'
        ],
        skills: [
          'Adobe Creative Suite (Photoshop, Illustrator, InDesign)',
          'UI/UX Design-Prinzipien',
          'Typografie und Layout-Design',
          'Markenidentitätsentwicklung',
          'Print- und Digitaldesign',
          'Farbtheorie und visuelle Kommunikation',
          'Kundenkollaboration und Projektmanagement'
        ],
        whyGood: [
          'Klare Struktur, die Designportfolio hervorhebt',
          'Betont technische Fähigkeiten mit Designsoftware',
          'Zeigt kreative Problemlösungsfähigkeiten',
          'Demonstriert Vielseitigkeit in Designmedien',
          'ATS-freundliches Format mit designspezifischen Schlüsselwörtern'
        ]
      },
      it: { name: 'Grafico', slug: 'grafico', description: '', tips: [], skills: [], whyGood: [] },
      pl: { name: 'Grafik', slug: 'grafik', description: '', tips: [], skills: [], whyGood: [] },
      ro: { name: 'Designer Grafic', slug: 'designer-grafic', description: '', tips: [], skills: [], whyGood: [] },
      hu: { name: 'Grafikus', slug: 'grafikus', description: '', tips: [], skills: [], whyGood: [] },
      el: { name: 'Γραφίστας', slug: 'grafistas', description: '', tips: [], skills: [], whyGood: [] },
      cs: { name: 'Grafický Designér', slug: 'graficky-designer', description: '', tips: [], skills: [], whyGood: [] },
      pt: { name: 'Designer Gráfico', slug: 'designer-grafico', description: '', tips: [], skills: [], whyGood: [] },
      sv: { name: 'Grafisk Formgivare', slug: 'grafisk-formgivare', description: '', tips: [], skills: [], whyGood: [] },
      bg: { name: 'Графичен Дизайнер', slug: 'grafichen-dizayner', description: '', tips: [], skills: [], whyGood: [] },
      da: { name: 'Grafisk Designer', slug: 'grafisk-designer', description: '', tips: [], skills: [], whyGood: [] },
      fi: { name: 'Graafinen Suunnittelija', slug: 'graafinen-suunnittelija', description: '', tips: [], skills: [], whyGood: [] },
      sk: { name: 'Grafický Dizajnér', slug: 'graficky-dizajner', description: '', tips: [], skills: [], whyGood: [] },
      no: { name: 'Grafisk Designer', slug: 'grafisk-designer', description: '', tips: [], skills: [], whyGood: [] },
      hr: { name: 'Grafički Dizajner', slug: 'graficki-dizajner', description: '', tips: [], skills: [], whyGood: [] },
      sr: { name: 'Графички Дизајнер', slug: 'graficki-dizajner', description: '', tips: [], skills: [], whyGood: [] }
    }
  },
  {
    id: 'administrative-assistant',
    category: 'administration',
    translations: {
      en: {
        name: 'Administrative Assistant',
        slug: 'administrative-assistant',
        description: 'Administrative assistants provide clerical and organizational support to ensure efficient office operations. They handle scheduling, correspondence, data entry, and assist with various administrative tasks.',
        tips: [
          'Highlight your organizational and multitasking abilities',
          'Emphasize proficiency with office software (Microsoft Office, etc.)',
          'Showcase experience with scheduling and calendar management',
          'Include experience with customer service and communication',
          'Demonstrate attention to detail and accuracy'
        ],
        skills: [
          'Office administration and management',
          'Microsoft Office Suite (Word, Excel, PowerPoint, Outlook)',
          'Data entry and record keeping',
          'Scheduling and calendar management',
          'Customer service and communication',
          'Document preparation and filing',
          'Multi-tasking and time management'
        ],
        whyGood: [
          'Clear structure highlighting administrative skills',
          'Emphasizes proficiency with essential office software',
          'Shows ability to handle multiple responsibilities',
          'Demonstrates organizational and communication skills',
          'ATS-friendly format with administrative keywords'
        ]
      },
      nl: {
        name: 'Administratief Medewerker',
        slug: 'administratief-medewerker',
        description: 'Administratief medewerkers bieden administratieve en organisatorische ondersteuning om efficiënte kantooroperaties te waarborgen. Ze behandelen planning, correspondentie, gegevensinvoer en assisteren bij verschillende administratieve taken.',
        tips: [
          'Benadruk je organisatorische en multitaskingvaardigheden',
          'Leg nadruk op vaardigheid met kantoorsoftware (Microsoft Office, etc.)',
          'Toon ervaring met planning en kalenderbeheer',
          'Vermeld ervaring met klantenservice en communicatie',
          'Demonstreer aandacht voor detail en nauwkeurigheid'
        ],
        skills: [
          'Kantooradministratie en -beheer',
          'Microsoft Office Suite (Word, Excel, PowerPoint, Outlook)',
          'Gegevensinvoer en archiefbeheer',
          'Planning en kalenderbeheer',
          'Klantenservice en communicatie',
          'Documentvoorbereiding en archivering',
          'Multitasking en tijdbeheer'
        ],
        whyGood: [
          'Duidelijke structuur die administratieve vaardigheden benadrukt',
          'Legt nadruk op vaardigheid met essentiële kantoorsoftware',
          'Toont vermogen om meerdere verantwoordelijkheden te hanteren',
          'Demonstreert organisatorische en communicatieve vaardigheden',
          'ATS-vriendelijk formaat met administratieve zoekwoorden'
        ]
      },
      fr: {
        name: 'Assistant Administratif',
        slug: 'assistant-administratif',
        description: 'Les assistants administratifs fournissent un soutien administratif et organisationnel pour assurer des opérations de bureau efficaces. Ils gèrent la planification, la correspondance, la saisie de données et aident avec diverses tâches administratives.',
        tips: [
          'Mettez en avant vos capacités organisationnelles et de multitâche',
          'Soulignez la maîtrise des logiciels de bureau (Microsoft Office, etc.)',
          'Présentez l\'expérience en planification et gestion de calendrier',
          'Incluez l\'expérience en service client et communication',
          'Démontrez l\'attention aux détails et la précision'
        ],
        skills: [
          'Administration et gestion de bureau',
          'Suite Microsoft Office (Word, Excel, PowerPoint, Outlook)',
          'Saisie de données et tenue de dossiers',
          'Planification et gestion de calendrier',
          'Service client et communication',
          'Préparation et classement de documents',
          'Multitâche et gestion du temps'
        ],
        whyGood: [
          'Structure claire mettant en évidence les compétences administratives',
          'Met l\'accent sur la maîtrise des logiciels de bureau essentiels',
          'Montre la capacité à gérer plusieurs responsabilités',
          'Démontre les compétences organisationnelles et de communication',
          'Format compatible ATS avec mots-clés administratifs'
        ]
      },
      es: {
        name: 'Asistente Administrativo',
        slug: 'asistente-administrativo',
        description: 'Los asistentes administrativos brindan apoyo administrativo y organizacional para garantizar operaciones de oficina eficientes. Manejan programación, correspondencia, entrada de datos y ayudan con diversas tareas administrativas.',
        tips: [
          'Destaca tus habilidades organizativas y de multitarea',
          'Enfatiza competencia con software de oficina (Microsoft Office, etc.)',
          'Muestra experiencia con programación y gestión de calendario',
          'Incluye experiencia con servicio al cliente y comunicación',
          'Demuestra atención al detalle y precisión'
        ],
        skills: [
          'Administración y gestión de oficina',
          'Suite Microsoft Office (Word, Excel, PowerPoint, Outlook)',
          'Entrada de datos y mantenimiento de registros',
          'Programación y gestión de calendario',
          'Servicio al cliente y comunicación',
          'Preparación y archivo de documentos',
          'Multitarea y gestión del tiempo'
        ],
        whyGood: [
          'Estructura clara que destaca habilidades administrativas',
          'Enfatiza competencia con software de oficina esencial',
          'Muestra capacidad para manejar múltiples responsabilidades',
          'Demuestra habilidades organizativas y de comunicación',
          'Formato compatible con ATS con palabras clave administrativas'
        ]
      },
      de: {
        name: 'Verwaltungsassistent',
        slug: 'verwaltungsassistent',
        description: 'Verwaltungsassistenten bieten bürotechnische und organisatorische Unterstützung, um effiziente Büroabläufe sicherzustellen. Sie handhaben Terminplanung, Korrespondenz, Dateneingabe und unterstützen bei verschiedenen Verwaltungsaufgaben.',
        tips: [
          'Heben Sie Ihre organisatorischen und Multitasking-Fähigkeiten hervor',
          'Betonen Sie die Beherrschung von Bürosoftware (Microsoft Office, etc.)',
          'Zeigen Sie Erfahrung mit Terminplanung und Kalenderverwaltung',
          'Fügen Sie Erfahrung mit Kundenservice und Kommunikation hinzu',
          'Demonstrieren Sie Aufmerksamkeit für Details und Genauigkeit'
        ],
        skills: [
          'Büroverwaltung und -management',
          'Microsoft Office Suite (Word, Excel, PowerPoint, Outlook)',
          'Dateneingabe und Aktenführung',
          'Terminplanung und Kalenderverwaltung',
          'Kundenservice und Kommunikation',
          'Dokumentenvorbereitung und Ablage',
          'Multitasking und Zeitmanagement'
        ],
        whyGood: [
          'Klare Struktur, die Verwaltungsfähigkeiten hervorhebt',
          'Betont die Beherrschung wesentlicher Bürosoftware',
          'Zeigt Fähigkeit, mehrere Verantwortlichkeiten zu handhaben',
          'Demonstriert organisatorische und Kommunikationsfähigkeiten',
          'ATS-freundliches Format mit Verwaltungsschlüsselwörtern'
        ]
      },
      it: { name: 'Assistente Amministrativo', slug: 'assistente-amministrativo', description: '', tips: [], skills: [], whyGood: [] },
      pl: { name: 'Asystent Administracyjny', slug: 'asystent-administracyjny', description: '', tips: [], skills: [], whyGood: [] },
      ro: { name: 'Asistent Administrativ', slug: 'asistent-administrativ', description: '', tips: [], skills: [], whyGood: [] },
      hu: { name: 'Adminisztratív Asszisztens', slug: 'administrativ-asszisztens', description: '', tips: [], skills: [], whyGood: [] },
      el: { name: 'Διοικητικός Βοηθός', slug: 'dioikitikos-voithos', description: '', tips: [], skills: [], whyGood: [] },
      cs: { name: 'Administrativní Asistent', slug: 'administrativni-asistent', description: '', tips: [], skills: [], whyGood: [] },
      pt: { name: 'Assistente Administrativo', slug: 'assistente-administrativo', description: '', tips: [], skills: [], whyGood: [] },
      sv: { name: 'Administrativ Assistent', slug: 'administrativ-assistent', description: '', tips: [], skills: [], whyGood: [] },
      bg: { name: 'Административен Асистент', slug: 'administrativen-asistent', description: '', tips: [], skills: [], whyGood: [] },
      da: { name: 'Administrativ Assistent', slug: 'administrativ-assistent', description: '', tips: [], skills: [], whyGood: [] },
      fi: { name: 'Hallintoavustaja', slug: 'hallintoavustaja', description: '', tips: [], skills: [], whyGood: [] },
      sk: { name: 'Administratívny Asistent', slug: 'administrativny-asistent', description: '', tips: [], skills: [], whyGood: [] },
      no: { name: 'Administrativ Assistent', slug: 'administrativ-assistent', description: '', tips: [], skills: [], whyGood: [] },
      hr: { name: 'Administrativni Asistent', slug: 'administrativni-asistent', description: '', tips: [], skills: [], whyGood: [] },
      sr: { name: 'Административни Асистент', slug: 'administrativni-asistent', description: '', tips: [], skills: [], whyGood: [] }
    }
  },
  {
    id: 'engineer',
    category: 'engineering',
    translations: {
      en: {
        name: 'Engineer',
        slug: 'engineer',
        description: 'Engineers apply scientific and mathematical principles to design, develop, and maintain systems, structures, and processes. They solve complex problems and create innovative solutions across various engineering disciplines.',
        tips: [
          'Highlight your engineering degree and certifications',
          'Emphasize technical skills and software proficiency',
          'Showcase projects and their impact',
          'Include experience with engineering standards and regulations',
          'Demonstrate problem-solving and analytical abilities'
        ],
        skills: [
          'Engineering design and analysis',
          'CAD software (AutoCAD, SolidWorks, etc.)',
          'Project management and planning',
          'Technical documentation and reporting',
          'Quality assurance and testing',
          'Regulatory compliance',
          'Collaboration with cross-functional teams'
        ],
        whyGood: [
          'Clear structure highlighting engineering qualifications',
          'Emphasizes technical expertise and certifications',
          'Shows practical project experience',
          'Demonstrates problem-solving capabilities',
          'ATS-friendly format with engineering-specific keywords'
        ]
      },
      nl: {
        name: 'Ingenieur',
        slug: 'ingenieur',
        description: 'Ingenieurs passen wetenschappelijke en wiskundige principes toe om systemen, structuren en processen te ontwerpen, ontwikkelen en onderhouden. Ze lossen complexe problemen op en creëren innovatieve oplossingen in verschillende ingenieursdisciplines.',
        tips: [
          'Benadruk je ingenieursdiploma en certificeringen',
          'Leg nadruk op technische vaardigheden en softwarevaardigheid',
          'Toon projecten en hun impact',
          'Vermeld ervaring met ingenieursnormen en -regelgeving',
          'Demonstreer probleemoplossende en analytische vaardigheden'
        ],
        skills: [
          'Ingenieursontwerp en -analyse',
          'CAD-software (AutoCAD, SolidWorks, etc.)',
          'Projectmanagement en -planning',
          'Technische documentatie en rapportage',
          'Kwaliteitsborging en testen',
          'Regelgevingsnaleving',
          'Samenwerking met multidisciplinaire teams'
        ],
        whyGood: [
          'Duidelijke structuur die ingenieurskwalificaties benadrukt',
          'Legt nadruk op technische expertise en certificeringen',
          'Toont praktische projectervaring',
          'Demonstreert probleemoplossende capaciteiten',
          'ATS-vriendelijk formaat met ingenieurspecifieke zoekwoorden'
        ]
      },
      fr: {
        name: 'Ingénieur',
        slug: 'ingenieur',
        description: 'Les ingénieurs appliquent des principes scientifiques et mathématiques pour concevoir, développer et maintenir des systèmes, structures et processus. Ils résolvent des problèmes complexes et créent des solutions innovantes dans diverses disciplines d\'ingénierie.',
        tips: [
          'Mettez en avant votre diplôme d\'ingénieur et certifications',
          'Soulignez les compétences techniques et la maîtrise des logiciels',
          'Présentez des projets et leur impact',
          'Incluez l\'expérience avec les normes et réglementations d\'ingénierie',
          'Démontrez les capacités de résolution de problèmes et d\'analyse'
        ],
        skills: [
          'Conception et analyse d\'ingénierie',
          'Logiciels CAO (AutoCAD, SolidWorks, etc.)',
          'Gestion et planification de projets',
          'Documentation et rapports techniques',
          'Assurance qualité et tests',
          'Conformité réglementaire',
          'Collaboration avec des équipes interdisciplinaires'
        ],
        whyGood: [
          'Structure claire mettant en évidence les qualifications d\'ingénierie',
          'Met l\'accent sur l\'expertise technique et les certifications',
          'Montre l\'expérience pratique des projets',
          'Démontre les capacités de résolution de problèmes',
          'Format compatible ATS avec mots-clés spécifiques à l\'ingénierie'
        ]
      },
      es: {
        name: 'Ingeniero',
        slug: 'ingeniero',
        description: 'Los ingenieros aplican principios científicos y matemáticos para diseñar, desarrollar y mantener sistemas, estructuras y procesos. Resuelven problemas complejos y crean soluciones innovadoras en diversas disciplinas de ingeniería.',
        tips: [
          'Destaca tu título de ingeniería y certificaciones',
          'Enfatiza habilidades técnicas y competencia con software',
          'Muestra proyectos y su impacto',
          'Incluye experiencia con estándares y regulaciones de ingeniería',
          'Demuestra habilidades de resolución de problemas y análisis'
        ],
        skills: [
          'Diseño y análisis de ingeniería',
          'Software CAD (AutoCAD, SolidWorks, etc.)',
          'Gestión y planificación de proyectos',
          'Documentación y reportes técnicos',
          'Aseguramiento de calidad y pruebas',
          'Cumplimiento regulatorio',
          'Colaboración con equipos multifuncionales'
        ],
        whyGood: [
          'Estructura clara que destaca calificaciones de ingeniería',
          'Enfatiza experiencia técnica y certificaciones',
          'Muestra experiencia práctica en proyectos',
          'Demuestra capacidades de resolución de problemas',
          'Formato compatible con ATS con palabras clave específicas de ingeniería'
        ]
      },
      de: {
        name: 'Ingenieur',
        slug: 'ingenieur',
        description: 'Ingenieure wenden wissenschaftliche und mathematische Prinzipien an, um Systeme, Strukturen und Prozesse zu entwerfen, zu entwickeln und zu warten. Sie lösen komplexe Probleme und schaffen innovative Lösungen in verschiedenen Ingenieursdisziplinen.',
        tips: [
          'Heben Sie Ihren Ingenieursabschluss und Zertifizierungen hervor',
          'Betonen Sie technische Fähigkeiten und Softwarekenntnisse',
          'Zeigen Sie Projekte und deren Auswirkungen',
          'Fügen Sie Erfahrung mit Ingenieursstandards und -vorschriften hinzu',
          'Demonstrieren Sie Problemlösungs- und Analysefähigkeiten'
        ],
        skills: [
          'Ingenieurdesign und -analyse',
          'CAD-Software (AutoCAD, SolidWorks, etc.)',
          'Projektmanagement und -planung',
          'Technische Dokumentation und Berichterstattung',
          'Qualitätssicherung und Tests',
          'Regulatorische Compliance',
          'Zusammenarbeit mit funktionsübergreifenden Teams'
        ],
        whyGood: [
          'Klare Struktur, die Ingenieursqualifikationen hervorhebt',
          'Betont technische Expertise und Zertifizierungen',
          'Zeigt praktische Projekterfahrung',
          'Demonstriert Problemlösungsfähigkeiten',
          'ATS-freundliches Format mit ingenieursspezifischen Schlüsselwörtern'
        ]
      },
      it: {
        name: 'Ingegnere',
        slug: 'ingegnere',
        description: 'Gli ingegneri applicano principi scientifici e matematici per progettare, sviluppare e mantenere sistemi, strutture e processi. Risolvono problemi complessi e creano soluzioni innovative in varie discipline ingegneristiche.',
        tips: [
          'Evidenzia la tua laurea in ingegneria e certificazioni',
          'Enfatizza competenze tecniche e padronanza del software',
          'Mostra progetti e il loro impatto',
          'Includi esperienza con standard e normative ingegneristiche',
          'Dimostra capacità di problem solving e analisi'
        ],
        skills: [
          'Progettazione e analisi ingegneristica',
          'Software CAD (AutoCAD, SolidWorks, etc.)',
          'Gestione e pianificazione progetti',
          'Documentazione e reporting tecnico',
          'Assicurazione qualità e test',
          'Conformità normativa',
          'Collaborazione con team multifunzionali'
        ],
        whyGood: [
          'Struttura chiara che evidenzia qualifiche ingegneristiche',
          'Enfatizza competenza tecnica e certificazioni',
          'Mostra esperienza pratica nei progetti',
          'Dimostra capacità di problem solving',
          'Formato compatibile con ATS con parole chiave specifiche per l\'ingegneria'
        ]
      },
      pl: {
        name: 'Inżynier',
        slug: 'inzynier',
        description: 'Inżynierowie stosują zasady naukowe i matematyczne do projektowania, rozwijania i utrzymywania systemów, struktur i procesów. Rozwiązują złożone problemy i tworzą innowacyjne rozwiązania w różnych dyscyplinach inżynierskich.',
        tips: [
          'Podkreśl swoje wykształcenie inżynierskie i certyfikaty',
          'Podkreśl umiejętności techniczne i znajomość oprogramowania',
          'Pokaż projekty i ich wpływ',
          'Uwzględnij doświadczenie ze standardami i przepisami inżynierskimi',
          'Wykazuj zdolności rozwiązywania problemów i analityczne'
        ],
        skills: [
          'Projektowanie i analiza inżynierska',
          'Oprogramowanie CAD (AutoCAD, SolidWorks, etc.)',
          'Zarządzanie i planowanie projektów',
          'Dokumentacja techniczna i raportowanie',
          'Zapewnienie jakości i testy',
          'Zgodność z przepisami',
          'Współpraca z zespołami międzyfunkcyjnymi'
        ],
        whyGood: [
          'Jasna struktura podkreślająca kwalifikacje inżynierskie',
          'Kładzie nacisk na kompetencje techniczne i certyfikaty',
          'Pokazuje praktyczne doświadczenie w projektach',
          'Wykazuje zdolności rozwiązywania problemów',
          'Format przyjazny dla ATS z słowami kluczowymi specyficznymi dla inżynierii'
        ]
      },
      ro: {
        name: 'Inginer',
        slug: 'inginer',
        description: 'Inginerii aplică principii științifice și matematice pentru a proiecta, dezvolta și menține sisteme, structuri și procese. Ei rezolvă probleme complexe și creează soluții inovatoare în diverse discipline de inginerie.',
        tips: [
          'Evidențiază diploma ta de inginerie și certificările',
          'Subliniază abilitățile tehnice și competența cu software-ul',
          'Prezintă proiecte și impactul lor',
          'Include experiența cu standarde și reglementări de inginerie',
          'Demonstrează abilități de rezolvare a problemelor și analitice'
        ],
        skills: [
          'Proiectare și analiză inginerească',
          'Software CAD (AutoCAD, SolidWorks, etc.)',
          'Management și planificare proiecte',
          'Documentație și raportare tehnică',
          'Asigurarea calității și testare',
          'Conformitate reglementară',
          'Colaborare cu echipe multifuncționale'
        ],
        whyGood: [
          'Structură clară care evidențiază calificările de inginerie',
          'Subliniază expertiza tehnică și certificările',
          'Arată experiența practică în proiecte',
          'Demonstrează capacități de rezolvare a problemelor',
          'Format compatibil cu ATS cu cuvinte cheie specifice ingineriei'
        ]
      },
      hu: {
        name: 'Mérnök',
        slug: 'mernok',
        description: 'A mérnökök tudományos és matematikai elveket alkalmaznak rendszerek, szerkezetek és folyamatok tervezésére, fejlesztésére és karbantartására. Összetett problémákat oldanak meg és innovatív megoldásokat hoznak létre különböző mérnöki területeken.',
        tips: [
          'Hangsúlyozza mérnöki diplomáját és tanúsítványait',
          'Kiemeli műszaki készségeit és szoftverismeretét',
          'Bemutatja projekteit és azok hatását',
          'Tartalmazza mérnöki szabványokkal és előírásokkal való tapasztalatát',
          'Bebizonyítja problémamegoldó és elemző képességeit'
        ],
        skills: [
          'Mérnöki tervezés és elemzés',
          'CAD szoftver (AutoCAD, SolidWorks, etc.)',
          'Projektmenedzsment és tervezés',
          'Műszaki dokumentáció és jelentéskészítés',
          'Minőségbiztosítás és tesztelés',
          'Szabályozási megfelelőség',
          'Együttműködés többfunkciós csapatokkal'
        ],
        whyGood: [
          'Világos struktúra, amely kiemeli a mérnöki kvalifikációkat',
          'Hangsúlyozza a műszaki szakértelem és tanúsítványokat',
          'Mutatja a gyakorlati projekttapasztalatot',
          'Bebizonyítja a problémamegoldó képességeket',
          'ATS-barát formátum mérnökspecifikus kulcsszavakkal'
        ]
      },
      el: {
        name: 'Μηχανικός',
        slug: 'michanikos',
        description: 'Οι μηχανικοί εφαρμόζουν επιστημονικές και μαθηματικές αρχές για να σχεδιάσουν, να αναπτύξουν και να συντηρήσουν συστήματα, δομές και διαδικασίες. Επιλύουν σύνθετα προβλήματα και δημιουργούν καινοτόμες λύσεις σε διάφορες μηχανικές ειδικότητες.',
        tips: [
          'Επισημάνετε το πτυχίο μηχανικής και τις πιστοποιήσεις σας',
          'Τονίστε τις τεχνικές δεξιότητες και την ικανότητα λογισμικού',
          'Παρουσιάστε έργα και τον αντίκτυπό τους',
          'Συμπεριλάβετε εμπειρία με πρότυπα και κανονισμούς μηχανικής',
          'Αποδείξτε ικανότητες επίλυσης προβλημάτων και ανάλυσης'
        ],
        skills: [
          'Σχεδιασμός και ανάλυση μηχανικής',
          'Λογισμικό CAD (AutoCAD, SolidWorks, etc.)',
          'Διαχείριση και σχεδιασμός έργων',
          'Τεχνική τεκμηρίωση και αναφορά',
          'Διασφάλιση ποιότητας και δοκιμές',
          'Συμμόρφωση με κανονισμούς',
          'Συνεργασία με διεπιστημονικές ομάδες'
        ],
        whyGood: [
          'Σαφής δομή που επισημαίνει τις μηχανικές προσόντα',
          'Τονίζει την τεχνική εμπειρογνωμοσύνη και τις πιστοποιήσεις',
          'Δείχνει πρακτική εμπειρία έργων',
          'Αποδεικνύει ικανότητες επίλυσης προβλημάτων',
          'Μορφή συμβατή με ATS με λέξεις-κλειδιά ειδικές για τη μηχανική'
        ]
      },
      cs: {
        name: 'Inženýr',
        slug: 'inzenyr',
        description: 'Inženýři aplikují vědecké a matematické principy k navrhování, vývoji a údržbě systémů, struktur a procesů. Řeší složité problémy a vytvářejí inovativní řešení v různých inženýrských oborech.',
        tips: [
          'Zdůrazněte své inženýrské vzdělání a certifikace',
          'Zdůrazněte technické dovednosti a znalosti softwaru',
          'Ukažte projekty a jejich dopad',
          'Zahrňte zkušenosti s inženýrskými standardy a předpisy',
          'Prokažte schopnosti řešení problémů a analýzy'
        ],
        skills: [
          'Inženýrský design a analýza',
          'CAD software (AutoCAD, SolidWorks, etc.)',
          'Řízení a plánování projektů',
          'Technická dokumentace a reporting',
          'Zajištění kvality a testování',
          'Regulační shoda',
          'Spolupráce s mezifunkčními týmy'
        ],
        whyGood: [
          'Jasná struktura zdůrazňující inženýrské kvalifikace',
          'Zdůrazňuje technickou odbornost a certifikace',
          'Ukazuje praktické zkušenosti s projekty',
          'Prokazuje schopnosti řešení problémů',
          'Formát kompatibilní s ATS s inženýrskými klíčovými slovy'
        ]
      },
      pt: {
        name: 'Engenheiro',
        slug: 'engenheiro',
        description: 'Engenheiros aplicam princípios científicos e matemáticos para projetar, desenvolver e manter sistemas, estruturas e processos. Eles resolvem problemas complexos e criam soluções inovadoras em várias disciplinas de engenharia.',
        tips: [
          'Destaque seu diploma de engenharia e certificações',
          'Enfatize habilidades técnicas e proficiência em software',
          'Mostre projetos e seu impacto',
          'Inclua experiência com padrões e regulamentos de engenharia',
          'Demonstre habilidades de resolução de problemas e análise'
        ],
        skills: [
          'Design e análise de engenharia',
          'Software CAD (AutoCAD, SolidWorks, etc.)',
          'Gerenciamento e planejamento de projetos',
          'Documentação técnica e relatórios',
          'Garantia de qualidade e testes',
          'Conformidade regulatória',
          'Colaboração com equipes multifuncionais'
        ],
        whyGood: [
          'Estrutura clara destacando qualificações de engenharia',
          'Enfatiza expertise técnica e certificações',
          'Mostra experiência prática em projetos',
          'Demonstra capacidades de resolução de problemas',
          'Formato compatível com ATS com palavras-chave específicas de engenharia'
        ]
      },
      sv: {
        name: 'Ingenjör',
        slug: 'ingenjor',
        description: 'Ingenjörer tillämpar vetenskapliga och matematiska principer för att designa, utveckla och underhålla system, strukturer och processer. De löser komplexa problem och skapar innovativa lösningar inom olika ingenjörsdiscipliner.',
        tips: [
          'Framhäv din ingenjörsexamen och certifieringar',
          'Betona tekniska färdigheter och programvarukompetens',
          'Visa projekt och deras inverkan',
          'Inkludera erfarenhet av ingenjörsstandarder och förordningar',
          'Visa problemlösnings- och analytiska förmågor'
        ],
        skills: [
          'Ingenjörsdesign och analys',
          'CAD-programvara (AutoCAD, SolidWorks, etc.)',
          'Projekthantering och planering',
          'Teknisk dokumentation och rapportering',
          'Kvalitetssäkring och testning',
          'Regulatorisk efterlevnad',
          'Samarbete med tvärfunktionella team'
        ],
        whyGood: [
          'Tydlig struktur som framhäver ingenjörskvalifikationer',
          'Betona teknisk expertis och certifieringar',
          'Visar praktisk projekterfarenhet',
          'Demonstrerar problemlösningsförmågor',
          'ATS-vänligt format med ingenjörsspecifika nyckelord'
        ]
      },
      bg: {
        name: 'Инженер',
        slug: 'inzhener',
        description: 'Инженерите прилагат научни и математически принципи за проектиране, разработване и поддържане на системи, структури и процеси. Те решават сложни проблеми и създават иновативни решения в различни инженерни дисциплини.',
        tips: [
          'Подчертайте инженерното си образование и сертификати',
          'Акцентирайте върху техническите умения и компетентността с софтуер',
          'Покажете проекти и тяхното въздействие',
          'Включете опит с инженерни стандарти и разпоредби',
          'Демонстрирайте способности за решаване на проблеми и анализ'
        ],
        skills: [
          'Инженерен дизайн и анализ',
          'CAD софтуер (AutoCAD, SolidWorks, etc.)',
          'Управление и планиране на проекти',
          'Техническа документация и отчетност',
          'Осигуряване на качество и тестване',
          'Регулаторно съответствие',
          'Сътрудничество с междуфункционални екипи'
        ],
        whyGood: [
          'Ясна структура, която подчертава инженерните квалификации',
          'Акцентира върху техническата експертиза и сертификатите',
          'Показва практически опит с проекти',
          'Демонстрира способности за решаване на проблеми',
          'Формат, съвместим с ATS, с инженерни ключови думи'
        ]
      },
      da: {
        name: 'Ingeniør',
        slug: 'ingenior',
        description: 'Ingeniører anvender videnskabelige og matematiske principper til at designe, udvikle og vedligeholde systemer, strukturer og processer. De løser komplekse problemer og skaber innovative løsninger på tværs af forskellige ingeniørdiscipliner.',
        tips: [
          'Fremhæv din ingeniøreksamen og certificeringer',
          'Fremhæv tekniske færdigheder og softwarekompetence',
          'Vis projekter og deres indvirkning',
          'Inkluder erfaring med ingeniørstandarder og -forskrifter',
          'Demonstrer problemløsnings- og analytiske evner'
        ],
        skills: [
          'Ingeniørdesign og -analyse',
          'CAD-software (AutoCAD, SolidWorks, etc.)',
          'Projektledelse og planlægning',
          'Teknisk dokumentation og rapportering',
          'Kvalitetssikring og testning',
          'Regulatorisk overholdelse',
          'Samarbejde med tværfaglige teams'
        ],
        whyGood: [
          'Tydelig struktur, der fremhæver ingeniørkvalifikationer',
          'Fremhæver teknisk ekspertise og certificeringer',
          'Viser praktisk projekterfaring',
          'Demonstrerer problemløsningsevner',
          'ATS-venligt format med ingeniørsspecifikke nøgleord'
        ]
      },
      fi: {
        name: 'Insinööri',
        slug: 'insinoori',
        description: 'Insinöörit soveltavat tieteellisiä ja matemaattisia periaatteita suunnitellakseen, kehittääkseen ja ylläpitääkseen järjestelmiä, rakenteita ja prosesseja. He ratkaisevat monimutkaisia ongelmia ja luovat innovatiivisia ratkaisuja eri insinööritieteiden aloilla.',
        tips: [
          'Korosta insinöörin tutkintosi ja sertifikaatit',
          'Korosta tekniset taidot ja ohjelmistotaito',
          'Näytä projektit ja niiden vaikutus',
          'Sisällytä kokemus insinööristandardeista ja -määräyksistä',
          'Näytä ongelmanratkaisu- ja analyyttiset kyvyt'
        ],
        skills: [
          'Insinöörisuunnittelu ja -analyysi',
          'CAD-ohjelmistot (AutoCAD, SolidWorks, etc.)',
          'Projektinhallinta ja suunnittelu',
          'Tekninen dokumentointi ja raportointi',
          'Laadunvarmistus ja testaus',
          'Sääntelyn noudattaminen',
          'Yhteistyö monialaisissa tiimeissä'
        ],
        whyGood: [
          'Selkeä rakenne, joka korostaa insinöörikvalifikaatioita',
          'Korostaa teknistä asiantuntemusta ja sertifikaatteja',
          'Näyttää käytännön projektikokemusta',
          'Näyttää ongelmanratkaisukykyjä',
          'ATS-yhteensopiva muoto insinöörispesifisillä avainsanoilla'
        ]
      },
      sk: {
        name: 'Inžinier',
        slug: 'inziner',
        description: 'Inžinieri aplikujú vedecké a matematické princípy na navrhovanie, vývoj a údržbu systémov, štruktúr a procesov. Riešia zložité problémy a vytvárajú inovatívne riešenia v rôznych inžinierskych disciplínach.',
        tips: [
          'Zdôraznite svoje inžinierske vzdelanie a certifikáty',
          'Zdôraznite technické zručnosti a znalosti softvéru',
          'Ukážte projekty a ich dopad',
          'Zahrňte skúsenosti s inžinierskymi normami a predpismi',
          'Preukážte schopnosti riešenia problémov a analýzy'
        ],
        skills: [
          'Inžiniersky dizajn a analýza',
          'CAD softvér (AutoCAD, SolidWorks, etc.)',
          'Riadenie a plánovanie projektov',
          'Technická dokumentácia a reportovanie',
          'Zabezpečenie kvality a testovanie',
          'Regulačná súlad',
          'Spolupráca s medzifunkčnými tímami'
        ],
        whyGood: [
          'Jasná štruktúra zdôrazňujúca inžinierske kvalifikácie',
          'Zdôrazňuje technickú odbornosť a certifikáty',
          'Ukazuje praktické skúsenosti s projektmi',
          'Preukazuje schopnosti riešenia problémov',
          'Formát kompatibilný s ATS s inžinierskymi kľúčovými slovami'
        ]
      },
      no: {
        name: 'Ingeniør',
        slug: 'ingenior',
        description: 'Ingeniører bruker vitenskapelige og matematiske prinsipper for å designe, utvikle og vedlikeholde systemer, strukturer og prosesser. De løser komplekse problemer og skaper innovative løsninger på tvers av ulike ingeniørdisipliner.',
        tips: [
          'Fremhev din ingeniøreksamen og sertifiseringer',
          'Fremhev tekniske ferdigheter og programvarekompetanse',
          'Vis prosjekter og deres innvirkning',
          'Inkluder erfaring med ingeniørstandarder og -forskrifter',
          'Demonstrer problemløsnings- og analytiske evner'
        ],
        skills: [
          'Ingeniørdesign og -analyse',
          'CAD-programvare (AutoCAD, SolidWorks, etc.)',
          'Prosjektledelse og planlegging',
          'Teknisk dokumentasjon og rapportering',
          'Kvalitetssikring og testing',
          'Regulatorisk overholdelse',
          'Samarbeid med tverrfaglige team'
        ],
        whyGood: [
          'Tydelig struktur som fremhever ingeniørkvalifikasjoner',
          'Fremhever teknisk ekspertise og sertifiseringer',
          'Viser praktisk prosjekterfaring',
          'Demonstrerer problemløsningsevner',
          'ATS-vennlig format med ingeniørsspesifikke nøkkelord'
        ]
      },
      hr: {
        name: 'Inženjer',
        slug: 'inzenjer',
        description: 'Inženjeri primjenjuju znanstvene i matematičke principe za projektiranje, razvoj i održavanje sustava, struktura i procesa. Rješavaju složene probleme i stvaraju inovativna rješenja u različitim inženjerskim disciplinama.',
        tips: [
          'Istaknite svoju inženjersku diplomu i certifikate',
          'Naglasite tehničke vještine i kompetenciju s programskim paketima',
          'Pokažite projekte i njihov utjecaj',
          'Uključite iskustvo s inženjerskim standardima i propisima',
          'Pokažite sposobnosti rješavanja problema i analize'
        ],
        skills: [
          'Inženjerski dizajn i analiza',
          'CAD softver (AutoCAD, SolidWorks, etc.)',
          'Upravljanje i planiranje projekata',
          'Tehnička dokumentacija i izvještavanje',
          'Osiguravanje kvalitete i testiranje',
          'Regulatorna usklađenost',
          'Suradnja s međufunkcionalnim timovima'
        ],
        whyGood: [
          'Jasna struktura koja ističe inženjerske kvalifikacije',
          'Naglašava tehničku stručnost i certifikate',
          'Prikazuje praktično iskustvo s projektima',
          'Pokazuje sposobnosti rješavanja problema',
          'Format kompatibilan s ATS s inženjerskim ključnim riječima'
        ]
      },
      sr: {
        name: 'Инжењер',
        slug: 'inzhenjer',
        description: 'Инжењери примењују научне и математичке принципе за пројектовање, развој и одржавање система, структура и процеса. Решавају сложене проблеме и стварају иновативна решења у различитим инжењерским дисциплинама.',
        tips: [
          'Истакните своју инжењерску диплому и сертификате',
          'Нагласите техничке вештине и компетенцију са програмским пакетима',
          'Покажите пројекте и њихов утицај',
          'Укључите искуство са инжењерским стандардима и прописима',
          'Покажите способности решавања проблема и анализе'
        ],
        skills: [
          'Инжењерски дизајн и анализа',
          'CAD софтвер (AutoCAD, SolidWorks, etc.)',
          'Управљање и планирање пројеката',
          'Техничка документација и извештавање',
          'Осигуравање квалитета и тестирање',
          'Регулаторна усклађеност',
          'Сарадња са међуфункционалним тимовима'
        ],
        whyGood: [
          'Јасна структура која истиче инжењерске квалификације',
          'Наглашава техничку стручност и сертификате',
          'Приказује практично искуство са пројектима',
          'Показује способности решавања проблема',
          'Формат компатибилан са ATS са инжењерским кључним речима'
        ]
      }
    }
  },
  {
    id: 'sales-representative',
    category: 'sales',
    translations: {
      en: {
        name: 'Sales Representative',
        slug: 'sales-representative',
        description: 'Sales representatives build relationships with customers, identify their needs, and promote products or services. They achieve sales targets, maintain customer relationships, and contribute to business growth through effective communication and negotiation.',
        tips: [
          'Highlight your sales achievements and targets met',
          'Emphasize customer relationship management skills',
          'Showcase experience with CRM systems',
          'Include examples of successful sales strategies',
          'Demonstrate communication and negotiation abilities'
        ],
        skills: [
          'Sales and business development',
          'Customer relationship management (CRM)',
          'Lead generation and prospecting',
          'Negotiation and closing techniques',
          'Product knowledge and presentation',
          'Market analysis and territory management',
          'Communication and interpersonal skills'
        ],
        whyGood: [
          'Clear structure highlighting sales achievements',
          'Emphasizes quantifiable results and targets',
          'Shows customer relationship expertise',
          'Demonstrates sales process knowledge',
          'ATS-friendly format with sales-specific keywords'
        ]
      },
      nl: {
        name: 'Verkoopmedewerker',
        slug: 'verkoopmedewerker',
        description: 'Verkoopmedewerkers bouwen relaties op met klanten, identificeren hun behoeften en promoten producten of diensten. Ze behalen verkoopdoelstellingen, onderhouden klantrelaties en dragen bij aan bedrijfsgroei door effectieve communicatie en onderhandeling.',
        tips: [
          'Benadruk je verkoopprestaties en behaalde doelstellingen',
          'Leg nadruk op klantrelatiebeheer vaardigheden',
          'Toon ervaring met CRM-systemen',
          'Vermeld voorbeelden van succesvolle verkoopstrategieën',
          'Demonstreer communicatieve en onderhandelingsvaardigheden'
        ],
        skills: [
          'Verkoop en business development',
          'Klantrelatiebeheer (CRM)',
          'Leadgeneratie en prospectie',
          'Onderhandeling en sluitingstechnieken',
          'Productkennis en presentatie',
          'Marktanalyse en territoriumbeheer',
          'Communicatie en interpersoonlijke vaardigheden'
        ],
        whyGood: [
          'Duidelijke structuur die verkoopprestaties benadrukt',
          'Legt nadruk op meetbare resultaten en doelstellingen',
          'Toont expertise in klantrelaties',
          'Demonstreert kennis van verkoopprocessen',
          'ATS-vriendelijk formaat met verkoopspecifieke zoekwoorden'
        ]
      },
      fr: {
        name: 'Représentant Commercial',
        slug: 'representant-commercial',
        description: 'Les représentants commerciaux établissent des relations avec les clients, identifient leurs besoins et promeuvent des produits ou services. Ils atteignent les objectifs de vente, maintiennent les relations clients et contribuent à la croissance de l\'entreprise grâce à une communication et une négociation efficaces.',
        tips: [
          'Mettez en avant vos réalisations commerciales et objectifs atteints',
          'Soulignez les compétences en gestion de la relation client',
          'Présentez l\'expérience avec les systèmes CRM',
          'Incluez des exemples de stratégies commerciales réussies',
          'Démontrez les capacités de communication et de négociation'
        ],
        skills: [
          'Ventes et développement commercial',
          'Gestion de la relation client (CRM)',
          'Génération de leads et prospection',
          'Techniques de négociation et de clôture',
          'Connaissance des produits et présentation',
          'Analyse de marché et gestion de territoire',
          'Communication et compétences interpersonnelles'
        ],
        whyGood: [
          'Structure claire mettant en évidence les réalisations commerciales',
          'Met l\'accent sur les résultats quantifiables et les objectifs',
          'Montre l\'expertise en relations clients',
          'Démontre la connaissance des processus de vente',
          'Format compatible ATS avec mots-clés spécifiques aux ventes'
        ]
      },
      es: {
        name: 'Representante de Ventas',
        slug: 'representante-ventas',
        description: 'Los representantes de ventas construyen relaciones con clientes, identifican sus necesidades y promueven productos o servicios. Alcanzan objetivos de ventas, mantienen relaciones con clientes y contribuyen al crecimiento del negocio mediante comunicación y negociación efectivas.',
        tips: [
          'Destaca tus logros de ventas y objetivos alcanzados',
          'Enfatiza habilidades de gestión de relaciones con clientes',
          'Muestra experiencia con sistemas CRM',
          'Incluye ejemplos de estrategias de ventas exitosas',
          'Demuestra habilidades de comunicación y negociación'
        ],
        skills: [
          'Ventas y desarrollo de negocios',
          'Gestión de relaciones con clientes (CRM)',
          'Generación de leads y prospección',
          'Técnicas de negociación y cierre',
          'Conocimiento de productos y presentación',
          'Análisis de mercado y gestión de territorio',
          'Comunicación y habilidades interpersonales'
        ],
        whyGood: [
          'Estructura clara que destaca logros de ventas',
          'Enfatiza resultados cuantificables y objetivos',
          'Muestra experiencia en relaciones con clientes',
          'Demuestra conocimiento de procesos de ventas',
          'Formato compatible con ATS con palabras clave específicas de ventas'
        ]
      },
      de: {
        name: 'Verkaufsmitarbeiter',
        slug: 'verkaufsmitarbeiter',
        description: 'Verkaufsmitarbeiter bauen Beziehungen zu Kunden auf, identifizieren deren Bedürfnisse und fördern Produkte oder Dienstleistungen. Sie erreichen Verkaufsziele, pflegen Kundenbeziehungen und tragen zum Geschäftswachstum durch effektive Kommunikation und Verhandlung bei.',
        tips: [
          'Heben Sie Ihre Verkaufserfolge und erreichten Ziele hervor',
          'Betonen Sie Fähigkeiten im Kundenbeziehungsmanagement',
          'Zeigen Sie Erfahrung mit CRM-Systemen',
          'Fügen Sie Beispiele erfolgreicher Verkaufsstrategien hinzu',
          'Demonstrieren Sie Kommunikations- und Verhandlungsfähigkeiten'
        ],
        skills: [
          'Verkauf und Geschäftsentwicklung',
          'Kundenbeziehungsmanagement (CRM)',
          'Lead-Generierung und Akquise',
          'Verhandlungs- und Abschlusstechniken',
          'Produktwissen und Präsentation',
          'Marktanalyse und Gebietsverwaltung',
          'Kommunikation und zwischenmenschliche Fähigkeiten'
        ],
        whyGood: [
          'Klare Struktur, die Verkaufserfolge hervorhebt',
          'Betont quantifizierbare Ergebnisse und Ziele',
          'Zeigt Expertise in Kundenbeziehungen',
          'Demonstriert Wissen über Verkaufsprozesse',
          'ATS-freundliches Format mit verkaufsspezifischen Schlüsselwörtern'
        ]
      },
      it: {
        name: 'Rappresentante Vendite',
        slug: 'rappresentante-vendite',
        description: 'I rappresentanti di vendita costruiscono relazioni con i clienti, identificano le loro esigenze e promuovono prodotti o servizi. Raggiungono obiettivi di vendita, mantengono relazioni con i clienti e contribuiscono alla crescita aziendale attraverso comunicazione e negoziazione efficaci.',
        tips: [
          'Evidenzia i tuoi risultati di vendita e obiettivi raggiunti',
          'Enfatizza le competenze di gestione delle relazioni con i clienti',
          'Mostra esperienza con sistemi CRM',
          'Includi esempi di strategie di vendita di successo',
          'Dimostra capacità di comunicazione e negoziazione'
        ],
        skills: [
          'Vendite e sviluppo commerciale',
          'Gestione delle relazioni con i clienti (CRM)',
          'Generazione di lead e prospezione',
          'Tecniche di negoziazione e chiusura',
          'Conoscenza del prodotto e presentazione',
          'Analisi di mercato e gestione del territorio',
          'Comunicazione e abilità interpersonali'
        ],
        whyGood: [
          'Struttura chiara che evidenzia i risultati di vendita',
          'Enfatizza risultati quantificabili e obiettivi',
          'Mostra esperienza nelle relazioni con i clienti',
          'Dimostra conoscenza dei processi di vendita',
          'Formato compatibile con ATS con parole chiave specifiche per le vendite'
        ]
      },
      pl: {
        name: 'Przedstawiciel Handlowy',
        slug: 'przedstawiciel-handlowy',
        description: 'Przedstawiciele handlowi budują relacje z klientami, identyfikują ich potrzeby i promują produkty lub usługi. Osiągają cele sprzedażowe, utrzymują relacje z klientami i przyczyniają się do wzrostu biznesu poprzez skuteczną komunikację i negocjacje.',
        tips: [
          'Podkreśl swoje osiągnięcia sprzedażowe i osiągnięte cele',
          'Podkreśl umiejętności zarządzania relacjami z klientami',
          'Pokaż doświadczenie z systemami CRM',
          'Uwzględnij przykłady udanych strategii sprzedażowych',
          'Wykazuj umiejętności komunikacyjne i negocjacyjne'
        ],
        skills: [
          'Sprzedaż i rozwój biznesu',
          'Zarządzanie relacjami z klientami (CRM)',
          'Generowanie leadów i pozyskiwanie klientów',
          'Techniki negocjacji i zamykania',
          'Znajomość produktu i prezentacja',
          'Analiza rynku i zarządzanie terytorium',
          'Komunikacja i umiejętności interpersonalne'
        ],
        whyGood: [
          'Jasna struktura podkreślająca osiągnięcia sprzedażowe',
          'Kładzie nacisk na mierzalne wyniki i cele',
          'Pokazuje doświadczenie w relacjach z klientami',
          'Wykazuje znajomość procesów sprzedażowych',
          'Format przyjazny dla ATS z słowami kluczowymi specyficznymi dla sprzedaży'
        ]
      },
      ro: {
        name: 'Reprezentant Vânzări',
        slug: 'reprezentant-vanzari',
        description: 'Reprezentanții de vânzări construiesc relații cu clienții, identifică nevoile acestora și promovează produse sau servicii. Ei ating obiectivele de vânzări, mențin relațiile cu clienții și contribuie la creșterea afacerii prin comunicare și negociere eficiente.',
        tips: [
          'Evidențiază realizările tale de vânzări și obiectivele atinse',
          'Subliniază abilitățile de gestionare a relațiilor cu clienții',
          'Prezintă experiența cu sistemele CRM',
          'Include exemple de strategii de vânzări de succes',
          'Demonstrează abilități de comunicare și negociere'
        ],
        skills: [
          'Vânzări și dezvoltare comercială',
          'Gestionarea relațiilor cu clienții (CRM)',
          'Generarea de lead-uri și prospectare',
          'Tehnici de negociere și închidere',
          'Cunoașterea produsului și prezentare',
          'Analiza pieței și gestionarea teritoriului',
          'Comunicare și abilități interpersonale'
        ],
        whyGood: [
          'Structură clară care evidențiază realizările de vânzări',
          'Subliniază rezultatele măsurabile și obiectivele',
          'Arată experiența în relațiile cu clienții',
          'Demonstrează cunoașterea proceselor de vânzări',
          'Format compatibil cu ATS cu cuvinte cheie specifice vânzărilor'
        ]
      },
      hu: {
        name: 'Értékesítési Képviselő',
        slug: 'ertekesitesi-kepviselo',
        description: 'Az értékesítési képviselők kapcsolatokat építenek ki az ügyfelekkel, azonosítják azok igényeit és termékeket vagy szolgáltatásokat promóznak. Elérik az értékesítési célokat, fenntartják az ügyfélkapcsolatokat és hozzájárulnak az üzleti növekedéshez hatékony kommunikáción és tárgyaláson keresztül.',
        tips: [
          'Hangsúlyozza értékesítési eredményeit és elért céljait',
          'Kiemeli ügyfélkapcsolat-kezelési készségeit',
          'Mutassa be CRM rendszerekkel való tapasztalatát',
          'Tartalmazza sikeres értékesítési stratégiák példáit',
          'Mutassa be kommunikációs és tárgyalási képességeit'
        ],
        skills: [
          'Értékesítés és üzletfejlesztés',
          'Ügyfélkapcsolat-kezelés (CRM)',
          'Lead generálás és leadgenerálás',
          'Tárgyalási és zárási technikák',
          'Terméktudás és bemutatás',
          'Piaci elemzés és területi menedzsment',
          'Kommunikáció és interperszonális készségek'
        ],
        whyGood: [
          'Világos struktúra, amely kiemeli az értékesítési eredményeket',
          'Hangsúlyozza a mérhető eredményeket és célokat',
          'Mutatja az ügyfélkapcsolatokban szerzett szakértelmet',
          'Bebizonyítja az értékesítési folyamatok ismeretét',
          'ATS-barát formátum értékesítésspecifikus kulcsszavakkal'
        ]
      },
      el: {
        name: 'Εκπρόσωπος Πωλήσεων',
        slug: 'ekprosopos-poliseon',
        description: 'Οι εκπρόσωποι πωλήσεων χτίζουν σχέσεις με πελάτες, αναγνωρίζουν τις ανάγκες τους και προωθούν προϊόντα ή υπηρεσίες. Επιτυγχάνουν στόχους πωλήσεων, διατηρούν σχέσεις με πελάτες και συμβάλλουν στην επιχειρηματική ανάπτυξη μέσω αποτελεσματικής επικοινωνίας και διαπραγμάτευσης.',
        tips: [
          'Επισημάνετε τα επιτεύγματά σας στις πωλήσεις και τους επιτευχθέντες στόχους',
          'Τονίστε τις δεξιότητες διαχείρισης σχέσεων πελατών',
          'Παρουσιάστε εμπειρία με συστήματα CRM',
          'Συμπεριλάβετε παραδείγματα επιτυχημένων στρατηγικών πωλήσεων',
          'Αποδείξτε δεξιότητες επικοινωνίας και διαπραγμάτευσης'
        ],
        skills: [
          'Πωλήσεις και επιχειρηματική ανάπτυξη',
          'Διαχείριση σχέσεων πελατών (CRM)',
          'Δημιουργία prospects και αναζήτηση πελατών',
          'Τεχνικές διαπραγμάτευσης και κλεισίματος',
          'Γνώση προϊόντος και παρουσίαση',
          'Ανάλυση αγοράς και διαχείριση περιοχής',
          'Επικοινωνία και διαπροσωπικές δεξιότητες'
        ],
        whyGood: [
          'Σαφής δομή που επισημαίνει τα επιτεύγματα πωλήσεων',
          'Τονίζει μετρήσιμα αποτελέσματα και στόχους',
          'Δείχνει εμπειρία στις σχέσεις πελατών',
          'Αποδεικνύει γνώση των διαδικασιών πωλήσεων',
          'Μορφή συμβατή με ATS με λέξεις-κλειδιά ειδικές για τις πωλήσεις'
        ]
      },
      cs: {
        name: 'Obchodní Zástupce',
        slug: 'obchodni-zastupce',
        description: 'Obchodní zástupci budují vztahy se zákazníky, identifikují jejich potřeby a propagují produkty nebo služby. Dosahují prodejních cílů, udržují vztahy se zákazníky a přispívají k růstu podniku prostřednictvím efektivní komunikace a vyjednávání.',
        tips: [
          'Zdůrazněte své prodejní úspěchy a dosažené cíle',
          'Zdůrazněte dovednosti v řízení vztahů se zákazníky',
          'Ukažte zkušenosti se systémy CRM',
          'Zahrňte příklady úspěšných prodejních strategií',
          'Prokažte komunikační a vyjednávací schopnosti'
        ],
        skills: [
          'Prodej a obchodní rozvoj',
          'Řízení vztahů se zákazníky (CRM)',
          'Generování leadů a prospekce',
          'Vyjednávací a uzavírací techniky',
          'Znalost produktu a prezentace',
          'Analýza trhu a řízení teritoria',
          'Komunikace a interpersonální dovednosti'
        ],
        whyGood: [
          'Jasná struktura zdůrazňující prodejní úspěchy',
          'Zdůrazňuje měřitelné výsledky a cíle',
          'Ukazuje odbornost ve vztazích se zákazníky',
          'Prokazuje znalost prodejních procesů',
          'Formát kompatibilní s ATS s prodejními klíčovými slovy'
        ]
      },
      pt: {
        name: 'Representante de Vendas',
        slug: 'representante-vendas',
        description: 'Representantes de vendas constroem relacionamentos com clientes, identificam suas necessidades e promovem produtos ou serviços. Eles atingem metas de vendas, mantêm relacionamentos com clientes e contribuem para o crescimento do negócio através de comunicação e negociação eficazes.',
        tips: [
          'Destaque suas conquistas de vendas e metas atingidas',
          'Enfatize habilidades de gestão de relacionamento com clientes',
          'Mostre experiência com sistemas CRM',
          'Inclua exemplos de estratégias de vendas bem-sucedidas',
          'Demonstre habilidades de comunicação e negociação'
        ],
        skills: [
          'Vendas e desenvolvimento de negócios',
          'Gestão de relacionamento com clientes (CRM)',
          'Geração de leads e prospecção',
          'Técnicas de negociação e fechamento',
          'Conhecimento de produtos e apresentação',
          'Análise de mercado e gestão de território',
          'Comunicação e habilidades interpessoais'
        ],
        whyGood: [
          'Estrutura clara destacando conquistas de vendas',
          'Enfatiza resultados mensuráveis e metas',
          'Mostra experiência em relacionamentos com clientes',
          'Demonstra conhecimento de processos de vendas',
          'Formato compatível com ATS com palavras-chave específicas de vendas'
        ]
      },
      sv: {
        name: 'Säljare',
        slug: 'saljare',
        description: 'Säljare bygger relationer med kunder, identifierar deras behov och främjar produkter eller tjänster. De uppnår försäljningsmål, upprätthåller kundrelationer och bidrar till affärstillväxt genom effektiv kommunikation och förhandling.',
        tips: [
          'Framhäv dina försäljningsframgångar och uppnådda mål',
          'Betona färdigheter i kundrelationshantering',
          'Visa erfarenhet av CRM-system',
          'Inkludera exempel på framgångsrika försäljningsstrategier',
          'Visa kommunikations- och förhandlingsförmågor'
        ],
        skills: [
          'Försäljning och affärsutveckling',
          'Kundrelationshantering (CRM)',
          'Leadgenerering och prospektering',
          'Förhandlingstekniker och avslutning',
          'Produktkunskap och presentation',
          'Marknadsanalys och territorieförvaltning',
          'Kommunikation och interpersonella färdigheter'
        ],
        whyGood: [
          'Tydlig struktur som framhäver försäljningsframgångar',
          'Betona mätbara resultat och mål',
          'Visar expertis inom kundrelationer',
          'Demonstrerar kunskap om försäljningsprocesser',
          'ATS-vänligt format med försäljningsspecifika nyckelord'
        ]
      },
      bg: {
        name: 'Търговски Представител',
        slug: 'targovski-predstavitel',
        description: 'Търговските представители изграждат взаимоотношения с клиенти, идентифицират техните нужди и популяризират продукти или услуги. Те постигат продажбени цели, поддържат клиентски взаимоотношения и допринасят за бизнес растеж чрез ефективна комуникация и преговори.',
        tips: [
          'Подчертайте вашите продажбени постижения и постигнати цели',
          'Акцентирайте върху уменията за управление на клиентски взаимоотношения',
          'Покажете опит със системи CRM',
          'Включете примери за успешни продажбени стратегии',
          'Демонстрирайте комуникативни и преговорни умения'
        ],
        skills: [
          'Продажби и бизнес развитие',
          'Управление на клиентски взаимоотношения (CRM)',
          'Генериране на потенциални клиенти и проучване',
          'Техники за преговори и приключване',
          'Познаване на продукта и представяне',
          'Анализ на пазара и управление на територия',
          'Комуникация и междуличностни умения'
        ],
        whyGood: [
          'Ясна структура, която подчертава продажбените постижения',
          'Акцентира върху измерими резултати и цели',
          'Показва опит в клиентски взаимоотношения',
          'Демонстрира познаване на продажбените процеси',
          'Формат, съвместим с ATS, с продажбени ключови думи'
        ]
      },
      da: {
        name: 'Salgsrepræsentant',
        slug: 'salgsrepresentant',
        description: 'Salgsrepræsentanter bygger relationer med kunder, identificerer deres behov og promoverer produkter eller tjenester. De opnår salgsmål, opretholder kunderelationer og bidrager til forretningsvækst gennem effektiv kommunikation og forhandling.',
        tips: [
          'Fremhæv dine salgsresultater og opnåede mål',
          'Fremhæv færdigheder i kunderelationsstyring',
          'Vis erfaring med CRM-systemer',
          'Inkluder eksempler på succesfulde salgsstrategier',
          'Demonstrer kommunikations- og forhandlingsfærdigheder'
        ],
        skills: [
          'Salg og forretningsudvikling',
          'Kunderelationsstyring (CRM)',
          'Leadgenerering og prospektering',
          'Forhandlingsteknikker og afslutning',
          'Produktviden og præsentation',
          'Markedsanalyse og territorieforvaltning',
          'Kommunikation og interpersonelle færdigheder'
        ],
        whyGood: [
          'Tydelig struktur, der fremhæver salgsresultater',
          'Fremhæver målbare resultater og mål',
          'Viser ekspertise inden for kunderelationer',
          'Demonstrerer viden om salgsprocesser',
          'ATS-venligt format med salgsspecifikke nøgleord'
        ]
      },
      fi: {
        name: 'Myyntiedustaja',
        slug: 'myyntiedustaja',
        description: 'Myyntiedustajat rakentavat suhteita asiakkaille, tunnistavat heidän tarpeensa ja edistävät tuotteita tai palveluita. He saavuttavat myyntitavoitteet, ylläpitävät asiakassuhteita ja edistävät liiketoiminnan kasvua tehokkaan viestinnän ja neuvottelun kautta.',
        tips: [
          'Korosta myyntisaavutuksiasi ja saavutettuja tavoitteita',
          'Korosta asiakassuhteiden hallintataitoja',
          'Näytä kokemus CRM-järjestelmillä',
          'Sisällytä esimerkkejä menestyksekkäistä myyntistrategioista',
          'Näytä viestintä- ja neuvottelutaitoja'
        ],
        skills: [
          'Myynti ja liiketoiminnan kehitys',
          'Asiakassuhteiden hallinta (CRM)',
          'Liidien generointi ja etsintä',
          'Neuvottelutekniikat ja sulkeminen',
          'Tuotetietous ja esittely',
          'Markkina-analyysi ja aluehallinta',
          'Viestintä ja vuorovaikutustaidot'
        ],
        whyGood: [
          'Selkeä rakenne, joka korostaa myyntisaavutuksia',
          'Korostaa mitattavia tuloksia ja tavoitteita',
          'Näyttää asiantuntemusta asiakassuhteissa',
          'Näyttää tietämystä myyntiprosesseista',
          'ATS-yhteensopiva muoto myyntispesifisillä avainsanoilla'
        ]
      },
      sk: {
        name: 'Obchodný Zástupca',
        slug: 'obchodny-zastupca',
        description: 'Obchodní zástupcovia budujú vzťahy so zákazníkmi, identifikujú ich potreby a propagujú produkty alebo služby. Dosahujú predajné ciele, udržiavajú vzťahy so zákazníkmi a prispievajú k rastu podniku prostredníctvom efektívnej komunikácie a vyjednávania.',
        tips: [
          'Zdôraznite svoje predajné úspechy a dosiahnuté ciele',
          'Zdôraznite zručnosti v riadení vzťahov so zákazníkmi',
          'Ukážte skúsenosti so systémami CRM',
          'Zahrňte príklady úspešných predajných stratégií',
          'Preukážte komunikačné a vyjednávacie schopnosti'
        ],
        skills: [
          'Predaj a obchodný rozvoj',
          'Riadenie vzťahov so zákazníkmi (CRM)',
          'Generovanie leadov a prospekcia',
          'Vyjednávacie a uzatváracie techniky',
          'Znalosť produktu a prezentácia',
          'Analýza trhu a riadenie územia',
          'Komunikácia a interpersonálne zručnosti'
        ],
        whyGood: [
          'Jasná štruktúra zdôrazňujúca predajné úspechy',
          'Zdôrazňuje merateľné výsledky a ciele',
          'Ukazuje odbornosť vo vzťahoch so zákazníkmi',
          'Preukazuje znalosť predajných procesov',
          'Formát kompatibilný s ATS s predajnými kľúčovými slovami'
        ]
      },
      no: {
        name: 'Salgsrepresentant',
        slug: 'salgsrepresentant',
        description: 'Salgsrepresentanter bygger relasjoner med kunder, identifiserer deres behov og fremmer produkter eller tjenester. De oppnår salgsmål, opprettholder kunderelasjoner og bidrar til forretningsvekst gjennom effektiv kommunikasjon og forhandling.',
        tips: [
          'Fremhev dine salgsresultater og oppnådde mål',
          'Fremhev ferdigheter i kunderelasjonsstyring',
          'Vis erfaring med CRM-systemer',
          'Inkluder eksempler på vellykkede salgsstrategier',
          'Demonstrer kommunikasjons- og forhandlingsferdigheter'
        ],
        skills: [
          'Salg og forretningsutvikling',
          'Kunderelasjonsstyring (CRM)',
          'Leadgenerering og prospektering',
          'Forhandlingsteknikker og avslutning',
          'Produktkunnskap og presentasjon',
          'Markedsanalyse og territorieforvaltning',
          'Kommunikasjon og interpersonelle ferdigheter'
        ],
        whyGood: [
          'Tydelig struktur som fremhever salgsresultater',
          'Fremhever målbare resultater og mål',
          'Viser ekspertise innen kunderelasjoner',
          'Demonstrerer kunnskap om salgsprosesser',
          'ATS-vennlig format med salgsspesifikke nøkkelord'
        ]
      },
      hr: {
        name: 'Prodajni Predstavnik',
        slug: 'prodajni-predstavnik',
        description: 'Prodajni predstavnici grade odnose s klijentima, identificiraju njihove potrebe i promoviraju proizvode ili usluge. Postižu prodajne ciljeve, održavaju odnose s klijentima i pridonose rastu poslovanja kroz učinkovitu komunikaciju i pregovaranje.',
        tips: [
          'Istaknite svoje prodajne uspjehe i postignute ciljeve',
          'Naglasite vještine upravljanja odnosima s klijentima',
          'Pokažite iskustvo s CRM sustavima',
          'Uključite primjere uspješnih prodajnih strategija',
          'Pokažite komunikacijske i pregovaračke vještine'
        ],
        skills: [
          'Prodaja i razvoj poslovanja',
          'Upravljanje odnosima s klijentima (CRM)',
          'Generiranje potencijalnih klijenata i istraživanje',
          'Pregovaračke tehnike i zatvaranje',
          'Poznavanje proizvoda i prezentacija',
          'Analiza tržišta i upravljanje teritorijem',
          'Komunikacija i međuljudske vještine'
        ],
        whyGood: [
          'Jasna struktura koja ističe prodajne uspjehe',
          'Naglašava mjerljive rezultate i ciljeve',
          'Prikazuje stručnost u odnosima s klijentima',
          'Pokazuje znanje o prodajnim procesima',
          'Format kompatibilan s ATS s prodajnim ključnim riječima'
        ]
      },
      sr: {
        name: 'Продајни Представник',
        slug: 'prodajni-predstavnik',
        description: 'Продајни представници граде односе са клијентима, идентификују њихове потребе и промовишу производе или услуге. Постижу продајне циљеве, одржавају односе са клијентима и доприносе расту пословања кроз ефикасну комуникацију и преговарање.',
        tips: [
          'Истакните своје продајне успехе и постигнуте циљеве',
          'Нагласите вештине управљања односима са клијентима',
          'Покажите искуство са CRM системима',
          'Укључите примере успешних продајних стратегија',
          'Покажите комуникационе и преговарачке вештине'
        ],
        skills: [
          'Продаја и развој пословања',
          'Управљање односима са клијентима (CRM)',
          'Генерисање потенцијалних клијената и истраживање',
          'Преговарачке технике и затварање',
          'Познавање производа и презентација',
          'Анализа тржишта и управљање територијом',
          'Комуникација и међуљудске вештине'
        ],
        whyGood: [
          'Јасна структура која истиче продајне успехе',
          'Наглашава мерљиве резултате и циљеве',
          'Приказује стручност у односима са клијентима',
          'Показује знање о продајним процесима',
          'Формат компатибилан са ATS са продајним кључним речима'
        ]
      }
    }
  },
  {
    id: 'chef',
    category: 'hospitality',
    translations: {
      en: {
        name: 'Chef',
        slug: 'chef',
        description: 'Chefs create and prepare meals, manage kitchen operations, and ensure food quality and safety. They develop menus, train kitchen staff, and maintain high standards of culinary excellence while managing costs and inventory.',
        tips: [
          'Highlight your culinary training and certifications',
          'Emphasize experience with different cuisines and cooking techniques',
          'Showcase menu development and food cost management',
          'Include experience with kitchen management and staff training',
          'Demonstrate knowledge of food safety and hygiene standards'
        ],
        skills: [
          'Culinary arts and cooking techniques',
          'Menu planning and development',
          'Kitchen management and operations',
          'Food safety and hygiene (HACCP)',
          'Cost control and inventory management',
          'Staff training and supervision',
          'Quality assurance and presentation'
        ],
        whyGood: [
          'Clear structure highlighting culinary qualifications',
          'Emphasizes experience with diverse cuisines',
          'Shows kitchen management and leadership skills',
          'Demonstrates food safety knowledge',
          'ATS-friendly format with hospitality-specific keywords'
        ]
      },
      nl: {
        name: 'Chef-kok',
        slug: 'chef-kok',
        description: 'Chef-koks creëren en bereiden maaltijden, beheren keukenoperaties en zorgen voor voedselkwaliteit en -veiligheid. Ze ontwikkelen menu\'s, trainen keukenpersoneel en handhaven hoge normen van culinaire excellentie terwijl ze kosten en voorraad beheren.',
        tips: [
          'Benadruk je culinaire opleiding en certificeringen',
          'Leg nadruk op ervaring met verschillende keukens en kooktechnieken',
          'Toon menuontwikkeling en voedselkostenbeheer',
          'Vermeld ervaring met keukenbeheer en personeelstraining',
          'Demonstreer kennis van voedselveiligheid en hygiënestandaarden'
        ],
        skills: [
          'Culinaire kunsten en kooktechnieken',
          'Menuplanning en -ontwikkeling',
          'Keukenbeheer en -operaties',
          'Voedselveiligheid en hygiëne (HACCP)',
          'Kostenbeheer en voorraadbeheer',
          'Personeelstraining en toezicht',
          'Kwaliteitsborging en presentatie'
        ],
        whyGood: [
          'Duidelijke structuur die culinaire kwalificaties benadrukt',
          'Legt nadruk op ervaring met diverse keukens',
          'Toont keukenbeheer en leiderschapsvaardigheden',
          'Demonstreert kennis van voedselveiligheid',
          'ATS-vriendelijk formaat met horecaspecifieke zoekwoorden'
        ]
      },
      fr: {
        name: 'Chef Cuisinier',
        slug: 'chef-cuisinier',
        description: 'Les chefs créent et préparent des repas, gèrent les opérations de cuisine et assurent la qualité et la sécurité alimentaires. Ils développent des menus, forment le personnel de cuisine et maintiennent des normes élevées d\'excellence culinaire tout en gérant les coûts et les stocks.',
        tips: [
          'Mettez en avant votre formation culinaire et certifications',
          'Soulignez l\'expérience avec différentes cuisines et techniques de cuisson',
          'Présentez le développement de menus et la gestion des coûts alimentaires',
          'Incluez l\'expérience en gestion de cuisine et formation du personnel',
          'Démontrez la connaissance des normes de sécurité et d\'hygiène alimentaires'
        ],
        skills: [
          'Arts culinaires et techniques de cuisson',
          'Planification et développement de menus',
          'Gestion et opérations de cuisine',
          'Sécurité et hygiène alimentaires (HACCP)',
          'Contrôle des coûts et gestion des stocks',
          'Formation et supervision du personnel',
          'Assurance qualité et présentation'
        ],
        whyGood: [
          'Structure claire mettant en évidence les qualifications culinaires',
          'Met l\'accent sur l\'expérience avec diverses cuisines',
          'Montre les compétences en gestion de cuisine et leadership',
          'Démontre la connaissance de la sécurité alimentaire',
          'Format compatible ATS avec mots-clés spécifiques à l\'hôtellerie'
        ]
      },
      es: {
        name: 'Chef',
        slug: 'chef',
        description: 'Los chefs crean y preparan comidas, gestionan operaciones de cocina y aseguran la calidad y seguridad de los alimentos. Desarrollan menús, capacitan al personal de cocina y mantienen altos estándares de excelencia culinaria mientras gestionan costos e inventario.',
        tips: [
          'Destaca tu formación culinaria y certificaciones',
          'Enfatiza experiencia con diferentes cocinas y técnicas culinarias',
          'Muestra desarrollo de menús y gestión de costos de alimentos',
          'Incluye experiencia con gestión de cocina y capacitación de personal',
          'Demuestra conocimiento de estándares de seguridad e higiene alimentaria'
        ],
        skills: [
          'Artes culinarias y técnicas de cocina',
          'Planificación y desarrollo de menús',
          'Gestión y operaciones de cocina',
          'Seguridad e higiene alimentaria (HACCP)',
          'Control de costos y gestión de inventario',
          'Capacitación y supervisión de personal',
          'Aseguramiento de calidad y presentación'
        ],
        whyGood: [
          'Estructura clara que destaca calificaciones culinarias',
          'Enfatiza experiencia con diversas cocinas',
          'Muestra habilidades de gestión de cocina y liderazgo',
          'Demuestra conocimiento de seguridad alimentaria',
          'Formato compatible con ATS con palabras clave específicas de hostelería'
        ]
      },
      de: {
        name: 'Koch',
        slug: 'koch',
        description: 'Köche erstellen und bereiten Mahlzeiten zu, verwalten Küchenbetriebe und gewährleisten Lebensmittelqualität und -sicherheit. Sie entwickeln Menüs, schulen Küchenpersonal und halten hohe Standards kulinarischer Exzellenz aufrecht, während sie Kosten und Inventar verwalten.',
        tips: [
          'Heben Sie Ihre kulinarische Ausbildung und Zertifizierungen hervor',
          'Betonen Sie Erfahrung mit verschiedenen Küchen und Kochtechniken',
          'Zeigen Sie Menüentwicklung und Lebensmittelkostenmanagement',
          'Fügen Sie Erfahrung mit Küchenmanagement und Personalschulung hinzu',
          'Demonstrieren Sie Kenntnisse der Lebensmittelsicherheit und Hygienestandards'
        ],
        skills: [
          'Kulinarische Künste und Kochtechniken',
          'Menüplanung und -entwicklung',
          'Küchenmanagement und -betrieb',
          'Lebensmittelsicherheit und Hygiene (HACCP)',
          'Kostenkontrolle und Bestandsverwaltung',
          'Personalschulung und -aufsicht',
          'Qualitätssicherung und Präsentation'
        ],
        whyGood: [
          'Klare Struktur, die kulinarische Qualifikationen hervorhebt',
          'Betont Erfahrung mit verschiedenen Küchen',
          'Zeigt Küchenmanagement- und Führungsfähigkeiten',
          'Demonstriert Kenntnisse der Lebensmittelsicherheit',
          'ATS-freundliches Format mit gastgewerbespezifischen Schlüsselwörtern'
        ]
      },
      it: {
        name: 'Chef',
        slug: 'chef',
        description: 'Gli chef creano e preparano pasti, gestiscono le operazioni di cucina e assicurano qualità e sicurezza alimentare. Sviluppano menu, formano il personale di cucina e mantengono elevati standard di eccellenza culinaria gestendo costi e inventario.',
        tips: [
          'Evidenzia la tua formazione culinaria e certificazioni',
          'Enfatizza esperienza con diverse cucine e tecniche di cottura',
          'Mostra sviluppo del menu e gestione dei costi alimentari',
          'Includi esperienza con gestione della cucina e formazione del personale',
          'Dimostra conoscenza degli standard di sicurezza e igiene alimentare'
        ],
        skills: [
          'Arti culinarie e tecniche di cottura',
          'Pianificazione e sviluppo del menu',
          'Gestione e operazioni di cucina',
          'Sicurezza e igiene alimentare (HACCP)',
          'Controllo dei costi e gestione dell\'inventario',
          'Formazione e supervisione del personale',
          'Assicurazione qualità e presentazione'
        ],
        whyGood: [
          'Struttura chiara che evidenzia qualifiche culinarie',
          'Enfatizza esperienza con diverse cucine',
          'Mostra competenze di gestione della cucina e leadership',
          'Dimostra conoscenza della sicurezza alimentare',
          'Formato compatibile con ATS con parole chiave specifiche per l\'ospitalità'
        ]
      },
      pl: {
        name: 'Szef Kuchni',
        slug: 'szef-kuchni',
        description: 'Szefowie kuchni tworzą i przygotowują posiłki, zarządzają operacjami kuchennymi i zapewniają jakość i bezpieczeństwo żywności. Rozwijają menu, szkolą personel kuchenny i utrzymują wysokie standardy doskonałości kulinarnej, zarządzając kosztami i zapasami.',
        tips: [
          'Podkreśl swoje szkolenie kulinarne i certyfikaty',
          'Podkreśl doświadczenie z różnymi kuchniami i technikami gotowania',
          'Pokaż rozwój menu i zarządzanie kosztami żywności',
          'Uwzględnij doświadczenie z zarządzaniem kuchnią i szkoleniem personelu',
          'Wykazuj znajomość standardów bezpieczeństwa i higieny żywności'
        ],
        skills: [
          'Sztuka kulinarna i techniki gotowania',
          'Planowanie i rozwój menu',
          'Zarządzanie i operacje kuchenne',
          'Bezpieczeństwo i higiena żywności (HACCP)',
          'Kontrola kosztów i zarządzanie zapasami',
          'Szkolenie i nadzór personelu',
          'Zapewnienie jakości i prezentacja'
        ],
        whyGood: [
          'Jasna struktura podkreślająca kwalifikacje kulinarne',
          'Kładzie nacisk na doświadczenie z różnymi kuchniami',
          'Pokazuje umiejętności zarządzania kuchnią i przywództwa',
          'Wykazuje znajomość bezpieczeństwa żywności',
          'Format przyjazny dla ATS z słowami kluczowymi specyficznymi dla gastronomii'
        ]
      },
      ro: {
        name: 'Bucătar Șef',
        slug: 'bucatar-sef',
        description: 'Bucătarii șefi creează și pregătesc mese, gestionează operațiunile de bucătărie și asigură calitatea și siguranța alimentelor. Ei dezvoltă meniuri, instruiesc personalul de bucătărie și mențin standarde înalte de excelență culinară gestionând costurile și inventarul.',
        tips: [
          'Evidențiază formarea ta culinară și certificările',
          'Subliniază experiența cu diferite bucătării și tehnici de gătit',
          'Prezintă dezvoltarea meniului și gestionarea costurilor alimentare',
          'Include experiența cu gestionarea bucătăriei și formarea personalului',
          'Demonstrează cunoașterea standardelor de siguranță și igienă alimentară'
        ],
        skills: [
          'Arte culinare și tehnici de gătit',
          'Planificarea și dezvoltarea meniului',
          'Gestionarea și operațiunile bucătăriei',
          'Siguranța și igiena alimentară (HACCP)',
          'Controlul costurilor și gestionarea inventarului',
          'Formarea și supravegherea personalului',
          'Asigurarea calității și prezentarea'
        ],
        whyGood: [
          'Structură clară care evidențiază calificările culinare',
          'Subliniază experiența cu diverse bucătării',
          'Arată abilități de gestionare a bucătăriei și leadership',
          'Demonstrează cunoașterea siguranței alimentare',
          'Format compatibil cu ATS cu cuvinte cheie specifice ospitalității'
        ]
      },
      hu: {
        name: 'Séf',
        slug: 'sef',
        description: 'A séfek ételt készítenek és készítenek elő, kezelik a konyha műveleteit és biztosítják az élelmiszer minőségét és biztonságát. Menüket fejlesztenek, konyhai személyzetet képeznek és magas színvonalú kulináris kiválóságot tartanak fenn, miközben költségeket és készletet kezelnek.',
        tips: [
          'Hangsúlyozza kulináris képzését és tanúsítványait',
          'Kiemeli különböző konyhák és főzési technikák tapasztalatát',
          'Mutatja be a menüfejlesztést és az élelmiszerköltség-kezelést',
          'Tartalmazza a konyhakezelés és személyzetképzés tapasztalatát',
          'Mutassa be az élelmiszerbiztonsági és higiéniai szabványok ismeretét'
        ],
        skills: [
          'Kulináris művészetek és főzési technikák',
          'Menütervezés és fejlesztés',
          'Konyhakezelés és műveletek',
          'Élelmiszerbiztonság és higiénia (HACCP)',
          'Költségkontroll és készletkezelés',
          'Személyzetképzés és felügyelet',
          'Minőségbiztosítás és prezentáció'
        ],
        whyGood: [
          'Világos struktúra, amely kiemeli a kulináris kvalifikációkat',
          'Hangsúlyozza a különböző konyhákkal szerzett tapasztalatot',
          'Mutatja a konyhakezelés és vezetői készségeket',
          'Bebizonyítja az élelmiszerbiztonsági ismereteket',
          'ATS-barát formátum vendéglátásspecifikus kulcsszavakkal'
        ]
      },
      el: {
        name: 'Σεφ',
        slug: 'sef',
        description: 'Οι σεφ δημιουργούν και προετοιμάζουν γεύματα, διαχειρίζονται τις λειτουργίες της κουζίνας και διασφαλίζουν την ποιότητα και ασφάλεια των τροφίμων. Αναπτύσσουν μενού, εκπαιδεύουν το προσωπικό της κουζίνας και διατηρούν υψηλά πρότυπα γαστρονομικής αριστείας διαχειριζόμενοι το κόστος και το απόθεμα.',
        tips: [
          'Επισημάνετε τη γαστρονομική σας εκπαίδευση και πιστοποιήσεις',
          'Τονίστε εμπειρία με διαφορετικές κουζίνες και τεχνικές μαγειρικής',
          'Παρουσιάστε την ανάπτυξη μενού και τη διαχείριση κόστους τροφίμων',
          'Συμπεριλάβετε εμπειρία με τη διαχείριση κουζίνας και την εκπαίδευση προσωπικού',
          'Αποδείξτε γνώση των προτύπων ασφάλειας και υγιεινής τροφίμων'
        ],
        skills: [
          'Γαστρονομικές τέχνες και τεχνικές μαγειρικής',
          'Σχεδιασμός και ανάπτυξη μενού',
          'Διαχείριση και λειτουργίες κουζίνας',
          'Ασφάλεια και υγιεινή τροφίμων (HACCP)',
          'Έλεγχος κόστους και διαχείριση αποθέματος',
          'Εκπαίδευση και επίβλεψη προσωπικού',
          'Διασφάλιση ποιότητας και παρουσίαση'
        ],
        whyGood: [
          'Σαφής δομή που επισημαίνει τις γαστρονομικές προσόντα',
          'Τονίζει εμπειρία με διαφορετικές κουζίνες',
          'Δείχνει δεξιότητες διαχείρισης κουζίνας και ηγεσίας',
          'Αποδεικνύει γνώση ασφάλειας τροφίμων',
          'Μορφή συμβατή με ATS με λέξεις-κλειδιά ειδικές για τη φιλοξενία'
        ]
      },
      cs: {
        name: 'Šéfkuchař',
        slug: 'sefkuchar',
        description: 'Šéfkuchaři vytvářejí a připravují jídla, řídí provoz kuchyně a zajišťují kvalitu a bezpečnost potravin. Vyvíjejí menu, školí kuchyňský personál a udržují vysoké standardy kulinářské excelence při řízení nákladů a zásob.',
        tips: [
          'Zdůrazněte své kulinářské vzdělání a certifikace',
          'Zdůrazněte zkušenosti s různými kuchyněmi a technikami vaření',
          'Ukažte vývoj menu a řízení nákladů na potraviny',
          'Zahrňte zkušenosti s řízením kuchyně a školením personálu',
          'Prokažte znalost standardů bezpečnosti a hygieny potravin'
        ],
        skills: [
          'Kulinářské umění a techniky vaření',
          'Plánování a vývoj menu',
          'Řízení a provoz kuchyně',
          'Bezpečnost a hygiena potravin (HACCP)',
          'Kontrola nákladů a řízení zásob',
          'Školení a dohled personálu',
          'Zajištění kvality a prezentace'
        ],
        whyGood: [
          'Jasná struktura zdůrazňující kulinářské kvalifikace',
          'Zdůrazňuje zkušenosti s různými kuchyněmi',
          'Ukazuje dovednosti v řízení kuchyně a vedení',
          'Prokazuje znalost bezpečnosti potravin',
          'Formát kompatibilní s ATS s klíčovými slovy specifickými pro pohostinství'
        ]
      },
      pt: {
        name: 'Chef',
        slug: 'chef',
        description: 'Chefs criam e preparam refeições, gerenciam operações de cozinha e garantem qualidade e segurança alimentar. Eles desenvolvem cardápios, treinam equipe de cozinha e mantêm altos padrões de excelência culinária enquanto gerenciam custos e inventário.',
        tips: [
          'Destaque seu treinamento culinário e certificações',
          'Enfatize experiência com diferentes cozinhas e técnicas culinárias',
          'Mostre desenvolvimento de cardápio e gestão de custos alimentares',
          'Inclua experiência com gestão de cozinha e treinamento de equipe',
          'Demonstre conhecimento de padrões de segurança e higiene alimentar'
        ],
        skills: [
          'Artes culinárias e técnicas de cozinha',
          'Planejamento e desenvolvimento de cardápio',
          'Gestão e operações de cozinha',
          'Segurança e higiene alimentar (HACCP)',
          'Controle de custos e gestão de inventário',
          'Treinamento e supervisão de equipe',
          'Garantia de qualidade e apresentação'
        ],
        whyGood: [
          'Estrutura clara destacando qualificações culinárias',
          'Enfatiza experiência com diversas cozinhas',
          'Mostra habilidades de gestão de cozinha e liderança',
          'Demonstra conhecimento de segurança alimentar',
          'Formato compatível com ATS com palavras-chave específicas de hospitalidade'
        ]
      },
      sv: {
        name: 'Kock',
        slug: 'kock',
        description: 'Kockar skapar och förbereder måltider, hanterar köksverksamhet och säkerställer livsmedelskvalitet och säkerhet. De utvecklar menyer, utbildar kökspersonal och upprätthåller höga standarder för kulinarisk excellens samtidigt som de hanterar kostnader och lager.',
        tips: [
          'Framhäv din kulinariska utbildning och certifieringar',
          'Betona erfarenhet med olika kök och matlagningstekniker',
          'Visa menyutveckling och livsmedelskostnadshantering',
          'Inkludera erfarenhet av kökshantering och personalutbildning',
          'Visa kunskap om livsmedelssäkerhets- och hygienstandarder'
        ],
        skills: [
          'Kulinarisk konst och matlagningstekniker',
          'Menyplanering och utveckling',
          'Kökshantering och verksamhet',
          'Livsmedelssäkerhet och hygien (HACCP)',
          'Kostnadskontroll och lagerhantering',
          'Personalutbildning och övervakning',
          'Kvalitetssäkring och presentation'
        ],
        whyGood: [
          'Tydlig struktur som framhäver kulinariska kvalifikationer',
          'Betona erfarenhet med olika kök',
          'Visar kökshanterings- och ledarskapsfärdigheter',
          'Demonstrerar kunskap om livsmedelssäkerhet',
          'ATS-vänligt format med gästgiverispecifika nyckelord'
        ]
      },
      bg: {
        name: 'Готвач',
        slug: 'gotvach',
        description: 'Готвачите създават и приготвят ястия, управляват операциите в кухнята и осигуряват качеството и безопасността на храните. Те разработват менюта, обучават кухненския персонал и поддържат високи стандарти на кулинарно майсторство, като управляват разходите и инвентара.',
        tips: [
          'Подчертайте кулинарното си обучение и сертификати',
          'Акцентирайте върху опита с различни кухни и техники за готвене',
          'Покажете разработване на меню и управление на разходите за храна',
          'Включете опит с управление на кухня и обучение на персонал',
          'Демонстрирайте познаване на стандартите за безопасност и хигиена на храните'
        ],
        skills: [
          'Кулинарни изкуства и техники за готвене',
          'Планиране и разработване на меню',
          'Управление и операции в кухнята',
          'Безопасност и хигиена на храните (HACCP)',
          'Контрол на разходите и управление на инвентар',
          'Обучение и надзор на персонал',
          'Осигуряване на качество и представяне'
        ],
        whyGood: [
          'Ясна структура, която подчертава кулинарните квалификации',
          'Акцентира върху опита с различни кухни',
          'Показва умения за управление на кухня и лидерство',
          'Демонстрира познаване на безопасността на храните',
          'Формат, съвместим с ATS, с ключови думи специфични за хотелиерството'
        ]
      },
      da: {
        name: 'Kok',
        slug: 'kok',
        description: 'Kokke skaber og forbereder måltider, administrerer køkkenoperationer og sikrer fødevarekvalitet og -sikkerhed. De udvikler menuer, træner køkkenpersonale og opretholder høje standarder for kulinarisk ekspertise, mens de administrerer omkostninger og lager.',
        tips: [
          'Fremhæv din kulinariske uddannelse og certificeringer',
          'Fremhæv erfaring med forskellige køkkener og madlavningstekniker',
          'Vis menuudvikling og fødevareomkostningsstyring',
          'Inkluder erfaring med køkkenledelse og personaleuddannelse',
          'Demonstrer viden om fødevaresikkerheds- og hygiejnestandarder'
        ],
        skills: [
          'Kulinariske kunster og madlavningstekniker',
          'Menuplanlægning og -udvikling',
          'Køkkenledelse og -drift',
          'Fødevaresikkerhed og hygiejne (HACCP)',
          'Omkostningskontrol og lagerstyring',
          'Personaleuddannelse og tilsyn',
          'Kvalitetssikring og præsentation'
        ],
        whyGood: [
          'Tydelig struktur, der fremhæver kulinariske kvalifikationer',
          'Fremhæver erfaring med forskellige køkkener',
          'Viser køkkenledelses- og lederskabsfærdigheder',
          'Demonstrer viden om fødevaresikkerhed',
          'ATS-venligt format med gæstgiverispecifikke nøgleord'
        ]
      },
      fi: {
        name: 'Kokki',
        slug: 'kokki',
        description: 'Kokit luovat ja valmistavat aterioita, hallitsevat keittiötoimintoja ja varmistavat ruoan laadun ja turvallisuuden. He kehittävät ruokalistoja, kouluttavat keittiöhenkilöstöä ja ylläpitävät korkeita kulinarisen huippuosaamisen standardeja halliten kustannuksia ja varastoja.',
        tips: [
          'Korosta kulinarista koulutustasi ja sertifikaatteja',
          'Korosta kokemusta eri keittiöistä ja keittotekniikoista',
          'Näytä ruokalistojen kehitys ja ruokakustannusten hallinta',
          'Sisällytä kokemus keittiön hallinnasta ja henkilöstön koulutuksesta',
          'Näytä tietämys ruoanturvallisuus- ja hygieniastandardeista'
        ],
        skills: [
          'Kulinariset taidot ja keittotekniikat',
          'Ruokalistojen suunnittelu ja kehitys',
          'Keittiön hallinta ja toiminnot',
          'Ruanturvallisuus ja hygienia (HACCP)',
          'Kustannushallinta ja varastonhallinta',
          'Henkilöstön koulutus ja valvonta',
          'Laadunvarmistus ja esittely'
        ],
        whyGood: [
          'Selkeä rakenne, joka korostaa kulinarisia kvalifikaatioita',
          'Korostaa kokemusta eri keittiöistä',
          'Näyttää keittiön hallinta- ja johtamistaidoista',
          'Näyttää tietämystä ruoanturvallisuudesta',
          'ATS-yhteensopiva muoto majoitusalanspesifisillä avainsanoilla'
        ]
      },
      sk: {
        name: 'Kuchár',
        slug: 'kuchar',
        description: 'Kuchári vytvárajú a pripravujú jedlá, spravujú kuchynské operácie a zabezpečujú kvalitu a bezpečnosť potravín. Vyvíjajú jedálne lístky, školia kuchynský personál a udržiavajú vysoké štandardy kulinárskej excelencie pri správe nákladov a zásob.',
        tips: [
          'Zdôraznite svoje kulinárske vzdelanie a certifikáty',
          'Zdôraznite skúsenosti s rôznymi kuchyniami a technikami varenia',
          'Ukážte vývoj jedálneho lístka a riadenie nákladov na potraviny',
          'Zahrňte skúsenosti s riadením kuchyne a školením personálu',
          'Preukážte znalosť štandardov bezpečnosti a hygieny potravín'
        ],
        skills: [
          'Kulinárske umenie a techniky varenia',
          'Plánovanie a vývoj jedálneho lístka',
          'Riadenie a prevádzka kuchyne',
          'Bezpečnosť a hygiena potravín (HACCP)',
          'Kontrola nákladov a riadenie zásob',
          'Školenie a dohľad personálu',
          'Zabezpečenie kvality a prezentácia'
        ],
        whyGood: [
          'Jasná štruktúra zdôrazňujúca kulinárske kvalifikácie',
          'Zdôrazňuje skúsenosti s rôznymi kuchyniami',
          'Ukazuje zručnosti v riadení kuchyne a vedení',
          'Preukazuje znalosť bezpečnosti potravín',
          'Formát kompatibilný s ATS s kľúčovými slovami špecifickými pre pohostinstvo'
        ]
      },
      no: {
        name: 'Kokk',
        slug: 'kokk',
        description: 'Kokker lager og forbereder måltider, administrerer kjøkkenoperasjoner og sikrer matkvalitet og -sikkerhet. De utvikler menyer, trener kjøkkenpersonale og opprettholder høye standarder for kulinarisk ekspertise mens de administrerer kostnader og lager.',
        tips: [
          'Fremhev din kulinariske utdanning og sertifiseringer',
          'Fremhev erfaring med forskjellige kjøkkener og matlagingsteknikker',
          'Vis menyutvikling og matkostnadsstyring',
          'Inkluder erfaring med kjøkkenledelse og personaleutdanning',
          'Demonstrer kunnskap om mattrygghets- og hygienestandarder'
        ],
        skills: [
          'Kulinariske kunster og matlagingsteknikker',
          'Menyp lanlegging og utvikling',
          'Kjøkkenledelse og drift',
          'Mattrygghet og hygiene (HACCP)',
          'Kostnadskontroll og lagerstyring',
          'Personaleutdanning og tilsyn',
          'Kvalitetssikring og presentasjon'
        ],
        whyGood: [
          'Tydelig struktur som fremhever kulinariske kvalifikasjoner',
          'Fremhever erfaring med forskjellige kjøkkener',
          'Viser kjøkkenledelses- og lederskapsferdigheter',
          'Demonstrer kunnskap om mattrygghet',
          'ATS-vennlig format med gjestgiverispesifikke nøkkelord'
        ]
      },
      hr: {
        name: 'Kuhar',
        slug: 'kuhar',
        description: 'Kuhari stvaraju i pripremaju jela, upravljaju kuhinjskim operacijama i osiguravaju kvalitetu i sigurnost hrane. Razvijaju jelovnike, obučavaju kuhinjsko osoblje i održavaju visoke standarde kulinarske izvrsnosti upravljajući troškovima i zalihama.',
        tips: [
          'Istaknite svoju kulinarsku obuku i certifikate',
          'Naglasite iskustvo s različitim kuhinjama i tehnikama kuhanja',
          'Pokažite razvoj jelovnika i upravljanje troškovima hrane',
          'Uključite iskustvo s upravljanjem kuhinje i obukom osoblja',
          'Pokažite znanje o standardima sigurnosti i higijene hrane'
        ],
        skills: [
          'Kulinarske umjetnosti i tehnike kuhanja',
          'Planiranje i razvoj jelovnika',
          'Upravljanje i operacije kuhinje',
          'Sigurnost i higijena hrane (HACCP)',
          'Kontrola troškova i upravljanje zalihama',
          'Obučavanje i nadzor osoblja',
          'Osiguravanje kvalitete i prezentacija'
        ],
        whyGood: [
          'Jasna struktura koja ističe kulinarske kvalifikacije',
          'Naglašava iskustvo s različitim kuhinjama',
          'Prikazuje vještine upravljanja kuhinjom i vodstva',
          'Pokazuje znanje o sigurnosti hrane',
          'Format kompatibilan s ATS s ključnim riječima specifičnim za ugostiteljstvo'
        ]
      },
      sr: {
        name: 'Кувар',
        slug: 'kuvar',
        description: 'Кувари стварају и припремају јела, управљају кухињским операцијама и осигуравају квалитет и безбедност хране. Развијају јеловнике, обучавају кухињско особље и одржавају високе стандарде кулинарске изврсности управљајући трошковима и залихама.',
        tips: [
          'Истакните своју кулинарску обуку и сертификате',
          'Нагласите искуство са различитим кухињама и техникама кувања',
          'Покажите развој јеловника и управљање трошковима хране',
          'Укључите искуство са управљањем кухиње и обуком особља',
          'Покажите знање о стандардима безбедности и хигијене хране'
        ],
        skills: [
          'Кулинарске уметности и технике кувања',
          'Планирање и развој јеловника',
          'Управљање и операције кухиње',
          'Безбедност и хигијена хране (HACCP)',
          'Контрола трошкова и управљање залихама',
          'Обучавање и надзор особља',
          'Осигуравање квалитета и презентација'
        ],
        whyGood: [
          'Јасна структура која истиче кулинарске квалификације',
          'Наглашава искуство са различитим кухињама',
          'Приказује вештине управљања кухињом и вођства',
          'Показује знање о безбедности хране',
          'Формат компатибилан са ATS са кључним речима специфичним за угоститељство'
        ]
      }
    }
  },
  {
    id: 'lawyer',
    category: 'legal',
    translations: {
      en: {
        name: 'Lawyer',
        slug: 'lawyer',
        description: 'Lawyers provide legal advice, represent clients in court, and help resolve legal disputes. They research laws, prepare legal documents, negotiate settlements, and advocate for their clients\' rights and interests.',
        tips: [
          'Highlight your law degree and bar admission',
          'Emphasize experience in specific areas of law',
          'Showcase successful cases and outcomes',
          'Include experience with legal research and writing',
          'Demonstrate analytical and advocacy skills'
        ],
        skills: [
          'Legal research and analysis',
          'Case preparation and litigation',
          'Legal writing and documentation',
          'Client consultation and counseling',
          'Negotiation and settlement',
          'Court representation and advocacy',
          'Regulatory compliance and risk management'
        ],
        whyGood: [
          'Clear structure highlighting legal qualifications',
          'Emphasizes bar admission and specializations',
          'Shows successful case outcomes',
          'Demonstrates legal expertise and analytical skills',
          'ATS-friendly format with legal-specific keywords'
        ]
      },
      nl: {
        name: 'Advocaat',
        slug: 'advocaat',
        description: 'Advocaten geven juridisch advies, vertegenwoordigen cliënten in de rechtbank en helpen juridische geschillen op te lossen. Ze onderzoeken wetten, bereiden juridische documenten voor, onderhandelen over schikkingen en pleiten voor de rechten en belangen van hun cliënten.',
        tips: [
          'Benadruk je rechtenstudie en toelating tot de balie',
          'Leg nadruk op ervaring in specifieke rechtsgebieden',
          'Toon succesvolle zaken en resultaten',
          'Vermeld ervaring met juridisch onderzoek en schrijven',
          'Demonstreer analytische en pleitvaardigheden'
        ],
        skills: [
          'Juridisch onderzoek en analyse',
          'Zaakvoorbereiding en procesvoering',
          'Juridisch schrijven en documentatie',
          'Cliëntconsultatie en begeleiding',
          'Onderhandeling en schikking',
          'Rechtbankvertegenwoordiging en pleiten',
          'Regelgevingsnaleving en risicobeheer'
        ],
        whyGood: [
          'Duidelijke structuur die juridische kwalificaties benadrukt',
          'Legt nadruk op toelating tot de balie en specialisaties',
          'Toont succesvolle zaakresultaten',
          'Demonstreert juridische expertise en analytische vaardigheden',
          'ATS-vriendelijk formaat met juridische zoekwoorden'
        ]
      },
      fr: {
        name: 'Avocat',
        slug: 'avocat',
        description: 'Les avocats fournissent des conseils juridiques, représentent les clients devant les tribunaux et aident à résoudre les litiges juridiques. Ils recherchent les lois, préparent des documents juridiques, négocient des règlements et défendent les droits et intérêts de leurs clients.',
        tips: [
          'Mettez en avant votre diplôme de droit et admission au barreau',
          'Soulignez l\'expérience dans des domaines spécifiques du droit',
          'Présentez des affaires et résultats réussis',
          'Incluez l\'expérience en recherche et rédaction juridiques',
          'Démontrez les compétences analytiques et de plaidoyer'
        ],
        skills: [
          'Recherche et analyse juridiques',
          'Préparation d\'affaires et contentieux',
          'Rédaction et documentation juridiques',
          'Consultation et conseil aux clients',
          'Négociation et règlement',
          'Représentation et plaidoyer devant les tribunaux',
          'Conformité réglementaire et gestion des risques'
        ],
        whyGood: [
          'Structure claire mettant en évidence les qualifications juridiques',
          'Met l\'accent sur l\'admission au barreau et les spécialisations',
          'Montre des résultats d\'affaires réussis',
          'Démontre l\'expertise juridique et les compétences analytiques',
          'Format compatible ATS avec mots-clés spécifiques au droit'
        ]
      },
      es: {
        name: 'Abogado',
        slug: 'abogado',
        description: 'Los abogados brindan asesoramiento legal, representan a clientes en los tribunales y ayudan a resolver disputas legales. Investigan leyes, preparan documentos legales, negocian acuerdos y defienden los derechos e intereses de sus clientes.',
        tips: [
          'Destaca tu título de derecho y admisión al colegio de abogados',
          'Enfatiza experiencia en áreas específicas del derecho',
          'Muestra casos exitosos y resultados',
          'Incluye experiencia con investigación y redacción legal',
          'Demuestra habilidades analíticas y de defensa'
        ],
        skills: [
          'Investigación y análisis legal',
          'Preparación de casos y litigios',
          'Redacción y documentación legal',
          'Consultoría y asesoramiento a clientes',
          'Negociación y acuerdo',
          'Representación y defensa en tribunales',
          'Cumplimiento regulatorio y gestión de riesgos'
        ],
        whyGood: [
          'Estructura clara que destaca calificaciones legales',
          'Enfatiza admisión al colegio de abogados y especializaciones',
          'Muestra resultados exitosos de casos',
          'Demuestra experiencia legal y habilidades analíticas',
          'Formato compatible con ATS con palabras clave específicas legales'
        ]
      },
      de: {
        name: 'Rechtsanwalt',
        slug: 'rechtsanwalt',
        description: 'Rechtsanwälte bieten Rechtsberatung, vertreten Mandanten vor Gericht und helfen bei der Lösung von Rechtsstreitigkeiten. Sie recherchieren Gesetze, erstellen Rechtsdokumente, verhandeln Vergleiche und vertreten die Rechte und Interessen ihrer Mandanten.',
        tips: [
          'Heben Sie Ihren Jurastudium und Zulassung zur Anwaltskammer hervor',
          'Betonen Sie Erfahrung in spezifischen Rechtsgebieten',
          'Zeigen Sie erfolgreiche Fälle und Ergebnisse',
          'Fügen Sie Erfahrung mit Rechtsforschung und -schreiben hinzu',
          'Demonstrieren Sie analytische und Anwaltsfähigkeiten'
        ],
        skills: [
          'Rechtsforschung und -analyse',
          'Fallvorbereitung und Prozessführung',
          'Rechtsschreiben und Dokumentation',
          'Mandantenberatung und Beratung',
          'Verhandlung und Vergleich',
          'Gerichtsvertretung und Anwaltschaft',
          'Regulatorische Compliance und Risikomanagement'
        ],
        whyGood: [
          'Klare Struktur, die juristische Qualifikationen hervorhebt',
          'Betont Zulassung zur Anwaltskammer und Spezialisierungen',
          'Zeigt erfolgreiche Fallergebnisse',
          'Demonstriert juristische Expertise und analytische Fähigkeiten',
          'ATS-freundliches Format mit rechtspezifischen Schlüsselwörtern'
        ]
      },
      it: {
        name: 'Avvocato',
        slug: 'avvocato',
        description: 'Gli avvocati forniscono consulenza legale, rappresentano i clienti in tribunale e aiutano a risolvere controversie legali. Ricercano leggi, preparano documenti legali, negoziano accordi e difendono i diritti e gli interessi dei loro clienti.',
        tips: [
          'Evidenzia la tua laurea in giurisprudenza e l\'ammissione all\'albo',
          'Enfatizza esperienza in aree specifiche del diritto',
          'Mostra casi di successo e risultati',
          'Includi esperienza con ricerca e scrittura legale',
          'Dimostra capacità analitiche e di difesa'
        ],
        skills: [
          'Ricerca e analisi legale',
          'Preparazione del caso e contenzioso',
          'Scrittura e documentazione legale',
          'Consultazione e consulenza clienti',
          'Negoziazione e accordo',
          'Rappresentanza in tribunale e difesa',
          'Conformità normativa e gestione del rischio'
        ],
        whyGood: [
          'Struttura chiara che evidenzia qualifiche legali',
          'Enfatizza l\'ammissione all\'albo e specializzazioni',
          'Mostra risultati di casi di successo',
          'Dimostra competenza legale e capacità analitiche',
          'Formato compatibile con ATS con parole chiave specifiche per il diritto'
        ]
      },
      pl: {
        name: 'Prawnik',
        slug: 'prawnik',
        description: 'Prawnicy udzielają porad prawnych, reprezentują klientów w sądzie i pomagają rozwiązywać spory prawne. Badają przepisy prawne, przygotowują dokumenty prawne, negocjują ugody i bronią praw i interesów swoich klientów.',
        tips: [
          'Podkreśl swoje wykształcenie prawnicze i wpis na listę adwokatów',
          'Podkreśl doświadczenie w określonych dziedzinach prawa',
          'Pokaż udane sprawy i wyniki',
          'Uwzględnij doświadczenie z badaniami prawnymi i pisaniem',
          'Wykazuj zdolności analityczne i obronne'
        ],
        skills: [
          'Badania i analiza prawna',
          'Przygotowanie sprawy i postępowanie sądowe',
          'Pisanie i dokumentacja prawna',
          'Konsultacje i poradnictwo dla klientów',
          'Negocjacje i ugoda',
          'Reprezentacja w sądzie i obrona',
          'Zgodność z przepisami i zarządzanie ryzykiem'
        ],
        whyGood: [
          'Jasna struktura podkreślająca kwalifikacje prawne',
          'Kładzie nacisk na wpis na listę adwokatów i specjalizacje',
          'Pokazuje udane wyniki spraw',
          'Wykazuje kompetencje prawne i zdolności analityczne',
          'Format przyjazny dla ATS z słowami kluczowymi specyficznymi dla prawa'
        ]
      },
      ro: {
        name: 'Avocat',
        slug: 'avocat',
        description: 'Avocații oferă consultanță juridică, reprezintă clienții în instanță și ajută la rezolvarea disputelor legale. Ei cercetează legile, pregătesc documente legale, negociază soluții și pledează pentru drepturile și interesele clienților lor.',
        tips: [
          'Evidențiază diploma ta de drept și admiterea la barou',
          'Subliniază experiența în domenii specifice ale dreptului',
          'Prezintă cazuri de succes și rezultate',
          'Include experiența cu cercetarea și scrierea juridică',
          'Demonstrează abilități analitice și de apărare'
        ],
        skills: [
          'Cercetare și analiză juridică',
          'Pregătirea cazului și litigii',
          'Scriere și documentare juridică',
          'Consultare și consiliere clienți',
          'Negociere și soluționare',
          'Reprezentare în instanță și apărare',
          'Conformitate reglementară și gestionarea riscului'
        ],
        whyGood: [
          'Structură clară care evidențiază calificările juridice',
          'Subliniază admiterea la barou și specializările',
          'Arată rezultate de succes ale cazurilor',
          'Demonstrează expertiza juridică și abilități analitice',
          'Format compatibil cu ATS cu cuvinte cheie specifice dreptului'
        ]
      },
      hu: {
        name: 'Ügyvéd',
        slug: 'ugyved',
        description: 'Az ügyvédek jogi tanácsot nyújtanak, képviselik az ügyfeleket a bíróságon és segítenek jogi viták megoldásában. Kutatják a törvényeket, készítik a jogi dokumentumokat, tárgyalnak megállapodásokat és védik ügyfeleik jogait és érdekeit.',
        tips: [
          'Hangsúlyozza jogi diplomáját és ügyvédi kamarai tagságát',
          'Kiemeli a jog meghatározott területein szerzett tapasztalatát',
          'Mutatja be sikeres ügyeket és eredményeket',
          'Tartalmazza a jogi kutatással és írással szerzett tapasztalatát',
          'Bebizonyítja elemző és védői képességeit'
        ],
        skills: [
          'Jogi kutatás és elemzés',
          'Ügy előkészítése és pereskedés',
          'Jogi írás és dokumentáció',
          'Ügyfélkonzultáció és tanácsadás',
          'Tárgyalás és megállapodás',
          'Bírósági képviselet és védés',
          'Szabályozási megfelelőség és kockázatkezelés'
        ],
        whyGood: [
          'Világos struktúra, amely kiemeli a jogi kvalifikációkat',
          'Hangsúlyozza az ügyvédi kamarai tagságot és szakosodásokat',
          'Mutatja a sikeres ügyek eredményeit',
          'Bebizonyítja a jogi szakértelem és elemző képességeket',
          'ATS-barát formátum jogspecifikus kulcsszavakkal'
        ]
      },
      el: {
        name: 'Δικηγόρος',
        slug: 'dikigoros',
        description: 'Οι δικηγόροι παρέχουν νομικές συμβουλές, εκπροσωπούν πελάτες στα δικαστήρια και βοηθούν στην επίλυση νομικών διαφορών. Ερευνούν νόμους, προετοιμάζουν νομικά έγγραφα, διαπραγματεύονται συμβιβασμούς και υπερασπίζονται τα δικαιώματα και συμφέροντα των πελατών τους.',
        tips: [
          'Επισημάνετε το πτυχίο νομικής σας και την εγγραφή στο δικηγορικό σύλλογο',
          'Τονίστε εμπειρία σε συγκεκριμένους τομείς του δικαίου',
          'Παρουσιάστε επιτυχημένες υποθέσεις και αποτελέσματα',
          'Συμπεριλάβετε εμπειρία με νομική έρευνα και γραφή',
          'Αποδείξτε αναλυτικές και υπερασπιστικές ικανότητες'
        ],
        skills: [
          'Νομική έρευνα και ανάλυση',
          'Προετοιμασία υποθέσεων και δικονομία',
          'Νομική γραφή και τεκμηρίωση',
          'Σύμβουλος και συμβουλευτική πελατών',
          'Διαπραγμάτευση και συμβιβασμός',
          'Εκπροσώπηση σε δικαστήρια και υπεράσπιση',
          'Ρυθμιστική συμμόρφωση και διαχείριση κινδύνου'
        ],
        whyGood: [
          'Σαφής δομή που επισημαίνει τις νομικές προσόντα',
          'Τονίζει την εγγραφή στο δικηγορικό σύλλογο και τις εξειδικεύσεις',
          'Δείχνει επιτυχημένα αποτελέσματα υποθέσεων',
          'Αποδεικνύει νομική εμπειρογνωμοσύνη και αναλυτικές ικανότητες',
          'Μορφή συμβατή με ATS με λέξεις-κλειδιά ειδικές για το δίκαιο'
        ]
      },
      cs: {
        name: 'Advokát',
        slug: 'advokat',
        description: 'Advokáti poskytují právní poradenství, zastupují klienty u soudu a pomáhají řešit právní spory. Zkoumají zákony, připravují právní dokumenty, vyjednávají dohody a hájí práva a zájmy svých klientů.',
        tips: [
          'Zdůrazněte své právnické vzdělání a přijetí do advokátní komory',
          'Zdůrazněte zkušenosti v konkrétních oblastech práva',
          'Ukažte úspěšné případy a výsledky',
          'Zahrňte zkušenosti s právním výzkumem a psaním',
          'Prokažte analytické a obhajovací schopnosti'
        ],
        skills: [
          'Právní výzkum a analýza',
          'Příprava případu a soudní řízení',
          'Právní psaní a dokumentace',
          'Konzultace a poradenství klientům',
          'Vyjednávání a dohoda',
          'Soudní zastoupení a obhajoba',
          'Regulační shoda a řízení rizik'
        ],
        whyGood: [
          'Jasná struktura zdůrazňující právní kvalifikace',
          'Zdůrazňuje přijetí do advokátní komory a specializace',
          'Ukazuje úspěšné výsledky případů',
          'Prokazuje právní odbornost a analytické schopnosti',
          'Formát kompatibilní s ATS s právními klíčovými slovy'
        ]
      },
      pt: {
        name: 'Advogado',
        slug: 'advogado',
        description: 'Advogados fornecem aconselhamento jurídico, representam clientes nos tribunais e ajudam a resolver disputas legais. Eles pesquisam leis, preparam documentos legais, negociam acordos e defendem os direitos e interesses de seus clientes.',
        tips: [
          'Destaque seu diploma de direito e admissão na ordem dos advogados',
          'Enfatize experiência em áreas específicas do direito',
          'Mostre casos bem-sucedidos e resultados',
          'Inclua experiência com pesquisa e redação jurídica',
          'Demonstre habilidades analíticas e de defesa'
        ],
        skills: [
          'Pesquisa e análise jurídica',
          'Preparação de casos e litígios',
          'Redação e documentação jurídica',
          'Consultoria e aconselhamento a clientes',
          'Negociação e acordo',
          'Representação em tribunais e defesa',
          'Conformidade regulatória e gestão de riscos'
        ],
        whyGood: [
          'Estrutura clara destacando qualificações jurídicas',
          'Enfatiza admissão na ordem dos advogados e especializações',
          'Mostra resultados bem-sucedidos de casos',
          'Demonstra expertise jurídica e habilidades analíticas',
          'Formato compatível com ATS com palavras-chave específicas jurídicas'
        ]
      },
      sv: {
        name: 'Advokat',
        slug: 'advokat',
        description: 'Advokater ger juridisk rådgivning, representerar klienter i domstol och hjälper till att lösa juridiska tvister. De forskar om lagar, förbereder juridiska dokument, förhandlar om uppgörelser och företräder sina klienters rättigheter och intressen.',
        tips: [
          'Framhäv din juristexamen och antagning till advokatsamfundet',
          'Betona erfarenhet inom specifika rättsområden',
          'Visa framgångsrika fall och resultat',
          'Inkludera erfarenhet av juridisk forskning och skrivande',
          'Visa analytiska och försvarsförmågor'
        ],
        skills: [
          'Juridisk forskning och analys',
          'Förberedelse av fall och rättegång',
          'Juridisk skrivande och dokumentation',
          'Klientkonsultation och rådgivning',
          'Förhandling och uppgörelse',
          'Domstolsrepresentation och försvar',
          'Regulatorisk efterlevnad och riskhantering'
        ],
        whyGood: [
          'Tydlig struktur som framhäver juridiska kvalifikationer',
          'Betona antagning till advokatsamfundet och specialiseringar',
          'Visar framgångsrika fallresultat',
          'Demonstrerar juridisk expertis och analytiska färdigheter',
          'ATS-vänligt format med juridiska nyckelord'
        ]
      },
      bg: {
        name: 'Адвокат',
        slug: 'advokat',
        description: 'Адвокатите предоставят правни съвети, представляват клиенти в съда и помагат за решаване на правни спорове. Те изследват закони, подготвят правни документи, преговарят споразумения и защитават правата и интересите на своите клиенти.',
        tips: [
          'Подчертайте правното си образование и приемането в адвокатската колегия',
          'Акцентирайте върху опита в конкретни области на правото',
          'Покажете успешни дела и резултати',
          'Включете опит с правно изследване и писане',
          'Демонстрирайте аналитични и защитни способности'
        ],
        skills: [
          'Правно изследване и анализ',
          'Подготовка на дело и съдебни спорове',
          'Правно писане и документация',
          'Консултация и съветване на клиенти',
          'Преговаряне и споразумение',
          'Представителство в съда и защита',
          'Регулаторно съответствие и управление на риска'
        ],
        whyGood: [
          'Ясна структура, която подчертава правните квалификации',
          'Акцентира върху приемането в адвокатската колегия и специализациите',
          'Показва успешни резултати от дела',
          'Демонстрира правна експертиза и аналитични способности',
          'Формат, съвместим с ATS, с правни ключови думи'
        ]
      },
      da: {
        name: 'Advokat',
        slug: 'advokat',
        description: 'Advokater giver juridisk rådgivning, repræsenterer klienter i retten og hjælper med at løse juridiske tvister. De forsker i love, forbereder juridiske dokumenter, forhandler forlig og forsvare deres klienters rettigheder og interesser.',
        tips: [
          'Fremhæv din juridiske uddannelse og optagelse i advokatsamfundet',
          'Fremhæv erfaring inden for specifikke retsområder',
          'Vis succesfulde sager og resultater',
          'Inkluder erfaring med juridisk forskning og skrivning',
          'Demonstrer analytiske og forsvarsfærdigheder'
        ],
        skills: [
          'Juridisk forskning og analyse',
          'Sagsforberedelse og retssager',
          'Juridisk skrivning og dokumentation',
          'Klientkonsultation og rådgivning',
          'Forhandling og forlig',
          'Retsrepræsentation og forsvar',
          'Regulatorisk overholdelse og risikostyring'
        ],
        whyGood: [
          'Tydelig struktur, der fremhæver juridiske kvalifikationer',
          'Fremhæver optagelse i advokatsamfundet og specialiseringer',
          'Viser succesfulde sagsresultater',
          'Demonstrer juridisk ekspertise og analytiske færdigheder',
          'ATS-venligt format med juridiske nøgleord'
        ]
      },
      fi: {
        name: 'Asianajaja',
        slug: 'asianajaja',
        description: 'Asianajajat antavat oikeudellista neuvontaa, edustavat asiakkaita oikeudessa ja auttavat ratkaisemaan oikeudellisia kiistoja. He tutkivat lakeja, valmistavat oikeudellisia asiakirjoja, neuvottelevat sovintoja ja puolustavat asiakkaidensa oikeuksia ja etuja.',
        tips: [
          'Korosta oikeustieteen tutkintosi ja hyväksymistä asianajajakuntaan',
          'Korosta kokemusta oikeuden tietyillä aloilla',
          'Näytä menestyksekkäitä tapauksia ja tuloksia',
          'Sisällytä kokemus oikeudellisesta tutkimuksesta ja kirjoittamisesta',
          'Näytä analyyttisiä ja puolustuskykyjä'
        ],
        skills: [
          'Oikeudellinen tutkimus ja analyysi',
          'Tapauksen valmistelu ja oikeudenkäynti',
          'Oikeudellinen kirjoittaminen ja dokumentointi',
          'Asiakasneuvonta ja neuvonta',
          'Neuvottelu ja sovinto',
          'Oikeuden edustus ja puolustus',
          'Sääntelyn noudattaminen ja riskinhallinta'
        ],
        whyGood: [
          'Selkeä rakenne, joka korostaa oikeudellisia kvalifikaatioita',
          'Korostaa hyväksymistä asianajajakuntaan ja erikoistumisia',
          'Näyttää menestyksekkäitä tapauksien tuloksia',
          'Näyttää oikeudellista asiantuntemusta ja analyyttisiä kykyjä',
          'ATS-yhteensopiva muoto oikeudellisilla avainsanoilla'
        ]
      },
      sk: {
        name: 'Advokát',
        slug: 'advokat',
        description: 'Advokáti poskytujú právne poradenstvo, zastupujú klientov na súde a pomáhajú riešiť právne spory. Skúmajú zákony, pripravujú právne dokumenty, vyjednávajú dohody a hájajú práva a záujmy svojich klientov.',
        tips: [
          'Zdôraznite svoje právnické vzdelanie a prijatie do advokátskej komory',
          'Zdôraznite skúsenosti v konkrétnych oblastiach práva',
          'Ukážte úspešné prípady a výsledky',
          'Zahrňte skúsenosti s právnym výskumom a písaním',
          'Preukážte analytické a obhajobné schopnosti'
        ],
        skills: [
          'Právny výskum a analýza',
          'Príprava prípadu a súdne konanie',
          'Právne písanie a dokumentácia',
          'Konzultácia a poradenstvo klientom',
          'Vyjednávanie a dohoda',
          'Súdne zastúpenie a obhajoba',
          'Regulačná súlad a riadenie rizika'
        ],
        whyGood: [
          'Jasná štruktúra zdôrazňujúca právne kvalifikácie',
          'Zdôrazňuje prijatie do advokátskej komory a špecializácie',
          'Ukazuje úspešné výsledky prípadov',
          'Preukazuje právnu odbornosť a analytické schopnosti',
          'Formát kompatibilný s ATS s právnymi kľúčovými slovami'
        ]
      },
      no: {
        name: 'Advokat',
        slug: 'advokat',
        description: 'Advokater gir juridisk rådgivning, representerer klienter i retten og hjelper til med å løse juridiske tvister. De forsker på lover, forbereder juridiske dokumenter, forhandler forlik og forsvare sine klienters rettigheter og interesser.',
        tips: [
          'Fremhev din juridiske utdanning og opptak i advokatsamfunnet',
          'Fremhev erfaring innen spesifikke rettsområder',
          'Vis vellykkede saker og resultater',
          'Inkluder erfaring med juridisk forskning og skriving',
          'Demonstrer analytiske og forsvarsferdigheter'
        ],
        skills: [
          'Juridisk forskning og analyse',
          'Saksforberedelse og rettssaker',
          'Juridisk skriving og dokumentasjon',
          'Klientkonsultasjon og rådgivning',
          'Forhandling og forlik',
          'Rettsrepresentasjon og forsvar',
          'Regulatorisk overholdelse og risikostyring'
        ],
        whyGood: [
          'Tydelig struktur som fremhever juridiske kvalifikasjoner',
          'Fremhever opptak i advokatsamfunnet og spesialiseringer',
          'Viser vellykkede saksresultater',
          'Demonstrer juridisk ekspertise og analytiske ferdigheter',
          'ATS-vennlig format med juridiske nøkkelord'
        ]
      },
      hr: {
        name: 'Odvjetnik',
        slug: 'odvjetnik',
        description: 'Odvjetnici pružaju pravne savjete, zastupaju klijente na sudu i pomažu u rješavanju pravnih sporova. Istražuju zakone, pripremaju pravne dokumente, pregovaraju nagodbe i brane prava i interese svojih klijenata.',
        tips: [
          'Istaknite svoje pravno obrazovanje i primanje u odvjetničku komoru',
          'Naglasite iskustvo u određenim područjima prava',
          'Pokažite uspješne slučajeve i rezultate',
          'Uključite iskustvo s pravnim istraživanjem i pisanjem',
          'Pokažite analitičke i obrambene vještine'
        ],
        skills: [
          'Pravno istraživanje i analiza',
          'Priprema slučaja i parnica',
          'Pravno pisanje i dokumentacija',
          'Konzultacije i savjetovanje klijenata',
          'Pregovaranje i nagodba',
          'Sudsko zastupanje i obrana',
          'Regulatorna usklađenost i upravljanje rizikom'
        ],
        whyGood: [
          'Jasna struktura koja ističe pravne kvalifikacije',
          'Naglašava primanje u odvjetničku komoru i specializacije',
          'Prikazuje uspješne rezultate slučajeva',
          'Pokazuje pravnu stručnost i analitičke vještine',
          'Format kompatibilan s ATS s pravnim ključnim riječima'
        ]
      },
      sr: {
        name: 'Адвокат',
        slug: 'advokat',
        description: 'Адвокати пружају правне савете, заступају клијенте на суду и помажу у решавању правних спорова. Истражују законе, припремају правне документе, преговарају нагодбе и бране права и интересе својих клијената.',
        tips: [
          'Истакните своје правно образовање и пријем у адвокатску комору',
          'Нагласите искуство у одређеним областима права',
          'Покажите успешне случајеве и резултате',
          'Укључите искуство са правним истраживањем и писањем',
          'Покажите аналитичке и одбрамбене вештине'
        ],
        skills: [
          'Правно истраживање и анализа',
          'Припрема случаја и парница',
          'Правно писање и документација',
          'Консултације и саветовање клијената',
          'Преговарање и нагодба',
          'Судско заступање и одбрана',
          'Регулаторна усклађеност и управљање ризиком'
        ],
        whyGood: [
          'Јасна структура која истиче правне квалификације',
          'Наглашава пријем у адвокатску комору и специјализације',
          'Приказује успешне резултате случајева',
          'Показује правну стручност и аналитичке вештине',
          'Формат компатибилан са ATS са правним кључним речима'
        ]
      }
    }
  },
  {
    id: 'data-scientist',
    category: 'technology',
    translations: {
      en: {
        name: 'Data Scientist',
        slug: 'data-scientist',
        description: 'Data scientists analyze complex data sets to extract insights and inform business decisions. They use statistical methods, machine learning, and programming to solve problems and create predictive models.',
        tips: [
          'Highlight your technical skills and programming languages',
          'Emphasize experience with data analysis and machine learning',
          'Showcase projects and their business impact',
          'Include experience with data visualization tools',
          'Demonstrate statistical and analytical capabilities'
        ],
        skills: [
          'Data analysis and statistical modeling',
          'Programming (Python, R, SQL)',
          'Machine learning and AI',
          'Data visualization (Tableau, Power BI)',
          'Big data technologies (Hadoop, Spark)',
          'Database management and querying',
          'Business intelligence and reporting'
        ],
        whyGood: [
          'Clear structure highlighting technical expertise',
          'Emphasizes data-driven results and impact',
          'Shows proficiency with relevant tools and technologies',
          'Demonstrates analytical and problem-solving skills',
          'ATS-friendly format with data science keywords'
        ]
      },
      nl: {
        name: 'Data Scientist',
        slug: 'data-scientist',
        description: 'Data scientists analyseren complexe datasets om inzichten te extraheren en bedrijfsbeslissingen te informeren. Ze gebruiken statistische methoden, machine learning en programmeren om problemen op te lossen en voorspellende modellen te creëren.',
        tips: [
          'Benadruk je technische vaardigheden en programmeertalen',
          'Leg nadruk op ervaring met data-analyse en machine learning',
          'Toon projecten en hun bedrijfsimpact',
          'Vermeld ervaring met datavisualisatietools',
          'Demonstreer statistische en analytische capaciteiten'
        ],
        skills: [
          'Data-analyse en statistische modellering',
          'Programmeren (Python, R, SQL)',
          'Machine learning en AI',
          'Datavisualisatie (Tableau, Power BI)',
          'Big data-technologieën (Hadoop, Spark)',
          'Databasebeheer en querying',
          'Business intelligence en rapportage'
        ],
        whyGood: [
          'Duidelijke structuur die technische expertise benadrukt',
          'Legt nadruk op data-gedreven resultaten en impact',
          'Toont vaardigheid met relevante tools en technologieën',
          'Demonstreert analytische en probleemoplossende vaardigheden',
          'ATS-vriendelijk formaat met data science-zoekwoorden'
        ]
      },
      fr: {
        name: 'Scientifique des Données',
        slug: 'scientifique-donnees',
        description: 'Les scientifiques des données analysent des ensembles de données complexes pour extraire des informations et éclairer les décisions commerciales. Ils utilisent des méthodes statistiques, l\'apprentissage automatique et la programmation pour résoudre des problèmes et créer des modèles prédictifs.',
        tips: [
          'Mettez en avant vos compétences techniques et langages de programmation',
          'Soulignez l\'expérience en analyse de données et apprentissage automatique',
          'Présentez des projets et leur impact commercial',
          'Incluez l\'expérience avec les outils de visualisation de données',
          'Démontrez les capacités statistiques et analytiques'
        ],
        skills: [
          'Analyse de données et modélisation statistique',
          'Programmation (Python, R, SQL)',
          'Apprentissage automatique et IA',
          'Visualisation de données (Tableau, Power BI)',
          'Technologies big data (Hadoop, Spark)',
          'Gestion et interrogation de bases de données',
          'Business intelligence et reporting'
        ],
        whyGood: [
          'Structure claire mettant en évidence l\'expertise technique',
          'Met l\'accent sur les résultats et l\'impact axés sur les données',
          'Montre la maîtrise des outils et technologies pertinents',
          'Démontre les compétences analytiques et de résolution de problèmes',
          'Format compatible ATS avec mots-clés de science des données'
        ]
      },
      es: {
        name: 'Científico de Datos',
        slug: 'cientifico-datos',
        description: 'Los científicos de datos analizan conjuntos de datos complejos para extraer información e informar decisiones comerciales. Utilizan métodos estadísticos, aprendizaje automático y programación para resolver problemas y crear modelos predictivos.',
        tips: [
          'Destaca tus habilidades técnicas y lenguajes de programación',
          'Enfatiza experiencia con análisis de datos y aprendizaje automático',
          'Muestra proyectos y su impacto comercial',
          'Incluye experiencia con herramientas de visualización de datos',
          'Demuestra capacidades estadísticas y analíticas'
        ],
        skills: [
          'Análisis de datos y modelado estadístico',
          'Programación (Python, R, SQL)',
          'Aprendizaje automático e IA',
          'Visualización de datos (Tableau, Power BI)',
          'Tecnologías de big data (Hadoop, Spark)',
          'Gestión y consulta de bases de datos',
          'Inteligencia empresarial y reportes'
        ],
        whyGood: [
          'Estructura clara que destaca experiencia técnica',
          'Enfatiza resultados e impacto basados en datos',
          'Muestra competencia con herramientas y tecnologías relevantes',
          'Demuestra habilidades analíticas y de resolución de problemas',
          'Formato compatible con ATS con palabras clave de ciencia de datos'
        ]
      },
      de: {
        name: 'Datenwissenschaftler',
        slug: 'datenwissenschaftler',
        description: 'Datenwissenschaftler analysieren komplexe Datensätze, um Erkenntnisse zu gewinnen und Geschäftsentscheidungen zu informieren. Sie verwenden statistische Methoden, maschinelles Lernen und Programmierung, um Probleme zu lösen und prädiktive Modelle zu erstellen.',
        tips: [
          'Heben Sie Ihre technischen Fähigkeiten und Programmiersprachen hervor',
          'Betonen Sie Erfahrung mit Datenanalyse und maschinellem Lernen',
          'Zeigen Sie Projekte und deren Geschäftsauswirkungen',
          'Fügen Sie Erfahrung mit Datenvisualisierungstools hinzu',
          'Demonstrieren Sie statistische und analytische Fähigkeiten'
        ],
        skills: [
          'Datenanalyse und statistische Modellierung',
          'Programmierung (Python, R, SQL)',
          'Maschinelles Lernen und KI',
          'Datenvisualisierung (Tableau, Power BI)',
          'Big-Data-Technologien (Hadoop, Spark)',
          'Datenbankverwaltung und Abfragen',
          'Business Intelligence und Berichterstattung'
        ],
        whyGood: [
          'Klare Struktur, die technische Expertise hervorhebt',
          'Betont datengetriebene Ergebnisse und Auswirkungen',
          'Zeigt Beherrschung relevanter Tools und Technologien',
          'Demonstriert analytische und Problemlösungsfähigkeiten',
          'ATS-freundliches Format mit Data-Science-Schlüsselwörtern'
        ]
      },
      it: {
        name: 'Data Scientist',
        slug: 'data-scientist',
        description: 'I data scientist analizzano set di dati complessi per estrarre informazioni e informare le decisioni aziendali. Utilizzano metodi statistici, machine learning e programmazione per risolvere problemi e creare modelli predittivi.',
        tips: [
          'Evidenzia le tue competenze tecniche e linguaggi di programmazione',
          'Enfatizza esperienza con analisi dei dati e machine learning',
          'Mostra progetti e il loro impatto aziendale',
          'Includi esperienza con strumenti di visualizzazione dei dati',
          'Dimostra capacità statistiche e analitiche'
        ],
        skills: [
          'Analisi dei dati e modellazione statistica',
          'Programmazione (Python, R, SQL)',
          'Machine learning e AI',
          'Visualizzazione dei dati (Tableau, Power BI)',
          'Tecnologie big data (Hadoop, Spark)',
          'Gestione e interrogazione di database',
          'Business intelligence e reporting'
        ],
        whyGood: [
          'Struttura chiara che evidenzia competenza tecnica',
          'Enfatizza risultati basati sui dati e impatto',
          'Mostra padronanza di strumenti e tecnologie rilevanti',
          'Dimostra capacità analitiche e di problem solving',
          'Formato compatibile con ATS con parole chiave di data science'
        ]
      },
      pl: {
        name: 'Analityk Danych',
        slug: 'analityk-danych',
        description: 'Analitycy danych analizują złożone zestawy danych, aby wyodrębnić wnioski i informować decyzje biznesowe. Używają metod statystycznych, uczenia maszynowego i programowania do rozwiązywania problemów i tworzenia modeli predykcyjnych.',
        tips: [
          'Podkreśl swoje umiejętności techniczne i języki programowania',
          'Podkreśl doświadczenie z analizą danych i uczeniem maszynowym',
          'Pokaż projekty i ich wpływ biznesowy',
          'Uwzględnij doświadczenie z narzędziami wizualizacji danych',
          'Wykazuj zdolności statystyczne i analityczne'
        ],
        skills: [
          'Analiza danych i modelowanie statystyczne',
          'Programowanie (Python, R, SQL)',
          'Uczenie maszynowe i AI',
          'Wizualizacja danych (Tableau, Power BI)',
          'Technologie big data (Hadoop, Spark)',
          'Zarządzanie i zapytania do baz danych',
          'Business intelligence i raportowanie'
        ],
        whyGood: [
          'Jasna struktura podkreślająca kompetencje techniczne',
          'Kładzie nacisk na wyniki oparte na danych i wpływ',
          'Pokazuje biegłość w odpowiednich narzędziach i technologiach',
          'Wykazuje zdolności analityczne i rozwiązywania problemów',
          'Format przyjazny dla ATS z słowami kluczowymi data science'
        ]
      },
      ro: {
        name: 'Scientist de Date',
        slug: 'scientist-date',
        description: 'Scientiștii de date analizează seturi de date complexe pentru a extrage informații și a informa deciziile de afaceri. Ei folosesc metode statistice, machine learning și programare pentru a rezolva probleme și a crea modele predictive.',
        tips: [
          'Evidențiază abilitățile tale tehnice și limbajele de programare',
          'Subliniază experiența cu analiza datelor și machine learning',
          'Prezintă proiecte și impactul lor de afaceri',
          'Include experiența cu instrumente de vizualizare a datelor',
          'Demonstrează capacități statistice și analitice'
        ],
        skills: [
          'Analiza datelor și modelare statistică',
          'Programare (Python, R, SQL)',
          'Machine learning și AI',
          'Vizualizare date (Tableau, Power BI)',
          'Tehnologii big data (Hadoop, Spark)',
          'Gestionarea și interogarea bazelor de date',
          'Business intelligence și raportare'
        ],
        whyGood: [
          'Structură clară care evidențiază competența tehnică',
          'Subliniază rezultatele bazate pe date și impactul',
          'Arată competența cu instrumente și tehnologii relevante',
          'Demonstrează abilități analitice și de rezolvare a problemelor',
          'Format compatibil cu ATS cu cuvinte cheie de data science'
        ]
      },
      hu: {
        name: 'Adattudós',
        slug: 'adattudos',
        description: 'Az adattudósok összetett adathalmazokat elemeznek, hogy betekintéseket nyerjenek és tájékoztassák az üzleti döntéseket. Statisztikai módszereket, gépi tanulást és programozást használnak problémák megoldására és prediktív modellek létrehozására.',
        tips: [
          'Hangsúlyozza műszaki készségeit és programozási nyelveit',
          'Kiemeli az adatelemzés és gépi tanulás tapasztalatát',
          'Mutatja be projekteit és üzleti hatásukat',
          'Tartalmazza az adatvizualizációs eszközökkel szerzett tapasztalatát',
          'Mutassa be statisztikai és elemző képességeit'
        ],
        skills: [
          'Adatelemzés és statisztikai modellezés',
          'Programozás (Python, R, SQL)',
          'Gépi tanulás és AI',
          'Adatvizualizáció (Tableau, Power BI)',
          'Big data technológiák (Hadoop, Spark)',
          'Adatbázis-kezelés és lekérdezés',
          'Üzleti intelligencia és jelentéskészítés'
        ],
        whyGood: [
          'Világos struktúra, amely kiemeli a műszaki szakértelem',
          'Hangsúlyozza az adatalapú eredményeket és hatást',
          'Mutatja a releváns eszközök és technológiák ismeretét',
          'Bebizonyítja az elemző és problémamegoldó képességeket',
          'ATS-barát formátum adattudományi kulcsszavakkal'
        ]
      },
      el: {
        name: 'Επιστήμονας Δεδομένων',
        slug: 'epistimonas-dedomenon',
        description: 'Οι επιστήμονες δεδομένων αναλύουν πολύπλοκα σύνολα δεδομένων για να εξάγουν πληροφορίες και να ενημερώσουν τις επιχειρηματικές αποφάσεις. Χρησιμοποιούν στατιστικές μεθόδους, μηχανική μάθηση και προγραμματισμό για να λύσουν προβλήματα και να δημιουργήσουν προγνωστικά μοντέλα.',
        tips: [
          'Επισημάνετε τις τεχνικές σας δεξιότητες και γλώσσες προγραμματισμού',
          'Τονίστε εμπειρία με ανάλυση δεδομένων και μηχανική μάθηση',
          'Παρουσιάστε έργα και την επιχειρηματική τους επίπτωση',
          'Συμπεριλάβετε εμπειρία με εργαλεία οπτικοποίησης δεδομένων',
          'Αποδείξτε στατιστικές και αναλυτικές ικανότητες'
        ],
        skills: [
          'Ανάλυση δεδομένων και στατιστική μοντελοποίηση',
          'Προγραμματισμός (Python, R, SQL)',
          'Μηχανική μάθηση και AI',
          'Οπτικοποίηση δεδομένων (Tableau, Power BI)',
          'Τεχνολογίες big data (Hadoop, Spark)',
          'Διαχείριση και ερώτηση βάσεων δεδομένων',
          'Επιχειρηματική νοημοσύνη και αναφορά'
        ],
        whyGood: [
          'Σαφής δομή που επισημαίνει την τεχνική εμπειρογνωμοσύνη',
          'Τονίζει τα αποτελέσματα που βασίζονται σε δεδομένα και την επίπτωση',
          'Δείχνει ικανότητα με σχετικά εργαλεία και τεχνολογίες',
          'Αποδεικνύει αναλυτικές και ικανότητες επίλυσης προβλημάτων',
          'Μορφή συμβατή με ATS με λέξεις-κλειδιά επιστήμης δεδομένων'
        ]
      },
      cs: {
        name: 'Datový Vědec',
        slug: 'datovy-vedec',
        description: 'Datoví vědci analyzují složité datové sady, aby získali poznatky a informovali obchodní rozhodnutí. Používají statistické metody, strojové učení a programování k řešení problémů a vytváření prediktivních modelů.',
        tips: [
          'Zdůrazněte své technické dovednosti a programovací jazyky',
          'Zdůrazněte zkušenosti s analýzou dat a strojovým učením',
          'Ukažte projekty a jejich obchodní dopad',
          'Zahrňte zkušenosti s nástroji pro vizualizaci dat',
          'Prokažte statistické a analytické schopnosti'
        ],
        skills: [
          'Analýza dat a statistické modelování',
          'Programování (Python, R, SQL)',
          'Strojové učení a AI',
          'Vizualizace dat (Tableau, Power BI)',
          'Big data technologie (Hadoop, Spark)',
          'Správa a dotazování databází',
          'Business intelligence a reportování'
        ],
        whyGood: [
          'Jasná struktura zdůrazňující technickou odbornost',
          'Zdůrazňuje výsledky založené na datech a dopad',
          'Ukazuje znalost relevantních nástrojů a technologií',
          'Prokazuje analytické a problémové schopnosti',
          'Formát kompatibilní s ATS s klíčovými slovy data science'
        ]
      },
      pt: {
        name: 'Cientista de Dados',
        slug: 'cientista-dados',
        description: 'Cientistas de dados analisam conjuntos de dados complexos para extrair insights e informar decisões de negócios. Eles usam métodos estatísticos, aprendizado de máquina e programação para resolver problemas e criar modelos preditivos.',
        tips: [
          'Destaque suas habilidades técnicas e linguagens de programação',
          'Enfatize experiência com análise de dados e aprendizado de máquina',
          'Mostre projetos e seu impacto nos negócios',
          'Inclua experiência com ferramentas de visualização de dados',
          'Demonstre capacidades estatísticas e analíticas'
        ],
        skills: [
          'Análise de dados e modelagem estatística',
          'Programação (Python, R, SQL)',
          'Aprendizado de máquina e IA',
          'Visualização de dados (Tableau, Power BI)',
          'Tecnologias de big data (Hadoop, Spark)',
          'Gerenciamento e consulta de bancos de dados',
          'Business intelligence e relatórios'
        ],
        whyGood: [
          'Estrutura clara destacando expertise técnica',
          'Enfatiza resultados baseados em dados e impacto',
          'Mostra proficiência com ferramentas e tecnologias relevantes',
          'Demonstra habilidades analíticas e de resolução de problemas',
          'Formato compatível com ATS com palavras-chave de ciência de dados'
        ]
      },
      sv: {
        name: 'Dataanalytiker',
        slug: 'dataanalytiker',
        description: 'Dataanalytiker analyserar komplexa dataset för att extrahera insikter och informera affärsbeslut. De använder statistiska metoder, maskininlärning och programmering för att lösa problem och skapa prediktiva modeller.',
        tips: [
          'Framhäv dina tekniska färdigheter och programmeringsspråk',
          'Betona erfarenhet av dataanalys och maskininlärning',
          'Visa projekt och deras affärspåverkan',
          'Inkludera erfarenhet av datavisualiseringsverktyg',
          'Visa statistiska och analytiska förmågor'
        ],
        skills: [
          'Dataanalys och statistisk modellering',
          'Programmering (Python, R, SQL)',
          'Maskininlärning och AI',
          'Datavisualisering (Tableau, Power BI)',
          'Big data-tekniker (Hadoop, Spark)',
          'Databashantering och frågor',
          'Business intelligence och rapportering'
        ],
        whyGood: [
          'Tydelig struktur som framhäver teknisk expertis',
          'Betona datadrivna resultat och påverkan',
          'Visar kompetens med relevanta verktyg och tekniker',
          'Demonstrerar analytiska och problemlösningsförmågor',
          'ATS-vänligt format med data science-nyckelord'
        ]
      },
      bg: {
        name: 'Специалист по Данни',
        slug: 'spetsialist-po-danni',
        description: 'Специалистите по данни анализират сложни набори от данни, за да извлекат прозрения и информират бизнес решенията. Те използват статистически методи, машинно обучение и програмиране за решаване на проблеми и създаване на предсказващи модели.',
        tips: [
          'Подчертайте техническите си умения и програмни езици',
          'Акцентирайте върху опита с анализ на данни и машинно обучение',
          'Покажете проекти и тяхното бизнес въздействие',
          'Включете опит с инструменти за визуализация на данни',
          'Демонстрирайте статистически и аналитични способности'
        ],
        skills: [
          'Анализ на данни и статистическо моделиране',
          'Програмиране (Python, R, SQL)',
          'Машинно обучение и AI',
          'Визуализация на данни (Tableau, Power BI)',
          'Big data технологии (Hadoop, Spark)',
          'Управление и заявки към бази данни',
          'Бизнес интелект и отчети'
        ],
        whyGood: [
          'Ясна структура, която подчертава техническата експертиза',
          'Акцентира върху резултатите, базирани на данни, и въздействието',
          'Показва компетентност с релевантни инструменти и технологии',
          'Демонстрира аналитични и способности за решаване на проблеми',
          'Формат, съвместим с ATS, с ключови думи за наука за данни'
        ]
      },
      da: {
        name: 'Datavidenskabsmand',
        slug: 'datavidenskabsmand',
        description: 'Datavidenskabsmænd analyserer komplekse datasæt for at udtrække indsigt og informere forretningsbeslutninger. De bruger statistiske metoder, maskinlæring og programmering til at løse problemer og oprette prædiktive modeller.',
        tips: [
          'Fremhæv dine tekniske færdigheder og programmeringssprog',
          'Fremhæv erfaring med dataanalyse og maskinlæring',
          'Vis projekter og deres forretningspåvirkning',
          'Inkluder erfaring med datavisualiseringsværktøjer',
          'Demonstrer statistiske og analytiske evner'
        ],
        skills: [
          'Dataanalyse og statistisk modellering',
          'Programmering (Python, R, SQL)',
          'Maskinlæring og AI',
          'Datavisualisering (Tableau, Power BI)',
          'Big data-teknologier (Hadoop, Spark)',
          'Databaseforvaltning og forespørgsler',
          'Business intelligence og rapportering'
        ],
        whyGood: [
          'Tydelig struktur, der fremhæver teknisk ekspertise',
          'Fremhæver datadrevne resultater og påvirkning',
          'Viser kompetence med relevante værktøjer og teknologier',
          'Demonstrer analytiske og problemløsningsevner',
          'ATS-venligt format med data science-nøgleord'
        ]
      },
      fi: {
        name: 'Tietotieteilijä',
        slug: 'tietotieteilija',
        description: 'Tietotieteilijät analysoivat monimutkaisia tietoaineistoja saadakseen oivalluksia ja informoidakseen liiketoimintapäätöksiä. He käyttävät tilastollisia menetelmiä, koneoppimista ja ohjelmointia ongelmien ratkaisemiseen ja ennustavien mallien luomiseen.',
        tips: [
          'Korosta tekniset taitosi ja ohjelmointikielet',
          'Korosta kokemusta tietoanalyysistä ja koneoppimisesta',
          'Näytä projektit ja niiden liiketoimintavaikutus',
          'Sisällytä kokemus tietojen visualisointityökaluista',
          'Näytä tilastolliset ja analyyttiset kyvyt'
        ],
        skills: [
          'Tietoanalyysi ja tilastollinen mallintaminen',
          'Ohjelmointi (Python, R, SQL)',
          'Koneoppiminen ja AI',
          'Tietojen visualisointi (Tableau, Power BI)',
          'Big data -teknologiat (Hadoop, Spark)',
          'Tietokantojen hallinta ja kyselyt',
          'Liiketoimintatiedon hallinta ja raportointi'
        ],
        whyGood: [
          'Selkeä rakenne, joka korostaa teknistä asiantuntemusta',
          'Korostaa datapohjaisia tuloksia ja vaikutusta',
          'Näyttää pätevyyden relevanttien työkalujen ja teknologioiden kanssa',
          'Näyttää analyyttisiä ja ongelmanratkaisukykyjä',
          'ATS-yhteensopiva muoto datatieteen avainsanoilla'
        ]
      },
      sk: {
        name: 'Dátový Vedec',
        slug: 'datovy-vedec',
        description: 'Dátoví vedci analyzujú zložité súbory dát, aby získali poznatky a informovali obchodné rozhodnutia. Používajú štatistické metódy, strojové učenie a programovanie na riešenie problémov a vytváranie prediktívnych modelov.',
        tips: [
          'Zdôraznite svoje technické zručnosti a programovacie jazyky',
          'Zdôraznite skúsenosti s analýzou dát a strojovým učením',
          'Ukážte projekty a ich obchodný dopad',
          'Zahrňte skúsenosti s nástrojmi na vizualizáciu dát',
          'Preukážte štatistické a analytické schopnosti'
        ],
        skills: [
          'Analýza dát a štatistické modelovanie',
          'Programovanie (Python, R, SQL)',
          'Strojové učenie a AI',
          'Vizualizácia dát (Tableau, Power BI)',
          'Big data technológie (Hadoop, Spark)',
          'Správa a dotazovanie databáz',
          'Business intelligence a reportovanie'
        ],
        whyGood: [
          'Jasná štruktúra zdôrazňujúca technickú odbornosť',
          'Zdôrazňuje výsledky založené na dátach a dopad',
          'Ukazuje znalosť relevantných nástrojov a technológií',
          'Preukazuje analytické a problémové schopnosti',
          'Formát kompatibilný s ATS s kľúčovými slovami data science'
        ]
      },
      no: {
        name: 'Dataanalytiker',
        slug: 'dataanalytiker',
        description: 'Dataanalytikere analyserer komplekse datasett for å utvinne innsikt og informere forretningsbeslutninger. De bruker statistiske metoder, maskinlæring og programmering for å løse problemer og opprette prediktive modeller.',
        tips: [
          'Fremhev dine tekniske ferdigheter og programmeringsspråk',
          'Fremhev erfaring med dataanalyse og maskinlæring',
          'Vis prosjekter og deres forretningspåvirkning',
          'Inkluder erfaring med datavisualiseringsverktøy',
          'Demonstrer statistiske og analytiske evner'
        ],
        skills: [
          'Dataanalyse og statistisk modellering',
          'Programmering (Python, R, SQL)',
          'Maskinlæring og AI',
          'Datavisualisering (Tableau, Power BI)',
          'Big data-teknologier (Hadoop, Spark)',
          'Databaseforvaltning og spørringer',
          'Business intelligence og rapportering'
        ],
        whyGood: [
          'Tydelig struktur som fremhever teknisk ekspertise',
          'Fremhever datadrevne resultater og påvirkning',
          'Viser kompetanse med relevante verktøy og teknologier',
          'Demonstrer analytiske og problemløsningsevner',
          'ATS-vennlig format med data science-nøkkelord'
        ]
      },
      hr: {
        name: 'Znanstvenik Podataka',
        slug: 'znanstvenik-podataka',
        description: 'Znanstvenici podataka analiziraju složene skupove podataka kako bi izvukli uvide i informirali poslovne odluke. Koriste statističke metode, strojno učenje i programiranje za rješavanje problema i stvaranje prediktivnih modela.',
        tips: [
          'Istaknite svoje tehničke vještine i programskе jezike',
          'Naglasite iskustvo s analizom podataka i strojnim učenjem',
          'Pokažite projekte i njihov poslovni utjecaj',
          'Uključite iskustvo s alatima za vizualizaciju podataka',
          'Pokažite statističke i analitičke sposobnosti'
        ],
        skills: [
          'Analiza podataka i statističko modeliranje',
          'Programiranje (Python, R, SQL)',
          'Strojno učenje i AI',
          'Vizualizacija podataka (Tableau, Power BI)',
          'Big data tehnologije (Hadoop, Spark)',
          'Upravljanje i upiti baza podataka',
          'Poslovna inteligencija i izvještavanje'
        ],
        whyGood: [
          'Jasna struktura koja ističe tehničku stručnost',
          'Naglašava rezultate temeljene na podacima i utjecaj',
          'Prikazuje kompetenciju s relevantnim alatima i tehnologijama',
          'Pokazuje analitičke i sposobnosti rješavanja problema',
          'Format kompatibilan s ATS s ključnim riječima znanosti o podacima'
        ]
      },
      sr: {
        name: 'Научник Података',
        slug: 'naucnik-podataka',
        description: 'Научници података анализирају сложене скупове података како би извукли увиде и информисали пословне одлуке. Користе статистичке методе, машинско учење и програмирање за решавање проблема и стварање предиктивних модела.',
        tips: [
          'Истакните своје техничке вештине и програмске језике',
          'Нагласите искуство са анализом података и машинским учењем',
          'Покажите пројекте и њихов пословни утицај',
          'Укључите искуство са алатима за визуелизацију података',
          'Покажите статистичке и аналитичке способности'
        ],
        skills: [
          'Анализа података и статистичко моделовање',
          'Програмирање (Python, R, SQL)',
          'Машинско учење и AI',
          'Визуелизација података (Tableau, Power BI)',
          'Big data технологије (Hadoop, Spark)',
          'Управљање и упити база података',
          'Пословна интелигенција и извештавање'
        ],
        whyGood: [
          'Јасна структура која истиче техничку стручност',
          'Наглашава резултате засноване на подацима и утицај',
          'Приказује компетенцију са релевантним алатима и технологијама',
          'Показује аналитичке и способности решавања проблема',
          'Формат компатибилан са ATS са кључним речима науке о подацима'
        ]
      }
    }
  },
  // Healthcare: Doctor
  {
    id: 'doctor',
    category: 'healthcare',
    translations: {
      en: {
        name: 'Doctor',
        slug: 'doctor',
        description: 'Doctors diagnose and treat medical conditions, provide preventive care, and guide patients through health challenges. They work in hospitals, clinics, private practices, and specialized medical facilities.',
        tips: [
          'Highlight your medical education and board certifications',
          'Emphasize clinical experience and patient outcomes',
          'Showcase specialized training and areas of expertise',
          'Include research publications and medical achievements',
          'Demonstrate commitment to continuing medical education'
        ],
        skills: [
          'Medical diagnosis and treatment planning',
          'Patient consultation and examination',
          'Surgical procedures (if applicable)',
          'Medical record documentation',
          'Interdisciplinary team collaboration',
          'Medical research and evidence-based practice',
          'Patient communication and empathy'
        ],
        whyGood: [
          'Clear structure highlighting medical qualifications',
          'Emphasizes clinical expertise and patient care',
          'Shows progression of medical training and specialization',
          'Demonstrates commitment to medical excellence',
          'ATS-friendly format with medical keywords'
        ]
      },
      nl: {
        name: 'Arts',
        slug: 'arts',
        description: 'Artsen diagnosticeren en behandelen medische aandoeningen, bieden preventieve zorg en begeleiden patiënten bij gezondheidsuitdagingen. Ze werken in ziekenhuizen, klinieken, privépraktijken en gespecialiseerde medische faciliteiten.',
        tips: [
          'Benadruk je medische opleiding en certificeringen',
          'Leg nadruk op klinische ervaring en patiëntresultaten',
          'Toon gespecialiseerde training en expertisegebieden',
          'Vermeld onderzoekspublicaties en medische prestaties',
          'Demonstreer toewijding aan voortgezette medische opleiding'
        ],
        skills: [
          'Medische diagnose en behandelplanning',
          'Patiëntconsultatie en onderzoek',
          'Chirurgische procedures (indien van toepassing)',
          'Medische dossiers documentatie',
          'Interdisciplinaire team samenwerking',
          'Medisch onderzoek en evidence-based praktijk',
          'Patiëntcommunicatie en empathie'
        ],
        whyGood: [
          'Duidelijke structuur die medische kwalificaties benadrukt',
          'Legt nadruk op klinische expertise en patiëntenzorg',
          'Toont progressie van medische training en specialisatie',
          'Demonstreert toewijding aan medische excellentie',
          'ATS-vriendelijk formaat met medische trefwoorden'
        ]
      },
      fr: {
        name: 'Médecin',
        slug: 'medecin',
        description: 'Les médecins diagnostiquent et traitent les affections médicales, fournissent des soins préventifs et guident les patients face aux défis de santé. Ils travaillent dans les hôpitaux, cliniques, cabinets privés et établissements médicaux spécialisés.',
        tips: [
          'Mettez en avant votre formation médicale et certifications',
          'Soulignez l\'expérience clinique et les résultats des patients',
          'Montrez la formation spécialisée et domaines d\'expertise',
          'Incluez publications de recherche et réalisations médicales',
          'Démontrez l\'engagement envers la formation médicale continue'
        ],
        skills: [
          'Diagnostic médical et planification du traitement',
          'Consultation et examen des patients',
          'Procédures chirurgicales (le cas échéant)',
          'Documentation des dossiers médicaux',
          'Collaboration d\'équipe interdisciplinaire',
          'Recherche médicale et pratique fondée sur des preuves',
          'Communication avec les patients et empathie'
        ],
        whyGood: [
          'Structure claire mettant en évidence les qualifications médicales',
          'Met l\'accent sur l\'expertise clinique et les soins aux patients',
          'Montre la progression de la formation médicale et spécialisation',
          'Démontre l\'engagement envers l\'excellence médicale',
          'Format compatible ATS avec mots-clés médicaux'
        ]
      },
      es: {
        name: 'Médico',
        slug: 'medico',
        description: 'Los médicos diagnostican y tratan condiciones médicas, brindan atención preventiva y guían a los pacientes a través de desafíos de salud. Trabajan en hospitales, clínicas, consultorios privados e instalaciones médicas especializadas.',
        tips: [
          'Destaca tu educación médica y certificaciones',
          'Enfatiza experiencia clínica y resultados del paciente',
          'Muestra formación especializada y áreas de experiencia',
          'Incluye publicaciones de investigación y logros médicos',
          'Demuestra compromiso con la educación médica continua'
        ],
        skills: [
          'Diagnóstico médico y planificación del tratamiento',
          'Consulta y examen del paciente',
          'Procedimientos quirúrgicos (si corresponde)',
          'Documentación de registros médicos',
          'Colaboración en equipo interdisciplinario',
          'Investigación médica y práctica basada en evidencia',
          'Comunicación con pacientes y empatía'
        ],
        whyGood: [
          'Estructura clara que destaca las calificaciones médicas',
          'Enfatiza la experiencia clínica y la atención al paciente',
          'Muestra la progresión de la formación médica y especialización',
          'Demuestra compromiso con la excelencia médica',
          'Formato compatible con ATS con palabras clave médicas'
        ]
      },
      de: {
        name: 'Arzt',
        slug: 'arzt',
        description: 'Ärzte diagnostizieren und behandeln medizinische Erkrankungen, bieten präventive Versorgung und begleiten Patienten bei gesundheitlichen Herausforderungen. Sie arbeiten in Krankenhäusern, Kliniken, Privatpraxen und spezialisierten medizinischen Einrichtungen.',
        tips: [
          'Heben Sie Ihre medizinische Ausbildung und Zertifizierungen hervor',
          'Betonen Sie klinische Erfahrung und Patientenergebnisse',
          'Zeigen Sie spezialisierte Ausbildung und Fachgebiete',
          'Fügen Sie Forschungsveröffentlichungen und medizinische Leistungen hinzu',
          'Demonstrieren Sie Engagement für kontinuierliche medizinische Ausbildung'
        ],
        skills: [
          'Medizinische Diagnose und Behandlungsplanung',
          'Patientenberatung und Untersuchung',
          'Chirurgische Eingriffe (falls zutreffend)',
          'Medizinische Aktenführung',
          'Interdisziplinäre Teamzusammenarbeit',
          'Medizinische Forschung und evidenzbasierte Praxis',
          'Patientenkommunikation und Empathie'
        ],
        whyGood: [
          'Klare Struktur, die medizinische Qualifikationen hervorhebt',
          'Betont klinische Expertise und Patientenversorgung',
          'Zeigt Fortschritt der medizinischen Ausbildung und Spezialisierung',
          'Demonstriert Engagement für medizinische Exzellenz',
          'ATS-freundliches Format mit medizinischen Schlüsselwörtern'
        ]
      },
      it: {
        name: 'Medico',
        slug: 'medico',
        description: 'I medici diagnosticano e trattano condizioni mediche, forniscono cure preventive e guidano i pazienti attraverso le sfide sanitarie. Lavorano in ospedali, cliniche, studi privati e strutture mediche specializzate.',
        tips: [
          'Evidenzia la tua formazione medica e certificazioni',
          'Enfatizza l\'esperienza clinica e i risultati dei pazienti',
          'Mostra formazione specializzata e aree di competenza',
          'Includi pubblicazioni di ricerca e risultati medici',
          'Dimostra impegno per la formazione medica continua'
        ],
        skills: [
          'Diagnosi medica e pianificazione del trattamento',
          'Consultazione e esame del paziente',
          'Procedure chirurgiche (se applicabile)',
          'Documentazione delle cartelle cliniche',
          'Collaborazione in team interdisciplinare',
          'Ricerca medica e pratica basata sull\'evidenza',
          'Comunicazione con i pazienti ed empatia'
        ],
        whyGood: [
          'Struttura chiara che evidenzia le qualifiche mediche',
          'Enfatizza l\'esperienza clinica e la cura del paziente',
          'Mostra la progressione della formazione medica e specializzazione',
          'Dimostra impegno per l\'eccellenza medica',
          'Formato compatibile ATS con parole chiave mediche'
        ]
      },
      pl: {
        name: 'Lekarz',
        slug: 'lekarz',
        description: 'Lekarze diagnozują i leczą schorzenia medyczne, zapewniają opiekę profilaktyczną i wspierają pacjentów w wyzwaniach zdrowotnych. Pracują w szpitalach, klinikach, prywatnych praktykach i specjalistycznych placówkach medycznych.',
        tips: [
          'Podkreśl swoje wykształcenie medyczne i certyfikaty',
          'Podkreśl doświadczenie kliniczne i wyniki pacjentów',
          'Pokaż specjalistyczne szkolenia i obszary ekspertyzy',
          'Uwzględnij publikacje badawcze i osiągnięcia medyczne',
          'Wykazuj zaangażowanie w ciągłe kształcenie medyczne'
        ],
        skills: [
          'Diagnoza medyczna i planowanie leczenia',
          'Konsultacja i badanie pacjenta',
          'Procedury chirurgiczne (jeśli dotyczy)',
          'Dokumentacja kart medycznych',
          'Współpraca w zespole interdyscyplinarnym',
          'Badania medyczne i praktyka oparta na dowodach',
          'Komunikacja z pacjentem i empatia'
        ],
        whyGood: [
          'Jasna struktura podkreślająca kwalifikacje medyczne',
          'Podkreśla wiedzę kliniczną i opiekę nad pacjentem',
          'Pokazuje postęp w szkoleniu medycznym i specjalizacji',
          'Wykazuje zaangażowanie w doskonałość medyczną',
          'Format przyjazny dla ATS z kluczowymi słowami medycznymi'
        ]
      },
      ro: {
        name: 'Medic',
        slug: 'medic',
        description: 'Medicii diagnostică și tratează afecțiuni medicale, oferă îngrijire preventivă și ghidează pacienții prin provocări de sănătate. Lucrează în spitale, clinici, cabinete private și facilități medicale specializate.',
        tips: [
          'Evidențiază educația medicală și certificările',
          'Subliniază experiența clinică și rezultatele pacienților',
          'Prezintă formarea specializată și domeniile de expertiză',
          'Include publicații de cercetare și realizări medicale',
          'Demonstrează angajamentul față de educația medicală continuă'
        ],
        skills: [
          'Diagnostic medical și planificare tratament',
          'Consultare și examinare pacient',
          'Proceduri chirurgicale (dacă este cazul)',
          'Documentare fișe medicale',
          'Colaborare echipă interdisciplinară',
          'Cercetare medicală și practică bazată pe dovezi',
          'Comunicare cu pacienții și empatie'
        ],
        whyGood: [
          'Structură clară care evidențiază calificările medicale',
          'Subliniază expertiza clinică și îngrijirea pacienților',
          'Arată progresia formării medicale și specializare',
          'Demonstrează angajamentul față de excelența medicală',
          'Format compatibil ATS cu cuvinte cheie medicale'
        ]
      },
      hu: {
        name: 'Orvos',
        slug: 'orvos',
        description: 'Az orvosok diagnosztizálják és kezelik az orvosi állapotokat, megelőző ellátást nyújtanak és egészségügyi kihívások során vezetik a betegeket. Kórházakban, klinikákon, magánrendelőkben és szakorvosi létesítményekben dolgoznak.',
        tips: [
          'Hangsúlyozza orvosi képzését és szakmai tanúsítványait',
          'Hangsúlyozza a klinikai tapasztalatot és a betegeredményeket',
          'Mutassa be a szakirányú képzést és szakértelmi területeket',
          'Tartalmazza a kutatási publikációkat és orvosi eredményeket',
          'Mutassa be az orvosi továbbképzéshez való elkötelezettségét'
        ],
        skills: [
          'Orvosi diagnosztika és kezelési tervezés',
          'Betegkonzultáció és vizsgálat',
          'Sebészeti eljárások (ha alkalmazandó)',
          'Orvosi nyilvántartások dokumentálása',
          'Interdiszciplináris csapatmunka',
          'Orvosi kutatás és bizonyítékokon alapuló gyakorlat',
          'Betegkommunikáció és empátia'
        ],
        whyGood: [
          'Világos struktúra, amely kiemeli az orvosi képzettségeket',
          'Hangsúlyozza a klinikai szakértelem és betegellátást',
          'Mutatja az orvosi képzés és szpecializáció fejlődését',
          'Bemutatja az orvosi kiválósághoz való elkötelezettséget',
          'ATS-barát formátum orvosi kulcsszavakkal'
        ]
      },
      el: {
        name: 'Γιατρός',
        slug: 'giatros',
        description: 'Οι γιατροί διαγιγνώσκουν και θεραπεύουν ιατρικές παθήσεις, παρέχουν προληπτική φροντίδα και καθοδηγούν ασθενείς μέσα από προκλήσεις υγείας. Εργάζονται σε νοσοκομεία, κλινικές, ιδιωτικά ιατρεία και εξειδικευμένες ιατρικές εγκαταστάσεις.',
        tips: [
          'Επισημάνετε την ιατρική σας εκπαίδευση και πιστοποιήσεις',
          'Τονίστε την κλινική εμπειρία και τα αποτελέσματα των ασθενών',
          'Παρουσιάστε εξειδικευμένη εκπαίδευση και τομείς ειδίκευσης',
          'Συμπεριλάβετε ερευνητικές δημοσιεύσεις και ιατρικά επιτεύγματα',
          'Αποδείξτε δέσμευση στη συνεχή ιατρική εκπαίδευση'
        ],
        skills: [
          'Ιατρική διάγνωση και σχεδιασμός θεραπείας',
          'Συμβουλευτική και εξέταση ασθενών',
          'Χειρουργικές διαδικασίες (εάν ισχύει)',
          'Τεκμηρίωση ιατρικών φακέλων',
          'Διαθεματική συνεργασία ομάδας',
          'Ιατρική έρευνα και πρακτική βασισμένη σε αποδείξεις',
          'Επικοινωνία με ασθενείς και ενσυναίσθηση'
        ],
        whyGood: [
          'Σαφής δομή που επισημαίνει τις ιατρικές προσόντα',
          'Τονίζει την κλινική εμπειρογνωμοσύνη και φροντίδα ασθενών',
          'Δείχνει την πρόοδο της ιατρικής εκπαίδευσης και εξειδίκευσης',
          'Αποδεικνύει δέσμευση στην ιατρική αριστεία',
          'Μορφή συμβατή με ATS με ιατρικές λέξεις-κλειδιά'
        ]
      },
      cs: {
        name: 'Lékař',
        slug: 'lekar',
        description: 'Lékaři diagnostikují a léčí zdravotní stavy, poskytují preventivní péči a vedou pacienty při zdravotních výzvách. Pracují v nemocnicích, klinikách, soukromých ordinacích a specializovaných zdravotnických zařízeních.',
        tips: [
          'Zdůrazněte své lékařské vzdělání a certifikace',
          'Zdůrazněte klinické zkušenosti a výsledky pacientů',
          'Ukažte specializované školení a oblasti odbornosti',
          'Zahrňte výzkumné publikace a lékařské úspěchy',
          'Prokažte závazek k dalšímu lékařskému vzdělávání'
        ],
        skills: [
          'Lékařská diagnostika a plánování léčby',
          'Konzultace a vyšetření pacienta',
          'Chirurgické zákroky (pokud je to možné)',
          'Dokumentace lékařských záznamů',
          'Mezioborová týmová spolupráce',
          'Lékařský výzkum a praxe založená na důkazech',
          'Komunikace s pacienty a empatie'
        ],
        whyGood: [
          'Jasná struktura zdůrazňující lékařské kvalifikace',
          'Zdůrazňuje klinickou odbornost a péči o pacienty',
          'Ukazuje pokrok v lékařském vzdělávání a specializaci',
          'Prokazuje závazek k lékařské excelenci',
          'Formát kompatibilní s ATS s lékařskými klíčovými slovy'
        ]
      },
      pt: {
        name: 'Médico',
        slug: 'medico',
        description: 'Os médicos diagnosticam e tratam condições médicas, fornecem cuidados preventivos e orientam pacientes através de desafios de saúde. Trabalham em hospitais, clínicas, consultórios privados e instalações médicas especializadas.',
        tips: [
          'Destaque sua educação médica e certificações',
          'Enfatize experiência clínica e resultados dos pacientes',
          'Mostre treinamento especializado e áreas de expertise',
          'Inclua publicações de pesquisa e conquistas médicas',
          'Demonstre compromisso com educação médica contínua'
        ],
        skills: [
          'Diagnóstico médico e planejamento de tratamento',
          'Consulta e exame do paciente',
          'Procedimentos cirúrgicos (se aplicável)',
          'Documentação de registros médicos',
          'Colaboração em equipe interdisciplinar',
          'Pesquisa médica e prática baseada em evidências',
          'Comunicação com pacientes e empatia'
        ],
        whyGood: [
          'Estrutura clara destacando qualificações médicas',
          'Enfatiza expertise clínica e cuidado ao paciente',
          'Mostra progressão do treinamento médico e especialização',
          'Demonstra compromisso com excelência médica',
          'Formato compatível com ATS com palavras-chave médicas'
        ]
      },
      sv: {
        name: 'Läkare',
        slug: 'lakare',
        description: 'Läkare diagnostiserar och behandlar medicinska tillstånd, ger förebyggande vård och vägleder patienter genom hälsoutmaningar. De arbetar på sjukhus, kliniker, privata mottagningar och specialiserade medicinska anläggningar.',
        tips: [
          'Framhäva din medicinska utbildning och certifieringar',
          'Betona klinisk erfarenhet och patientresultat',
          'Visa specialiserad utbildning och expertområden',
          'Inkludera forskningspublikationer och medicinska prestationer',
          'Visa engagemang för kontinuerlig medicinsk utbildning'
        ],
        skills: [
          'Medicinsk diagnostik och behandlingsplanering',
          'Patientkonsultation och undersökning',
          'Kirurgiska ingrepp (om tillämpligt)',
          'Dokumentation av medicinska journaler',
          'Tvärvetenskapligt teamarbete',
          'Medicinsk forskning och evidensbaserad praxis',
          'Patientkommunikation och empati'
        ],
        whyGood: [
          'Tydlig struktur som framhäver medicinska kvalifikationer',
          'Betonar klinisk expertis och patientvård',
          'Visar progression av medicinsk utbildning och specialisering',
          'Visar engagemang för medicinsk excellens',
          'ATS-vänligt format med medicinska nyckelord'
        ]
      },
      bg: {
        name: 'Лекар',
        slug: 'lekar',
        description: 'Лекарите диагностират и лекуват медицински състояния, осигуряват превантивна грижа и насочват пациенти през здравни предизвикателства. Работят в болници, клиники, частни практики и специализирани медицински заведения.',
        tips: [
          'Подчертайте медицинското си образование и сертификати',
          'Акцентирайте върху клиничния опит и резултатите на пациентите',
          'Покажете специализирано обучение и области на експертиза',
          'Включете изследователски публикации и медицински постижения',
          'Демонстрирайте ангажираност към непрекъснато медицинско образование'
        ],
        skills: [
          'Медицинска диагностика и планиране на лечение',
          'Консултация и преглед на пациент',
          'Хирургически процедури (ако е приложимо)',
          'Документиране на медицински записи',
          'Междисциплинарно екипно сътрудничество',
          'Медицинско изследване и практика, основана на доказателства',
          'Комуникация с пациенти и емпатия'
        ],
        whyGood: [
          'Ясна структура, подчертаваща медицинските квалификации',
          'Акцентира върху клиничната експертиза и грижата за пациентите',
          'Показва прогресия на медицинското обучение и специализация',
          'Демонстрира ангажираност към медицинско превъзходство',
          'Формат, съвместим с ATS с медицински ключови думи'
        ]
      },
      da: {
        name: 'Læge',
        slug: 'laege',
        description: 'Læger diagnosticerer og behandler medicinske tilstande, yder forebyggende pleje og vejleder patienter gennem sundhedsudfordringer. De arbejder på hospitaler, klinikker, private praksisser og specialiserede medicinske faciliteter.',
        tips: [
          'Fremhæv din medicinske uddannelse og certificeringer',
          'Fremhæv klinisk erfaring og patientresultater',
          'Vis specialiseret træning og ekspertiseområder',
          'Inkluder forskningspublikationer og medicinske præstationer',
          'Demonstrer forpligtelse til kontinuerlig medicinsk uddannelse'
        ],
        skills: [
          'Medicinsk diagnose og behandlingsplanlægning',
          'Patientkonsultation og undersøgelse',
          'Kirurgiske procedurer (hvis relevant)',
          'Dokumentation af medicinske journaler',
          'Tværfagligt teamarbejde',
          'Medicinsk forskning og evidensbaseret praksis',
          'Patientkommunikation og empati'
        ],
        whyGood: [
          'Tydelig struktur, der fremhæver medicinske kvalifikationer',
          'Fremhæver klinisk ekspertise og patientpleje',
          'Viser progression af medicinsk træning og specialisering',
          'Demonstrer forpligtelse til medicinsk ekspertise',
          'ATS-venligt format med medicinske nøgleord'
        ]
      },
      fi: {
        name: 'Lääkäri',
        slug: 'laakari',
        description: 'Lääkärit diagnostisoivat ja hoitavat lääketieteellisiä tiloja, tarjoavat ehkäisevää hoitoa ja ohjaavat potilaita terveyshaasteiden läpi. He työskentelevät sairaaloissa, klinikoilla, yksityisissä vastaanotoissa ja erikoistuneissa lääketieteellisissä laitoksissa.',
        tips: [
          'Korosta lääketieteellistä koulutustasi ja sertifikaatteja',
          'Korosta kliinistä kokemusta ja potilastuloksia',
          'Näytä erikoistunut koulutus ja asiantuntemuksen alat',
          'Sisällytä tutkimusjulkaisut ja lääketieteelliset saavutukset',
          'Näytä sitoutuminen jatkuvaan lääketieteelliseen koulutukseen'
        ],
        skills: [
          'Lääketieteellinen diagnosointi ja hoitosuunnittelu',
          'Potilaskonsultaatio ja tutkimus',
          'Kirurgiset toimenpiteet (jos soveltuu)',
          'Lääketieteellisten asiakirjojen dokumentointi',
          'Tieteidenvälinen tiimityö',
          'Lääketieteellinen tutkimus ja näyttöön perustuva käytäntö',
          'Potilaskommunikaatio ja empatia'
        ],
        whyGood: [
          'Selkeä rakenne, joka korostaa lääketieteellisiä pätevyyksiä',
          'Korostaa kliinistä asiantuntemusta ja potilashoitoa',
          'Näyttää lääketieteellisen koulutuksen ja erikoistumisen kehityksen',
          'Näyttää sitoutumisen lääketieteelliseen huippuosaamiseen',
          'ATS-yhteensopiva muoto lääketieteellisillä avainsanoilla'
        ]
      },
      sk: {
        name: 'Lekár',
        slug: 'lekar',
        description: 'Lekári diagnostikujú a liečia zdravotné stavy, poskytujú preventívnu starostlivosť a vedú pacientov cez zdravotné výzvy. Pracujú v nemocniciach, klinikách, súkromných ordináciách a špecializovaných zdravotníckych zariadeniach.',
        tips: [
          'Zdôraznite svoje lekárske vzdelanie a certifikácie',
          'Zdôraznite klinické skúsenosti a výsledky pacientov',
          'Ukážte špecializované školenie a oblasti odbornosti',
          'Zahrňte výskumné publikácie a lekárske úspechy',
          'Preukážte záväzok k ďalšiemu lekárskemu vzdelávaniu'
        ],
        skills: [
          'Lekárska diagnostika a plánovanie liečby',
          'Konzultácia a vyšetrenie pacienta',
          'Chirurgické zákroky (ak je to možné)',
          'Dokumentácia lekárskej dokumentácie',
          'Medzioborová tímová spolupráca',
          'Lekársky výskum a prax založená na dôkazoch',
          'Komunikácia s pacientmi a empatia'
        ],
        whyGood: [
          'Jasná štruktúra zdôrazňujúca lekárske kvalifikácie',
          'Zdôrazňuje klinickú odbornosť a starostlivosť o pacientov',
          'Ukazuje pokrok v lekárskej edukácii a špecializácii',
          'Preukazuje záväzok k lekárskej excelencii',
          'Formát kompatibilný s ATS s lekárske kľúčovými slovami'
        ]
      },
      no: {
        name: 'Lege',
        slug: 'lege',
        description: 'Leger diagnostiserer og behandler medisinske tilstander, gir forebyggende omsorg og veileder pasienter gjennom helseutfordringer. De arbeider på sykehus, klinikker, private praksiser og spesialiserte medisinske fasiliteter.',
        tips: [
          'Fremhev din medisinske utdanning og sertifiseringer',
          'Fremhev klinisk erfaring og pasientresultater',
          'Vis spesialisert trening og ekspertiseområder',
          'Inkluder forskningspublikasjoner og medisinske prestasjoner',
          'Vis forpliktelse til kontinuerlig medisinsk utdanning'
        ],
        skills: [
          'Medisinsk diagnostikk og behandlingsplanlegging',
          'Pasientkonsultasjon og undersøkelse',
          'Kirurgiske prosedyrer (hvis aktuelt)',
          'Dokumentasjon av medisinske journaler',
          'Tverrfaglig teamarbeid',
          'Medisinsk forskning og evidensbasert praksis',
          'Pasientkommunikasjon og empati'
        ],
        whyGood: [
          'Tydelig struktur som fremhever medisinske kvalifikasjoner',
          'Fremhever klinisk ekspertise og pasientomsorg',
          'Viser progresjon av medisinsk trening og spesialisering',
          'Viser forpliktelse til medisinsk ekspertise',
          'ATS-vennlig format med medisinske nøkkelord'
        ]
      },
      hr: {
        name: 'Liječnik',
        slug: 'lijecnik',
        description: 'Liječnici dijagnosticiraju i liječe medicinska stanja, pružaju preventivnu skrb i vode pacijente kroz zdravstvene izazove. Rade u bolnicama, klinikama, privatnim ordinacijama i specijaliziranim medicinskim ustanovama.',
        tips: [
          'Istaknite svoje medicinsko obrazovanje i certifikate',
          'Naglasite kliničko iskustvo i rezultate pacijenata',
          'Pokažite specijaliziranu obuku i područja stručnosti',
          'Uključite istraživačke publikacije i medicinska postignuća',
          'Pokažite predanost kontinuiranom medicinskom obrazovanju'
        ],
        skills: [
          'Medicinska dijagnostika i planiranje liječenja',
          'Konzultacija i pregled pacijenta',
          'Kirurški postupci (ako je primjenjivo)',
          'Dokumentacija medicinskih kartona',
          'Interdisciplinarna timska suradnja',
          'Medicinsko istraživanje i praksa temeljena na dokazima',
          'Komunikacija s pacijentima i empatija'
        ],
        whyGood: [
          'Jasna struktura koja ističe medicinske kvalifikacije',
          'Naglašava kliničku stručnost i skrb o pacijentima',
          'Pokazuje napredak medicinskog obrazovanja i specijalizacije',
          'Pokazuje predanost medicinskoj izvrsnosti',
          'Format kompatibilan s ATS s medicinskim ključnim riječima'
        ]
      },
      sr: {
        name: 'Лекар',
        slug: 'lekar',
        description: 'Лекари дијагностикују и лече медицинска стања, пружају превентивну негу и воде пацијенте кроз здравствене изазове. Раде у болницама, клиникама, приватним ординацијама и специјализованим медицинским установама.',
        tips: [
          'Истакните своје медицинско образовање и сертификате',
          'Нагласите клиничко искуство и резултате пацијената',
          'Покажите специјализовану обуку и области стручности',
          'Укључите истраживачке публикације и медицинска достигнућа',
          'Покажите посвећеност континуираном медицинском образовању'
        ],
        skills: [
          'Медицинска дијагноза и планирање лечења',
          'Консултација и преглед пацијента',
          'Хируршки поступци (ако је применљиво)',
          'Документовање медицинских картона',
          'Интердисциплинарна тимска сарадња',
          'Медицинско истраживање и пракса заснована на доказима',
          'Комуникација са пацијентима и емпатија'
        ],
        whyGood: [
          'Јасна структура која истиче медицинске квалификације',
          'Наглашава клиничку стручност и негу пацијената',
          'Показује напредак медицинског образовања и специјализације',
          'Показује посвећеност медицинској изврсности',
          'Формат компатибилан са ATS са медицинским кључним речима'
        ]
      }
    }
  },
  // Healthcare: Pharmacist
  {
    id: 'pharmacist',
    category: 'healthcare',
    translations: {
      en: {
        name: 'Pharmacist',
        slug: 'pharmacist',
        description: 'Pharmacists dispense medications, provide pharmaceutical care, and offer health advice to patients. They ensure safe and effective medication use and work in pharmacies, hospitals, and healthcare facilities.',
        tips: [
          'Highlight your pharmacy education and licensure',
          'Emphasize medication management and patient counseling experience',
          'Showcase knowledge of drug interactions and safety protocols',
          'Include experience with insurance and prescription processing',
          'Demonstrate commitment to patient health and safety'
        ],
        skills: [
          'Medication dispensing and verification',
          'Patient counseling and medication therapy management',
          'Drug interaction screening',
          'Prescription processing and insurance billing',
          'Pharmaceutical inventory management',
          'Compounding and sterile preparation',
          'Health screening and immunizations'
        ],
        whyGood: [
          'Clear structure highlighting pharmaceutical expertise',
          'Emphasizes patient care and medication safety',
          'Shows knowledge of pharmaceutical regulations',
          'Demonstrates commitment to healthcare excellence',
          'ATS-friendly format with pharmacy keywords'
        ]
      },
      nl: {
        name: 'Apotheker',
        slug: 'apotheker',
        description: 'Apothekers verstrekken medicijnen, bieden farmaceutische zorg en geven gezondheidsadvies aan patiënten. Ze zorgen voor veilig en effectief medicijngebruik en werken in apotheken, ziekenhuizen en zorginstellingen.',
        tips: [
          'Benadruk je apothekersopleiding en licentie',
          'Leg nadruk op medicatiebeheer en patiëntadvieservaring',
          'Toon kennis van geneesmiddelinteracties en veiligheidsprotocollen',
          'Vermeld ervaring met verzekeringen en receptverwerking',
          'Demonstreer toewijding aan patiëntgezondheid en veiligheid'
        ],
        skills: [
          'Medicatieverstrekking en verificatie',
          'Patiëntadvies en medicatietherapiebeheer',
          'Geneesmiddelinteractiescreening',
          'Receptverwerking en verzekeringsfacturering',
          'Farmaceutisch voorraadbeheer',
          'Bereiden en steriele bereiding',
          'Gezondheidsscreening en vaccinaties'
        ],
        whyGood: [
          'Duidelijke structuur die farmaceutische expertise benadrukt',
          'Legt nadruk op patiëntenzorg en medicatieveiligheid',
          'Toont kennis van farmaceutische regelgeving',
          'Demonstreert toewijding aan zorg excellentie',
          'ATS-vriendelijk formaat met apotheek trefwoorden'
        ]
      },
      fr: {
        name: 'Pharmacien',
        slug: 'pharmacien',
        description: 'Les pharmaciens délivrent des médicaments, fournissent des soins pharmaceutiques et offrent des conseils de santé aux patients. Ils assurent une utilisation sûre et efficace des médicaments et travaillent dans les pharmacies, hôpitaux et établissements de santé.',
        tips: [
          'Mettez en avant votre formation pharmaceutique et licence',
          'Soulignez l\'expérience en gestion des médicaments et conseil aux patients',
          'Montrez la connaissance des interactions médicamenteuses et protocoles de sécurité',
          'Incluez l\'expérience avec les assurances et traitement des ordonnances',
          'Démontrez l\'engagement envers la santé et la sécurité des patients'
        ],
        skills: [
          'Délivrance et vérification des médicaments',
          'Conseil aux patients et gestion de la thérapie médicamenteuse',
          'Dépistage des interactions médicamenteuses',
          'Traitement des ordonnances et facturation d\'assurance',
          'Gestion des stocks pharmaceutiques',
          'Préparation et préparation stérile',
          'Dépistage de santé et vaccinations'
        ],
        whyGood: [
          'Structure claire mettant en évidence l\'expertise pharmaceutique',
          'Met l\'accent sur les soins aux patients et la sécurité des médicaments',
          'Montre la connaissance des réglementations pharmaceutiques',
          'Démontre l\'engagement envers l\'excellence des soins de santé',
          'Format compatible ATS avec mots-clés pharmaceutiques'
        ]
      },
      es: {
        name: 'Farmacéutico',
        slug: 'farmaceutico',
        description: 'Los farmacéuticos dispensan medicamentos, brindan atención farmacéutica y ofrecen consejos de salud a los pacientes. Aseguran el uso seguro y efectivo de medicamentos y trabajan en farmacias, hospitales e instalaciones de salud.',
        tips: [
          'Destaca tu educación farmacéutica y licencia',
          'Enfatiza experiencia en gestión de medicamentos y asesoramiento al paciente',
          'Muestra conocimiento de interacciones farmacológicas y protocolos de seguridad',
          'Incluye experiencia con seguros y procesamiento de recetas',
          'Demuestra compromiso con la salud y seguridad del paciente'
        ],
        skills: [
          'Dispensación y verificación de medicamentos',
          'Asesoramiento al paciente y gestión de terapia farmacológica',
          'Detección de interacciones farmacológicas',
          'Procesamiento de recetas y facturación de seguros',
          'Gestión de inventario farmacéutico',
          'Preparación y preparación estéril',
          'Detección de salud e inmunizaciones'
        ],
        whyGood: [
          'Estructura clara que destaca la experiencia farmacéutica',
          'Enfatiza la atención al paciente y seguridad de medicamentos',
          'Muestra conocimiento de regulaciones farmacéuticas',
          'Demuestra compromiso con la excelencia en salud',
          'Formato compatible con ATS con palabras clave farmacéuticas'
        ]
      },
      de: {
        name: 'Apotheker',
        slug: 'apotheker',
        description: 'Apotheker geben Medikamente ab, bieten pharmazeutische Betreuung und geben Gesundheitsberatung für Patienten. Sie gewährleisten sichere und wirksame Medikamentenanwendung und arbeiten in Apotheken, Krankenhäusern und Gesundheitseinrichtungen.',
        tips: [
          'Heben Sie Ihre pharmazeutische Ausbildung und Lizenz hervor',
          'Betonen Sie Erfahrung in Arzneimittelverwaltung und Patientenberatung',
          'Zeigen Sie Kenntnisse über Arzneimittelwechselwirkungen und Sicherheitsprotokolle',
          'Fügen Sie Erfahrung mit Versicherungen und Rezeptverarbeitung hinzu',
          'Demonstrieren Sie Engagement für Patientengesundheit und Sicherheit'
        ],
        skills: [
          'Arzneimittelabgabe und Verifizierung',
          'Patientenberatung und Arzneimitteltherapiemanagement',
          'Arzneimittelwechselwirkungs-Screening',
          'Rezeptverarbeitung und Versicherungsabrechnung',
          'Pharmazeutisches Bestandsmanagement',
          'Zubereitung und sterile Herstellung',
          'Gesundheitsscreening und Impfungen'
        ],
        whyGood: [
          'Klare Struktur, die pharmazeutische Expertise hervorhebt',
          'Betont Patientenversorgung und Arzneimittelsicherheit',
          'Zeigt Kenntnisse pharmazeutischer Vorschriften',
          'Demonstriert Engagement für Exzellenz im Gesundheitswesen',
          'ATS-freundliches Format mit Apotheken-Schlüsselwörtern'
        ]
      },
      it: {
        name: 'Farmacista',
        slug: 'farmacista',
        description: 'I farmacisti dispensano farmaci, forniscono assistenza farmaceutica e offrono consigli sulla salute ai pazienti. Garantiscono un uso sicuro ed efficace dei farmaci e lavorano in farmacie, ospedali e strutture sanitarie.',
        tips: [
          'Evidenzia la tua formazione farmaceutica e licenza',
          'Enfatizza l\'esperienza nella gestione dei farmaci e consulenza ai pazienti',
          'Mostra conoscenza delle interazioni farmacologiche e protocolli di sicurezza',
          'Includi esperienza con assicurazioni e elaborazione delle prescrizioni',
          'Dimostra impegno per la salute e sicurezza del paziente'
        ],
        skills: [
          'Dispensazione e verifica dei farmaci',
          'Consulenza ai pazienti e gestione della terapia farmacologica',
          'Screening delle interazioni farmacologiche',
          'Elaborazione delle prescrizioni e fatturazione assicurativa',
          'Gestione dell\'inventario farmaceutico',
          'Preparazione e preparazione sterile',
          'Screening sanitario e immunizzazioni'
        ],
        whyGood: [
          'Struttura chiara che evidenzia l\'esperienza farmaceutica',
          'Enfatizza la cura del paziente e la sicurezza dei farmaci',
          'Mostra conoscenza delle normative farmaceutiche',
          'Dimostra impegno per l\'eccellenza sanitaria',
          'Formato compatibile ATS con parole chiave farmaceutiche'
        ]
      },
      pl: {
        name: 'Farmaceuta',
        slug: 'farmaceuta',
        description: 'Farmaceuci wydają leki, zapewniają opiekę farmaceutyczną i oferują porady zdrowotne pacjentom. Zapewniają bezpieczne i skuteczne stosowanie leków i pracują w aptekach, szpitalach i placówkach opieki zdrowotnej.',
        tips: [
          'Podkreśl swoje wykształcenie farmaceutyczne i licencję',
          'Podkreśl doświadczenie w zarządzaniu lekami i poradnictwie dla pacjentów',
          'Pokaż znajomość interakcji lekowych i protokołów bezpieczeństwa',
          'Uwzględnij doświadczenie z ubezpieczeniami i przetwarzaniem recept',
          'Wykazuj zaangażowanie w zdrowie i bezpieczeństwo pacjentów'
        ],
        skills: [
          'Wydawanie i weryfikacja leków',
          'Poradnictwo dla pacjentów i zarządzanie terapią lekową',
          'Badanie interakcji lekowych',
          'Przetwarzanie recept i rozliczanie ubezpieczeń',
          'Zarządzanie zapasami farmaceutycznymi',
          'Przygotowywanie i sterylna preparatyka',
          'Badania przesiewowe i szczepienia'
        ],
        whyGood: [
          'Jasna struktura podkreślająca wiedzę farmaceutyczną',
          'Podkreśla opiekę nad pacjentem i bezpieczeństwo leków',
          'Pokazuje znajomość przepisów farmaceutycznych',
          'Wykazuje zaangażowanie w doskonałość opieki zdrowotnej',
          'Format przyjazny dla ATS z kluczowymi słowami farmaceutycznymi'
        ]
      },
      ro: {
        name: 'Farmacist',
        slug: 'farmacist',
        description: 'Farmaciștii eliberează medicamente, oferă îngrijire farmaceutică și oferă sfaturi de sănătate pacienților. Asigură utilizarea sigură și eficientă a medicamentelor și lucrează în farmacii, spitale și facilități de sănătate.',
        tips: [
          'Evidențiază educația farmaceutică și licența',
          'Subliniază experiența în managementul medicamentelor și consilierea pacienților',
          'Prezintă cunoștințe despre interacțiunile medicamentoase și protocoalele de siguranță',
          'Include experiența cu asigurările și procesarea rețetelor',
          'Demonstrează angajamentul față de sănătatea și siguranța pacienților'
        ],
        skills: [
          'Eliberarea și verificarea medicamentelor',
          'Consilierea pacienților și managementul terapiei medicamentoase',
          'Screeningul interacțiunilor medicamentoase',
          'Procesarea rețetelor și facturarea asigurărilor',
          'Managementul inventarului farmaceutic',
          'Prepararea și prepararea sterilă',
          'Screeningul sănătății și imunizările'
        ],
        whyGood: [
          'Structură clară care evidențiază expertiza farmaceutică',
          'Subliniază îngrijirea pacienților și siguranța medicamentelor',
          'Arată cunoștințe despre reglementările farmaceutice',
          'Demonstrează angajamentul față de excelența în sănătate',
          'Format compatibil ATS cu cuvinte cheie farmaceutice'
        ]
      },
      hu: {
        name: 'Gyógyszerész',
        slug: 'gyogyszeresz',
        description: 'A gyógyszerészek kiadnak gyógyszereket, gyógyszerészeti ellátást nyújtanak és egészségügyi tanácsokat adnak a betegeknek. Biztosítják a gyógyszerek biztonságos és hatékony használatát, és gyógyszertárakban, kórházakban és egészségügyi létesítményekben dolgoznak.',
        tips: [
          'Hangsúlyozza gyógyszerészeti képzését és engedélyét',
          'Hangsúlyozza a gyógyszerkezelés és betegtanácsadás tapasztalatát',
          'Mutassa be a gyógyszerkölcsönhatások és biztonsági protokollok ismeretét',
          'Tartalmazza a biztosításokkal és receptfeldolgozással kapcsolatos tapasztalatot',
          'Mutassa be a beteg egészségéhez és biztonságához való elkötelezettségét'
        ],
        skills: [
          'Gyógyszerkiadás és ellenőrzés',
          'Betegtanácsadás és gyógyszerterápia kezelés',
          'Gyógyszerkölcsönhatás szűrés',
          'Receptfeldolgozás és biztosítási számlázás',
          'Gyógyszerészeti készletkezelés',
          'Keverés és steril előkészítés',
          'Egészségügyi szűrés és immunizáció'
        ],
        whyGood: [
          'Világos struktúra, amely kiemeli a gyógyszerészeti szakértelemet',
          'Hangsúlyozza a betegellátást és a gyógyszerbiztonságot',
          'Mutatja a gyógyszerészeti szabályozások ismeretét',
          'Bemutatja az egészségügyi kiválósághoz való elkötelezettséget',
          'ATS-barát formátum gyógyszerészeti kulcsszavakkal'
        ]
      },
      el: {
        name: 'Φαρμακοποιός',
        slug: 'farmakopoios',
        description: 'Οι φαρμακοποιοί διανέμουν φάρμακα, παρέχουν φαρμακευτική φροντίδα και προσφέρουν συμβουλές υγείας σε ασθενείς. Εξασφαλίζουν την ασφαλή και αποτελεσματική χρήση φαρμάκων και εργάζονται σε φαρμακεία, νοσοκομεία και ιατρικές εγκαταστάσεις.',
        tips: [
          'Επισημάνετε τη φαρμακευτική σας εκπαίδευση και άδεια',
          'Τονίστε την εμπειρία στη διαχείριση φαρμάκων και συμβουλευτική ασθενών',
          'Παρουσιάστε γνώση αλληλεπιδράσεων φαρμάκων και πρωτοκόλλων ασφαλείας',
          'Συμπεριλάβετε εμπειρία με ασφάλειες και επεξεργασία συνταγών',
          'Αποδείξτε δέσμευση στην υγεία και ασφάλεια των ασθενών'
        ],
        skills: [
          'Διανομή και επαλήθευση φαρμάκων',
          'Συμβουλευτική ασθενών και διαχείριση φαρμακευτικής θεραπείας',
          'Συστηματική επιτήρηση αλληλεπιδράσεων φαρμάκων',
          'Επεξεργασία συνταγών και χρέωση ασφάλειων',
          'Διαχείριση φαρμακευτικού αποθέματος',
          'Σύνθεση και στείρα προετοιμασία',
          'Συστηματική επιτήρηση υγείας και ανοσοποίηση'
        ],
        whyGood: [
          'Σαφής δομή που επισημαίνει τη φαρμακευτική εμπειρογνωμοσύνη',
          'Τονίζει τη φροντίδα ασθενών και την ασφάλεια φαρμάκων',
          'Δείχνει γνώση φαρμακευτικών κανονισμών',
          'Αποδεικνύει δέσμευση στην υγειονομική αριστεία',
          'Μορφή συμβατή με ATS με φαρμακευτικές λέξεις-κλειδιά'
        ]
      },
      cs: {
        name: 'Lékárník',
        slug: 'lekarnik',
        description: 'Lékárníci vydávají léky, poskytují farmaceutickou péči a nabízejí zdravotní poradenství pacientům. Zajišťují bezpečné a účinné používání léků a pracují v lékárnách, nemocnicích a zdravotnických zařízeních.',
        tips: [
          'Zdůrazněte své farmaceutické vzdělání a licenci',
          'Zdůrazněte zkušenosti s řízením léků a poradenstvím pro pacienty',
          'Ukažte znalosti lékových interakcí a bezpečnostních protokolů',
          'Zahrňte zkušenosti s pojištěním a zpracováním receptů',
          'Prokažte závazek k zdraví a bezpečnosti pacientů'
        ],
        skills: [
          'Vydávání a ověřování léků',
          'Poradenství pro pacienty a řízení lékové terapie',
          'Screening lékových interakcí',
          'Zpracování receptů a fakturace pojištění',
          'Řízení farmaceutických zásob',
          'Příprava a sterilní příprava',
          'Zdravotní screening a očkování'
        ],
        whyGood: [
          'Jasná struktura zdůrazňující farmaceutickou odbornost',
          'Zdůrazňuje péči o pacienty a bezpečnost léků',
          'Ukazuje znalosti farmaceutických předpisů',
          'Prokazuje závazek k excelenci ve zdravotnictví',
          'Formát kompatibilní s ATS s farmaceutickými klíčovými slovy'
        ]
      },
      pt: {
        name: 'Farmacêutico',
        slug: 'farmaceutico',
        description: 'Os farmacêuticos dispensam medicamentos, fornecem cuidados farmacêuticos e oferecem conselhos de saúde aos pacientes. Garantem o uso seguro e eficaz de medicamentos e trabalham em farmácias, hospitais e instalações de saúde.',
        tips: [
          'Destaque sua educação farmacêutica e licença',
          'Enfatize experiência em gestão de medicamentos e aconselhamento ao paciente',
          'Mostre conhecimento de interações medicamentosas e protocolos de segurança',
          'Inclua experiência com seguros e processamento de receitas',
          'Demonstre compromisso com a saúde e segurança do paciente'
        ],
        skills: [
          'Dispensação e verificação de medicamentos',
          'Aconselhamento ao paciente e gestão de terapia medicamentosa',
          'Triagem de interações medicamentosas',
          'Processamento de receitas e faturamento de seguros',
          'Gestão de estoque farmacêutico',
          'Preparação e preparação estéril',
          'Triagem de saúde e imunizações'
        ],
        whyGood: [
          'Estrutura clara destacando expertise farmacêutica',
          'Enfatiza cuidado ao paciente e segurança de medicamentos',
          'Mostra conhecimento de regulamentações farmacêuticas',
          'Demonstra compromisso com excelência em saúde',
          'Formato compatível com ATS com palavras-chave farmacêuticas'
        ]
      },
      sv: {
        name: 'Apotekare',
        slug: 'apotekare',
        description: 'Apotekare levererar läkemedel, ger farmaceutisk vård och erbjuder hälsorådgivning till patienter. De säkerställer säkert och effektivt läkemedelsanvändning och arbetar på apotek, sjukhus och hälsoanläggningar.',
        tips: [
          'Framhäv din farmaceutiska utbildning och licens',
          'Betona erfarenhet av läkemedelshantering och patientrådgivning',
          'Visa kunskap om läkemedelsinteraktioner och säkerhetsprotokoll',
          'Inkludera erfarenhet av försäkringar och receptbearbetning',
          'Visa engagemang för patienthälsa och säkerhet'
        ],
        skills: [
          'Läkemedelsleverans och verifiering',
          'Patientrådgivning och läkemedelsterapihantering',
          'Screening av läkemedelsinteraktioner',
          'Receptbearbetning och försäkringsfakturering',
          'Farmaceutisk lagerhantering',
          'Beredning och steril beredning',
          'Hälsoscreening och vaccinationer'
        ],
        whyGood: [
          'Tydlig struktur som framhäver farmaceutisk expertis',
          'Betonar patientvård och läkemedelssäkerhet',
          'Visar kunskap om farmaceutiska regler',
          'Visar engagemang för hälsoexcellens',
          'ATS-vänligt format med farmaceutiska nyckelord'
        ]
      },
      bg: {
        name: 'Фармацевт',
        slug: 'farmatsevt',
        description: 'Фармацевтите отпускат лекарства, осигуряват фармацевтична грижа и предлагат здравни съвети на пациенти. Осигуряват безопасно и ефективно използване на лекарства и работят в аптеки, болници и здравни заведения.',
        tips: [
          'Подчертайте фармацевтичното си образование и лиценз',
          'Акцентирайте върху опита в управлението на лекарства и консултиране на пациенти',
          'Покажете познания за лекарствени взаимодействия и протоколи за безопасност',
          'Включете опит със застраховки и обработка на рецепти',
          'Демонстрирайте ангажираност към здравето и безопасността на пациентите'
        ],
        skills: [
          'Отпускане и верификация на лекарства',
          'Консултиране на пациенти и управление на лекарствена терапия',
          'Скрининг на лекарствени взаимодействия',
          'Обработка на рецепти и фактуриране на застраховки',
          'Управление на фармацевтични запаси',
          'Приготвяне и стерилна подготовка',
          'Здравен скрининг и имунизации'
        ],
        whyGood: [
          'Ясна структура, подчертаваща фармацевтичната експертиза',
          'Акцентира върху грижата за пациентите и безопасността на лекарствата',
          'Показва познания за фармацевтични разпоредби',
          'Демонстрира ангажираност към здравно превъзходство',
          'Формат, съвместим с ATS с фармацевтични ключови думи'
        ]
      },
      da: {
        name: 'Apoteker',
        slug: 'apoteker',
        description: 'Apotekere udleverer medicin, yder farmaceutisk pleje og tilbyder sundhedsrådgivning til patienter. De sikrer sikker og effektiv medicinanvendelse og arbejder på apoteker, hospitaler og sundhedsfaciliteter.',
        tips: [
          'Fremhæv din farmaceutiske uddannelse og licens',
          'Fremhæv erfaring med medicinhåndtering og patientrådgivning',
          'Vis viden om lægemiddelinteraktioner og sikkerhedsprotokoller',
          'Inkluder erfaring med forsikringer og receptbehandling',
          'Demonstrer forpligtelse til patientens sundhed og sikkerhed'
        ],
        skills: [
          'Medicinudlevering og verifikation',
          'Patientrådgivning og medicinbehandlingshåndtering',
          'Screening af lægemiddelinteraktioner',
          'Receptbehandling og forsikringsfakturering',
          'Farmaceutisk lagerstyring',
          'Blanding og steril forberedelse',
          'Sundhedsscreening og vaccinationer'
        ],
        whyGood: [
          'Tydelig struktur, der fremhæver farmaceutisk ekspertise',
          'Fremhæver patientpleje og medicinsikkerhed',
          'Vis viden om farmaceutiske regler',
          'Demonstrer forpligtelse til sundhedsekspertise',
          'ATS-venligt format med farmaceutiske nøgleord'
        ]
      },
      fi: {
        name: 'Apteekkari',
        slug: 'apteekkari',
        description: 'Apteekkarit jakavat lääkkeitä, tarjoavat farmaseuttista hoitoa ja antavat terveysneuvontaa potilaille. He varmistavat lääkkeiden turvallisen ja tehokkaan käytön ja työskentelevät apteekeissa, sairaaloissa ja terveyslaitoksissa.',
        tips: [
          'Korosta farmaseuttista koulutustasi ja lisenssiä',
          'Korosta lääkehallinnan ja potilasneuvonnan kokemusta',
          'Näytä tietoa lääkevuorovaikutuksista ja turvallisuusprotokollista',
          'Sisällytä kokemus vakuutuksista ja reseptien käsittelystä',
          'Näytä sitoutuminen potilaan terveyteen ja turvallisuuteen'
        ],
        skills: [
          'Lääkkeiden jakelu ja vahvistus',
          'Potilasneuvonta ja lääketerapian hallinta',
          'Lääkevuorovaikutusten seulonta',
          'Reseptien käsittely ja vakuutuslaskutus',
          'Farmaseuttinen varastonhallinta',
          'Valmistelu ja steriili valmistelu',
          'Terveysseulonta ja rokottaminen'
        ],
        whyGood: [
          'Selkeä rakenne, joka korostaa farmaseuttista asiantuntemusta',
          'Korostaa potilashoitoa ja lääketurvallisuutta',
          'Näyttää tietoa farmaseuttisista säännöistä',
          'Näyttää sitoutumisen terveydenhuollon huippuosaamiseen',
          'ATS-yhteensopiva muoto farmaseuttisilla avainsanoilla'
        ]
      },
      sk: {
        name: 'Farmaceut',
        slug: 'farmaceut',
        description: 'Farmaceuti vydávajú lieky, poskytujú farmaceutickú starostlivosť a ponúkajú zdravotné poradenstvo pacientom. Zabezpečujú bezpečné a účinné používanie liekov a pracujú v lekárňach, nemocniciach a zdravotníckych zariadeniach.',
        tips: [
          'Zdôraznite svoje farmaceutické vzdelanie a licenciu',
          'Zdôraznite skúsenosti s riadením liekov a poradenstvom pre pacientov',
          'Ukážte znalosti liekových interakcií a bezpečnostných protokolov',
          'Zahrňte skúsenosti s poisťovaním a spracovaním receptov',
          'Preukážte záväzok k zdraviu a bezpečnosti pacientov'
        ],
        skills: [
          'Vydávanie a overovanie liekov',
          'Poradenstvo pre pacientov a riadenie liekovej terapie',
          'Screening liekových interakcií',
          'Spracovanie receptov a fakturácia poisťovania',
          'Riadenie farmaceutických zásob',
          'Príprava a sterilná príprava',
          'Zdravotný screening a očkovanie'
        ],
        whyGood: [
          'Jasná štruktúra zdôrazňujúca farmaceutickú odbornosť',
          'Zdôrazňuje starostlivosť o pacientov a bezpečnosť liekov',
          'Ukazuje znalosti farmaceutických predpisov',
          'Preukazuje záväzok k excelencii vo zdravotníctve',
          'Formát kompatibilný s ATS s farmaceutickými kľúčovými slovami'
        ]
      },
      no: {
        name: 'Apoteker',
        slug: 'apoteker',
        description: 'Apotekere utleverer medisiner, gir farmasøytisk omsorg og tilbyr helserådgivning til pasienter. De sikrer trygg og effektiv medisinbruk og arbeider på apotek, sykehus og helsefasiliteter.',
        tips: [
          'Fremhev din farmasøytiske utdanning og lisens',
          'Fremhev erfaring med medisinforvaltning og pasientrådgivning',
          'Vis kunnskap om legemiddelinteraksjoner og sikkerhetsprotokoller',
          'Inkluder erfaring med forsikringer og reseptbehandling',
          'Vis forpliktelse til pasientens helse og sikkerhet'
        ],
        skills: [
          'Medisinutlevering og verifisering',
          'Pasientrådgivning og medisinbehandlingshåndtering',
          'Screening av legemiddelinteraksjoner',
          'Reseptbehandling og forsikringsfakturering',
          'Farmasøytisk lagerstyring',
          'Blanding og steril forberedelse',
          'Helsescreening og vaksinasjoner'
        ],
        whyGood: [
          'Tydelig struktur som fremhever farmasøytisk ekspertise',
          'Fremhever pasientomsorg og medisinsikkerhet',
          'Vis kunnskap om farmasøytiske regler',
          'Vis forpliktelse til helseekspertise',
          'ATS-vennlig format med farmasøytiske nøkkelord'
        ]
      },
      hr: {
        name: 'Farmaceut',
        slug: 'farmaceut',
        description: 'Farmaceuti izdaju lijekove, pružaju farmaceutsku skrb i nude zdravstvene savjete pacijentima. Osiguravaju sigurnu i učinkovitu upotrebu lijekova i rade u ljekarnama, bolnicama i zdravstvenim ustanovama.',
        tips: [
          'Istaknite svoje farmaceutske obrazovanje i licencu',
          'Naglasite iskustvo u upravljanju lijekovima i savjetovanju pacijenata',
          'Pokažite znanje o interakcijama lijekova i sigurnosnim protokolima',
          'Uključite iskustvo s osiguranjima i obradom recepata',
          'Pokažite predanost zdravlju i sigurnosti pacijenata'
        ],
        skills: [
          'Izdavanje i provjera lijekova',
          'Savjetovanje pacijenata i upravljanje terapijom lijekovima',
          'Screening interakcija lijekova',
          'Obrada recepata i naplata osiguranja',
          'Upravljanje farmaceutskim zalihama',
          'Priprema i sterilna priprema',
          'Zdravstveni pregled i imunizacija'
        ],
        whyGood: [
          'Jasna struktura koja ističe farmaceutsku stručnost',
          'Naglašava skrb o pacijentima i sigurnost lijekova',
          'Pokazuje znanje o farmaceutskim propisima',
          'Pokazuje predanost zdravstvenoj izvrsnosti',
          'Format kompatibilan s ATS s farmaceutskim ključnim riječima'
        ]
      },
      sr: {
        name: 'Фармацеут',
        slug: 'farmaceut',
        description: 'Фармацеути издају лекове, пружају фармацеутску негу и нуде здравствене савете пацијентима. Обезбеђују сигурну и ефикасну употребу лекова и раде у апотекама, болницама и здравственим установама.',
        tips: [
          'Истакните своје фармацеутско образовање и лиценцу',
          'Нагласите искуство у управљању лековима и саветовању пацијената',
          'Покажите знање о интеракцијама лекова и безбедносним протоколима',
          'Укључите искуство са осигурањима и обрадом рецепата',
          'Покажите посвећеност здрављу и безбедности пацијената'
        ],
        skills: [
          'Издавање и провера лекова',
          'Саветовање пацијената и управљање терапијом лекова',
          'Скрининг интеракција лекова',
          'Обрада рецепата и наплата осигурања',
          'Управљање фармацеутским залихама',
          'Припрема и стерилна припрема',
          'Здравствени преглед и имунизација'
        ],
        whyGood: [
          'Јасна структура која истиче фармацеутску стручност',
          'Наглашава негу пацијената и безбедност лекова',
          'Показује знање о фармацеутским прописима',
          'Показује посвећеност здравственој изврсности',
          'Формат компатибилан са ATS са фармацеутским кључним речима'
        ]
      }
    }
  },
  // Technology: IT Support Specialist
  {
    id: 'it-support',
    category: 'technology',
    translations: {
      en: {
        name: 'IT Support Specialist',
        slug: 'it-support',
        description: 'IT Support Specialists provide technical assistance to users, troubleshoot hardware and software issues, and maintain computer systems and networks. They work in help desks, IT departments, and technology companies.',
        tips: [
          'Highlight your technical troubleshooting skills',
          'Emphasize experience with various operating systems and software',
          'Showcase customer service and communication abilities',
          'Include certifications like CompTIA A+ or ITIL',
          'Demonstrate problem-solving and analytical skills'
        ],
        skills: [
          'Hardware and software troubleshooting',
          'Network configuration and maintenance',
          'Operating systems (Windows, macOS, Linux)',
          'Help desk ticketing systems',
          'Remote support tools',
          'Customer service and communication',
          'Documentation and knowledge base management'
        ],
        whyGood: [
          'Clear structure highlighting technical competencies',
          'Emphasizes customer service and problem-solving',
          'Shows progression of technical skills and certifications',
          'Demonstrates ability to work under pressure',
          'ATS-friendly format with IT keywords'
        ]
      },
      nl: {
        name: 'IT Support Specialist',
        slug: 'it-support',
        description: 'IT Support Specialisten bieden technische ondersteuning aan gebruikers, lossen hardware- en softwareproblemen op en onderhouden computersystemen en netwerken. Ze werken in helpdesks, IT-afdelingen en technologiebedrijven.',
        tips: [
          'Benadruk je technische probleemoplossende vaardigheden',
          'Leg nadruk op ervaring met verschillende besturingssystemen en software',
          'Toon klantenservice en communicatieve vaardigheden',
          'Vermeld certificeringen zoals CompTIA A+ of ITIL',
          'Demonstreer probleemoplossende en analytische vaardigheden'
        ],
        skills: [
          'Hardware- en softwareprobleemoplossing',
          'Netwerkconfiguratie en onderhoud',
          'Besturingssystemen (Windows, macOS, Linux)',
          'Helpdesk ticketingsystemen',
          'Remote support tools',
          'Klantenservice en communicatie',
          'Documentatie en knowledge base beheer'
        ],
        whyGood: [
          'Duidelijke structuur die technische competenties benadrukt',
          'Legt nadruk op klantenservice en probleemoplossing',
          'Toont progressie van technische vaardigheden en certificeringen',
          'Demonstreert vermogen om onder druk te werken',
          'ATS-vriendelijk formaat met IT-trefwoorden'
        ]
      },
      fr: {
        name: 'Spécialiste Support IT',
        slug: 'specialiste-support-it',
        description: 'Les spécialistes du support IT fournissent une assistance technique aux utilisateurs, résolvent les problèmes matériels et logiciels, et maintiennent les systèmes informatiques et réseaux. Ils travaillent dans les centres d\'aide, départements IT et entreprises technologiques.',
        tips: [
          'Mettez en avant vos compétences de dépannage technique',
          'Soulignez l\'expérience avec divers systèmes d\'exploitation et logiciels',
          'Montrez les capacités de service client et communication',
          'Incluez certifications comme CompTIA A+ ou ITIL',
          'Démontrez les compétences de résolution de problèmes et analytiques'
        ],
        skills: [
          'Dépannage matériel et logiciel',
          'Configuration et maintenance réseau',
          'Systèmes d\'exploitation (Windows, macOS, Linux)',
          'Systèmes de tickets help desk',
          'Outils de support à distance',
          'Service client et communication',
          'Documentation et gestion de base de connaissances'
        ],
        whyGood: [
          'Structure claire mettant en évidence les compétences techniques',
          'Met l\'accent sur le service client et la résolution de problèmes',
          'Montre la progression des compétences techniques et certifications',
          'Démontre la capacité à travailler sous pression',
          'Format compatible ATS avec mots-clés IT'
        ]
      },
      es: {
        name: 'Especialista en Soporte IT',
        slug: 'especialista-soporte-it',
        description: 'Los especialistas en soporte IT brindan asistencia técnica a usuarios, solucionan problemas de hardware y software, y mantienen sistemas informáticos y redes. Trabajan en mesas de ayuda, departamentos IT y empresas tecnológicas.',
        tips: [
          'Destaca tus habilidades de resolución de problemas técnicos',
          'Enfatiza experiencia con varios sistemas operativos y software',
          'Muestra habilidades de servicio al cliente y comunicación',
          'Incluye certificaciones como CompTIA A+ o ITIL',
          'Demuestra habilidades de resolución de problemas y analíticas'
        ],
        skills: [
          'Resolución de problemas de hardware y software',
          'Configuración y mantenimiento de red',
          'Sistemas operativos (Windows, macOS, Linux)',
          'Sistemas de tickets de help desk',
          'Herramientas de soporte remoto',
          'Servicio al cliente y comunicación',
          'Documentación y gestión de base de conocimientos'
        ],
        whyGood: [
          'Estructura clara que destaca competencias técnicas',
          'Enfatiza servicio al cliente y resolución de problemas',
          'Muestra progresión de habilidades técnicas y certificaciones',
          'Demuestra capacidad para trabajar bajo presión',
          'Formato compatible con ATS con palabras clave IT'
        ]
      },
      de: {
        name: 'IT-Support-Spezialist',
        slug: 'it-support-spezialist',
        description: 'IT-Support-Spezialisten bieten technische Unterstützung für Benutzer, beheben Hardware- und Softwareprobleme und warten Computersysteme und Netzwerke. Sie arbeiten in Helpdesks, IT-Abteilungen und Technologieunternehmen.',
        tips: [
          'Heben Sie Ihre technischen Fehlerbehebungsfähigkeiten hervor',
          'Betonen Sie Erfahrung mit verschiedenen Betriebssystemen und Software',
          'Zeigen Sie Kundenservice- und Kommunikationsfähigkeiten',
          'Fügen Sie Zertifizierungen wie CompTIA A+ oder ITIL hinzu',
          'Demonstrieren Sie Problemlösungs- und analytische Fähigkeiten'
        ],
        skills: [
          'Hardware- und Software-Fehlerbehebung',
          'Netzwerkkonfiguration und -wartung',
          'Betriebssysteme (Windows, macOS, Linux)',
          'Helpdesk-Ticket-Systeme',
          'Remote-Support-Tools',
          'Kundenservice und Kommunikation',
          'Dokumentation und Wissensdatenbankverwaltung'
        ],
        whyGood: [
          'Klare Struktur, die technische Kompetenzen hervorhebt',
          'Betont Kundenservice und Problemlösung',
          'Zeigt Fortschritt technischer Fähigkeiten und Zertifizierungen',
          'Demonstriert Fähigkeit, unter Druck zu arbeiten',
          'ATS-freundliches Format mit IT-Schlüsselwörtern'
        ]
      },
      it: {
        name: 'Specialista Supporto IT',
        slug: 'specialista-supporto-it',
        description: 'Gli specialisti del supporto IT forniscono assistenza tecnica agli utenti, risolvono problemi hardware e software e mantengono sistemi informatici e reti. Lavorano in help desk, dipartimenti IT e aziende tecnologiche.',
        tips: [
          'Evidenzia le tue capacità di risoluzione dei problemi tecnici',
          'Enfatizza l\'esperienza con vari sistemi operativi e software',
          'Mostra capacità di servizio clienti e comunicazione',
          'Includi certificazioni come CompTIA A+ o ITIL',
          'Dimostra capacità di risoluzione dei problemi e analitiche'
        ],
        skills: [
          'Risoluzione dei problemi hardware e software',
          'Configurazione e manutenzione della rete',
          'Sistemi operativi (Windows, macOS, Linux)',
          'Sistemi di ticketing help desk',
          'Strumenti di supporto remoto',
          'Servizio clienti e comunicazione',
          'Documentazione e gestione della knowledge base'
        ],
        whyGood: [
          'Struttura chiara che evidenzia le competenze tecniche',
          'Enfatizza il servizio clienti e la risoluzione dei problemi',
          'Mostra la progressione delle competenze tecniche e certificazioni',
          'Dimostra la capacità di lavorare sotto pressione',
          'Formato compatibile ATS con parole chiave IT'
        ]
      },
      pl: {
        name: 'Specjalista Wsparcia IT',
        slug: 'specjalista-wsparcia-it',
        description: 'Specjaliści wsparcia IT zapewniają pomoc techniczną użytkownikom, rozwiązują problemy sprzętowe i programowe oraz utrzymują systemy komputerowe i sieci. Pracują w helpdeskach, działach IT i firmach technologicznych.',
        tips: [
          'Podkreśl swoje umiejętności rozwiązywania problemów technicznych',
          'Podkreśl doświadczenie z różnymi systemami operacyjnymi i oprogramowaniem',
          'Pokaż umiejętności obsługi klienta i komunikacji',
          'Uwzględnij certyfikaty takie jak CompTIA A+ lub ITIL',
          'Wykazuj umiejętności rozwiązywania problemów i analityczne'
        ],
        skills: [
          'Rozwiązywanie problemów sprzętowych i programowych',
          'Konfiguracja i konserwacja sieci',
          'Systemy operacyjne (Windows, macOS, Linux)',
          'Systemy zgłoszeń help desk',
          'Narzędzia wsparcia zdalnego',
          'Obsługa klienta i komunikacja',
          'Dokumentacja i zarządzanie bazą wiedzy'
        ],
        whyGood: [
          'Jasna struktura podkreślająca kompetencje techniczne',
          'Podkreśla obsługę klienta i rozwiązywanie problemów',
          'Pokazuje postęp umiejętności technicznych i certyfikatów',
          'Wykazuje zdolność do pracy pod presją',
          'Format przyjazny dla ATS z kluczowymi słowami IT'
        ]
      },
      ro: {
        name: 'Specialist Suport IT',
        slug: 'specialist-suport-it',
        description: 'Specialiștii în suport IT oferă asistență tehnică utilizatorilor, rezolvă probleme hardware și software și mențin sisteme informatice și rețele. Lucrează în help desk-uri, departamente IT și companii tehnologice.',
        tips: [
          'Evidențiază abilitățile tale de rezolvare a problemelor tehnice',
          'Subliniază experiența cu diverse sisteme de operare și software',
          'Prezintă abilități de servicii pentru clienți și comunicare',
          'Include certificări precum CompTIA A+ sau ITIL',
          'Demonstrează abilități de rezolvare a problemelor și analitice'
        ],
        skills: [
          'Rezolvarea problemelor hardware și software',
          'Configurarea și întreținerea rețelei',
          'Sisteme de operare (Windows, macOS, Linux)',
          'Sisteme de ticketing help desk',
          'Instrumente de suport la distanță',
          'Servicii pentru clienți și comunicare',
          'Documentație și managementul bazei de cunoștințe'
        ],
        whyGood: [
          'Structură clară care evidențiază competențele tehnice',
          'Subliniază serviciile pentru clienți și rezolvarea problemelor',
          'Arată progresia abilităților tehnice și certificărilor',
          'Demonstrează capacitatea de a lucra sub presiune',
          'Format compatibil ATS cu cuvinte cheie IT'
        ]
      },
      hu: {
        name: 'IT Támogatási Szakértő',
        slug: 'it-tamogatasi-szakerto',
        description: 'Az IT támogatási szakértők technikai segítséget nyújtanak a felhasználóknak, hardver- és szoftverproblémákat oldanak meg, és karbantartják a számítógépes rendszereket és hálózatokat. Helpdeskekben, IT osztályokon és technológiai vállalatoknál dolgoznak.',
        tips: [
          'Hangsúlyozza technikai hibaelhárítási képességeit',
          'Hangsúlyozza a különböző operációs rendszerekkel és szoftverekkel való tapasztalatot',
          'Mutassa be az ügyfélszolgálati és kommunikációs képességeket',
          'Tartalmazza a CompTIA A+ vagy ITIL tanúsítványokat',
          'Mutassa be a problémamegoldó és elemző képességeket'
        ],
        skills: [
          'Hardver- és szoftverhibaelhárítás',
          'Hálózat konfigurálása és karbantartása',
          'Operációs rendszerek (Windows, macOS, Linux)',
          'Helpdesk jegykezelő rendszerek',
          'Távoli támogatási eszközök',
          'Ügyfélszolgálat és kommunikáció',
          'Dokumentáció és tudásbázis kezelés'
        ],
        whyGood: [
          'Világos struktúra, amely kiemeli a technikai kompetenciákat',
          'Hangsúlyozza az ügyfélszolgálatot és problémamegoldást',
          'Mutatja a technikai képességek és tanúsítványok fejlődését',
          'Bemutatja a nyomás alatt dolgozni tudó képességet',
          'ATS-barát formátum IT kulcsszavakkal'
        ]
      },
      el: {
        name: 'Ειδικός Υποστήριξης IT',
        slug: 'eidikos-ypostirixis-it',
        description: 'Οι ειδικοί υποστήριξης IT παρέχουν τεχνική βοήθεια στους χρήστες, επιλύουν προβλήματα hardware και software και συντηρούν συστήματα υπολογιστών και δίκτυα. Εργάζονται σε help desk, τμήματα IT και εταιρείες τεχνολογίας.',
        tips: [
          'Επισημάνετε τις τεχνικές σας ικανότητες επίλυσης προβλημάτων',
          'Τονίστε την εμπειρία με διάφορα λειτουργικά συστήματα και λογισμικό',
          'Παρουσιάστε ικανότητες εξυπηρέτησης πελατών και επικοινωνίας',
          'Συμπεριλάβετε πιστοποιήσεις όπως CompTIA A+ ή ITIL',
          'Αποδείξτε ικανότητες επίλυσης προβλημάτων και αναλυτικές'
        ],
        skills: [
          'Επίλυση προβλημάτων hardware και software',
          'Διαμόρφωση και συντήρηση δικτύου',
          'Λειτουργικά συστήματα (Windows, macOS, Linux)',
          'Συστήματα tickets help desk',
          'Εργαλεία απομακρυσμένης υποστήριξης',
          'Εξυπηρέτηση πελατών και επικοινωνία',
          'Τεκμηρίωση και διαχείριση βάσης γνώσης'
        ],
        whyGood: [
          'Σαφής δομή που επισημαίνει τις τεχνικές ικανότητες',
          'Τονίζει την εξυπηρέτηση πελατών και την επίλυση προβλημάτων',
          'Δείχνει την πρόοδο των τεχνικών ικανοτήτων και πιστοποιήσεων',
          'Αποδεικνύει την ικανότητα εργασίας υπό πίεση',
          'Μορφή συμβατή με ATS με λέξεις-κλειδιά IT'
        ]
      },
      cs: {
        name: 'Specialista IT Podpory',
        slug: 'specialista-it-podpory',
        description: 'Specialisté IT podpory poskytují technickou pomoc uživatelům, řeší problémy s hardwarem a softwarem a udržují počítačové systémy a sítě. Pracují na helpdesku, v IT odděleních a technologických společnostech.',
        tips: [
          'Zdůrazněte své technické schopnosti řešení problémů',
          'Zdůrazněte zkušenosti s různými operačními systémy a softwarem',
          'Ukažte schopnosti zákaznického servisu a komunikace',
          'Zahrňte certifikace jako CompTIA A+ nebo ITIL',
          'Prokažte schopnosti řešení problémů a analytické'
        ],
        skills: [
          'Řešení problémů s hardwarem a softwarem',
          'Konfigurace a údržba sítě',
          'Operační systémy (Windows, macOS, Linux)',
          'Systémy ticketingu help desk',
          'Nástroje vzdálené podpory',
          'Zákaznický servis a komunikace',
          'Dokumentace a správa znalostní báze'
        ],
        whyGood: [
          'Jasná struktura zdůrazňující technické kompetence',
          'Zdůrazňuje zákaznický servis a řešení problémů',
          'Ukazuje pokrok technických dovedností a certifikací',
          'Prokazuje schopnost pracovat pod tlakem',
          'Formát kompatibilní s ATS s IT klíčovými slovy'
        ]
      },
      pt: {
        name: 'Especialista em Suporte IT',
        slug: 'especialista-suporte-it',
        description: 'Especialistas em suporte IT fornecem assistência técnica a usuários, resolvem problemas de hardware e software e mantêm sistemas de computador e redes. Trabalham em help desks, departamentos de IT e empresas de tecnologia.',
        tips: [
          'Destaque suas habilidades de resolução de problemas técnicos',
          'Enfatize experiência com vários sistemas operacionais e software',
          'Mostre habilidades de atendimento ao cliente e comunicação',
          'Inclua certificações como CompTIA A+ ou ITIL',
          'Demonstre habilidades de resolução de problemas e analíticas'
        ],
        skills: [
          'Resolução de problemas de hardware e software',
          'Configuração e manutenção de rede',
          'Sistemas operacionais (Windows, macOS, Linux)',
          'Sistemas de tickets de help desk',
          'Ferramentas de suporte remoto',
          'Atendimento ao cliente e comunicação',
          'Documentação e gestão de base de conhecimento'
        ],
        whyGood: [
          'Estrutura clara destacando competências técnicas',
          'Enfatiza atendimento ao cliente e resolução de problemas',
          'Mostra progressão de habilidades técnicas e certificações',
          'Demonstra capacidade de trabalhar sob pressão',
          'Formato compatível com ATS com palavras-chave IT'
        ]
      },
      sv: {
        name: 'IT-supportsspecialist',
        slug: 'it-supportsspecialist',
        description: 'IT-supportsspecialister ger teknisk hjälp till användare, felsöker hårdvaru- och mjukvaruproblem och underhåller datorsystem och nätverk. De arbetar på helpdesk, IT-avdelningar och teknikföretag.',
        tips: [
          'Framhäv dina tekniska felsökningsförmågor',
          'Betona erfarenhet med olika operativsystem och mjukvara',
          'Visa kundservice- och kommunikationsförmågor',
          'Inkludera certifieringar som CompTIA A+ eller ITIL',
          'Visa problemlösnings- och analytiska förmågor'
        ],
        skills: [
          'Felsökning av hårdvara och mjukvara',
          'Nätverkskonfiguration och underhåll',
          'Operativsystem (Windows, macOS, Linux)',
          'Helpdesk-biljettsystem',
          'Fjärrstödverktyg',
          'Kundservice och kommunikation',
          'Dokumentation och kunskapsbasförvaltning'
        ],
        whyGood: [
          'Tydlig struktur som framhäver tekniska kompetenser',
          'Betonar kundservice och problemlösning',
          'Visar progression av tekniska färdigheter och certifieringar',
          'Visar förmåga att arbeta under press',
          'ATS-vänligt format med IT-nyckelord'
        ]
      },
      bg: {
        name: 'Специалист IT Поддръжка',
        slug: 'spetsialist-it-poddrzhka',
        description: 'Специалистите по IT поддръжка предоставят техническа помощ на потребители, решават проблеми с хардуер и софтуер и поддържат компютърни системи и мрежи. Работят в help desk, IT отдели и технологични компании.',
        tips: [
          'Подчертайте техническите си способности за решаване на проблеми',
          'Акцентирайте върху опита с различни операционни системи и софтуер',
          'Покажете способности за обслужване на клиенти и комуникация',
          'Включете сертификати като CompTIA A+ или ITIL',
          'Демонстрирайте способности за решаване на проблеми и аналитични'
        ],
        skills: [
          'Решаване на проблеми с хардуер и софтуер',
          'Конфигуриране и поддръжка на мрежа',
          'Операционни системи (Windows, macOS, Linux)',
          'Системи за билети help desk',
          'Инструменти за отдалечена поддръжка',
          'Обслужване на клиенти и комуникация',
          'Документиране и управление на база знания'
        ],
        whyGood: [
          'Ясна структура, подчертаваща техническите компетенции',
          'Акцентира върху обслужването на клиенти и решаването на проблеми',
          'Показва прогресия на техническите умения и сертификати',
          'Демонстрира способност за работа под налягане',
          'Формат, съвместим с ATS с IT ключови думи'
        ]
      },
      da: {
        name: 'IT-supportsspecialist',
        slug: 'it-supportsspecialist',
        description: 'IT-supportsspecialister giver teknisk assistance til brugere, fejlsøger hardware- og softwareproblemer og vedligeholder computersystemer og netværk. De arbejder på helpdesk, IT-afdelinger og teknologivirksomheder.',
        tips: [
          'Fremhæv dine tekniske fejlsøgningsfærdigheder',
          'Fremhæv erfaring med forskellige operativsystemer og software',
          'Vis kundeservice- og kommunikationsfærdigheder',
          'Inkluder certificeringer som CompTIA A+ eller ITIL',
          'Demonstrer problemløsnings- og analytiske færdigheder'
        ],
        skills: [
          'Fejlsøgning af hardware og software',
          'Netværkskonfiguration og vedligeholdelse',
          'Operativsystemer (Windows, macOS, Linux)',
          'Helpdesk-biljetsystemer',
          'Fjernstøtteværktøjer',
          'Kundeservice og kommunikation',
          'Dokumentation og vidensbaseforvaltning'
        ],
        whyGood: [
          'Tydelig struktur, der fremhæver tekniske kompetencer',
          'Fremhæver kundeservice og problemløsning',
          'Vis progression af tekniske færdigheder og certificeringer',
          'Demonstrer evne til at arbejde under pres',
          'ATS-venligt format med IT-nøgleord'
        ]
      },
      fi: {
        name: 'IT-tuen asiantuntija',
        slug: 'it-tuen-asiantuntija',
        description: 'IT-tuen asiantuntijat tarjoavat teknistä tukea käyttäjille, vianetsivät laitteisto- ja ohjelmistongelmia ja ylläpitävät tietokonejärjestelmiä ja verkkoja. He työskentelevät helpdeskeissä, IT-osastoissa ja teknologiayrityksissä.',
        tips: [
          'Korosta tekniset vianetsintätaidot',
          'Korosta kokemusta eri käyttöjärjestelmistä ja ohjelmistoista',
          'Näytä asiakaspalvelu- ja viestintätaidot',
          'Sisällytä sertifikaatit kuten CompTIA A+ tai ITIL',
          'Näytä ongelmanratkaisu- ja analyyttiset taidot'
        ],
        skills: [
          'Laitteisto- ja ohjelmistovianetsintä',
          'Verkkokonfigurointi ja ylläpito',
          'Käyttöjärjestelmät (Windows, macOS, Linux)',
          'Helpdesk-tiketointijärjestelmät',
          'Etätukityökalut',
          'Asiakaspalvelu ja viestintä',
          'Dokumentointi ja tietokantahallinta'
        ],
        whyGood: [
          'Selkeä rakenne, joka korostaa teknisiä kompetensseja',
          'Korostaa asiakaspalvelua ja ongelmanratkaisua',
          'Näyttää teknisten taitojen ja sertifikaattien kehityksen',
          'Näyttää kyvyn työskennellä paineen alla',
          'ATS-yhteensopiva muoto IT-avainsanoilla'
        ]
      },
      sk: {
        name: 'Špecialista IT Podpory',
        slug: 'specialista-it-podpory',
        description: 'Špecialisti IT podpory poskytujú technickú pomoc používateľom, riešia problémy s hardvérom a softvérom a udržiavajú počítačové systémy a siete. Pracujú na helpdesku, v IT oddeleniach a technologických spoločnostiach.',
        tips: [
          'Zdôraznite svoje technické schopnosti riešenia problémov',
          'Zdôraznite skúsenosti s rôznymi operačnými systémami a softvérom',
          'Ukážte schopnosti zákazníckeho servisu a komunikácie',
          'Zahrňte certifikácie ako CompTIA A+ alebo ITIL',
          'Preukážte schopnosti riešenia problémov a analytické'
        ],
        skills: [
          'Riešenie problémov s hardvérom a softvérom',
          'Konfigurácia a údržba siete',
          'Operačné systémy (Windows, macOS, Linux)',
          'Systémy ticketingu help desk',
          'Nástroje vzdialenej podpory',
          'Zákaznícky servis a komunikácia',
          'Dokumentácia a správa znalostnej bázy'
        ],
        whyGood: [
          'Jasná štruktúra zdôrazňujúca technické kompetencie',
          'Zdôrazňuje zákaznícky servis a riešenie problémov',
          'Ukazuje pokrok technických zručností a certifikácií',
          'Preukazuje schopnosť pracovať pod tlakom',
          'Formát kompatibilný s ATS s IT kľúčovými slovami'
        ]
      },
      no: {
        name: 'IT-støttespesialist',
        slug: 'it-stottespesialist',
        description: 'IT-støttespesialister gir teknisk assistanse til brukere, feilsøker hardware- og softwareproblemer og vedlikeholder datasystemer og nettverk. De arbeider på helpdesk, IT-avdelinger og teknologiselskaper.',
        tips: [
          'Fremhev dine tekniske feilsøkingsferdigheter',
          'Fremhev erfaring med ulike operativsystemer og programvare',
          'Vis kundeservice- og kommunikasjonsferdigheter',
          'Inkluder sertifiseringer som CompTIA A+ eller ITIL',
          'Vis problemløsnings- og analytiske ferdigheter'
        ],
        skills: [
          'Feilsøking av hardware og software',
          'Nettverkskonfigurasjon og vedlikehold',
          'Operativsystemer (Windows, macOS, Linux)',
          'Helpdesk-biljettsystemer',
          'Fjernstøtteverktøy',
          'Kundeservice og kommunikasjon',
          'Dokumentasjon og kunnskapsbaseforvaltning'
        ],
        whyGood: [
          'Tydelig struktur som fremhever tekniske kompetanser',
          'Fremhever kundeservice og problemløsning',
          'Vis progresjon av tekniske ferdigheter og sertifiseringer',
          'Vis evne til å arbeide under press',
          'ATS-vennlig format med IT-nøkkelord'
        ]
      },
      hr: {
        name: 'Specijalist IT Podrške',
        slug: 'specijalist-it-podrske',
        description: 'Specijalisti IT podrške pružaju tehničku pomoć korisnicima, rješavaju probleme s hardverom i softverom i održavaju računalne sustave i mreže. Rade na helpdesku, IT odjelima i tehnološkim tvrtkama.',
        tips: [
          'Istaknite svoje tehničke vještine rješavanja problema',
          'Naglasite iskustvo s različitim operacijskim sustavima i softverom',
          'Pokažite vještine korisničke službe i komunikacije',
          'Uključite certifikate kao što su CompTIA A+ ili ITIL',
          'Pokažite vještine rješavanja problema i analitičke'
        ],
        skills: [
          'Rješavanje problema s hardverom i softverom',
          'Konfiguracija i održavanje mreže',
          'Operacijski sustavi (Windows, macOS, Linux)',
          'Sustavi ticketinga help desk',
          'Alati za daljinsku podršku',
          'Korisnička služba i komunikacija',
          'Dokumentacija i upravljanje bazom znanja'
        ],
        whyGood: [
          'Jasna struktura koja ističe tehničke kompetencije',
          'Naglašava korisničku službu i rješavanje problema',
          'Pokazuje napredak tehničkih vještina i certifikata',
          'Pokazuje sposobnost rada pod pritiskom',
          'Format kompatibilan s ATS s IT ključnim riječima'
        ]
      },
      sr: {
        name: 'Специјалиста IT Подршке',
        slug: 'specijalista-it-podrske',
        description: 'Специјалисти IT подршке пружају техничку помоћ корисницима, решавају проблеме са хардвером и софтвером и одржавају рачунарске системе и мреже. Раде на helpdesku, IT одељењима и технолошким компанијама.',
        tips: [
          'Истакните своје техничке способности решавања проблема',
          'Нагласите искуство са различитим оперативним системима и софтвером',
          'Покажите способности корисничке службе и комуникације',
          'Укључите сертификате као што су CompTIA A+ или ITIL',
          'Покажите способности решавања проблема и аналитичке'
        ],
        skills: [
          'Решавање проблема са хардвером и софтвером',
          'Конфигурација и одржавање мреже',
          'Оперативни системи (Windows, macOS, Linux)',
          'Системи тикетирања help desk',
          'Алати за удаљену подршку',
          'Корисничка служба и комуникација',
          'Документовање и управљање базом знања'
        ],
        whyGood: [
          'Јасна структура која истиче техничке компетенције',
          'Наглашава корисничку службу и решавање проблема',
          'Показује напредак техничких вештина и сертификата',
          'Показује способност рада под притиском',
          'Формат компатибилан са ATS са IT кључним речима'
        ]
      }
    }
  },
  // Education: Professor
  {
    id: 'professor',
    category: 'education',
    translations: {
      en: {
        name: 'Professor',
        slug: 'professor',
        description: 'Professors teach at universities and colleges, conduct research, publish academic work, and mentor students. They work in higher education institutions and contribute to academic knowledge in their field.',
        tips: [
          'Highlight your academic qualifications and degrees',
          'Emphasize research publications and academic achievements',
          'Showcase teaching experience and student mentorship',
          'Include conference presentations and academic service',
          'Demonstrate expertise in your field of study'
        ],
        skills: [
          'Academic research and publication',
          'Curriculum development and course design',
          'Student instruction and mentorship',
          'Grant writing and research funding',
          'Academic writing and peer review',
          'Conference presentations and public speaking',
          'Departmental service and committee work'
        ],
        whyGood: [
          'Clear structure highlighting academic credentials',
          'Emphasizes research contributions and publications',
          'Shows progression of academic career',
          'Demonstrates commitment to education and scholarship',
          'ATS-friendly format with academic keywords'
        ]
      },
      nl: {
        name: 'Hoogleraar',
        slug: 'hoogleraar',
        description: 'Hoogleraren geven les aan universiteiten en hogescholen, doen onderzoek, publiceren academisch werk en begeleiden studenten. Ze werken in instellingen voor hoger onderwijs en dragen bij aan academische kennis in hun vakgebied.',
        tips: [
          'Benadruk je academische kwalificaties en graden',
          'Leg nadruk op onderzoekspublicaties en academische prestaties',
          'Toon onderwijservaring en studentbegeleiding',
          'Vermeld conferentiepresentaties en academische dienstverlening',
          'Demonstreer expertise in je vakgebied'
        ],
        skills: [
          'Academisch onderzoek en publicatie',
          'Curriculumontwikkeling en cursusontwerp',
          'Studenteninstructie en begeleiding',
          'Subsidieaanvragen en onderzoeksfinanciering',
          'Academisch schrijven en peer review',
          'Conferentiepresentaties en publiek spreken',
          'Departementale dienstverlening en commissiewerk'
        ],
        whyGood: [
          'Duidelijke structuur die academische kwalificaties benadrukt',
          'Legt nadruk op onderzoeksbijdragen en publicaties',
          'Toont progressie van academische carrière',
          'Demonstreert toewijding aan onderwijs en wetenschap',
          'ATS-vriendelijk formaat met academische trefwoorden'
        ]
      },
      fr: {
        name: 'Professeur',
        slug: 'professeur',
        description: 'Les professeurs enseignent dans les universités et collèges, mènent des recherches, publient des travaux académiques et encadrent les étudiants. Ils travaillent dans des établissements d\'enseignement supérieur et contribuent aux connaissances académiques dans leur domaine.',
        tips: [
          'Mettez en avant vos qualifications académiques et diplômes',
          'Soulignez les publications de recherche et réalisations académiques',
          'Montrez l\'expérience d\'enseignement et mentorat étudiant',
          'Incluez présentations de conférences et service académique',
          'Démontrez l\'expertise dans votre domaine d\'étude'
        ],
        skills: [
          'Recherche académique et publication',
          'Développement de curriculum et conception de cours',
          'Instruction et mentorat des étudiants',
          'Rédaction de subventions et financement de recherche',
          'Rédaction académique et évaluation par les pairs',
          'Présentations de conférences et prise de parole en public',
          'Service départemental et travail de comité'
        ],
        whyGood: [
          'Structure claire mettant en évidence les qualifications académiques',
          'Met l\'accent sur les contributions à la recherche et publications',
          'Montre la progression de la carrière académique',
          'Démontre l\'engagement envers l\'éducation et la recherche',
          'Format compatible ATS avec mots-clés académiques'
        ]
      },
      es: {
        name: 'Profesor',
        slug: 'profesor',
        description: 'Los profesores enseñan en universidades y colegios, realizan investigaciones, publican trabajos académicos y orientan a estudiantes. Trabajan en instituciones de educación superior y contribuyen al conocimiento académico en su campo.',
        tips: [
          'Destaca tus calificaciones académicas y títulos',
          'Enfatiza publicaciones de investigación y logros académicos',
          'Muestra experiencia docente y mentoría estudiantil',
          'Incluye presentaciones en conferencias y servicio académico',
          'Demuestra experiencia en tu campo de estudio'
        ],
        skills: [
          'Investigación académica y publicación',
          'Desarrollo de currículo y diseño de cursos',
          'Instrucción y mentoría estudiantil',
          'Redacción de subvenciones y financiamiento de investigación',
          'Escritura académica y revisión por pares',
          'Presentaciones en conferencias y oratoria',
          'Servicio departamental y trabajo en comités'
        ],
        whyGood: [
          'Estructura clara que destaca credenciales académicas',
          'Enfatiza contribuciones de investigación y publicaciones',
          'Muestra progresión de carrera académica',
          'Demuestra compromiso con educación y erudición',
          'Formato compatible con ATS con palabras clave académicas'
        ]
      },
      de: {
        name: 'Professor',
        slug: 'professor',
        description: 'Professoren unterrichten an Universitäten und Hochschulen, führen Forschungen durch, veröffentlichen akademische Arbeiten und betreuen Studenten. Sie arbeiten in Hochschuleinrichtungen und tragen zum akademischen Wissen in ihrem Bereich bei.',
        tips: [
          'Heben Sie Ihre akademischen Qualifikationen und Abschlüsse hervor',
          'Betonen Sie Forschungsveröffentlichungen und akademische Leistungen',
          'Zeigen Sie Unterrichtserfahrung und Studentenbetreuung',
          'Fügen Sie Konferenzpräsentationen und akademischen Service hinzu',
          'Demonstrieren Sie Expertise in Ihrem Studienbereich'
        ],
        skills: [
          'Akademische Forschung und Veröffentlichung',
          'Lehrplanentwicklung und Kursgestaltung',
          'Studentenunterricht und Betreuung',
          'Antragstellung und Forschungsfinanzierung',
          'Akademisches Schreiben und Peer-Review',
          'Konferenzpräsentationen und öffentliches Sprechen',
          'Abteilungsservice und Ausschussarbeit'
        ],
        whyGood: [
          'Klare Struktur, die akademische Qualifikationen hervorhebt',
          'Betont Forschungsbeiträge und Veröffentlichungen',
          'Zeigt Fortschritt der akademischen Karriere',
          'Demonstriert Engagement für Bildung und Wissenschaft',
          'ATS-freundliches Format mit akademischen Schlüsselwörtern'
        ]
      },
      it: {
        name: 'Professore',
        slug: 'professore',
        description: 'I professori insegnano nelle università e nei college, conducono ricerche, pubblicano lavori accademici e guidano gli studenti. Lavorano in istituzioni di istruzione superiore e contribuiscono alla conoscenza accademica nel loro campo.',
        tips: [
          'Evidenzia le tue qualifiche accademiche e lauree',
          'Enfatizza pubblicazioni di ricerca e risultati accademici',
          'Mostra esperienza di insegnamento e mentorato studentesco',
          'Includi presentazioni a conferenze e servizio accademico',
          'Dimostra competenza nel tuo campo di studio'
        ],
        skills: [
          'Ricerca accademica e pubblicazione',
          'Sviluppo del curriculum e progettazione dei corsi',
          'Istruzione e mentorato degli studenti',
          'Scrittura di sovvenzioni e finanziamento della ricerca',
          'Scrittura accademica e revisione tra pari',
          'Presentazioni a conferenze e public speaking',
          'Servizio dipartimentale e lavoro in commissioni'
        ],
        whyGood: [
          'Struttura chiara che evidenzia le credenziali accademiche',
          'Enfatizza i contributi alla ricerca e le pubblicazioni',
          'Mostra la progressione della carriera accademica',
          'Dimostra impegno per l\'educazione e la borsa di studio',
          'Formato compatibile ATS con parole chiave accademiche'
        ]
      },
      pl: {
        name: 'Profesor',
        slug: 'profesor',
        description: 'Profesorowie nauczają na uniwersytetach i college\'ach, prowadzą badania, publikują prace akademickie i mentorują studentów. Pracują w instytucjach szkolnictwa wyższego i przyczyniają się do wiedzy akademickiej w swojej dziedzinie.',
        tips: [
          'Podkreśl swoje kwalifikacje akademickie i stopnie',
          'Podkreśl publikacje badawcze i osiągnięcia akademickie',
          'Pokaż doświadczenie w nauczaniu i mentorowaniu studentów',
          'Uwzględnij prezentacje na konferencjach i służbę akademicką',
          'Wykazuj wiedzę w swojej dziedzinie studiów'
        ],
        skills: [
          'Badania akademickie i publikacje',
          'Rozwój programu nauczania i projektowanie kursów',
          'Instrukcja i mentorowanie studentów',
          'Pisanie wniosków o granty i finansowanie badań',
          'Pisanie akademickie i recenzja',
          'Prezentacje na konferencjach i wystąpienia publiczne',
          'Służba wydziałowa i praca w komisjach'
        ],
        whyGood: [
          'Jasna struktura podkreślająca kwalifikacje akademickie',
          'Podkreśla wkład w badania i publikacje',
          'Pokazuje postęp kariery akademickiej',
          'Wykazuje zaangażowanie w edukację i naukę',
          'Format przyjazny dla ATS z kluczowymi słowami akademickimi'
        ]
      },
      ro: {
        name: 'Profesor',
        slug: 'profesor',
        description: 'Profesorii predau la universități și colegii, conduc cercetări, publică lucrări academice și ghidează studenții. Lucrează în instituții de învățământ superior și contribuie la cunoștințele academice în domeniul lor.',
        tips: [
          'Evidențiază calificările și diplomele academice',
          'Subliniază publicațiile de cercetare și realizările academice',
          'Prezintă experiența de predare și mentorat studențesc',
          'Include prezentări la conferințe și serviciu academic',
          'Demonstrează expertiza în domeniul tău de studiu'
        ],
        skills: [
          'Cercetare academică și publicare',
          'Dezvoltare curriculum și proiectare cursuri',
          'Instruire și mentorat studenți',
          'Scriere granturi și finanțare cercetare',
          'Scriere academică și peer review',
          'Prezentări la conferințe și public speaking',
          'Serviciu departamental și lucru în comitete'
        ],
        whyGood: [
          'Structură clară care evidențiază calificările academice',
          'Subliniază contribuțiile la cercetare și publicații',
          'Arată progresia carierei academice',
          'Demonstrează angajamentul față de educație și știință',
          'Format compatibil ATS cu cuvinte cheie academice'
        ]
      },
      hu: {
        name: 'Professzor',
        slug: 'professzor',
        description: 'A professzorok egyetemeken és főiskolákon tanítanak, kutatásokat végeznek, akadémiai munkákat publikálnak és diákokat mentorálnak. Felsőoktatási intézményekben dolgoznak és hozzájárulnak az akadémiai tudáshoz a területükön.',
        tips: [
          'Hangsúlyozza akadémiai képzettségét és diplomáit',
          'Hangsúlyozza a kutatási publikációkat és akadémiai eredményeket',
          'Mutassa be a tanítási tapasztalatot és diákmentorálást',
          'Tartalmazza a konferencia-előadásokat és akadémiai szolgálatot',
          'Mutassa be a szakterületén szerzett szakértelmét'
        ],
        skills: [
          'Akadémiai kutatás és publikáció',
          'Tananyagfejlesztés és kurzus tervezés',
          'Diákok oktatása és mentorálása',
          'Pályázatírás és kutatásfinanszírozás',
          'Akadémiai írás és peer review',
          'Konferencia-előadások és nyilvános beszéd',
          'Tanszéki szolgálat és bizottsági munka'
        ],
        whyGood: [
          'Világos struktúra, amely kiemeli az akadémiai képzettségeket',
          'Hangsúlyozza a kutatási hozzájárulásokat és publikációkat',
          'Mutatja az akadémiai karrier fejlődését',
          'Bemutatja az oktatáshoz és tudományhoz való elkötelezettséget',
          'ATS-barát formátum akadémiai kulcsszavakkal'
        ]
      },
      el: {
        name: 'Καθηγητής',
        slug: 'kathigitis',
        description: 'Οι καθηγητές διδάσκουν σε πανεπιστήμια και κολέγια, διεξάγουν έρευνα, δημοσιεύουν ακαδημαϊκά έργα και καθοδηγούν φοιτητές. Εργάζονται σε ιδρύματα ανώτατης εκπαίδευσης και συμβάλλουν στην ακαδημαϊκή γνώση στον τομέα τους.',
        tips: [
          'Επισημάνετε τις ακαδημαϊκές σας προσόντα και πτυχία',
          'Τονίστε τις ερευνητικές δημοσιεύσεις και ακαδημαϊκά επιτεύγματα',
          'Παρουσιάστε εμπειρία διδασκαλίας και καθοδήγησης φοιτητών',
          'Συμπεριλάβετε παρουσιάσεις σε συνέδρια και ακαδημαϊκή υπηρεσία',
          'Αποδείξτε εμπειρογνωμοσύνη στον τομέα σας'
        ],
        skills: [
          'Ακαδημαϊκή έρευνα και δημοσίευση',
          'Ανάπτυξη προγράμματος σπουδών και σχεδιασμός μαθημάτων',
          'Εκπαίδευση και καθοδήγηση φοιτητών',
          'Συγγραφή επιχορηγήσεων και χρηματοδότηση έρευνας',
          'Ακαδημαϊκή γραφή και αξιολόγηση από ομοτίμους',
          'Παρουσιάσεις σε συνέδρια και δημόσια ομιλία',
          'Τμηματική υπηρεσία και εργασία σε επιτροπές'
        ],
        whyGood: [
          'Σαφής δομή που επισημαίνει τα ακαδημαϊκά προσόντα',
          'Τονίζει τις ερευνητικές συνεισφορές και δημοσιεύσεις',
          'Δείχνει την πρόοδο της ακαδημαϊκής καριέρας',
          'Αποδεικνύει δέσμευση στην εκπαίδευση και τη μάθηση',
          'Μορφή συμβατή με ATS με ακαδημαϊκές λέξεις-κλειδιά'
        ]
      },
      cs: {
        name: 'Profesor',
        slug: 'profesor',
        description: 'Profesoři vyučují na univerzitách a vysokých školách, provádějí výzkum, publikují akademické práce a mentorují studenty. Pracují v institucích vyššího vzdělávání a přispívají k akademickým znalostem ve svém oboru.',
        tips: [
          'Zdůrazněte své akademické kvalifikace a tituly',
          'Zdůrazněte výzkumné publikace a akademické úspěchy',
          'Ukažte zkušenosti s výukou a mentorováním studentů',
          'Zahrňte prezentace na konferencích a akademickou službu',
          'Prokažte odbornost ve svém oboru'
        ],
        skills: [
          'Akademický výzkum a publikace',
          'Vývoj kurikula a návrh kurzů',
          'Výuka a mentorování studentů',
          'Psaní grantů a financování výzkumu',
          'Akademické psaní a peer review',
          'Prezentace na konferencích a veřejné vystupování',
          'Katedrová služba a práce v komisích'
        ],
        whyGood: [
          'Jasná struktura zdůrazňující akademické kvalifikace',
          'Zdůrazňuje výzkumné příspěvky a publikace',
          'Ukazuje pokrok akademické kariéry',
          'Prokazuje závazek k vzdělávání a vědě',
          'Formát kompatibilní s ATS s akademickými klíčovými slovy'
        ]
      },
      pt: {
        name: 'Professor',
        slug: 'professor',
        description: 'Professores ensinam em universidades e faculdades, conduzem pesquisas, publicam trabalhos acadêmicos e orientam estudantes. Trabalham em instituições de ensino superior e contribuem para o conhecimento acadêmico em seu campo.',
        tips: [
          'Destaque suas qualificações acadêmicas e diplomas',
          'Enfatize publicações de pesquisa e conquistas acadêmicas',
          'Mostre experiência de ensino e mentoría estudantil',
          'Inclua apresentações em conferências e serviço acadêmico',
          'Demonstre expertise em seu campo de estudo'
        ],
        skills: [
          'Pesquisa acadêmica e publicação',
          'Desenvolvimento de currículo e design de cursos',
          'Instrução e mentoría de estudantes',
          'Redação de subsídios e financiamento de pesquisa',
          'Escrita acadêmica e revisão por pares',
          'Apresentações em conferências e oratória',
          'Serviço departamental e trabalho em comitês'
        ],
        whyGood: [
          'Estrutura clara destacando credenciais acadêmicas',
          'Enfatiza contribuições de pesquisa e publicações',
          'Mostra progressão da carreira acadêmica',
          'Demonstra compromisso com educação e erudição',
          'Formato compatível com ATS com palavras-chave acadêmicas'
        ]
      },
      sv: {
        name: 'Professor',
        slug: 'professor',
        description: 'Professorer undervisar vid universitet och högskolor, bedriver forskning, publicerar akademiskt arbete och mentorar studenter. De arbetar vid högre utbildningsinstitutioner och bidrar till akademisk kunskap inom sitt område.',
        tips: [
          'Framhäv dina akademiska kvalifikationer och examina',
          'Betona forskningspublikationer och akademiska prestationer',
          'Visa undervisningserfarenhet och studentmentorskap',
          'Inkludera konferenspresentationer och akademisk service',
          'Visa expertis inom ditt studieområde'
        ],
        skills: [
          'Akademisk forskning och publicering',
          'Läroplanutveckling och kursdesign',
          'Studentundervisning och mentorskap',
          'Bidragsskrivande och forskningsfinansiering',
          'Akademiskt skrivande och peer review',
          'Konferenspresentationer och offentligt talande',
          'Avdelningsservice och kommittéarbete'
        ],
        whyGood: [
          'Tydlig struktur som framhäver akademiska kvalifikationer',
          'Betonar forskningsbidrag och publikationer',
          'Visar progression av akademisk karriär',
          'Visar engagemang för utbildning och forskning',
          'ATS-vänligt format med akademiska nyckelord'
        ]
      },
      bg: {
        name: 'Професор',
        slug: 'profesor',
        description: 'Професорите преподават в университети и колежи, провеждат изследвания, публикуват академични трудове и менторстват студенти. Работят в институции за висше образование и допринасят за академичните знания в своята област.',
        tips: [
          'Подчертайте академичните си квалификации и степени',
          'Акцентирайте върху изследователски публикации и академични постижения',
          'Покажете опит в преподаването и менторство на студенти',
          'Включете презентации на конференции и академична служба',
          'Демонстрирайте експертиза в своята област на изследване'
        ],
        skills: [
          'Академично изследване и публикуване',
          'Разработване на учебна програма и дизайн на курсове',
          'Обучение и менторство на студенти',
          'Писане на грантове и финансиране на изследвания',
          'Академично писане и рецензиране',
          'Презентации на конференции и публично говорене',
          'Катедрална служба и работа в комисии'
        ],
        whyGood: [
          'Ясна структура, подчертаваща академичните квалификации',
          'Акцентира върху изследователските приноси и публикации',
          'Показва прогресия на академичната кариера',
          'Демонстрира ангажираност към образованието и науката',
          'Формат, съвместим с ATS с академични ключови думи'
        ]
      },
      da: {
        name: 'Professor',
        slug: 'professor',
        description: 'Professorer underviser på universiteter og højskoler, udfører forskning, publicerer akademisk arbejde og vejleder studerende. De arbejder på højere uddannelsesinstitutioner og bidrager til akademisk viden inden for deres område.',
        tips: [
          'Fremhæv dine akademiske kvalifikationer og grader',
          'Fremhæv forskningspublikationer og akademiske præstationer',
          'Vis undervisningserfaring og studentmentorskap',
          'Inkluder konferencepræsentationer og akademisk service',
          'Demonstrer ekspertise inden for dit studieområde'
        ],
        skills: [
          'Akademisk forskning og publicering',
          'Læreplanudvikling og kursusdesign',
          'Studentundervisning og mentorskap',
          'Grantskrivning og forskningsfinansiering',
          'Akademisk skrivning og peer review',
          'Konferencepræsentationer og offentligt talende',
          'Afdelingstjeneste og komitéarbejde'
        ],
        whyGood: [
          'Tydelig struktur, der fremhæver akademiske kvalifikationer',
          'Fremhæver forskningsbidrag og publikationer',
          'Vis progression af akademisk karriere',
          'Demonstrer forpligtelse til uddannelse og forskning',
          'ATS-venligt format med akademiske nøgleord'
        ]
      },
      fi: {
        name: 'Professori',
        slug: 'professori',
        description: 'Professorit opettavat yliopistoissa ja korkeakouluissa, tekevät tutkimusta, julkaisevat akateemisia töitä ja mentorovat opiskelijoita. He työskentelevät korkeakouluissa ja osallistuvat akateemiseen tietoon alallaan.',
        tips: [
          'Korosta akateemiset pätevyytesi ja tutkinnot',
          'Korosta tutkimusjulkaisuja ja akateemisia saavutuksia',
          'Näytä opetuskokemusta ja opiskelijamentorointia',
          'Sisällytä konferenssiesitykset ja akateeminen palvelu',
          'Näytä asiantuntemusta alallasi'
        ],
        skills: [
          'Akateeminen tutkimus ja julkaisu',
          'Opetussuunnitelman kehittäminen ja kurssisuunnittelu',
          'Opiskelijoiden opettaminen ja mentorointi',
          'Apurahojen kirjoittaminen ja tutkimusrahoitus',
          'Akateeminen kirjoittaminen ja vertaisarviointi',
          'Konferenssiesitykset ja julkiset esitykset',
          'Laitoshuolto ja komiteatyö'
        ],
        whyGood: [
          'Selkeä rakenne, joka korostaa akateemisia pätevyyksiä',
          'Korostaa tutkimuspanoksia ja julkaisuja',
          'Näyttää akateemisen uran kehityksen',
          'Näyttää sitoutumisen koulutukseen ja tieteeseen',
          'ATS-yhteensopiva muoto akateemisilla avainsanoilla'
        ]
      },
      sk: {
        name: 'Profesor',
        slug: 'profesor',
        description: 'Profesori vyučujú na univerzitách a vysokých školách, vykonávajú výskum, publikujú akademické práce a mentorujú študentov. Pracujú v inštitúciách vyššieho vzdelávania a prispievajú k akademickým znalostiam vo svojom odbore.',
        tips: [
          'Zdôraznite svoje akademické kvalifikácie a tituly',
          'Zdôraznite výskumné publikácie a akademické úspechy',
          'Ukážte skúsenosti s výučbou a mentorovaním študentov',
          'Zahrňte prezentácie na konferenciách a akademickú službu',
          'Preukážte odbornosť vo svojom odbore'
        ],
        skills: [
          'Akademický výskum a publikácie',
          'Vývoj kurikula a návrh kurzov',
          'Výučba a mentorovanie študentov',
          'Písanie grantov a financovanie výskumu',
          'Akademické písanie a peer review',
          'Prezentácie na konferenciách a verejné vystupovanie',
          'Katedrová služba a práca v komisiách'
        ],
        whyGood: [
          'Jasná štruktúra zdôrazňujúca akademické kvalifikácie',
          'Zdôrazňuje výskumné príspevky a publikácie',
          'Ukazuje pokrok akademickej kariéry',
          'Preukazuje záväzok k vzdelávaniu a vede',
          'Formát kompatibilný s ATS s akademickými kľúčovými slovami'
        ]
      },
      no: {
        name: 'Professor',
        slug: 'professor',
        description: 'Professorer underviser ved universiteter og høyskoler, driver forskning, publiserer akademisk arbeid og mentorar studenter. De arbeider ved høyere utdanningsinstitusjoner og bidrar til akademisk kunnskap innenfor sitt felt.',
        tips: [
          'Fremhev dine akademiske kvalifikasjoner og grader',
          'Fremhev forskningspublikasjoner og akademiske prestasjoner',
          'Vis undervisningserfaring og studentmentorskap',
          'Inkluder konferansepresentasjoner og akademisk tjeneste',
          'Vis ekspertise innenfor ditt studieområde'
        ],
        skills: [
          'Akademisk forskning og publisering',
          'Læreplanutvikling og kursdesign',
          'Studentundervisning og mentorskap',
          'Grantskriving og forskningsfinansiering',
          'Akademisk skriving og peer review',
          'Konferansepresentasjoner og offentlig talende',
          'Avdelingsservice og komitéarbeid'
        ],
        whyGood: [
          'Tydelig struktur som fremhever akademiske kvalifikasjoner',
          'Fremhever forskningsbidrag og publikasjoner',
          'Vis progresjon av akademisk karriere',
          'Vis forpliktelse til utdanning og forskning',
          'ATS-vennlig format med akademiske nøkkelord'
        ]
      },
      hr: {
        name: 'Profesor',
        slug: 'profesor',
        description: 'Profesori predaju na sveučilištima i fakultetima, provode istraživanja, objavljuju akademske radove i mentoriraju studente. Rade u visokim učilištima i doprinose akademskom znanju u svom području.',
        tips: [
          'Istaknite svoje akademske kvalifikacije i diplome',
          'Naglasite istraživačke publikacije i akademska postignuća',
          'Pokažite iskustvo u nastavi i mentorstvu studenata',
          'Uključite prezentacije na konferencijama i akademsku službu',
          'Pokažite stručnost u svom području studija'
        ],
        skills: [
          'Akademsko istraživanje i objavljivanje',
          'Razvoj kurikuluma i dizajn tečajeva',
          'Nastava i mentorstvo studenata',
          'Pisanje grantova i financiranje istraživanja',
          'Akademsko pisanje i recenzija',
          'Prezentacije na konferencijama i javno govorenje',
          'Odsječna služba i rad u odborima'
        ],
        whyGood: [
          'Jasna struktura koja ističe akademske kvalifikacije',
          'Naglašava istraživačke doprinose i publikacije',
          'Pokazuje napredak akademske karijere',
          'Pokazuje predanost obrazovanju i znanosti',
          'Format kompatibilan s ATS s akademskim ključnim riječima'
        ]
      },
      sr: {
        name: 'Професор',
        slug: 'profesor',
        description: 'Професори предају на универзитетима и факултетима, спроводе истраживања, објављују академске радове и менторишу студенте. Раде у високим училиштима и доприносе академском знању у свом пољу.',
        tips: [
          'Истакните своје академске квалификације и дипломе',
          'Нагласите истраживачке публикације и академска достигнућа',
          'Покажите искуство у настави и менторству студената',
          'Укључите презентације на конференцијама и академску службу',
          'Покажите стручност у свом пољу студија'
        ],
        skills: [
          'Академско истраживање и објављивање',
          'Развој курикулума и дизајн курсева',
          'Настава и менторство студената',
          'Писање грантова и финансирање истраживања',
          'Академско писање и рецензија',
          'Презентације на конференцијама и јавно говорење',
          'Одсечна служба и рад у одборима'
        ],
        whyGood: [
          'Јасна структура која истиче академске квалификације',
          'Наглашава истраживачке доприносе и публикације',
          'Показује напредак академске каријере',
          'Показује посвећеност образовању и науци',
          'Формат компатибилан са ATS са академским кључним речима'
        ]
      }
    }
  },
  // Education: School Counselor
  {
    id: 'school-counselor',
    category: 'education',
    translations: {
      en: {
        name: 'School Counselor',
        slug: 'school-counselor',
        description: 'School counselors provide academic, career, and personal guidance to students. They help students navigate challenges, develop social skills, and plan for their future education and career paths.',
        tips: [
          'Highlight your counseling degree and certifications',
          'Emphasize experience with student support and crisis intervention',
          'Showcase knowledge of career planning and academic guidance',
          'Include experience with diverse student populations',
          'Demonstrate strong communication and empathy skills'
        ],
        skills: [
          'Individual and group counseling',
          'Academic and career planning',
          'Crisis intervention and prevention',
          'Student assessment and evaluation',
          'Parent and teacher consultation',
          'Program development and implementation',
          'Mental health support and referrals'
        ],
        whyGood: [
          'Clear structure highlighting counseling qualifications',
          'Emphasizes student support and positive outcomes',
          'Shows progression of counseling experience',
          'Demonstrates commitment to student wellbeing',
          'ATS-friendly format with counseling keywords'
        ]
      },
      nl: {
        name: 'Schoolcounselor',
        slug: 'schoolcounselor',
        description: 'Schoolcounselors bieden academische, carrière- en persoonlijke begeleiding aan studenten. Ze helpen studenten bij het navigeren door uitdagingen, ontwikkelen van sociale vaardigheden en plannen voor hun toekomstige opleiding en carrièrepaden.',
        tips: [
          'Benadruk je counseling diploma en certificeringen',
          'Leg nadruk op ervaring met studentenondersteuning en crisisinterventie',
          'Toon kennis van loopbaanplanning en academische begeleiding',
          'Vermeld ervaring met diverse studentenpopulaties',
          'Demonstreer sterke communicatie- en empathievaardigheden'
        ],
        skills: [
          'Individuele en groepsbegeleiding',
          'Academische en loopbaanplanning',
          'Crisisinterventie en preventie',
          'Studentbeoordeling en evaluatie',
          'Ouder- en leraarsconsultatie',
          'Programmaontwikkeling en implementatie',
          'Geestelijke gezondheidsondersteuning en doorverwijzingen'
        ],
        whyGood: [
          'Duidelijke structuur die counseling kwalificaties benadrukt',
          'Legt nadruk op studentenondersteuning en positieve resultaten',
          'Toont progressie van counseling ervaring',
          'Demonstreert toewijding aan studentenwelzijn',
          'ATS-vriendelijk formaat met counseling trefwoorden'
        ]
      },
      fr: {
        name: 'Conseiller d\'orientation',
        slug: 'conseiller-orientation',
        description: 'Les conseillers d\'orientation fournissent des conseils académiques, professionnels et personnels aux étudiants. Ils aident les étudiants à naviguer dans les défis, à développer des compétences sociales et à planifier leur future éducation et leurs parcours professionnels.',
        tips: [
          'Mettez en avant votre diplôme en conseil et certifications',
          'Soulignez l\'expérience avec le soutien aux étudiants et l\'intervention en cas de crise',
          'Présentez la connaissance de la planification de carrière et de l\'orientation académique',
          'Incluez l\'expérience avec des populations étudiantes diverses',
          'Démontrez de solides compétences en communication et empathie'
        ],
        skills: [
          'Conseil individuel et de groupe',
          'Planification académique et de carrière',
          'Intervention et prévention de crise',
          'Évaluation et notation des étudiants',
          'Consultation avec les parents et les enseignants',
          'Développement et mise en œuvre de programmes',
          'Soutien en santé mentale et références'
        ],
        whyGood: [
          'Structure claire mettant en évidence les qualifications en conseil',
          'Met l\'accent sur le soutien aux étudiants et les résultats positifs',
          'Montre la progression de l\'expérience en conseil',
          'Démontre l\'engagement envers le bien-être des étudiants',
          'Format compatible ATS avec mots-clés de conseil'
        ]
      },
      es: {
        name: 'Consejero Escolar',
        slug: 'consejero-escolar',
        description: 'Los consejeros escolares brindan orientación académica, profesional y personal a los estudiantes. Ayudan a los estudiantes a navegar desafíos, desarrollar habilidades sociales y planificar su futura educación y trayectorias profesionales.',
        tips: [
          'Destaca tu título en consejería y certificaciones',
          'Enfatiza experiencia con apoyo estudiantil e intervención en crisis',
          'Muestra conocimiento de planificación de carrera y orientación académica',
          'Incluye experiencia con poblaciones estudiantiles diversas',
          'Demuestra fuertes habilidades de comunicación y empatía'
        ],
        skills: [
          'Consejería individual y grupal',
          'Planificación académica y de carrera',
          'Intervención y prevención de crisis',
          'Evaluación y calificación de estudiantes',
          'Consultoría con padres y maestros',
          'Desarrollo e implementación de programas',
          'Apoyo en salud mental y referencias'
        ],
        whyGood: [
          'Estructura clara que destaca calificaciones en consejería',
          'Enfatiza apoyo estudiantil y resultados positivos',
          'Muestra progresión de experiencia en consejería',
          'Demuestra compromiso con el bienestar estudiantil',
          'Formato compatible con ATS con palabras clave de consejería'
        ]
      },
      de: {
        name: 'Schulberater',
        slug: 'schulberater',
        description: 'Schulberater bieten akademische, berufliche und persönliche Beratung für Schüler. Sie helfen Schülern, Herausforderungen zu bewältigen, soziale Fähigkeiten zu entwickeln und ihre zukünftige Ausbildung und Karrierewege zu planen.',
        tips: [
          'Heben Sie Ihren Beratungsabschluss und Zertifizierungen hervor',
          'Betonen Sie Erfahrung mit Schülerunterstützung und Krisenintervention',
          'Zeigen Sie Kenntnisse in Karriereplanung und akademischer Beratung',
          'Fügen Sie Erfahrung mit vielfältigen Schülerpopulationen hinzu',
          'Demonstrieren Sie starke Kommunikations- und Empathiefähigkeiten'
        ],
        skills: [
          'Einzel- und Gruppenberatung',
          'Akademische und Karriereplanung',
          'Krisenintervention und Prävention',
          'Schülerbewertung und -evaluierung',
          'Beratung mit Eltern und Lehrern',
          'Programmentwicklung und -umsetzung',
          'Unterstützung der psychischen Gesundheit und Überweisungen'
        ],
        whyGood: [
          'Klare Struktur, die Beratungsqualifikationen hervorhebt',
          'Betont Schülerunterstützung und positive Ergebnisse',
          'Zeigt Fortschritt der Beratungserfahrung',
          'Demonstriert Engagement für das Wohlbefinden der Schüler',
          'ATS-freundliches Format mit Beratungsschlüsselwörtern'
        ]
      },
      it: {
        name: 'Consulente Scolastico',
        slug: 'consulente-scolastico',
        description: 'I consulenti scolastici forniscono orientamento accademico, professionale e personale agli studenti. Aiutano gli studenti a navigare le sfide, sviluppare abilità sociali e pianificare la loro futura istruzione e percorsi di carriera.',
        tips: [
          'Evidenzia il tuo diploma in consulenza e certificazioni',
          'Enfatizza l\'esperienza con il supporto agli studenti e l\'intervento in caso di crisi',
          'Mostra conoscenza della pianificazione della carriera e orientamento accademico',
          'Includi esperienza con popolazioni studentesche diverse',
          'Dimostra forti capacità di comunicazione ed empatia'
        ],
        skills: [
          'Consulenza individuale e di gruppo',
          'Pianificazione accademica e di carriera',
          'Intervento e prevenzione delle crisi',
          'Valutazione e valutazione degli studenti',
          'Consultazione con genitori e insegnanti',
          'Sviluppo e implementazione di programmi',
          'Supporto alla salute mentale e riferimenti'
        ],
        whyGood: [
          'Struttura chiara che evidenzia le qualifiche di consulenza',
          'Enfatizza il supporto agli studenti e risultati positivi',
          'Mostra la progressione dell\'esperienza di consulenza',
          'Dimostra impegno per il benessere degli studenti',
          'Formato compatibile con ATS con parole chiave di consulenza'
        ]
      },
      pl: {
        name: 'Doradca Szkolny',
        slug: 'doradca-szkolny',
        description: 'Doradcy szkolni zapewniają wsparcie akademickie, zawodowe i osobiste uczniom. Pomagają uczniom radzić sobie z wyzwaniami, rozwijać umiejętności społeczne i planować swoją przyszłą edukację i ścieżki kariery.',
        tips: [
          'Podkreśl swoje wykształcenie w zakresie doradztwa i certyfikaty',
          'Podkreśl doświadczenie w zakresie wsparcia uczniów i interwencji kryzysowej',
          'Pokaż znajomość planowania kariery i doradztwa akademickiego',
          'Uwzględnij doświadczenie z różnorodnymi populacjami uczniów',
          'Wykazuj silne umiejętności komunikacyjne i empatię'
        ],
        skills: [
          'Poradnictwo indywidualne i grupowe',
          'Planowanie akademickie i zawodowe',
          'Interwencja i zapobieganie kryzysom',
          'Ocena i ewaluacja uczniów',
          'Konsultacje z rodzicami i nauczycielami',
          'Rozwój i wdrażanie programów',
          'Wsparcie zdrowia psychicznego i skierowania'
        ],
        whyGood: [
          'Jasna struktura podkreślająca kwalifikacje w zakresie doradztwa',
          'Kładzie nacisk na wsparcie uczniów i pozytywne wyniki',
          'Pokazuje postęp doświadczenia w doradztwie',
          'Wykazuje zaangażowanie w dobrostan uczniów',
          'Format przyjazny dla ATS z kluczowymi słowami doradztwa'
        ]
      },
      ro: {
        name: 'Consilier Școlar',
        slug: 'consilier-scolar',
        description: 'Consilierii școlari oferă îndrumare academică, profesională și personală elevilor. Ei ajută elevii să navigheze prin provocări, să dezvolte abilități sociale și să planifice educația și căile de carieră viitoare.',
        tips: [
          'Evidențiază diploma ta în consiliere și certificările',
          'Subliniază experiența cu sprijinul elevilor și intervenția în criză',
          'Prezintă cunoștințe despre planificarea carierei și orientarea academică',
          'Include experiența cu populații diverse de elevi',
          'Demonstrează abilități puternice de comunicare și empatie'
        ],
        skills: [
          'Consiliere individuală și de grup',
          'Planificare academică și de carieră',
          'Intervenție și prevenire a crizelor',
          'Evaluare și notare a elevilor',
          'Consultare cu părinții și profesorii',
          'Dezvoltare și implementare de programe',
          'Suport pentru sănătatea mintală și referințe'
        ],
        whyGood: [
          'Structură clară care evidențiază calificările în consiliere',
          'Subliniază sprijinul elevilor și rezultatele pozitive',
          'Arată progresia experienței în consiliere',
          'Demonstrează angajamentul față de bunăstarea elevilor',
          'Format compatibil cu ATS cu cuvinte cheie de consiliere'
        ]
      },
      hu: {
        name: 'Iskolai Tanácsadó',
        slug: 'iskolai-tanacsado',
        description: 'Az iskolai tanácsadók akadémiai, karrier- és személyes irányítást nyújtanak a diákoknak. Segítik a diákokat a kihívások kezelésében, társas készségek fejlesztésében és jövőbeli oktatásuk és karrierútjuk tervezésében.',
        tips: [
          'Hangsúlyozza tanácsadói diplomáját és tanúsítványait',
          'Kiemeli a diákok támogatásával és válságkezeléssel kapcsolatos tapasztalatait',
          'Mutassa be a karriertervezés és akadémiai irányítás ismeretét',
          'Tartalmazza a különböző diákpopulációkkal való tapasztalatokat',
          'Mutassa be az erős kommunikációs és empátiás készségeket'
        ],
        skills: [
          'Egyéni és csoportos tanácsadás',
          'Akadémiai és karriertervezés',
          'Válságkezelés és megelőzés',
          'Diákértékelés és értékelés',
          'Szülői és tanári konzultáció',
          'Programfejlesztés és megvalósítás',
          'Mentális egészség támogatás és továbbítás'
        ],
        whyGood: [
          'Világos struktúra, amely kiemeli a tanácsadói képzettségeket',
          'Hangsúlyozza a diákok támogatását és a pozitív eredményeket',
          'Mutatja a tanácsadási tapasztalat fejlődését',
          'Bebizonyítja a diákok jólétére való elkötelezettséget',
          'ATS-barát formátum tanácsadási kulcsszavakkal'
        ]
      },
      el: {
        name: 'Σχολικός Σύμβουλος',
        slug: 'scholikos-symvoulos',
        description: 'Οι σχολικοί σύμβουλοι παρέχουν ακαδημαϊκή, επαγγελματική και προσωπική καθοδήγηση στους μαθητές. Βοηθούν τους μαθητές να αντιμετωπίσουν προκλήσεις, να αναπτύξουν κοινωνικές δεξιότητες και να σχεδιάσουν τη μελλοντική τους εκπαίδευση και επαγγελματικές διαδρομές.',
        tips: [
          'Επισημάνετε το πτυχίο συμβουλευτικής και τις πιστοποιήσεις σας',
          'Τονίστε την εμπειρία με υποστήριξη μαθητών και παρέμβαση σε κρίσεις',
          'Δείξτε γνώση σχεδιασμού καριέρας και ακαδημαϊκής καθοδήγησης',
          'Συμπεριλάβετε εμπειρία με διαφορετικούς πληθυσμούς μαθητών',
          'Αποδείξτε ισχυρές δεξιότητες επικοινωνίας και ενσυναίσθησης'
        ],
        skills: [
          'Ατομική και ομαδική συμβουλευτική',
          'Ακαδημαϊκός και επαγγελματικός σχεδιασμός',
          'Παρέμβαση και πρόληψη κρίσεων',
          'Αξιολόγηση και αξιολόγηση μαθητών',
          'Συμβουλευτική με γονείς και εκπαιδευτικούς',
          'Ανάπτυξη και υλοποίηση προγραμμάτων',
          'Υποστήριξη ψυχικής υγείας και παραπομπές'
        ],
        whyGood: [
          'Σαφής δομή που επισημαίνει τις προσόντα συμβουλευτικής',
          'Τονίζει την υποστήριξη μαθητών και τα θετικά αποτελέσματα',
          'Δείχνει την πρόοδο της εμπειρίας συμβουλευτικής',
          'Αποδεικνύει δέσμευση για την ευημερία των μαθητών',
          'Μορφή συμβατή με ATS με λέξεις-κλειδιά συμβουλευτικής'
        ]
      },
      cs: {
        name: 'Školní Poradce',
        slug: 'skolni-poradce',
        description: 'Školní poradci poskytují akademické, kariérní a osobní poradenství studentům. Pomáhají studentům zvládat výzvy, rozvíjet sociální dovednosti a plánovat jejich budoucí vzdělávání a kariérní cesty.',
        tips: [
          'Zdůrazněte svůj diplom v poradenství a certifikace',
          'Zdůrazněte zkušenosti s podporou studentů a krizovou intervencí',
          'Ukažte znalosti kariérního plánování a akademického poradenství',
          'Zahrňte zkušenosti s různorodými studentskými populacemi',
          'Prokažte silné komunikační dovednosti a empatii'
        ],
        skills: [
          'Individuální a skupinové poradenství',
          'Akademické a kariérní plánování',
          'Krizová intervence a prevence',
          'Hodnocení a evaluace studentů',
          'Konzultace s rodiči a učiteli',
          'Vývoj a implementace programů',
          'Podpora duševního zdraví a doporučení'
        ],
        whyGood: [
          'Jasná struktura zdůrazňující kvalifikace v poradenství',
          'Zdůrazňuje podporu studentů a pozitivní výsledky',
          'Ukazuje pokrok zkušeností v poradenství',
          'Prokazuje závazek k blahu studentů',
          'Formát kompatibilní s ATS s klíčovými slovy poradenství'
        ]
      },
      pt: {
        name: 'Conselheiro Escolar',
        slug: 'conselheiro-escolar',
        description: 'Conselheiros escolares fornecem orientação acadêmica, profissional e pessoal aos estudantes. Eles ajudam os estudantes a navegar desafios, desenvolver habilidades sociais e planejar sua futura educação e trajetórias profissionais.',
        tips: [
          'Destaque seu diploma em aconselhamento e certificações',
          'Enfatize experiência com apoio estudantil e intervenção em crises',
          'Mostre conhecimento de planejamento de carreira e orientação acadêmica',
          'Inclua experiência com populações estudantis diversas',
          'Demonstre fortes habilidades de comunicação e empatia'
        ],
        skills: [
          'Aconselhamento individual e em grupo',
          'Planejamento acadêmico e de carreira',
          'Intervenção e prevenção de crises',
          'Avaliação e avaliação de estudantes',
          'Consultoria com pais e professores',
          'Desenvolvimento e implementação de programas',
          'Apoio à saúde mental e referências'
        ],
        whyGood: [
          'Estrutura clara destacando qualificações em aconselhamento',
          'Enfatiza apoio estudantil e resultados positivos',
          'Mostra progressão de experiência em aconselhamento',
          'Demonstra compromisso com o bem-estar estudantil',
          'Formato compatível com ATS com palavras-chave de aconselhamento'
        ]
      },
      sv: {
        name: 'Skolkurator',
        slug: 'skolkurator',
        description: 'Skolkuratorer ger akademisk, karriär- och personlig vägledning till elever. De hjälper elever att navigera utmaningar, utveckla sociala färdigheter och planera för sin framtida utbildning och karriärvägar.',
        tips: [
          'Framhäv ditt kuratorsexamen och certifieringar',
          'Betona erfarenhet med elevstöd och krisintervention',
          'Visa kunskap om karriärplanering och akademisk vägledning',
          'Inkludera erfarenhet med olika elevpopulationer',
          'Visa starka kommunikations- och empatifärdigheter'
        ],
        skills: [
          'Individuell och gruppkurator',
          'Akademisk och karriärplanering',
          'Krisintervention och prevention',
          'Elevbedömning och utvärdering',
          'Konsultation med föräldrar och lärare',
          'Programutveckling och implementering',
          'Stöd för mental hälsa och remisser'
        ],
        whyGood: [
          'Tydlig struktur som framhäver kuratorskvalifikationer',
          'Betonar elevstöd och positiva resultat',
          'Visar progression av kuratorserfarenhet',
          'Visar engagemang för elevens välbefinnande',
          'ATS-vänligt format med kuratorsnyckelord'
        ]
      },
      bg: {
        name: 'Училищен Съветник',
        slug: 'uchilishten-savetnik',
        description: 'Училищните съветници предоставят академично, кариерно и лично ръководство на учениците. Те помагат на учениците да се справят с предизвикателствата, да развият социални умения и да планират бъдещото си образование и кариерни пътища.',
        tips: [
          'Подчертайте дипломата си по консултиране и сертификатите',
          'Акцентирайте върху опита с подкрепа на учениците и интервенция при кризи',
          'Покажете познания за планиране на кариера и академично ръководство',
          'Включете опит с различни ученически популации',
          'Демонстрирайте силни комуникативни умения и емпатия'
        ],
        skills: [
          'Индивидуално и групово консултиране',
          'Академично и кариерно планиране',
          'Интервенция и превенция на кризи',
          'Оценка и оценяване на ученици',
          'Консултация с родители и учители',
          'Разработване и изпълнение на програми',
          'Подкрепа за психично здраве и препращания'
        ],
        whyGood: [
          'Ясна структура, която подчертава квалификациите по консултиране',
          'Акцентира върху подкрепата на учениците и положителните резултати',
          'Показва прогресия на опита в консултирането',
          'Демонстрира ангажираност към благосъстоянието на учениците',
          'Формат, съвместим с ATS с ключови думи за консултиране'
        ]
      },
      da: {
        name: 'Skolevejleder',
        slug: 'skolevejleder',
        description: 'Skolevejledere giver akademisk, karriere- og personlig vejledning til elever. De hjælper elever med at navigere udfordringer, udvikle sociale færdigheder og planlægge deres fremtidige uddannelse og karriereveje.',
        tips: [
          'Fremhæv din vejledningsgrad og certificeringer',
          'Fremhæv erfaring med elevstøtte og kris intervention',
          'Vis viden om karriereplanlægning og akademisk vejledning',
          'Inkluder erfaring med forskellige elevpopulationer',
          'Demonstrer stærke kommunikations- og empatifærdigheder'
        ],
        skills: [
          'Individuel og gruppev ejledning',
          'Akademisk og karriereplanlægning',
          'Kris intervention og forebyggelse',
          'Elevvurdering og evaluering',
          'Konsultation med forældre og lærere',
          'Programudvikling og implementering',
          'Støtte til mental sundhed og henvisninger'
        ],
        whyGood: [
          'Tydelig struktur, der fremhæver vejledningskvalifikationer',
          'Fremhæver elevstøtte og positive resultater',
          'Vis progression af vejledningserfaring',
          'Demonstrer engagement i elevens velvære',
          'ATS-venligt format med vejledningsnøgleord'
        ]
      },
      fi: {
        name: 'Koulun Ohjaaja',
        slug: 'koulun-ohjaaja',
        description: 'Koulun ohjaajat tarjoavat akateemista, uran ja henkilökohtaista ohjausta oppilaille. He auttavat oppilaita navigoimaan haasteiden läpi, kehittämään sosiaalisia taitoja ja suunnittelemaan tulevaa koulutustaan ja urapolkujaan.',
        tips: [
          'Korosta ohjauskoulutustasi ja sertifikaatteja',
          'Korosta kokemusta oppilasavusta ja kriisivälittämisestä',
          'Näytä tietoa ura suunnittelusta ja akateemisesta ohjauksesta',
          'Sisällytä kokemus erilaisista oppilasväestöistä',
          'Näytä vahvat viestintä- ja empatiataidot'
        ],
        skills: [
          'Yksilöllinen ja ryhmäohjaus',
          'Akateeminen ja ura suunnittelu',
          'Kriisivälitys ja ennaltaehkäisy',
          'Oppilasarviointi ja arviointi',
          'Konsultointi vanhempien ja opettajien kanssa',
          'Ohjelman kehittäminen ja toteutus',
          'Mielenterveyden tuki ja lähetykset'
        ],
        whyGood: [
          'Selkeä rakenne, joka korostaa ohjauskoulutuksia',
          'Korostaa oppilasapua ja positiivisia tuloksia',
          'Näyttää ohjauskokemuksen kehityksen',
          'Näyttää sitoutumisen oppilaiden hyvinvointiin',
          'ATS-yhteensopiva muoto ohjausavainsanoilla'
        ]
      },
      sk: {
        name: 'Školský Poradca',
        slug: 'skolsky-poradca',
        description: 'Školskí poradcovia poskytujú akademické, kariérne a osobné poradenstvo študentom. Pomáhajú študentom zvládnuť výzvy, rozvíjať sociálne zručnosti a plánovať ich budúce vzdelávanie a kariérne cesty.',
        tips: [
          'Zdôraznite svoj diplom v poradenstve a certifikáty',
          'Zdôraznite skúsenosti s podporou študentov a krízovou intervenciou',
          'Ukážte znalosti kariérneho plánovania a akademického poradenstva',
          'Zahrňte skúsenosti s rôznorodými študentskými populáciami',
          'Preukážte silné komunikačné zručnosti a empatiu'
        ],
        skills: [
          'Individuálne a skupinové poradenstvo',
          'Akademické a kariérne plánovanie',
          'Krízová intervencia a prevencia',
          'Hodnotenie a evaluácia študentov',
          'Konzultácie s rodičmi a učiteľmi',
          'Vývoj a implementácia programov',
          'Podpora duševného zdravia a odporúčania'
        ],
        whyGood: [
          'Jasná štruktúra zdôrazňujúca kvalifikácie v poradenstve',
          'Zdôrazňuje podporu študentov a pozitívne výsledky',
          'Ukazuje pokrok skúseností v poradenstve',
          'Preukazuje záväzok k blahu študentov',
          'Formát kompatibilný s ATS s kľúčovými slovami poradenstva'
        ]
      },
      no: {
        name: 'Skoleveileder',
        slug: 'skoleveileder',
        description: 'Skoleveiledere gir akademisk, karriere- og personlig veiledning til elever. De hjelper elever med å navigere utfordringer, utvikle sosiale ferdigheter og planlegge sin fremtidige utdanning og karriereveier.',
        tips: [
          'Fremhev din veiledningsgrad og sertifiseringer',
          'Fremhev erfaring med elevstøtte og krisintervensjon',
          'Vis kunnskap om karriereplanlegging og akademisk veiledning',
          'Inkluder erfaring med ulike elevpopulasjoner',
          'Vis sterke kommunikasjons- og empatiferdigheter'
        ],
        skills: [
          'Individuell og gruppeveiledning',
          'Akademisk og karriereplanlegging',
          'Krisintervensjon og forebygging',
          'Elevvurdering og evaluering',
          'Konsultasjon med foreldre og lærere',
          'Programutvikling og implementering',
          'Støtte til mental helse og henvisninger'
        ],
        whyGood: [
          'Tydelig struktur som fremhever veiledningskvalifikasjoner',
          'Fremhever elevstøtte og positive resultater',
          'Vis progresjon av veiledningserfaring',
          'Vis engasjement for elevens velvære',
          'ATS-vennlig format med veiledningsnøkkelord'
        ]
      },
      hr: {
        name: 'Školski Savjetnik',
        slug: 'skolski-savjetnik',
        description: 'Školski savjetnici pružaju akademsko, karijerno i osobno usmjeravanje studentima. Pomažu studentima u navigaciji izazovima, razvoju socijalnih vještina i planiranju budućeg obrazovanja i karijernih putova.',
        tips: [
          'Istaknite svoju diplomu iz savjetovanja i certifikate',
          'Naglasite iskustvo s podrškom studentima i intervencijom u krizi',
          'Pokažite znanje o planiranju karijere i akademskom usmjeravanju',
          'Uključite iskustvo s različitim studentskim populacijama',
          'Pokažite jake komunikacijske vještine i empatiju'
        ],
        skills: [
          'Individuarno i grupno savjetovanje',
          'Akademsko i karijerno planiranje',
          'Intervencija i prevencija kriza',
          'Procjena i evaluacija studenata',
          'Konzultacije s roditeljima i nastavnicima',
          'Razvoj i implementacija programa',
          'Podrška mentalnom zdravlju i preporuke'
        ],
        whyGood: [
          'Jasna struktura koja ističe kvalifikacije u savjetovanju',
          'Naglašava podršku studentima i pozitivne rezultate',
          'Pokazuje napredak iskustva u savjetovanju',
          'Pokazuje predanost dobrobiti studenata',
          'Format kompatibilan s ATS s ključnim riječima savjetovanja'
        ]
      },
      sr: {
        name: 'Школски Саветник',
        slug: 'skolski-savetnik',
        description: 'Школски саветници пружају академско, каријерно и лично усмеравање студентима. Помажу студентима у навигацији изазовима, развоју социјалних вештина и планирању будућег образовања и каријерних путева.',
        tips: [
          'Истакните своју диплому из саветовања и сертификате',
          'Нагласите искуство са подршком студентима и интервенцијом у кризи',
          'Покажите знање о планирању каријере и академском усмеравању',
          'Укључите искуство са различитим студентским популацијама',
          'Покажите јаке комуникационе вештине и емпатију'
        ],
        skills: [
          'Индивидуално и групно саветовање',
          'Академско и каријерно планирање',
          'Интервенција и превенција криза',
          'Процена и евалуација студената',
          'Консултације са родитељима и наставницима',
          'Развој и имплементација програма',
          'Подршка менталном здрављу и препоруке'
        ],
        whyGood: [
          'Јасна структура која истиче квалификације у саветовању',
          'Наглашава подршку студентима и позитивне резултате',
          'Показује напредак искуства у саветовању',
          'Показује посвећеност добробити студената',
          'Формат компатибилан са ATS са кључним речима саветовања'
        ]
      }
    }
  },
  // Business: Financial Analyst
  {
    id: 'financial-analyst',
    category: 'business',
    translations: {
      en: {
        name: 'Financial Analyst',
        slug: 'financial-analyst',
        description: 'Financial analysts evaluate investment opportunities, analyze financial data, and provide recommendations to help businesses and individuals make informed financial decisions.',
        tips: [
          'Highlight your finance or accounting degree',
          'Emphasize analytical skills and financial modeling experience',
          'Showcase proficiency with financial software and tools',
          'Include certifications like CFA or CPA',
          'Demonstrate quantitative analysis capabilities'
        ],
        skills: [
          'Financial modeling and analysis',
          'Investment research and evaluation',
          'Risk assessment and management',
          'Excel and financial software proficiency',
          'Financial reporting and forecasting',
          'Market research and trend analysis',
          'Presentation and communication skills'
        ],
        whyGood: [
          'Clear structure highlighting analytical expertise',
          'Emphasizes quantitative skills and achievements',
          'Shows progression of financial analysis experience',
          'Demonstrates commitment to professional development',
          'ATS-friendly format with finance keywords'
        ]
      },
      nl: {
        name: 'Financieel Analist',
        slug: 'financieel-analist',
        description: 'Financieel analisten evalueren investeringsmogelijkheden, analyseren financiële gegevens en geven aanbevelingen om bedrijven en individuen te helpen weloverwogen financiële beslissingen te nemen.',
        tips: [
          'Benadruk je financiële of accountancy diploma',
          'Leg nadruk op analytische vaardigheden en financiële modelleringservaring',
          'Toon vaardigheid met financiële software en tools',
          'Vermeld certificeringen zoals CFA of CPA',
          'Demonstreer kwantitatieve analysevaardigheden'
        ],
        skills: [
          'Financiële modellering en analyse',
          'Investeringsonderzoek en evaluatie',
          'Risicobeoordeling en -beheer',
          'Excel en financiële softwarevaardigheid',
          'Financiële rapportage en prognoses',
          'Marktonderzoek en trendanalyse',
          'Presentatie- en communicatievaardigheden'
        ],
        whyGood: [
          'Duidelijke structuur die analytische expertise benadrukt',
          'Legt nadruk op kwantitatieve vaardigheden en prestaties',
          'Toont progressie van financiële analyse-ervaring',
          'Demonstreert toewijding aan professionele ontwikkeling',
          'ATS-vriendelijk formaat met financiële trefwoorden'
        ]
      },
      fr: {
        name: 'Analyste Financier',
        slug: 'analyste-financier',
        description: 'Les analystes financiers évaluent les opportunités d\'investissement, analysent les données financières et fournissent des recommandations pour aider les entreprises et les particuliers à prendre des décisions financières éclairées.',
        tips: [
          'Mettez en avant votre diplôme en finance ou comptabilité',
          'Soulignez les compétences analytiques et l\'expérience en modélisation financière',
          'Présentez la maîtrise des logiciels et outils financiers',
          'Incluez des certifications comme CFA ou CPA',
          'Démontrez les capacités d\'analyse quantitative'
        ],
        skills: [
          'Modélisation et analyse financière',
          'Recherche et évaluation d\'investissements',
          'Évaluation et gestion des risques',
          'Maîtrise d\'Excel et des logiciels financiers',
          'Rapports financiers et prévisions',
          'Recherche de marché et analyse de tendances',
          'Compétences en présentation et communication'
        ],
        whyGood: [
          'Structure claire mettant en évidence l\'expertise analytique',
          'Met l\'accent sur les compétences quantitatives et les réalisations',
          'Montre la progression de l\'expérience en analyse financière',
          'Démontre l\'engagement envers le développement professionnel',
          'Format compatible ATS avec mots-clés financiers'
        ]
      },
      es: {
        name: 'Analista Financiero',
        slug: 'analista-financiero',
        description: 'Los analistas financieros evalúan oportunidades de inversión, analizan datos financieros y brindan recomendaciones para ayudar a empresas e individuos a tomar decisiones financieras informadas.',
        tips: [
          'Destaca tu título en finanzas o contabilidad',
          'Enfatiza habilidades analíticas y experiencia en modelado financiero',
          'Muestra competencia con software y herramientas financieras',
          'Incluye certificaciones como CFA o CPA',
          'Demuestra capacidades de análisis cuantitativo'
        ],
        skills: [
          'Modelado y análisis financiero',
          'Investigación y evaluación de inversiones',
          'Evaluación y gestión de riesgos',
          'Competencia en Excel y software financiero',
          'Informes financieros y pronósticos',
          'Investigación de mercado y análisis de tendencias',
          'Habilidades de presentación y comunicación'
        ],
        whyGood: [
          'Estructura clara que destaca experiencia analítica',
          'Enfatiza habilidades cuantitativas y logros',
          'Muestra progresión de experiencia en análisis financiero',
          'Demuestra compromiso con el desarrollo profesional',
          'Formato compatible con ATS con palabras clave financieras'
        ]
      },
      de: {
        name: 'Finanzanalyst',
        slug: 'finanzanalyst',
        description: 'Finanzanalysten bewerten Anlagemöglichkeiten, analysieren Finanzdaten und geben Empfehlungen, um Unternehmen und Privatpersonen bei fundierten Finanzentscheidungen zu helfen.',
        tips: [
          'Heben Sie Ihren Abschluss in Finanzen oder Rechnungswesen hervor',
          'Betonen Sie analytische Fähigkeiten und Erfahrung in der Finanzmodellierung',
          'Zeigen Sie Kompetenz mit Finanzsoftware und -tools',
          'Fügen Sie Zertifizierungen wie CFA oder CPA hinzu',
          'Demonstrieren Sie quantitative Analysefähigkeiten'
        ],
        skills: [
          'Finanzmodellierung und -analyse',
          'Anlageforschung und -bewertung',
          'Risikobewertung und -management',
          'Excel- und Finanzsoftwarekompetenz',
          'Finanzberichterstattung und Prognosen',
          'Marktforschung und Trendanalyse',
          'Präsentations- und Kommunikationsfähigkeiten'
        ],
        whyGood: [
          'Klare Struktur, die analytische Expertise hervorhebt',
          'Betont quantitative Fähigkeiten und Leistungen',
          'Zeigt Fortschritt der Finanzanalyseerfahrung',
          'Demonstriert Engagement für berufliche Entwicklung',
          'ATS-freundliches Format mit Finanzschlüsselwörtern'
        ]
      },
      it: {
        name: 'Analista Finanziario',
        slug: 'analista-finanziario',
        description: 'Gli analisti finanziari valutano opportunità di investimento, analizzano dati finanziari e forniscono raccomandazioni per aiutare aziende e individui a prendere decisioni finanziarie informate.',
        tips: [
          'Evidenzia la tua laurea in finanza o contabilità',
          'Enfatizza le capacità analitiche e l\'esperienza nella modellazione finanziaria',
          'Mostra competenza con software e strumenti finanziari',
          'Includi certificazioni come CFA o CPA',
          'Dimostra capacità di analisi quantitativa'
        ],
        skills: [
          'Modellazione e analisi finanziaria',
          'Ricerca e valutazione degli investimenti',
          'Valutazione e gestione del rischio',
          'Competenza in Excel e software finanziario',
          'Reporting finanziario e previsioni',
          'Ricerca di mercato e analisi delle tendenze',
          'Capacità di presentazione e comunicazione'
        ],
        whyGood: [
          'Struttura chiara che evidenzia l\'esperienza analitica',
          'Enfatizza le capacità quantitative e i risultati',
          'Mostra la progressione dell\'esperienza nell\'analisi finanziaria',
          'Dimostra impegno per lo sviluppo professionale',
          'Formato compatibile con ATS con parole chiave finanziarie'
        ]
      },
      pl: {
        name: 'Analityk Finansowy',
        slug: 'analityk-finansowy',
        description: 'Analitycy finansowi oceniają możliwości inwestycyjne, analizują dane finansowe i udzielają rekomendacji, aby pomóc firmom i osobom prywatnym w podejmowaniu świadomych decyzji finansowych.',
        tips: [
          'Podkreśl swoje wykształcenie w zakresie finansów lub rachunkowości',
          'Podkreśl umiejętności analityczne i doświadczenie w modelowaniu finansowym',
          'Pokaż biegłość w oprogramowaniu i narzędziach finansowych',
          'Uwzględnij certyfikaty takie jak CFA lub CPA',
          'Wykazuj umiejętności analizy ilościowej'
        ],
        skills: [
          'Modelowanie i analiza finansowa',
          'Badania i ocena inwestycji',
          'Ocena i zarządzanie ryzykiem',
          'Biegłość w Excelu i oprogramowaniu finansowym',
          'Sprawozdawczość finansowa i prognozowanie',
          'Badania rynku i analiza trendów',
          'Umiejętności prezentacji i komunikacji'
        ],
        whyGood: [
          'Jasna struktura podkreślająca wiedzę analityczną',
          'Kładzie nacisk na umiejętności ilościowe i osiągnięcia',
          'Pokazuje postęp doświadczenia w analizie finansowej',
          'Wykazuje zaangażowanie w rozwój zawodowy',
          'Format przyjazny dla ATS z kluczowymi słowami finansowymi'
        ]
      },
      ro: {
        name: 'Analist Financiar',
        slug: 'analist-financiar',
        description: 'Analiștii financiari evaluează oportunitățile de investiții, analizează datele financiare și oferă recomandări pentru a ajuta companiile și persoanele fizice să ia decizii financiare informate.',
        tips: [
          'Evidențiază diploma ta în finanțe sau contabilitate',
          'Subliniază abilitățile analitice și experiența în modelarea financiară',
          'Prezintă competența cu software-ul și instrumentele financiare',
          'Includă certificări precum CFA sau CPA',
          'Demonstrează capacități de analiză cantitativă'
        ],
        skills: [
          'Modelare și analiză financiară',
          'Cercetare și evaluare a investițiilor',
          'Evaluare și managementul riscurilor',
          'Competență în Excel și software financiar',
          'Raportare financiară și prognoză',
          'Cercetare de piață și analiză a tendințelor',
          'Abilități de prezentare și comunicare'
        ],
        whyGood: [
          'Structură clară care evidențiază expertiza analitică',
          'Subliniază abilitățile cantitative și realizările',
          'Arată progresia experienței în analiza financiară',
          'Demonstrează angajamentul față de dezvoltarea profesională',
          'Format compatibil cu ATS cu cuvinte cheie financiare'
        ]
      },
      hu: {
        name: 'Pénzügyi Elemző',
        slug: 'penzugyi-elemzo',
        description: 'A pénzügyi elemzők értékelik a befektetési lehetőségeket, elemzik a pénzügyi adatokat és ajánlásokat nyújtanak, hogy segítsenek a vállalatoknak és magánszemélyeknek tájékozott pénzügyi döntéseket hozni.',
        tips: [
          'Hangsúlyozza pénzügyi vagy számviteli diplomáját',
          'Kiemeli az elemző készségeket és pénzügyi modellezési tapasztalatokat',
          'Mutassa be a pénzügyi szoftverekkel és eszközökkel való jártasságot',
          'Tartalmazza a CFA vagy CPA tanúsítványokat',
          'Mutassa be a kvantitatív elemzési képességeket'
        ],
        skills: [
          'Pénzügyi modellezés és elemzés',
          'Befektetési kutatás és értékelés',
          'Kockázatértékelés és -kezelés',
          'Excel és pénzügyi szoftver jártasság',
          'Pénzügyi jelentéskészítés és előrejelzés',
          'Piackutatás és trendelemzés',
          'Prezentációs és kommunikációs készségek'
        ],
        whyGood: [
          'Világos struktúra, amely kiemeli az elemző szakértelmet',
          'Hangsúlyozza a kvantitatív készségeket és eredményeket',
          'Mutatja a pénzügyi elemzési tapasztalat fejlődését',
          'Bebizonyítja a szakmai fejlesztésre való elkötelezettséget',
          'ATS-barát formátum pénzügyi kulcsszavakkal'
        ]
      },
      el: {
        name: 'Χρηματοοικονομικός Αναλυτής',
        slug: 'chrimatooikonomikos-analytis',
        description: 'Οι χρηματοοικονομικοί αναλυτές αξιολογούν επενδυτικές ευκαιρίες, αναλύουν οικονομικά δεδομένα και παρέχουν συστάσεις για να βοηθήσουν επιχειρήσεις και άτομα να λάβουν ενημερωμένες οικονομικές αποφάσεις.',
        tips: [
          'Επισημάνετε το πτυχίο χρηματοοικονομικών ή λογιστικής σας',
          'Τονίστε τις αναλυτικές δεξιότητες και την εμπειρία χρηματοοικονομικής μοντελοποίησης',
          'Δείξτε επάρκεια με χρηματοοικονομικό λογισμικό και εργαλεία',
          'Συμπεριλάβετε πιστοποιήσεις όπως CFA ή CPA',
          'Αποδείξτε δυνατότητες ποσοτικής ανάλυσης'
        ],
        skills: [
          'Χρηματοοικονομική μοντελοποίηση και ανάλυση',
          'Επενδυτική έρευνα και αξιολόγηση',
          'Αξιολόγηση και διαχείριση κινδύνου',
          'Επάρκεια Excel και χρηματοοικονομικού λογισμικού',
          'Χρηματοοικονομική αναφορά και πρόβλεψη',
          'Ερευνα αγοράς και ανάλυση τάσεων',
          'Δεξιότητες παρουσίασης και επικοινωνίας'
        ],
        whyGood: [
          'Σαφής δομή που επισημαίνει την αναλυτική εμπειρογνωμοσύνη',
          'Τονίζει τις ποσοτικές δεξιότητες και τα επιτεύγματα',
          'Δείχνει την πρόοδο της εμπειρίας χρηματοοικονομικής ανάλυσης',
          'Αποδεικνύει δέσμευση στην επαγγελματική ανάπτυξη',
          'Μορφή συμβατή με ATS με χρηματοοικονομικές λέξεις-κλειδιά'
        ]
      },
      cs: {
        name: 'Finanční Analytik',
        slug: 'financni-analytik',
        description: 'Finanční analytici hodnotí investiční příležitosti, analyzují finanční data a poskytují doporučení, aby pomohli firmám a jednotlivcům činit informovaná finanční rozhodnutí.',
        tips: [
          'Zdůrazněte svůj titul v oboru financí nebo účetnictví',
          'Zdůrazněte analytické dovednosti a zkušenosti s finančním modelováním',
          'Ukažte znalost finančního softwaru a nástrojů',
          'Zahrňte certifikace jako CFA nebo CPA',
          'Prokažte schopnosti kvantitativní analýzy'
        ],
        skills: [
          'Finanční modelování a analýza',
          'Investiční výzkum a hodnocení',
          'Hodnocení a řízení rizik',
          'Znalost Excelu a finančního softwaru',
          'Finanční reporting a prognózy',
          'Výzkum trhu a analýza trendů',
          'Prezentační a komunikační dovednosti'
        ],
        whyGood: [
          'Jasná struktura zdůrazňující analytickou odbornost',
          'Zdůrazňuje kvantitativní dovednosti a úspěchy',
          'Ukazuje pokrok zkušeností s finanční analýzou',
          'Prokazuje závazek k profesnímu rozvoji',
          'Formát kompatibilní s ATS s finančními klíčovými slovy'
        ]
      },
      pt: {
        name: 'Analista Financeiro',
        slug: 'analista-financeiro',
        description: 'Analistas financeiros avaliam oportunidades de investimento, analisam dados financeiros e fornecem recomendações para ajudar empresas e indivíduos a tomar decisões financeiras informadas.',
        tips: [
          'Destaque seu diploma em finanças ou contabilidade',
          'Enfatize habilidades analíticas e experiência em modelagem financeira',
          'Mostre proficiência com software e ferramentas financeiras',
          'Inclua certificações como CFA ou CPA',
          'Demonstre capacidades de análise quantitativa'
        ],
        skills: [
          'Modelagem e análise financeira',
          'Pesquisa e avaliação de investimentos',
          'Avaliação e gestão de riscos',
          'Proficiência em Excel e software financeiro',
          'Relatórios financeiros e previsões',
          'Pesquisa de mercado e análise de tendências',
          'Habilidades de apresentação e comunicação'
        ],
        whyGood: [
          'Estrutura clara destacando expertise analítica',
          'Enfatiza habilidades quantitativas e conquistas',
          'Mostra progressão de experiência em análise financeira',
          'Demonstra compromisso com desenvolvimento profissional',
          'Formato compatível com ATS com palavras-chave financeiras'
        ]
      },
      sv: {
        name: 'Finansiell Analytiker',
        slug: 'finansiell-analytiker',
        description: 'Finansiella analytiker utvärderar investeringsmöjligheter, analyserar finansiella data och ger rekommendationer för att hjälpa företag och individer att fatta informerade finansiella beslut.',
        tips: [
          'Framhäv din examen i finans eller redovisning',
          'Betona analytiska färdigheter och erfarenhet av finansiell modellering',
          'Visa kompetens med finansiell programvara och verktyg',
          'Inkludera certifieringar som CFA eller CPA',
          'Visa kvantitativa analysförmågor'
        ],
        skills: [
          'Finansiell modellering och analys',
          'Investeringsforskning och utvärdering',
          'Riskanalys och riskhantering',
          'Kompetens i Excel och finansiell programvara',
          'Finansiell rapportering och prognoser',
          'Marknadsforskning och trendanalys',
          'Prezentations- och kommunikationsfärdigheter'
        ],
        whyGood: [
          'Tydlig struktur som framhäver analytisk expertis',
          'Betonar kvantitativa färdigheter och prestationer',
          'Visar progression av erfarenhet inom finansiell analys',
          'Visar engagemang för professionell utveckling',
          'ATS-vänligt format med finansiella nyckelord'
        ]
      },
      bg: {
        name: 'Финансов Аналитик',
        slug: 'finansov-analitik',
        description: 'Финансовите аналитици оценяват инвестиционни възможности, анализират финансови данни и предоставят препоръки, за да помогнат на предприятия и физически лица да вземат информирани финансови решения.',
        tips: [
          'Подчертайте дипломата си по финанси или счетоводство',
          'Акцентирайте върху аналитичните умения и опита с финансово моделиране',
          'Покажете компетентност с финансов софтуер и инструменти',
          'Включете сертификати като CFA или CPA',
          'Демонстрирайте способности за количествен анализ'
        ],
        skills: [
          'Финансово моделиране и анализ',
          'Инвестиционно проучване и оценка',
          'Оценка и управление на риска',
          'Компетентност в Excel и финансов софтуер',
          'Финансова отчетност и прогнози',
          'Пазарно проучване и анализ на тенденции',
          'Умения за представяне и комуникация'
        ],
        whyGood: [
          'Ясна структура, която подчертава аналитичната експертиза',
          'Акцентира върху количествените умения и постижения',
          'Показва прогресия на опита с финансов анализ',
          'Демонстрира ангажираност към професионално развитие',
          'Формат, съвместим с ATS с финансови ключови думи'
        ]
      },
      da: {
        name: 'Finansiel Analytiker',
        slug: 'finansiel-analytiker',
        description: 'Finansielle analytikere vurderer investeringsmuligheder, analyserer finansielle data og giver anbefalinger for at hjælpe virksomheder og enkeltpersoner med at træffe informerede finansielle beslutninger.',
        tips: [
          'Fremhæv din grad i finans eller regnskab',
          'Fremhæv analytiske færdigheder og erfaring med finansiel modellering',
          'Vis kompetence med finansiel software og værktøjer',
          'Inkluder certificeringer som CFA eller CPA',
          'Demonstrer kvantitative analyseevner'
        ],
        skills: [
          'Finansiel modellering og analyse',
          'Investeringsforskning og evaluering',
          'Risikovurdering og -styring',
          'Kompetence i Excel og finansiel software',
          'Finansiel rapportering og prognoser',
          'Markedsundersøgelse og trendanalyse',
          'Præsentations- og kommunikationsfærdigheder'
        ],
        whyGood: [
          'Tydelig struktur, der fremhæver analytisk ekspertise',
          'Fremhæver kvantitative færdigheder og præstationer',
          'Vis progression af erfaring med finansiel analyse',
          'Demonstrer engagement i professionel udvikling',
          'ATS-venligt format med finansielle nøgleord'
        ]
      },
      fi: {
        name: 'Rahoitusanalyytikko',
        slug: 'rahoitusanalyytikko',
        description: 'Rahoitusanalyytikot arvioivat sijoitusmahdollisuuksia, analysoivat talousdataa ja antavat suosituksia auttaakseen yrityksiä ja yksityishenkilöitä tekemään tietoon perustuvia talouspäätöksiä.',
        tips: [
          'Korosta talous- tai kirjanpitotutkintoa',
          'Korosta analyyttisiä taitoja ja talousmallinnuksen kokemusta',
          'Näytä pätevyys talousohjelmistoissa ja -työkaluissa',
          'Sisällytä sertifikaatit kuten CFA tai CPA',
          'Näytä kvantitatiiviset analysointikyvyt'
        ],
        skills: [
          'Talousmallinnus ja -analyysi',
          'Sijoitus tutkimus ja arviointi',
          'Riskinarviointi ja -hallinta',
          'Pätevyys Excelissä ja talousohjelmistoissa',
          'Talousraportointi ja ennusteet',
          'Markkinatutkimus ja trendianalyysi',
          'Esiintymis- ja viestintätaidot'
        ],
        whyGood: [
          'Selkeä rakenne, joka korostaa analyyttistä asiantuntemusta',
          'Korostaa kvantitatiivisia taitoja ja saavutuksia',
          'Näyttää talousanalyysin kokemuksen kehityksen',
          'Näyttää sitoutumisen ammatilliseen kehitykseen',
          'ATS-yhteensopiva muoto talousavainsanoilla'
        ]
      },
      sk: {
        name: 'Finančný Analytik',
        slug: 'financny-analytik',
        description: 'Finanční analytici hodnotia investičné príležitosti, analyzujú finančné údaje a poskytujú odporúčania, aby pomohli firmám a jednotlivcom robiť informované finančné rozhodnutia.',
        tips: [
          'Zdôraznite svoj titul v oblasti financií alebo účtovníctva',
          'Zdôraznite analytické zručnosti a skúsenosti s finančným modelovaním',
          'Ukážte znalosť finančného softvéru a nástrojov',
          'Zahrňte certifikácie ako CFA alebo CPA',
          'Preukážte schopnosti kvantitatívnej analýzy'
        ],
        skills: [
          'Finančné modelovanie a analýza',
          'Investičný výskum a hodnotenie',
          'Hodnotenie a riadenie rizík',
          'Znalosť Excelu a finančného softvéru',
          'Finančné reportovanie a prognózy',
          'Výskum trhu a analýza trendov',
          'Prezentačné a komunikačné zručnosti'
        ],
        whyGood: [
          'Jasná štruktúra zdôrazňujúca analytickú odbornosť',
          'Zdôrazňuje kvantitatívne zručnosti a úspechy',
          'Ukazuje pokrok skúseností s finančnou analýzou',
          'Preukazuje záväzok k profesionálnemu rozvoju',
          'Formát kompatibilný s ATS s finančnými kľúčovými slovami'
        ]
      },
      no: {
        name: 'Finansiell Analytiker',
        slug: 'finansiell-analytiker',
        description: 'Finansielle analytikere vurderer investeringsmuligheter, analyserer finansielle data og gir anbefalinger for å hjelpe bedrifter og enkeltpersoner med å ta informerte finansielle beslutninger.',
        tips: [
          'Fremhev din grad i finans eller regnskap',
          'Fremhev analytiske ferdigheter og erfaring med finansiel modellering',
          'Vis kompetanse med finansiel programvare og verktøy',
          'Inkluder sertifiseringer som CFA eller CPA',
          'Vis kvantitative analyseevner'
        ],
        skills: [
          'Finansiell modellering og analyse',
          'Investeringsforskning og evaluering',
          'Risikovurdering og -styring',
          'Kompetanse i Excel og finansiel programvare',
          'Finansiell rapportering og prognoser',
          'Markedsundersøkelse og trendanalyse',
          'Presentasjons- og kommunikasjonsferdigheter'
        ],
        whyGood: [
          'Tydelig struktur som fremhever analytisk ekspertise',
          'Fremhever kvantitative ferdigheter og prestasjoner',
          'Vis progresjon av erfaring med finansiel analyse',
          'Vis engasjement for profesjonell utvikling',
          'ATS-vennlig format med finansielle nøkkelord'
        ]
      },
      hr: {
        name: 'Financijski Analitičar',
        slug: 'financijski-analiticar',
        description: 'Financijski analitičari procjenjuju investicijske prilike, analiziraju financijske podatke i pružaju preporuke kako bi pomogli poduzećima i pojedincima donositi informirane financijske odluke.',
        tips: [
          'Istaknite svoju diplomu iz financija ili računovodstva',
          'Naglasite analitičke vještine i iskustvo u financijskom modeliranju',
          'Pokažite kompetenciju s financijskim softverom i alatima',
          'Uključite certifikate kao što su CFA ili CPA',
          'Pokažite sposobnosti kvantitativne analize'
        ],
        skills: [
          'Financijsko modeliranje i analiza',
          'Istraživanje i procjena ulaganja',
          'Procjena i upravljanje rizicima',
          'Kompetencija u Excelu i financijskom softveru',
          'Financijsko izvještavanje i prognoze',
          'Istraživanje tržišta i analiza trendova',
          'Prezentacijske i komunikacijske vještine'
        ],
        whyGood: [
          'Jasna struktura koja ističe analitičku stručnost',
          'Naglašava kvantitativne vještine i postignuća',
          'Pokazuje napredak iskustva u financijskoj analizi',
          'Pokazuje predanost profesionalnom razvoju',
          'Format kompatibilan s ATS s financijskim ključnim riječima'
        ]
      },
      sr: {
        name: 'Финансијски Аналитичар',
        slug: 'finansijski-analiticar',
        description: 'Финансијски аналитичари процењују инвестиционе прилике, анализирају финансијске податке и пружају препоруке како би помогли предузећима и појединцима да доносе информисане финансијске одлуке.',
        tips: [
          'Истакните своју диплому из финансија или рачуноводства',
          'Нагласите аналитичке вештине и искуство у финансијском моделовању',
          'Покажите компетенцију са финансијским софтвером и алатима',
          'Укључите сертификате као што су CFA или CPA',
          'Покажите способности квантитативне анализе'
        ],
        skills: [
          'Финансијско моделовање и анализа',
          'Истраживање и процена улагања',
          'Процена и управљање ризицима',
          'Компетенција у Excel-у и финансијском софтверу',
          'Финансијско извештавање и прогнозе',
          'Истраживање тржишта и анализа трендова',
          'Презентационе и комуникационе вештине'
        ],
        whyGood: [
          'Јасна структура која истиче аналитичку стручност',
          'Наглашава квантитативне вештине и достигнућа',
          'Показује напредак искуства у финансијској анализи',
          'Показује посвећеност професионалном развоју',
          'Формат компатибилан са ATS са финансијским кључним речима'
        ]
      }
    }
  },
  // Creative: Photographer
  {
    id: 'photographer',
    category: 'creative',
    translations: {
      en: {
        name: 'Photographer',
        slug: 'photographer',
        description: 'Photographers capture and create images using technical expertise, creativity, and composition skills. They work in various settings including studios, events, commercial shoots, and photojournalism.',
        tips: [
          'Showcase your portfolio with diverse photography styles',
          'Highlight technical skills with cameras, lighting, and editing software',
          'Emphasize experience with different types of photography',
          'Include client work and published pieces',
          'Demonstrate ability to work under pressure and meet deadlines'
        ],
        skills: [
          'Camera operation and photography techniques',
          'Lighting setup and composition',
          'Photo editing software (Photoshop, Lightroom)',
          'Portrait, event, and commercial photography',
          'Color correction and post-processing',
          'Client communication and collaboration',
          'Equipment maintenance and technical knowledge'
        ],
        whyGood: [
          'Clear structure highlighting photography portfolio',
          'Emphasizes technical skills and artistic vision',
          'Shows progression of photography experience',
          'Demonstrates versatility across photography styles',
          'ATS-friendly format with photography keywords'
        ]
      },
      nl: {
        name: 'Fotograaf',
        slug: 'fotograaf',
        description: 'Fotografen maken en creëren beelden met behulp van technische expertise, creativiteit en compositieve vaardigheden. Ze werken in verschillende settings zoals studio\'s, evenementen, commerciële shoots en fotojournalistiek.',
        tips: [
          'Toon je portfolio met diverse fotografiestijlen',
          'Benadruk technische vaardigheden met camera\'s, belichting en bewerkingssoftware',
          'Leg nadruk op ervaring met verschillende soorten fotografie',
          'Vermeld klantwerk en gepubliceerde stukken',
          'Demonstreer vermogen om onder druk te werken en deadlines te halen'
        ],
        skills: [
          'Camerabediening en fotografietechnieken',
          'Belichting setup en compositie',
          'Foto bewerkingssoftware (Photoshop, Lightroom)',
          'Portret-, evenementen- en commerciële fotografie',
          'Kleurcorrectie en nabewerking',
          'Klantcommunicatie en samenwerking',
          'Apparatuuronderhoud en technische kennis'
        ],
        whyGood: [
          'Duidelijke structuur die fotografierepertoire benadrukt',
          'Legt nadruk op technische vaardigheden en artistieke visie',
          'Toont progressie van fotografie-ervaring',
          'Demonstreert veelzijdigheid in fotografiestijlen',
          'ATS-vriendelijk formaat met fotografie trefwoorden'
        ]
      },
      fr: {
        name: 'Photographe',
        slug: 'photographe',
        description: 'Les photographes capturent et créent des images en utilisant l\'expertise technique, la créativité et les compétences en composition. Ils travaillent dans divers contextes, notamment studios, événements, prises de vue commerciales et photojournalisme.',
        tips: [
          'Présentez votre portfolio avec des styles de photographie diversifiés',
          'Mettez en avant les compétences techniques avec les appareils photo, l\'éclairage et les logiciels d\'édition',
          'Soulignez l\'expérience avec différents types de photographie',
          'Incluez le travail client et les pièces publiées',
          'Démontrez la capacité à travailler sous pression et à respecter les délais'
        ],
        skills: [
          'Utilisation de caméras et techniques de photographie',
          'Configuration de l\'éclairage et composition',
          'Logiciels d\'édition photo (Photoshop, Lightroom)',
          'Photographie portrait, événementielle et commerciale',
          'Correction des couleurs et post-traitement',
          'Communication et collaboration avec les clients',
          'Maintenance de l\'équipement et connaissances techniques'
        ],
        whyGood: [
          'Structure claire mettant en évidence le portfolio photographique',
          'Met l\'accent sur les compétences techniques et la vision artistique',
          'Montre la progression de l\'expérience en photographie',
          'Démontre la polyvalence à travers les styles de photographie',
          'Format compatible ATS avec mots-clés de photographie'
        ]
      },
      es: {
        name: 'Fotógrafo',
        slug: 'fotografo',
        description: 'Los fotógrafos capturan y crean imágenes utilizando experiencia técnica, creatividad y habilidades de composición. Trabajan en diversos entornos, incluyendo estudios, eventos, sesiones comerciales y fotoperiodismo.',
        tips: [
          'Muestra tu portafolio con diversos estilos fotográficos',
          'Destaca habilidades técnicas con cámaras, iluminación y software de edición',
          'Enfatiza experiencia con diferentes tipos de fotografía',
          'Incluye trabajo con clientes y piezas publicadas',
          'Demuestra capacidad para trabajar bajo presión y cumplir plazos'
        ],
        skills: [
          'Operación de cámaras y técnicas fotográficas',
          'Configuración de iluminación y composición',
          'Software de edición de fotos (Photoshop, Lightroom)',
          'Fotografía de retrato, eventos y comercial',
          'Corrección de color y postprocesamiento',
          'Comunicación y colaboración con clientes',
          'Mantenimiento de equipos y conocimiento técnico'
        ],
        whyGood: [
          'Estructura clara que destaca portafolio fotográfico',
          'Enfatiza habilidades técnicas y visión artística',
          'Muestra progresión de experiencia en fotografía',
          'Demuestra versatilidad en estilos fotográficos',
          'Formato compatible con ATS con palabras clave de fotografía'
        ]
      },
      de: {
        name: 'Fotograf',
        slug: 'fotograf',
        description: 'Fotografen erfassen und erstellen Bilder mit technischem Fachwissen, Kreativität und Kompositionsfähigkeiten. Sie arbeiten in verschiedenen Umgebungen, einschließlich Studios, Veranstaltungen, kommerziellen Shootings und Fotojournalismus.',
        tips: [
          'Präsentieren Sie Ihr Portfolio mit vielfältigen Fotografiestilen',
          'Heben Sie technische Fähigkeiten mit Kameras, Beleuchtung und Bearbeitungssoftware hervor',
          'Betonen Sie Erfahrung mit verschiedenen Arten der Fotografie',
          'Fügen Sie Kundenarbeit und veröffentlichte Stücke hinzu',
          'Demonstrieren Sie die Fähigkeit, unter Druck zu arbeiten und Fristen einzuhalten'
        ],
        skills: [
          'Kamerabedienung und Fotografietechniken',
          'Beleuchtungsaufbau und Komposition',
          'Foto-Bearbeitungssoftware (Photoshop, Lightroom)',
          'Porträt-, Event- und Werbefotografie',
          'Farbkorrektur und Nachbearbeitung',
          'Kundenkommunikation und Zusammenarbeit',
          'Gerätewartung und technisches Wissen'
        ],
        whyGood: [
          'Klare Struktur, die das Fotografieportfolio hervorhebt',
          'Betont technische Fähigkeiten und künstlerische Vision',
          'Zeigt Fortschritt der Fotografieerfahrung',
          'Demonstriert Vielseitigkeit in Fotografiestilen',
          'ATS-freundliches Format mit Fotografieschlüsselwörtern'
        ]
      },
      it: {
        name: 'Fotografo',
        slug: 'fotografo',
        description: 'I fotografi catturano e creano immagini utilizzando competenze tecniche, creatività e abilità di composizione. Lavorano in vari contesti, inclusi studi, eventi, servizi commerciali e fotogiornalismo.',
        tips: [
          'Mostra il tuo portfolio con stili fotografici diversi',
          'Evidenzia le competenze tecniche con fotocamere, illuminazione e software di editing',
          'Enfatizza l\'esperienza con diversi tipi di fotografia',
          'Includi lavoro con clienti e pezzi pubblicati',
          'Dimostra la capacità di lavorare sotto pressione e rispettare le scadenze'
        ],
        skills: [
          'Utilizzo di fotocamere e tecniche fotografiche',
          'Setup di illuminazione e composizione',
          'Software di editing fotografico (Photoshop, Lightroom)',
          'Fotografia ritrattistica, di eventi e commerciale',
          'Correzione del colore e post-produzione',
          'Comunicazione e collaborazione con i clienti',
          'Manutenzione delle attrezzature e conoscenze tecniche'
        ],
        whyGood: [
          'Struttura chiara che evidenzia il portfolio fotografico',
          'Enfatizza le competenze tecniche e la visione artistica',
          'Mostra la progressione dell\'esperienza fotografica',
          'Dimostra versatilità negli stili fotografici',
          'Formato compatibile con ATS con parole chiave fotografiche'
        ]
      },
      pl: {
        name: 'Fotograf',
        slug: 'fotograf',
        description: 'Fotografowie przechwytują i tworzą obrazy wykorzystując wiedzę techniczną, kreatywność i umiejętności kompozycyjne. Pracują w różnych środowiskach, w tym w studiach, na wydarzeniach, sesjach komercyjnych i fotoreportażach.',
        tips: [
          'Pokaż swoje portfolio z różnorodnymi stylami fotografii',
          'Podkreśl umiejętności techniczne z aparatami, oświetleniem i oprogramowaniem do edycji',
          'Podkreśl doświadczenie z różnymi typami fotografii',
          'Uwzględnij pracę z klientami i opublikowane dzieła',
          'Wykazuj zdolność do pracy pod presją i dotrzymywania terminów'
        ],
        skills: [
          'Obsługa aparatu i techniki fotografii',
          'Konfiguracja oświetlenia i kompozycja',
          'Oprogramowanie do edycji zdjęć (Photoshop, Lightroom)',
          'Fotografia portretowa, wydarzeniowa i komercyjna',
          'Korekta kolorów i postprodukcja',
          'Komunikacja i współpraca z klientami',
          'Konserwacja sprzętu i wiedza techniczna'
        ],
        whyGood: [
          'Jasna struktura podkreślająca portfolio fotograficzne',
          'Kładzie nacisk na umiejętności techniczne i wizję artystyczną',
          'Pokazuje postęp doświadczenia fotograficznego',
          'Wykazuje wszechstronność w stylach fotografii',
          'Format przyjazny dla ATS z kluczowymi słowami fotograficznymi'
        ]
      },
      ro: {
        name: 'Fotograf',
        slug: 'fotograf',
        description: 'Fotografii capturează și creează imagini folosind expertiză tehnică, creativitate și abilități de compoziție. Ei lucrează în diverse medii, inclusiv studiouri, evenimente, ședințe comerciale și fotoreportaj.',
        tips: [
          'Prezintă portofoliul tău cu stiluri diverse de fotografie',
          'Evidențiază abilitățile tehnice cu camere, iluminat și software de editare',
          'Subliniază experiența cu diferite tipuri de fotografie',
          'Include lucrări cu clienți și piese publicate',
          'Demonstrează capacitatea de a lucra sub presiune și de a respecta termenele limită'
        ],
        skills: [
          'Operare cameră și tehnici de fotografie',
          'Configurare iluminat și compoziție',
          'Software de editare foto (Photoshop, Lightroom)',
          'Fotografie portret, eveniment și comercială',
          'Corecție culoare și post-procesare',
          'Comunicare și colaborare cu clienții',
          'Întreținere echipament și cunoștințe tehnice'
        ],
        whyGood: [
          'Structură clară care evidențiază portofoliul fotografic',
          'Subliniază abilitățile tehnice și viziunea artistică',
          'Arată progresia experienței în fotografie',
          'Demonstrează versatilitate în stiluri de fotografie',
          'Format compatibil cu ATS cu cuvinte cheie fotografice'
        ]
      },
      hu: {
        name: 'Fotós',
        slug: 'fotos',
        description: 'A fotósok technikai szakértelem, kreativitás és kompozíciós készségek segítségével készítenek és hoznak létre képeket. Különböző környezetekben dolgoznak, beleértve a stúdiókat, eseményeket, kereskedelmi fotózásokat és fotóriporteri munkát.',
        tips: [
          'Mutassa be portfólióját különböző fotózástechnikai stílusokkal',
          'Hangsúlyozza a technikai készségeket kamerákkal, világítással és szerkesztő szoftverekkel',
          'Kiemeli a különböző típusú fotográfia tapasztalatait',
          'Tartalmazza az ügyfélmunkát és a publikált darabokat',
          'Mutassa be a nyomás alatt való munkavégzés és a határidők betartásának képességét'
        ],
        skills: [
          'Kamera működtetés és fotográfiai technikák',
          'Világítás beállítása és kompozíció',
          'Fotó szerkesztő szoftver (Photoshop, Lightroom)',
          'Portré-, esemény- és kereskedelmi fotográfia',
          'Színkorrekció és utómunka',
          'Ügyfélkommunikáció és együttműködés',
          'Berendezések karbantartása és műszaki tudás'
        ],
        whyGood: [
          'Világos struktúra, amely kiemeli a fotográfiai portfóliót',
          'Hangsúlyozza a technikai készségeket és művészi látásmódot',
          'Mutatja a fotográfiai tapasztalat fejlődését',
          'Bemutatja a sokoldalúságot a fotográfiai stílusokban',
          'ATS-barát formátum fotográfiai kulcsszavakkal'
        ]
      },
      el: {
        name: 'Φωτογράφος',
        slug: 'fotografos',
        description: 'Οι φωτογράφοι καταγράφουν και δημιουργούν εικόνες χρησιμοποιώντας τεχνική εμπειρογνωμοσύνη, δημιουργικότητα και δεξιότητες σύνθεσης. Εργάζονται σε διάφορες ρυθμίσεις, συμπεριλαμβανομένων στούντιο, εκδηλώσεων, εμπορικών λήψεων και φωτορεπορτάζ.',
        tips: [
          'Παρουσιάστε το portfolio σας με διαφορετικά στυλ φωτογραφίας',
          'Επισημάνετε τις τεχνικές δεξιότητες με κάμερες, φωτισμό και λογισμικό επεξεργασίας',
          'Τονίστε την εμπειρία με διαφορετικούς τύπους φωτογραφίας',
          'Συμπεριλάβετε εργασία με πελάτες και δημοσιευμένα έργα',
          'Αποδείξτε την ικανότητα εργασίας υπό πίεση και συμμόρφωσης με προθεσμίες'
        ],
        skills: [
          'Λειτουργία κάμερας και τεχνικές φωτογραφίας',
          'Ρύθμιση φωτισμού και σύνθεση',
          'Λογισμικό επεξεργασίας φωτογραφιών (Photoshop, Lightroom)',
          'Πορτρέτο, εκδηλώσεις και εμπορική φωτογραφία',
          'Διόρθωση χρώματος και μετα-επεξεργασία',
          'Επικοινωνία και συνεργασία με πελάτες',
          'Συντήρηση εξοπλισμού και τεχνικές γνώσεις'
        ],
        whyGood: [
          'Σαφής δομή που επισημαίνει το portfolio φωτογραφίας',
          'Τονίζει τις τεχνικές δεξιότητες και καλλιτεχνική όραση',
          'Δείχνει την πρόοδο της εμπειρίας φωτογραφίας',
          'Αποδεικνύει ευελιξία σε στυλ φωτογραφίας',
          'Μορφή συμβατή με ATS με λέξεις-κλειδιά φωτογραφίας'
        ]
      },
      cs: {
        name: 'Fotograf',
        slug: 'fotograf',
        description: 'Fotografové zachycují a vytvářejí obrazy pomocí technické odbornosti, kreativity a kompozičních dovedností. Pracují v různých prostředích, včetně studií, akcí, komerčních focení a fotoreportáží.',
        tips: [
          'Předveďte své portfolio s různorodými fotografickými styly',
          'Zdůrazněte technické dovednosti s fotoaparáty, osvětlením a editačním softwarem',
          'Zdůrazněte zkušenosti s různými typy fotografie',
          'Zahrňte práci s klienty a publikované práce',
          'Prokažte schopnost pracovat pod tlakem a dodržovat termíny'
        ],
        skills: [
          'Provoz fotoaparátu a fotografické techniky',
          'Nastavení osvětlení a kompozice',
          'Software pro úpravu fotek (Photoshop, Lightroom)',
          'Portrétní, akční a komerční fotografie',
          'Korekce barev a postprodukce',
          'Komunikace a spolupráce s klienty',
          'Údržba zařízení a technické znalosti'
        ],
        whyGood: [
          'Jasná struktura zdůrazňující fotografické portfolio',
          'Zdůrazňuje technické dovednosti a uměleckou vizi',
          'Ukazuje pokrok fotografických zkušeností',
          'Prokazuje všestrannost ve fotografických stylech',
          'Formát kompatibilní s ATS s fotografickými klíčovými slovy'
        ]
      },
      pt: {
        name: 'Fotógrafo',
        slug: 'fotografo',
        description: 'Fotógrafos capturam e criam imagens usando experiência técnica, criatividade e habilidades de composição. Trabalham em diversos ambientes, incluindo estúdios, eventos, sessões comerciais e fotojornalismo.',
        tips: [
          'Mostre seu portfólio com diversos estilos fotográficos',
          'Destaque habilidades técnicas com câmeras, iluminação e software de edição',
          'Enfatize experiência com diferentes tipos de fotografia',
          'Inclua trabalho com clientes e peças publicadas',
          'Demonstre capacidade de trabalhar sob pressão e cumprir prazos'
        ],
        skills: [
          'Operação de câmeras e técnicas fotográficas',
          'Configuração de iluminação e composição',
          'Software de edição de fotos (Photoshop, Lightroom)',
          'Fotografia de retrato, eventos e comercial',
          'Correção de cor e pós-processamento',
          'Comunicação e colaboração com clientes',
          'Manutenção de equipamentos e conhecimento técnico'
        ],
        whyGood: [
          'Estrutura clara destacando portfólio fotográfico',
          'Enfatiza habilidades técnicas e visão artística',
          'Mostra progressão de experiência em fotografia',
          'Demonstra versatilidade em estilos fotográficos',
          'Formato compatível com ATS com palavras-chave fotográficas'
        ]
      },
      sv: {
        name: 'Fotograf',
        slug: 'fotograf',
        description: 'Fotografer fångar och skapar bilder med hjälp av teknisk expertis, kreativitet och kompositionsfärdigheter. De arbetar i olika miljöer, inklusive studior, evenemang, kommersiella fotograferingar och fotoreportage.',
        tips: [
          'Visa ditt portfolio med olika fotografiska stilar',
          'Framhäv tekniska färdigheter med kameror, belysning och redigeringsprogram',
          'Betona erfarenhet med olika typer av fotografering',
          'Inkludera kundarbete och publicerade verk',
          'Visa förmåga att arbeta under press och möta deadlines'
        ],
        skills: [
          'Kamerahantering och fotografitekniker',
          'Belysningssetup och komposition',
          'Fotoredigeringsprogram (Photoshop, Lightroom)',
          'Porträtt-, evenemang- och kommersiell fotografering',
          'Färgkorrigering och efterbehandling',
          'Kundkommunikation och samarbete',
          'Utrustningsunderhåll och teknisk kunskap'
        ],
        whyGood: [
          'Tydlig struktur som framhäver fotografiskt portfolio',
          'Betonar tekniska färdigheter och artistisk vision',
          'Visar progression av fotografierfarenhet',
          'Visar mångsidighet inom fotografiska stilar',
          'ATS-vänligt format med fotografiska nyckelord'
        ]
      },
      bg: {
        name: 'Фотограф',
        slug: 'fotograf',
        description: 'Фотографите заснемат и създават изображения, използвайки техническа експертиза, творчество и умения за композиция. Те работят в различни среди, включително студиа, събития, търговски снимки и фоторепортаж.',
        tips: [
          'Покажете портфолиото си с различни фотографски стилове',
          'Подчертайте техническите умения с камери, осветление и софтуер за редактиране',
          'Акцентирайте върху опита с различни видове фотография',
          'Включете работа с клиенти и публикувани произведения',
          'Демонстрирайте способност за работа под налягане и спазване на срокове'
        ],
        skills: [
          'Експлоатация на камера и фотографски техники',
          'Настройка на осветление и композиция',
          'Софтуер за редактиране на снимки (Photoshop, Lightroom)',
          'Портретна, събитийна и търговска фотография',
          'Корекция на цветове и постобработка',
          'Комуникация и сътрудничество с клиенти',
          'Поддръжка на оборудване и технически знания'
        ],
        whyGood: [
          'Ясна структура, която подчертава фотографското портфолио',
          'Акцентира върху техническите умения и художествената визия',
          'Показва прогресия на фотографския опит',
          'Демонстрира гъвкавост в фотографските стилове',
          'Формат, съвместим с ATS с фотографски ключови думи'
        ]
      },
      da: {
        name: 'Fotograf',
        slug: 'fotograf',
        description: 'Fotografer fanger og skaber billeder ved hjælp af teknisk ekspertise, kreativitet og kompositionsfærdigheder. De arbejder i forskellige miljøer, herunder studier, begivenheder, kommercielle fotograferinger og fotoreportage.',
        tips: [
          'Præsenter dit portfolio med forskellige fotografiske stilarter',
          'Fremhæv tekniske færdigheder med kameraer, belysning og redigeringssoftware',
          'Fremhæv erfaring med forskellige typer fotografering',
          'Inkluder kundearbejde og publicerede værker',
          'Vis evne til at arbejde under pres og overholde deadlines'
        ],
        skills: [
          'Kamerabediening og fotografitekniker',
          'Belysningsopsætning og komposition',
          'Foto redigeringssoftware (Photoshop, Lightroom)',
          'Portræt-, begivenheds- og kommerciel fotografering',
          'Farvekorrektion og efterbehandling',
          'Kundekommunikation og samarbejde',
          'Udstyr vedligeholdelse og teknisk viden'
        ],
        whyGood: [
          'Tydelig struktur, der fremhæver fotografisk portfolio',
          'Fremhæver tekniske færdigheder og kunstnerisk vision',
          'Vis progression af fotografierfaring',
          'Vis alsidighed på tværs af fotografiske stilarter',
          'ATS-venligt format med fotografiske nøgleord'
        ]
      },
      fi: {
        name: 'Valokuvaaja',
        slug: 'valokuvaaja',
        description: 'Valokuvaajat tallentavat ja luovat kuvia käyttäen teknistä asiantuntemusta, luovuutta ja sommittelutaitoja. He työskentelevät eri ympäristöissä, mukaan lukien studiot, tapahtumat, kaupalliset kuvaukset ja valokuvajournalismi.',
        tips: [
          'Näytä portfolio erilaisilla valokuvaus tyyleillä',
          'Korosta tekniset taidot kameroiden, valaistuksen ja muokkausohjelmien kanssa',
          'Korosta kokemusta erilaisista valokuvaus tyypeistä',
          'Sisällytä asiakastyö ja julkaistut teokset',
          'Näytä kyky työskennellä paineen alla ja täyttää määräajat'
        ],
        skills: [
          'Kameran käyttö ja valokuvaus tekniikat',
          'Valaistus asennus ja sommittelu',
          'Valokuvien muokkausohjelmistot (Photoshop, Lightroom)',
          'Muotokuva-, tapahtuma- ja kaupallinen valokuvaus',
          'Värikorjaus ja jälkikäsittely',
          'Asiakasviestintä ja yhteistyö',
          'Laitteiston ylläpito ja tekninen tieto'
        ],
        whyGood: [
          'Selkeä rakenne, joka korostaa valokuvausportfoliota',
          'Korostaa tekniset taidot ja taiteellisen näkemyksen',
          'Näyttää valokuvauskokemuksen kehityksen',
          'Näyttää monipuolisuutta valokuvaus tyyleissä',
          'ATS-yhteensopiva muoto valokuvausavainsanoilla'
        ]
      },
      sk: {
        name: 'Fotograf',
        slug: 'fotograf',
        description: 'Fotografi zachytávajú a vytvárajú obrazy pomocou technickej odbornosti, kreativity a kompozičných zručností. Pracujú v rôznych prostrediach, vrátane štúdií, akcií, komerčných fotografií a fotoreportáží.',
        tips: [
          'Ukážte svoje portfolio s rôznorodými fotografickými štýlmi',
          'Zdôraznite technické zručnosti s fotoaparátmi, osvetlením a editačným softvérom',
          'Zdôraznite skúsenosti s rôznymi typmi fotografie',
          'Zahrňte prácu s klientmi a publikované diela',
          'Preukážte schopnosť pracovať pod tlakom a dodržiavať termíny'
        ],
        skills: [
          'Prevádzka fotoaparátu a fotografické techniky',
          'Nastavenie osvetlenia a kompozícia',
          'Softvér na úpravu fotografií (Photoshop, Lightroom)',
          'Portrétna, akčná a komerčná fotografia',
          'Korekcia farieb a postprodukcia',
          'Komunikácia a spolupráca s klientmi',
          'Údržba zariadení a technické znalosti'
        ],
        whyGood: [
          'Jasná štruktúra zdôrazňujúca fotografické portfolio',
          'Zdôrazňuje technické zručnosti a umeleckú víziu',
          'Ukazuje pokrok fotografických skúseností',
          'Preukazuje všestrannosť vo fotografických štýloch',
          'Formát kompatibilný s ATS s fotografickými kľúčovými slovami'
        ]
      },
      no: {
        name: 'Fotograf',
        slug: 'fotograf',
        description: 'Fotografer fanger og skaper bilder ved hjelp av teknisk ekspertise, kreativitet og komposisjonsferdigheter. De arbeider i ulike miljøer, inkludert studier, arrangementer, kommersielle fotograferinger og fotoreportasje.',
        tips: [
          'Vis porteføljen din med ulike fotografiske stilarter',
          'Fremhev tekniske ferdigheter med kameraer, belysning og redigeringsprogramvare',
          'Fremhev erfaring med ulike typer fotografering',
          'Inkluder kundearbeid og publiserte verk',
          'Vis evne til å arbeide under press og overholde frister'
        ],
        skills: [
          'Kamerabruk og fotografiteknikker',
          'Belysningsoppsett og komposisjon',
          'Foto redigeringsprogramvare (Photoshop, Lightroom)',
          'Portrett-, arrangement- og kommersiell fotografering',
          'Fargekorrigering og etterbehandling',
          'Kundekommunikasjon og samarbeid',
          'Utstyr vedlikehold og teknisk kunnskap'
        ],
        whyGood: [
          'Tydelig struktur som fremhever fotografisk portefølje',
          'Fremhever tekniske ferdigheter og kunstnerisk visjon',
          'Vis progresjon av fotografierfaring',
          'Vis alsidighet på tvers av fotografiske stilarter',
          'ATS-vennlig format med fotografiske nøkkelord'
        ]
      },
      hr: {
        name: 'Fotograf',
        slug: 'fotograf',
        description: 'Fotografi snimaju i stvaraju slike koristeći tehničku stručnost, kreativnost i vještine kompozicije. Rade u različitim okruženjima, uključujući studije, događaje, komercijalne snimanja i foto novinarstvo.',
        tips: [
          'Pokažite svoj portfolio s različitim fotografskim stilovima',
          'Naglasite tehničke vještine s kamerama, osvjetljenjem i softverom za uređivanje',
          'Naglasite iskustvo s različitim vrstama fotografije',
          'Uključite rad s klijentima i objavljena djela',
          'Pokažite sposobnost rada pod pritiskom i poštivanja rokova'
        ],
        skills: [
          'Rad s kamerom i fotografiske tehnike',
          'Postavljanje osvjetljenja i kompozicija',
          'Softver za uređivanje fotografija (Photoshop, Lightroom)',
          'Portretna, događajna i komercijalna fotografija',
          'Korekcija boja i post-produkcija',
          'Komunikacija i suradnja s klijentima',
          'Održavanje opreme i tehnička znanja'
        ],
        whyGood: [
          'Jasna struktura koja ističe fotografski portfolio',
          'Naglašava tehničke vještine i umjetničku viziju',
          'Pokazuje napredak fotografskog iskustva',
          'Pokazuje svestranost u fotografskim stilovima',
          'Format kompatibilan s ATS s fotografskim ključnim riječima'
        ]
      },
      sr: {
        name: 'Фотограф',
        slug: 'fotograf',
        description: 'Фотографи снимају и стварају слике користећи техничку стручност, креативност и вештине композиције. Раде у различитим окружењима, укључујући студије, догађаје, комерцијалне снимке и фото новинарство.',
        tips: [
          'Покажите свој портфолио са различитим фотографским стиловима',
          'Нагласите техничке вештине са камерама, осветљењем и софтвером за уређивање',
          'Нагласите искуство са различитим врстама фотографије',
          'Укључите рад са клијентима и објављена дела',
          'Покажите способност рада под притиском и поштовања рокова'
        ],
        skills: [
          'Рад са камером и фотографске технике',
          'Постављање осветљења и композиција',
          'Софтвер за уређивање фотографија (Photoshop, Lightroom)',
          'Портретна, догађајна и комерцијална фотографија',
          'Корекција боја и пост-продукција',
          'Комуникација и сарадња са клијентима',
          'Одржавање опреме и техничка знања'
        ],
        whyGood: [
          'Јасна структура која истиче фотографски портфолио',
          'Наглашава техничке вештине и уметничку визију',
          'Показује напредак фотографског искуства',
          'Показује свестраност у фотографским стиловима',
          'Формат компатибилан са ATS са фотографским кључним речима'
        ]
      }
    }
  },
  // Creative: Copywriter
  {
    id: 'copywriter',
    category: 'creative',
    translations: {
      en: {
        name: 'Copywriter',
        slug: 'copywriter',
        description: 'Copywriters create written content for advertising, marketing, and promotional materials. They craft compelling messages that persuade audiences and drive action across various media channels.',
        tips: [
          'Showcase your portfolio with diverse writing samples',
          'Highlight experience with different industries and audiences',
          'Emphasize ability to write for multiple formats (web, print, social media)',
          'Include examples of successful campaigns and conversions',
          'Demonstrate understanding of SEO and content marketing'
        ],
        skills: [
          'Content writing and copywriting',
          'SEO optimization and keyword research',
          'Brand voice and tone development',
          'Marketing campaign development',
          'Social media content creation',
          'Email marketing and newsletters',
          'Editing and proofreading'
        ],
        whyGood: [
          'Clear structure highlighting writing portfolio',
          'Emphasizes versatility across writing formats',
          'Shows progression of copywriting experience',
          'Demonstrates understanding of marketing principles',
          'ATS-friendly format with writing and marketing keywords'
        ]
      },
      nl: {
        name: 'Copywriter',
        slug: 'copywriter',
        description: 'Copywriters creëren geschreven inhoud voor advertenties, marketing en promotiemateriaal. Ze maken overtuigende berichten die doelgroepen overtuigen en actie stimuleren via verschillende mediakanalen.',
        tips: [
          'Toon je portfolio met diverse schrijfsamples',
          'Benadruk ervaring met verschillende industrieën en doelgroepen',
          'Leg nadruk op vaardigheid om voor meerdere formaten te schrijven (web, print, sociale media)',
          'Vermeld voorbeelden van succesvolle campagnes en conversies',
          'Demonstreer begrip van SEO en contentmarketing'
        ],
        skills: [
          'Content writing en copywriting',
          'SEO optimalisatie en zoekwoordonderzoek',
          'Merkenstem en toonontwikkeling',
          'Marketingcampagneontwikkeling',
          'Sociale mediacontentcreatie',
          'E-mailmarketing en nieuwsbrieven',
          'Redigeren en proeflezen'
        ],
        whyGood: [
          'Duidelijke structuur die schrijfportfolio benadrukt',
          'Legt nadruk op veelzijdigheid in schrijfformaten',
          'Toont progressie van copywriting-ervaring',
          'Demonstreert begrip van marketingprincipes',
          'ATS-vriendelijk formaat met schrijf- en marketingtrefwoorden'
        ]
      },
      fr: {
        name: 'Rédacteur Publicitaire',
        slug: 'redacteur-publicitaire',
        description: 'Les rédacteurs publicitaires créent du contenu écrit pour la publicité, le marketing et les matériaux promotionnels. Ils rédigent des messages convaincants qui persuadent les audiences et incitent à l\'action sur divers canaux médiatiques.',
        tips: [
          'Présentez votre portfolio avec des échantillons d\'écriture diversifiés',
          'Mettez en avant l\'expérience avec différentes industries et audiences',
          'Soulignez la capacité à écrire pour plusieurs formats (web, print, médias sociaux)',
          'Incluez des exemples de campagnes et conversions réussies',
          'Démontrez la compréhension du SEO et du marketing de contenu'
        ],
        skills: [
          'Rédaction de contenu et copywriting',
          'Optimisation SEO et recherche de mots-clés',
          'Développement de la voix et du ton de marque',
          'Développement de campagnes marketing',
          'Création de contenu pour médias sociaux',
          'Marketing par email et newsletters',
          'Édition et relecture'
        ],
        whyGood: [
          'Structure claire mettant en évidence le portfolio d\'écriture',
          'Met l\'accent sur la polyvalence à travers les formats d\'écriture',
          'Montre la progression de l\'expérience en copywriting',
          'Démontre la compréhension des principes marketing',
          'Format compatible ATS avec mots-clés d\'écriture et marketing'
        ]
      },
      es: {
        name: 'Redactor Publicitario',
        slug: 'redactor-publicitario',
        description: 'Los redactores publicitarios crean contenido escrito para publicidad, marketing y materiales promocionales. Elaboran mensajes convincentes que persuaden a las audiencias y generan acción a través de diversos canales de medios.',
        tips: [
          'Muestra tu portafolio con muestras de escritura diversas',
          'Destaca experiencia con diferentes industrias y audiencias',
          'Enfatiza capacidad para escribir para múltiples formatos (web, impresión, redes sociales)',
          'Incluye ejemplos de campañas exitosas y conversiones',
          'Demuestra comprensión de SEO y marketing de contenido'
        ],
        skills: [
          'Redacción de contenido y copywriting',
          'Optimización SEO e investigación de palabras clave',
          'Desarrollo de voz y tono de marca',
          'Desarrollo de campañas de marketing',
          'Creación de contenido para redes sociales',
          'Marketing por email y newsletters',
          'Edición y corrección de pruebas'
        ],
        whyGood: [
          'Estructura clara que destaca portafolio de escritura',
          'Enfatiza versatilidad en formatos de escritura',
          'Muestra progresión de experiencia en copywriting',
          'Demuestra comprensión de principios de marketing',
          'Formato compatible con ATS con palabras clave de escritura y marketing'
        ]
      },
      de: {
        name: 'Werbetexter',
        slug: 'werbetexter',
        description: 'Werbetexter erstellen geschriebene Inhalte für Werbung, Marketing und Werbematerialien. Sie verfassen überzeugende Botschaften, die Zielgruppen überzeugen und Handlungen über verschiedene Medienkanäle auslösen.',
        tips: [
          'Präsentieren Sie Ihr Portfolio mit vielfältigen Schreibproben',
          'Heben Sie Erfahrung mit verschiedenen Branchen und Zielgruppen hervor',
          'Betonen Sie die Fähigkeit, für mehrere Formate zu schreiben (Web, Print, soziale Medien)',
          'Fügen Sie Beispiele erfolgreicher Kampagnen und Konversionen hinzu',
          'Demonstrieren Sie Verständnis für SEO und Content-Marketing'
        ],
        skills: [
          'Content-Schreiben und Copywriting',
          'SEO-Optimierung und Keyword-Recherche',
          'Markenstimme und Tonentwicklung',
          'Marketingkampagnenentwicklung',
          'Social-Media-Content-Erstellung',
          'E-Mail-Marketing und Newsletter',
          'Bearbeitung und Korrekturlesen'
        ],
        whyGood: [
          'Klare Struktur, die das Schreibportfolio hervorhebt',
          'Betont Vielseitigkeit in Schreibformaten',
          'Zeigt Fortschritt der Copywriting-Erfahrung',
          'Demonstriert Verständnis für Marketingprinzipien',
          'ATS-freundliches Format mit Schreib- und Marketing-Schlüsselwörtern'
        ]
      },
      it: {
        name: 'Copywriter',
        slug: 'copywriter',
        description: 'I copywriter creano contenuti scritti per pubblicità, marketing e materiali promozionali. Creano messaggi convincenti che persuadono il pubblico e stimolano l\'azione attraverso vari canali multimediali.',
        tips: [
          'Mostra il tuo portfolio con campioni di scrittura diversi',
          'Evidenzia esperienza con diverse industrie e pubblici',
          'Enfatizza la capacità di scrivere per più formati (web, stampa, social media)',
          'Includi esempi di campagne di successo e conversioni',
          'Dimostra comprensione di SEO e content marketing'
        ],
        skills: [
          'Scrittura di contenuti e copywriting',
          'Ottimizzazione SEO e ricerca di parole chiave',
          'Sviluppo della voce e del tono del brand',
          'Sviluppo di campagne di marketing',
          'Creazione di contenuti per social media',
          'Email marketing e newsletter',
          'Editing e correzione di bozze'
        ],
        whyGood: [
          'Struttura chiara che evidenzia il portfolio di scrittura',
          'Enfatizza la versatilità nei formati di scrittura',
          'Mostra la progressione dell\'esperienza di copywriting',
          'Dimostra comprensione dei principi di marketing',
          'Formato compatibile con ATS con parole chiave di scrittura e marketing'
        ]
      },
      pl: {
        name: 'Copywriter',
        slug: 'copywriter',
        description: 'Copywriterzy tworzą treści pisane do reklam, marketingu i materiałów promocyjnych. Tworzą przekonujące wiadomości, które przekonują odbiorców i skłaniają do działania w różnych kanałach medialnych.',
        tips: [
          'Pokaż swoje portfolio z różnorodnymi próbkami pisania',
          'Podkreśl doświadczenie z różnymi branżami i odbiorcami',
          'Podkreśl zdolność pisania dla wielu formatów (web, druk, media społecznościowe)',
          'Uwzględnij przykłady udanych kampanii i konwersji',
          'Wykazuj zrozumienie SEO i marketingu treści'
        ],
        skills: [
          'Pisanie treści i copywriting',
          'Optymalizacja SEO i badania słów kluczowych',
          'Rozwój głosu i tonu marki',
          'Rozwój kampanii marketingowych',
          'Tworzenie treści w mediach społecznościowych',
          'Marketing e-mailowy i biuletyny',
          'Edycja i korekta'
        ],
        whyGood: [
          'Jasna struktura podkreślająca portfolio pisarskie',
          'Kładzie nacisk na wszechstronność w formatach pisania',
          'Pokazuje postęp doświadczenia w copywritingu',
          'Wykazuje zrozumienie zasad marketingu',
          'Format przyjazny dla ATS z kluczowymi słowami pisania i marketingu'
        ]
      },
      ro: {
        name: 'Copywriter',
        slug: 'copywriter',
        description: 'Copywriterii creează conținut scris pentru publicitate, marketing și materiale promoționale. Ei creează mesaje convingătoare care conving audiențele și generează acțiune în diverse canale media.',
        tips: [
          'Prezintă portofoliul tău cu mostre de scriere diverse',
          'Evidențiază experiența cu diferite industrii și audiențe',
          'Subliniază capacitatea de a scrie pentru multiple formate (web, print, social media)',
          'Include exemple de campanii de succes și conversii',
          'Demonstrează înțelegerea SEO și marketingului de conținut'
        ],
        skills: [
          'Scrierea de conținut și copywriting',
          'Optimizarea SEO și cercetarea cuvintelor cheie',
          'Dezvoltarea vocii și tonului mărcii',
          'Dezvoltarea campaniilor de marketing',
          'Crearea de conținut pentru social media',
          'Marketing prin email și newslettere',
          'Editare și corectare'
        ],
        whyGood: [
          'Structură clară care evidențiază portofoliul de scriere',
          'Subliniază versatilitatea în formatele de scriere',
          'Arată progresia experienței în copywriting',
          'Demonstrează înțelegerea principiilor de marketing',
          'Format compatibil cu ATS cu cuvinte cheie de scriere și marketing'
        ]
      },
      hu: {
        name: 'Copywriter',
        slug: 'copywriter',
        description: 'A copywriterek írott tartalmat hoznak létre reklámokhoz, marketinghez és promóciós anyagokhoz. Meggyőző üzeneteket készítenek, amelyek meggyőzik a közönséget és cselekvést váltanak ki különböző média csatornákon.',
        tips: [
          'Mutassa be portfólióját különböző írásmintákkal',
          'Hangsúlyozza a különböző iparágakkal és közönségekkel szerzett tapasztalatokat',
          'Kiemeli a több formátumhoz (web, nyomtatás, közösségi média) való írási képességet',
          'Tartalmazza a sikeres kampányok és konverziók példáit',
          'Mutassa be a SEO és tartalommarketing megértését'
        ],
        skills: [
          'Tartalomírás és copywriting',
          'SEO optimalizálás és kulcsszó kutatás',
          'Márka hang és tónus fejlesztés',
          'Marketingkampány fejlesztés',
          'Közösségi média tartalom létrehozás',
          'E-mail marketing és hírlevelek',
          'Szerkesztés és korrektorlás'
        ],
        whyGood: [
          'Világos struktúra, amely kiemeli az írási portfóliót',
          'Hangsúlyozza a sokoldalúságot az írási formátumokban',
          'Mutatja a copywriting tapasztalat fejlődését',
          'Bemutatja a marketing elveinek megértését',
          'ATS-barát formátum írási és marketingkulcsszavakkal'
        ]
      },
      el: {
        name: 'Συγγραφέας Διαφημίσεων',
        slug: 'syggrafeas-diafimiseon',
        description: 'Οι συγγραφείς διαφημίσεων δημιουργούν γραπτό περιεχόμενο για διαφημίσεις, μάρκετινγκ και προωθητικά υλικά. Δημιουργούν πειστικά μηνύματα που πείθουν το κοινό και προκαλούν δράση σε διάφορα κανάλια μέσων.',
        tips: [
          'Παρουσιάστε το portfolio σας με διάφορα δείγματα γραφής',
          'Επισημάνετε την εμπειρία με διαφορετικές βιομηχανίες και κοινά',
          'Τονίστε την ικανότητα γραφής για πολλαπλές μορφές (web, εκτύπωση, κοινωνικά μέσα)',
          'Συμπεριλάβετε παραδείγματα επιτυχημένων καμπανιών και μετατροπών',
          'Αποδείξτε κατανόηση SEO και μάρκετινγκ περιεχομένου'
        ],
        skills: [
          'Γραφή περιεχομένου και copywriting',
          'Βελτιστοποίηση SEO και έρευνα λέξεων-κλειδιά',
          'Ανάπτυξη φωνής και τόνου μάρκας',
          'Ανάπτυξη καμπανιών μάρκετινγκ',
          'Δημιουργία περιεχομένου κοινωνικών μέσων',
          'Μάρκετινγκ email και ενημερωτικά δελτία',
          'Επεξεργασία και προεκτυπωτική διόρθωση'
        ],
        whyGood: [
          'Σαφής δομή που επισημαίνει το portfolio γραφής',
          'Τονίζει την ευελιξία στις μορφές γραφής',
          'Δείχνει την πρόοδο της εμπειρίας copywriting',
          'Αποδεικνύει κατανόηση των αρχών μάρκετινγκ',
          'Μορφή συμβατή με ATS με λέξεις-κλειδιά γραφής και μάρκετινγκ'
        ]
      },
      cs: {
        name: 'Copywriter',
        slug: 'copywriter',
        description: 'Copywriteři vytvářejí psaný obsah pro reklamu, marketing a propagační materiály. Vytvářejí přesvědčivé zprávy, které přesvědčují publikum a vyvolávají akci napříč různými mediálními kanály.',
        tips: [
          'Předveďte své portfolio s různorodými vzorky psaní',
          'Zdůrazněte zkušenosti s různými odvětvími a publikem',
          'Zdůrazněte schopnost psát pro více formátů (web, tisk, sociální média)',
          'Zahrňte příklady úspěšných kampaní a konverzí',
          'Prokažte porozumění SEO a content marketingu'
        ],
        skills: [
          'Psaní obsahu a copywriting',
          'SEO optimalizace a výzkum klíčových slov',
          'Vývoj hlasu a tónu značky',
          'Vývoj marketingových kampaní',
          'Tvorba obsahu pro sociální média',
          'Emailový marketing a newsletter',
          'Editace a korektura'
        ],
        whyGood: [
          'Jasná struktura zdůrazňující portfolio psaní',
          'Zdůrazňuje všestrannost ve formátech psaní',
          'Ukazuje pokrok zkušeností s copywritingem',
          'Prokazuje porozumění marketingovým principům',
          'Formát kompatibilní s ATS s klíčovými slovy psaní a marketingu'
        ]
      },
      pt: {
        name: 'Redator Publicitário',
        slug: 'redator-publicitario',
        description: 'Redatores publicitários criam conteúdo escrito para publicidade, marketing e materiais promocionais. Elaboram mensagens convincentes que persuadem audiências e geram ação em diversos canais de mídia.',
        tips: [
          'Mostre seu portfólio com amostras de escrita diversas',
          'Destaque experiência com diferentes indústrias e audiências',
          'Enfatize capacidade de escrever para múltiplos formatos (web, impresso, redes sociais)',
          'Inclua exemplos de campanhas bem-sucedidas e conversões',
          'Demonstre compreensão de SEO e marketing de conteúdo'
        ],
        skills: [
          'Escrita de conteúdo e copywriting',
          'Otimização SEO e pesquisa de palavras-chave',
          'Desenvolvimento de voz e tom da marca',
          'Desenvolvimento de campanhas de marketing',
          'Criação de conteúdo para redes sociais',
          'Marketing por email e newsletters',
          'Edição e revisão'
        ],
        whyGood: [
          'Estrutura clara destacando portfólio de escrita',
          'Enfatiza versatilidade em formatos de escrita',
          'Mostra progressão de experiência em copywriting',
          'Demonstra compreensão de princípios de marketing',
          'Formato compatível com ATS com palavras-chave de escrita e marketing'
        ]
      },
      sv: {
        name: 'Textförfattare',
        slug: 'textforfattare',
        description: 'Textförfattare skapar skriftligt innehåll för reklam, marknadsföring och marknadsföringsmaterial. De skapar övertygande meddelanden som övertalar publik och driver handling på olika mediefkanaler.',
        tips: [
          'Visa ditt portfolio med olika skrivprover',
          'Framhäv erfarenhet med olika branscher och målgrupper',
          'Betona förmåga att skriva för flera format (webb, tryck, sociala medier)',
          'Inkludera exempel på framgångsrika kampanjer och konverteringar',
          'Visa förståelse för SEO och content marketing'
        ],
        skills: [
          'Innehållsskrivande och copywriting',
          'SEO-optimering och nyckelordsforskning',
          'Varumärkesröst och tonutveckling',
          'Marknadsföringskampanjutveckling',
          'Skapande av innehåll för sociala medier',
          'E-postmarknadsföring och nyhetsbrev',
          'Redigering och korrekturläsning'
        ],
        whyGood: [
          'Tydlig struktur som framhäver skrivportfolio',
          'Betonar mångsidighet i skrivformat',
          'Visar progression av copywritingerfarenhet',
          'Visar förståelse för marknadsföringsprinciper',
          'ATS-vänligt format med nyckelord för skrivande och marknadsföring'
        ]
      },
      bg: {
        name: 'Копирайтър',
        slug: 'kopiraitur',
        description: 'Копирайтърите създават писмено съдържание за реклама, маркетинг и промоционални материали. Те съставят убедителни съобщения, които убеждават аудиториите и стимулират действия в различни медийни канали.',
        tips: [
          'Покажете портфолиото си с различни примерки за писане',
          'Подчертайте опита с различни индустрии и аудитории',
          'Акцентирайте върху способността да пишете за множество формати (уеб, печат, социални медии)',
          'Включете примери за успешни кампании и конверсии',
          'Демонстрирайте разбиране на SEO и маркетинг на съдържание'
        ],
        skills: [
          'Писане на съдържание и копирайтинг',
          'SEO оптимизация и изследване на ключови думи',
          'Развитие на глас и тон на марка',
          'Развитие на маркетингови кампании',
          'Създаване на съдържание за социални медии',
          'Имейл маркетинг и информационни бюлетини',
          'Редактиране и корекция'
        ],
        whyGood: [
          'Ясна структура, която подчертава портфолио за писане',
          'Акцентира върху гъвкавостта във форматите за писане',
          'Показва прогресия на опита с копирайтинг',
          'Демонстрира разбиране на маркетинговите принципи',
          'Формат, съвместим с ATS с ключови думи за писане и маркетинг'
        ]
      },
      da: {
        name: 'Copywriter',
        slug: 'copywriter',
        description: 'Copywriters skaber skriftligt indhold til reklamer, markedsføring og promotionsmaterialer. De skaber overbevisende beskeder, der overtaler målgrupper og driver handling på tværs af forskellige mediekanaler.',
        tips: [
          'Præsenter dit portfolio med forskellige skrivprøver',
          'Fremhæv erfaring med forskellige brancher og målgrupper',
          'Fremhæv evne til at skrive for flere formater (web, print, sociale medier)',
          'Inkluder eksempler på succesfulde kampagner og konverteringer',
          'Vis forståelse af SEO og content marketing'
        ],
        skills: [
          'Indholdsskrivning og copywriting',
          'SEO-optimering og nøgleordsforskning',
          'Brandstem og toneudvikling',
          'Marketingkampagneudvikling',
          'Oprettelse af indhold til sociale medier',
          'E-mailmarketing og nyhedsbreve',
          'Redigering og korrekturlæsning'
        ],
        whyGood: [
          'Tydelig struktur, der fremhæver skriveportfolio',
          'Fremhæver alsidighed på tværs af skriveformater',
          'Vis progression af copywritingerfaring',
          'Vis forståelse af marketingprincipper',
          'ATS-venligt format med nøgleord til skrivning og markedsføring'
        ]
      },
      fi: {
        name: 'Copywriter',
        slug: 'copywriter',
        description: 'Copywriterit luovat kirjoitettua sisältöä mainontaan, markkinointiin ja markkinointimateriaaleihin. He luovat vakuuttavia viestejä, jotka vakuuttavat yleisön ja herättävät toimintaa eri media kanavilla.',
        tips: [
          'Näytä portfolio erilaisilla kirjoitusesimerkeillä',
          'Korosta kokemusta eri aloilla ja yleisöillä',
          'Korosta kykyä kirjoittaa useille muodoille (web, painettu, sosiaalinen media)',
          'Sisällytä esimerkkejä onnistuneista kampanjoista ja konversioista',
          'Näytä ymmärrys SEO:sta ja sisällön markkinoinnista'
        ],
        skills: [
          'Sisällön kirjoittaminen ja copywriting',
          'SEO optimointi ja avainsana tutkimus',
          'Brändin ääni ja sävy kehitys',
          'Markkinointi kampanja kehitys',
          'Sosiaalisen median sisällön luominen',
          'Sähköposti markkinointi ja uutiskirjeet',
          'Muokkaus ja oikoluku'
        ],
        whyGood: [
          'Selkeä rakenne, joka korostaa kirjoitusportfoliota',
          'Korostaa monipuolisuutta kirjoitusmuodoissa',
          'Näyttää copywriting kokemuksen kehityksen',
          'Näyttää markkinoinnin periaatteiden ymmärryksen',
          'ATS-yhteensopiva muoto kirjoittamisen ja markkinoinnin avainsanoilla'
        ]
      },
      sk: {
        name: 'Copywriter',
        slug: 'copywriter',
        description: 'Copywriteri vytvárajú písaný obsah pre reklamu, marketing a propagačné materiály. Vytvárajú presvedčivé správy, ktoré presviedčajú publikum a vyvolávajú akciu v rôznych mediálnych kanáloch.',
        tips: [
          'Ukážte svoje portfolio s rôznorodými vzorkami písania',
          'Zdôraznite skúsenosti s rôznymi odvetviami a publikom',
          'Zdôraznite schopnosť písať pre viacero formátov (web, tlač, sociálne médiá)',
          'Zahrňte príklady úspešných kampaní a konverzií',
          'Preukážte porozumenie SEO a content marketingu'
        ],
        skills: [
          'Písanie obsahu a copywriting',
          'SEO optimalizácia a výskum kľúčových slov',
          'Vývoj hlasu a tónu značky',
          'Vývoj marketingových kampaní',
          'Tvorba obsahu pre sociálne médiá',
          'Emailový marketing a newsletter',
          'Editácia a korektúra'
        ],
        whyGood: [
          'Jasná štruktúra zdôrazňujúca portfolio písania',
          'Zdôrazňuje všestrannosť vo formátoch písania',
          'Ukazuje pokrok skúseností s copywritingom',
          'Preukazuje porozumenie marketingovým princípom',
          'Formát kompatibilný s ATS s kľúčovými slovami písania a marketingu'
        ]
      },
      no: {
        name: 'Copywriter',
        slug: 'copywriter',
        description: 'Copywriters skaper skrevet innhold for reklame, markedsføring og markedsføringsmateriell. De skaper overbevisende meldinger som overbeviser målgrupper og driver handling på tvers av ulike mediekanaler.',
        tips: [
          'Vis porteføljen din med ulike skrivprøver',
          'Fremhev erfaring med ulike bransjer og målgrupper',
          'Fremhev evne til å skrive for flere formater (web, trykk, sosiale medier)',
          'Inkluder eksempler på vellykkede kampanjer og konverteringer',
          'Vis forståelse av SEO og innhold markedsføring'
        ],
        skills: [
          'Innholdsskriving og copywriting',
          'SEO-optimalisering og nøkkelordsforskning',
          'Varemerke stemme og tone utvikling',
          'Markedsføringskampanje utvikling',
          'Opprettelse av innhold for sosiale medier',
          'E-post markedsføring og nyhetsbrev',
          'Redigering og korrekturlæsning'
        ],
        whyGood: [
          'Tydelig struktur som fremhever skriveportefølje',
          'Fremhever alsidighet på tvers av skriveformater',
          'Vis progresjon av copywritingerfaring',
          'Vis forståelse av markedsføringsprinsipper',
          'ATS-vennlig format med nøkkelord for skriving og markedsføring'
        ]
      },
      hr: {
        name: 'Copywriter',
        slug: 'copywriter',
        description: 'Copywriteri stvaraju pisani sadržaj za oglašavanje, marketing i promocijski materijal. Kreiraju uvjerljive poruke koje uvjeravaju publiku i potiču akciju kroz različite medijske kanale.',
        tips: [
          'Pokažite svoj portfolio s različitim uzorcima pisanja',
          'Naglasite iskustvo s različitim industrijama i publikom',
          'Naglasite sposobnost pisanja za više formata (web, tisak, društveni mediji)',
          'Uključite primjere uspješnih kampanja i konverzija',
          'Pokažite razumijevanje SEO-a i content marketinga'
        ],
        skills: [
          'Pisanje sadržaja i copywriting',
          'SEO optimizacija i istraživanje ključnih riječi',
          'Razvoj glasa i tona marke',
          'Razvoj marketinških kampanja',
          'Kreiranje sadržaja za društvene medije',
          'Email marketing i newsletteri',
          'Uređivanje i korektura'
        ],
        whyGood: [
          'Jasna struktura koja ističe portfolio pisanja',
          'Naglašava svestranost u formatima pisanja',
          'Pokazuje napredak iskustva u copywritingu',
          'Pokazuje razumijevanje marketinških principa',
          'Format kompatibilan s ATS s ključnim riječima pisanja i marketinga'
        ]
      },
      sr: {
        name: 'Копирајтер',
        slug: 'kopirajter',
        description: 'Копирајтери стварају писани садржај за оглашавање, маркетинг и промоционални материјал. Креирају убедљиве поруке које убеђују публику и подстичу акцију кроз различите медијске канале.',
        tips: [
          'Покажите свој портфолио са различитим узорцима писања',
          'Нагласите искуство са различитим индустријама и публиком',
          'Нагласите способност писања за више формата (веб, штампа, друштвени медији)',
          'Укључите примере успешних кампања и конверзија',
          'Покажите разумевање SEO-а и content маркетинга'
        ],
        skills: [
          'Писање садржаја и копирајтинг',
          'SEO оптимизација и истраживање кључних речи',
          'Развој гласа и тона марке',
          'Развој маркетиншких кампања',
          'Креирање садржаја за друштвене медије',
          'Емаил маркетинг и билтени',
          'Уређивање и коректура'
        ],
        whyGood: [
          'Јасна структура која истиче портфолио писања',
          'Наглашава свестраност у форматима писања',
          'Показује напредак искуства у копирајтингу',
          'Показује разумевање маркетиншких принципа',
          'Формат компатибилан са ATS са кључним речима писања и маркетинга'
        ]
      }
    }
  }
  // Note: More professions can be added here with full translations
]

/**
 * Get profession by ID and language
 */
export function getProfession(id: string, language: Language = 'en'): ProfessionTranslation | null {
  const profession = PROFESSIONS.find(p => p.id === id)
  if (!profession) return null
  return profession.translations[language] || profession.translations.en
}

/**
 * Get all professions for a language
 */
export function getProfessions(language: Language = 'en'): Array<{ id: string; translation: ProfessionTranslation }> {
  return PROFESSIONS.map(p => ({
    id: p.id,
    translation: p.translations[language] || p.translations.en
  }))
}

/**
 * Get profession ID from slug for a given language
 */
export function getProfessionIdFromSlug(slug: string, language: Language = 'en'): string | null {
  const profession = PROFESSIONS.find(p => {
    const translation = p.translations[language] || p.translations.en
    return translation.slug === slug
  })
  return profession?.id || null
}

/**
 * Get URL path for a profession example page
 */
export function getExampleUrl(
  type: 'cv' | 'letter',
  professionId: string,
  language: Language = 'en'
): string {
  const segments = URL_SEGMENTS[language]
  const profession = PROFESSIONS.find(p => p.id === professionId)
  if (!profession) return ''
  
  const translation = profession.translations[language] || profession.translations.en
  const typeSegment = type === 'cv' ? segments.cv : segments.letter
  
  return `/${segments.examples}/${typeSegment}/${translation.slug}`
}

/**
 * Get professions grouped by category for a given language
 */
export function getProfessionsByCategory(language: Language = 'en'): Record<string, Array<{ id: string; translation: ProfessionTranslation }>> {
  const grouped: Record<string, Array<{ id: string; translation: ProfessionTranslation }>> = {}
  
  PROFESSIONS.forEach(profession => {
    const category = profession.category
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push({
      id: profession.id,
      translation: profession.translations[language] || profession.translations.en
    })
  })
  
  return grouped
}
