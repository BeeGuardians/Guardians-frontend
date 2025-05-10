import BoardsTable from "./BoardsTable";
import ReviewsTable from "./ReviewsTable";
import styles from "./PostsPage.module.css";

const PostsPage = () => {
    return (
        <div className={styles.postsContent}>
            <section className={styles.tableSection}>
                <h2 className={styles.sectionTitle}>📄 내가 쓴 게시글</h2>
                <BoardsTable />
            </section>

            <section className={styles.tableSection}>
                <h2 className={styles.sectionTitle}>💬 내가 쓴 리뷰</h2>
                <ReviewsTable />
            </section>
        </div>
    );
};

export default PostsPage;