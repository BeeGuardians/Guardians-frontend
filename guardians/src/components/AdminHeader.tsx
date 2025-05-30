// src/components/AdminHeader.tsx
import { Link, useNavigate } from "react-router-dom";
import styles from "./AdminHeader.module.css"; // CSS는 AuthHeader와 공유
import { useAuth } from "../context/AuthContext";

const AdminHeader = () => {
    const { user, logout } = useAuth(); // user와 logout 함수를 가져옴
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

    const handleAdminLogout = async () => {
        try {
            await logout(); // AuthContext의 로그아웃 로직 실행 (세션 종료, user 상태 null로)
            navigate("/admin/login"); // ⭐ 로그아웃 완료 후 관리자 로그인 페이지로 직접 이동 ⭐
        } catch (error) {
            console.error("❌ 관리자 로그아웃 실패:", error);
            alert("로그아웃 중 오류가 발생했습니다.");
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.left}>
                    {/* 로고 클릭 시 /admin 경로로 이동 (AdminPrivateRoute에 의해 다시 /admin/login으로 갈 수 있음) */}
                    <Link to="/admin" className={styles.logo}>
                        <img src="/logo_no_BG.png" alt="로고" className={styles.logoImg} />
                        <span className={styles.logoText}>Team Guardians</span>
                    </Link>
                </div>
                {/* user 객체가 존재할 때만 (로그인 상태일 때) 로그아웃 버튼 렌더링 */}
                {user && (
                    <div className={styles.right}>
                        <button onClick={handleAdminLogout} className={styles.logoutButton || ''}>
                            관리자 로그아웃
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default AdminHeader;