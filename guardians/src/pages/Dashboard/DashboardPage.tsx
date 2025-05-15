const DashboardPage = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", padding: "2rem 1rem" }}>
            <div style={{ maxWidth: "1200px", width: "100%" }}>
                <h3
                    style={{
                        marginTop: 0,
                        marginBottom: "1rem",
                        fontWeight: 400,
                        fontSize: "1rem",
                        color: "#666",
                    }}
                >
                    <p>
                        <img
                            src="/src/assets/graph.png"
                            style={{
                                width: "1.2em",
                                height: "1.2em",
                                verticalAlign: "text-bottom",
                                marginRight: "0.3em",
                            }}
                        />
                        내 성장과 성과를 한 눈에 확인해보세요!
                    </p>
                </h3>

                <div
                    style={{
                        backgroundColor: "#fffbe6",
                        border: "1px solid #ffe58f",
                        borderRadius: "0.75rem",
                        padding: "1.5rem",
                        marginBottom: "3vh",
                        color: "#664d03",
                        fontSize: "0.95rem",
                        lineHeight: "1.5rem",
                    }}
                >
                    대시보드는 사용자 활동을 기반으로 배지와 역할을 시각화하는 공간입니다. <br />
                    <p>
                        획득한 보상과 활동 데이터를 바탕으로, 학습 현황을 종합적으로 파악해보세요!
                        <img
                            src="/src/assets/dashboard.png"
                            style={{
                                width: "1.1em",
                                height: "1.1em",
                                verticalAlign: "text-bottom",
                                marginLeft: "0.3em",
                            }}
                        />
                    </p>
                </div>

                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "0.75rem",
                        padding: "2rem",
                        marginBottom: "4vh",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "2rem",
                        fontSize: "1rem",
                        lineHeight: 1.6,
                        backgroundColor: "#fff",
                    }}
                >
                    <div>• 내가 푼 문제 수 : 50</div>
                    <div>• 북마크한 문제 수 : 20</div>
                    <div>• 내 점수 : 320</div>
                    <div>• 내 랭킹 : 17위</div>
                </div>

                <div style={{ marginBottom: "5vh" }}>
                    <h4 style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>내 뱃지</h4>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(8, 1fr)",
                            gap: "1.5rem",
                        }}
                    >
                        {[
                            "#ff7a59", "#fcb24b", "#f9e076", "#b6d96b",
                            "#a9dbf5", "#a18bd0", "#d3d3d3", "#d3d3d3",
                            "#d3d3d3", "#d3d3d3", "#d3d3d3", "#d3d3d3"
                        ].map((color, idx) => (
                            <div
                                key={idx}
                                style={{
                                    width: "100%",
                                    aspectRatio: "1",
                                    borderRadius: "50%",
                                    backgroundColor: color,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* ✅ 차트 섹션 */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "2rem",
                        justifyContent: "space-between",
                        marginBottom: "5vh",
                    }}
                >
                    {/* 🧠 종합 역량 진단표 */}
                    <div style={{ flex: 1, minWidth: "300px" }}>
                        <h4 style={{
                            textAlign: "center",
                            fontSize: "1.1rem",
                            marginBottom: "1.5rem",
                        }}>
                            &lt; 종합 역량 진단표 &gt;
                        </h4>
                        <div
                            style={{
                                height: "40vh",
                                backgroundColor: "#fafafa",
                                border: "1px dashed #ccc",
                                borderRadius: "0.75rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#999",
                                fontSize: "1rem",
                            }}
                        >
                            [레이더 차트 영역]
                        </div>
                    </div>

                    {/* 📈 주차별 문제 풀이 추이 */}
                    <div style={{ flex: 1, minWidth: "300px" }}>
                        <h4 style={{
                            textAlign: "center",
                            fontSize: "1.1rem",
                            marginBottom: "1.5rem",
                        }}>
                            &lt; 5월에 푼 문제 수 &gt;
                        </h4>
                        <div
                            style={{
                                height: "40vh",
                                backgroundColor: "#fafafa",
                                border: "1px dashed #ccc",
                                borderRadius: "0.75rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#999",
                                fontSize: "1rem",
                            }}
                        >
                            [라인 그래프 영역]
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
