export function parseAfterDelimiter(str, delimiter) {
    const index = str.indexOf(delimiter);
    if (index !== -1) {
      return str.substring(index + delimiter.length); // delimiter 뒤쪽 부분 반환
    }
    return null; // delimiter가 없으면 null 반환
}

export function formatDateUsingLocale(timestamp) {
  if (!timestamp || !timestamp.toDate) return "알 수 없음";
  const date = timestamp.toDate();

  return date.toLocaleString('ko-KR', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // 24시간제
  }).replace(/\//g, '-').replace(',', ''); // 날짜 구분 기호를 "-"로 바꿔줌
}