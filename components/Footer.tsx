'use client'

import Image from 'next/image'

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-sm mt-auto">
      <div className="max-w-4xl mx-auto px-6 py-6">
        
        {/* Logos + University Info */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          
          {/* University Logo */}
          <div className="flex items-center gap-4">
            <Image
              src="/university-logo.png"
              alt="Al-Mustaqbal University"
              width={70}
              height={70}
              className="rounded-full opacity-90"
            />
            <div className="text-left">
              <p className="text-white font-bold text-sm">Al-Mustaqbal University</p>
              <p className="text-sky-300/70 text-xs arabic-text">جامعة المستقبل</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-16 bg-white/10" />

          {/* College Logo */}
          <div className="flex items-center gap-4">
            <Image
              src="/college-logo.png"
              alt="College of Technical Engineering"
              width={70}
              height={70}
              className="rounded-full opacity-90"
            />
            <div className="text-left">
              <p className="text-white font-bold text-sm">College of Technical Engineering</p>
              <p className="text-sky-300/70 text-xs arabic-text">الكلية التقنية الهندسية</p>
              <p className="text-sky-400/60 text-xs mt-0.5">AI Engineering Techniques Dept.</p>
              <p className="text-sky-300/50 text-xs arabic-text">قسم هندسة تقنيات الذكاء الاصطناعي</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-4">
          
          {/* Supervisors */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div>
              <p className="text-sky-400/80 text-xs font-semibold mb-1 uppercase tracking-wider">
                Supervisors / المشرفون
              </p>
              <p className="text-white/80 text-sm">د. زهراء هاشم &nbsp;|&nbsp; أ. حمزة وليد</p>
            </div>
            
            {/* Students */}
            <div className="md:text-right">
              <p className="text-sky-400/80 text-xs font-semibold mb-1 uppercase tracking-wider">
                Students / الطلاب
              </p>
              <p className="text-white/80 text-sm">
                زينة احمد &nbsp;·&nbsp; عبدالله ضياء &nbsp;·&nbsp; حسين بشار &nbsp;·&nbsp; محمد حسين
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center border-t border-white/5 pt-3">
            <p className="text-white/30 text-xs">
              © {new Date().getFullYear()} NURAI Medical Assistant — Al-Mustaqbal University. All rights reserved.
            </p>
            <p className="text-white/20 text-xs arabic-text mt-0.5">
              جميع الحقوق محفوظة — جامعة المستقبل
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
