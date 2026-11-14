import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, forecastShift, resolveShift, ACTIONS, EVENTS, useEmergencyOrder } from '../game-core.mjs';

const assignment = (action) => ({ lin: action, an: action, bao: action, ha: action });

test('a new Lunar Shift run starts on shift one with simulated resources in range', () => {
  const state = createGame(7);
  assert.equal(state.shift, 1);
  assert.deepEqual(Object.keys(state.resources), ['oxygen', 'energy', 'food', 'radiation', 'repair']);
  for (const [key, value] of Object.entries(state.resources)) {
    assert.ok(value >= 0 && value <= 100, `${key} out of range`);
  }
  assert.equal(state.status, 'playing');
  assert.equal(EVENTS.length, 5);
});

test('each crew member must be assigned exactly one valid action', () => {
  const state = createGame(1);
  const result = resolveShift(state, { choiceId: 'protect', assignments: { lin: 'lifeSupport' } });
  assert.equal(result.ok, false);
  assert.equal(state.shift, 1);
  assert.deepEqual(Object.keys(ACTIONS).length, 5);
});

test('life support consumes energy and An improves oxygen recovery', () => {
  const state = createGame(2);
  const beforeEnergy = state.resources.energy;
  const result = resolveShift(state, { choiceId: 'protect', assignments: assignment('lifeSupport') });
  assert.equal(result.ok, true);
  assert.ok(state.resources.energy < beforeEnergy);
  assert.ok(state.resources.oxygen > 72);
});

test('greenhouse spends energy now and harvests food after two shifts', () => {
  const state = createGame(3);
  const beforeFood = state.resources.food;
  const result = resolveShift(state, { choiceId: 'protect', assignments: assignment('greenhouse') });
  assert.equal(result.ok, true);
  assert.ok(state.resources.food < beforeFood);
  assert.equal(state.pendingFood.length, 4);
  assert.equal(state.pendingFood[0].harvestShift, 3);
  const beforeHarvest = state.resources.food;
  resolveShift(state, { choiceId: 'protect', assignments: assignment('power') });
  assert.equal(state.resources.food, beforeHarvest - 1);
  resolveShift(state, { choiceId: 'protect', assignments: assignment('power') });
  assert.ok(state.resources.food > beforeHarvest);
});

test('forecast and resolve use the same deterministic outcome for selected orders', () => {
  const state = createGame(4);
  const input = { choiceId: 'protect', assignments: assignment('repair') };
  const forecast = forecastShift(state, input);
  const result = resolveShift(state, input);
  assert.equal(result.ok, true);
  assert.deepEqual(result.delta, forecast.delta);
});

test('one event and one choice resolve per shift with educational feedback', () => {
  const state = createGame(5);
  const result = resolveShift(state, { choiceId: 'protect', assignments: assignment('shelter') });
  assert.equal(result.ok, true);
  assert.ok(result.event.id);
  assert.ok(result.lesson.title);
  assert.equal(state.history.length, 1);
});

test('run ends in victory only after shift ten and all victory thresholds are met', () => {
  const state = createGame(1);
  state.resources.repair = 98;
  state.shift = 10;
  const result = resolveShift(state, { choiceId: 'protect', assignments: assignment('repair') });
  assert.equal(result.ok, true);
  assert.equal(state.status, 'won');
});

test('zero life support or maximum radiation causes a loss with a clear reason', () => {
  const state = createGame(1);
  state.resources.energy = 0;
  const result = resolveShift(state, { choiceId: 'protect', assignments: assignment('lifeSupport') });
  assert.equal(result.ok, true);
  assert.equal(state.status, 'lost');
  assert.ok(state.endReason);
});

test('emergency order is available only once and fills all crew assignments', () => {
  const state = createGame(8);
  assert.equal(useEmergencyOrder(state, 'shelter'), true);
  assert.deepEqual(state.assignments, assignment('shelter'));
  assert.equal(useEmergencyOrder(state, 'repair'), false);
});

test('all values are clamped and event changes apply once', () => {
  const state = createGame(9);
  state.resources.oxygen = 98;
  const input = { choiceId: 'protect', assignments: assignment('lifeSupport') };
  const forecast = forecastShift(state, input);
  assert.equal(resolveShift(state, input).ok, true);
  assert.deepEqual(state.resources, forecast.after);
  for (const value of Object.values(state.resources)) assert.ok(value >= 0 && value <= 100);
});

test('last shift cannot report victory unless repair and survival conditions are met', () => {
  const state = createGame(10);
  state.shift = 10;
  state.resources.repair = 30;
  const result = resolveShift(state, { choiceId: 'protect', assignments: assignment('power') });
  assert.equal(result.ok, true);
  assert.equal(state.status, 'lost');
  assert.match(state.endReason, /10 ca/);
});

test('a balanced ten-shift strategy can win without exhausting life support', () => {
  const state = createGame(2026);
  const team = { lin: 'power', an: 'lifeSupport', bao: 'repair', ha: 'greenhouse' };
  const choices = ['conserve', 'conserve', 'protect', 'protect', 'conserve', 'protect', 'conserve', 'protect', 'protect', 'conserve'];
  for (let shift = 0; shift < 10 && state.status === 'playing'; shift += 1) {
    const assignments = { ...team };
    if (state.shift === 10) assignments.ha = 'repair';
    assert.equal(resolveShift(state, { choiceId: choices[shift], assignments }).ok, true);
  }
  assert.equal(state.status, 'won', state.endReason);
  assert.ok(state.resources.oxygen > 0 && state.resources.energy > 0 && state.resources.food > 0);
  assert.ok(state.resources.radiation < 100 && state.resources.repair >= 100);
});
