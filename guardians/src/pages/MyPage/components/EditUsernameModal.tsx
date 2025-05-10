import { useState } from "react";
import axios from "axios";
import styles from "./Modal.module.css";
import { useAuth } from "../../../context/AuthContext";

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

const EditUsernameModal = ({ onClose, onSuccess }: Props) => {
    const [newUsername, setNewUsername] = useState("");
    const { user } = useAuth(); // Redis 세션에서 꺼낸 유저
    const userId = user?.id;
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const handleUpdate = async () => {
        if (!newUsername.trim()) {
            alert("닉네임을 입력해주세요.");
            return;
        }

        try {
            await axios.patch(
                `${API_BASE}/api/users/${userId}/update`,
                { username: newUsername },
                { withCredentials: true }
            );

            // 닫고 → 부모에게 성공 알림
            onClose();
            onSuccess();
        } catch (err) {
            console.error("❌ 닉네임 변경 실패:", err);
            alert("닉네임 변경 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>사용자 이름 수정</h2>
                    <button className={styles.closeButton} onClick={onClose}>✕</button>
                </div>
                <div className={styles.afterHeaderGap}></div>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="새로운 닉네임"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                />
                <div className={styles.buttonRow}>
                    <button className={styles.cancelBtn} onClick={onClose}>취소</button>
                    <button className={styles.confirmBtn} onClick={handleUpdate}>변경</button>
                </div>
            </div>
        </div>
    );
};

export default EditUsernameModal;
