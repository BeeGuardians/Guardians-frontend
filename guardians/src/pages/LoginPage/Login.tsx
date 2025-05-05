import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

import styles from "./Login.module.css";
import emailIcon from "../../assets/mail.png";
import lockIcon from "../../assets/lock.png";
import {useAuth} from "../../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const {login} = useAuth();
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const handleLogin = async () => {
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
                alert("로그인 실패: " + (err.response?.data?.message || "에러 발생"));
            } else {
                alert("알 수 없는 오류가 발생했습니다");
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.textBox}>
                    <p>환영합니다,</p>
                    성장을 위한 발걸음 <strong style={{fontSize:"2.1rem", color: "white" }}>Guardians</strong> 입니다.
                </div>
                <img src="/login_logo.png" alt="login visual" className={styles.visual} />
            </div>
            <div className={styles.right}>
                <div className={styles.loginBox}>
                    <h2 className={styles.title}>가디언즈 로그인</h2>
                    <div className={styles.inputSection}>
                        <div className={styles.inputGroup}>
                            <img src={emailIcon} alt="email"/>
                            <input
                                type="email"
                                placeholder="이메일을 입력해 주세요"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <img src={lockIcon} alt="lock"/>
                            <input
                                type="password"
                                placeholder="비밀번호를 입력해 주세요"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </div>
                    <div className={styles.buttonSection}>
                        <button className={styles.loginButton} onClick={handleLogin}>로그인하기</button>
                        <button className={styles.signupButton} onClick={() => navigate("/signup")}>
                            이메일 회원가입
                        </button>
                        <div className={styles.findPassword} onClick={() => navigate("/findPassword")}>
                            비밀번호 찾기
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
