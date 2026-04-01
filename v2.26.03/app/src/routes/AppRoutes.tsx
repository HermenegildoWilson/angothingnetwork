import { Routes, Route } from "react-router-dom";

import AppLayout from "@/Layout/AppLayout";

import ProtectedRoute from "./ProtectedRoute";
import NotFound from "@/pages/public/NotFound";
import Home from "@/pages/public/Home";
import SignIn from "@/pages/public/SignIn";
import SignUp from "@/pages/public/SignUp";
import SignOut from "@/pages/public/SignOut";
import VerifyEmail from "@/pages/public/VerifyEmail";
import ValidateSignUp from "@/pages/public/ValidateSignUp";
import Main from "@/pages/screens/Index";
import Devices from "@/pages/screens/Devices/Devices";
import Users from "@/pages/screens/user/Users";
import Profile from "@/pages/screens/user/Profile";
import Device from "@/pages/screens/Devices/Device";
import Notifications from "@/pages/screens/Notifications/Notifications";
import Dashboard from "@/pages/screens/Dashboard/Dashboard";
import History from "@/pages/screens/Dashboard/History";

export default function AppRoutes() {  

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/**
         * PROTECTED PAGES (ROUTES)
         */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Main />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />

          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />

          <Route path="/devices" element={<Devices />} />
          <Route path="/devices/:id" element={<Device />} />
          
          <Route path="/notifications" element={<Notifications />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/**
         *  PUBLIC PAGES (ROUTES)
         */}
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup/verify" element={<VerifyEmail />} />
        <Route path="/signup/validate" element={<ValidateSignUp />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
