/**
 * Конфигурация банков
 * Добавьте сюда новые банки, и они автоматически появятся на сайте
 */

const Banks = [
    {
        id: "mbank",
        name: "MBANK",
        icon: "image/banks/mbank.png",
        qr: "image/banks/mbank_qr.png",
        text: `Реквизиты:

Номер карты:
9966 **** **** ****

Получатель:
Toolgool

Примечание:
Минимальная сумма 100 BYN`
    },
    {
        id: "simbank",
        name: "Simbank",
        icon: "image/banks/simbank.png",
        qr: "image/banks/simbank_qr.png",
        text: `Реквизиты:

Номер карты:
4400 **** **** ****

Получатель:
Toolgool

Примечание:
Комиссия 1% от суммы`
    },
    {
        id: "optima",
        name: "Optima Bank",
        icon: "image/banks/optima.png",
        qr: "image/banks/optima_qr.png",
        text: `Реквизиты:

Номер карты:
2200 **** **** ****

Получатель:
Toolgool

Примечание:
Доступно 24/7`
    }
];