import { useState } from 'react';

function MessageInput({ onSendMessage, disabled, generationType, user }) {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(message, file);
    setMessage('');
    setFile(null);
    if (e.target.querySelector('input[type="file"]')) {
      e.target.querySelector('input[type="file"]').value = '';
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
      {(generationType === 'image' || generationType === 'video') && user ? (
        <div className="mb-2">
          <label className="block text-gray-700">
            Upload {generationType === 'image' ? 'Image (JPEG/PNG)' : 'Video (MP4)'}
          </label>
          <input
            type="file"
            accept={generationType === 'image' ? 'image/jpeg,image/png' : 'video/mp4'}
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            disabled={disabled}
          />
        </div>
      ) : null}
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={generationType === 'text' ? 'Type your message...' : 'Optional description...'}
          className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-600"
          disabled={disabled}
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 disabled:bg-gray-400"
          disabled={disabled}
        >
          Send
        </button>
      </div>
    </form>
  );
}

export default MessageInput;