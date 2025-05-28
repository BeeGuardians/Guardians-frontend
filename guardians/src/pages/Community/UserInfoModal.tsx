import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UserInfoModal.module.css'; // CSS 모듈 임포트

interface User {
    id: string;
    username: string;
    profileImageUrl: string;
    email: string;
}

interface UserStats {
    score: number;
    rank: number;
    tier: string;
    solvedCount: number;
}

interface UserInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    userInfo: User | null;
}

const UserInfoModal = ({ isOpen, onClose, userInfo }: UserInfoModalProps) => {
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [errorStats, setErrorStats] = useState<string | null>(null);

    // 티어 뱃지 이미지 매핑 (실제 경로에 맞춰 조정 필요)
    const badgeMap: Record<string, string> = {
        BRONZE: "/badges/BRONZE.png",
        SILVER: "/badges/SILVER.png",
        GOLD: "/badges/GOLD.png",
        PLATINUM: "/badges/PLATINUM.png",
        // 추가 티어가 있다면 여기에 계속 추가
    };

    const getTierBadgeUrl = (tier: string | undefined): string => {
        if (!tier) return "";
        return badgeMap[tier.toUpperCase()] ?? "";
    };


    useEffect(() => {
        console.log("UserInfoModal useEffect triggered.");
        console.log("  - isOpen:", isOpen);
        console.log("  - userInfo:", userInfo);
        console.log("  - userInfo?.id:", userInfo?.id);

        if (isOpen && userInfo?.id) {
            console.log("UserInfoModal: Condition met. Attempting to fetch user stats for ID:", userInfo.id);
            setLoadingStats(true);
            setErrorStats(null); // 새로운 fetch 시 에러 상태 초기화

            axios.get(`/api/users/${userInfo.id}/stats`, { withCredentials: true })
                .then(res => {
                    console.log("UserInfoModal: User stats fetched successfully:", res.data.result.data);
                    setUserStats(res.data.result.data);
                })
                .catch(err => {
                    console.error("UserInfoModal: Failed to fetch user stats:", err);
                    setErrorStats("유저 통계 정보를 불러오는데 실패했습니다.");
                    setUserStats(null);
                })
                .finally(() => {
                    setLoadingStats(false);
                });
        } else {
            console.log("UserInfoModal: Condition not met (modal closed or userInfo missing). Resetting stats.");
            setUserStats(null);
            setErrorStats(null);
        }
    }, [isOpen, userInfo?.id]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>
                        {/* 티어 뱃지 추가 */}
                        {userStats?.tier && (
                            <img
                                src={getTierBadgeUrl(userStats.tier)}
                                alt={`${userStats.tier} 뱃지`}
                                className={styles.tierBadge}
                            />
                        )}
                        {userInfo?.username || '알 수 없는 사용자'}
                    </h2>
                    </div>
                <div className={styles.body}>
                    <div className={styles.profileSection}>
                        <div className={styles.profileImageContainer}>
                            <img
                                src={userInfo?.profileImageUrl || '/default-profile.png'}
                                alt={`${userInfo?.username || 'default'} profile`}
                                className={styles.profileImage}
                            />
                        </div>
                        <div className={styles.userInfoDetails}>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>이메일</span>
                                <span className={styles.detailValue}>{userInfo?.email || 'N/A'}</span>
                            </div>

                            {loadingStats ? (
                                <p className={styles.loadingText}>통계 정보 로딩 중...</p>
                            ) : errorStats ? (
                                <p className={styles.errorText}>{errorStats}</p>
                            ) : userStats ? (
                                <>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>티어</span>
                                        <span className={styles.detailValue}>{userStats.tier}</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>점수</span>
                                        <span className={styles.detailValue}>{userStats.score}점</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>랭킹</span>
                                        <span className={styles.detailValue}>{userStats.rank}위</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>푼 문제</span>
                                        <span className={styles.detailValue}>{userStats.solvedCount}개</span>
                                    </div>
                                </>
                            ) : (
                                <p className={styles.noStatsText}>통계 정보를 불러올 수 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.footer}>
                    <button className={styles.confirmBtn} onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default UserInfoModal;