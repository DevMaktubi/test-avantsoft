# Testes do Projeto

Este projeto utiliza Jest e React Testing Library para testes unitários.

## Componentes testados

1. **Componentes de UI**
   - Modal

2. **Componentes de Formulário**
   - FormUsuario

3. **Componentes de Visualização**
   - TableClientes
   - Podio
   - GraficoBarras
   - GraficoLinha
   - GraficoPie
   - ChartPlaceholder
   - ModalExample

4. **Páginas**
   - Dashboard
   - Login

5. **Utilitários**
   - utils.ts (calcularLetraFaltante, formatarData, createChartConfig, maskBRL)

6. **Roteamento**
   - RouterComponent
   - RootLayout (routes.tsx)

## Como executar os testes

```bash
# Executa todos os testes uma vez
npm test

# Executa os testes em modo watch (monitora alterações nos arquivos)
npm run test:watch

# Executa os testes e gera relatório de cobertura
npm run test:coverage
```

## Estrutura de testes

Os testes seguem uma estrutura onde cada componente tem sua pasta `__tests__` com os arquivos de teste correspondentes.

```
ComponentName/
  index.tsx
  __tests__/
    ComponentName.test.tsx
```

## Mocks

Os testes utilizam mocks para:
- Serviços externos
- Hooks como useSelector e useDispatch do Redux
- Funções de utilidade como moment
- Componentes de terceiros como Chart.js

## Convenções de nomenclatura

- Arquivos de teste: `NomeDoComponente.test.tsx`
- Descrições de teste: Linguagem natural que descreve o comportamento esperado
