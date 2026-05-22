```
# skkuPassMap

SKKUPASSMAP/
└─ skkuPassMap/
├─ static/
│ ├─ css/
│ │   └─ style.css          # 화면 디자인
│ └─ js/
│    └─ map.js              # 지도 움직임/기능
│    └─ data.js             # 식당/카페/술집/편의시설 데이터
├─ templates/               # html 화면 파일 모음
│    └─ index.html          # 메인 화면
├─ app.py                   # 실행 파일 카카오맵 API 호출
├─ .env                     # API 키 저장
├─ README.md                # 프로젝트 설명
└─ requirements.txt         # 필요한 라이브러리 목록

1. 로컬 실행 방법
cd skkuPassMap/
pip install -r requirements.txt
python app.py
2. Render 배포 서버 접속 방법
아래 URL 접속
https://skkupassmap.onrender.com/
```
