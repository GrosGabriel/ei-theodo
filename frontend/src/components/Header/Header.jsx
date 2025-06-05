import { Link } from 'react-router-dom';
import './Header.css';
import { useState, useRef, useEffect } from 'react';

const Header = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="Header-container" ref={menuRef}>
      <button
        className="menu-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Ouvrir le menu"
      >
        ☰
      </button>
      {open && (
        <div className="dropdown-menu-header">
          <Link className="Link" to="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link className="Link" to="/users" onClick={() => setOpen(false)}>
            Users
          </Link>
          <Link className="Link" to="/add-movies" onClick={() => setOpen(false)}>
            Add Movies
          </Link>
          <Link className="Link" to="/about" onClick={() => setOpen(false)}>
            About
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;
