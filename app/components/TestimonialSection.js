import React from 'react';

export default function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'Cape Town, South Africa',
      rating: 5,
      text: 'Our stay at Vibe Beach House exceeded all expectations. The views are breathtaking and the house is beautifully designed with everything you could need. We particularly enjoyed watching the sunset from the pool deck. Will definitely be returning!',
    },
    {
      id: 2,
      name: 'James & Emma Wilson',
      location: 'London, UK',
      rating: 5,
      text: 'This guesthouse is truly a hidden gem in Herolds Bay. The attention to detail throughout the property is impressive, and the location is perfect for exploring the Garden Route. The host was incredibly helpful with local recommendations.',
    },
    {
      id: 3,
      name: 'Michael van der Merwe',
      location: 'Johannesburg, South Africa',
      rating: 5,
      text: 'As a frequent traveler, I can honestly say this is one of the most beautiful properties I\'ve stayed in. The kitchen is well-equipped, the beds are comfortable, and the views are spectacular. The perfect luxury retreat!',
    },
  ];

  // Function to render stars based on rating
  const renderStars = (rating) => {
    return Array(5)
      .fill()
      .map((_, i) => (
        <svg 
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-[#005d8e]' : 'text-gray-300'}`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      ));
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Guests Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover why guests love their experience at Vibe Beach House
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 p-8 rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#005d8e] text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex mb-4">{renderStars(testimonial.rating)}</div>

                <p className="text-gray-700 italic flex-grow">"{testimonial.text}"</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a
            href="https://www.airbnb.com/rooms/1185679450503007200?source_impression_id=p3_1742350524_P3ntnWSMNQoPAbvn#reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#005d8e] font-medium hover:underline inline-flex items-center"
          >
            Read more reviews on Airbnb
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}