(function(){
	"use strict";

	function qs(selector){ return document.querySelector(selector); }
	function qsa(selector){ return document.querySelectorAll(selector); }

	// Utility
	function randInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }
	function pick(chars){ return chars.charAt(Math.floor(Math.random()*chars.length)); }

	// Year
	function setYear(){
		var yearEl = qs('#year');
		if(yearEl){ yearEl.textContent = String(new Date().getFullYear()); }
	}

	// Cursor glow
	var glow = null;
	function initGlow(){
		glow = qs('#cursor-glow');
		if(!glow){ return; }
		document.addEventListener('pointermove', function(e){
			var x = e.clientX - 210;
			var y = e.clientY - 210;
			glow.style.setProperty('--x', x + 'px');
			glow.style.setProperty('--y', y + 'px');
		});
	}

	// Intro typing
	function initIntro(){
		var intro = qs('#intro');
		var screen = qs('#intro-screen');
		var gifErr = qs('#intro-gif');
		var gifAnon = qs('#intro-gif-anon');
		if(!intro || !screen){ revealContent(); decodeNow(); return; }

		function type(lines, onDone){
			var lineIdx=0, charIdx=0;
			function step(){
				if(lineIdx >= lines.length){ onDone && onDone(); return; }
				var current = lines[lineIdx];
				if(charIdx < current.length){ screen.textContent += current.charAt(charIdx); charIdx++; setTimeout(step, 12 + Math.random()*18); }
				else { screen.textContent += "\n"; lineIdx++; charIdx=0; setTimeout(step, 90); }
			}
			step();
		}

		var lines = ["$ boot bag1-WS","$ init services ... ok","$ open /index.html"];
		type(lines, function(){
			if(gifErr){ gifErr.style.display='block'; }
			setTimeout(function(){
				if(gifErr){ gifErr.style.display='none'; }
				if(gifAnon){ gifAnon.style.display='block'; }
				setTimeout(function(){ intro.classList.add('intro-hide'); setTimeout(function(){ revealContent(); decodeNow(); }, 500); }, 1200);
			}, 1000);
		});
	}

	function revealContent(){
		var targets = qsa('.reveal-target');
		var i; for(i=0;i<targets.length;i++){ targets[i].classList.add('revealed'); }
	}

	// Matrix Rain on Canvas
	var canvas, ctx, width, height, fontSize, columns, drops, charset;
	function initCanvas(){
		canvas = qs('#bg-canvas'); if(!canvas){ return; }
		ctx = canvas.getContext('2d');
		charset = 'アイウエオカキクケコｱｲｳｴｵｶｷｸｹｺABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
		fontSize = 16; resize(); resetDrops(); loop();
		window.addEventListener('resize', function(){ resize(); resetDrops(); });
	}
	function resize(){ width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; ctx.font = fontSize + 'px monospace'; }
	function resetDrops(){ columns = Math.max(1, Math.floor(width / fontSize)); drops = []; var i; for(i=0;i<columns;i++){ drops[i] = Math.floor(Math.random()*(-20)); } }
	function drawMatrix(){
		ctx.fillStyle = 'rgba(0, 5, 0, 0.22)'; ctx.fillRect(0, 0, width, height);
		ctx.save();
		ctx.fillStyle = '#00ff66'; ctx.textBaseline = 'top';
		ctx.shadowColor = 'rgba(0,255,102,0.35)';
		ctx.shadowBlur = 2;
		var i, text, x, y; for(i=0;i<columns;i++){ text = pick(charset); x = i*fontSize; y = drops[i]*fontSize; ctx.fillText(text, x, y); if(y>height && Math.random()>0.975){ drops[i] = Math.floor(Math.random()*(-20)); } else { drops[i] += 1; } }
		ctx.restore();
	}
	function loop(){ drawMatrix(); window.requestAnimationFrame(loop); }

	// Matrix decode logo effect
	function initLogoDecode(){
		var el = qs('.logo-text'); if(!el){ return; }
		var target = el.getAttribute('data-text') || el.textContent || '';
		var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]<>/\\|';
		function decodeOnce(duration){
			var start = Date.now();
			var rafId;
			function tick(){
				var elapsed = Date.now() - start;
				var progress = Math.min(1, elapsed / duration);
				var shown = Math.floor(progress * target.length);
				var out = '';
				var i; for(i=0;i<target.length;i++){
					if(i < shown){ out += target.charAt(i); }
					else { out += pick(chars); }
				}
				el.textContent = out;
				if(progress < 1){ rafId = window.requestAnimationFrame(tick); }
				else { el.textContent = target; if(rafId){ window.cancelAnimationFrame(rafId); } }
			}
			tick();
		}
		// initial appear
		el.textContent = ''.padEnd((target||'').length, ' ');
		decodeOnce(900);
		// hover shuffle
		var hoverTimer;
		function onEnter(){ clearTimeout(hoverTimer); decodeOnce(700); }
		function onLeave(){ hoverTimer = setTimeout(function(){ el.textContent = target; }, 120); }
		el.addEventListener('mouseenter', onEnter);
		el.addEventListener('focus', onEnter);
		el.addEventListener('mouseleave', onLeave);
		el.addEventListener('blur', onLeave);
	}

	// Hacker ASCII and other functions remain ...
	// (initHackerAscii definition is below, unchanged in this edit)

	// Decode effect for headings and texts
	function getDecodeElements(){
		// Все элементы с data-decode + базовые селекторы заголовков/абзацев/ссылок
		var selector = '[data-decode], h1, h2, h3, .hero p, .about p, .feature h3, .site-header nav a';
		var list = qsa(selector);
		return Array.prototype.slice.call(list);
	}
	function initDecode(){
		var elems = getDecodeElements(); if(!elems.length){ return; }
		var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*+-/';
		function run(el){
			var target = el.getAttribute('data-original') || el.textContent;
			if(!el.getAttribute('data-original')){ el.setAttribute('data-original', target); }
			var tmp = target.split('');
			var i = 0; el.classList.add('decoding');
			var timer = setInterval(function(){
				for(var k=0;k<tmp.length;k++){
					if(tmp[k] === ' ' || tmp[k] === '\n'){ continue; }
					if(k < i){ tmp[k] = target.charAt(k); continue; }
					tmp[k] = charset.charAt(Math.floor(Math.random()*charset.length));
				}
				el.textContent = tmp.join('');
				i += 1 + Math.floor(tmp.length/24);
				if(i >= target.length){
					clearInterval(timer);
					el.textContent = target;
					el.classList.remove('decoding');
				}
			}, 26);
		}
		var io = new IntersectionObserver(function(entries){
			for(var j=0;j<entries.length;j++){
				if(entries[j].isIntersecting){ run(entries[j].target); io.unobserve(entries[j].target); }
			}
		}, { threshold: 0.3 });
		for(var m=0;m<elems.length;m++){
			io.observe(elems[m]);
			elems[m].addEventListener('click', function(){ var el=this; el.classList.remove('decoding'); el.classList.add('vibe'); setTimeout(function(){ el.classList.remove('vibe'); }, 160); run(el); });
		}
	}
	function decodeNow(){
		var elems = getDecodeElements(); if(!elems.length){ return; }
		var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*+-/';
		function runImmediate(el){
			var target = el.getAttribute('data-original') || el.textContent;
			if(!el.getAttribute('data-original')){ el.setAttribute('data-original', target); }
			var tmp = target.split('');
			var i = 0; el.classList.add('decoding');
			var timer = setInterval(function(){
				for(var k=0;k<tmp.length;k++){
					if(tmp[k] === ' ' || tmp[k] === '\n'){ continue; }
					if(k < i){ tmp[k] = target.charAt(k); continue; }
					tmp[k] = charset.charAt(Math.floor(Math.random()*charset.length));
				}
				el.textContent = tmp.join('');
				i += 1 + Math.floor(tmp.length/22);
				if(i >= target.length){ clearInterval(timer); el.textContent = target; el.classList.remove('decoding'); }
			}, 22);
		}
		for(var n=0;n<elems.length;n++){ runImmediate(elems[n]); }
	}

	// initHackerAscii (disabled)
	function initHackerAscii(){ /* disabled: replaced with GIF in about section */ }

	document.addEventListener('DOMContentLoaded', function(){
		setYear();
		initGlow();
		initIntro();
		initCanvas();
		initParallax();
		initTilt();
		initLogoDecode();
		initHackerAscii();
		initDecode();
		var mt = qs('#menu-toggle'); var navWrap = qs('.nav'); if(mt && navWrap){ mt.addEventListener('click', function(){ navWrap.classList.toggle('open'); }); }
	});

	// Parallax
	function initParallax(){
		var elems = qsa('[data-parallax-depth]'); if(!elems.length){ return; }
		document.addEventListener('pointermove', function(e){
			var cx = window.innerWidth/2, cy = window.innerHeight/2;
			var dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
			var i; for(i=0;i<elems.length;i++){
				var el = elems[i]; var depth = Number(el.getAttribute('data-parallax-depth') || '10');
				el.style.transform = 'translate3d(' + (dx*depth) + 'px,' + (dy*depth) + 'px,0)';
			}
		});
	}

	// Tilt cards
	function initTilt(){
		var cards = qsa('.tilt'); if(!cards.length){ return; }
		function onMove(e){ var rect = this.getBoundingClientRect(); var px = (e.clientX - rect.left)/rect.width - 0.5; var py = (e.clientY - rect.top)/rect.height - 0.5; var rx = py*-10, ry = px*14; this.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(0)'; }
		function onLeave(){ this.style.transform = 'rotateX(0) rotateY(0)'; }
		var i; for(i=0;i<cards.length;i++){ var c = cards[i]; c.addEventListener('pointermove', onMove); c.addEventListener('pointerleave', onLeave); c.addEventListener('blur', onLeave); }
	}
})();

