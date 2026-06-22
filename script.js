// AOS инициализация
AOS.init({
    duration: 1000,
    once: false,
    offset: 150,
    mirror: true
});

// --- 3D ФИГУРА С АВТОМАТИЧЕСКОЙ СМЕНОЙ КАЖДЫЕ 2 МИНУТЫ ---
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

    // --- СПИСОК ВСЕХ ФИГУР ---
    const shapes = [
        // 1. Тор Кнот (сложный узел) — красный
        { 
            geometry: new THREE.TorusKnotGeometry(2, 0.8, 100, 16),
            color: 0xcc0000,
            emissive: 0xff0000,
            opacity: 0.2,
            wireframe: true,
            rotationSpeed: { x: 0.005, y: 0.01 }
        },
        // 2. Сфера с шипами (как солнце) — золотая
        { 
            geometry: new THREE.SphereGeometry(1.8, 32, 32),
            color: 0xffd700,
            emissive: 0xff6b00,
            opacity: 0.15,
            wireframe: true,
            rotationSpeed: { x: 0.01, y: 0.005 }
        },
        // 3. Куб с закруглениями — синий
        { 
            geometry: new THREE.BoxGeometry(2.5, 2.5, 2.5),
            color: 0x0066ff,
            emissive: 0x0044cc,
            opacity: 0.15,
            wireframe: true,
            rotationSpeed: { x: 0.008, y: 0.008 }
        },
        // 4. Икосаэдр (многогранник) — зелёный
        { 
            geometry: new THREE.IcosahedronGeometry(2, 1),
            color: 0x00cc00,
            emissive: 0x008800,
            opacity: 0.15,
            wireframe: true,
            rotationSpeed: { x: 0.007, y: 0.009 }
        },
        // 5. Цилиндр с отверстием — фиолетовый
        { 
            geometry: new THREE.TorusGeometry(1.8, 0.6, 16, 100),
            color: 0x9900ff,
            emissive: 0x6600cc,
            opacity: 0.15,
            wireframe: true,
            rotationSpeed: { x: 0.01, y: 0.01 }
        },
        // 6. Конус — оранжевый
        { 
            geometry: new THREE.ConeGeometry(1.8, 3, 32),
            color: 0xff6b00,
            emissive: 0xcc4400,
            opacity: 0.15,
            wireframe: true,
            rotationSpeed: { x: 0.006, y: 0.012 }
        },
        // 7. Додекаэдр (12-гранник) — розовый
        { 
            geometry: new THREE.DodecahedronGeometry(2),
            color: 0xff0066,
            emissive: 0xcc0044,
            opacity: 0.15,
            wireframe: true,
            rotationSpeed: { x: 0.009, y: 0.007 }
        },
        // 8. Октаэдр (8-гранник) — голубой
        { 
            geometry: new THREE.OctahedronGeometry(2.2),
            color: 0x00ccff,
            emissive: 0x0088cc,
            opacity: 0.15,
            wireframe: true,
            rotationSpeed: { x: 0.008, y: 0.006 }
        },
        // 9. Кольцо с двойной спиралью — белый
        { 
            geometry: new THREE.TorusKnotGeometry(2, 0.4, 64, 8, 2, 3),
            color: 0xffffff,
            emissive: 0x888888,
            opacity: 0.1,
            wireframe: true,
            rotationSpeed: { x: 0.01, y: 0.01 }
        },
        // 10. Круглая спираль — жёлтый
        { 
            geometry: new THREE.TorusKnotGeometry(2, 0.6, 100, 16, 3, 4),
            color: 0xffff00,
            emissive: 0xccaa00,
            opacity: 0.15,
            wireframe: true,
            rotationSpeed: { x: 0.007, y: 0.013 }
        }
    ];

    let currentShapeIndex = 0;
    let mainMesh = null;
    let particlesMesh = null;

    // --- СОЗДАНИЕ ЧАСТИЦ (ВСЕГДА ОДИНАКОВЫЕ) ---
    function createParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;
        const posArray = new Float32Array(particlesCount * 3);
        
        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 100;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: 0xff6b00,
            transparent: true,
            opacity: 0.2
        });
        
        particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
    }

    // --- СОЗДАНИЕ ФИГУРЫ ---
    function createShape(index) {
        // Удаляем старую фигуру
        if (mainMesh) {
            scene.remove(mainMesh);
            mainMesh.geometry.dispose();
            mainMesh.material.dispose();
        }

        const shape = shapes[index];
        
        const material = new THREE.MeshPhongMaterial({
            color: shape.color,
            emissive: shape.emissive,
            emissiveIntensity: 0.1,
            wireframe: shape.wireframe || true,
            transparent: true,
            opacity: shape.opacity || 0.15
        });
        
        mainMesh = new THREE.Mesh(shape.geometry, material);
        mainMesh.userData = shape;
        scene.add(mainMesh);
    }

    // --- СМЕНА ФИГУРЫ ---
    function changeShape() {
        currentShapeIndex = (currentShapeIndex + 1) % shapes.length;
        createShape(currentShapeIndex);
        
        // Показываем в консоли какая фигура сейчас
        const shapeNames = [
            'Тор Кнот (узел) 🔴',
            'Сфера с шипами ⭐',
            'Куб закруглённый 🔵',
            'Икосаэдр (20-гранник) 🟢',
            'Тор (кольцо) 🟣',
            'Конус 🟠',
            'Додекаэдр (12-гранник) 🌸',
            'Октаэдр (8-гранник) 🔷',
            'Двойная спираль ⚪',
            'Круглая спираль 💛'
        ];
        console.log(`🔄 Смена фигуры: ${shapeNames[currentShapeIndex]}`);
    }

    // --- СВЕТ ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const light = new THREE.PointLight(0xff0000, 1);
    light.position.set(10, 10, 10);
    scene.add(light);
    
    const light2 = new THREE.PointLight(0x0066ff, 0.5);
    light2.position.set(-10, -10, -10);
    scene.add(light2);

    camera.position.z = 5;

    // --- ЗАПУСК ---
    createParticles();
    createShape(0);

    // --- АВТОМАТИЧЕСКАЯ СМЕНА КАЖДЫЕ 2 МИНУТЫ (120 000 мс) ---
    setInterval(changeShape, 120000); // 2 минуты

    // --- АНИМАЦИЯ ---
    function animate() {
        requestAnimationFrame(animate);
        
        if (mainMesh) {
            const speed = mainMesh.userData.rotationSpeed || { x: 0.005, y: 0.01 };
            mainMesh.rotation.x += speed.x;
            mainMesh.rotation.y += speed.y;
        }
        
        if (particlesMesh) {
            particlesMesh.rotation.y += 0.0005;
        }
        
        renderer.render(scene, camera);
    }
    
    animate();

    // --- АДАПТАЦИЯ ПОД РАЗМЕР ОКНА ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- ПАРАЛЛАКС ---
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    }
});

// --- НАВИГАЦИЯ ---
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

console.log('🏎️ Formula 1 — 3D фигуры меняются каждые 2 минуты!');
console.log('📋 Всего фигур: 10');
