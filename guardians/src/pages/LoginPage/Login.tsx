/* Login.tsx */

import styles from './Login.module.css';
import emailIcon from '../../assets/mail.png';
import lockIcon from '../../assets/lock.png';
import { useNavigate } from "react-router-dom"; // ▶️ 훅 사용

const Login = () => {
    const navigate = useNavigate(); // ▶️ 이동 함수

    return (
        <div className={styles.fullPage}>
            <div className={styles.wrapper}>
                <div className={styles.loginBox}>
                    <h2 className={styles.title}>가디언즈 로그인</h2>

                    {/* ✅ 입력창 그룹 */}
                    <div className={styles.inputSection}>
                        <div className={styles.inputGroup}>
                            <img src={emailIcon} alt="email" />
                            <input type="email" placeholder="이메일을 입력해 주세요" />
                        </div>

                        <div className={styles.inputGroup}>
                            <img src={lockIcon} alt="lock" />
                            <input type="password" placeholder="비밀번호를 입력해 주세요" />
                        </div>
                    </div>

                    {/* ✅ 버튼 그룹 */}
                    <div className={styles.buttonSection}>
                        <button className={styles.loginButton}>로그인하기</button>
                        <button
                            className={styles.signupButton}
                            onClick={() => navigate("/signup")} // ✅ 회원가입 이동
                        >
                            이메일 회원가입
                        </button>
                        <div
                            className={styles.findPassword}
                            onClick={() => navigate("/find-password")} // ✅ 비밀번호 찾기 이동
                        >
                            비밀번호 찾기
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
