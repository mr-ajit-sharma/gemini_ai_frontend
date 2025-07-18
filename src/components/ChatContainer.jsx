import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatMessage from './ChatMessage.jsx';
import MessageInput from './MessageInput.jsx';
import { sendMessageToBackend } from '../utils/api.js';
import { toast } from 'react-toastify';

function ChatContainer({ chatHistory, setChatHistory, sessionId, chatContainerRef, user, setUser }) {
  const [isLoading, setIsLoading] = useState(false);
  const [generationType, setGenerationType] = useState('text');
  const navigate = useNavigate();

  console.log('ChatContainer user state:', user);

  const handleSendMessage = async (message, file) => {
    if (!sessionId) {
      toast.error('Session ID is missing.');
      return;
    }

    if (generationType === 'text' && (!message || !message.trim())) {
      toast.error('Please enter a valid text message.');
      return;
    }

    if ((generationType === 'image' || generationType === 'video') && !user) {
      toast.error('Please sign up or log in to upload images or videos.');
      navigate('/login');
      return;
    }

    if ((generationType === 'image' || generationType === 'video') && !file) {
      toast.error(`Please upload an ${generationType} file.`);
      return;
    }

    setChatHistory([...chatHistory, {
      role: 'user',
      text: message ? message.trim() : `Uploaded ${generationType}`,
      mediaType: file ? generationType : null,
      mediaUrl: null,
    }]);
    setIsLoading(true);

    try {
      let response;
      if (generationType === 'text') {
        response = await sendMessageToBackend(
          { message, sessionId },
          user?.token,
          '/api/chat/text'
        );
      } else {
        const formData = new FormData();
        formData.append('message', message || '');
        formData.append('sessionId', sessionId);
        formData.append('type', generationType);
        formData.append('media', file);
        response = await sendMessageToBackend(
          formData,
          user?.token,
          '/api/chat/upload'
        );
      }

      console.log('Backend response:', response);
      const aiMessage = {
        role: 'model',
        text: response.aiResponse,
        mediaType: response.mediaType,
        mediaUrl: response.mediaUrl ? `https://gemini-ai-backend-r1rc.onrender.com${response.mediaUrl}` : null,
      };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in ChatContainer:', error);
      const errorMessage = error.message.includes('503')
        ? `The ${generationType} service is temporarily unavailable. Please try again later.`
        : `Error: ${error.message}`;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    console.log('Logging out user:', user);
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg flex flex-col h-[80vh]">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h1 className="text-xl font-semibold">Onboarding Buddy</h1>
        <p className="text-sm">Your AI-powered onboarding assister</p>
        <div className="mt-2 flex justify-between items-center">
          <div className="relative">
            <label htmlFor="generationType" className="mr-2">Input Type:</label>
            <select
              id="generationType"
              value={generationType}
              onChange={(e) => setGenerationType(e.target.value)}
              className="p-1 bg-white text-black rounded focus:outline-none"
            >
              <option value="text">Text</option>
              {user && <option value="image">Image Upload</option>}
              {user && <option value="video">Video Upload</option>}
            </select>
            <span className="text-xs text-gray-200 ml-2">
              {user ? 'Upload images or videos.' : 'Log in to upload images or videos.'}
            </span>
          </div>
          <div>
            {user ? (
              <button
                onClick={handleLogout}
                className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Log Out
              </button>
            ) : (
              <>
                <a href="/login" className="mr-2 text-white underline">Log In</a>
                <a href="/signup" className="text-white underline">Sign Up</a>
              </>
            )}
          </div>
        </div>
      </div>
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto chat-container">
        {chatHistory.length === 0 && !isLoading ? (
          <div className="text-gray-500 text-center">
            Start by typing a message or uploading an image/video (after signing up)!
          </div>
        ) : (
          <>
            {chatHistory.map((msg, index) => (
              <ChatMessage key={index} role={msg.role} text={msg.text} mediaType={msg.mediaType} mediaUrl={msg.mediaUrl} />
            ))}
            {isLoading && (
              <div className="text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading...</span>
              </div>
            )}
          </>
        )}
      </div>
      <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} generationType={generationType} user={user} />
    </div>
  );
}

export default ChatContainer;