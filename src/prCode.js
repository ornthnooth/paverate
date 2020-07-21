/*the following are global vars for the image slideshow*/


//MAPSTUFF stuff below here code from Dr. Dan examples
//TODO EDIT THESE
var icon;
var map, myLatLng;
var curPos;
var markers = [];
var otherSelected = false;

var names = document.getElementsByClassName("name");
var locations = document.getElementsByClassName("location");
var addresses = document.getElementsByClassName("address");

function initMap() {
  //direcDisplay = new google.maps.DirectionsRenderer;
//  direcService = new google.maps.DirectionsService;

  myLatLng = {lat: 44.9727, lng: -93.235400000000003};
  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 15
  });

//  direcDisplay.setPanel(document.getElementById("route"));
//  direcDisplay.setMap(map);

  var geocoder = new google.maps.Geocoder(); // Create a geocoder object

var l = addresses.length;
for(i = 0; i<l; i++){
  const address = addresses[i];
  const name = names[i];
  const location = locations[i];
  var nameTag = name.innerHTML + "<br>" + location.innerHTML;
  geocodeAddress(geocoder, map, address.innerHTML, nameTag);
}
   getLocation();
}

// This function takes a geocode object, a map object, and an address, and
// if successful in finding the address, it places a marker with a info window
function geocodeAddress(geocoder, resultsMap, address,nameTag) {

  geocoder.geocode({'address': address}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      icon = {
        url: 'Goldy.png',
        size: new google.maps.Size(40,40),
        scaledSize: new google.maps.Size(40, 40),
      };
      var	marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location,
              title:address,
              icon: icon
            });
      var	infowindow = new google.maps.InfoWindow({
              content: nameTag
              });

        google.maps.event.addListener(marker, 'click',
        createWindow(resultsMap,infowindow, marker));
        markers.push(marker);
    } else {
      alert('Geocode was not successful reason: ' + status);
    }
  });
} // end geocodeAddress function

function createWindow(rmap, rinfowindow, rmarker){
            return function(){
      rinfowindow.open(rmap, rmarker);
          }
  }//end create (info) window

//method for search local attractions
  function searchLoc(){
    selectedPlace = document.getElementById('place');
    deleteAllMarkers();
    searchNearLocs(map, curPos);
  }

  function searchNearLocs(map, location) {
    map.setCenter(location);
    var service = new google.maps.places.PlacesService(map);
    //pull information from box if other is chosen
    if (otherSelected) {
      var request = {
        query: document.getElementById("otherPlace").value,
        location: location,
        radius: document.getElementById("radius").value
      }

      /*Start the textSearch*/
      service.textSearch(request, function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i]);
          }
        }
      });

    } else { //search by searchnear()
      var locationType = document.getElementById("place");
      var request = {
        type: [locationType.options[locationType.selectedIndex].value],
        location: location,
        radius: document.getElementById("radius").value
      };

      service.nearbySearch(request, function(results, status){
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          createMarker(results[i]);
        }
      })
    }
    }


  //MARKER FUNCTIONS
  // Displays all markers in the array.
  function displayAllMarkers(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
  // Shows all markers currently in markers.
  function showMarkers() {
    displayAllMarkers(map);
  }

  // Removes the markers from the map, but keeps them in markers.
  function removeAllMarkers() {
    displayAllMarkers(null);
  }
  function deleteAllMarkers() {
    removeAllMarkers();
    markers = [];
  }

  function createMarker(location) {
    /*Create a new marker for place*/
    var marker = new google.maps.Marker({
      map: map,
      position: location.geometry.location,
      animation: google.maps.Animation.DROP
    });
    markers.push(marker);

    var service = new google.maps.places.PlacesService(map);
    var infowindow = new google.maps.InfoWindow;

    google.maps.event.addListener(marker, 'click', function() {

      var request = {
        fields: ['name', 'formatted_address'],
        placeId: location.place_id
      };

      service.getDetails(request, function(details, status) {
        infowindow.setContent(location.name+"<br>"+details.formatted_address);
        infowindow.open(map, marker);
      });
    });

    google.maps.event.addListener(marker, 'mouseover', function() {
      /*Create a request for getDetails*/
      var request = {
        fields: ['name'],
        placeId: location.place_id
      };

      /*use getDetails to get the location's name for mouseover*/
      service.getDetails(request, function(details, status) {
        infowindow.setContent(location.name);
        infowindow.open(map, marker);
      });
    });
  }
  //enable other text
  function getPlaceType(){
    if(document.getElementById("other").selected==true){
      otherSelected = true;
      document.getElementById("otherPlace").disabled = false;
    }else{
      otherSelected = false;
      document.getElementById("otherPlace").disabled = true;}
  }

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos){
          curPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
        });
      } else {
        var x = document.getElementById("demo");
        x.innerHTML = "Geolocation is not supported by this browser.";
      }
    }
