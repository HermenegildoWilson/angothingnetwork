import { Routes, Route } from "react-router-dom";

import AppLayout from "@/Layout/AppLayout";

import ProtectedRoute from "./ProtectedRoute";
import NotFound from "@/pages/public/NotFound";
import Home from "@/pages/public/Home";
import SignIn from "@/pages/public/SignIn";
import SignUp from "@/pages/public/SignUp";
import SignOut from "@/pages/public/SignOut";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/**
         * PROTECTED PAGES (ROUTES)
         */}
        <Route element={<ProtectedRoute />}>
          <Route path="*" element={<NotFound />} />
        </Route>

        {/**
         *  PUBLIC PAGES (ROUTES)
         */}
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="*" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
