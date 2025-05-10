import styles from "./Modal.module.css";

interface Props {
    onClose: () => void;
}

const EditPasswordModal = ({ onClose }: Props) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
                {/* 제목 + X버튼 */}
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>비밀번호 변경</h2>
                    <button className={styles.closeButton} onClick={onClose}>✕</button>
                </div>
                <div className={styles.afterHeaderGap}></div>  {/* ✅ 선 아래 간격 */}

                {/* 현재 비밀번호 */}
                <div className={styles.inputWrapper}>
                    <label className={styles.inputLabel}>현재 비밀번호</label>
                    <input type="password" className={styles.input} />
                </div>

                {/* 새로운 비밀번호 */}
                <div className={styles.inputWrapper}>
                    <label className={styles.inputLabel}>
                        새로운 비밀번호{" "}
                        <span className={styles.helperText}>(대문자,소문자 포함 8자 이상)</span>
                    </label>
                    <input type="password" className={styles.input} />
                </div>

                {/* 비밀번호 확인 */}
                <div className={styles.inputWrapper}>
                    <label className={styles.inputLabel}>비밀번호 확인</label>
                    <input type="password" className={styles.input} />
                </div>

                {/* 버튼 */}
                <div className={styles.buttonRow}>
                    <button className={styles.cancelBtn} onClick={onClose}>취소</button>
                    <button className={styles.confirmBtn}>변경</button>
                </div>
            </div>
        </div>
    );
};

export default EditPasswordModal;