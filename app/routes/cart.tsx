import { Form } from "react-router";
import { commitSession, getSession } from "../utils/sessions";
import type { Route } from "./+types/cart";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const cart = session.get("cart") || [];

  const products = await Promise.all(
    cart.map(async (productId: number) => {
      const response = await fetch(
        `https://dummyjson.com/products/${productId}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch product with ID ${productId}`);
      }
      return response.json();
    })
  );

  return { cart: products };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submitted = formData.get("productId") || "";
  const action = formData.get("action") || "";

  const session = await getSession(request.headers.get("Cookie"));
  const cart = session.get("cart") || [];

  if (action) {
    const [type, productId] = (action as string).split("-");

    if (type === "increment") {
      cart.push(productId);
    } else if (type === "decrement") {
      const index = cart.indexOf(productId);
      cart.splice(index, 1);
    }
    console.log(cart);
    session.set("cart", cart);
  }

  if (submitted) {
    const updatedCart = cart.filter(
      (id: any) => id !== submitted
    );

    session.set("cart", updatedCart);
  }

  return new Response(null, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Cart({ loaderData }: Route.ComponentProps) {
  const { cart } = loaderData;

  const mergedCart = cart.reduce((acc: any[], product: any) => {
    const existingProduct = acc.find((item) => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
      acc.push({ ...product, quantity: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="py-8 px-12">
      <div className="flex gap-6 mt-4">
        <div className="flex flex-col lg:flex-row w-full gap-6">
          <div className="w-full lg:w-2/3">
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              mergedCart.map((product: any) => (
                <div key={product.id} className="w-full">
                  <div className="flex">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-50 h-50"
                    />
                    <div className="flex flex-col justify-start w-full">
                      <p>{product.title}</p>
                      <p>${product.price}</p>
                      <div className="flex items-center mt-auto justify-start">
                        <div className="flex items-center space-x-4 border rounded-lg p-2">
                          <Form method="post">
                            <input
                              type="hidden"
                              name="action"
                              value={`decrement-${product.id}`}
                            />
                            <button
                              className="btn btn-sm btn-outline"
                              type="submit"
                            >
                              -
                            </button>
                          </Form>
                          <span className="text-sm font-medium">
                            {product.quantity || 1}
                          </span>
                          <Form method="post">
                            <input
                              type="hidden"
                              name="action"
                              value={`increment-${product.id}`}
                            />
                            <button
                              className="btn btn-sm btn-outline"
                              type="submit"
                            >
                              +
                            </button>
                          </Form>
                        </div>
                        <Form method="post">
                          <input
                            type="hidden"
                            name="productId"
                            value={product.id}
                          />
                          <button
                            className="ml-4 flex items-center"
                            type="submit"
                          >
                            <i className="fa fa-trash-o text-5xl"></i>
                          </button>
                        </Form>
                      </div>
                    </div>
                  </div>
                  <div className="w-full col-span-full">
                    <hr className="my-4 border-black" />
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="w-full lg:w-1/3 mb-4 lg:mb-0 lg:ml-0">
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-bold mb-4">Cart Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>
                  $
                  {cart
                    .reduce(
                      (sum, product) =>
                        sum + product.price * (product.quantity || 1),
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span>$20.00</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Total:</span>
                <span>
                  $
                  {(
                    cart.reduce(
                      (sum, product) =>
                        sum + product.price * (product.quantity || 1),
                      0
                    ) + 20
                  ).toFixed(2)}
                </span>
              </div>
              <button
                className="mt-4 w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                type="submit"
              >
                Checkout
              </button>
              <div className="mt-6 py-4 text-center">
                <p>Or pay with PayPal</p>
              </div>
              <div className="w-full col-span-full">
                <hr className="my-4 border-black" />
              </div>
              <div className="flex flex-col justify-between items-start mb-2">
                <label className="mb-2">Promo Code</label>
                <div className="flex items-center w-full">
                  <input
                    type="text"
                    placeholder="Enter Code"
                    className="border rounded-lg p-2 w-2/3"
                  />
                  <button className="ml-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
