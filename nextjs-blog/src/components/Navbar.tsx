"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          MyBlogSpace
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link href="/posts" className="hover:text-blue-400 transition-colors">
            Blogs
          </Link>

          {session?.user?.isAdmin ? (
            <>
              <Link href="/admin/dashboard" className="hover:text-blue-400 transition-colors">
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700">Login as Admin</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white hover:text-blue-400 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden bg-slate-900 border-t border-slate-800 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              <motion.div variants={itemVariants}>
                <Link
                  href="/"
                  className="block py-2 hover:text-blue-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Link
                  href="/posts"
                  className="block py-2 hover:text-blue-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Blogs
                </Link>
              </motion.div>

              {session?.user?.isAdmin ? (
                <>
                  <motion.div variants={itemVariants}>
                    <Link
                      href="/admin/dashboard"
                      className="block py-2 hover:text-blue-400 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                </>
              ) : (
                <motion.div variants={itemVariants}>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Login as Admin
                    </Button>
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
