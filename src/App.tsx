import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { RequireAuth } from './components/RequireAuth';
import { NavBar } from './components/NavBar';
import HomePage from './pages/HomePage';
import { UserPage } from './pages/UserPage';
import { AddUserForm } from './components/AddUserForm';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './contexts/authContext/AuthProvider';

function App() {
    return (
        <AuthProvider>
            <UserProvider>
                <Router>
                    <div className="min-h-screen bg-gray-50">
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route
                                path="/"
                                element={
                                    <RequireAuth>
                                        <>
                                            <NavBar />
                                            <HomePage />
                                        </>
                                    </RequireAuth>
                                }
                            />
                            <Route
                                path="/user/:id"
                                element={
                                    <RequireAuth>
                                        <>
                                            <NavBar />
                                            <UserPage />
                                        </>
                                    </RequireAuth>
                                }
                            />
                            <Route
                                path="/add-user"
                                element={
                                    <RequireAuth>
                                        <>
                                            <NavBar />
                                            <AddUserForm />
                                        </>
                                    </RequireAuth>
                                }
                            />
                        </Routes>
                    </div>
                </Router>
            </UserProvider>
        </AuthProvider>
    );
}

export default App;
