// src/components/ConfirmModal.tsx
import React from 'react';
import styles from './Modal.module.css'; // Modal.module.css를 사용한다고 가정

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <p className={styles.message}>{message}</p>
                <div className={styles.buttonGroup}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        취소
                    </button>
                    <button className={styles.confirmBtn} onClick={onConfirm}>
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;