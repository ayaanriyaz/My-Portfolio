/*
	script.js
	Consolidated local JS for the portfolio. Features:
	- Navbar mobile toggle and active link highlight
	- Typing animation
	- Canvas particle background
	- Canvas-based 3D-like glowing orb mascot that reacts to cursor
	- Skills progress animation
	- Simple scroll reveal (no external libs)
	- Resume modal view + download
	- Contact form stub (no backend) and WhatsApp link
	- Back-to-top button
	- Theme toggle (light/dark)

	All code is vanilla JS and runs without external libraries.
*/

document.addEventListener('DOMContentLoaded', () => {
	initTodo();
	initNavbar();
	initTyping();
	initParticlesCanvas();
	initMascotCanvas();
	initSkillBars();
	initScrollReveal();
	initResumeModal();
	initContactForm();
	initBackToTop();
	initThemeToggle();
	// Safety: ensure main sections are visible in case CSS initially hid them
	['about','skills','projects','certifications','resume','contact'].forEach(id=>{
		const el = document.getElementById(id);
		if(el) el.classList.add('revealed');
	});
});

function initTodo(){
	// placeholder to match earlier todo list step in UI if needed
}

/* NAVBAR */
function initNavbar(){
	const hamburger = document.querySelector('.hamburger');
	const navLinks = document.querySelector('.nav-links');
	const navItems = document.querySelectorAll('.nav-links a');

	if(hamburger){
		hamburger.addEventListener('click', ()=>{
			hamburger.classList.toggle('active');
			navLinks.classList.toggle('active');
		});
	}

	navItems.forEach(item=>{
		item.addEventListener('click', ()=>{
			hamburger.classList.remove('active');
			navLinks.classList.remove('active');
		});
	});

	// Active link on scroll
	window.addEventListener('scroll', ()=>{
		let current = '';
		document.querySelectorAll('section[id]').forEach(section=>{
			const top = section.offsetTop - 100;
			const bottom = top + section.offsetHeight;
			if(window.pageYOffset >= top && window.pageYOffset <= bottom){
				current = section.getAttribute('id');
			}
		});
		navItems.forEach(a=>{
			a.classList.toggle('active', a.getAttribute('href').slice(1) === current);
		});
	});
}

/* TYPING */
function initTyping(){
	const el = document.getElementById('typed-text');
	if(!el) return;
	const phrases = [
		"a passionate Web Developer",
		"a Tech Enthusiast",
		"a CodeSoft Intern"
	];
	let i=0, j=0, deleting=false;
	function tick(){
		const full = phrases[i];
		if(!deleting){
			el.textContent = full.slice(0, j+1);
			j++;
			if(j===full.length){
				deleting = true; setTimeout(tick, 1200); return;
			}
		} else {
			el.textContent = full.slice(0, j-1);
			j--;
			if(j===0){ deleting=false; i=(i+1)%phrases.length; }
		}
		setTimeout(tick, deleting?40:80);
	}
	tick();
}

