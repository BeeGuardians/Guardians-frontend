import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import BoardSection from "./components/BoardSection";

interface PreviewPost {
    id: number;
    title: string;
}

interface Board {
    boardId: number;
    title: string;
    createdAt: string;
}

interface QnaPost {
    id: number;
    title: string;
    createdAt: string;
}

const CommunityPage = () => {
    const [freePosts, setFreePosts] = useState<PreviewPost[]>([]);
    const [studyPosts, setStudyPosts] = useState<PreviewPost[]>([]);
    const [qnaPosts, setQnaPosts] = useState<PreviewPost[]>([]);
    const [inquiryPosts, setInquiryPosts] = useState<PreviewPost[]>([]);

    useEffect(() => {
        const fetchPosts = async (
            type: string,
            setter: React.Dispatch<React.SetStateAction<PreviewPost[]>>
        ) => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/boards?type=${type}`, {
                    withCredentials: true,
                });

                const data = res.data.result?.data as Board[] ?? [];

                const latestFive = data
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((post) => ({
                        id: post.boardId,
                        title: post.title,
                    }));

                setter(latestFive);
            } catch (err) {
                console.error(`${type} 게시판 불러오기 실패`, err);
            }
        };

        const fetchQnaPreview = async () => {
            try {
                const res = await axios.get("/api/qna/questions", { withCredentials: true });
                const data = res.data.result?.data as QnaPost[] ?? [];

                const latestFive = data
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((q) => ({
                        id: q.id,
                        title: q.title,
                    }));

                setQnaPosts(latestFive);
            } catch (err) {
                console.error("Q&A 미리보기 불러오기 실패", err);
            }
        };

        fetchPosts("FREE", setFreePosts);
        fetchPosts("STUDY", setStudyPosts);
        fetchPosts("INQUIRY", setInquiryPosts);
        fetchQnaPreview(); // QnA는 별도로 호출
    }, []);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                padding: "2rem",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: "3.5rem",
                    maxWidth: "1200px",
                    width: "100%",
                }}
            >
                <Sidebar />
                <div style={{ flex: 1 }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1.5rem",
                        }}
                    >
                        <BoardSection
                            title="자유 게시판"
                            description="하고싶은말을 자유롭게 올려주세요"
                            posts={freePosts}
                            color="#fdf3e7"
                            link="/community/free"
                        />
                        <BoardSection
                            title="스터디 모집"
                            description="스터디 팀원을 구해보세요"
                            posts={studyPosts}
                            color="#fdeaf4"
                            link="/community/study"
                        />
                        <BoardSection
                            title="Q&A"
                            description="올라온 질문을 확인하고 자유롭게 답변해보세요"
                            posts={qnaPosts}
                            color="#eae7f8"
                            link="/community/qna"
                        />
                        <BoardSection
                            title="문의 게시판"
                            description="관리자에게 문의사항이 있다면 올려주세요"
                            posts={inquiryPosts}
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
