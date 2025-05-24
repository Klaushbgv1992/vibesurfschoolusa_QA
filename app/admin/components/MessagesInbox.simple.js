"use client";
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function MessagesInbox() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [markedAsRead, setMarkedAsRead] = useState([]);

  // Fetch all messages on component mount
  useEffect(() => {
    console.log('Fetching all messages on mount');
    fetchAllMessages();
  }, []);

  // Fetch booking details when a booking is selected
  useEffect(() => {
    if (selectedBooking && !isContactFormMessage(selectedBooking)) {
      fetchBookingDetails(selectedBooking);
    } else {
      setBookingDetails(null);
    }
  }, [selectedBooking]);

  const fetchAllMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/messages', {
        credentials: 'same-origin',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        console.log('Received messages from API:', data.messages.length);
        setMessages(data.messages);
      } else {
        console.error('Error fetching messages:', data.message);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookingDetails = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings?id=${bookingId}`, {
        credentials: 'same-origin',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch booking details: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success && data.booking) {
        setBookingDetails(data.booking);
      } else {
        console.error('Error fetching booking details:', data.message);
        setBookingDetails(null);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setBookingDetails(null);
    }
  };

  // Mark messages as read when viewing a conversation
  const markConversationAsRead = async (bookingId) => {
    try {
      // Mark as read in the UI immediately (optimistic update)
      setMarkedAsRead(prev => [...prev, bookingId]);
      
      // Update read status in the database
      const response = await fetch('/api/admin/messages/read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId })
      });
      
      if (!response.ok) {
        console.error(`Failed to mark messages as read: ${response.status}`);
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedBooking) return;
    
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: selectedBooking,
          content: newMessage,
          author: 'Admin',
          type: 'note',
          status: 'read' // Admin's own messages are always read
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create message: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setNewMessage("");
        fetchAllMessages(); // Refresh messages
      } else {
        console.error('Error creating message:', data.message);
      }
    } catch (error) {
      console.error('Error creating message:', error);
    }
  };

  const handleStartEdit = (message) => {
    setEditingMessage(message._id);
    setEditContent(message.content);
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditContent("");
  };

  const handleSaveEdit = async (messageId) => {
    if (!editContent.trim()) return;
    
    try {
      const response = await fetch(`/api/admin/messages?id=${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update message: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setEditingMessage(null);
        setEditContent("");
        fetchAllMessages(); // Refresh messages
      } else {
        console.error('Error updating message:', data.message);
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const response = await fetch(`/api/admin/messages?id=${messageId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete message: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        fetchAllMessages(); // Refresh messages
      } else {
        console.error('Error deleting message:', data.message);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  };

  const groupMessagesByBooking = () => {
    const groupedMessages = {};
    
    messages.forEach(message => {
      // Convert undefined bookingId to "unassigned"
      const bookingId = message.bookingId || "unassigned";
      
      if (!groupedMessages[bookingId]) {
        groupedMessages[bookingId] = [];
      }
      
      groupedMessages[bookingId].push(message);
    });
    
    return groupedMessages;
  };

  // Helper to check if any message in a conversation is unread
  const hasUnreadMessages = (bookingId, messages) => {
    if (markedAsRead.includes(bookingId)) return false;
    return messages.some(message => message.status === 'unread');
  };

  // Helper to get the latest message date for sorting
  const getLatestMessageDate = (messages) => {
    const dates = messages.map(message => new Date(message.createdAt));
    return Math.max(...dates);
  };

  // Helper to determine if a message is from the contact form
  const isContactFormMessage = (bookingId) => {
    if (!bookingId) return false;
    return bookingId.startsWith('contact_');
  };

  // Helper to get unique senders from contact form messages
  const getContactPersonDetails = (bookingId, messages) => {
    if (isContactFormMessage(bookingId) && messages.length > 0) {
      // Contact form details are in the first message
      const firstMessage = messages[0];
      return {
        name: firstMessage.contactName || 'Unknown',
        email: firstMessage.contactEmail || 'No email provided'
      };
    }
    return { name: 'Unknown', email: 'No email provided' };
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Messages Inbox</h2>
      
      <div className="flex">
        {/* Left panel - Message Senders */}
        <div className="w-1/3 pr-4">
          <h3 className="text-lg font-semibold mb-3">Message Senders</h3>
          
          {isLoading ? (
            <div className="text-center py-4">Loading messages...</div>
          ) : (
            <>
              <div className="text-xs text-gray-500 mb-2">
                Found {messages.length} total messages in {Object.keys(groupMessagesByBooking()).length} conversations
              </div>
              
              {Object.entries(groupMessagesByBooking())
                .map(([bookingId, bookingMessages]) => {
                  const senderDetails = getContactPersonDetails(bookingId, bookingMessages);
                  
                  // Only show contact form messages in the left panel
                  if (!isContactFormMessage(bookingId)) return null;
                  
                  return (
                    <div
                      key={bookingId}
                      className={`border mb-3 cursor-pointer ${
                        selectedBooking === bookingId
                          ? 'border-blue-500'
                          : 'border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedBooking(bookingId);
                        markConversationAsRead(bookingId);
                      }}
                    >
                      <div className="p-3">
                        <div className="font-medium">
                          Contact Form Message
                        </div>
                        <div>
                          {senderDetails.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Last updated: {formatDate(getLatestMessageDate(bookingMessages))}
                        </div>
                      </div>
                    </div>
                  );
                })
                .filter(Boolean) // Remove null elements
              }
            </>
          )}
        </div>
        
        {/* Right panel - Message Content */}
        <div className="w-2/3 pl-4">
          {selectedBooking ? (
            <>
              {/* Header with sender info */}
              <div className="bg-blue-50 p-4 mb-4">
                <div className="text-center text-blue-700 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Form Message
                </div>
                <div className="text-sm">
                  <div><span className="font-medium">Name:</span> {getContactPersonDetails(selectedBooking, messages.filter(message => message.bookingId === selectedBooking)).name}</div>
                  <div><span className="font-medium">Email:</span> {getContactPersonDetails(selectedBooking, messages.filter(message => message.bookingId === selectedBooking)).email}</div>
                  <div><span className="font-medium">Sent on:</span> {formatDate(messages.filter(message => message.bookingId === selectedBooking)[0]?.createdAt)}</div>
                </div>
              </div>

              {/* Message Content */}
              <div className="border p-4">
                <p>
                  Message text comes here in this box, after clicking on the respective sender thread on the left
                </p>

                {messages
                  .filter(message => message.bookingId === selectedBooking)
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((message) => (
                    <div key={message._id} className="mt-4">
                      {message.content}
                    </div>
                  ))
                }
              </div>
            </>
          ) : (
            <div className="border p-4 h-64 flex items-center justify-center">
              <p className="text-gray-500 text-center">
                Message text comes here in this box, after clicking on the respective sender thread on the left
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
