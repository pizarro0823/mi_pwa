export const getFixtures = async () => {
  const isLocal = window.location.hostname === "localhost";

  const url = isLocal
    ? "http://localhost:3001/api/fixtures"
    : "/api/fixtures";

  const res = await fetch(url);
  const data = await res.json();

  return data.response;
};