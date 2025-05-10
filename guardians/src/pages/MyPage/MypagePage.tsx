import { Outlet } from "react-router-dom";
import MypageSidebar from "./MypageSidebar";
import styles from "./MypagePage.module.css";

const MypagePage = () => {
    return (
        <div className={styles.pageWrapper}>
            <MypageSidebar />
            <Outlet />
        </div>
    );
};

export default MypagePage;