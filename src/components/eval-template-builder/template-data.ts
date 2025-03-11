import { TemplateSections, BragSheetEntry, MetricsLibrary } from './types';

// Default template sections and placeholder text based on IT2 (E-5) System Administrator
export const defaultTemplateSections: TemplateSections = {
  professional: {
    title: "Professional Knowledge",
    placeholder: "- Maintained CompTIA Security+ certification, supporting 15 shipwide systems\n- Administered 3 critical network systems with 99.7% uptime\n- Implemented 4 new security protocols, reducing potential vulnerabilities by 37%",
    characterLimit: 10000,
    completed: false
  },
  quality: {
    title: "Quality of Work",
    placeholder: "- Produced exceptional work with zero rework required\n- Maximized resources through efficient management\n- Maintained 99.8% accuracy rate across all assigned tasks",
    characterLimit: 10000,
    completed: false
  },
  climate: {
    title: "Command Climate/EO",
    placeholder: "- Fostered inclusive environment supporting Navy's retention goals\n- Demonstrated appreciation for contributions of diverse personnel\n- Actively promoted unit cohesion by valuing differences as strengths",
    characterLimit: 10000,
    completed: false
  },
  military: {
    title: "Military Bearing/Character",
    placeholder: "- Earned top marks in 4 consecutive uniform inspections\n- Completed required GMT with 100% on all assessments\n- Maintained excellent physical readiness, scoring Outstanding on 2 consecutive PFAs",
    characterLimit: 10000,
    completed: false
  },
  accomplishment: {
    title: "Job Accomplishment/Initiative",
    placeholder: "- Identified and patched critical security vulnerability before deployment\n- Developed SharePoint solution for tracking division qualifications\n- Volunteered 15 hours for command community relations event\n- Proactively identified and resolved system vulnerabilities\n- Initiated process improvements that increased efficiency",
    characterLimit: 10000,
    completed: false
  },
  teamwork: {
    title: "Teamwork",
    placeholder: "- Resolved 127 help desk tickets, exceeding department average by 43%\n- Conducted cross-training for 7 junior personnel on network security practices\n- Served as CMEO Assistant, supporting command-wide initiatives",
    characterLimit: 10000,
    completed: false
  },
  leadership: {
    title: "Leadership",
    placeholder: "- Led 3-person team in successful deployment of new message handling system\n- Mentored 2 junior ITs to qualification completion ahead of schedule\n- Volunteered as command PT leader for 6 months, improving division PRT scores by 15%",
    characterLimit: 10000,
    completed: false
  }
};

// Default brag sheet entries
export const defaultBragSheetEntries: BragSheetEntry[] = [
  {
    id: 1,
    date: "2025-01-15",
    category: "professional",
    title: "Server Migration",
    description: "Led migration of 3 legacy servers to new hardware, completed 2 days ahead of schedule with zero downtime.",
    metrics: ["3 servers", "0% downtime", "48 hours saved"],
    added: false
  },
  {
    id: 2,
    date: "2025-02-10",
    category: "teamwork",
    title: "Cross-training Session",
    description: "Conducted training for 5 junior sailors on cybersecurity best practices, resulting in 25% reduction in security incidents.",
    metrics: ["5 personnel trained", "25% incident reduction", "8 hours training"],
    added: false
  },
  {
    id: 3,
    date: "2025-02-22",
    category: "accomplishment",
    title: "Documentation Improvement",
    description: "Created new troubleshooting guide for network issues, reducing average resolution time from 45 to 18 minutes.",
    metrics: ["60% time reduction", "27 min saved per incident", "15-page guide"],
    added: false
  }
];

// Custom metrics by category
export const customMetrics: MetricsLibrary = {
  professional: [
    "##% system uptime",
    "## systems administered",
    "## security vulnerabilities resolved",
    "## certifications maintained",
    "##% reduction in technical errors",
    "## advancement/PQS requirements completed"
  ],
  quality: [
    "##% accuracy rate",
    "## tasks completed on time",
    "##% reduction in errors",
    "##% resource utilization improvement",
    "## processes streamlined",
    "## hours saved through efficiency"
  ],
  climate: [
    "## personnel mentored",
    "## diversity initiatives supported",
    "## team-building events organized",
    "##% improvement in retention metrics",
    "## EO/EEO training sessions conducted",
    "## support programs initiated"
  ],
  military: [
    "## uniform inspections passed with zero discrepancies",
    "## GMT sessions completed with 100% score",
    "## command PT sessions led",
    "## awards/recognition received",
    "## physical readiness achievements"
  ],
  accomplishment: [
    "## process improvements implemented",
    "##% efficiency increase achieved",
    "## volunteer hours contributed",
    "## new procedures developed",
    "## qualifications completed early",
    "## tasks completed ahead of schedule",
    "## self-improvement actions taken",
    "## new ideas implemented",
    "## process improvements suggested",
    "## additional qualifications pursued",
    "##% increase in productivity"
  ],
  teamwork: [
    "## sailors mentored/trained",
    "## cross-departmental projects supported",
    "##% improvement in team performance metrics",
    "## collaborative initiatives led",
    "## team commitments met"
  ],
  leadership: [
    "## sailors supervised",
    "##% qualification completion rate for team",
    "## personnel advancement-eligible",
    "## successful inspections passed",
    "## process improvements implemented",
    "##% improvement in safety record"
  ]
};

