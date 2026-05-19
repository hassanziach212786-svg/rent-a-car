import { motion } from 'framer-motion';

const btnVariants = {
  hover: { scale: 1.02, translateY: -2 },
  tap: { scale: 0.98 },
};

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]",
    outline: "border-2 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10",
    glass: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10",
    danger: "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white",
  };

  return (
    <motion.button
      variants={btnVariants}
      whileHover="hover"
      whileTap="tap"
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* Gloss effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};