MALLA.forEach(sem => {
  const col = document.createElement("section");
  col.className = "sem-col";

  const header = document.createElement("div");
  header.className = "sem-header";
  header.textContent = `Semestre ${sem.nivel}`;
  col.appendChild(header);

  const list = document.createElement("div");
  list.className = "courses";

  sem.cursos.forEach(cur => {
    const card = document.createElement("div");
    card.className = "course";
    card.dataset.code = cur.code;
    card.innerHTML = `<div class="name">${cur.name}</div><div class="code">[${cur.code}]</div>`;
    list.appendChild(card);
  });

  col.appendChild(list);
  grid.appendChild(col);
});
