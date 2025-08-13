// ===== Utilidad de almacenamiento =====
const STORAGE_KEY = "mallaAprobados_v1";

// ====== Datos de la malla (desde tu documento) ======
const MALLA = [
  {
    nivel: 1,
    cursos: [
      { code: "30011", name: "Socio antropología Educacional", prereq: [] },
      { code: "30012", name: "Construcción de la Identidad Profesional Docente", prereq: [] },
      { code: "24013", name: "Química I", prereq: [] },
      { code: "23014", name: "Matemáticas", prereq: [] },
      { code: "24015", name: "Laboratorio de Química General", prereq: [] },
      { code: "50016", name: "Desarrollo de Habilidades de Pensamiento", prereq: [] },
    ]
  },
  {
    nivel: 2,
    cursos: [
      { code: "30021", name: "Filosofía Educacional", prereq: [] },
      { code: "24022", name: "Química II", prereq: ["24015","24013"] },
      { code: "21023", name: "Biología General", prereq: [] },
      { code: "23024", name: "Cálculo", prereq: ["23014"] },
      { code: "22025", name: "Física para Ciencias I", prereq: ["23014"] },
      { code: "40026", name: "Comunicación Oral y Escrita", prereq: [] },
    ]
  },
  {
    nivel: 3,
    cursos: [
      { code: "30031", name: "Enfoques Curriculares", prereq: ["30012"] },
      { code: "30032", name: "Psicología del Aprendizaje y del Desarrollo", prereq: [] },
      { code: "24033", name: "Química del Carbono I", prereq: ["24015","24013"] },
      { code: "24034", name: "Química Inorgánica Estructural", prereq: ["24022"] },
      { code: "21035", name: "Biología de la Célula", prereq: ["21023"] }, // Corregido
      { code: "43036", name: "Comprensión Lectora en Inglés", prereq: [] },
    ]
  },
  {
    nivel: 4,
    cursos: [
      { code: "30041", name: "Gestión Educacional", prereq: ["30012"] },
      { code: "24042", name: "Química del Carbono II", prereq: ["24033"] },
      { code: "24043", name: "Química Inorgánica Descriptiva", prereq: ["24034"] },
      { code: "22044", name: "Física para Ciencias II", prereq: ["22025"] },
      { code: "30045", name: "Pedagogía de la Identidad de Género", prereq: [] },
      { code: "30046", name: "Teorías de la Educación", prereq: [] },
    ]
  },
  {
    nivel: 5,
    cursos: [
      { code: "30051", name: "Teoría Evaluativa", prereq: ["30031"] },
      { code: "24052", name: "Fisicoquímica I", prereq: ["24034","23024"] },
      { code: "24053", name: "Análisis Químico", prereq: ["24034","23024"] },
      { code: "24054", name: "Estrategias Didácticas para la Enseñanza de las Ciencias Químicas", prereq: ["24033","24034"] },
      { code: "24055", name: "Práctica Inicial", prereq: ["24033"] },
      { code: "30056", name: "Epistemología y Paradigmas de la Investigación Educativa", prereq: ["30046"] },
    ]
  },
  {
    nivel: 6,
    cursos: [
      { code: "30061", name: "Diseño de Procesos Evaluativos en Química y Cs. Naturales", prereq: ["30051"] },
      { code: "30062", name: "Diseño de Procesos de Enseñanza y Aprendizaje", prereq: ["30031"] },
      { code: "24063", name: "Fisicoquímica II", prereq: ["24052"] },
      { code: "24064", name: "Didáctica de las Ciencias Naturales", prereq: ["24054"] },
      { code: "23065", name: "Estadística Aplicada a la Investigación en Educación Química", prereq: ["23024"] },
      { code: "30066", name: "Análisis de Proyectos de Investigación Educativa", prereq: ["30056"] },
    ]
  },
  {
    nivel: 7,
    cursos: [
      { code: "30071", name: "Liderazgo Pedagógico", prereq: ["30041"] },
      { code: "24072", name: "Didáctica de la Química", prereq: ["24054","24064"] },
      { code: "24073", name: "Química Biológica", prereq: ["21035","24042"] },
      { code: "24074", name: "Tierra y Universo", prereq: ["22044"] },
      { code: "24075", name: "Práctica Intermedia", prereq: ["24055"] },
      { code: "30076", name: "Metodología de la Investigación Educacional", prereq: ["30066"] },
    ]
  },
  {
    nivel: 8,
    cursos: [
      { code: "30081", name: "Orientación Educacional", prereq: ["30032","30061","30062","30071"] },
      { code: "24082", name: "Recursos Digitales para el Aprendizaje de la Química y Cs. Naturales", prereq: ["24072"] },
      { code: "24083", name: "Química Nuclear", prereq: ["22044","24043"] },
      { code: "24084", name: "Ciencia Ambiental", prereq: ["24053"] },
      { code: "24085", name: "Historia y Naturaleza de las Ciencias Experimentales", prereq: [] },
      { code: "30086", name: "Seminario de Licenciatura en Educación", prereq: ["30076"] },
    ]
  },
  {
    nivel: 9,
    cursos: [
      { code: "24091", name: "Diseño de Laboratorio en el Aula", prereq: ["24082"] },
      { code: "24092", name: "Ciencias Integradas", prereq: ["24082"] },
      { code: "24093", name: "Trabajo de Integración Disciplinar Didáctico", prereq: ["24072","24082"] },
      { code: "50094", name: "Pensamiento Crítico y Resolución de Problemas", prereq: [] },
    ]
  },
  {
    nivel: 10,
    cursos: [
      { code: "24101", name: "Práctica profesional", prereq: [{ type: "levelComplete", level: 9 }] },
      { code: "30102", name: "Educación y Formación Ciudadana", prereq: [] },
    ]
  },
];

