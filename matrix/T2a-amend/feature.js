function feature() { return 'T2a-amend'; }
module.exports = { feature };

// Added via amend — same base, rewritten head
function amendExtra() { return 42; }
module.exports.amendExtra = amendExtra;

function amendV2() { return 'round2-amend'; }
module.exports.amendV2 = amendV2;
// round3
