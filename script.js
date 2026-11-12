const API_URL = "COLOQUE_AQUI_O_LINK_DO_SEU_CLOUDFLARE_WORKER";

let businesses = [];

async function searchBusinesses() {

  const category = document.getElementById("category").value;

  const neighborhood = document.getElementById("neighborhood").value.trim();

  const status = document.getElementById("status");

  const results = document.getElementById("results");

  status.textContent = "Pesquisando empresas...";

  results.innerHTML = "";

  businesses = [];

  const query = `${category} em ${neighborhood || "Florianópolis, SC"}`;

  try {

    const response = await fetch(API_URL, {

      method: "POST",

      headers: {

        "Content-Type": "application/json"

      },

      body: JSON.stringify({ query })

    });

    if (!response.ok) {

      throw new Error("Erro na pesquisa.");

    }

    const data = await response.json();

    businesses = data.results || [];

    if (businesses.length === 0) {

      status.textContent = "Nenhuma empresa encontrada.";

      return;

    }

    status.textContent =

      businesses.length + " empresas encontradas.";

    businesses.forEach(business => {

      const card = document.createElement("div");

      card.className = "result";

      const title = document.createElement("h3");

      title.textContent = business.name || "Nome não informado";

      card.appendChild(title);

      addInfo(card, "Endereço", business.address);

      addInfo(card, "Telefone", business.phone);

      addInfo(

        card,

        "Site",

        business.website || "Não informado — verificar"

      );

      if (business.website) {

        addLink(card, "Abrir site", business.website);

      }

      if (business.maps_url) {

        addLink(card, "Ver no Google Maps", business.maps_url);

      }

      results.appendChild(card);

    });

  } catch (error) {

    status.textContent =

      "Não foi possível pesquisar. Confira a conexão com o servidor.";

  }

}

function addInfo(card, label, value) {

  const p = document.createElement("p");

  p.textContent = `${label}: ${value || "Não informado"}`;

  card.appendChild(p);

}

function addLink(card, text, url) {

  const link = document.createElement("a");

  link.href = url;

  link.target = "_blank";

  link.rel = "noopener noreferrer";

  link.textContent = text;

  link.style.display = "block";

  link.style.marginTop = "8px";

  card.appendChild(link);

}

function exportCSV() {

  if (businesses.length === 0) {

    alert("Faça uma pesquisa primeiro.");

    return;

  }

  const headers = [

    "Nome",

    "Endereço",

    "Telefone",

    "Site",

    "Google Maps"

  ];

  const rows = businesses.map(b => [

    b.name,

    b.address,

    b.phone,

    b.website,

    b.maps_url

  ]);

  const csv = [headers, ...rows]

    .map(row =>

      row.map(value =>

        '"' + String(value || "").replace(/"/g, '""') + '"'

      ).join(";")

    )

    .join("\n");

  const blob = new Blob(

    ["\uFEFF" + csv],

    { type: "text/csv;charset=utf-8;" }

  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "empresas-florianopolis.csv";

  link.click();

  URL.revokeObjectURL(url);

}
