import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WHATSAPP_NUMBER = "17735025597";
const WHATSAPP_MESSAGE = encodeURIComponent("Hello! I need help with my account.");

export default function WhatsAppButton() {
  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact support on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(142,70%,45%)] text-white shadow-lg"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1, boxShadow: "0 0 25px hsl(142, 70%, 45%, 0.4)" }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 4 }}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.div>
      {/* Ping ring */}
      <motion.span
        className="absolute inset-0 rounded-full border-2 border-[hsl(142,70%,45%)]"
        animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      />
    </motion.a>
  );
}
