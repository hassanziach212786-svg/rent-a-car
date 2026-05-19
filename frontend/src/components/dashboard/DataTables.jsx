import { motion } from 'framer-motion';
import { Edit3, Trash2 } from 'lucide-react';

export const DataTable = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="glass-card overflow-hidden border border-white/5 bg-white/[0.01] backdrop-blur-xl rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          {/* Header */}
          <thead className="bg-white/[0.03] border-b border-white/5">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-5 text-right text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-white/5">
            {data.length > 0 ? (
              data.map((item, rowIdx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIdx * 0.05 }}
                  key={item._id || rowIdx} 
                  className="group hover:bg-white/[0.02] transition-all duration-300"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      {col.render ? (
                        /* Custom Render for Status or Special Formatting */
                        col.render(item[col.key], item)
                      ) : (
                        /* Standard Text Rendering */
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-200">
                            {item[col.key] || "—"}
                          </span>
                          {col.subKey && (
                            <span className="text-[11px] text-gray-500 mt-0.5">
                              {item[col.subKey]}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  ))}

                  {/* Actions Cell */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => onEdit(item)}
                        className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-all border border-transparent hover:border-blue-500/20"
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(item)}
                        className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-all border border-transparent hover:border-red-500/20"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-20 text-center text-gray-500 text-sm italic">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
