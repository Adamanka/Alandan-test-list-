// AOS инициализация
AOS.init({
    duration: 800,
    once: false,
    offset: 100,
    mirror: true
});

// ГЛАВНЫЙ 3D ФОН
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

    // 3D ОБЪЕКТ — АНИМИРОВАННЫЙ БОЛИД
    const geometry = new THREE.TorusKnotGeometry(2, 0.8, 100, 16);
    const material = new THREE.MeshPhongMaterial({
        color: 0xcc0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.1,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // ЧАСТИЦЫ
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
        opacity: 0.3
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // СВЕТ
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const light = new THREE.PointLight(0xff0000, 1);
    light.position.set(10, 10, 10);
    scene.add(light);
    
    const light2 = new THREE.PointLight(0x0066ff, 0.5);
    light2.position.set(-10, -10, -10);
    scene.add(light2);

    camera.position.z = 5;

    // АНИМАЦИЯ
    function animate() {
        requestAnimationFrame(animate);
        
        torusKnot.rotation.x += 0.005;
        torusKnot.rotation.y += 0.01;
        
        particlesMesh.rotation.y += 0.0005;
        
        renderer.render(scene, camera);
    }
    
    animate();

    // АДАПТАЦИЯ
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ПАРАЛЛАКС
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    }
});

// ПЛАВНАЯ НАВИГАЦИЯ
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

console.log('🏎️ Formula 1 с 3D анимациями загружен!');
