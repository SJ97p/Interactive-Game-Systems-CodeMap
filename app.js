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
    summary: "실물 입력, 제작 도구, 포즈 데이터와 서버를 Unity 경험으로 연결한 문제 해결 포트폴리오",
    intent: "서로 다른 외부 시스템을 게임에서 실제로 사용할 수 있는 제작·설정·실행 흐름으로 통합해야 했습니다.",
    issue: "기존 방식은 작업자 감각, 단순 연결 코드, 환경별 품질 차이와 분리된 서버 API에 의존했습니다.",
    final: "문제를 제작 도구, 장치 진단, 데이터 파이프라인과 서버 응용 계층으로 나누어 검증하고 구현했습니다.",
    next: "회사 원본과 제품 정보는 공개하지 않으며, 독립 데모와 일반화된 설계 설명만 제공합니다.",
    graph: graph([
      'O["인터랙티브 게임 시스템"]',
      'O --> R["BPM 채보 도구"]',
      'O --> B["BLE 장치 진단"]',
      'O --> P["포즈 데이터 연동"]',
      'O --> S["게임 서버 통합"]'
    ]),
    links: { "BPM 채보 도구": "rhythm", "BLE 장치 진단": "ble", "포즈 데이터 연동": "pose", "게임 서버 통합": "server" },
    notes: [designNotes.scope]
  },

  rhythm: {
    title: "BPM 리듬 채보 편집기",
    summary: "사람의 시간 감각에 의존한 채보를 BPM 중심 제작·재생 방식으로 전환",
    intent: "작업자마다 달라지는 노트 타이밍을 음악의 박자 체계에 맞추고 비개발자도 편집할 수 있어야 했습니다.",
    issue: "절대 시간값을 감각적으로 기록해 박자 오차와 작업자 편차가 생겼고 수정 비용도 컸습니다.",
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
    issue: "개별 float 시점만 저장하면 박자 의미가 사라지고 편집 기준이 사람마다 달라집니다.",
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
    issue: "사람이 기록한 부정확한 절대 시간값이 그대로 스폰 기준이 됐습니다.",
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

const expandedTreeGroups = new Set(treeGroups.map((group) => group.id));
const navStack = [];
let currentNodeId = "overview";
let treeSearchQuery = "";
const defaultGraphScale = 0.7;
let graphScale = defaultGraphScale;
let graphBaseSize = { width: 760, height: 420 };
let currentNotes = [];

const els = {
  layout: document.getElementById("layout"),
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

async function navigate(id, pushHistory = true) {
  if (!nodes[id]) return;
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
    setGraphScale(defaultGraphScale);
  } catch (error) {
    els.graph.textContent = "그래프를 렌더링하지 못했습니다.";
    console.error(error);
  }
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
    svg.style.width = `${graphBaseSize.width * graphScale}px`;
    svg.style.height = `${graphBaseSize.height * graphScale}px`;
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

els.modalClose.addEventListener("click", () => els.modal.close());
els.modal.addEventListener("click", (event) => {
  if (event.target === els.modal) els.modal.close();
});

if (localStorage.getItem("portfolio-theme") === "dark") {
  document.body.classList.add("dark-theme");
  els.theme.textContent = "White";
}

setCodePanelWidth(Number(localStorage.getItem("portfolio-code-panel-width")) || 460);
renderTree();
navigate("overview", false);
