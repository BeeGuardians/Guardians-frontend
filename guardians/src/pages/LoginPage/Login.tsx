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
    const {login} = useAuth(); // 👈 전역 상태 로그인 처리

    const handleLogin = async () => {
        try {
            const res = await axios.post(
                "http://localhost:8080/api/users/login",
                {email, password},
                {withCredentials: true}
            );

            const userData = res.data.result.data;
            console.log("🔥 로그인 성공", userData);
            login(userData); // 👈 userContext 업데이트
            window.location.href = "/"
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                alert("로그인 실패: " + (err.response?.data?.message || "에러 발생"));
            } else {
                alert("알 수 없는 오류가 발생했습니다");
            }
        }
    };

    return (
        <div className={styles.fullPage}>
            <div className={styles.wrapper}>
                <div className={styles.loginBox}>
                    <h2 className={styles.title}>가디언즈 로그인</h2>

                    {/* ✅ 입력창 그룹 */}
                    <div className={styles.inputSection}>
                        <div className={styles.inputGroup}>
                            <img src={emailIcon} alt="email"/>
                            <input
                                type="email"
                                placeholder="이메일을 입력해 주세요"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <img src={lockIcon} alt="lock"/>
                            <input
                                type="password"
                                placeholder="비밀번호를 입력해 주세요"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* ✅ 버튼 그룹 */}
                    <div className={styles.buttonSection}>
                        <button className={styles.loginButton} onClick={handleLogin}>
                            로그인하기
                        </button>
                        <button
                            className={styles.signupButton}
                            onClick={() => navigate("/signup")}
                        >
                            이메일 회원가입
                        </button>
                        <div className={styles.findPassword}>비밀번호 찾기</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
