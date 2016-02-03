weatherApp.service('googleGeoService', function($http) {
  var URL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBoTwYsdxFpuvMGr44Ar2-Mm2pys-jfOhM&signed_in=true&callback=JSON_CALLBACK";

  this.get = function() {
    return $http.jsonp(URL);
  };

});

weatherApp.service('weatherService', function($http) {
  var key = "22e4ef7a0bc69e27528e5691b907f9e6";

  var URL = "https://api.forecast.io/forecast/" + key + "/";

  this.get = function(longitude, latitude) {
    var CURL = URL + latitude + "," + longitude + "?callback=JSON_CALLBACK";

    return $http.jsonp(CURL);
  };
});
