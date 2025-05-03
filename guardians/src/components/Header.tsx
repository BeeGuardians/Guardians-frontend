import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";

function Header() {
    const { user, logout } = useAuth();
    const isLoggedIn = !!user;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    const handleLogout = async () => {
        try {
            setIsLoading(true); // ✅ 로딩 시작
            await logout();      // 세션 날리고
            window.location.href = "/"; // 새로고침
        } catch (err) {
            console.error("❌ 로그아웃 실패", err);
        }
    };

    return (
        <>
            {isLoading && (
                <div className={styles.spinnerOverlay}>
                    <div className={styles.spinner}></div>
                </div>
            )}

            <header className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.left}>
                        <Link to="/" className={styles.logo}>
                            <img src="/logo_no_BG.png" alt="로고" className={styles.logoImg} />
                            <span className={styles.logoText}>Guardians</span>
                        </Link>

                        <nav className={styles.nav}>
                            <Link to="/wargame" className={styles.link}>워게임</Link>
                            <Link to="/ranking" className={styles.link}>랭킹</Link>
                            <Link to="/community" className={styles.link}>커뮤니티</Link>
                            {isLoggedIn && (
                                <Link to="/dashboard" className={styles.link}>대시보드</Link>
                            )}
                        </nav>
                    </div>

                    <div className={styles.right}>
                        {isLoggedIn ? (
                            <div className={styles.profileBox} ref={dropdownRef}>
                                <div className={styles.profileTrigger} onClick={toggleDropdown}>
                                    <div className={styles.profileCircle} />
                                    <span>{user.username} 님</span>
                                </div>

                                {dropdownOpen && (
                                    <div className={styles.dropdown}>
                                        <p className={styles.dropdownTitle}>내 정보</p>
                                        <div className={styles.dropdownProfileCircle} />
                                        <p className={styles.dropdownEmail}>
                                            <strong>{user.email}</strong>
                                        </p>
                                        <Link to="/mypage" className={styles.dropdownLink}>마이페이지</Link>
                                        <button className={styles.dropdownLink} onClick={handleLogout}>
                                            로그아웃
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login">
                                <button className={styles.loginButton}>로그인</button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
