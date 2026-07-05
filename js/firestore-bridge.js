// ============================================================
// PONTE (BRIDGE) ENTRE O DASHBOARD E O FIRESTORE
// ============================================================
// Estrutura de dados no Firestore:
//
// dashboards (coleção)
//   └── {dashboardKey} (documento)         -> versão "atual" (mais recente)
//         { dashboardKey, title, orgName, data, updatedAt }
//         └── versions (subcoleção)
//               └── {versionId} (documento)  -> histórico de versões
//                     { dashboardKey, title, orgName, data, updatedAt }
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(window.FIREBASE_CONFIG);
const db = getFirestore(app);

function isConfigured() {
  return !!(window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.apiKey &&
    window.FIREBASE_CONFIG.apiKey !== "COLE_AQUI_SUA_API_KEY");
}

async function saveDashboard({ dashboardKey, title, data }) {
  const payload = {
    dashboardKey,
    title,
    orgName: (data && data.meta && data.meta.orgName) || "",
    data,
    updatedAt: serverTimestamp()
  };

  // salva/atualiza o documento "atual"
  await setDoc(doc(db, "dashboards", dashboardKey), payload);

  // grava também uma cópia no histórico de versões
  await addDoc(collection(db, "dashboards", dashboardKey, "versions"), payload);

  return { message: "Dados salvos no Firestore." };
}

async function loadCurrentDashboard(dashboardKey) {
  const snap = await getDoc(doc(db, "dashboards", dashboardKey));
  if (!snap.exists()) return { found: false };
  return { found: true, data: snap.data().data };
}

async function listDashboardVersions(dashboardKey, max = 50) {
  const q = query(
    collection(db, "dashboards", dashboardKey, "versions"),
    orderBy("updatedAt", "desc"),
    limit(max)
  );
  const snap = await getDocs(q);
  const items = [];
  snap.forEach(docSnap => {
    const d = docSnap.data();
    items.push({
      versionId: docSnap.id,
      dashboardName: d.title,
      orgName: d.orgName,
      updatedAt: d.updatedAt && d.updatedAt.toMillis ? d.updatedAt.toMillis() : Date.now()
    });
  });
  return { ok: true, items };
}

async function loadDashboardVersion(dashboardKey, versionId) {
  const snap = await getDoc(doc(db, "dashboards", dashboardKey, "versions", versionId));
  if (!snap.exists()) return { ok: true, found: false };
  return { ok: true, found: true, data: snap.data().data };
}

window.firestoreBridge = {
  isConfigured,
  saveDashboard,
  loadCurrentDashboard,
  listDashboardVersions,
  loadDashboardVersion
};
