const userAge = (birthDate) => {
  // Разбиваем строку на компоненты
  const [day, month, year] = birthDate.split("/").map(Number);

  // Получаем текущую дату
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // Месяцы начинаются с 0
  const currentDay = today.getDate();

  // Вычисляем возраст
  let age = currentYear - year;

  // Учитываем месяц и день рождения
  if (currentMonth < month || (currentMonth === month && currentDay < day)) {
    age -= 1;
  }

  return age;
};

module.exports = userAge;
