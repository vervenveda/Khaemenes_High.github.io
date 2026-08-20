# Beta Index Coverage

- Added in this run: **0**
- Already covered: **435**
- Skipped: **0**

Branch: `hardening/archaemenes-highschool` only. High School `main` is intentionally untouched.

Rule: visible HTML filenames ending in `index.html` (including `_index.html` and common `inndex.html` typos) receive `/assets/vnv-beta-link.js`. The widget reports only public hostname + pathname; never learner/family IDs, answers, form values, query/hash, storage, or credentials.
