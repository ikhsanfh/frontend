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
// export async function getServerSideProps() {
//   //http request
//   const req = await axios.get(
//     `${process.env.NEXT_PUBLIC_API_BACKEND}/api/books`
//   );
//   const res = await req.data.data.data;

//   // http request for categories
//   const reqCategories = await axios.get(
//     `${process.env.NEXT_PUBLIC_API_BACKEND}/api/categories`
//   );
//   const resCategories = await reqCategories.data.data.data;

//   return {
//     props: {
//       books: res, // <-- assign response
//       categories: resCategories,
//     },
//   };
// }

export async function getServerSideProps({ query }) {
  const searchTerm = query.search || "";

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/books?search=${searchTerm}`
    );
    const books = response.data.data.data;

    // http request for categories
    const reqCategories = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/categories`
    );
    const resCategories = await reqCategories.data.data.data;

    return {
      props: {
        books,
        categories: resCategories,
      },
    };
  } catch (error) {
    console.error("Error fetching books:", error.message);
    return {
      props: {
        books: [],
        categories: [],
      },
    };
  }
}

function BookIndex(props) {
  const token = Cookies.get("token");

  useEffect(() => {
    // Cek apakah ada token (pengguna sudah login)
    const token = Cookies.get("token");
    if (!token) {
      //redirect login page
      Router.push("/login");
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  //destruct
  const { books, categories } = props;

  //router
  const router = useRouter();

  //refresh data
  const refreshData = () => {
    router.replace(router.asPath);
  };

  //function "deleteBook"
  const deleteBook = async (id) => {
    //sending
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/books/${id}`
    );

    //refresh data
    refreshData();
  };

  function getCategoryName(categoryId) {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  }

  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect ke halaman pencarian dengan menyertakan parameter pencarian
    Router.push(`/books?search=${searchTerm}`);
  };

  return (
    <Layout>
      <div className="container" style={{ marginTop: "80px" }}>
        <div className="row">
          <div className="col-md-12">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body">
                <form className="d-flex mb-3" onSubmit={handleSearch}>
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search Title Buku"
                    aria-label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-success" type="submit">
                    Search
                  </button>
                </form>

                <Link href="/books/create">
                  <button className="btn btn-primary border-0 shadow-sm mb-3">
                    TAMBAH
                  </button>
                </Link>
                <table className="table table-bordered mb-0">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Title</th>
                      <th scope="col">Description</th>
                      <th scope="col">Image</th>
                      <th scope="col">Release Year</th>
                      <th scope="col">Price</th>
                      <th scope="col">Total Page</th>
                      <th scope="col">Thickness</th>
                      <th scope="col">Category</th>
                      <th scope="col">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book, index) => (
                      <tr key={book.id}>
                        <td>{index + 1}</td>
                        <td>{book.title}</td>
                        <td>{book.description}</td>
                        <td>
                          <img
                            src={book.image_url}
                            alt="book"
                            width="150"
                            className="rounded-3"
                          />
                        </td>
                        <td>{book.release_year}</td>
                        <td>{book.price}</td>
                        <td>{book.total_page}</td>
                        <td>{book.thickness}</td>
                        <td>{getCategoryName(book.category_id)}</td>
                        <td className="text-center">
                          <Link href={`/books/edit/${book.id}`}>
                            <button className="btn btn-sm btn-primary border-0 shadow-sm mb-3 me-3">
                              EDIT
                            </button>
                          </Link>
                          <button
                            onClick={() => deleteBook(book.id)}
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

export default BookIndex;
