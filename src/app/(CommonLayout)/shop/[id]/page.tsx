import { upsertCart } from "@/services/cart.service";
import { fetchSpecificMedicine } from "@/services/medicine.service";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ClientActions from "./ClientActions";
import { userService } from "@/services/user.service";

const ShopSpecificItem = async({ params }: { params: { id: string } }) => {
  const { id } = await params;
 const fetchMedicine = await fetchSpecificMedicine(id); 
 const getUser =await  userService.getSession();


  return (
    <div className="min-h-screen pt-28 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">

        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-6">
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/shop">Shop</Link></li>
            <li>Product #{id}</li>
          </ul>
        </div>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 rounded-xl shadow-md">

          {/* Image */}
          <div className="flex justify-center items-center">
            <Image
              src={fetchMedicine.image}
              alt="Medicine"
              width={420}
              height={420}
              className="rounded-xl object-cover"
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </div>

          {/* Name */}
          <div>
            <h1 className="text-3xl font-bold mb-2">
             {fetchMedicine.name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <span className="badge badge-success">In Stock</span>
              <span className="text-sm text-base-content/60">
                Trusted & Certified
              </span>
            </div>

            {/* Description */}
            <p className="text-base-content/80 mb-6 leading-relaxed">
              {fetchMedicine.description}
            </p>

            {/* Price */}
            <div className="text-3xl font-bold text-primary mb-6">
              ৳ {fetchMedicine.price}
            </div>



            {/* Actions */}
            <ClientActions medicineId={id} getUser={getUser} />

            {/* Extra Info */}
            <div className="mt-8 space-y-2 text-sm text-base-content/70">
              <p>🚚 Free delivery within 24–48 hours</p>
              <p>💊 100% authentic medicines</p>
              <p>📞 24/7 customer support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSpecificItem;
