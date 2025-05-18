"use client";

import { useState } from 'react';

export default function BeachSelection({ beaches, onSelect, selectedBeach }) {
  const [hoveredBeach, setHoveredBeach] = useState(null);



  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Beach Location</h2>
      <p className="text-gray-600 mb-8">
        Choose your preferred beach location for your surf lesson or activity.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {beaches.map((beach) => (
          <div
            key={beach.id}
            className={`relative flex flex-col bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer 
              ${hoveredBeach === beach.id ? 'shadow-lg' : ''} 
              ${selectedBeach?.id === beach.id ? 'ring-2 ring-[#005d8e]' : ''}`}
            onMouseEnter={() => setHoveredBeach(beach.id)}
            onMouseLeave={() => setHoveredBeach(null)}
            onClick={() => onSelect(beach)}
            style={{ minHeight: '340px', maxWidth: '320px' }}
          >
            {/* Beach Image */}
            <div className="relative h-40 w-full bg-gray-100">
              <img
                src={beach.image}
                alt={beach.name}
                className="object-cover w-full h-full rounded-t-lg"
                style={{ minHeight: '160px', maxHeight: '160px' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            
            <div className="p-4 bg-white flex-grow flex flex-col">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{beach.name}</h3>
                <p className="text-gray-600 text-sm">{beach.description}</p>
              </div>
              
              <div className="mt-auto pt-4">
                <button 
                  className="bg-[#005d8e] text-white py-2 px-6 rounded-md hover:bg-[#00486e] transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(beach);
                  }}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
