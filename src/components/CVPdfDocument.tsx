'use client'
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CVData } from '@/types/cv';
import { CV_TEMPLATES } from '@/types/cv';

// Create dynamic styles based on CV data
const createStyles = (data: CVData) => {
  const template = CV_TEMPLATES.find((t) => t.id === data.template) || CV_TEMPLATES[0];
  const templateStyles = {
    ...template.styles,
    accentColor: data.layout?.accentColor || template.styles.accentColor
  };

  return StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 30,
      fontSize: 11,
      lineHeight: 1.4,
      fontFamily: 'Helvetica',
    },
    header: {
      marginBottom: 20,
      textAlign: 'center',
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
      color: templateStyles.primaryColor || '#2c3e50',
    },
    title: {
      fontSize: 16,
      marginBottom: 10,
      color: templateStyles.secondaryColor || '#7f8c8d',
    },
    contact: {
      fontSize: 10,
      color: templateStyles.secondaryColor || '#7f8c8d',
      marginBottom: 3,
    },
    section: {
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 8,
      color: templateStyles.primaryColor || '#2c3e50',
      borderBottom: `1pt solid ${templateStyles.accentColor || '#bdc3c7'}`,
      paddingBottom: 3,
    },
    experienceItem: {
      marginBottom: 12,
    },
    jobTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      color: templateStyles.primaryColor || '#2c3e50',
    },
    company: {
      fontSize: 11,
      color: templateStyles.secondaryColor || '#34495e',
      marginBottom: 2,
    },
    date: {
      fontSize: 9,
      color: templateStyles.secondaryColor || '#7f8c8d',
      fontStyle: 'italic',
      marginBottom: 4,
    },
    description: {
      fontSize: 10,
      color: templateStyles.secondaryColor || '#2c3e50',
      lineHeight: 1.3,
    },
    educationItem: {
      marginBottom: 10,
    },
    degree: {
      fontSize: 12,
      fontWeight: 'bold',
      color: templateStyles.primaryColor || '#2c3e50',
    },
    school: {
      fontSize: 11,
      color: templateStyles.secondaryColor || '#34495e',
      marginBottom: 2,
    },
    skillsList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 5,
    },
    skill: {
      backgroundColor: templateStyles.accentColor || '#ecf0f1',
      padding: '2pt 6pt',
      margin: '1pt 3pt 1pt 0',
      borderRadius: 3,
      fontSize: 9,
      color: templateStyles.primaryColor || '#2c3e50',
    },
    summary: {
      fontSize: 10,
      color: templateStyles.secondaryColor || '#2c3e50',
      lineHeight: 1.4,
      textAlign: 'justify',
    },
    pageNumber: {
      position: 'absolute',
      bottom: 20,
      right: 30,
      fontSize: 9,
      color: templateStyles.secondaryColor || '#7f8c8d',
    },
  });
};

// Helper to get skills array from various data formats
const getSkillsArray = (skills: CVData['skills']): string[] => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  return [
    ...(skills.technical || []),
    ...(skills.soft || []),
    ...(skills.tools || []),
    ...(skills.industry || [])
  ];
};

interface CVPDFDocumentProps {
  data: CVData;
}

export const CVPDFDocument: React.FC<CVPDFDocumentProps> = ({ data }) => {
  const styles = createStyles(data);
  const getSectionTitle = (sectionKey: string, defaultTitle: string) =>
    data.layout?.sectionTitles?.[sectionKey] || defaultTitle;
  const skillsArray = getSkillsArray(data.skills);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{data.fullName}</Text>
          {data.title && <Text style={styles.title}>{data.title}</Text>}
          <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
            {data.contact?.email && <Text style={styles.contact}>{data.contact.email}</Text>}
            {data.contact?.phone && <Text style={styles.contact}> | {data.contact.phone}</Text>}
            {data.contact?.location && <Text style={styles.contact}> | {data.contact.location}</Text>}
          </View>
        </View>
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{getSectionTitle('summary', 'Professional Summary')}</Text>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}
        {data.experience && data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{getSectionTitle('experience', 'Professional Experience')}</Text>
            {data.experience.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{exp.title}</Text>
                <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                  {exp.company && <Text style={styles.company}>{exp.company}</Text>}
                  {exp.company && exp.dates && <Text style={styles.company}> | </Text>}
                  {exp.dates && <Text style={styles.company}>{exp.dates}</Text>}
                </View>
                {(exp.achievements || exp.content) && (
                  <View style={{ marginTop: 4 }}>
                    {(exp.achievements || exp.content || []).map((item: string, i: number) => (
                      <Text key={i} style={styles.description}>* {item}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{getSectionTitle('education', 'Education')}</Text>
            {data.education.map((edu, index) => (
              <View key={index} style={styles.educationItem}>
                <Text style={styles.degree}>{edu.degree}</Text>
                <View style={{ flexDirection: 'row', marginBottom: 2 }}>
                  {edu.institution && <Text style={styles.school}>{edu.institution}</Text>}
                  {edu.institution && edu.dates && <Text style={styles.school}> | </Text>}
                  {edu.dates && <Text style={styles.school}>{edu.dates}</Text>}
                </View>
                {edu.field && <Text style={styles.description}>{edu.field}</Text>}
              </View>
            ))}
          </View>
        )}
        {skillsArray.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{getSectionTitle('skills', 'Skills')}</Text>
            <View style={styles.skillsList}>
              {skillsArray.map((skill: string, index: number) => (
                <Text key={index} style={styles.skill}>{skill}</Text>
              ))}
            </View>
          </View>
        )}
        {data.languages && data.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{getSectionTitle('languages', 'Languages')}</Text>
            <View style={styles.skillsList}>
              {data.languages.map((lang: string, index: number) => (
                <Text key={index} style={styles.skill}>{lang}</Text>
              ))}
            </View>
          </View>
        )}
        {data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{getSectionTitle('certifications', 'Certifications')}</Text>
            {data.certifications.map((cert: any, index: number) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{cert.title || cert.name}</Text>
              </View>
            ))}
          </View>
        )}
        {data.projects && Array.isArray(data.projects) && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{getSectionTitle('projects', 'Projects')}</Text>
            {data.projects.map((project: any, index: number) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{project.title || project.name}</Text>
              </View>
            ))}
          </View>
        )}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          ` / `
        )} fixed />
      </Page>
    </Document>
  );
};

export default CVPDFDocument;
