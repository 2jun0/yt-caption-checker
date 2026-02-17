# YT Caption Checker Aid

언어 버전: [English](README.md) · [한국어](README_KO.md) · [日本語](README_JA.md) · [简体中文](README_ZH_CN.md) · [Español](README_ES.md) · [Italiano](README_IT.md)

선택한 자막 언어가 있는지 확인하고, 유튜브 썸네일 위에 배지로 표시하는 브라우저 확장 프로그램입니다.

## GitHub Copilot로 제작
이 프로젝트는 GitHub Copilot (GPT-5.3-Codex)로 전체 구현되었습니다.

## 주요 기능
- 유튜브 썸네일 감지 후 자막 배지 표시
- 유튜브 자막 언어 코드를 폭넓게 지원
- 지역 언어 통합 검색 지원 (`en-US`, `en-GB` => `en`)
- 팝업 설정 즉시 저장/즉시 반영
- Shorts는 검사 대상에서 제외

## 설치 방법 (개발자 모드)
1. 크롬 확장 페이지 열기: `chrome://extensions`
2. 개발자 모드 활성화
3. 압축해제된 확장 프로그램 로드 클릭
4. 이 프로젝트 폴더 선택

## 사용 방법
1. 유튜브 페이지 열기
2. 확장 프로그램 팝업 열기
3. 자막 언어/태그 스타일 선택
4. 자막이 있으면 썸네일에 `CC XX` 배지 표시

## 스크린샷
> 실제 스크린샷 파일은 [assets/screenshots](assets/screenshots)에 넣어주세요.

### 팝업
![Popup Settings](assets/screenshots/popup-settings.png)

### 유튜브 썸네일 배지
![YouTube Thumbnail Badge](assets/screenshots/youtube-thumbnails-badge.png)

## 라이선스
MIT

## 참고
- 자막 조회는 안정성을 위해 다중 폴백 경로를 사용합니다.
- 영상/지역 정책에 따라 자막 메타데이터 접근이 제한될 수 있습니다.