/* PARTICLES CANVAS */
function initParticlesCanvas(){
	const container = document.getElementById('particles-js');
	if(!container) return;
	container.style.position='absolute';
	container.style.top='0'; container.style.left='0';
	container.style.width='100%'; container.style.height='100%';
	container.style.zIndex='0';

	const cvs = document.createElement('canvas');
	cvs.style.width='100%'; cvs.style.height='100%';
	container.appendChild(cvs);
	const ctx = cvs.getContext('2d');
	let w,h,particles=[];
	function onResize(){
		w = cvs.width = container.clientWidth || window.innerWidth;
		h = cvs.height = container.clientHeight || window.innerHeight;
	}
	window.addEventListener('resize', onResize); onResize();

	function rand(min,max){ return Math.random()*(max-min)+min; }
	for(let i=0;i<90;i++) particles.push({x:rand(0,w), y:rand(0,h), vx:rand(-0.3,0.3), vy:rand(-0.3,0.3), r:rand(0.8,2.6)});

	function draw(){
		ctx.clearRect(0,0,w,h);
		// soft gradient background overlay
		const g = ctx.createLinearGradient(0,0,w,h);
		g.addColorStop(0,'rgba(0,238,255,0.03)'); g.addColorStop(1,'rgba(157,78,221,0.02)');
		ctx.fillStyle = g; ctx.fillRect(0,0,w,h);

		ctx.strokeStyle='rgba(0,238,255,0.06)';
		for(let i=0;i<particles.length;i++){
			const p = particles[i];
			p.x += p.vx; p.y += p.vy;
			if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1;
			ctx.beginPath(); ctx.fillStyle='rgba(0,238,255,0.9)'; ctx.globalAlpha=0.7; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
		}
		// draw lines
		for(let i=0;i<particles.length;i++){
			for(let j=i+1;j<particles.length;j++){
				const a=particles[i], b=particles[j]; const dx=a.x-b.x, dy=a.y-b.y; const d=Math.hypot(dx,dy);
				if(d<120){ ctx.globalAlpha = 0.06*(1 - d/120); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
			}
		}
		ctx.globalAlpha=1;
		requestAnimationFrame(draw);
	}
	draw();
}

/* MASCOT CANVAS - floating glowing orb that follows cursor */
function initMascotCanvas(){
	const container = document.getElementById('mascot-container');
	if(!container) return;
	container.style.position='absolute'; container.style.right='8%'; container.style.bottom='8%';
	container.style.width='320px'; container.style.height='320px'; container.style.zIndex='2';
	const cvs = document.createElement('canvas'); container.appendChild(cvs);
	const ctx = cvs.getContext('2d'); let w,h; function resize(){ w=cvs.width=container.clientWidth; h=cvs.height=container.clientHeight; }
	window.addEventListener('resize', resize); resize();

	const orb = {x:w/2,y:h/2,tx:w/2,ty:h/2,r:60};
	let mouse = {x:w/2,y:h/2,active:false};
	container.addEventListener('mousemove', (e)=>{ const rect=container.getBoundingClientRect(); mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top; mouse.active=true; });
	container.addEventListener('mouseleave', ()=>{ mouse.active=false; });

	function draw(){
		ctx.clearRect(0,0,w,h);
		// subtle background
		const g = ctx.createLinearGradient(0,0,w,h); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,0)');
		ctx.fillStyle=g; ctx.fillRect(0,0,w,h);

		// update target
		if(mouse.active){ orb.tx = mouse.x; orb.ty = mouse.y; } else { orb.tx = w/2; orb.ty = h/2; }
		orb.x += (orb.tx - orb.x) * 0.06; orb.y += (orb.ty - orb.y) * 0.06;

		// floating bob
		const t = Date.now()*0.002;
		const bob = Math.sin(t)*6;

		// glow layers
		for(let i=8;i>0;i--){ ctx.beginPath(); const ir = orb.r + i*6; ctx.fillStyle = `rgba(0,238,255,${0.03*i})`; ctx.arc(orb.x, orb.y + bob, ir, 0, Math.PI*2); ctx.fill(); }

		// core orb
		const coreGrad = ctx.createRadialGradient(orb.x-20, orb.y-10 + bob, 10, orb.x, orb.y + bob, orb.r);
		coreGrad.addColorStop(0,'#ffffff'); coreGrad.addColorStop(0.15,'#bfffff'); coreGrad.addColorStop(0.5,'#00eeff'); coreGrad.addColorStop(1,'#0077aa');
		ctx.beginPath(); ctx.fillStyle=coreGrad; ctx.arc(orb.x, orb.y + bob, orb.r,0,Math.PI*2); ctx.fill();

		// subtle ring
		ctx.beginPath(); ctx.lineWidth=2; ctx.strokeStyle='rgba(157,78,221,0.6)'; ctx.arc(orb.x, orb.y + bob, orb.r+12,0,Math.PI*2); ctx.stroke();

		// small orbiting satellites
		for(let k=0;k<3;k++){ const a = t*0.8 + k*2; const sx = orb.x + Math.cos(a)*(orb.r+22); const sy = orb.y + Math.sin(a)*(orb.r+14)+bob; ctx.beginPath(); ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.arc(sx,sy,6,0,Math.PI*2); ctx.fill(); }

		requestAnimationFrame(draw);
	}
	draw();
}

