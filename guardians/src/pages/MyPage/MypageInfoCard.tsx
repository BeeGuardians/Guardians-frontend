import { useEffect, useState, useCallback, ChangeEvent } from "react";
import axios from "axios";
import styles from "./MypagePage.module.css";
import EditUsernameModal from "./components/EditUsernameModal";
import EditPasswordModal from "./components/EditPasswordModal";
import SuccessModal from "./components/SuccessModal";
import { useAuth } from "../../context/AuthContext";
import editIcon from "../../assets/edit.png";

interface UserInfo {
    userId: number;
    username: string;
    email: string;
    profileImageUrl: string;
}

const MypageInfoCard = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const { user } = useAuth();
    const userId = user?.id;

    const fetchUserInfo = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`${API_BASE}/api/users/${userId}`, {
                withCredentials: true,
            });
            setUserInfo(res.data.result.data);
        } catch (err) {
            console.error("마이페이지 정보 조회 실패:", err);
        }
    }, [userId]);

    useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo]);

    const handleUsernameSuccess = () => {
        setSuccessMessage("닉네임이 성공적으로 변경되었습니다!");
        setShowSuccessModal(true);
    };

    const handlePasswordSuccess = () => {
        setSuccessMessage("비밀번호가 성공적으로 변경되었습니다!");
        setShowSuccessModal(true);
    };

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !userId) return;
        const formData = new FormData();
        formData.append("file", e.target.files[0]);

        try {
            await axios.post(
                `${API_BASE}/api/users/${userId}/profile-image`,
                formData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setSuccessMessage("프로필 이미지가 업로드되었습니다!");
            setShowSuccessModal(true);
        } catch (err) {
            console.error("❌ 프로필 이미지 업로드 실패:", err);
            alert("이미지 업로드 중 오류 발생");
        }
    };

    const handleImageDelete = async () => {
        if (!userId) return;

        try {
            await axios.delete(`${API_BASE}/api/users/${userId}/profile-image`, {
                withCredentials: true,
            });
            setSuccessMessage("프로필 이미지가 기본 이미지로 변경되었습니다!");
            setShowSuccessModal(true);
        } catch (err) {
            console.error("❌ 프로필 이미지 삭제 실패:", err);
            alert("이미지 삭제 중 오류 발생");
        }
    };

    if (!userInfo) return <div>로딩 중...</div>;

    return (
        <div className={styles.card}>
            {/* ✅ 프로필 이미지와 수정 아이콘 */}
            <div className={styles.avatarWrapper}>
                <div
                    className={styles.profileCircle}
                    style={{
                        backgroundImage: `url(${userInfo.profileImageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
                <label htmlFor="profile-upload" className={styles.avatarEditBtn} title="사진 업로드">
                    <img src={editIcon} alt="수정 아이콘" width={18} />
                </label>
                <input
                    type="file"
                    id="profile-upload"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                />
            </div>

            {userInfo.profileImageUrl && !userInfo.profileImageUrl.includes("default") && (
                <button className={styles.resetBtn} onClick={handleImageDelete}>
                    기본 이미지로 변경
                </button>
            )}

            <div className={styles.infoItem}>
                <label className={styles.infoLabel}>사용자 이름</label>
                <div className={styles.inputRow}>
                    <input type="text" className={styles.inputField} value={userInfo.username} readOnly />
                    <button className={styles.editBtn} onClick={() => setShowUsernameModal(true)}>
                        닉네임 수정
                    </button>
                </div>
            </div>

            <div className={styles.infoItem}>
                <label className={styles.infoLabel}>이메일</label>
                <div className={styles.inputRow}>
                    <input type="email" className={styles.inputField} value={userInfo.email} readOnly />
                </div>
            </div>

            <div className={styles.infoItem}>
                <label className={styles.infoLabel}>비밀번호</label>
                <div className={styles.inputRow}>
                    <input type="password" className={styles.inputField} value="**********" readOnly />
                    <button className={styles.editBtn} onClick={() => setShowPasswordModal(true)}>
                        비밀번호 변경
                    </button>
                </div>
            </div>

            {showUsernameModal && (
                <EditUsernameModal
                    onClose={() => setShowUsernameModal(false)}
                    onSuccess={handleUsernameSuccess}
                />
            )}

            {showPasswordModal && (
                <EditPasswordModal
                    onClose={() => setShowPasswordModal(false)}
                    onSuccess={handlePasswordSuccess}
                />
            )}

            {showSuccessModal && (
                <SuccessModal
                    message={successMessage}
                    onClose={() => {
                        setShowSuccessModal(false);
                        window.location.reload();
                    }}
                />
            )}
        </div>
    );
};

export default MypageInfoCard;
