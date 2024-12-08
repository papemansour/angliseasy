import { Course, Level } from '../types/course';

export const levels: Level[] = [
  {
    id: '1',
    name: 'Beginner',
    code: 'first',
    password: 'prima',
    description: 'Perfect for those starting their English journey',
    meetLink: 'https://meet.google.com/oye-vjhu-xaz',
    imageUrl: 'https://cdn.gamma.app/4m8s9cdkc8mh2bd/generated-images/tB17DxcB6En3sviiXwu6v.jpg',
    courses: [
      {
        id: 'beg-1',
        title: 'Basic Conversations',
        description: 'Learn everyday English conversations',
        level: 'beginner',
        duration: '4 weeks',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f'
      },
      {
        id: 'beg-2',
        title: 'Essential Grammar',
        description: 'Master fundamental English grammar rules',
        level: 'beginner',
        duration: '4 weeks',
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b'
      },
      {
        id: 'beg-3',
        title: 'Basic Vocabulary',
        description: 'Build your essential English vocabulary',
        level: 'beginner',
        duration: '4 weeks',
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8'
      },
      {
        id: 'beg-4',
        title: 'Pronunciation Basics',
        description: 'Learn correct English pronunciation',
        level: 'beginner',
        duration: '4 weeks',
        imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad'
      }
    ]
  },
  {
    id: '2',
    name: 'Intermediate',
    code: 'seconde',
    password: 'beta',
    description: 'For those ready to take their English to the next level',
    meetLink: 'https://meet.google.com/oye-vjhu-xaz',
    imageUrl: 'https://cdn.gamma.app/4m8s9cdkc8mh2bd/generated-images/aE0Qp9w_9W-n9205PcQN_.jpg',
    courses: [
      {
        id: 'int-1',
        title: 'Business English',
        description: 'Professional communication skills',
        level: 'intermediate',
        duration: '4 weeks',
        imageUrl: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca'
      },
      {
        id: 'int-2',
        title: 'Advanced Grammar',
        description: 'Complex grammar structures',
        level: 'intermediate',
        duration: '4 weeks',
        imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173'
      },
      {
        id: 'int-3',
        title: 'Idiomatic Expressions',
        description: 'Common English idioms and phrases',
        level: 'intermediate',
        duration: '4 weeks',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644'
      },
      {
        id: 'int-4',
        title: 'Writing Skills',
        description: 'Improve your written English',
        level: 'intermediate',
        duration: '4 weeks',
        imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a'
      }
    ]
  },
  {
    id: '3',
    name: 'Advanced',
    code: 'third',
    password: 'gamma',
    description: 'For those aiming for fluency and mastery',
    meetLink: 'https://meet.google.com/oye-vjhu-xaz',
    imageUrl: 'https://cdn.gamma.app/4m8s9cdkc8mh2bd/generated-images/MoVPNC_9D1ZiozmT8HCwX.jpg',
    courses: [
      {
        id: 'adv-1',
        title: 'Academic Writing',
        description: 'University-level writing skills',
        level: 'advanced',
        duration: '4 weeks',
        imageUrl: 'https://images.unsplash.com/photo-1513258496099-48168024aec0'
      },
      {
        id: 'adv-2',
        title: 'Public Speaking',
        description: 'Master presentation skills',
        level: 'advanced',
        duration: '4 weeks',
        imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2'
      },
      {
        id: 'adv-3',
        title: 'Literature Analysis',
        description: 'Explore English literature',
        level: 'advanced',
        duration: '4 weeks',
        imageUrl: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1'
      },
      {
        id: 'adv-4',
        title: 'Advanced Debate',
        description: 'Perfect your argumentation skills',
        level: 'advanced',
        duration: '4 weeks',
        imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655'
      }
    ]
  }
];