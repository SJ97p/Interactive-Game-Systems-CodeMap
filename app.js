const repoBase = "https://github.com/SJ97p/Interactive-Game-Systems-CodeMap/blob/main/";

function note(name, language, source) {
  return { name, language, source };
}

function graph(lines) {
  return ["flowchart LR", ...lines].join("\n");
}

const designNotes = {
  rhythmModel: note("박자 기반 타이밍 모델", "텍스트", `공개 설계 노트 — 회사 원본 소스가 아닙니다

secondsPerBeat = 60 / bpm
beatPosition = (playbackTime - musicOffset) / secondsPerBeat
scheduledTime = musicOffset + beatIndex * secondsPerBeat

포트폴리오 데모는 음악 위치를 박자 중심 데이터로 저장하고
실행 시점에 재생 시간으로 변환합니다.`),

  rhythmTool: note("채보 제작 작업 흐름", "텍스트", `공개 의사 코드 — 독립적으로 다시 작성한 요약

곡 메타데이터 선택
BPM, 오프셋, 활성 레인 설정
익명화한 채보 JSON 불러오기
박자 그리드에서 노트 기록 또는 편집
레인과 타이밍 데이터 검증
새 JSON 채보 내보내기

회사 음원, 채보 데이터, UI 에셋과 원본 소스는 포함하지 않습니다.`),

  bleFlow: note("장치 진단 상태 흐름", "텍스트", `공개 의사 코드 — 장치 프로토콜은 의도적으로 생략

Idle -> Scanning -> DeviceSelected -> Connecting -> Ready
Ready -> InputReceived -> HighlightChannel -> Ready
Ready -> RefreshRequested -> CleanupConnection -> Scanning

공개 데모는 원본 BLE 플러그인과 패킷 형식 대신
가상 장치 어댑터와 의미 없는 테스트 채널을 사용합니다.`),

  bleBoundary: note("어댑터 책임 경계", "텍스트", `공개 인터페이스 개요

IDeviceScanner
  scan(): DeviceSummary[]

IDeviceConnection
  connect(deviceId)
  disconnect()
  observeState()
  observeInput()

DiagnosticsView
  renderConnectionState(state)
  flashInputChannel(channel)

회사 코드를 복사한 것이 아닌, 포트폴리오용 일반화 설계입니다.`),

  poseFlow: note("포즈 데이터 파이프라인", "텍스트", `공개 아키텍처 요약

Camera -> Pose inference -> Coordinate normalization
       -> Local relay -> Independent Unity consumers
       -> Rigging prototype / pose-classification consumer

목적지 세부 정보, 내부 스키마, 제품 식별자와
원본 패키징 실행 파일은 의도적으로 제외했습니다.`),

  poseEvaluation: note("실행 환경 선정 기록", "텍스트", `정성적 기술 검증

Candidates: Python, Linux runtime, Web runtime
Checks: camera compatibility, frame mode support, motion continuity,
        visual jitter, and landmark stability
Decision: Web runtime selected after hands-on comparison

통제된 벤치마크가 아니므로 수치상의 우위는 주장하지 않습니다.`),

  serverFlow: note("서버 응용 계층 경계", "텍스트", `공개 아키텍처 요약

Unity client -> Open-source network API -> request dispatch
             -> worker queue -> database connection pool
             -> application response

인증 정보, 패킷 식별자, 스키마명, 쿼리, 주소와
서드파티 네트워크 소스는 공개하지 않습니다.`),

  scope: note("기여 범위", "텍스트", `직접 구현
- BPM 채보 작업 흐름과 Unity 제작 도구
- BLE 연결 장면 UI와 진단 흐름
- Web 설정 및 데이터 중계 응용
- Unity와 서버 응용 기능 통합

수정 또는 통합
- 기존 사내 BLE 연결 모듈
- 공개 MediaPipe 및 리깅 예제
- 오픈 소스 네트워크 API

본인 구현으로 주장하지 않는 항목
- 저수준 BLE 플러그인
- 포즈 추론 모델
- 포즈 분류기 학습 로직
- 서드파티 Unity 에셋`)
};

