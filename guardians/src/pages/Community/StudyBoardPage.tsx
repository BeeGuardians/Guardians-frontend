import BoardPage from "./BoardPage.tsx";

const StudyBoardPage = () => (
    <BoardPage
        boardType="STUDY"
        title="스터디 모집"
        description="📚 함께 스터디를 할 팀원들을 구해보세요!"
        backgroundColor="#fdeaf4"
        writePath="/community/study/write"
        detailPath={(id) => `/community/study/${id}`}
    />
);

export default StudyBoardPage;
