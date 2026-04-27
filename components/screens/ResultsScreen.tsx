'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  FileText,
  RefreshCw,
  Stethoscope,
  Shield,
  Clock,
  Phone,
  Activity,
  Thermometer,
  Heart,
  Wind,
  ClipboardList,
  Brain,
  Lightbulb,
  TrendingUp,
  ChevronRight
} from 'lucide-react'
import type { 
  PatientInfo, 
  VitalSigns, 
  SymptomDetail, 
  EmergencyAnswers, 
  MedicalHistory 
} from '@/lib/types'

interface ResultsScreenProps {
  patientInfo: PatientInfo
  selectedSymptoms: string[]
  symptomDetails: SymptomDetail[]
  emergencyAnswers: EmergencyAnswers
  medicalHistory: MedicalHistory
  vitalSigns: VitalSigns
  onRestart: () => void
}

interface EnhancedAssessment {
  riskLevel: 'low' | 'moderate' | 'high' | 'critical'
  primaryCondition: {
    en: string
    ar: string
  }
  otherPossibilities: Array<{
    condition: { en: string; ar: string }
    likelihood: 'possible' | 'less likely'
  }>
  reasons: Array<{
    en: string
    ar: string
  }>
  recommendation: {
    en: string
    ar: string
  }
  emergencyWarning: boolean
  confidence: number
  urgencyTimeframe: {
    en: string
    ar: string
  }
}

const symptomNames: Record<string, { en: string; ar: string }> = {
  'fever': { en: 'Fever', ar: 'حمى' },
  'headache': { en: 'Headache', ar: 'صداع' },
  'chest-pain': { en: 'Chest Pain', ar: 'ألم في الصدر' },
  'shortness-of-breath': { en: 'Shortness of Breath', ar: 'ضيق تنفس' },
  'cough': { en: 'Cough', ar: 'سعال' },
  'dizziness': { en: 'Dizziness', ar: 'دوخة' },
  'fatigue': { en: 'Fatigue', ar: 'تعب' },
  'stomach-pain': { en: 'Stomach Pain', ar: 'ألم في البطن' },
}

