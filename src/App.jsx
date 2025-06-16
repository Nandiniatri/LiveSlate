import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/homePage/HomePage';
import LiveSlateWrapper from './pages/liveSlateWrapper/LiveSlateWrapper';
import Header from './pages/header/Header';
import { useState } from 'react';
import { useUser } from './context/UserContext';

function App() {
  const [isChatOpenHeader, setIsChatOpen] = useState(false);
  const { roomID } = useUser();

  const handleSideChatBox = () => {
    setIsChatOpen(prev => !prev);
  };

  return (
    <>
      <Router>
        <Header roomID={roomID} handleSideChatBox={handleSideChatBox} isChatOpenHeader={isChatOpenHeader} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomID" element={<LiveSlateWrapper handleSideChatBox={handleSideChatBox} setIsChatOpen={setIsChatOpen} />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
