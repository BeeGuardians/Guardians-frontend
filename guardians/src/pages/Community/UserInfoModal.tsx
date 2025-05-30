import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UserInfoModal.module.css';

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
    };

    const getTierBadgeUrl = (tier: string | undefined): string => {
        if (!tier) return "";
        return badgeMap[tier.toUpperCase()] ?? "";
    };

    // ✨✨✨ 새로 추가된 티어 이름 포맷팅 함수 ✨✨✨
    const formatTierName = (tier: string | undefined): string => {
        if (!tier) return "N/A";
        // 첫 글자만 대문자로, 나머지는 소문자로 변환
        return tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
    };


    useEffect(() => {
        console.log("UserInfoModal useEffect triggered.");
        console.log("  - isOpen:", isOpen);
        console.log("  - userInfo:", userInfo);
        console.log("  - userInfo?.id:", userInfo?.id);

        if (isOpen && userInfo?.id) { // 이 조건이 true가 되도록 하는 것이 핵심!
            console.log("UserInfoModal: Condition met. Attempting to fetch user stats for ID:", userInfo.id);
            setLoadingStats(true);
            setErrorStats(null);

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
                    // 👇 여기를 수정해야 합니다!
                    // setLoadingStats(true); // 이전 코드
                    setLoadingStats(false); // 수정된 코드: 로딩 상태를 false로 변경
                });
        } else {
            console.log("UserInfoModal: Condition not met (modal closed or userInfo missing). Resetting stats.");
            setUserStats(null);
            setErrorStats(null);
            // isOpen이 false이거나 userInfo.id가 없을 때는 로딩 상태가 아니므로 false로 설정
            setLoadingStats(false); // 추가: 여기서도 로딩 상태를 명확히 false로 설정
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
                                        {/* ✨✨✨ formatTierName 함수 적용 ✨✨✨ */}
                                        <span className={styles.detailValue}>{formatTierName(userStats.tier)}</span>
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