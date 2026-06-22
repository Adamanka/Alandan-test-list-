// =========================================================
// AOS ИНИЦИАЛИЗАЦИЯ
// =========================================================
AOS.init({
    duration: 800,
    once: false,
    offset: 100,
    mirror: true,
    easing: 'ease-out'
});

// =========================================================
// АНИМИРОВАННЫЕ СЧЁТЧИКИ
// =========================================================
function animateCounters() {
    document.querySelectorAll('.hero-stat').forEach(function(stat) {
        var target = parseInt(stat.getAttribute('data-count'));
        var numberEl = stat.querySelector('.stat-num');
        if (!numberEl) return;
        var current = 0;
        var increment = Math.ceil(target / 60);
        
        var timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            if (target >= 1000) {
                numberEl.textContent = current + '+';
            } else {
                numberEl.textContent = current;
            }
        }, 30);
    });
}

// =========================================================
// ЗАПУСК СЧЁТЧИКОВ ПРИ ЗАГРУЗКЕ
// =========================================================
window.addEventListener('load', function() {
    setTimeout(animateCounters, 500);
});

// =========================================================
// ОТКРЫТИЕ СТРАНИЦЫ КОМАНДЫ
// =========================================================
function openTeam(teamName) {
    // Закрываем все открытые страницы
    document.querySelectorAll('.team-page').forEach(function(el) {
        el.classList.remove('active');
    });
    document.querySelectorAll('.team-page-overlay').forEach(function(el) {
        el.classList.remove('active');
    });
    
    // Открываем нужную страницу
    var page = document.getElementById('team-' + teamName);
    var overlay = document.getElementById('team-' + teamName + '-overlay');
    
    if (page) {
        page.classList.add('active');
        document.body.style.overflow = 'hidden';
        page.scrollTop = 0;
    }
    if (overlay) {
        overlay.classList.add('active');
    }
}

// =========================================================
// ЗАКРЫТИЕ СТРАНИЦЫ КОМАНДЫ
// =========================================================
function closeTeam(teamName) {
    var page = document.getElementById('team-' + teamName);
    var overlay = document.getElementById('team-' + teamName + '-overlay');
    
    if (page) page.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// =========================================================
// ЗАКРЫТИЕ ПО ESC
// =========================================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.team-page.active').forEach(function(el) {
            el.classList.remove('active');
        });
        document.querySelectorAll('.team-page-overlay.active').forEach(function(el) {
            el.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});

// =========================================================
// МОБИЛЬНОЕ МЕНЮ
// =========================================================
var navToggle = document.getElementById('navToggle');
var navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-menu a').forEach(function(link) {
    link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// =========================================================
// ПЛАВНЫЙ СКРОЛЛ ДЛЯ ЯКОРЕЙ
// =========================================================
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        // Проверяем, не является ли ссылка внутри страницы команды
        var parentPage = this.closest('.team-page');
        if (parentPage) {
            var target = parentPage.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }
        
        var target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            // Закрываем все страницы команд
            document.querySelectorAll('.team-page').forEach(function(el) {
                el.classList.remove('active');
            });
            document.querySelectorAll('.team-page-overlay').forEach(function(el) {
                el.classList.remove('active');
            });
            document.body.style.overflow = '';
            
            setTimeout(function() {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    });
});

// =========================================================
// СОЗДАНИЕ ПАРЯЩИХ ЧАСТИЦ
// =========================================================
function createParticles() {
    var container = document.getElementById('particles-container');
    if (!container) return;
    
    for (var i = 0; i < 30; i++) {
        var particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 3 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 20) + 's';
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        container.appendChild(particle);
    }
}

createParticles();

// =========================================================
// 3D ФОН (Three.js)
// =========================================================
var container = document.getElementById('three-canvas');

if (container) {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    var shapes = [
        { geo: new THREE.TorusKnotGeometry(2, 0.8, 100, 16), color: 0xcc0000, emissive: 0xff0000, speed: { x: 0.005, y: 0.01 } },
        { geo: new THREE.SphereGeometry(1.8, 32, 32), color: 0xffd700, emissive: 0xff6b00, speed: { x: 0.01, y: 0.005 } },
        { geo: new THREE.BoxGeometry(2.5, 2.5, 2.5), color: 0x0066ff, emissive: 0x0044cc, speed: { x: 0.008, y: 0.008 } },
        { geo: new THREE.IcosahedronGeometry(2, 1), color: 0x00cc00, emissive: 0x008800, speed: { x: 0.007, y: 0.009 } },
        { geo: new THREE.TorusGeometry(1.8, 0.6, 16, 100), color: 0x9900ff, emissive: 0x6600cc, speed: { x: 0.01, y: 0.01 } },
        { geo: new THREE.ConeGeometry(1.8, 3, 32), color: 0xff6b00, emissive: 0xcc4400, speed: { x: 0.006, y: 0.012 } },
        { geo: new THREE.DodecahedronGeometry(2), color: 0xff0066, emissive: 0xcc0044, speed: { x: 0.009, y: 0.007 } },
        { geo: new THREE.OctahedronGeometry(2.2), color: 0x00ccff, emissive: 0x0088cc, speed: { x: 0.008, y: 0.006 } },
        { geo: new THREE.TorusKnotGeometry(2, 0.4, 64, 8, 2, 3), color: 0xffffff, emissive: 0x888888, speed: { x: 0.01, y: 0.01 } },
        { geo: new THREE.TorusKnotGeometry(2, 0.6, 100, 16, 3, 4), color: 0xffff00, emissive: 0xccaa00, speed: { x: 0.007, y: 0.013 } }
    ];

    var currentIndex = 0;
    var mainMesh = null;
    var particlesMesh = null;

    function createParticles3D() {
        var geo = new THREE.BufferGeometry();
        var count = 2000;
        var pos = new Float32Array(count * 3);
        for (var i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 120;
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        var mat = new THREE.PointsMaterial({ size: 0.06, color: 0xff6b00, transparent: true, opacity: 0.12 });
        particlesMesh = new THREE.Points(geo, mat);
        scene.add(particlesMesh);
    }

    function createShape(index) {
        if (mainMesh) {
            scene.remove(mainMesh);
            mainMesh.geometry.dispose();
            mainMesh.material.dispose();
        }
        var shape = shapes[index];
        var mat = new THREE.MeshPhongMaterial({
            color: shape.color,
            emissive: shape.emissive,
            emissiveIntensity: 0.08,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        mainMesh = new THREE.Mesh(shape.geo, mat);
        mainMesh.userData = { speed: shape.speed };
        scene.add(mainMesh);
    }

    function changeShape() {
        currentIndex = (currentIndex + 1) % shapes.length;
        createShape(currentIndex);
    }

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    var l1 = new THREE.PointLight(0xff0000, 0.8);
    l1.position.set(10, 10, 10);
    scene.add(l1);
    var l2 = new THREE.PointLight(0x0066ff, 0.4);
    l2.position.set(-10, -10, -10);
    scene.add(l2);

    camera.position.z = 5.5;

    createParticles3D();
    createShape(0);
    setInterval(changeShape, 120000);

    function animate() {
        requestAnimationFrame(animate);
        if (mainMesh) {
            var s = mainMesh.userData.speed || { x: 0.005, y: 0.01 };
            mainMesh.rotation.x += s.x;
            mainMesh.rotation.y += s.y;
        }
        if (particlesMesh) particlesMesh.rotation.y += 0.0003;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

console.log('🏎️ Formula 1 — Сайт полностью загружен!');
console.log('🔥 Все анимации работают!');
