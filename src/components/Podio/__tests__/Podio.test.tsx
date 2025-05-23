import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Podio } from '../index';

// Mock para a função maskBRL
jest.mock('../../../lib/utils', () => ({
  maskBRL: jest.fn((valor) => valor.toFixed(2)),
}));

const mockStore = configureStore([]);

describe('Podio', () => {
  let store;
  
  beforeEach(() => {
    store = mockStore({
      client: {
        clients: [
          {
            id: '1',
            nome: 'Cliente 1',
            vendas: [{ valor: 300 }, { valor: 200 }]
          },
          {
            id: '2',
            nome: 'Cliente 2',
            vendas: [{ valor: 500 }]
          },
          {
            id: '3',
            nome: 'Cliente 3',
            vendas: [{ valor: 250 }]
          },
          {
            id: '4',
            nome: 'Cliente 4',
            vendas: [{ valor: 150 }]
          }
        ],
        loadingClients: false
      }
    });
  });
  
  test('deve renderizar o título do podio', () => {
    render(
      <Provider store={store}>
        <Podio />
      </Provider>
    );
    
    expect(screen.getByText('Top 3 Clientes')).toBeInTheDocument();
  });
  
  test('deve renderizar os três primeiros clientes em ordem de faturamento', () => {
    render(
      <Provider store={store}>
        <Podio />
      </Provider>
    );
    
    // O cliente com maior faturamento deve ser o primeiro
    const posicoes = screen.getAllByText(/Cliente \d/);
    
    // Cliente 2 tem maior faturamento (500)
    expect(posicoes[0].textContent).toContain('Cliente 2');
    
    // Cliente 1 tem segundo maior faturamento (500)
    expect(posicoes[1].textContent).toContain('Cliente 1');
    
    // Cliente 3 tem terceiro maior faturamento (250)
    expect(posicoes[2].textContent).toContain('Cliente 3');
  });
  
  test('deve mostrar os valores de faturamento para cada cliente', () => {
    render(
      <Provider store={store}>
        <Podio />
      </Provider>
    );
    
    // Verificar os valores de faturamento
    const valores = screen.getAllByText(/R\$ \d+\.\d+/);
    
    // Cliente 2 (500)
    expect(valores[0].textContent).toContain('500.00');
    
    // Cliente 1 (500)
    expect(valores[1].textContent).toContain('500.00');
    
    // Cliente 3 (250)
    expect(valores[2].textContent).toContain('250.00');
  });
});
