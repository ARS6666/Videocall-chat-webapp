import './App.css';
import Webcam from './components/VideoCall';
import PrivateChat from './components/privechat';
import GroupChat from './components/groupchat';
import Server from './components/runserver';
import Home from './components/home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='' element={<Home />} />
        <Route path='/webcam' element={<Webcam />} />
        <Route path='/privatechat' element={<PrivateChat />} />
        <Route path='/groupchat' element={<GroupChat />} />
        <Route path='/runserver' element={<Server />} />
      </Routes>
    </Router>
  );
}

export default App;
