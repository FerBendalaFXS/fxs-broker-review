const toggleFixedLinkButtonsVisibility = () => {
	window.onscroll = function () { handleButtonsScroll() };

	var element = document.getElementById("fxs_fixed_link_buttons");
	var sticky = window.innerHeight;

	function handleButtonsScroll() {
		if (window.scrollY >= sticky) element.classList.add("active")
		else element.classList.remove("active");
	}
}

const handleReviewMenu = () => {
	const menuButtons = document.querySelectorAll('.fxs_full_review_menu_button');
	const sections = document.querySelectorAll('.fxs_full_review_item');

	const handleClick = (event) => {
		menuButtons.forEach(btn => btn.classList.remove('active'));
		event.target.classList.add('active');

		const targetId = event.target.getAttribute('data-target');
		const targetSection = document.getElementById(targetId);

		if (targetSection) {
			targetSection.scrollIntoView({ block: 'start', behavior: 'smooth' });
		}
	};

	const handleScroll = () => {
		let currentSection = null;
		const windowTop = window.scrollY;
		const windowWidth = window.innerWidth;
	
		sections.forEach(section => {
			const rect = section.getBoundingClientRect();
			const sectionTop = rect.top + windowTop;
			const sectionBottom = sectionTop + section.offsetHeight;
			const menuHeight = 100;
			const menuHeightMobile = 127;
	
			let offsetTop, offsetBottom;
			const additionalOffset = 112; // Añadimos 112px al offset
	
			if (windowWidth <= 767) {
				offsetTop = windowTop + menuHeightMobile + additionalOffset;
				offsetBottom = windowTop + menuHeightMobile + additionalOffset;
			} else {
				offsetTop = windowTop + menuHeight + additionalOffset;
				offsetBottom = windowTop + menuHeight + additionalOffset;
			}
	
			if (sectionTop <= offsetTop && sectionBottom >= offsetBottom) {
				currentSection = section.getAttribute('id');
			}
		});
	
		if (currentSection) {
			menuButtons.forEach(btn => {
				btn.classList.remove('active');
				if (btn.getAttribute('data-target') === currentSection) {
					btn.classList.add('active');
				}
			});
		}
	};
	

	menuButtons.forEach(button => {
		button.addEventListener('click', handleClick);
	});

	window.addEventListener('scroll', handleScroll);
};

const handleReviewMenuButtons = () => {
	const menuWrapper = document.querySelector('.fxs_full_review_menu');
	const leftChevron = document.querySelector('.fxs_full_review_menu_left_chevron');
	const rightChevron = document.querySelector('.fxs_full_review_menu_right_chevron');
	const activeButton = document.querySelector('.fxs_full_review_menu_button.active');
	const lateralMargin = 20

	const checkChevronVisibility = () => {
		if (menuWrapper.scrollLeft <= lateralMargin) {
			leftChevron.style.opacity = 0;
		} else {
			leftChevron.style.opacity = 1;
			leftChevron.style.pointerEvents = 'all';
		}

		if (menuWrapper.scrollLeft + menuWrapper.clientWidth >= menuWrapper.scrollWidth - lateralMargin) {
			rightChevron.style.opacity = 0;
		} else {
			rightChevron.style.opacity = 1;
			rightChevron.style.pointerEvents = 'all';
		}
	};

	const scrollMenuLeft = () => {
		menuWrapper.scrollBy({
			top: 0,
			left: -200,
			behavior: 'smooth'
		});
		setTimeout(checkChevronVisibility, 300); // Chequea la visibilidad después de la animación
	};

	const scrollMenuRight = () => {
		menuWrapper.scrollBy({
			top: 0,
			left: 200,
			behavior: 'smooth'
		});
		setTimeout(checkChevronVisibility, 300); // Chequea la visibilidad después de la animación
	};

	leftChevron.addEventListener('click', scrollMenuLeft);
	rightChevron.addEventListener('click', scrollMenuRight);

	// Inicialmente chequea la visibilidad de los chevrons
	checkChevronVisibility();

	// Desplaza el menú para mostrar el botón activo
	if (activeButton) {
		const menuLeft = menuWrapper.getBoundingClientRect().left;
		const activeButtonLeft = activeButton.getBoundingClientRect().left;
		const scrollAmount = activeButtonLeft - menuLeft - (menuWrapper.clientWidth / 2) + (activeButton.clientWidth / 2);
		menuWrapper.scrollBy({
			top: 0,
			left: scrollAmount,
			behavior: 'smooth'
		});
	}
};

