<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Documentos</title>
  <style>
    :root { --max: 980px; }
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 0; background: #f6f7f9; color: #111; }
    header { background: #fff; border-bottom: 1px solid #e7e7e7; }
    .wrap { max-width: var(--max); margin: 0 auto; padding: 24px 16px; }
    h1 { margin: 0 0 8px; font-size: 28px; }
    p  { margin: 0 0 16px; color: #444; line-height: 1.4; }

    .controls { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-top: 12px; }
    .search {
      flex: 1 1 360px; display: flex; align-items: center; gap: 10px;
      background: #fff; border: 1px solid #ddd; border-radius: 10px; padding: 10px 12px;
      box-shadow: 0 1px 1px rgba(0,0,0,0.03);
    }
    .search label { font-size: 14px; color: #555; white-space: nowrap; }
    .search input { width: 100%; border: 0; outline: 0; font-size: 14px; padding: 6px 0; background: transparent; }
    .badge { font-size: 12px; color: #666; background: #fff; border: 1px solid #ddd; border-radius: 999px; padding: 8px 10px; }

    main { padding: 18px 0 28px; }
    .card { background: #fff; border: 1px solid #e7e7e7; border-radius: 14px; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    thead th {
      text-align: left; font-weight: 600; font-size: 13px;
      padding: 14px 14px; background: #fafafa; border-bottom: 1px solid #eee;
    }
    tbody td { padding: 14px 14px; border-bottom: 1px solid #f0f0f0; vertical-align: top; font-size: 14px; }
    tbody tr:last-child td { border-bottom: 0; }

    .btn {
      display: inline-block; text-decoration: none; font-weight: 700; font-size: 13px;
      padding: 10px 12px; border-radius: 10px; border: 1px solid #111; color: #111; background: #fff;
    }

    .empty { padding: 16px; color: #666; font-size: 14px; display:none; }
  </style>
</head>

<body>
  <header>
    <div class="wrap">
      <h1 id="pageTitle">Documentos</h1>
      <p id="pageIntro">Listado de documentos asociados a modelos y productos.</p>

      <div class="controls">
        <div class="search">
          <label for="q">Buscar</label>
          <input id="q" type="search" placeholder="Modelo o producto..." autocomplete="off" />
        </div>
        <div class="badge"><span id="count">0</span> resultados</div>
      </div>
    </div>
  </header>

  <main>
    <div class="wrap">
      <div class="card">
        <table aria-label="Tabla de documentos">
          <thead>
            <tr>
              <th style="width: 35%;">Modelo</th>
              <th style="width: 45%;">Producto</th>
              <th style="width: 20%;">Documento</th>
            </tr>
          </thead>
          <tbody id="rows"></tbody>
        </table>
        <div id="empty" class="empty">No hay resultados.</div>
      </div>
    </div>
  </main>

  <script>
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
        tdModelo.textContent = r.modelo;

        const tdProducto = document.createElement("td");
        tdProducto.textContent = r.producto;

        const tdDocumento = document.createElement("td");
        const a = document.createElement("a");
        a.className = "btn";
        a.textContent = r.documento?.texto || "Ver documento";
        a.href = r.documento?.url || "#";
        a.target = "_blank";
        a.rel = "noopener";
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
      document.getElementById("pageIntro").textContent = data.intro || "Listado de documentos asociados a modelos y productos.";

      allRows = Array.isArray(data.rows) ? data.rows : [];
      render(allRows);

      document.getElementById("q").addEventListener("input", applyFilter);
    }

    load().catch(err => {
      console.error(err);
      document.getElementById("pageTitle").textContent = "Error cargando datos";
      document.getElementById("pageIntro").textContent =
        "Revisa la ruta del JSON y que estés sirviendo esto desde un servidor (no file://).";
    });
  </script>
</body>
</html>
