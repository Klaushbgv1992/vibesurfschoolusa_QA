"use client";
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function MessagesPanel({ selectedBooking }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Fetch messages when a booking is selected
  useEffect(() => {
    if (selectedBooking) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [selectedBooking]);

  const fetchMessages = async () => {
    if (!selectedBooking) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/messages?bookingId=${selectedBooking._id}`, {
        credentials: 'same-origin',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
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
          bookingId: selectedBooking._id,
          content: newMessage,
          author: 'Admin',
          type: 'note'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create message: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setNewMessage("");
        fetchMessages(); // Refresh messages
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
      const response = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
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
        fetchMessages(); // Refresh messages
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
        fetchMessages(); // Refresh messages
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

  if (!selectedBooking) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">Messages & Notes</h3>
      
      {isLoading ? (
        <div className="text-center py-4">Loading messages...</div>
      ) : (
        <div className="max-h-60 overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No messages for this booking yet.</div>
          ) : (
            <ul className="space-y-3">
              {messages.map((message) => (
                <li key={message._id} className="p-3 bg-gray-50 rounded">
                  {editingMessage === message._id ? (
                    <div>
                      <textarea
                        className="w-full p-2 border rounded"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button 
                          className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm"
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
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-gray-500">
                          {formatDate(message.createdAt)}
                          {message.updatedAt && message.updatedAt !== message.createdAt && 
                            " (edited)"}
                        </span>
                        <div className="flex space-x-1">
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
                      </div>
                      <p className="mt-1 text-sm">{message.content}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmitMessage} className="mt-3">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-grow p-2 border rounded-l"
            placeholder="Add a message or note..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-r"
            disabled={!newMessage.trim()}
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