const nodes = {
  overview: {
    title: "인터랙티브 게임 시스템",
    summary: "하나의 2열 × 3단 BLE 타격 장치를 격투와 리듬이라는 두 플레이 규칙으로 확장한 시스템 통합 포트폴리오",
    intent: "공통 장치의 실제 타격 입력을 격투게임에서는 카메라 포즈와, 리듬게임에서는 음악의 노트 타이밍과 결합해야 했습니다.",
    issue: "연결 성공만으로는 센서 정상을 알 수 없었고, 포즈 전달 환경과 실시간 키 입력 녹화 시점에 의존한 리듬 채보도 각각 불안정했습니다.",
    final: "공통 BLE 진단 기반 위에 격투 판정과 리듬 플레이를 분기하고, 각 게임의 포즈 데이터와 BPM 제작 문제를 별도로 해결했습니다.",
    next: "회사 원본과 제품 정보는 공개하지 않으며, 독립 데모와 일반화된 설계 설명만 제공합니다.",
    graph: graph([
      'O["2열 × 3단 BLE 타격 장치"] --> B["연결·6개 입력 진단"]',
      'B --> F["격투게임 판정"]',
      'B --> R["리듬게임"]',
      'P["카메라 포즈 데이터"] --> F',
      'F --> J["자세 + 타격 위치 결과"]',
      'R --> C["상·중단 4개 입력"]',
      'C --> T["BPM 채보 도구"]',
      'O --> S["게임 서버 통합"]'
    ]),
    links: { "BPM 채보 도구": "rhythm", "연결·6개 입력 진단": "ble", "카메라 포즈 데이터": "pose", "격투게임 판정": "pose", "리듬게임": "rhythm", "게임 서버 통합": "server" },
    notes: [designNotes.scope]
  },

  rhythm: {
    title: "BPM 리듬 채보 편집기",
    summary: "사람의 시간 감각에 의존한 채보를 BPM 중심 제작·재생 방식으로 전환",
    intent: "작업자마다 달라지는 노트 타이밍을 음악의 박자 체계에 맞추고 비개발자도 편집할 수 있어야 했습니다.",
    issue: "음악 재생 중 4개 레인 키 입력을 실시간 녹화하고 입력 시점을 절대 시간으로 저장해, 반응 시점에 따른 박자 오차가 생기고 수정 비용도 컸습니다.",
    final: "BPM·오프셋·레인 데이터를 중심으로 EditorWindow, 기록, 편집, JSON 입출력과 인게임 타이밍을 구현했습니다.",
    next: "3명의 작업자가 같은 기준으로 제작했습니다. 측정하지 않은 시간 단축률이나 오차율은 주장하지 않습니다.",
    graph: graph([
      'A["절대 시간 기반 채보"] --> Q{"타이밍 정확도"}',
      'Q --> M["BPM + 오프셋 모델"]',
      'M --> E["Unity 편집 도구"]',
      'E --> J["채보 JSON"]',
      'J --> G["박자 기반 런타임 출력"]'
    ]),
    links: { "BPM + 오프셋 모델": "rhythm_model", "Unity 편집 도구": "rhythm_editor", "박자 기반 런타임 출력": "rhythm_runtime" },
    notes: [designNotes.rhythmModel, designNotes.rhythmTool],
    doc: "docs/case-studies/bpm-rhythm-chart-editor.md",
    demo: "demos/index.html#rhythm-demo"
  },

  rhythm_model: {
    title: "박자 기반 타이밍 모델",
    summary: "BPM과 음악 오프셋을 공통 기준으로 사용하는 데이터 모델",
    intent: "제작 화면과 인게임 재생이 동일한 음악적 기준을 사용해야 했습니다.",
    issue: "실시간 키 입력의 개별 float 시점만 저장하면 박자 의미가 사라지고, 기록 시점 자체가 편집 기준이 됩니다.",
    final: "초당 박자 길이와 오프셋을 기준으로 음악 위치와 노트 타이밍을 대응시켰습니다.",
    next: "공개 데모에서는 beat index 중심 모델과 절대 시간 변환을 명확히 분리할 예정입니다.",
    graph: graph(['B["BPM"] --> T["Seconds per beat"]', 'O["Offset"] --> C["Beat clock"]', 'T --> C', 'C --> N["Note timing"]']),
    notes: [designNotes.rhythmModel]
  },

  rhythm_editor: {
    title: "Unity 채보 제작 흐름",
    summary: "곡 설정부터 채보 기록·편집·내보내기를 하나의 EditorWindow로 연결",
    intent: "개발자가 아닌 작업자도 동일한 기준으로 채보를 만들 수 있어야 했습니다.",
    issue: "데이터와 장면 편집이 분리돼 있으면 반복 작업과 실수가 늘어납니다.",
    final: "곡 메타데이터, 활성 레인, 기록, 시각 편집과 JSON 내보내기를 한 흐름으로 묶었습니다.",
    next: "회사 UI와 음원 대신 독립적인 공개 데모를 새로 제작합니다.",
    graph: graph(['S["Song metadata"] --> W["EditorWindow"]', 'R["Record input"] --> W', 'W --> V["Validate"]', 'V --> X["Export JSON"]']),
    notes: [designNotes.rhythmTool]
  },

  rhythm_runtime: {
    title: "런타임 노트 스케줄링",
    summary: "편집 기준을 실제 인게임 노트 출력까지 일관되게 적용",
    intent: "에디터만 정확해도 런타임 출력이 다른 기준이면 박자 오차가 남습니다.",
    issue: "실시간 키 입력으로 기록한 절대 시간값이 그대로 스폰 기준이 됐습니다.",
    final: "BPM 단위의 음악 위치를 기준으로 노트가 출력되도록 런타임 방식을 변경했습니다.",
    next: "실제 회사 채보 데이터는 공개하지 않고 생성된 테스트 패턴으로 검증할 예정입니다.",
    graph: graph(['J["Chart data"] --> C["Beat clock"]', 'C --> S["Scheduler"]', 'S --> L["Lane spawn"]']),
    notes: [designNotes.rhythmModel]
  },

  ble: {
    title: "BLE 장치 진단",
    summary: "연결 상태와 위치별 입력을 게임 진입 전에 확인하는 장치 설정 화면",
    intent: "현장에서 연결 실패와 센서 입력 문제를 빠르게 구분할 수 있어야 했습니다.",
    issue: "기존 연결 코드만으로는 장치 선택, 상태 확인, 재연결과 입력 진단 흐름이 부족했습니다.",
    final: "기존 모듈을 빌드 환경에 맞게 확장하고 검색·연결·상태 표시·입력 점등 UI를 구현했습니다.",
    next: "실제 장치·플러그인·패킷은 제외하고 시뮬레이터로 공개 데모를 구성합니다.",
    graph: graph([
      'P["서드파티 BLE 플러그인"] --> A["수정한 연결 계층"]',
      'A --> L["장치 목록"]',
      'A --> C["연결 상태"]',
      'A --> I["입력 스트림"]',
      'L --> U["진단 UI"]',
      'C --> U',
      'I --> U'
    ]),
    links: { "수정한 연결 계층": "ble_adapter", "진단 UI": "ble_ui", "입력 스트림": "ble_input" },
    notes: [designNotes.bleFlow, designNotes.bleBoundary],
    doc: "docs/case-studies/ble-device-diagnostics.md",
    demo: "demos/index.html#ble-demo"
  },

  ble_adapter: {
    title: "연결 모듈 수정 및 확장",
    summary: "인계받은 연결 코드를 실제 빌드 앱과 UI 상태 흐름에 맞게 수정·확장",
    intent: "저수준 연결 성공만이 아니라 앱이 일관된 상태를 관찰하고 제어해야 했습니다.",
    issue: "기존 코드는 완성된 설정 화면과 재시도 흐름을 제공하지 않았습니다.",
    final: "장치 목록, 현재 장치, 연결 및 데이터 구독 상태를 UI가 소비할 수 있도록 확장했습니다.",
    next: "저수준 플러그인과 기존 코드 전체를 직접 개발했다고 주장하지 않습니다.",
    graph: graph(['S["Scan"] --> D["Select device"]', 'D --> C["Connect"]', 'C --> R["Ready"]', 'R --> F["Safe refresh"]', 'F --> S']),
    notes: [designNotes.bleFlow, designNotes.bleBoundary]
  },

  ble_ui: {
    title: "장치 연결 화면 UI",
    summary: "검색부터 연결과 입력 확인까지 한 화면에서 수행하는 사용자 흐름",
    intent: "운영자가 기술 로그를 읽지 않고도 장치 상태를 이해해야 했습니다.",
    issue: "연결과 실제 센서 입력은 서로 다른 문제지만 기존 화면에서는 구분하기 어려웠습니다.",
    final: "장치 목록과 상태 색상, 연결 제어, 채널별 입력 점등을 시각적으로 구성했습니다.",
    next: "원본 UI 스크린샷 대신 동일 기능의 독립 디자인을 제작합니다.",
    graph: graph(['D["Device list"] --> S["State indicator"]', 'S --> T["Input test"]', 'T --> F["Channel feedback"]']),
    notes: [designNotes.bleFlow]
  },

  ble_input: {
    title: "입력 상태 시각화",
    summary: "수신 입력을 게임별 채널 위치에 매핑하고 즉시 시각화",
    intent: "연결 성공 이후에도 각 입력 위치가 정상인지 검증해야 했습니다.",
    issue: "통신 연결 상태만으로는 센서나 게임 입력 매핑 오류를 확인할 수 없습니다.",
    final: "연결 정상 상태와 입력 이벤트를 서로 다른 시각 피드백으로 표현했습니다.",
    next: "실제 입력 번호와 패킷 규칙은 의도적으로 공개하지 않습니다.",
    graph: graph(['E["Input event"] --> M["Channel mapping"]', 'M --> H["Temporary highlight"]', 'H --> R["Ready state"]']),
    notes: [designNotes.bleBoundary]
  },

  pose: {
    title: "MediaPipe–Unity 연동",
    summary: "환경별 관절 추출을 검증하고 Web에서 Unity로 연결한 실시간 데이터 도구",
    intent: "카메라 움직임을 캐릭터 리깅과 자세 판정에서 사용할 수 있어야 했습니다.",
    issue: "환경마다 프레임 지원과 관절 추출 품질이 달랐고 Unity 전달 경로도 필요했습니다.",
    final: "여러 환경을 비교하고 Web 방식을 선택해 설정 UI, 좌표 가공, 로컬 중계와 Unity 연동을 구성했습니다.",
    next: "정량 벤치마크가 아니므로 환경 선택은 정성적 기술 검증으로 명시합니다.",
    graph: graph([
      'E["실행 환경 비교"] --> W["Web 방식 선정"]',
      'W --> C["카메라 + 프레임 설정"]',
      'C --> N["랜드마크 좌표 가공"]',
      'N --> R["로컬 중계"]',
      'R --> G["Unity 수신 기능"]'
    ]),
    links: { "실행 환경 비교": "pose_evaluation", "랜드마크 좌표 가공": "pose_transform", "로컬 중계": "pose_relay", "Unity 수신 기능": "pose_unity" },
    notes: [designNotes.poseFlow, designNotes.poseEvaluation],
    doc: "docs/case-studies/mediapipe-unity-bridge.md"
  },

  pose_evaluation: {
    title: "실행 환경 비교 검증",
    summary: "Python, Linux와 Web 후보를 실제 카메라 입력과 관절 추출 품질로 비교",
    intent: "지원 프레임만으로는 실제 움직임 품질을 판단할 수 없었습니다.",
    issue: "한 환경은 높은 프레임으로 동작해도 관절 추출 안정성이 요구 수준에 미치지 못했습니다.",
    final: "호환성, 움직임 연속성, 시각적 떨림과 좌표 안정성을 확인해 Web 방식을 선택했습니다.",
    next: "동일 조건의 수치 측정이 없어 성능 우위를 수치로 표현하지 않습니다.",
    graph: graph(['P["Python"] --> Q{"Qualitative checks"}', 'L["Linux"] --> Q', 'W["Web"] --> Q', 'Q --> D["Web selected"]']),
    notes: [designNotes.poseEvaluation]
  },

  pose_transform: {
    title: "랜드마크 데이터 가공",
    summary: "공개 예제의 관절 결과를 Unity 소비 형식에 맞게 가공",
    intent: "추론 결과를 그대로 보내는 것이 아니라 수신 측 좌표와 데이터 요구에 맞춰야 했습니다.",
    issue: "예제 출력과 게임이 기대하는 JSON·좌표 스케일 사이에 차이가 있었습니다.",
    final: "랜드마크를 필요한 JSON 구조로 변환하고 좌표 스케일을 조정했습니다.",
    next: "실제 내부 스키마와 변환 상수는 공개하지 않습니다.",
    graph: graph(['L["Landmarks"] --> J["JSON adaptation"]', 'J --> S["Coordinate scaling"]', 'S --> O["Consumer-ready data"]']),
    notes: [designNotes.poseFlow]
  },

  pose_relay: {
    title: "로컬 데이터 중계",
    summary: "웹 추적 결과를 독립적인 Unity 소비 경로로 전달",
    intent: "브라우저의 관절 데이터를 리깅과 자세 판정에서 동시에 사용할 필요가 있었습니다.",
    issue: "웹 추론과 Unity 런타임 사이에 설정 가능하고 패키징 가능한 중계 계층이 없었습니다.",
    final: "Node.js 기반 로컬 서버, 목적지 설정과 복수 소비 경로를 구성하고 Windows 실행 파일로 패키징했습니다.",
    next: "원본 실행 파일, 주소·포트와 난독화 도구 세부정보는 공개하지 않습니다.",
    graph: graph(['W["Web tracker"] --> R["Local relay"]', 'R --> A["Rigging consumer"]', 'R --> B["Pose consumer"]']),
    notes: [designNotes.poseFlow]
  },

  pose_unity: {
    title: "Unity 리깅 프로토타입",
    summary: "본 매핑, 좌표계, 회전과 보간 방식을 비교한 기술 검증",
    intent: "관절 좌표를 캐릭터에 적용할 때 비정상 변형과 떨림을 줄여야 했습니다.",
    issue: "공개 구현마다 본 매핑과 회전 계산 방식이 달랐고 그대로 적용하면 캐릭터가 불안정했습니다.",
    final: "여러 공개 프로젝트를 분석해 JSON 파싱, 본 매핑, 좌표 변환, Quaternion과 보간 방식을 비교했습니다.",
    next: "상급자 수정 후 본인 버전의 최종 채택 여부가 불명확해 프로토타이핑으로만 기술합니다.",
    graph: graph(['J["JSON"] --> M["Bone mapping"]', 'M --> C["Coordinate conversion"]', 'C --> Q["Quaternion rotation"]', 'Q --> S["Smoothing"]']),
    notes: [designNotes.poseFlow]
  },

  server: {
    title: "C++ 게임 서버 통합",
    summary: "공개 네트워크 API 위에 Unity 요청과 DB 기능을 연결한 서버 응용 계층",
    intent: "게임의 사용자, 랭킹과 플레이 기록 기능을 원격 서버에서 처리해야 했습니다.",
    issue: "네트워크 라이브러리 API만으로는 게임 요청 분기와 DB 작업 흐름이 완성되지 않았습니다.",
    final: "패킷 요청 처리, 작업 큐, 워커와 ODBC 연결 풀을 게임 기능에 연결했습니다.",
    next: "상급자가 이후 코드를 다듬었고, 원본은 자격 증명·스키마·프로토콜 때문에 공개하지 않습니다.",
    graph: graph([
      'U["Unity 클라이언트"] --> N["오픈 소스 네트워크 API"]',
      'N --> D["요청 분기"]',
      'D --> Q["작업 큐"]',
      'Q --> P["DB 연결 풀"]',
      'P --> A["응용 결과 반환"]'
    ]),
    links: { "요청 분기": "server_dispatch", "작업 큐": "server_workers", "DB 연결 풀": "server_db" },
    notes: [designNotes.serverFlow],
    doc: "docs/case-studies/cpp-db-server-integration.md"
  },

  server_dispatch: {
    title: "요청 분기 처리",
    summary: "Unity 요청을 서버의 사용자·랭킹·기록 응용 기능으로 연결",
    intent: "클라이언트 요청을 명확한 서버 책임으로 분기해야 했습니다.",
    issue: "라이브러리는 전송 API를 제공하지만 게임별 응용 기능은 직접 구성해야 했습니다.",
    final: "요청 종류에 따라 응용 처리 흐름을 선택하고 결과를 Unity로 돌려주는 구조를 만들었습니다.",
    next: "실제 패킷 번호와 메시지 형식은 공개하지 않습니다.",
    graph: graph(['R["Request"] --> D{"Dispatch"}', 'D --> U["User"]', 'D --> K["Ranking"]', 'D --> H["Record"]']),
    notes: [designNotes.serverFlow]
  },

  server_workers: {
    title: "작업 큐와 워커",
    summary: "네트워크 수신과 DB 작업을 분리하는 작업 큐",
    intent: "요청 수신 흐름이 DB 처리에 직접 묶이지 않도록 해야 했습니다.",
    issue: "DB 작업을 수신 콜백에서 바로 처리하면 요청 처리 흐름이 결합됩니다.",
    final: "수신 요청을 큐에 넣고 워커가 처리하도록 역할을 분리했습니다.",
    next: "원본 동시성 구현은 공개하지 않고 구조적 책임만 설명합니다.",
    graph: graph(['N["Network callback"] --> Q["Thread-safe queue"]', 'Q --> W1["Worker"]', 'Q --> W2["Worker"]']),
    notes: [designNotes.serverFlow]
  },

  server_db: {
    title: "데이터베이스 연결 풀",
    summary: "ODBC 연결을 재사용하는 DB 접근 계층",
    intent: "각 요청마다 연결을 새로 만드는 비용과 연결 관리를 줄여야 했습니다.",
    issue: "게임 요청 처리와 DB 연결 생명주기가 직접 결합될 수 있었습니다.",
    final: "연결 풀에서 연결을 대여하고 반환하는 흐름으로 응용 처리와 연결 관리를 분리했습니다.",
    next: "원본 쿼리와 스키마는 비공개이며 공개 예제는 매개변수화된 쿼리로 새로 작성해야 합니다.",
    graph: graph(['W["Worker"] --> B["Borrow connection"]', 'B --> X["Execute safely"]', 'X --> R["Return connection"]']),
    notes: [designNotes.serverFlow]
  }
};

