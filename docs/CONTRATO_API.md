# Contrato da API — HackFlow

Este documento descreve o que o front espera do back end. Se o back end mudar algo, basta ajustar
o serviço correspondente em `src/servicos/` (e, se um nome de campo mudar, a tela que o usa).

## Regras gerais

- **Base:** `/api` (configurável por `VITE_API_URL`; em desenvolvimento o Vite repassa `/api` para `http://localhost:8080`).
- **Formato:** JSON em UTF-8, nomes de campo em `camelCase`, como nos exemplos abaixo.
- **Datas:** ISO-8601 (`"2026-10-23T09:12:00"`; data sem hora: `"2026-10-12"`).
- **Erros:** qualquer status 4xx/5xx deve devolver `{ "mensagem": "texto para mostrar ao usuário" }`.
  O front exibe essa mensagem; se ela não existir, mostra "Erro NNN ao falar com o servidor."

## Endpoints

| Método | Rota | Usado em | Resumo |
|---|---|---|---|
| POST | `/equipes` | TelaDeCadastro | Inscreve uma equipe |
| GET | `/equipes` | TelaDeAvaliacao | Lista as equipes |
| GET | `/equipes/{id}` | TelaDeFicha | Busca uma equipe |
| POST | `/equipes/{id}/projeto` | TelaDeProjeto | Registra o projeto da equipe |
| PUT | `/equipes/{id}/nota` | TelaDeFicha | Registra a avaliação |
| GET | `/avisos` | TelaDeAgenda | Lista o mural |
| POST | `/avisos` | TelaDeAgenda | Publica um aviso |
| GET | `/resultado` | TelaDeResultado | Ranking |
| GET | `/painel/resumo` | TelaDePainel | Números e gráficos |
| GET | `/perfil` | TelaDePerfil | Dados da pessoa logada (planejado, exige login) |

### POST /equipes

Requisição:
```json
{ "nome": "Equipe Épsilon", "responsavel": "Maria Alves", "email": "maria@ifpr.edu.br", "celular": "41999990000", "integrantes": 4 }
```
- `integrantes`: número de 3 a 5.
- **O servidor deve:** guardar o e-mail em minúsculas, garantir e-mail único e gerar o `codigo` (ex.: `HF-482`).

Respostas:
- `201`
  ```json
  { "id": 5, "nome": "Equipe Épsilon", "codigo": "HF-482" }
  ```
- `409` (e-mail já inscrito): o front abre a tela "Este e-mail já está inscrito".
  ```json
  { "mensagem": "Já existe uma inscrição com este e-mail." }
  ```
  **Não devolva** o nome da outra equipe nem a data da inscrição: qualquer pessoa pode digitar um e-mail no cadastro, e isso
  exporia dados de terceiros. Mesmo assim, o 409 confirma que o e-mail existe; proteja com limite de tentativas por IP
  (ou responda sempre "enviamos um e-mail" e trate o caso por e-mail).
- `400`: campo inválido ou faltando (`{ "mensagem": "..." }`).

### GET /equipes  e  GET /equipes/{id}

```json
[
  { "id": 1, "nome": "Equipe Alfa", "temProjeto": true, "nota": 8.7 },
  { "id": 2, "nome": "Equipe Beta", "temProjeto": true, "nota": null },
  { "id": 4, "nome": "Equipe Delta", "temProjeto": false, "nota": null }
]
```
- `nota`: `null` enquanto não avaliada; número com uma casa decimal depois.
- `GET /equipes/{id}` devolve só o objeto; `404` se não existir (o front volta para a lista).

### POST /equipes/{id}/projeto

```json
{ "repositorio": "https://github.com/equipe/projeto", "descricao": "O que o projeto resolve" }
```
- `201` (o corpo da resposta é ignorado pelo front). Depois disso `temProjeto` passa a ser `true`.
- `400` se `repositorio` vier vazio; `404` se a equipe não existir.

### PUT /equipes/{id}/nota

```json
{ "inovacao": 8, "execucaoTecnica": 7.5, "apresentacao": 9 }
```
- Cada nota de 0 a 10 (o front usa passo de 0,5).
- **O servidor deve** calcular a nota final: média das três, arredondada a 1 casa. Enviar de novo substitui a nota anterior ("Revisar").
- `200` → `{ "id": 2, "nota": 8.2 }`
- `400` nota fora do intervalo; `404` equipe inexistente; sugestão: `409` se a equipe não tem projeto.

### GET /avisos

