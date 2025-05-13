import {useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import axios from "axios";


interface Board {
        boardId: number;
        title: string;
        content: string;
        username: string;
        createdAt: string;
        likeCount: number;
        viewCount: number;
        liked: boolean;
    }

interface Comment {
    commentId: number;
    content: string;
    username: string;
    createdAt: string;
}

const StudyBoardDetailPage = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [board, setBoard] = useState<Board | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    useEffect(() => {
        if (!id) return;

        axios.get(`/api/boards/${id}`, {withCredentials: true })
            .then(res => setBoard(res.data.result.data))
            .catch(err => {
                console.error('게시글 상세 불러오기 실패',err);
            });


        axios.get(`/api/boards/${id}/comments`, {withCredentials: true })
            .then(res => setComments(res.data.result.data))
            .catch(err => console.error('댓글 불러오기 실패', err));

        axios.get('/api/auth/check', { withCredentials: true })
            .then(res => setIsLoggedIn(res.data.loggedIn))
            .catch(() => setIsLoggedIn(false));

        axios.get(`/api/boards/${id}/like`, { withCredentials: true })
            .then(res => setIsLiked(res.data))
            .catch(() => setIsLiked(false));
    }, [id]);


    const toggleLike = () => {
        axios.post(`/api/boards/${id}/like`, {}, { withCredentials: true })
            .then(() => {
                setBoard(prev => prev ? { ...prev, liked: !prev.liked, likeCount: prev.liked ? prev.likeCount - 1 : prev.likeCount + 1 } : prev);
            })
            .catch(err => {
                console.error('좋아요 실패', err);
                alert('좋아요 처리 중 문제가 발생했습니다.');
            });
    };


    if (!board) {
        return <div style={{ padding: '3rem', textAlign: 'center' }}>로딩 중...</div>;
    }


    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'start',
                minHeight: '10vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <div
                style={{
                    width: '60%',
                    padding: '3.5rem',
                    background: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                }}
            >
                <button onClick={() => navigate(-1)}>←</button>

                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {board.title}
                </h2>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.95rem',
                        color: '#666',
                        marginBottom: '1rem'
                    }}
                >
                    <div>작성자: {board.username} | 작성일: {new Date(board.createdAt).toLocaleDateString()}</div>
                    <div>추천 {board.likeCount} | 조회 {board.viewCount}</div>
                </div>

                <hr style={{ margin: '1rem 0', border: '1px solid #ccc' }} />

                <div
                    style={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.8',
                        minHeight: '300px',
                        padding: '1rem 0',
                        fontSize: '1rem',
                    }}
                >
                    {board.content}
                </div>

                <hr style={{ margin: '1rem 0', border: '1px solid #ccc' }} />

                {/* 댓글 수 + 좋아요 버튼 한 줄 정렬 */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                    }}
                >
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>
                        댓글 {comments.length}
                    </h2>
                    <button
                        onClick={toggleLike}
                        disabled={!isLoggedIn}
                        style={{
                            background: isLiked ? '#e0d4fc' : '#f0f0f0',
                            border: '1px solid #ccc',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '6px',
                            cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                            fontWeight: '500',
                            color: isLiked ? '#6b4bb8' : '#555',
                            opacity: isLoggedIn ? 1 : 0.5,
                        }}
                    >
                        {isLiked ? '❤️ 좋아요 취소' : '🤍 좋아요'}
                    </button>
                </div>

                {comments.length === 0 ? (
                    <div className="p-4 border border-gray-200 rounded-md text-gray-500 text-sm">
                        아직 댓글이 없습니다.
                    </div>
                ) : (
                    <ul style={{ marginTop: '1rem' }}>
                        {comments.map(comment => (
                            <li
                                key={comment.commentId}
                                style={{
                                    marginBottom: '1rem',
                                    padding: '1rem',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '6px',
                                    backgroundColor: '#f9f9f9'
                                }}
                            >
                                <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.3rem' }}>
                                    {comment.username} · {new Date(comment.createdAt).toLocaleDateString()}
                                </div>
                                <div style={{ whiteSpace: 'pre-wrap' }}>{comment.content}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default StudyBoardDetailPage;
