// FindPassword.tsx

import styles from './FindPassword.module.css';
import emailIcon from '../../assets/mail.png';

const FindPassword = () => {
    return (
        <div className={styles.fullPage}>
            <div className={styles.wrapper}>
                <div className={styles.resetBox}>
                    <h2 className={styles.title}>비밀번호 찾기</h2>

                    {/* 안내 문구 */}
                    <p className={styles.subtitle}>계정에 등록된 이메일 주소를 입력해 주세요.</p>
                    <p className={styles.subtitle}>입력된 메일로 재설정 안내를 보내드립니다.</p>

                    {/* 이메일 입력 필드 */}
                    <div className={styles.inputGroup}>
                        <img src={emailIcon} alt="email" />
                        <input type="email" placeholder="이메일을 입력해 주세요" />
                    </div>

                    {/* 전송 버튼 */}
                    <button className={styles.sendButton}>
                        비밀번호 재설정 메일 보내기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FindPassword;