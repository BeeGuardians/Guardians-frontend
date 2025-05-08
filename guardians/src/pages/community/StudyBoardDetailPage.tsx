import { useParams, useNavigate } from 'react-router-dom';
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
    }

const InquiryBoardDetailPage = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [board, setBoard] = useState<Board | null>(null);

    useEffect(() => {
        if (id) {
            // 서버에 GET 요청 보내서 게시글 데이터 가져오기
            axios.get(`/api/boards/${id}`, {withCredentials: true})
                .then(res => {
                    const result = res.data.result.data; // 서버 응답에서 데이터 꺼내기
                    setBoard(result);                   // 상태에 저장 → 렌더링 업데이트
                })
                .catch(err => {
                    console.error('게시글 상세 불러오기 실패', err); // 콘솔에 에러 로그
                    alert('게시글을 불러오지 못했습니다.');         // 사용자에게 알림
                });
        }
    }, [id]); // ✅ 의존성 배열: id 값이 바뀌면 useEffect 재실행

    // ✅ 로딩 중 화면 표시 (데이터 아직 안 불러왔을 때)
    if (!board) {
        return <div style={{textAlign: 'center', marginTop: '2rem'}}>로딩 중...</div>;
    }


    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center', // 가로 가운데
                alignItems: 'center',     // 세로 가운데
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <div
                style={{
                    width: '75%',
                    padding: '3.5rem',
                    background: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)', // 조금 더 예쁜 효과
                }}
            >
                <button onClick={() => navigate(-1)} style={{marginBottom: '1rem'}}>
                    ← 뒤로가기
                </button>

                <h2>{board.title}</h2>
                <p>작성자: {board.username} | 작성일: {new Date(board.createdAt).toLocaleDateString()}</p>

                <textarea
                    value={board.content}
                    readOnly
                    style={{
                        width: '100%',
                        height: '200px',
                        margin: '1rem 0',
                        padding: '1rem',
                        resize: 'none',
                    }}
                />

                <p>❤️ {board.likeCount} | 👁️ {board.viewCount}</p>
            </div>
        </div>
    );
};

    export default InquiryBoardDetailPage;
