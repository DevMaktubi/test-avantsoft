import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Dashboard } from '../Dashboard';
import * as clientActions from '../../redux/clientSlice/asyncThunks';
import * as authActions from '../../redux/authSlice/asyncThunks';

// Mock para react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Gráfico de Linha</div>,
  Bar: () => <div data-testid="bar-chart">Gráfico de Barras</div>,
  Pie: () => <div data-testid="pie-chart">Gráfico de Pizza</div>,
}));

// Mock dos componentes
jest.mock('../../components/tables/Clientes', () => ({
  TableClientes: () => <div data-testid="table-clientes">Tabela de Clientes</div>,
}));

jest.mock('../../components/Podio', () => ({
  PodioCampeoes: () => <div data-testid="podio">Pódio</div>,
}));

jest.mock('../../components/FormUsuario', () => ({
  FormUsuario: ({ closeModal }: {closeModal: () => void}) => (
    <div data-testid="form-usuario">
      Formulário de Usuário
      <button onClick={closeModal}>Fechar</button>
    </div>
  ),
}));

// Mock das ações
jest.mock('../../redux/clientSlice/asyncThunks', () => ({
  getClientData: jest.fn(),
}));

jest.mock('../../redux/authSlice/asyncThunks', () => ({
  logoutUser: jest.fn(),
}));

const mockStore = configureStore([]);

describe('Dashboard', () => {
  let store: any;
  
  beforeEach(() => {
    store = mockStore({
      client: {
        clients: [
          {
            id: '1',
            nome: 'Cliente 1',
            vendas: [{ valor: 100, data: '2023-05-01' }],
          }
        ],
        loadingClients: false,
      },
      auth: {
        loadingAuthentication: false,
      }
    });
    
    // Mock da função getClientData
    jest.spyOn(clientActions, 'getClientData').mockImplementation(() => () => Promise.resolve({ type: 'GET_CLIENT_DATA' }) as any);
    
    // Mock da função logoutUser
    jest.spyOn(authActions, 'logoutUser').mockImplementation(() => () => Promise.resolve({ type: 'LOGOUT_USER' }) as any);
  });
  
  test('deve renderizar o dashboard com todos os componentes', () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
    
    // Verifica se os principais componentes estão presentes
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('table-clientes')).toBeInTheDocument();
    expect(screen.getByTestId('podio')).toBeInTheDocument();
    
    // Verifica se o botão de criar cliente está presente
    expect(screen.getByText('Criar cliente')).toBeInTheDocument();
    
    // Verifica se o botão de logout está presente
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });
  
  test('deve abrir o modal ao clicar no botão "Criar cliente"', () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
    
    // Clique no botão "Criar cliente"
    const createButton = screen.getByText('Criar cliente');
    fireEvent.click(createButton);
    
    // Verifica se o modal foi aberto com o formulário
    expect(screen.getByTestId('form-usuario')).toBeInTheDocument();
  });
  
  test('deve fechar o modal ao clicar no botão de fechar', () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
    
    // Abre o modal
    const createButton = screen.getByText('Criar cliente');
    fireEvent.click(createButton);
    
    // Fecha o modal
    const closeButton = screen.getByText('Fechar');
    fireEvent.click(closeButton);
    
    // Verifica se o modal foi fechado
    expect(screen.queryByTestId('form-usuario')).not.toBeInTheDocument();
  });
  
  test('deve chamar a função logoutUser ao clicar no botão "Sair"', () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
    
    // Clique no botão "Sair"
    const logoutButton = screen.getByText('Sair');
    fireEvent.click(logoutButton);
    
    // Verifica se a função logoutUser foi chamada
    expect(authActions.logoutUser).toHaveBeenCalled();
  });
  
  test('deve chamar getClientData ao montar o componente', () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
    
    // Verifica se a função getClientData foi chamada
    expect(clientActions.getClientData).toHaveBeenCalled();
  });
});
