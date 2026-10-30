// Busca dados quando a tela abre e controla "carregando" e "erro".
//
//   const { dados, carregando, erro, recarregar } = useCarregar(() => equipesServico.listar());
//
// Se a busca depender de algo (ex.: o id da URL), passe como 2º argumento:
//   useCarregar(() => equipesServico.buscar(id), [id]);
import { useEffect, useState } from 'react';

export default function useCarregar(buscar, dependencias = []) {
  const [dados, definirDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false; // evita atualizar a tela se o usuário já saiu dela
    setCarregando(true);
    setErro(null);

    buscar()
      .then((resultado) => { if (!cancelado) definirDados(resultado); })
      .catch((e) => { if (!cancelado) setErro(e); })
      .finally(() => { if (!cancelado) setCarregando(false); });

    return () => { cancelado = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tentativa, ...dependencias]);

  return {
    dados,
    definirDados, // permite atualizar a lista local após um POST (ex.: novo aviso)
    carregando,
    erro,
    recarregar: () => setTentativa((t) => t + 1),
  };
}
