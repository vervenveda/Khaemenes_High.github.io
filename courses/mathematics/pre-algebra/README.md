# Khaemenes Pre-Algebra — Hidden Course Cloud v2.3

The student-facing page is the original Pre-Algebra portal. The cloud remains completely hidden.

## v2.3 hardening
- Child-page cloud bridge now loads before unit dashboard scripts, so virtual `fetch()` is available during initialization.
- Unit `unit-map.json` and `vocabulary.json` requests remain inside the embedded filesystem.
- Archaemenes hardening core is embedded and no longer depends on a physical `assets/` path.
- Relative links that climb above Pre-Algebra and name another destination resolve into the real Khaemenes High tree.
- Bare upward navigation from a lesson/unit returns to the visible Pre-Algebra portal.
- No cloud UI, file tree, storage controls, or cloud terminology is exposed to students.

Test in `vervenveda/Dummy.github.io` before production migration.
