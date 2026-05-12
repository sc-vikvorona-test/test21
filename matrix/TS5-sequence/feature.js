function feature() { return 'TS5-sequence'; }
module.exports = { feature };

// TS5 step 2: linear push AFTER a D1 (which mis-fired as full)
function step2() { return 'linear-after-rebase'; }
module.exports.step2 = step2;
