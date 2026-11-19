/* Khaemenes Academy · mathematics evidence router v1
   Read-only normalizer over existing course-specific authorities. No writes or migrations. */
(()=>{"use strict";
if(window.KhaemenesMathEvidenceRouter)return;
const M=80,manifest=()=>window.KhaemenesMathCourseManifest?.get?.()||null,progress=()=>window.KhaemenesMathProgress?.snapshot?.()||null;
function normalized(){const m=manifest(),p=progress();if(!m)return null;return {schema:"khaemenes-math-evidence-router-v1",course:m.slug,course_code:m.code,mastery_threshold:M,topology:{duration_weeks:m.duration_weeks,unit_count:m.units?.length||13},readiness:p?.readiness??null,progress:p?.progress??{status:"unavailable"},mastery:p?.mastery??{status:"unavailable",threshold:M},portfolio:p?.portfolio??{status:"unavailable"},assessment_paths:m.assessment,provenance:{read_only:true,source_progress_schema:p?.schema||null,source_topology_schema:m.schema,storage_migrated:false}}}
window.KhaemenesMathEvidenceRouter={schema:"khaemenes-math-evidence-router-v1",snapshot:normalized};
})();