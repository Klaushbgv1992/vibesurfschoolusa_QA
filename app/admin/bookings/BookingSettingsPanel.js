import React, { useState, useEffect } from "react";

const defaultSeasons = [
  { season: "summer", startTime: "06:00", endTime: "19:00" },
  { season: "winter", startTime: "08:00", endTime: "17:00" },
];

export default function BookingSettingsPanel({ sites, selectedBeaches, onSettingsChange }) {
  const [leadTime, setLeadTime] = useState(24);
  const [seasonalWindows, setSeasonalWindows] = useState(defaultSeasons);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  // New state for range selection
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const today = new Date().toISOString().split('T')[0];

  // Helper to add a range of blocked dates
  const handleAddBlockedRange = () => {
    if (!rangeStart || !rangeEnd) return;
    const start = new Date(rangeStart);
    const end = new Date(rangeEnd);
    if (start > end || rangeStart < today || rangeEnd < today) return;
    const newDates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      if (!blockedDates.includes(dateStr)) {
        newDates.push(dateStr);
      }
    }
    setBlockedDates([...blockedDates, ...newDates]);
    setRangeStart("");
    setRangeEnd("");
  };

  // Validation for range
  const rangeInvalid = !rangeStart || !rangeEnd || rangeStart > rangeEnd || rangeStart < today || rangeEnd < today;

  // Fetch settings when selected beaches change
  useEffect(() => {
    // Skip API call if no sites selected
    if (!sites || sites.length === 0) return;
    
    // Use a ref to track whether this component is mounted
    // This will help prevent state updates after unmounting
    const isMounted = true;
    setLoading(true);
    
    // Get settings for the first selected beach
    const primaryBeach = sites[0];
    
    const fetchSettings = async () => {
      try {
        // Use window.location.origin to ensure we have the full URL
        const apiUrl = `${window.location.origin}/api/booking-settings?site=${encodeURIComponent(primaryBeach)}`;
        console.log('Fetching booking settings from:', apiUrl);
        
        const response = await fetch(apiUrl, {
          credentials: 'same-origin',
          cache: 'no-cache',
          // Add cache-busting parameter to prevent browser caching
          headers: {
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Settings fetch failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Only update state if component is still mounted
        if (isMounted) {
          if (data.success && data.settings.length > 0) {
            const s = data.settings[0];
            setLeadTime(s.leadTimeHours || 24);
            setSeasonalWindows(s.seasonalWindows || defaultSeasons);
            setBlockedDates(s.blockedDates || []);
          } else {
            // No settings found, use defaults
            setLeadTime(24);
            setSeasonalWindows(defaultSeasons);
            setBlockedDates([]);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching booking settings:', error);
        // Use defaults if fetch fails, only if component is still mounted
        if (isMounted) {
          setLeadTime(24);
          setSeasonalWindows(defaultSeasons);
          setBlockedDates([]);
          setLoading(false);
        }
      }
    };
    
    fetchSettings();
    
    // Return cleanup function
    return () => {
      // This tells the async function not to update state after unmounting
    };
  }, [sites.length > 0 ? sites[0] : null]); // Only depend on the first selected beach

  const handleSave = async () => {
    setSaving(true);
    let hasError = false;
    
    try {
      // Save settings for each selected beach
      const savePromises = sites.map(async (site) => {
        try {
          // Use window.location.origin to ensure we have the full URL
          const apiUrl = `${window.location.origin}/api/booking-settings`;
          console.log(`Saving settings for ${site} to:`, apiUrl);
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              site: site,
              leadTimeHours: leadTime,
              seasonalWindows,
              blockedDates
            }),
            credentials: 'same-origin',
            cache: 'no-cache'
          });
          
          if (!response.ok) {
            throw new Error(`Failed to save settings for ${site}: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          return data.success;
        } catch (error) {
          console.error(`Error saving settings for ${site}:`, error);
          hasError = true;
          return false;
        }
      });
      
      const results = await Promise.all(savePromises);
      
      if (hasError || results.includes(false)) {
        alert('Some settings could not be saved. Please try again.');
      } else {
        alert('Settings saved successfully!');
      }
      
      if (onSettingsChange) onSettingsChange();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert(`Failed to save settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const updateSeason = (idx, field, value) => {
    setSeasonalWindows(windows => windows.map((w, i) => i === idx ? { ...w, [field]: value } : w));
  };

  const handleAddBlockedDate = (date) => {
    if (!blockedDates.includes(date)) setBlockedDates([...blockedDates, date]);
  };

  const handleRemoveBlockedDate = (date) => {
    setBlockedDates(blockedDates.filter(d => d !== date));
  };

  if (!sites || sites.length === 0) return <div className="p-4">Select at least one beach to edit settings.</div>;
  if (loading) return <div className="p-4">Loading settings...</div>;

  return (
    <div className="p-4 bg-gray-50 rounded border mb-4">
      <h2 className="text-lg font-bold mb-2">Booking Settings for {sites.length === 1 ? sites[0] : `${sites.length} Selected Beaches`}</h2>
      {sites.length > 1 && (
        <div className="text-sm text-gray-600 mb-3">
          <p>Applying settings to: {sites.join(', ')}</p>
          <p className="font-medium text-amber-600 mt-1">⚠️ These settings will be applied to ALL selected beaches.</p>
        </div>
      )}
      <div className="mb-3">
        <label className="block font-medium">Lead Time (hours):</label>
        <input type="number" min={0} className="border p-2 rounded w-24" value={leadTime} onChange={e => setLeadTime(Number(e.target.value))} />
      </div>
      <div className="mb-3">
        <label className="block font-medium mb-1">Seasonal Booking Windows:</label>
        {seasonalWindows.map((w, i) => (
          <div key={w.season} className="flex items-center gap-2 mb-1">
            <span className="w-20 capitalize">{w.season}:</span>
            <input type="time" value={w.startTime} onChange={e => updateSeason(i, 'startTime', e.target.value)} className="border p-1 rounded" />
            <span>to</span>
            <input type="time" value={w.endTime} onChange={e => updateSeason(i, 'endTime', e.target.value)} className="border p-1 rounded" />
          </div>
        ))}
      </div>
      <div className="mb-3">
        <label className="block font-medium mb-1">Blocked Dates:</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {blockedDates.map(date => (
            <span key={date} className="bg-red-200 px-2 py-1 rounded flex items-center">
              {date}
              <button className="ml-1 text-red-700 font-bold" onClick={() => handleRemoveBlockedDate(date)}>&times;</button>
            </span>
          ))}
        </div>
        {/* Add individual date */}
        <div className="flex items-center gap-2 mb-2">
          <input type="date" onChange={e => handleAddBlockedDate(e.target.value)} className="border p-1 rounded" />
          <span className="text-sm">Add individual date</span>
        </div>
        {/* Add date range */}
        <div className="flex items-center gap-2">
          <input type="date" value={rangeStart || ''} min={today} onChange={e => setRangeStart(e.target.value)} className="border p-1 rounded" />
          <span>to</span>
          <input type="date" value={rangeEnd || ''} min={today} onChange={e => setRangeEnd(e.target.value)} className="border p-1 rounded" />
          <button className="px-3 py-1 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors" onClick={handleAddBlockedRange} disabled={rangeInvalid}>Add Range</button>
        </div>
        {rangeInvalid && (rangeStart || rangeEnd) && (
          <div className="text-red-600 text-xs mt-1">Please select a valid date range (start and end must be today or later, and start must be before or equal to end).</div>
        )}
      </div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
    </div>
  );
}
