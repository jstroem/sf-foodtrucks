var SFFoodTruck = function() {
  this.sideNav = new SideNav('.side-nav','.viewport','.side-nav-show','.side-nav-hide');
  this.loaderElement = document.querySelector('.loader');
  this.centerLocation = {lat: 37.76736398612912, lng: -122.40112233649904};
  this.mapElement = document.querySelector('#map');
  this.map;
  this.infoWindow;
  this.request;
  this.trucks = {};

  this.selector = new Selector('.selector', "SHOW ALL");
  this.selector.onChanges(this._updateViewedTrucks.bind(this));
}

SFFoodTruck.prototype.onMapLoaded = function() {
  this.map = new google.maps.Map(this.mapElement, {
    zoom: 16,
    navigationControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    zoomControl: false,
    scaleControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: this.centerLocation
  });
  this.map.addListener('bounds_changed', eventStaller(this._onMapBoundsChanged.bind(this), 100));
  this.infoWindow = new google.maps.InfoWindow({ maxWidth: 260 });
}

SFFoodTruck.prototype._loading = function(bool) {
  if (bool)
    this.loaderElement.classList.add('active');
  else
    this.loaderElement.classList.remove('active');
}

SFFoodTruck.prototype._handleRequestError = function() {
  this._loading(false);
  this.request = null;
}

SFFoodTruck.prototype._handleRequestSuccess = function(data) {
  this.request = null;
  var foodtrucks = JSON.parse(data);
  var self = this;
  foodtrucks = foodtrucks.map(function(foodtruck){
    var marker = new google.maps.Marker({
      position: {lat: foodtruck.latitude, lng: foodtruck.longitude},
      title: foodtruck.applicant,
    })
    foodtruck.mapMarker = marker;
    marker.addListener('click', function() {
      self._showInfoWindow(foodtruck);
    });
    return foodtruck;
  });

  this._mergeTrucks(foodtrucks);
  this._loading(false);
}

SFFoodTruck.prototype._showInfoWindow = function(foodtruck) {
  this.infoWindow.close();
  this.infoWindow.setContent(
    '<h2>'+foodtruck.applicant+'</h2>' +
    '<p><b>Opening hours: '+foodtruck.dayshours+'</b><br />' +
    'Food types: ' +
      (foodtruck.foodtypes.length ?
        '<span class="label">' + foodtruck.foodtypes.join('</span> <span class="label">') + '</span>' :
        '<i>unknown</i>'
      ) + '<br />' +
    'Food description: ' + foodtruck.fooditems.join(', ') + "<br />" +
    '</p>'
  );
  this.infoWindow.open(this.map, foodtruck.mapMarker);
}

SFFoodTruck.prototype._mergeTrucks = function(foodtrucks) {
  var map = this.map;
  var ids = Object.keys(this.trucks);
  var self = this;
  foodtrucks.forEach(function(foodtruck) {
    var index = ids.indexOf(foodtruck.id);

    //If they allready exists just remove their ids and move on.
    if (index > -1) {
      ids.splice(index, 1);
      return;
    }
    self.trucks[foodtruck.id] = foodtruck;
  });

  //Remove all that was not in the new batch.
  ids.forEach(function(id) {
    var truck = self.trucks[id];
    truck.mapMarker.setMap(null);
    delete self.trucks[id];
  });

  this._updateSelectorValues();
  this._updateViewedTrucks();
}

SFFoodTruck.prototype._updateSelectorValues = function() {
  var foodtypes = new SimpleSet();
  for(var id in this.trucks) {
    foodtypes.addAll(this.trucks[id].foodtypes);
  }
  this.selector.updateValues(foodtypes.toArray());
}

SFFoodTruck.prototype._updateViewedTrucks = function() {
  var self = this;
  for(var id in this.trucks) {
    var truck = this.trucks[id];
    if (self.selector.hasOneSelected(truck.foodtypes))
      truck.mapMarker.setMap(self.map);
    else
      truck.mapMarker.setMap(null);
  }
}

SFFoodTruck.prototype._updateFoodTrucks = function() {
  this._loading(true);
  if (this.request)
    this.request.cancel();

  var bounds = this.map.getBounds().toUrlValue().split(',');
  var lat_from = bounds[0];
  var lon_from = bounds[1];
  var lat_to = bounds[2];
  var lon_to = bounds[3];
  this.request = new AjaxRequest("GET", "/search?lat_from="+lat_from+"&lat_to="+lat_to+"&lon_from="+lon_from+"&lon_to="+lon_to);
  this.request.onSuccess( this._handleRequestSuccess.bind(this) );
  this.request.onError( this._handleRequestError.bind(this) );
  this.request.send();
}


SFFoodTruck.prototype._onMapBoundsChanged = function() {
  this._updateFoodTrucks();
}
