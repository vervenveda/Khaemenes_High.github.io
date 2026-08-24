"use strict";

(() => {
  const STORES = [
    {
      key: "KHAE_SS12_GPIR_OBSERVATORY_V1",
      issued: student => student?.progress?.creditIssued === true,
      issuedDate: student => student?.progress?.creditDate || ""
    },
    {
      key: "khaemenes_grade12_global_politics_v1",
      issued: student => student?.teacher?.issued === true,
      issuedDate: student => student?.teacher?.issuedDate || ""
    }
  ];

  const requested = new URLSearchParams(location.search).get("student");
  const unavailable = document.getElementById("certificateUnavailable");
  const certificate = document.getElementById("certificate");
  const studentName = document.getElementById("studentName");
  const issuedDate = document.getElementById("issuedDate");
  const printButton = document.getElementById("printCertificate");

  function readStore(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw || raw.length > 2_000_000) return null;
      const parsed = JSON.parse(raw);
      return parsed && Array.isArray(parsed.students) ? parsed : null;
    } catch {
      return null;
    }
  }

  function cleanText(value, maxLength = 160) {
    return String(value ?? "")
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength);
  }

  function selectIssuedStudent(db, store) {
    const students = db.students.filter(student => student && typeof student === "object" && store.issued(student));
    if (!students.length) return null;

    if (requested) {
      const match = students.find(student =>
        cleanText(student.id, 160) === requested || cleanText(student.name, 160) === requested
      );
      if (match) return match;
    }

    const active = students.find(student => cleanText(student.id, 160) === cleanText(db.activeId, 160));
    return active || students[0];
  }

  let record = null;
  for (const store of STORES) {
    const db = readStore(store.key);
    if (!db) continue;
    const student = selectIssuedStudent(db, store);
    if (!student) continue;
    record = {
      name: cleanText(student.name, 120) || "Student",
      date: cleanText(store.issuedDate(student), 80) || "Recorded in local evaluator workflow"
    };
    break;
  }

  if (!record) {
    unavailable.hidden = false;
    certificate.hidden = true;
    return;
  }

  studentName.textContent = record.name;
  issuedDate.textContent = record.date;
  certificate.hidden = false;
  unavailable.hidden = true;
  printButton.addEventListener("click", () => window.print());
})();
