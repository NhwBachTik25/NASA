export const ACTIONS = {
  lifeSupport: { label: 'Duy trì oxy', short: 'OXY', cost: 5, icon: 'air' },
  power: { label: 'Bảo trì điện', short: 'ĐIỆN', cost: 2, icon: 'power' },
  greenhouse: { label: 'Chăm sóc nhà kính', short: 'VƯỜN', cost: 4, icon: 'food' },
  shelter: { label: 'Gia cố hầm trú', short: 'TRÚ ẨN', cost: 3, icon: 'shield' },
  repair: { label: 'Sửa module cất cánh', short: 'SỬA TÀU', cost: 5, icon: 'repair' },
};

export const CREW = [
  { id: 'lin', name: 'Linh', role: 'Chỉ huy', skill: 'Một lần mỗi ván, lệnh khẩn cấp cho cả đội.' },
  { id: 'an', name: 'Dr. An', role: 'Sự sống', skill: 'Tăng hiệu quả duy trì oxy.' },
  { id: 'bao', name: 'Bảo', role: 'Điện & sửa chữa', skill: 'Tăng hiệu quả điện và sửa tàu.' },
  { id: 'ha', name: 'Dr. Hạ', role: 'Phóng xạ', skill: 'Cảnh báo nguy cơ ca kế tiếp.' },
];

export const EVENTS = [
  {
    id: 'polar-shadow', title: 'Bóng địa hình che mảng pin', kind: 'BỀ MẶT', severity: 'CẦN LƯU Ý', sourceUrl: 'https://science.nasa.gov/photojournal/south-pole-illumination-map/', sourceLabel: 'NASA · Bản đồ chiếu sáng cực Nam', dataType: 'science-context',
    description: 'Địa hình vùng cực tạo bóng đổ, làm mảng pin nhận ít ánh sáng hơn trong ca này.',
    choices: [
      { id: 'protect', label: 'Giữ các hệ thiết yếu', effects: { energy: -4 }, delayed: 'Nhà kính vẫn cần người chăm sóc để thu hoạch sau.' },
      { id: 'conserve', label: 'Tiết kiệm điện', effects: { oxygen: -3, food: -2, energy: 3 }, delayed: 'Bảo toàn điện nhưng oxy và khẩu phần giảm nhẹ.' },
    ], lesson: { title: 'Ánh sáng thay đổi theo địa hình', text: 'Ở cực Nam, sườn núi và miệng hố tạo vùng sáng và vùng tối. Nơi đặt pin rất quan trọng.', sourceUrl: 'https://science.nasa.gov/photojournal/south-pole-illumination-map/' },
  },
  {
    id: 'air-filter-leak', title: 'Bộ lọc khí bị rò', kind: 'SỰ CỐ HỆ THỐNG', severity: 'CẢNH BÁO', sourceUrl: 'https://www.nasa.gov/exploration-research-and-technology/', sourceLabel: 'NASA · Công nghệ khám phá', dataType: 'game-scenario',
    description: 'Một khớp nối của vòng tuần hoàn không khí hoạt động kém. Đội cần ưu tiên hệ hỗ trợ sự sống.',
    choices: [
      { id: 'protect', label: 'Cô lập và kiểm tra bộ lọc', effects: { energy: -3, oxygen: 2 }, delayed: 'Dành điện cho lọc khí khiến nhà kính chậm được chăm sóc.' },
      { id: 'conserve', label: 'Giảm tải thiết bị', effects: { oxygen: -4, energy: 2 }, delayed: 'Tiết kiệm điện, nhưng oxy dự trữ giảm trong ca này.' },
    ], lesson: { title: 'Oxy cần một hệ thống tuần hoàn', text: 'Thiết bị duy trì sự sống dùng năng lượng. Khi điện thiếu, khả năng hỗ trợ oxy cũng bị ảnh hưởng.', sourceUrl: 'https://www.nasa.gov/exploration-research-and-technology/' },
  },
  {
    id: 'greenhouse-power', title: 'Nhà kính cần thêm điện', kind: 'NHÀ KÍNH', severity: 'LƯU Ý', sourceUrl: 'https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/', sourceLabel: 'NASA · Trồng cây trong không gian', dataType: 'science-context',
    description: 'Đèn trồng cây cần điện. Bỏ một ca chăm sóc sẽ làm chậm nguồn thực phẩm về sau.',
    choices: [
      { id: 'protect', label: 'Dành điện cho cây trồng', effects: { energy: -3 }, delayed: 'Nhà kính được chăm sóc và tiếp tục chu kỳ thu hoạch mô phỏng.' },
      { id: 'conserve', label: 'Tạm giảm đèn nhà kính', effects: { energy: 2, food: -1 }, delayed: 'Điện tăng ngay, nhưng thực phẩm tương lai ít hơn.' },
    ], lesson: { title: 'Thực phẩm cần thời gian và tài nguyên', text: 'Nhà kính trong không gian cần ánh sáng, nước và sự chăm sóc. Sản lượng trong trò chơi là mô phỏng, không phải dự báo NASA cho căn cứ Mặt Trăng.', sourceUrl: 'https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/' },
  },
  {
    id: 'solar-particles', title: 'Cảnh báo hạt năng lượng Mặt Trời', kind: 'THỜI TIẾT KHÔNG GIAN', severity: 'CẢNH BÁO', sourceUrl: 'https://ccmc.gsfc.nasa.gov/tools/DONKI/', sourceLabel: 'NASA CCMC · DONKI', dataType: 'game-scenario',
    description: 'ECHO dùng bối cảnh từ kho DONKI lịch sử để mở một tình huống học tập. Đây không phải cảnh báo thời gian thực hay phép đo phóng xạ tại căn cứ.',
    choices: [
      { id: 'protect', label: 'Đưa đội vào hầm trú', effects: { energy: -3, radiation: -8 }, delayed: 'Ít người rảnh để sửa module cất cánh trong ca này.' },
      { id: 'conserve', label: 'Tiếp tục công việc bên trong', effects: { repair: 1, radiation: 7 }, delayed: 'Tiến độ tăng, nhưng chỉ số nguy cơ mô phỏng cũng tăng.' },
    ], lesson: { title: 'Hầm trú giúp giảm phơi nhiễm', text: 'Che chắn là một phần của thiết kế căn cứ. Thanh nguy cơ ở đây chỉ là đơn vị trò chơi, không phải liều đo trên Mặt Trăng.', sourceUrl: 'https://science.nasa.gov/heliophysics/space-weather/' },
  },
  {
    id: 'lunar-dust', title: 'Bụi bám trên bề mặt pin', kind: 'BẢO TRÌ', severity: 'LƯU Ý', sourceUrl: 'https://science.nasa.gov/moon/lunar-surface/', sourceLabel: 'NASA · Bề mặt Mặt Trăng', dataType: 'game-scenario',
    description: 'Lớp bụi trên thiết bị làm giảm hiệu suất mảng pin trong tình huống của ca này.',
    choices: [
      { id: 'protect', label: 'Làm sạch và kiểm tra mảng pin', effects: { energy: 3 }, delayed: 'Điện phục hồi để dùng cho hỗ trợ sự sống hoặc nhà kính.' },
      { id: 'conserve', label: 'Giữ người trong căn cứ', effects: { energy: -3, radiation: -1 }, delayed: 'Không bảo trì pin trong ca này; tránh hoạt động ngoài căn cứ.' },
    ], lesson: { title: 'Bụi Mặt Trăng ảnh hưởng thiết bị', text: 'Bụi Mặt Trăng có thể bám lên thiết bị. Đây không phải bão bụi khí quyển như trên Sao Hỏa.', sourceUrl: 'https://science.nasa.gov/moon/lunar-surface/' },
  },
];

