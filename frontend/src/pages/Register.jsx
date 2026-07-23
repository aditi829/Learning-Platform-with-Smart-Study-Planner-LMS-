import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import "/src/pages/Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    try {
      await API.post("/register", {
        name,
        email,
        password,
      });

      navigate("/");
    } catch (err) {
      setError("Something went wrong. Try again.");
      console.log(err);
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>
        <p className="subtitle">Register to get started</p>

        <form className="register-form" onSubmit={submit}>
          <input
            className="input"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="error-box">{error}</div>}

          <button className="btn" type="submit">
            Register
          </button>
        </form>

        {/* LOGIN LINK ADDED HERE */}
        <p className="footer-text">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;