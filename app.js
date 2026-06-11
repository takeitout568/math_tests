const state = { questions: [], grade: '5', style: 'standard', results: [] };

const gradeGrid = document.querySelector('#grade-grid');
const gradeLabels = ['K', ...Array.from({ length: 12 }, (_, index) => String(index + 1))];
gradeLabels.forEach((grade) => {
  const label = document.createElement('label');
  label.innerHTML = `<input type="radio" name="grade" value="${grade}" ${grade === '5' ? 'checked' : ''}><span>${grade}</span>`;
  gradeGrid.appendChild(label);
});

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (items) => items[rand(0, items.length - 1)];
const cleanNumber = (number) => Number(Number(number).toFixed(3));
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));

function makeProblem(prompt, answer, solution, unit = '') {
  return { prompt, answer: cleanNumber(answer), solution, unit };
}

function operationProblem(grade) {
  if (grade === 0) {
    const a = rand(1, 8), b = rand(1, 10 - a);
    return makeProblem(`${a} + ${b} = ?`, a + b, `Start at ${a} and count forward ${b} more: ${a} + ${b} = ${a + b}.`);
  }
  if (grade <= 2) {
    const max = grade === 1 ? 20 : 100, a = rand(3, max), b = rand(1, a);
    return Math.random() > .5
      ? makeProblem(`${a} + ${b} = ?`, a + b, `Add the two amounts: ${a} + ${b} = ${a + b}.`)
      : makeProblem(`${a} − ${b} = ?`, a - b, `Subtract ${b} from ${a}: ${a} − ${b} = ${a - b}.`);
  }
  if (grade <= 4) {
    const a = rand(2, grade === 3 ? 10 : 14), b = rand(2, 12);
    if (Math.random() > .45) return makeProblem(`${a} × ${b} = ?`, a * b, `Multiply ${a} by ${b}: ${a} × ${b} = ${a * b}.`);
    return makeProblem(`${a * b} ÷ ${a} = ?`, b, `Ask how many groups of ${a} fit into ${a * b}. Since ${a} × ${b} = ${a * b}, the answer is ${b}.`);
  }
  if (grade === 5) {
    const a = rand(12, 90) / 10, b = rand(11, 80) / 10;
    return makeProblem(`${a.toFixed(1)} + ${b.toFixed(1)} = ?`, a + b, `Line up the decimal points and add: ${a.toFixed(1)} + ${b.toFixed(1)} = ${cleanNumber(a + b)}.`);
  }
  if (grade === 6) {
    const percent = pick([10, 20, 25, 50, 75]), base = rand(2, 12) * 20;
    return makeProblem(`What is ${percent}% of ${base}?`, base * percent / 100, `Convert ${percent}% to ${percent / 100}, then multiply: ${percent / 100} × ${base} = ${base * percent / 100}.`);
  }
  if (grade === 7) {
    const x = rand(2, 15), a = rand(2, 8), b = rand(1, 15), total = a * x + b;
    return makeProblem(`Solve for x: ${a}x + ${b} = ${total}`, x, `Subtract ${b} from both sides to get ${a}x = ${total - b}. Divide both sides by ${a}, so x = ${x}.`);
  }
  if (grade === 8) {
    const x = rand(-5, 10), m = rand(2, 7), b = rand(-8, 8), y = m * x + b;
    return makeProblem(`If y = ${m}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}, find y when x = ${x}.`, y, `Substitute ${x} for x: y = ${m}(${x}) ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${y}.`);
  }
  if (grade === 9) {
    const base = rand(2, 6), exponent = rand(2, 4), answer = base ** exponent;
    return makeProblem(`Evaluate ${base}^${exponent}.`, answer, `An exponent tells how many times to multiply the base: ${Array(exponent).fill(base).join(' × ')} = ${answer}.`);
  }
  if (grade === 10) {
    const width = rand(4, 15), height = rand(4, 15);
    return makeProblem(`A right triangle has legs ${width} and ${height}. What is its area?`, width * height / 2, `Use A = ½bh. A = ½ × ${width} × ${height} = ${width * height / 2}.`, 'square units');
  }
  if (grade === 11) {
    const angle = pick([0, 30, 45, 60, 90]);
    const values = { 0: 0, 30: .5, 45: .707, 60: .866, 90: 1 };
    return makeProblem(`Evaluate sin(${angle}°). Round to 3 decimals if needed.`, values[angle], `Using the unit circle, sin(${angle}°) = ${values[angle]}.`);
  }
  const x = rand(1, 5), coefficient = rand(2, 8), power = rand(2, 4), answer = coefficient * power * x ** (power - 1);
  return makeProblem(`For f(x) = ${coefficient}x^${power}, find f′(${x}).`, answer, `Use the power rule: f′(x) = ${coefficient * power}x^${power - 1}. Then f′(${x}) = ${answer}.`);
}

