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

function BookCreate() {
  const token = Cookies.get("token");

  useEffect(() => {
    // Cek apakah ada token (pengguna sudah login)
    const token = Cookies.get("token");
    if (!token) {
      //redirect login page
      Router.push("/login");
    }
  }, []);

  //state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image_url, setImage_url] = useState("");
  const [release_year, setRelease_year] = useState("");
  const [price, setPrice] = useState("");
  const [total_page, setTotal_page] = useState("");
  const [category_id, setCategory_id] = useState("");

  //state validation
  const [validation, setValidation] = useState({});

  //state for category options
  const [categoryOptions, setCategoryOptions] = useState([]);

  //fetch category options from the server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BACKEND}/api/categories`
        );
        const categories = response.data.data.data;

        //set category options
        setCategoryOptions(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  //method "storeBook"
  const storeBook = async (e) => {
    e.preventDefault();

    //define formData
    const formData = new FormData();

    //append data to "formData"
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image_url", image_url);
    formData.append("release_year", release_year);
    formData.append("price", price);
    formData.append("total_page", total_page);
    formData.append("category_id", category_id);

    //send data to server
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/books`, formData)
      .then(() => {
        //redirect
        Router.push("/books");
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
                <form onSubmit={storeBook}>
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">Title</label>
                    <input
                      className="form-control"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Masukkan Title"
                    />
                  </div>
                  {validation.title && (
                    <div className="alert alert-danger">{validation.title}</div>
                  )}

                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">Description</label>
                    <input
                      className="form-control"
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Masukkan Description"
                    />
                  </div>
                  {validation.description && (
                    <div className="alert alert-danger">
                      {validation.description}
                    </div>
                  )}

                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">Image Url</label>
                    <input
                      className="form-control"
                      type="text"
                      value={image_url}
                      onChange={(e) => setImage_url(e.target.value)}
                      placeholder="Masukkan Image Url"
                    />
                  </div>
                  {validation.image_url && (
                    <div className="alert alert-danger">
                      {validation.image_url}
                    </div>
                  )}

                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">Release Year</label>
                    <input
                      className="form-control"
                      type="number"
                      value={release_year}
                      min="1980"
                      max="2021"
                      onChange={(e) => setRelease_year(e.target.value)}
                      placeholder="Masukkan Release Year"
                    />
                  </div>
                  {validation.release_year && (
                    <div className="alert alert-danger">
                      {validation.release_year}
                    </div>
                  )}

                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">Price</label>
                    <input
                      className="form-control"
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Masukkan Price"
                    />
                  </div>
                  {validation.price && (
                    <div className="alert alert-danger">{validation.price}</div>
                  )}

                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">Total Page</label>
                    <input
                      className="form-control"
                      type="number"
                      value={total_page}
                      onChange={(e) => setTotal_page(e.target.value)}
                      placeholder="Masukkan Total Page"
                    />
                  </div>
                  {validation.total_page && (
                    <div className="alert alert-danger">
                      {validation.total_page}
                    </div>
                  )}

                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">Category</label>
                    <select
                      className="form-control"
                      value={category_id}
                      onChange={(e) => setCategory_id(e.target.value)}
                    >
                      <option value="">Pilih Category</option>
                      {categoryOptions.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {validation.category_id && (
                    <div className="alert alert-danger">
                      {validation.category_id}
                    </div>
                  )}

                  <button
                    className="btn btn-primary border-0 shadow-sm"
                    type="submit"
                  >
                    SIMPAN
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

export default BookCreate;
