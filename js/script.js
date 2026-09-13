// ===== Year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Nav toggle (mobile) =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== Reveal on scroll =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ===== Hero typewriter =====
const heroLines = [
  { type: 'ln', text: '$ whoami' },
  { type: 'out', text: 'navkirat_wander — cybersecurity student & builder' },
  { type: 'ln', text: '$ cat status.txt' },
  { type: 'out', text: 'pursuing b.cis @ university of the fraser valley' },
  { type: 'ln', text: '$ certifications --list' },
  { type: 'out', text: 'google cybersecurity professional | comptia security+' },
  { type: 'ln', text: '$ _' },
];

async function typeHero() {
  const el = document.getElementById('heroTyped');
  for (const line of heroLines) {
    const span = document.createElement('span');
    span.className = line.type;
    el.appendChild(span);
    if (line.text === '$ _') {
      span.textContent = line.text;
      break;
    }
    for (const ch of line.text) {
      span.textContent += ch;
      await sleep(line.type === 'ln' ? 26 : 14);
    }
    el.appendChild(document.createElement('br'));
    await sleep(180);
  }
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
typeHero();

// ===== GitHub live stats =====
async function loadGithubStats() {
  const el = document.getElementById('githubStats');
  try {
    const res = await fetch('https://api.github.com/users/Navkirat1');
    if (!res.ok) throw new Error('bad response');
    const data = await res.json();
    const joined = new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    el.innerHTML = `<span class="ln">$ curl -s api.github.com/users/Navkirat1</span><span class="out">login: <span class="accent">${data.login}</span></span><span class="out">public_repos: <span class="accent">${data.public_repos}</span></span><span class="out">followers: <span class="accent">${data.followers}</span></span><span class="out">member_since: <span class="accent">${joined}</span></span><span class="ln">$ _</span>`;
  } catch (e) {
    el.innerHTML = `<span class="ln">$ curl -s api.github.com/users/Navkirat1</span><span class="out">unable to reach github api right now — <a href="https://github.com/Navkirat1" target="_blank" rel="noopener">view profile directly</a></span><span class="ln">$ _</span>`;
  }
}
loadGithubStats();

// ===== Interactive terminal =====
const termInput = document.getElementById('termInput');
const termOutput = document.getElementById('termOutput');

const commands = {
  help: () => `available commands: <span class="accent">about, certs, projects, skills, contact, whoami, sudo, clear</span>`,
  whoami: () => `navkirat_wander — b.cis student, ufv | security+ &amp; google cybersecurity certified`,
  about: () => { scrollToSection('about'); return 'jumping to about...'; },
  certs: () => { scrollToSection('certs'); return 'jumping to certifications...'; },
  projects: () => { scrollToSection('projects'); return 'jumping to projects...'; },
  skills: () => { scrollToSection('skills'); return 'jumping to skills...'; },
  contact: () => { scrollToSection('contact'); return 'jumping to contact...'; },
  sudo: () => `nice try. permission denied — but feel free to just <a href="mailto:navw604@gmail.com">email me</a>.`,
  clear: () => { termOutput.innerHTML = ''; return null; },
};

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function printLine(html, cls) {
  const div = document.createElement('span');
  div.className = cls || 'out';
  div.innerHTML = html;
  termOutput.appendChild(div);
  termOutput.scrollTop = termOutput.scrollHeight;
}

termInput.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const raw = termInput.value.trim();
  if (!raw) return;
  printLine(`guest@navkiratwander.dev:~$ ${escapeHtml(raw)}`, 'cmd');
  const key = raw.toLowerCase().split(' ')[0];
  const handler = commands[key];
  if (handler) {
    const result = handler();
    if (result) printLine(result);
  } else {
    printLine(`command not found: ${escapeHtml(raw)} — type <span class="accent">help</span>`);
  }
  termInput.value = '';
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
