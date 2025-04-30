import { useState } from "react";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";


const FreeBoardPage = () => {
    const dummyPosts = Array.from({ length: 47 }, (_, i) => ({
        id: i + 1,
        title: `자유글 제목입니다 ${i + 1}`,
        views: 50 * (i + 1),
        likes: 5 + (i % 10), // ❤️ 좋아요 수 추가
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

    const handleRowClick = (id: number) => {
        console.log(`클릭된 게시글 ID: ${id}`);
    };

    return (
        <div style={{ width: "90%", marginTop: "1.5rem", display: "flex", gap: "3.5rem", padding: "1rem" }}>
            <Sidebar />
            <div style={{ flex: 1}}>
                {/* 🔥 상단 색 섹션 */}
                <div
                    style={{
                        backgroundColor: "#fdeaf4",
                        padding: "1rem",
                        borderRadius: "8px",
                        marginBottom: "1.5rem",
                        border: "1px solid #ddd",
                    }}
                >
                    <h2 style={{ margin: 0, fontWeight: 600 }}>스터디 모집</h2>
                    <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "0.5rem" }}>
                        📚 함께 스터디를 할 팀원들을 구해보세요!
                    </p>
                </div>
                {/* 🔍 검색창 + 글쓰기 버튼 한 줄에 정렬 */}
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
                            width: "10%"
                        }}
                        onClick={() => alert("글쓰기 클릭!")}
                    >
                        글쓰기
                    </button>
                </div>


                {/* 📋 게시글 테이블 */}
                <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", border: "1px solid #ddd",  borderRadius: "5px", overflow: "hidden"}}>
                    <thead>
                    <tr style={{ backgroundColor: "#f9f9f9", textAlign: "left" }}>
                        <th style={{ ...th, width: "40%" }}>제목</th>
                        <th style={{ ...th, width: "15%" }}>작성자</th>
                        <th style={{ ...th, width: "15%" }}>작성일</th>
                        <th style={{ ...th, width: "15%" }}>추천수</th>
                        <th style={{ ...th, width: "15%" }}>조회수</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentPosts.map((post) => (
                        <tr
                            key={post.id}
                            onClick={() => handleRowClick(post.id)}
                            style={{
                                borderTop: "1px solid #eee",
                                cursor: "pointer",
                                transition: "background 0.2s",
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#fcddb6")}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "white")}
                        >
                            <td style={td}>{post.title}</td>
                            <td style={td}>{post.author}</td>
                            <td style={td}>{post.createdAt}</td>
                            <td style={td}>{post.likes}</td>
                            <td style={td}>{post.views}</td>
                        </tr>
                    ))}
                    </tbody>

                </table>

                {/* ⏩ 페이징 */}
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

const th = {
    padding: "0.75rem",
    fontWeight: 600,
    fontSize: "0.9rem",
    borderBottom: "2px solid #ddd",
};

const td = {
    padding: "0.75rem",
    fontSize: "0.9rem",
};

export default FreeBoardPage;
