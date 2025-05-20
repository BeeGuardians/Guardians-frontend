import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import viewIcon from "../../assets/view.png";
import commentIcon from "../../assets/comment.png";
import axios from "axios";

type QnaPost = {
    id: number;
    wargameTitle?: string;
    title: string;
    content: string;
    username: string;
    createdAt: string;
    answerCount?: number;
};

const QnaBoardPage = () => {
    const [posts, setPosts] = useState<QnaPost[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate(); // ✅ 추가
    const postsPerPage = 10;

    useEffect(() => {
        const fetchQuestionsWithCounts = async () => {
            try {
                const res = await axios.get("/api/qna/questions");
                const questions: QnaPost[] = res.data.result.data;

                const questionsWithCount = await Promise.all(
                    questions.map(async (q) => {
                        try {
                            const answerRes = await axios.get(`/api/qna/answers/${q.id}`);
                            const count = answerRes.data.result.count || 0;
                            return { ...q, answerCount: count };
                        } catch (err) {
                            console.error(`답변 수 불러오기 실패 (id: ${q.id})`, err);
                            return { ...q, answerCount: 0 };
                        }
                    })
                );

                setPosts(questionsWithCount);
            } catch (err) {
                console.error("QnA 질문 목록 불러오기 실패:", err);
            }
        };

        fetchQuestionsWithCounts();
    }, []);

    const totalPages = Math.ceil(posts.length / postsPerPage);
    const currentPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

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
                width: "100%"
            }}>
                <Sidebar />
                <div style={{ flex: 1 }}>
                    <div
                        style={{
                            backgroundColor: "#eae7f8",
                            padding: "1rem",
                            borderRadius: "8px",
                            marginBottom: "1.5rem",
                            border: "1px solid #ddd",
                        }}
                    >
                        <h2 style={{ margin: 0, fontWeight: 600 }}>워게임 Q&A</h2>
                        <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "0.5rem" }}>
                            올라온 질문을 확인하고 자유롭게 답변해보세요!
                        </p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                        <SearchBar />
                        <button
                            style={{
                                backgroundColor: "#FFA94D",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                padding: "0.5rem 1rem",
                                fontSize: "0.9rem",
                                fontWeight: 550,
                                cursor: "pointer",
                                marginRight: "0.5rem",
                                width: "10%",
                            }}
                            onClick={() => navigate("/community/qna/write")}
                        >
                            질문하기
                        </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {currentPosts.map((post) => (
                            <div
                                key={post.id}
                                style={{
                                    backgroundColor: "#fff",
                                    padding: "1.5rem",
                                    borderRadius: "12px",
                                    border: "1px solid #eee",
                                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.04)",
                                    cursor: "pointer",
                                    transition: "box-shadow 0.2s",
                                }}
                                onClick={() => navigate(`/community/qna/${post.id}`)}
                                onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.1)")}
                                onMouseOut={(e) => (e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.04)")}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                                    <span style={{ fontWeight: 500, color: "#888" }}>{post.wargameTitle || "워게임 미지정"}</span>
                                    <span style={{ color: "#666" }}>{post.username} · {post.createdAt.slice(0, 10)}</span>
                                </div>

                                <div style={{ fontSize: "1.15rem", fontWeight: 700, margin: "0.4rem 0 1rem", lineHeight: "1.4" }}>
                                    {post.title}
                                </div>

                                <div style={{ fontSize: "0.9rem", color: "#444", marginBottom: "0.8rem", lineHeight: "1.5" }}>
                                    {post.content.length > 150 ? post.content.slice(0, 150) + "..." : post.content}
                                </div>

                                <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "0.5rem 0 1rem" }} />

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <div style={{ display: "flex", gap: "1.25rem", fontSize: "0.85rem", color: "#555" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                            <img src={commentIcon} alt="comment" style={{ width: "16px", height: "16px" }} />
                                            <span>{post.answerCount ?? 0} 답변</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                            <img src={viewIcon} alt="view" style={{ width: "18px", height: "18px" }} />
                                            <span>- 조회</span>
                                        </div>
                                    </div>
                                    <span
                                        style={{
                                            backgroundColor: post.answerCount && post.answerCount > 0 ? "#D3F9D8" : "#FFF3BF",
                                            color: post.answerCount && post.answerCount > 0 ? "#2B8A3E" : "#C77D00",
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            padding: "0.35rem 0.8rem",
                                            borderRadius: "999px",
                                        }}
                                    >
                                        {post.answerCount && post.answerCount > 0 ? "답변완료" : "미답변"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                style={{
                                    margin: "0 0.25rem",
                                    padding: "0.4rem 0.75rem",
                                    backgroundColor: currentPage === i + 1 ? "#FFC078" : "#f0f0f0",
                                    color: currentPage === i + 1 ? "white" : "black",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QnaBoardPage;
