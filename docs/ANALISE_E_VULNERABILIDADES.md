# Análise crítica e vulnerabilidades — HackFlow (front-end)

Escopo: o código React deste projeto (não existe back end ainda). Gravidade considera o sistema
**exposto com usuários reais**; hoje, sem servidor, o risco prático é menor.
Legenda: **Corrigido** = já ajustado no código · **Pendente** = depende do back end ou da fase de segurança.

## 1. Vulnerabilidades e riscos encontrados

### Corrigidos no front

| ID | Gravidade | Problema | Onde | Correção |
|---|---|---|---|---|
| F-01 | Média | **Injeção de caminho pelo `:id` da URL.** O valor de `/avaliacao/:id` ia direto para `fetch('/equipes/${id}')`. Um link como `/avaliacao/..%2Fadmin` faria o navegador chamar outro endpoint (`/api/admin`). Com login, um link malicioso poderia disparar chamadas GET em nome do usuário. | `TelaDeFicha`, `equipesServico` | O id só é aceito se for numérico (`/^\d+$/`) e todo id é passado por `encodeURIComponent`. |
| F-02 | Média | **Vazamento de dados de terceiros no 409.** A tela de duplicidade mostrava o nome da equipe e a data da inscrição existente para qualquer pessoa que digitasse o e-mail. | `TelaDeDuplicidade`, contrato | Tela e contrato passaram a mostrar só "e-mail já inscrito". |
| F-03 | Média | **Link de repositório sem validação de esquema.** Qualquer texto era aceito; um valor `javascript:...` armazenado viraria XSS se exibido como `<a href>`. | `TelaDeProjeto`, `TelaDePerfil` | Só `https://` é aceito (máx. 300 caracteres) e o perfil só cria link clicável se o endereço for https. O servidor deve repetir essa regra. |
| F-04 | Baixa | **Entradas sem limite e validação fraca** (e-mail só checava `@`, celular e textos sem formato nem tamanho). | `TelaDeCadastro`, `TelaDeAgenda`, `TelaDeProjeto` | Regex de e-mail, formato de celular, `maxLength` nos campos, nome do responsável obrigatório. |
| F-05 | Baixa | **"Lembrar senha"** sugere guardar a senha no site. | `TelaDeLogin` | Renomeado para "Manter conectado"; campos com `autoComplete` corretos para gerenciadores de senha. |
| F-06 | Baixa | **Requisições sem tempo limite**: uma API travada deixava a tela "Carregando…" para sempre (disponibilidade). | `api.js` | Cancelamento após 15 s com mensagem clara. |
| F-07 | Baixa | **Sem tratamento global de erro**: um erro inesperado deixava a tela em branco. | `main.jsx` | `LimiteDeErro` mostra mensagem amigável. |

### Pendentes (dependem do back end ou da fase de segurança)

