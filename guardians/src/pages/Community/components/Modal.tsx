import "./Modal.css"; // 아까 만든 스타일 import

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    message: string;
    showCancelButton?: boolean;
}

const Modal = ({
                   isOpen,
                   onClose,
                   onConfirm,
                   confirmText = "확인",
                   cancelText = "취소",
                   message,
                   showCancelButton = true,
               }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <p style={{ fontWeight: 600, fontSize: "1.1rem", marginBottom: "3rem" }}>
                    {message}
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                    {onConfirm && (
                        <button className="submit-btn" onClick={onConfirm} autoFocus>
                            {confirmText || "확인"}
                        </button>
                    )}
                    {showCancelButton && (
                        <button
                            className="submit-btn"
                            style={{ backgroundColor: "#ddd", color: "#333" }}
                            onClick={onClose}
                        >
                            {cancelText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
