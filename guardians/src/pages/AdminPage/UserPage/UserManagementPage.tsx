import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../AdminSidebar";

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    lastLoginAt: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const ITEMS_PER_PAGE = 5;

const UserManagementPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [adminPage, setAdminPage] = useState(1);
    const [userPage, setUserPage] = useState(1);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/users/admin/list`, {
                withCredentials: true,
            });
            setUsers(res.data.result.data);
        } catch (err) {
            console.error("회원 목록 불러오기 실패:", err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await axios.delete(`${API_BASE}/api/users/admin/delete/${id}`, {
                withCredentials: true,
            });
            setUsers(prev => prev.filter(user => user.id !== id));
            alert("삭제 완료되었습니다.");
        } catch (err) {
            console.error("회원 삭제 실패:", err);
            alert("삭제에 실패했습니다.");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const formatDateTime = (raw: string) => {
        if (!raw || raw.length !== 14) return "-";
        return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)} ${raw.slice(8, 10)}:${raw.slice(10, 12)}`;
    };

    const adminList = users.filter(u => u.role === "ADMIN");
    const userList = users.filter(u => u.role === "USER");

    const adminTotalPages = Math.ceil(adminList.length / ITEMS_PER_PAGE);
    const userTotalPages = Math.ceil(userList.length / ITEMS_PER_PAGE);

    const adminCurrent = adminList.slice((adminPage - 1) * ITEMS_PER_PAGE, adminPage * ITEMS_PER_PAGE);
    const userCurrent = userList.slice((userPage - 1) * ITEMS_PER_PAGE, userPage * ITEMS_PER_PAGE);

    return (
        <div style={{ paddingTop: "120px", paddingLeft: "2rem", paddingRight: "2rem" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", gap: "2rem", alignItems: "flex-start" }}>
                <AdminSidebar />

                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>👤 회원 관리</h2>

                    <h3 style={{ marginBottom: "0.5rem", fontWeight: 400 }}>• 관리자 ({adminList.length}명)</h3>
                    <UserTable users={adminCurrent} handleDelete={handleDelete} formatDateTime={formatDateTime} />
                    <Pagination page={adminPage} setPage={setAdminPage} totalPages={adminTotalPages} />

                    <h3 style={{ marginTop: "2rem", marginBottom: "0.5rem", fontWeight: 400 }}>• 일반 사용자 ({userList.length}명)</h3>
                    <UserTable users={userCurrent} handleDelete={handleDelete} formatDateTime={formatDateTime} />
                    <Pagination page={userPage} setPage={setUserPage} totalPages={userTotalPages} />
                </div>
            </div>
        </div>
    );
};

const UserTable = ({
                       users,
                       handleDelete,
                       formatDateTime,
                   }: {
    users: User[];
    handleDelete: (id: number) => void;
    formatDateTime: (raw: string) => string;
}) => (
    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", marginBottom: "1rem" }}>
        <colgroup>
            <col style={{ width: "5%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "20%" }} />
        </colgroup>
        <thead>
        <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>이름</th>
            <th style={thStyle}>이메일</th>
            <th style={thStyle}>마지막 로그인</th>
            <th style={thStyle}>관리</th>
        </tr>
        </thead>
        <tbody>
        {users.map((user, idx) => (
            <tr key={user.id}>
                <td style={tdStyle}>{idx + 1}</td>
                <td style={tdStyle}>{user.username}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{formatDateTime(user.lastLoginAt)}</td>
                <td style={tdStyle}>
                    <button
                        onClick={() => handleDelete(user.id)}
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
);

const Pagination = ({
                        page,
                        setPage,
                        totalPages,
                    }: {
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
}) => (
    <div style={{ marginBottom: "2rem", textAlign: "center", minHeight: "2.5rem" }}>
        {Array.from({ length: totalPages }, (_, i) => (
            <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                    margin: "0 0.25rem",
                    padding: "0.4rem 0.75rem",
                    backgroundColor: page === i + 1 ? "#ffa94d" : "#f5f5f5",
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
);

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

export default UserManagementPage;