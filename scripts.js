// scripts.js (Versión Completa y Corregida)

document.addEventListener('DOMContentLoaded', () => {

    // ================== LÓGICA DEL SLIDER ==================
    const slider = document.getElementById('slider');
    if (slider) { // Este 'if' asegura que el código solo corra si el slider existe
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const sliderDotsContainer = document.getElementById('sliderDots');

        let currentSlide = 0;
        const slideCount = slides.length;
        let slideInterval;

        // Crear los puntos de navegación
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('span');
            dot.addEventListener('click', () => goToSlide(i));
            sliderDotsContainer.appendChild(dot);
        }
        const dots = sliderDotsContainer.querySelectorAll('span');

        const updateSlider = () => {
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slideCount;
            updateSlider();
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            updateSlider();
        };
        
        const goToSlide = (index) => {
            currentSlide = index;
            updateSlider();
            resetInterval();
        }

        const resetInterval = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        };

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
        
        // Iniciar
        updateSlider();
        resetInterval();
    }


    // ================== LÓGICA DEL FILTRO DE CURSOS (cursos.html) ==================
    if (document.getElementById('course-filters')) {
        const filterButtons = document.querySelectorAll('#course-filters button');
        const courseCards = document.querySelectorAll('#course-grid .course-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.dataset.filter;

                courseCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.classList.remove('hide');
                    } else {
                        card.classList.add('hide');
                    }
                });
            });
        });
    }

    // ================== LÓGICA PARA CARGAR MATERIA (materia.html) ==================
    if (document.getElementById('materia-detalle')) {
        const params = new URLSearchParams(window.location.search);
        const materiaId = params.get('id');

        if (materiaId) {
            fetch('data.json')
                .then(response => response.json())
                .then(data => {
                    const materia = data.find(m => m.id === materiaId);
                    if (materia) {
                        document.title = materia.titulo; // Actualiza el título de la pestaña
                        document.getElementById('materia-titulo').textContent = materia.titulo;
                        document.getElementById('materia-img').src = materia.imagen;
                        document.getElementById('materia-descripcion').textContent = materia.descripcionLarga;

                        const temasLista = document.getElementById('materia-temas');
                        temasLista.innerHTML = '';
                        materia.temas.forEach(tema => {
                            const li = document.createElement('li');
                            li.textContent = tema;
                            temasLista.appendChild(li);
                        });
                    } else {
                        document.getElementById('materia-titulo').textContent = "Materia no encontrada";
                    }
                })
                .catch(error => {
                    console.error('Error al cargar los datos de la materia:', error);
                    document.getElementById('materia-titulo').textContent = "Error al cargar";
                });
        }
    }
});