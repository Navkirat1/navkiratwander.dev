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

// ===== GitHub live stats =====
async function loadGithubStats() {
  const el = document.getElementById('githubStats');
  try {
    const res = await fetch('https://api.github.com/users/Navkirat1');
    if (!res.ok) throw new Error('bad response');
    const data = await res.json();
    const joined = new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    el.innerHTML = `
      <div class="stat-tile"><span class="stat-value">${data.public_repos}</span><span class="stat-label">Public Repos</span></div>
      <div class="stat-tile"><span class="stat-value">${data.followers}</span><span class="stat-label">Followers</span></div>
      <div class="stat-tile"><span class="stat-value">${joined}</span><span class="stat-label">Member Since</span></div>
    `;
  } catch (e) {
    el.innerHTML = `<div class="stat-tile" style="grid-column: 1 / -1;"><span class="stat-label">Unable to reach the GitHub API right now. <a href="https://github.com/Navkirat1" target="_blank" rel="noopener">View profile directly</a>.</span></div>`;
  }
}
loadGithubStats();

// ===== Certification verification modal =====
const certData = {
  google: {
    name: 'Google Cybersecurity Professional Certificate',
    issuer: 'Google · via Coursera',
    date: 'Issued September 2025',
    description: 'Covers security operations, incident response fundamentals, network defense, and SIEM tools as part of Google\'s professional certificate program.',
    verifyUrl: 'https://coursera.org/share/e64ba846859d13dbc3e5c9b593a7bca1'
  },
  securityplus: {
    name: 'CompTIA Security+',
    issuer: 'CompTIA',
    date: 'Issued October 2025',
    description: 'Validates baseline skills in network security, cryptography, threat management, and identity & access management.',
    verifyUrl: 'https://www.credly.com/badges/406a1339-602c-4643-bfe1-7985be571ee0/public_url'
  }
};

const certModalBackdrop = document.getElementById('certModalBackdrop');
const certModalClose = document.getElementById('certModalClose');

function openCertModal(certId) {
  const cert = certData[certId];
  if (!cert) return;
  if (cert.verifyUrl) {
    window.open(cert.verifyUrl, '_blank', 'noopener');
    return;
  }
  certModalBackdrop.querySelector('#certModalTitle').textContent = cert.name;
  certModalBackdrop.querySelector('.modal-issuer').textContent = `${cert.issuer} · ${cert.date}`;
  certModalBackdrop.querySelector('.modal-desc').textContent = cert.description;
  certModalBackdrop.querySelector('.modal-note').textContent = 'Public verification link coming soon.';
  certModalBackdrop.hidden = false;
}

function closeCertModal() {
  certModalBackdrop.hidden = true;
}

document.querySelectorAll('[data-cert]').forEach(btn => {
  btn.addEventListener('click', () => openCertModal(btn.dataset.cert));
});
certModalClose.addEventListener('click', closeCertModal);
certModalBackdrop.addEventListener('click', (e) => {
  if (e.target === certModalBackdrop) closeCertModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !certModalBackdrop.hidden) closeCertModal();
});

// ===== Interactive terminal =====
const termInput = document.getElementById('termInput');
const termOutput = document.getElementById('termOutput');
const privilegedCommands = ['sudo', 'su', 'root', 'admin'];

const commands = {
  help: () => `Available commands: <span class="mono">about, certs, projects, skills, contact, whoami, clear</span>`,
  whoami: () => `navkirat_wander: BCIS student at UFV, Security+ &amp; Google Cybersecurity certified`,
  about: () => { scrollToSection('about'); return 'Jumping to About...'; },
  certs: () => { scrollToSection('certs'); return 'Jumping to Certifications...'; },
  projects: () => { scrollToSection('projects'); return 'Jumping to Projects...'; },
  skills: () => { scrollToSection('skills'); return 'Jumping to Skills...'; },
  contact: () => { scrollToSection('contact'); return 'Jumping to Contact...'; },
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

  if (privilegedCommands.includes(key)) {
    printLine('Permission Denied: This incident will be reported. Please contact navw604@gmail.com to request elevated access.', 'danger');
  } else {
    const handler = commands[key];
    if (handler) {
      const result = handler();
      if (result) printLine(result);
    } else {
      printLine(`Command not found: ${escapeHtml(raw)}. Type <span class="mono">help</span> to see what's available.`);
    }
  }
  termInput.value = '';
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
