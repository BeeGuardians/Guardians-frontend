import Sidebar from "./components/Sidebar";
import BoardSection from "./components/BoardSection";

const CommunityPage = () => {
    const dummyPosts = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        title: `free Board TestTitle exam${i + 1}`,
        views: 100 * (5 - i),
    }));

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            padding: "2rem",
            boxSizing: "border-box",
        }}>
            <div style={{
                display: "flex",
                gap: "3.5rem",
                maxWidth: "1200px",
                width: "100%",
            }}>
                <Sidebar />
                <div style={{ flex: 1 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                        <BoardSection
                            title="자유 게시판"
                            description="하고싶은말을 자유롭게 올려주세요"
                            posts={dummyPosts}
                            color="#fdf3e7"
                            link="/community/free"
                        />
                        <BoardSection
                            title="스터디 모집"
                            description="스터디 팀원을 구해보세요"
                            posts={dummyPosts}
                            color="#fdeaf4"
                            link="/community/study"
                        />
                        <BoardSection
                            title="Q&A"
                            description="올라온 질문을 확인하고 자유롭게 답변해보세요"
                            posts={dummyPosts}
                            color="#eae7f8"
                            link="/community/qna"
                        />
                        <BoardSection
                            title="문의 게시판"
                            description="관리자에게 문의사항이 있다면 올려주세요"
                            posts={dummyPosts}
                            color="#e0f6f3"
                            link="/community/inquiry"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
