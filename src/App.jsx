import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Layout from './Pages/Layout';
import Home from './Pages/Home';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import Users from './Pages/Users/Users';
import AddUser from './Pages/Users/AddUser';
import EditUser from './Pages/Users/EditUser';
import { useContext } from 'react';
import { AppContext } from './Context/AppContext';

export default function App() {
  const { token } = useContext(AppContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/register' element={token ? <Home /> : <Register />} />
          <Route path='/login' element={token ? <Home /> : <Login />} />
          <Route path='/users' element={token ? <Users /> : <Login />} />
          <Route path='/users/new' element={token ? <AddUser /> : <Login />} />
          <Route path='/users/:id/edit' element={token ? <EditUser /> : <Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