function generateEnhancedAssessment(
  symptoms: string[], 
  symptomDetails: SymptomDetail[],
  emergencyAnswers: EmergencyAnswers,
  medicalHistory: MedicalHistory,
  vitalSigns: VitalSigns
): EnhancedAssessment {
  // Parse vital signs
  const temp = parseFloat(vitalSigns.temperature) || 0
  const heartRate = parseInt(vitalSigns.heartRate) || 0
  const oxygen = parseInt(vitalSigns.oxygenLevel) || 100
  const systolic = parseInt(vitalSigns.bloodPressureSystolic) || 120
  const diastolic = parseInt(vitalSigns.bloodPressureDiastolic) || 80

  // Count emergency flags
  const emergencyFlags = Object.entries(emergencyAnswers)
    .filter(([key, val]) => key !== 'pregnant' && val === true)
    .length
  
  const isPregnant = emergencyAnswers.pregnant

  // Check symptom severity
  const maxSeverity = symptomDetails.length > 0 
    ? Math.max(...symptomDetails.map(d => d.severity)) 
    : 0
  const avgSeverity = symptomDetails.length > 0
    ? symptomDetails.reduce((sum, d) => sum + d.severity, 0) / symptomDetails.length
    : 0

  // Medical history risk factors
  const riskFactors = [
    medicalHistory.diabetes,
    medicalHistory.highBloodPressure,
    medicalHistory.heartDisease,
    medicalHistory.asthmaOrLungDisease,
    medicalHistory.kidneyDisease,
    medicalHistory.chronicDisease
  ].filter(Boolean).length

  // Vital signs analysis
  const hasFever = temp >= 38
  const hasHighFever = temp >= 39
  const hasTachycardia = heartRate > 100
  const hasBradycardia = heartRate < 60
  const hasLowOxygen = oxygen < 95
  const hasCriticalOxygen = oxygen < 90
  const hasHighBP = systolic > 140 || diastolic > 90
  const hasLowBP = systolic < 90

  // Build reasons array
  const reasons: Array<{ en: string; ar: string }> = []

  // Symptom-based condition detection
  let primaryCondition = { en: '', ar: '' }
  const otherPossibilities: EnhancedAssessment['otherPossibilities'] = []
  let riskLevel: EnhancedAssessment['riskLevel'] = 'low'
  let emergencyWarning = false
  let recommendation = { en: '', ar: '' }
  let urgencyTimeframe = { en: '', ar: '' }

  // CRITICAL CONDITIONS CHECK
  if (emergencyFlags >= 2 || (emergencyAnswers.chestPain && emergencyAnswers.shortnessOfBreath)) {
    riskLevel = 'critical'
    emergencyWarning = true
    
    if (emergencyAnswers.chestPain && (emergencyAnswers.shortnessOfBreath || symptoms.includes('shortness-of-breath'))) {
      primaryCondition = { 
        en: 'Possible Acute Coronary Syndrome (Heart Attack)', 
        ar: 'احتمال متلازمة الشريان التاجي الحادة (نوبة قلبية)' 
      }
      otherPossibilities.push(
        { condition: { en: 'Pulmonary Embolism', ar: 'انسداد رئوي' }, likelihood: 'possible' },
        { condition: { en: 'Aortic Dissection', ar: 'تسلخ الأبهر' }, likelihood: 'less likely' }
      )
      reasons.push(
        { en: 'Chest pain combined with shortness of breath detected', ar: 'تم الكشف عن ألم في الصدر مع ضيق في التنفس' },
        { en: 'Emergency warning signs are present', ar: 'علامات تحذيرية طارئة موجودة' }
      )
    } else if (emergencyAnswers.suddenHeadache && emergencyAnswers.onesideWeakness) {
      primaryCondition = { 
        en: 'Possible Stroke (Cerebrovascular Accident)', 
        ar: 'احتمال سكتة دماغية' 
      }
      otherPossibilities.push(
        { condition: { en: 'Transient Ischemic Attack (TIA)', ar: 'نوبة نقص تروية عابرة' }, likelihood: 'possible' },
        { condition: { en: 'Intracranial Hemorrhage', ar: 'نزيف داخل الجمجمة' }, likelihood: 'possible' }
      )
      reasons.push(
        { en: 'Sudden severe headache with one-sided weakness/numbness', ar: 'صداع شديد مفاجئ مع ضعف/خدر في جانب واحد' },
        { en: 'Classic stroke warning signs detected', ar: 'تم الكشف عن علامات تحذيرية كلاسيكية للسكتة الدماغية' }
      )
    } else if (emergencyAnswers.blueLips || hasCriticalOxygen) {
      primaryCondition = { 
        en: 'Possible Respiratory Failure', 
        ar: 'احتمال فشل تنفسي' 
      }
      otherPossibilities.push(
        { condition: { en: 'Severe Pneumonia', ar: 'التهاب رئوي حاد' }, likelihood: 'possible' },
        { condition: { en: 'Acute Asthma Attack', ar: 'نوبة ربو حادة' }, likelihood: 'possible' }
      )
      reasons.push(
        { en: 'Blue lips or critically low oxygen saturation detected', ar: 'تم الكشف عن ازرقاق الشفاه أو انخفاض حاد في الأكسجين' },
        { en: `Oxygen level: ${oxygen}% (Critical: below 90%)`, ar: `مستوى الأكسجين: ${oxygen}% (حرج: أقل من 90%)` }
      )
    } else {
      primaryCondition = { 
        en: 'Multiple Emergency Warning Signs Detected', 
        ar: 'تم الكشف عن علامات تحذيرية طارئة متعددة' 
      }
    }
    
    recommendation = {
      en: 'SEEK EMERGENCY MEDICAL CARE IMMEDIATELY. Call emergency services or go to the nearest emergency room. Do not drive yourself.',
      ar: 'اطلب الرعاية الطبية الطارئة فوراً. اتصل بخدمات الطوارئ أو توجه إلى أقرب غرفة طوارئ. لا تقد بنفسك.'
    }
    urgencyTimeframe = { en: 'Immediate - Within minutes', ar: 'فوري - خلال دقائق' }
  }
  // HIGH RISK CONDITIONS
  else if (emergencyFlags === 1 || symptoms.includes('chest-pain') || (symptoms.includes('shortness-of-breath') && hasLowOxygen)) {
    riskLevel = 'high'
    emergencyWarning = true

    if (symptoms.includes('chest-pain')) {
      const hasCardiacRisk = medicalHistory.heartDisease || medicalHistory.highBloodPressure || medicalHistory.diabetes
      primaryCondition = { 
        en: hasCardiacRisk ? 'Possible Cardiac Event' : 'Chest Pain Requiring Evaluation', 
        ar: hasCardiacRisk ? 'احتمال حدث قلبي' : 'ألم في الصدر يتطلب تقييم'
      }
      otherPossibilities.push(
        { condition: { en: 'Angina Pectoris', ar: 'الذبحة الصدرية' }, likelihood: 'possible' },
        { condition: { en: 'Musculoskeletal Pain', ar: 'ألم عضلي هيكلي' }, likelihood: 'possible' },
        { condition: { en: 'Gastroesophageal Reflux', ar: 'ارتجاع المريء' }, likelihood: 'less likely' }
      )
      reasons.push(
        { en: 'Chest pain reported as primary symptom', ar: 'تم الإبلاغ عن ألم الصدر كعرض رئيسي' }
      )
      if (hasCardiacRisk) {
        reasons.push({ en: 'Pre-existing cardiac risk factors present', ar: 'عوامل خطر قلبية موجودة مسبقاً' })
      }
      if (hasTachycardia) {
        reasons.push({ en: `Elevated heart rate: ${heartRate} bpm`, ar: `ارتفاع معدل ضربات القلب: ${heartRate} نبضة/دقيقة` })
      }
    } else if (symptoms.includes('shortness-of-breath')) {
      primaryCondition = { 
        en: 'Possible Respiratory Condition', 
        ar: 'احتمال حالة تنفسية'
      }
      otherPossibilities.push(
        { condition: { en: 'Asthma Exacerbation', ar: 'نوبة ربو' }, likelihood: 'possible' },
        { condition: { en: 'Pneumonia', ar: 'التهاب رئوي' }, likelihood: 'possible' },
        { condition: { en: 'Anxiety-related Dyspnea', ar: 'ضيق تنفس مرتبط بالقلق' }, likelihood: 'less likely' }
      )
      reasons.push(
        { en: 'Shortness of breath with low oxygen saturation', ar: 'ضيق التنفس مع انخفاض تشبع الأكسجين' },
        { en: `Oxygen level: ${oxygen}%`, ar: `مستوى الأكسجين: ${oxygen}%` }
      )
    } else {
      primaryCondition = { 
        en: 'Condition Requiring Urgent Medical Evaluation', 
        ar: 'حالة تتطلب تقييم طبي عاجل'
      }
    }

    recommendation = {
      en: 'Visit a healthcare facility within the next 2-4 hours. If symptoms worsen, seek emergency care immediately.',
      ar: 'قم بزيارة منشأة صحية خلال الساعتين إلى الأربع ساعات القادمة. إذا تفاقمت الأعراض، اطلب الرعاية الطارئة فوراً.'
    }
    urgencyTimeframe = { en: 'Urgent - Within 2-4 hours', ar: 'عاجل - خلال 2-4 ساعات' }
  }
  // MODERATE RISK - RESPIRATORY INFECTIONS
  else if ((symptoms.includes('fever') || hasFever) && (symptoms.includes('cough') || symptoms.includes('fatigue'))) {
    riskLevel = 'moderate'
    
    if (hasFever && symptoms.includes('cough')) {
      primaryCondition = { 
        en: 'Possible Upper Respiratory Infection', 
        ar: 'احتمال عدوى الجهاز التنفسي العلوي'
      }
      otherPossibilities.push(
        { condition: { en: 'Viral Flu (Influenza)', ar: 'الإنفلونزا الفيروسية' }, likelihood: 'possible' },
        { condition: { en: 'Bronchitis', ar: 'التهاب الشعب الهوائية' }, likelihood: 'possible' },
        { condition: { en: 'COVID-19 or Similar Viral Infection', ar: 'كوفيد-19 أو عدوى فيروسية مشابهة' }, likelihood: 'possible' }
      )
      reasons.push(
        { en: 'Combination of fever and cough detected', ar: 'تم الكشف عن مزيج من الحمى والسعال' },
        { en: `Temperature: ${temp}°C ${hasHighFever ? '(High fever)' : ''}`, ar: `درجة الحرارة: ${temp}° مئوية ${hasHighFever ? '(حمى عالية)' : ''}` }
      )
      if (symptoms.includes('fatigue')) {
        reasons.push({ en: 'Associated fatigue suggesting systemic infection', ar: 'تعب مصاحب يشير إلى عدوى جهازية' })
      }
    } else {
      primaryCondition = { 
        en: 'Possible Viral Illness', 
        ar: 'احتمال مرض فيروسي'
      }
      otherPossibilities.push(
        { condition: { en: 'Common Cold', ar: 'نزلة برد' }, likelihood: 'possible' },
        { condition: { en: 'Seasonal Flu', ar: 'إنفلونزا موسمية' }, likelihood: 'possible' }
      )
      reasons.push(
        { en: 'Fever with general symptoms detected', ar: 'حمى مع أعراض عامة' }
      )
    }

    if (medicalHistory.asthmaOrLungDisease) {
      reasons.push({ en: 'History of lung disease increases monitoring need', ar: 'تاريخ أمراض الرئة يزيد من الحاجة للمراقبة' })
    }

    recommendation = {
      en: 'Monitor symptoms closely. Rest, stay hydrated, and schedule an appointment with a healthcare provider within 24-48 hours if symptoms persist or worsen.',
      ar: 'راقب الأعراض عن كثب. استرح، حافظ على الترطيب، وحدد موعداً مع مقدم الرعاية الصحية خلال 24-48 ساعة إذا استمرت الأعراض أو تفاقمت.'
    }
    urgencyTimeframe = { en: 'Within 24-48 hours', ar: 'خلال 24-48 ساعة' }
  }
  // MODERATE RISK - GASTROINTESTINAL
  else if (symptoms.includes('stomach-pain')) {
    riskLevel = maxSeverity >= 7 ? 'moderate' : 'low'
    
    primaryCondition = { 
      en: 'Possible Gastrointestinal Condition', 
      ar: 'احتمال حالة في الجهاز الهضمي'
    }
    otherPossibilities.push(
      { condition: { en: 'Gastritis', ar: 'التهاب المعدة' }, likelihood: 'possible' },
      { condition: { en: 'Gastroenteritis', ar: 'التهاب المعدة والأمعاء' }, likelihood: 'possible' },
      { condition: { en: 'Irritable Bowel Syndrome', ar: 'متلازمة القولون العصبي' }, likelihood: 'less likely' }
    )
    
    if (isPregnant) {
      otherPossibilities.unshift({ condition: { en: 'Pregnancy-related condition', ar: 'حالة مرتبطة بالحمل' }, likelihood: 'possible' })
      reasons.push({ en: 'Pregnancy reported - requires specific evaluation', ar: 'تم الإبلاغ عن حمل - يتطلب تقييم خاص' })
      riskLevel = 'moderate'
    }

    reasons.push(
      { en: 'Abdominal pain reported', ar: 'تم الإبلاغ عن ألم في البطن' },
      { en: `Pain severity: ${maxSeverity}/10`, ar: `شدة الألم: ${maxSeverity}/10` }
    )

    recommendation = {
      en: riskLevel === 'moderate' 
        ? 'Schedule an appointment with a healthcare provider within 24 hours. Avoid fatty or spicy foods. Seek emergency care if pain becomes severe or you develop vomiting blood.'
        : 'Monitor symptoms. Rest and follow a light diet. See a doctor if symptoms persist beyond 2-3 days.',
      ar: riskLevel === 'moderate'
        ? 'حدد موعداً مع مقدم الرعاية الصحية خلال 24 ساعة. تجنب الأطعمة الدهنية أو الحارة. اطلب رعاية طارئة إذا أصبح الألم شديداً.'
        : 'راقب الأعراض. استرح واتبع نظاماً غذائياً خفيفاً. راجع الطبيب إذا استمرت الأعراض أكثر من 2-3 أيام.'
    }
    urgencyTimeframe = riskLevel === 'moderate' 
      ? { en: 'Within 24 hours', ar: 'خلال 24 ساعة' }
      : { en: 'Within 2-3 days if persisting', ar: 'خلال 2-3 أيام إذا استمرت' }
  }
  // MODERATE RISK - NEUROLOGICAL
  else if (symptoms.includes('headache') && (symptoms.includes('dizziness') || maxSeverity >= 7)) {
    riskLevel = 'moderate'
    
    primaryCondition = { 
      en: 'Possible Migraine or Tension Headache', 
      ar: 'احتمال صداع نصفي أو صداع توتري'
    }
    otherPossibilities.push(
      { condition: { en: 'Tension-type Headache', ar: 'صداع توتري' }, likelihood: 'possible' },
      { condition: { en: 'Dehydration', ar: 'جفاف' }, likelihood: 'possible' },
      { condition: { en: 'Hypertensive Headache', ar: 'صداع ارتفاع الضغط' }, likelihood: hasHighBP ? 'possible' : 'less likely' }
    )

    reasons.push(
      { en: 'Headache reported with associated symptoms', ar: 'تم الإبلاغ عن صداع مع أعراض مصاحبة' }
    )
    if (symptoms.includes('dizziness')) {
      reasons.push({ en: 'Dizziness accompanying headache', ar: 'دوخة مصاحبة للصداع' })
    }
    if (hasHighBP) {
      reasons.push({ en: `Blood pressure elevated: ${systolic}/${diastolic} mmHg`, ar: `ضغط الدم مرتفع: ${systolic}/${diastolic}` })
    }

    recommendation = {
      en: 'Rest in a quiet, dark room. Stay hydrated and consider over-the-counter pain relief if appropriate. See a doctor if headache is severe, sudden, or accompanied by vision changes.',
      ar: 'استرح في غرفة هادئة ومظلمة. حافظ على الترطيب. راجع الطبيب إذا كان الصداع شديداً أو مفاجئاً أو مصحوباً بتغيرات في الرؤية.'
    }
    urgencyTimeframe = { en: 'Within 24-48 hours if persisting', ar: 'خلال 24-48 ساعة إذا استمر' }
  }
  // LOW RISK - GENERAL FATIGUE/MILD SYMPTOMS
  else if (symptoms.includes('fatigue') || symptoms.includes('dizziness')) {
    riskLevel = 'low'
    
    primaryCondition = { 
      en: 'Possible Fatigue or Mild Dehydration', 
      ar: 'احتمال تعب أو جفاف خفيف'
    }
    otherPossibilities.push(
      { condition: { en: 'Lack of Sleep', ar: 'قلة النوم' }, likelihood: 'possible' },
      { condition: { en: 'Dehydration', ar: 'جفاف' }, likelihood: 'possible' },
      { condition: { en: 'Stress-related Fatigue', ar: 'تعب مرتبط بالإجهاد' }, likelihood: 'possible' }
    )

    reasons.push(
      { en: 'Mild symptoms without concerning vital signs', ar: 'أعراض خفيفة بدون علامات حيوية مقلقة' },
      { en: 'No emergency warning signs detected', ar: 'لم يتم الكشف عن علامات تحذيرية طارئة' }
    )

    recommendation = {
      en: 'Rest, ensure adequate sleep (7-8 hours), stay well hydrated, and eat nutritious meals. Consult a doctor if symptoms persist beyond 3-5 days or worsen.',
      ar: 'استرح، تأكد من النوم الكافي (7-8 ساعات)، حافظ على الترطيب، وتناول وجبات مغذية. استشر طبيباً إذا استمرت الأعراض أكثر من 3-5 أيام أو تفاقمت.'
    }
    urgencyTimeframe = { en: 'Within 3-5 days if persisting', ar: 'خلال 3-5 أيام إذا استمرت' }
  }
  // DEFAULT LOW RISK
  else {
    riskLevel = 'low'
    
    primaryCondition = { 
      en: 'Mild Symptoms - Self-Care Appropriate', 
      ar: 'أعراض خفيفة - الرعاية الذاتية مناسبة'
    }
    otherPossibilities.push(
      { condition: { en: 'Minor Viral Illness', ar: 'مرض فيروسي بسيط' }, likelihood: 'possible' },
      { condition: { en: 'Stress-related Symptoms', ar: 'أعراض مرتبطة بالإجهاد' }, likelihood: 'possible' }
    )

    reasons.push(
      { en: 'Symptoms are mild without red flags', ar: 'الأعراض خفيفة بدون علامات خطر' },
      { en: 'Vital signs are within normal range', ar: 'العلامات الحيوية ضمن المعدل الطبيعي' }
    )

    recommendation = {
      en: 'Rest, stay hydrated, and monitor symptoms. If symptoms persist beyond 3-5 days or worsen, consult a healthcare provider.',
      ar: 'استرح، حافظ على الترطيب، وراقب الأعراض. إذا استمرت الأعراض أكثر من 3-5 أيام أو تفاقمت، استشر مقدم رعاية صحية.'
    }
    urgencyTimeframe = { en: 'Non-urgent - Self-monitor', ar: 'غير عاجل - مراقبة ذاتية' }
  }

  // Add risk factors to reasons if applicable
  if (riskFactors >= 2) {
    reasons.push({ 
      en: `${riskFactors} chronic conditions in medical history increase overall risk`, 
      ar: `${riskFactors} حالات مزمنة في التاريخ الطبي تزيد من الخطر العام` 
    })
  }

  // Calculate confidence based on data completeness and symptom detail
  const dataCompleteness = [
    symptoms.length > 0,
    symptomDetails.length > 0,
    symptomDetails.length === symptoms.length, // All symptoms have details
    vitalSigns.temperature !== '',
    vitalSigns.heartRate !== '',
    vitalSigns.oxygenLevel !== '',
    vitalSigns.bloodPressureSystolic !== '',
    Object.values(emergencyAnswers).some(v => v !== undefined),
    Object.values(medicalHistory).some(v => v !== false && v !== '')
  ].filter(Boolean).length

  const baseConfidence = 55
  const detailBonus = symptomDetails.length * 3
  const dataBonus = dataCompleteness * 4
  const confidence = Math.min(92, baseConfidence + detailBonus + dataBonus)

  return {
    riskLevel,
    primaryCondition,
    otherPossibilities,
    reasons,
    recommendation,
    emergencyWarning,
    confidence,
    urgencyTimeframe
  }
}

