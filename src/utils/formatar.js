// A API devolve datas em ISO-8601 ("2026-10-23T09:12:00" ou "2026-10-12").
// Estas funções transformam em texto para a tela e devolvem "" se a data for inválida.

// Datas sem hora ("2026-10-12") são interpretadas como horário local,
// senão o fuso do Brasil mostraria o dia anterior.
function paraData(iso) {
  if (typeof iso !== 'string') return null;
  const data = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return Number.isNaN(data.getTime()) ? null : data;
}

export function formatarHora(iso) {
  const data = paraData(iso);
  return data ? data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';
}

export function formatarDataCurta(iso) {
  const data = paraData(iso);
  return data ? data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '';
}

export function formatarDataHora(iso) {
  const data = formatarDataCurta(iso);
  const hora = formatarHora(iso);
  return data && hora ? `${data} às ${hora}` : '';
}

// "Maria Alves" -> "MA" | "Ana" -> "A". Usado nos avatares.
export function iniciaisDe(nome) {
  const partes = String(nome ?? '').trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return '?';
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}
