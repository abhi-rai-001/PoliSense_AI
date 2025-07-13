
export default async function parseFile(buffer) {
  try {
    console.log("PDF parsing temporarily disabled");
    console.log("Buffer size:", buffer.length);
    
  } catch (error) {
    console.error("Error in parseFile:", error);
    throw error;
  }
}
