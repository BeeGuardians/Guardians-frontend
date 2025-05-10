import styles from "./Modal.module.css";

interface Props {
    onClose: () => void;
}

const EditUsernameModal = ({ onClose }: Props) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
                <button className={styles.closeButton} onClick={onClose}>✕</button>
                <h2 className={styles.modalTitle}>사용자 이름 수정</h2>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="새로운 닉네임"
                />
                <div className={styles.buttonRow}>
                    <button className={styles.cancelBtn} onClick={onClose}>취소</button>
                    <button className={styles.confirmBtn}>변경</button>
                </div>
            </div>
        </div>
    );
};

export default EditUsernameModal;