const treeGroups = [
  { id: "rhythm", title: "BPM 리듬 채보", children: ["rhythm_model", "rhythm_editor", "rhythm_runtime"] },
  { id: "ble", title: "BLE 장치 진단", children: ["ble_adapter", "ble_ui", "ble_input"] },
  { id: "pose", title: "MediaPipe 연동", children: ["pose_evaluation", "pose_transform", "pose_relay", "pose_unity"] },
  { id: "server", title: "C++ 게임 서버", children: ["server_dispatch", "server_workers", "server_db"] }
];

const cases = {
  "bpm-chart": {
    number: "01",
    nodeId: "rhythm",
    title: "BPM·Offset 기반 채보 제작 도구",
    card: "절대 시간 입력 기록을 팀이 함께 쓰는 박자 기준의 제작·실행 데이터로 전환",
    situation: "초기 채보는 음악을 재생하며 누른 네 레인의 시점을 float 절대 시간으로 저장했습니다. 초안을 빠르게 만들 수는 있었지만, 작업자마다 기록 기준이 달라지고 수정할 때마다 구간을 다시 들으며 시간값을 고쳐야 했습니다.",
    alternatives: "입력 시점의 절대 시간을 개별 보정하는 방식과, BPM·Offset·Beat를 제작과 실행의 공통 기준으로 두는 방식을 비교했습니다.",
    decision: "BPM·Offset·Beat를 채보 데이터의 기준으로 정하고, Unity EditorWindow에서 기록·편집한 JSON을 인게임 노트 스폰도 같은 박자 기준으로 읽도록 구성했습니다.",
    structure: ["곡 메타데이터", "BPM·Offset·Beat Clock", "EditorWindow 기록·편집", "Chart JSON", "인게임 노트 스폰"],
    implementation: "EditorWindow가 BPM·Offset·Beat와 레인 데이터를 JSON으로 저장하고, 런타임 스폰은 같은 Clock으로 Beat를 재생 시간에 맞춥니다. 제작 도구와 인게임이 별도의 시간 기준을 갖지 않도록 했습니다.",
    result: "팀원이 도구를 사용하며 스크롤 이동, BPM 단위 이동, 노트 동기화에서 찾은 문제를 수정했습니다. 제작과 인게임 실행이 같은 박자 기준을 사용하도록 맞췄고, 노트가 판정 지점의 박자에 맞게 들어오는 것을 플레이로 확인했습니다.",
    feedback: "정확도나 제작 시간은 측정하지 않았습니다. 다만 실제 사용 과정에서 드러난 편집·동기화 문제를 다시 도구에 반영한 점이 이 사례의 검증 근거입니다.",
    demo: "demos/index.html#rhythm-demo",
    cta: "CodeMap · BPM·Offset·Beat 채보 구조와 공개 설계 보기"
  },
  "ble-diagnostics": {
    number: "02",
    nodeId: "ble",
    title: "BLE 연결·입력 진단 흐름",
    card: "플레이 화면을 거치지 않고 연결·구독·채널 입력의 문제 위치를 한 화면에서 구분",
    situation: "입력이 들어오는지 확인하려면 실제 플레이 화면으로 넘어가 장치를 타격해야 했습니다. 연결이 끊긴 것인지, 구독이 안 된 것인지, 연결은 됐지만 특정 위치의 입력만 없는 것인지 바로 구분하기 어려웠습니다.",
    alternatives: "기존처럼 플레이 장면에서만 확인하는 방법과, 연결 상태와 2열×3단 입력을 분리해 보여주는 진단 화면을 비교했습니다.",
    decision: "기존 연결 모듈을 빌드 흐름에 맞게 수정하고, 검색·선택·연결·구독·해제·재연결 상태와 여섯 입력 채널을 하나의 진단 UI에서 다루도록 구성했습니다.",
    structure: ["장치 검색", "장치 선택", "연결·구독 상태", "Ready", "6개 입력 채널 시각화"],
    implementation: "BLE 연결 상태와 입력 이벤트를 별도 표시 경로로 두고, 재검색·재연결과 2열×3단 채널 점등을 진단 화면에서 처리했습니다. 공개 페이지에는 동일한 흐름을 재현한 가상 장치 데모를 사용했습니다.",
    result: "연결 상태와 입력 채널을 분리해 보면서, 실기기 문제가 연결 단계인지 센서 입력 단계인지 플레이 진입 전에 좁힐 수 있게 했습니다.",
    feedback: "원본 장치 UI와 저수준 BLE 플러그인은 공개 대상이 아닙니다. 이 CodeMap의 데모는 실제 통신을 흉내 낸 가상 장치 화면이며, 공개 가능한 진단 흐름만 재구성했습니다.",
    demo: "demos/index.html#ble-demo",
    cta: "CodeMap · BLE 연결 상태와 6채널 진단 흐름 보기"
  },
  "mediapipe-bridge": {
    number: "03",
    nodeId: "pose",
    title: "MediaPipe 실행 환경 선택과 이중 데이터 전달",
    card: "카메라 Landmark를 Unity 리깅과 자세 판정 경로에 각각 전달하기 위한 실행 환경·브리지 검증",
    situation: "카메라 환경에 따라 관절 오버레이가 흔들리거나 동작보다 늦게 따라왔고, 출력이 끊기는 경우도 있었습니다. 이 데이터는 Unity 캐릭터 동기화뿐 아니라 별도의 Python 자세 판정 모듈에도 전달되어야 했습니다.",
    alternatives: "Python·Linux·Web 실행 환경을 직접 비교했습니다. 프레임 수만이 아니라 카메라 호환성, 움직임 연속성, 관절 좌표의 흔들림을 함께 확인했습니다.",
    decision: "60FPS 지원과 관절 출력의 안정성을 기준으로 Web 실행 환경을 선택했습니다. 이후 Landmark 좌표를 가공·스케일 조정해 Unity 리깅 경로와 Python 자세 판정 경로로 각각 전달했습니다.",
    structure: ["카메라", "MediaPipe Web", "Landmark 가공·스케일", "Unity 리깅", "Python 자세 판정", "BLE 타격과 최종 판정"],
    implementation: "Web에서 얻은 Landmark를 Unity 소비 좌표로 가공한 뒤 UDP 포트 두 개로 전달했습니다. 하나는 Unity 리깅 검증용, 다른 하나는 팀원이 만든 Python 자세 판정 모듈의 입력용입니다.",
    result: "두 수신처가 필요한 데이터를 각각 받을 수 있는 브리지 경로를 구성했습니다. 발차기 자세 판정과 실제 타격 신호가 모두 들어와야 공격이 성립하도록 게임 판정에 연결했습니다.",
    feedback: "MediaPipe의 관절 추론과 자세 분류 모델 학습은 제 구현 범위가 아닙니다. Unity 리깅은 검증용 프로토타입이었고, 최종 적용 여부를 성과로 주장하지 않습니다.",
    cta: "CodeMap · MediaPipe Landmark 이중 전달 구조 보기"
  }
};

