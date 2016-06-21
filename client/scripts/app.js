// YOUR CODE HERE:
$(document).ready(function() {


  var App = function () {
    this.server = 'https://api.parse.com/1/classes/messages'; 
  }; 

  App.prototype.init = function() {
     
    this.fetch();

    var saveApp = this;

    $('.username').on('click', function() {
      saveApp.addFriend();
    });

    $('.submitButton').on('click', function() {
      saveApp.handleSubmit($('#message').val());
    });

    $('#roomSelect select').on('change', function() {
      var room = $(this).val();

      $('.message').children().filter('.' + room).parent().css('background-color', 'blue');
    });

    setInterval(function() {
      saveApp.fetch();
    }, 10000);

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
        $('#chats').children().remove();
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
    var userRoom = message.roomname;

    // Create DOM nodes for the message and append them
    // to the chats section
    var messageNode = $('<div class="message"></div>');
    var userNameNode = $('<div class="username"></div>')
        .append(document.createTextNode(username + ': '))
        .addClass(userRoom); 
    var userMessageNode = $('<div></div>')
        .append(document.createTextNode(message.text));  

    messageNode.append(userNameNode);
    messageNode.append(userMessageNode);

    $('#chats').append(messageNode);

    // check if chat room exist, if not, create a new tag on the drop down menu
    if ( !$('#roomSelect select').children().hasClass(userRoom) && userRoom) {
      $('#roomSelect select').append('<option class="' + userRoom + '" value="' + userRoom + '">' + userRoom + '</option>');
    } 
  };


  App.prototype.addRoom = function(room) {
    $('#roomSelect').append('<div>room</div>');
  };

  App.prototype.addFriend = function() {
  };

  App.prototype.handleSubmit = function(message) {
    var messageObj = {
      username: username, 
      text: message
    };
    this.send(messageObj);
  };

  var app = new App();
  var messages; 
  var username = window.location.search.split('=')[1]; 
  app.init(); 

});


