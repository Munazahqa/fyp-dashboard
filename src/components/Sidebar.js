import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
    const location = useLocation();
    
    const menuItems = [
        { path: "/", label: "Home" },
      //  { path: "/nodes", label: "Nodes" },
        { path: "/pods", label: "Pods" },
        { path: "/history", label: "History" },
        { path: "/settings", label: "Settings" },
        { path: "/logout", label: "Logout" }
    ];

    return (
        <div className="bg-white vh-100 p-3 border-end" style={{ width: '200px' }}>
            <ul className="list-unstyled mt-8">
                {menuItems.map((item) => (
                    <li key={item.label} className="mb-4 text-center">
                        <Link 
                            to={item.path} 
                            className={`text-dark text-decoration-none p-2 d-block rounded menu-item fs-5 
                                ${location.pathname === item.path ? 'active-link' : ''}`}
                        >
                            <span>{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;
