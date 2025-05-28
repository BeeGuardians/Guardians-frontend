// src/pages/AdminPage/AdminLoginPage.tsx

import { useState } from "react";
import axios from "axios";
import styles from "../LoginPage/Login.module.css"; // ✅ 로그인과 동일한 스타일 사용
import emailIcon from "../../assets/mail.png";
import lockIcon from "../../assets/lock.png";
import ErrorModal from "../ErrorModal/ErrorModal";

const AdminLoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showModal, setShowModal] = useState(false);

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setErrorMsg("이메일과 비밀번호를 모두 입력해주세요.");
            setShowModal(true);
            return;
        }

        try {
            await axios.post(
                `${API_BASE}/api/users/admin/login`, // ✅ 관리자 로그인 API
                { email, password },
                { withCredentials: true }
            );
            // 로그인 성공 후 이동
            window.location.href = "/admin/wargames";
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