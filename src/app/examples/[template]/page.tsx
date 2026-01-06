'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import PDFPreviewClient from '@/components/PDFPreviewClient';
import CVPreviewWithPagination from '@/components/CVPreviewWithPagination';
import { 
  FaArrowLeft, 
  FaDownload, 
  FaLaptopCode, 
  FaLightbulb, 
  FaBalanceScale, 
  FaCrown,
  FaFeatherAlt,
  FaGraduationCap,
  FaRocket,
  FaHeart,
  FaChartBar,
  FaUsers,
  FaHandshake
} from 'react-icons/fa';

const sampleData: Record<string, any> = {
  modern: {
    fullName: 'Alex Morgan',
    title: 'Senior Software Engineer',
    contact: { email: 'alex.morgan@example.com', phone: '555-123-4567', location: 'San Francisco, CA' },
    summary: 'Experienced engineer with 8+ years building scalable web applications and microservices architecture. Passionate about building robust, user-focused products and leading high-performing teams.',
    experience: [
      {
        title: 'Senior Software Engineer at TechCorp (2020-Present)',
        content: [
          'Led development team of 8 engineers to deliver payment system processing $50M+ monthly',
          'Reduced server costs by 35% through microservices optimization and cloud migration',
          'Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes',
        ],
      },
      {
        title: 'Full Stack Developer at InnovateSoft (2017-2020)',
        content: [
          'Developed multiple client projects using React, Angular, and Node.js',
          'Built an e-commerce platform that increased client conversion rate by 28%',
        ],
      },
    ],
    education: [
      { title: 'B.S. Computer Science, Stanford University', content: ['2013-2017'] },
    ],
    skills: ['JavaScript', 'Python', 'AWS', 'Docker', 'Kubernetes', 'React', 'Node.js'],
    languages: ['English (Native)', 'Spanish (Professional)'],
    hobbies: ['Photography', 'Cycling', 'Chess'],
    certifications: [
      { title: 'AWS Certified Solutions Architect', content: ['2021'] },
    ],
    projects: [
      { title: 'Open Source Contributor', content: ['Contributed to several popular Node.js libraries and led a major refactor for a React-based UI toolkit.'] },
    ],
    photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  creative: {
    fullName: 'Taylor Brooks',
    title: 'Creative Director',
    contact: { email: 'taylor.brooks@example.com', phone: '555-987-6543', location: 'New York, NY' },
    summary: 'Award-winning creative with a passion for branding, design, and storytelling. Expert in leading cross-functional teams and delivering innovative campaigns.',
    experience: [
      {
        title: 'Creative Director at Brandify (2018-Present)',
        content: [
          'Directed campaigns for Fortune 500 brands, resulting in 3 international design awards.',
          'Managed a creative team of 12, fostering a culture of innovation and collaboration.',
        ],
      },
      {
        title: 'Art Director at StudioX (2015-2018)',
        content: [
          'Developed brand identities for 20+ startups.',
          'Mentored junior designers and improved workflow efficiency by 25%.',
        ],
      },
    ],
    education: [
      { title: 'B.A. Graphic Design, Parsons School of Design', content: ['2011-2015'] },
    ],
    skills: ['Branding', 'Adobe Creative Suite', 'Illustration', 'UI/UX', 'Team Leadership', 'Storytelling'],
    languages: ['English (Native)', 'French (Conversational)'],
    hobbies: ['Painting', 'Travel', 'Photography'],
    certifications: [
      { title: 'Certified Brand Strategist', content: ['2019'] },
    ],
    projects: [
      { title: 'Brand Refresh for Acme Inc.', content: ['Led a full rebrand for a major tech company, increasing brand recognition by 40%.'] },
    ],
    photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  classic: {
    fullName: 'Jordan Lee',
    title: 'Accountant',
    contact: { email: 'jordan.lee@example.com', phone: '555-222-3333', location: 'Chicago, IL' },
    summary: 'Detail-oriented accountant with 10 years in finance. Skilled in tax preparation, budgeting, and financial analysis for large organizations.',
    experience: [
      {
        title: 'Senior Accountant at FinCorp (2016-Present)',
        content: [
          'Managed $10M+ in annual budgets and streamlined reporting processes.',
          'Implemented new tax compliance procedures, reducing errors by 20%.',
        ],
      },
      {
        title: 'Accountant at Numbers LLC (2012-2016)',
        content: [
          'Prepared tax returns for 100+ clients and provided financial consulting.',
        ],
      },
    ],
    education: [
      { title: 'B.Sc. Accounting, University of Illinois', content: ['2008-2012'] },
    ],
    skills: ['Accounting', 'Excel', 'QuickBooks', 'Tax Preparation', 'Financial Analysis', 'Budgeting'],
    languages: ['English (Native)'],
    hobbies: ['Chess', 'Reading', 'Cooking'],
    certifications: [
      { title: 'CPA', content: ['2014'] },
    ],
    projects: [
      { title: 'Financial Audit for City of Chicago', content: ['Led a successful audit for a major municipality, identifying $500K in savings.'] },
    ],
    photoUrl: 'https://randomuser.me/api/portraits/men/65.jpg',
  },
  executive: {
    fullName: 'Morgan Smith',
    title: 'Chief Operations Officer',
    contact: { email: 'morgan.smith@example.com', phone: '555-444-5555', location: 'Boston, MA' },
    summary: 'COO with a track record of scaling startups to global reach. Expert in agile operations, international expansion, and team leadership.',
    experience: [
      {
        title: 'COO at ScaleUp (2019-Present)',
        content: [
          'Scaled company from 10 to 200 employees and implemented agile operations company-wide.',
          'Expanded operations into 5 new countries, increasing revenue by 60%.',
        ],
      },
      {
        title: 'Operations Manager at BizGrow (2015-2019)',
        content: [
          'Optimized supply chain for 3 international offices, reducing costs by 18%.',
        ],
      },
    ],
    education: [
      { title: 'MBA, Harvard Business School', content: ['2013-2015'] },
    ],
    skills: ['Operations', 'Leadership', 'Agile', 'Supply Chain', 'International Expansion', 'Strategic Planning'],
    languages: ['English (Native)', 'German (Conversational)'],
    hobbies: ['Golf', 'Travel', 'Mentoring'],
    certifications: [
      { title: 'PMP', content: ['2016'] },
    ],
    projects: [
      { title: 'Global Expansion Project', content: ['Led expansion into 5 new countries, building local teams and infrastructure.'] },
    ],
    photoUrl: 'https://randomuser.me/api/portraits/men/43.jpg',
  },
  minimal: {
    fullName: 'Jamie Chen',
    title: 'UX Designer',
    contact: { email: 'jamie.chen@example.com', phone: '555-777-8888', location: 'Seattle, WA' },
    summary: 'Minimalist designer focused on user-centric web experiences and accessibility. Passionate about creating clean, intuitive interfaces that solve real user problems.',
    experience: [
      {
        title: 'Senior UX Designer at DesignCorp (2019-Present)',
        content: [
          'Redesigned mobile app for 1M+ users improving usability scores by 40%',
          'Established design system used across 10+ products and 50+ designers',
          'Led accessibility audit achieving WCAG 2.1 AA compliance',
        ],
      },
      {
        title: 'UX Designer at StartupX (2017-2019)',
        content: [
          'Designed user flows for 5 major product features',
          'Conducted user research with 200+ participants',
        ],
      },
    ],
    education: [
      { title: 'B.S. Human-Computer Interaction, Carnegie Mellon', content: ['2013-2017'] },
    ],
    skills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'Accessibility', 'Design Systems'],
    languages: ['English (Native)', 'Mandarin (Conversational)'],
    hobbies: ['Hiking', 'Photography', 'Cooking'],
    certifications: [
      { title: 'Google UX Design Certificate', content: ['2020'] },
    ],
    projects: [
      { title: 'Design System Implementation', content: ['Created comprehensive design system used by 50+ designers across multiple products.'] },
    ],
    photoUrl: 'https://randomuser.me/api/portraits/women/28.jpg',
  },
  academic: {
    fullName: 'Dr. Casey Patel',
    title: 'Research Scientist',
    contact: { email: 'casey.patel@example.com', phone: '555-999-0000', location: 'Cambridge, MA' },
    summary: 'PhD in Biology with 20+ publications in peer-reviewed journals. Expert in molecular biology and genetic research with a focus on disease prevention.',
    experience: [
      {
        title: 'Senior Research Scientist at BioTech Labs (2018-Present)',
        content: [
          'Published 15+ papers in Nature, Science, and Cell journals',
          'Led 3 international research projects with $2M+ in funding',
          'Mentored 12 graduate students and postdoctoral researchers',
        ],
      },
      {
        title: 'Postdoctoral Researcher at MIT (2015-2018)',
        content: [
          'Conducted breakthrough research in genetic engineering',
          'Published 8 peer-reviewed papers in top-tier journals',
        ],
      },
    ],
    education: [
      { title: 'Ph.D. Biology, MIT', content: ['2011-2015'] },
      { title: 'B.S. Biology, Stanford University', content: ['2007-2011'] },
    ],
    skills: ['Research Design', 'Data Analysis', 'Grant Writing', 'Laboratory Management', 'Scientific Writing'],
    languages: ['English (Native)', 'Hindi (Fluent)'],
    hobbies: ['Reading', 'Tennis', 'Travel'],
    certifications: [
      { title: 'Laboratory Safety Certification', content: ['2016'] },
    ],
    projects: [
      { title: 'CRISPR Gene Editing Research', content: ['Led pioneering research in CRISPR technology for disease treatment.'] },
    ],
    photoUrl: 'https://randomuser.me/api/portraits/men/55.jpg',
  },
  tech: {
    fullName: 'Samir Gupta',
    title: 'DevOps Engineer',
    contact: { email: 'samir.gupta@example.com', phone: '555-111-2222', location: 'Austin, TX' },
    summary: 'Cloud and automation expert specializing in scalable infrastructure. Passionate about building reliable, efficient systems that support rapid development.',
    experience: [
      {
        title: 'Senior DevOps Engineer at CloudCorp (2020-Present)',
        content: [
          'Automated CI/CD pipeline for 30+ microservices reducing deployment failures by 90%',
          'Migrated legacy systems to AWS saving $200K annually in infrastructure costs',
          'Implemented monitoring and alerting system with 99.9% uptime',
        ],
      },
      {
        title: 'Systems Engineer at TechStartup (2018-2020)',
        content: [
          'Built infrastructure for 10+ applications using Docker and Kubernetes',
          'Reduced deployment time from 2 hours to 15 minutes',
        ],
      },
    ],
    education: [
      { title: 'B.S. Computer Engineering, UC Berkeley', content: ['2014-2018'] },
    ],
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Python', 'Linux'],
    languages: ['English (Native)', 'Hindi (Fluent)'],
    hobbies: ['Gaming', 'Cooking', 'Hiking'],
    certifications: [
      { title: 'AWS Certified Solutions Architect', content: ['2019'] },
      { title: 'Kubernetes Administrator', content: ['2020'] },
    ],
    projects: [
      { title: 'Infrastructure as Code Implementation', content: ['Migrated entire infrastructure to Terraform, reducing provisioning time by 80%.'] },
    ],
    photoUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
  },
  startup: {
    fullName: 'Riley Kim',
    title: 'Startup Founder',
    contact: { email: 'riley.kim@example.com', phone: '555-333-4444', location: 'San Francisco, CA' },
    summary: 'Serial entrepreneur with 2 successful exits in SaaS and fintech. Expert in product strategy, fundraising, and building high-performing teams.',
    experience: [
      {
        title: 'Founder & CEO at FinTech Startup (2019-Present)',
        content: [
          'Founded and sold 2 SaaS startups for $15M and $45M respectively',
          'Raised $5M+ in venture funding from top-tier investors',
          'Built and led teams of 50+ employees across multiple companies',
        ],
      },
      {
        title: 'Product Manager at BigTech (2017-2019)',
        content: [
          'Launched 3 major product features used by 10M+ users',
          'Led cross-functional teams of 20+ engineers and designers',
        ],
      },
    ],
    education: [
      { title: 'B.S. Computer Science, Stanford University', content: ['2013-2017'] },
    ],
    skills: ['Product Strategy', 'Fundraising', 'Team Building', 'Go-to-Market', 'Business Development'],
    languages: ['English (Native)', 'Korean (Fluent)'],
    hobbies: ['Surfing', 'Reading', 'Mentoring'],
    certifications: [
      { title: 'Y Combinator Alumni', content: ['2019'] },
    ],
    projects: [
      { title: 'FinTech Platform Launch', content: ['Built and launched financial technology platform serving 100K+ users.'] },
    ],
    photoUrl: 'https://randomuser.me/api/portraits/women/39.jpg',
  },
  healthcare: {
    fullName: 'Dr. Sarah Johnson',
    title: 'Registered Nurse',
    contact: { email: 'sarah.johnson@example.com', phone: '555-555-6666', location: 'Boston, MA' },
    summary: 'Compassionate RN with 8+ years in critical care and emergency medicine. Dedicated to providing exceptional patient care and mentoring new healthcare professionals.',
    experience: [
      {
        title: 'Critical Care Nurse at City Hospital (2018-Present)',
        content: [
          'Provided critical care to 500+ patients in ICU with 98% survival rate',
          'Led emergency response team during major incidents',
          'Mentored 20+ nursing students and new RNs',
        ],
      },
      {
        title: 'Emergency Room Nurse at Community Hospital (2015-2018)',
        content: [
          'Treated 1000+ patients in high-pressure emergency environment',
          'Implemented new triage protocols improving patient outcomes',
        ],
      },
    ],
    education: [
      { title: 'B.S. Nursing, Johns Hopkins University', content: ['2011-2015'] },
    ],
    skills: ['Critical Care', 'Emergency Medicine', 'Patient Assessment', 'IV Therapy', 'CPR Certified'],
    languages: ['English (Native)', 'Spanish (Conversational)'],
    hobbies: ['Yoga', 'Reading', 'Volunteering'],
    certifications: [
      { title: 'Advanced Cardiac Life Support', content: ['2016'] },
      { title: 'Pediatric Advanced Life Support', content: ['2017'] },
    ],
    projects: [
      { title: 'Emergency Response Protocol', content: ['Developed and implemented new emergency response protocols used hospital-wide.'] },
    ],
    photoUrl: 'https://randomuser.me/api/portraits/women/45.jpg',
  },
  sales: {
    fullName: 'Marcus Rodriguez',
    title: 'Sales Director',
    contact: { email: 'marcus.rodriguez@example.com', phone: '555-777-8888', location: 'Chicago, IL' },
    summary: 'Results-driven sales leader with 12+ years exceeding targets. Expert in building high-performing sales teams and closing enterprise deals.',
    experience: [
      {
        title: 'Sales Director at Enterprise Corp (2019-Present)',
        content: [
          'Exceeded annual sales targets by 150% for 3 consecutive years',
          'Built and managed sales team of 25 representatives',
          'Closed $10M+ in enterprise deals with Fortune 500 companies',
        ],
      },
      {
        title: 'Senior Sales Manager at TechSales (2016-2019)',
        content: [
          'Led team of 15 sales representatives to $50M+ in annual revenue',
          'Developed new sales strategies increasing conversion rates by 35%',
        ],
      },
    ],
    education: [
      { title: 'B.S. Business Administration, UCLA', content: ['2010-2014'] },
    ],
    skills: ['CRM Systems', 'Sales Strategy', 'Team Leadership', 'Negotiation', 'Pipeline Management'],
    languages: ['English (Native)', 'Spanish (Fluent)'],
    hobbies: ['Golf', 'Networking', 'Travel'],
    certifications: [
      { title: 'Salesforce Certified Administrator', content: ['2018'] },
    ],
    projects: [
      { title: 'Enterprise Sales Process', content: ['Designed and implemented new enterprise sales process increasing deal size by 40%.'] },
    ],
    photoUrl: 'https://randomuser.me/api/portraits/men/78.jpg',
  },
  admin: {
    fullName: 'Jennifer Park',
    title: 'Office Manager',
    contact: { email: 'jennifer.park@example.com', phone: '555-999-0000', location: 'Seattle, WA' },
    summary: 'Organized and efficient administrator with 10+ years in office management. Expert in streamlining operations and supporting executive teams.',
    experience: [
      {
        title: 'Office Manager at Corporate Inc (2018-Present)',
        content: [
          'Managed office operations for 100+ employee company',
          'Reduced operational costs by 25% through process optimization',
          'Coordinated events and meetings for executive team',
        ],
      },
      {
        title: 'Administrative Assistant at StartupY (2015-2018)',
        content: [
          'Supported 3 C-level executives with scheduling and travel',
          'Managed office supplies and vendor relationships',
        ],
      },
    ],
    education: [
      { title: 'B.A. Business Administration, University of Washington', content: ['2011-2015'] },
    ],
    skills: ['Microsoft Office', 'Project Management', 'Event Planning', 'Budget Management', 'HR Support'],
    languages: ['English (Native)', 'Korean (Conversational)'],
    hobbies: ['Organizing', 'Cooking', 'Gardening'],
    certifications: [
      { title: 'Project Management Professional', content: ['2017'] },
    ],
    projects: [
      { title: 'Office Relocation Project', content: ['Successfully managed office relocation for 100+ employees with zero downtime.'] },
    ],
    photoUrl: 'https://randomuser.me/api/portraits/women/52.jpg',
  },
  nonprofit: {
    fullName: 'David Thompson',
    title: 'Program Director',
    contact: { email: 'david.thompson@example.com', phone: '555-111-2222', location: 'Portland, OR' },
    summary: 'Mission-driven leader with 15+ years in non-profit program management. Passionate about creating positive social impact and building community partnerships.',
    experience: [
      {
        title: 'Program Director at Community Foundation (2017-Present)',
        content: [
          'Managed $2M+ annual budget for youth development programs',
          'Increased program participation by 300% through strategic partnerships',
          'Led team of 15 staff serving 5,000+ community members annually',
        ],
      },
      {
        title: 'Program Manager at Youth Services (2014-2017)',
        content: [
          'Developed and implemented 5 new youth programs',
          'Secured $500K+ in grant funding for community initiatives',
        ],
      },
    ],
    education: [
      { title: 'M.S. Non-Profit Management, NYU', content: ['2012-2014'] },
      { title: 'B.A. Social Work, University of Oregon', content: ['2008-2012'] },
    ],
    skills: ['Grant Writing', 'Program Development', 'Community Outreach', 'Volunteer Management', 'Fundraising'],
    languages: ['English (Native)', 'Spanish (Conversational)'],
    hobbies: ['Volunteering', 'Hiking', 'Community Events'],
    certifications: [
      { title: 'Grant Writing Certification', content: ['2015'] },
    ],
    projects: [
      { title: 'Community Partnership Initiative', content: ['Built partnerships with 20+ local organizations to expand program reach.'] },
    ],
    photoUrl: 'https://randomuser.me/api/portraits/men/89.jpg',
  },
};

const templateNames: Record<string, string> = {
  modern: 'Modern',
  creative: 'Creative',
  classic: 'Classic',
  executive: 'Executive',
  minimal: 'Minimal',
  academic: 'Academic',
  tech: 'Tech',
  startup: 'Startup',
  healthcare: 'Healthcare',
  sales: 'Sales',
  admin: 'Administrative',
  nonprofit: 'Non-Profit',
};

const templateStyles: Record<string, { color: string; icon: JSX.Element; gradient: string }> = {
  modern: {
    color: '#2563eb',
    icon: <FaLaptopCode className="w-6 h-6" />,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  creative: {
    color: '#a855f7',
    icon: <FaLightbulb className="w-6 h-6" />,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  classic: {
    color: '#1e293b',
    icon: <FaBalanceScale className="w-6 h-6" />,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  executive: {
    color: '#18181b',
    icon: <FaCrown className="w-6 h-6" />,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  minimal: {
    color: '#0f172a',
    icon: <FaFeatherAlt className="w-6 h-6" />,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  academic: {
    color: '#1e40af',
    icon: <FaGraduationCap className="w-6 h-6" />,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  tech: {
    color: '#10b981',
    icon: <FaLaptopCode className="w-6 h-6" />,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  startup: {
    color: '#8b5cf6',
    icon: <FaRocket className="w-6 h-6" />,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  healthcare: {
    color: '#dc2626',
    icon: <FaHeart className="w-6 h-6" />,
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
  },
  sales: {
    color: '#059669',
    icon: <FaChartBar className="w-6 h-6" />,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  admin: {
    color: '#7c3aed',
    icon: <FaUsers className="w-6 h-6" />,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  nonprofit: {
    color: '#ea580c',
    icon: <FaHandshake className="w-6 h-6" />,
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  },
};

export default function ExampleViewerPage() {
  const params = useParams();
  const router = useRouter();
  const template = params?.template as string;
  const data = sampleData[template];
  const name = templateNames[template];
  const [isLoading, setIsLoading] = useState(true);
  const [showPDFPreview, setShowPDFPreview] = useState(true);
  const style = templateStyles[template] || templateStyles.modern;

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [template]);

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Template Not Found</h1>
            <p className="text-gray-600 mb-6">The requested template doesn't exist.</p>
            <button
              onClick={() => router.push('/builder')}
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
            >
              <FaArrowLeft className="mr-2" />
              Back to Builder
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/builder')}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition duration-200"
              >
                <FaArrowLeft className="mr-2" />
                Back to Builder
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg" style={{ background: style.gradient }}>
                  <div className="text-white">{style.icon}</div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{name} Template</h1>
                  <p className="text-sm text-gray-500">PDF Example Preview</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowPDFPreview(true)}
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
            >
              <FaLaptopCode className="mr-2" />
              Show PDF Preview
            </button>
          </div>
        </div>
      </div>

      <main className="flex-grow bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading PDF preview...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {data.fullName} - {data.title}
                  </h2>
                  <p className="text-gray-600">
                    Professional resume example using the {name} template
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  {showPDFPreview && (
                    <PDFPreviewClient data={data} onClose={() => setShowPDFPreview(false)} />
                  )}
                  <CVPreviewWithPagination data={data} />
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500 mb-4">
                    This is a preview of how your resume will look with the {name} template
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      Professional formatting
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      Print-ready
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                      ATS-friendly
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 