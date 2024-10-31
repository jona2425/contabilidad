// Select form elements and table container
const purchaseForm = document.getElementById("purchaseForm");
const salesForm = document.getElementById("salesForm");
const tableContainer = document.getElementById("table-wac-container");

// Initialize inventory state
let inventory = [];
let totalQuantity = 0;
let totalCost = 0;

// Handle purchase form submission
purchaseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const date = document.getElementById("purchaseDate").value;
  const purchaseQuantity = parseInt(document.getElementById("purchaseQuantity").value);
  const purchaseUnitCost = parseFloat(document.getElementById("purchaseUnitCost").value);
  
  if (purchaseQuantity > 0) {
    // Update total quantity and cost
    totalQuantity += purchaseQuantity;
    totalCost += purchaseQuantity * purchaseUnitCost;
    const weightedAverageCost = totalCost / totalQuantity;

    // Add purchase entry to inventory
    inventory.push({
      type: "Compra",
      date,
      quantity: purchaseQuantity,
      unitCost: purchaseUnitCost,
      remainingQuantity: totalQuantity,
      remainingUnitCost: weightedAverageCost
    });
  }

  // Render updated WAC table
  renderTable();
  purchaseForm.reset();
});

// Handle sales form submission
salesForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const date = document.getElementById("salesDate").value;
  const salesQuantity = parseInt(document.getElementById("salesQuantity").value);

  if (salesQuantity > 0 && salesQuantity <= totalQuantity) {
    const weightedAverageCost = totalCost / totalQuantity;
    const saleTotalCost = salesQuantity * weightedAverageCost;
    totalQuantity -= salesQuantity;
    totalCost -= saleTotalCost;

    // Add sale entry to inventory
    inventory.push({
      type: "Venta",
      date,
      quantity: salesQuantity,
      unitCost: weightedAverageCost,
      remainingQuantity: totalQuantity,
      remainingUnitCost: totalQuantity > 0 ? (totalCost / totalQuantity) : 0
    });
  }

  // Render updated WAC table
  renderTable();
  salesForm.reset();
});

// Function to render WAC table with the specified column order
function renderTable() {
  let tableHTML = `
    <table>
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Fecha</th>
          <th>Cantidad</th>
          <th>Costo Unitario</th>
          <th>Total Compra</th>
          <th>Cantidad Vendida</th>
          <th>Costo Unitario Vendido</th>
          <th>Total Venta</th>
          <th>Cantidad Restante</th>
          <th>Costo Unitario Restante</th>
          <th>Total Restante</th>
        </tr>
      </thead>
      <tbody>`;

  inventory.forEach((entry) => {
    const purchaseTotal = entry.type === "Compra" ? (entry.quantity * entry.unitCost).toFixed(2) : "";
    const saleTotal = entry.type === "Venta" ? (entry.quantity * entry.unitCost).toFixed(2) : "";
    const remainingTotal = (entry.remainingQuantity * entry.remainingUnitCost).toFixed(2);

    tableHTML += `
      <tr>
        <td>${entry.type}</td>
        <td>${entry.date}</td>
        <td>${entry.type === "Compra" ? entry.quantity : ""}</td>
        <td>${entry.unitCost.toFixed(2)}</td>
        <td>${purchaseTotal}</td>
        <td>${entry.type === "Venta" ? entry.quantity : ""}</td>
        <td>${entry.type === "Venta" ? entry.unitCost.toFixed(2) : ""}</td>
        <td>${saleTotal}</td>
        <td>${entry.remainingQuantity}</td>
        <td>${entry.remainingUnitCost.toFixed(2)}</td>
        <td>${remainingTotal}</td>
      </tr>`;
  });

  tableHTML += `</tbody></table>`;
  tableContainer.innerHTML = tableHTML;
}