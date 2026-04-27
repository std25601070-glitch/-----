'use client'

import { motion } from 'framer-motion'
import { Activity, Shield, Brain, ArrowRight, History } from 'lucide-react'

interface WelcomeScreenProps {
  onStart: () => void
  onViewHistory: () => void
}

export function WelcomeScreen({ onStart, onViewHistory }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl mx-auto"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-3xl rotate-6 opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-3xl -rotate-6 opacity-20" />
            <div className="relative w-full h-full glass-card-blue rounded-3xl flex items-center justify-center glow-cyan">
              <Activity className="w-16 h-16 text-sky-400 heartbeat" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl md:text-6xl font-bold mb-3 gradient-text"
        >
          NURAI
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl md:text-3xl font-light text-sky-300 mb-2"
        >
          Medical Assistant
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl text-sky-200/70 arabic-text mb-12"
        >
          المساعد الطبي الذكي
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-3 gap-4 mb-12 max-w-lg mx-auto"
        >
          {[
            { icon: Brain, labelEn: 'AI Powered', labelAr: 'ذكاء اصطناعي' },
            { icon: Shield, labelEn: 'Secure', labelAr: 'آمن' },
            { icon: Activity, labelEn: 'Real-time', labelAr: 'فوري' },
          ].map((feature, index) => (
            <motion.div
              key={feature.labelEn}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="glass-card rounded-2xl p-4 text-center"
            >
              <feature.icon className="w-8 h-8 text-sky-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-white">{feature.labelEn}</p>
              <p className="text-xs text-sky-300/70 arabic-text">{feature.labelAr}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Start Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="group relative px-12 py-5 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-2xl font-semibold text-lg text-white shadow-xl glow-cyan transition-all duration-300 hover:shadow-2xl"
        >
          <span className="flex items-center gap-3">
            Start Assessment
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="block text-sm font-normal opacity-90 mt-1 arabic-text">
            بدء التقييم الصحي
          </span>
        </motion.button>

        {/* Patient History Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewHistory}
          className="group relative px-12 py-5 glass-card-blue rounded-2xl font-semibold text-lg text-white mt-4 transition-all duration-300 hover:bg-sky-500/20"
        >
          <span className="flex items-center gap-3 justify-center">
            <History className="w-5 h-5 text-sky-400" />
            Patient History
          </span>
          <span className="block text-sm font-normal text-sky-300/70 mt-1 arabic-text">
            سجل المريض
          </span>
        </motion.button>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-12 max-w-md mx-auto"
        >
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-sky-200/60 leading-relaxed">
              This system does not replace doctors. It provides initial medical guidance only.
            </p>
            <p className="text-xs text-sky-200/60 leading-relaxed mt-1 arabic-text">
              هذا النظام لا يستبدل الطبيب، وإنما يقدم تقييماً صحياً أولياً فقط.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
