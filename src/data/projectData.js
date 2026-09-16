export const projectData = {
  metadata: {
    title: "Stack Tower",
    document: "Game Development SOW",
    gameId: "2",
    genre: "One-tap arcade / stacking",
    complexity: "1 Star - Simple",
    target: "Mobile-first; Android and iOS",
    version: "1.0",
    status: "Planning baseline",
    tagline: "Tap to drop horizontally moving blocks and build the highest, most stable tower.",
    preparedFor: "Estimation, design, development, quality assurance, release planning, and client approval."
  },
  productVision: {
    overview:
      "This Statement of Work defines the design and production scope for Stack Tower, a one-tap arcade / stacking title. Tap to drop horizontally moving blocks and build the highest, most stable tower. The intended result is a polished, replayable, client-demo-ready game with clear feedback, responsive controls, scalable content configuration, and production-grade mobile behavior.",
    calloutText:
      "A block moves left and right above the tower. The player taps to drop it. The overlapping area becomes the next platform; any overhang is cut away. The run ends when a block misses completely.",
    specifications: [
      { label: "Primary Audience", value: "Casual mobile players seeking short, instantly understandable sessions." },
      { label: "Session Target", value: "Approximately 30 seconds to 5 minutes depending on skill and mode." },
      { label: "Orientation", value: "Portrait by default; landscape may be substituted only through approved design change." },
      { label: "Core Objective", value: "Maximize score/progress while mastering a simple control and escalating challenge." },
      { label: "Design Principles", value: "Immediate readability, fair challenge, fast restart, satisfying feedback, and stable performance." }
    ],
    successMeasures: [
      { area: "Usability", target: "A new player understands the core action within the first playable run." },
      { area: "Responsiveness", target: "Recognized gameplay input produces visible response without perceptible delay." },
      { area: "Performance", target: "Target 60 FPS on supported mid-range devices; no sustained gameplay stutter." },
      { area: "Stability", target: "No blocker or critical defect in release candidate." },
      { area: "Replayability", target: "Score, best score, progression and restart loop operate consistently." }
    ]
  },
  gameplay: {
    coreMechanic:
      "A block moves left and right above the tower. The player taps to drop it. The overlapping area becomes the next platform; any overhang is cut away. The run ends when a block misses completely.",
    controls: "Single tap to release the active block.",
    scoring: "1 point per successful placement; bonus points and combo multiplier for near-perfect and perfect alignment.",
    difficultyProgression: "Movement speed, direction changes, block size pressure, wind/theme effects, and score milestones increase difficulty.",
    tuningParameters: [
      "Difficulty curve values must be data-driven and editable without changing core gameplay code.",
      "Randomized content must use validated patterns and must never create an unavoidable failure.",
      "Score awards, combo windows, speed, spawn intervals, lives, timers and thresholds must be centrally configurable.",
      "First-session tuning favors learning; challenge should rise gradually and remain deterministic enough for QA."
    ],
    entities: [
      "Moving blocks",
      "Stacked tower",
      "Cut-off fragments",
      "Perfect-placement indicator",
      "Camera",
      "Background layers"
    ],
    criticalEdgeCases: [
      "Full miss",
      "Near-zero overlap",
      "Rapid repeated taps",
      "Pause during fall",
      "App backgrounding",
      "Very tall tower",
      "Floating-point drift"
    ]
  },
  functionalRequirements: [
    { id: "FR-01", name: "Start and tutorial", summary: "Player can enter gameplay from Home and receives concise first-run guidance." },
    { id: "FR-02", name: "Core input", summary: "Single tap to release the active block." },
    { id: "FR-03", name: "Rules and collision", summary: "Game evaluates valid actions, hazards, success and failure consistently." },
    { id: "FR-04", name: "Scoring", summary: "1 point per successful placement; bonus points and combo multiplier for near-perfect and perfect alignment." },
    { id: "FR-05", name: "Difficulty", summary: "Movement speed, direction changes, block size pressure, wind/theme effects, and score milestones increase difficulty." },
    { id: "FR-06", name: "Pause/resume", summary: "All simulation and timers freeze and resume without state loss." },
    { id: "FR-07", name: "Results/restart", summary: "Result is shown once; restart loads a clean playable state." },
    { id: "FR-08", name: "Persistence", summary: "Best score, settings, tutorial status and unlocked content persist locally." },
    { id: "FR-09", name: "Audio/haptics", summary: "Music, SFX and vibration follow independent user settings." },
    { id: "FR-10", name: "Device lifecycle", summary: "Backgrounding safely pauses; returning never grants unfair movement or collision." }
  ],
  gameStates: [
    { state: "Ready", behavior: "Scene is stable; objective and input hint are visible." },
    { state: "Active", behavior: "Gameplay simulation, score, input, feedback, spawning and camera are enabled." },
    { state: "Paused", behavior: "Simulation and timers stop; resume, restart, settings and exit are available." },
    { state: "Success / Milestone", behavior: "Positive feedback is shown and next content/state is unlocked where applicable." },
    { state: "Failure", behavior: "Cause is communicated; score is finalized once; gameplay input is blocked." },
    { state: "Results", behavior: "Current score, best score/progress, rewards and replay/home actions are shown." }
  ],
  screens: [
    { screen: "Splash / Loading", scope: "Brand mark, loading state, error-safe transition." },
    { screen: "Home", scope: "Play, best score/progress, Settings, optional cosmetic entry." },
    { screen: "How to Play", scope: "One concise objective card plus animated or interactive input hint." },
    { screen: "Gameplay HUD", scope: "Score/progress plus only essential mode indicators; respects safe areas." },
    { screen: "Pause", scope: "Resume, restart, settings, quit confirmation." },
    { screen: "Results", scope: "Score, best, rewards/progress, replay and home." },
    { screen: "Settings", scope: "Music, SFX, haptics, accessibility options, privacy/about links if supplied." }
  ],
  visualAudioScope: {
    visualProduction: "6 block material sets, 5 backgrounds, particles for perfect drops, tower shadows, impact fragments.",
    audioProduction: "Tap/drop, landing impact, perfect chime, combo rise, miss/fall, button UI, looping ambient track.",
    categories: [
      { category: "UI", delivery: "Home, HUD, pause, results, settings, tutorial, icons and button states." },
      { category: "Gameplay", delivery: "Optimized sprites/meshes, materials, effects and environment elements required by the mechanic." },
      { category: "Animation", delivery: "Readable anticipation, action, impact, success and failure feedback." },
      { category: "VFX", delivery: "Performance-conscious particles for scoring, interaction, collision and milestones." },
      { category: "Audio", delivery: "Loop-ready music, balanced SFX, mixer groups, mute controls and lifecycle handling." }
    ]
  },
  technicalScope: [
    { area: "Architecture", requirement: "Modular state management; gameplay systems separated from UI and platform services." },
    { area: "Configuration", requirement: "Difficulty and content values stored in editable configuration/data assets." },
    { area: "Physics/timing", requirement: "Fixed-step or equivalent stable simulation where mechanic accuracy requires it." },
    { area: "Performance", requirement: "Target 60 FPS; memory and draw calls appropriate for agreed minimum devices." },
    { area: "Resolution", requirement: "Responsive layout, safe areas, scalable UI, no clipped or stretched content." },
    { area: "Save data", requirement: "Versioned local save with safe defaults and corruption recovery." },
    { area: "Analytics readiness", requirement: "Named events and parameters documented; SDK integration is optional scope." },
    { area: "Privacy/security", requirement: "No unnecessary personal data; secrets and signing files excluded from source handover." },
    { area: "Builds", requirement: "Installable Android build and iOS project/build subject to valid client credentials." }
  ],
  operatingAssumptions: [
    { item: "Platforms", baseline: "Android and iOS mobile phones" },
    { item: "Input", baseline: "Single-touch interaction; game-specific behavior defined" },
    { item: "Connectivity", baseline: "Core gameplay works offline" },
    { item: "Data", baseline: "Local settings and progress; no personal data required in baseline" },
    { item: "Aspect ratios", baseline: "Common modern phone ratios with safe-area support" },
    { item: "Accessibility", baseline: "Readable contrast, audio toggles, haptics toggle, reduced motion where practical" }
  ],
  analyticsEvents: [
    { event: "game_start", parameters: "mode, session sequence, tutorial status." },
    { event: "game_end", parameters: "score, duration, reason, progression point, best-score flag." },
    { event: "tutorial_step / tutorial_complete", parameters: "step and completion status." },
    { event: "pause, resume, restart and quit", parameters: "gameplay state and elapsed time." },
    { event: "content_unlock / level_complete", parameters: "where applicable." }
  ],
  deliverables: [
    { id: 1, deliverable: "Approved game design and tuning specification." },
    { id: 2, deliverable: "UX flow and game-specific screen designs." },
    { id: 3, deliverable: "Implemented playable game with complete core loop." },
    { id: 4, deliverable: "Integrated UI, gameplay art, animation, VFX and audio." },
    { id: 5, deliverable: "Editable gameplay/content configuration and documented parameters." },
    { id: 6, deliverable: "Local save/settings implementation." },
    { id: 7, deliverable: "QA test summary, known-issues list and acceptance build." },
    { id: 8, deliverable: "Source code/project files and build instructions." },
    { id: 9, deliverable: "Android release candidate; iOS candidate/project subject to credentials." }
  ],
  acceptanceCriteria: [
    "All mandatory functional requirements FR-01 through FR-10 pass on agreed test devices.",
    "No open blocker or critical defects; high-priority defects require written disposition.",
    "Core gameplay is completable/playable for repeated sessions without state corruption.",
    "UI has no overlap, clipping, inaccessible controls or unsafe-area violations on the agreed device matrix.",
    "Audio/settings/save state persist correctly after app restart.",
    "Final candidate meets agreed performance target under normal gameplay.",
    "Client completes one consolidated acceptance review within the agreed review window."
  ]
};
