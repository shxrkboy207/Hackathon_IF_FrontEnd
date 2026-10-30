// Validações de formulário. Servem para dar resposta rápida ao usuário,
// mas NÃO substituem a validação do servidor (o front pode ser contornado).

export function validarEmail(email) {
  return email.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// Aceita DDD + número (10 ou 11 dígitos), com ou sem máscara.
export function validarCelular(celular) {
  const digitos = celular.replace(/\D/g, '');
  return digitos.length === 10 || digitos.length === 11;
}

// Só aceita https://. Bloqueia esquemas perigosos como javascript: e data:,
// que seriam um risco (XSS) se o link fosse exibido depois como <a href>.
export function validarUrlHttps(texto) {
  if (texto.length > 300) return false;
  try {
    return new URL(texto).protocol === 'https:';
  } catch {
    return false;
  }
}
