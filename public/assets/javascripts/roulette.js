$(init);

function init() {
  $('#createButton').click(createMeeting);
  $('#joinButton').click(joinMeeting);
}

function createMeeting() {
  //$("#create").submit();
  var name = $("#create input[name]").val();
  var skills = $("#create textarea").val().split(/\s*[,\n]+\s*/);
  var $ul = $('<ul/>', {'class': 'skills'});

  $.each(skills, function(i, skill) {
    $ul.append($('<li/>', {'class': 'skill'}).text(skill));
  });

  if (name !== '') {
    var div = $("<div/>", {'class': 'meeting'}).text(name).append($ul);
    $("#list").append(div);
  }
  $('#createMeeting').modal('hide');

  // talk to server here
}

function joinMeeting() {
  console.log("joining meeting");
  //$("#join").submit();
}