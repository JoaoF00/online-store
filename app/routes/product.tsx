import { Form } from "react-router";
import type { Route } from "./+types/product";
import { commitSession, getSession } from "../utils/sessions";

export async function loader({ params }: Route.LoaderArgs) {
  const productId = params.productId;

  const response = await fetch("https://dummyjson.com/products/" + productId);

  if (!response.ok) {
    throw new Error("Failed to fetch");
  }

  const product = await response.json();

  return product;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submitted = formData.get("productId") || "";

  if (submitted) {
    const session = await getSession(request.headers.get("Cookie"));
    const cart = session.get("cart") || [];

    cart.push(submitted);

    console.log("Cart:", cart);
    session.set("cart", cart);

    return new Response(null, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const product = loaderData;

  return (
    <div className="py-8 px-12">
      <div className="flex gap-6 mt-4">
        <div className="flex flex-col lg:flex-row w-full gap-6">
          <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-200 col-span-full">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-150"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/3 mb-4 lg:mb-0 lg:ml-0">
            <div className="pb-8 border-b-1 border-black rounded-none">
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <p className="text-3xl font-bold mt-2">${product.price}</p>
              <Form method="post">
                <input type="hidden" name="productId" value={product.id} />
                <button
                  className="mt-4 w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                  type="submit"
                >
                  Add to Cart
                </button>
              </Form>
            </div>
            <div className="mt-4">
              <h2 className="text-base">Product Details</h2>
              <p className="text-base mt-2">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
