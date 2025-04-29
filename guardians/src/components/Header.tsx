import { Link } from "react-router-dom";
import styles from "./Header.module.css";

function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <Link to="/" className={styles.logo}>Guardians</Link>

                    <nav className={styles.nav}>
                        <Link to="/wargame" className={styles.link}>워게임</Link>
                        <Link to="/ranking" className={styles.link}>랭킹</Link>
                        <Link to="/community" className={styles.link}>커뮤니티</Link>
                        <Link to="/dashboard" className={styles.link}>대시보드</Link>
                    </nav>
                </div>

                <div className={styles.right}>
                    <Link to="/login">
                        <button className={styles.loginButton}>로그인</button>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
