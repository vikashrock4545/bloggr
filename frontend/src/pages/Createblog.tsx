import { Button } from "@/components/ui/button"
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem,
     DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp'
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'

export default function Component() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [isPublishing, setIsPublishing] = useState(false)

  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/signin')
  }

  useEffect(() => {
    setIsPublishing(true)
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/signin')
    }
  }, [navigate])

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
    try {
        await axios.post("https://backend.vikashr4545.workers.dev/api/v1/blog", 
            {
              title,
              content
            },
            { headers }
        )
        navigate('/blog')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.log("Response status code:", err.response.status);
          if(err.response.status === 400) {
            setError("Invalid input, please provide correct input")
          } else {
              setError("you must be signed in to publish, please sign in using credentials");
          }
      } else if (err.request) {
          console.error("No response received:", err.request);
          setError("No response received from the server. Please try again later.");
      } else {
          console.error("Error:", err.message);
          setError("An unexpected error occurred. Please try again later.");
        }
      }
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <header className="w-full max-w-2xl px-6 py-4 bg-white rounded-t-lg shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-full" size="icon" variant="ghost">
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
            <a
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              href="/blog"
            >
              Home
            </a>
          </div>
        </div>
      </header>
      <div className="w-full max-w-2xl p-6 bg-white rounded-b-lg shadow-md">
        <form className="space-y-6" onSubmit={handleCreateBlog}>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="title">
              Title
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              id="title"
              placeholder="Enter your blog post title"
              type="text"
              onChange={e => {
                setTitle(e.target.value)
              }}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="content">
              Content
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              id="content"
              placeholder="Enter your blog post content"
              rows={10}
              onChange={e => {
                setContent(e.target.value)
              }}
            />
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div>
            {error && (
                <p className="text-red-500">
                  {error}
                  {error.includes("sign in") && (
                    <a href="/signin" className="text-blue-600 underline"> Sign in</a>
                  )}
                </p>
              )}
            </div>
            <Button
              className="px-4 py-2 font-medium text-gray-900 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              type="submit" disabled={isPublishing}
            >
              {isPublishing ? "Publishing Blog..." : "Publish"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}