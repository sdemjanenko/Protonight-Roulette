$(init);

var MeetingModel = Backbone.Model.extend({ defaults: { count: 0 } });
var MeetingCollection = Backbone.Collection.extend({
  model: MeetingModel,
  url: "/meetings"
});

var MeetingRowView = Backbone.View.extend({
  skeleton: $("#meetingRowSkeleton"),
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
    return this;
  },
  open: function() {
    console.log("opening", this);
  }
});

var MeetingListView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.collection, "reset", this.render);
    this.listenTo(this.collection, "add", this.addRow);
  },
  render: function() {
    var _this = this;
    _.each(this.collection.models, function(model) { _this.addRow(model); });
    return this;
  },
  addRow: function(model) {
    var row_view = new MeetingRowView({ model: model });
    this.$el.append(row_view.$el);
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

  meetings.fetch();
}


function createMeeting() {
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
}

function joinMeeting() {
  console.log("joining meeting");
  //$("#join").submit();
}


