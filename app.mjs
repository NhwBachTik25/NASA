import { ACTIONS, CREW, EVENTS, createGame, forecastShift, resolveShift, useEmergencyOrder } from './game-core.mjs';

const $ = (id) => document.getElementById(id);
const resourceMeta = {
  oxygen: { label: 'OXY', symbol: 'O₂' },
  energy: { label: 'ĐIỆN', symbol: 'ϟ' },
  food: { label: 'THỰC PHẨM', symbol: '＋' },
  radiation: { label: 'NGUY CƠ', symbol: '!' },
  repair: { label: 'SỬA TÀU', symbol: '↗' },
};
let game = createGame(2026);
let selectedChoice = '';
let lastResult = null;
let forecastConfirmed = false;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function resourceSummary(value, key) {
  const highBad = key === 'radiation';
  const low = highBad ? value >= 60 : value <= 25;
  const critical = highBad ? value >= 80 : value <= 12;
  return { low, critical };
}

function renderResources() {
  for (const key of Object.keys(resourceMeta)) {
    const value = game.resources[key];
    const card = document.querySelector(`[data-stat="${key}"]`);
    $(`${key}-value`).textContent = String(value);
    $(`${key}-meter`).style.width = `${value}%`;
    const state = resourceSummary(value, key);
    card.classList.toggle('low', state.low);
    card.classList.toggle('critical', state.critical);
    card.setAttribute('aria-label', `${resourceMeta[key].label}: ${value} trên 100, đơn vị mô phỏng`);
  }
}

function renderShift() {
  const display = String(game.shift).padStart(2, '0');
  $('header-shift').textContent = display;
  $('turn-timer').textContent = `SHIFT ${display}`;
  $('shift-number').textContent = display;
  $('shift-track').innerHTML = Array.from({ length: 10 }, (_, index) => {
    const n = index + 1;
    const className = n < game.shift ? 'complete' : n === game.shift ? 'current' : '';
    return `<i class="${className}" aria-label="Ca ${n}${n < game.shift ? ' đã qua' : n === game.shift ? ' hiện tại' : ''}"></i>`;
  }).join('');
}

function renderEvent() {
  const event = EVENTS[game.schedule[game.shift - 1] ?? 0];
  $('event-kind').textContent = `CA ${String(game.shift).padStart(2, '0')} · ${event.kind}`;
  $('event-title').textContent = event.title;
  $('event-description').textContent = event.description;
  $('event-source').innerHTML = `<span>Nguồn bối cảnh: </span><a href="${escapeHtml(event.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(event.sourceLabel)} ↗</a> <span>· ${event.dataType === 'science-context' ? 'kiến thức khoa học' : 'kịch bản mô phỏng'}</span>`;
  $('choice-list').innerHTML = event.choices.map((choice, index) => `
    <label class="choice-option${selectedChoice === choice.id ? ' selected' : ''}">
      <input type="radio" name="event-choice" value="${escapeHtml(choice.id)}" ${selectedChoice === choice.id ? 'checked' : ''} aria-label="${escapeHtml(choice.label)}">
      <span class="choice-radio" aria-hidden="true"></span><span class="choice-copy"><b>${escapeHtml(choice.label)}</b><small>${escapeHtml(choice.delayed)}</small></span>
    </label>`).join('');
  $('choice-list').querySelectorAll('input').forEach((radio) => radio.addEventListener('change', () => {
    selectedChoice = radio.value;
    forecastConfirmed = false;
    renderEvent();
    renderForecast();
    renderResolveButton();
  }));
}

function renderCrew() {
  $('crew-grid').innerHTML = CREW.map((member) => {
    const assigned = game.assignments?.[member.id] ?? '';
    return `<article class="crew-card${assigned ? ' selected' : ''}" data-crew="${member.id}">
      <div class="crew-head"><span class="crew-avatar" aria-hidden="true">${member.name.split(' ').at(-1)[0]}</span><span class="crew-name"><b>${escapeHtml(member.name)}</b><small>${escapeHtml(member.role)}</small></span></div>
      <p class="crew-skill">${escapeHtml(member.skill)}</p>
      <label class="visually-hidden" for="assignment-${member.id}">Nhiệm vụ của ${escapeHtml(member.name)}</label>
      <select class="crew-select" id="assignment-${member.id}" data-crew-select="${member.id}">
        <option value="">Chọn nhiệm vụ…</option>
        ${Object.entries(ACTIONS).map(([id, action]) => `<option value="${id}" ${assigned === id ? 'selected' : ''}>${escapeHtml(action.label)}</option>`).join('')}
      </select>
    </article>`;
  }).join('');
  $('crew-grid').querySelectorAll('select').forEach((select) => select.addEventListener('change', () => {
    const assignments = Object.fromEntries(CREW.map((member) => [member.id, game.assignments?.[member.id] ?? '']));
    assignments[select.dataset.crewSelect] = select.value;
    game.assignments = assignments;
    forecastConfirmed = false;
    renderCrew();
    renderForecast();
    renderResolveButton();
  }));
}

