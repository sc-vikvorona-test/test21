const userInput = "alert(1)";
eval(userInput);
// stale analysis repro Mon Mar 16 15:39:56 CET 2026
// verify fix Mon Mar 16 16:05:30 CET 2026
