const container = document.getElementById("map");

const options = {
  center: new kakao.maps.LatLng(37.5883, 127.0054),
  level: 3,
};

const map = new kakao.maps.Map(container, options);

const markerPosition = new kakao.maps.LatLng(37.5883, 127.0054);
const marker = new kakao.maps.Marker({
  position: markerPosition,
});

marker.setMap(map);