// ====== Estado ======
const aprobados = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
const courseIndex = new Map();

// ====== Render ======
const grid = document.getElementById("grid");
function render(){
  grid.innerHTML = "";
  courseIndex.clear();

  const allCourses = MALLA.flatMap(s => s.cursos);
  const nameByCode = new Map(allCourses.map(c => [c.code, c.name]));

  MALLA.forEach(sem => {
    const col = document.createElement("section");
    col.className = "sem-col";

    const header = document.createElement("div");
    header.className = "sem-header";
    header.innerHTML = `
      <div>
        <div class="sem-title">Semestre ${sem.nivel}º</div>
        <div class="sem-sub">${sem.cursos.length} asignatura${sem.cursos.length!==1?"s":""}</div>
      </div>
    `;
    col.appendChild(header);

    const list = document.createElement("div");
    list.className = "courses";

    sem.cursos.forEach(cur => {
      courseIndex.set(cur.code, { curso: cur, nivel: sem.nivel });
      const card = document.createElement("button");
      card.className = "course";
      card.setAttribute("data-code", cur.code);
      card.setAttribute("aria-pressed", aprobados.has(cur.code) ? "true" : "false");
      card.innerHTML = `
        <div class="name">${cur.name}</div>
        <div class="meta">
          <span class="code">[${cur.code}]</span>
          <div class="badges">
            ${renderBadges(cur.prereq, nameByCode)}
          </div>
        </div>
      `;
      list.appendChild(card);
    });

    col.appendChild(list);
    grid.appendChild(col);
  });

  updateStatuses();
}

function renderBadges(prereq, nameByCode){
  if(!prereq || prereq.length===0) return `<span class="badge">Sin requisitos</span>`;
  const labels = [];
  for(const p of prereq){
    if(typeof p === "object" && p.type === "levelComplete"){
      labels.push(`<span class="badge">Completar hasta ${p.level}º</span>`);
    }else{
      const nm = nameByCode.get(p) || "—";
      labels.push(`<span class="badge">${p}</span>`);
    }
  }
  return labels.join("");
}

// ====== Lógica de bloqueo ======
function cumpleRequisitos(cur){
  for(const p of cur.prereq || []){
    if(typeof p === "object" && p.type === "levelComplete"){
      for(const sem of MALLA){
        if(sem.nivel <= p.level){
          for(const c of sem.cursos){
            if(!aprobados.has(c.code)) return false;
          }
        }
      }
    }else{
      if(!aprobados.has(p)) return false;
    }
  }
  return true;
}

