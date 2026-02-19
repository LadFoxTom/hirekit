'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface ScheduleInfo {
  title: string;
  companyName: string;
  duration: number;
  availableFrom: string;
  availableTo: string;
}

export default function SchedulePage() {
  const params = useParams();
  const token = params.token as string;
  const [info, setInfo] = useState<ScheduleInfo | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/schedule/${token}`)
      .then((r) => {
        if (!r.ok) throw new Error('Invalid or expired link');
        return r.json();
      })
      .then((data) => setInfo(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return;
    setBooking(true);
    setError('');

    try {
      const startTime = new Date(`${selectedDate}T${selectedTime}`);
      const res = await fetch(`/api/v1/schedule/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startTime: startTime.toISOString(), timezone }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to book');
      }

      setBooked(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error && !info) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Link Unavailable</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (booked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Interview Booked!</h1>
          <p className="text-gray-600">
            Your interview has been confirmed for {selectedDate} at {selectedTime} ({timezone}).
            You'll receive a confirmation email shortly.
          </p>
        </div>
      </div>
    );
  }

  if (!info) return null;

  // Generate available dates
  const fromDate = new Date(info.availableFrom);
  const toDate = new Date(info.availableTo);
  const dates: string[] = [];
  const d = new Date(fromDate);
  while (d <= toDate && dates.length < 30) {
    // Skip weekends
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      dates.push(d.toISOString().split('T')[0]);
    }
    d.setDate(d.getDate() + 1);
  }

  // Generate time slots (9AM - 5PM in 30-min increments)
  const timeSlots: string[] = [];
  for (let h = 9; h < 17; h++) {
    timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${h.toString().padStart(2, '0')}:30`);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-[#4F46E5] px-8 py-6">
            <h1 className="text-xl font-bold text-white">{info.title}</h1>
            <p className="text-indigo-200 text-sm mt-1">{info.companyName}</p>
            <p className="text-indigo-200 text-sm mt-1">{info.duration} minutes</p>
          </div>

          <div className="p-8 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Select a Date</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              >
                <option value="">Choose a date...</option>
                {dates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </option>
                ))}
              </select>
            </div>

            {selectedDate && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Select a Time</label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedTime === time
                          ? 'bg-[#4F46E5] text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              >
                {['UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Australia/Sydney'].map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleBook}
              disabled={booking || !selectedDate || !selectedTime}
              className="w-full py-3 bg-[#4F46E5] text-white rounded-xl font-semibold shadow-md shadow-indigo-500/25 hover:shadow-lg transition-all disabled:opacity-50"
            >
              {booking ? 'Booking...' : 'Confirm Interview'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
