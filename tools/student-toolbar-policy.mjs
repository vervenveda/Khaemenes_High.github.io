import path from "node:path";

export const TOOLBAR_SRC="https://vervenveda.com/Khaemenes_High.github.io/assets/vnv-beta-link.js";
export const TOOLBAR_TAG='<script src="'+TOOLBAR_SRC+'" defer data-khaemenes-student-toolbar="v1.8"></script>';

export const sharedPattern=/course-entry-contract\.js|high-school-learning-context-v1\.js|(?:geometry|algebra-2)\/assets\/lesson-tools\.js|src=["'][^"']*\/assets\/lesson-tools\.js/i;
export const directPattern=/vnv-beta-link\.js/i;

const nonStudentPath=/(^|\/)(?:teacher|teachers|teacher-resources|staff|admin|faculty|instructor|answer-keys?|answer_keys?|private)(?:\/|$)/i;
const nonStudentFile=/(?:^|\/)(?:404|HIGH_SCHOOL_PROFILE_SNIPPET|[^/]*(?:teacher[-_ ]?guide|answer[-_ ]?key|solutions?[-_ ]?key)[^/]*)\.html$/i;

export function isStudentFacing(rel,html=""){
  const page=String(rel||"").replaceAll(path.sep,"/");
  if(!/\.html$/i.test(page))return false;
  if(nonStudentPath.test(page)||nonStudentFile.test(page))return false;
  if(/data-student-facing=["']false["']/i.test(html))return false;
  const title=(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||"").replace(/<[^>]+>/g," ").trim();
  if(/\b(?:teacher(?:'s)?|instructor|faculty|answer key|solutions key)\b/i.test(title))return false;
  return true;
}

export function toolbarStatus(html){
  if(directPattern.test(html))return "direct";
  if(sharedPattern.test(html))return "shared";
  return "uncovered";
}

export function injectToolbar(html){
  if(directPattern.test(html)||sharedPattern.test(html))return html;
  if(/<\/body>/i.test(html))return html.replace(/<\/body>/i,TOOLBAR_TAG+"\n</body>");
  if(/<\/html>/i.test(html))return html.replace(/<\/html>/i,TOOLBAR_TAG+"\n</html>");
  return html+"\n"+TOOLBAR_TAG+"\n";
}
