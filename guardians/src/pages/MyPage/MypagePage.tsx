import { Outlet } from "react-router-dom";
import MypageSidebar from "./MypageSidebar";
import styles from "./MypagePage.module.css";

const MypagePage = () => {
    return (
        <div className={styles.pageWrapper}>
            <div style={{ maxWidth: "1200px", width: "100%", display: "flex", gap: "2rem" }}>
                <MypageSidebar />
                <Outlet />
            </div>
        </div>
    );
};

export default MypagePage;
