import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Board {
    boardId: number;
    title: string;
    content: string;
    username: string;
    createdAt: string;
    likeCount: number;
    viewCount: number;
    liked: boolean;
    userId: string;
}

interface Comment {
    commentId: number;
    content: string;
    username: string;
    createdAt: string;
}

const FreeBoardDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [board, setBoard] = useState<Board | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [sessionUserId, setSessionUserId] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        if (!id) return;

        axios.get(`/api/boards/${id}`, { withCredentials: true })
            .then(res => setBoard(res.data.result.data))
            // .catch(err => alert('게시글을 불러오지 못했습니다.'));

        axios.get(`/api/boards/${id}/comments`, { withCredentials: true })
            .then(res => setComments(res.data.result.data));

        axios.get('/api/users/me', { withCredentials: true })
            .then(res => {
                const id = res.data.result.data.id;
                setIsLoggedIn(true);
                setSessionUserId(String(id));
            })
            .catch(() => {
                setIsLoggedIn(false);
                setSessionUserId(null);
            });
    }, [id]);

    const toggleLike = () => {
        if (!id) return;
        axios.post(`/api/boards/${id}/like`, { withCredentials: true })
            .then(res => {
                const liked = res.data.result.data.liked;
                setIsLiked(liked);
                setBoard(prev => prev ? {
                    ...prev,
                    likeCount: prev.likeCount + (liked ? 1 : -1)
                } : prev);
            });
    };

    const handleDelete = () => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        axios.delete(`/api/boards/${board?.boardId}`, { withCredentials: true })
            .then(() => {
                alert('게시글이 삭제되었습니다.');
                navigate('/community/free');
            });
    };

    const handleCommentSubmit = () => {
        if (!newComment.trim()) {
            alert('댓글을 입력해주세요.');
            return;
        }

        axios.post(`/api/boards/${id}/comments`, { content: newComment }, { withCredentials: true })
            .then(res => {
                setComments(prev => [...prev, res.data.result.data]);
                setNewComment('');
            });
    };

    if (!board) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>로딩 중...</div>;
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5',
            minHeight: '90vh',
        }}>
            <div style={{
                width: '100%',
                maxWidth: '800px',
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                padding: '3rem',
                boxSizing: 'border-box',
            }}>
                <button onClick={() => navigate(-1)}>←</button>

                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {board.title}
                </h2>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.95rem',
                    color: '#666',
                    marginBottom: '1rem'
                }}>
                    <div>작성자: {board.username} | 작성일: {new Date(board.createdAt).toLocaleDateString()}</div>
                    <div>추천 {board.likeCount} | 조회 {board.viewCount}</div>
                </div>

                <hr />

                <div style={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.8',
                    minHeight: '300px',
                    padding: '1rem 0',
                    fontSize: '1rem',
                }}>
                    {board.content}
                </div>

                <hr style={{ margin: '1.5rem 0' }} />

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <h2 style={{ fontSize: '1.2rem' }}>댓글 {comments.length}</h2>
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
                        }}
                    >
                        {isLiked ? '❤️ 좋아요 취소' : '🤍 좋아요'}
                    </button>
                </div>

                {isLoggedIn && String(sessionUserId) === String(board.userId) && (
                    <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
                        <button onClick={handleDelete}>삭제하기</button>
                    </div>
                )}

                <div style={{ marginTop: '2rem' }}>
                    {comments.length === 0 ? (
                        <div style={{
                            padding: '1rem',
                            border: '1px solid #eee',
                            borderRadius: '8px',
                            color: '#777',
                            textAlign: 'center'
                        }}>
                            아직 댓글이 없습니다.
                        </div>
                    ) : (
                        <ul>
                            {comments.map(comment => (
                                <li key={comment.commentId} style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid #eee'
                                }}>
                                    <div style={{ fontSize: '0.9rem', color: '#555' }}>
                                        {comment.username} · {new Date(comment.createdAt).toLocaleDateString()}
                                    </div>
                                    <div style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>{comment.content}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <textarea
                        placeholder="댓글을 입력하세요"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{
                            width: '100%',
                            height: '80px',
                            padding: '0.8rem',
                            fontSize: '1rem',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            resize: 'none',
                        }}
                    />
                    <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                        <button
                            onClick={handleCommentSubmit}
                            style={{
                                backgroundColor: '#6b4bb8',
                                color: '#fff',
                                padding: '0.5rem 1.2rem',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            등록
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreeBoardDetailPage;
