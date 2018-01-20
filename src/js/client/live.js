function generateFeedItem (status) {
  const $socialItem = $('<div class="live-social-feed-item four unit row"><div class="live-social-feed-item-content unit column grows"></div></div>');
  const $socialTitle = $('<h4></h4>');
  $socialTitle.text(status.username);
  const $socialContent = $('<p></p>');
  $socialContent.html(status.text);
  $socialItem.find('.live-social-feed-item-content').append($socialTitle).append($socialContent);
  if (status.image) {
    $socialItem.find('.live-social-feed-item-content').css('background-image', `linear-gradient(to top, rgba(0, 0, 0, 0.6) 0, rgba(0, 0, 0, 0.2) 200px, rgba(0, 0, 0, 0)), url(${status.image})`);
  }
  return $socialItem;
}

function cycleFeedItems (statuses, element) {
  for (const statusData in statuses) {
    function feedItem(statuses) {
      return generateFeedItem(statuses[statusData]);
    };
    setTimeout(function () {
      $(element).children().remove();
      $(element).append(feedItem(statuses));
    }, 5000);
  }
}

const Countdown = require('../shared/countdown');

const Pusher = require('pusher-js');
const $ = require('jquery');

function initialiseLive() {
  const pusher = new Pusher(window.liveConfig.pusherKey, {
    encrypted: true,
    cluster: 'eu',
  });

  const liveUpdates = pusher.subscribe('live-updates');
  let lastStatusId = null;

  $('.live-social-feed-content').each(function () {
    liveUpdates.bind('social', data => {
      if (data.statuses[0].id_str !== lastStatusId) {
        lastStatusId = data.statuses[0].id_str;
        const statuses = data.statuses;
        cycleFeedItems(statuses, '.live-social-feed-content');
      }
    });
  });

  $('.event-countdown').each(function () {
    let countdown = Countdown.createChainedCountdown();
    countdown.onCount = (rendered) => $(this).html(rendered);
    countdown.start();
  });
  
  function rotateCube() {
    const x = Math.random() * 360;
    const y = Math.random() * 360;
    const z = Math.random() * 360;
    $('#cube-logo').css('transform', 'rotateX(' + x + 'deg) rotateY(' + y + 'deg) rotateZ(' + z + 'deg)');
  }
  
  $('#cube-logo').each(setInterval(rotateCube, 5000));
}

module.exports = () => {
  if (window.liveConfig) {
    initialiseLive();
  }
};
