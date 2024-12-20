import './App.css';
import Webcam from './components/VideoCall'; // Ensure the path is correct
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/webcam' element={<Webcam />} />
      </Routes>
    </Router>
  );
}

export default App;
