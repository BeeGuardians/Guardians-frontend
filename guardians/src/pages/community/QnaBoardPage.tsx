import { useState } from "react";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import viewIcon from "../../assets/view.png";
import likeIcon from "../../assets/like.png";
import commentIcon from "../../assets/comment.png";

type QnaPost = {
    id: number;
    wargameTitle: string;
    questionTitle: string;
    questionContent: string;
    answered: boolean;
    answers: number;
    likes: number;
    views: number;
    author: string;
    createdAt: string;
};

const QnaBoardPage = () => {
    const dummyPosts: QnaPost[] = Array.from({ length: 27 }, (_, i) => ({
        id: i + 1,
        wargameTitle: `워게임 ${i + 1}번`,
        questionTitle: `이 문제는 어떻게 접근하나요? ${i + 1}`,
        questionContent:
            "이 문제를 풀다가 막혔는데 조건이 잘 이해가 안 됩니다. 혹시 힌트나 접근 방식 알려주실 수 있나요? 특정 입력에 대한 처리가 의도대로 되지 않아서 분석이 필요한 것 같습니다. 코드도 첨부했습니다.",
        answered: i % 2 === 0,
        answers: Math.floor(Math.random() * 5),
        likes: 10 + i,
        views: 100 * (i + 1),
        author: "익명",
        createdAt: "2024-04-30",
    }));

    const postsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(dummyPosts.length / postsPerPage);
    const currentPosts = dummyPosts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );

    return (
        <div style={{ width: "90%", marginTop: "1.5rem", display: "flex", gap: "3.5rem", padding: "1rem" }}>
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

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1.5rem",
                    }}
                >
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
                        onClick={() => alert("글쓰기 클릭!")}
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
                            onClick={() => alert(`Q&A 상세로 이동 ID: ${post.id}`)}
                            onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.1)")}
                            onMouseOut={(e) => (e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.04)")}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "0.85rem",
                                    marginBottom: "0.4rem",
                                }}
                            >
                                <span style={{ fontWeight: 500, color: "#888" }}>{post.wargameTitle}</span>
                                <span style={{ color: "#666" }}>{post.author} · {post.createdAt}</span>
                            </div>

                            <div style={{ fontSize: "1.15rem", fontWeight: 700, margin: "0.4rem 0 1rem", lineHeight: "1.4" }}>
                                {post.questionTitle}
                            </div>

                            <div style={{ fontSize: "0.9rem", color: "#444", marginBottom: "0.8rem", lineHeight: "1.5" }}>
                                {post.questionContent.length > 150 ? post.questionContent.slice(0, 150) + "..." : post.questionContent}
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
                                        <span>{post.answers} 답변</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                        <img src={likeIcon} alt="like" style={{ width: "16px", height: "16px" }} />
                                        <span>{post.likes} 추천</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                        <img src={viewIcon} alt="view" style={{ width: "18px", height: "18px" }} />
                                        <span>{post.views} 조회</span>
                                    </div>
                                </div>
                                <span
                                    style={{
                                        backgroundColor: post.answered ? "#D3F9D8" : "#FFE3E3",
                                        color: post.answered ? "#2B8A3E" : "#C92A2A",
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        padding: "0.35rem 0.8rem",
                                        borderRadius: "999px",
                                    }}
                                >
                  {post.answered ? "답변 완료" : "미답변"}
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
    );
};

export default QnaBoardPage;
