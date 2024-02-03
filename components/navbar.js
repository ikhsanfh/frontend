import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
//import axios
import axios from "axios";
import Router from "next/router";
function Navbar() {
  const token = Cookies.get("token");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Cek apakah ada token (pengguna sudah login)
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  }, []);

  const logoutHanlder = async () => {
    //set axios header dengan type Authorization + Bearer token
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    //fetch Rest API
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/logout`)
      .then(() => {
        //remove token from cookies
        Cookies.remove("token");

        //redirect halaman login
        Router.push("/login");
      });
  };

  return (
    <header>
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark fixed-top border-0 shadow-sm">
        <div className="container">
          <Link legacyBehavior href="/">
            <a className="navbar-brand">LARAVEL & NEXT.JS</a>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link legacyBehavior href="/categories">
                      <a className="nav-link">Category</a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link legacyBehavior href="/books">
                      <a className="nav-link">Book</a>
                    </Link>
                  </li>

                  <button
                    onClick={logoutHanlder}
                    className="btn btn-md btn-danger ms-3 mb-2 mb-lg-0"
                  >
                    LOGOUT
                  </button>
                </>
              )}
            </ul>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {!isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link legacyBehavior href="/register">
                      <a className="nav-link btn btn-primary btn-sm text-white shadow border-0 me-3">
                        REGISTER
                      </a>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link legacyBehavior href="/login">
                      <a className="nav-link btn btn-success btn-sm text-white shadow border-0">
                        LOGIN
                      </a>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
