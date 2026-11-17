# Khaemenes Academy Class Tools Configuration Contract v1

The Class Tools toolbar is a portable, idempotent shell. Each school-level repository may provide its own `window.KhaemenesClassToolsConfigV1` before loading the toolbar engine.

## Goals

- one visual interaction pattern across Academy schools;
- age-appropriate tools selected locally;
- six-button symmetric grid;
- lower-left placement to balance the lower-right ecosystem toolbar;
- no grading/mastery side effects;
- repeated loads remain idempotent.

## Configuration shape

```js
window.KhaemenesClassToolsConfigV1 = {
  id: "elementary-grade-03",
  match: /student-profile/,
  toggleLabel: "Class Tools",
  ariaLabel: "Class tools",
  tools: [
    { type:"link", label:"Learning Games", sub:"Play & practice", href:"games/" },
    { type:"materials", label:"My Materials", sub:"Books & printables" },
    { type:"link", label:"Reading", sub:"Books & stories", href:"reading/" },
    { type:"link", label:"Parent Tools", sub:"Family help", href:"..." },
    { type:"link", label:"Search", sub:"Safe ecosystem search", href:"..." },
    { type:"help", label:"How To", sub:"Show me what to do" }
  ],
  materials: {
    title:"My Learning Materials",
    intro:"Open the lesson you are working on.",
    links:[]
  },
  help: {
    title:"How Class Tools Work",
    paragraphs:[]
  },
  notesHref:"..."
};
```

## Age-level mapping principle

The shell stays constant; labels and destinations change.

Suggested school-level progression:

- Pre-K / Kindergarten: Stories, Songs, Shapes, Numbers, Family Help, How To
- Grades 1–2: Games, Reading, Printables, Creative Tools, Parent Tools, How To
- Grades 3–5: Games, Learning Materials, Notes/Journal, Creative Tools, Parent Tools, Search
- Middle School: Games, Materials, Notes, Study Tools, Parent Tools, Search
- High School: Games, Materials, Notes, Parent Tools, Search, Instructions

Exact mappings belong to each repository and grade, not to the shared engine.

## Idempotence

The engine:
- uses stable root/style IDs;
- removes duplicate roots/styles;
- exposes one global mount API;
- aborts prior listeners before remount;
- permits safe repeated calls from shared chrome;
- records the active configuration ID on the document root.

## Boundary

The toolbar is navigation/presentation only. It must not:
- award mastery;
- alter course grades;
- mutate assessment state;
- bypass age or parent permissions.
