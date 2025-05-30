// src/App.tsx
import { Route, Routes, useLocation, Navigate } from "react-router-dom"; // Navigate 임포트
import Home from "./pages/HomePage/Home.tsx";
import Login from "./pages/LoginPage/Login";
import Dashboard from "./pages/Dashboard/DashboardPage";
import RankingPage from "./pages/RankingPage/RankingPage";
import Header from "./components/Header";
import AuthHeader from "./components/AuthHeader";
import AdminHeader from "./components/AdminHeader"; // AdminHeader 임포트
import AdminPrivateRoute from "./components/AdminPrivateRoute"; // AdminPrivateRoute 임포트
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
import WargameListPage from "./pages/AdminPage/WargamePage/WargameListPage.tsx";
import AdminDashboardPage from "./pages/AdminPage/DashboardPage/AdminDashboard.tsx";
import JobListPage from "./pages/AdminPage/JobPage/JobListPage";
import UserManagementPage from "./pages/AdminPage/UserPage/UserManagementPage";
import WargameCreatePage from "./pages/AdminPage/WargamePage/WargameCreatePage.tsx";
import JobCreatePage from "./pages/AdminPage/JobPage/JobCreatePage.tsx";

function App() {
    const location = useLocation();

    // 인증 관련 경로들을 정의합니다.
    const authPaths = ["/login", "/signup", "/signup/success", "/findPassword"];
    // 현재 경로가 관리자 페이지인지 확인합니다.
    const isAdminPath = location.pathname.startsWith("/admin");
    // 현재 경로가 일반 인증 페이지인지 확인합니다.
    const isAuthPage = authPaths.includes(location.pathname);

    // 현재 경로에 따라 어떤 헤더를 렌더링할지 결정하는 함수
    const renderHeader = () => {
        if (isAdminPath) {
            return <AdminHeader />; // 관리자 페이지는 AdminHeader
        } else if (isAuthPage) {
            return <AuthHeader />; // 로그인/회원가입 페이지는 AuthHeader
        } else {
            return <Header />; // 그 외 일반 페이지는 Header
        }
    };

    return (
        <AuthProvider>
            {renderHeader()} {/* 결정된 헤더를 렌더링 */}
            <div
                style={{
                    // 관리자 페이지와 인증 페이지는 paddingTop 0, 그 외는 Header 높이만큼 5rem
                    paddingTop: (isAdminPath || isAuthPage) ? "0" : "5rem",
                    minHeight: "calc(100vh - 5rem - 200px)", // 헤더 + 푸터 높이 고려
                }}
            >
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* 로그인/회원가입/비밀번호 찾기 - PublicOnlyRoute로 보호 */}
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

                    {/* 마이페이지 - PrivateRoute로 보호 */}
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

                    {/* 대시보드 - PrivateRoute로 보호 */}
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />

                    {/* 일반 공개 페이지들 */}
                    <Route path="/ranking" element={<RankingPage />} />
                    <Route path="/wargame" element={<WargamePage />} />
                    <Route path="/wargame/:id" element={<WargameDetailPage />} />
                    <Route path="/job" element={<JobPage />} />
                    <Route path="/job/:id" element={<JobDetailPage />} />

                    {/* 커뮤니티 페이지들 (일반 공개) */}
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

                    <Route path="/admin/*" element={<AdminPrivateRoute />}>
                        <Route index element={<Navigate to="/admin/login" replace />} />
                        <Route path="login" element={<AdminLoginPage />} />
                        <Route path="dashboard" element={<AdminDashboardPage />} />
                        <Route path="wargames" element={<WargameListPage />} />
                        <Route path="wargames/create" element={<WargameCreatePage />} /> {/* ✨ 워게임 생성 페이지 추가 ✨ */}
                        <Route path="jobs" element={<JobListPage />} />
                        <Route path="jobs/create" element={<JobCreatePage />} /> {/* ✨ 채용공고 생성 페이지 추가 ✨ */}
                        <Route path="users" element={<UserManagementPage />} />
                    </Route>

                </Routes>
                {/* 관리자 페이지나 일반 인증 페이지가 아닐 때만 푸터 렌더링 */}
                {!(isAdminPath || isAuthPage) && <Footer />}
            </div>
        </AuthProvider>
    );
}

export default App;