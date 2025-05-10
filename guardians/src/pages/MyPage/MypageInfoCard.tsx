import { useState } from "react";
import styles from "./MypagePage.module.css";
import EditUsernameModal from "./components/EditUsernameModal";
import EditPasswordModal from "./components/EditPasswordModal";

const MypageInfoCard = () => {
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    return (
        <div className={styles.card}>
            <div className={styles.profileSection}>
                <div className={styles.profileCircle}></div>
                <span className={styles.changePhoto}>사진 변경</span>
            </div>

            <div className={styles.infoItem}>
                <label className={styles.infoLabel}>사용자 이름</label>
                <div className={styles.inputRow}>
                    <input
                        type="text"
                        className={styles.inputField}
                        value="Guardians123"
                        readOnly
                    />
                    <button
                        className={styles.editBtn}
                        onClick={() => setShowUsernameModal(true)}
                    >
                        닉네임 수정
                    </button>
                </div>
            </div>

            <div className={styles.infoItem}>
                <label className={styles.infoLabel}>이메일</label>
                <div className={styles.inputRow}>
                    <input
                        type="email"
                        className={styles.inputField}
                        value="guardian@guardian.com"
                        readOnly
                    />
                </div>
            </div>

            <div className={styles.infoItem}>
                <label className={styles.infoLabel}>비밀번호</label>
                <div className={styles.inputRow}>
                    <input
                        type="password"
                        className={styles.inputField}
                        value="**********"
                        readOnly
                    />
                    <button
                        className={styles.editBtn}
                        onClick={() => setShowPasswordModal(true)}
                    >
                        비밀번호 변경
                    </button>
                </div>
            </div>

            {showUsernameModal && (
                <EditUsernameModal onClose={() => setShowUsernameModal(false)} />
            )}
            {showPasswordModal && (
                <EditPasswordModal onClose={() => setShowPasswordModal(false)} />
            )}
        </div>
    );
};

export default MypageInfoCard;