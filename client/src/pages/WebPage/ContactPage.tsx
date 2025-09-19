import { Mail, Phone, User, MessageCircle, Send } from 'lucide-react';
import { motion } from "framer-motion";
import { images } from "@/assets/images";
import { HiChatAlt2 } from "react-icons/hi";

const ContactPage = () => {
  return (
    <div className="pt-24 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl md:text-4xl font-bold" style={{ color: '#190259' }}>
                Estamos listos para<br />
                trabajar en tu proyecto.
              </h1>
              
              <div className="flex items-center gap-3">
                <h2 className="text-4xl md:text-5xl font-bold" style={{ color: '#190259' }}>
                  Contactanos
                </h2>
                <HiChatAlt2 className="text-4xl md:text-5xl text-yellow-400" />
              </div>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombres y Apellidos
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingresa tu nombre completo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="tel"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+591 77774444"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Que proyecto tiene en mente?
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe tu proyecto o idea..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Prefiere llamada o WhatsApp?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="contact-method" value="call" className="text-blue-500" />
                    <span>Llamada</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="contact-method" value="whatsapp" className="text-blue-500" />
                    <MessageCircle className="h-5 w-5 text-green-500" />
                    <span>WhatsApp</span>
                  </label>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-yellow-400 text-white font-semibold py-4 px-6 rounded-xl hover:bg-yellow-500 transition-colors duration-200"
              >
                <div className="flex items-center justify-center gap-2">
                  <Send className="h-5 w-5" />
                  <span>Enviar</span>
                </div>
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <img
              src={images.imagecontact}
              alt="Contacto"
              className="w-full h-auto transform hover:scale-105 transition-transform duration-300"
              style={{ 
                maxHeight: '600px',
                objectFit: 'cover'
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;