import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

import styles from './Signup.module.css';
import emailIcon from '../../assets/mail.png';
import nicknameIcon from '../../assets/smile.png';
import lockIcon from '../../assets/lock.png';
import ErrorModal from '../ErrorModal/ErrorModal';

const Signup = () => {
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const [email, setEmail] = useState("");
    const [emailVerified, setEmailVerified] = useState(false);
    const [emailCodeSent, setEmailCodeSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");

    const isPasswordMatch = password.trim() !== "" && passwordCheck.trim() !== "" && password === passwordCheck;

    const [terms, setTerms] = useState({ terms: false, privacy: false, age: false });
    const allChecked = terms.terms && terms.privacy && terms.age;

    const [errorMsg, setErrorMsg] = useState("");
    const [showModal, setShowModal] = useState(false);

    const showError = (msg: string) => {
        setErrorMsg(msg);
        setShowModal(true);
    };

    const handleIndividualCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setTerms((prev) => ({ ...prev, [name]: checked }));
    };

    const handleAllCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setTerms({ terms: checked, privacy: checked, age: checked });
    };

    const sendVerificationCode = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError("올바른 이메일 형식을 입력해 주세요.");
            return;
        }

        try {
            const checkRes = await axios.get(`${API_BASE}/api/users/check-email?email=${email}`);
            if (checkRes.data.result.data) {
                showError("이미 가입된 이메일입니다.");
                return;
            }
            await axios.get(`${API_BASE}/api/users/send-code?email=${email}`);
            setEmailCodeSent(true);
            showError("인증 코드가 전송되었습니다. 이메일을 확인해 주세요.");
        } catch {
            showError("이메일 인증 요청 실패: 유효하지 않은 이메일입니다");
        }
    };

    const verifyEmailCode = async () => {
        try {
            const res = await axios.post(`${API_BASE}/api/users/verify-code?email=${email}&code=${verificationCode}`);
            if (res.data.result.data === true) {
                setEmailVerified(true);
                showError("✅ 이메일 인증이 완료되었습니다.");
            } else {
                showError("인증 코드가 올바르지 않습니다");
            }
        } catch {
            showError("이메일 인증 실패");
        }
    };

    const handleSubmit = async () => {
        if (!emailVerified || !nickname || !password || !passwordCheck || !allChecked) {
            showError("모든 정보를 입력하고 약관에 동의해야 합니다.");
            return;
        }
        if (password !== passwordCheck) {
            showError("비밀번호가 일치하지 않습니다.");
            return;
        }
        try {
            await axios.post(`${API_BASE}/api/users`, {
                email,
                username: nickname,
                password,
            });
            navigate("/signup/success");
        } catch {
            showError("회원가입 실패: 이미 가입된 이메일일 수 있습니다.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.textBox}>
                    <p>환영합니다,</p>
                    <span style={{ fontWeight: "750", color: "#fff" }}>모의 해킹</span> 성장을 위한 발걸음 {" "}
                    <strong style={{ fontSize: "2.1rem", color: "white" }}>가디언즈</strong> 입니다.
                </div>
                <img src="/login_logo.png" alt="login visual" className={styles.visual} />
            </div>
            <div className={styles.right}>
                <div className={styles.signupBox}>
                    <h2 className={styles.title}>이메일 회원가입</h2>

                    <div className={styles.inputGroup}>
                        <label>이메일</label>
                        <div className={styles.inputField}>
                            <img src={emailIcon} alt="email" />
                            <input
                                type="email"
                                placeholder="이메일을 입력해 주세요"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={emailVerified}
                                style={{
                                    backgroundColor: emailVerified ? "#f0f0f0" : "white",
                                    color: emailVerified ? "#888" : "#000",
                                    cursor: emailVerified ? "not-allowed" : "text"
                                }}
                            />
                            {!emailVerified && !emailCodeSent && (
                                <button className={styles.verifyBtn} onClick={sendVerificationCode} disabled={!email.trim()}>
                                    인증
                                </button>
                            )}
                        </div>
                    </div>

                    {emailCodeSent && !emailVerified && (
                        <div className={styles.inputGroup}>
                            <label>인증 코드</label>
                            <div className={styles.inputField}>
                                <input
                                    type="text"
                                    placeholder="인증 코드를 입력해 주세요"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                />
                                <button className={styles.verifyBtn} onClick={verifyEmailCode} disabled={!verificationCode.trim()}>
                                    확인
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label>닉네임</label>
                        <div className={styles.inputField}>
                            <img src={nicknameIcon} alt="nickname" />
                            <input
                                type="text"
                                placeholder="닉네임을 입력해 주세요"
                                maxLength={20}
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup} style={{ marginBottom: '0.5rem' }}>
                        <label>비밀번호</label>
                        <div className={styles.inputField}>
                            <img src={lockIcon} alt="password" />
                            <input
                                type="password"
                                placeholder="비밀번호를 입력해 주세요"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className={styles.inputField}>
                            <img src={lockIcon} alt="password" />
                            <input
                                type="password"
                                placeholder="비밀번호를 다시 입력해 주세요"
                                value={passwordCheck}
                                onChange={(e) => setPasswordCheck(e.target.value)}
                            />
                        </div>
                        <div className={styles.feedbackBox}>
                            {passwordCheck ? (
                                <p className={isPasswordMatch ? styles.match : styles.mismatch}>
                                    {isPasswordMatch ? "✅ 비밀번호가 일치합니다" : "❌ 비밀번호가 일치하지 않습니다"}
                                </p>
                            ) : (
                                <p className={styles.placeholder}></p>
                            )}
                        </div>
                    </div>

                    <div className={styles.checkboxes}>
                        <label className={styles.checkboxLabel}>
                            <input type="checkbox" checked={allChecked} onChange={handleAllCheck} />
                            <span className={styles.customCheckbox}></span>
                            전체 동의
                        </label>
                        <div className={styles.subChecks}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" name="terms" checked={terms.terms} onChange={handleIndividualCheck} />
                                <span className={styles.customCheckbox}></span>
                                이용약관 동의
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" name="privacy" checked={terms.privacy} onChange={handleIndividualCheck} />
                                <span className={styles.customCheckbox}></span>
                                개인정보 수집 및 이용 동의
                            </label>
                        </div>
                    </div>

                    <button
                        className={styles.signupBtn}
                        onClick={handleSubmit}
                        disabled={!emailVerified || !nickname.trim() || !password.trim() || !passwordCheck.trim() || !allChecked}
                    >
                        회원가입
                    </button>
                </div>
            </div>

            {showModal && <ErrorModal message={errorMsg} onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default Signup;