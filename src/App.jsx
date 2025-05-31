import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/homePage/HomePage';
import LiveSlateWrapper from './pages/liveSlateWrapper/LiveSlateWrapper';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/room/:roomID" element={<LiveSlate />} /> */}
          <Route path="/room/:roomID" element={<LiveSlateWrapper />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
