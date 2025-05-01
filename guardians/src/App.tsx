import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/HomePage/Home.tsx";
import Login from "./pages/LoginPage/Login";
import Dashboard from "./pages/Dashboard";
import Ranking from "./pages/Ranking";
import Header from "./components/Header";
import AuthHeader from "./components/AuthHeader";
import WargamePage from "./pages/WargamePage/WargamePage";

// 커뮤니티 관련
import CommunityPage from "./pages/community/CommunityPage";
import FreeBoardPage from "./pages/community/FreeBoardPage";
import QnaBoardPage from "./pages/community/QnaBoardPage";
import StudyBoardPage from "./pages/community/StudyBoardPage";
import InquiryBoardPage from "./pages/community/InquiryBoardPage";
import SignupSuccess from "./pages/LoginPage/SignupSuccess.tsx";
import Signup from "./pages/LoginPage/Signup.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import PrivateRoute from "./components/PrivateRoute";

function App() {
    const location = useLocation();
    const authPaths = ["/login", "/signup", "/signup/success"];
    const isAuthPage = authPaths.includes(location.pathname);

    return (
        <AuthProvider>
            {isAuthPage ? <AuthHeader /> : <Header />}
            <div style={{ paddingTop: isAuthPage ? "0" : "5rem"}}>
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* 👇 로그인한 사람 못 들어오게 막기 */}
                    <Route
                        path="/login"
                        element={
                            <PublicOnlyRoute>
                                <Login />
                            </PublicOnlyRoute>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <PublicOnlyRoute>
                                <Signup />
                            </PublicOnlyRoute>
                        }
                    />
                    <Route
                        path="/signup/success"
                        element={
                            <PublicOnlyRoute>
                                <SignupSuccess />
                            </PublicOnlyRoute>
                        }
                    />

                    {/* ✅ 로그인한 사람만 들어올 수 있음 */}
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/mypage"
                        element={
                            <PrivateRoute>
                                <div>마이페이지</div>
                            </PrivateRoute>
                        }
                    />

                    {/* ✅ 자유 접근 가능 */}
                    <Route path="/ranking" element={<Ranking />} />
                    <Route path="/wargame" element={<WargamePage />} />

                    {/* ✅ 커뮤니티 */}
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/community/free" element={<FreeBoardPage />} />
                    <Route path="/community/qna" element={<QnaBoardPage />} />
                    <Route path="/community/study" element={<StudyBoardPage />} />
                    <Route path="/community/inquiry" element={<InquiryBoardPage />} />
                </Routes>
            </div>
        </AuthProvider>
    );
}

export default App;
