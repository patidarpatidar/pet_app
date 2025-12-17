import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import PetList from './components/PetList';
import PetDetails from './components/PetDetails';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import AddPet from './components/AddPet';
import AdoptionForm from './components/AdoptionForm';
import Applications from './components/Applications';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className="App">
          <Routes>
            <Route path="/" element={<PetList />} />
            <Route path="/pet/:id" element={<PetDetails />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/add-pet" element={<AddPet />} />
            <Route path="/adopt/:petId" element={<AdoptionForm />} />
            <Route path="/applications" element={<Applications />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
