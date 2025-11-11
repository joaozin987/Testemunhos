import versiculos from '../data/verses.json';
import maria from '../data/maria.json';

export function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
