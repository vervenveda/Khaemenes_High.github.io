# Science 9 Repair 03 — Assessment Hall Course-Map Guard

Upload this package from the repository root while preserving folders.

## File Replaced

```text
courses/science/integrated-science-9/course-ui.js
```

## Repair

The shared course controller now requests `course-map.json` only when the current page contains:

```html
id="unitList"
```

That element exists on the Science 9 course landing page, where the dynamic course map is required.

It does not exist on the Assessment Hall. Therefore, the Assessment Hall will no longer request the nonexistent path:

```text
courses/science/integrated-science-9/assessments/course-map.json
```

## Preserved Behavior

- Science landing-page course map
- Search and status filtering
- Student progress
- Import and export
- Theme switching
- Online and offline status
- Assessment Hall navigation
- Repair 2 shared theme loader
- All localStorage keys and course data
