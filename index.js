/* globals truex */

var options = {
  network_user_id: "test_user_1",
  partner_config_hash: "938502d5ba011a8aef31111fec543c11d2f23856"
};

// initialize trueX ad client w/ options hash
truex.client(options, function (client) {
  requestTrueXAdsAndDisplay(client);
});

// make call to trueX for available ads
function requestTrueXAdsAndDisplay(client) {
  log("Ads Requested");
  client.requestActivity(function (truexAd) {
    //var truexAd = ads.shift();
    if (truexAd) {
      showTrueXOptIn(truexAd, client);
    } else {
      log("No ads available.");
    }
  });
}

function showTrueXOptIn(truexAd, client) {
  // add TrueX event handlers
  truexAd.onStart(function (activity) {
    // ad started
    log("start");
  });
  truexAd.onCredit(function (engagement) {
    // user spent 30 seconds and interacted at least once
    log("credit");
    console.log(engagement);
  });
  truexAd.onClose(function (activity) {
    // user closed the ad unit
    log("close");
    containerClose();
    requestTrueXAdsAndDisplay(client);
  });
  truexAd.onFinish(function (activity) {
    // user got to end of ad
    log("finish");
  });
  truexAd.onMessage(function (payload) {
    log("onMessage = " + payload);
  });

  // add TrueX Opt-in to DOM
  var truex_container = document.getElementById("truex_ad");
  truex_container.innerHTML = `<a id='ad_opt_in_link' href='#'><img src ='${truexAd.image_url}'></br>${truexAd.name}</a></br>`;

  // track TrueX Trigger Point Impression
  //client.trackTriggerPointImpression(truexAd);

  // handle opt-in click event
  document.getElementById("ad_opt_in_link").onclick = function () {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("modal").style.display = "block";
    document.getElementById("content").style.display = "block";
    client.loadActivityIntoContainer(
      truexAd,
      document.getElementById("content"),
      { width: "960px", height: "540px" }
    );
  };
}

function containerClose() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("modal").style.display = "none";
  document.getElementById("content").style.display = "none";
  document.getElementById("content").innerHTML = "";
}

function log(msg) {
  console.log("[%s] - %s", new Date().toLocaleTimeString(), msg);
}
