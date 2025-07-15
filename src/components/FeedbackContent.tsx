import React, { useState } from 'react';
import { todoImplement } from '../todo';

const FeedbackContent: React.FC<{ id: string }> = ({ id }) => {
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'other'>('bug');
  const [feedbackText, setFeedbackText] = useState('');

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) {
      alert('Please enter your feedback.');
      return;
    }
    console.log('Submitting Feedback:', {
      type: feedbackType,
      text: feedbackText,
      windowId: id,
    });
    // Use todoImplement to simulate sending feedback to a backend or logging service.
    todoImplement(`Submit feedback: Type=${feedbackType}, Feedback="${feedbackText.substring(0, 50)}..."`);
    setFeedbackText(''); // Clear the textarea after submission
    alert('Thank you for your feedback!');
  };

  return (
    <div className="flex-grow p-6 overflow-y-auto bg-gray-800 text-white">
      <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-3">Send Feedback</h2>
      <div className="space-y-5 max-w-3xl mx-auto">
        
        {/* Feedback Type */}
        <div>
          <label htmlFor="feedback_type" className="block text-lg font-semibold mb-2">Feedback Type</label>
          <select
            id="feedback_type"
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value as typeof feedbackType)}
            className="w-full p-3 bg-gray-900/50 border border-white/20 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Feedback Details */}
        <div>
          <label htmlFor="feedback_text" className="block text-lg font-semibold mb-2">Your Feedback</label>
          <textarea
            id="feedback_text"
            rows={8}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="w-full p-3 bg-gray-900/50 border border-white/20 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder="Describe the issue or suggest a feature..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            onClick={handleFeedbackSubmit}
            disabled={!feedbackText.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackContent;
