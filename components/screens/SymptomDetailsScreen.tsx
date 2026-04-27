'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Timer, 
  Gauge, 
  Zap,
  TrendingUp,
  TrendingDown,
  Link2,
  ChevronLeft,
  ChevronRight,
  Thermometer,
  Brain,
  Heart,
  Wind,
  CloudRain,
  RotateCcw,
  Battery,
  Pill
} from 'lucide-react'
import type { SymptomDetail } from '@/lib/types'

interface SymptomDetailsScreenProps {
  selectedSymptoms: string[]
  symptomDetails: SymptomDetail[]
  setSymptomDetails: (details: SymptomDetail[]) => void
  onNext: () => void
  onBack: () => void
}

const symptomConfig: Record<string, { nameEn: string; nameAr: string; icon: React.ElementType; color: string; specificQuestions: { id: string; en: string; ar: string; type: 'text' | 'select'; options?: { en: string; ar: string }[] }[] }> = {
  'fever': {
    nameEn: 'Fever',
    nameAr: 'حمى',
    icon: Thermometer,
    color: 'from-red-500 to-orange-500',
    specificQuestions: [
      { id: 'temperature', en: 'What is your temperature reading?', ar: 'ما هي قراءة درجة الحرارة؟', type: 'text' },
      { id: 'days', en: 'How many days have you had fever?', ar: 'كم يوم لديك حمى؟', type: 'text' },
      { id: 'cough', en: 'Do you have a cough?', ar: 'هل لديك سعال؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'soreThroat', en: 'Do you have a sore throat?', ar: 'هل لديك التهاب حلق؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'burningUrination', en: 'Do you have burning urination?', ar: 'هل لديك حرقان بالتبول؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'rash', en: 'Do you have any rash?', ar: 'هل يوجد طفح جلدي؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'vomitingDiarrhea', en: 'Any vomiting or diarrhea?', ar: 'هل يوجد تقيؤ أو إسهال؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
    ]
  },
  'headache': {
    nameEn: 'Headache',
    nameAr: 'صداع',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    specificQuestions: [
      { id: 'location', en: 'Where exactly is the headache?', ar: 'أين مكان الصداع بالضبط؟', type: 'select', options: [{ en: 'Front', ar: 'أمام' }, { en: 'Back', ar: 'خلف' }, { en: 'Sides', ar: 'جوانب' }, { en: 'All over', ar: 'كامل الرأس' }] },
      { id: 'vision', en: 'Any vision changes?', ar: 'هل يوجد تغير بالرؤية؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'nausea', en: 'Do you have nausea?', ar: 'هل يوجد غثيان؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'lightSensitivity', en: 'Are you sensitive to light?', ar: 'هل يوجد حساسية للضوء؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'worstHeadache', en: 'Is this the worst headache of your life?', ar: 'هل هذا أسوأ صداع في حياتك؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
    ]
  },
  'chest-pain': {
    nameEn: 'Chest Pain',
    nameAr: 'ألم في الصدر',
    icon: Heart,
    color: 'from-rose-500 to-red-500',
    specificQuestions: [
      { id: 'painLocation', en: 'Where is the pain exactly?', ar: 'أين مكان الألم بالضبط؟', type: 'select', options: [{ en: 'Center', ar: 'وسط' }, { en: 'Left side', ar: 'يسار' }, { en: 'Right side', ar: 'يمين' }] },
      { id: 'spreads', en: 'Does it spread to arm, jaw, or back?', ar: 'هل ينتشر للذراع أو الفك أو الظهر؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'movement', en: 'Does it increase with movement or breathing?', ar: 'هل يزداد مع الحركة أو التنفس؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'breathingDifficulty', en: 'Any shortness of breath?', ar: 'هل يوجد ضيق تنفس؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'sweating', en: 'Any sweating, nausea, or dizziness?', ar: 'هل يوجد تعرق أو غثيان أو دوخة؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'heartHistory', en: 'History of heart disease or high blood pressure?', ar: 'هل يوجد تاريخ أمراض قلب أو ضغط؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
    ]
  },
  'shortness-of-breath': {
    nameEn: 'Shortness of Breath',
    nameAr: 'ضيق تنفس',
    icon: Wind,
    color: 'from-cyan-500 to-blue-500',
    specificQuestions: [
      { id: 'atRest', en: 'Is it at rest or with activity?', ar: 'هل يحدث أثناء الراحة أو النشاط؟', type: 'select', options: [{ en: 'At rest', ar: 'أثناء الراحة' }, { en: 'With activity', ar: 'مع النشاط' }, { en: 'Both', ar: 'كلاهما' }] },
      { id: 'coughFever', en: 'Any cough or fever?', ar: 'هل يوجد سعال أو حمى؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'chestPain', en: 'Any chest pain?', ar: 'هل يوجد ألم صدر؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'asthma', en: 'Do you have asthma?', ar: 'هل لديك ربو؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'oxygenReading', en: 'Oxygen level reading if available?', ar: 'قراءة الأوكسجين إن وجدت؟', type: 'text' },
    ]
  },
  'cough': {
    nameEn: 'Cough',
    nameAr: 'سعال',
    icon: CloudRain,
    color: 'from-teal-500 to-cyan-500',
    specificQuestions: [
      { id: 'coughType', en: 'Is it a dry or wet cough?', ar: 'هل السعال جاف أم مع بلغم؟', type: 'select', options: [{ en: 'Dry', ar: 'جاف' }, { en: 'Wet/productive', ar: 'مع بلغم' }] },
      { id: 'blood', en: 'Any blood in cough?', ar: 'هل يوجد دم مع السعال؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'fever', en: 'Do you have fever?', ar: 'هل لديك حمى؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'breathing', en: 'Any breathing difficulty?', ar: 'هل يوجد صعوبة تنفس؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'smoking', en: 'Do you smoke?', ar: 'هل تدخن؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
    ]
  },
  'dizziness': {
    nameEn: 'Dizziness',
    nameAr: 'دوخة',
    icon: RotateCcw,
    color: 'from-amber-500 to-yellow-500',
    specificQuestions: [
      { id: 'type', en: 'Does the room spin or do you feel faint?', ar: 'هل الغرفة تدور أم تشعر بإغماء؟', type: 'select', options: [{ en: 'Room spins', ar: 'الغرفة تدور' }, { en: 'Feel faint', ar: 'شعور بالإغماء' }, { en: 'Both', ar: 'كلاهما' }] },
      { id: 'headache', en: 'Any headache?', ar: 'هل يوجد صداع؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'hearingChange', en: 'Any hearing changes or ringing?', ar: 'هل يوجد تغير بالسمع أو طنين؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'vomiting', en: 'Any vomiting?', ar: 'هل يوجد تقيؤ؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'positionChange', en: 'Does it happen with position changes?', ar: 'هل يحدث مع تغيير الوضعية؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
    ]
  },
  'fatigue': {
    nameEn: 'Fatigue',
    nameAr: 'تعب',
    icon: Battery,
    color: 'from-slate-500 to-gray-500',
    specificQuestions: [
      { id: 'duration', en: 'How long have you felt fatigued?', ar: 'منذ متى تشعر بالتعب؟', type: 'text' },
      { id: 'sleep', en: 'Are you sleeping well?', ar: 'هل تنام جيدًا؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'appetite', en: 'Any change in appetite?', ar: 'هل يوجد تغير في الشهية؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'weightChange', en: 'Any weight changes?', ar: 'هل يوجد تغير بالوزن؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'fever', en: 'Any fever?', ar: 'هل يوجد حمى؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
    ]
  },
  'stomach-pain': {
    nameEn: 'Stomach Pain',
    nameAr: 'ألم في البطن',
    icon: Pill,
    color: 'from-emerald-500 to-green-500',
    specificQuestions: [
      { id: 'painLocation', en: 'Where exactly is the pain?', ar: 'أين مكان الألم بالضبط؟', type: 'select', options: [{ en: 'Upper', ar: 'أعلى' }, { en: 'Lower', ar: 'أسفل' }, { en: 'Left', ar: 'يسار' }, { en: 'Right', ar: 'يمين' }, { en: 'Center', ar: 'وسط' }] },
      { id: 'vomiting', en: 'Any vomiting?', ar: 'هل يوجد تقيؤ؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'diarrhea', en: 'Any diarrhea?', ar: 'هل يوجد إسهال؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'constipation', en: 'Any constipation?', ar: 'هل يوجد إمساك؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'fever', en: 'Any fever?', ar: 'هل يوجد حمى؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'urination', en: 'Any pain during urination?', ar: 'هل يوجد ألم أثناء التبول؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }] },
      { id: 'pregnancy', en: 'For females: possibility of pregnancy?', ar: 'للإناث: هل يوجد احتمال حمل؟', type: 'select', options: [{ en: 'Yes', ar: 'نعم' }, { en: 'No', ar: 'لا' }, { en: 'N/A', ar: 'لا ينطبق' }] },
    ]
  },
}

const triageQuestions = [
  { id: 'onset', icon: Clock, labelEn: 'Onset', labelAr: 'بداية العرض', questionEn: 'When did it start?', questionAr: 'متى بدأ العرض؟', type: 'text' as const },
  { id: 'location', icon: MapPin, labelEn: 'Location', labelAr: 'الموقع', questionEn: 'Where exactly do you feel it?', questionAr: 'أين مكان الألم أو المشكلة؟', type: 'text' as const },
  { id: 'duration', icon: Timer, labelEn: 'Duration', labelAr: 'المدة', questionEn: 'How long has it been happening?', questionAr: 'منذ كم وقت مستمر؟', type: 'text' as const },
  { id: 'severity', icon: Gauge, labelEn: 'Severity', labelAr: 'الشدة', questionEn: 'Rate it from 0 to 10', questionAr: 'قيّم الشدة من 0 إلى 10', type: 'severity' as const },
  { id: 'character', icon: Zap, labelEn: 'Character', labelAr: 'الطبيعة', questionEn: 'How does it feel?', questionAr: 'شنو طبيعة الألم؟', type: 'select' as const, options: ['Sharp / حاد', 'Burning / حارق', 'Pressure / ضاغط', 'Mild / خفيف', 'Throbbing / نابض', 'Cramping / مغص'] },
  { id: 'aggravating', icon: TrendingUp, labelEn: 'Aggravating', labelAr: 'عوامل مفاقمة', questionEn: 'What makes it worse?', questionAr: 'شنو يزيد الحالة؟', type: 'text' as const },
  { id: 'relieving', icon: TrendingDown, labelEn: 'Relieving', labelAr: 'عوامل مخففة', questionEn: 'What makes it better?', questionAr: 'شنو يخفف الحالة؟', type: 'text' as const },
  { id: 'associated', icon: Link2, labelEn: 'Associated', labelAr: 'أعراض مصاحبة', questionEn: 'Any other symptoms?', questionAr: 'هل توجد أعراض أخرى؟', type: 'text' as const },
]

export function SymptomDetailsScreen({ 
  selectedSymptoms, 
  symptomDetails, 
  setSymptomDetails, 
  onNext, 
  onBack 
}: SymptomDetailsScreenProps) {
  const [currentSymptomIndex, setCurrentSymptomIndex] = useState(0)
  const [currentQuestionSection, setCurrentQuestionSection] = useState<'triage' | 'specific'>('triage')
  
  const currentSymptomId = selectedSymptoms[currentSymptomIndex]
  const symptomInfo = symptomConfig[currentSymptomId]
  const Icon = symptomInfo?.icon || Pill

  const currentDetail = useMemo(() => {
    return symptomDetails.find(d => d.symptomId === currentSymptomId) || {
      symptomId: currentSymptomId,
      onset: '',
      location: '',
      duration: '',
      severity: 5,
      character: '',
      aggravatingFactors: '',
      relievingFactors: '',
      associatedSymptoms: '',
      specificAnswers: {}
    }
  }, [symptomDetails, currentSymptomId])

  const updateDetail = (field: keyof SymptomDetail | 'specificAnswers', value: string | number | Record<string, string>) => {
    const newDetails = symptomDetails.filter(d => d.symptomId !== currentSymptomId)
    if (field === 'specificAnswers') {
      newDetails.push({ ...currentDetail, specificAnswers: value as Record<string, string> })
    } else {
      newDetails.push({ ...currentDetail, [field]: value })
    }
    setSymptomDetails(newDetails)
  }

  const updateSpecificAnswer = (questionId: string, value: string) => {
    const newSpecific = { ...currentDetail.specificAnswers, [questionId]: value }
    updateDetail('specificAnswers', newSpecific)
  }

  const handleNext = () => {
    if (currentQuestionSection === 'triage') {
      setCurrentQuestionSection('specific')
    } else {
      if (currentSymptomIndex < selectedSymptoms.length - 1) {
        setCurrentSymptomIndex(currentSymptomIndex + 1)
        setCurrentQuestionSection('triage')
      } else {
        onNext()
      }
    }
  }

  const handleBack = () => {
    if (currentQuestionSection === 'specific') {
      setCurrentQuestionSection('triage')
    } else {
      if (currentSymptomIndex > 0) {
        setCurrentSymptomIndex(currentSymptomIndex - 1)
        setCurrentQuestionSection('specific')
      } else {
        onBack()
      }
    }
  }

  const progress = ((currentSymptomIndex + (currentQuestionSection === 'specific' ? 0.5 : 0)) / selectedSymptoms.length) * 100

  return (
    <div className="min-h-screen px-6 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
            <span className="w-2 h-2 bg-sky-400 rounded-full" />
            <span className="text-sm text-sky-300">Symptom Details</span>
          </div>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-4">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-sky-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-sky-300/60 mt-2">
              Symptom {currentSymptomIndex + 1} of {selectedSymptoms.length}
            </p>
          </div>
        </motion.div>

        {/* Current Symptom Card */}
        <motion.div
          key={currentSymptomId + currentQuestionSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card-blue p-6 rounded-3xl mb-6"
        >
          {/* Symptom Header */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${symptomInfo?.color || 'from-sky-500 to-cyan-500'} p-4 flex items-center justify-center`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{symptomInfo?.nameEn || currentSymptomId}</h2>
              <p className="text-sky-300 arabic-text">{symptomInfo?.nameAr || ''}</p>
            </div>
            <div className="ml-auto text-right">
              <span className="px-3 py-1 rounded-full glass-card text-sm text-sky-300">
                {currentQuestionSection === 'triage' ? 'General Assessment' : 'Specific Questions'}
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentQuestionSection === 'triage' ? (
              /* Triage Questions */
              <motion.div
                key="triage"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {triageQuestions.map((q) => {
                    const QIcon = q.icon
                    return (
                      <div key={q.id} className="glass-card p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <QIcon className="w-4 h-4 text-sky-400" />
                          <span className="text-sm font-medium text-white">{q.labelEn}</span>
                          <span className="text-xs text-sky-300/60 arabic-text">{q.labelAr}</span>
                        </div>
                        <p className="text-xs text-sky-300/80 mb-2">
                          {q.questionEn} / <span className="arabic-text">{q.questionAr}</span>
                        </p>
                        
                        {q.type === 'text' && (
                          <input
                            type="text"
                            value={
                              q.id === 'onset' ? currentDetail.onset :
                              q.id === 'location' ? currentDetail.location :
                              q.id === 'duration' ? currentDetail.duration :
                              q.id === 'aggravating' ? currentDetail.aggravatingFactors :
                              q.id === 'relieving' ? currentDetail.relievingFactors :
                              currentDetail.associatedSymptoms
                            }
                            onChange={(e) => {
                              const field = 
                                q.id === 'onset' ? 'onset' :
                                q.id === 'location' ? 'location' :
                                q.id === 'duration' ? 'duration' :
                                q.id === 'aggravating' ? 'aggravatingFactors' :
                                q.id === 'relieving' ? 'relievingFactors' :
                                'associatedSymptoms'
                              updateDetail(field, e.target.value)
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-sky-300/40 focus:border-sky-400 focus:outline-none transition-colors text-sm"
                            placeholder="Type your answer..."
                          />
                        )}

                        {q.type === 'severity' && (
                          <div className="space-y-2">
                            <input
                              type="range"
                              min="0"
                              max="10"
                              value={currentDetail.severity}
                              onChange={(e) => updateDetail('severity', parseInt(e.target.value))}
                              className="w-full accent-sky-500"
                            />
                            <div className="flex justify-between text-xs">
                              <span className="text-green-400">0 - None</span>
                              <span className={`font-bold text-lg ${
                                currentDetail.severity <= 3 ? 'text-green-400' :
                                currentDetail.severity <= 6 ? 'text-yellow-400' :
                                currentDetail.severity <= 8 ? 'text-orange-400' :
                                'text-red-400'
                              }`}>{currentDetail.severity}</span>
                              <span className="text-red-400">10 - Severe</span>
                            </div>
                          </div>
                        )}

                        {q.type === 'select' && q.options && (
                          <div className="flex flex-wrap gap-2">
                            {q.options.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => updateDetail('character', opt)}
                                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                                  currentDetail.character === opt
                                    ? 'bg-sky-500 text-white'
                                    : 'bg-white/5 text-sky-300 hover:bg-white/10'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            ) : (
              /* Symptom-Specific Questions */
              <motion.div
                key="specific"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {symptomInfo?.specificQuestions.map((q) => (
                    <div key={q.id} className="glass-card p-4 rounded-xl">
                      <p className="text-sm text-white mb-1">{q.en}</p>
                      <p className="text-xs text-sky-300/60 arabic-text mb-3">{q.ar}</p>
                      
                      {q.type === 'text' && (
                        <input
                          type="text"
                          value={currentDetail.specificAnswers[q.id] || ''}
                          onChange={(e) => updateSpecificAnswer(q.id, e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-sky-300/40 focus:border-sky-400 focus:outline-none transition-colors text-sm"
                          placeholder="Type your answer..."
                        />
                      )}

                      {q.type === 'select' && q.options && (
                        <div className="flex flex-wrap gap-2">
                          {q.options.map((opt) => (
                            <button
                              key={opt.en}
                              onClick={() => updateSpecificAnswer(q.id, opt.en)}
                              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                                currentDetail.specificAnswers[q.id] === opt.en
                                  ? 'bg-sky-500 text-white'
                                  : 'bg-white/5 text-sky-300 hover:bg-white/10'
                              }`}
                            >
                              {opt.en} / <span className="arabic-text">{opt.ar}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Symptom Navigation Pills */}
        <div className="flex justify-center gap-2 mb-6">
          {selectedSymptoms.map((sym, idx) => (
            <button
              key={sym}
              onClick={() => {
                setCurrentSymptomIndex(idx)
                setCurrentQuestionSection('triage')
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentSymptomIndex 
                  ? 'bg-sky-400 w-8' 
                  : idx < currentSymptomIndex
                    ? 'bg-sky-500/50'
                    : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-6 py-4 glass-card rounded-xl text-sky-300 hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold bg-gradient-to-r from-sky-500 to-cyan-500 text-white glow-cyan hover:shadow-lg transition-all"
          >
            {currentSymptomIndex === selectedSymptoms.length - 1 && currentQuestionSection === 'specific' 
              ? 'Continue to Emergency Questions' 
              : currentQuestionSection === 'triage' 
                ? 'Next: Specific Questions'
                : 'Next Symptom'
            }
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  )
}