function faltantes(cur){
  const falt = [];
  for(const p of cur.prereq || []){
    if(typeof p === "object" && p.type === "levelComplete"){
      for(const sem of MALLA){
        if(sem.nivel <= p.level){
          for(const c of sem.cursos){
            if(!aprobados.has(c.code)) falt.push(`${c.code} – ${c.name}`);
          }
        }
      }
    }else{
      if(!aprobados.has(p)){
        const item = courseIndex.get(p);
        falt.push(item ? `${p} – ${item.curso.name}` : `${p} – (no encontrado)`);
      }
    }
  }
  return [...new Set(falt)];
}

function updateStatuses(){
  document.querySelectorAll(".course").forEach(card => {
    const code = card.getAttribute("data-code");
    const { curso } = courseIndex.get(code);
    const ok = aprobados.has(code);
    const can = cumpleRequisitos(curso);

    card.classList.remove("aprobado","bloqueado","disponible");
    if(ok){
      card.classList.add("aprobado");
      card.setAttribute("aria-pressed","true");
      card.title = "Aprobado ✔";
    }else if(!can){
      card.classList.add("bloqueado");
      card.title = "Bloqueado – faltan prerrequisitos";
    }else{
      card.classList.add("disponible");
      card.title = "Disponible para aprobar";
    }

    const hasLock = !!card.querySelector(".lock");
    if(!can && !hasLock){
      const lock = document.createElement("span");
      lock.className = "lock";
      lock.textContent = "🔒";
      card.querySelector(".meta").appendChild(lock);
    }else if(can && hasLock){
      card.querySelector(".lock").remove();
    }
  });
}

// ====== Interacciones ======
grid.addEventListener("click", (e) => {
  const card = e.target.closest(".course");
  if(!card) return;
  const code = card.getAttribute("data-code");
  const { curso } = courseIndex.get(code);

  if(aprobados.has(code)){
    aprobados.delete(code);
    persist();
    updateStatuses();
    return;
  }

  if(!cumpleRequisitos(curso)){
    const lista = faltantes(curso);
    toast(`No puedes aprobar <strong>${curso.name}</strong> aún. Falta aprobar:`, lista);
    return;
  }

  aprobados.add(code);
  persist();
  updateStatuses();
});

function persist(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...aprobados]));
}

// ====== Toast ======
const toastBox = document.getElementById("toast");
let toastTimer;
function toast(html, items = []){
  clearTimeout(toastTimer);
  const list = items.length ? `<div class="list">• ${items.join("<br>• ")}</div>` : "";
  toastBox.innerHTML = `${html}${list}`;
  toastBox.classList.add("show");
  toastTimer = setTimeout(()=> toastBox.classList.remove("show"), 4300);
}

// ====== Botones ======
document.getElementById("btnReset").addEventListener("click", () => {
  if(confirm("¿Seguro que quieres reiniciar todo tu progreso?")){
    aprobados.clear();
    persist();
    updateStatuses();
  }
});

const legend = document.getElementById("legend");
document.getElementById("btnLegend").addEventListener("click", () => {
  legend.hidden = !legend.hidden;
});

document.getElementById("btnExport").addEventListener("click", () => {
  const payload = {
    ts: new Date().toISOString(),
    aprobados: [...aprobados]
  };
  const text = JSON.stringify(payload);
  navigator.clipboard.writeText(text).then(()=>{
    toast("Progreso exportado. Pegado en tu portapapeles.");
  }).catch(()=>{
    openImport(text, "Copia el siguiente texto para guardar tu progreso:");
  });
});

const importDialog = document.getElementById("importDialog");
const importText = document.getElementById("importText");
document.getElementById("btnImport").addEventListener("click", () => openImport());
document.getElementById("confirmImport").addEventListener("click", (e) => {
  e.preventDefault();
  try{
    const data = JSON.parse(importText.value.trim());
    if(!data || !Array.isArray(data.aprobados)) throw new Error("Formato inválido");
    aprobados.clear();
    data.aprobados.forEach(c => aprobados.add(c));
    persist();
    importDialog.close();
    updateStatuses();
    toast("Progreso importado correctamente.");
  }catch(err){
    alert("No se pudo importar: " + err.message);
  }
});

function openImport(prefill = "", info = ""){
  importText.value = prefill;
  importDialog.querySelector("p").textContent = info || "Pega aquí el JSON exportado para restaurar tu progreso.";
  importDialog.showModal();
}

// ====== Inicio ======
render();

