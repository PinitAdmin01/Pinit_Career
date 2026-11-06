import test from 'node:test';
import assert from 'node:assert/strict';
import { auditResumeATS } from '../src/lib/ats/atsScreener';
import { generateResumeHtml } from '../src/lib/printResume';
import { ResumeFormData } from '../src/components/career/ResumeForm.types';

test('ATS & Resume Block 58 - Resume Parser, Keyword Scoring & PDF Output', async (t) => {
  await t.test('parses resume against job description and computes substantive keyword match score', () => {
    const resumeText = `
      Aarav Sharma
      Email: aarav.sharma@example.com | Phone: +91 98765 43210 | Location: Bengaluru, India
      LinkedIn: linkedin.com/in/aaravsharma | GitHub: github.com/aaravsharma

      Summary:
      Senior Full Stack Engineer with 5+ years of production experience architecting distributed cloud systems.

      Skills:
      Technical: TypeScript, React, Next.js, Node.js, PostgreSQL, Docker, Redis, REST APIs, GraphQL, AWS, Kubernetes

      Professional Experience:
      Acme Cloud Corp - Senior Full Stack Engineer (2021 - Present)
      - Architected distributed microservices handling 10,000,000 daily requests with Node.js and Redis.
      - Developed high-performance React frontends using Next.js App Router, boosting page load speeds by 42%.
      - Migrated legacy monolithic databases to PostgreSQL with automated partitioning, cutting query latency by 55%.

      Education:
      Bachelor of Technology in Computer Science - IIT Madras (2017 - 2021)
    `;

    const jobDescription = `
      We are looking for a Senior Full Stack Engineer proficient in:
      - TypeScript, React, Node.js, PostgreSQL
      - Docker, Redis, and Cloud Architecture
      Must have demonstrated experience delivering scalable web applications.
    `;

    const result = auditResumeATS(resumeText, {
      targetRole: 'sde',
      jobDescription,
    });

    assert.ok(result, 'Audit result must be returned');
    assert.ok(typeof result.compositeScore === 'number', 'Composite score must be a number');
    assert.ok(result.compositeScore >= 70, `Score should be >= 70 for highly matched resume, got ${result.compositeScore}`);
    assert.ok(Array.isArray(result.extractedProfile.skillsDetected), 'Skills detected must be an array');
    assert.ok(result.extractedProfile.skillsDetected.length > 0, 'Detected skills should not be empty');
    assert.ok(result.compatibilityScores.jobMatchScore >= 70, `Job match score should be >= 70, got ${result.compatibilityScores.jobMatchScore}`);
  });

  await t.test('detects missing critical keywords when resume lacks JD requirements', () => {
    const resumeText = `
      Customer Support Representative
      Skills: Phone communication, ticketing systems, dispute resolution, empathetic listening.
    `;

    const jobDescription = `
      Senior DevOps Engineer
      Requirements: Kubernetes, Terraform, AWS, CI/CD pipelines, Prometheus, Grafana.
    `;

    const result = auditResumeATS(resumeText, {
      targetRole: 'devops',
      jobDescription,
    });

    assert.ok(result.compositeScore < 50, `Score should be low for completely unmatched resume, got ${result.compositeScore}`);
    assert.ok(
      result.extractedProfile.missingSkills && result.extractedProfile.missingSkills.length > 0,
      'Must identify missing skills'
    );
  });

  await t.test('generates valid printable resume HTML document with complete sections', () => {
    const sampleData: ResumeFormData = {
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      phone: '+91 98765 43210',
      address: 'Bengaluru, Karnataka',
      linkedin: 'https://linkedin.com/in/aaravsharma',
      portfolio: 'https://aaravsharma.dev',
      summary: 'Passionate software engineer building resilient cloud architectures and high-velocity web apps.',
      skills: {
        technical: 'TypeScript, Next.js, Node.js, PostgreSQL, Redis, Docker',
        professional: 'System Design, Agile Leadership, Root Cause Analysis',
        personal: 'Curiosity, Ownership, Continuous Improvement',
      },
      experiences: [
        {
          company: 'Acme Cloud Corp',
          role: 'Backend Architect',
          location: 'Bengaluru',
          startDate: '2023',
          endDate: 'Present',
          description: '- Scaled API throughput by 400% via Redis caching.\n- Maintained 99.99% uptime SLA.',
        },
      ],
      education: [
        {
          institution: 'Indian Institute of Technology',
          degree: 'B.Tech in Computer Science',
          year: '2023',
          grade: '9.2 CGPA',
        },
      ],
      projects: [
        {
          name: 'PinIT Career OS',
          link: 'https://github.com/pinit/career-os',
          description: 'Autonomous career readiness platform with real-time audio debouncing and JD analysis.',
        },
      ],
      certificates: [
        { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2024' },
        { name: 'CKA Kubernetes Administrator', issuer: 'Cloud Native Computing Foundation', date: '2023' },
      ],
      languages: [
        { language: 'English', proficiency: 'Fluent' },
        { language: 'Hindi', proficiency: 'Native' },
      ],
      declaration: 'I hereby declare that all information furnished is authentic and verifiable.',
    };

    const html = generateResumeHtml(sampleData);
    assert.ok(html.includes('<!DOCTYPE html>'), 'Must start with doctype');
    assert.ok(html.includes('Aarav Sharma'), 'Must contain full name');
    assert.ok(html.includes('aarav.sharma@example.com'), 'Must contain contact email');
    assert.ok(html.includes('Acme Cloud Corp'), 'Must contain experience company');
    assert.ok(html.includes('Indian Institute of Technology'), 'Must contain education');
    assert.ok(html.includes('PinIT Career OS'), 'Must contain projects');
    assert.ok(html.includes('AWS Certified Solutions Architect'), 'Must contain certificates');
    assert.ok(html.includes('@page'), 'Must include @page print layout rules');
  });
});
