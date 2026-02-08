"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";


interface CartItem {
  id: string;
  quantity: number;
  medicine: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    const loadCart = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart`,
        {
   
          cache: "no-store",
        }
      );

      const data = await res.json();
      setCartItems(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    loadCart();
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.medicine.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 60 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ name, phone, address, city, postalCode }),
    });

    if (!res.ok) {
      throw new Error("Order failed");
    }

    toast.success(" Order placed successfully!");

    setCartItems([]);
    setName("");
    setPhone("");
    setAddress("");
    setCity("");
    setPostalCode("");

  } catch (error) {
    toast.error(" Failed to place order");
    console.error(error);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: Shipping + Payment */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-blue-600 mb-6">
            Checkout
          </h1>

          {/* Shipping Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Shipping Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input onChange={(e) => setName(e.target.value)} type="text" className="input input-bordered w-full" placeholder="Full Name" />
              <input onChange={(e) => setPhone(e.target.value)} type="number" className="input input-bordered w-full" placeholder="Phone Number" />
              <input onChange={(e) => setAddress(e.target.value)} type="text" className="input input-bordered w-full md:col-span-2" placeholder="Street Address" />
              <input onChange={(e) => setCity(e.target.value)} type="text" className="input input-bordered w-full" placeholder="City" />
              <input onChange={(e) => setPostalCode(e.target.value)} type="number" className="input input-bordered w-full" placeholder="Postal Code" />
            </div>
          </div>

          {/* Payment */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" defaultChecked className="radio radio-primary" />
                <span>Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-3 opacity-50">
                <input type="radio" disabled className="radio" />
                <span>Online Payment (Coming soon)</span>
              </label>
            </div>
          </div>

          <button className="btn btn-primary btn-lg w-full mt-8">
            Place Order
          </button>
        </form>

        {/* RIGHT: Order Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8">
          <h2 className="text-xl font-semibold mb-6 text-blue-500">
            Order Summary
          </h2>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 relative bg-gray-100 rounded">
                  {item.medicine.image && (
                    <Image
                      src={item.medicine.image}
                      alt={item.medicine.name}
                      fill
                      className="object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.medicine.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  ৳{(item.medicine.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t mt-6 pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>৳{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>৳{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>৳{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
