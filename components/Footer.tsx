'use client'

import Image from 'next/image'

export function Footer() {
  return (
    <footer className="w-full border-t border-blue-100 bg-white/80 backdrop-blur-sm mt-auto">
      <div className="max-w-4xl mx-auto px-6 py-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          
          <div className="flex items-center gap-4">
            <Image
              src="/AA38C765-5862-4B12-B544-71C32697FD80.PNG"
              alt="Al-Mustaqbal University"
              width={70}
              height={70}
              className="rounded-full"
            />
            <div className="text-left">
              <p className="text-slate-800 font-bold text-sm">Al-Mustaqbal University</p>
              <p className="text-blue-600/70 text-xs arabic-text">جامعة المستقبل</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-16 bg-blue-100" />

          <div className="flex items-center gap-4">
            <Image
              src="/الكلية التقنية الهندسية.png"
              alt="College of Technical Engineering"
              width={70}
              height={70}
              className="rounded-full"
            />
            <div className="text-left">
              <p className="text-slate-800 font-bold text-sm">College of Technical Engineering</p>
              <p className="text-blue-600/70 text-xs arabic-text">الكلية التقنية الهندسية</p>
              <p className="text-blue-500/60 text-xs mt-0.5">AI Engineering Techniques Dept.</p>
              <p className="text-blue-400/50 text-xs arabic-text">قسم هندسة تقنيات الذكاء الاصطناعي</p>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-100 pt-4">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div>
              <p className="text-blue-600/80 text-xs font-semibold mb-1 uppercase tracking-wider">
                Supervisors / المشرفون
              </p>
              <p className="text-slate-700 text-sm">د. زهراء هاشم &nbsp;|&nbsp; أ. حمزة وليد</p>
            </div>
            <div className="md:text-right">
              <p className="text-blue-600/80 text-xs font-semibold mb-1 uppercase tracking-wider">
                Students / الطلاب
              </p>
              <p className="text-slate-700 text-sm">
                زينة احمد &nbsp;·&nbsp; عبدالله ضياء &nbsp;·&nbsp; حسين بشار &nbsp;·&nbsp; محمد حسين
              </p>
            </div>
          </div>

          <div className="text-center border-t border-blue-50 pt-3">
            <p className="text-slate-400 text-xs">
              © {new Date().getFullYear()} NURAI Medical Assistant — Al-Mustaqbal University. All rights reserved.
            </p>
            <p className="text-slate-300 text-xs arabic-text mt-0.5">
              جميع الحقوق محفوظة — جامعة المستقبل
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
