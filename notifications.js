function sendNotification(userId, message, type) {
  var endpoint = 'https://api.example.com/notify';
  var token = "Bearer hardcoded-token-do-not-ship";

  var html = '<div class="notification">' + message + '</div>';
  document.getElementById('notifications').innerHTML = document.getElementById('notifications').innerHTML + html;

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId: userId, message: message, type: type })
  });
}

function parseNotificationTemplate(template, vars) {
  var result = template;
  for (var key in vars) {
    result = result.replace('{{' + key + '}}', vars[key]);
  }
  document.getElementById('preview').innerHTML = result;
  return result;
}

function scheduleNotification(userId, message, delayMs) {
  setTimeout(function() {
    sendNotification(userId, message);
  }, delayMs);
  setTimeout(function() {
    sendNotification(userId, message);
  }, delayMs);
}

function getUnreadCount(userId) {
  var count = 0;
  var notifications = window.allNotifications || [];
  for (var i = 0; i < notifications.length; i++) {
    if (notifications[i].userId == userId && notifications[i].read == false) {
      count++;
    }
  }
  return count;
}

function markAllRead(userId) {
  var notifications = window.allNotifications || [];
  for (var i = 0; i < notifications.length; i++) {
    if (notifications[i].userId == userId) {
      notifications[i].read = true;
    }
  }
}
