/**
 * Основной скрипт приложения
 * Управляет динамическим созданием кнопок банков и работой модальных окон
 * Добавлены анимированные частицы и улучшенный редирект
 */

// Ждём загрузки DOM перед инициализацией
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

/**
 * Инициализация приложения
 */
function init() {
    createParticles();
    renderBanks();
    setupEventListeners();
}

/**
 * Создание анимированных частиц
 */
function createParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;

    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Случайные размеры
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Случайные позиции
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Случайная задержка анимации
        const delay = Math.random() * 5;
        particle.style.animationDelay = delay + 's';
        
        // Случайная длительность анимации
        const duration = Math.random() * 10 + 15;
        particle.style.animationDuration = duration + 's';
        
        container.appendChild(particle);
    }
}

/**
 * Отрисовка кнопок банков из массива Banks
 */
function renderBanks() {
    const container = document.getElementById('banksContainer');
    
    // Очищаем контейнер (на случай повторной инициализации)
    container.innerHTML = '';
    
    // Проверяем, что Banks определён
    if (!Banks || !Array.isArray(Banks)) {
        console.error('Banks не определён или не является массивом');
        return;
    }
    
    // Создаём кнопку для каждого банка
    Banks.forEach((bank, index) => {
        const button = createBankButton(bank, index);
        container.appendChild(button);
    });
}

/**
 * Создание кнопки для одного банка
 * @param {Object} bank - Объект банка
 * @param {number} index - Индекс для анимации
 * @returns {HTMLElement} - Кнопка банка
 */
function createBankButton(bank, index) {
    const button = document.createElement('button');
    button.className = 'bank-button';
    button.setAttribute('data-bank-id', bank.id);
    button.style.animation = `fadeInUp 0.6s ease-out ${0.5 + index * 0.1}s both`;
    
    // Структура кнопки
    button.innerHTML = `
        <img src="${bank.icon}" alt="${bank.name}" class="bank-icon">
        <span class="bank-name">${bank.name}</span>
        <div class="bank-arrow"></div>
    `;
    
    // Обработчик клика
    button.addEventListener('click', () => openModal(bank));
    
    // Партиклы при наведении
    button.addEventListener('mouseenter', (e) => {
        createButtonParticles(e);
    });
    
    return button;
}

/**
 * Создание частиц при наведении на кнопку
 */
function createButtonParticles(event) {
    const button = event.target.closest('.bank-button');
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const particleCount = 6;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'button-particle';
        
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Позиция в центре кнопки
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        // Случайное направление
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = Math.random() * 3 + 2;
        
        particle.style.setProperty('--vx', Math.cos(angle) * velocity);
        particle.style.setProperty('--vy', Math.sin(angle) * velocity);
        
        document.body.appendChild(particle);
        
        // Удаление частицы после анимации
        setTimeout(() => particle.remove(), 1000);
    }
}

/**
 * Открытие модального окна с информацией о банке
 * @param {Object} bank - Объект банка
 */
function openModal(bank) {
    const modal = document.getElementById('modalOverlay');
    const qrImage = document.getElementById('qrImage');
    const requisitesText = document.getElementById('requisitesText');
    
    // Устанавливаем QR-код
    qrImage.src = bank.qr;
    qrImage.alt = `QR код ${bank.name}`;
    
    // Устанавливаем реквизиты
    requisitesText.textContent = bank.text;
    
    // Показываем модаль
    modal.classList.add('active');
    
    // Предотвращаем прокрутку основной страницы
    document.body.style.overflow = 'hidden';
}

/**
 * Закрытие основного модального окна
 */
function closeModal() {
    const modal = document.getElementById('modalOverlay');
    modal.classList.remove('active');
    
    // Восстанавливаем прокрутку основной страницы
    document.body.style.overflow = 'auto';
}

/**
 * Открытие полноэкранного QR
 * @param {string} qrSrc - Источник QR изображения
 */
