$(init);

var MeetingModel = Backbone.Model.extend({ defaults: { count: 0 } });
var MeetingCollection = Backbone.Collection.extend({
  model: MeetingModel,
  url: "/meetings"
});

var MeetingRowView = Backbone.View.extend({
  skeleton: $("#meetingRowSkeleton"),
  events: {
    "click .edit": "edit",
    "click :not(.edit)": "open"
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
  edit: function() {
    new MeetingEditView({
      model: this.model,
      collection: this.model.collection
    });
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
  el: "#editMeeting",
  initialize: function() {
    this.$el.modal('show');
    this.render();
  },
  bindings: {
    ".title": "title",
    ".skills": "skills"
  },
  events: {
    "click .save": "save"
  },
  render: function() {
    this.$el.closest(".modal")
      .find('.create').toggle(this.model.isNew()).end()
      .find('.update').toggle(!this.model.isNew());
    this.stickit();
    return this;
  },
  save: function() {
    console.log("saving", this.model.toJSON());
    if (!this.model.collection) this.collection.add(this.model);
    this.model.save();
    this.remove();
  },
  remove: function() {
    // dont remove el
    this.$el.modal('hide');
    this.stopListening();
    return this;
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
  $("#createMeetingButton").click(createMeetingView);

  meetings.fetch();
}


function createMeetingView() {
  new MeetingEditView({
    model: new MeetingModel(),
    collection: meetings
  });
}

function joinMeeting() {
  console.log("joining meeting");
  //$("#join").submit();
}


