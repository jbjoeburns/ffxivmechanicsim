import { BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import Homepage from './pages/homepage/homepage';
import Caloric from './pages/caloric/caloric';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route path="/caloric" element={<Caloric />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;