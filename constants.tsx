
import { BootcampUpdate, BootcampMaterial, ScheduleEvent } from './types';

export const BOOTCAMP_UPDATES: BootcampUpdate[] = [
  {
    id: '1',
    title: 'Welcome to Week 3!',
    content: 'We are diving deep into Advanced React Patterns this week. Make sure to review the pre-reading material.',
    date: '2024-05-15',
    category: 'Announcement'
  },
  {
    id: '2',
    title: 'New Material: Backend Security',
    content: 'The slides for the backend security session are now available in the resources tab.',
    date: '2024-05-14',
    category: 'Material'
  },
  {
    id: '3',
    title: 'Schedule Shift: Q&A Session',
    content: 'The Friday Q&A session has been moved to 2 PM EST to accommodate our guest speaker.',
    date: '2024-05-13',
    category: 'Schedule'
  }
];

export const BOOTCAMP_MATERIALS: BootcampMaterial[] = [
  {
    id: 'm1',
    title: 'React Design Patterns PDF',
    type: 'PDF',
    description: 'Comprehensive guide to HOCs, Render Props, and Custom Hooks.',
    url: '#'
  },
  {
    id: 'm2',
    title: 'Deployment Masterclass',
    type: 'Video',
    description: 'A 2-hour walkthrough of CI/CD pipelines and cloud hosting.',
    url: '#'
  },
  {
    id: 'm3',
    title: 'Boilerplate Repository',
    type: 'Zip',
    description: 'Ready-to-go starter kit for your final project.',
    url: '#'
  }
];

export const BOOTCAMP_SCHEDULE: ScheduleEvent[] = [
  {
    id: 's1',
    title: 'Module 4: API Design',
    startTime: '2024-05-18T10:00:00',
    endTime: '2024-05-18T12:00:00',
    instructor: 'Sarah Drasner',
    topic: 'REST vs GraphQL Fundamentals'
  },
  {
    id: 's2',
    title: 'Workshop: Database Modeling',
    startTime: '2024-05-19T14:00:00',
    endTime: '2024-05-19T16:00:00',
    instructor: 'Dan Abramov',
    topic: 'Normalization and Performance'
  }
];
