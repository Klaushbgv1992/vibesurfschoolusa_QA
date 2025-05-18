import React, { useState } from 'react';

export default function GroupDetailsForm({ onSubmit, loading }) {
  const [participants, setParticipants] = useState(5);
  const [ages, setAges] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (participants < 5) {
      setError('Minimum 5 participants required.');
      return;
    }
    if (!ages.trim()) {
      setError('Please enter the ages or age ranges of all participants.');
      return;
    }
    setError('');
    onSubmit({ participants, ages, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold">Group Details</h2>
      <div>
        <label className="block font-medium">Number of Participants</label>
        <input
          type="number"
          min={5}
          value={participants}
          onChange={e => setParticipants(Number(e.target.value))}
          className="w-full border rounded px-3 py-2 mt-1"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Ages or Age Ranges of Participants</label>
        <input
          type="text"
          placeholder="e.g. 12, 13, 15, 17, 18 or 10-12, 13-15, 16+"
          value={ages}
          onChange={e => setAges(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          required
        />
        <p className="text-xs text-gray-500 mt-1">List ages or age ranges (e.g. 10-12, 13-15, 16+)</p>
      </div>
      <div>
        <label className="block font-medium">Special Requests / Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          rows={3}
        />
      </div>
      {error && <div className="text-red-600 font-medium">{error}</div>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        disabled={loading}
      >
        Submit Group Inquiry
      </button>
    </form>
  );
}
