// Simulamos base de datos en memoria
const users = []; // { username, password }

export const addUser = (username, password) => {
  if (users.find(u => u.username === username)) return false;
  users.push({ username, password });
  return true;
};

export const getUser = (username) => {
  return users.find(u => u.username === username);
};