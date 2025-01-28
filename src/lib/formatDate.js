// formatDate.js
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Baru saja";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} detik yang lalu`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  } else if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  } else if (diffInDays <= 7) {
    return `${diffInDays} hari yang lalu`;
  } else {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("id-ID", options);
  }
};

export default formatDate;
