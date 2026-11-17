# Khaemenes Academy Mathematics Course Map v2

Status: Canonical companion schema for the four core high-school mathematics courses.

## Purpose

Provide one predictable data contract for Pre-Algebra, Algebra I, Geometry, and Algebra II while preserving each course's legacy map and course-specific curriculum.

## Required top-level keys

- schema_version
- schema_id
- source
- course
- readiness
- calendar
- units
- weeks
- assessments
- evidence
- resources
- metadata

## Course contract

Every course exposes:

- id
- profile_course_id
- code
- title
- short_title
- audience
- prerequisite
- duration_weeks
- supported_duration_weeks
- mastery_target
- pathways
- delivery
- storage_key
- version

The mastery target remains 80 unless the source course explicitly specifies another authorized value.

## Unit contract

Every unit exposes:

- id
- number
- title
- weeks
- week_numbers
- path
- essential_question
- project
- objectives
- standards
- lesson_count
- lessons
- status

Course-specific data may remain null or empty. Null does not mean failed or absent learning; it means the legacy source did not publish that field in the same form.

## Week contract

Every course exposes a 36-entry weeks array. Where the legacy map already publishes explicit weeks, those records are preserved. Where it does not, v2 generates a non-authoritative navigation index from the legacy unit duration/calendar metadata.

Week records expose:

- number
- unit
- title
- essential_question
- unit_path
- lesson_ids
- skills
- focus

## Compatibility rule

Legacy course-map.json remains authoritative for any existing runtime that already consumes it. course-map-v2.json is a read-compatible normalization layer for new shared mathematics systems.

No learner records, mastery scores, assessment outcomes, storage keys, or progression gates are migrated or rewritten by this schema.

## Current adopters

- pre-algebra/course-map-v2.json
- algebra-1/course-map-v2.json
- geometry/course-map-v2.json
- algebra-2/course-map-v2.json
