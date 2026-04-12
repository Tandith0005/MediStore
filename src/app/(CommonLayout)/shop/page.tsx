import { Medicine } from "@/constants";
import { fetchFilteredMedicines } from "@/services/medicine.service";
import Image from "next/image";
import Link from "next/link";
import ShopFilters from "./ShopFilters";

const Shop = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const params = await searchParams;



  const medicines = await fetchFilteredMedicines(params);

  return (
    <div className="min-h-screen pt-28 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 mb-10">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          Shop Medicines
        </h1>

        <ShopFilters />
      </div>
      {/* FILTER BAR sesh  --------------------------------------------------------------------------------------*/}

      {/* Products */}
      <div
        className="container mx-auto px-4 grid gap-6
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4"
      >
        {medicines.map((product: Medicine) => (
          <div
            key={product.id}
            className="card bg-base-100 shadow-md hover:shadow-xl transition duration-300"
          >
            <figure className="px-6 pt-6">
              {product.image ? (
                <Image
                  src={product.image}
                  width={300}
                  height={300}
                  alt={product.name}
                  className="rounded-xl object-cover"
                  style={{ width: "100%", height: "auto" }}
                />
              ) : (
                <div className="w-full aspect-[1/1] bg-base-200 rounded-xl flex items-center justify-center text-base-content/50">
                  <span className="text-sm">No image</span>
                </div>
              )}
            </figure>

            {/* Stocks */}
            <div className="card-body">
              <h2 className="card-title flex justify-between items-start">
                <span>{product.name}</span>
              </h2>

              {/* Category & Manufacturer */}
              <div className="flex flex-wrap gap-2 text-xs mt-2">
                <span className="px-3 py-1 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 text-white font-bold shadow-sm">
                  {product.category}
                </span>

                <span className="px-3 py-1 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-sm">
                  {product.manufacturer}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-base-content/70 mt-2">
                {product.description}
              </p>

              {/* Price & Buy Now Button */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-bold text-primary">
                  ৳{product.price}
                </span>

                <Link href={`/shop/${product.id}`}>
                  <button className="btn btn-primary btn-sm">View Now</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