function storyProblem(grade) {
  if (grade <= 2) {
    const names = ['Mia', 'Theo', 'Ava', 'Sam'], name = pick(names), start = rand(3, grade === 0 ? 8 : grade === 1 ? 15 : 50), more = rand(1, grade === 0 ? 5 : grade === 1 ? 10 : 30);
    return makeProblem(`${name} has ${start} stickers and gets ${more} more. How many stickers does ${name} have now?`, start + more, `“Gets more” means add. ${start} + ${more} = ${start + more} stickers.`, 'stickers');
  }
  if (grade <= 4) {
    const groups = rand(3, 10), each = rand(2, 12);
    return makeProblem(`A library places ${each} books on each of ${groups} display shelves. How many books are displayed?`, groups * each, `There are ${groups} equal groups of ${each}. Multiply: ${groups} × ${each} = ${groups * each} books.`, 'books');
  }
  if (grade <= 6) {
    const percent = grade === 5 ? 20 : pick([15, 20, 25, 50]), price = rand(2, 12) * 10;
    return makeProblem(`A ${price}-dollar backpack is discounted by ${percent}%. How many dollars is the discount?`, price * percent / 100, `Multiply the original price by the discount rate: ${price} × ${percent / 100} = ${price * percent / 100}.`, 'dollars');
  }
  if (grade <= 8) {
    const rate = rand(3, 12), hours = rand(2, 8), start = rand(1, 10), total = rate * hours + start;
    return makeProblem(`A bike rental costs $${start} plus $${rate} per hour. If the total was $${total}, how many hours was the bike rented?`, hours, `Model the total with ${rate}h + ${start} = ${total}. Subtract ${start}, then divide by ${rate}: h = ${hours}.`, 'hours');
  }
  if (grade <= 10) {
    const speed = rand(35, 70), hours = rand(2, 6);
    return makeProblem(`A train travels at a constant ${speed} miles per hour for ${hours} hours. How far does it travel?`, speed * hours, `Distance = rate × time, so ${speed} × ${hours} = ${speed * hours} miles.`, 'miles');
  }
  if (grade === 11) {
    const height = rand(4, 12), shadow = rand(5, 15), ratio = cleanNumber(height / shadow);
    return makeProblem(`A ${height}-foot post casts a ${shadow}-foot shadow. What is tan(θ) for the angle of elevation? Round to 3 decimals.`, ratio, `Tangent is opposite ÷ adjacent, so tan(θ) = ${height} ÷ ${shadow} = ${ratio}.`);
  }
  const rate = rand(2, 8), time = rand(2, 7), initial = rand(10, 30), final = initial + rate * time;
  return makeProblem(`A tank starts with ${initial} gallons and fills at ${rate} gallons per minute. How many gallons are in it after ${time} minutes?`, final, `Integrate the constant rate over ${time} minutes, then add the initial amount: ${initial} + (${rate} × ${time}) = ${final}.`, 'gallons');
}

function generateQuestions(count, grade, style) {
  return Array.from({ length: count }, () => style === 'story' ? storyProblem(grade) : operationProblem(grade));
}

