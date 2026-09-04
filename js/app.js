/**
 * Основной скрипт приложения
 * Управляет динамическим созданием кнопок банков и работой модальных окон
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
    renderBanks();
    setupEventListeners();
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
    
    return button;
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
    // Ник - клик на Telegram
    const nicknameLink = document.getElementById('nicknameLink');
    if (nicknameLink) {
        nicknameLink.addEventListener('click', () => {
            window.open('https://t.me/toolgool', '_blank');
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
 * Добавляем стиль для fadeInUp анимации динамически
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
`;
document.head.appendChild(style);
