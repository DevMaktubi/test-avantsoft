import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Login } from '../Login';
import * as authActions from '../../redux/authSlice/asyncThunks';
import { useNavigate } from 'react-router-dom';

// Mock do react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock das ações de autenticação
jest.mock('../../redux/authSlice/asyncThunks', () => ({
  authenticateUser: jest.fn(),
}));

// Mock do react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: (cb: any) => (data: any) => cb(data),
    formState: { errors: {} },
  }),
}));

const mockStore = configureStore([]);
const mockNavigate = jest.fn();

describe('Login', () => {
  let store: any;
  
  beforeEach(() => {
    store = mockStore({
      auth: {
        loadingAuthentication: false,
      }
    });
    
    // Reset do mock de navigate
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    
    // Mock da função authenticateUser
    jest.spyOn(authActions, 'authenticateUser').mockImplementation(
      () => () => Promise.resolve({ type: 'AUTHENTICATE_USER' }) as any
    );
  });
  
  test('deve renderizar o formulário de login corretamente', () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    
    // Verifica os elementos do formulário
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });
  
  test('deve mostrar "Carregando..." quando estiver em processo de autenticação', () => {
    store = mockStore({
      auth: {
        loadingAuthentication: true,
      }
    });
    
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });
  
  test('deve chamar authenticateUser ao submeter o formulário', () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
    
    // Preenche os campos
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Senha');
    
    fireEvent.change(emailInput, { target: { value: 'teste@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha123' } });
    
    // Submete o formulário
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    // Verifica se a função authenticateUser foi chamada
    expect(authActions.authenticateUser).toHaveBeenCalled();
  });
});
