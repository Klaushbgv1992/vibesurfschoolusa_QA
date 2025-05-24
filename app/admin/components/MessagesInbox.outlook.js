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

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
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

  // Get preview text for messages
  const getMessagePreview = (messages) => {
    if (!messages || messages.length === 0) return "";
    
    // Get the latest message for preview
    const latestMessage = [...messages].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
    
    // Truncate message content for preview
    return latestMessage.content.length > 60 
      ? `${latestMessage.content.substring(0, 60)}...` 
      : latestMessage.content;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Messages Inbox</h2>
      
      <div className="flex">
        {/* Left panel - Message List (similar to Outlook) */}
        <div className="w-1/3 pr-4">
          <h3 className="text-lg font-semibold mb-3">Message Senders</h3>
          
          {isLoading ? (
            <div className="text-center py-4">Loading messages...</div>
          ) : (
            <>
              <div className="text-xs text-gray-500 mb-2">
                Found {messages.length} total messages in {Object.keys(groupMessagesByBooking()).length} conversations
              </div>
              
              {/* List of conversations with preview */}
              {Object.entries(groupMessagesByBooking())
                .filter(([bookingId]) => isContactFormMessage(bookingId)) // Only show contact form messages
                .sort((a, b) => getLatestMessageDate(b[1]) - getLatestMessageDate(a[1])) // Newest first
                .map(([bookingId, bookingMessages]) => {
                  const isUnread = hasUnreadMessages(bookingId, bookingMessages);
                  const latestDate = new Date(getLatestMessageDate(bookingMessages));
                  const personDetails = getContactPersonDetails(bookingId, bookingMessages);
                  
                  return (
                    <div
                      key={bookingId}
                      className={`border-b cursor-pointer hover:bg-gray-50 ${
                        selectedBooking === bookingId ? 'bg-blue-50' : (isUnread ? 'bg-yellow-50' : '')
                      }`}
                      onClick={() => {
                        setSelectedBooking(bookingId);
                        if (isUnread) {
                          markConversationAsRead(bookingId);
                        }
                      }}
                    >
                      <div className="py-3 px-4">
                        <div className="flex justify-between">
                          <div className={`font-medium ${isUnread ? 'font-semibold' : ''}`}>
                            {personDetails.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatShortDate(latestDate)}
                          </div>
                        </div>
                        
                        <div className="font-medium text-sm truncate">
                          Contact Form Message
                        </div>
                        
                        <div className="text-sm text-gray-600 truncate">
                          {getMessagePreview(bookingMessages)}
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </>
          )}
        </div>
        
        {/* Right panel - Message Content (similar to Outlook) */}
        <div className="w-2/3 pl-4 border-l">
          {selectedBooking ? (
            <>
              {/* Message Header */}
              <div className="mb-4 pb-3 border-b">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">
                    Contact Form Message
                  </div>
                </div>
                
                <div className="mt-2 text-sm">
                  <div><span className="font-medium">Name:</span> {getContactPersonDetails(selectedBooking, messages.filter(message => message.bookingId === selectedBooking)).name}</div>
                  <div><span className="font-medium">Email:</span> {getContactPersonDetails(selectedBooking, messages.filter(message => message.bookingId === selectedBooking)).email}</div>
                  <div><span className="font-medium">Sent on:</span> {formatDate(messages.filter(message => message.bookingId === selectedBooking)[0]?.createdAt)}</div>
                </div>
              </div>
              
              {/* Message Content */}
              <div className="mb-4">
                {messages
                  .filter(message => message.bookingId === selectedBooking)
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Sort by date, oldest first
                  .map((message, index) => (
                    <div key={message._id} className={`py-2 ${index !== 0 ? 'border-t' : ''}`}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">
                          {message.author || 'Customer'} 
                          <span className="text-xs text-gray-500 ml-2">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        
                        {message.author === 'Admin' && (
                          <div className="flex space-x-2">
                            <button 
                              className="text-xs text-blue-600 hover:underline"
                              onClick={() => handleStartEdit(message)}
                            >
                              Edit
                            </button>
                            <button 
                              className="text-xs text-red-600 hover:underline"
                              onClick={() => handleDeleteMessage(message._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      
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
                              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                            <button 
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                              onClick={() => handleSaveEdit(message._id)}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-800 pl-1">
                          {message.content}
                        </div>
                      )}
                    </div>
                  ))
                }
              </div>
              
              {/* Reply Form */}
              <div className="mt-4 border-t pt-4">
                <form onSubmit={handleSubmitMessage}>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="w-full p-3 border rounded"
                      placeholder="Type a reply..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                      disabled={!newMessage.trim()}
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
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
