import styles from "./Footer.module.css";

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.sectionWrapper}>
                <div className={styles.section}>
                    <h4>전체</h4>
                    <a href="/community/inquiry" className={styles.link}>문의 게시판</a>
                    <a href="/terms" className={styles.link}>이용약관</a>
                    <a href="/privacy" className={styles.link}>개인정보 처리방침</a>
                </div>
                <div className={styles.section}>
                    <h4>학습</h4>
                    <a href="/dashboard" className={styles.link}>내 대시보드</a>
                    <a href="/mypage" className={styles.link}>나의 기록</a>
                </div>
                <div className={styles.section}>
                    <h4>워게임</h4>
                    <a href="/wargame" className={styles.link}>전체 문제</a>
                    <a href="/community/qna" className={styles.link}>문제 Q&A</a>
                </div>
                <div className={styles.section}>
                    <h4>커뮤니티</h4>
                    <a href="/community/free" className={styles.link}>자유게시판</a>
                    <a href="/community/study" className={styles.link}>스터디모집</a>
                    <a href="/community/inquiry" className={styles.link}>문의 게시판</a>
                </div>
                <div className={styles.section}>
                    <h4>랭킹</h4>
                    <a href="/ranking" className={styles.link}>전체 랭킹</a>
                </div>
            </div>

            <div className={styles.bottom}>
                <p>Copyright © 2025 Guardians. All rights reserved.</p>
                <p>문의: honeyguardians@gmail.com</p>
            </div>
        </footer>
    );
}

export default Footer;
