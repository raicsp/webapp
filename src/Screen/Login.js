import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../style.css'; // Import your CSS file for styling

function Login() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();

    // Basic validation
    if (!email || !password) {
      alert('Login Failed: All fields are required');
      return;
    }

    // Simulating successful login for demonstration purposes
    if (email === 'test@example.com' && password === 'password') {
      alert(`Login successful: Welcome back, ${email}!`);
      navigate('/profile'); // Use navigate instead of history.push
    } else {
      alert('Login failed: Wrong email or password');
    }

    // Clear password field after attempting to log in
    setPassword('');
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src="/images/bsu.png" alt="Logo" className="logo" />
      </div>
      <div className="form-container">
        <h2>Login to your Account</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button type="submit" className="login-button">Log in</button>
        </form>
        <button onClick={() => navigate('/register')} className="create-account-button">
          CREATE AN ACCOUNT
        </button>
      </div>
    </div>
  );
}

export default Login;
