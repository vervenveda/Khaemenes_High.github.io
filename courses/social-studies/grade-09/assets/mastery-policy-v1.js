(() => {
  'use strict';

  /*
    Khaemenes High · Grade 9 Global Studies Honors
    Canonical Mastery Policy v1

    This policy supersedes legacy passing thresholds in older metadata.
    It is intentionally separate from readiness, retention, refresh, and
    course-completion records.
  */

  const POLICY = Object.freeze({
    version: '1.0.0',
    courseId: 'grade09-global-studies-honors',
    officialWeeks: 36,
    supportedPathwayWeeks: 42,
    unit0PrepLessons: 6,
    masteryPercent: 80,
    readinessOverallPercent: 80,
    readinessStrandPercent: 80,
    honorsReportingPercent: 85,
    officialWeeklyQuizCount: 36,
    unit0CountsAsOfficialCourseWeek: false,
    unit0CountsAsOfficialWeeklyQuiz: false,
    unit0CountsTowardOfficialCourseGrade: false,
    rule: '80% mastery is the canonical threshold across the course. Readiness requires 80% overall and 80% in every essential strand.'
  });

  window.KHAEMENES_SS9_MASTERY_POLICY = POLICY;

  const COURSE = window.KHAEMENES_SOCIAL_STUDIES_DATA;
  if (COURSE?.metadata) {
    // Runtime compatibility overlay: older course-data metadata may still
    // contain a legacy passingTarget. The current curriculum contract wins.
    COURSE.metadata.passingTarget = POLICY.masteryPercent;
    COURSE.metadata.masteryTarget = POLICY.masteryPercent;
    COURSE.metadata.readinessTarget = POLICY.readinessOverallPercent;
    COURSE.metadata.readinessStrandTarget = POLICY.readinessStrandPercent;
    COURSE.metadata.officialWeeks = POLICY.officialWeeks;
    COURSE.metadata.supportedPathwayWeeks = POLICY.supportedPathwayWeeks;
  }
})();
