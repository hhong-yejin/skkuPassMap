let map;
let geocoder;
let placeMarkers = [];
let activeLabelOverlay = null;

let categorySelect;
let placeSelect;

// 카테고리별 아이콘/색상
const categoryStyles = {
  식당: {
    iconClass: "fi fi-rs-utensils",
    color: "#e74c3c",
  },
  카페: {
    iconClass: "fi fi-rs-mug-hot-alt",
    color: "#25ab00",
  },
  술집: {
    iconClass: "fi fi-rs-beer",
    color: "#047dcf",
  },
  편의시설: {
    iconClass: "fi fi-rs-store-alt",
    color: "#8100b4",
  },
};

// 모든 장소를 한 배열로 합치기
function getAllPlaces() {
  const allPlaces = [];

  for (const category in data) {
    for (const name in data[category]) {
      allPlaces.push({
        category,
        name,
        address: data[category][name].주소,
        benefit: data[category][name].혜택,
      });
    }
  }

  return allPlaces;
}

// 정보 박스 업데이트
function updateInfo(name = "-", address = "-", benefit = "-") {
  document.getElementById("placeName").textContent = name;
  document.getElementById("address").textContent = address;
  document.getElementById("benefit").textContent = benefit;
}

// 장소 선택 드롭다운 초기화
function resetPlaceSelect() {
  placeSelect.innerHTML = '<option value="">장소 선택</option>';
  placeSelect.disabled = true;
}

// 카테고리에 맞는 장소 목록 채우기
function populatePlaceOptions(category) {
  resetPlaceSelect();

  if (!category || !data[category]) return;

  const places = Object.keys(data[category]).sort((a, b) =>
    a.localeCompare(b, "ko"),
  );

  places.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    placeSelect.appendChild(option);
  });

  placeSelect.disabled = false;
}

// 드롭다운 자동 동기화
function syncDropdowns(category, placeName) {
  categorySelect.value = category;
  populatePlaceOptions(category);
  placeSelect.value = placeName;
}

// 선택 위치로 이동 + 확대
function focusPlace(coords) {
  map.setLevel(1);
  map.panTo(coords);
}

// 핀 모양 마커 HTML 생성
function createMarkerContent(category) {
  const style = categoryStyles[category] || categoryStyles.편의시설;

  const wrapper = document.createElement("div");
  wrapper.className = "category-marker";
  wrapper.style.setProperty("--marker-color", style.color);

  const head = document.createElement("div");
  head.className = "category-marker-head";

  const icon = document.createElement("i");
  icon.className = style.iconClass;

  head.appendChild(icon);
  wrapper.appendChild(head);

  return wrapper;
}

// 라벨 오버레이 HTML 생성
function createLabelContent(category, name) {
  const wrapper = document.createElement("div");
  wrapper.className = "place-label";
  wrapper.textContent = `[${category}] ${name}`;
  return wrapper;
}

// 기존 라벨 제거
function clearActiveLabel() {
  if (activeLabelOverlay) {
    activeLabelOverlay.setMap(null);
    activeLabelOverlay = null;
  }
}

// 새 라벨 표시
function showPlaceLabel(category, name, coords) {
  clearActiveLabel();

  const content = createLabelContent(category, name);

  activeLabelOverlay = new kakao.maps.CustomOverlay({
    map: map,
    position: coords,
    content: content,
    yAnchor: 2.5,
    zIndex: 4,
  });
}

// 기본 마커 전체 표시
function displayAllMarkers() {
  const allPlaces = getAllPlaces();

  allPlaces.forEach((place) => {
    if (!place.address) return;

    geocoder.addressSearch(place.address, function (result, status) {
      if (status !== kakao.maps.services.Status.OK) {
        console.error("주소 검색 실패:", place.address);
        return;
      }

      const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      const content = createMarkerContent(place.category);

      const overlay = new kakao.maps.CustomOverlay({
        map: map,
        position: coords,
        content: content,
        yAnchor: 1,
      });

      placeMarkers.push(overlay);

      content.addEventListener("click", function () {
        focusPlace(coords);
        syncDropdowns(place.category, place.name);
        showPlaceLabel(place.category, place.name, coords);
        updateInfo(place.name, place.address, place.benefit || "-");
      });
    });
  });
}

// 주소로 지도 이동
function moveMapByAddress(address, name, benefit, category) {
  if (!geocoder) return;

  geocoder.addressSearch(address, function (result, status) {
    if (status !== kakao.maps.services.Status.OK) {
      console.error("주소 검색 실패:", address);
      return;
    }

    const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

    focusPlace(coords);
    showPlaceLabel(category, name, coords);
    updateInfo(name, address, benefit || "-");
  });
}

window.onload = function () {
  categorySelect = document.getElementById("areaSelect");
  placeSelect = document.getElementById("placeSelect");

  kakao.maps.load(function () {
    const mapContainer = document.getElementById("map");
    const skkuPosition = new kakao.maps.LatLng(37.5883, 126.9946);

    map = new kakao.maps.Map(mapContainer, {
      center: skkuPosition,
      level: 3,
    });

    geocoder = new kakao.maps.services.Geocoder();

    displayAllMarkers();

    categorySelect.addEventListener("change", function () {
      const selectedCategory = this.value;

      populatePlaceOptions(selectedCategory);
      updateInfo();
      clearActiveLabel();
    });

    placeSelect.addEventListener("change", function () {
      const selectedCategory = categorySelect.value;
      const selectedPlace = this.value;

      if (!selectedCategory || !selectedPlace) {
        updateInfo();
        clearActiveLabel();
        return;
      }

      const selectedData = data[selectedCategory][selectedPlace];

      moveMapByAddress(
        selectedData.주소,
        selectedPlace,
        selectedData.혜택,
        selectedCategory,
      );
    });
  });
};
