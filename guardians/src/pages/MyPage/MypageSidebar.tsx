import { Link, useLocation } from "react-router-dom";
import styles from "./MypagePage.module.css";

const MypageSidebar = () => {
    const location = useLocation();
    const menuItems = [
        { path: "/mypage", label: "내 정보" },
        { path: "/mypage/posts", label: "내가 쓴 글" },
    ];

    return (
        <aside className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>🙈 마이페이지</h3>
            <ul className={styles.menuList}>
                {menuItems.map((item) => (
                    <li key={item.path} className={styles.menuItemWrapper}>
                        <Link
                            to={item.path}
                            className={`${styles.menuItem} ${
                                location.pathname === item.path ? styles.active : ""
                            }`}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default MypageSidebar;