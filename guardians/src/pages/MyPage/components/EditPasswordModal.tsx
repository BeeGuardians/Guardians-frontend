import { useState } from "react";
import axios from "axios";
import styles from "./Modal.module.css";
import { useAuth } from "../../../context/AuthContext";

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

const EditPasswordModal = ({ onClose, onSuccess }: Props) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const { user } = useAuth();
    const userId = user?.id;

    const handleUpdate = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            await axios.patch(
                `${API_BASE}/api/users/${userId}/reset-password`,
                {
                    currentPassword,
                    newPassword,
                },
                { withCredentials: true }
            );

            onClose();     // 모달 닫고
            onSuccess();   // 부모에게 성공 알림
        } catch (err) {
            console.error("❌ 비밀번호 변경 실패:", err);
            alert("비밀번호 변경 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>비밀번호 변경</h2>
                    <button className={styles.closeButton} onClick={onClose}>✕</button>
                </div>
                <div className={styles.afterHeaderGap}></div>

                <div className={styles.inputWrapper}>
                    <label className={styles.inputLabel}>현재 비밀번호</label>
                    <input
                        type="password"
                        className={styles.input}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>

                <div className={styles.inputWrapper}>
                    <label className={styles.inputLabel}>
                        새로운 비밀번호{" "}
                        <span className={styles.helperText}>(대문자,소문자 포함 8자 이상)</span>
                    </label>
                    <input
                        type="password"
                        className={styles.input}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div className={styles.inputWrapper}>
                    <label className={styles.inputLabel}>비밀번호 확인</label>
                    <input
                        type="password"
                        className={styles.input}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <div className={styles.buttonRow}>
                    <button className={styles.cancelBtn} onClick={onClose}>취소</button>
                    <button className={styles.confirmBtn} onClick={handleUpdate}>변경</button>
                </div>
            </div>
        </div>
    );
};

export default EditPasswordModal;
