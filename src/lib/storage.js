const STORAGE_KEY = "money_matters_students";

export function saveStudentRecord(record) {
  const all = getAllStudents();
  const existing = all.findIndex((s) => s.name.toLowerCase() === record.name.toLowerCase());
  if (existing >= 0) {
    // Keep the better score
    if (record.xp >= all[existing].xp) {
      all[existing] = { ...record, updatedAt: Date.now() };
    }
  } else {
    all.push({ ...record, updatedAt: Date.now() });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getAllStudents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearAllStudents() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getStudentProgress(name) {
  return getAllStudents().find((s) => s.name.toLowerCase() === name.toLowerCase()) || null;
}