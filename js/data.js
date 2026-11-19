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
    intervalSeconds: 3, // интервал между поступлениями
    minAmount: 25,
    maxAmount: 250,
    animationMs: 420,
    startDelaySeconds: 1,
    randomTiming: true, // случайные интервалы вместо постоянных
    minIntervalSeconds: 0.8,
    maxIntervalSeconds: 4,
    expenseChance: 0.4, // вероятность уменьшения баланса (40%)
    minExpense: 10,
    maxExpense: 140,
    minimumBalance: 0, // нижний предел баланса
    maximumBalance: 300, // верхний предел баланса
    burstChance: 0.12, // шанс серии операций (12%)
    burstMin: 2, // минимум операций в серии
    burstMax: 4, // максимум операций в серии
    burstGapMinSeconds: 0.35, // минимальная пауза внутри серии
    burstGapMaxSeconds: 0.85, // максимальная пауза внутри серии
    boundaryBias: 0.8, // мягкое отталкивание от границ
    maxStepFraction: 0.28 // максимальная доля диапазона за операцию
  }
};
