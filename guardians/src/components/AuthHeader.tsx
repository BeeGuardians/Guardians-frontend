// components/AuthHeader.tsx
import {Link} from "react-router-dom";
import styles from "./AuthHeader.module.css";

const AuthHeader = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <Link to="/" className={styles.logo}>
                        <img src="/logo_no_BG.png" alt="로고" className={styles.logoImg} />
                        <span className={styles.logoText}>Guardians</span>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default AuthHeader;