function currentAssignments() {
  return game.assignments ?? Object.fromEntries(CREW.map((member) => [member.id, '']));
}

function renderActions() {
  const icons = { lifeSupport: 'O₂', power: 'ϟ', greenhouse: '＋', shelter: '⌂', repair: '↗' };
  $('action-list').innerHTML = Object.entries(ACTIONS).map(([id, action]) => `<div class="action-row"><span class="action-icon" aria-hidden="true">${icons[id]}</span><span><b>${escapeHtml(action.label)}</b><small>${id === 'lifeSupport' ? '+ Oxy · cần điện' : id === 'power' ? '+ Điện · có bonus Bảo' : id === 'greenhouse' ? '− Điện · thực phẩm trễ 2 ca' : id === 'shelter' ? '− Nguy cơ · tiêu hao điện' : '+ Sửa tàu · cần điện'}</small></span><span class="action-cost">−${action.cost} ĐIỆN</span></div>`).join('');
}

function renderForecast() {
  const assignments = currentAssignments();
  const complete = CREW.every((member) => assignments[member.id]);
  const forecast = selectedChoice && complete ? forecastShift(game, { choiceId: selectedChoice, assignments }) : null;
  $('forecast-values').innerHTML = '';
  if (!forecast?.ok) {
    $('forecast-mark').textContent = '—';
    $('forecast-prompt').textContent = selectedChoice ? 'Hãy phân công nhiệm vụ cho cả 4 phi hành gia để xem dự báo.' : 'Chọn phương án và phân công đủ 4 người để xem thay đổi dự kiến.';
    $('delayed-note').textContent = '';
    return;
  }
  $('forecast-mark').textContent = 'DỰ KIẾN';
  $('forecast-prompt').textContent = 'Thay đổi dự kiến sau ca này (đơn vị mô phỏng):';
  for (const key of Object.keys(resourceMeta)) {
    const change = forecast.after[key] - forecast.before[key];
    const sign = change > 0 ? '+' : '';
    const cls = change > 0 ? (key === 'radiation' ? 'negative' : 'positive') : change < 0 ? (key === 'radiation' ? 'positive' : 'negative') : 'neutral';
    $('forecast-values').insertAdjacentHTML('beforeend', `<span class="forecast-value ${cls}">${resourceMeta[key].symbol} ${sign}${change}</span>`);
  }
  $('delayed-note').textContent = forecast.delayed;
}

function renderResolveButton() {
  const assigned = currentAssignments();
  const complete = CREW.every((member) => assigned[member.id]);
  const button = $('resolve-button');
  button.disabled = game.status !== 'playing' || !selectedChoice || !complete;
  button.querySelector('span').textContent = !selectedChoice || !complete ? 'CHỌN ĐỦ ĐỘI' : forecastConfirmed ? 'XÁC NHẬN CA NÀY' : 'XEM DỰ BÁO';
}

function renderEcho() {
  $('echo-hint').textContent = game.echoHint;
}

function render() {
  renderResources();
  renderShift();
  renderEvent();
  renderCrew();
  renderActions();
  renderForecast();
  renderResolveButton();
  renderEcho();
  $('emergency-button').disabled = game.emergencyUsed || game.status !== 'playing';
  $('emergency-button').innerHTML = game.emergencyUsed ? 'ĐÃ DÙNG <kbd>1×</kbd>' : 'LỆNH KHẨN CẤP <kbd>1×</kbd>';
  $('scene-energy').innerHTML = `MẢNG PIN <b>${game.resources.energy < 35 ? 'ĐIỆN THẤP' : 'ĐANG PHÁT ĐIỆN'}</b>`;
  $('scene-energy').classList.toggle('warning', game.resources.energy < 35);
}

function deltaHtml(result) {
  return Object.keys(resourceMeta).map((key) => {
    const change = result.after[key] - result.before[key];
    const sign = change > 0 ? '+' : '';
    const cls = change > 0 ? (key === 'radiation' ? 'negative' : 'positive') : change < 0 ? (key === 'radiation' ? 'positive' : 'negative') : '';
    return `<span class="delta-chip ${cls}">${resourceMeta[key].symbol} ${sign}${change}</span>`;
  }).join('');
}

function showShiftResult(result) {
  lastResult = result;
  $('result-kicker').textContent = `WHAT YOU LEARNED · CA ${String(result.shift - (result.status === 'playing' ? 1 : 0)).padStart(2, '0')}`;
  $('result-title').textContent = result.event.title;
  $('result-summary').textContent = `Đội chọn “${result.choice.label}”. ${result.harvested ? `Nhà kính thu hoạch ${result.harvested} đơn vị thực phẩm mô phỏng. ` : ''}${result.delayed}`;
  $('result-delta').innerHTML = deltaHtml(result);
  $('lesson-title').textContent = result.lesson.title;
  $('lesson-text').textContent = result.lesson.text;
  $('lesson-source').href = result.lesson.sourceUrl;
  $('lesson-source').textContent = 'ĐỌC NGUỒN KHOA HỌC ↗';
  $('reflection-prompt').textContent = 'Bạn đã đánh đổi điều gì để bảo vệ căn cứ trong ca này?';
  $('continue-button').querySelector('b').textContent = '→';
  $('continue-button').querySelector('b').setAttribute('aria-hidden', 'true');
  $('continue-button').firstChild.textContent = result.status === 'playing' ? 'TIẾP TỤC CA KẾ' : 'XEM BÁO CÁO CUỐI';
  $('result-dialog').showModal();
}