| ID | Gravidade | Problema | O que fazer |
|---|---|---|---|
| P-01 | **Crítica** (em produção) | **Sem autenticação.** O login é fictício e todas as rotas abrem para qualquer pessoa. | Login no servidor; token/sessão; ponto de entrada marcado com `SEGURANÇA` em `api.js`, `TelaDeLogin.jsx`, `AppContext.jsx`. |
| P-02 | **Alta** | **Autorização e IDOR.** Os ids são sequenciais (`/equipes/1`, `/2`…). Sem verificação no servidor, qualquer um altera nota, projeto ou equipe alheia. Esconder botões no front (como a "Gestão da equipe") **não protege nada**. | Em cada endpoint, conferir quem é o usuário e se ele é dono/responsável da equipe, jurado ou comissão. Considere UUID em vez de id sequencial. |
| P-03 | **Alta** | **Validação só no front.** Qualquer cliente HTTP ignora as regras do React. | Repetir todas as validações no Java (tamanhos, formato, esquema `https`, nota entre 0 e 10, e-mail único) e rejeitar campos desconhecidos. |
| P-04 | Média | **Sem proteção contra abuso**: cadastro e avisos podem ser spammados; o 409 permite descobrir quais e-mails estão inscritos. | Limite de tentativas por IP/usuário; avisos só para papel "comissão". |
| P-05 | Média | **Sem cabeçalhos de segurança/CSP; fontes externas.** O Google Fonts é carregado de terceiros. | Servir com HTTPS e cabeçalhos (CSP, `X-Content-Type-Options`, `frame-ancestors`); considerar hospedar as fontes. CORS restrito ao domínio do front (nunca `*` com credenciais). |
| P-06 | Média | **Onde guardar o token.** `localStorage` é legível por qualquer XSS. | Preferir cookie `HttpOnly; Secure; SameSite` (com proteção CSRF) ou token em memória. |
| P-07 | Média | **Mensagens de erro do servidor.** O front mostra `mensagem`/`message` da API; o Spring padrão pode expor detalhes internos. | Devolver textos genéricos e registrar o detalhe só no log do servidor. |
| P-08 | Média | **LGPD.** Há dados pessoais (nome, e-mail, celular) e, no IFPR, possíveis participantes menores de 18 anos. | Definir base legal/consentimento (e autorização dos responsáveis para menores), coletar só o necessário e definir prazo de retenção. O celular já aparece mascarado no perfil. |
| P-09 | Baixa/Média | **Dependências e servidor de desenvolvimento.** O projeto usa Vite 5 e não tem `package-lock.json` (nunca foi instalado aqui). | Rodar `npm audit` após `npm install`, versionar o lockfile e atualizar o Vite se houver alertas. **Não rode `npm run dev -- --host`** em rede aberta: o proxy `/api` ficaria acessível a outras máquinas. |
| P-10 | Baixa | **Integridade das notas.** Nada impede jurado avaliar a própria equipe ou alterar nota após o fechamento. | Regras e auditoria (quem avaliou, quando) no servidor. |

Itens que **não** foram encontrados: uso de `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `localStorage`/`sessionStorage`
ou `target="_blank"` sem `rel`. O texto vindo da API é exibido pelo React, que o escapa automaticamente. (O HTML original
montava listas com `innerHTML`; a migração para React eliminou esse risco.)

## 2. Análise crítica do código (qualidade e acessibilidade)

Corrigido:
- **Contraste insuficiente** no destaque da tela inicial (branco sobre `#2a9a3b` = 3,6:1, abaixo dos 4,5:1 do padrão AA). Fundo escurecido.
- **Estado global recriado a cada render**: o contexto agora usa `useMemo`/`useCallback`, então o toast não redesenha todas as telas.
- **Toast** criado e removido do DOM (leitores de tela podiam não anunciar): agora a região `role="status"` fica sempre presente.
- **Navegação por teclado**: link "Pular para o conteúdo" e foco movido ao conteúdo quando a tela muda.
- **Menu no celular** quebrava a largura: agora rola na horizontal. A busca, que não fazia nada, ficou desativada.
- **Cores fixas em JSX** (13 ocorrências) migradas para variáveis de tema; gráficos não têm mais hexadecimais no código.
- **Datas inválidas** viravam "Invalid Date": agora retornam vazio.
- **Animações** respeitam a preferência "reduzir movimento" do sistema.

Ainda pendente:
- Links do rodapé (`GitHub`, `Instagram`) são `<a>` sem `href`: não são focáveis nem clicáveis. Coloque os endereços reais.
- O gráfico de rosca arredonda percentuais e pode somar 99% ou 101%.
- Não há testes automatizados nem ESLint configurado.
- Não há página 404: rotas desconhecidas redirecionam ao login.

## 3. Checklist para o back end em Java

- Autenticar toda rota, exceto cadastro e login; autorizar por papel **e** por dono do recurso.
- Bean Validation (`@NotBlank`, `@Size`, `@Email`, `@Min/@Max`) e validação de URL `https`.
- Respostas de erro `{ "mensagem": "..." }` sem detalhes internos.
- Gerar no servidor: código da equipe, hora do aviso, média e ranking (o front já não calcula).
- Limite de requisições, CORS restrito, HTTPS e cabeçalhos de segurança.
- Consultas parametrizadas (JPA/`PreparedStatement`), nunca concatenação de SQL.
- Guardar senhas apenas com hash forte (BCrypt/Argon2).