import { NAVY_RATES } from '@/constants/navy';

// Sample rank and rating options
export const rankOptions = ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9'];
export const ratingOptions = NAVY_RATES;
export const evalTypeOptions = [
  { value: "Periodic", label: "Periodic" },
  { value: "Detachment", label: "Detachment" },
  { value: "Promotion/Frocking", label: "Promotion/Frocking" },
  { value: "Special", label: "Special" }
];

// Advanced section options
export const promotionStatusOptions = [
  { value: "Regular", label: "Regular" },
  { value: "Frocked", label: "Frocked" },
  { value: "Selected", label: "Selected" },
  { value: "Spot", label: "Spot" }
];

export const billetSubcategoryOptions = [
  { value: "N/A", label: "N/A" },
  { value: "CANVASSER", label: "CANVASSER" },
  { value: "RESIDENT", label: "RESIDENT" },
  { value: "INDIV AUG", label: "INDIV AUG" },
  { value: "INTERN", label: "INTERN" },
  { value: "INSTRUCTOR", label: "INSTRUCTOR" },
  { value: "STUDENT", label: "STUDENT" },
  { value: "RESAC1", label: "RESAC1" },
  { value: "RESAC6", label: "RESAC6" },
  { value: "SPECIAL01", label: "SPECIAL01" },
  { value: "SPECIAL02", label: "SPECIAL02" },
  { value: "SPECIAL03", label: "SPECIAL03" },
  { value: "SPECIAL04", label: "SPECIAL04" },
  { value: "SPECIAL05", label: "SPECIAL05" },
  { value: "SPECIAL06", label: "SPECIAL06" },
  { value: "SPECIAL07", label: "SPECIAL07" },
  { value: "SPECIAL08", label: "SPECIAL08" },
  { value: "SPECIAL09", label: "SPECIAL09" },
  { value: "SPECIAL10", label: "SPECIAL10" },
  { value: "SPECIAL11", label: "SPECIAL11" },
  { value: "SPECIAL12", label: "SPECIAL12" },
  { value: "SPECIAL13", label: "SPECIAL13" },
  { value: "SPECIAL14", label: "SPECIAL14" },
  { value: "SPECIAL15", label: "SPECIAL15" },
  { value: "SPECIAL16", label: "SPECIAL16" },
  { value: "SPECIAL17", label: "SPECIAL17" },
  { value: "SPECIAL18", label: "SPECIAL18" },
  { value: "SPECIAL19", label: "SPECIAL19" },
  { value: "SPECIAL20", label: "SPECIAL20" },
  { value: "SPECIAL21", label: "SPECIAL21" },
  { value: "SPECIAL22", label: "SPECIAL22" },
  { value: "SPECIAL23", label: "SPECIAL23" },
  { value: "SPECIAL24", label: "SPECIAL24" },
  { value: "SPECIAL25", label: "SPECIAL25" },
  { value: "SPECIAL26", label: "SPECIAL26" },
  { value: "SPECIAL27", label: "SPECIAL27" },
  { value: "SPECIAL28", label: "SPECIAL28" },
  { value: "SPECIAL29", label: "SPECIAL29" },
  { value: "SPECIAL30", label: "SPECIAL30" },
  { value: "SPECIAL31", label: "SPECIAL31" },
  { value: "SPECIAL32", label: "SPECIAL32" },
  { value: "SPECIAL33", label: "SPECIAL33" },
  { value: "SPECIAL34", label: "SPECIAL34" },
  { value: "SPECIAL35", label: "SPECIAL35" },
  { value: "SPECIAL36", label: "SPECIAL36" },
  { value: "SPECIAL37", label: "SPECIAL37" },
  { value: "SPECIAL38", label: "SPECIAL38" },
  { value: "SPECIAL39", label: "SPECIAL39" },
  { value: "SPECIAL40", label: "SPECIAL40" },
  { value: "SPECIAL41", label: "SPECIAL41" },
  { value: "SPECIAL42", label: "SPECIAL42" },
  { value: "SPECIAL43", label: "SPECIAL43" },
  { value: "SPECIAL44", label: "SPECIAL44" },
  { value: "SPECIAL45", label: "SPECIAL45" },
  { value: "SPECIAL46", label: "SPECIAL46" },
  { value: "SPECIAL47", label: "SPECIAL47" },
  { value: "SPECIAL48", label: "SPECIAL48" },
  { value: "SPECIAL49", label: "SPECIAL49" },
  { value: "SPECIAL50", label: "SPECIAL50" }
];