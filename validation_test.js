#!/usr/bin/env node

const http = require('http');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

// Test function to make HTTP requests
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data && method !== 'GET') {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runValidation() {
  console.log('🔍 EVERLIGHT CONTROL APPLICATION VALIDATION');
  console.log('=' .repeat(50));

  const results = {
    mainPage: false,
    sequencesAPI: false,
    submitAPI: false,
    cyberpunkTheme: false,
    sequences: [],
    groups: [],
    errors: []
  };

  try {
    // Test 1: Main page accessibility
    console.log('\n1. Testing main page accessibility...');
    try {
      const mainPageResponse = await makeRequest('/');
      console.log(`✓ Main page status: ${mainPageResponse.status}`);
      
      if (mainPageResponse.status === 200) {
        results.mainPage = true;
        
        // Check for cyberpunk theme elements in the HTML
        const html = mainPageResponse.body;
        const cyberpunkElements = [
          'cyberpunk-grid',
          'neon-text',
          'matrix-rain',
          'scan-lines',
          'EVERLIGHT CONTROL',
          'terminal-brackets',
          'glitch'
        ];
        
        const foundElements = cyberpunkElements.filter(element => html.includes(element));
        console.log(`✓ Cyberpunk theme elements found: ${foundElements.length}/${cyberpunkElements.length}`);
        console.log(`  - ${foundElements.join(', ')}`);
        
        if (foundElements.length >= 5) {
          results.cyberpunkTheme = true;
          console.log('✓ Cyberpunk theme is fully implemented');
        } else {
          console.log('⚠ Some cyberpunk theme elements may be missing');
        }
      }
    } catch (error) {
      console.log(`✗ Main page error: ${error.message}`);
      results.errors.push(`Main page: ${error.message}`);
    }

    // Test 2: Sequences API
    console.log('\n2. Testing /api/sequences endpoint...');
    try {
      const sequencesResponse = await makeRequest('/api/sequences');
      console.log(`✓ Sequences API status: ${sequencesResponse.status}`);
      
      if (sequencesResponse.status === 200) {
        results.sequencesAPI = true;
        try {
          const sequences = JSON.parse(sequencesResponse.body);
          results.sequences = sequences;
          
          console.log(`✓ Found ${sequences.length} light sequences`);
          
          // Analyze grouping
          const groupSet = new Set();
          sequences.forEach(seq => {
            if (seq.groups && Array.isArray(seq.groups)) {
              seq.groups.forEach(group => groupSet.add(group));
            }
          });
          
          results.groups = Array.from(groupSet);
          console.log(`✓ Found ${results.groups.length} unique groups:`);
          results.groups.forEach(group => {
            const groupSequences = sequences.filter(seq => 
              seq.groups && seq.groups.includes(group)
            );
            console.log(`  - ${group}: ${groupSequences.length} sequences`);
          });
          
          // Check for sequences appearing in multiple groups
          const multiGroupSequences = sequences.filter(seq => 
            seq.groups && seq.groups.length > 1
          );
          console.log(`✓ ${multiGroupSequences.length} sequences appear in multiple groups`);
          
          if (multiGroupSequences.length > 0) {
            console.log('  Multi-group examples:');
            multiGroupSequences.slice(0, 3).forEach(seq => {
              console.log(`    - "${seq.alias || seq.pattern}": ${seq.groups.join(', ')}`);
            });
          }
          
        } catch (parseError) {
          console.log(`✗ Failed to parse sequences JSON: ${parseError.message}`);
          results.errors.push(`Sequences parsing: ${parseError.message}`);
        }
      }
    } catch (error) {
      console.log(`✗ Sequences API error: ${error.message}`);
      results.errors.push(`Sequences API: ${error.message}`);
    }

    // Test 3: Submit API with a sample sequence
    console.log('\n3. Testing /api/submit endpoint...');
    if (results.sequences.length > 0) {
      try {
        const testSequence = results.sequences[0];
        const submitData = {
          pattern: testSequence.pattern,
          colorMode: testSequence.colorMode,
          effects: testSequence.effects
        };
        
        console.log(`  Testing with sequence: "${testSequence.alias || testSequence.pattern}"`);
        const submitResponse = await makeRequest('/api/submit', 'POST', submitData);
        console.log(`✓ Submit API status: ${submitResponse.status}`);
        
        if (submitResponse.status === 200) {
          results.submitAPI = true;
          console.log('✓ Successfully submitted a test sequence');
        } else {
          console.log(`⚠ Submit API returned status ${submitResponse.status}`);
          console.log(`  Response: ${submitResponse.body.substring(0, 200)}`);
        }
      } catch (error) {
        console.log(`✗ Submit API error: ${error.message}`);
        results.errors.push(`Submit API: ${error.message}`);
      }
    } else {
      console.log('⚠ Skipping submit test - no sequences available');
    }

  } catch (error) {
    console.log(`✗ General validation error: ${error.message}`);
    results.errors.push(`General: ${error.message}`);
  }

  // Final Report
  console.log('\n' + '='.repeat(50));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(50));
  
  console.log(`Main Page Accessible: ${results.mainPage ? '✅ YES' : '❌ NO'}`);
  console.log(`Cyberpunk Theme Active: ${results.cyberpunkTheme ? '✅ YES' : '❌ NO'}`);
  console.log(`Sequences API Working: ${results.sequencesAPI ? '✅ YES' : '❌ NO'}`);
  console.log(`Submit API Working: ${results.submitAPI ? '✅ YES' : '❌ NO'}`);
  console.log(`Total Sequences: ${results.sequences.length}`);
  console.log(`Total Groups: ${results.groups.length}`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ ERRORS ENCOUNTERED:');
    results.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  const overallScore = [
    results.mainPage,
    results.cyberpunkTheme,
    results.sequencesAPI,
    results.submitAPI
  ].filter(Boolean).length;
  
  console.log(`\n🏆 OVERALL SCORE: ${overallScore}/4`);
  
  if (overallScore === 4) {
    console.log('🎉 ALL SYSTEMS OPERATIONAL! The application is working perfectly.');
  } else if (overallScore >= 3) {
    console.log('⚠ Application is mostly functional with minor issues.');
  } else {
    console.log('🚨 Application has significant issues that need attention.');
  }
  
  // Write results to file
  fs.writeFileSync('/home/chid/git/everlight-api/validation_results.json', JSON.stringify(results, null, 2));
  console.log('\n📄 Detailed results saved to validation_results.json');
}

// Run the validation
runValidation().catch(console.error);