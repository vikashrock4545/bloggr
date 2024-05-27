import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Component() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const [isSigningin, setIsSigningin] = useState(false)

  const handleSignin = async () => {
    try {
        setIsSigningin(true)
        const response = await axios.post("https://backend.vikashr4545.workers.dev/api/v1/user/signin", {
            email,
            password,
        });

        localStorage.setItem("token", response.data.jwt);
        navigate('/blog');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.log("Response status code:", err.response.status);
          if (err.response.status === 403) {
              setError("User not found, please provide correct input");
          } else if(err.response.status === 400) {
            setError("Invalid input, please provide correct input")
          } else {
            setError("An unexpected error occurred. Please try again later.");
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
      setIsSigningin(false)
    }
}
  return (
    <div className="w-full gap-10 lg:grid lg:min-h-[600px] lg:grid-cols-2 lg:gap-0 xl:min-h-[800px]">
      <div className="flex items-center justify-center p-6 xl:p-10">
        <div className="mx-auto w-[350px] space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Sign In</h2>
            <p className="text-gray-500 dark:text-gray-400">Enter your email and password to sign in.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="block text-sm font-medium" htmlFor="email">
                Email
              </Label>
              <Input id="email" placeholder="me@example.com" type="email" onChange={e => {
                setEmail(e.target.value)
              }} />
            </div>
            <div className="space-y-2">
              <Label className="block text-sm font-medium" htmlFor="password">
                Password
              </Label>
              <Input id="password" placeholder="Password" type="password" onChange={e => {
                setPassword(e.target.value)
              }}/>
            </div>
            <Button className="w-full" onClick={handleSignin} disabled={isSigningin}>{isSigningin ? "Signing in...." : "Sign In"}</Button>
            <div className="text-center text-gray-500 dark:text-gray-400">
              {error && <p className="text-red-500">{error}</p>}
              Don't have an account?
              <a className="text-blue-600 underline" href="/">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="items-center justify-center p-6 lg:flex lg:bg-gray-100 lg:p-10 dark:lg:bg-gray-800">
        <div className="mx-auto grid max-w-[350px] gap-3 lg:max-w-[500px]">
          <blockquote className="text-lg font-semibold leading-snug lg:text-xl lg:leading-normal xl:text-2xl">
            “The platform has been a game-changer for our business. The intuitive interface and powerful features have
            streamlined our workflows and boosted our productivity.“
          </blockquote>
          <div>
            <div className="font-semibold">Emily Chen</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">CTO, Acme Corp</div>
          </div>
        </div>
      </div>
    </div>
  )
}