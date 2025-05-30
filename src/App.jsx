import './App.css'
import LiveSlate from './pages/LiveSlate'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/homePage/HomePage';

function App() {

  return (
    <>
      {/* <LiveSlate /> */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomID" element={<LiveSlate />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
