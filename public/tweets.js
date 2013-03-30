var socket = io.connect('#{script_url}', {
  'reconnect': true,
  'reconnection delay': 500,
  'max reconnection attempts': 10
});
var ready = true;
var re = /((^|\s)((https?:\/\/)[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?))/gi;
var max_keep = 100;
var startup = true;
var tweets = new Array();
var display_for_ms = 5500;
var total = 0;

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

function isUrl(s) {
  return re.test(s);
}

function populateTweet(data) {
  var spans = '<span>' + data.split.join('</span> <span>') + '</span><br/><span class="screen_name">@' + data.user.screen_name + ' ' + getRandomDiss() + '</span> <span class="time_since">' + jQuery.timeago(data.created_at) + '</span>';
  $('#tweet').html("");
  $(spans).hide().appendTo('#tweet').each(function(i) {
    if($(this).text().startsWith("@") && !$(this).hasClass('screen_name')) {
      t = $(this).text().replace(/(@[\w]+)/, '<span class="username">$1</span>')
      $(this).html(t);
    } else if($(this).text().startsWith("#")) {
      t = $(this).text().replace(/(#\w+)/, '<span class="hashtag">$1</span>')
      $(this).html(t);
    } else if(isUrl($(this).text())) {
      t = $(this).text().replace(re, '<span class="link">$1</span>')
      $(this).html(t);
    } else if($(this).text().toLowerCase() == "defiantly") {
      t = '<span class="defiantly">defiantly</span>'
      $(this).html(t);
    }
    $(this).delay(10 * i).fadeIn(100);
  });
}

function clearAndPopulateNextTweet(data) {
  if($("#tweet span").length == 0) {
    populateTweet(data);
  } else {
    $($("#tweet span").get().reverse()).each(function(i) { 
      $(this).delay(10 * i).fadeOut(150, function() { 
        $(this).remove();
        if($("#tweet span").length == 0) {
          setTimeout(function() {
            populateTweet(data);
          }, 250);
        }
      });
    });
    
  }
}

function showNextTweet() {
  var data = tweets.shift();
  $("#number").html(tweets.length);
  if(data) {
    $('#tweet').fadeIn(100, function() {
      clearAndPopulateNextTweet(data);
    });
  }
}

socket.on('tweet', function (data) {
  console.log('socket tweet function');
  hideLoadingPanel();
  $("#total_number").html(total++);
  if(data.text) {
    tweets.push(data);
    if(tweets.length > max_keep) {
      var evicted = tweets.splice(max_keep - 1, 1)[0];
      $("#evicted_tweet").text(evicted.text);
    }
    if(startup) {
      showNextTweet();
      setInterval('showNextTweet()', display_for_ms);
      startup = false;
    }
    $("#number").html(tweets.length);
  }
});

function getRandomDiss() {
  var randomNum = Math.floor(Math.random()*9);
  var diss = "didn't listen in school.";

  switch(randomNum)
  {
  case 1:
    diss = "didn't listen in school.";
    break;
  case 2:
    diss = "always hated English.";
    break;
  case 3:
    diss = "has given up fighting with autocorrect.";
    break;
  case 4:
    diss = "ROFLomGz lolZ! x x";
    break;
  case 5:
    diss = "couldn't care less.";
    break;
  case 6:
    diss = "isn't a pretentious Grammar Nazi.";
    break;
  case 8:
    diss = "loves that album by Oasis, 'Defiantly Maybe'.";
    break;
  }

  return diss;
}

function hideLoadingPanel() {
  $("#loading").fadeOut();
}

console.log('page load');
$(document).ready(function() {
  console.log("document read");
});
