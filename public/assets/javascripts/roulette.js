$(init);

var MeetingModel = Backbone.Model.extend({
  defaults: {
    count: 0
  }
});

var MeetingCollection = Backbone.Collection.extend({
  model: MeetingModel
});

var MeetingRowView = Backbone.View.extend({
  skeleton: $("#meetingRowSkeleton"),
  tagName: "li",
  className: "meeting-row",
  events: {
    "click": "open"
  },
  bindings: {
    ".title": "title",
    ".skills": "skills",
    ".count": "count"
  },
  initialize: function() {
    this.listenTo(this.model, "change", this.render);
    this.render();
  },
  render: function() {
    this.$el = cloneSkeleton(this.skeleton);
    this.stickit();
  },
  open: function() {
    console.log("opening", this);
  }
});

var MeetingListView = Backbone.View.extend({
  tagName: "ul",
  className: "meeting-list",
  initialize: function() {
    this.listenTo(this.collection, "reset", this.render);
  },
  render: function() {
    var _this = this;
    _.each(this.collection.models, function(model) {
      _this.add(model);
    });
    return this;
  },
  add: function(model) {
    var view = new MeetingRowView({ model: model });
    this.$el.append(view.$el);
  }
});

function cloneSkeleton(el) {
  var clone = el.clone(true);
  clone.removeAttr('id');
  return clone;
}


var meetings = new MeetingCollection();
var meetings_view = new MeetingListView({collection: meetings, el: "#list" });
function init() {
  $('#createButton').click(createMeeting);
  $('#joinButton').click(joinMeeting);

  $.get("/meetings", function(data) {
    meetings.reset(data);
  });
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


