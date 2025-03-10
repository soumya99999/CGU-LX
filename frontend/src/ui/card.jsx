import React from "react";
import { cn } from "../utils";
import { motion } from "framer-motion";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, scale: 0.9 }} // Start smaller and invisible
    animate={{ opacity: 1, scale: 1 }}  // Fade in and scale up slightly
    transition={{ duration: 0.5, ease: "easeOut" }} // Smooth transition
    whileHover={{ scale: 1.03, boxShadow: "0px 6px 18px rgba(0,0,0,0.2)" }} // Slight hover effect
    className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
));

Card.displayName = "Card";




const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <header 
    ref={ref} 
    className={cn("flex flex-col gap-0 p-6", className)} 
    {...props} 
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3 
    ref={ref} 
    className={cn("text-base text-gray-400 m-0 font-bold", className)} 
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <p 
    ref={ref} 
    className={cn("text-base text-muted-foreground m-0 leading-tight", className)} 
    {...props}
  >
    {children}
  </p>
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <section 
    ref={ref} 
    className={cn("p-6 pt-0", className)} 
    {...props} 
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <footer 
    ref={ref} 
    className={cn("flex items-center p-6 pt-0", className)} 
    {...props} 
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
