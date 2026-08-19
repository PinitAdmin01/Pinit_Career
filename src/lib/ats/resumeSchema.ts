/**
 * Open JSON Resume Standard Schema Definitions
 * Compatible with Reactive Resume & PinIT Career OS ATS Engine.
 */

export interface ResumeBasics {
  name: string;
  label?: string;
  image?: string;
  email: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: {
    address?: string;
    postalCode?: string;
    city?: string;
    countryCode?: string;
    region?: string;
  };
  profiles?: Array<{
    network: string;
    username: string;
    url: string;
  }>;
}

export interface ResumeWorkExperience {
  id?: string;
  name: string;
  position: string;
  url?: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights: string[];
}

export interface ResumeEducation {
  id?: string;
  institution: string;
  url?: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate?: string;
  score?: string;
  courses?: string[];
}

export interface ResumeSkill {
  id?: string;
  name: string;
  level?: string;
  keywords: string[];
}

export interface ResumeProject {
  id?: string;
  name: string;
  description: string;
  highlights: string[];
  keywords: string[];
  startDate?: string;
  endDate?: string;
  url?: string;
}

export interface ResumeCertificate {
  id?: string;
  name: string;
  date: string;
  issuer: string;
  url?: string;
}

export interface JSONResume {
  basics: ResumeBasics;
  work: ResumeWorkExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
  certificates: ResumeCertificate[];
}
