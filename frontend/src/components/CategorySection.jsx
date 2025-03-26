import { useNavigate } from "react-router-dom";
import { ShoppingCart, DollarSign, Briefcase, HelpCircle } from "lucide-react";

const categories = [
  {
    id: "buy",
    title: "BUY",
    description: "Buy what others sell in your college.",
    icon: ShoppingCart,
    color: "bg-pink-200 hover:bg-pink-300",
    href: "/buy",
  },
  {
    id: "sell",
    title: "SELL",
    description: "Sell your old items to college peers where others can buy.",
    icon: DollarSign,
    color: "bg-pink-200 hover:bg-pink-300",
    href: "/sell",
  },
  {
    id: "service",
    title: "Service",
    description: "Offer your freelance services to college peers.",
    icon: Briefcase,
    color: "bg-purple-200 hover:bg-purple-300",
    comingSoon: true,
  },
  {
    id: "request",
    title: "Request",
    description: "Request a particular product or service.",
    icon: HelpCircle,
    color: "bg-purple-200 hover:bg-purple-300",
    comingSoon: true,
  },
];

export default function CategorySection() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Explore Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map(({ id, title, description, icon: Icon, color, href, comingSoon }) => (
          <div
            key={id}
            onClick={() => !comingSoon && href && navigate(href)}
            className={`${color} rounded-xl p-8 transition-all hover:shadow-xl cursor-pointer relative`}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                  <Icon className="h-8 w-8 text-gray-800" />
                </div>
                <p className="text-base text-gray-700">{description}</p>
              </div>

              {/* Coming Soon Badge */}
              {comingSoon && (
                <div className="mt-4 bg-gray-800 text-white text-xs px-2 py-1 rounded-full self-end">
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
