
export function splitTextIntoChunks(text, chunkSize = 1500, overlap = 200) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = start + chunkSize;
    if (end > text.length) end = text.length;

    const chunk = text.slice(start, end).trim();
    chunks.push(chunk);

    start += chunkSize - overlap;
  }

  return chunks;
}