const handleUserReviewCarousel = () => {
	const carousel = document.querySelector('.carousel');
	const dotsContainer = document.querySelector('.carousel-dots');
	const items = document.querySelectorAll('.fxs_user_review_box');
	const totalItems = items.length;
	let itemGap;
	let itemWidth;
	let containerWidth = document.querySelector('.carousel-container').clientWidth;
	let itemsToShow;
	let totalDots;
	let currentIndex = 0;

	const calculateDimensions = () => {
		containerWidth = document.querySelector('.carousel-container').clientWidth;
		if (window.innerWidth <= 767) {
			itemGap = 0;
			itemWidth = items[0].offsetWidth;
		} else {
			itemGap = ((12 * totalItems) / items.length);
			itemWidth = items[0].offsetWidth + itemGap;
		}
		itemsToShow = Math.floor(containerWidth / itemWidth);
		totalDots = Math.ceil(totalItems / itemsToShow);
	};

	const createDots = () => {
		dotsContainer.innerHTML = '';
		for (let i = 0; i < totalDots; i++) {
			const dot = document.createElement('button');
			if (i === Math.floor(currentIndex / itemsToShow)) dot.classList.add('active');
			dot.addEventListener('click', () => moveToIndex(i));
			dotsContainer.appendChild(dot);
		}
	};

	const dots = () => document.querySelectorAll('.carousel-dots button');

	const moveToIndex = (index) => {
		currentIndex = index * itemsToShow;
		updateCarousel();
	};

	const updateCarousel = () => {
		const offset = -currentIndex * itemWidth;
		carousel.style.transform = `translateX(${offset}px)`;
		dots().forEach(dot => dot.classList.remove('active'));
		dots()[Math.floor(currentIndex / itemsToShow)].classList.add('active');
	};

	// Initial setup
	calculateDimensions();
	createDots();
	updateCarousel();

	// Update carousel on window resize
	window.addEventListener('resize', () => {
		calculateDimensions();
		createDots();
		updateCarousel();
	});
};

const handleFaqsAccordionClick = () => {
	const dropdownButtons = document.querySelectorAll('.fxs_faqs_dropdown_button');

	dropdownButtons.forEach(button => {
		button.addEventListener('click', () => {
			const dropdownContent = button.nextElementSibling;

			if (button.classList.contains('active')) {
				// Si ya está activo, desactívalo
				dropdownContent.style.maxHeight = null;
				button.classList.remove('active');
			} else {
				// Cierra todos los demás dropdowns y quita las clases activas
				document.querySelectorAll('.fxs_faqs_dropdown_content').forEach(content => {
					content.style.maxHeight = null;
				});
				document.querySelectorAll('.fxs_faqs_dropdown_button').forEach(btn => {
					btn.classList.remove('active');
				});

				// Abre el dropdown clicado y añade la clase activa
				dropdownContent.style.maxHeight = dropdownContent.scrollHeight + 'px';
				button.classList.add('active');
			}
		});
	});
};

const handleProgressBar = () => {
	const progressBars = document.querySelectorAll('.fxs_progressBar_inner');

	const animateProgressBar = (entries, observer) => {
		entries.forEach(entry => {
			const progressBar = entry.target;
			const percentage = progressBar.getAttribute('data-percentage');
			progressBar.style.flexBasis = '0%';

			if (entry.isIntersecting) {
				setTimeout(() => {

					progressBar.style.transition = 'flex-basis 2s';
					progressBar.style.flexBasis = `${percentage}%`;
					observer.unobserve(progressBar);
				}, 100)
			}
		});
	}

	const observer = new IntersectionObserver(animateProgressBar, {
		threshold: 0.1
	});

	progressBars.forEach(bar => {
		const flexBasis = bar.style.flexBasis;
		const percentage = flexBasis ? flexBasis.match(/\d+/)[0] : '0';
		bar.setAttribute('data-percentage', percentage);
		observer.observe(bar);
	});
};

// LOAD FUNCIONS
document.addEventListener('DOMContentLoaded', () => {
	toggleFixedLinkButtonsVisibility();
	handleReviewMenu();
	handleReviewMenuButtons();
	handleUserReviewCarousel();
	handleFaqsAccordionClick();
	handleProgressBar();
});
