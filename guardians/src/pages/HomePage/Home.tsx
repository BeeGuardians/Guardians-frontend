function Home() {
    return (
        <div style={{ padding: "0", margin: "0", maxWidth: "100vw"}}>
            {/* 배경색이 전체 너비로 적용되는 상단 Hero 영역 */}
            <div
                style={{
                    backgroundColor: "#f9c37b",
                    paddingTop: "8rem",
                    paddingBottom: "13rem",
                    marginTop: "-6rem",
                    color: "#000",
                    width: "100%",
                    height: "30vh",
                }}
            >
                {/* 상단 제목 영역 */}
                <h1
                    style={{
                        color: "white",
                        fontSize: "4.5rem",
                        fontWeight: "bold",
                        marginTop: "6rem",
                        marginBottom: "1rem",
                        marginLeft: "5rem",
                    }}
                >
                    모의해킹플랫폼 <br />
                    <span style={{ fontWeight: "400" }}>
                        Guardians를 소개합니다.
                    </span>
                </h1>

                {/* 설명 문구 영역 */}
                <p
                    style={{
                        fontSize: "2rem",
                        color: "#555",
                        marginTop: "2rem",
                        marginLeft: "5rem",
                    }}
                >
                    배우고, 도전하고, 성장하세요. <br />
                    <span
                        style={{
                            color: "#9c5e25",
                            fontWeight: 600,
                        }}
                    >
                        당신의 실력을 수호하는 공간, Guardians.
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Home;
