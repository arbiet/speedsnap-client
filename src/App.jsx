// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Layout from './Pages/Layout';
import Home from './Pages/Home';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import Users from './Pages/Users/Users';
import AddUser from './Pages/Users/AddUser';
import EditUser from './Pages/Users/EditUser';
import SpeedTest from './Pages/SpeedTest/SpeedTest';
import Recommendations from './Pages/Recommendations';
import ServiceProviders from './Pages/ISPs/ServiceProviders';
import AddServiceProvider from './Pages/ISPs/AddServiceProvider';
import EditServiceProvider from './Pages/ISPs/EditServiceProvider';
import CoverageAreas from './Pages/ISPs/CoverageAreas';
import AddCoverageArea from './Pages/ISPs/AddCoverageArea';
import EditCoverageArea from './Pages/ISPs/EditCoverageArea';
import ServiceTypes from './Pages/ISPs/ServiceTypes';
import AddServiceType from './Pages/ISPs/AddServiceType';
import EditServiceType from './Pages/ISPs/EditServiceType';
import PlanDetails from './Pages/ISPs/PlanDetails';
import AddPlanDetail from './Pages/ISPs/AddPlanDetail';
import EditPlanDetail from './Pages/ISPs/EditPlanDetail';
import AliasList from './Pages/Aliases/AliasList';
import AddAlias from './Pages/Aliases/AddAlias';
import EditAlias from './Pages/Aliases/EditAlias';
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
          <Route path='/speedtest' element={ <SpeedTest />} />
          <Route path='/recommendations' element={<Recommendations />} />
          <Route path='/service_providers' element={token ? <ServiceProviders /> : <Login />} />
          <Route path='/service_providers/new' element={token ? <AddServiceProvider /> : <Login />} />
          <Route path='/service_providers/:id/edit' element={token ? <EditServiceProvider /> : <Login />} />
          <Route path='/coverage_areas' element={token ? <CoverageAreas /> : <Login />} />
          <Route path='/coverage_areas/new' element={token ? <AddCoverageArea /> : <Login />} />
          <Route path='/coverage_areas/:id/edit' element={token ? <EditCoverageArea /> : <Login />} />
          <Route path='/service_types' element={token ? <ServiceTypes /> : <Login />} />
          <Route path='/service_types/new' element={token ? <AddServiceType /> : <Login />} />
          <Route path='/service_types/:id/edit' element={token ? <EditServiceType /> : <Login />} />
          <Route path='/plan_details' element={token ? <PlanDetails /> : <Login />} />
          <Route path='/plan_details/new' element={token ? <AddPlanDetail /> : <Login />} />
          <Route path='/plan_details/:id/edit' element={token ? <EditPlanDetail /> : <Login />} />
          <Route path='/aliases' element={token ? <AliasList /> : <Login />} />
          <Route path='/aliases/new' element={token ? <AddAlias /> : <Login />} />
          <Route path='/aliases/:id/edit' element={token ? <EditAlias /> : <Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
