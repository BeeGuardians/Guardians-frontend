import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/HomePage/Home.tsx";
import Login from "./pages/LoginPage/Login";
import Dashboard from "./pages/Dashboard/DashboardPage";
import RankingPage from "./pages/RankingPage/RankingPage";
import Header from "./components/Header";
import AuthHeader from "./components/AuthHeader";
import WargamePage from "./pages/WargamePage/WargamePage";
import FindPassword from "./pages/LoginPage/FindPassword.tsx";
import WargameDetailPage from "./pages/WargamePage/WargameDetailPage.tsx";
import JobPage from "./pages/JobPage/JobPage";
import JobDetailPage from "./pages/JobPage/JobDetailPage";

import CommunityPage from "./pages/Community/CommunityPage";
import FreeBoardPage from "./pages/Community/FreeBoardPage";
import QnaBoardPage from "./pages/Community/QnaBoardPage";
import StudyBoardPage from "./pages/Community/StudyBoardPage";
import InquiryBoardPage from "./pages/Community/InquiryBoardPage";
import SignupSuccess from "./pages/LoginPage/SignupSuccess.tsx";
import Signup from "./pages/LoginPage/Signup.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import PrivateRoute from "./components/PrivateRoute";
import BoardWrite from "./pages/Community/BoardWrite.tsx";
import FreeBoardDetailPage from "./pages/Community/FreeBoardDetailPage.tsx";
import StudyBoardDetailPage from "./pages/Community/StudyBoardDetailPage.tsx";
import InquiryBoardDetailPage from "./pages/Community/InquiryBoardDetailPage.tsx";

import MypagePage from "./pages/MyPage/MypagePage";
import MypageInfoCard from "./pages/MyPage/MypageInfoCard";
import PostsPage from "./pages/MyPage/posts/PostsPage.tsx";
import Footer from "./components/Footer.tsx";
import QnaDetailPage from "./pages/Community/QnaDetailPage.tsx";
import QnaWrite from "./pages/Community/QnaWrite.tsx";
import BoardEdit from "./pages/Community/BoardEdit.tsx";

import AdminLoginPage from "./pages/AdminPage/AdminLoginPage.tsx";
import AdminWargameListPage from "./pages/AdminPage/WargamePage/WargameListPage.tsx";
import JobListPage from "./pages/AdminPage/JobPage/JobListPage";
import UserManagementPage from "./pages/AdminPage/UserPage/UserManagementPage";

function App() {
    const location = useLocation();

    const authPaths = ["/login", "/signup", "/signup/success", "/findPassword"];
    // 🔽 여기에 추가
    const isAdminPage = location.pathname.startsWith("/admin");
    const isAuthPage = authPaths.includes(location.pathname) || isAdminPage;



    return (
        <AuthProvider>
            {isAuthPage ? <AuthHeader /> : <Header />}
            <div
                style={{
                    paddingTop: isAuthPage ? "0" : "5rem",
                    minHeight: "calc(100vh - 5rem - 200px)", // 헤더 + 푸터 높이 고려
                }}
            >
                <Routes>
                    <Route path="/" element={<Home />} />

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
                    <Route path="/job" element={<JobPage />} />

                    {/* 💬 커뮤니티 */}
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/community/free" element={<FreeBoardPage />} />
                    <Route path="/community/free/write" element={<BoardWrite type="FREE" />} />
                    <Route path="/community/free/:id" element={<FreeBoardDetailPage />} />
                    <Route path="/community/free/edit/:id" element={<BoardEdit />} />
                    <Route path="/community/qna" element={<QnaBoardPage />} />
                    <Route path="/community/qna/write" element={<QnaWrite />} />
                    <Route path="/community/qna/:id" element={<QnaDetailPage />} />
                    <Route path="/community/study" element={<StudyBoardPage />} />
                    <Route path="/community/study/write" element={<BoardWrite type="STUDY" />} />
                    <Route path="/community/study/:id" element={<StudyBoardDetailPage />} />
                    <Route path="/community/study/edit/:id" element={<BoardEdit />} />
                    <Route path="/community/inquiry" element={<InquiryBoardPage />} />
                    <Route path="/community/inquiry/write" element={<BoardWrite type="INQUIRY" />} />
                    <Route path="/community/inquiry/:id" element={<InquiryBoardDetailPage />} />
                    <Route path="/community/inquiry/edit/:id" element={<BoardEdit />} />
                    <Route path="/job/:id" element={<JobDetailPage />} />

                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route path="/admin/wargames" element={<AdminWargameListPage />} />
                    <Route path="/admin/jobs" element={<JobListPage />} />
                    <Route path="/admin/users" element={<UserManagementPage />} />

                </Routes>
                {!isAuthPage && <Footer />}
            </div>
        </AuthProvider>
    );
}

export default App;