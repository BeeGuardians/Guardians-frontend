// src/pages/AdminPage/AdminLoginPage.tsx

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✨ useNavigate 임포트 ✨
import { useAuth } from "../../context/AuthContext"; // ✨ useAuth 임포트 ✨
import styles from "../LoginPage/Login.module.css";
import emailIcon from "../../assets/mail.png";
import lockIcon from "../../assets/lock.png";
import ErrorModal from "../ErrorModal/ErrorModal";

const AdminLoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showModal, setShowModal] = useState(false);

    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate(); // ✨ useNavigate 훅 사용 ✨
    const { login } = useAuth(); // ✨ AuthContext의 login 함수 가져오기 ✨

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setErrorMsg("이메일과 비밀번호를 모두 입력해주세요.");
            setShowModal(true);
            return;
        }

        try {
            const res = await axios.post(
                `${API_BASE}/api/users/admin/login`, // 관리자 로그인 API
                { email, password },
                { withCredentials: true }
            );

            // ✨ 로그인 성공 시 AuthContext의 login 함수 호출 ✨
            // 백엔드 응답에서 user 정보를 직접 가져와 login 함수에 전달해야 합니다.
            // 현재 AuthContext의 User 타입에는 id, email, username만 있습니다.
            // 백엔드 응답 구조에 맞게 user 객체를 구성해야 합니다.
            // 예를 들어, res.data.result.data.user 에 사용자 정보가 있다고 가정합니다.
            const adminUserData = res.data.result.data; // 백엔드 응답에서 유저 정보를 가져옴
            login(adminUserData); // AuthContext에 로그인 상태 전달

            // 로그인 성공 후 /admin/wargames로 새로고침 없이 이동
            navigate("/admin/dashboard");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setErrorMsg(err.response?.data?.message || "관리자 로그인 실패");
            } else {
                setErrorMsg("알 수 없는 오류가 발생했습니다.");
            }
            setShowModal(true);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleLogin();
    };

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.textBox} style={{ marginTop: "3rem" }}>
                    <p>환영합니다,</p>
                    <p>
                        <span style={{ fontWeight: "750", color: "#fff" }}>가디언즈</span>{" "}
                        <strong style={{ fontSize: "2.1rem", color: "white" }}>운영자 전용 페이지</strong>입니다.
                    </p>
                </div>
                <img src="/login_logo.png" alt="login visual" className={styles.visual} />
            </div>

            <div className={styles.right}>
                <form className={styles.loginBox} onSubmit={handleSubmit} autoComplete="on">
                    <h2 className={styles.title}>관리자 로그인</h2>
                    <div className={styles.inputSection}>
                        <div className={styles.inputGroup}>
                            <img src={emailIcon} alt="email" />
                            <input
                                type="email"
                                placeholder="관리자 이메일"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <img src={lockIcon} alt="lock" />
                            <input
                                type="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className={styles.buttonSection}>
                        <button type="submit" className={styles.loginButton}>
                            로그인하기
                        </button>
                    </div>
                </form>
            </div>

            {showModal && <ErrorModal message={errorMsg} onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default AdminLoginPage;