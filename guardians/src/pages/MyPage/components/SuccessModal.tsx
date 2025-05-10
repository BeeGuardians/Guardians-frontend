interface SuccessModalProps {
    message: string;
    onClose: () => void;
    onSuccess?: () => void;
}

const SuccessModal = ({ message, onClose }: SuccessModalProps) => {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999
            }}
        >
            <div
                style={{
                    background: "white",
                    padding: "2rem",
                    borderRadius: "1rem",
                    minWidth: "300px",
                    textAlign: "center",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                }}
            >
                <p style={{ marginBottom: "1.5rem", fontWeight: 600 }}>{message}</p>
                <button
                    onClick={onClose}
                    style={{
                        backgroundColor: "#4caf50", // 초록 계열로 성공 느낌
                        color: "white",
                        border: "none",
                        borderRadius: "0.5rem",
                        padding: "0.6rem 1.5rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "1rem",
                        transition: "background-color 0.25s ease"
                    }}
                    onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = "#45a845";
                    }}
                    onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = "#4caf50";
                    }}
                >
                    확인
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
