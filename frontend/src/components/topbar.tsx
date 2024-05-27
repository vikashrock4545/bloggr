import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import axios from "axios";

export default function TopBar() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const response = await axios.get("https://backend.vikashr4545.workers.dev/api/v1/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserName(response.data.name);
      } catch (error) {
        console.error("Failed to fetch user details", error);
        navigate("/signin");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleButtonClick = () => {
    navigate("/add-blog");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-md dark:bg-gray-800 lg:px-12">
      <div className="flex items-center gap-2">
        <div className="font-medium text-gray-900 dark:text-gray-50">{userName || "Loading..."}</div>
      </div>
      <div className="flex items-center gap-2">
        <Button className="inline-flex md:hidden" onClick={handleButtonClick}>
          Create Blog
        </Button>
        <Button
          className="hidden md:inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          onClick={handleButtonClick}
        >
          Create Blog
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-600" size="icon" variant="ghost">
              <AccountCircleSharpIcon fontSize="large" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
