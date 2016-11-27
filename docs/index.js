'use strict'

var defaultLocation = L.latLng(51.505, -0.09)
var localMap = L.map('local-map')
var remoteMap = L.map('remote-map')

var localLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
})
var remoteLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
})

localLayer.addTo(localMap)
remoteLayer.addTo(remoteMap)

function opposite (latlng) {
  var lng = latlng.lng > 0 ? latlng.lng - 180 : latlng.lng + 180
  return L.latLng(-latlng.lat, lng)
}

localMap.setView(defaultLocation, 13)
remoteMap.setView(opposite(defaultLocation), 13)

var isCursorLocal

$('#local-map').on('mouseenter', function () {
  isCursorLocal = true
})
$('#remote-map').on('mouseenter', function () {
  isCursorLocal = false
})

localMap.on('move', function () {
  if (!isCursorLocal) return
  var latlng = localMap.getCenter()
  var zoom = localMap.getZoom()
  remoteMap.setView(opposite(latlng), zoom)
})

remoteMap.on('move', function () {
  if (isCursorLocal) return
  var latlng = remoteMap.getCenter()
  var zoom = remoteMap.getZoom()
  localMap.setView(opposite(latlng), zoom)
})

$('#auto-locate').on('click', function () {
  localMap.locate({setView: true})
})
