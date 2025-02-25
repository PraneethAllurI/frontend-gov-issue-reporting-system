import { useState } from 'react';
import api from '../../axios';
import { Link } from 'react-router-dom';
import { saveAccessToken } from '../../utils/authUtils';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(aadhar, name, email, password)
    try {
      const response = await api.post('api/register', {
        aadhar :aadhar,
        username:name,
        email :email,
        password :password
      });

      // Store the JWT token in localStorage after successful signup
      saveAccessToken(response.data.token);
      window.location.href = '/login'; // Redirect to a protected route after signup
    } catch (err) {
      setError(err.response.data.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="aadhar" className="block text-gray-700">Aadhar No:</label>
            <input
              type="text"
              id="aadhar"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg focus:outline-none hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
        <Link to = "/login">Login</Link>
      </div>
    </div>
  );
}

export default Signup;