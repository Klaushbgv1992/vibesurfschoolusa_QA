export const beaches = [
  {
    id: 'dania-beach',
    name: 'Dania Beach',
    description: 'Dania Beach provides a more secluded experience with great surf conditions.',
    address: 'Dania Beach, FL',
    image: '/images/location/Dania Beach.jpg'
  },
  {
    id: 'hollywood-beach',
    name: 'Hollywood Beach',
    description: 'Hollywood Beach features a beautiful boardwalk and consistent waves perfect for surfing lessons.',
    address: 'Hollywood Beach, FL',
    image: '/images/location/Hollywood Beach.jpg'
  },
  {
    id: 'pompano-beach',
    name: 'Pompano Beach',
    description: 'Pompano Beach offers excellent conditions for beginners with gentle waves and shallow waters.',
    address: 'Pompano Beach, FL',
    image: '/images/location/Pompano Beach.jpg'
  }
];

export const activities = [
  // SURF LESSONS
  {
    id: 'individual-surf-lesson',
    name: 'Individual Surf Lesson',
    description: 'One-on-one instruction tailored to your skill level for maximum progression.',
    duration: 60, // minutes
    price: 100,
    image: '/images/activityIcons/Individual Surf Lesson.jpg',
    minParticipants: 1,
    maxParticipants: 1,
    category: 'SURF LESSONS'
  },
  {
    id: '2-person-surf-lesson',
    name: '2 Person Group Surf Lessons',
    description: 'Learn to surf with a friend or partner. Perfect for beginners.',
    duration: 60, // minutes
    price: 160,
    image: '/images/activityIcons/2 Person Group Surf Lessons.jpg',
    minParticipants: 2,
    maxParticipants: 2,
    category: 'SURF LESSONS'
  },
  {
    id: '3-person-surf-lesson',
    name: '3 Person Group Surf Lessons',
    description: 'Small group surf lessons with personalized attention.',
    duration: 60, // minutes
    price: 225,
    image: '/images/activityIcons/3 Person Group Surf Lessons.jpg',
    minParticipants: 3,
    maxParticipants: 3,
    category: 'SURF LESSONS'
  },
  {
    id: '4-person-surf-lesson',
    name: '4 Person Group Surf Lessons',
    description: 'Group surf lessons for friends and family.',
    duration: 60, // minutes
    price: 300,
    image: '/images/activityIcons/4 Person Group Surf Lessons.jpg',
    minParticipants: 4,
    maxParticipants: 4,
    category: 'SURF LESSONS'
  },
  {
    id: '5-plus-person-surf-lesson',
    name: '5+ People Group Surf Lesson',
    description: 'Large group surf lessons - perfect for parties and events. Custom pricing available.',
    duration: 60, // minutes
    price: 0, // Custom price
    image: '/images/activityIcons/5+ People Group Surf Lesson.jpg',
    minParticipants: 5,
    maxParticipants: 10,
    category: 'SURF LESSONS'
  },
  
  // SNORKELING ADVENTURES
  {
    id: 'individual-snorkeling-tour',
    name: 'Individual Guided Reef Snorkeling Tour',
    description: 'Explore vibrant reef ecosystems with a personal guide.',
    duration: 60, // minutes
    price: 65,
    image: '/images/activityIcons/Individual Guided Reef Snorkeling Tour.webp',
    minParticipants: 1,
    maxParticipants: 1,
    category: 'SNORKELING ADVENTURES'
  },
  {
    id: '2-person-snorkeling-tour',
    name: '2 Person Guided Reef Snorkeling Tour',
    description: 'Guided reef snorkeling adventure for two people.',
    duration: 60, // minutes
    price: 130,
    image: '/images/activityIcons/2 Person Guided Reef Snorkeling Tour.webp',
    minParticipants: 2,
    maxParticipants: 2,
    category: 'SNORKELING ADVENTURES'
  },
  {
    id: '3-person-snorkeling-tour',
    name: '3 Person Guided Reef Snorkeling Tour',
    description: 'Small group guided reef snorkeling experience.',
    duration: 60, // minutes
    price: 195,
    image: '/images/activityIcons/3 Person Guided Reef Snorkeling Tour.webp',
    minParticipants: 3,
    maxParticipants: 3,
    category: 'SNORKELING ADVENTURES'
  },
  {
    id: '4-person-snorkeling-tour',
    name: '4 Person Guided Reef Snorkeling Tour',
    description: 'Group guided reef snorkeling adventure.',
    duration: 60, // minutes
    price: 260,
    image: '/images/activityIcons/4 Person Guided Reef Snorkeling Tour.webp',
    minParticipants: 4,
    maxParticipants: 4,
    category: 'SNORKELING ADVENTURES'
  },
  {
    id: '5-plus-person-snorkeling-tour',
    name: '5+ People Group Guided Reef Snorkeling Tour',
    description: 'Large group guided reef snorkeling - perfect for events. Custom pricing available.',
    duration: 60, // minutes
    price: 0, // Custom price
    image: '/images/activityIcons/5+ People Group Guided Reef Snorkeling Tour.webp',
    minParticipants: 5,
    maxParticipants: 10,
    category: 'SNORKELING ADVENTURES'
  },
  
  // SCUBA
  {
    id: '1-person-scuba',
    name: '1 Person Guided Reef Shore Scuba Dive',
    description: 'Personal guided reef shore diving experience for certified divers.',
    duration: 90, // minutes
    price: 110,
    image: '/images/activityIcons/1 Person Guided Reef Shore Scuba Dive.webp',
    minParticipants: 1,
    maxParticipants: 1,
    category: 'SCUBA'
  },
  {
    id: '2-person-scuba',
    name: '2 Person Guided Reef Shore Scuba Dive',
    description: 'Guided reef shore diving for two certified divers.',
    duration: 90, // minutes
    price: 220,
    image: '/images/activityIcons/2 Person Guided Reef Shore Scuba Dive.webp',
    minParticipants: 2,
    maxParticipants: 2,
    category: 'SCUBA'
  },
  {
    id: '3-person-scuba',
    name: '3 Person Guided Reef Shore Scuba Dive',
    description: 'Small group guided reef shore diving experience.',
    duration: 90, // minutes
    price: 330,
    image: '/images/activityIcons/3 Person Guided Reef Shore Scuba Dive.webp',
    minParticipants: 3,
    maxParticipants: 3,
    category: 'SCUBA'
  },
  {
    id: '4-person-scuba',
    name: '4 Person Guided Reef Shore Scuba Dive',
    description: 'Group guided reef shore diving adventure.',
    duration: 90, // minutes
    price: 440,
    image: '/images/activityIcons/4 Person Guided Reef Shore Scuba Dive.jpg',
    minParticipants: 4,
    maxParticipants: 4,
    category: 'SCUBA'
  },
  {
    id: '5-plus-person-scuba',
    name: '5+ People Group Guided Reef Shore Scuba Dive',
    description: 'Large group guided reef shore diving - perfect for dive clubs. Custom pricing available.',
    duration: 90, // minutes
    price: 0, // Custom price
    image: '/images/activityIcons/5+ People Group Guided Reef Shore Scuba Dive.webp',
    minParticipants: 5,
    maxParticipants: 10,
    category: 'SCUBA'
  },
  
  // STAND UP PADDLEBOARDING
  {
    id: '1-person-paddleboard',
    name: '1 Person Stand Up Paddleboard Tour',
    description: 'Guided stand up paddleboarding adventure with personal instruction.',
    duration: 60, // minutes
    price: 75,
    image: '/images/activityIcons/1 Person Stand Up Paddleboard Tour.jpg',
    minParticipants: 1,
    maxParticipants: 1,
    category: 'STAND UP PADDLEBOARDING'
  },
  {
    id: '2-person-paddleboard',
    name: '2 Person Stand Up Paddleboard Tour',
    description: 'Guided stand up paddleboarding for two people.',
    duration: 60, // minutes
    price: 150,
    image: '/images/activityIcons/2 Person Stand Up Paddleboard Tour.webp',
    minParticipants: 2,
    maxParticipants: 2,
    category: 'STAND UP PADDLEBOARDING'
  },
  {
    id: '3-person-paddleboard',
    name: '3 Person Stand Up Paddleboard Tour',
    description: 'Small group guided stand up paddleboarding experience.',
    duration: 60, // minutes
    price: 225,
    image: '/images/activityIcons/3 Person Stand Up Paddleboard Tour.jpg',
    minParticipants: 3,
    maxParticipants: 3,
    category: 'STAND UP PADDLEBOARDING'
  },
  {
    id: '4-person-paddleboard',
    name: '4 Person Stand Up Paddleboard Tour',
    description: 'Group guided stand up paddleboarding adventure.',
    duration: 60, // minutes
    price: 300,
    image: '/images/activityIcons/4 Person Stand Up Paddleboard Tour.jpg',
    minParticipants: 4,
    maxParticipants: 4,
    category: 'STAND UP PADDLEBOARDING'
  },
  {
    id: '5-plus-person-paddleboard',
    name: '5+ People Group Stand Up Paddleboard Tour',
    description: 'Large group guided stand up paddleboarding - perfect for events. Custom pricing available.',
    duration: 60, // minutes
    price: 0, // Custom price
    image: '/images/activityIcons/5+ People Group Stand Up Paddleboard Tour.webp',
    minParticipants: 5,
    maxParticipants: 10,
    category: 'STAND UP PADDLEBOARDING'
  }
];

export const availableTimes = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export function getActivityEndTime(startTime, durationMinutes) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  
  const endHours = endDate.getHours().toString().padStart(2, '0');
  const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
  
  return `${endHours}:${endMinutes}`;
}
