import styles from "./MypagePage.module.css";

const MypageInfoCard = () => {
    return (
        <div className={styles.card}>
            <div className={styles.profileSection}>
                <div className={styles.profileCircle}></div>
                <span className={styles.changePhoto}>사진 변경</span>
            </div>

            <div className={styles.infoItem}>
                <label>닉네임</label>
                <div className={styles.inputRow}>
                    <input type="text" value="Guardians123" readOnly />
                    <button className={styles.editBtn}>수정</button>
                </div>
            </div>

            <div className={styles.infoItem}>
                <label>이메일</label>
                <input type="email" value="guardian@guardian.com" readOnly />
            </div>

            <div className={styles.infoItem}>
                <label>비밀번호</label>
                <div className={styles.inputRow}>
                    <input type="password" value="**********" readOnly />
                    <button className={styles.editBtn}>비밀번호 변경</button>
                </div>
            </div>
        </div>
    );
};

export default MypageInfoCard;
