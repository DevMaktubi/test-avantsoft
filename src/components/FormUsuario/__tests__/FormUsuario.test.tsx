import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { FormUsuario } from '../index';
import * as clientSlice from '../../../redux/clientSlice/asyncThunks';

// Mock do moment
jest.mock('moment', () => {
  const originalMoment = jest.requireActual('moment');
  return (date: string) => {
    if (date) {
      return originalMoment(date);
    }
    return {
      toDate: () => new Date('2023-01-01'),
      format: () => '2023-01-01'
    };
  };
});

// Mock do react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: (cb: any) => (data: any) => cb(data),
    formState: { isValid: true, errors: {} },
    reset: jest.fn(),
  }),
}));

// Mock do addClient
jest.mock('../../../../redux/clientSlice/asyncThunks', () => ({
  addClient: jest.fn(),
}));

const mockStore = configureStore([]);

describe('FormUsuario', () => {
  let store: any;
  
  beforeEach(() => {
    store = mockStore({
      client: {
        loadingClients: false
      }
    });
    
    // Mock da função addClient
    jest.spyOn(clientSlice, 'addClient').mockImplementation(() => () => Promise.resolve({ type: 'ADD_CLIENT' }) as any);
  });

  test('deve renderizar o formulário corretamente', () => {
    render(
      <Provider store={store}>
        <FormUsuario />
      </Provider>
    );
    
    // Verifica se os campos estão presentes
    expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    
    // Verifica se o botão está presente
    expect(screen.getByText('Cadastrar')).toBeInTheDocument();
  });

  test('deve mostrar "Loading..." quando estiver carregando', () => {
    store = mockStore({
      client: {
        loadingClients: true
      }
    });

    render(
      <Provider store={store}>
        <FormUsuario />
      </Provider>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('deve fechar o modal quando o formulário for enviado com sucesso', () => {
    const mockCloseModal = jest.fn();
    
    render(
      <Provider store={store}>
        <FormUsuario closeModal={mockCloseModal} />
      </Provider>
    );
    
    // Simula a submissão do formulário
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    // Verifica se a função closeModal foi chamada
    expect(mockCloseModal).toHaveBeenCalled();
  });
});
