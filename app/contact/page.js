'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cellphone: '', // Added cellphone
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Submitting form data:', formData);
      
      // Validate form data on client side first
      if (!formData.name || !formData.email || !formData.cellphone || !formData.message) {
        console.error('Missing required fields:', { 
          name: !!formData.name, 
          email: !!formData.email, 
          cellphone: !!formData.cellphone, // Added cellphone validation
          message: !!formData.message 
        });
        throw new Error('Please fill out all required fields');
      }
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      let data;
      try {
        data = await response.json();
        console.log('API response data:', data);
      } catch (jsonError) {
        console.error('Failed to parse response as JSON:', jsonError);
        throw new Error('Invalid server response');
      }
      
      if (!response.ok) {
        console.error('API returned error:', data.error);
        throw new Error(data.error || 'Failed to send message');
      }
      
      console.log('Form submitted successfully:', data);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', cellphone: '', message: '' }); // Added cellphone to reset
      
      // Try to fetch messages after submission to verify it was stored
      setTimeout(async () => {
        try {
          const verifyResponse = await fetch('/api/admin/messages');
          const verifyData = await verifyResponse.json();
          console.log('Messages after submission:', verifyData);
        } catch (verifyError) {
          console.error('Error verifying message was stored:', verifyError);
        }
      }, 1000);
    } catch (err) {
      setError(err.message || 'There was an error submitting your message. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 py-28 px-4">
        <div className="absolute inset-0 z-0 opacity-40 bg-gradient-to-br from-blue-600 to-blue-900">
          <Image
            src="/images/surfing/Testimonials.png"
            alt="Contact Vibe Surf School"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Let's share good vibes
          </p>
        </div>
      </section>
      
      {/* Contact Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Get In Touch</h2>
                <p className="text-gray-700 mb-8">
                  Have questions about Vibe Surf School or want to book a lesson? 
                  Contact us directly or use our booking system for instant confirmation.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">Location</h3>
                    <address className="not-italic text-gray-600">
                      <p>Vibe Surf School Florida</p>
                      <p>Dania Beach, Pompano Beach & Sunny Isles Beach</p>
                      <p>South Florida</p>
                      <p>United States</p>
                    </address>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">Book Direct</h3>
                    <a
                      href="/booking"
                      className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white px-5 py-3 rounded-lg font-medium transition-colors shadow-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book a Lesson
                    </a>
                  </div>
                </div>
                
                {/* Image instead of Map */}
                <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-lg">
                  <Image 
                    src="/images/surfing/20231.jpg" 
                    alt="Vibe Surf School Location" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Our Surf School</h2>
                
                {submitSuccess ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                    Thank you for your message! Our surf instructors will get back to you as soon as possible.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#005d8e] focus:border-[#005d8e]"
                        placeholder="Enter your name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#005d8e] focus:border-[#005d8e]"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label htmlFor="cellphone" className="block text-gray-700 font-medium mb-2">
                        Cellphone Number
                      </label>
                      <input
                        type="tel"
                        id="cellphone"
                        name="cellphone"
                        value={formData.cellphone}
                        onChange={handleChange}
                        required // Added required attribute
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#005d8e] focus:border-[#005d8e]"
                        placeholder="Enter your cellphone number"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[#005d8e] focus:border-[#005d8e]"
                        placeholder="What would you like to know?"
                      ></textarea>
                    </div>
                    
                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#005d8e] hover:bg-[#00486e] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-70"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}