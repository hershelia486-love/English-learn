# 🌕 뉴욕물먹은 보름달

미드(미국 드라마) 단골 관용구 600개를 통암기로 학습하는 영어 학습 웹앱입니다.

## 데모

🔗 [https://아이디.github.io/nyc-moon](https://아이디.github.io/nyc-moon)

---

## 주요 기능

| 기능 | 설명 |
|---|---|
| 📋 전체 목록 | 600개 표현 검색 · 필터 · 즐겨찾기 · 암기완료 체크 |
| 🃏 카드 학습 | 한국어 → 영어 플립카드, 섞기/순서대로 |
| ✏️ 빈칸 채우기 | 핵심 단어 가리기, 탭하면 정답 표시 |
| 💡 연상 묘사 | 주요 관용구 50개+ 상황 설명으로 통암기 |
| 🔊 TTS 발음 | 영어 원어민 속도 음성 재생 |
| ⭐ 즐겨찾기 | 중요 표현 저장 (localStorage) |
| 📊 진도 체크 | 암기 완료 수 / 600 진행바 표시 |

---

## 파일 구조

```
nyc-moon/
├── index.html   # 화면 구조 (HTML)
├── style.css    # 디자인 스타일
├── data.js      # 600개 표현 데이터 + 연상 묘사
└── app.js       # 앱 기능 로직
```

> 문장 추가·수정 → `data.js`만 편집  
> 기능 수정 → `app.js`만 편집  
> 디자인 수정 → `style.css`만 편집

---

## 데이터 형식 (`data.js`)

```js
// 표현 추가 방법: RAW 문자열 끝에 한 줄 추가
601|한국어 문장.|English sentence.

// 연상 묘사 추가 방법: SCENE 객체에 추가
601: "🔥 상황 설명"
```

---

## GitHub Pages 배포

1. 이 레포를 **Fork** 또는 파일 4개 업로드
2. `Settings` → `Pages` → Branch: `main` 저장
3. 잠시 후 `https://아이디.github.io/레포이름` 접속

---

## 기술 스택

- Vanilla HTML / CSS / JavaScript (프레임워크 없음)
- Web Speech API (TTS 발음)
- localStorage (즐겨찾기 · 암기 진도 저장)
- Google Fonts (Noto Sans KR · DM Mono)

---

## 콘텐츠 출처

미국 드라마 단골표현 600 자료 기반 제작
