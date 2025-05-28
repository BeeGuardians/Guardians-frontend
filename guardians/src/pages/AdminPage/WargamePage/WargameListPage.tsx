// src/pages/AdminPage/WargamePage/WargameListPage.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../AdminSidebar";
import ConfirmModal from "../Components/ConfirmModal";
import InfoModal from "../Components/InfoModal";

interface Wargame {
    id: number;
    title: string;
    categoryName: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const WargameListPage = () => { // 컴포넌트 이름 WargameListPage로 변경
    const navigate = useNavigate();
    const [wargames, setWargames] = useState<Wargame[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // 모달 관련 상태
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmActionId, setConfirmActionId] = useState<number | null>(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoMessage, setInfoMessage] = useState("");

    const fetchWargames = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/wargames`, {
                withCredentials: true,
            });
            setWargames(res.data.result.data);
        } catch (err) {
            console.error("워게임 목록 불러오기 실패:", err);
            setInfoMessage("워게임 목록을 불러오는데 실패했습니다.");
            setShowInfoModal(true);
        }
    };

    // 삭제 확인 모달 열기
    const confirmDelete = (id: number) => {
        setConfirmActionId(id);
        setShowConfirmModal(true);
    };

    // 실제 삭제 로직
    const handleDelete = async () => {
        if (confirmActionId === null) return;

        try {
            await axios.delete(`${API_BASE}/api/wargames/admin/${confirmActionId}`, {
                withCredentials: true,
            });
            setWargames(prev => prev.filter(w => w.id !== confirmActionId));
            setInfoMessage("삭제 완료되었습니다.");
            setShowInfoModal(true);
        } catch (err) {
            console.error("워게임 삭제 실패:", err);
            setInfoMessage("삭제에 실패했습니다.");
            setShowInfoModal(true);
        } finally {
            setShowConfirmModal(false);
            setConfirmActionId(null);
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
                            onClick={() => navigate("/admin/wargames/create")}
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
                                        onClick={() => confirmDelete(w.id)}
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

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleDelete}
                message="정말 이 워게임을 삭제하시겠습니까?"
            />

            <InfoModal
                isOpen={showInfoModal}
                onClose={() => setShowInfoModal(false)}
                message={infoMessage}
            />
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

export default WargameListPage; // 컴포넌트 이름 WargameListPage로 export