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

var MeetingEditView = Backbone.View.extend({
  el: "#createMeeting",
  bindings: {
    ".title": "title",
    ".skills": "skills"
  },
  events: {
    "click .create": "addToCollection"
  },
  render: function() {
    this.stickit();
    return this;
  },
  addToCollection: function() {
    console.log("json", this.model.toJSON());
    this.collection.add(this.model);
    this.model.save();
    this.$el.modal('hide');
    this.remove();
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
  $("#createMeeting").on('show', createMeetingView);

  meetings.fetch();
}


function createMeetingView() {
  var new_meeting = new MeetingModel();
  var view = new MeetingEditView({
    model: new_meeting,
    collection: meetings
  });
}

function joinMeeting() {
  console.log("joining meeting");
  //$("#join").submit();
}


