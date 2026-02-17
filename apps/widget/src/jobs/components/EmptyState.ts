export function renderEmptyState(hasFilters: boolean): HTMLElement {
  const container = document.createElement('div');
  container.className = 'hk-empty';

  if (hasFilters) {
    container.innerHTML = `
      <div class="hk-empty-icon">🔍</div>
      <div class="hk-empty-title">No matching jobs</div>
      <div class="hk-empty-text">Try adjusting your search or filters.</div>
    `;
  } else {
    container.innerHTML = `
      <div class="hk-empty-icon">💼</div>
      <div class="hk-empty-title">No open positions</div>
      <div class="hk-empty-text">Check back later for new opportunities.</div>
    `;
  }

  return container;
}
