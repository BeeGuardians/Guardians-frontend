import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import RankCard from "./RankCard"; // RankCard 컴포넌트 import
import RankingTable from "./RankingTable"; // RankingTable 컴포넌트 import
import UserInfoModal from '../../pages/Community/UserInfoModal.tsx'; // UserInfoModal 경로 확인

// UserRanking 인터페이스에 userId 필드 추가 (백엔드 응답에 포함되어야 함)
interface UserRanking {
    rank: number;
    username: string;
    score: number;
    totalSolved: number;
    userProfileUrl: string;
    userId: string; // <-- 이 필드가 백엔드 응답에 있어야 합니다.
}

// UserInfoModal에 전달할 사용자 정보 인터페이스
interface UserForModal {
    id: string;
    username: string;
    profileImageUrl: string;
    email: string;
}

function RankingPage() {
    const [top3, setTop3] = useState<UserRanking[]>([]);
    const [allUsers, setAllUsers] = useState<UserRanking[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserRanking[]>([]);

    // UserInfoModal 관련 상태 (RankingPage에서 관리)
    const [userInfoForModal, setUserInfoForModal] = useState<UserForModal | null>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [showInfoMessageModal, setShowInfoMessageModal] = useState(false);
    const [infoMessage, setInfoMessage] = useState('');

    useEffect(() => {
        // 랭킹 데이터를 백엔드에서 불러옵니다.
        // 백엔드 API 응답에 각 유저의 'userId' 필드가 포함되어야 합니다.
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/ranking`, { withCredentials: true })
            .then((res) => {
                const data: UserRanking[] = res.data.result?.data ?? [];
                setTop3(data.slice(0, 3));
                setAllUsers(data);
                setFilteredUsers(data);
            })
            .catch((err) => {
                console.error("❌ 랭킹 불러오기 실패:", err);
                setInfoMessage('랭킹 정보를 불러오는데 실패했습니다.');
                setShowInfoMessageModal(true);
            });
    }, []);

    const handleSearch = (keyword: string) => {
        const filtered = allUsers.filter(user =>
            user.username.toLowerCase().includes(keyword.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    // RankCard 또는 RankingTable에서 호출될 유저 정보 모달 띄우기 함수
    const handleUserClick = async (targetUserId: string) => {
        try {
            console.log("RankingPage: handleUserClick called for targetUserId:", targetUserId);

            // '/api/users/{userId}' API를 호출하여 사용자 기본 정보를 가져옵니다.
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/${targetUserId}`, { withCredentials: true });
            const userData = res.data.result.data;

            console.log("RankingPage: Fetched user base info:", userData);

            // UserInfoModal에 전달할 userInfo 객체를 생성합니다.
            // 백엔드 응답의 'userId'를 UserInfoModal이 기대하는 'id'로 매핑합니다.
            const newUserInfoForModal: UserForModal = {
                id: String(userData.userId),
                username: userData.username,
                profileImageUrl: userData.profileImageUrl,
                email: userData.email,
            };

            setUserInfoForModal(newUserInfoForModal);
            setIsUserModalOpen(true); // 모달을 엽니다.

        } catch (error) {
            console.error("RankingPage: Error fetching user base info for modal:", error);
            setInfoMessage('유저 정보를 불러오는데 실패했습니다.');
            setShowInfoMessageModal(true);
        }
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            padding: "2rem 1rem",
        }}>
            <div style={{
                maxWidth: "1200px",
                width: "100%",
            }}>
                {/* 상단 설명 섹션 */}
                <h3 style={{ marginTop: "0rem", marginBottom: "1rem", fontWeight: 400, fontSize: "1rem", color: "#666" }}>
                    🏆 나의 순위는 몇 위? 최고 수치로 실력을 증명해보세요!
                </h3>

                <div style={{
                    backgroundColor: "#fffbe6",
                    border: "1px solid #ffe58f",
                    borderRadius: "0.75rem",
                    padding: "1.25rem",
                    marginBottom: "6rem",
                    color: "#664d03",
                    fontSize: "0.95rem",
                    lineHeight: "1.5rem",
                }}>
                    랭킹은 워게임에서 획득한 점수와 해결한 문제 수에 따라 자동 계산됩니다. <br />
                    다른 유저들과 실력을 비교하고, 더 높은 점수를 향해 도전해보세요! 💥
                </div>

                {/* 🥇 상위 3명 카드 섹션 */}
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    gap: "6.5rem",
                    marginBottom: "5rem",
                }}>
                    {top3.length >= 3 && (
                        <>
                            <div style={{ transform: "translateY(10px)", scale: "1.05" }}>
                                <RankCard {...top3[1]} onClick={handleUserClick} />
                            </div>
                            <div style={{ transform: "translateY(0px)", scale: "1.15" }}>
                                <RankCard {...top3[0]} onClick={handleUserClick} />
                            </div>
                            <div style={{ transform: "translateY(10px)", scale: "1.05" }}>
                                <RankCard {...top3[2]} onClick={handleUserClick} />
                            </div>
                        </>
                    )}
                </div>

                {/* 🔍 검색창 섹션 */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2rem" }}>
                    <SearchBar onSearch={handleSearch} />
                </div>

                {/* 📊 전체 순위 테이블 섹션 */}
                {/* RankingTable에 handleUserClick prop을 전달합니다. */}
                <RankingTable data={filteredUsers} handleUserClick={handleUserClick} />
            </div>

            {/* 유저 정보 모달 */}
            <UserInfoModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                userInfo={userInfoForModal}
            />

            {/* 에러 메시지 모달 */}
            {showInfoMessageModal && (
                <>
                    {/* 모달 오버레이 */}
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000
                    }}></div>
                    {/* 모달 콘텐츠 */}
                    <div style={{
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1001, textAlign: 'center'
                    }}>
                        <p>{infoMessage}</p>
                        <button onClick={() => setShowInfoMessageModal(false)} style={{
                            marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#FFC078', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                        }}>확인</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default RankingPage;