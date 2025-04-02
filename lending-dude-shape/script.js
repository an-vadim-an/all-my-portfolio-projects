document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.all-furniture ul li');
    const rosterList = document.querySelector('.roster-list');

    const layouts = {
        "Shop By Room": [
            { img: "img/furniture/living-room.png", text: "Living Room" },
            { img: "img/furniture/kitchen.png", text: "Kitchen" },
            { img: "img/furniture/dining-room.png", text: "Dining Room" },
            { img: "img/furniture/bed-room.png", text: "Bed Room" }
        ],
        "Shop By Category": [
            { img: "img/furniture/living-room.png", text: "Living Room" },
            { img: "img/furniture/kitchen.png", text: "Kitchen" },
            { img: "img/furniture/dining-room.png", text: "Dining Room" },
            { img: "img/furniture/bed-room.png", text: "Bed Room" }
        ],
        "Shop By Style": [
            { img: "img/furniture/living-room.png", text: "Living Room" },
            { img: "img/furniture/kitchen.png", text: "Kitchen" },
            { img: "img/furniture/dining-room.png", text: "Dining Room" },
            { img: "img/furniture/bed-room.png", text: "Bed Room" }
        ]
    };

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function updateRoster(category) {
        rosterList.innerHTML = '';
        const shuffledItems = shuffleArray([...layouts[category]]);
        shuffledItems.forEach(item => {
            const button = document.createElement('button');
            button.innerHTML = `<div>
                                    <img src="${item.img}" alt="">
                                    <p>${item.text}</p>
                                </div>`;
            rosterList.appendChild(button);
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            if (!this.classList.contains('active')) {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                updateRoster(this.textContent);
            }
        });
    });

    tabs[0].classList.add('active');
    updateRoster(tabs[0].textContent);
});



document.querySelectorAll('.top-nav ul li a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

document.getElementById('explore-more').addEventListener('click', function () {
    const targetSection = document.getElementById('popular-furniture');

    if (targetSection) {
        window.scrollTo({
            top: targetSection.offsetTop - 80,
            behavior: 'smooth'
        });
    }
});

document.querySelectorAll('.subscribe input').forEach(input => {
    input.addEventListener('input', function () {
        const email = this.value;
        const validEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!validEmail.test(email)) {
            this.style.border = '1px solid red';
        } else {
            this.style.border = '1px solid green';
        }
    });
});

document.querySelectorAll('#register-btn').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        const inputs = this.parentElement.parentElement.querySelectorAll('input');
        const emails = [...inputs].map(input => input.value);
        const validEmails = emails.filter(email => {
            const validEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            return validEmail.test(email);
        });
        if (validEmails.length === emails.length) {
            location.reload();
        } else {
            alert('Invalid email!');
        }
    });
});
