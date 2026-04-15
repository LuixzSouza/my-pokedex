-<FlatList>: Obrigatório para listas médias/grandes. Ela faz a virtualização (só carrega o que está visivel na tela), poupando muita memoria
    - Exige a propriedade `keyExtractor` (ex: `item => string(item.id)`) para otimizar as atualizações 

- `useState`: Guarda variáveis na memoria do ecrã. Quando sofre uma alteração via `set`, o componente sofre um re-render automático.
- `useEffect`: Dependencias vazia `[]`: Executa apenas uma vez (na montagem inicial) 
    - DependÊncia com valor `[id]`: Executa na montagem e sempre que esse valor sofrer alteração 
    - **Clean Function**: É a função retornada no final do `useEffect`. Roda na desmontagem do componente (ideal com o `abotController`) cancelando fetches