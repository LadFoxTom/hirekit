import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
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

    // Test PDF generation
    const pdfResponse = await fetch(`${request.nextUrl.origin}/api/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cvData: testCVData, fileName: 'test-cv' }),
    })

    // Test DOCX generation
    const docxResponse = await fetch(`${request.nextUrl.origin}/api/export/docx`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cvData: testCVData }),
    })

    return NextResponse.json({
      success: true,
      message: 'Export endpoints test completed',
      results: {
        pdf: {
          status: pdfResponse.status,
          ok: pdfResponse.ok,
          contentType: pdfResponse.headers.get('content-type'),
        },
        docx: {
          status: docxResponse.status,
          ok: docxResponse.ok,
          contentType: docxResponse.headers.get('content-type'),
        }
      }
    })
  } catch (error) {
    console.error('Test export endpoints error:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 