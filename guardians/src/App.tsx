import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/LoginPage/Login";
import Signup from "./pages/LoginPage/Signup";
import SignupSuccess from "./pages/LoginPage/SignupSuccess";
import Dashboard from "./pages/Dashboard";
import Ranking from "./pages/Ranking";
import Header from "./components/Header";
import WargamePage from "./pages/WargamePage/WargamePage";

function App() {
    return (
        <>
            <Header />
            <div style={{ paddingTop: "5rem" , paddingLeft: "8rem" }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/signup/success" element={<SignupSuccess />} />
                    <Route path="/ranking" element={<Ranking />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/wargame" element={<WargamePage />} /> {/* ✅ 추가 */}
                </Routes>
            </div>
        </>
    );
}


export default App;
