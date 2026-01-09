const DATA_URL = "./data.json";
let allRows = [];

const norm = (s) => (s ?? "").toString().toLowerCase().trim();

function render(rows) {
  const tbody = document.getElementById("rows");
  const empty = document.getElementById("empty");
  const count = document.getElementById("count");

  tbody.innerHTML = "";
  count.textContent = rows.length;

  if (rows.length === 0) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  for (const r of rows) {
    const tr = document.createElement("tr");

    const tdModelo = document.createElement("td");
    tdModelo.textContent = r.modelo ?? "";

    const tdProducto = document.createElement("td");
    tdProducto.textContent = r.producto ?? "";

    const tdDocumento = document.createElement("td");
    const a = document.createElement("a");
    a.className = "btn";

    // ✅ tu JSON: url + botonTexto (opcional)
    a.textContent = r.botonTexto || "Ver documento";
    a.href = r.url || "#";
    a.target = "_blank";
    a.rel = "noopener";

    // opcional: si falta url, deshabilita visualmente
    if (!r.url) {
      a.removeAttribute("href");
      a.style.pointerEvents = "none";
      a.style.opacity = "0.5";
      a.title = "Documento no disponible";
    }

    tdDocumento.appendChild(a);

    tr.appendChild(tdModelo);
    tr.appendChild(tdProducto);
    tr.appendChild(tdDocumento);

    tbody.appendChild(tr);
  }
}


function applyFilter() {
  const q = norm(document.getElementById("q").value);
  if (!q) return render(allRows);

  const filtered = allRows.filter(r =>
    norm(r.modelo).includes(q) || norm(r.producto).includes(q)
  );

  render(filtered);
}

async function load() {
  const res = await fetch(DATA_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo cargar el JSON: " + res.status);

  const data = await res.json();

  document.title = data.title || "Documentos";
  document.getElementById("pageTitle").textContent = data.title || "Documentos";
  document.getElementById("pageIntro").textContent =
    data.intro || "Listado de documentos asociados a modelos y productos.";

  allRows = Array.isArray(data.rows) ? data.rows : [];
  render(allRows);

  document.getElementById("q").addEventListener("input", applyFilter);
}

document.addEventListener("DOMContentLoaded", load);


// --- Shared partials (GitHub Pages) ---
async function injectPartial(slotId, url) {
  const slot = document.getElementById(slotId);
  if (!slot) return;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return; // si no existe el partial, no rompe nada
    slot.innerHTML = await res.text();
  } catch (e) {
    // en caso de error (offline / file://), simplemente no inyecta
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const sharedBase = document.body?.dataset?.shared || "../shared";
  injectPartial("footer-slot", `${sharedBase}/partials/footer.html`);
});
