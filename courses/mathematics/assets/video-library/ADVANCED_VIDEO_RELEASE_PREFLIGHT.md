# Advanced Mathematics Video — Student Release Preflight

**Status: pending human playback and caption verification.** None of the 64 staged placements in Algebra I, Geometry or Algebra II has been approved for student release.

## Independent release checks

1. Verify authorized publisher, current title and whether the third-party source fits the Academy sovereign-platform boundary. Khan Academy remains research-only under the existing policy unless that policy is explicitly reconsidered.
2. Review the **entire recording** for mathematical correctness, pacing and suitability.
3. Confirm the actual privacy-enhanced embed plays in the published lesson on phone, tablet and desktop, with keyboard controls and no autoplay. An embedded YouTube video cannot guarantee freedom from advertisements.
4. Confirm captions inside the actual player, plus a usable transcript or original lesson-reading alternative.
5. Verify the exact learning objectives, placement and non-mastery-bearing purpose.
6. Only after evidence review, approve both the shared asset and its course placement. Do not alter existing assessment gates.

The renderer requires asset.enabled, asset.playback_verified and asset.captions_verified to be true. The asset certification must confirm student_release_approved, whole_video_reviewed, privacy_embed_verified, captions_verified, responsive_lesson_rendering_verified, transcript_or_text_fallback_verified, and topic_alignment_verified. The course placement separately requires enabled and release_approved. The iframe URL must be an exact HTTPS youtube-nocookie.com embed with a matching video ID and no parameters.

**Current backlog:** Algebra I 23, Geometry 22, Algebra II 19. Preserve all candidates, Academy-written lessons and independent mastery checks until actual review is complete.

Automated safety check: node tools/test-advanced-math-video-release-preflight.mjs
