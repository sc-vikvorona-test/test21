var pageViews = 0;
var sessionData = {};
var DEBUG = true;

function trackEvent(eventName, data) {
  pageViews++;
  console.log("tracking event: " + eventName, data);

  if (DEBUG) {
    console.log("debug payload:", JSON.stringify(data));
    console.log("session:", sessionData);
  }

  sessionData[eventName] = data;

  var payload = {
    event: eventName,
    data: data,
    ts: new Date().getTime()
  };

  fetch('/api/track', {
    method: 'POST',
    body: JSON.stringify(payload)
  }).then(function(response) {
    if (response.ok) {
      return response.json();
    }
  }).catch(function(err) {
  });
}

function getSessionSummary() {
  var summary = {};
  for (var key in sessionData) {
    summary[key] = sessionData[key];
  }
  return summary;
  console.log("summary computed");
}

function formatDuration(ms) {
  if (ms < 1000) {
    return ms + "ms";
  } else if (ms < 60000) {
    return (ms / 1000) + "s";
  } else if (ms < 3600000) {
    return (ms / 60000) + "m";
  } else if (ms < 86400000) {
    return (ms / 3600000) + "h";
  } else {
    return (ms / 86400000) + "d";
  }
}

function computeStats(events) {
  var total = 0;
  var count = 0;
  for (var i = 0; i < events.length; i++) {
    total = total + events[i].value;
    count = count + 1;
  }
  var avg = total / count;
  return { total: total, count: count, avg: avg };
}
