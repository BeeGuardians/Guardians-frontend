import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
// --- 추가: 애니메이션 및 아이콘을 위한 import ---
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

function Header() {
    const { user, logout } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const isLoggedIn = !!user;
    const location = useLocation();
    const isActive = (path: string) => location.pathname.startsWith(path);
    const navigate = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const profileUrl = user?.profileImageUrl ?? null;

    // --- 추가: 모바일 메뉴의 열림/닫힘을 관리하는 상태 ---
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    // 모바일 메뉴가 열렸을 때 배경 스크롤 방지
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const toggleDropdown = () => setDropdownOpen((prev) => !prev);
    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            await logout();
            navigate("/");
        } catch (err) {
            console.error("❌ 로그아웃 실패", err);
        } finally {
            setIsLoading(false);
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
                            <Link to="/wargame" className={`${styles.link} ${isActive("/wargame") ? styles.active : ""}`}>워게임</Link>
                            <Link to="/ranking" className={`${styles.link} ${isActive("/ranking") ? styles.active : ""}`}>랭킹</Link>
                            <Link to="/community" className={`${styles.link} ${isActive("/community") ? styles.active : ""}`}>커뮤니티</Link>
                            <Link to="/job" className={`${styles.link} ${isActive("/job") ? styles.active : ""}`}>커리어</Link>
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
                                        src={profileUrl || "/basic_profile.png"}
                                        alt="프로필 이미지"
                                        className={styles.profileCircle}
                                    />
                                    <span className={styles.profileUsername}>{user.username} 님</span>
                                </div>

                                {dropdownOpen && (
                                    <div className={styles.dropdown}>
                                        <p className={styles.dropdownTitle}>내 정보</p>
                                        <img src={profileUrl || "/basic_profile.png"} alt="프로필 이미지" className={styles.dropdownProfileCircle} />
                                        <p className={styles.dropdownEmail}><strong>{user.email}</strong></p>
                                        <Link to="/mypage" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>마이페이지</Link>
                                        {isAdmin && (
                                            <a href="/admin/dashboard" target="_blank" rel="noopener noreferrer" className={styles.dropdownLink} onClick={() => setDropdownOpen(false)}>관리자 페이지 이동</a>
                                        )}
                                        <button className={styles.dropdownLink} onClick={handleLogout}>로그아웃</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login">
                                <button className={styles.loginButton}>로그인</button>
                            </Link>
                        )}
                        {/* --- 추가: 모바일에서만 보일 햄버거 버튼 --- */}
                        <button className={styles.hamburgerButton} onClick={toggleMobileMenu}>
                            <FaBars size={22} />
                        </button>
                    </div>
                </div>
            </header>

            {/* --- 추가: 모바일 메뉴 UI --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className={styles.mobileMenuOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleMobileMenu} // 배경 클릭 시 닫기
                    >
                        <motion.div
                            className={styles.mobileMenuContent}
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()} // 메뉴 클릭 시 배경으로 이벤트 전파 방지
                        >
                            <div className={styles.mobileMenuHeader}>
                                <Link to="/" className={styles.logo} onClick={toggleMobileMenu}>
                                    <img src="/logo_no_BG.png" alt="로고" className={styles.logoImg} />
                                    <span className={styles.logoText}>Guardians</span>
                                </Link>
                                <button onClick={toggleMobileMenu} className={styles.closeButton}>
                                    <FaTimes size={24} />
                                </button>
                            </div>
                            <nav className={styles.mobileNav}>
                                <Link to="/wargame" className={styles.mobileLink} onClick={toggleMobileMenu}>워게임</Link>
                                <Link to="/ranking" className={styles.mobileLink} onClick={toggleMobileMenu}>랭킹</Link>
                                <Link to="/community" className={styles.mobileLink} onClick={toggleMobileMenu}>커뮤니티</Link>
                                <Link to="/job" className={styles.mobileLink} onClick={toggleMobileMenu}>커리어</Link>
                                {isLoggedIn && (
                                    <Link to="/dashboard" className={styles.mobileLink} onClick={toggleMobileMenu}>대시보드</Link>
                                )}
                                <div className={styles.divider} />
                                {isLoggedIn ? (
                                    <>
                                        <Link to="/mypage" className={styles.mobileLink} onClick={toggleMobileMenu}>마이페이지</Link>
                                        <button className={`${styles.mobileLink} ${styles.logoutButton}`} onClick={handleLogout}>로그아웃</button>
                                    </>
                                ) : (
                                    <Link to="/login" className={styles.mobileLink} onClick={toggleMobileMenu}>로그인 / 회원가입</Link>
                                )}
                            </nav>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default Header;