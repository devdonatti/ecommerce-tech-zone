import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-100">
      <div className="container mx-auto px-5 py-6 flex flex-col sm:flex-row items-center justify-between">
        {/* Logo y nombre */}
        <div className="flex items-center mb-4 sm:mb-0">
          <span className="text-xl font-bold">SMILE</span>
        </div>

        {/* Info legal + Instagram */}
        <div className="flex flex-col items-center sm:items-start text-sm text-gray-400">
          <p className="mb-1 sm:mb-0">
            © 2024 SMILE —
            <Link to="/" className="ml-1 text-gray-100 hover:underline">
              @SMILE.AR_
            </Link>
          </p>
        </div>

        {/* Redes sociales */}
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <a
            href="https://www.instagram.com/smile.ar_/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
            </svg>
          </a>
        </div>
      </div>

      {/* Powered by */}
      <div className="text-center text-sm text-gray-500 pb-4">
        <a
          href="https://portfolio-mdev-react.netlify.app/"
          className="hover:text-white transition-colors"
        >
          Powered by MDev
        </a>
      </div>
    </footer>
  );
};

export default Footer;
