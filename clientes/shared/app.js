const params = new URLSearchParams(window.location.search);
const DATA_URL = params.get("data") || "./data.json";

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

    const tdModel = document.createElement("td");
    tdModel.textContent = r.modelo ?? "";
    tr.appendChild(tdModel);

    const tdProduct = document.createElement("td");
    tdProduct.textContent = r.producto ?? "";
    tr.appendChild(tdProduct);

    const tdDoc = document.createElement("td");
    if (r.url) {
      const a = document.createElement("a");
      a.className = "btn";
      a.href = r.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = r.label || "Abrir";
      tdDoc.appendChild(a);
    } else {
      tdDoc.textContent = r.label ?? "";
    }
    tr.appendChild(tdDoc);

    tbody.appendChild(tr);
  }
}

function applyFilter() {
  const q = norm(document.getElementById("q").value);
  if (!q) return render(allRows);

  const filtered = allRows.filter((r) => {
    return (
      norm(r.modelo).includes(q) ||
      norm(r.producto).includes(q) ||
      norm(r.label).includes(q)
    );
  });

  render(filtered);
}

async function load() {
  const res = await fetch(DATA_URL, { cache: "no-store" });
  if (!res.ok) {
    console.error(`No se pudo cargar ${DATA_URL} (${res.status})`);
    render([]);
    return;
  }

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
