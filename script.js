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
// 3D ФОН СО СМЕНОЙ ФИГУР
// =========================================================
const container = document.getElementById('three-canvas');

if (container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // =========================================================
    // ВСЕ 3D ФИГУРЫ ДЛЯ ФОНА
    // =========================================================
    const shapes = [
        { 
            geo: new THREE.TorusKnotGeometry(2, 0.8, 100, 16), 
            color: 0xcc0000, 
            emissive: 0xff0000, 
            speed: { x: 0.005, y: 0.01 },
            name: 'Тор Кнот'
        },
        { 
            geo: new THREE.SphereGeometry(1.8, 32, 32), 
            color: 0xffd700, 
            emissive: 0xff6b00, 
            speed: { x: 0.01, y: 0.005 },
            name: 'Сфера'
        },
        { 
            geo: new THREE.BoxGeometry(2.5, 2.5, 2.5), 
            color: 0x0066ff, 
            emissive: 0x0044cc, 
            speed: { x: 0.008, y: 0.008 },
            name: 'Куб'
        },
        { 
            geo: new THREE.IcosahedronGeometry(2, 1), 
            color: 0x00cc00, 
            emissive: 0x008800, 
            speed: { x: 0.007, y: 0.009 },
            name: 'Икосаэдр'
        },
        { 
            geo: new THREE.TorusGeometry(1.8, 0.6, 16, 100), 
            color: 0x9900ff, 
            emissive: 0x6600cc, 
            speed: { x: 0.01, y: 0.01 },
            name: 'Тор'
        },
        { 
            geo: new THREE.ConeGeometry(1.8, 3, 32), 
            color: 0xff6b00, 
            emissive: 0xcc4400, 
            speed: { x: 0.006, y: 0.012 },
            name: 'Конус'
        },
        { 
            geo: new THREE.DodecahedronGeometry(2), 
            color: 0xff0066, 
            emissive: 0xcc0044, 
            speed: { x: 0.009, y: 0.007 },
            name: 'Додекаэдр'
        },
        { 
            geo: new THREE.OctahedronGeometry(2.2), 
            color: 0x00ccff, 
            emissive: 0x0088cc, 
            speed: { x: 0.008, y: 0.006 },
            name: 'Октаэдр'
        },
        { 
            geo: new THREE.TorusKnotGeometry(2, 0.4, 64, 8, 2, 3), 
            color: 0xffffff, 
            emissive: 0x888888, 
            speed: { x: 0.01, y: 0.01 },
            name: 'Двойная спираль'
        },
        { 
            geo: new THREE.TorusKnotGeometry(2, 0.6, 100, 16, 3, 4), 
            color: 0xffff00, 
            emissive: 0xccaa00, 
            speed: { x: 0.007, y: 0.013 },
            name: 'Спираль'
        }
    ];

    let currentIndex = 0;
    let mainMesh = null;
    let particlesMesh = null;

    // =========================================================
    // СОЗДАНИЕ ЧАСТИЦ
    // =========================================================
    function createParticles() {
        const geo = new THREE.BufferGeometry();
        const count = 2500;
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            pos[i] = (Math.random() - 0.5) * 120;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        
        const mat = new THREE.PointsMaterial({
            size: 0.06,
            color: 0xff6b00,
            transparent: true,
            opacity: 0.12
        });
        
        particlesMesh = new THREE.Points(geo, mat);
        scene.add(particlesMesh);
    }

    // =========================================================
    // СОЗДАНИЕ ФИГУРЫ
    // =========================================================
    function createShape(index) {
        if (mainMesh) {
            scene.remove(mainMesh);
            mainMesh.geometry.dispose();
            mainMesh.material.dispose();
        }
        
        const shape = shapes[index];
        const mat = new THREE.MeshPhongMaterial({
            color: shape.color,
            emissive: shape.emissive,
            emissiveIntensity: 0.08,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        
        mainMesh = new THREE.Mesh(shape.geo, mat);
        mainMesh.userData = { speed: shape.speed, name: shape.name };
        scene.add(mainMesh);
        
        console.log(`🔄 Смена 3D фигуры: ${shape.name} (${index + 1}/${shapes.length})`);
    }

    // =========================================================
    // АВТОМАТИЧЕСКАЯ СМЕНА КАЖДЫЕ 2 МИНУТЫ
    // =========================================================
    function changeShape() {
        currentIndex = (currentIndex + 1) % shapes.length;
        createShape(currentIndex);
    }

    // =========================================================
    // СВЕТ
    // =========================================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const light1 = new THREE.PointLight(0xff0000, 0.8);
    light1.position.set(10, 10, 10);
    scene.add(light1);
    
    const light2 = new THREE.PointLight(0x0066ff, 0.4);
    light2.position.set(-10, -10, -10);
    scene.add(light2);

    camera.position.z = 5.5;

    // =========================================================
    // ЗАПУСК
    // =========================================================
    createParticles();
    createShape(0);
    setInterval(changeShape, 120000);

    // =========================================================
    // АНИМАЦИЯ
    // =========================================================
    function animate() {
        requestAnimationFrame(animate);
        
        if (mainMesh) {
            const speed = mainMesh.userData.speed || { x: 0.005, y: 0.01 };
            mainMesh.rotation.x += speed.x;
            mainMesh.rotation.y += speed.y;
        }
        
        if (particlesMesh) {
            particlesMesh.rotation.y += 0.0003;
        }
        
        renderer.render(scene, camera);
    }
    
    animate();

    // =========================================================
    // АДАПТАЦИЯ ПОД РАЗМЕР ОКНА
    // =========================================================
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// =========================================================
// МОБИЛЬНОЕ МЕНЮ
// =========================================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// =========================================================
// АКТИВНАЯ ССЫЛКА В НАВИГАЦИИ
// =========================================================
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.nav-menu a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        if (navMenu) navMenu.classList.remove('active');
    });
});

// =========================================================
// ОБНОВЛЕНИЕ АКТИВНОЙ ССЫЛКИ ПРИ СКРОЛЛЕ
// =========================================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// =========================================================
// КОНСОЛЬ
// =========================================================
console.log('🏎️ Formula 1 — Рекламный сайт');
console.log('📊 Всего команд: 10');
console.log('👨‍💻 Всего пилотов: 20');
console.log('🔄 3D фигуры меняются каждые 2 минуты');
console.log('🎨 Дизайн: строгий, минималистичный, рекламный');
console.log('📱 Адаптив: есть');
console.log('✨ Анимации: AOS + 3D');
