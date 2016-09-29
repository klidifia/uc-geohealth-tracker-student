(function($){
  "use strict";

  var init = function() {
    $("#login").click(login);

    var token = localStorage.getItem('geotrackertoken');
    if (token) {
      track();
      $("div#tracking").show()
    }
    else {
      // No token, so present a UI asking for credentials.
      $("div#login-form").show()
    }
  };

  var login =  function() {

    var data = JSON.stringify({ "username": $("#username").val(), "password" : $("#password").val(), participant: $("#participant").val() });

    $.ajax({
      type: 'POST',
      data: data,
      url: 'https://geohealthtracker.catalystdemo.net.nz/api/token',
      success: function(data) {
        localStorage.setItem('geotrackertoken', data);
        location.reload();
      },
      error: function() {
        $(".alert").css("display", "inline-block");
      }
    });

  };

  var track = function() {
    backgroundGeolocation.configure(callbackFn, failureFn, {
      // Desired accuracy (metres). Possible values [0, 10, 100, 1000].
      desiredAccuracy: 100,
      // The minimum distance (metres) the device must move beyond the stationary location for aggressive background-tracking to engage.
      stationaryRadius: 100,
      // The minimum distance (metres) a device must move horizontally before an update event is generated.
      distanceFilter: 100,
      debug: true,
      // Set stopOnTerminate in order to force a stop() when the application is terminated. (default true).
      stopOnTerminate: false,
      // Android.
      startOnBoot: true,
      startForeground: false,
      locationProvider: backgroundGeolocation.provider.ANDROID_ACTIVITY_PROVIDER,
      interval: 15 * 60 * 1000,
      fastestInterval: 15 * 60 * 1000,
      activitiesInterval: 15 * 60 * 1000,
      stopOnStillActivity: false,
      // iOS.
      activityType: 'OtherNavigation',
      saveBatteryOnBackground: false,
      pauseLocationUpdates: false,
      // Server.
      url: 'https://geohealthtracker.catalystdemo.net.nz/api/push',
      syncUrl: 'https://geohealthtracker.catalystdemo.net.nz/api/push',
      syncThreshold: 10,
      httpHeaders: {
        'Authorization': 'Token ' + localStorage.getItem('geotrackertoken')
      },
      maxLocations: 100
    });

    // Turn on the background-geolocation system.
    backgroundGeolocation.start();

    // Normally plugin will handle switching between BACKGROUND/FOREGROUND
    // mode itself. Calling switchMode you can override plugin behavior and
    // forces the plugin to switch into other mode. In FOREGROUND mode
    // the plugin uses iOS local manager to receive locations and behavior
    // is affected by option.desiredAccuracy and option.distanceFilter.
    // In BACKGROUND mode plugin uses significant changes and region
    // monitoring to recieve locations and uses option.stationaryRadius only.
    backgroundGeolocation.switchMode(backgroundGeolocation.mode.FOREGROUND);
  };

  /**
   * Callback executed when a geolocation is recorded in the background.
   */
  var callbackFn = function(location) {
    $("div#display").append("<p>Geolocation event recorded:<br/>Time: " + dateTime(location.time) + "<br/>Latitude: " + location.latitude + "<br/>Longitude: " + location.longitude + "<br/>Accuracy: " + location.accuracy + "m</p>");

    backgroundGeolocation.finish();
  };

  var failureFn = function(error) {
    $("div#display").append("<p>BackgroundGeolocation error.</p>");
  };

  /**
   * Converting a timestamp to a more human readable date/time.
   */
  var dateTime = function (timestamp) {
    var a = new Date(timestamp),
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    var day = a.getDate();
    var dayOfWeek = days[a.getDay()];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var hour = a.getHours();
    var min = a.getMinutes();
    min = (min < 10) ? '0' + min : min;
    var suffix = (hour >= 12) ? 'pm' : 'am';
    var hours = (hour > 12) ? hour - 12 : hour;
    hours = (hours == '00') ? 12 : hours;
    return hours + ':' + min + suffix + ', ' + dayOfWeek + ' ' + day + ' ' + month + ' ' + year;
  };

  $(document).on("phonegap:ready", init);

}(jQuery));
