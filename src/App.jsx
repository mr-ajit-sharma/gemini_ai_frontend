import { useState, useEffect } from 'react';
   import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
   import ChatContainer from './components/ChatContainer.jsx';
   import Signup from './components/Signup.jsx';
   import Login from './components/Login.jsx';
   import { generateSessionId } from './utils/api.js';

   function App() {
     const [chatHistory, setChatHistory] = useState([]);
     const [sessionId] = useState(generateSessionId());
     const [user, setUser] = useState(null);

     useEffect(() => {
       const token = localStorage.getItem('token');
       if (token) {
         setUser({ token });
       }
     }, []);

     return (
       <Router>
         <div className="min-h-screen bg-gray-100 flex items-center justify-center">
           <Routes>
             <Route
               path="/"
               element={
                 <ChatContainer
                   chatHistory={chatHistory}
                   setChatHistory={setChatHistory}
                   sessionId={sessionId}
                   user={user}
                   setUser={setUser}
                 />
               }
             />
             <Route path="/signup" element={<Signup setUser={setUser} />} />
             <Route path="/login" element={<Login setUser={setUser} />} />
           </Routes>
         </div>
       </Router>
     );
   }

   export default App;