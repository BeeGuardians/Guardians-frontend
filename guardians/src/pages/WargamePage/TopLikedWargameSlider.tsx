import React, { useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";

interface Challenge {
    id: number;
    title: string;
    categoryName: string;
    difficulty: string;
    likeCount: number;
}

interface Props {
    challenges: Challenge[];
}

const TopLikedWargameSlider: React.FC<Props> = ({ challenges }) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const scrollBy = (offset: number) => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: offset, behavior: "smooth" });
        }
    };

    const handlers = useSwipeable({
        onSwipedLeft: () => scrollBy(300),
        onSwipedRight: () => scrollBy(-300),
        trackMouse: true,
    });

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                margin: "1rem 0"
            }}
        >
            <div style={{ width: "100%", maxWidth: "50rem" }}>
                <h4
                    style={{
                        marginTop: "1rem",
                        marginBottom: "1rem",
                        fontSize: "1.2rem",
                        color: "#444",
                        paddingLeft: "0.5rem"
                    }}
                >
                    ❤️ 인기 워게임
                </h4>

                <div
                    style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {/* 왼쪽 화살표 버튼 */}
                    <button
                        onClick={() => scrollBy(-300)}
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            color: "#666",
                            zIndex: 10,
                            width: "1.8rem",
                            height: "1.8rem",
                            lineHeight: "1.4rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0,
                            marginRight: "0.5rem",
                        }}
                    >
                        ◀
                    </button>

                    {/* 슬라이드 카드 */}
                    <div
                        {...handlers}
                        ref={sliderRef}
                        style={{
                            overflowX: "auto",
                            display: "flex",
                            gap: "1rem",
                            scrollSnapType: "x mandatory",
                            scrollBehavior: "smooth",
                            padding: "0.5rem 0",
                        }}
                    >
                        <div style={{ minWidth: "1rem", flexShrink: 0 }} />

                        {challenges.map((w) => (
                            <div
                                key={w.id}
                                onClick={() => navigate(`/wargame/${w.id}`)}
                                style={{
                                    minWidth: "250px",
                                    flexShrink: 0,
                                    backgroundColor: "#fff",
                                    border: "1px solid #eee",
                                    borderRadius: "12px",
                                    padding: "1rem",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                    scrollSnapAlign: "start",
                                    cursor: "pointer",
                                    transition: "transform 0.2s",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                            >
                                <div style={{ fontWeight: 600 }}>{w.title}</div>
                                <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
                                    {w.categoryName} | {w.difficulty}
                                </div>
                                <div style={{ fontSize: "0.85rem", color: "#ff6b6b", marginTop: "0.5rem" }}>
                                    ❤️ {w.likeCount}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 오른쪽 화살표 버튼 */}
                    <button
                        onClick={() => scrollBy(300)}
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            color: "#666",
                            zIndex: 10,
                            width: "1.8rem",
                            height: "1.8rem",
                            lineHeight: "1.4rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0,
                            marginLeft: "0.5rem",
                        }}
                    >
                        ▶
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopLikedWargameSlider;
