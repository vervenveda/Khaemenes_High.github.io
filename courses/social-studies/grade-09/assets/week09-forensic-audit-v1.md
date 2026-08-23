# Week 9 Forensic Audit v1

## Status
PASS WITH ASSESSMENT REPAIR — historical framing is strong; legacy printable assessment contained relic questions and did not match canonical quiz.json.

## Scope
South Asia and the Indian Ocean; c. 322 BCE–600 CE.

## Historical-integrity findings
- Ashoka's edicts are treated as royal communication and self-presentation; the course does not infer universal compliance from the inscriptions alone.
- The Gupta period is not presented as an unqualified universal “golden age”; regional variation, unequal status, and elite-source visibility are acknowledged.
- Indian Ocean exchange is correctly modeled as overlapping networks of ports, routes, merchants, diasporas, religious communities, and intermediaries.
- Monsoon knowledge is presented as an aid to seasonal planning, not as elimination of maritime risk.
- Cultural diffusion is treated as transmission plus local selection, reinterpretation, combination, or rejection.
- Modern borders are not projected backward onto the historical network.

## Assessment finding
The canonical `quiz.json` defines `W09Q1`–`W09Q10`, an 80% mastery threshold, and a 5-point constructed response. The legacy `student-packet.html` contained a mixed/relic quiz with questions about Rome/Han, Byzantium, Africa, Islam, and other weeks, despite being labeled Week 9. This is a genuine synchronization defect.

## Repair
Created `student-packet-v2.html` containing the canonical W09Q1–W09Q10 assessment, canonical constructed response, stable question IDs, and reasoning-correction record. Updated `teacher-guide.html` so v2 is canonical and its key matches quiz.json.

## Mastery invariant
80% objective mastery. Below 8/10 requires concept review, written reasoning correction, and retake. Constructed response is teacher-scored separately.

## Systems/ProTools integration
The teacher guide already integrates ARSHIF, Evidence & Citation Studio, Atlas Evidence Analysis, and PROSE as research/production supports while preserving teacher grading authority. These tools should remain evidence-support systems, not substitutes for historical reasoning or mastery.

## Audit result
Week 9 content: PASS. Historical integrity: PASS. Legacy assessment synchronization: REPAIR COMPLETED. Week 9 is ready to close after runtime/link verification.
