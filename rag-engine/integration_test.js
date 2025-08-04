/**
 * Integration test for the RAG engine
 * 
 * This script demonstrates how to use the RAG engine with the backend
 * by processing a sample document and answering questions.
 */

const fs = require('fs');
const path = require('path');
const { queryRagEngine, checkRagEngineHealth, getTokenStats } = require('./integration');

// Sample document URL (replace with your own)
const SAMPLE_DOCUMENT_URL = 'https://example.com/sample-document.pdf';

// Sample questions
const SAMPLE_QUESTIONS = [
  'What is the coverage for plastic surgery?',
  'Is day care treatment covered?',
  'What is the sum insured?',
  'Are congenital diseases covered?'
];

/**
 * Run the integration test
 */
async function runIntegrationTest() {
  try {
    console.log('Checking RAG engine health...');
    const healthStatus = await checkRagEngineHealth();
    console.log('Health status:', JSON.stringify(healthStatus, null, 2));
    
    console.log('\nProcessing document and answering questions...');
    const result = await queryRagEngine(SAMPLE_DOCUMENT_URL, SAMPLE_QUESTIONS);
    
    console.log('\nAnswers:');
    result.answers.forEach((answer, index) => {
      console.log(`\nQuestion ${index + 1}: ${SAMPLE_QUESTIONS[index]}`);
      console.log(`Answer: ${answer.answer}`);
      console.log(`Confidence: ${answer.confidence}`);
      console.log(`Traceability: ${JSON.stringify(answer.traceability, null, 2)}`);
      if (answer.explanation) {
        console.log(`Explanation: ${answer.explanation}`);
      }
    });
    
    console.log('\nGetting token statistics...');
    const tokenStats = await getTokenStats();
    console.log('Token stats:', JSON.stringify(tokenStats, null, 2));
    
    // Save results to file
    const resultsDir = path.join(__dirname, 'results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir);
    }
    
    fs.writeFileSync(
      path.join(resultsDir, 'integration_test_results.json'),
      JSON.stringify({ result, tokenStats }, null, 2)
    );
    
    console.log('\nIntegration test completed successfully!');
    console.log('Results saved to results/integration_test_results.json');
  } catch (error) {
    console.error('Integration test failed:', error.message);
  }
}

// Run the test
runIntegrationTest();