const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
const clone = (value) => structuredClone(value);
const crewIds = CREW.map((member) => member.id);
const resourceKeys = ['oxygen', 'energy', 'food', 'radiation', 'repair'];
const normalizeAssignments = (input) => Object.fromEntries(crewIds.map((id) => [id, input?.[id]]));

function seeded(seed) {
  let value = (seed >>> 0) || 1;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createGame(seed = 2026) {
  const random = seeded(seed);
  const schedule = Array.from({ length: 10 }, (_, i) => (i === 0 ? 0 : Math.floor(random() * EVENTS.length)));
  schedule[3] = 2;
  schedule[6] = 3;
  return {
    seed, shift: 1, status: 'playing', endReason: '',
    resources: { oxygen: 72, energy: 68, food: 70, radiation: 12, repair: 12 },
    pendingFood: [], assignments: null, forecast: null, currentEvent: null,
    schedule, history: [], emergencyUsed: false, echoHint: 'Chào chỉ huy. Hãy xem sự kiện, dự đoán đánh đổi và phân công cả đội.',
  };
}

function eventFor(state) {
  return EVENTS[state.schedule[state.shift - 1] ?? 0];
}

function applyAssignments(state, assignments) {
  const delta = Object.fromEntries(resourceKeys.map((key) => [key, 0]));
  const pending = [];
  let greenhouses = 0;
  for (const member of CREW) {
    const action = assignments[member.id];
    if (action === 'lifeSupport') {
      delta.energy -= ACTIONS.lifeSupport.cost;
      delta.oxygen += state.resources.energy > 0 ? 5 + (member.id === 'an' ? 3 : 0) : 1;
    } else if (action === 'power') {
      delta.energy += 8 + (member.id === 'bao' ? 3 : 0);
    } else if (action === 'greenhouse') {
      delta.energy -= ACTIONS.greenhouse.cost;
      delta.food -= 1;
      greenhouses += 1;
      pending.push({ harvestShift: state.shift + 2, amount: member.id === 'an' ? 5 : 4 });
    } else if (action === 'shelter') {
      delta.energy -= ACTIONS.shelter.cost;
      delta.radiation -= member.id === 'ha' ? 8 : 6;
    } else if (action === 'repair') {
      delta.energy -= ACTIONS.repair.cost;
      delta.repair += member.id === 'bao' ? 9 : 6;
    }
  }
  return { delta, pending, greenhouses };
}

function compute(state, input) {
  const assignments = normalizeAssignments(input.assignments);
  const crewActions = Object.values(assignments);
  if (crewActions.some((action) => !Object.hasOwn(ACTIONS, action))) return { error: 'Hãy phân công một nhiệm vụ cho từng phi hành gia.' };
  if (!input.choiceId) return { error: 'Chọn một phương án cho sự kiện trước khi xác nhận.' };
  const event = eventFor(state);
  const choice = event.choices.find((item) => item.id === input.choiceId);
  if (!choice) return { error: 'Phương án này không thuộc sự kiện hiện tại.' };
  const actionResult = applyAssignments(state, assignments);
  const delta = actionResult.delta;
  const messages = [];

  if (choice.id === 'conserve' && event.id === 'polar-shadow') delta.energy += 1;
  if (choice.id === 'conserve' && event.id === 'greenhouse-power') delta.food -= 2;
  if (choice.id === 'protect' && event.id === 'solar-particles') delta.repair -= 1;
  for (const [key, value] of Object.entries(choice.effects)) delta[key] += value;

  const foodCost = actionResult.greenhouses > 0 ? 0 : 1;
  delta.food -= foodCost;
  const dueFood = state.pendingFood.filter((item) => item.harvestShift <= state.shift);
  for (const item of dueFood) delta.food += item.amount;

  if (state.shift % 2 === 0) delta.radiation += 2;
  if (state.shift % 3 === 0) delta.energy -= 1;

  const after = Object.fromEntries(resourceKeys.map((key) => [key, clamp(state.resources[key] + delta[key])]));
  const nextPending = [...state.pendingFood.filter((item) => item.harvestShift > state.shift), ...actionResult.pending];
  const unspentAssignments = Object.entries(assignments).map(([crewId, action]) => ({ crewId, action }));
  return {
    assignments, event, choice, delta, after, nextPending, dueFood, unspentAssignments, messages,
    lesson: event.lesson, delayed: choice.delayed,
  };
}

export function forecastShift(state, input) {
  const result = compute(state, input);
  if (result.error) return { ok: false, error: result.error };
  return {
    ok: true, event: result.event, choice: result.choice,
    before: { ...state.resources }, after: result.after, delta: result.delta,
    delayed: result.delayed, harvest: result.nextPending.reduce((sum, item) => sum + item.amount, 0),
  };
}

export function resolveShift(state, input) {
  if (state.status !== 'playing') return { ok: false, error: 'Ván chơi đã kết thúc.' };
  const result = compute(state, input);
  if (result.error) return { ok: false, error: result.error };
  const before = { ...state.resources };
  state.resources = result.after;
  state.pendingFood = result.nextPending;
  state.assignments = result.assignments;
  state.currentEvent = result.event.id;
  state.history.push({ shift: state.shift, eventId: result.event.id, choiceId: result.choice.id, before, after: { ...state.resources }, lessonTitle: result.lesson.title });

  let endReason = '';
  if (state.resources.oxygen <= 0) endReason = 'Không còn đủ oxy cho phi hành đoàn.';
  else if (state.resources.energy <= 0) endReason = 'Căn cứ hết năng lượng để duy trì các hệ thống.';
  else if (state.resources.food <= 0) endReason = 'Kho thực phẩm đã cạn.';
  else if (state.resources.radiation >= 100) endReason = 'Nguy cơ phóng xạ trong mô phỏng đã chạm ngưỡng thất bại.';
  if (endReason) {
    state.status = 'lost';
    state.endReason = endReason;
  } else if (state.shift === 10) {
    if (state.resources.repair >= 100) state.status = 'won';
    else {
      state.status = 'lost';
      state.endReason = 'Đã hết 10 ca nhưng module cất cánh chưa sửa xong.';
    }
  } else state.shift += 1;

  const nextEvent = state.status === 'playing' ? eventFor(state) : null;
  state.echoHint = state.status === 'won'
    ? 'Tốt lắm, chỉ huy. Đội đã sửa module cất cánh và sẵn sàng trở về Trái Đất.'
    : state.status === 'lost'
      ? `${state.endReason} Hãy xem lại ca có đánh đổi lớn nhất và thử chiến thuật khác.`
      : result.lesson.text;
  return {
    ok: true, before, after: { ...state.resources }, delta: result.delta,
    event: result.event, choice: result.choice, lesson: result.lesson, delayed: result.delayed,
    harvested: result.dueFood.reduce((sum, item) => sum + item.amount, 0),
    nextEvent, shift: state.shift, status: state.status, endReason: state.endReason,
  };
}

export function useEmergencyOrder(state, action) {
  if (state.status !== 'playing' || state.emergencyUsed || !Object.hasOwn(ACTIONS, action)) return false;
  state.emergencyUsed = true;
  state.assignments = Object.fromEntries(crewIds.map((id) => [id, action]));
  return true;
}

export function cloneGame(state) {
  return clone(state);
}
