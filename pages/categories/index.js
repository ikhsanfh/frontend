//layout
import Layout from "../../components/layout";

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
export async function getServerSideProps() {
  //http request
  const req = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND}/api/categories`
  );
  const res = await req.data.data.data;

  return {
    props: {
      categories: res, // <-- assign response
    },
  };
}

function CategoryIndex(props) {
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
  const { categories } = props;

  //router
  const router = useRouter();

  //refresh data
  const refreshData = () => {
    router.replace(router.asPath);
  };

  //function "deletePost"
  const deleteCategory = async (id) => {
    //sending
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/categories/${id}`
    );

    //refresh data
    refreshData();
  };

  return (
    <Layout>
      <div className="container" style={{ marginTop: "80px" }}>
        <div className="row">
          <div className="col-md-12">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body">
                <Link href="/categories/create">
                  <button className="btn btn-primary border-0 shadow-sm mb-3">
                    TAMBAH
                  </button>
                </Link>
                <table className="table table-bordered mb-0">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={category.id}>
                        <td>{index + 1}</td>
                        <td>{category.name}</td>
                        <td className="text-center">
                          <Link href={`/categories/edit/${category.id}`}>
                            <button className="btn btn-sm btn-primary border-0 shadow-sm mb-3 me-3">
                              EDIT
                            </button>
                          </Link>
                          <button
                            onClick={() => deleteCategory(category.id)}
                            className="btn btn-sm btn-danger border-0 shadow-sm mb-3"
                          >
                            DELETE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CategoryIndex;
