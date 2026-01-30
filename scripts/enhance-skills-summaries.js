/**
 * Enhance CV Skills and Summaries Script
 * 
 * Expands skills lists and enhances summaries for all CVs
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/exampleCVs.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔧 Enhancing CV skills and summaries...\n');

let changesMade = 0;

// Sector-specific skill additions
const skillAdditions = {
  'management-assistant': {
    technical: ['Microsoft Office Suite', 'Project management tools (Asana, Trello)', 'CRM systems', 'Document management', 'Scheduling software', 'Financial software'],
    soft: ['Organisatie en planning', 'Effectieve communicatie', 'Probleemoplossing', 'Discretie en vertrouwelijkheid', 'Multitasking', 'Proactief werken']
  },
  'engineer': {
    technical: ['CAD software (AutoCAD, SolidWorks)', 'Project management tools', 'Engineering standards (ISO, NEN)', 'Technical analysis', 'Quality control', 'Risk assessment'],
    soft: ['Probleemoplossing', 'Teamleiderschap', 'Projectmanagement', 'Communicatie', 'Analytisch denken', 'Kwaliteitsbewustzijn']
  },
  'account-manager': {
    technical: ['CRM systems (Salesforce, HubSpot)', 'Sales analytics', 'Contract management', 'Presentation tools', 'Market research', 'Competitive analysis'],
    soft: ['Relatiebeheer', 'Onderhandeling', 'Strategisch denken', 'Klantgerichtheid', 'Communicatie', 'Resultaatgerichtheid']
  },
  'chef': {
    technical: ['Culinaire technieken', 'Menu ontwikkeling', 'Food safety (HACCP)', 'Inventory management', 'Cost control', 'Kitchen management systems'],
    soft: ['Creativiteit', 'Teamleiderschap', 'Stressbestendigheid', 'Kwaliteitsbewustzijn', 'Gastgerichtheid', 'Innovatie']
  },
  'lawyer': {
    technical: ['Juridisch onderzoek', 'Contractenrecht', 'Procedurerecht', 'Legal software (LexisNexis)', 'Documentbeheer', 'Case management'],
    soft: ['Analytisch denken', 'Precisie', 'Effectieve communicatie', 'Onderhandeling', 'Klantgerichtheid', 'Strategisch denken']
  },
  'data-scientist': {
    technical: ['Python', 'R', 'SQL', 'Machine Learning (scikit-learn, TensorFlow)', 'Data visualization', 'Big Data tools (Spark, Hadoop)'],
    soft: ['Analytisch denken', 'Probleemoplossing', 'Communicatie', 'Teamwerk', 'Curiositeit', 'Data-driven besluitvorming']
  },
  'doctor': {
    technical: ['Medische diagnostiek', 'Behandelprotocollen', 'EPD systemen', 'Medische apparatuur', 'Kwaliteitsborging', 'Evidence-based medicine'],
    soft: ['Empathie', 'Communicatie', 'Stressbestendigheid', 'Teamwerk', 'Kritisch denken', 'Patiëntgerichtheid']
  },
  'pharmacist': {
    technical: ['Farmaceutische kennis', 'Medicatiebeoordeling', 'Farmaceutische software', 'Kwaliteitsborging', 'Regulatory compliance', 'Drug interactions'],
    soft: ['Empathie', 'Communicatie', 'Precisie', 'Patiëntgerichtheid', 'Teamwerk', 'Kritisch denken']
  },
  'it-support': {
    technical: ['Windows/Linux systemen', 'Networking', 'Helpdesk software', 'Remote support tools', 'Hardware troubleshooting', 'Software installation'],
    soft: ['Probleemoplossing', 'Geduld', 'Communicatie', 'Klantgerichtheid', 'Teamwerk', 'Proactief werken']
  },
  'professor': {
    technical: ['Onderzoeksmethoden', 'Academic writing', 'Statistical analysis', 'Research software', 'Teaching methodologies', 'Grant writing'],
    soft: ['Mentoring', 'Communicatie', 'Kritisch denken', 'Creativiteit', 'Leiderschap', 'Collaboratie']
  },
  'school-counselor': {
    technical: ['Counseling technieken', 'Assessment tools', 'Career guidance', 'Educational systems', 'Student information systems', 'Crisis intervention'],
    soft: ['Empathie', 'Actief luisteren', 'Communicatie', 'Geduld', 'Probleemoplossing', 'Vertrouwelijkheid']
  },
  'financial-analyst': {
    technical: ['Excel (geavanceerd)', 'Financial modeling', 'Data analysis tools', 'Accounting software', 'Risk analysis', 'Forecasting'],
    soft: ['Analytisch denken', 'Precisie', 'Communicatie', 'Kritisch denken', 'Probleemoplossing', 'Attention to detail']
  },
  'photographer': {
    technical: ['Photography equipment', 'Adobe Lightroom', 'Adobe Photoshop', 'Color grading', 'Studio lighting', 'Post-production'],
    soft: ['Creativiteit', 'Visuele communicatie', 'Klantgerichtheid', 'Flexibiliteit', 'Netwerken', 'Artistieke visie']
  },
  'copywriter': {
    technical: ['Content management systems', 'SEO tools', 'Analytics tools', 'Design software basics', 'Marketing automation', 'Social media platforms'],
    soft: ['Creativiteit', 'Schrijfvaardigheid', 'Research skills', 'Klantgerichtheid', 'Teamwerk', 'Deadline management']
  },
  'mechanical-engineer': {
    technical: ['CAD/CAM software', 'Finite Element Analysis', 'Manufacturing processes', 'Quality control', 'Project management', 'Technical documentation'],
    soft: ['Probleemoplossing', 'Teamwerk', 'Projectmanagement', 'Communicatie', 'Analytisch denken', 'Innovatie']
  },
  'civil-engineer': {
    technical: ['CAD software', 'Structural analysis', 'Project management', 'Construction methods', 'Quality control', 'Safety compliance'],
    soft: ['Probleemoplossing', 'Teamleiderschap', 'Projectmanagement', 'Communicatie', 'Analytisch denken', 'Kwaliteitsbewustzijn']
  },
  'account-manager-2': {
    technical: ['CRM systems', 'Sales analytics', 'Contract management', 'Presentation tools', 'Market research', 'Account planning'],
    soft: ['Relatiebeheer', 'Onderhandeling', 'Strategisch denken', 'Klantgerichtheid', 'Communicatie', 'Resultaatgerichtheid']
  },
  'store-manager': {
    technical: ['POS systems', 'Inventory management', 'Sales analytics', 'Staff scheduling', 'Financial management', 'Customer service systems'],
    soft: ['Teamleiderschap', 'Klantgerichtheid', 'Verkoopvaardigheden', 'Organisatie', 'Communicatie', 'Resultaatgerichtheid']
  },
  'office-manager': {
    technical: ['Office software', 'HR systems', 'Financial software', 'Facility management', 'Project management tools', 'Document management'],
    soft: ['Organisatie', 'Teamleiderschap', 'Communicatie', 'Probleemoplossing', 'Multitasking', 'Efficiëntie']
  },
  'executive-assistant': {
    technical: ['Microsoft Office Suite', 'Calendar management', 'Travel booking systems', 'Document management', 'Presentation tools', 'Communication tools'],
    soft: ['Discretie', 'Organisatie', 'Proactief werken', 'Communicatie', 'Multitasking', 'Attention to detail']
  },
  'hotel-manager': {
    technical: ['Property management systems', 'Revenue management', 'Event planning software', 'Financial management', 'Customer service systems', 'Inventory management'],
    soft: ['Gastenservice', 'Teamleiderschap', 'Stressbestendigheid', 'Communicatie', 'Probleemoplossing', 'Commercieel inzicht']
  },
  'restaurant-manager': {
    technical: ['POS systems', 'Reservation systems', 'Inventory management', 'Financial management', 'Staff scheduling', 'Food safety systems'],
    soft: ['Gastenservice', 'Teamleiderschap', 'Stressbestendigheid', 'Communicatie', 'Probleemoplossing', 'Kwaliteitsbewustzijn']
  },
  'paralegal': {
    technical: ['Legal research', 'Document management', 'Case management software', 'Legal databases', 'Court filing systems', 'Legal writing'],
    soft: ['Analytisch denken', 'Precisie', 'Organisatie', 'Communicatie', 'Teamwerk', 'Attention to detail']
  },
  'legal-assistant': {
    technical: ['Legal software', 'Document management', 'Case management', 'Legal databases', 'Administrative systems', 'Filing systems'],
    soft: ['Organisatie', 'Communicatie', 'Precisie', 'Teamwerk', 'Discretie', 'Multitasking']
  }
};

// List of professions to enhance
const professions = [
  'management-assistant', 'engineer', 'account-manager', 'chef', 'lawyer',
  'data-scientist', 'doctor', 'pharmacist', 'it-support', 'professor',
  'school-counselor', 'financial-analyst', 'photographer', 'copywriter',
  'mechanical-engineer', 'civil-engineer', 'account-manager-2', 'store-manager',
  'office-manager', 'executive-assistant', 'hotel-manager', 'restaurant-manager',
  'paralegal', 'legal-assistant'
];

// Enhance skills
professions.forEach(profession => {
  const additions = skillAdditions[profession];
  if (!additions) return;
  
  // Find skills section for this profession
  const skillsRegex = new RegExp(`('${profession}':[\\s\\S]*?skills:\\s*{)([\\s\\S]*?)(})`, 'g');
  
  content = content.replace(skillsRegex, (match, prefix, skillsContent, suffix) => {
    // Check if already enhanced
    if (skillsContent.includes(additions.technical[0]) || skillsContent.includes('Microsoft Office Suite')) {
      return match;
    }
    
    // Add technical skills
    const techMatch = skillsContent.match(/technical:\s*\[([^\]]*)\]/);
    if (techMatch) {
      const currentTech = techMatch[1];
      const newTech = currentTech + (currentTech.trim().endsWith(',') ? '' : ',') + 
        '\n        ' + additions.technical.map(s => `'${s}'`).join(',\n        ');
      skillsContent = skillsContent.replace(techMatch[0], `technical: [${newTech}\n      ]`);
    }
    
    // Add soft skills
    const softMatch = skillsContent.match(/soft:\s*\[([^\]]*)\]/);
    if (softMatch) {
      const currentSoft = softMatch[1];
      const newSoft = currentSoft + (currentSoft.trim().endsWith(',') ? '' : ',') + 
        '\n        ' + additions.soft.map(s => `'${s}'`).join(',\n        ');
      skillsContent = skillsContent.replace(softMatch[0], `soft: [${newSoft}\n      ]`);
    }
    
    changesMade++;
    return prefix + skillsContent + suffix;
  });
});

// Enhance summaries
const summaryEnhancements = {
  'management-assistant': 'met bewezen track record in efficiënte organisatie en executive ondersteuning',
  'engineer': 'met bewezen track record in projectmanagement en technische excellentie',
  'account-manager': 'met bewezen track record in account groei en klantrelatiebeheer',
  'chef': 'met bewezen track record in culinaire innovatie en teamleiderschap',
  'lawyer': 'met bewezen track record in complexe juridische zaken en cliëntadvies',
  'data-scientist': 'met bewezen track record in data-analyse en machine learning implementaties',
  'doctor': 'met bewezen track record in patiëntenzorg en medische excellentie',
  'pharmacist': 'met bewezen track record in farmaceutische zorg en medicatiebeheer',
  'it-support': 'met bewezen track record in IT troubleshooting en gebruikersondersteuning',
  'professor': 'met bewezen track record in onderzoek en onderwijs',
  'school-counselor': 'met bewezen track record in leerlingbegeleiding en loopbaanoriëntatie',
  'financial-analyst': 'met bewezen track record in financiële analyse en strategische advisering',
  'photographer': 'met bewezen track record in creatieve fotografie en visuele communicatie',
  'copywriter': 'met bewezen track record in content marketing en copywriting',
  'mechanical-engineer': 'met bewezen track record in mechanisch ontwerp en productontwikkeling',
  'civil-engineer': 'met bewezen track record in infrastructurele projecten en bouwmanagement',
  'account-manager-2': 'met bewezen track record in B2B account management en verkoop',
  'store-manager': 'met bewezen track record in retail management en verkoopoptimalisatie',
  'office-manager': 'met bewezen track record in kantoorbeheer en teamcoördinatie',
  'executive-assistant': 'met bewezen track record in executive ondersteuning en organisatie',
  'hotel-manager': 'met bewezen track record in hospitality management en gastenservice',
  'restaurant-manager': 'met bewezen track record in restaurant management en operationele excellentie',
  'paralegal': 'met bewezen track record in juridische ondersteuning en documentbeheer',
  'legal-assistant': 'met bewezen track record in juridische administratie en ondersteuning'
};

professions.forEach(profession => {
  const enhancement = summaryEnhancements[profession];
  if (!enhancement) return;
  
  // Find summary for this profession
  const summaryRegex = new RegExp(`('${profession}':[\\s\\S]*?summary:\\s*')([^']*)(')`, 'g');
  
  content = content.replace(summaryRegex, (match, prefix, summary, suffix) => {
    if (summary.includes('track record') || summary.includes('bewezen')) {
      return match; // Already enhanced
    }
    
    // Add enhancement before the last sentence
    const sentences = summary.split('.');
    if (sentences.length > 1) {
      sentences[sentences.length - 2] += `. ${enhancement}`;
      changesMade++;
      return prefix + sentences.join('.') + suffix;
    }
    
    return match;
  });
});

console.log(`✅ Enhanced ${changesMade} CV skills and summaries\n`);

if (changesMade > 0) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`💾 Saved enhanced CVs to ${filePath}`);
  console.log(`\n📊 Summary: Enhanced ${changesMade} CV sections`);
} else {
  console.log('⚠️  No changes made. CVs may already be enhanced.');
}

console.log('\n✨ Enhancement complete!');
