import { BrowserRouter as Router,Routes,Route, BrowserRouter } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import UploadPage from "./pages/UploadPage"
import ResultPage from "./pages/ResultPage"
const App = () => {
  return (
    <div>
        <Router>
            <Routes>
              <Route path="/" element={<LandingPage/>} />
              <Route path="/upload" element={<UploadPage/>} />
              <Route path="/result" element={<ResultPage/>} />
            </Routes>
        </Router>
    </div>
  )
}

export default App
