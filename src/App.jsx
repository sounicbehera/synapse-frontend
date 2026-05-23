import { useState } from 'react';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';

function App() {
  const [isAuth] = useState(() => {
    // Check if user session payload is present in browser memory
    return !!localStorage.getItem("userInfo");
  });

  return (
    <>
      {isAuth ? <ChatPage /> : <AuthPage />}
    </>
  );
}

export default App;