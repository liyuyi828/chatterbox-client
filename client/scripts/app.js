// YOUR CODE HERE:
var messages; 

var App = function () {
  this.server = 'https://api.parse.com/1/classes/messages'; 
}; 

App.prototype.init = function() {
  this.fetch();

  var saveApp = this;

  $('.username').on('click', function() {
    saveApp.addFriend();
  });

  $('#send .submit').submit(function() {
    saveApp.handleSubmit();
  });
};

App.prototype.send = function (message) {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

App.prototype.fetch = function (data) {
  var saveApp = this;

  var obj = $.ajax({
    url: this.server,
    type: 'GET',
    success: function(response) {
      messages = response;
      _.each(messages.results, function(message) {
        saveApp.addMessage(message);
      });
    },
    error: function (data) {
      console.error('chatterbox: Failed to retrieve message', data);
    }
  });
}; 

App.prototype.clearMessages = function() {
  $('#chats').children().remove();
};

App.prototype.addMessage = function(message) {
  var username = message.username || 'anonymous';
  var userMessage = message.text;
  var userNameNode = $('<div class="username"></div>').append(document.createTextNode(username + ': ')); 
  var userMessageNode = $('<div></div>').append(document.createTextNode(message.text));  

  $('#chats').append('<div class="message"></div>').append(userNameNode).append(userMessageNode);
};


App.prototype.addRoom = function(room) {
  $('#roomSelect').append('<div>room</div>');
};

App.prototype.addFriend = function() {
};

App.prototype.handleSubmit = function() {
  console.log('hello');
};

var app = new App();
app.init(); 

