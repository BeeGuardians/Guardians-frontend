import { useState } from "react";
import styles from "./Modal.module.css";

interface DeleteUserModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

function DeleteUserModal({ onClose, onConfirm }: DeleteUserModalProps) {
    const [inputValue, setInputValue] = useState("");

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
                {/* 모달 상단 */}
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>정말 탈퇴하시겠어요?</h3>
                    <button className={styles.closeButton} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={styles.afterHeaderGap} />

                {/* 경고 텍스트 */}
                <p className={styles.warningText}>
                    회원 탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.<br />
                    계속하려면 <strong>'삭제'</strong>라고 입력해주세요.
                </p>

                {/* 입력창 */}
                <input
                    className={styles.deleteConfirmInput}
                    type="text"
                    placeholder="삭제"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />

                {/* 버튼 영역 */}
                <div className={styles.buttonRow}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        취소
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={onConfirm}
                        disabled={inputValue !== "삭제"}
                    >
                        탈퇴하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteUserModal;
