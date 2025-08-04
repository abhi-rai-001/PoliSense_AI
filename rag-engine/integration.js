/**
 * Integration script for connecting the RAG engine with the backend
 * 
 * This script provides utility functions to interact with the RAG engine API
 * from the Node.js backend.
 */

const axios = require('axios');

// Configuration
const RAG_ENGINE_URL = process.env.RAG_ENGINE_URL || 'http://localhost:8001';

/**
 * Process a document and answer questions using the RAG engine
 * 
 * @param {string} documentUrl - URL or content of the document
 * @param {string[]} questions - Array of questions to answer
 * @param {string} [documentId] - Optional document ID for traceability
 * @returns {Promise<Object>} - The RAG engine response
 */
async function queryRagEngine(documentUrl, questions, documentId = null) {
  try {
    const response = await axios.post(`${RAG_ENGINE_URL}/hackrx/run`, {
      documents: documentUrl,
      questions,
      document_id: documentId
    });
    
    return response.data;
  } catch (error) {
    console.error('Error querying RAG engine:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw error;
  }
}

/**
 * Check the health of the RAG engine
 * 
 * @returns {Promise<Object>} - Health status and token statistics
 */
async function checkRagEngineHealth() {
  try {
    const response = await axios.get(`${RAG_ENGINE_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('Error checking RAG engine health:', error.message);
    throw error;
  }
}

/**
 * Get token usage statistics from the RAG engine
 * 
 * @returns {Promise<Object>} - Token usage statistics
 */
async function getTokenStats() {
  try {
    const response = await axios.get(`${RAG_ENGINE_URL}/token-stats`);
    return response.data;
  } catch (error) {
    console.error('Error getting token stats:', error.message);
    throw error;
  }
}

module.exports = {
  queryRagEngine,
  checkRagEngineHealth,
  getTokenStats
};