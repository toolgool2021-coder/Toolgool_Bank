/* Редактируй значения здесь. Это декоративная карточка проекта, не банковский счёт. */
window.ToolgoolCardData = {
  owner: "TOOLGOOL",
  title: "TL PRIVATE",
  balance: 125,
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
    startDelaySeconds: 3
  }
};
