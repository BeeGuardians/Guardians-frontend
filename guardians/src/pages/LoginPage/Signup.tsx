import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import styles from './Signup.module.css';
import emailIcon from '../../assets/mail.png';
import nicknameIcon from '../../assets/smile.png';
import lockIcon from '../../assets/lock.png';
import ErrorModal from '../ErrorModal/ErrorModal';

interface TermsModalProps {
    title: string;
    content: string;
    onClose: () => void;
}

const TermsModal = ({ title, content, onClose }: TermsModalProps) => (
    <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>{title}</h2>
            <pre className={styles.modalTextContent}>{content}</pre>
            <button className={styles.modalCloseButton} onClick={onClose}>닫기</button>
        </div>
    </div>
);

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
    const allRequiredAgreementsMet = terms.terms && terms.privacy && terms.age;

    const [errorMsg, setErrorMsg] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    useEffect(() => {
        if (terms.terms && terms.privacy) {
            if (!terms.age) {
                setTerms(prevTerms => ({ ...prevTerms, age: true }));
            }
        }
    }, [terms.terms, terms.privacy, terms.age]);

    const showError = (msg: string) => {
        setErrorMsg(msg);
        setShowModal(true);
    };

    const handleIndividualCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target as { name: keyof typeof terms, checked: boolean };
        setTerms((prev) => ({ ...prev, [name]: checked }));
    };

    const handleAllCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setTerms({ terms: isChecked, privacy: isChecked, age: isChecked });
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
        } catch (err) {
            console.error("Send verification code error:", err);
            showError("이메일 인증 요청 중 오류가 발생했습니다.");
        }
    };

    const verifyEmailCode = async () => {
        try {
            const res = await axios.post(`${API_BASE}/api/users/verify-code?email=${email}&code=${verificationCode}`);
            if (res.data.result.data === true) {
                setEmailVerified(true);
                showError("✅ 이메일 인증이 완료되었습니다.");
            } else {
                showError("인증 코드가 올바르지 않습니다.");
            }
        } catch (err) {
            console.error("Verify email code error:", err);
            showError("이메일 인증 중 오류가 발생했습니다.");
        }
    };

    const handleSubmit = async () => {
        if (!emailVerified) {
            showError("이메일 인증을 완료해 주세요.");
            return;
        }
        if (!nickname.trim()) {
            showError("닉네임을 입력해 주세요.");
            return;
        }
        if (!password.trim()) {
            showError("비밀번호를 입력해 주세요.");
            return;
        }
        if (!isPasswordMatch) {
            showError("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (!allRequiredAgreementsMet) {
            showError("모든 약관에 동의해야 합니다.");
            return;
        }
        try {
            await axios.post(`${API_BASE}/api/users`, {
                email,
                username: nickname,
                password,
            });
            navigate("/signup/success");
        } catch (err) {
            console.error("Signup error:", err);
            showError("회원가입 실패: 서버 오류 또는 이미 가입된 정보일 수 있습니다.");
        }
    };

    const termsContentPlaceholder = `제1조 (목적)
이 약관은 가디언즈(이하 "회사")가 제공하는 모의 해킹 성장 플랫폼 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"라 함은 구현되는 단말기(PC, 모바일, 태블릿 등의 각종 유무선 장치를 포함)와 상관없이 "회원"이 이용할 수 있는 가디언즈 관련 제반 서비스를 의미합니다.
2. "회원"이라 함은 회사의 "서비스"에 접속하여 이 약관에 따라 "회사"와 이용계약을 체결하고 "회사"가 제공하는 "서비스"를 이용하는 고객을 말합니다.
3. "아이디(ID 또는 계정)"라 함은 "회원"의 식별과 "서비스" 이용을 위하여 "회원"이 정하고 "회사"가 승인하는 문자 또는 숫자의 조합을 의미합니다.
4. "비밀번호"라 함은 "회원"이 부여 받은 "아이디"와 일치되는 "회원"임을 확인하고 비밀보호를 위해 "회원" 자신이 정한 문자 또는 숫자의 조합을 의미합니다.

제3조 (약관의 게시와 개정)
1. "회사"는 이 약관의 내용을 "회원"이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.
2. "회사"는 "약관의 규제에 관한 법률", "정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 "정보통신망법")" 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.

최종 수정일: 2025년 5월 20일`;

    const privacyContentPlaceholder = `[개인정보 수집 및 이용 동의]

(주)가디언즈(이하 ‘회사’)는 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리지침을 수립·공개합니다.

1. 개인정보의 처리 목적
회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
 가. 홈페이지 회원 가입 및 관리
   회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 제한적 본인확인제 시행에 따른 본인확인, 서비스 부정이용 방지, 만 14세 미만 아동의 개인정보 처리 시 법정대리인의 동의여부 확인, 각종 고지·통지, 고충처리 등을 목적으로 개인정보를 처리합니다.
 나. 서비스 제공
   콘텐츠 제공, 맞춤 서비스 제공 등을 목적으로 개인정보를 처리합니다.

2. 수집하는 개인정보의 항목 및 수집방법
 가. 수집항목
   - 필수항목 : 이메일, 비밀번호, 닉네임
   - 선택항목 : (선택 수집 시 명시)
 나. 수집방법 : 홈페이지 회원가입

3. 개인정보의 처리 및 보유 기간
회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
   - 홈페이지 회원 가입 및 관리 : 사업자/단체 홈페이지 탈퇴 시까지
   다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지
     1) 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료 시까지
     2) 홈페이지 이용에 따른 채권·채무관계 잔존 시에는 해당 채권·채무관계 정산 시까지

최종 수정일: 2025년 5월 20일`;

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
                            {!emailVerified && (
                                <button
                                    className={styles.verifyBtn}
                                    onClick={sendVerificationCode}
                                    disabled={!email.trim() || emailCodeSent}
                                >
                                    {emailCodeSent ? "재전송" : "인증"}
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
                            <input
                                type="checkbox"
                                checked={allRequiredAgreementsMet}
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
                                    onChange={handleIndividualCheck} />
                                <span className={styles.customCheckbox}></span>
                                <span className={styles.clickableText} onClick={() => setShowTermsModal(true)}>
                                    이용약관 동의
                                </span>
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="privacy"
                                    checked={terms.privacy}
                                    onChange={handleIndividualCheck} />
                                <span className={styles.customCheckbox}></span>
                                <span className={styles.clickableText} onClick={() => setShowPrivacyModal(true)}>
                                    개인정보 수집 및 이용 동의
                                </span>
                            </label>
                        </div>
                    </div>

                    <button
                        className={styles.signupBtn}
                        onClick={handleSubmit}
                        disabled={!emailVerified || !nickname.trim() || !password.trim() || !isPasswordMatch || !allRequiredAgreementsMet}
                    >
                        회원가입
                    </button>
                </div>
            </div>

            {showModal && <ErrorModal message={errorMsg} onClose={() => setShowModal(false)} />}
            {showTermsModal && <TermsModal title="이용약관" content={termsContentPlaceholder} onClose={() => setShowTermsModal(false)} />}
            {showPrivacyModal && <TermsModal title="개인정보 수집 및 이용 동의" content={privacyContentPlaceholder} onClose={() => setShowPrivacyModal(false)} />}
        </div>
    );
};

export default Signup;