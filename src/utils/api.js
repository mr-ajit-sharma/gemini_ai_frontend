export function generateSessionId() {
  return `session_${Math.random().toString(36).substr(2, 9)}`;
}

export async function sendMessageToBackend(data, token, endpoint = '/api/chat/text') {
  const baseUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : 'https://gemini-ai-backend-r1rc.onrender.com';
  const url = `${baseUrl}${endpoint}`;

  const headers = {};
  if (token && endpoint !== '/api/chat/text') { // Only add token for upload endpoint
    headers['Authorization'] = `Bearer ${token}`;
  }
  const isFormData = data instanceof FormData;
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const maxRetries = 3;
  const baseDelay = 500;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: isFormData ? data : JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Backend error:', {
          attempt,
          status: response.status,
          error: errorData.error || 'Unknown error',
        });
        if (response.status === 503 && attempt < maxRetries) {
          const delay = baseDelay * 2 ** (attempt - 1);
          console.warn(`Retrying due to 503... Attempt ${attempt}/${maxRetries}, waiting ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw new Error(`Backend error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to send message to backend:', {
        attempt,
        message: error.message,
        stack: error.stack,
      });
      if (attempt === maxRetries) {
        throw new Error(`Failed to connect to the server after ${maxRetries} attempts: ${error.message}`);
      }
    }
  }
}