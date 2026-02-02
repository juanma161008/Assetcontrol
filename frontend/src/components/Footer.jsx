import "../styles/Global.css";
import m5Logo from "../assets/logom5.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <img src={m5Logo} alt="Micro5" className="footer-logo" />
      </div>

      <div className="footer-center">
        © 2026 Microcinco · AssetControl
      </div>

      <div className="footer-right">
        <i className="fab fa-facebook"></i>
        <i className="fab fa-instagram"></i>
        <i className="fab fa-twitter"></i>
      </div>
    </footer>
  );
}
