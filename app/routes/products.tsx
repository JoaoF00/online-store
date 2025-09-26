import {
  Form,
  Link,
  useActionData,
  useParams,
  type LoaderFunction,
} from "react-router";
import type { Route } from "./+types/products";

export async function loader() {
  const responseProducts = await fetch("https://dummyjson.com/products");

  if (!responseProducts.ok) {
    throw new Error("Failed to fetch");
  }

  const products = await responseProducts.json();

  const categories = await fetch("https://dummyjson.com/products/categories");

  if (!categories.ok) {
    throw new Error("Failed to fetch");
  }

  const categoriesData = await categories.json();

  return { products: products, categories: categoriesData };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const selectedCategories = formData.getAll("categories") || "";
  const sorting = formData.getAll("sorting") || "";

  if (selectedCategories) {
    const selectedCategory = selectedCategories[0];

    if (selectedCategory) {
      const response = await fetch(
        `https://dummyjson.com/products/category/${selectedCategory}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products for the selected category");
      }

      const products = await response.json();
      return { products: products };
    }
  }

  if (sorting) {
    const sortOption = sorting[0];
    let sortParam = "";
    let orderParam = "";

    switch (sortOption) {
      case "price-asc":
        sortParam = "price";
        orderParam = "asc";
        break;
      case "price-desc":
        sortParam = "price";
        orderParam = "desc";
        break;
      case "name-asc":
        sortParam = "title";
        orderParam = "asc";
        break;
      case "name-desc":
        sortParam = "title";
        orderParam = "desc";
        break;
      default:
        sortParam = "";
        orderParam = "";
    }

    const response = await fetch(
      `https://dummyjson.com/products?sortBy=${sortParam}&order=${orderParam}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch sorted products");
    }

    const products = await response.json();
    return { products: products };
  }

  return null;
}

export default function Products({ loaderData }: Route.ComponentProps) {
  const data = useActionData();
  const products = data ? data.products : loaderData.products;
  const { categories } = loaderData;

  return (
    <div className="py-8 px-12">
      <div className="flex gap-6 mt-4">
        <div className="flex flex-col lg:flex-row w-full gap-6">
          <div className="w-full lg:w-4/5 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="w-full lg:col-span-3 mb-4 sticky top-0 bg-white z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <Form method="post" className="inline-block mr-4">
                    <select
                      id="sort"
                      className="border border-gray-300 rounded px-2 py-1"
                      onChange={(e) => e.target.form?.requestSubmit()}
                      defaultValue=""
                      name="sorting"
                    >
                      <option value="">Sort by</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="name-desc">Name: Z to A</option>
                    </select>
                  </Form>
                </div>
                <div>
                  <span className="text-sm text-gray-600">
                    Showing {products.products.length} of {products.total}
                  </span>
                </div>
              </div>
            </div>
            {products.products.map((product: any) => (
              <Link to={`/product/${product.id}`} key={product.id}>
                <div className="mb-8">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-100"
                  />
                  <h2 className="mt-2 text-xl">{product.title}</h2>
                  <p className="mt-2 text-xl">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="w-full lg:w-1/5 mb-4 lg:mb-0 lg:ml-0 lg:order-none order-first">
            <div className="p-4 border-b-1 border-black rounded-none">
              <h3 className="mb-2 font-medium">Categories</h3>
              <div className="flex items-center mb-2">
                <Form method="post">
                  {categories.map((category: any) => (
                    <div key={category.slug}>
                      <input
                        type="checkbox"
                        id={`category-${category.slug}`}
                        value={category.slug}
                        className="mr-2"
                        name="categories"
                        onChange={(e) => {
                          const form = e.target.form;
                          if (form) {
                            const checkboxes = form.querySelectorAll(
                              'input[type="checkbox"][name="categories"]'
                            );
                            checkboxes.forEach((checkbox) => {
                              if (checkbox !== e.target) {
                                (checkbox as HTMLInputElement).checked = false;
                              }
                            });
                            form.requestSubmit();
                          }
                        }}
                      />
                      <label className="text-sm">{category.name}</label>
                    </div>
                  ))}
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
