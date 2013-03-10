const _ = require('sdk/l10n').get;
const data = require('sdk/self').data;
const panels = require('sdk/panel');
const tabs = require('sdk/tabs');
const widgets = require('sdk/widget');

exports.main = function () {
  const panel = panels.Panel({
    height : 38,
    contentURL : data.url('no-feed.html')
  });

  const widget = widgets.Widget({
    id : 'subtome',
    label : _('SUBSCRIBE_TO_PAGE'),
    contentURL : data.url('toolbar-icon.png'),
    onClick : function () {
      var worker = tabs.activeTab.attach({
        contentScriptFile : data.url('subtome.js')
      });

      worker.port.on('pageHasNoFeed', function () {
        panel.show();
      });
    }
  });
};
