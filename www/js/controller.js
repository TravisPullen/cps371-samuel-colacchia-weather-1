weatherApp.controller('weatherCtrl', function($scope, $ionicModal, weatherService, googleGeoService) {

  var arrayid = 0;

  $scope.cards = [];

  $ionicModal.fromTemplateUrl('new-card.html', function(modal) {
    $scope.cardModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.createCard = function(card) {
    $scope.cards.push({
      cardID: arrayid,
      address: card.city,
      cTemp: 0
    });
    var currentCardID = arrayid;
    var address = card.city;
    $scope.cardModal.hide();
    card.city = "";

    if (googleGeoServiceLoaded === false) {
      googleGeoService.get().then(function(response) {
        googleGeoCallWeather(address, $scope,arrayid);
        arrayid++;
      }, function(error) {
        console.error('Error getting googleGeoApi');
      });
      googleGeoServiceLoaded = true;
    } else {
      googleGeoCallWeather(address,$scope,currentCardID);
      arrayid++;
    }
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

  // Below method accured from here http://stackoverflow.com/questions/16978331/from-unix-timestamp-to-datetime
  $scope.getTheDate = function(time,day) {
    var sDate = Date(time+day);
    return sDate;
  };
  function googleGeoCallWeather(address,$scope,currentCardID) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      'address': address
    }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        console.log('Map', results[0]);
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        $scope.cards[currentCardID].map = results[0];
        getWeatherData(longitude, latitude, currentCardID);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
    console.log('Cards', $scope.cards);
  }

  function getWeatherData(longitude, latitude, currentCardID) {
    weatherService.get(longitude, latitude).then(function(response) {
      $scope.current = response.data;
      //  var pos = search(currentCardID);
      $scope.cards[currentCardID].data = $scope.current;
      console.log('Got Weather', $scope.current);

    }, function(error) {
      console.eror('Error getting weatherData');
    });
  }


});
