import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">
        <Link to="/">Knitting Toolkit</Link>
      </h1>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/breed-explorer">Breed Explorer</Link>
        <Link to="/gauge-calculator">Gauge Calculator</Link>
        <Link to="/yarn-calculator">Yarn Calculator</Link>
        <Link to="/project-tracker">Project Tracker</Link>
        <Link to="/shop">Shop</Link>
      </div>
    </nav>
  );
}