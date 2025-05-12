import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import styles from "./Header.module.css";

function Header() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const isLoggedIn = !!user;

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
                    console.log("✅ 유저 데이터:", data); // 👉 여기서 실제 값 확인
                    setProfileUrl(data.profileImageUrl); // 🔥 요기!
                })
                .catch((err) => {
                    console.error("⚠️ 유저 정보 가져오기 실패", err);
                });
        }
    }, [isLoggedIn]);

    useEffect(() => {
        setDropdownOpen(false);
    }, [location.pathname]);

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

    const isActive = (path: string) => location.pathname.startsWith(path);

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
                            <Link to="/wargame" className={`${styles.link} ${isActive("/wargame") ? styles.active : ""}`}>워게임</Link>
                            <Link to="/ranking" className={`${styles.link} ${isActive("/ranking") ? styles.active : ""}`}>랭킹</Link>
                            <Link to="/community" className={`${styles.link} ${isActive("/community") ? styles.active : ""}`}>커뮤니티</Link>
                            {isLoggedIn && (
                                <Link to="/dashboard" className={`${styles.link} ${isActive("/dashboard") ? styles.active : ""}`}>대시보드</Link>
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
