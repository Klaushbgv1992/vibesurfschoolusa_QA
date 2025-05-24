"use client";
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function MessagesInbox() {
  // ...existing hooks and logic remain
  // Add a helper for preview subject or snippet
  const getMessageSubject = (msg) => msg.subject || msg.content.split("\n")[0].slice(0, 40);

  // ...rest of the code

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
    // First, check if any messages for this bookingId are actually unread in the current local state
    const needsUpdate = messages.some(m => m.bookingId === bookingId && m.status === 'unread');

    if (!needsUpdate) {
      // console.log(`Conversation ${bookingId} is already marked as read or no unread messages found locally.`);
      return; // No need to call API if already marked or no unread messages
    }

    try {
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
        // Optionally, revert optimistic update here if it were still in use
      } else {
        // Update local state to reflect that messages for this bookingId are now read
        setMessages(prevMessages =>
          prevMessages.map(m => 
            m.bookingId === bookingId ? { ...m, status: 'read' } : m
          )
        );
        // console.log(`Successfully marked conversation ${bookingId} as read and updated local state.`);
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

  const handleDeleteConversation = async (bookingId) => {
    if (!bookingId) return;

    if (window.confirm('Are you sure you want to delete this entire conversation? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/messages`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer VibeAdmin', // Added Authorization header
          },
          body: JSON.stringify({ bookingId }),
        });

        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          let errorMessage = `Failed to delete conversation: ${response.status}`;
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            // If not JSON, try to get text for more detailed error (e.g., HTML error page)
            const errorText = await response.text();
            errorMessage += `\nServer response: ${errorText.substring(0, 500)}`; // Log first 500 chars
          }
          throw new Error(errorMessage);
        }

        // Remove conversation from local state
        setMessages(prevMessages => prevMessages.filter(msg => msg.bookingId !== bookingId));
        setSelectedBooking(null); // Clear selection
        // Optionally, show a success toast/notification here
        console.log(`Conversation ${bookingId} deleted successfully.`);

      } catch (error) {
        console.error('Error deleting conversation:', error);
        // Optionally, show an error toast/notification here
        alert(`Error: ${error.message}`);
      }
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
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left panel - Message List */}
        <div className="w-full md:w-2/5 bg-white overflow-y-auto border-r border-gray-200" style={{ minHeight: 500 }}>
          <div className="p-4 border-b bg-gray-50 sticky top-0 z-10">
            <h3 className="text-lg font-semibold text-blue-900">Message Senders</h3>
          </div>
          
          {isLoading ? (
            <div className="text-center py-4">Loading messages...</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No messages found.</div>
              ) : (
                messages
                  .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
                  .map((msg, idx) => {
                    const unread = msg.status === 'unread';
                    const sender = (msg.type === 'contact' || msg.bookingId === 'contact_form') ? (msg.author || 'Form Submission') : (getContactPersonDetails(msg.bookingId, messages)?.name || msg.author || 'Customer');
                    const subject = getMessageSubject(msg);
                    const preview = getMessagePreview([msg]);
                    const received = formatShortDate(msg.createdAt);
                    // const updated = msg.updatedAt && msg.updatedAt !== msg.createdAt ? formatShortDate(msg.updatedAt) : '';
                    return (
                      <div
                        key={msg._id}
                        className={`flex items-center px-3 py-3 cursor-pointer hover:bg-blue-50 transition group ${selectedBooking === msg.bookingId ? 'bg-blue-100' : ''} ${unread ? 'font-semibold' : 'font-normal'}`}
                        onClick={() => {
                          setSelectedBooking(msg.bookingId);
                          markConversationAsRead(msg.bookingId);
                        }}
                        aria-label={`Message from ${sender}, received ${received}${unread ? ', unread' : ''}`}
                      >
                        <div className="flex-shrink-0 w-5">
                          {unread && <span className="block w-2 h-2 rounded-full bg-blue-500" title="Unread" />}
                        </div>
                        <div className={`w-32 truncate mr-3 ${unread ? 'text-blue-900' : 'text-gray-700'}`}>{sender}</div>
                        <div className={`flex-grow truncate mr-3 ${unread ? 'text-gray-800' : 'text-gray-600 text-sm'}`}>
                          {subject || preview}
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap ml-auto">
                          {received}
                          {/* {updated && <span className="text-yellow-600 ml-1">(edited)</span>} */}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          )}
        </div>
        
        {/* Right panel - Message Content */}
        <div className="w-full md:w-3/5 bg-gray-50 overflow-y-auto" style={{ minHeight: 500 }}>
          {selectedBooking && (bookingDetails || isContactFormMessage(selectedBooking)) ? (
            <>
              {/* Metadata Header */} 
              <div className="p-4 border-b bg-white sticky top-0 z-10">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Message Details</h3>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleDeleteConversation(selectedBooking)}
                      className="bg-transparent mr-3 p-1 text-red-600 hover:text-red-800 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      title="Delete Conversation"
                      aria-label="Delete Conversation"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => setSelectedBooking(null)} 
                      className="bg-transparent p-1 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                      title="Close Details"
                      aria-label="Close Details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                {(() => {
                    const thread = messages.filter(msg => msg.bookingId === selectedBooking);
                    const first = thread[0];
                    if (!first) return null;
                    const senderName = isContactFormMessage(selectedBooking) ? (first?.author || 'Form Submission') : (getContactPersonDetails(selectedBooking, messages)?.name || first?.author || 'Customer');
                    const senderEmail = isContactFormMessage(selectedBooking) ? (first?.email || 'No email provided') : (getContactPersonDetails(selectedBooking, messages)?.email || first?.email || 'No email provided');
                    const cellphone = first?.cellphone; // Get cellphone number
                    const received = formatShortDate(first.createdAt);
                    const updated = first.updatedAt && first.updatedAt !== first.createdAt ? formatShortDate(first.updatedAt) : null;
                    const type = isContactFormMessage(selectedBooking) ? 'Contact Form Message' : 'Booking Message';
                    return (
                      <div className="text-sm text-gray-700 space-y-1">
                        <div><span className="font-semibold">Sender:</span> {senderName}{senderEmail !== 'No email provided' && <span className="ml-2 text-gray-500">(&lt;{senderEmail}&gt;)</span>}</div>
                        {cellphone && <div><span className="font-semibold">Cellphone:</span> {cellphone}</div>} {/* Display cellphone if available */}
                        <div><span className="font-semibold">Received:</span> {received}</div>
                        {updated && <div><span className="font-semibold">Updated:</span> {updated} <span className="text-yellow-600">(edited)</span></div>}
                        <div><span className="font-semibold">Type:</span> {type}</div>
                        <div><span className="font-semibold">Booking ID:</span> {selectedBooking}</div>
                      </div>
                    );
                  })()}
                </div>
                {/* Messages Thread */}
                <div className="p-4 space-y-4">
                {messages.filter(msg => msg.bookingId === selectedBooking).map((message, index) => (
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
                ))}
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

