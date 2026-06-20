import { NextRequest, NextResponse } from 'next/server'

// تخزين مؤقت للبيانات (يتجدد كل مرة يرسل ESP32)
let latestVitals = {
  temperature: '',
  heartRate: '',
  bloodPressureSystolic: '',
  bloodPressureDiastolic: '',
  oxygenLevel: '',
  timestamp: '',
}

// ESP32 يرسل البيانات هنا (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    latestVitals = {
      temperature: body.temperature?.toString() || '',
      heartRate: body.heartRate?.toString() || '',
      bloodPressureSystolic: body.bloodPressureSystolic?.toString() || '',
      bloodPressureDiastolic: body.bloodPressureDiastolic?.toString() || '',
      oxygenLevel: body.oxygenLevel?.toString() || '',
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Vitals received',
      data: latestVitals
    })

  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid data' },
      { status: 400 }
    )
  }
}

// الموقع يجيب البيانات من هنا (GET)
export async function GET() {
  return NextResponse.json({
    success: true,
    data: latestVitals
  })
}
