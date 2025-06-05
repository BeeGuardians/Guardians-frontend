import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HotBoardPage.module.css';
import axios from 'axios';
import Sidebar from './components/Sidebar';

type Post = {
    id: number;
    title: string;
    boardType: string;
    likeCount: number;
    viewCount: number;
    score: number;
};

type ApiResponse = {
    result: {
        status: number;
        data: Post[];
        message: string;
    };
};

const HotBoardPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const pageTitle = "핫 게시판";
    const pageDescription = "지금 가장 뜨거운 게시글들을 만나보세요!";
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchHotPosts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get<ApiResponse>(`${API_BASE}/api/boards/hot`);
                if (response.data && response.data.result && response.data.result.data) {
                    setPosts(response.data.result.data);
                } else {
                    setError("게시글 데이터를 받아오는 데 실패했습니다.");
                    setPosts([]);
                }
            } catch (err) {
                setError("게시글을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
                setPosts([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHotPosts();
    }, [API_BASE]);

    const getBoardPathSegment = (boardType: string): string => {
        switch (boardType?.toUpperCase()) {
            case 'FREE': return 'free';
            case 'QNA': return 'qna';
            case 'STUDY': return 'study';
            case 'INQUIRY': return 'inquiry';
            default: return 'post';
        }
    };

    const getPostLink = (post: Post): string => {
        const pathSegment = getBoardPathSegment(post.boardType);
        return `/community/${pathSegment}/${post.id}`;
    };

    const renderPostsList = () => {
        if (posts.length === 0) {
            return <p className={styles.noPosts}>현재 인기 게시글이 없습니다.</p>;
        }
        return (
            <div className={styles.postsList}>
                {posts.map((post, index) => (
                    <Link to={getPostLink(post)} key={post.id} className={styles.postListItemLink}>
                        <article className={styles.postListItem}>
                            <div className={styles.rank}>{index + 1}</div>
                            <div className={styles.postDetails}>
                                <div className={styles.titleAndBoardType}>
                                    <h2 className={styles.postTitle} title={post.title}>{post.title}</h2>
                                    <span className={`${styles.boardTypeBadge} ${styles[post.boardType?.toLowerCase() || 'default']}`}>
                                        {post.boardType}
                                    </span>
                                </div>
                                <div className={styles.postMetaContainer}>
                                    <span className={styles.postMetaItem}>조회 {post.viewCount.toLocaleString()}</span>
                                    <span className={styles.postMetaItem}>좋아요 {post.likeCount.toLocaleString()}</span>
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <div className={styles.pageOuterWrapper}>
            <div className={styles.sidebarAndContentContainer}>
                <Sidebar />
                <main className={styles.mainContentArea}>
                    <div className={styles.contentHeaderBlock}>
                        <h1 className={styles.pageTitle}>{pageTitle}</h1>
                        <p className={styles.description}>{pageDescription}</p>
                    </div>
                    {isLoading && <p className={styles.loadingMessage}>로딩 중...</p>}
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    {!isLoading && !error && renderPostsList()}
                </main>
            </div>
        </div>
    );
};

export default HotBoardPage;
