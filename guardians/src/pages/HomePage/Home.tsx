import {motion} from "framer-motion";
import HomeIntroSection from "./HomeIntroSection";

function Home() {
    return (
        <div style={{padding: "0", margin: "0", maxWidth: "100vw"}}>
            {/* 배경색 고정 */}
            <div
                style={{
                    background: "linear-gradient(to bottom, #FFC07A 0%, #FFF7E8 100%)",
                    paddingTop: "8rem",
                    paddingBottom: "5rem",
                    marginTop: "-6rem",
                    color: "#000",
                    width: "100%",
                    overflow: "hidden",
                }}
            >
            {/* 상단 제목 애니메이션 */}
                <motion.h1
                    initial={{opacity: 0, y: -40}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 1.2}}
                    style={{
                        color: "#343A40",
                        fontSize: "3.5rem",
                        fontWeight: "500",
                        marginTop: "6rem",
                        marginBottom: "1rem",
                        marginLeft: "5rem",
                    }}
                >
                    모의해킹 플랫폼 <br/>
                    <span style={{ fontWeight: "700", color: "#FF922B" }}>
                        가디언즈
                    </span>를 소개합니다.
                </motion.h1>

                {/* 설명 문구에 반복 애니메이션 */}
                <motion.p
                    initial={{opacity: 1, y: 20}}
                    animate={{
                        opacity: 1,
                        y: [0, 5, 0], // 위아래 반복
                    }}
                    transition={{
                        duration: 2,
                        delay: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                    }}
                    style={{
                        fontSize: "1.5rem",
                        color: "#555",
                        marginTop: "2rem",
                        marginLeft: "5rem",
                    }}
                >
                    배우고, 도전하고, 성장하세요. <br/>
                    <span
                        style={{
                            fontSize: "1.5rem",
                            color: "#555",
                            fontWeight: 600,
                        }}
                    >
                        당신의 실력을 수호하는 공간, 가디언즈.
                    </span>
                </motion.p>
            </div>

                <HomeIntroSection />

        </div>
    );
}

export default Home;
