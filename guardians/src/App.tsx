import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
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
                    <Route path="/ranking" element={<Ranking />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/wargame" element={<WargamePage />} /> {/* ✅ 추가 */}
                </Routes>
            </div>
        </>
    );
}


export default App;
