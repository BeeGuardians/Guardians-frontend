import { useParams, useNavigate } from 'react-router-dom';

const FreeBoardDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // 더미 데이터 (나중에 API로 대체 가능)
    const post = {
        id,
        title: `자유글 제목입니다 ${id}`,
        author: '익명',
        createdAt: '2024-04-30',
        content: '여기에 게시글 내용을 불러옵니다...',
        likes: 10,
        views: 500,
    };

    return (
        <div style={{ width: '70%', margin: '2rem auto', padding: '2rem', background: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>← 뒤로가기</button>
            <h2>{post.title}</h2>
            <p>작성자: {post.author} | 작성일: {post.createdAt}</p>
            <textarea
                value={post.content}
                readOnly
                style={{ width: '100%', height: '200px', margin: '1rem 0', padding: '1rem', resize: 'none' }}
            />
            <p>❤️ {post.likes} | 👁️ {post.views}</p>
        </div>
    );
};

export default FreeBoardDetailPage;
