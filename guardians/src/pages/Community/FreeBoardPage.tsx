// pages/FreeBoardPage.tsx

import BoardPage from "./BoardPage.tsx";

const FreeBoardPage = () => (
    <BoardPage
        boardType="FREE"
        title="자유 게시판"
        description="✍️ 하고싶은 이야기를 자유롭게 나눠보세요!"
        backgroundColor="#fdf3e7"
        writePath="/community/free/write"
        detailPath={(id) => `/community/free/${id}`}
    />
);

export default FreeBoardPage;



