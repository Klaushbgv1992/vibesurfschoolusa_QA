"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Modal from '../ui/Modal';

export default function ActivitySelection({ activities, onSelect, selectedActivity, selectedParticipants }) {
  const [hoveredActivity, setHoveredActivity] = useState(null);
  const [participants, setParticipants] = useState(selectedParticipants || 1);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Group activities by category
  const categorizedActivities = useMemo(() => {
    const grouped = {};
    
    activities.forEach(activity => {
      const category = activity.category || 'OTHER';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(activity);
    });
    
    return grouped;
  }, [activities]);

  const renderActivity = (activity) => {
    const formattedPrice = activity.price === 0 ? 'Inquire' : `$${activity.price}`;
    
    return (
      <div 
        key={activity.id}
        className={`relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 
          ${hoveredActivity === activity.id ? 'shadow-lg' : ''} 
          ${selectedActivity?.id === activity.id ? 'ring-2 ring-[#005d8e]' : ''}`}
        onMouseEnter={() => setHoveredActivity(activity.id)}
        onMouseLeave={() => setHoveredActivity(null)}
        onClick={() => onSelect(activity, activity.minParticipants)}
      >
        <div className="flex items-center p-4">
          <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 mr-4">
            <Image 
              src={activity.image} 
              alt={activity.name}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          
          <div className="flex-grow">
            <h3 className="font-medium">{activity.name}</h3>
            <div className="flex items-center text-gray-500 text-sm">
              <span>{activity.duration} min</span>
              <span className="mx-2">•</span>
              <button 
                className="bg-white text-[#005d8e] border border-[#005d8e] px-2 py-1 rounded text-xs font-medium hover:bg-gray-50 transition-colors inline-flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDetails(activity);
                  setIsModalOpen(true);
                }}
              >
                Details
              </button>
            </div>
          </div>
          
          <div className="text-right">
            <span className="font-medium">{formattedPrice}</span>
            <button 
              className="block ml-auto mt-2 w-16 bg-[#005d8e] text-white py-1 px-2 rounded-md hover:bg-[#00486e] transition-all text-sm"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(activity, activity.minParticipants);
              }}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render activity details modal
  const renderActivityDetails = () => {
    if (!selectedDetails) return null;
    
    return (
      <div className="space-y-4">
        <div className="relative h-48 rounded-lg overflow-hidden mb-4">
          <Image
            src={selectedDetails.image}
            alt={selectedDetails.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">{selectedDetails.duration} minutes</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">{selectedDetails.minParticipants} {selectedDetails.minParticipants === 1 ? 'person' : 'people'} minimum</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-[#005d8e]">
              {selectedDetails.price === 0 ? 'Inquire' : `$${selectedDetails.price}`}
            </div>
            <div className="text-sm text-gray-600">
              Per group
            </div>
          </div>
        </div>
        
        <div className="prose max-w-none">
          {renderDetailedDescription(selectedDetails)}
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <button 
            onClick={() => {
              setIsModalOpen(false);
              onSelect(selectedDetails, selectedDetails.minParticipants);
            }}
            className="w-full bg-[#005d8e] text-white py-2 px-4 rounded-md hover:bg-[#00486e] transition-all"
          >
            Select This Activity
          </button>
        </div>
      </div>
    );
  };
  
  // Generate detailed descriptions based on activity type
  const renderDetailedDescription = (activity) => {
    let description = '';
    
    // Base description from the activity
    description = activity.description;
    
    // Additional details based on category
    if (activity.category === 'SURF LESSONS') {
      if (activity.minParticipants === 1) {
        return (
          <>
            <p>
              Tailored to your skill level and pace, these one-on-one sessions with our expert instructors will fast-track your progress. Whether you're a beginner looking to stand on the board for the first time or an intermediate surfer aiming to refine your techniques, our private lessons offer the ultimate customized experience to enhance your surfing prowess. All equipment provided.
            </p>
            <p>
              Our experienced instructors will be by your side throughout the entire session, providing personalized guidance and feedback to help you progress quickly and safely. We'll adapt to your learning style and focus on the specific skills you want to develop.
            </p>
          </>
        );
      } else if (activity.minParticipants > 1 && activity.minParticipants < 5) {
        return (
          <>
            <p>
              Our {activity.minParticipants}-Person Surf Lessons create an engaging and cooperative atmosphere, ideal for small groups of friends or family. These sessions offer the chance to learn surfing together, guided by expert instruction. Our skilled instructors focus on all participants equally, ensuring personalized feedback. This unique experience strengthens bonds as you share the excitement and joy of riding the waves. Equipment for everyone is included.
            </p>
            <p>
              Learning to surf as a group adds a fun social dimension to the experience. You'll cheer each other on, celebrate successes together, and create lasting memories on the beautiful beaches of South Florida.
            </p>
          </>
        );
      } else {
        return (
          <>
            <p>
              **Please note: Cost will be determined based on the number of people. We will reach out to you soon.**
            </p>
            <p>
              Our Group Surf Lessons are the ideal way to combine fun, teamwork, and the thrill of surfing. Whether you're with friends or family, these sessions are designed to let you share the excitement of catching waves while benefiting from the attention and expertise of skilled instructors.
            </p>
            <p>
              Planning a larger group surf session? Having everyone surf as a squad not only enhances the experience but also unlocks additional savings. For parties of five or more, please reserve a preliminary time slot. We'll follow up promptly to finalize details and ensure your group gets the perfect wave-riding adventure.
            </p>
          </>
        );
      }
    } else if (activity.category === 'SNORKELING ADVENTURES') {
      return (
        <>
          <p>
            Dive into adventure with our Guided Reef Snorkeling Tour in Pompano or Fort Lauderdale Beach! Embark on an extraordinary underwater journey around the vibrant reef system.
          </p>
          <p>
            This tour is perfect for all levels, and no prior snorkeling experience is required. You'll be guided by a PADI Pro who will ensure you're equipped with top-level gear and ready for an unforgettable experience beneath the waves.
          </p>
          <p>
            As you explore the reef, you'll encounter a mesmerizing array of marine life. Watch schools of colorful tropical fish like angelfish, parrotfish, and sergeant majors dart through the coral. You might even spot the graceful movements of sea turtles and the occasional Southern sting ray gliding by. Look out for species such as Nurse sharks, Barracudas and the elusive Spotted Eagle ray. And don't forget to admire the intricate beauty of the coral formations and the diverse ecosystem they support.
          </p>
          <p>
            This snorkeling tour isn't just about the marine life—it's about immersing yourself in the natural beauty and tranquility of the ocean. Float effortlessly in the crystal-clear waters, soak up the sunshine, and feel the thrill of discovering a hidden underwater world.
          </p>
          <p>
            Ocean conservation is at our core and we encourage the philosophy of "leave nothing but bubbles, take nothing but photos."
          </p>
        </>
      );
    } else if (activity.category === 'SCUBA') {
      return (
        <>
          <p>
            Step away from the crowds and immerse yourself in the serene underwater world off the shores of Pompano or Fort Lauderdale Beach. Join us for an exclusive guided shore dive adventure, where you'll have private beach access and the opportunity to discover the hidden treasures of the ocean beneath the waves.
          </p>
          <p>
            Our guided shore dive begins with a personalized briefing on the beach, where you'll meet your experienced PADI dive guide and receive exclusive access to our pristine dive site. With private beach access, you'll enjoy a tranquil setting and uninterrupted immersion in the underwater wonders of Pompano or Fort Lauderdale. Whether you're an experienced diver or new to the sport, our expert guides will ensure a safe, enjoyable, and unforgettable diving experience.
          </p>
          <p>
            Embark on an immersive journey in thriving underwater ecosystem. Encounter an abundance of marine life, including tropical fish species such as colorful angelfish, sleek barracudas, majestic parrotfish, and elusive moray eels. Keep your eyes peeled for graceful sea turtles gliding gracefully through the water and gentle rays gracefully sweeping across the sandy seabed.
          </p>
          <p>
            Our guided shore dive offers a unique opportunity to explore one of Florida's most spectacular underwater environments with the guidance of experienced dive professionals. Whether you're seeking adventure, relaxation, or simply a deeper connection with the natural world, our dive experiences promise to inspire, educate, and captivate divers of all skill levels.
          </p>
          <p>
            Ocean conservation is at our core and we encourage the philosophy of "leave nothing but bubbles, take nothing but photos."
          </p>
        </>
      );
    } else if (activity.category === 'STAND UP PADDLEBOARDING') {
      return (
        <>
          <p>
            Embark on an unforgettable Stand Up Paddleboard (SUP) adventure with our diverse range of Eco SUP Tours, available in beautiful locations across Florida. Whether you're a beginner or an experienced paddler, our tours are designed to be accessible and enjoyable for all skill levels.
          </p>
          <p>
            <strong>Ocean Eco SUP Tour - Fort Lauderdale, FL:</strong> Start with a brief introduction to SUP equipment and a short lesson on the beach in Fort Lauderdale. Glide over two renowned reef systems, encountering an array of marine life and bird species, all while honing your paddling skills and learning about ocean conservation. This tour epitomizes our "leave nothing but bubbles, take nothing but photos" philosophy.
          </p>
          <p>
            <strong>Mangrove Eco SUP Tour - Dania Beach, FL:</strong> Set in the serene Dr. Von D. Mizell-Eula Johnson State Park, this tour will guide you through mangrove channels, where you might spot manatees, dolphins, and various bird species. Experience the unique ecosystem of Florida's mangroves from the water's surface, creating memories that last a lifetime.
          </p>
          <p>
            <strong>Ocean Eco SUP Tour - Pompano Beach, FL:</strong> Enjoy private beach access and expert instruction before exploring the vibrant coastal waters of Pompano Beach. Paddle over one of Florida's most visited reefs and look out for dolphins, stingrays, turtles, and a rich variety of fish. This tour combines the thrill of discovery with the beauty of nature.
          </p>
          <p>
            After booking online, we will confirm the specific location and details of your chosen guided tour. Each experience is a blend of adventure, wildlife observation, and environmental respect, ensuring a rewarding journey on the water. Get ready to paddle your way to an extraordinary day with us—where the sea meets the sky, and adventure awaits!
          </p>
        </>
      );
    }
    
    return <p>{description}</p>;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Your Activity</h2>
      <p className="text-gray-600 mb-6">
        Select the activity you want to book. Each activity type has options for different group sizes.
      </p>
      
      {/* Activity details modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedDetails?.name || 'Activity Details'}
      >
        {renderActivityDetails()}
      </Modal>

      <div className="space-y-8">
        {Object.keys(categorizedActivities).map(category => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 uppercase">{category}</h3>
            <div className="space-y-3">
              {categorizedActivities[category].map(activity => renderActivity(activity))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
