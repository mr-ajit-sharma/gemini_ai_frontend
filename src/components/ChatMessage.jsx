function ChatMessage({ role, text, mediaType, mediaUrl }) {
  return (
    <div className={`mb-4 ${role === 'user' ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block p-3 rounded-lg ${
          role === 'user' ? 'bg-blue-100 text-black' : 'bg-gray-200 text-black'
        }`}
      >
        {text && <p>{text}</p>}
        {mediaType === 'image' && mediaUrl && (
          <img
            src={mediaUrl}
            alt="Generated Image"
            className="mt-2 max-w-full h-auto rounded"
            onError={() => console.error('Failed to load image:', mediaUrl)}
          />
        )}
        {mediaType === 'video' && mediaUrl && (
          <video
            controls
            className="mt-2 max-w-full h-auto rounded"
            onError={() => console.error('Failed to load video:', mediaUrl)}
          >
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">{role === 'user' ? 'You' : 'AI'}</p>
    </div>
  );
}

export default ChatMessage;