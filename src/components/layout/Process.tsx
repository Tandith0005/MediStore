import { Steps } from "@/constants";


const Process = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-8 text-blue-500">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {Steps.map(({ step, title, description }) => (
            <div
              key={step}
              className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-2xl font-bold text-primary mb-4">
                Step {step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
