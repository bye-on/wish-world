export function parseAfterDelimiter(str, delimiter) {
    const index = str.indexOf(delimiter);
    if (index !== -1) {
      return str.substring(index + delimiter.length); // delimiter 뒤쪽 부분 반환
    }
    return null; // delimiter가 없으면 null 반환
}