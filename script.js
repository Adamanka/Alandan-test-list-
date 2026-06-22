AOS.init({
    duration: 1000,
    once: false,
    offset: 150,
    mirror: true
});

// --- 3D ФОН ---
const container = document.getElementById('three-canvas');

if (container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- ВСЕ ФИГУРЫ ---
    const shapes = [
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

    let currentIndex = 0;
    let mainMesh = null;
    let particlesMesh = null;

    // --- ЧАСТИЦЫ ---
    function createParticles() {
        const geo = new THREE.BufferGeometry();
        const count = 2000;
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 100;
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({ size: 0.05, color: 0xff6b00, transparent: true, opacity: 0.2 });
        particlesMesh = new THREE.Points(geo, mat);
        scene.add(particlesMesh);
    }

    // --- СОЗДАНИЕ ФИГУРЫ ---
    function createShape(index) {
        if (mainMesh) { scene.remove(mainMesh); mainMesh.geometry.dispose(); mainMesh.material.dispose(); }
        const shape = shapes[index];
        const mat = new THREE.MeshPhongMaterial({
            color: shape.color,
            emissive: shape.emissive,
            emissiveIntensity: 0.1,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        mainMesh = new THREE.Mesh(shape.geo, mat);
        mainMesh.userData = shape;
        scene.add(mainMesh);
        console.log(`🔄 Смена фигуры ${index + 1}/${shapes.length}`);
    }

    // --- СМЕНА КАЖДЫЕ 2 МИНУТЫ ---
    function changeShape() {
        currentIndex = (currentIndex + 1) % shapes.length;
        createShape(currentIndex);
    }

    // --- СВЕТ ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const l1 = new THREE.PointLight(0xff0000, 1);
    l1.position.set(10, 10, 10);
    scene.add(l1);
    const l2 = new THREE.PointLight(0x0066ff, 0.5);
    l2.position.set(-10, -10, -10);
    scene.add(l2);

    camera.position.z = 5;

    createParticles();
    createShape(0);
    setInterval(changeShape, 120000);

    function animate() {
        requestAnimationFrame(animate);
        if (mainMesh) {
            const s = mainMesh.userData.speed || { x: 0.005, y: 0.01 };
            mainMesh.rotation.x += s.x;
            mainMesh.rotation.y += s.y;
        }
        if (particlesMesh) particlesMesh.rotation.y += 0.0005;
        renderer.render(scene, camera);
    }
    animate();

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
    const hero = document.querySelector('.hero-content');
    if (hero) hero.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
});

// --- НАВИГАЦИЯ ---
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

console.log('🏎️ Formula 1 — ВСЁ НА ПОЛНЫЙ ЭКРАН!');
console.log('🔄 3D фигуры меняются каждые 2 минуты');
