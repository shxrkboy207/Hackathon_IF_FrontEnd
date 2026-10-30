// Estado compartilhado entre telas. Equipes, avisos, ranking etc. vivem no servidor (pasta /servicos).
// Aqui ficam só duas coisas do próprio front:
//  - o toast (mensagem rápida);
//  - a equipe "atual" (a que acabou de se cadastrar), usada no envio do projeto.
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [mensagemToast, setMensagemToast] = useState('');
  const temporizador = useRef(null);

  // SEGURANÇA (fase futura): quando houver login, a equipe do usuário virá da sessão
  // (resposta do login) e substituirá este valor definido pelo cadastro.
  const [equipeAtual, definirEquipeAtual] = useState(null); // { id, nome, codigo } ou null

  // useCallback + useMemo: o objeto "valor" só muda quando algo realmente muda,
  // então as telas não são redesenhadas toda vez que o toast aparece ou some.
  const mostrarToast = useCallback((mensagem) => {
    clearTimeout(temporizador.current);
    setMensagemToast(mensagem);
    temporizador.current = setTimeout(() => setMensagemToast(''), 2400);
  }, []);

  const valor = useMemo(
    () => ({ mensagemToast, mostrarToast, equipeAtual, definirEquipeAtual }),
    [mensagemToast, mostrarToast, equipeAtual]
  );
  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
