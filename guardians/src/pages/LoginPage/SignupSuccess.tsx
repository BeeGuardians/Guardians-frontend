import { useNavigate } from 'react-router-dom';
import styles from './SignupSuccess.module.css';

const SignupSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.fullPage}>
            <div className={styles.card}>
                <div className={styles.emoji}>🎉</div>
                <p className={styles.title}>가입을 환영합니다!</p>
                <p className={styles.subtitle}>가디언즈와 함께 보안 실력을 키워보세요</p>
                <button className={styles.loginButton} onClick={() => navigate('/login')}>
                    로그인하러 가기
                </button>
            </div>
        </div>
    );
};

export default SignupSuccess;