/* SKILL BARS */
function initSkillBars(){
	const bars = document.querySelectorAll('.skill-progress');
	if(!bars.length) return;
	function animate(){
		const triggerPoint = window.innerHeight * 0.8;
		const el = document.querySelector('.skills-section');
		if(!el) return;
		const top = el.getBoundingClientRect().top;
		if(top < triggerPoint){
			bars.forEach(b=>{ const v = b.getAttribute('data-progress')||b.dataset.value||60; b.style.width = v + '%'; });
			window.removeEventListener('scroll', animate);
		}
	}
	window.addEventListener('scroll', animate); animate();
}

/* SIMPLE SCROLL REVEAL */
function initScrollReveal(){
	const revealEls = document.querySelectorAll('.about-section, .project-card, .cert-card, .resume-container, .contact-section');
	function reveal(){
		revealEls.forEach(el=>{
			const rect = el.getBoundingClientRect();
			if(rect.top < window.innerHeight - 80){ el.classList.add('revealed'); }
		});
	}
	window.addEventListener('scroll', reveal); reveal();
}

/* RESUME MODAL */
function initResumeModal(){
	const viewBtn = document.getElementById('viewResume');
	if(!viewBtn) return;
	viewBtn.addEventListener('click', ()=>{
		const src = viewBtn.dataset.src || viewBtn.getAttribute('data-src') || 'assets/resume/Ayaan_Riyaz_Resume.pdf';
		const modal = document.createElement('div'); modal.className='modal modal-open';
		modal.innerHTML = `<div class="modal-inner"><button class="modal-close" aria-label="Close">×</button><iframe src="${src}" frameborder="0"></iframe></div>`;
		document.body.appendChild(modal);
		document.body.style.overflow='hidden';
		modal.querySelector('.modal-close').addEventListener('click', ()=>{ modal.remove(); document.body.style.overflow=''; });
		modal.addEventListener('click', (e)=>{ if(e.target===modal){ modal.remove(); document.body.style.overflow=''; } });
	});
}

/* CONTACT FORM */
function initContactForm(){
	const form = document.getElementById('contactForm'); if(!form) return;
	form.addEventListener('submit', (e)=>{
		e.preventDefault();
		const name = form.querySelector('[name=name]').value || form.querySelector('#name')?.value || '';
		const email = form.querySelector('[name=email]').value || form.querySelector('#email')?.value || '';
		const message = form.querySelector('[name=message]').value || form.querySelector('#message')?.value || '';
		// Show a friendly message - no backend in this project
		const note = `Thanks ${name || 'there'}! Your message was prepared to be sent. (No backend configured)`;
		alert(note);
		form.reset();
	});
}

/* BACK TO TOP */
function initBackToTop(){
	const btn = document.getElementById('backToTop'); if(!btn) return;
	window.addEventListener('scroll', ()=>{ btn.classList.toggle('active', window.pageYOffset > 300); });
	btn.addEventListener('click', ()=>{ window.scrollTo({top:0, behavior:'smooth'}); });
}

/* THEME TOGGLE */
function initThemeToggle(){
	const btn = document.getElementById('themeToggle'); if(!btn) return;
	const root = document.documentElement;
	const saved = localStorage.getItem('theme') || 'dark';
	setTheme(saved);
	btn.addEventListener('click', ()=>{ const next = root.classList.contains('light')? 'dark':'light'; setTheme(next); });
	function setTheme(t){ if(t==='light'){ root.classList.add('light'); btn.textContent='🌞'; } else { root.classList.remove('light'); btn.textContent='🌙'; } localStorage.setItem('theme', t); }
}

