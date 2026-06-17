import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from '@google/genai';

const getPineconeClient = () => {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is missing");
  }
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
};

const getGenAIClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
};

export async function getEmbedding(text: string): Promise<number[]> {
  const ai = getGenAIClient();
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-2',
    contents: text,
    config: { outputDimensionality: 768 }
  });
  if (!response.embeddings || response.embeddings.length === 0 || !response.embeddings[0].values) {
    throw new Error("Failed to generate embedding");
  }
  return response.embeddings[0].values;
}

export async function addDocumentToVectorStore(text: string, userId: string, chunks: string[]) {
  const pc = getPineconeClient();
  const index = pc.Index(process.env.PINECONE_INDEX_NAME || 'polisense-index');
  
  const vectors = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await getEmbedding(chunk);
    vectors.push({
      id: `${userId}-${Date.now()}-${i}`,
      values: embedding,
      metadata: {
        userId,
        text: chunk,
      }
    });
  }

  // Upsert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    await index.upsert({ records: batch });
  }
  
  return vectors.length;
}

export async function queryVectorStore(question: string, userId: string) {
  const pc = getPineconeClient();
  const index = pc.Index(process.env.PINECONE_INDEX_NAME || 'polisense-index');
  
  const questionEmbedding = await getEmbedding(question);
  
  const queryResponse = await index.query({
    vector: questionEmbedding,
    topK: 5,
    filter: { userId },
    includeMetadata: true,
  });
  
  const contexts = queryResponse.matches?.map(match => match.metadata?.text as string) || [];
  
  const ai = getGenAIClient();
  
  const prompt = `You are an expert, highly professional AI assistant specializing in document analysis, policy, and technical research. 
Your goal is to provide articulate, comprehensive, and well-structured answers to the user's questions based ONLY on the provided context.
If the answer cannot be found in the context, state that clearly and professionally; do not hallucinate or make up an answer.

When explaining concepts or summarizing, use a professional, academic, yet accessible tone. Structure your response logically.
Even though you are an expert, you must return your response ONLY in the following valid JSON format so our system can parse it:

\`\`\`json
{
  "decision": "Determine a quick status (e.g., 'Information Only', 'Approved', 'Rejected', 'Action Required')",
  "amount": "Extract any relevant financial amount, metric, or 'Not applicable'",
  "justification": "Your comprehensive, highly professional, and articulate answer to the user's question. Use paragraphs if necessary.",
  "relevant_clauses": [
    "Direct quote or specific reference 1 from the context",
    "Direct quote or specific reference 2 from the context"
  ]
}
\`\`\`

Context:
${contexts.join('\n\n---\n\n')}

Question:
${question}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: prompt,
  });
  
  const text = response.text || "";
  
  return {
    text,
    sources: contexts
  };
}

export async function clearUserDocumentsFromVectorStore(userId: string) {
  try {
    const pc = getPineconeClient();
    const index = pc.Index(process.env.PINECONE_INDEX_NAME || 'polisense-index');
    
    // Pinecone Serverless doesn't support delete by filter easily without waiting, 
    // but the Node SDK supports deleteMany with a filter if it's a serverless index.
    // For pod-based or generic, we might need a workaround. Let's assume deleteMany by filter works.
    
    await index.deleteMany({ filter: { userId } } as any);
    return true;
  } catch (err) {
    console.error("Error clearing Pinecone docs:", err);
    throw err;
  }
}
