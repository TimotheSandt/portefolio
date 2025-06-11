import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NavBar.css";

interface LogoProps {
  children?: React.ReactNode;
  src: string;
}

interface LinkProps {
  children?: React.ReactNode;
  title: string;
  href: string;
  className?: string;
  onClick?: () => void;
}

interface NavLinksProps {
  children: React.ReactNode;
  className?: string;
}

export interface NavBarLink {
  title: string;
  href: string;
  subLinks?: NavBarLink[];
}

interface NavBarProps {
  src?: string;
  title: string;
  links: NavBarLink[];
}

function Logo({ children, src }: LogoProps) {
  const navigate = useNavigate();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="logo-container">
      {src && (
        <a href="/" onClick={handleLogoClick}>
          <img className="logo" src={src} alt="logo" />
        </a>
      )}
      {children && <h1 className="title">{children}</h1>}
    </div>
  );
}

function Link({ children, title, href, className = "link", onClick }: LinkProps) {
  const ref = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    const handleMouseOver = () => {
      if (ref.current) {
        const subLinks = ref.current.querySelector<HTMLDivElement>(".sub-links");
        if (subLinks) {
          subLinks.style.display = "flex";
          subLinks.style.flexDirection = "column";
        }
      }
    };

    const handleMouseOut = () => {
      if (ref.current) {
        const subLinks = ref.current.querySelector<HTMLDivElement>(".sub-links");
        if (subLinks) {
          subLinks.style.display = "none";
        }
      }
    };

    ref.current?.addEventListener("mouseover", handleMouseOver);
    ref.current?.addEventListener("mouseout", handleMouseOut);

    return () => {
      ref.current?.removeEventListener("mouseover", handleMouseOver);
      ref.current?.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
  };

  return (
    <li ref={ref}>
      <a className={className} href={href} onClick={handleClick}>
        {title}
      </a>
      {children && <SubLinks>{children}</SubLinks>}
    </li>
  );
}

function NavLinks({ children, className = "nav-links" }: NavLinksProps) {
  return <ul className={className}>{children}</ul>;
}

function SubLinks({ children, style }: NavLinksProps & { style?: React.CSSProperties }) {
  return (
    <NavLinks className="links sub-links">
      <div style={style}>{children}</div>
    </NavLinks>
  );
}

function SubLinkList({ title, href, subLinks }: NavBarLink) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = () => {
    // Vérifier si c'est un lien avec hash (section)
    if (href.startsWith("/#")) {
      const sectionId = href.substring(2); // Enlever "/#"

      // Si on est déjà sur la page d'accueil
      if (location.pathname === "/") {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      } else {
        // Naviguer vers la page d'accueil puis scroller
        navigate("/");
        // Attendre que la navigation soit terminée
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      }
    } else {
      // Navigation normale pour les autres liens
      navigate(href);
    }
  };

  return (
    <Link title={title} href={href} onClick={handleLinkClick}>
      {subLinks?.map((subLink, index) => (
        <SubLinkList key={`${title}-${index}`} {...subLink} />
      ))}
    </Link>
  );
}

function NavBar({ src = "", title, links }: NavBarProps) {
  return (
    <nav className="navbar">
      <Logo src={src}>{title}</Logo>
      <NavLinks>
        {links.map((link, index) => (
          <SubLinkList key={`link-${index}`} {...link} />
        ))}
      </NavLinks>
    </nav>
  );
}

export default NavBar;
