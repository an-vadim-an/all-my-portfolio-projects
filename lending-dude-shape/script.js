document.querySelectorAll('.top-nav ul li a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault(); // Отменяем стандартный переход

        const targetId = this.getAttribute('href').substring(1); // Убираем #
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 50, // Отступ на случай фиксированного навбара
                behavior: 'smooth' // Плавный скролл
            });
        }
    });
});