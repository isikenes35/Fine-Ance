/**
 * Transforms raw transaction data into Plotly Sankey trace format.
 *
 * Flow: [Income Categories] → "Sen" → [Expense Categories]
 */
export function buildSankeyData(transactions) {
  // Aggregate amounts by category
  const incomeMap = {};
  const expenseMap = {};

  transactions.forEach((t) => {
    const key = t.category.id;
    if (t.category.type === 'income') {
      if (!incomeMap[key]) {
        incomeMap[key] = { ...t.category, total: 0 };
      }
      incomeMap[key].total += t.amount;
    } else {
      if (!expenseMap[key]) {
        expenseMap[key] = { ...t.category, total: 0 };
      }
      expenseMap[key].total += t.amount;
    }
  });

  const incomeCategories = Object.values(incomeMap).filter((c) => c.total > 0);
  const expenseCategories = Object.values(expenseMap).filter((c) => c.total > 0);

  if (incomeCategories.length === 0 && expenseCategories.length === 0) {
    return null;
  }

  // Build nodes: [income categories..., "Sen", expense categories...]
  const nodes = [];
  const nodeColors = [];

  // Income nodes
  incomeCategories.forEach((c) => {
    nodes.push(c.name);
    nodeColors.push(c.colorHex);
  });

  // Central node: "Sen"
  const senIndex = nodes.length;
  nodes.push('Sen');
  nodeColors.push('#1E293B');

  // Expense nodes
  expenseCategories.forEach((c) => {
    nodes.push(c.name);
    nodeColors.push(c.colorHex);
  });

  // Build links
  const sources = [];
  const targets = [];
  const values = [];
  const linkColors = [];

  // Income → Sen
  incomeCategories.forEach((c, i) => {
    sources.push(i);
    targets.push(senIndex);
    values.push(c.total);
    linkColors.push(c.colorHex + '66'); // 40% opacity
  });

  // Sen → Expense
  expenseCategories.forEach((c, i) => {
    sources.push(senIndex);
    targets.push(senIndex + 1 + i);
    values.push(c.total);
    linkColors.push(c.colorHex + '66');
  });

  return {
    type: 'sankey',
    orientation: 'h',
    arrangement: 'snap',
    node: {
      pad: 20,
      thickness: 24,
      line: { color: 'rgba(255,255,255,0.1)', width: 1 },
      label: nodes,
      color: nodeColors,
      hovertemplate: '%{label}<br>₺%{value:,.2f}<extra></extra>',
    },
    link: {
      source: sources,
      target: targets,
      value: values,
      color: linkColors,
      hovertemplate: '%{source.label} → %{target.label}<br>₺%{value:,.2f}<extra></extra>',
    },
  };
}
