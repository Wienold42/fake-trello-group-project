import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <ul className="nav">
      <li className="home-box">
        <NavLink to="/" id="home-bttn">Home</NavLink>
      </li>
      
      <li>
        <h1 id="logo">TRILLO</h1>
      </li>

      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
