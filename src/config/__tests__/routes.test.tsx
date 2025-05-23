import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { routes } from '../routes';
import { MemoryRouter } from 'react-router-dom';

// Mock dos hooks do react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/login' }),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>
}));

const mockStore = configureStore([]);

describe('RootLayout', () => {
  let store: any;
  const RootLayout = routes[0].element;
  
  beforeEach(() => {
    mockNavigate.mockClear();
    store = mockStore({
      auth: {
        isAuthenticated: false
      }
    });
  });
  
  test('deve renderizar o Outlet', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          {RootLayout}
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });
  
  test('deve redirecionar para o dashboard quando autenticado e na página de login', () => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
      useLocation: () => ({ pathname: '/login' }),
      Outlet: () => <div data-testid="outlet">Outlet Content</div>
    }));
    
    store = mockStore({
      auth: {
        isAuthenticated: true
      }
    });
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          {RootLayout}
        </MemoryRouter>
      </Provider>
    );
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
  
  test('deve redirecionar para o login quando não autenticado e não está na página de login', () => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
      useLocation: () => ({ pathname: '/dashboard' }),
      Outlet: () => <div data-testid="outlet">Outlet Content</div>
    }));
    
    store = mockStore({
      auth: {
        isAuthenticated: false
      }
    });
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          {RootLayout}
        </MemoryRouter>
      </Provider>
    );
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
