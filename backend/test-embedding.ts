import 'dotenv/config';
import { getEmbedding } from './lib/rag.js';

async function run() {
  console.log("Testing embedding...");
  try {
    const start = Date.now();
    const result = await getEmbedding("Hello world");
    console.log(`Success! Vector length: ${result.length}, took ${Date.now() - start}ms`);
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
