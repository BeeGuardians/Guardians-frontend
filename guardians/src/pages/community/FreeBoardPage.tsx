import {useEffect, useState} from "react";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const FreeBoardPage = () => {
    const navigate = useNavigate();

    interface Board {
        boardId: number;
        title: string;
        username: string;
        createdAt: string;
        likeCount: number;
        viewCount: number;
        boardType: string;
    }

    const [boards, setBoards] = useState<Board[]>([]);
    const boardsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        axios.get('/api/boards?type=FREE', { withCredentials: true })
            .then(res => {
                const result = res.data.result.data;
                if (Array.isArray(result)) {
                    const sortedBoards = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setBoards(sortedBoards);
                } else {
                    setBoards([]);
                }
            })
            .catch(err => {
                console.error('게시글 목록 불러오기 실패', err);
            });
    }, []);

    const totalPages = Math.ceil(boards.length / boardsPerPage);
    const currentBoards = boards.slice(
        (currentPage - 1) * boardsPerPage,
        currentPage * boardsPerPage
    );

    const handleRowClick = (id: number) => {
        navigate(`/community/free/${id}`);
    };

    const handleWriteClick = () => {
        navigate("/community/free/write");
    };

    return (
        <div style={{ width: "90%", marginTop: "1.5rem", display: "flex", gap: "3.5rem", padding: "1rem" }}>
            <Sidebar />
            <div style={{ flex: 1 }}>
                {/* 🔥 상단 색 섹션 */}
                <div
                    style={{
                        backgroundColor: "#fdf3e7",
                        padding: "1rem",
                        borderRadius: "8px",
                        marginBottom: "1.5rem",
                        border: "1px solid #ddd",
                    }}
                >
                    <h2 style={{ margin: 0, fontWeight: 600 }}>자유 게시판</h2>
                    <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "0.5rem" }}>
                        ✍️ 하고싶은 이야기를 자유롭게 나눠보세요!
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
                        onClick={handleWriteClick}
                    >
                        글쓰기
                    </button>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "5px", overflow: "hidden" }}>
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
                    {currentBoards.map((board) => (
                        <tr
                            key={board.boardId}
                            onClick={() => handleRowClick(board.boardId)}
                            style={{
                                borderTop: "1px solid #eee",
                                cursor: "pointer",
                                transition: "background 0.2s",
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#fcddb6")}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "white")}
                        >
                            <td style={td}>{board.title}</td>
                            <td style={td}>{board.username}</td>
                            <td style={td}>{new Date(board.createdAt).toLocaleDateString()}</td>
                            <td style={td}>{board.likeCount}</td>
                            <td style={td}>{board.viewCount}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>


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