function showView(id) {
  document.querySelectorAll('.view').forEach((view) => view.classList.toggle('hidden', view.id !== id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function gradeName(grade) { return grade === 'K' ? 'Kindergarten' : `Grade ${grade}`; }

function renderTest() {
  const list = document.querySelector('#question-list');
  list.innerHTML = state.questions.map((question, index) => `
    <article class="question-card">
      <span class="question-number">${String(index + 1).padStart(2, '0')}</span>
      <p class="question-text">${escapeHtml(question.prompt)}</p>
      <label class="answer-wrap"><input inputmode="decimal" autocomplete="off" name="answer-${index}" aria-label="Answer to question ${index + 1}" placeholder="Your answer"><span>${escapeHtml(question.unit)}</span></label>
    </article>`).join('');
  document.querySelector('#test-eyebrow').textContent = `${gradeName(state.grade)} · ${state.style === 'story' ? 'Story problems' : 'Numbers'}`;
  updateProgress();
}

function updateProgress() {
  const inputs = [...document.querySelectorAll('#question-list input')];
  const answered = inputs.filter((input) => input.value.trim() !== '').length;
  const percent = Math.round(answered / state.questions.length * 100) || 0;
  document.querySelector('#progress-copy').textContent = `${answered} of ${state.questions.length} answered`;
  document.querySelector('#progress-percent').textContent = `${percent}%`;
  document.querySelector('#progress-bar').style.width = `${percent}%`;
  document.querySelector('#submit-test').disabled = answered !== state.questions.length;
  document.querySelector('#unanswered-note').textContent = answered === state.questions.length ? 'Everything is answered. You’re ready to submit.' : `Answer ${state.questions.length - answered} more ${state.questions.length - answered === 1 ? 'question' : 'questions'} to submit your test.`;
}

function renderReport() {
  const correct = state.results.filter((result) => result.correct).length;
  const percent = Math.round(correct / state.results.length * 100);
  const message = percent >= 90 ? 'Outstanding work!' : percent >= 70 ? 'Nice work—keep going.' : 'Good effort—let’s learn from it.';
  const date = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());
  document.querySelector('#report-content').innerHTML = `
    <section class="report-hero">
      <div><p class="eyebrow">Math test report · ${escapeHtml(date)}</p><h1>${message}</h1></div>
      <div class="score-circle"><b>${percent}%</b><span>Overall score</span></div>
    </section>
    <section class="report-summary">
      <div class="summary-stat"><span>Level</span><b>${escapeHtml(gradeName(state.grade))}</b></div>
      <div class="summary-stat"><span>Correct answers</span><b>${correct} of ${state.results.length}</b></div>
      <div class="summary-stat"><span>Practice style</span><b>${state.style === 'story' ? 'Story problems' : 'Numbers'}</b></div>
    </section>
    <section class="review-section">
      <h2>Answer review</h2>
      <p class="review-intro">Review each answer below. Questions that need another look include a step-by-step solution.</p>
      <div class="result-list">${state.results.map((result, index) => `
        <article class="result-item ${result.correct ? 'correct' : 'incorrect'}">
          <div class="result-top">
            <span class="result-icon">${result.correct ? '✓' : '×'}</span>
            <span class="result-question">${index + 1}. ${escapeHtml(result.question.prompt)}</span>
            <span class="result-answer">Your answer: <b>${escapeHtml(result.userAnswer)}${result.question.unit ? ` ${escapeHtml(result.question.unit)}` : ''}</b></span>
          </div>
          ${result.correct ? '' : `<div class="solution"><b>How to solve it</b><p>${escapeHtml(result.question.solution)} The correct answer is <strong>${result.question.answer}${result.question.unit ? ` ${escapeHtml(result.question.unit)}` : ''}</strong>.</p></div>`}
        </article>`).join('')}</div>
    </section>`;
}

document.querySelector('#test-settings').addEventListener('submit', (event) => {
  event.preventDefault();
  state.grade = new FormData(event.currentTarget).get('grade');
  state.style = new FormData(event.currentTarget).get('question-style');
  const count = Number(new FormData(event.currentTarget).get('question-count'));
  state.questions = generateQuestions(count, state.grade === 'K' ? 0 : Number(state.grade), state.style);
  renderTest();
  showView('test-view');
});

document.querySelector('#test-settings').addEventListener('change', () => {
  const count = Number(new FormData(document.querySelector('#test-settings')).get('question-count'));
  document.querySelector('#time-estimate').textContent = `About ${Math.max(5, Math.round(count * 1.1))} minutes`;
});
document.querySelector('#question-list').addEventListener('input', updateProgress);
document.querySelector('#back-to-setup').addEventListener('click', () => showView('setup-view'));
document.querySelector('#new-test').addEventListener('click', () => showView('setup-view'));
document.querySelector('#print-report').addEventListener('click', () => window.print());

document.querySelector('#answer-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const inputs = [...document.querySelectorAll('#question-list input')];
  state.results = state.questions.map((question, index) => {
    const userAnswer = inputs[index].value.trim();
    const numericAnswer = Number(userAnswer.replace(/[$,%\s]/g, ''));
    return { question, userAnswer, correct: Number.isFinite(numericAnswer) && Math.abs(numericAnswer - question.answer) < .01 };
  });
  renderReport();
  showView('report-view');
});

document.querySelector('#download-report').addEventListener('click', () => {
  const stylesheet = [...document.styleSheets].find((sheet) => sheet.href?.endsWith('styles.css'));
  const reportStyles = [...stylesheet.cssRules].map((rule) => rule.cssText).join('\n');
  const content = document.querySelector('#report-content').outerHTML;
  const file = new Blob([`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Summa Math Test Report</title><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet"><style>${reportStyles}</style></head><body><main class="report-view">${content}</main></body></html>`], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = `summa-${state.grade.toLowerCase()}-math-report.html`;
  link.click();
  URL.revokeObjectURL(link.href);
});
