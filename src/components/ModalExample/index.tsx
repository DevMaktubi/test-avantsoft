import React, { useState } from "react";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";

interface ModalExampleProps {
  buttonText?: string;
  modalTitle?: string;
  children?: React.ReactNode;
}

export function ModalExample({ 
  buttonText = "Open Modal", 
  modalTitle = "Modal Title",
  children 
}: ModalExampleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <Button 
        onClick={openModal}
        className="bg-[var(--primary)] text-[#1A161E] font-bold"
      >
        {buttonText}
      </Button>

      <Modal 
        isOpen={isOpen} 
        onClose={closeModal}
        title={modalTitle}
      >
        <div className="space-y-4">
          {children || (
            <div>
              <p className="text-[var(--primary)] mb-4">
                Modal reutilizável
              </p>
              <div className="flex justify-end">
                <Button 
                  onClick={closeModal}
                  className="bg-[var(--primary)] text-[#1A161E] font-bold"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
