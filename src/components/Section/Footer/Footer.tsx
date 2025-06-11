import "./Footer.css";

import { useEffect } from "react";

export type FooterProps = {
  children?: React.ReactNode;
  src?: string;
  content?: string;
};

function Footer({ children, src = "", content = "" }: FooterProps) {
  return (
    <footer>
      {children}
      <div className="footer">
        <div className="footer-logo">{src && <img src={src} alt="logo" />}</div>
        <p className="footer-text">&copy; {new Date().getFullYear()} - {content && content + "."} All rights reserved.</p>
        <div />
      </div>
    </footer>
  );
}

export function FooterTime() {
  useEffect(() => {
    const interval = setInterval(() => {
      const footerTimeElement = document.querySelector(".footer-time");
      if (footerTimeElement) {
        footerTimeElement.textContent = new Date().toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris" });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div className="footer-time">{new Date().toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris" })}</div>;
}

export default Footer;
