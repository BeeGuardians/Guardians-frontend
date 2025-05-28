import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../AdminSidebar"; // 경로 주의

interface Wargame {
    id: number;
    title: string;
    categoryName: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const AdminWargameListPage = () => {
    const [wargames, setWargames] = useState<Wargame[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchWargames = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/wargames`, {
                withCredentials: true,
            });
            setWargames(res.data.result.data);
        } catch (err) {
            console.error("워게임 목록 불러오기 실패:", err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await axios.delete(`${API_BASE}/api/wargames/admin/${id}`, {
                withCredentials: true,
            });
            setWargames(prev => prev.filter(w => w.id !== id));
            alert("삭제 완료되었습니다.");
        } catch (err) {
            console.error("워게임 삭제 실패:", err);
            alert("삭제에 실패했습니다.");
        }
    };

    useEffect(() => {
        fetchWargames();
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = wargames.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(wargames.length / itemsPerPage);

    return (
        <div style={{ paddingTop: "120px", paddingLeft: "2rem", paddingRight: "2rem" }}>
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                display: "flex",
                gap: "2rem",
                alignItems: "flex-start"
            }}>
                <AdminSidebar />

                <div style={{ flex: 1 }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem"
                    }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>🔐 워게임 관리</h2>
                        <button
                            style={{
                                padding: "0.5rem 1rem",
                                backgroundColor: "#ffa94d",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                color: "#fff",
                                fontWeight: 600,
                            }}
                            onClick={() => alert("등록 페이지로 이동 (추후 구현)")}
                        >
                            + 워게임 생성
                        </button>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                        <colgroup>
                            <col style={{ width: "8%" }} />
                            <col style={{ width: "22%" }} />
                            <col style={{ width: "50%" }} />
                            <col style={{ width: "20%" }} />
                        </colgroup>
                        <thead>
                        <tr style={{ backgroundColor: "#f0f0f0" }}>
                            <th style={thStyle}>#</th>
                            <th style={thStyle}>카테고리</th>
                            <th style={thStyle}>워게임명</th>
                            <th style={thStyle}>관리</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.map((w, idx) => (
                            <tr key={w.id}>
                                <td style={tdStyle}>{startIndex + idx + 1}</td>
                                <td style={tdStyle}>{w.categoryName}</td>
                                <td style={tdStyle}>{w.title}</td>
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => handleDelete(w.id)}
                                        style={{
                                            backgroundColor: "#ff6b6b",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "4px",
                                            padding: "0.3rem 0.6rem",
                                            cursor: "pointer",
                                        }}
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                style={{
                                    margin: "0 0.25rem",
                                    padding: "0.4rem 0.75rem",
                                    backgroundColor: currentPage === i + 1 ? "#ffa94d" : "#f5f5f5",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontWeight: 600,
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

const thStyle = {
    padding: "0.75rem",
    textAlign: "left" as const,
    fontWeight: "bold",
    borderBottom: "1px solid #ccc",
    whiteSpace: "nowrap",
};

const tdStyle = {
    padding: "0.75rem",
    textAlign: "left" as const,
    borderBottom: "1px solid #eee",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
};

export default AdminWargameListPage;
