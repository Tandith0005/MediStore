import { reviewsData } from "@/constants";
import Image from "next/image";




const Reviews = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-12 text-blue-500">What Our Customers Say</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {reviewsData.map((review, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src={review.img}
                alt={review.name}
                width={100}
                height={100}
                className=" rounded-full mb-4 object-cover"
              />
              <p className="text-gray-600 mb-4 text-sm">{review.feedback}</p>
              <h3 className="font-semibold text-primary">{review.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
