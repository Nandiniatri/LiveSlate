import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/homePage/HomePage';
import LiveSlateWrapper from './pages/liveSlateWrapper/LiveSlateWrapper';
import Header from './pages/header/Header';
import SignUpPage from './pages/signUpPage/SignUp';
import { UsernameProvider } from './context/UsernamePrompt';

function App() {

  return (
    <>
      <UsernameProvider>
        <Router>
          {/* <Header /> */}
          <Routes>
            <Route path="*" element={<Home />} />
            <Route path="/room/:roomID" element={<LiveSlateWrapper />} />
            <Route path="/signUp" element={<SignUpPage />} />
          </Routes>
        </Router>
      </UsernameProvider>
    </>
  )
}

export default App
