import { useNavigate } from 'react-router-dom';
import styles from './SignupSuccess.module.css';

const SignupSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.fullPage}>
            <div className={styles.textContainer}>
                <p className={styles.message}>사용자님, 가디언즈에 합류하신 것을 환영합니다.</p>
                <p className={styles.message}>지금부터 보안 실력을 차근차근 쌓아가 보세요.</p>
            </div>
            <button className={styles.loginButton} onClick={() => navigate('/login')}>
                로그인하기
            </button>
        </div>
    );
};

export default SignupSuccess;
