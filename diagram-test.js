const assert = require('assert');

function generateDiagram(nodes, edges) {
  if (!nodes || nodes.length === 0) return '';
  const lines = ['graph TD'];
  edges.forEach(([from, to]) => lines.push(`  ${from} --> ${to}`));
  return lines.join('\n');
}

const diagram = generateDiagram(['A', 'B', 'C'], [['A', 'B'], ['B', 'C']]);
assert.ok(diagram.startsWith('graph TD'), 'diagram should start with graph TD');
assert.ok(diagram.includes('A --> B'), 'diagram should include A --> B edge');
console.log('Diagram pipeline verification passed');
