import React from "react";
import { cn } from "../utils";
import { motion } from "framer-motion";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    whileHover={{ scale: 1.02, boxShadow: "0px 4px 15px rgba(0,0,0,0.2)" }}
    className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <motion.header 
    ref={ref} 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={cn("flex flex-col gap-2 p-6", className)} 
    {...props} 
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <motion.h3 
    ref={ref} 
    whileHover={{ scale: 1.05 }}
    className={cn("text-lg font-bold", className)} 
    {...props}
  >
    {children}
  </motion.h3>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <motion.p 
    ref={ref} 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={cn("text-sm text-muted-foreground", className)} 
    {...props}
  >
    {children}
  </motion.p>
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <motion.section 
    ref={ref} 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={cn("p-6 pt-0", className)} 
    {...props} 
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <motion.footer 
    ref={ref} 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={cn("flex items-center p-6 pt-0", className)} 
    {...props} 
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };