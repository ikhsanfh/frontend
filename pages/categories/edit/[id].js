//import layout
import Layout from "../../../components/layout";

//import Link
import Link from "next/link";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

//import axios
import axios from "axios";

//router
import { useRouter } from "next/router";

//import router
import Router from "next/router";

//fetch with "getServerSideProps"
export async function getServerSideProps({ params }) {
  //http request
  const req = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND}/api/categories/${params.id}`
  );
  const res = await req.data.data;

  return {
    props: {
      category: res, // <-- assign response
    },
  };
}

function CategoryEdit(props) {
  const token = Cookies.get("token");

  useEffect(() => {
    // Cek apakah ada token (pengguna sudah login)
    const token = Cookies.get("token");
    if (!token) {
      //redirect login page
      Router.push("/login");
    }
  }, []);
  //destruct
  const { category } = props;

  //state
  const [name, setName] = useState(category.name);

  //state validation
  const [validation, setValidation] = useState({});

  //method "updateCategory"
  const updateCategory = async (e) => {
    e.preventDefault();

    //define formData
    const formData = new FormData();

    //append data to "formData"
    formData.append("name", name);
    formData.append("_method", "PUT");

    //send data to server
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/categories/${category.id}`,
        formData
      )
      .then(() => {
        //redirect
        Router.push("/categories");
      })
      .catch((error) => {
        //assign validation on state
        setValidation(error.response.data);
      });
  };

  return (
    <Layout>
      <div className="container" style={{ marginTop: "80px" }}>
        <div className="row">
          <div className="col-md-12">
            <div className="card border-0 rounded shadow-sm">
              <div className="card-body">
                <form onSubmit={updateCategory}>
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">Nama</label>
                    <input
                      className="form-control"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan Nama"
                    />
                  </div>
                  {validation.name && (
                    <div className="alert alert-danger">{validation.name}</div>
                  )}

                  <button
                    className="btn btn-primary border-0 shadow-sm"
                    type="submit"
                  >
                    UPDATE
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CategoryEdit;
