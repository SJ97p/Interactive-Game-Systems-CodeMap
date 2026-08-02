# Interactive Game Systems Code Map

실물 입력 장치, 리듬게임 제작 도구, 실시간 포즈 추적, 게임 서버를 Unity 프로젝트에 연결하며 해결한 문제를 정리한 포트폴리오용 Code Map입니다.

이 저장소는 이전 직장에서 수행한 업무를 바탕으로 작성했지만, 회사의 원본 프로젝트를 공개하는 저장소가 아닙니다. 회사명, 제품명, 전용 장치 프로토콜, 실제 네트워크·DB 정보, 회사 소스와 제3자 유료 에셋을 제외하고 문제 해결 과정과 개인 기여 범위만 재구성합니다.

> 현재 저장소는 문서화 단계입니다. 공개용 데모와 이미지는 원본 회사 자료를 복사하지 않고 별도로 제작할 예정입니다.

## Interactive Code Map

저장소 루트의 `index.html`은 [Shield & Shot Code Map](https://github.com/SJ97p/Shield-Shot-CodeMap)에서 구축한 디자인과 탐색 방식을 재사용한 정적 포트폴리오입니다.

- Explorer에서 사례와 세부 시스템 탐색
- Mermaid 기반 시스템 흐름과 노드 이동
- 필요성, 기존 문제, 해결 과정, 결과 및 공개 경계 비교
- 회사 원본 코드 대신 공개 가능한 설계 노트와 의사 코드 확인
- 검색, 뒤로가기, 그래프 확대·축소, 테마 전환과 코드 패널 크기 조절

현재 저장소는 Private이므로 무료 GitHub Pages를 사용할 수 없습니다. 로컬에서는 다음 명령으로 확인할 수 있습니다.

```powershell
Set-Location -LiteralPath 'E:\Unity Project\Interactive-Game-Systems-CodeMap'
python -m http.server 4173
```

그다음 브라우저에서 `http://127.0.0.1:4173`을 엽니다. 공개 검토가 끝난 뒤 저장소를 Public으로 전환하면 루트의 정적 사이트를 GitHub Pages로 배포할 수 있습니다.

## Portfolio Summary

| Case Study | Problem | My Contribution | Status |
|---|---|---|---|
| BPM 기반 리듬게임 채보 시스템 | 작업자의 감각에 의존한 절대 시간 채보로 박자 오차와 작업 편차 발생 | BPM 중심 구조 제안, EditorWindow 채보 도구 및 인게임 타이밍 방식 구현 | 문서화 완료, 공개 데모 예정 |
| BLE 장치 설정·입력 진단 UI | 연결 여부와 센서 입력 이상을 게임 실행 전에 구분하기 어려움 | 기존 연결 모듈 수정·확장, 검색·연결·구독 UI와 위치별 입력 점등 구현 | 문서화 완료, 시뮬레이터 예정 |
| MediaPipe–Unity 실시간 연동 | 실행 환경별 관절 추출 품질 차이와 Unity 전달 파이프라인 필요 | 환경별 기술 검증, Web 도구 개조, Node.js 중계와 UDP 이중 전송, Unity 리깅 실험 | 문서화 완료, 일반화 데모 검토 |
| C++ DB 서버–Unity 연동 | Unity의 계정·랭킹·플레이 기록을 외부 서버와 연결해야 함 | 공개 네트워크 API를 활용한 패킷 처리 및 DB 응용 로직 구현 | 구조 문서만 공개 |

## Case Studies

- [BPM 기반 리듬게임 채보 시스템](docs/case-studies/bpm-rhythm-chart-editor.md)
- [BLE 장치 설정 및 실시간 입력 진단](docs/case-studies/ble-device-diagnostics.md)
- [MediaPipe–Unity 실시간 관절 데이터 연동](docs/case-studies/mediapipe-unity-bridge.md)
- [C++ DB 서버와 Unity 연동](docs/case-studies/cpp-db-server-integration.md)

## Contribution Boundary

### 직접 설계·구현

- BPM 기반 채보 방식과 Unity EditorWindow 제작 도구
- 인게임 노트 타이밍을 BPM 기준으로 전환
- BLE 장치 연결 씬의 UI와 사용자 흐름
- MediaPipe 웹 도구의 회사 사용 흐름, 데이터 가공 및 전송 서버
- Unity 클라이언트와 DB 서버의 응용 계층 연동

### 기존 코드 기반 수정·확장

- 인계받은 사내 BLE 연결 코드를 실제 빌드 앱과 UI 흐름에 맞게 수정
- 공개 MediaPipe 예제를 목적지 설정, 데이터 변환 및 Unity 전송 도구로 확장
- 공개 Unity 리깅 사례를 비교하며 본 매핑, 좌표계, 회전, 보간 방식을 실험
- 공개 HNetwork API를 이용해 C++ 서버 응용 로직 구성

### 본인 구현이 아닌 항목

- BLE 저수준 통신 플러그인
- HNetwork 네트워크 라이브러리
- Google MediaPipe의 관절 추론 기술
- 자세 분류 모델의 학습 로직
- Unity Asset Store 에셋, UFE, Photon, FMOD 등 제3자 자산

## Repository Policy

- 이 저장소에는 회사 원본 프로젝트를 복사하지 않습니다.
- 실제 장치명, MAC 주소, UUID, 패킷 값과 제품명은 공개하지 않습니다.
- 서버 주소, DB 자격 증명, 실제 테이블·필드와 내부 패킷 번호를 공개하지 않습니다.
- 회사 제품 사진과 원본 스크린샷은 공개 허가 전까지 사용하지 않습니다.
- 공개 데모는 가상 장치, 가상 데이터와 일반화된 이름으로 새로 구현합니다.
- 정량 측정이 없는 결과를 성능 벤치마크나 수치 개선으로 표현하지 않습니다.

자세한 검토 기준은 [Publication Review](PUBLICATION_REVIEW.md)와 [Third-Party Notices](THIRD_PARTY_NOTICES.md)를 참고하세요.

## Planned Public Demos

1. BPM과 오프셋을 설정하고 JSON 채보를 내보내는 독립 Unity Editor 데모
2. 실제 BLE 장치 없이 키보드·가상 패킷으로 입력 상태를 표시하는 진단 UI
3. 공개 MediaPipe 예제를 이용해 익명화된 목적지로 좌표 데이터를 전달하는 최소 데모