const expandedTreeGroups = new Set(treeGroups.map((group) => group.id));
const navStack = [];
let currentNodeId = "overview";
let currentCaseId = null;
let treeSearchQuery = "";
const defaultGraphScale = 1;
let graphRenderScale = 0.6;
let graphScale = defaultGraphScale;
let graphBaseSize = { width: 760, height: 420 };
let currentNotes = [];

const els = {
  layout: document.getElementById("layout"),
  caseHub: document.getElementById("case-hub"),
  caseCards: document.getElementById("case-cards"),
  caseDetail: document.getElementById("case-detail"),
  tree: document.getElementById("tree"),
  search: document.getElementById("explorer-search"),
  title: document.getElementById("node-title"),
  summary: document.getElementById("node-summary"),
  intent: document.getElementById("intent"),
  issue: document.getElementById("issue"),
  final: document.getElementById("final"),
  next: document.getElementById("next"),
  graph: document.getElementById("graph"),
  graphWrap: document.getElementById("graph-wrap"),
  scripts: document.getElementById("script-list"),
  scriptSection: document.getElementById("script-section"),
  evidenceSection: document.getElementById("evidence-section"),
  evidence: document.getElementById("evidence"),
  codePath: document.getElementById("code-path"),
  codeActions: document.getElementById("code-actions"),
  codePreview: document.getElementById("code-preview"),
  codeResizer: document.getElementById("code-resizer"),
  codePanel: document.getElementById("code-panel"),
  back: document.getElementById("nav-back"),
  zoomOut: document.getElementById("zoom-out"),
  zoomReset: document.getElementById("zoom-reset"),
  zoomIn: document.getElementById("zoom-in"),
  theme: document.getElementById("theme-toggle"),
  modal: document.getElementById("media-modal"),
  modalClose: document.getElementById("modal-close"),
  modalImage: document.getElementById("modal-image"),
  modalCaption: document.getElementById("modal-caption")
};

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "loose",
  theme: "base",
  flowchart: { curve: "basis", htmlLabels: true },
  themeVariables: {
    primaryColor: "#dff7ec",
    primaryTextColor: "#17211d",
    primaryBorderColor: "#54b894",
    lineColor: "#58736a",
    secondaryColor: "#eef4ff",
    tertiaryColor: "#fff7df",
    fontFamily: "Inter, Pretendard, Segoe UI, sans-serif"
  }
});

