import {Link} from "react-router-dom";
import viewIcon from "../../../assets/view.png"; // 경로는 너 구조에 맞게 조정

type Post = {
    id: number;
    title: string;
    views: number;
};

type Props = {
    title: string;
    description: string;
    posts: Post[];
    color?: string;
    link: string;
};

const BoardSection = ({ title, description, posts, color = "#f5f5f5", link }: Props) => {
    return (
        <div
            style={{
                maxWidth: "100%",
                width: "96%",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #ddd",
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            {/* ✅ 상단: 색 배경 영역 */}
            <div style={{ backgroundColor: color, padding: "1rem" }}>
                <h3 style={{ margin: 0 }}>{title}</h3>
                <p style={{ fontSize: "0.85rem", color: "#555", marginTop: "0.25rem" }}>{description}</p>
            </div>

            {/* ✅ 하단: 게시글 테이블 영역 */}
            <div style={{ padding: "1rem", flexGrow: 1 }}>
                <table style={{ width: "100%", fontSize: "0.9rem" }}>
                    <tbody>
                    {posts.map((post) => (
                        <tr key={post.id}>
                            <td style={{ padding: "0.4rem 0" }}>
                                <Link
                                    to={`${link}/${post.id}`}
                                    style={{
                                        color: "#333",
                                        textDecoration: "none",
                                        transition: "color 0.2s",
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.color = "#646cff")}
                                    onMouseOut={(e) => (e.currentTarget.style.color = "#333")}
                                >
                                    {post.title}
                                </Link>

                            </td>
                            <td style={{ padding: "0.4rem 0", textAlign: "right", color: "#aaa", width: "80px" }}>
                                <img
                                    src={viewIcon}
                                    alt="view"
                                    style={{ width: "14px", height: "14px", verticalAlign: "middle", marginRight: "4px" }}
                                />
                                <span> {post.views}</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* 더보기 */}
            <div style={{ padding: "0.5rem 1rem", textAlign: "right", borderTop: "1px solid #eee" }}>
                <Link to={link} style={{ fontSize: "0.8rem", color: "#007bff" }}>
                    더보기 →
                </Link>
            </div>
        </div>
    );
};

export default BoardSection;
