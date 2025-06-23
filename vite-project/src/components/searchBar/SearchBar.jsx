import { useContext, useState, useRef, useEffect } from "react";
import myContext from "../../context/myContext";
import { useNavigate } from "react-router";
import { Search } from "lucide-react";

const SearchBar = () => {
  const context = useContext(myContext);
  const { getAllProduct } = context;

  // Search State
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter Search Data
  const filterSearchData = getAllProduct
    .filter((obj) => obj.title.toLowerCase().includes(search))
    .slice(0, 8);

  const navigate = useNavigate();

  // Ref to detect clicks outside the search dropdown
  const searchBarRef = useRef(null);

  // Hide the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setShowDropdown(false); // Hide the dropdown
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value) {
      setShowDropdown(true); // Show the dropdown when there is input
    } else {
      setShowDropdown(false); // Hide the dropdown when the input is cleared
    }
  };

  return (
    <div ref={searchBarRef}>
      {/* search input */}
      <div className="flex justify-center">
        <div className="relative w-96">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <Search size={20} />
          </span>
          <input
            type="text"
            placeholder="Buscar..."
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full bg-gray-200 placeholder-gray-400 rounded-lg outline-none text-black"
          />
        </div>
      </div>

      {/* search drop-down */}
      {showDropdown && (
        <div className="flex justify-center">
          <div className="block absolute bg-gray-200 w-96 md:w-96 text-black lg:w-96 z-50 my-1 rounded-lg px-2 py-2">
            {filterSearchData.length > 0 ? (
              <>
                {filterSearchData.map((item, index) => (
                  <div
                    key={index}
                    className="py-2 px-2 cursor-pointer"
                    onClick={() => navigate(`/productinfo/${item.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <img className="w-10" src={item.productImageUrl} alt="" />
                      {item.title}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex justify-center">
                <img
                  className="w-20"
                  src="https://cdn-icons-png.flaticon.com/128/10437/10437090.png"
                  alt="img"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
