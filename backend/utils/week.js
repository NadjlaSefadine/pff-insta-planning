function getWeekRange(date = new Date()) {
  // Retourne le lundi et le dimanche de la semaine de la date donnée
  const d = new Date(date);
  const day = d.getDay(); // 0=samedi, 1=lundi...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  constsaturday = new Date(monday);
  saturday.setDate(monday.getDate() + 6);
  saturday.setHours(23, 59, 59, 999);

  return { monday, saturday };
}

module.exports = { getWeekRange };
