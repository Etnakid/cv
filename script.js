const buddy = document.querySelector('#buddy');
const speech = document.querySelector('#buddy-talk');
const result = document.querySelector('#quiz-result');
const reveal = document.querySelector('#quiz-reveal');
const choices = [...document.querySelectorAll('[data-city]')];
let greetings = 0;
buddy?.addEventListener('click', () => {
  const messages = ['Hello! I’m the tiny keeper of this dataset. 👋', 'My favourite plot twist? Checking the denominator.', 'You bring the questions. I’ll bring the eyebrows.'];
  speech.textContent = messages[greetings++ % messages.length];
  buddy.classList.remove('celebrate');
  void buddy.offsetWidth;
  buddy?.classList.add('celebrate');
});
choices.forEach(button => button.addEventListener('click', () => {
  const correct = button.dataset.city === 'Speyer';
  result.textContent = correct ? 'You called it! Speyer takes the lead in this comparison.' : 'A reasonable guess! The data points to Speyer.';
  speech.textContent = correct ? 'Nice hunch. Even nicer when the data agrees. ✨' : 'That’s why I check the numbers. They keep me curious. ✨';
  choices.forEach(choice => {
    choice.disabled = true;
    choice.classList.toggle('correct', choice.dataset.city === 'Speyer');
    choice.classList.toggle('picked', choice === button);
    choice.setAttribute('aria-pressed', String(choice === button));
  });
  reveal.hidden = false;
  buddy.classList.add('celebrate');
}));
document.querySelector('#reset-quiz').addEventListener('click', () => {
  reveal.hidden = true;
  choices.forEach(choice => { choice.disabled = false; choice.classList.remove('correct','picked'); choice.removeAttribute('aria-pressed'); });
  result.textContent = 'Choose a city to see the result and its source.';
  speech.textContent = 'Ready for another guess?';
  buddy?.classList.remove('celebrate');
  choices[0].focus();
});
const finale = document.querySelector('#plot-twist');
const gif = document.querySelector('#reaction-gif');
const cover = document.querySelector('#gif-cover');
const pause = document.querySelector('#pause-reaction');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function playReaction() {
  gif.src = gif.dataset.src;
  gif.hidden = false;
  cover.hidden = true;
  pause.hidden = false;
  pause.textContent = 'Hide GIF';
}
function stopReaction() {
  gif.hidden = true;
  gif.removeAttribute('src');
  cover.hidden = false;
  pause.hidden = true;
}
document.querySelector('#play-reaction').addEventListener('click', playReaction);
pause.addEventListener('click', stopReaction);
gif.addEventListener('error', () => {
  stopReaction();
  cover.querySelector('p').textContent = 'Even the GIF is speechless. Open the original below.';
});
let unlocked = false;
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !unlocked) {
      unlocked = true;
      finale.classList.add('unlocked');
      document.querySelector('#scroll-stamp').textContent = 'POST-CREDITS SCENE: UNLOCKED ✓';
      if (!reducedMotion.matches) playReaction();
    } else if (!entry.isIntersecting && unlocked) {
      stopReaction();
    }
  });
}, {threshold: 0.18});
observer.observe(finale);
document.querySelector('#insight-switch').addEventListener('click', event => {
  const panel = document.querySelector('#bonus-insight');
  const opening = panel.hidden;
  panel.hidden = !opening;
  event.currentTarget.setAttribute('aria-expanded', String(opening));
  event.currentTarget.innerHTML = opening ? '<span aria-hidden="true">✓</span> CLOSE FINDING ↥' : '<span aria-hidden="true">↯</span> EXPLORE ONE MORE FINDING';
  if (opening && !reducedMotion.matches) playReaction();
});
reducedMotion.addEventListener('change', event => { if (event.matches) stopReaction(); });
const conversations = {
  hiring: {reply: 'Then start with the evidence: two projects using public data, Python or Power Query, SQL and Power BI. Open one, check the findings, and see whether my way of thinking fits your team.', label: 'Show me the project evidence ↘', url: '#work'},
  technical: {reply: 'Excellent. Straight under the hood. The labour market project includes Python preparation, SQL queries and validation scripts. The README shows how to run it. Bring your questions.', label: 'Open the code and run instructions ↗', url: 'https://github.com/Etnakid/rhein-neckar-labour-market'},
  curious: {reply: 'That makes two of us. Try the city quiz above, explore the projects, then keep going. There’s a small surprise waiting after the SQL talk. You’ll know it when you see it.', label: 'Take me to the post-credits scene ↘', url: '#plot-twist'}
};
const interestButtons = [...document.querySelectorAll('[data-interest]')];
interestButtons.forEach(button => button.addEventListener('click', () => {
  const answer = conversations[button.dataset.interest];
  document.querySelector('#dialog-reply').textContent = answer.reply;
  const link = document.querySelector('#dialog-next');
  link.textContent = answer.label;
  link.href = answer.url;
  interestButtons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
}));
let readingTick = false;
function updateReadingProgress() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector('#reading-progress-bar').style.width = `${available > 0 ? Math.min(100, Math.max(0, window.scrollY / available * 100)) : 100}%`;
  readingTick = false;
}
window.addEventListener('scroll', () => {
  if (!readingTick) { readingTick = true; window.requestAnimationFrame(updateReadingProgress); }
}, {passive:true});
window.addEventListener('resize', updateReadingProgress);
updateReadingProgress();
const helloGif = document.querySelector('#hello-gif');
const helloToggle = document.querySelector('#hello-toggle');
const helloCover = document.querySelector('#hello-cover');
let helloTimer;
function stopHello() {
  clearTimeout(helloTimer);
  helloGif.hidden = true;
  helloGif.removeAttribute('src');
  helloCover.hidden = false;
  helloToggle.textContent = 'Replay my very professional reaction';
  helloToggle.setAttribute('aria-pressed', 'false');
}
function playHello() {
  helloGif.src = helloGif.dataset.src;
  helloGif.hidden = false;
  helloCover.hidden = true;
  helloToggle.textContent = 'Hide animation';
  helloToggle.setAttribute('aria-pressed', 'true');
  clearTimeout(helloTimer);
  helloTimer = setTimeout(stopHello, 8000);
}
helloToggle.addEventListener('click', () => helloGif.hidden ? playHello() : stopHello());
helloGif.addEventListener('error', stopHello);
let helloPlayed = false;
new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !helloPlayed && !reducedMotion.matches) {
      helloPlayed = true;
      playHello();
    } else if (!entry.isIntersecting) stopHello();
  });
}, {threshold:.3}).observe(document.querySelector('.hero-hello'));
reducedMotion.addEventListener('change', event => { if (event.matches) stopHello(); });
