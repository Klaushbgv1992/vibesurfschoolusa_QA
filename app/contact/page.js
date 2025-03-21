'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      console.log('Form submitted successfully:', data);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError('There was an error submitting your message. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Made taller and extended to top */}
      <div className="relative h-[65vh] w-full mt-0">
        <Image
          src="/images/exterior-views/5.jpg"
          alt="Contact Vibe Beach House"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mt-14">
            Contact Us
          </h1>
        </div>
      </div>
      
      {/* Contact Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Get In Touch</h2>
                <p className="text-gray-700 mb-8">
                  Have questions about Vibe Beach House or want to make a reservation? 
                  Contact us directly or use our booking partner for instant confirmation.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">Location</h3>
                    <address className="not-italic text-gray-600">
                      <p>6 Rooikransie St</p>
                      <p>Herolds Bay</p>
                      <p>George, 6615</p>
                      <p>South Africa</p>
                    </address>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">Book Direct</h3>
                    <a
                      href="https://www.airbnb.com/rooms/1185679450503007200?source_impression_id=p3_1742350524_P3ntnWSMNQoPAbvn"
                      className="inline-block bg-[#005d8e] hover:bg-[#00486e] text-white px-5 py-3 rounded-lg font-medium transition-colors shadow-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book on Airbnb
                    </a>
                  </div>
                </div>
                
                {/* Map */}
                <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-lg">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.402589266543!2d22.432932711711075!3d-33.87341578055955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dd61db2ea1ecd7f%3A0xc803bbf7c4d6c111!2s6%20Rooikransie%20St%2C%20Herolds%20Bay%2C%20George%2C%206530%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1716442033518!5m2!1sen!2sus" 
                    className="absolute inset-0 w-full h-full border-0" 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade">
                  </iframe>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Us a Message</h2>
                
                {submitSuccess ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                    Thank you for your message! We'll get back to you as soon as possible.
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