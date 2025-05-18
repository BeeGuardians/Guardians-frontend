import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import styles from "./Header.module.css";
import { useLocation } from "react-router-dom";


function Header() {
    const { user, logout } = useAuth();
    const isLoggedIn = !!user;
    const location = useLocation();
    const isActive = (path: string) => location.pathname.startsWith(path);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [profileUrl, setProfileUrl] = useState<string | null>(null);

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownOpen]);

    useEffect(() => {
        if (isLoggedIn) {
            axios
                .get(`${import.meta.env.VITE_API_BASE_URL}/api/users/me`, { withCredentials: true })
                .then((res) => {
                    const data = res.data.result.data;
                    setProfileUrl(data.profileImageUrl);
                })
                .catch((err) => {
                    console.error("⚠️ 유저 정보 가져오기 실패", err);
                });
        }
    }, [isLoggedIn]);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            await logout();
            window.location.href = "/";
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
                        <a href="/" className={styles.logo}>
                            <img src="/logo_no_BG.png" alt="로고" className={styles.logoImg} />
                            <span className={styles.logoText}>Guardians</span>
                        </a>

                        <nav className={styles.nav}>
                            <a href="/wargame" className={`${styles.link} ${isActive("/wargame") ? styles.active : ""}`}>워게임</a>
                            <a href="/ranking" className={`${styles.link} ${isActive("/ranking") ? styles.active : ""}`}>랭킹</a>
                            <a href="/community" className={`${styles.link} ${isActive("/community") ? styles.active : ""}`}>커뮤니티</a>
                            <a href="/job" className={`${styles.link} ${isActive("/job") ? styles.active : ""}`}>커리어</a>
                            {isLoggedIn && (
                                <a href="/dashboard" className={`${styles.link} ${isActive("/dashboard") ? styles.active : ""}`}>대시보드</a>
                            )}
                        </nav>
                    </div>

                    <div className={styles.right}>
                        {isLoggedIn ? (
                            <div className={styles.profileBox} ref={dropdownRef}>
                                <div className={styles.profileTrigger} onClick={toggleDropdown}>
                                    <img
                                        src={profileUrl || "/default-profile.png"}
                                        alt="프로필 이미지"
                                        className={styles.profileCircle}
                                    />
                                    <span>{user.username} 님</span>
                                </div>

                                {dropdownOpen && (
                                    <div className={styles.dropdown}>
                                        <p className={styles.dropdownTitle}>내 정보</p>
                                        <img
                                            src={profileUrl || "/default-profile.png"}
                                            alt="프로필 이미지"
                                            className={styles.dropdownProfileCircle}
                                        />
                                        <p className={styles.dropdownEmail}>
                                            <strong>{user.email}</strong>
                                        </p>
                                        <a href="/mypage" className={styles.dropdownLink}>마이페이지</a>
                                        <button className={styles.dropdownLink} onClick={handleLogout}>
                                            로그아웃
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <a href="/login">
                                <button className={styles.loginButton}>로그인</button>
                            </a>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
