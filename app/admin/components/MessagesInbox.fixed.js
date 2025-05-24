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
                .sort((a, b) => {
                  // Sort by unread status first (unread at the top)
                  const aUnread = hasUnreadMessages(a[0], a[1]);
                  const bUnread = hasUnreadMessages(b[0], b[1]);
                  if (aUnread && !bUnread) return -1;
                  if (!aUnread && bUnread) return 1;
                  
                  // Then sort by date (newest first)
                  return getLatestMessageDate(b[1]) - getLatestMessageDate(a[1]);
                })
                .map(([bookingId, bookingMessages]) => {
                  const isUnread = hasUnreadMessages(bookingId, bookingMessages);
                  const senderDetails = isContactFormMessage(bookingId) 
                    ? getContactPersonDetails(bookingId, bookingMessages)
                    : { name: bookingId.slice(-6), email: 'Booking' };
                  
                  return (
                    <div
                      key={bookingId}
                      className={`p-3 border mb-3 cursor-pointer ${
                        selectedBooking === bookingId
                          ? 'border-l-4 border-blue-600 bg-blue-50'
                          : isUnread
                            ? 'border-l-4 border-yellow-400 bg-yellow-50'
                            : 'border'
                      }`}
                      onClick={() => {
                        setSelectedBooking(bookingId);
                        if (isUnread) {
                          markConversationAsRead(bookingId);
                        }
                      }}
                    >
                      <div className="font-medium">
                        {isContactFormMessage(bookingId) ? 'Contact Form Message' : `Booking #${bookingId.slice(-6)}`}
                      </div>
                      <div className="text-sm text-gray-600">
                        {isContactFormMessage(bookingId) ? senderDetails.name : `Booking #${bookingId.slice(-6)}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        Last updated: {formatDate(getLatestMessageDate(bookingMessages))}
                      </div>
                    </div>
                  );
                })
              }
            </>
          )}
        </div>
        
        {/* Right panel - Message Content */}
        <div className="w-2/3 pl-4">
          {selectedBooking ? (
            <>
              {/* Header with sender info */}
              {isContactFormMessage(selectedBooking) ? (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded">
                  <h4 className="font-semibold flex items-center text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Form Message
                  </h4>
                  <div className="mt-2">
                    <div><span className="font-medium">Name:</span> {getContactPersonDetails(selectedBooking, messages.filter(message => message.bookingId === selectedBooking)).name}</div>
                    <div><span className="font-medium">Email:</span> {getContactPersonDetails(selectedBooking, messages.filter(message => message.bookingId === selectedBooking)).email}</div>
                    <div><span className="font-medium">Sent on:</span> {formatDate(messages.filter(message => message.bookingId === selectedBooking)[0]?.createdAt)}</div>
                  </div>
                </div>
              ) : bookingDetails ? (
                <div className="mb-4 p-4 bg-gray-50 border rounded">
                  <h4 className="font-semibold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Booking #{selectedBooking.slice(-6)}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div><span className="font-medium">Customer:</span> {bookingDetails.customerName}</div>
                    <div><span className="font-medium">Email:</span> {bookingDetails.email}</div>
                    <div><span className="font-medium">Date:</span> {format(new Date(bookingDetails.date), 'MMM d, yyyy')}</div>
                    <div><span className="font-medium">Time:</span> {bookingDetails.time}</div>
                    <div><span className="font-medium">Status:</span> {bookingDetails.status}</div>
                  </div>
                </div>
              ) : null}

              {/* Conversation messages */}
              <div className="mb-4">
                <h4 className="font-semibold mb-3 text-lg border-b pb-2">Conversation</h4>
                <div className="space-y-4">
                  {messages
                    .filter(message => message.bookingId === selectedBooking)
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Sort by date, oldest first
                    .map((message) => (
                      <div key={message._id} className="p-4 bg-white border rounded shadow-sm">
                        {editingMessage === message._id ? (
                          <div>
                            <textarea
                              className="w-full p-2 border rounded mb-2"
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              rows={3}
                            />
                            <div className="flex justify-end space-x-2">
                              <button 
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                              <button 
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                                onClick={() => handleSaveEdit(message._id)}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-medium">{message.author || 'System'}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                  {formatDate(message.createdAt)}
                                  {message.updatedAt && message.updatedAt !== message.createdAt && 
                                    " (edited)"}
                                </span>
                              </div>
                              <div className="flex space-x-1">
                                <button 
                                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                                  onClick={() => handleStartEdit(message)}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="px-2 py-1 bg-red-600 text-white text-xs rounded"
                                  onClick={() => handleDeleteMessage(message._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-800">{message.content}</p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
              
              {/* New Message Form */}
              <form onSubmit={handleSubmitMessage} className="mt-4">
                <div className="flex">
                  <input
                    type="text"
                    className="flex-grow p-3 border rounded-l"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="px-5 py-3 bg-blue-600 text-white rounded-r font-medium"
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 border rounded p-6">
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
