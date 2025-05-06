import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import styles from './FindPassword.module.css';
import emailIcon from '../../assets/mail.png';
import ErrorModal from '../ErrorModal/ErrorModal'; // ✅ 추가

const FindPassword = () => {
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState<number | null>(null);
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState<'email' | 'verify'>('email');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    const isPasswordMatch = newPassword !== '' && newPassword === confirmPassword;

    const showError = (msg: string) => {
        setModalMessage(msg);
        setShowModal(true);
    };

    const handleSendCode = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/users/find-id?email=${email}`);
            const fetchedUserId = res.data.result.data;
            setUserId(fetchedUserId);

            await axios.get(`${API_BASE}/api/users/${fetchedUserId}/reset-password/send-code`);
            setStep('verify');
            showError('인증 코드를 이메일로 보냈어요!');
        } catch (err) {
            showError('이메일을 확인할 수 없습니다.');
            console.error(err);
        }
    };

    const handleResetPassword = async () => {
        try {
            if (!userId) {
                showError('유저 정보를 확인할 수 없습니다.');
                return;
            }

            await axios.post(`${API_BASE}/api/users/${userId}/reset-password/verify-code`, null, {
                params: {
                    code,
                    newPassword,
                },
            });

            showError('비밀번호가 성공적으로 재설정되었습니다.');
            setTimeout(() => {
                setShowModal(false);
                navigate('/login');
            }, 1500);
        } catch (err) {
            showError('코드가 틀리거나 비밀번호 재설정 실패!');
            console.error(err);
        }
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
                <div className={styles.resetBox}>
                    <h2 className={styles.title}>비밀번호 찾기</h2>

                    {step === 'email' ? (
                        <>
                            <p className={styles.subtitle}>계정에 등록된 이메일 주소를 입력해 주세요.</p>
                            <p className={styles.subtitle}>입력된 메일로 재설정 안내를 보내드립니다.</p>

                            <div className={styles.inputGroup}>
                                <img src={emailIcon} alt="email" />
                                <input
                                    type="email"
                                    placeholder="이메일을 입력해 주세요"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button className={styles.sendButton} onClick={handleSendCode}>
                                비밀번호 재설정 메일 보내기
                            </button>
                        </>
                    ) : (
                        <>
                            <p className={styles.subtitle}>
                                이메일로 받은 인증 코드를 입력하고<br />
                                새 비밀번호를 설정하세요.
                            </p>
                            <div className={styles.inputGroup}>
                                <input
                                    type="text"
                                    placeholder="인증 코드"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <input
                                    type="password"
                                    placeholder="새 비밀번호"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>

                            <div className={`${styles.inputGroup} ${styles.confirmInputGroup}`}>
                                <input
                                    type="password"
                                    placeholder="비밀번호 확인"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <div
                                className={`${styles.feedback} ${
                                    confirmPassword === ''
                                        ? ''
                                        : isPasswordMatch
                                            ? styles.match
                                            : styles.mismatch
                                }`}
                            >
                                {confirmPassword === ''
                                    ? ''
                                    : isPasswordMatch
                                        ? '✅ 비밀번호가 일치합니다'
                                        : '❌ 비밀번호가 일치하지 않습니다'}
                            </div>

                            <button
                                className={styles.sendButton}
                                onClick={handleResetPassword}
                                disabled={!isPasswordMatch}
                            >
                                비밀번호 재설정
                            </button>
                        </>
                    )}
                </div>
            </div>

            {showModal && <ErrorModal message={modalMessage} onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default FindPassword;