Mais recentes primeiro:
```json
[ { "id": 2, "texto": "A sala da equipe Beta mudou para B12.", "urgente": true, "criadoEm": "2026-10-23T10:05:00" } ]
```

### POST /avisos

```json
{ "texto": "A sala da equipe Beta mudou para B12.", "urgente": true }
```
- `201` com o aviso criado (mesmo formato do GET; **o servidor define `id` e `criadoEm`**).
- `400` se `texto` vier vazio.

### GET /resultado

O servidor ordena. `aguardando` = equipes com projeto e sem nota.
```json
{
  "ranking": [
    { "posicao": 1, "id": 1, "nome": "Equipe Alfa", "nota": 8.7 },
    { "posicao": 2, "id": 3, "nome": "Equipe Gama", "nota": 7.9 }
  ],
  "aguardando": [ { "id": 2, "nome": "Equipe Beta" } ]
}
```

### GET /painel/resumo

```json
{
  "atualizadoEm": "2026-10-23T09:12:00",
  "equipes": 7,
  "desafiosConcluidos": 86,
  "desafiosPendentes": 54,
  "progressoGeral": 61,
  "desafiosPorEquipe": [ { "nome": "Pixel Hunters", "valor": 24 }, { "nome": "Byte Bandits", "valor": 20 } ],
  "situacao": { "concluidos": 86, "producaoDiaria": 31, "pendentes": 24 },
  "pontosPorDia": [ { "dia": "Seg", "pontos": 120 }, { "dia": "Ter", "pontos": 105 } ]
}
```
- `progressoGeral` é um percentual inteiro. `situacao` são quantidades: o front calcula as porcentagens da rosca.
- `desafiosPorEquipe` deve vir ordenado do maior para o menor.
- Este endpoint depende de "desafios", que ainda não existe nos demais. Pode começar devolvendo valores fixos.

### GET /perfil (planejado: exige login)

Hoje a tela `/perfil` usa dados de exemplo (`contaExemplo` em `src/dados/dadosFicticios.js`).
Quando houver login, este endpoint devolve **os dados de quem está logado** (o id nunca vem na URL).
```json
{
  "id": 1,
  "nome": "Maria Alves",
  "email": "maria.alves@ifpr.edu.br",
  "turma": "BCC 2",
  "campus": "IFPR · Campus Pinhais",
  "celularMascarado": "(41) •••••-0000",
  "papel": "RESPONSAVEL",
  "credencial": { "codigo": "HF-482-MA", "checkinEm": null },
  "equipe": {
    "id": 1, "nome": "Pixel Hunters", "codigo": "HF-482", "maximo": 5,
    "integrantes": [ { "id": 1, "nome": "Maria Alves", "responsavel": true }, { "id": 2, "nome": "João Pereira", "responsavel": false } ]
  },
  "projeto": { "enviado": true, "repositorio": "https://github.com/pixel-hunters/hackflow-app", "enviadoEm": "2026-10-22T18:40:00", "status": "Recebido pela comissão" },
  "desempenho": { "pontos": 840, "posicao": 2, "totalEquipes": 7, "concluidos": 12, "totalDesafios": 19 }
}
```
- `papel`: `"RESPONSAVEL"` ou `"INTEGRANTE"`. O front usa isso só para mostrar ou esconder a seção "Gestão da equipe";
  **as ações de gestão (editar equipe, integrantes, enviar projeto) precisam ser autorizadas de novo no servidor**.
- `checkinEm`: `null` até a comissão ler o QR code na entrada.
- Para ligar a tela à API, troque o alternador de demonstração em `TelaDePerfil.jsx` pelo campo `papel`.

## Ainda fixo no front (sem endpoint)

Cartão de perfil da tela inicial, "Desafios do dia", programação e atalhos (`src/dados/dadosFicticios.js`).
O perfil depende de login; os desafios e a programação podem virar endpoints depois.

## Para a fase de segurança (pontos já deixados prontos)

- `src/servicos/api.js`: único lugar onde as requisições saem. Comentário `SEGURANÇA` marca onde entra o cabeçalho `Authorization`.
- `src/telas/TelaDeLogin.jsx`: comentário `SEGURANÇA` marca onde entra `POST /auth/login`.
- `src/contexto/AppContext.jsx`: `equipeAtual` hoje vem do cadastro; com login virá da sessão.
- Falta definir papéis (participante, jurado, comissão): hoje qualquer pessoa vê "Publicar aviso" e a avaliação.
- `/perfil` e a seção "Gestão da equipe" dependem do login e do papel vindo do servidor (ver `GET /perfil`).
- Falta proteger rotas do front e, principalmente, validar permissões no back end.
