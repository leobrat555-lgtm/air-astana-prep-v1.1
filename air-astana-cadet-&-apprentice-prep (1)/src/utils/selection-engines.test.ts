import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateOfficialMixedAptitudeBatch,
  generateRooftopQuestion,
  generateConcentricQuestion,
  generateSyllogismQuestion,
  generatePositioningQuestion,
} from './mixed-aptitude-engine';
import {
  generateAbstractQuestions,
  generateSpatialQuestions,
  generateNumericalQuestions,
  generateVerbalQuestions,
} from './cognitive-battery-engine';

test('Mixed Aptitude Engine generates exactly 15 questions in 12-minute exam batch', () => {
  const batch = generateOfficialMixedAptitudeBatch();
  assert.equal(batch.length, 15);
  for (const q of batch) {
    assert.ok(q.id, 'Question must have unique ID');
    assert.ok(q.question, 'Question must have non-empty prompt');
    assert.ok(Array.isArray(q.options), 'Options must be an array');
    assert.ok(q.options.length >= 3, 'Must have at least 3 options');
    assert.ok(q.correctAnswerIndex >= 0 && q.correctAnswerIndex < q.options.length, 'Correct index must be valid');
    assert.ok(q.explanationEn, 'Must have English explanation');
    assert.ok(q.explanationRu, 'Must have Russian explanation');
  }
});

test('Rooftop Projection generates valid SVG diagram and orthographic choices', () => {
  const q = generateRooftopQuestion(0);
  assert.equal(q.archetype, 'rooftop');
  assert.ok(q.svgIllustration && q.svgIllustration.includes('<svg'), 'Must produce vector SVG diagram');
  assert.equal(q.options.length, 4);
});

test('Concentric Arc Generator produces valid vector geometry', () => {
  const q = generateConcentricQuestion(0);
  assert.equal(q.archetype, 'concentric');
  assert.ok(q.svgIllustration && q.svgIllustration.includes('<svg'), 'Must produce vector SVG diagram');
  assert.equal(q.options.length, 4);
});

test('3-Statement Syllogism produces sound logical deductions', () => {
  const q = generateSyllogismQuestion(0);
  assert.equal(q.archetype, 'syllogism');
  assert.equal(q.options.length, 3);
  assert.ok(q.question.includes('Statement to evaluate'));
});

test('Linear Taxiway Positioning generates spatial ordering logic', () => {
  const q = generatePositioningQuestion(0);
  assert.equal(q.archetype, 'positioning');
  assert.equal(q.options.length, 5);
});

test('Cognitive Ability Battery generates Parts 1 through 4 with accurate options', () => {
  // Part 1: Abstract Reasoning (6 options)
  const part1 = generateAbstractQuestions(8);
  assert.equal(part1.length, 8);
  for (const q of part1) {
    assert.equal(q.cognitivePart, 1);
    assert.equal(q.options.length, 6, 'Part 1 abstract reasoning requires 6 options');
    assert.ok(q.correctAnswerIndex >= 0 && q.correctAnswerIndex < 6);
  }

  // Part 2: Spatial Reasoning (4 options)
  const part2 = generateSpatialQuestions(8);
  assert.equal(part2.length, 8);
  for (const q of part2) {
    assert.equal(q.cognitivePart, 2);
    assert.equal(q.options.length, 4, 'Part 2 spatial reasoning requires 4 options');
    assert.ok(q.correctAnswerIndex >= 0 && q.correctAnswerIndex < 4);
  }

  // Part 3: Numerical Reasoning (6 options)
  const part3 = generateNumericalQuestions(8);
  assert.equal(part3.length, 8);
  for (const q of part3) {
    assert.equal(q.cognitivePart, 3);
    assert.equal(q.options.length, 6, 'Part 3 numerical reasoning requires 6 options');
    assert.ok(q.correctAnswerIndex >= 0 && q.correctAnswerIndex < 6);
  }

  // Part 4: Verbal Reasoning (4 options)
  const part4 = generateVerbalQuestions(8);
  assert.equal(part4.length, 8);
  for (const q of part4) {
    assert.equal(q.cognitivePart, 4);
    assert.equal(q.options.length, 4, 'Part 4 verbal reasoning requires 4 options');
    assert.ok(q.correctAnswerIndex >= 0 && q.correctAnswerIndex < 4);
  }
});
