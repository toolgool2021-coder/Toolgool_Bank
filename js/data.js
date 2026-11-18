/* Редактируй значения здесь. Это декоративная карточка проекта, не банковский счёт. */
window.ToolgoolCardData = {
  owner: "TOOLGOOL",
  title: "TL PRIVATE",
  balance: 0,
  currency: "KGS",
  locale: "ru-RU",
  cardNumber: "••••  ••••  ••••  2026",
  status: "PROJECT WALLET",
  showBalance: true,
  accent: "#83b9ff",
  // Имитация пополнений: не связана с реальными платежами.
  simulation: {
    enabled: true,
    intervalSeconds: 12, // интервал между поступлениями
    minAmount: 25,
    maxAmount: 250,
    animationMs: 1350,
    startDelaySeconds: 3,
    randomTiming: true, // случайные интервалы вместо постоянных
    minIntervalSeconds: 3,
    maxIntervalSeconds: 18,
    expenseChance: 0.4, // вероятность уменьшения баланса (40%)
    minExpense: 10,
    maxExpense: 140,
    minimumBalance: 0, // нижний предел баланса
    maximumBalance: 300, // верхний предел баланса
    burstChance: 0.12, // шанс серии операций (38%)
    burstMin: 2, // минимум операций в серии
    burstMax: 4, // максимум операций в серии
    burstGapMinSeconds: 0.7, // минимальная пауза внутри серии
    burstGapMaxSeconds: 1.8 // максимальная пауза внутри серии
  }
};
