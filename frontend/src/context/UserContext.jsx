import { createContext, useState, useEffect } from "react";

// Contexto de usuario
export const UserContext = createContext();

// Proveedor del contexto de usuario
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (userData) => {
    const image =
      userData.image && !userData.image.startsWith("http")
        ? `http://localhost:8080${userData.image}`
        : userData.image || null;

    const userWithCorrectImage = { ...userData, image };
    setUser(userWithCorrectImage);
    localStorage.setItem("user", JSON.stringify(userWithCorrectImage));
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const updateUser = (updatedFields) => {
    const image =
      updatedFields.image && !updatedFields.image.startsWith("http")
        ? `http://localhost:8080${updatedFields.image}`
        : updatedFields.image || user?.image || null;

    const updatedUser = { ...user, ...updatedFields, image };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
