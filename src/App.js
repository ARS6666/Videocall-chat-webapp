import './App.css';
import Webcam from './components/VideoCall';
import Chat from './components/chatroom';
import Home from './components/home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='' element={<Home />} />
        <Route path='/webcam' element={<Webcam />} />
        <Route path='/chatroom' element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
