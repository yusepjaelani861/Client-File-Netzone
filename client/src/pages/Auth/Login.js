import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) {
            setError(data.message);
            setLoading(false);
        } else {
            setLoading(false);
            //   history.push("/");
            document.cookie = `token=${data.data.token}; path=/; expires=${data.data.expires_at};`;
            console.log('cookie:', document.cookie);
            window.location.href = "/dashboard";
        }
        // window.location.href = "/";
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };
  return (
    <div className="bg-light-blue-500 h-[80vh] flex justify-center items-center">
      <div className="bg-white w-2/5 p-4 rounded">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-2 rounded w-full focus:outline-none"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
