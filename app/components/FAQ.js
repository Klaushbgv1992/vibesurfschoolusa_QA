'use client';

import { useState } from 'react';

export default function FAQ({ questions, structuredData = true }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate the FAQ schema for structured data
  const generateFAQSchema = () => {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: questions.map(q => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.answer
        }
      }))
    };

    return faqSchema;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateFAQSchema())
          }}
        />
      )}
      
      <div className="space-y-4">
        {questions.map((q, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50 focus:outline-none transition-colors"
              onClick={() => toggleQuestion(index)}
              aria-expanded={openIndex === index}
            >
              <span className="font-medium text-gray-900">{q.question}</span>
              <svg
                className={`w-5 h-5 text-[#005d8e] transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96 p-4 bg-gray-50' : 'max-h-0'
              }`}
            >
              <p className="text-gray-700">{q.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
