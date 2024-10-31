// Select form elements and table container
const purchaseForm = document.getElementById("purchaseForm");
const salesForm = document.getElementById("salesForm");
const tableContainer = document.getElementById("table-ueps-container");

// Initialize inventory array to track purchases
let inventory = [];

// Handle purchase form submission
purchaseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const date = document.getElementById("purchaseDate").value;
  const purchaseQuantity = parseInt(document.getElementById("purchaseQuantity").value);
  const purchaseUnitCost = parseFloat(document.getElementById("purchaseUnitCost").value);

  if (purchaseQuantity > 0) {
    // Add purchase entry to inventory
    inventory.push({
      type: "Compra",
      date,
      quantity: purchaseQuantity,
      unitCost: purchaseUnitCost,
      remainingQuantity: purchaseQuantity,
    });
  }

  // Render updated UEPS table
  renderTable();
  purchaseForm.reset();
});

// Handle sales form submission
salesForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const date = document.getElementById("salesDate").value;
  const salesQuantity = parseInt(document.getElementById("salesQuantity").value);

  if (salesQuantity > 0) {
    // Process sales with UEPS method
    const saleEntries = processSale(salesQuantity, date);
    
    // Add sale entries to inventory
    saleEntries.forEach(sale => inventory.push(sale));
  }

  // Render updated UEPS table
  renderTable();
  salesForm.reset();
});

// Function to process sales with UEPS method and return sale entries for the log
function processSale(salesQuantity, date) {
  let remainingSalesQuantity = salesQuantity;
  let saleEntries = [];

  // Process sales in reverse order (LIFO)
  for (let i = inventory.length - 1; i >= 0 && remainingSalesQuantity > 0; i--) {
    let entry = inventory[i];
    if (entry.type === "Compra" && entry.remainingQuantity > 0) {
      // Deduct quantity based on remaining in inventory and required sales
      const quantityToDeduct = Math.min(entry.remainingQuantity, remainingSalesQuantity);
      entry.remainingQuantity -= quantityToDeduct;
      remainingSalesQuantity -= quantityToDeduct;

      // Calculate cost for the sale entry
      const saleTotalCost = quantityToDeduct * entry.unitCost;

      // Create sale entry
      saleEntries.push({
        type: "Venta",
        date,
        quantity: quantityToDeduct,
        unitCost: entry.unitCost,
        totalCost: saleTotalCost,
        remainingQuantity: 0, // No remaining quantity for sales entries
      });
    }
  }
  return saleEntries;
}

// Function to render UEPS table with the new column order
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
    const purchaseTotal = entry.type === "Compra" ? entry.quantity * entry.unitCost : 0;
    const saleTotal = entry.type === "Venta" ? entry.quantity * entry.unitCost : 0;
    const remainingQuantity = entry.type === "Compra" ? entry.remainingQuantity : "";
    const remainingUnitCost = entry.type === "Compra" && entry.remainingQuantity > 0 ? entry.unitCost.toFixed(2) : "";
    const totalRemaining = remainingQuantity ? (remainingQuantity * entry.unitCost).toFixed(2) : "";

    tableHTML += `
      <tr>
        <td>${entry.type}</td>
        <td>${entry.date}</td>
        <td>${entry.quantity}</td>
        <td>${entry.unitCost.toFixed(2)}</td>
        <td>${purchaseTotal > 0 ? purchaseTotal.toFixed(2) : ""}</td>
        <td>${entry.type === "Venta" ? entry.quantity : ""}</td>
        <td>${entry.type === "Venta" ? entry.unitCost.toFixed(2) : ""}</td>
        <td>${saleTotal > 0 ? saleTotal.toFixed(2) : ""}</td>
        <td>${remainingQuantity}</td>
        <td>${remainingUnitCost}</td>
        <td>${totalRemaining}</td>
      </tr>`;
  });

  tableHTML += `</tbody></table>`;
  tableContainer.innerHTML = tableHTML;
}
