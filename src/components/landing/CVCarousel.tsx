'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaCode, FaLanguage, FaCertificate, FaProjectDiagram, FaHeart } from 'react-icons/fa';

interface CVDummyData {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  photoUrl: string;
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    period: string;
    description: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    period: string;
    gpa?: string;
  }>;
  skills: string[];
  languages: string[];
  certifications: string[];
  projects: Array<{
    name: string;
    description: string;
    tech: string[];
  }>;
  interests: string[];
  template: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const cvTemplates: CVDummyData[] = [
  {
    id: 'modern-tech',
    name: 'Marcus Johnson',
    title: 'Senior Full-Stack Developer',
    email: 'marcus.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/marcusjohnson',
    github: 'github.com/marcusjohnson',
    website: 'marcusjohnson.dev',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    summary: 'Passionate full-stack developer with 6+ years of experience building scalable web applications. Expert in React, Node.js, and cloud technologies with a track record of delivering high-impact solutions.',
    experience: [
      {
        title: 'Senior Full-Stack Developer',
        company: 'TechCorp Solutions',
        period: '2021 - Present',
        description: [
          'Led development of microservices architecture serving 2M+ users',
          'Reduced application load time by 40% through performance optimization',
          'Mentored 5 junior developers and established coding standards'
        ]
      },
      {
        title: 'Full-Stack Developer',
        company: 'StartupXYZ',
        period: '2019 - 2021',
        description: [
          'Built responsive web applications using React and Node.js',
          'Implemented CI/CD pipelines reducing deployment time by 60%',
          'Collaborated with design team to create intuitive user interfaces'
        ]
      }
    ],
    education: [
      {
        degree: 'Bachelor of Computer Science',
        institution: 'Stanford University',
        period: '2015 - 2019',
        gpa: '3.8/4.0'
      }
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'MongoDB', 'GraphQL', 'Python'],
    languages: ['English (Native)', 'Mandarin (Fluent)', 'Spanish (Conversational)'],
    certifications: ['AWS Certified Solutions Architect', 'Google Cloud Professional Developer'],
    projects: [
      {
        name: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce solution with real-time inventory management',
        tech: ['React', 'Node.js', 'MongoDB', 'Stripe API']
      },
      {
        name: 'AI Chatbot',
        description: 'Developed an intelligent customer service chatbot using NLP and machine learning',
        tech: ['Python', 'TensorFlow', 'OpenAI API', 'FastAPI']
      }
    ],
    interests: ['Open Source', 'Machine Learning', 'Photography', 'Hiking'],
    template: 'modern',
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      accent: '#3b82f6'
    }
  },
  {
    id: 'creative-designer',
    name: 'Maya Rodriguez',
    title: 'Creative Director & UX Designer',
    email: 'maya.rodriguez@email.com',
    phone: '+1 (555) 234-5678',
    location: 'New York, NY',
    linkedin: 'linkedin.com/in/mayarodriguez',
    github: 'github.com/mayarodriguez',
    website: 'mayarodriguez.design',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    summary: 'Award-winning creative director with 8+ years of experience in brand strategy and user experience design. Passionate about creating meaningful digital experiences that drive business growth.',
    experience: [
      {
        title: 'Creative Director',
        company: 'Design Studio Pro',
        period: '2020 - Present',
        description: [
          'Led creative direction for Fortune 500 clients including Apple and Nike',
          'Increased client satisfaction scores by 35% through innovative design solutions',
          'Managed a team of 12 designers and developers'
        ]
      },
      {
        title: 'Senior UX Designer',
        company: 'Digital Innovations Inc.',
        period: '2018 - 2020',
        description: [
          'Designed user interfaces for mobile and web applications',
          'Conducted user research and usability testing sessions',
          'Collaborated with product managers to define user requirements'
        ]
      }
    ],
    education: [
      {
        degree: 'Master of Fine Arts in Design',
        institution: 'Rhode Island School of Design',
        period: '2016 - 2018'
      }
    ],
    skills: ['Figma', 'Adobe Creative Suite', 'Sketch', 'Principle', 'User Research', 'Prototyping', 'Brand Strategy'],
    languages: ['English (Native)', 'Spanish (Fluent)', 'French (Conversational)'],
    certifications: ['Google UX Design Certificate', 'Adobe Certified Expert'],
    projects: [
      {
        name: 'Brand Identity System',
        description: 'Developed comprehensive brand identity for tech startup',
        tech: ['Figma', 'Adobe Illustrator', 'After Effects']
      }
    ],
    interests: ['Art Exhibitions', 'Travel', 'Photography', 'Yoga'],
    template: 'creative',
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#a855f7'
    }
  },
  {
    id: 'data-scientist',
    name: 'James Park',
    title: 'Senior Data Scientist',
    email: 'james.park@email.com',
    phone: '+1 (555) 567-8901',
    location: 'Seattle, WA',
    linkedin: 'linkedin.com/in/jamespark',
    github: 'github.com/jamespark',
    website: 'jamespark.ai',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    summary: 'Machine learning engineer and data scientist with 5+ years of experience in building predictive models and AI solutions. Passionate about using data to solve complex business problems.',
    experience: [
      {
        title: 'Senior Data Scientist',
        company: 'AI Innovations Lab',
        period: '2022 - Present',
        description: [
          'Developed ML models that improved business predictions by 30%',
          'Led team of 4 data scientists on recommendation system project',
          'Implemented MLOps pipeline reducing model deployment time by 70%'
        ]
      },
      {
        title: 'Data Scientist',
        company: 'Tech Startup Inc.',
        period: '2020 - 2022',
        description: [
          'Built customer churn prediction model with 85% accuracy',
          'Analyzed large datasets using Python and SQL',
          'Created interactive dashboards for business stakeholders'
        ]
      }
    ],
    education: [
      {
        degree: 'PhD in Computer Science',
        institution: 'University of Washington',
        period: '2016 - 2020'
      }
    ],
    skills: ['Python', 'R', 'TensorFlow', 'PyTorch', 'SQL', 'AWS', 'Docker', 'Kubernetes', 'Tableau'],
    languages: ['English (Native)', 'Korean (Fluent)', 'Japanese (Conversational)'],
    certifications: ['AWS Machine Learning Specialty', 'Google Cloud ML Engineer'],
    projects: [
      {
        name: 'Real-time Fraud Detection',
        description: 'Built ML system detecting fraudulent transactions in real-time',
        tech: ['Python', 'TensorFlow', 'Apache Kafka', 'Redis']
      }
    ],
    interests: ['Machine Learning Research', 'Chess', 'Hiking', 'Coffee Roasting'],
    template: 'modern',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981'
    }
  },
  {
    id: 'product-manager',
    name: 'Amanda Foster',
    title: 'Senior Product Manager',
    email: 'amanda.foster@email.com',
    phone: '+1 (555) 678-9012',
    location: 'San Jose, CA',
    linkedin: 'linkedin.com/in/amandafoster',
    github: 'github.com/amandafoster',
    website: 'amandafoster.product',
    photoUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    summary: 'Strategic product manager with 8+ years of experience in B2B SaaS products. Expert in user research, product strategy, and cross-functional team leadership.',
    experience: [
      {
        title: 'Senior Product Manager',
        company: 'SaaS Solutions Inc.',
        period: '2021 - Present',
        description: [
          'Led product strategy for $50M ARR product line',
          'Increased user engagement by 60% through feature optimization',
          'Managed product roadmap and coordinated with engineering teams'
        ]
      },
      {
        title: 'Product Manager',
        company: 'Tech Startup Co.',
        period: '2019 - 2021',
        description: [
          'Launched 3 major product features from concept to market',
          'Conducted user interviews and usability testing sessions',
          'Collaborated with design and engineering teams on product development'
        ]
      }
    ],
    education: [
      {
        degree: 'Master of Business Administration',
        institution: 'UC Berkeley Haas School of Business',
        period: '2017 - 2019'
      }
    ],
    skills: ['Product Strategy', 'User Research', 'Agile', 'Jira', 'Figma', 'Analytics', 'A/B Testing'],
    languages: ['English (Native)', 'Mandarin (Fluent)'],
    certifications: ['Certified Scrum Product Owner', 'Google Analytics Certified'],
    projects: [
      {
        name: 'Mobile App Launch',
        description: 'Led successful launch of mobile app with 1M+ downloads',
        tech: ['Figma', 'Jira', 'Mixpanel', 'Amplitude']
      }
    ],
    interests: ['Product Design', 'Travel', 'Yoga', 'Reading'],
    template: 'creative',
    colors: {
      primary: '#7c3aed',
      secondary: '#6d28d9',
      accent: '#8b5cf6'
    }
  },
  {
    id: 'marketing-manager',
    name: 'Sarah Johnson',
    title: 'Digital Marketing Manager',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 456-7890',
    location: 'Austin, TX',
    linkedin: 'linkedin.com/in/sarahjohnson',
    github: 'github.com/sarahjohnson',
    website: 'sarahjohnson.marketing',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    summary: 'Results-driven digital marketing professional with 7+ years of experience in growth marketing, content strategy, and brand development. Expert in data-driven campaigns that deliver measurable ROI.',
    experience: [
      {
        title: 'Digital Marketing Manager',
        company: 'Growth Marketing Agency',
        period: '2021 - Present',
        description: [
          'Increased client revenue by 150% through strategic digital campaigns',
          'Managed $2M annual marketing budget across multiple channels',
          'Built and led a team of 8 marketing specialists'
        ]
      },
      {
        title: 'Senior Marketing Specialist',
        company: 'E-commerce Solutions',
        period: '2019 - 2021',
        description: [
          'Developed and executed multi-channel marketing strategies',
          'Improved conversion rates by 45% through A/B testing',
          'Managed social media presence with 500K+ followers'
        ]
      }
    ],
    education: [
      {
        degree: 'Master of Marketing',
        institution: 'University of Texas at Austin',
        period: '2017 - 2019'
      }
    ],
    skills: ['Google Analytics', 'Facebook Ads', 'SEO/SEM', 'Content Marketing', 'Email Marketing', 'HubSpot', 'Salesforce'],
    languages: ['English (Native)', 'Portuguese (Fluent)'],
    certifications: ['Google Ads Certified', 'HubSpot Content Marketing Certified', 'Facebook Blueprint Certified'],
    projects: [
      {
        name: 'Viral Campaign Launch',
        description: 'Created viral marketing campaign reaching 10M+ impressions',
        tech: ['Facebook Ads', 'Instagram', 'TikTok', 'Google Analytics']
      }
    ],
    interests: ['Travel', 'Photography', 'Cooking', 'Fitness'],
    template: 'modern',
    colors: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      accent: '#ef4444'
    }
  },
  {
    id: 'financial-analyst',
    name: 'Klaus Weber',
    title: 'Senior Financial Analyst',
    email: 'klaus.weber@financepro.com',
    phone: '+1 (415) 987-6543',
    location: 'Chicago, IL',
    linkedin: 'linkedin.com/in/klausweber-finance',
    github: 'github.com/klausweber-analytics',
    website: 'klausweber.finance',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    summary: 'Chartered Financial Analyst with 8+ years of experience in investment analysis, financial modeling, and risk management. Proven track record of delivering actionable insights that drive strategic business decisions.',
    experience: [
      {
        title: 'Senior Financial Analyst',
        company: 'Goldman Sachs',
        period: '2020 - Present',
        description: [
          'Led financial modeling for $500M+ investment opportunities',
          'Developed risk assessment frameworks reducing portfolio risk by 25%',
          'Mentored junior analysts and improved team productivity by 30%'
        ]
      },
      {
        title: 'Financial Analyst',
        company: 'JP Morgan Chase',
        period: '2018 - 2020',
        description: [
          'Created comprehensive financial models for M&A transactions',
          'Analyzed market trends and provided investment recommendations',
          'Collaborated with cross-functional teams on strategic initiatives'
        ]
      },
      {
        title: 'Investment Banking Analyst',
        company: 'Morgan Stanley',
        period: '2016 - 2018',
        description: [
          'Prepared pitch books and financial presentations for clients',
          'Conducted due diligence on potential acquisition targets',
          'Supported senior bankers in deal execution and client relations'
        ]
      }
    ],
    education: [
      {
        degree: 'Master of Business Administration (Finance)',
        institution: 'University of Chicago Booth School of Business',
        period: '2014 - 2016',
        gpa: '3.9/4.0'
      },
      {
        degree: 'Bachelor of Economics',
        institution: 'Northwestern University',
        period: '2010 - 2014',
        gpa: '3.7/4.0'
      }
    ],
    skills: ['Financial Modeling', 'Valuation', 'Risk Management', 'Excel VBA', 'Bloomberg Terminal', 'Python', 'SQL', 'Tableau'],
    languages: ['English (Native)', 'Korean (Fluent)', 'Japanese (Conversational)'],
    certifications: ['Chartered Financial Analyst (CFA)', 'Financial Risk Manager (FRM)', 'Series 7 & 63 Licensed'],
    projects: [
      {
        name: 'Portfolio Optimization Algorithm',
        description: 'Developed Python-based algorithm for optimal portfolio allocation reducing risk by 20%',
        tech: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'QuantLib']
      }
    ],
    interests: ['Investment Research', 'Chess', 'Golf', 'Wine Tasting'],
    template: 'professional',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981'
    }
  },
  {
    id: 'healthcare-nurse',
    name: 'Emily Thompson',
    title: 'Registered Nurse - ICU Specialist',
    email: 'emily.thompson@healthcare.org',
    phone: '+1 (312) 555-0123',
    location: 'Boston, MA',
    linkedin: 'linkedin.com/in/emilythompson-rn',
    github: '',
    website: '',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    summary: 'Compassionate and skilled Registered Nurse with 10+ years of experience in critical care and emergency medicine. Dedicated to providing exceptional patient care and improving healthcare outcomes through evidence-based practice.',
    experience: [
      {
        title: 'Senior ICU Nurse',
        company: 'Massachusetts General Hospital',
        period: '2019 - Present',
        description: [
          'Managed care for critically ill patients in 20-bed ICU unit',
          'Led quality improvement initiatives reducing patient complications by 35%',
          'Mentored 15+ new graduate nurses and nursing students'
        ]
      },
      {
        title: 'Emergency Department Nurse',
        company: 'Brigham and Women\'s Hospital',
        period: '2016 - 2019',
        description: [
          'Provided emergency care for 50+ patients per shift',
          'Collaborated with multidisciplinary teams in trauma situations',
          'Implemented new triage protocols improving patient flow by 25%'
        ]
      },
      {
        title: 'Medical-Surgical Nurse',
        company: 'Beth Israel Deaconess Medical Center',
        period: '2014 - 2016',
        description: [
          'Delivered comprehensive care to post-surgical patients',
          'Administered medications and monitored patient responses',
          'Maintained detailed patient records and care documentation'
        ]
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Nursing',
        institution: 'Boston College',
        period: '2010 - 2014',
        gpa: '3.8/4.0'
      }
    ],
    skills: ['Critical Care', 'Emergency Medicine', 'Patient Assessment', 'IV Therapy', 'Medication Administration', 'CPR/BLS', 'ACLS', 'PALS'],
    languages: ['English (Native)', 'Spanish (Conversational)'],
    certifications: ['Registered Nurse (RN)', 'Critical Care Registered Nurse (CCRN)', 'Advanced Cardiac Life Support (ACLS)', 'Pediatric Advanced Life Support (PALS)'],
    projects: [
      {
        name: 'ICU Patient Safety Initiative',
        description: 'Developed and implemented safety protocols reducing medication errors by 40%',
        tech: ['Electronic Health Records', 'Quality Improvement Tools', 'Data Analysis']
      }
    ],
    interests: ['Patient Advocacy', 'Nursing Education', 'Hiking', 'Photography'],
    template: 'healthcare',
    colors: {
      primary: '#dc2626',
      secondary: '#b91c1c',
      accent: '#f87171'
    }
  },
  {
    id: 'sales-director',
    name: 'Michael Rodriguez',
    title: 'Sales Director - Enterprise Solutions',
    email: 'michael.rodriguez@salesforce.com',
    phone: '+1 (650) 123-9876',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/michaelrodriguez-sales',
    github: '',
    website: 'michaelrodriguez.sales',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    summary: 'Results-driven sales leader with 12+ years of experience in enterprise software sales and team management. Consistently exceeded revenue targets by 150%+ and built high-performing sales teams that drive business growth.',
    experience: [
      {
        title: 'Sales Director - Enterprise',
        company: 'Salesforce',
        period: '2021 - Present',
        description: [
          'Led enterprise sales team generating $50M+ annual revenue',
          'Closed 15+ enterprise deals worth $1M+ each in 2023',
          'Built and managed team of 12 enterprise account executives'
        ]
      },
      {
        title: 'Senior Sales Manager',
        company: 'Microsoft',
        period: '2018 - 2021',
        description: [
          'Managed key enterprise accounts in Fortune 500 companies',
          'Exceeded annual quota by 180% for three consecutive years',
          'Developed strategic partnerships with C-level executives'
        ]
      },
      {
        title: 'Enterprise Account Executive',
        company: 'Oracle',
        period: '2015 - 2018',
        description: [
          'Sold complex enterprise software solutions to large organizations',
          'Maintained 95% customer satisfaction rating across all accounts',
          'Collaborated with technical teams to deliver custom solutions'
        ]
      }
    ],
    education: [
      {
        degree: 'Master of Business Administration',
        institution: 'University of California, Berkeley',
        period: '2013 - 2015'
      },
      {
        degree: 'Bachelor of Business Administration',
        institution: 'University of Southern California',
        period: '2009 - 2013',
        gpa: '3.6/4.0'
      }
    ],
    skills: ['Enterprise Sales', 'CRM Management', 'Salesforce', 'HubSpot', 'Contract Negotiation', 'Team Leadership', 'Strategic Planning', 'Customer Relationship Management'],
    languages: ['English (Native)', 'Spanish (Fluent)', 'Portuguese (Conversational)'],
    certifications: ['Salesforce Certified Sales Cloud Consultant', 'HubSpot Sales Software Certified', 'SPIN Selling Certified'],
    projects: [
      {
        name: 'Enterprise Sales Process Optimization',
        description: 'Redesigned sales process reducing sales cycle by 30% and increasing win rate by 25%',
        tech: ['Salesforce', 'HubSpot', 'Sales Analytics', 'Process Mapping']
      }
    ],
    interests: ['Sales Strategy', 'Leadership Development', 'Golf', 'Travel'],
    template: 'sales',
    colors: {
      primary: '#7c3aed',
      secondary: '#6d28d9',
      accent: '#8b5cf6'
    }
  },
  {
    id: 'consultant-strategy',
    name: 'Jennifer Walsh',
    title: 'Senior Management Consultant',
    email: 'jennifer.walsh@mckinsey.com',
    phone: '+1 (212) 555-7890',
    location: 'New York, NY',
    linkedin: 'linkedin.com/in/jenniferwalsh-consulting',
    github: '',
    website: 'jenniferwalsh.consulting',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    summary: 'Strategic management consultant with 9+ years of experience helping Fortune 500 companies optimize operations and drive digital transformation. Expert in data-driven decision making and organizational change management.',
    experience: [
      {
        title: 'Senior Management Consultant',
        company: 'McKinsey & Company',
        period: '2020 - Present',
        description: [
          'Led digital transformation projects for Fortune 500 clients',
          'Delivered $100M+ in cost savings through operational optimization',
          'Managed cross-functional teams of 15+ consultants and analysts'
        ]
      },
      {
        title: 'Management Consultant',
        company: 'Bain & Company',
        period: '2018 - 2020',
        description: [
          'Developed strategic recommendations for private equity clients',
          'Conducted market analysis and competitive intelligence research',
          'Presented findings to C-suite executives and board members'
        ]
      },
      {
        title: 'Business Analyst',
        company: 'Deloitte Consulting',
        period: '2016 - 2018',
        description: [
          'Analyzed business processes and identified improvement opportunities',
          'Created financial models and business case presentations',
          'Supported senior consultants in client engagement delivery'
        ]
      }
    ],
    education: [
      {
        degree: 'Master of Business Administration',
        institution: 'Harvard Business School',
        period: '2014 - 2016'
      },
      {
        degree: 'Bachelor of Economics',
        institution: 'Yale University',
        period: '2010 - 2014',
        gpa: '3.9/4.0'
      }
    ],
    skills: ['Strategic Planning', 'Digital Transformation', 'Change Management', 'Data Analysis', 'Financial Modeling', 'Project Management', 'Stakeholder Management', 'PowerBI'],
    languages: ['English (Native)', 'French (Fluent)', 'German (Conversational)'],
    certifications: ['Project Management Professional (PMP)', 'Certified Management Consultant (CMC)', 'Six Sigma Black Belt'],
    projects: [
      {
        name: 'Global Supply Chain Optimization',
        description: 'Redesigned supply chain operations for manufacturing client, reducing costs by $50M annually',
        tech: ['SAP', 'PowerBI', 'Python', 'Process Mining Tools']
      }
    ],
    interests: ['Strategy Consulting', 'Digital Innovation', 'Skiing', 'Art Galleries'],
    template: 'consulting',
    colors: {
      primary: '#1e40af',
      secondary: '#1e3a8a',
      accent: '#3b82f6'
    }
  },
  {
    id: 'hr-manager',
    name: 'Rachel Martinez',
    title: 'Senior HR Manager',
    email: 'rachel.martinez@hrsolutions.com',
    phone: '+1 (305) 555-2468',
    location: 'Miami, FL',
    linkedin: 'linkedin.com/in/rachelmartinez-hr',
    github: '',
    website: 'rachelmartinez.hr',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    summary: 'Strategic HR leader with 10+ years of experience in talent acquisition, employee relations, and organizational development. Passionate about creating inclusive workplaces and driving employee engagement through innovative HR practices.',
    experience: [
      {
        title: 'Senior HR Manager',
        company: 'Amazon',
        period: '2021 - Present',
        description: [
          'Led HR operations for 2,000+ employees across 5 regional offices',
          'Reduced employee turnover by 40% through improved engagement programs',
          'Implemented diversity and inclusion initiatives increasing representation by 35%'
        ]
      },
      {
        title: 'HR Business Partner',
        company: 'Google',
        period: '2019 - 2021',
        description: [
          'Partnered with engineering teams to scale from 500 to 1,500 employees',
          'Developed talent acquisition strategies reducing time-to-hire by 30%',
          'Managed complex employee relations cases and performance improvement plans'
        ]
      },
      {
        title: 'Talent Acquisition Specialist',
        company: 'Microsoft',
        period: '2017 - 2019',
        description: [
          'Recruited top talent for software engineering and product management roles',
          'Built relationships with universities and coding bootcamps for pipeline development',
          'Improved candidate experience scores from 3.2 to 4.7 out of 5'
        ]
      }
    ],
    education: [
      {
        degree: 'Master of Human Resources Management',
        institution: 'Cornell University',
        period: '2015 - 2017'
      },
      {
        degree: 'Bachelor of Psychology',
        institution: 'University of Florida',
        period: '2011 - 2015',
        gpa: '3.8/4.0'
      }
    ],
    skills: ['Talent Acquisition', 'Employee Relations', 'Performance Management', 'HRIS', 'Workday', 'BambooHR', 'Compensation & Benefits', 'Organizational Development'],
    languages: ['English (Native)', 'Spanish (Fluent)', 'French (Conversational)'],
    certifications: ['SHRM-SCP', 'PHR', 'Certified Diversity Professional (CDP)', 'Workday HCM Certified'],
    projects: [
      {
        name: 'Employee Engagement Platform',
        description: 'Launched company-wide engagement platform increasing employee satisfaction by 45%',
        tech: ['Workday', 'BambooHR', 'Slack', 'SurveyMonkey']
      }
    ],
    interests: ['Workplace Culture', 'Leadership Development', 'Yoga', 'Travel'],
    template: 'hr',
    colors: {
      primary: '#6b7280',
      secondary: '#4b5563',
      accent: '#9ca3af'
    }
  },
  {
    id: 'legal-counsel',
    name: 'Pieter van der Berg',
    title: 'Senior Corporate Counsel',
    email: 'pieter.vanderberg@lawfirm.com',
    phone: '+1 (617) 555-3691',
    location: 'Boston, MA',
    linkedin: 'linkedin.com/in/pieter-vanderberg-law',
    github: '',
    website: 'pieter-vanderberg.legal',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    summary: 'Experienced corporate attorney with 12+ years of expertise in commercial law, contract negotiation, and regulatory compliance. Proven track record of providing strategic legal counsel to Fortune 500 companies and high-growth startups.',
    experience: [
      {
        title: 'Senior Corporate Counsel',
        company: 'Apple Inc.',
        period: '2020 - Present',
        description: [
          'Led legal strategy for $2B+ international expansion initiatives',
          'Negotiated complex commercial agreements with suppliers and partners',
          'Managed team of 8 attorneys across multiple practice areas'
        ]
      },
      {
        title: 'Corporate Attorney',
        company: 'Skadden, Arps, Slate, Meagher & Flom LLP',
        period: '2016 - 2020',
        description: [
          'Represented clients in M&A transactions worth over $10B',
          'Advised on securities law compliance and corporate governance matters',
          'Drafted and negotiated complex commercial contracts and agreements'
        ]
      },
      {
        title: 'Associate Attorney',
        company: 'Latham & Watkins LLP',
        period: '2012 - 2016',
        description: [
          'Supported senior partners in high-stakes litigation and corporate matters',
          'Conducted due diligence for private equity and venture capital transactions',
          'Drafted legal memoranda and client communications'
        ]
      }
    ],
    education: [
      {
        degree: 'Juris Doctor (JD)',
        institution: 'Harvard Law School',
        period: '2009 - 2012',
        gpa: '3.9/4.0'
      },
      {
        degree: 'Bachelor of Political Science',
        institution: 'Yale University',
        period: '2005 - 2009',
        gpa: '3.8/4.0'
      }
    ],
    skills: ['Corporate Law', 'Contract Negotiation', 'M&A', 'Securities Law', 'Regulatory Compliance', 'Risk Management', 'Legal Research', 'Client Relations'],
    languages: ['English (Native)', 'Mandarin (Fluent)', 'Japanese (Conversational)'],
    certifications: ['Admitted to New York Bar', 'Admitted to California Bar', 'Certified Information Privacy Professional (CIPP)'],
    projects: [
      {
        name: 'International Compliance Framework',
        description: 'Developed comprehensive compliance framework for operations in 15 countries',
        tech: ['Legal Research Tools', 'Contract Management Systems', 'Compliance Software']
      }
    ],
    interests: ['Corporate Governance', 'International Law', 'Golf', 'Classical Music'],
    template: 'legal',
    colors: {
      primary: '#000000',
      secondary: '#1f2937',
      accent: '#374151'
    }
  }
];

const CVCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cvTemplates.length);
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cvTemplates.length);
  };

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cvTemplates.length) % cvTemplates.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const renderCV = (cv: CVDummyData) => {
    // Add rotation based on CV index for variety
    const cvIndex = cvTemplates.findIndex(template => template.id === cv.id);
    const rotationAngle = (cvIndex * 2) - 6; // Rotate from -6 to +6 degrees
    
    return (
      <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Header */}
              <div className="bg-gradient-to-r p-4" style={{ background: `linear-gradient(135deg, ${cv.colors.primary}, ${cv.colors.secondary})` }}>
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-xl"
                    style={{ transform: `rotate(${rotationAngle}deg)` }}
                  >
              <img 
                src={cv.photoUrl} 
                alt={cv.name}
                className="w-full h-full object-cover"
                style={{ imageRendering: 'crisp-edges' }}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/150x150/cccccc/666666?text=Photo';
                }}
              />
            </div>
                  <div className="text-white">
                    <h1 className="text-xl font-bold tracking-tight">{cv.name}</h1>
                    <h2 className="text-base font-semibold opacity-95 mt-1">{cv.title}</h2>
                    <div className="flex items-center mt-2 text-sm">
                  <FaMapMarkerAlt className="mr-2" />
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{cv.location}</span>
              </div>
            </div>
          </div>
        </div>

              {/* Content */}
              <div className="p-4 space-y-3 overflow-y-auto" style={{ 
                height: 'calc(100% - 140px)',
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e1 #f1f5f9'
              }}>
          {/* Summary */}
          <div>
                  <h3 className="text-sm font-bold mb-2 flex items-center text-gray-800" style={{ color: cv.colors.primary }}>
                    <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: cv.colors.accent }}></div>
              Professional Summary
            </h3>
                  <p className="text-gray-700 text-xs leading-relaxed">{cv.summary}</p>
          </div>

          {/* Experience */}
          <div>
                  <h3 className="text-sm font-bold mb-2 flex items-center text-gray-800" style={{ color: cv.colors.primary }}>
                    <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: cv.colors.accent }}></div>
              Experience
            </h3>
                  <div className="space-y-2">
                    {cv.experience.slice(0, 3).map((exp, index) => (
                      <div key={index} className="border-l-3 pl-3" style={{ borderColor: cv.colors.accent }}>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-gray-900 text-xs">{exp.title}</h4>
                          <span className="text-xs text-gray-500 font-medium">{exp.period}</span>
                        </div>
                        <p className="font-semibold text-gray-700 text-xs mb-1">{exp.company}</p>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {exp.description.slice(0, 3).map((desc, i) => (
                            <li key={i} className="flex items-start">
                              <span className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 mr-2 flex-shrink-0"></span>
                              <span className="leading-relaxed">{desc}</span>
                            </li>
                          ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

                {/* Skills */}
                <div>
                  <h3 className="text-sm font-bold mb-2 flex items-center text-gray-800" style={{ color: cv.colors.primary }}>
                    <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: cv.colors.accent }}></div>
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {cv.skills.slice(0, 12).map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                        style={{ backgroundColor: cv.colors.accent }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-sm font-bold mb-2 flex items-center text-gray-800" style={{ color: cv.colors.primary }}>
                    <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: cv.colors.accent }}></div>
                    Education
                  </h3>
                  <div className="space-y-2">
                    {cv.education.map((edu, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900 text-xs">{edu.degree}</h4>
                          <p className="text-gray-700 text-xs font-medium">{edu.institution}</p>
                          {edu.gpa && <p className="text-xs text-gray-500 font-medium">GPA: {edu.gpa}</p>}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{edu.period}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="text-sm font-bold mb-2 flex items-center text-gray-800" style={{ color: cv.colors.primary }}>
                    <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: cv.colors.accent }}></div>
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {cv.languages.slice(0, 3).map((lang, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 rounded-full text-xs font-medium text-gray-700 bg-gray-100"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="text-sm font-bold mb-2 flex items-center text-gray-800" style={{ color: cv.colors.primary }}>
                    <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: cv.colors.accent }}></div>
                    Certifications
                  </h3>
                  <div className="space-y-1">
                    {cv.certifications.slice(0, 2).map((cert, index) => (
                      <div key={index} className="text-xs text-gray-600">
                        • {cert}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <h3 className="text-sm font-bold mb-2 flex items-center text-gray-800" style={{ color: cv.colors.primary }}>
                    <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: cv.colors.accent }}></div>
                    Key Projects
                  </h3>
                  <div className="space-y-1">
                    {cv.projects.slice(0, 1).map((project, index) => (
                      <div key={index} className="text-xs">
                        <div className="font-semibold text-gray-900">{project.name}</div>
                        <div className="text-gray-600">{project.description}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.tech.slice(0, 3).map((tech, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-[720px] flex items-center justify-end pr-8">
      {/* Slicebox Container */}
      <div className="container" style={{ margin: 0, width: '540px', height: '720px' }}>
        <div className="wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Slicebox Slider */}
          <ul id="sb-slider" className="sb-slider">
            {cvTemplates.map((cv, index) => {
              const isCurrent = index === currentIndex;
              const isNext = index === (currentIndex + 1) % cvTemplates.length;
              const isPrev = index === (currentIndex - 1 + cvTemplates.length) % cvTemplates.length;
              
              let className = '';
              if (isCurrent) className = 'sb-current';
              else if (isNext) className = 'sb-next';
              else if (isPrev) className = 'sb-prev';
              
              return (
                <li key={cv.id} className={className}>
                  <div className="cv-container" style={{ width: '100%', height: '100%', position: 'relative', padding: '4px', boxSizing: 'border-box' }}>
              {renderCV(cv)}
            </div>
                </li>
              );
            })}
          </ul>

          {/* Shadow Effect */}
          <div id="shadow" className="shadow"></div>
          
          {/* Navigation Arrows */}
          <div id="nav-arrows" className="nav-arrows">
            <a href="#" onClick={(e) => { e.preventDefault(); goToNext(); }}>Next</a>
            <a href="#" onClick={(e) => { e.preventDefault(); goToPrevious(); }}>Previous</a>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .container {
          margin: 0;
          width: 500px;
          height: 650px;
        }

        .wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .sb-slider {
          margin: 0;
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 100%;
          list-style-type: none;
          padding: 0;
        }

        .sb-slider li {
          margin: 0;
          padding: 0;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          transition: all 1200ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sb-slider li.sb-current {
          transform: translateX(0) rotateY(0deg);
          opacity: 1;
          z-index: 3;
        }

        .sb-slider li.sb-current .cv-container {
          animation: sliceboxIn 1200ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .sb-slider li.sb-next {
          transform: translateX(0) rotateY(0deg);
          opacity: 0;
          z-index: 1;
        }

        .sb-slider li.sb-prev {
          transform: translateX(0) rotateY(0deg);
          opacity: 0;
          z-index: 1;
        }

        .sb-slider li:not(.sb-current):not(.sb-next):not(.sb-prev) {
          transform: translateX(0) rotateY(0deg);
          opacity: 0;
          z-index: 1;
        }

        @keyframes sliceboxIn {
          0% {
            transform: perspective(1000px) rotateY(90deg) translateZ(-200px);
            opacity: 0;
          }
          25% {
            transform: perspective(1000px) rotateY(45deg) translateZ(-100px);
            opacity: 0.5;
          }
          50% {
            transform: perspective(1000px) rotateY(0deg) translateZ(0px);
            opacity: 1;
          }
          100% {
            transform: perspective(1000px) rotateY(0deg) translateZ(0px);
            opacity: 1;
          }
        }

        @keyframes sliceboxOut {
          0% {
            transform: perspective(1000px) rotateY(0deg) translateZ(0px);
            opacity: 1;
          }
          25% {
            transform: perspective(1000px) rotateY(-45deg) translateZ(-100px);
            opacity: 0.5;
          }
          50% {
            transform: perspective(1000px) rotateY(-90deg) translateZ(-200px);
            opacity: 0;
          }
          100% {
            transform: perspective(1000px) rotateY(-90deg) translateZ(-200px);
            opacity: 0;
          }
        }

        .cv-container {
          width: 100%;
          height: 100%;
          position: relative;
          padding: 4px;
          box-sizing: border-box;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }


        .shadow {
          width: 100%;
          height: 50px;
          position: absolute;
          bottom: 0;
          left: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
          z-index: -1;
          pointer-events: none;
        }

        .nav-arrows {
          position: absolute;
          top: 50%;
          left: -60px;
          right: -60px;
          transform: translateY(-50%);
          z-index: 10;
        }

        .nav-arrows a {
          width: 42px;
          height: 42px;
          background: rgba(255,255,255,0.2);
          position: absolute;
          top: 50%;
          left: 0;
          text-indent: -9000px;
          cursor: pointer;
          margin-top: -21px;
          opacity: 0.9;
          border-radius: 50%;
          box-shadow: 0 1px 1px rgba(255,255,255,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 200ms;
        }

        .nav-arrows a:first-child {
          left: auto;
          right: 0;
        }

        .nav-arrows a:hover {
          opacity: 1;
          background: rgba(255,255,255,0.3);
        }

        .nav-arrows a::before {
          content: '';
          width: 0;
          height: 0;
          border-style: solid;
        }

        .nav-arrows a:first-child::before {
          border-width: 8px 0 8px 12px;
          border-color: transparent transparent transparent white;
        }

              .nav-arrows a:last-child::before {
                border-width: 8px 12px 8px 0;
                border-color: transparent white transparent transparent;
              }

              /* Custom thin scrollbar */
              .cv-container ::-webkit-scrollbar {
                width: 4px;
              }

              .cv-container ::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 2px;
              }

              .cv-container ::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 2px;
                transition: background 0.2s ease;
              }

              .cv-container ::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
              }

              /* Firefox scrollbar */
              .cv-container {
                scrollbar-width: thin;
                scrollbar-color: #cbd5e1 #f1f5f9;
              }
            `}</style>
    </div>
  );
};

export default CVCarousel;