'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface SavedCV {
  id: string;
  title: string;
  updatedAt: string;
}

export default function TestAgentsPage() {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [cvId, setCvId] = useState('');
  const [savedCVs, setSavedCVs] = useState<SavedCV[]>([]);
  const [loadingCVs, setLoadingCVs] = useState(false);

  // Fetch user's saved CVs
  useEffect(() => {
    if (session) {
      fetchCVs();
    }
  }, [session]);

  const fetchCVs = async () => {
    setLoadingCVs(true);
    try {
      const response = await fetch('/api/cv');
      if (response.ok) {
        const data = await response.json();
        setSavedCVs(data.cvs || []);
        console.log('📄 Loaded CVs:', data.cvs);
      }
    } catch (error) {
      console.error('Error fetching CVs:', error);
    } finally {
      setLoadingCVs(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    
    try {
      const response = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          sessionId,
          cvId: cvId || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages([
          ...messages,
          { role: 'user', content: message },
          { role: 'assistant', content: data.message },
        ]);
        setSessionId(data.sessionId);
        setMessage('');

        // Log additional data
        if (data.cvAnalysis) {
          console.log('CV Analysis:', data.cvAnalysis);
        }
        if (data.jobMatches) {
          console.log('Job Matches:', data.jobMatches);
        }
      } else {
        alert(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const quickTests = [
    { label: 'Hello', message: 'hello' },
    { label: 'What can you do?', message: 'what can you do?' },
    { label: 'Analyze CV', message: 'analyze my cv', needsCv: true },
    { label: 'Find Jobs', message: 'find me jobs', needsCv: true },
    { label: 'Help', message: 'help me with my job search' },
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-4">
            You need to be logged in to test the agent system.
          </p>
          <a
            href="/auth/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Log In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h1 className="text-3xl font-bold mb-2">🤖 Agent System Test Page</h1>
          <p className="text-gray-600">
            Test the multi-agent AI system. Logged in as: <strong>{session.user?.email}</strong>
          </p>
          
          {/* CV Selection */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a CV (needed for CV analysis and job matching):
            </label>
            
            {loadingCVs ? (
              <div className="text-gray-500 py-2">Loading your CVs...</div>
            ) : savedCVs.length > 0 ? (
              <div className="space-y-2">
                <select
                  value={cvId}
                  onChange={(e) => setCvId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a CV --</option>
                  {savedCVs.map((cv) => (
                    <option key={cv.id} value={cv.id}>
                      {cv.title} (ID: {cv.id.slice(0, 8)}...)
                    </option>
                  ))}
                </select>
                
                {cvId && (
                  <div className="p-2 bg-green-50 rounded text-sm text-green-700">
                    ✅ Selected CV ID: <code className="bg-green-100 px-1 rounded">{cvId}</code>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-yellow-50 rounded text-sm text-yellow-700">
                ⚠️ No saved CVs found. Go to <a href="/" className="underline font-medium">CV Builder</a> and save a CV first.
                <button
                  onClick={fetchCVs}
                  className="ml-2 text-blue-600 underline"
                >
                  Refresh
                </button>
              </div>
            )}
          </div>

          {/* Session Info */}
          {sessionId && (
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <p className="text-sm text-blue-800">
                <strong>Session ID:</strong> {sessionId}
              </p>
            </div>
          )}
        </div>

        {/* Quick Test Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h2 className="text-xl font-bold mb-3">Quick Tests</h2>
          <div className="flex flex-wrap gap-2">
            {quickTests.map((test) => (
              <button
                key={test.label}
                onClick={() => {
                  if (test.needsCv && !cvId) {
                    alert('This test requires a CV ID. Please enter one above.');
                    return;
                  }
                  setMessage(test.message);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
              >
                {test.label}
                {test.needsCv && <span className="text-red-500 ml-1">*</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4 min-h-[400px] max-h-[600px] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Conversation</h2>
          
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm">Send a message to start testing the agent system</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-100 ml-12'
                      : 'bg-gray-100 mr-12'
                  }`}
                >
                  <div className="font-semibold text-sm mb-1">
                    {msg.role === 'user' ? '👤 You' : '🤖 Agent'}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
              placeholder="Type your message here..."
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-4 text-sm text-gray-600">
            <p className="font-semibold mb-2">💡 Try these commands:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>"hello" - Test basic greeting</li>
              <li>"what can you do?" - See capabilities</li>
              <li>"analyze my cv" - Get CV quality analysis (needs CV ID)</li>
              <li>"find me software engineer jobs" - Search for jobs (needs CV ID)</li>
              <li>"help me improve my resume" - Get CV advice</li>
            </ul>
          </div>
        </div>

        {/* Developer Info */}
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>🔧 Developer Info:</strong> Open browser console (F12) to see detailed responses 
            including CV analysis scores, job matches, and API responses.
          </p>
        </div>
      </div>
    </div>
  );
}


