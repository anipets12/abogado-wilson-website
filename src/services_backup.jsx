import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGavel, FaBalanceScale, FaCarCrash, FaShip, FaBuilding, FaHandshake, FaFileContract, FaUserTie, FaMoneyBillWave } from 'react-icons/fa';

// Paquetes de suscripciÃ³n
const packages = [
  {
    name: 'Normal',
    price: 29.99,
    description: 'Ideal para consultas bÃ¡sicas y asesorÃ­a legal inicial',
    features: [
      'Consultas BÃ¡sicas del Consejo de la Judicatura',
      'Consultas de servicios del SRI',
      'Sesiones bÃ¡sicas de asesorÃ­a legal (2 por mes)',
      'Acceso al Blog Legal con artÃ­culos actualizados',
      'Notificaciones de actualizaciones legales'
    ],
    color: 'bg-white',
    popular: false
  },
  {
    name: 'Intermedio',
    price: 49.99,
    description: 'Perfecto para necesidades legales mÃ¡s especÃ­ficas',
    features: [
      'Consultas de causas penales y civiles',
      'Consultas de multas de trÃ¡nsito',
      'Sesiones avanzadas de asesorÃ­a legal (4 por mes)',
      'Acceso a cursos y eBooks legales premium',
      'Descuentos en servicios adicionales',
      'Acceso al Blog Legal con contenido exclusivo'
    ],
    color: 'bg-primary-50',
    popular: true
  },
  {
    name: 'Premium',
    price: 99.99,
    description: 'Servicio legal completo y personalizado',
    features: [
      'Acceso ilimitado a todas las consultas disponibles',
      'Sesiones premium de asesorÃ­a legal (8 por mes)',
      'Acceso completo a biblioteca de cursos y eBooks',
      'NFTs y servicios Blockchain exclusivos',
      'RedacciÃ³n ilimitada de certificados y documentos',
      'Prioridad en atenciÃ³n al cliente 24/7',
      'Acceso VIP al Blog Legal'
    ],
    color: 'bg-primary-100',
    popular: false
  }
];

// Servicios de patrocinio legal
const legalServices = [
  {
    id: 'penal',
    title: 'Patrocinio en Causas Penales',
    description: 'Defensa integral en procesos penales, audiencias y recursos',
    price: 'Desde $500',
    icon: <FaGavel className="text-red-600 text-3xl mb-4" />,
    features: [
      'Defensa en delitos contra la propiedad',
      'RepresentaciÃ³n en delitos de trÃ¡nsito',
      'Defensa en delitos contra la integridad personal',
      'Recursos de apelaciÃ³n y casaciÃ³n',
      'Medidas alternativas a la prisiÃ³n preventiva'
    ]
  },
  {
    id: 'civil',
    title: 'Patrocinio en Causas Civiles',
    description: 'RepresentaciÃ³n en litigios civiles, contratos y reclamaciones',
    price: 'Desde $500',
    icon: <FaBalanceScale className="text-blue-600 text-3xl mb-4" />,
    features: [
      'Juicios de cobro de deudas',
      'Litigios por incumplimiento de contratos',
      'Procesos de prescripciÃ³n adquisitiva',
      'Reclamaciones por daÃ±os y perjuicios',
      'Cobro de pensiones alimenticias'
    ]
  },
  {
    id: 'constitucional',
    title: 'Acciones Constitucionales',
    description: 'ProtecciÃ³n de derechos fundamentales mediante garantÃ­as constitucionales',
    price: 'Desde $600',
    icon: <FaFileContract className="text-yellow-600 text-3xl mb-4" />,
    features: [
      'Acciones de protecciÃ³n',
      'Habeas corpus',
      'Habeas data',
      'Acciones de acceso a la informaciÃ³n',
      'Medidas cautelares constitucionales'
    ]
  },
  {
    id: 'transito',
    title: 'Derecho de TrÃ¡nsito',
    description: 'AsesorÃ­a y defensa en infracciones y accidentes de trÃ¡nsito',
    price: 'Desde $400',
    icon: <FaCarCrash className="text-green-600 text-3xl mb-4" />,
    features: [
      'ImpugnaciÃ³n de multas',
      'Defensa en contravenciones',
      'RepresentaciÃ³n en accidentes de trÃ¡nsito',
      'RecuperaciÃ³n de licencias',
      'Reclamaciones a aseguradoras'
    ]
  },
  {
    id: 'comercial',
    title: 'Derecho Comercial',
    description: 'AsesorÃ­a legal para empresas, contratos y operaciones mercantiles',
    price: 'Desde $550',
    icon: <FaBuilding className="text-indigo-600 text-3xl mb-4" />,
    features: [
      'ConstituciÃ³n de compaÃ±Ã­as',
      'Contratos mercantiles',
      'ProtecciÃ³n de propiedad intelectual',
      'Litigios comerciales',
      'AsesorÃ­a societaria permanente'
    ]
  },
  {
    id: 'aduanas',
    title: 'Derecho Aduanero',
    description: 'RepresentaciÃ³n en trÃ¡mites y litigios aduaneros',
    price: 'Desde $450',
    icon: <FaShip className="text-cyan-600 text-3xl mb-4" />,
    features: [
      'LiberaciÃ³n de mercancÃ­as retenidas',
      'Recursos administrativos aduaneros',
      'ClasificaciÃ³n arancelaria',
      'RegÃ­menes aduaneros especiales',
      'Litigios por infracciones aduaneras'
    ]
  },
  {
    id: 'laboral',
    title: 'Derecho Laboral',
    description: 'AsesorÃ­a en relaciones laborales para empleadores y trabajadores',
    price: 'Desde $450',
    icon: <FaUserTie className="text-orange-600 text-3xl mb-4" />,
    features: [
      'Demandas por despido intempestivo',
      'ReclamaciÃ³n de beneficios sociales',
      'Visto bueno y desahucio',
      'Contratos laborales',
      'Conflictos colectivos'
    ]
  },
  {
    id: 'cobros',
    title: 'Cobro de Deudas',
    description: 'GestiÃ³n efectiva para recuperaciÃ³n de valores adeudados',
    price: 'Desde $350',
    icon: <FaMoneyBillWave className="text-emerald-600 text-3xl mb-4" />,
    features: [
      'Juicios ejecutivos',
      'Cobro de letras de cambio y pagarÃ©s',
      'Procedimientos monitorios',
      'Cobro de pensiones alimenticias',
      'NegociaciÃ³n de acuerdos de pago'
    ]
  }
];

