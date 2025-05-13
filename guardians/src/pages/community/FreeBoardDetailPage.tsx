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
            .catch(err => {
                console.error('게시글 상세 불러오기 실패', err);
                alert('게시글을 불러오지 못했습니다.');
            });

        axios.get(`/api/boards/${id}/comments`, { withCredentials: true })
            .then(res => setComments(res.data.result.data))
            .catch(err => console.error('댓글 불러오기 실패', err));

        axios.get('/api/users/check', { withCredentials: true })
            .then(res => {
                setIsLoggedIn(res.data.loggedIn);
                setSessionUserId(res.data.userId);
            })
            .catch(() => {
                setIsLoggedIn(false);
                setSessionUserId(null);
            });

        axios.get(`/api/boards/${id}/like`, { withCredentials: true })
            .then(res => setIsLiked(res.data))
            .catch(() => setIsLiked(false));
    }, [id]);

    const toggleLike = () => {
        if (!id) return;

        axios.post(`/api/boards/${id}/like`, {}, { withCredentials: true })
            .then(res => {
                const liked = res.data.result.data.liked;
                setIsLiked(liked);
                setBoard(prev => prev ? {
                    ...prev,
                    likeCount: prev.likeCount + (liked ? 1 : -1)
                } : prev);
            })
            .catch(err => console.error("좋아요 토글 실패", err));
    };

    const handleDelete = () => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        axios.delete(`/api/boards/${board?.boardId}`, { withCredentials: true })
            .then(() => {
                alert('게시글이 삭제되었습니다.');
                navigate('/community/free');
            })
            .catch(err => {
                console.error('삭제 실패', err);
                alert('삭제에 실패했습니다.');
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
            })
            .catch(err => {
                console.error('댓글 작성 실패', err);
                alert('댓글 작성에 실패했습니다.');
            });
    };

    if (!board) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>로딩 중...</div>;
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'start',
            minHeight: '10vh',
            backgroundColor: '#f5f5f5',
        }}>
            <div style={{
                width: '60%',
                padding: '3.5rem',
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            }}>
                <button onClick={() => navigate(-1)}>←</button>

                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {board.title}
                </h2>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.95rem',
                    color: '#666',
                    marginBottom: '1rem'
                }}>
                    <div>작성자: {board.username} | 작성일: {new Date(board.createdAt).toLocaleDateString()}</div>
                    <div>추천 {board.likeCount} | 조회 {board.viewCount}</div>
                </div>

                <hr style={{ margin: '1rem 0', border: '1px solid #ccc' }} />

                <div style={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.8',
                    minHeight: '300px',
                    padding: '1rem 0',
                    fontSize: '1rem',
                }}>
                    {board.content}
                </div>

                <hr style={{ margin: '1rem 0', border: '1px solid #ccc' }} />

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                }}>
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

                {isLoggedIn && sessionUserId !== null && board !== null && sessionUserId === board.userId && (
                    <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
                        <button
                            onClick={handleDelete}
                            style={{
                                background: '#ffe0e0',
                                color: '#cc0000',
                                border: '1px solid #cc0000',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            삭제하기
                        </button>
                    </div>
                )}

                {comments.length === 0 ? (
                    <div className="p-4 border border-gray-200 rounded-md text-gray-500 text-sm">
                        아직 댓글이 없습니다.
                    </div>
                ) : (
                    <ul style={{ marginTop: '1rem' }}>
                        {comments.map(comment => (
                            <li key={comment.commentId} style={{
                                marginBottom: '1rem',
                                padding: '1rem',
                                border: '1px solid #e0e0e0',
                                borderRadius: '6px',
                                backgroundColor: '#f9f9f9'
                            }}>
                                <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.3rem' }}>
                                    {comment.username} · {new Date(comment.createdAt).toLocaleDateString()}
                                </div>
                                <div style={{ whiteSpace: 'pre-wrap' }}>{comment.content}</div>
                            </li>
                        ))}
                    </ul>
                )}

                {isLoggedIn && (
                    <div style={{ marginTop: '1.5rem' }}>
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
                )}
            </div>
        </div>
    );
};

export default FreeBoardDetailPage;
