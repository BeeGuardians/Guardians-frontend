import styles from './UserInfoModal.module.css';

interface User {
    id: string;
    username: string;
    profileImageUrl: string;
    email: string;
    tier: string;  // 티어
    score: number; // 스코어
    rank: number;  // 랭킹
}

interface UserInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    userInfo: User | null;
}

const UserInfoModal = ({ isOpen, onClose, userInfo }: UserInfoModalProps) => {
    if (!isOpen) return null; // 모달이 열리지 않으면 아무것도 렌더링하지 않음

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>{userInfo?.username}</h2> {/* 유저 이름만 표시 */}
                </div>
                <div className={styles.body}>
                    <div className={styles.profileInfo}>
                        <div className={styles.profileImageContainer}>
                            <img src={userInfo?.profileImageUrl} alt={`${userInfo?.username} profile`} className={styles.profileImage} />
                        </div>
                        <div className={styles.info}>
                            <p className={styles.infoText}><strong>Email:</strong> {userInfo?.email}</p>
                            <p className={styles.infoText}><strong>티어:</strong> {userInfo?.tier}</p>
                            <p className={styles.infoText}><strong>점수:</strong> {userInfo?.score}</p>
                            <p className={styles.infoText}><strong>랭킹:</strong> #{userInfo?.rank}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.footer}>
                    <button className={styles.confirmBtn} onClick={onClose}>확인</button> {/* 확인 버튼 */}
                </div>
            </div>
        </div>
    );
};

export default UserInfoModal;
