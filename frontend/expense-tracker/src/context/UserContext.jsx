import { useState, createContext } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // function to update user data
    const updateUser = (userData) => {
        setUser(userData);
    };

    // function to clear user data (on logout)
    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token"); // optional but recommended
    };

    return (
        <UserContext.Provider value={{ user, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;