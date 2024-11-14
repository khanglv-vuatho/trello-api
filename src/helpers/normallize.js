export const normalizeKeyword = (keyword) => {
  return keyword
    .normalize('NFD')
    .toLowerCase()
    .replace(/[\u0300-\u036f\s]/g, '')
    .replace('đ', 'd')
}
