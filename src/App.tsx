import SignUpModal from "./pages/SignUpModal";
import MainScreen from "./pages/MainScreen";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



function App() {
  const handleUsernameSubmit = (username: string) => {
    console.log("Usuário logado:", username);
  };

  return (
      <Router>
        <Routes>
        <Route path="/" element={<SignUpModal onSubmit={handleUsernameSubmit} />} />
          <Route path="/main" element={<MainScreen />} />
        </Routes>
      </Router>
    );
  }
  
  export default App;
