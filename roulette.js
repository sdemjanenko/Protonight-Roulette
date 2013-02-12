$(init);

function init() {
  $('#createMeeting').click(createMeeting);
  $('#joinMeeting').click(joinMeeting);
}

function createMeeting() {
  console.log("creating meeting");
  $("#create").submit();
}

function joinMeeting() {
  console.log("joining meeting");
  $("#join").submit();
}