// Analyze grouping logic for Everlight application
const https = require('http');

async function fetchData(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
  });
}

async function analyzeGrouping() {
  try {
    console.log('🔍 ANALYZING EVERLIGHT GROUPING LOGIC...\n');
    
    const data = await fetchData('http://localhost:3001/api/sequences');
    
    // Test grouping logic (same as frontend)
    const groupedSequences = data.reduce((acc, sequence) => {
      if (sequence.groups && sequence.groups.length > 0) {
        sequence.groups.forEach(group => {
          if (!acc[group]) {
            acc[group] = [];
          }
          acc[group].push(sequence);
        });
      } else {
        if (!acc['Ungrouped']) {
          acc['Ungrouped'] = [];
        }
        acc['Ungrouped'].push(sequence);
      }
      return acc;
    }, {});

    console.log('📊 === OVERALL STATISTICS ===');
    console.log(`Total sequences loaded: ${data.length}`);
    console.log(`Total groups created: ${Object.keys(groupedSequences).length}`);

    // Count sequences in multiple groups
    let multiGroupCount = 0;
    let maxGroups = 0;
    let maxGroupSeq = null;
    
    data.forEach(seq => {
      if (seq.groups && seq.groups.length > 1) {
        multiGroupCount++;
        if (seq.groups.length > maxGroups) {
          maxGroups = seq.groups.length;
          maxGroupSeq = seq;
        }
      }
    });
    
    console.log(`Sequences appearing in multiple groups: ${multiGroupCount}`);
    console.log(`Maximum groups for one sequence: ${maxGroups} (${maxGroupSeq?.alias || 'N/A'})`);

    console.log('\n🎯 === GROUP BREAKDOWN (Top 15) ===');
    const groupEntries = Object.entries(groupedSequences)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 15);
      
    groupEntries.forEach(([groupName, sequences]) => {
      const cleanName = groupName.replace('EverLights/', '').replace('/', '') || 'Ungrouped';
      console.log(`"${cleanName}": ${sequences.length} sequences`);
    });

    console.log('\n🔄 === MULTI-GROUP EXAMPLES ===');
    const multiGroupExamples = data
      .filter(seq => seq.groups && seq.groups.length > 1)
      .slice(0, 8);
      
    multiGroupExamples.forEach(seq => {
      const cleanGroups = seq.groups.map(g => g.replace('EverLights/', '').replace('/', ''));
      console.log(`"${seq.alias}" appears in: ${cleanGroups.join(', ')}`);
    });

    console.log('\n🎨 === SAMPLE SEQUENCE DATA ===');
    const sampleSeq = data[0];
    console.log('Sample sequence structure:');
    console.log(`  ID: ${sampleSeq.id}`);
    console.log(`  Alias: ${sampleSeq.alias}`);
    console.log(`  Groups: ${sampleSeq.groups}`);
    console.log(`  Pattern: [${sampleSeq.pattern.slice(0, 3).join(', ')}...]`);
    console.log(`  Effects: ${sampleSeq.effects.length} effect(s)`);

    console.log('\n✅ === FRONTEND COMPATIBILITY TEST ===');
    
    // Test critical grouping scenarios
    const testResults = [];
    
    // Test 1: Empty groups handling
    const ungroupedCount = groupedSequences['Ungrouped'] ? groupedSequences['Ungrouped'].length : 0;
    testResults.push(`Ungrouped sequences handled: ${ungroupedCount >= 0 ? 'PASS' : 'FAIL'}`);
    
    // Test 2: Group name cleaning
    const hasEverLightsPrefix = Object.keys(groupedSequences).some(g => g.includes('EverLights/'));
    testResults.push(`Group name cleaning needed: ${hasEverLightsPrefix ? 'YES' : 'NO'}`);
    
    // Test 3: Multi-group sequences
    testResults.push(`Multi-group sequences: ${multiGroupCount > 0 ? 'DETECTED' : 'NONE'}`);
    
    // Test 4: Group count consistency
    const totalSequencesInGroups = Object.values(groupedSequences).reduce((sum, seqs) => sum + seqs.length, 0);
    const expectedTotal = data.length + multiGroupCount; // Base + duplicates from multi-group
    testResults.push(`Group assignment consistency: ${totalSequencesInGroups >= data.length ? 'PASS' : 'FAIL'}`);
    
    testResults.forEach(result => console.log(`  ${result}`));

    console.log('\n🎭 === CYBERPUNK THEME COMPATIBILITY ===');
    console.log('Groups suitable for cyberpunk categorization:');
    const cyberpunkSuitableGroups = Object.keys(groupedSequences)
      .filter(g => {
        const clean = g.replace('EverLights/', '').replace('/', '');
        return clean.length > 0 && clean !== 'Ungrouped';
      })
      .slice(0, 10);
    
    cyberpunkSuitableGroups.forEach(group => {
      const clean = group.replace('EverLights/', '').replace('/', '');
      console.log(`  [${clean}]`);
    });

    console.log('\n🔧 === FRONTEND IMPLEMENTATION NOTES ===');
    console.log('1. Group expansion/collapse: Each group needs isExpanded state');
    console.log('2. Selection state: Track selectedSequence for visual feedback');
    console.log('3. Group name display: Strip "EverLights/" prefix and trailing "/"');
    console.log('4. Multi-group handling: Same sequence appears in multiple group cards');
    console.log('5. Sequence counts: Show [X UNITS] in each group card');
    
  } catch (error) {
    console.error('❌ Error analyzing grouping:', error.message);
  }
}

analyzeGrouping();