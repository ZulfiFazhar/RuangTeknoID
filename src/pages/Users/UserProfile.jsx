/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams, Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/components/auth/auth-context";
import LoginFirst from "@/components/auth/login-first";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronRight,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  Cake,
  Pin,
  GraduationCap,
} from "lucide-react";

function UserProfile() {
  const { authStatus } = useContext(AuthContext);
  const [isDialogOpen, setIsDialogOpen] = useState(!authStatus.authStatus);
  const navigate = useNavigate();

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // redirect to home
    navigate("/");
  };

  const handleEditProfile = () => {
  }

  return (
    <div className="space-y-5 w-4/5 m-auto">
      <LoginFirst isOpen={isDialogOpen} onClose={handleCloseDialog} />
      <Link
        to="/users/settings"
        className="underline p-0 text-xl font-bold"
      >
        Update Profile
      </Link>
      <Card className="py-3 rounded-lg flex items-center justify-between space-x-4 p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={authStatus.user.profile_image_url} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{authStatus.user.name}</h2>
            <p className="text-sm text-gray-500">
              Bandung <ChevronRight className="size-4 inline" /> Dipatiukur
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-500 transition-colors duration-200">
            <Linkedin size={20} />
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-500 transition-colors duration-200">
            <Facebook size={20} />
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-500 transition-colors duration-200">
            <Instagram size={20} />
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-500 transition-colors duration-200">
            <Twitter size={20} />
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <h1 className="text-xl font-bold mb-8">Semua Informasi Pribadi</h1>
        <div className="grid grid-cols-3 gap-8">
          {/* Column 1 */}
          <div>
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-200">
                <Mail size={25} />
              </div>
              <div>
                <h3 className="font-medium">rugby123@gmail.com</h3>
                <p className="text-sm text-gray-500">Alamat Mail</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-200">
                <Cake size={25} />
              </div>
              <div>
                <h3 className="font-medium">03 Januari 2005</h3>
                <p className="text-sm text-gray-500">Hari Ulang Tahun</p>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-200">
                <Phone size={25} />
              </div>
              <div>
                <h3 className="font-medium">+628123456789</h3>
                <p className="text-sm text-gray-500">Nomor Telepon</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-200">
                <Pin size={25} />
              </div>
              <div>
                <h3 className="font-medium">Bandung</h3>
                <p className="text-sm text-gray-500">Alamat</p>
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div>
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-200">
                <Linkedin size={25} />
              </div>
              <div>
                <h3 className="font-medium">Data Analisis</h3>
                <p className="text-sm text-gray-500">Pekerjaan</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-200">
                <GraduationCap size={25} />
              </div>
              <div>
                <h3 className="font-medium">Universitas Komputer Indonesia</h3>
                <p className="text-sm text-gray-500">Akademi</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card className="py-3 rounded-lg p-4">
        <h1 className="text-xl font-bold mb-7">Aktivitas</h1>
        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1">
            <h1 className="text-lg font-bold mb-1">
              Dari Nol hingga Bisa: Membangun Aplikasi Web Dinamis Pertama Anda
              dengan React
            </h1>
            <p>
              Pelajari cara membangun aplikasi web dinamis pertama Anda dengan
              React JS dari nol! ...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Erik Lusanto - 5 Januari 2021
            </p>
          </div>
          <img
            className="w-40 h-20 object-cover rounded-xl"
            src="https://images.unsplash.com/photo-1724166573009-4634b974ebb2?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="JavaScript interaction illustration"
          />
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1">
            <h1 className="text-lg font-bold mb-1">
              Masa Depan AI: Dari Otomasi hingga Kreativitas
            </h1>
            <p>Kecerdasan buatan terus berkembang, tidak hanya dalam...</p>
            <p className="text-sm text-gray-500 mt-2">
              Marjosse S.I - 10 Desember 2021
            </p>
          </div>
          <img
            className="w-40 h-20 object-cover rounded-xl"
            src="https://images.unsplash.com/photo-1724166573009-4634b974ebb2?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="JavaScript interaction illustration"
          />
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1">
            <h1 className="text-lg font-bold mb-1">
              Cloud Computing: Fondasi Digital di Era Modern
            </h1>
            <p>
              Cloud computing memungkinkan akses data dan layanan dari mana
              saja, mengubah...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Sinta Kusina - 1 Januari 2022
            </p>
          </div>
          <img
            className="w-40 h-20 object-cover rounded-xl"
            src="https://images.unsplash.com/photo-1724166573009-4634b974ebb2?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="JavaScript interaction illustration"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-lg font-bold mb-1">
              Keamanan Siber di Dunia yang Semakin Terkoneksi
            </h1>
            <p>
              Dengan semakin banyaknya perangkat yang terhubung ke internet,
              ancaman keamanan siber..
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Indah Guretno - 2 April 2020
            </p>
          </div>
          <img
            className="w-40 h-20 object-cover rounded-xl"
            src="https://images.unsplash.com/photo-1724166573009-4634b974ebb2?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="JavaScript interaction illustration"
          />
        </div>
        <Button
          variant="ghost"
          onClick={handleEditProfile}
          className="w-full bg-[#0E1326] text-white py-5 rounded-xl text-lg font-semibold mt-7"
        >
          Lihat Semuanya
        </Button>
      </Card>
      <Card className="py-3 rounded-lg p-4">
        <h1 className="text-xl font-bold mb-7">Status</h1>

        <div className="relative inline-block w-full">
          {/* Button Dropdown */}
          <details className="w-full">
            <summary className="cursor-pointer list-none bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex justify-between items-center">
              Pilih Status <span className="ml-2">▼</span>
            </summary>

            {/* Dropdown Menu */}
            <ul className="absolute left-0 mt-2 w-full bg-white shadow-lg rounded-md border z-10">
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                Freelance UMR Yogyakarta
              </li>
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                Full-Time Employee
              </li>
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                Part-Time Worker
              </li>
            </ul>
          </details>
        </div>
      </Card>
    </div>
  );
}

export default UserProfile;
