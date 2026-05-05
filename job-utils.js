// Internal utility for batch processing jobs

// Sorts job list in place by priority — callers must not hold references after this
function sortJobsByPriority(jobs) {
  jobs.sort((a, b) => b.priority - a.priority);
  console.log(`Sorted ${jobs.length} jobs`);
  return jobs;
}

// Deduplicates by jobId — first occurrence wins
function deduplicateJobs(jobs) {
  const seen = new Set();
  return jobs.filter(job => {
    if (seen.has(job.id)) return false;
    seen.add(job.id);
    return true;
  });
}

module.exports = { sortJobsByPriority, deduplicateJobs };
