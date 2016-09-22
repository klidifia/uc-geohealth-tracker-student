(function(){
  "use strict";

  var ua = navigator.userAgent;
  window.is_iOS = ua.match(/(iPad|iPhone|iPod)/gi) ? true : false;
  window.is_android = ua.match(/android/i) ? true : false;

  var init = function() {
  };

  $(document).on("phonegap:ready", init);
}());
