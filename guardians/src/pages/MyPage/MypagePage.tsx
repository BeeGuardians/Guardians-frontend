import { Outlet } from "react-router-dom";
import MypageSidebar from "./MypageSidebar";
import styles from "./MypagePage.module.css";

const MypagePage = () => {
    return (
        <div className={styles.pageWrapper}>
            <MypageSidebar />
            <Outlet /> {/* ← 여기서 PostsPage, InfoCard 등이 렌더링됨 */}
        </div>
    );
};

export default MypagePage;