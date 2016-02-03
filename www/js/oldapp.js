oldapp.js
var weatherApp = angular.module('weather', ['ionic', 'ngResource']);

// var forecastioWeather = ['$q', '$resource', '$http', 'FORECASTIO_KEY',
//   function($q, $resource, $http, FORECASTIO_KEY) {
//     var url = 'https://api.forecast.io/forecast/' + FORECASTIO_KEY + '/';
//
//     return {
//       getCurrentWeather: function(lat, lng) {
//         return $http.jsonp(url + lat + ',' + lng +
//           '?callback=JSON_CALLBACK');
//       }
//     };
//   }
// ];

weatherApp.constant('FORECASTIO_KEY', '22e4ef7a0bc69e27528e5691b907f9e6');

weatherApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

weatherApp.controller('weatherCtrl', function($scope, $ionicModal, weatherService) {

  var arrayid = 0;

  //call getCurrentWeather method in factory


  $scope.cards = [];

  $ionicModal.fromTemplateUrl('new-card.html', function(modal) {
    $scope.cardModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.createCard = function(card) {


    $scope.cards.push({
      location: card.location,
      latitude: card.lat,
      longlongitude: card.long,
      cardID: arrayid,
    });
    var latitude = card.lat;
    var longitude = card.long;
    var currentCardID = arrayid;
    $scope.cardModal.hide();
    card.location = "";
    card.lat = "";
    card.long = "";

    // weatherData.getCurrentWeather(latitude, longitude).then(function(resp) {
    //   $scope.current = resp.data;
    //   var pos = search(currentCardID);
    //   $scope.cards[pos].cTemp = $scope.current;
    //
    //   console.log('GOT CURRENT', $scope.current);
    // }, function(error) {
    //   alert('Unable to get current conditions');
    //   console.error(error);
    // });
    // $scope.cards.push({
    //   cTemp:$scope.current
    // });

    weatherService.get(latitude, longitude).then(function(response) {
      $scope.current = response.data;
      var pos = search(currentCardID);
      $scope.cards[pos].cTemp = $scope.current;
      console.log('GOT CURRENT', $scope.weather);
    }, function(error) {
      console.error("Error getting data!");
    });
    console.log('Cards', $scope.cards);

    arrayid++;
  };

  function search(id) {
    for (var i = 0; i < $scope.cards.length; i++) {
      if ($scope.cards[i].cardID === id) {

        return i;
      }
    }
  }

  $scope.newCard = function() {
    $scope.cardModal.show();
  };

  $scope.closeNewCard = function() {
    $scope.cardModal.hide();
  };

  $scope.removeCard = function(id) {
    var pos = search(id);
    $scope.cards.splice(pos, 1);
    arrayid--;
  };

});

weatherApp.service('weatherService', function($http) {
  var key = "22e4ef7a0bc69e27528e5691b907f9e6";

  var URL = "https://api.forecast.io/forecast/" + key + "/";

  this.get = function(longitude, latitude) {
    var CURL = URL + longitude + "," + latitude + "?callback=JSON_CALLBACK";

    return $http.jsonp(CURL);
  };
});

//weatherApp.factory('weatherData', forecastioWeather);
