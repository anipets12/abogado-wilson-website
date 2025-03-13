import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../App';

export default function Forum() {
  const [topics, setTopics] = useState([
    {
      id: 1,
      title: 'Reforma al Código Penal: Implicaciones prácticas',
      author: 'Dr. Wilson Ipiales',
      date: '2023-12-15',
      replies: 24,
      views: 156,
      category: 'Derecho Penal',
      excerpt: 'Análisis de las recientes reformas al COIP y cómo afectan a los procesos penales en curso.'
    },
    {
      id: 2,
      title: 'Consulta sobre juicio de alimentos',
      author: 'María Sánchez',
      date: '2023-12-14',
      replies: 18,
      views: 89,
      category: 'Derecho Familiar',
      excerpt: 'Tengo dudas sobre el proceso de demanda de alimentos y los documentos necesarios.'
    },
    {
      id: 3,
      title: 'Procedimiento para impugnar multas de tránsito',
      author: 'Carlos Mendoza',
      date: '2023-12-12',
      replies: 32,
      views: 210,
      category: 'Tránsito',
      excerpt: 'Quisiera conocer el procedimiento correcto para impugnar una multa que considero injusta.'
    },
    {
      id: 4,
      title: 'Derechos laborales en caso de despido intempestivo',
      author: 'Laura Torres',
      date: '2023-12-10',
      replies: 45,
      views: 278,
      category: 'Derecho Laboral',
      excerpt: 'Me despidieron sin justificación después de 5 años de trabajo. ¿Qué derechos me amparan?'
    },
    {
      id: 5,
      title: 'Trámites para constitución de compañías',
      author: 'Roberto Paz',
      date: '2023-12-08',
      replies: 15,
      views: 124,
      category: 'Derecho Mercantil',
      excerpt: 'Información sobre los requisitos actualizados para constituir una compañía limitada.'
    }
  ]);

  const [categories, setCategories] = useState([
    'Todos', 'Derecho Penal', 'Derecho Civil', 'Tránsito', 'Derecho Laboral', 
    'Derecho Familiar', 'Derecho Mercantil', 'Consultas Generales'
  ]);

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [newTopicForm, setNewTopicForm] = useState({
    title: '',
    category: 'Consultas Generales',
    message: ''
  });
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const filteredTopics = selectedCategory === 'Todos'
    ? topics
    : topics.filter(topic => topic.category === selectedCategory);

  const handleNewTopicSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Aquí se implementaría la lógica para enviar el nuevo tema al backend
      // Por ahora, simulamos la creación de un nuevo tema
      const newTopic = {
        id: topics.length + 1,
        title: newTopicForm.title,
        author: 'Usuario Registrado', // En una implementación real, esto vendría del usuario autenticado
        date: new Date().toISOString().split('T')[0],
        replies: 0,
        views: 1,
        category: newTopicForm.category,
        excerpt: newTopicForm.message.substring(0, 100) + (newTopicForm.message.length > 100 ? '...' : '')
      };

      setTopics([newTopic, ...topics]);
      setNewTopicForm({
        title: '',
        category: 'Consultas Generales',
        message: ''
      });
      setShowNewTopicForm(false);
    } catch (error) {
      setError('Error al crear el tema. Por favor, inténtelo de nuevo.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTopicForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="py-12 bg-secondary-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Foro Legal</h2>
          <p className="text-xl text-secondary-600">
            Participe en discusiones sobre temas legales y obtenga respuestas de expertos
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
            {categories.map(category => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-lg text-sm ${selectedCategory === category ? 'bg-primary-600 text-white' : 'bg-white text-secondary-700 hover:bg-primary-50'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={() => setShowNewTopicForm(!showNewTopicForm)}
            className="btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {showNewTopicForm ? 'Cancelar' : 'Nuevo Tema'}
          </motion.button>
        </div>

        {showNewTopicForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <form onSubmit={handleNewTopicSubmit} className="card space-y-4">
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                Crear Nuevo Tema
              </h3>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  name="title"
                  value={newTopicForm.title}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Categoría
                </label>
                <select
                  name="category"
                  value={newTopicForm.category}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  {categories.filter(cat => cat !== 'Todos').map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  name="message"
                  value={newTopicForm.message}
                  onChange={handleInputChange}
                  rows="5"
                  className="input-field"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'Enviando...' : 'Publicar Tema'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Tema
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Autor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Respuestas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Vistas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredTopics.map((topic) => (
                  <motion.tr 
                    key={topic.id}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-secondary-900">{topic.title}</span>
                        <span className="text-xs text-secondary-500 mt-1">{topic.excerpt}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                        {topic.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-500">
                      {topic.author}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-500">
                      {topic.replies}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-500">
                      {topic.views}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-500">
                      {topic.date}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-8 text-secondary-500">
            No hay temas en esta categoría. ¡Sé el primero en crear uno!
          </div>
        )}

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-secondary-900 mb-4">
            ¿Necesita asesoría legal personalizada?
          </h3>
          <p className="text-lg text-secondary-600 mb-6">
            Nuestro equipo de abogados expertos está listo para ayudarle con su caso específico.
          </p>
          <a
            href="/contacto"
            className="btn-primary inline-block"
          >
            Solicitar Consulta
          </a>
        </div>
      </div>
    </div>
  );
}