function openQRFullscreen(qrSrc) {
    const fullscreenOverlay = document.getElementById('qrFullscreenOverlay');
    const fullscreenImage = document.getElementById('qrFullscreenImage');
    
    fullscreenImage.src = qrSrc;
    fullscreenOverlay.classList.add('active');
    
    // Предотвращаем прокрутку основной страницы
    document.body.style.overflow = 'hidden';
}

/**
 * Закрытие полноэкранного QR
 */
function closeQRFullscreen() {
    const fullscreenOverlay = document.getElementById('qrFullscreenOverlay');
    fullscreenOverlay.classList.remove('active');
    
    // Восстанавливаем прокрутку основной страницы
    document.body.style.overflow = 'auto';
}

/**
 * Настройка обработчиков событий
 */
function setupEventListeners() {
    // Ник - редирект на сайт
    const nicknameLink = document.getElementById('nicknameLink');
    if (nicknameLink) {
        nicknameLink.addEventListener('click', () => {
            window.location.href = 'https://toolgool.duckdns.org/';
        });
    }
    
    // ============ ОСНОВНОЕ МОДАЛЬНОЕ ОКНО ============
    
    // Кнопка закрытия модаля (X)
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    
    // Кнопка закрытия (Закрыть)
    const modalButtonClose = document.getElementById('modalButtonClose');
    if (modalButtonClose) {
        modalButtonClose.addEventListener('click', closeModal);
    }
    
    // Закрытие по ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const fullscreenOverlay = document.getElementById('qrFullscreenOverlay');
            const mainModal = document.getElementById('modalOverlay');
            
            // Приоритет: сначала закрываем полноэкранный QR, если он открыт
            if (fullscreenOverlay.classList.contains('active')) {
                closeQRFullscreen();
            } else if (mainModal.classList.contains('active')) {
                closeModal();
            }
        }
    });
    
    // Закрытие по клику вне окна (основное модальное окно)
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (event) => {
            // Проверяем, что клик был именно на overlay, а не на содержимое модаля
            if (event.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    // ============ ПОЛНОЭКРАННОЕ QR ============
    
    // Клик на QR код в основном модальном окне - открывает полноэкранный просмотр
    const qrImage = document.getElementById('qrImage');
    if (qrImage) {
        qrImage.addEventListener('click', () => {
            const qrSrc = qrImage.src;
            if (qrSrc) {
                openQRFullscreen(qrSrc);
            }
        });
    }
    
    // Кнопка закрытия полноэкранного QR (X)
    const qrFullscreenCloseBtn = document.getElementById('qrFullscreenCloseBtn');
    if (qrFullscreenCloseBtn) {
        qrFullscreenCloseBtn.addEventListener('click', closeQRFullscreen);
    }
    
    // Закрытие полноэкранного QR по клику вне изображения
    const qrFullscreenOverlay = document.getElementById('qrFullscreenOverlay');
    if (qrFullscreenOverlay) {
        qrFullscreenOverlay.addEventListener('click', (event) => {
            // Проверяем, что клик был на overlay, а не на изображение или кнопку закрытия
            if (event.target === qrFullscreenOverlay) {
                closeQRFullscreen();
            }
        });
    }
}

/**
 * Добавляем стили для анимаций динамически
 */
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes float {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translate(var(--vx, 0px), var(--vy, 0px)) scale(0);
            opacity: 0;
        }
    }

    .particle {
        position: fixed;
        pointer-events: none;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, rgba(88, 44, 131, 0.8), rgba(44, 88, 131, 0.4));
        box-shadow: 0 0 10px rgba(88, 44, 131, 0.6);
        animation: particleFloat linear infinite;
        z-index: 1;
    }

    .button-particle {
        position: fixed;
        pointer-events: none;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, rgba(88, 44, 131, 0.9), rgba(44, 88, 131, 0.5));
        box-shadow: 0 0 15px rgba(88, 44, 131, 0.8);
        animation: float 1s ease-out forwards;
        z-index: 999;
    }

    @keyframes particleFloat {
        0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.8;
        }
        50% {
            opacity: 0.8;
        }
        100% {
            transform: translateY(-200px) translateX(100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
