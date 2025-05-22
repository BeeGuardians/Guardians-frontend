// components/BoardPage.tsx
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Sidebar from "./components/Sidebar.tsx";
import SearchBar from "./components/SearchBar.tsx";
import Modal from "./components/Modal.tsx";

interface BoardPageProps {
    boardType: "FREE" | "INQUIRY" | "STUDY";
    title: string;
    description: string;
    backgroundColor: string;
    writePath: string;
    detailPath: (id: number) => string;
}

interface Board {
    boardId: number;
    title: string;
    username: string;
    createdAt: string;
    likeCount: number;
    viewCount: number;
    boardType: string;
    commentCount: number;
}

const BoardPage = ({
                       boardType,
                       title,
                       description,
                       backgroundColor,
                       writePath,
                       detailPath,
                   }: BoardPageProps) => {
    const navigate = useNavigate();
    const [boards, setBoards] = useState<Board[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const boardsPerPage = 10;

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = (keyword?: string) => {
        let url = `/api/boards?type=${boardType}`;
        if (keyword && keyword.trim().length >= 2) {
            url += `&keyword=${encodeURIComponent(keyword)}`;
        } else if (keyword && keyword.trim().length < 2) {
            setModalMessage("검색어는 2자 이상 입력해주세요.");
            setModalOpen(true);
            return;
        }

        axios.get(url, {withCredentials: true})
            .then(res => {
                const result = res.data.result.data;
                if (Array.isArray(result)) {
                    const sorted = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setBoards(sorted);
                    setCurrentPage(1);
                } else {
                    setBoards([]);
                }
            })
            .catch(err => console.error("게시글 목록 불러오기 실패", err));
    };

    const totalPages = Math.ceil(boards.length / boardsPerPage);
    const currentBoards = boards.slice(
        (currentPage - 1) * boardsPerPage,
        currentPage * boardsPerPage
    );

    const th = {
        padding: "0.75rem",
        fontWeight: 600,
        fontSize: "0.9rem",
        borderBottom: "2px solid #ddd",
    };

    const td = {
        alignItems: "center",
        padding: "0.75rem",
        fontSize: "0.9rem",
        textAlign: "center",
    };

    return (
        <>
            <div style={{display: "flex", justifyContent: "center", padding: "2rem", boxSizing: "border-box"}}>
                <div style={{display: "flex", gap: "3.5rem", maxWidth: "1200px", width: "100%"}}>
                    <Sidebar/>
                    <div style={{flex: 1}}>
                        <div style={{
                            backgroundColor,
                            padding: "1rem",
                            borderRadius: "8px",
                            marginBottom: "1.5rem",
                            border: "1px solid #ddd",
                        }}>
                            <h2 style={{margin: 0, fontWeight: 600}}>{title}</h2>
                            <p style={{fontSize: "0.9rem", color: "#555", marginTop: "0.5rem"}}>{description}</p>
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "1.5rem"
                        }}>
                            <SearchBar onSearch={fetchBoards}/>
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
                                onClick={() => navigate(writePath)}
                            >
                                글쓰기
                            </button>
                        </div>

                        <table style={{
                            width: "100%",
                            tableLayout: "fixed",
                            borderCollapse: "collapse",
                            backgroundColor: "#fff",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                            overflow: "hidden"
                        }}>
                            <thead>
                            <tr style={{backgroundColor: "#f9f9f9", textAlign: "center"}}>
                                <th style={{...th, width: "40%", textAlign: "left"}}>제목</th>
                                <th style={{...th, width: "15%"}}>작성자</th>
                                <th style={{...th, width: "15%"}}>작성일</th>
                                <th style={{...th, width: "15%"}}>추천수</th>
                                <th style={{...th, width: "15%"}}>조회수</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentBoards.map((board) => (
                                <tr
                                    key={board.boardId}
                                    onClick={() => navigate(detailPath(board.boardId))}
                                    style={{
                                        borderTop: "1px solid #eee",
                                        cursor: "pointer",
                                        transition: "background 0.2s",
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#fcddb6")}
                                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "white")}
                                >
                                    <td style={td}>
                                        <div
                                            style={{
                                                display: "flex",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                    minWidth: 0,
                                                    flexShrink: 1,
                                                }}
                                                title={board.title}
                                            >
                                                {board.title}
                                            </div>
                                            <div
                                                style={{
                                                    marginLeft: "0.5rem",
                                                    flexShrink: 0,
                                                    whiteSpace: "nowrap",
                                                    color: "#888",
                                                    fontSize: "0.85rem",
                                                }}
                                            >
                                                [{board.commentCount}]
                                            </div>
                                        </div>
                                    </td>
                                    <td style={td}>{board.username}</td>
                                    <td style={td}>{new Date(board.createdAt).toLocaleDateString()}</td>
                                    <td style={td}>{board.likeCount}</td>
                                    <td style={td}>{board.viewCount}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div style={{marginTop: "1.5rem", textAlign: "center"}}>
                            {Array.from({length: totalPages}, (_, i) => (
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

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={() => setModalOpen(false)}
                confirmText="확인"
                message={modalMessage}
                showCancelButton={false}
            />
        </>
    );
};

export default BoardPage;