function normalize(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function setHash(value) {
  const next = value ? `#${value}` : "";
  if (window.location.hash !== next) history.replaceState(null, "", next || window.location.pathname);
}

function updateAppNavigation(view) {
  document.querySelectorAll("[data-app-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.appView === view);
  });
}

function renderCaseCards() {
  els.caseCards.innerHTML = "";
  Object.entries(cases).forEach(([id, item]) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "case-card";
    card.innerHTML = `
      <span class="case-number">${item.number}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.card)}</p>
      <span class="case-card-link">사례 읽기 <span aria-hidden="true">→</span></span>`;
    card.addEventListener("click", () => selectCase(id));
    els.caseCards.appendChild(card);
  });
}

function renderCaseDetail(item) {
  if (!item) {
    els.caseDetail.hidden = true;
    els.caseDetail.innerHTML = "";
    return;
  }

  const structure = item.structure.map((step, index) => `
    <li><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(step)}</li>`).join("");
  const links = [
    `<button class="case-cta" type="button" data-case-node="${escapeHtml(item.nodeId)}">${escapeHtml(item.cta)} <span aria-hidden="true">↓</span></button>`,
    item.demo ? `<a class="case-cta secondary" href="${item.demo}" target="_blank" rel="noreferrer">공개 데모 열기 <span aria-hidden="true">↗</span></a>` : ""
  ].join("");

  els.caseDetail.hidden = false;
  els.caseDetail.innerHTML = `
    <div class="case-detail-head">
      <button class="case-back" type="button" data-app-view="cases">← 사례 목록</button>
      <p class="eyebrow">CASE ${item.number}</p>
      <h2>${escapeHtml(item.title)}</h2>
      <p>${escapeHtml(item.card)}</p>
    </div>
    <div class="case-story-grid">
      <article><h3>상황</h3><p>${escapeHtml(item.situation)}</p></article>
      <article><h3>검토한 방식</h3><p>${escapeHtml(item.alternatives)}</p></article>
      <article class="case-decision"><h3>선택한 방식</h3><p>${escapeHtml(item.decision)}</p></article>
    </div>
    <section class="case-structure"><h3>구조·구현 흐름</h3><ol>${structure}</ol></section>
    <section class="case-implementation"><h3>구현과 근거</h3><p>${escapeHtml(item.implementation)}</p></section>
    <section class="case-feedback case-result-panel"><h3>확인한 결과</h3><p>${escapeHtml(item.result)}</p></section>
    <section class="case-feedback"><h3>공개 경계와 자체 피드백</h3><p>${escapeHtml(item.feedback)}</p></section>
    <div class="case-actions">${links}</div>`;

  els.caseDetail.querySelector("[data-app-view='cases']").addEventListener("click", () => setAppView("cases"));
  els.caseDetail.querySelector("[data-case-node]").addEventListener("click", (event) => {
    const nodeId = event.currentTarget.dataset.caseNode;
    setAppView("systems", { updateUrl: false });
    navigate(nodeId, false);
    document.getElementById("graph-wrap").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function setAppView(view, { updateUrl = true } = {}) {
  const showCases = view === "cases";
  els.caseHub.hidden = !showCases;
  els.layout.hidden = showCases;
  updateAppNavigation(view);

  if (showCases) {
    currentCaseId = null;
    els.layout.classList.remove("case-mode");
    renderCaseDetail(null);
    if (updateUrl) setHash("cases");
    return;
  }

  currentCaseId = null;
  els.layout.classList.remove("case-mode");
  renderCaseDetail(null);
  if (updateUrl) setHash(view === "code" ? "code" : "systems");
  if (view === "systems") navigate("overview", false, { preserveCase: true });
}

function selectCase(id, { updateUrl = true } = {}) {
  const item = cases[id];
  if (!item) return;
  currentCaseId = id;
  els.caseHub.hidden = true;
  els.layout.hidden = false;
  els.layout.classList.add("case-mode");
  updateAppNavigation("cases");
  renderCaseDetail(item);
  if (updateUrl) setHash(`case=${encodeURIComponent(id)}`);
  navigate(item.nodeId, false, { preserveCase: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function openInitialView() {
  const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  if (hash.startsWith("case=")) {
    selectCase(hash.slice("case=".length), { updateUrl: false });
    return;
  }
  if (hash === "systems" || hash === "code") {
    setAppView(hash, { updateUrl: false });
    return;
  }
  setAppView("cases", { updateUrl: false });
}

function renderTree() {
  els.tree.innerHTML = "";
  const query = normalize(treeSearchQuery);

  const overviewButton = createTreeButton("overview", "전체 개요", "tree-item");
  if (!query || normalize("overview interactive game systems").includes(query)) {
    els.tree.appendChild(overviewButton);
  }

  treeGroups.forEach((group) => {
    const ids = [group.id, ...group.children];
    const matches = ids.filter((id) => {
      const node = nodes[id];
      return !query || normalize(`${node.title} ${node.summary}`).includes(query);
    });
    if (query && matches.length === 0) return;

    const wrapper = document.createElement("div");
    wrapper.className = "tree-group";

    const header = document.createElement("button");
    header.type = "button";
    header.className = `tree-title${currentNodeId === group.id ? " active" : ""}`;
    const expanded = query || expandedTreeGroups.has(group.id);
    header.textContent = group.title;
    header.setAttribute("aria-expanded", String(Boolean(expanded)));
    header.addEventListener("click", () => {
      if (expandedTreeGroups.has(group.id)) expandedTreeGroups.delete(group.id);
      else expandedTreeGroups.add(group.id);
      navigate(group.id);
      renderTree();
    });
    wrapper.appendChild(header);

    if (expanded) {
      const children = document.createElement("div");
      children.className = "tree-group-items";
      group.children.forEach((id) => {
        if (query && !matches.includes(id)) return;
        children.appendChild(createTreeButton(id, nodes[id].title, "tree-item child"));
      });
      wrapper.appendChild(children);
    }
    els.tree.appendChild(wrapper);
  });
}

function createTreeButton(id, label, className) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `${className}${currentNodeId === id ? " active" : ""}`;
  button.textContent = label;
  button.addEventListener("click", () => navigate(id));
  return button;
}

async function navigate(id, pushHistory = true, { preserveCase = false } = {}) {
  if (!nodes[id]) return;
  if (!preserveCase && currentCaseId) {
    currentCaseId = null;
    els.layout.classList.remove("case-mode");
    renderCaseDetail(null);
  }
  if (pushHistory && currentNodeId !== id) navStack.push(currentNodeId);
  currentNodeId = id;
  const node = nodes[id];

  els.title.textContent = node.title;
  els.summary.textContent = node.summary;
  els.intent.textContent = node.intent;
  els.issue.textContent = node.issue;
  els.final.textContent = node.final;
  els.next.textContent = node.next;

  await renderGraph(node);
  renderNotes(node);
  renderTree();
  updateBackButton();
}

async function renderGraph(node) {
  els.graph.removeAttribute("data-processed");
  els.graph.className = "mermaid";
  els.graph.textContent = node.graph;
  try {
    await mermaid.run({ nodes: [els.graph] });
    attachGraphClicks(node);
    captureGraphBaseSize();
    graphRenderScale = getGraphRenderScale(node);
    setGraphScale(defaultGraphScale);
  } catch (error) {
    renderGraphFallback(node);
    console.error(error);
  }
}

function renderGraphFallback(node) {
  const links = Object.values(node.links || {});
  const related = [...new Set(links)].filter((id) => nodes[id]);
  els.graph.className = "graph-fallback";
  els.graph.innerHTML = `
    <p class="graph-fallback-label">Structure summary</p>
    <h3>${escapeHtml(node.title)}</h3>
    <p>${escapeHtml(node.summary)}</p>
    <div class="graph-fallback-links"></div>`;
  const container = els.graph.querySelector(".graph-fallback-links");
  related.forEach((id) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = nodes[id].title;
    button.addEventListener("click", () => navigate(id));
    container.appendChild(button);
  });
  graphBaseSize = { width: 760, height: 280 };
  graphRenderScale = 1;
  setGraphScale(1);
}

function getGraphRenderScale(node) {
  if (node === nodes.overview) return 1.1;

  const nodeCount = els.graph.querySelectorAll("g.node").length;
  if (nodeCount <= 3) return 1.05;
  if (nodeCount === 4) return 0.95;
  if (nodeCount === 5) return 0.85;
  return 0.75;
}

function attachGraphClicks(node) {
  const links = node.links || {};
  els.graph.querySelectorAll("g.node").forEach((element) => {
    const label = normalize(element.textContent);
    const target = Object.entries(links).find(([key]) => label.includes(normalize(key)));
    if (!target) return;
    element.style.cursor = "pointer";
    element.setAttribute("tabindex", "0");
    const open = () => navigate(target[1]);
    element.addEventListener("click", open);
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") open();
    });
  });
}

function renderNotes(node) {
  els.scripts.innerHTML = "";
  currentNotes = node.notes || [];

  if (node.doc) {
    const docLink = document.createElement("a");
    docLink.className = "script-card";
    docLink.href = node.doc;
    docLink.innerHTML = `<strong>사례 연구 문서</strong><span>${node.doc}</span>`;
    els.scripts.appendChild(docLink);
  }

  if (node.demo) {
    const demoLink = document.createElement("a");
    demoLink.className = "script-card";
    demoLink.href = node.demo;
    demoLink.innerHTML = `<strong>인터랙티브 데모 열기</strong><span>${node.demo}</span>`;
    els.scripts.appendChild(demoLink);
  }

  currentNotes.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "script-card";
    button.innerHTML = `<strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.language)} · 공개용 요약</span>`;
    button.addEventListener("click", () => showNote(index));
    els.scripts.appendChild(button);
  });

  if (currentNotes.length > 0) showNote(0);
  else {
    els.codePath.textContent = "공개 설계 노트 없음";
    els.codeActions.innerHTML = "";
    els.codePreview.innerHTML = "<code>이 노드에는 공개용 코드 또는 의사 코드가 없습니다.</code>";
  }
}