function showDebrief() {
  const won = game.status === 'won';
  $('end-dialog').classList.toggle('lost', !won);
  $('end-stamp').textContent = won ? 'NHIỆM VỤ HOÀN TẤT' : 'NHIỆM VỤ CHƯA HOÀN TẤT';
  $('end-title').textContent = won ? 'Đội đã sẵn sàng trở về' : 'Căn cứ cần một chiến thuật khác';
  $('end-reason').textContent = won ? 'Sau 10 ca, module cất cánh đã được sửa và các hệ thống căn cứ vẫn an toàn.' : `${game.endReason} Thử lại với phương án khác để cân bằng các hệ thống.`;
  $('end-stats').innerHTML = Object.keys(resourceMeta).map((key) => `<span class="end-stat"><b>${game.resources[key]}</b><small>${resourceMeta[key].label}</small></span>`).join('');
  const seen = [...new Set(game.history.map((item) => item.eventId))].map((id) => EVENTS.find((event) => event.id === id)).filter(Boolean);
  $('debrief-lessons').innerHTML = seen.map((event) => `<article class="debrief-lesson"><b>${escapeHtml(event.lesson.title)}</b><p>${escapeHtml(event.lesson.text)}</p></article>`).join('');
  $('replay-button').focus();
  $('end-dialog').showModal();
}

function maybeShowDebrief() {
  if (game.status !== 'playing') showDebrief();
}

function onResolve() {
  if (forecastConfirmed) {
    confirmShift();
    return;
  }
  const assignments = currentAssignments();
  const forecast = forecastShift(game, { choiceId: selectedChoice, assignments });
  if (!forecast.ok) {
    $('forecast-prompt').textContent = forecast.error;
    return;
  }
  $('forecast-values').innerHTML = Object.keys(resourceMeta).map((key) => {
    const change = forecast.after[key] - forecast.before[key];
    const sign = change > 0 ? '+' : '';
    return `<span class="forecast-value">${resourceMeta[key].symbol} ${forecast.before[key]} → ${forecast.after[key]} (${sign}${change})</span>`;
  }).join('');
  $('forecast-prompt').textContent = 'Đã kiểm tra dự báo. Xác nhận để giải quyết ca này.';
  forecastConfirmed = true;
  renderResolveButton();
}

function confirmShift() {
  const result = resolveShift(game, { choiceId: selectedChoice, assignments: currentAssignments() });
  if (!result.ok) {
    $('forecast-prompt').textContent = result.error;
    return;
  }
  selectedChoice = '';
  forecastConfirmed = false;
  game.assignments = null;
  render();
  showShiftResult(result);
}

function replay() {
  game = createGame((game.seed + 137) >>> 0);
  selectedChoice = '';
  forecastConfirmed = false;
  lastResult = null;
  $('end-dialog').close();
  render();
  $('intro-dialog').showModal();
}

function useEmergency() {
  const firstAction = Object.entries(currentAssignments()).find(([, action]) => action)?.[1] ?? 'lifeSupport';
  if (!useEmergencyOrder(game, firstAction)) return;
  renderCrew();
  renderForecast();
  renderResolveButton();
  renderEcho();
  $('echo-hint').textContent = `Linh đã dùng lệnh khẩn cấp: cả đội cùng thực hiện “${ACTIONS[firstAction].label}”. Lệnh này không thể hoàn lại.`;
}

function openNext() {
  $('result-dialog').close();
  maybeShowDebrief();
  if (game.status === 'playing') {
    render();
    $('event-title').focus?.();
  }
}

function saveSoftState() {
  try {
    localStorage.setItem('lunar-shift-last-run', JSON.stringify({ seed: game.seed, shift: game.shift, status: game.status }));
  } catch {}
}

$('resolve-button').addEventListener('click', onResolve);
$('continue-button').addEventListener('click', openNext);
$('replay-button').addEventListener('click', replay);
$('emergency-button').addEventListener('click', useEmergency);
$('help-button').addEventListener('click', () => $('help-dialog').showModal());
$('start-button').addEventListener('click', () => $('intro-dialog').close());
$('result-close').addEventListener('click', openNext);
$('end-close').addEventListener('click', () => $('end-dialog').close());
$('end-dialog').addEventListener('click', (event) => { if (event.target === $('end-dialog')) $('end-dialog').close(); });
$('result-dialog').addEventListener('close', maybeShowDebrief);
window.addEventListener('beforeunload', saveSoftState);

render();
$('intro-dialog').showModal();

