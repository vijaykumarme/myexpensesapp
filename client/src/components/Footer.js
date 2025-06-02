import React from "react";

import './Footer.css';

const Footer = () => {

    const currentYear = new Date().getFullYear();

    return (
        <footer className="text-light text-center py-3 fixed-bottom">
            <p className="h6 mb-0">myexpenses {currentYear} &reg;</p>
        </footer>
    );
};

export default Footer;



