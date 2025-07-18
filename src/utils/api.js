export function generateSessionId() {
  return `session_${Math.random().toString(36).substr(2, 9)}`;
}

export async function sendMessageToBackend(data, token, endpoint = '/api/chat/text') {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const isFormData = data instanceof FormData;
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    // console.log('Sending request to:', `http://localhost:8000${endpoint}`, { data, headers });
// http://localhost:8000
    const response = await fetch(`https://gemini-ai-backend-r1rc.onrender.com${endpoint}`, {
      method: 'POST',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend error:', {
        status: response.status,
        error: errorData.error || 'Unknown error',
      });
      throw new Error(`Backend error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to send message to backend:', {
      message: error.message,
      stack: error.stack,
    });
    throw new Error(`Failed to connect to the server: ${error.message}`);
  }
}