import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './Signup.module.css';
import emailIcon from '../../assets/mail.png';
import nicknameIcon from '../../assets/smile.png';
import lockIcon from '../../assets/lock.png';

const Signup = () => {
    const navigate = useNavigate();

    const [allChecked, setAllChecked] = useState(false);
    const [terms, setTerms] = useState({
        terms: false,
        privacy: false,
        age: false,
    });

    const handleAllCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setAllChecked(checked);
        setTerms({
            terms: checked,
            privacy: checked,
            age: checked,
        });
    };

    const handleIndividualCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        const updated = { ...terms, [name]: checked };
        setTerms(updated);
        setAllChecked(updated.terms && updated.privacy && updated.age);
    };

    const handleSubmit = () => {
        // TODO: 백엔드 회원가입 연동 전 임시 이동
        navigate("/signup/success");
    };

    return (
        <div className={styles.fullPage}>
            <div className={styles.wrapper}>
                <div className={styles.signupBox}>
                    <h2 className={styles.title}>이메일 회원가입</h2>

                    {/* ✅ 이메일 */}
                    <div className={styles.inputGroup}>
                        <label>이메일</label>
                        <div className={styles.inputField}>
                            <img src={emailIcon} alt="email" />
                            <input
                                type="email"
                                placeholder="이메일을 입력해 주세요"
                                maxLength={50}
                            />
                        </div>
                    </div>

                    {/* ✅ 닉네임 */}
                    <div className={styles.inputGroup}>
                        <label>닉네임</label>
                        <div className={styles.inputField}>
                            <img src={nicknameIcon} alt="nickname" />
                            <input
                                type="text"
                                placeholder="닉네임을 입력해 주세요"
                                maxLength={20}
                            />
                        </div>
                    </div>

                    {/* ✅ 비밀번호 */}
                    <div className={styles.inputGroup}>
                        <label>비밀번호</label>
                        <div className={styles.inputField}>
                            <img src={lockIcon} alt="password" />
                            <input type="password" placeholder="대문자, 소문자 포함 8자 이상" />
                        </div>
                        <div className={styles.inputField}>
                            <img src={lockIcon} alt="password" />
                            <input type="password" placeholder="비밀번호를 확인해주세요" />
                        </div>
                    </div>

                    {/* ✅ 약관 동의 */}
                    <div className={styles.checkboxes}>
                        <label>
                            <input type="checkbox" checked={allChecked} onChange={handleAllCheck} />
                            전체 동의
                        </label>
                        <div className={styles.subChecks}>
                            <label>
                                <input type="checkbox" name="terms" checked={terms.terms} onChange={handleIndividualCheck} />
                                이용약관 동의
                            </label>
                            <label>
                                <input type="checkbox" name="privacy" checked={terms.privacy} onChange={handleIndividualCheck} />
                                가디언즈 개인정보 수집 및 이용 동의
                            </label>
                            <label>
                                <input type="checkbox" name="age" checked={terms.age} onChange={handleIndividualCheck} />
                                [선택] 만 14세 이상입니다.
                            </label>
                        </div>
                    </div>

                    {/* ✅ 가입 버튼 */}
                    <button className={styles.signupBtn} onClick={handleSubmit}>
                        회원가입
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;