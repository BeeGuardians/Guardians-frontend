import MypageSidebar from "./MypageSidebar";
import MypageInfoCard from "./MypageInfoCard";
import styles from "./MypagePage.module.css";

const MypagePage = () => {
    return (
        <div className={styles.pageWrapper}>
            <MypageSidebar />
            <MypageInfoCard />
        </div>
    );
};

export default MypagePage;