export function ResultsScreen({ 
  patientInfo, 
  selectedSymptoms, 
  symptomDetails,
  emergencyAnswers,
  medicalHistory,
  vitalSigns, 
  onRestart 
}: ResultsScreenProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<EnhancedAssessment | null>(null)

  useEffect(() => {
    // Simulate AI processing
    const timer = setTimeout(() => {
      setResult(generateEnhancedAssessment(
        selectedSymptoms, 
        symptomDetails, 
        emergencyAnswers, 
        medicalHistory, 
        vitalSigns
      ))
      setIsLoading(false)
    }, 3500)
    return () => clearTimeout(timer)
  }, [selectedSymptoms, symptomDetails, emergencyAnswers, medicalHistory, vitalSigns])

  const riskConfig = {
    low: { 
      color: 'from-emerald-500 to-green-500', 
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      icon: CheckCircle,
      labelEn: 'Low Risk',
      labelAr: 'خطورة منخفضة',
      glow: 'glow-success'
    },
    moderate: { 
      color: 'from-amber-500 to-yellow-500', 
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      icon: AlertCircle,
      labelEn: 'Moderate Risk',
      labelAr: 'خطورة متوسطة',
      glow: 'glow-warning'
    },
    high: { 
      color: 'from-orange-500 to-red-500', 
      bg: 'bg-orange-500/20',
      border: 'border-orange-500/30',
      text: 'text-orange-400',
      icon: AlertTriangle,
      labelEn: 'High Risk',
      labelAr: 'خطورة عالية',
      glow: 'glow-warning'
    },
    critical: { 
      color: 'from-red-500 to-rose-600', 
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: XCircle,
      labelEn: 'Critical',
      labelAr: 'حرجة',
      glow: 'glow-danger'
    },
  }

  // Count conditions
  const conditionsCount = [
    medicalHistory.diabetes,
    medicalHistory.highBloodPressure,
    medicalHistory.heartDisease,
    medicalHistory.asthmaOrLungDisease,
    medicalHistory.kidneyDisease,
    medicalHistory.chronicDisease
  ].filter(Boolean).length

  const emergencyCount = Object.entries(emergencyAnswers)
    .filter(([key, val]) => key !== 'pregnant' && val === true).length

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full opacity-20 animate-ping" />
            <div className="relative w-full h-full glass-card-blue rounded-full flex items-center justify-center glow-cyan">
              <Brain className="w-16 h-16 text-sky-400 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">AI Assessment in Progress</h2>
          <p className="text-sky-300/80 arabic-text mb-6">جاري التقييم بالذكاء الاصطناعي</p>
          
          {/* Processing Steps */}
          <div className="max-w-sm mx-auto space-y-3 mb-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 glass-card p-3 rounded-lg"
            >
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-white">Analyzing {selectedSymptoms.length} symptoms with OLDCARTS data...</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-3 glass-card p-3 rounded-lg"
            >
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-white">Evaluating vital signs and thresholds...</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
              className="flex items-center gap-3 glass-card p-3 rounded-lg"
            >
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-white">Cross-referencing medical history...</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 }}
              className="flex items-center gap-3 glass-card p-3 rounded-lg"
            >
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-white">Checking emergency warning signs...</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.3 }}
              className="flex items-center gap-3 glass-card p-3 rounded-lg"
            >
              <Activity className="w-5 h-5 text-sky-400 animate-pulse" />
              <span className="text-sm text-white">Generating Initial AI Assessment...</span>
            </motion.div>
          </div>
          
          <div className="w-72 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    )
  }

  if (!result) return null

  const config = riskConfig[result.riskLevel]
  const RiskIcon = config.icon

  return (
    <div className="min-h-screen px-6 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-sky-300">Assessment Complete</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Initial AI Assessment</h1>
          <p className="text-sky-300/80 arabic-text">التقييم الأولي بالذكاء الاصطناعي</p>
        </motion.div>

        {/* Risk Level Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`glass-card rounded-3xl p-8 mb-6 ${config.border} border-2 ${config.glow}`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sky-300/70 text-sm mb-1">Risk Level / مستوى الخطورة</p>
              <h2 className={`text-4xl font-bold ${config.text}`}>{config.labelEn}</h2>
              <p className={`text-xl arabic-text ${config.text}`}>{config.labelAr}</p>
            </div>
            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${config.color} p-5 ${result.emergencyWarning ? 'animate-pulse' : ''}`}>
              <RiskIcon className="w-full h-full text-white" />
            </div>
          </div>
          
          {/* Confidence Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-sky-300/70">AI Confidence Level / مستوى ثقة الذكاء الاصطناعي</span>
              <span className="text-white font-bold text-lg">{result.confidence}%</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.confidence}%` }}
                transition={{ delay: 0.5, duration: 1 }}
                className={`h-full bg-gradient-to-r ${config.color} rounded-full`}
              />
            </div>
          </div>

          {/* Urgency Timeframe */}
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
            <Clock className="w-5 h-5 text-sky-400" />
            <div>
              <span className="text-white font-medium">{result.urgencyTimeframe.en}</span>
              <span className="text-sky-300/60 text-sm ml-2 arabic-text">{result.urgencyTimeframe.ar}</span>
            </div>
          </div>
        </motion.div>

        {/* Emergency Warning */}
        {result.emergencyWarning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/40 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-red-500/30 flex items-center justify-center flex-shrink-0 animate-pulse">
                <Phone className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-400 mb-2">Emergency Warning / تنبيه طارئ</h3>
                <p className="text-red-200">
                  Based on the symptoms and warning signs provided, immediate medical attention may be required.
                </p>
                <p className="text-red-200/80 mt-2 arabic-text">
                  بناءً على الأعراض وعلامات التحذير المقدمة، قد تكون هناك حاجة إلى عناية طبية فورية.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-red-500/30 rounded-lg text-sm text-red-300">
                    {emergencyCount} Emergency Sign(s) Detected
                  </span>
                  {result.riskLevel === 'critical' && (
                    <span className="px-3 py-1 bg-red-600/40 rounded-lg text-sm text-white font-semibold animate-pulse">
                      CALL EMERGENCY SERVICES
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Primary Condition Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6 mb-6 border border-purple-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xl">Possible Condition</h3>
              <p className="text-sm text-purple-300/70 arabic-text">الحالة المحتملة</p>
            </div>
          </div>
          <div className="bg-purple-500/10 rounded-xl p-4 mb-4">
            <p className="text-lg text-white font-semibold">{result.primaryCondition.en}</p>
            <p className="text-purple-200/70 mt-2 arabic-text">{result.primaryCondition.ar}</p>
          </div>
          
          {/* Other Possibilities */}
          {result.otherPossibilities.length > 0 && (
            <div>
              <p className="text-sm text-sky-300/70 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Other Possible Conditions / حالات محتملة أخرى
              </p>
              <div className="space-y-2">
                {result.otherPossibilities.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-sky-400" />
                      <span className="text-white">{item.condition.en}</span>
                      <span className="text-sky-300/50 text-sm arabic-text">({item.condition.ar})</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.likelihood === 'possible' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {item.likelihood === 'possible' ? 'Possible' : 'Less Likely'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Reasons Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6 mb-6 border border-cyan-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xl">Reasoning</h3>
              <p className="text-sm text-cyan-300/70 arabic-text">الأسباب</p>
            </div>
          </div>
          <div className="space-y-3">
            {result.reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-cyan-400 font-bold">{idx + 1}</span>
                </div>
                <div>
                  <p className="text-white">{reason.en}</p>
                  <p className="text-cyan-200/60 text-sm mt-1 arabic-text">{reason.ar}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommendation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl p-6 mb-6 border border-sky-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xl">Recommendation</h3>
              <p className="text-sm text-sky-300/70 arabic-text">التوصية</p>
            </div>
          </div>
          <div className={`rounded-xl p-5 ${
            result.riskLevel === 'critical' ? 'bg-red-500/10 border border-red-500/30' :
            result.riskLevel === 'high' ? 'bg-orange-500/10 border border-orange-500/30' :
            'bg-sky-500/10'
          }`}>
            <p className="text-white leading-relaxed text-lg">{result.recommendation.en}</p>
            <p className="text-sky-200/70 mt-3 arabic-text leading-relaxed">{result.recommendation.ar}</p>
          </div>
        </motion.div>

        {/* Assessment Data Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Assessment Data Summary</h3>
              <p className="text-sm text-sky-300/70 arabic-text">ملخص بيانات التقييم</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-sky-300/60 mb-1">Patient / المريض</p>
              <p className="text-white font-medium truncate">{patientInfo.fullName}</p>
              <p className="text-sm text-sky-300/60">{patientInfo.age} yrs / {patientInfo.gender === 'male' ? 'Male' : 'Female'}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-sky-300/60 mb-1">Symptoms / الأعراض</p>
              <p className="text-white font-bold text-2xl">{selectedSymptoms.length}</p>
              <p className="text-sm text-sky-300/60">with detailed data</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-sky-300/60 mb-1">Medical Conditions</p>
              <p className={`font-bold text-2xl ${conditionsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>{conditionsCount}</p>
              <p className="text-sm text-sky-300/60">in history</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-sky-300/60 mb-1">Emergency Signs</p>
              <p className={`font-bold text-2xl ${emergencyCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{emergencyCount}</p>
              <p className="text-sm text-sky-300/60">detected</p>
            </div>
          </div>

          {/* Vital Signs Summary */}
          <div className="border-t border-white/10 pt-4 mt-4">
            <p className="text-sm text-sky-300/70 mb-3">Vital Signs / العلامات الحيوية</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                <Thermometer className="w-4 h-4 text-red-400" />
                <div>
                  <p className="text-xs text-sky-300/60">Temperature</p>
                  <p className="text-white font-medium">{vitalSigns.temperature || '--'}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                <Heart className="w-4 h-4 text-rose-400" />
                <div>
                  <p className="text-xs text-sky-300/60">Heart Rate</p>
                  <p className="text-white font-medium">{vitalSigns.heartRate || '--'} bpm</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                <Activity className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="text-xs text-sky-300/60">Blood Pressure</p>
                  <p className="text-white font-medium">{vitalSigns.bloodPressureSystolic || '--'}/{vitalSigns.bloodPressureDiastolic || '--'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                <Wind className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-xs text-sky-300/60">Oxygen Level</p>
                  <p className="text-white font-medium">{vitalSigns.oxygenLevel || '--'}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Symptoms List */}
          <div className="border-t border-white/10 pt-4 mt-4">
            <p className="text-sm text-sky-300/70 mb-3">Reported Symptoms / الأعراض المبلغ عنها</p>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map(s => {
                const detail = symptomDetails.find(d => d.symptomId === s)
                return (
                  <span key={s} className="px-3 py-1 bg-sky-500/20 rounded-full text-sm text-sky-300 flex items-center gap-2">
                    {symptomNames[s]?.en || s}
                    {detail && (
                      <span className="text-xs bg-sky-500/30 px-1.5 py-0.5 rounded text-sky-200">
                        {detail.severity}/10
                      </span>
                    )}
                  </span>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card rounded-xl p-5 mb-8 border border-amber-500/30"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-200 leading-relaxed font-medium">
                Important Disclaimer: This is an Initial AI Assessment only. This system does not replace doctors. 
                It provides initial medical guidance based on the information provided. Always consult a qualified healthcare professional for medical advice, diagnosis, and treatment.
              </p>
              <p className="text-amber-200/70 leading-relaxed mt-3 arabic-text">
                تنبيه هام: هذا تقييم أولي بالذكاء الاصطناعي فقط. هذا النظام لا يستبدل الطبيب. يقدم إرشادات طبية أولية بناءً على المعلومات المقدمة. استشر دائماً متخصصاً مؤهلاً في الرعاية الصحية للحصول على المشورة الطبية والتشخيص والعلاج.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl font-semibold text-white glow-cyan hover:shadow-lg transition-all"
          >
            <FileText className="w-5 h-5" />
            <span>Generate Report</span>
            <span className="text-sm font-normal opacity-80 arabic-text">إنشاء تقرير</span>
          </button>
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 px-6 py-4 glass-card rounded-xl text-sky-300 hover:bg-white/10 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            New Assessment
          </button>
        </motion.div>

        {/* Timestamp */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6"
        >
          <p className="text-xs text-sky-300/40">
            <Clock className="w-3 h-3 inline mr-1" />
            Initial AI Assessment generated on {new Date().toLocaleString('en-US', { 
              dateStyle: 'full', 
              timeStyle: 'short' 
            })}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
