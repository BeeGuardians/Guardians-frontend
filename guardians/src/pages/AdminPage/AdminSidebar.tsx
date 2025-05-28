// src/pages/AdminPage/AdminSidebar.tsx

import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: "/admin/wargames", label: "워게임 관리" },
        { path: "/admin/jobs", label: "커리어 관리" },
        { path: "/admin/users", label: "회원 관리" },
    ];

    return (
        <aside
            style={{
                width: "180px",
                padding: "0.5rem 1rem",
                borderRight: "1px solid #ddd",
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0 0 4px rgba(0,0,0,0.06)",
                height: "fit-content",
            }}
        >
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1.5rem", fontWeight: 700, color: "#444" }}>
                🛠️ 관리자 메뉴
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <li key={item.path} style={{ marginBottom: "1rem" }}>
                            <Link
                                to={item.path}
                                style={{
                                    display: "block",
                                    padding: "0.5rem 0.75rem",
                                    borderRadius: "6px",
                                    textDecoration: "none",
                                    fontWeight: isActive ? 700 : 500,
                                    color: isActive ? "#fff" : "#333",
                                    backgroundColor: isActive ? "#FFA94D" : "transparent",
                                    transition: "all 0.2s ease-in-out",
                                }}
                            >
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
};

export default AdminSidebar;