function showNote(index) {
  const item = currentNotes[index];
  if (!item) return;
  els.codePath.textContent = item.name;
  els.codeActions.innerHTML = "";

  const copy = document.createElement("button");
  copy.type = "button";
  copy.textContent = "복사";
  copy.addEventListener("click", async () => {
    await navigator.clipboard.writeText(item.source);
    copy.textContent = "복사됨";
    setTimeout(() => { copy.textContent = "복사"; }, 1200);
  });
  els.codeActions.appendChild(copy);

  els.codePreview.innerHTML = `<code>${escapeHtml(item.source)}</code>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function captureGraphBaseSize() {
  const svg = els.graph.querySelector("svg");
  if (!svg) return;
  const rect = svg.getBoundingClientRect();
  graphBaseSize = { width: Math.max(rect.width, 320), height: Math.max(rect.height, 240) };
}

function setGraphScale(next) {
  graphScale = Math.min(1.8, Math.max(0.4, next));
  const svg = els.graph.querySelector("svg");
  if (svg) {
    svg.style.width = `${graphBaseSize.width * graphRenderScale * graphScale}px`;
    svg.style.height = `${graphBaseSize.height * graphRenderScale * graphScale}px`;
    svg.style.maxWidth = "none";
  }
  els.zoomReset.textContent = `${Math.round(graphScale * 100)}%`;
}

function updateBackButton() {
  els.back.disabled = navStack.length === 0;
}

function setCodePanelWidth(width) {
  const min = 320;
  const max = Math.min(760, window.innerWidth * 0.48);
  const safe = Math.max(min, Math.min(max, width));
  els.layout.style.setProperty("--code-panel-width", `${safe}px`);
  localStorage.setItem("portfolio-code-panel-width", String(safe));
}

function startResize(event) {
  if (window.innerWidth <= 860) return;
  event.preventDefault();
  els.layout.classList.add("is-resizing");

  const move = (moveEvent) => setCodePanelWidth(window.innerWidth - moveEvent.clientX);
  const stop = () => {
    els.layout.classList.remove("is-resizing");
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", stop);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", stop);
}

els.search.addEventListener("input", (event) => {
  treeSearchQuery = event.target.value;
  renderTree();
});

els.back.addEventListener("click", () => {
  const previous = navStack.pop();
  if (previous) navigate(previous, false);
});

els.zoomOut.addEventListener("click", () => setGraphScale(graphScale - 0.1));
els.zoomReset.addEventListener("click", () => setGraphScale(defaultGraphScale));
els.zoomIn.addEventListener("click", () => setGraphScale(graphScale + 0.1));
els.codeResizer.addEventListener("pointerdown", startResize);
els.codeResizer.addEventListener("dblclick", () => setCodePanelWidth(460));

els.codeResizer.addEventListener("keydown", (event) => {
  const current = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--code-panel-width")) || 460;
  if (event.key === "ArrowLeft") setCodePanelWidth(current + 20);
  if (event.key === "ArrowRight") setCodePanelWidth(current - 20);
});

els.theme.addEventListener("click", () => {
  const dark = document.body.classList.toggle("dark-theme");
  els.theme.textContent = dark ? "White" : "Black";
  localStorage.setItem("portfolio-theme", dark ? "dark" : "light");
});

document.querySelectorAll("[data-app-view]").forEach((button) => {
  if (button.closest("#case-detail")) return;
  button.addEventListener("click", () => setAppView(button.dataset.appView));
});

els.modalClose.addEventListener("click", () => els.modal.close());
els.modal.addEventListener("click", (event) => {
  if (event.target === els.modal) els.modal.close();
});

if (localStorage.getItem("portfolio-theme") === "dark") {
  document.body.classList.add("dark-theme");
  els.theme.textContent = "White";
}

setCodePanelWidth(Number(localStorage.getItem("portfolio-code-panel-width")) || 460);
renderCaseCards();
renderTree();
navigate("overview", false, { preserveCase: true });
openInitialView();
window.addEventListener("hashchange", openInitialView);
