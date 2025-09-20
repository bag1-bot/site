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

<<<<<<< HEAD
	// Interactive background effects
	var particlesContainer, magneticField, isMouseMoving = false, mouseTimer, customCursor, audioContext, cursorTrails = [], bgMusic;
	
	function initInteractiveBackground(){
		particlesContainer = qs('#interactive-particles');
		magneticField = qs('#magnetic-field');
		customCursor = qs('#custom-cursor');
		
		if(!particlesContainer || !magneticField){ return; }
		
		// Initialize custom cursor
		initCustomCursor();
		
		// Initialize audio context for sound effects
		initAudioEffects();
		
		// Initialize background music
		initBackgroundMusic();
		
		// Mouse movement tracking
		document.addEventListener('pointermove', function(e){
			isMouseMoving = true;
			clearTimeout(mouseTimer);
			mouseTimer = setTimeout(function(){ isMouseMoving = false; }, 100);
			
			// Create particles on mouse move
			if(Math.random() > 0.7){ createParticle(e.clientX, e.clientY); }
			
			// Create cursor trail
			createCursorTrail(e.clientX, e.clientY);
			
			// Create Matrix symbols
			if(Math.random() > 0.8){ 
				createMatrixSymbol(e.clientX, e.clientY);
				playMatrixSound();
			}
			
			// Update magnetic field
			updateMagneticField(e.clientX, e.clientY);
		});
		
		// Click ripple effect
		document.addEventListener('click', function(e){
			createRipple(e.clientX, e.clientY);
			createDataStream(e.clientX, e.clientY);
			playClickSound();
			playMysteriousSound();
		});
		
		// Hover effects on interactive elements
		initHoverEffects();
		
		// Continuous particle generation
		setInterval(function(){
			if(!isMouseMoving && Math.random() > 0.8){
				createParticle(
					Math.random() * window.innerWidth,
					Math.random() * window.innerHeight
				);
			}
		}, 2000);
	}
	
	function createParticle(x, y){
		var particle = document.createElement('div');
		particle.className = 'particle';
		particle.style.left = x + 'px';
		particle.style.top = y + 'px';
		particle.style.animationDelay = Math.random() * 2 + 's';
		particlesContainer.appendChild(particle);
		
		setTimeout(function(){
			if(particle.parentNode){ particle.parentNode.removeChild(particle); }
		}, 3000);
	}
	
	function createRipple(x, y){
		var ripple = document.createElement('div');
		ripple.className = 'ripple';
		ripple.style.position = 'fixed';
		ripple.style.left = (x - 20) + 'px';
		ripple.style.top = (y - 20) + 'px';
		ripple.style.width = '40px';
		ripple.style.height = '40px';
		ripple.style.zIndex = '9998';
		document.body.appendChild(ripple);
		
		setTimeout(function(){
			if(ripple.parentNode){ ripple.parentNode.removeChild(ripple); }
		}, 1200);
	}
	
	function initCustomCursor(){
		if(!customCursor){ return; }
		
		document.addEventListener('pointermove', function(e){
			customCursor.style.left = e.clientX + 'px';
			customCursor.style.top = e.clientY + 'px';
		});
		
		// Cursor interactions with elements
		var interactiveElements = qsa('.btn, .feature, .dev-card, .ascii-card, nav a, a');
		for(var i = 0; i < interactiveElements.length; i++){
			var el = interactiveElements[i];
			
			el.addEventListener('mouseenter', function(){
				customCursor.style.transform = 'scale(1.3)';
				customCursor.style.filter = 'drop-shadow(0 0 6px var(--accent))';
				playHoverSound();
				playDigitalWhisper();
			});
			
			el.addEventListener('mouseleave', function(){
				customCursor.style.transform = 'scale(1)';
				customCursor.style.filter = 'drop-shadow(0 0 3px var(--accent))';
			});
		}
	}
	
	function createDataStream(x, y){
		var stream = document.createElement('div');
		stream.className = 'data-stream';
		stream.textContent = pick('01') + pick('01') + pick('01') + pick('01');
		stream.style.position = 'fixed';
		stream.style.left = x + 'px';
		stream.style.top = y + 'px';
		stream.style.zIndex = '9998';
		document.body.appendChild(stream);
		
		setTimeout(function(){
			if(stream.parentNode){ stream.parentNode.removeChild(stream); }
		}, 2000);
	}
	
	function createCursorTrail(x, y){
		var trail = document.createElement('div');
		trail.className = 'cursor-trail';
		trail.style.position = 'fixed';
		trail.style.left = x + 'px';
		trail.style.top = y + 'px';
		trail.style.zIndex = '9998';
		document.body.appendChild(trail);
		
		cursorTrails.push(trail);
		if(cursorTrails.length > 10){
			var oldTrail = cursorTrails.shift();
			if(oldTrail.parentNode){ oldTrail.parentNode.removeChild(oldTrail); }
		}
		
		setTimeout(function(){
			if(trail.parentNode){ trail.parentNode.removeChild(trail); }
		}, 500);
	}
	
	function createMatrixSymbol(x, y){
		var symbol = document.createElement('div');
		symbol.className = 'matrix-symbol';
		symbol.textContent = pick('アイウエオカキクケコｱｲｳｴｵｶｷｸｹｺABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&');
		symbol.style.position = 'fixed';
		symbol.style.left = x + 'px';
		symbol.style.top = y + 'px';
		symbol.style.zIndex = '9998';
		document.body.appendChild(symbol);
		
		setTimeout(function(){
			if(symbol.parentNode){ symbol.parentNode.removeChild(symbol); }
		}, 2000);
	}
	
	function initAudioEffects(){
		try{
			audioContext = new (window.AudioContext || window.webkitAudioContext)();
		} catch(e){
			// Audio context not supported
			return;
		}
	}
	
	function playClickSound(){
		if(!audioContext){ return; }
		
		// Mysterious hacker click: deep digital pulse
		var oscillator = audioContext.createOscillator();
		var gainNode = audioContext.createGain();
		var filter = audioContext.createBiquadFilter();
		
		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(180, audioContext.currentTime);
		oscillator.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + 0.3);
		
		filter.type = 'lowpass';
		filter.frequency.setValueAtTime(400, audioContext.currentTime);
		filter.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
		filter.Q.setValueAtTime(2, audioContext.currentTime);
		
		oscillator.connect(filter);
		filter.connect(gainNode);
		gainNode.connect(audioContext.destination);
		
		gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
		
		oscillator.start(audioContext.currentTime);
		oscillator.stop(audioContext.currentTime + 0.3);
	}
	
	function playHoverSound(){
		if(!audioContext){ return; }
		
		// Mysterious hover: subtle digital whisper
		var oscillator = audioContext.createOscillator();
		var gainNode = audioContext.createGain();
		var filter = audioContext.createBiquadFilter();
		
		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
		oscillator.frequency.linearRampToValueAtTime(280, audioContext.currentTime + 0.15);
		
		filter.type = 'lowpass';
		filter.frequency.setValueAtTime(600, audioContext.currentTime);
		filter.Q.setValueAtTime(1.5, audioContext.currentTime);
		
		oscillator.connect(filter);
		filter.connect(gainNode);
		gainNode.connect(audioContext.destination);
		
		gainNode.gain.setValueAtTime(0.04, audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
		
		oscillator.start(audioContext.currentTime);
		oscillator.stop(audioContext.currentTime + 0.15);
	}
	
	function playMatrixSound(){
		if(!audioContext){ return; }
		
		// Mysterious Matrix: deep digital resonance
		var oscillator = audioContext.createOscillator();
		var gainNode = audioContext.createGain();
		var filter = audioContext.createBiquadFilter();
		
		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
		oscillator.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 0.2);
		
		filter.type = 'lowpass';
		filter.frequency.setValueAtTime(300, audioContext.currentTime);
		filter.Q.setValueAtTime(3, audioContext.currentTime);
		
		oscillator.connect(filter);
		filter.connect(gainNode);
		gainNode.connect(audioContext.destination);
		
		gainNode.gain.setValueAtTime(0.06, audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
		
		oscillator.start(audioContext.currentTime);
		oscillator.stop(audioContext.currentTime + 0.2);
	}
	
	function playMysteriousSound(){
		if(!audioContext){ return; }
		
		// Deep mysterious digital hum
		var oscillator = audioContext.createOscillator();
		var gainNode = audioContext.createGain();
		var filter = audioContext.createBiquadFilter();
		
		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
		oscillator.frequency.linearRampToValueAtTime(120, audioContext.currentTime + 0.4);
		
		filter.type = 'lowpass';
		filter.frequency.setValueAtTime(200, audioContext.currentTime);
		filter.Q.setValueAtTime(2, audioContext.currentTime);
		
		oscillator.connect(filter);
		filter.connect(gainNode);
		gainNode.connect(audioContext.destination);
		
		gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
		
		oscillator.start(audioContext.currentTime);
		oscillator.stop(audioContext.currentTime + 0.4);
	}
	
	function playDigitalWhisper(){
		if(!audioContext){ return; }
		
		// Subtle digital whisper
		var oscillator = audioContext.createOscillator();
		var gainNode = audioContext.createGain();
		var filter = audioContext.createBiquadFilter();
		
		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
		oscillator.frequency.linearRampToValueAtTime(250, audioContext.currentTime + 0.1);
		
		filter.type = 'lowpass';
		filter.frequency.setValueAtTime(500, audioContext.currentTime);
		filter.Q.setValueAtTime(1, audioContext.currentTime);
		
		oscillator.connect(filter);
		filter.connect(gainNode);
		gainNode.connect(audioContext.destination);
		
		gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
		
		oscillator.start(audioContext.currentTime);
		oscillator.stop(audioContext.currentTime + 0.1);
	}
	
	function initBackgroundMusic(){
		bgMusic = qs('#bg-music');
		if(!bgMusic){ return; }
		
		// Set volume to 20%
		bgMusic.volume = 0.2;
		
		// Check if music was already playing on previous page
		var wasPlaying = sessionStorage.getItem('bgMusicPlaying') === 'true';
		var currentTime = parseFloat(sessionStorage.getItem('bgMusicTime') || '0');
		
		// If music was playing, continue from where it left off
		if(wasPlaying && currentTime > 0){
			bgMusic.currentTime = currentTime;
			// Small delay to ensure audio is ready
			setTimeout(function(){
				bgMusic.play().catch(function(e){
					console.log('Background music resume prevented:', e);
				});
			}, 100);
		}
		
		// Auto-play after user interaction (browser requirement)
		document.addEventListener('click', function(){
			if(bgMusic.paused){
				bgMusic.play().catch(function(e){
					console.log('Background music autoplay prevented:', e);
				});
			}
		}, { once: true });
		
		// Also try to play on any user interaction
		document.addEventListener('pointermove', function(){
			if(bgMusic.paused){
				bgMusic.play().catch(function(e){
					console.log('Background music autoplay prevented:', e);
				});
			}
		}, { once: true });
		
		// Save music state before page unload
		window.addEventListener('beforeunload', function(){
			sessionStorage.setItem('bgMusicPlaying', !bgMusic.paused);
			sessionStorage.setItem('bgMusicTime', bgMusic.currentTime.toString());
		});
		
		// Update music state periodically
		setInterval(function(){
			if(!bgMusic.paused){
				sessionStorage.setItem('bgMusicPlaying', 'true');
				sessionStorage.setItem('bgMusicTime', bgMusic.currentTime.toString());
			}
		}, 1000);
		
		// Handle page visibility changes (tab switching)
		document.addEventListener('visibilitychange', function(){
			if(document.hidden){
				// Page is hidden, save current state
				sessionStorage.setItem('bgMusicPlaying', !bgMusic.paused);
				sessionStorage.setItem('bgMusicTime', bgMusic.currentTime.toString());
			} else {
				// Page is visible again, check if we should resume
				var wasPlaying = sessionStorage.getItem('bgMusicPlaying') === 'true';
				if(wasPlaying && bgMusic.paused){
					bgMusic.play().catch(function(e){
						console.log('Background music resume on visibility change prevented:', e);
					});
				}
			}
		});
		
		// Handle audio context suspension
		document.addEventListener('click', function(){
			if(audioContext && audioContext.state === 'suspended'){
				audioContext.resume();
			}
		});
	}
	
	function updateMagneticField(x, y){
		magneticField.style.opacity = '1';
		magneticField.style.background = 'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(0,255,102,0.1), transparent 300px)';
		
		// Create magnetic lines
		if(Math.random() > 0.9){ createMagneticLine(x, y); }
	}
	
	function createMagneticLine(x, y){
		var line = document.createElement('div');
		line.className = 'magnetic-line';
		line.style.left = (x - 100) + 'px';
		line.style.top = y + 'px';
		line.style.width = '200px';
		line.style.animationDelay = Math.random() * 2 + 's';
		magneticField.appendChild(line);
		
		setTimeout(function(){
			if(line.parentNode){ line.parentNode.removeChild(line); }
		}, 2000);
	}
	
	function initHoverEffects(){
		var interactiveElements = qsa('.btn, .feature, .dev-card, .ascii-card, nav a');
		for(var i = 0; i < interactiveElements.length; i++){
			var el = interactiveElements[i];
			
			el.addEventListener('mouseenter', function(e){
				createGlowZone(e.target);
				playHoverSound();
			});
			
			el.addEventListener('mouseleave', function(e){
				removeGlowZone(e.target);
			});
		}
	}
	
	function createGlowZone(element){
		var rect = element.getBoundingClientRect();
		var glowZone = document.createElement('div');
		glowZone.className = 'glow-zone';
		glowZone.style.left = (rect.left + rect.width/2 - 50) + 'px';
		glowZone.style.top = (rect.top + rect.height/2 - 50) + 'px';
		glowZone.style.width = '100px';
		glowZone.style.height = '100px';
		glowZone.dataset.target = 'true';
		document.body.appendChild(glowZone);
		
		setTimeout(function(){ glowZone.classList.add('active'); }, 10);
	}
	
	function removeGlowZone(element){
		var glowZones = qsa('.glow-zone[data-target="true"]');
		for(var i = 0; i < glowZones.length; i++){
			glowZones[i].classList.remove('active');
			setTimeout(function(zone){
				return function(){
					if(zone.parentNode){ zone.parentNode.removeChild(zone); }
				};
			}(glowZones[i]), 400);
		}
	}

=======
>>>>>>> d3c39cbd6112ea821d4b9c7dffdc327cb6f6c68f
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
<<<<<<< HEAD
		initInteractiveBackground();
=======
>>>>>>> d3c39cbd6112ea821d4b9c7dffdc327cb6f6c68f
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

