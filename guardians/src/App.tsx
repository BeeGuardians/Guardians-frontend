import { Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage/Home.tsx";
import Login from "./pages/LoginPage/Login";
import Dashboard from "./pages/Dashboard";
import Ranking from "./pages/Ranking";
import Header from "./components/Header";
import WargamePage from "./pages/WargamePage/WargamePage";

//커뮤니티 관련
import CommunityPage from "./pages/community/CommunityPage";
import FreeBoardPage from "./pages/community/FreeBoardPage";
import QnaBoardPage from "./pages/community/QnaBoardPage";
import StudyBoardPage from "./pages/community/StudyBoardPage";
import InquiryBoardPage from "./pages/community/InquiryBoardPage";
import SignupSuccess from "./pages/LoginPage/SignupSuccess.tsx";
import Signup from "./pages/LoginPage/Signup.tsx";

function App() {
    return (
        <>
            <Header />
            <div style={{ paddingTop: "5rem", paddingLeft: "3rem" }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/ranking" element={<Ranking />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/wargame" element={<WargamePage />} />

                    {/* 로그인 관련 */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/signup/success" element={<SignupSuccess />} />

                    {/* 커뮤니티 전체 */}
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/community/free" element={<FreeBoardPage />} />
                    <Route path="/community/qna" element={<QnaBoardPage />} />
                    <Route path="/community/study" element={<StudyBoardPage />} />
                    <Route path="/community/inquiry" element={<InquiryBoardPage />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
