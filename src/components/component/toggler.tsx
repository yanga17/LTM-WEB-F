'use client'

import { useState, useEffect } from "react";

export function Toggler() {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || "light");

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === "dark");
    }, [theme]);

    return (
        <label className="switch">
            <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme}></input>
            <span className="slider"></span>
        </label>
    );
}
