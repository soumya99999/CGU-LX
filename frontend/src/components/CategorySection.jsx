import { useNavigate } from "react-router-dom";
import { ShoppingCart, DollarSign, HelpCircle } from "lucide-react";

const categories = [
  {
    id: "buy",
    title: "BUY",
    description: "Buy what others sell in your college.",
    icon: ShoppingCart,
    color: "hover:bg-pink-300",
    href: "/buy",
    image: "/2.png",  // Background image
  },
  {
    id: "sell",
    title: "SELL",
    description: "Sell your old items to college peers where others can buy.",
    icon: DollarSign,
    color: "hover:bg-pink-300",
    href: "/sell",
    image: "/4.png",
  },
  {
    id: "request",
    title: "Request",
    description: "Request a particular product or service.",
    icon: HelpCircle,
    color: "hover:bg-purple-300",
    comingSoon: true,
    image: "/6.png",
  },
];

export default function CategorySection() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Explore Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center">
        {categories.map(({ id, title, description, icon: Icon, color, href, comingSoon, image }) => (
          <div
            key={id}
            onClick={() => !comingSoon && href && navigate(href)}
            className={`group relative rounded-xl p-8 transition-all hover:shadow-xl cursor-pointer flex flex-col items-center text-center ${color}`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "overlay",
              backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay for better text visibility
            }}
          >
            <div className="flex flex-col h-full justify-between w-full">
              <div>
                <div className="flex items-center justify-center mb-4 gap-x-5">
                  <h3 className="text-5xl font-bold text-white">{title}</h3>
                  <Icon className="h-12 w-12 text-white" />
                </div>
                <p className="text-base text-white">{description}</p>
              </div>

              {comingSoon && (
                <div className="mt-4 bg-gray-800 text-white text-xs px-2 py-1 rounded-full self-center opacity-0 group-hover:opacity-100 transition-opacity">
                  Coming Soon
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