export default function Services() {
  const [hoveredPackage, setHoveredPackage] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);

  return (
    <div className="py-12 bg-secondary-50">
      <div className="container-custom">
        <div className="text-center">
          <h2 className="section-title">Nuestros Servicios</h2>
          <p className="text-xl text-secondary-600 mb-6">
            Soluciones legales profesionales para todas sus necesidades
          </p>
        </div>

        {/* Servicios de Patrocinio Legal */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-secondary-900 mb-8 flex items-center">
            <FaGavel className="mr-2 text-primary-600" /> Servicios de Patrocinio Legal
          </h3>
          <p className="text-lg text-secondary-600 mb-8">
            RepresentaciÃ³n legal profesional en todas las Ã¡reas del derecho. Nuestros servicios de patrocinio incluyen asesorÃ­a completa, representaciÃ³n en audiencias y seguimiento de su caso hasta su resoluciÃ³n.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {legalServices.map((service, index) => (
              <motion.div
                key={service.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:border-primary-200 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredService(service.id)}
                onHoverEnd={() => setHoveredService(null)}
              >
                <div className="p-6">
                  <div className="flex justify-center">
                    {service.icon}
                  </div>
                  <h4 className="text-xl font-bold text-secondary-900 mb-2 text-center">
                    {service.title}
                  </h4>
                  <p className="text-secondary-600 mb-4 text-center">{service.description}</p>
                  <div className="text-xl font-bold text-primary-600 mb-4 text-center">
                    {service.price}
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-start text-secondary-700 text-sm"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          scale: hoveredService === service.id ? 1.02 : 1
                        }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                      >
                        <svg
                          className="w-4 h-4 text-primary-600 mr-2 mt-1 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                  
                  <Link to={`/servicios/${service.id}`}>
                    <motion.button
                      className="w-full btn-secondary flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span>MÃ¡s InformaciÃ³n</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Planes de SuscripciÃ³n */}
        <div>
          <h3 className="text-2xl font-bold text-secondary-900 mb-8 flex items-center">
            <FaHandshake className="mr-2 text-primary-600" /> Planes de SuscripciÃ³n
          </h3>
          <p className="text-lg text-secondary-600 mb-8">
            Elija el plan que mejor se adapte a sus necesidades legales y obtenga acceso a nuestros servicios de consultorÃ­a y asesorÃ­a continua.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                className={`${pkg.color} rounded-2xl p-8 shadow-lg transform transition-all duration-300 hover:scale-105 ${pkg.popular ? 'border-2 border-primary-400 relative' : 'border border-gray-100'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                onHoverStart={() => setHoveredPackage(pkg.name)}
                onHoverEnd={() => setHoveredPackage(null)}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-primary-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-bold">
                    MÃ¡s Popular
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                    {pkg.name}
                  </h3>
                  <div className="text-4xl font-bold text-primary-600 mb-4">
                    ${pkg.price}
                    <span className="text-base font-normal text-secondary-600">/mes</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature) => (
                    <motion.li
                      key={feature}
                      className="flex items-center text-secondary-700"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        scale: hoveredPackage === pkg.name ? 1.05 : 1
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg
                        className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/contacto'}
                >
                  <span>Comenzar Ahora</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
