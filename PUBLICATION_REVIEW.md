# Publication Review

## Repository Identity

- Repository name: `Interactive-Game-Systems-CodeMap`
- The repository name intentionally excludes the former employer and product names.
- The former employer and product names are intentionally anonymized.

## Current Public Scope

공개 자료는 담당 문제와 기여 범위를 서술한 문서, CodeMap, 두 개의 독립 웹 데모와 공개 승인을 받은 Photon 실행 화면 2장입니다. 설계 노트·의사 코드, BPM 채보 데모와 가상 장치 진단 화면은 공개를 위해 새로 작성했습니다. 회사 원본 코드, 장치 프로토콜과 실행 파일은 포함하지 않습니다. Photon 실행 화면의 편집 범위는 아래 Claim Review에 기록했습니다.

## Known Sensitive Material in Original Projects

- 평문으로 남은 DB 접속 자격 증명
- 실제 DB 테이블·필드와 운동 기록 구조
- 내부 패킷 타입 및 전용 장치 데이터 규칙
- 장치명, MAC 주소, Service/Characteristic UUID
- 회사 로고, 제품명과 제품 외형
- 실제 서버 주소 및 포트 구성
- 빌드 실행 파일, DLL, PDB와 압축 백업

위 항목은 이 저장소에 복사하지 않습니다. 기존 자격 증명이 아직 유효하거나 재사용됐다면 별도로 변경해야 합니다.

## Third-Party and Company-Owned Material

- HNetwork source
- BluetoothLEHardwareInterface and other Asset Store plugins
- UFE, Photon, FMOD and purchased Unity assets
- Google MediaPipe example source copied verbatim
- Character, animation, audio, UI, prefab, scene and ScriptableObject assets

제3자 또는 회사 소유 원본은 공개하지 않습니다. 필요 시 공식 라이선스가 허용하는 공개 의존성만 새 데모에서 설치 절차로 안내합니다.

## Screenshot Policy

BLE 및 게임 스크린샷은 내부 장치 정보와 회사 제품 구조를 노출할 수 있어 공개 확인 없이 사용하지 않습니다. Photon 실행 화면 2장은 사용자의 공개 승인을 받고 제목줄만 잘라 포함했습니다. 그 외 독립 데모 이미지는 다음 원칙으로 제작합니다.

- 가상 장치명과 임의 입력 채널 사용
- 회사 로고와 제품 외형 제거
- MAC, UUID, 주소, 포트와 디버그 문자열 제거
- 원본 UI 에셋을 사용하지 않고 독립 디자인 적용

## Claim Review

- Photon 리듬 게임: 예제 코드 기반 1대1 매칭·플레이·점수 표시의 응용 구현으로 기술. 사용자가 공개를 승인한 플레이·결과 화면 2장만 예외로 포함하며, 회사·제품명이 있는 상단 창 제목줄을 잘라냄. 게임 UI와 점수는 원본 그대로 유지하고 생성형 AI로 재생성하지 않음.
- Photon SDK 종류와 RPC·시간 보정·서버 검증 방식은 원본 코드 확인 없이 단정하지 않음.

- BPM 채보 도구: 개인 단독 설계·구현으로 기술 가능
- BLE: 기존 플러그인과 사내 연결 코드 기반 수정·확장 및 UI 구현으로 기술
- MediaPipe: Google 예제 기반 응용, 환경 검증 및 데이터 전달 도구 구현으로 기술
- Unity rigging: 기술 검증·프로토타이핑으로 기술하고 최종 채택을 주장하지 않음
- Pose classifier: 학습 데이터 편집 지원만 기술
- DB server: HNetwork API 기반 Unity–서버–DB 응용 로직 구현으로 기술

## Before Publishing

- [ ] 회사명과 제품명이 모든 공개 문서에서 익명화됐는지 확인
- [ ] 모든 문서에서 실제 제품명과 내부 식별자가 제거됐는지 확인
- [ ] 원본 회사 코드와 에셋이 복사되지 않았는지 확인
- [ ] 이미지와 영상이 공개용으로 재구성됐거나, 공개 승인을 받고 식별 정보를 제거한 자료인지 확인
- [ ] 정량 측정이 없는 성과에 수치나 벤치마크 표현을 사용하지 않았는지 확인
- [ ] 공개 데모의 제3자 라이선스를 별도로 검토
- [ ] Git 전체 이력에 자격 증명이나 원본 자료가 들어간 적이 없는지 확인
