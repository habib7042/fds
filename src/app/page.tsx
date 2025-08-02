'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Users, Calculator, DollarSign, Shield, Smartphone, CreditCard, LogOut } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  role: 'ACCOUNTANT' | 'MEMBER'
}

export default function Home() {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    role: ''
  })
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if user is logged in on component mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check error:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setLoginForm({ email: '', password: '', role: '' })
      } else {
        setError(data.error)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('সার্ভার এরর ঘটেছে')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setLoginForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  // If user is logged in, show dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-green-700">FDS</h1>
                </div>
                <nav className="ml-10 flex items-baseline space-x-4">
                  <a href="#" className="text-gray-900 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium">
                    ড্যাশবোর্ড
                  </a>
                  {user.role === 'ACCOUNTANT' && (
                    <>
                      <a href="#" className="text-gray-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium">
                        সদস্য ব্যবস্থাপনা
                      </a>
                      <a href="#" className="text-gray-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium">
                        পেমেন্ট অনুমোদন
                      </a>
                    </>
                  )}
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  স্বাগতম, {user.name}
                  <Badge variant="secondary" className="ml-2">
                    {user.role === 'ACCOUNTANT' ? 'হিসাবরক্ষক' : 'সদস্য'}
                  </Badge>
                </div>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  লগআউট
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {user.role === 'ACCOUNTANT' ? (
              <AccountantDashboard />
            ) : (
              <MemberDashboard userName={user.name} />
            )}
          </div>
        </main>
      </div>
    )
  }

  // Show login form if not logged in
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-green-700">FDS</h1>
              </div>
              <nav className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-900 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium">
                  হোম
                </a>
                <a href="#" className="text-gray-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium">
                  আমাদের সম্পর্কে
                </a>
                <a href="#" className="text-gray-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium">
                  যোগাযোগ
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">FDS ফান্ড ম্যানেজমেন্ট</span>
            <span className="block text-green-600 mt-2">সিস্টেম</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            বন্ধুদের মধ্যে ফান্ড ব্যবস্থাপনার একটি আধুনিক এবং নিরাপদ প্ল্যাটফর্ম। সহজেই মাসিক চাঁদা জমা দিন, আপনার হিসাব দেখুন এবং ফান্ডের সব তথ্য এক জায়গায় পান।
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              আমাদের সেবাসমূহ
            </h3>
            <p className="mt-4 text-xl text-gray-600">
              আমরা যে সুবিধাগুলো অফার করি
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="mt-4">সদস্য ব্যবস্থাপনা</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  সদস্যদের তথ্য যোগ, সম্পাদনা এবং ব্যবস্থাপনা করুন সহজেই।
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="mt-4">চাঁদা ব্যবস্থাপনা</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  মাসিক চাঁদা ট্র্যাক করুন এবং বকেয়া তথ্য দেখুন।
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="mt-4">হিসাব রক্ষণ</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  স্বচ্ছ এবং নির্ভুল হিসাব রক্ষণ ব্যবস্থা।
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="mt-4">নিরাপত্তা</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  আপনার তথ্য এবং টাকা সম্পূর্ণ নিরাপদে রাখা হয়।
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle className="mt-4">মোবাইল পেমেন্ট</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  বিকাশ এবং নগদ দিয়ে সহজে চাঁদা জমা দিন।
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="mt-4">বহুমুখী পেমেন্ট</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  বিকাশ, নগদ এবং ক্যাশ - যেকোনো মাধ্যমে পেমেন্ট করুন।
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">লগইন করুন</CardTitle>
              <CardDescription>
                আপনার একাউন্টে লগইন করে FDS ফান্ড ম্যানেজমেন্ট সিস্টেম ব্যবহার করুন
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4" variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">আপনি কে?</Label>
                  <Select onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="আপনার ভূমিকা নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accountant">হিসাবরক্ষক</SelectItem>
                      <SelectItem value="member">সদস্য</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">ইমেইল</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="আপনার ইমেইল লিখুন"
                    value={loginForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">পাসওয়ার্ড</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                    value={loginForm.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  নতুন সদস্য?{' '}
                  <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                    রেজিস্ট্রেশন করুন
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">FDS ফান্ড ম্যানেজমেন্ট</h3>
              <p className="mt-2 text-gray-600">
                বন্ধুদের মধ্যে ফান্ড ব্যবস্থাপনার একটি আধুনিক প্ল্যাটফর্ম।
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">দ্রুত লিংক</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-green-700">হোম</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-green-700">আমাদের সম্পর্কে</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-green-700">যোগাযোগ</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">যোগাযোগ</h3>
              <p className="mt-2 text-gray-600">
                যেকোনো প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করুন।
              </p>
              <p className="mt-2 text-gray-600">
                ইমেইল: support@fds-fund.com
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              © 2024 FDS ফান্ড ম্যানেজমেন্ট সিস্টেম। সর্বস্বত্ব সংরক্ষিত।
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Accountant Dashboard Component
function AccountantDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">হিসাবরক্ষক ড্যাশবোর্ড</h1>
        <p className="mt-2 text-gray-600">সদস্য ব্যবস্থাপনা এবং পেমেন্ট অনুমোদন করুন</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট সদস্য</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 গত মাসে</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট ফান্ড</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳২৪,০০০</div>
            <p className="text-xs text-muted-foreground">+৳২,০০০ গত মাসে</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">অপেক্ষমান পেমেন্ট</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">অনুমোদনের অপেক্ষায়</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>দ্রুত ক্রিয়া</CardTitle>
            <CardDescription>সাধারণ কাজগুলো দ্রুত করুন</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              নতুন সদস্য যোগ করুন
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calculator className="mr-2 h-4 w-4" />
              পেমেন্ট অনুমোদন করুন
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="mr-2 h-4 w-4" />
              মাসিক রিপোর্ট দেখুন
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>সাম্প্রতিক পেমেন্ট</CardTitle>
            <CardDescription>অনুমোদনের অপেক্ষমান পেমেন্টসমূহ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">সদস্য ১</p>
                  <p className="text-sm text-gray-600">বিকাশ - ৳১,০০০</p>
                </div>
                <Badge variant="secondary">অপেক্ষমান</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">সদস্য ২</p>
                  <p className="text-sm text-gray-600">নগদ - ৳১,০০০</p>
                </div>
                <Badge variant="secondary">অপেক্ষমান</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">সদস্য ৩</p>
                  <p className="text-sm text-gray-600">ক্যাশ - ৳১,০০০</p>
                </div>
                <Badge variant="secondary">অপেক্ষমান</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Member Dashboard Component
function MemberDashboard({ userName }: { userName: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">স্বাগতম, {userName}</h1>
        <p className="mt-2 text-gray-600">আপনার ফান্ড হিসাব এবং পেমেন্ট তথ্য</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">বর্তমান জমা</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳১২,০০০</div>
            <p className="text-xs text-muted-foreground">মোট জমা</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">বকেয়া</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳১,০০০</div>
            <p className="text-xs text-muted-foreground">চলতি মাস</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মাসিক চাঁদা</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳১,০০০</div>
            <p className="text-xs text-muted-foreground">নির্ধারিত হার</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>চাঁদা জমা দিন</CardTitle>
            <CardDescription>আপনার মাসিক চাঁদা জমা দিন</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start">
              <Smartphone className="mr-2 h-4 w-4" />
              বিকাশ দিয়ে জমা দিন
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Smartphone className="mr-2 h-4 w-4" />
              নগদ দিয়ে জমা দিন
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="mr-2 h-4 w-4" />
              ক্যাশ দিয়ে জমা দিন
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>পেমেন্ট ইতিহাস</CardTitle>
            <CardDescription>আপনার সাম্প্রতিক পেমেন্টসমূহ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">ডিসেম্বর ২০২৪</p>
                  <p className="text-sm text-gray-600">বিকাশ - ৳১,০০০</p>
                </div>
                <Badge variant="default">অনুমোদিত</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">নভেম্বর ২০২৪</p>
                  <p className="text-sm text-gray-600">নগদ - ৳১,০০০</p>
                </div>
                <Badge variant="default">অনুমোদিত</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">অক্টোবর ২০২৪</p>
                  <p className="text-sm text-gray-600">ক্যাশ - ৳১,০০০</p>
                </div>
                <Badge variant="default">অনুমোদিত</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}