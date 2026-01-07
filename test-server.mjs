#!/usr/bin/env node
/**
 * Test script for the MCP server
 * This script tests the MCP server by sending requests to it via stdio
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REQUEST_TIMEOUT_MS = 10000; // 10 seconds

const serverPath = resolve(__dirname, 'dist/server.js');

// Start the server
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'inherit'],
});

// Helper to send JSON-RPC requests
function sendRequest(method, params = {}) {
  const request = {
    jsonrpc: '2.0',
    id: Date.now(),
    method,
    params,
  };
  
  return new Promise((resolve, reject) => {
    let response = '';
    
    const timeout = setTimeout(() => {
      reject(new Error(`Request timeout after ${REQUEST_TIMEOUT_MS}ms`));
    }, REQUEST_TIMEOUT_MS);
    
    const dataHandler = (data) => {
      response += data.toString();
      
      // Try to parse complete JSON-RPC response
      try {
        const lines = response.split('\n').filter(line => line.trim());
        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.id === request.id) {
              clearTimeout(timeout);
              server.stdout.removeListener('data', dataHandler);
              resolve(json);
              return;
            }
          } catch (e) {
            // Not a complete JSON yet, continue
          }
        }
      } catch (e) {
        // Not valid JSON yet
      }
    };
    
    server.stdout.on('data', dataHandler);
    server.stdin.write(JSON.stringify(request) + '\n');
  });
}

async function runTests() {
  console.log('🧪 Testing MCP Server\n');
  
  try {
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 1: List tools
    console.log('Test 1: Listing tools...');
    const toolsResponse = await sendRequest('tools/list');
    
    if (toolsResponse.result && toolsResponse.result.tools) {
      console.log('✅ Tools listed successfully:');
      toolsResponse.result.tools.forEach(tool => {
        console.log(`   - ${tool.name}: ${tool.description}`);
      });
    } else {
      console.log('❌ Failed to list tools');
    }
    
    console.log('\n');
    
    // Test 2: Call scrape_posts (this will actually try to scrape the website)
    console.log('Test 2: Testing scrape_posts tool...');
    const scrapeResponse = await sendRequest('tools/call', {
      name: 'scrape_posts',
      arguments: {},
    });
    
    if (scrapeResponse.result) {
      console.log('✅ scrape_posts executed successfully');
      if (scrapeResponse.result.content && scrapeResponse.result.content[0]) {
        const data = JSON.parse(scrapeResponse.result.content[0].text);
        console.log(`   Found ${data.length} items`);
        if (data[0]) {
          console.log(`   First item: ${data[0].title}`);
        }
      }
    } else {
      console.log('❌ scrape_posts failed');
    }
    
    console.log('\n');
    
    // Test 3: Call get_posts
    console.log('Test 3: Testing get_posts tool (placeholder)...');
    const getResponse = await sendRequest('tools/call', {
      name: 'get_posts',
      arguments: { limit: 5 },
    });
    
    if (getResponse.result) {
      console.log('✅ get_posts executed (placeholder mode)');
    } else {
      console.log('❌ get_posts failed');
    }
    
    console.log('\n');
    
    // Test 4: Call create_post
    console.log('Test 4: Testing create_post tool (placeholder)...');
    const createResponse = await sendRequest('tools/call', {
      name: 'create_post',
      arguments: {
        title: 'Test Post',
        content: 'This is a test post',
        author: 'Test Author',
      },
    });
    
    if (createResponse.result) {
      console.log('✅ create_post executed (placeholder mode)');
    } else {
      console.log('❌ create_post failed');
    }
    
    console.log('\n✨ All tests completed!');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    server.kill();
    process.exit(0);
  }
}

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// Run tests
runTests();
