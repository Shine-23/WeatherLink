export const authStorage = {
  set: ({ token, username }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
  },
  clear: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  },
  getToken: () => localStorage.getItem("token"),
};
