import { useState, useEffect } from "react";
import axios from "axios";
import TopBar from "@/components/topbar";
import { AvatarFallback, Avatar } from "@/components/ui/avatar";
interface Blog {
  id: string;
  title: string;
  content: string;
  createdAt: string; // You might want to change this to a Date type if possible
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
}


export default function Component() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://backend.vikashr4545.workers.dev/api/v1/blog/bulk");
        setBlogs(response.data.posts);
      } catch (err) {
        setError("Failed to fetch blog data. Please try again later.");
      }
    };

    fetchBlogs();
  }, []);
  
  return (
    <>
      <TopBar />
      <div className="px-4 py-6 md:px-6 lg:py-16 md:py-12">
        <article className="prose prose-gray mx-auto dark:prose-invert">
          {error && <p className="text-red-500">{error}</p>}
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog.id} className="space-y-2 not-prose">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl lg:leading-[3.5rem]">
                  {blog.title}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">Posted on {new Date(blog.createdAt).toLocaleDateString()}</p>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_300px]">
                  <div>
                    <p>{blog.content}</p>
                    {/* TODO */}
                    {/* <a className="inline-flex items-center gap-2 font-medium text-primary hover:underline" href="#">
                      Read More
                      <ArrowRightIcon className="h-4 w-4" />
                    </a> */}
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-100 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
                    <div className="flex items-center space-x-4">
                      {blog.author ? (
                        <>
                          <Avatar>
                            {/* <AvatarImage alt={blog.author.name} src={blog.author.avatar || "/placeholder-avatar.jpg"} /> */}
                            <AvatarFallback>{blog.author.name.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{blog.author.name}</div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {blog.author.bio}
                            </p>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Author unknown</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !error && <p>Loading...</p>
          )}
        </article>
      </div>
    </>
  );
}

// function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M5 12h14" />
//       <path d="m12 5 7 7-7 7" />
//     </svg>
//   );
// }
