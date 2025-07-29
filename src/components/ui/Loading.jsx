import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "table") {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse"></div>
        </div>
        <div className="divide-y divide-slate-100">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse w-1/3"></div>
                  <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse w-1/2"></div>
                </div>
                <div className="w-20 h-6 bg-gradient-to-r from-slate-200 to-slate-100 rounded-full animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl border border-slate-200 shadow-card p-6"
          >
            <div className="space-y-4">
              <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse w-3/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse w-5/6"></div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse w-1/3"></div>
                <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse w-16"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full"
      />
    </div>
  );
};

export default Loading;