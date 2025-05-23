import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    // Limpar os mocks antes de cada teste
    jest.clearAllMocks();
  });
  
  test('deve renderizar corretamente quando isOpen é true', () => {
    render(
      <Modal 
        isOpen={true} 
        onClose={mockOnClose} 
        title="Título do Modal"
      >
        <div>Conteúdo do Modal</div>
      </Modal>
    );
    
    expect(screen.getByText('Título do Modal')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo do Modal')).toBeInTheDocument();
  });
  
  test('não deve renderizar quando isOpen é false', () => {
    render(
      <Modal 
        isOpen={false} 
        onClose={mockOnClose} 
        title="Título do Modal"
      >
        <div>Conteúdo do Modal</div>
      </Modal>
    );
    
    expect(screen.queryByText('Título do Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Conteúdo do Modal')).not.toBeInTheDocument();
  });
  
  test('deve chamar onClose quando o botão de fechar é clicado', () => {
    render(
      <Modal 
        isOpen={true} 
        onClose={mockOnClose} 
        title="Título do Modal"
      >
        <div>Conteúdo do Modal</div>
      </Modal>
    );
    
    const closeButton = screen.getByRole('button', { name: /fechar/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('deve chamar onClose quando a tecla ESC é pressionada', () => {
    render(
      <Modal 
        isOpen={true} 
        onClose={mockOnClose} 
        title="Título do Modal"
      >
        <div>Conteúdo do Modal</div>
      </Modal>
    );
    
    // Simula o pressionamento da tecla ESC
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    
    expect(mockOnClose).toHaveBeenCalled();
  });
});
