// YOUR CODE HERE:
$(document).ready(function() {


  var App = function () {
    this.server = 'https://api.parse.com/1/classes/messages'; 
  }; 

  App.prototype.init = function() {
     
    this.fetch();

    var saveApp = this;

    $('#chats').on('click', '.username', function() {
      saveApp.addFriend($(this).val());
    });

    $('.submitButton').on('click', function(event) {
      event.preventDefault();
      saveApp.handleSubmit($('#message').val());
      $('#message').val('');
    });

    $('#roomSelect select').on('change', function() {
      room = $(this).val();
      saveApp.fetch(); 
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
    $('#chats').children().hide();
  };

  App.prototype.addMessage = function(message) {

    var username = message.username || 'anonymous';
    var userMessage = message.text;
    var userRoom = message.roomname;

    if (userRoom === room) {
      // Create DOM nodes for the message and append them
      // to the chats section
      var messageNode = $('<div class="message"></div>');
      var userNameNode = $('<div class="username"></div>')
          .append(document.createTextNode(username + ': '))
          .val(username);
      var userMessageNode = $('<div></div>')
          .append(document.createTextNode(message.text));  

      messageNode.append(userNameNode);
      if (friends[username]) {
        messageNode.addClass('friend');
      }
      messageNode.append(userMessageNode);

      $('#chats').append(messageNode);
    }

    // check if chat room exist, if not, create a new tag on the drop down menu
    if (allRooms[userRoom] === undefined && userRoom) {
      allRooms[userRoom] = true; 
      var $option = $('<option></option>').val(userRoom).text(userRoom);
      $('#roomSelect select').append($option);
    } 
  };

  App.prototype.addRoom = function(room) {
    $('#roomSelect').append('<div>room</div>');
  };

  App.prototype.addFriend = function(friend) {
    friends[friend] = true;
  };

  App.prototype.handleSubmit = function(message) {
    var messageObj = {
      username: username, 
      text: message,
      roomname: room
    };
    this.send(messageObj);
    event.preventDefault();
  };

  var app = new App();
  var messages, room;
  var allRooms = {}; 
  var friends = {};
  var username = window.location.search.split('=')[1]; 
  app.init(); 

});


