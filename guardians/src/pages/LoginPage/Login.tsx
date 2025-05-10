import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import styles from "./Login.module.css";
import emailIcon from "../../assets/mail.png";
import lockIcon from "../../assets/lock.png";
import { useAuth } from "../../context/AuthContext";
import ErrorModal from "../ErrorModal/ErrorModal"; // ✅ 경로 확인

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setErrorMsg("이메일과 비밀번호를 모두 입력해주세요.");
            setShowModal(true);
            return;
        }

        try {
            const res = await axios.post(
                `${API_BASE}/api/users/login`,
                { email, password },
                { withCredentials: true }
            );
            const userData = res.data.result.data;
            login(userData);
            window.location.href = "/";
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setErrorMsg(err.response?.data?.message || "로그인 실패");
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
                <div className={styles.textBox}>
                    <p>환영합니다,</p>
                    <span style={{ fontWeight: "750", color: "#fff" }}>모의 해킹</span> 성장을 위한 발걸음{" "}
                    <strong style={{ fontSize: "2.1rem", color: "white" }}>가디언즈</strong> 입니다.
                </div>
                <img src="/login_logo.png" alt="login visual" className={styles.visual} />
            </div>

            <div className={styles.right}>
                <form
                    className={styles.loginBox}
                    onSubmit={handleSubmit}
                    autoComplete="on"
                >
                    <h2 className={styles.title}>가디언즈 로그인</h2>
                    <div className={styles.inputSection}>
                        <div className={styles.inputGroup}>
                            <img src={emailIcon} alt="email" />
                            <input
                                type="email"
                                name="email"
                                placeholder="이메일을 입력해 주세요"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <img src={lockIcon} alt="lock" />
                            <input
                                type="password"
                                name="password"
                                placeholder="비밀번호를 입력해 주세요"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                        </div>
                    </div>
                    <div className={styles.buttonSection}>
                        <button type="submit" className={styles.loginButton}>로그인하기</button>
                        <button type="button" className={styles.signupButton} onClick={() => navigate("/signup")}>
                            이메일 회원가입
                        </button>
                        <div className={styles.findPassword} onClick={() => navigate("/findPassword")}>
                            비밀번호 찾기
                        </div>
                    </div>
                </form>
            </div>

            {showModal && <ErrorModal message={errorMsg} onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default Login;
