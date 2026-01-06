import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test letter data
    const testLetterData = {
      senderName: 'John Doe',
      senderTitle: 'Software Engineer',
      senderEmail: 'john.doe@email.com',
      senderPhone: '+1 (555) 123-4567',
      senderAddress: '123 Main Street\nNew York, NY 10001',
      recipientName: 'Jane Smith',
      recipientTitle: 'Hiring Manager',
      companyName: 'Tech Corp',
      companyAddress: '456 Business Ave\nSan Francisco, CA 94102',
      subject: 'Application for Senior Software Engineer Position',
      opening: 'I am writing to express my strong interest in the Senior Software Engineer position at Tech Corp.',
      body: [
        'With over 5 years of experience in software development, I have successfully led multiple projects and delivered high-quality solutions that have improved user experience and system performance.',
        'My expertise includes full-stack development, cloud architecture, and team leadership. I am particularly excited about Tech Corp\'s innovative approach to solving complex problems and would be thrilled to contribute to your mission.'
      ],
      closing: 'I am excited about the opportunity to contribute to Tech Corp and would welcome the chance to discuss how my skills and experience align with your needs.',
      signature: 'John Doe',
      template: 'professional',
      layout: {
        showDate: true,
        showAddress: true,
        showSubject: true
      },
      applicationDate: '2024-01-15'
    }

    // Test CV data
    const testCVData = {
      fullName: 'John Doe',
      title: 'Senior Software Engineer',
      contact: {
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY'
      },
      socialLinks: {
        linkedin: 'linkedin.com/in/johndoe',
        github: 'github.com/johndoe',
        website: 'johndoe.dev'
      },
      summary: [
        'Experienced software engineer with 5+ years of expertise in full-stack development, cloud architecture, and team leadership.',
        'Passionate about creating scalable solutions and mentoring junior developers.'
      ],
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          period: '2022 - Present',
          achievements: [
            'Led development of microservices architecture serving 1M+ users',
            'Mentored 3 junior developers and improved team productivity by 25%',
            'Implemented CI/CD pipeline reducing deployment time by 60%'
          ]
        },
        {
          title: 'Software Engineer',
          company: 'Startup Inc',
          period: '2020 - 2022',
          achievements: [
            'Developed RESTful APIs using Node.js and Express',
            'Built responsive web applications with React and TypeScript',
            'Collaborated with cross-functional teams to deliver features on time'
          ]
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of Technology',
          period: '2016 - 2020',
          description: 'Graduated with honors. Relevant coursework: Data Structures, Algorithms, Software Engineering'
        }
      ],
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes'],
      languages: [
        { language: 'English', level: 'Native' },
        { language: 'Spanish', level: 'Fluent' }
      ],
      certifications: [
        {
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          date: '2023',
          description: 'Demonstrated expertise in designing distributed systems on AWS'
        }
      ],
      projects: [
        {
          name: 'E-commerce Platform',
          technologies: 'React, Node.js, MongoDB, Stripe',
          description: 'Built a full-stack e-commerce platform with payment integration and admin dashboard'
        }
      ],
      hobbies: ['Open Source Contribution', 'Hiking', 'Photography'],
      template: 'modern',
      layout: {
        sidebarPosition: 'left',
        showIcons: true
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Export functionality is ready for testing',
      testData: {
        letter: testLetterData,
        cv: testCVData
      }
    })
  } catch (error) {
    console.error('Test export error:', error)
    return NextResponse.json(
      { error: 'Test failed' },
      { status: 500 }
    )
  }
} 