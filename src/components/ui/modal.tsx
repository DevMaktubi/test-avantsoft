import * as React from "react";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";
import { Button } from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    className,
    showCloseButton = true,
    closeOnOutsideClick = true,
  }, ref) => {
    const modalRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = (node: HTMLDivElement) => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(node);
        } else {
          ref.current = node;
        }
      }
      if (modalRef) modalRef.current = node;
    };

    // Handle outside click
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(event.target as Node)) {
          onClose();
        }
      };

      // Handle ESC key
      const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscKey);
        // Prevent scrolling of background content
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscKey);
        // Restore scrolling when modal is closed
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, onClose, closeOnOutsideClick]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div 
          ref={mergedRef}
          className={cn(
            "bg-[#1A161E] border border-[var(--primary)] rounded-lg p-6 shadow-lg max-w-md w-full max-h-[90vh] overflow-auto",
            className
          )}
        >
          <div className="flex items-center justify-between mb-4">
            {title && (
              <h2 className="text-xl font-bold text-[var(--primary)]">{title}</h2>
            )}
            {showCloseButton && (
              <Button 
                onClick={onClose}
                variant="ghost" 
                className="h-8 w-8 p-0 rounded-full"
              >
                <X className="h-5 w-5 text-[var(--primary)]" />
                <span className="sr-only">Close</span>
              </Button>
            )}
          </div>
          {children}
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";

export { Modal };
