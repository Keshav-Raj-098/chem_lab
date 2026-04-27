import Image from "next/image";

const ContactPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Contact Us
      </h1>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-10">
        <div className="flex md:flex-row gap-8 md:gap-12 items-center">
          {/* Photo */}
          <div className="rounded-xl border border-gray-200 p-2 bg-white w-full max-w-90 mx-auto">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src="/prof_dp.jpg"
                alt="Dr. Chandra Shekhar Sharma"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 360px"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
              Prof. Suddhasatwa Basu
            </h2>

            <p className="font-semibold text-gray-900">
              Professor, Department of Chemical Engineering
            </p>

            <p className="text-gray-800">
              <span className="font-semibold">Office:</span> Academic Block 1 - 325
            </p>

            <p className="text-gray-800">
              <span className="font-semibold">Laboratory:</span> A-225, B-122
            </p>

            <p className="text-gray-800">
              <span className="font-semibold">Call us @</span> +91-(051) 2759 7018
            </p>

            <p className="font-semibold text-gray-900">Write to us @:</p>

            <div className="flex flex-col gap-3 max-w-md">
              <a
                href="mailto:cssharma@che.iith.ac.in"
                className="block w-full text-center rounded-md bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold py-3 px-4 shadow-sm"
              >
                sbasu@chemical.iitd.ac.in
              </a>
              <a
                href="mailto:carbonlabiith@gmail.com"
                className="block w-full text-center rounded-md bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold py-3 px-4 shadow-sm"
              >
                chemlabiitd@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
