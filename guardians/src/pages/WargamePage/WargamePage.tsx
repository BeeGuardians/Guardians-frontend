import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import WargameTable from "./WargameTable";
import ProfileCard from "./ProfileCard";
import PopularWargameList from "./PopularWargameList";

function WargamePage() {
    return (
        <div style={{ display: "flex", padding: "2rem 10rem" }}>
            {/* 왼쪽 메인 */}
            <div style={{ flex: 2.8, paddingRight: "2rem" }}>
                {/*<h2 style={{ fontWeight: 600 }}>워게임</h2>*/}
                <h3
                    style={{
                        marginTop: "0rem",
                        marginBottom: "1rem",
                        fontWeight: 400,
                        fontSize: "1rem",
                        color: "#666",
                    }}
                >
                    😎 취약점을 찾아내고, 문제를 해결하세요!
                </h3>

                {/* ✨ 워게임 소개 영역 */}
                <div
                    style={{
                        backgroundColor: "#fffbe6",
                        border: "1px solid #ffe58f",
                        borderRadius: "0.75rem",
                        padding: "1.25rem",
                        marginBottom: "2rem",
                        color: "#664d03",
                        fontSize: "0.95rem",
                        lineHeight: "1.5rem",
                    }}
                >
                    워게임은 실전과 유사한 문제를 풀며 보안 역량을 키울 수 있는 환경입니다. <br />
                    취약점을 찾아내고 문제를 해결하면서, 재미있게 공부해보세요! 💪
                </div>

                <SearchBar />
                <FilterBar />
                <WargameTable />
            </div>

            {/* 오른쪽 사이드바 (프로필 + 인기문제) */}
            <div
                style={{
                    flex: 1,
                    paddingTop: "2.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                }}
            >
                <ProfileCard />
                <PopularWargameList />
            </div>
        </div>
    );
}

export default WargamePage;
