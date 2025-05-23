import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { TableClientes } from '../index';

// Mock do moment para controlar a formatação de datas
jest.mock('moment', () => {
  const originalMoment = jest.requireActual('moment');
  return (date: string) => {
    if (date) {
      return originalMoment(date);
    }
    return originalMoment('2023-01-01T00:00:00.000Z');
  };
});

// Mock das funções de utilidade
jest.mock('../../../../lib/utils', () => ({
  calcularLetraFaltante: (_nome: string) => 'X',
  maskBRL: (valor: number) => valor.toFixed(2),
}));

const mockStore = configureStore([]);

describe('TableClientes', () => {
  let store: any;
  
  beforeEach(() => {
    store = mockStore({
      client: {
        clients: [
          {
            id: '1',
            nome: 'Teste Nome',
            email: 'teste@email.com',
            data_nascimento: '1990-01-01',
            vendas: [
              { id: '1', valor: 100, data: '2023-05-01' },
              { id: '2', valor: 200, data: '2023-05-02' }
            ]
          }
        ],
        loadingClients: false
      }
    });
  });

  test('deve renderizar a tabela corretamente', () => {
    render(
      <Provider store={store}>
        <TableClientes />
      </Provider>
    );
    
    // Verifica os cabeçalhos
    expect(screen.getByText('Cliente')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Data de nascimento')).toBeInTheDocument();
    expect(screen.getByText('PLF')).toBeInTheDocument();
    expect(screen.getByText('Frequência')).toBeInTheDocument();
    expect(screen.getByText('Média')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    
    // Verifica os dados
    expect(screen.getByText('Teste Nome')).toBeInTheDocument();
    expect(screen.getByText('teste@email.com')).toBeInTheDocument();
    expect(screen.getByText('01/01/1990')).toBeInTheDocument();
  });

  test('deve mostrar skeletons durante o carregamento', () => {
    store = mockStore({
      client: {
        clients: [],
        loadingClients: true
      }
    });

    const { container } = render(
      <Provider store={store}>
        <TableClientes />
      </Provider>
    );
    
    // Verifica se os skeletons estão sendo renderizados
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
