import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import styles from './Signup.module.css';
import emailIcon from '../../assets/mail.png';
import nicknameIcon from '../../assets/smile.png';
import lockIcon from '../../assets/lock.png';

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

    const isPasswordMatch =
        password.trim() !== "" &&
        passwordCheck.trim() !== "" &&
        password === passwordCheck;

    const [terms, setTerms] = useState({
        terms: false,
        privacy: false,
        age: false,
    });

    const allChecked = terms.terms && terms.privacy && terms.age;

    const handleIndividualCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setTerms((prev) => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleAllCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setTerms({
            terms: checked,
            privacy: checked,
            age: checked,
        });
    };

    const sendVerificationCode = async () => {
        try {
            const checkRes = await axios.get(`${API_BASE}/api/users/check-email?email=${email}`);
            const isExists = checkRes.data.result.data;

            if (isExists) {
                alert("이미 가입된 이메일입니다.");
                return;
            }

            await axios.get(`${API_BASE}/api/users/send-code?email=${email}`);
            alert("인증 코드가 전송되었습니다.");
            setEmailCodeSent(true);

        } catch {
            alert("이메일 인증 요청 실패: 유효하지 않은 이메일입니다");
        }
    };


    const verifyEmailCode = async () => {
        try {
            const res = await axios.post(`${API_BASE}/api/users/verify-code?email=${email}&code=${verificationCode}`);
            if (res.data.result.data === true) {
                alert("이메일 인증 완료");
                setEmailVerified(true);
            } else {
                alert("인증 코드가 올바르지 않습니다");
            }
        } catch {
            alert("이메일 인증 실패");
        }
    };

    const handleSubmit = async () => {
        if (!emailVerified || !nickname || !password || !passwordCheck || !allChecked) {
            alert("모든 정보를 입력하고 약관에 동의해야 합니다.");
            return;
        }

        if (password !== passwordCheck) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            await axios.post(`${API_BASE}/api/users`, {
                email,
                username: nickname,
                password,
            });
            alert("회원가입이 완료되었습니다.");
            navigate("/signup/success");
        } catch {
            alert("회원가입 실패: 이미 가입된 이메일일 수 있습니다.");
        }
    };

    return (
        <div className={styles.fullPage}>
            <div className={styles.wrapper}>
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
                            />
                            {!emailVerified && (
                                <button
                                    type="button"
                                    onClick={sendVerificationCode}
                                    className={styles.verifyBtn}
                                    disabled={!email.trim()}
                                >
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
                                    placeholder="인증 코드를 입력하세요"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={verifyEmailCode}
                                    className={styles.verifyBtn}
                                    disabled={!verificationCode.trim()}
                                >
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

                    <div className={styles.inputGroup}>
                        <label>비밀번호</label>
                        <div className={styles.inputField}>
                            <img src={lockIcon} alt="password" />
                            <input
                                type="password"
                                placeholder="대문자, 소문자 포함 8자 이상"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className={styles.inputField}>
                            <img src={lockIcon} alt="password" />
                            <input
                                type="password"
                                placeholder="비밀번호를 확인해주세요"
                                value={passwordCheck}
                                onChange={(e) => setPasswordCheck(e.target.value)}
                            />
                        </div>

                        <div className={styles.feedbackBox}>
                            {passwordCheck ? (
                                <p className={isPasswordMatch ? styles.match : styles.mismatch}>
                                    {isPasswordMatch
                                        ? "✅ 비밀번호가 일치합니다"
                                        : "❌ 비밀번호가 일치하지 않습니다"}
                                </p>
                            ) : (
                                <p className={styles.placeholder}></p> // 빈 줄로 공간 확보
                            )}
                        </div>

                    </div>

                    <div className={styles.checkboxes}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={allChecked}
                                onChange={handleAllCheck}
                            />
                            <span className={styles.customCheckbox}></span>
                            전체 동의
                        </label>

                        <div className={styles.subChecks}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="terms"
                                    checked={terms.terms}
                                    onChange={handleIndividualCheck}
                                />
                                <span className={styles.customCheckbox}></span>
                                이용약관 동의
                            </label>

                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="privacy"
                                    checked={terms.privacy}
                                    onChange={handleIndividualCheck}
                                />
                                <span className={styles.customCheckbox}></span>
                                개인정보 수집 및 이용 동의
                            </label>

                            {/*<label className={styles.checkboxLabel}>*/}
                            {/*    <input*/}
                            {/*        type="checkbox"*/}
                            {/*        name="age"*/}
                            {/*        checked={terms.age}*/}
                            {/*        onChange={handleIndividualCheck}*/}
                            {/*    />*/}
                            {/*    <span className={styles.customCheckbox}></span>*/}
                            {/*    [선택] 만 14세 이상입니다.*/}
                            {/*</label>*/}
                        </div>
                    </div>

                    <button
                        className={styles.signupBtn}
                        onClick={handleSubmit}
                        disabled={
                            !emailVerified ||
                            !nickname.trim() ||
                            !password.trim() ||
                            !passwordCheck.trim() ||
                            !allChecked
                        }
                    >
                        회원가입
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
