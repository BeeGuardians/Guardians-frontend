import {Link, useLocation} from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: "/community", label: "🗂️ 전체 게시판" },
        { path: "/community/hot", label: "🔥 핫 게시판" },
        { path: "/community/qna", label: "❓ 워게임 Q&A" },
        { path: "/community/free", label: "💬 자유 게시판" },
        { path: "/community/study", label: "📚 스터디 모집" },
        { path: "/community/inquiry", label: "📨 문의 게시판" },
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
            <h3 style={{ fontSize: "1.1rem", marginLeft: "0.5rem",marginBottom: "1.7rem", fontWeight: 700, color: "#444" }}>
                커뮤니티
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path ||
                        (item.path === "/community" && location.pathname.startsWith("/community") && menuItems.slice(1).every(subItem => !location.pathname.startsWith(subItem.path))); // "전체 게시판" 활성화 로직 개선

                    // "전체 게시판"의 경우, 다른 특정 하위 경로가 아닐 때 활성화되도록 조정
                    let itemIsActive = isActive;
                    if (item.path === "/community") {
                        // 현재 경로가 /community 이거나, /community로 시작하면서 다른 특정 메뉴 경로가 아닌 경우
                        const isExactlyCommunity = location.pathname === "/community";
                        const isCommunitySubPathNotMatchingOthers = location.pathname.startsWith("/community") &&
                            !menuItems.some(mi => mi.path !== "/community" && location.pathname.startsWith(mi.path));
                        itemIsActive = isExactlyCommunity || isCommunitySubPathNotMatchingOthers;
                    } else {
                        itemIsActive = location.pathname.startsWith(item.path);
                    }


                    return (
                        <li key={item.path} style={{ marginBottom: "1rem" }}>
                            <Link
                                to={item.path}
                                style={{
                                    display: "block",
                                    padding: "0.5rem 0.75rem",
                                    borderRadius: "6px",
                                    textDecoration: "none",
                                    fontWeight: itemIsActive ? 700 : 500,
                                    color: itemIsActive ? "#fff" : "#333",
                                    backgroundColor: itemIsActive ? "#FFA94D" : "transparent",
                                    transition: "all 0.2s ease-in-out",
                                }}
                                onMouseOver={(e) => {
                                    if (!itemIsActive) {
                                        e.currentTarget.style.backgroundColor = "#f5f5f5";
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!itemIsActive) {
                                        e.currentTarget.style.backgroundColor = "transparent";
                                    }
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

export default Sidebar;