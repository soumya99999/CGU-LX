import { ShoppingCart, HelpCircle, IndianRupee } from "lucide-react";

export const categories = [
    {
        id: "buy",
        title: "BUY",
        description: "Discover unique items from your campus community",
        icon: ShoppingCart,
        color: "from-pink-500/20 to-pink-700/30",
        href: "/buy",
        image: "/2.png",
    },
    {
        id: "sell",
        title: "SELL",
        description: "Turn your pre-loved items into campus cash",
        icon: IndianRupee,
        color: "from-blue-500/20 to-blue-700/30",
        href: "/sell",
        image: "/4.png",
    },
    {
        id: "request",
        title: "REQUEST",
        description: "Seek what you need, find campus solutions",
        icon: HelpCircle,
        color: "from-purple-500/20 to-purple-700/30",
        comingSoon: true,
        image: "/6.png",
    },
];