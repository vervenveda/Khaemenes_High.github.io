const assert = require("node:assert/strict");
const test = require("node:test");
const evidence = require("../assets/evidence-reconciler.js");

test("canonical evidence alone determines unit mastery", () => {
  const canonicalState = {units:{"unit-01":{
    threshold:80,
    lessonIds:["1.1","1.2"],
    lessonAttempts:{
      "1.1":{bestScore:92,attemptCount:2,masteredAt:11},
      "1.2":{bestScore:80,attemptCount:1,masteredAt:12}
    }
  }}};
  const snapshot = evidence.buildSnapshot({
    canonicalState,
    student:{progress:{weeks:{1:{lessons:{Monday:true,Tuesday:true},quiz:{best:100,attempts:[{}]}}}}},
    weeks:[{week:1}]
  });
  assert.equal(snapshot.canonical.masteredUnits, 1);
  assert.equal(snapshot.canonical.units[0].masteryVerified, true);
  assert.equal(snapshot.canonical.learnerAttribution, "unverified-browser-local");
  assert.equal(snapshot.canonical.mayAttributeToActivePortalStudent, false);
  assert.equal(snapshot.historicalActivity.mayAwardMastery, false);
  assert.equal(snapshot.historicalActivity.mayUnlockProgression, false);
});

test("perfect legacy activity cannot create canonical mastery", () => {
  const snapshot = evidence.buildSnapshot({
    canonicalState:{},
    student:{progress:{weeks:{1:{lessons:{Monday:true,Tuesday:true,Wednesday:true,Thursday:true,Friday:true},quiz:{best:100,attempts:[{}]}}}}},
    weeks:[{week:1}]
  });
  assert.equal(snapshot.canonical.masteredUnits, 0);
  assert.equal(snapshot.historicalActivity.reviewedLessons, 5);
  assert.equal(snapshot.historicalActivity.practiceQuizBestAverage, 100);
  assert.equal(snapshot.historicalActivity.mayOverwriteCanonicalEvidence, false);
});

test("a lower latest score cannot erase a higher canonical best score", () => {
  const unit = evidence.summarizeUnit("unit-02", {
    threshold:80,
    lessonIds:["4.1"],
    lessonScores:{"4.1":55},
    lessonAttempts:{"4.1":{firstScore:85,latestScore:55,bestScore:85,attemptCount:2,masteredAt:10}}
  });
  assert.equal(unit.bestScoreAverage, 85);
  assert.equal(unit.masteryVerified, true);
});

test("malformed and out-of-range scores are rejected", () => {
  const unit = evidence.summarizeUnit("unit-01", {
    lessonIds:["1.1","1.2","1.3"],
    lessonAttempts:{"1.1":{bestScore:101},"1.2":{bestScore:-1},"1.3":{bestScore:"not-a-score"}}
  });
  assert.equal(unit.scoredCount, 0);
  assert.equal(unit.masteryVerified, false);
});
