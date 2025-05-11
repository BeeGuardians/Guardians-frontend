import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/HomePage/Home.tsx";
import Login from "./pages/LoginPage/Login";
import Dashboard from "./pages/Dashboard/DashboardPage"; // ✅ 수정된 부분
import RankingPage from "./pages/RankingPage/RankingPage";
import Header from "./components/Header";
import AuthHeader from "./components/AuthHeader";
import WargamePage from "./pages/WargamePage/WargamePage";
import FindPassword from "./pages/LoginPage/FindPassword.tsx";
import WargameDetailPage from "./pages/WargamePage/WargameDetailPage.tsx";

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
import BoardWrite from "./pages/community/BoardWrite.tsx";
import FreeBoardDetailPage from "./pages/community/FreeBoardDetailPage.tsx";
import StudyBoardDetailPage from "./pages/community/StudyBoardDetailPage.tsx";
import InquiryBoardDetailPage from "./pages/community/InquiryBoardDetailPage.tsx";

// ✅ 마이페이지 관련
import MypagePage from "./pages/MyPage/MypagePage";
import MypageInfoCard from "./pages/MyPage/MypageInfoCard";
import PostsPage from "./pages/MyPage/posts/PostsPage.tsx";

function App() {
    const location = useLocation();

    const authPaths = ["/login", "/signup", "/signup/success", "/findPassword"];
    const isAuthPage = authPaths.includes(location.pathname);

    return (
        <AuthProvider>
            {isAuthPage ? <AuthHeader /> : <Header />}
            <div
                style={{
                    paddingTop: isAuthPage ? "0" : "5rem",
                    paddingLeft: isAuthPage ? "0" : "5rem",
                    maxWidth: "100%",
                }}
            >
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* 🔐 인증 페이지 */}
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
                    <Route
                        path="/findPassword"
                        element={
                            <PublicOnlyRoute>
                                <FindPassword />
                            </PublicOnlyRoute>
                        }
                    />

                    {/* 🔐 마이페이지 - 공통 레이아웃 */}
                    <Route
                        path="/mypage/*"
                        element={
                            <PrivateRoute>
                                <MypagePage />
                            </PrivateRoute>
                        }
                    >
                        <Route path="" element={<MypageInfoCard />} />         {/* /mypage */}
                        <Route path="posts" element={<PostsPage />} />         {/* /mypage/posts */}
                    </Route>

                    {/* 🔐 대시보드 */}
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />

                    {/* 🔓 일반 공개 페이지 */}
                    <Route path="/ranking" element={<RankingPage />} />
                    <Route path="/wargame" element={<WargamePage />} />
                    <Route path="/wargame/:id" element={<WargameDetailPage />} />

                    {/* 💬 커뮤니티 */}
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/community/free" element={<FreeBoardPage />} />
                    <Route path="/community/free/write" element={<BoardWrite type="FREE" />} />
                    <Route path="/community/free/:id" element={<FreeBoardDetailPage />} />
                    <Route path="/community/qna" element={<QnaBoardPage />} />
                    <Route path="/community/study" element={<StudyBoardPage />} />
                    <Route path="/community/study/write" element={<BoardWrite type="STUDY" />} />
                    <Route path="/community/study/:id" element={<StudyBoardDetailPage />} />
                    <Route path="/community/inquiry" element={<InquiryBoardPage />} />
                    <Route path="/community/inquiry/write" element={<BoardWrite type="INQUIRY" />} />
                    <Route path="/community/inquiry/:id" element={<InquiryBoardDetailPage />} />
                </Routes>
            </div>
        </AuthProvider>
    );
}

export default App;