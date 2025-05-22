import BoardPage from "./BoardPage.tsx";

const InquiryBoardPage = () => (
    <BoardPage
        boardType="INQUIRY"
        title="문의 게시판"
        description="📩 관리자에게 문의사항이 있다면 올려주세요️!"
        backgroundColor="#e0f6f3"
        writePath="/community/inquiry/write"
        detailPath={(id) => `/community/inquiry/${id}`}
    />
);

export default InquiryBoardPage;
