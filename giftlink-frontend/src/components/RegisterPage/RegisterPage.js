import React, { useState } from 'react';
// Task 1: Import the backend URL configuration
import { urlConfig } from '../../config';
// Task 2: Import context to manage login state globally
import { useAppContext } from '../../context/AuthContext';
// Task 3: Import useNavigate for redirection after successful registration
import { useNavigate } from 'react-router-dom';

import './RegisterPage.css';

function RegisterPage() {
    // Form field states
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Task 4: State to show error messages
    const [showerr, setShowerr] = useState('');

    // Task 5: Setup navigation and context function
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    // This function is triggered when the Register button is clicked
    const handleRegister = async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST', // Task 6: HTTP method
                headers: {      // Task 7: Request headers
                    'content-type': 'application/json',
                },
                body: JSON.stringify({  // Task 8: Request body with user data
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                }),
            });

            const json = await response.json(); // Step 2: Parse response as JSON

            if (json.authtoken) {
                // Save user session data
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', firstName);
                sessionStorage.setItem('email', json.email);
                setIsLoggedIn(true);         // Update login state
                navigate('/app');            // Redirect to main page
            }

            if (json.error) {
                setShowerr(json.error);      // Display backend error message
            }
        } catch (e) {
            console.log('Error fetching details: ' + e.message);
            setShowerr('Registration failed. Please try again.');
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Register</h2>

                        <div className="mb-4">
                            <label htmlFor="firstName" className="form label"> First Name</label>
                            <input
                                id="firstName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="lastName" className="form label"> Last Name</label>
                            <input
                                id="lastName"
                                type="text"
                                className="form-control"
                                placeholder="Enter your last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="form label"> Email</label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="form label"> Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Task 6: Show error if any */}
                        <div className="text-danger">{showerr}</div>

                        <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>
                            Register
                        </button>

                        <p className="mt-4 text-center">
                            Already a member? <a href="/app/login" className="text-primary">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;
